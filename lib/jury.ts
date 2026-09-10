import { createServiceClient } from "@/lib/supabase";

export interface JuryMembre {
  id: string;
  nom: string;
  email: string;
  etapes: string[];
  lien_acces_unique: string;
  actif: boolean;
}

export interface CandidatureJury {
  id: string;
  numero_dossier: string;
  nom_startup: string;
  thematiques: string[];
  statut: string;
  evaluation?: {
    id: string;
    statut: string;
    conflit_interet: boolean;
    score_impact: number | null;
    score_viabilite: number | null;
    score_innovation: number | null;
    score_equipe: number | null;
    score_scalabilite: number | null;
    commentaires: string | null;
    points_forts: string | null;
    points_vigilance: string | null;
  } | null;
}

/** Résout le token → jury membre */
export async function getJuryByToken(token: string): Promise<JuryMembre | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("jury")
    .select("*")
    .eq("lien_acces_unique", token)
    .eq("actif", true)
    .single();
  if (error || !data) return null;
  return data as JuryMembre;
}

/** Candidatures assignées à un juré (depuis la table assignments ou directement) */
export async function getCandidaturesForJury(
  juryId: string,
  etape: "preselection" | "finale" = "preselection"
): Promise<CandidatureJury[]> {
  const supabase = createServiceClient();

  // Récupère toutes les candidatures soumises + leurs évaluations pour ce juré
  const { data: candidatures, error } = await supabase
    .from("candidatures")
    .select(`
      id, numero_dossier, nom_startup, thematiques, statut,
      evaluations!inner(
        id, statut, conflit_interet,
        score_impact, score_viabilite, score_innovation, score_equipe, score_scalabilite,
        commentaires, points_forts, points_vigilance, est_calibration
      )
    `)
    .eq("evaluations.jury_id", juryId)
    .eq("evaluations.etape", etape)
    .in("statut", ["soumise", "en_evaluation", "preselectionnee", "finaliste"]);

  if (error || !candidatures) return [];

  return candidatures.map((c: Record<string, unknown>) => {
    const evals = (c.evaluations as Record<string, unknown>[]);
    const ev = evals?.[0] ?? null;
    return {
      id: c.id as string,
      numero_dossier: c.numero_dossier as string,
      nom_startup: c.nom_startup as string,
      thematiques: c.thematiques as string[],
      statut: c.statut as string,
      evaluation: ev
        ? {
            id: ev.id as string,
            statut: ev.statut as string,
            conflit_interet: ev.conflit_interet as boolean,
            score_impact: ev.score_impact as number | null,
            score_viabilite: ev.score_viabilite as number | null,
            score_innovation: ev.score_innovation as number | null,
            score_equipe: ev.score_equipe as number | null,
            score_scalabilite: ev.score_scalabilite as number | null,
            commentaires: ev.commentaires as string | null,
            points_forts: ev.points_forts as string | null,
            points_vigilance: ev.points_vigilance as string | null,
          }
        : null,
    };
  });
}

/** Calcule le score total d'une évaluation */
export function calculerScoreTotal(ev: {
  score_impact?: number | null;
  score_viabilite?: number | null;
  score_innovation?: number | null;
  score_equipe?: number | null;
  score_scalabilite?: number | null;
  penalite_temps?: number | null;
}): number | null {
  const vals = [ev.score_impact, ev.score_viabilite, ev.score_innovation, ev.score_equipe, ev.score_scalabilite];
  if (vals.some((v) => v == null)) return null;
  const total = (vals as number[]).reduce((s, v) => s + v, 0);
  return Math.max(0, total - (ev.penalite_temps ?? 0));
}

export const CRITERES = [
  { key: "score_impact",      label: "Impact environnemental / social",      max: 25, desc: "Impact réalisé et mesurable" },
  { key: "score_viabilite",   label: "Viabilité économique",                 max: 25, desc: "Modèle d'affaires et viabilité" },
  { key: "score_innovation",  label: "Innovation technologique",             max: 20, desc: "Pertinence et niveau d'innovation" },
  { key: "score_equipe",      label: "Qualité de l'équipe",                  max: 15, desc: "Capacité d'exécution" },
  { key: "score_scalabilite", label: "Scalabilité & différenciation",        max: 15, desc: "Potentiel de croissance" },
] as const;
