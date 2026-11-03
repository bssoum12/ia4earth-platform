/**
 * Calcul des scores moyens par candidature (Art. 8 — moyenne arithmétique).
 *
 * Mêmes règles que la vue SQL `v_scores_moyens` :
 *  - les sessions de calibration sont exclues ;
 *  - les jurés ayant déclaré un conflit d'intérêt sont exclus de la moyenne ;
 *  - seules les évaluations finalisées (`terminee`) comptent ;
 *  - le total d'un juré = somme des 5 critères − pénalité de temps (finale).
 *
 * Ce module est volontairement sans dépendance : il se teste seul.
 */

export const ETAPES = ["preselection", "finale"] as const;
export type Etape = (typeof ETAPES)[number];

export const CRITERES_SCORE = [
  "impact",
  "viabilite",
  "innovation",
  "equipe",
  "scalabilite",
] as const;
export type CritereScore = (typeof CRITERES_SCORE)[number];

/** Ligne de la table `evaluations` (+ nom du juré) nécessaire au calcul. */
export interface EvaluationRow {
  candidature_id: string;
  jury_id: string;
  jury_nom: string | null;
  statut: string;
  conflit_interet: boolean;
  est_calibration: boolean;
  score_impact: number | null;
  score_viabilite: number | null;
  score_innovation: number | null;
  score_equipe: number | null;
  score_scalabilite: number | null;
  penalite_temps: number | null;
}

export interface EvaluationDetail {
  jury_nom: string;
  statut: string;
  conflit_interet: boolean;
  /** Total du juré (0–100, pénalité déduite) ; null si incomplet ou conflit. */
  total: number | null;
  scores: Record<CritereScore, number | null>;
  penalite_temps: number;
}

export interface CandidatureScore {
  /** Jurés attendus : assignés hors calibration et hors conflit d'intérêt. */
  jures_attendus: number;
  /** Jurés dont l'évaluation finalisée entre dans la moyenne. */
  jures_ayant_note: number;
  /** Jurés ayant déclaré un conflit d'intérêt (exclus de la moyenne). */
  conflits: number;
  /** Moyenne du total sur 100 ; null tant qu'aucune évaluation n'est finalisée. */
  moyenne_total: number | null;
  moyennes: Record<CritereScore, number | null>;
  evaluations: EvaluationDetail[];
}

const round2 = (n: number): number => Math.round(n * 100) / 100;

function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  return round2(values.reduce((s, v) => s + v, 0) / values.length);
}

function scoresOf(row: EvaluationRow): Record<CritereScore, number | null> {
  return {
    impact: row.score_impact,
    viabilite: row.score_viabilite,
    innovation: row.score_innovation,
    equipe: row.score_equipe,
    scalabilite: row.score_scalabilite,
  };
}

function totalOf(row: EvaluationRow): number | null {
  const scores = Object.values(scoresOf(row));
  if (scores.some((s) => s == null)) return null;
  const somme = (scores as number[]).reduce((s, v) => s + v, 0);
  return Math.max(0, somme - (row.penalite_temps ?? 0));
}

/** Regroupe les évaluations par candidature et calcule les moyennes. */
export function calculerScores(rows: EvaluationRow[]): Record<string, CandidatureScore> {
  const parCandidature = new Map<string, EvaluationRow[]>();
  for (const row of rows) {
    if (row.est_calibration) continue; // non comptabilisée (Art. 7.2)
    const liste = parCandidature.get(row.candidature_id);
    if (liste) liste.push(row);
    else parCandidature.set(row.candidature_id, [row]);
  }

  const result: Record<string, CandidatureScore> = {};

  for (const [candidatureId, evals] of parCandidature) {
    const conflits = evals.filter((e) => e.conflit_interet).length;
    const comptabilisees = evals.filter(
      (e) => e.statut === "terminee" && !e.conflit_interet && totalOf(e) != null,
    );

    const moyennes = {} as Record<CritereScore, number | null>;
    for (const critere of CRITERES_SCORE) {
      moyennes[critere] = mean(
        comptabilisees.map((e) => scoresOf(e)[critere] as number),
      );
    }

    const details: EvaluationDetail[] = evals
      .map((e) => ({
        jury_nom: e.jury_nom ?? "Juré inconnu",
        statut: e.statut,
        conflit_interet: e.conflit_interet,
        total: e.conflit_interet ? null : totalOf(e),
        scores: scoresOf(e),
        penalite_temps: e.penalite_temps ?? 0,
      }))
      .sort((a, b) => a.jury_nom.localeCompare(b.jury_nom, "fr"));

    result[candidatureId] = {
      jures_attendus: evals.length - conflits,
      jures_ayant_note: comptabilisees.length,
      conflits,
      moyenne_total: mean(comptabilisees.map((e) => totalOf(e) as number)),
      moyennes,
      evaluations: details,
    };
  }

  return result;
}
