import { notFound } from "next/navigation";
import Link from "next/link";
import { getJuryByToken, getCandidaturesForJury, calculerScoreTotal, CRITERES } from "@/lib/jury";

export const dynamic = "force-dynamic"; // [M-10] données jury en temps réel

interface Props { params: Promise<{ token: string }> }

const THEMATIQUE_LABELS: Record<string, string> = {
  economie_verte:         "Économie verte",
  finance_responsable:    "Finance responsable",
  developpement_durable:  "Développement durable",
};

const STATUT_BADGE: Record<string, { label: string; cls: string }> = {
  en_cours:  { label: "En cours",   cls: "bg-amber-100 text-amber-700 border border-amber-200" },
  terminee:  { label: "Terminée",   cls: "bg-leaf-100 text-forest-700 border border-leaf-200" },
};

export default async function JuryDashboard({ params }: Props) {
  const { token } = await params;
  const jury = await getJuryByToken(token);
  if (!jury) notFound();

  const candidatures = await getCandidaturesForJury(jury.id);
  const terminees = candidatures.filter((c) => c.evaluation?.statut === "terminee").length;
  const progression = candidatures.length > 0 ? Math.round((terminees / candidatures.length) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #F4F8F6 0%, #E5F4EF 100%)" }}>
      {/* Header */}
      <header className="bg-forest-900 text-white">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-leaf-400/20 border border-leaf-400/30 flex items-center justify-center flex-none">
              <svg className="w-5 h-5 text-leaf-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div className="text-xs text-leaf-400/70 font-mono uppercase tracking-widest mb-0.5">Espace Jury — IA4EARTH 2026</div>
              <h1 className="text-lg font-display font-bold leading-tight">Bonjour, {jury.nom}</h1>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-mono font-bold text-leaf-400">{terminees}<span className="text-white/40 text-base font-normal"> / {candidatures.length}</span></div>
            <div className="text-xs text-white/50">évaluations terminées</div>
          </div>
        </div>

        {/* Barre de progression dans le header */}
        {candidatures.length > 0 && (
          <div className="max-w-4xl mx-auto px-6 pb-5">
            <div className="flex justify-between text-xs text-white/50 mb-1.5">
              <span>Progression globale</span>
              <span className="text-leaf-400 font-semibold">{progression}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-leaf-400 rounded-full transition-all duration-500"
                style={{ width: `${progression}%` }}
              />
            </div>
          </div>
        )}
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-display font-semibold text-forest-900">
            Vos candidatures à évaluer
          </h2>
          <span className="text-xs text-forest-700/50 font-mono">{candidatures.length} dossiers</span>
        </div>

        {candidatures.length === 0 ? (
          <div className="bg-white rounded-2xl border border-leaf-100 text-center py-14 text-forest-700/60">
            <svg className="w-10 h-10 mx-auto mb-3 text-leaf-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Aucune candidature ne vous a encore été assignée.
          </div>
        ) : (
          <div className="space-y-3">
            {candidatures.map((c) => {
              const ev = c.evaluation;
              const badge = ev ? (STATUT_BADGE[ev.statut] ?? STATUT_BADGE.en_cours) : STATUT_BADGE.en_cours;
              const st = ev && !ev.conflit_interet ? calculerScoreTotal(ev) : null;
              const isTerminee = ev?.statut === "terminee";

              return (
                <Link
                  key={c.id}
                  href={`/jury/${token}/${c.id}`}
                  className="group bg-white rounded-2xl border border-leaf-100/80 px-5 py-4 flex items-center gap-4 hover:border-leaf-300 hover:shadow-lg hover:shadow-forest-900/5 transition-all duration-200"
                >
                  {/* Indicateur statut */}
                  <div className={`w-1 self-stretch rounded-full flex-none ${isTerminee ? "bg-leaf-400" : "bg-amber-300"}`} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-display font-semibold text-forest-900 group-hover:text-forest-700 transition-colors truncate">
                        {c.nom_startup}
                      </span>
                      {ev?.conflit_interet && (
                        <span className="text-2xs bg-earth-100 text-earth-700 border border-earth-200 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                          Conflit déclaré
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-forest-700/50 font-mono mb-2">{c.numero_dossier}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {c.thematiques.map((t) => (
                        <span key={t} className="thematic-chip">{THEMATIQUE_LABELS[t] ?? t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${badge.cls}`}>
                      {badge.label}
                    </span>
                    {st != null && (
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xl font-mono font-bold text-forest-900">{st}</span>
                        <span className="text-xs text-forest-700/40 font-mono">/ 100</span>
                      </div>
                    )}
                    <svg className="w-4 h-4 text-forest-700/30 group-hover:text-leaf-500 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Grille de référence */}
        <div className="mt-10 bg-white/70 rounded-2xl border border-leaf-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-forest-700/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-xs font-semibold text-forest-700">Grille d&apos;évaluation (Art. 8)</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1.5">
            {CRITERES.map((c) => (
              <div key={c.key} className="flex justify-between text-xs text-forest-700/70">
                <span>{c.label}</span>
                <span className="font-mono font-bold text-forest-900 ml-2">{c.max} pts</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
