import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, createServiceClient } from "@/lib/admin-auth";
import { calculerScores, ETAPES, type EvaluationRow } from "@/lib/scores";
import { z } from "zod";

const querySchema = z.object({
  etape: z.enum(ETAPES).default("preselection"),
});

// Supabase plafonne chaque requête (1000 lignes par défaut) : on pagine pour
// ne jamais calculer une moyenne sur des données tronquées.
const PAGE_SIZE = 1000;

const SELECT =
  "candidature_id, jury_id, statut, conflit_interet, est_calibration, " +
  "score_impact, score_viabilite, score_innovation, score_equipe, score_scalabilite, " +
  "penalite_temps, jury(nom)";

type RawRow = Omit<EvaluationRow, "jury_nom"> & {
  jury: { nom: string } | { nom: string }[] | null;
};

/** Moyennes des évaluations finalisées, par candidature, pour une étape. */
export async function GET(req: NextRequest) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const parsed = querySchema.safeParse({
    etape: new URL(req.url).searchParams.get("etape") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() }, { status: 422 });
  }
  const { etape } = parsed.data;

  const supabase = createServiceClient();
  const rows: EvaluationRow[] = [];

  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("evaluations")
      .select(SELECT)
      .eq("etape", etape)
      .order("id")
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      console.error("[admin/scores]", error);
      return NextResponse.json({ error: "DB_ERROR" }, { status: 500 });
    }

    const page = (data ?? []) as unknown as RawRow[];
    for (const { jury, ...rest } of page) {
      const nom = Array.isArray(jury) ? jury[0]?.nom : jury?.nom;
      rows.push({ ...rest, jury_nom: nom ?? null });
    }

    if (page.length < PAGE_SIZE) break;
  }

  return NextResponse.json({ etape, scores: calculerScores(rows) });
}
