import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, getSignedPitchDeckUrl } from "@/lib/supabase";
import { getJuryByToken, CRITERES } from "@/lib/jury";
import { z } from "zod";

interface Params { params: Promise<{ token: string; candidatureId: string }> }

const scoringSchema = z.object({
  conflit_interet:    z.boolean(),
  score_impact:       z.number().int().min(0).max(25).optional(),
  score_viabilite:    z.number().int().min(0).max(25).optional(),
  score_innovation:   z.number().int().min(0).max(20).optional(),
  score_equipe:       z.number().int().min(0).max(15).optional(),
  score_scalabilite:  z.number().int().min(0).max(15).optional(),
  penalite_temps:   z.number().int().min(0).max(100).optional(), // [H-7] borne supérieure
  commentaires:     z.string().max(2000).optional(),
  points_forts:     z.string().max(1000).optional(),
  points_vigilance: z.string().max(1000).optional(),
  statut:           z.enum(["en_cours", "terminee"]).default("en_cours"),
  // [H-5] est_calibration retiré — ne doit pas être contrôlé par le client
  // [M-8] etape conservé pour identifier quelle évaluation mettre à jour (un juré peut
  // avoir preselection ET finale pour la même candidature), mais la valeur écrite en DB
  // provient de l'enregistrement existant — jamais du corps client.
  etape:            z.enum(["preselection", "finale"]).default("preselection"),
});

export async function POST(req: NextRequest, { params }: Params) {
  const { token, candidatureId } = await params;

  const jury = await getJuryByToken(token);
  if (!jury) {
    return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 401 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const parsed = scoringSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() }, { status: 422 });
  }

  const data = parsed.data;
  const supabase = createServiceClient();

  // Vérifier que la candidature existe et est assignée à ce juré
  // [M-8] On sélectionne aussi `etape` depuis la DB pour ne pas l'écrire depuis le client
  const { data: evaluation } = await supabase
    .from("evaluations")
    .select("id, statut, etape")
    .eq("candidature_id", candidatureId)
    .eq("jury_id", jury.id)
    .eq("etape", data.etape)
    .single();

  if (!evaluation) {
    return NextResponse.json({ error: "NOT_ASSIGNED", message: "Cette candidature ne vous est pas assignée." }, { status: 403 });
  }

  // Une évaluation terminée ne peut plus être modifiée
  if (evaluation.statut === "terminee" && data.statut !== "terminee") {
    return NextResponse.json({ error: "ALREADY_FINALIZED", message: "Cette évaluation est déjà finalisée." }, { status: 409 });
  }

  // Si conflit d'intérêt déclaré : on enregistre et on retire automatiquement
  // [M-8] Utiliser l'etape de la DB — jamais celle du client
  const dbEtape = evaluation.etape as "preselection" | "finale";

  const updatePayload: Record<string, unknown> = {
    conflit_interet: data.conflit_interet,
    statut: data.conflit_interet ? "terminee" : data.statut,
    etape: dbEtape,
    // est_calibration conservé depuis la DB — jamais écrasé par le client [H-5]
  };

  if (!data.conflit_interet) {
    // Valider que tous les critères sont remplis si statut = terminee
    if (data.statut === "terminee") {
      const allFilled = CRITERES.every((c) => data[c.key as keyof typeof data] != null);
      if (!allFilled) {
        return NextResponse.json({
          error: "INCOMPLETE_SCORES",
          message: "Tous les critères doivent être notés pour finaliser l'évaluation.",
        }, { status: 422 });
      }
    }
    Object.assign(updatePayload, {
      score_impact:      data.score_impact      ?? null,
      score_viabilite:   data.score_viabilite   ?? null,
      score_innovation:  data.score_innovation  ?? null,
      score_equipe:      data.score_equipe      ?? null,
      score_scalabilite: data.score_scalabilite ?? null,
      // [M-7] penalite_temps réservée à la finale (Art. 6.2) — forcée à 0 en présélection
      penalite_temps:    dbEtape === "finale" ? (data.penalite_temps ?? 0) : 0,
      commentaires:      data.commentaires      ?? null,
      points_forts:      data.points_forts      ?? null,
      points_vigilance:  data.points_vigilance  ?? null,
    });
  }

  const { error: updateError } = await supabase
    .from("evaluations")
    .update(updatePayload)
    .eq("id", evaluation.id);

  if (updateError) {
    console.error("[scoring update]", updateError);
    return NextResponse.json({ error: "DB_ERROR" }, { status: 500 });
  }

  return NextResponse.json({ success: true, conflit_enregistre: data.conflit_interet });
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { token, candidatureId } = await params;

  const jury = await getJuryByToken(token);
  if (!jury) {
    return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 401 });
  }

  const supabase = createServiceClient();

  const { data: candidature, error } = await supabase
    .from("candidatures")
    .select("id, numero_dossier, nom_startup, thematiques, statut, traction, equipe, pitch_deck_url")
    .eq("id", candidatureId)
    .single();

  if (error || !candidature) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const { data: evaluation } = await supabase
    .from("evaluations")
    .select("*")
    .eq("candidature_id", candidatureId)
    .eq("jury_id", jury.id)
    .single();

  if (!evaluation) {
    return NextResponse.json({ error: "NOT_ASSIGNED" }, { status: 403 });
  }

  // [H-4] URL signée 2h — jamais l'URL longue durée stockée en DB
  const pitch_deck_url = await getSignedPitchDeckUrl(supabase, candidature.pitch_deck_url, 7200);

  return NextResponse.json({ candidature: { ...candidature, pitch_deck_url }, evaluation });
}
