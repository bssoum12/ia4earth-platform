import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, createServiceClient } from "@/lib/admin-auth";
import { getSignedPitchDeckUrl } from "@/lib/supabase";
import { z } from "zod";

const updateSchema = z.object({
  id:     z.string().uuid(),
  statut: z.enum(["soumise", "en_evaluation", "preselectionnee", "finaliste", "laureat", "non_retenue"]),
});

export async function GET(req: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const supabase = createServiceClient();
  const url = new URL(req.url);
  const statut = url.searchParams.get("statut");
  const etape  = url.searchParams.get("etape");

  let query = supabase
    .from("candidatures")
    .select(
      "id, numero_dossier, nom_startup, thematiques, statut, email_contact, composante_ia, created_at, pitch_deck_url"
    )
    .order("created_at", { ascending: false });

  if (statut) query = query.eq("statut", statut);
  if (etape === "preselection") query = query.in("statut", ["preselectionnee", "en_evaluation", "soumise"]);
  if (etape === "finale") query = query.in("statut", ["finaliste", "laureat"]);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "DB_ERROR" }, { status: 500 });

  // [H-4] Générer des URLs signées courte durée (1h) à la demande
  const candidatures = await Promise.all(
    (data ?? []).map(async (c) => ({
      ...c,
      pitch_deck_url: await getSignedPitchDeckUrl(supabase, c.pitch_deck_url, 3600),
    }))
  );

  return NextResponse.json({ candidatures });
}

export async function PATCH(req: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() }, { status: 422 });

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("candidatures")
    .update({ statut: parsed.data.statut })
    .eq("id", parsed.data.id);

  if (error) return NextResponse.json({ error: "DB_ERROR" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
