import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, STORAGE_BUCKET, MAX_FILE_SIZE_BYTES } from "@/lib/supabase";
import { candidatureSchema } from "@/lib/validation";
import { isCandidatureOuverte, genererNumeroDossier, CLOTURE_DATE } from "@/lib/dates";
import { envoyerAccuseReception } from "@/lib/resend";
import { createRateLimiter } from "@/lib/rate-limit";
import { z } from "zod";

const PDF_MAGIC = new Uint8Array([0x25, 0x50, 0x44, 0x46]); // %PDF

// [H-2] 5 soumissions par IP par heure — limite le spam Storage + Resend + DB
const submissionLimiter = createRateLimiter({ max: 5, windowMs: 60 * 60 * 1000 });

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    return await _handlePost(req);
  } catch (err) {
    console.error("[candidatures] unhandled error", err);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Erreur serveur interne — veuillez réessayer." },
      { status: 500 }
    );
  }
}

async function _handlePost(req: NextRequest): Promise<NextResponse> {
  // ============================================================
  // RÈGLE MÉTIER CRITIQUE (Art. 5) : vérification côté serveur
  // La date de clôture est vérifiée ici — jamais seulement côté client
  // ============================================================
  // [H-2] Rate limiting avant tout traitement coûteux
  const ip = getIp(req);
  const rl = submissionLimiter.check(ip);
  if (rl.blocked) {
    return NextResponse.json(
      { error: "TOO_MANY_REQUESTS", message: "Trop de soumissions depuis votre adresse. Réessayez dans 1 heure." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  if (!isCandidatureOuverte()) {
    return NextResponse.json(
      {
        error: "CANDIDATURES_CLOSES",
        message: `Les candidatures sont closes depuis le ${CLOTURE_DATE.toLocaleDateString("fr-TN", {
          day: "numeric", month: "long", year: "numeric",
        })} à 23:59 (Art. 5 du règlement — sans prolongation).`,
      },
      { status: 410 }
    );
  }

  // Parse le body multipart (formulaire + fichier PDF)
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "INVALID_FORM", message: "Corps de la requête invalide" }, { status: 400 });
  }

  // Extraction et validation du pitch deck
  const pitchDeckFile = formData.get("pitch_deck") as File | null;
  if (!pitchDeckFile || pitchDeckFile.size === 0) {
    return NextResponse.json({ error: "PITCH_DECK_REQUIRED", message: "Le pitch deck PDF est obligatoire" }, { status: 422 });
  }
  if (pitchDeckFile.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ error: "FILE_TOO_LARGE", message: "Le pitch deck ne doit pas dépasser 10 Mo" }, { status: 422 });
  }

  // Vérification du type MIME déclaré + signature magique du fichier (anti-spoofing)
  if (pitchDeckFile.type !== "application/pdf") {
    return NextResponse.json({ error: "INVALID_FILE_TYPE", message: "Le pitch deck doit être un fichier PDF" }, { status: 422 });
  }
  const headerBytes = new Uint8Array(await pitchDeckFile.slice(0, 4).arrayBuffer());
  const isPdf = PDF_MAGIC.every((b, i) => headerBytes[i] === b);
  if (!isPdf) {
    return NextResponse.json({ error: "INVALID_FILE_TYPE", message: "Le fichier transmis n'est pas un PDF valide" }, { status: 422 });
  }

  // Extraction et validation des données JSON du formulaire
  const jsonStr = formData.get("data") as string | null;
  if (!jsonStr) {
    return NextResponse.json({ error: "MISSING_DATA", message: "Données du formulaire manquantes" }, { status: 400 });
  }

  let parsed: z.infer<typeof candidatureSchema>;
  try {
    const rawData = JSON.parse(jsonStr);
    parsed = candidatureSchema.parse(rawData);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({
        error: "VALIDATION_ERROR",
        message: "Données invalides",
        details: err.flatten().fieldErrors,
      }, { status: 422 });
    }
    return NextResponse.json({ error: "PARSE_ERROR", message: "Format de données invalide" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const fileBuffer = await pitchDeckFile.arrayBuffer();

  // Upload du pitch deck vers Supabase Storage
  // On génère le numéro de dossier ici pour nommer le fichier
  let numeroDossier = genererNumeroDossier();
  const storagePath = `${numeroDossier}/${Date.now()}_pitch_deck.pdf`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (uploadError) {
    console.error("[upload]", uploadError);
    return NextResponse.json({
      error: "UPLOAD_FAILED",
      message: "L'upload du pitch deck a échoué — veuillez réessayer",
    }, { status: 500 });
  }

  // [H-4] On stocke le chemin de stockage, pas une URL signée longue durée.
  // Les URLs signées courte durée sont générées à la demande dans les routes admin/jury.
  const pitchDeckPath = storagePath;

  // Insertion en base — retry jusqu'à 3 fois sur collision de numéro de dossier (code 23505)
  let candidature: { id: string; numero_dossier: string } | null = null;
  let dbError: { code?: string; message: string } | null = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    const result = await supabase
      .from("candidatures")
      .insert({
        numero_dossier:              numeroDossier,
        nom_startup:                 parsed.nom_startup,
        statut_juridique:            parsed.statut_juridique,
        date_constitution:           parsed.date_constitution,
        thematiques:                 parsed.thematiques,
        composante_ia:               parsed.composante_ia,
        description_ia:              parsed.description_ia ?? null,
        equipe:                      parsed.equipe,
        traction:                    parsed.traction,
        email_contact:               parsed.email_contact,
        acceptation_reglement:       parsed.acceptation_reglement,
        autorisation_communication:  parsed.autorisation_communication,
        pitch_deck_url:              pitchDeckPath,
        statut:                      "soumise",
        date_soumission:             new Date().toISOString(),
      })
      .select("id, numero_dossier")
      .single();

    if (!result.error) {
      candidature = result.data;
      break;
    }

    // 23505 = unique_violation sur numero_dossier → on régénère et on réessaie
    if (result.error.code === "23505") {
      numeroDossier = genererNumeroDossier();
      continue;
    }

    dbError = result.error;
    break;
  }

  if (!candidature) {
    console.error("[db insert]", dbError);
    // Nettoyer le fichier déjà uploadé pour éviter les orphelins
    await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
    return NextResponse.json({
      error: "DB_ERROR",
      message: "Erreur lors de l'enregistrement de la candidature — veuillez réessayer",
    }, { status: 500 });
  }

  submissionLimiter.increment(ip);

  // Envoi de l'accusé de réception (non bloquant)
  try {
    await envoyerAccuseReception({
      to:            parsed.email_contact,
      nomStartup:    parsed.nom_startup,
      numeroDossier: numeroDossier,
    });
  } catch (emailErr) {
    // L'e-mail est best-effort — on ne fail pas la candidature pour autant
    console.error("[email]", emailErr);
  }

  return NextResponse.json({
    success:        true,
    numero_dossier: numeroDossier,
    id:             candidature.id,
    message:        "Candidature soumise avec succès. Un accusé de réception a été envoyé à votre adresse e-mail.",
  }, { status: 201 });
}
