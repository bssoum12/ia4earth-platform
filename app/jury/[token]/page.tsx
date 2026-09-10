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
  en_cours:  { label: "En cours",   cls: "bg-yellow-100 text-yellow-800" },
  terminee:  { label: "Terminée",   cls: "bg-leaf-100 text-forest-700" },
};

export default async function JuryDashboard({ params }: Props) {
  const { token } = await params;
  const jury = await getJuryByToken(token);
  if (!jury) notFound();

  const candidatures = await getCandidaturesForJury(jury.id);
  const terminees = candidatures.filter((c) => c.evaluation?.statut === "terminee").length;

  return (
    <div className="min-h-screen bg-[#F4FBEA]">
      {/* Header */}
      <header className="bg-[#163718] text-white px-6 py-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-leaf-400 font-mono uppercase tracking-widest mb-0.5">Espace Jury — IA4EARTH 2026</div>
          <h1 className="text-xl font-display font-bold">Bonjour, {jury.nom}</h1>
        </div>
        <div className="text-right text-sm">
          <div className="text-leaf-400">{terminees} / {candidatures.length} évaluations</div>
          <div className="text-xs text-white/60 mt-0.5">terminées</div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress bar */}
        {candidatures.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-forest-700 mb-1">
              <span>Progression</span>
              <span>{Math.round((terminees / candidatures.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-leaf-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-leaf-400 rounded-full transition-all"
                style={{ width: `${(terminees / candidatures.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        <h2 className="text-lg font-display font-semibold text-forest-900 mb-4">
          Vos candidatures à évaluer
        </h2>

        {candidatures.length === 0 ? (
          <div className="surface-card text-center py-12 text-forest-700/60">
            Aucune candidature ne vous a encore été assignée.
          </div>
        ) : (
          <div className="space-y-4">
            {candidatures.map((c) => {
              const ev = c.evaluation;
              const badge = ev ? (STATUT_BADGE[ev.statut] ?? STATUT_BADGE.en_cours) : STATUT_BADGE.en_cours;
              return (
                <Link
                  key={c.id}
                  href={`/jury/${token}/${c.id}`}
                  className="surface-card flex items-center gap-4 hover:shadow-md transition-shadow group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display font-semibold text-forest-900 truncate group-hover:text-circuit-500 transition-colors">
                        {c.nom_startup}
                      </span>
                      {ev?.conflit_interet && (
                        <span className="text-2xs bg-earth-700/10 text-earth-700 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                          Conflit déclaré
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-forest-700/60 font-mono">{c.numero_dossier}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {c.thematiques.map((t) => (
                        <span key={t} className="thematic-chip">{THEMATIQUE_LABELS[t] ?? t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${badge.cls}`}>
                      {badge.label}
                    </span>
                    {ev && !ev.conflit_interet && (() => {
                      const st = calculerScoreTotal(ev);
                      return st != null ? (
                        <div className="text-sm font-semibold text-forest-700">
                          {st} <span className="text-xs font-normal text-forest-700/60">/ 100</span>
                        </div>
                      ) : null;
                    })()}
                    <svg className="w-4 h-4 text-forest-700/40 group-hover:text-circuit-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Legend */}
        <div className="mt-10 p-4 bg-white/60 rounded-xl border border-leaf-100 text-xs text-forest-700/70">
          <p className="font-semibold mb-1">Grille d&apos;évaluation (Art. 8)</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1">
            {CRITERES.map((c) => (
              <div key={c.key} className="flex justify-between">
                <span>{c.label}</span>
                <span className="font-mono font-semibold text-forest-900">{c.max} pts</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
