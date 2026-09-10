import { createServiceClient } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const THEMATIQUE_LABELS: Record<string, string> = {
  economie_verte:        "Économie verte",
  finance_responsable:   "Finance responsable",
  developpement_durable: "Développement durable",
};

const STATUT_LABELS: Record<string, string> = {
  soumise:          "Soumises",
  en_evaluation:    "En évaluation",
  preselectionnee:  "Présélectionnées",
  finaliste:        "Finalistes",
  laureat:          "Lauréats",
  non_retenue:      "Non retenues",
};

export default async function AdminDashboardPage() {
  const supabase = createServiceClient();

  const [candidaturesRes, juryRes, evalRes] = await Promise.all([
    supabase.from("candidatures").select("id, numero_dossier, nom_startup, statut, thematiques, created_at"),
    supabase.from("jury").select("id, nom, actif"),
    supabase.from("evaluations").select("jury_id, statut, est_calibration, etape"),
  ]);

  const candidatures = candidaturesRes.data ?? [];
  const jurys        = juryRes.data ?? [];
  const evaluations  = evalRes.data ?? [];

  const total = candidatures.length;

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

  const evalsReelles = evaluations.filter((e) => !e.est_calibration && e.etape === "preselection");
  const evalsTerminees = evalsReelles.filter((e) => e.statut === "terminee").length;
  const progressGlobal = evalsReelles.length > 0 ? Math.round((evalsTerminees / evalsReelles.length) * 100) : 0;

  const juryProgress = jurys
    .filter((j) => j.actif)
    .map((j) => {
      const evals = evalsReelles.filter((e) => e.jury_id === j.id);
      const done  = evals.filter((e) => e.statut === "terminee").length;
      return { nom: j.nom, total: evals.length, done };
    });

  const derniers = [...candidatures]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-display font-bold text-forest-900">Vue d'ensemble</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Total candidatures" value={total} />
        <Kpi label="Jurés actifs" value={jurys.filter((j) => j.actif).length} />
        <Kpi label="Évaluations terminées" value={`${evalsTerminees} / ${evalsReelles.length}`} />
        <Kpi label="Progression jury" value={`${progressGlobal}%`} accent />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Par statut */}
        <div className="surface-card">
          <h2 className="font-display font-semibold text-forest-900 mb-4">Candidatures par statut</h2>
          <div className="space-y-2">
            {Object.entries(STATUT_LABELS).map(([key, label]) => {
              const count = parStatut[key] ?? 0;
              const pct = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-0.5">
                    <span className="text-forest-700">{label}</span>
                    <span className="font-semibold text-forest-900">{count}</span>
                  </div>
                  <div className="h-1.5 bg-leaf-100 rounded-full overflow-hidden">
                    <div className="h-full bg-leaf-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Par thématique */}
        <div className="surface-card">
          <h2 className="font-display font-semibold text-forest-900 mb-4">Par thématique</h2>
          <div className="space-y-3">
            {Object.entries(parThematique).map(([key, count]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="thematic-chip">{THEMATIQUE_LABELS[key] ?? key}</span>
                <span className="font-semibold text-forest-900">{count}</span>
              </div>
            ))}
            {Object.keys(parThematique).length === 0 && (
              <p className="text-forest-700/50 text-sm">Aucune donnée</p>
            )}
          </div>
        </div>
      </div>

      {/* Progression jury */}
      {juryProgress.length > 0 && (
        <div className="surface-card">
          <h2 className="font-display font-semibold text-forest-900 mb-4">Progression des jurés</h2>
          <div className="space-y-3">
            {juryProgress.map((j) => {
              const pct = j.total > 0 ? Math.round((j.done / j.total) * 100) : 0;
              return (
                <div key={j.nom}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-forest-700 font-medium">{j.nom}</span>
                    <span className="text-forest-900">{j.done} / {j.total} <span className="text-forest-700/50">({pct}%)</span></span>
                  </div>
                  <div className="h-2 bg-leaf-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${pct === 100 ? "bg-circuit-500" : "bg-leaf-400"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dernières candidatures */}
      <div className="surface-card">
        <h2 className="font-display font-semibold text-forest-900 mb-4">Dernières candidatures reçues</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-forest-700/60 border-b border-leaf-100">
                <th className="pb-2 font-medium">Dossier</th>
                <th className="pb-2 font-medium">Startup</th>
                <th className="pb-2 font-medium">Statut</th>
                <th className="pb-2 font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-leaf-50">
              {derniers.map((c: { id: string; numero_dossier: string; nom_startup: string; statut: string; created_at: string }) => (
                <tr key={c.id} className="text-forest-900">
                  <td className="py-2 font-mono text-xs text-forest-700/60">{c.numero_dossier}</td>
                  <td className="py-2 font-medium">{c.nom_startup}</td>
                  <td className="py-2">
                    <span className="text-xs bg-leaf-100 text-forest-700 px-2 py-0.5 rounded-full">
                      {STATUT_LABELS[c.statut] ?? c.statut}
                    </span>
                  </td>
                  <td className="py-2 text-right text-forest-700/60">
                    {new Date(c.created_at).toLocaleDateString("fr-TN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-4 ${accent ? "bg-forest-900 text-white" : "surface-card"}`}>
      <div className={`text-3xl font-display font-bold ${accent ? "text-leaf-400" : "text-forest-900"}`}>{value}</div>
      <div className={`text-sm mt-1 ${accent ? "text-white/60" : "text-forest-700/60"}`}>{label}</div>
    </div>
  );
}
