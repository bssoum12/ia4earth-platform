import { NextResponse } from "next/server";
import { verifyAdminSession, createServiceClient } from "@/lib/admin-auth";

export async function GET() {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const supabase = createServiceClient();

  const [candidaturesRes, juryRes, evalRes] = await Promise.all([
    supabase.from("candidatures").select("statut, thematiques, created_at"),
    supabase.from("jury").select("id, nom, actif"),
    supabase.from("evaluations").select("jury_id, statut, est_calibration, etape"),
  ]);

  const candidatures = candidaturesRes.data ?? [];
  const jurys        = juryRes.data ?? [];
  const evaluations  = evalRes.data ?? [];

  const totalCandidatures = candidatures.length;
  const parStatut = candidatures.reduce<Record<string, number>>((acc, c) => {
    acc[c.statut] = (acc[c.statut] ?? 0) + 1;
    return acc;
  }, {});

  const parThematique = candidatures.reduce<Record<string, number>>((acc, c) => {
    for (const t of (c.thematiques ?? [])) {
      acc[t] = (acc[t] ?? 0) + 1;
    }
    return acc;
  }, {});

  const juryActifs = jurys.filter((j) => j.actif).length;
  const evalsReelles = evaluations.filter((e) => !e.est_calibration && e.etape === "preselection");
  const evalsTerminees = evalsReelles.filter((e) => e.statut === "terminee").length;
  const progressionPercent = evalsReelles.length > 0
    ? Math.round((evalsTerminees / evalsReelles.length) * 100)
    : 0;

  // Progression par juré
  const juryProgress: Record<string, { total: number; terminee: number }> = {};
  for (const e of evalsReelles) {
    if (!juryProgress[e.jury_id]) juryProgress[e.jury_id] = { total: 0, terminee: 0 };
    juryProgress[e.jury_id].total += 1;
    if (e.statut === "terminee") juryProgress[e.jury_id].terminee += 1;
  }

  const juryProgressList = jurys
    .filter((j) => j.actif)
    .map((j) => ({
      id:    j.id,
      nom:   j.nom,
      total:    juryProgress[j.id]?.total    ?? 0,
      terminee: juryProgress[j.id]?.terminee ?? 0,
    }));

  return NextResponse.json({
    totalCandidatures,
    parStatut,
    parThematique,
    juryActifs,
    progressionPercent,
    evalsTerminees,
    evalsTotales: evalsReelles.length,
    juryProgressList,
  });
}
