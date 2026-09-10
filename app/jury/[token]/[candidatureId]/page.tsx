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

  return (
    <div className="min-h-screen bg-[#F4FBEA]">
      {/* Header */}
      <header className="bg-[#163718] text-white px-6 py-4">
        <Link href={`/jury/${token}`} className="inline-flex items-center gap-2 text-leaf-400 text-sm hover:text-white transition-colors mb-3">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour au tableau de bord
        </Link>
        <h1 className="text-xl font-display font-bold">{candidature.nom_startup}</h1>
        <div className="text-leaf-400/70 text-xs font-mono mt-0.5">{candidature.numero_dossier}</div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — candidature info */}
        <div className="lg:col-span-1 space-y-4">
          {/* Thématiques */}
          <div className="surface-card">
            <h3 className="font-display font-semibold text-forest-900 text-sm mb-3">Thématiques</h3>
            <div className="flex flex-wrap gap-1">
              {(candidature.thematiques as string[]).map((t) => (
                <span key={t} className="thematic-chip">{THEMATIQUE_LABELS[t] ?? t}</span>
              ))}
            </div>
            {candidature.composante_ia && (
              <div className="mt-2 text-xs bg-circuit-500/10 text-circuit-500 px-2 py-1 rounded-full inline-flex items-center gap-1">
                <span>⚡</span> Composante IA
              </div>
            )}
          </div>

          {/* Traction */}
          {traction && (
            <div className="surface-card space-y-3">
              <h3 className="font-display font-semibold text-forest-900 text-sm">Traction</h3>
              {traction.clients_actifs && (
                <div>
                  <div className="text-2xs text-forest-700/50 uppercase tracking-wide mb-0.5">Clients actifs</div>
                  <div className="text-sm text-forest-900">{traction.clients_actifs}</div>
                </div>
              )}
              {traction.ca_12_mois && (
                <div>
                  <div className="text-2xs text-forest-700/50 uppercase tracking-wide mb-0.5">CA 12 mois</div>
                  <div className="text-sm text-forest-900">{traction.ca_12_mois}</div>
                </div>
              )}
              {traction.preuve_marche && (
                <div>
                  <div className="text-2xs text-forest-700/50 uppercase tracking-wide mb-0.5">Preuve de marché</div>
                  <div className="text-sm text-forest-900 leading-relaxed">{traction.preuve_marche}</div>
                </div>
              )}
            </div>
          )}

          {/* Équipe */}
          {equipe && equipe.length > 0 && (
            <div className="surface-card">
              <h3 className="font-display font-semibold text-forest-900 text-sm mb-3">Équipe</h3>
              <div className="space-y-2">
                {equipe.map((m, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-leaf-100 rounded-full flex items-center justify-center text-xs font-bold text-forest-700">
                      {(m.prenom?.[0] ?? "") + (m.nom?.[0] ?? "")}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-forest-900">{m.prenom} {m.nom}</div>
                      {m.role && <div className="text-xs text-forest-700/60">{m.role}</div>}
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
              className="surface-card flex items-center gap-3 hover:shadow-md transition-shadow text-circuit-500 hover:text-circuit-500/80"
            >
              <svg className="w-8 h-8 text-earth-700/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <div className="font-semibold text-sm">Pitch deck</div>
                <div className="text-xs text-forest-700/60">Ouvrir le PDF</div>
              </div>
            </a>
          )}
        </div>

        {/* Right — scoring form */}
        <div className="lg:col-span-2">
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
