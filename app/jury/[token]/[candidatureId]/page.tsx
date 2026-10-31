import { notFound } from "next/navigation";
import Link from "next/link";
import { getJuryByToken } from "@/lib/jury";
import { createServiceClient, getSignedPitchDeckUrl } from "@/lib/supabase";
import ScoringForm from "@/components/jury/ScoringForm";

export const dynamic = "force-dynamic"; // [M-10] état d'évaluation en temps réel

interface Props {
  params: Promise<{ token: string; candidatureId: string }>;
}

const THEMATIQUE_LABELS: Record<string, string> = {
  economie_verte:        "Économie verte",
  finance_responsable:   "Finance responsable",
  developpement_durable: "Développement durable",
};

export default async function CandidatureEvaluationPage({ params }: Props) {
  const { token, candidatureId } = await params;

  const jury = await getJuryByToken(token);
  if (!jury) notFound();

  const supabase = createServiceClient();

  // [M-11] Vérifier l'assignation EN PREMIER — évite de charger des données sensibles
  // pour un juré non assigné à cette candidature
  const { data: evaluation } = await supabase
    .from("evaluations")
    .select("*")
    .eq("candidature_id", candidatureId)
    .eq("jury_id", jury.id)
    .single();

  if (!evaluation) notFound();

  const { data: candidature } = await supabase
    .from("candidatures")
    .select("id, numero_dossier, nom_startup, thematiques, statut, traction, equipe, pitch_deck_url, composante_ia")
    .eq("id", candidatureId)
    .single();

  if (!candidature) notFound();

  // [H-4] URL signée 2h générée à la demande — jamais l'URL longue durée stockée en DB
  const pitchDeckUrl = await getSignedPitchDeckUrl(supabase, candidature.pitch_deck_url, 7200);

  const traction = candidature.traction as { clients_actifs?: string; ca_12_mois?: string; preuve_marche?: string } | null;
  const equipe = candidature.equipe as Array<{ prenom?: string; nom?: string; role?: string }> | null;
  const isTerminee = evaluation.statut === "terminee";

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #F4F8F6 0%, #E5F4EF 100%)" }}>
      {/* Header */}
      <header className="bg-forest-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link
            href={`/jury/${token}`}
            className="inline-flex items-center gap-1.5 text-leaf-400/70 text-xs hover:text-leaf-400 transition-colors mb-3 font-mono uppercase tracking-wide"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour au tableau de bord
          </Link>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-display font-bold leading-tight">{candidature.nom_startup}</h1>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-leaf-400/60 text-xs font-mono">{candidature.numero_dossier}</span>
                {isTerminee && (
                  <span className="text-xs bg-leaf-400/20 text-leaf-400 border border-leaf-400/30 px-2.5 py-0.5 rounded-full font-semibold">
                    ✓ Évaluation finalisée
                  </span>
                )}
                {candidature.composante_ia && (
                  <span className="text-xs bg-circuit-500/20 text-circuit-400 border border-circuit-500/30 px-2.5 py-0.5 rounded-full">
                    ⚡ Composante IA
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-end shrink-0">
              {(candidature.thematiques as string[]).map((t) => (
                <span key={t} className="text-xs bg-white/10 text-white/80 border border-white/20 px-2.5 py-0.5 rounded-full">
                  {THEMATIQUE_LABELS[t] ?? t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        {/* Left — candidature info */}
        <aside className="space-y-4">
          {/* Traction */}
          {traction && (
            <div className="bg-white rounded-2xl border border-leaf-100 p-5 space-y-4">
              <h3 className="font-display font-semibold text-forest-900 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-leaf-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Traction
              </h3>
              {traction.clients_actifs && (
                <div className="bg-leaf-50 rounded-xl p-3">
                  <div className="text-2xs text-forest-700/50 uppercase tracking-wider font-semibold mb-1">Clients actifs</div>
                  <div className="text-lg font-mono font-bold text-forest-900">{traction.clients_actifs}</div>
                </div>
              )}
              {traction.ca_12_mois && (
                <div className="bg-leaf-50 rounded-xl p-3">
                  <div className="text-2xs text-forest-700/50 uppercase tracking-wider font-semibold mb-1">CA 12 mois</div>
                  <div className="text-lg font-mono font-bold text-forest-900">{traction.ca_12_mois}</div>
                </div>
              )}
              {traction.preuve_marche && (
                <div>
                  <div className="text-2xs text-forest-700/50 uppercase tracking-wider font-semibold mb-1.5">Preuve de marché</div>
                  <div className="text-sm text-forest-800 leading-relaxed">{traction.preuve_marche}</div>
                </div>
              )}
            </div>
          )}

          {/* Équipe */}
          {equipe && equipe.length > 0 && (
            <div className="bg-white rounded-2xl border border-leaf-100 p-5">
              <h3 className="font-display font-semibold text-forest-900 text-sm mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-leaf-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Équipe
              </h3>
              <div className="space-y-3">
                {equipe.map((m, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-forest-900 text-leaf-400 rounded-full flex items-center justify-center text-xs font-bold flex-none">
                      {((m.prenom?.[0] ?? "") + (m.nom?.[0] ?? "")).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-forest-900">{m.prenom} {m.nom}</div>
                      {m.role && <div className="text-xs text-forest-700/55">{m.role}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pitch deck */}
          {pitchDeckUrl && (
            <a
              href={pitchDeckUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl border border-leaf-100 p-4 flex items-center gap-3 hover:border-circuit-400/50 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 bg-circuit-500/10 rounded-xl flex items-center justify-center flex-none">
                <svg className="w-5 h-5 text-circuit-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-forest-900 group-hover:text-circuit-500 transition-colors">Pitch deck</div>
                <div className="text-xs text-forest-700/55">Ouvrir le PDF →</div>
              </div>
            </a>
          )}
        </aside>

        {/* Right — scoring form */}
        <div>
          <ScoringForm
            token={token}
            candidatureId={candidatureId}
            evaluation={evaluation}
          />
        </div>
      </main>
    </div>
  );
}
