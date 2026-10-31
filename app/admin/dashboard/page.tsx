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

const STATUT_BADGE: Record<string, string> = {
  soumise:          "bg-leaf-50 text-forest-700 border border-leaf-200",
  en_evaluation:    "bg-amber-50 text-amber-700 border border-amber-200",
  preselectionnee:  "bg-circuit-500/10 text-circuit-600 border border-circuit-500/20",
  finaliste:        "bg-leaf-100 text-forest-800 border border-leaf-300",
  laureat:          "bg-forest-900 text-leaf-400 border border-forest-700",
  non_retenue:      "bg-earth-50 text-earth-700 border border-earth-200",
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

  const evalsReelles  = evaluations.filter((e) => !e.est_calibration && e.etape === "preselection");
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
    <div className="space-y-8 max-w-6xl">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-forest-900 flex items-center justify-center flex-none">
          <svg className="w-5 h-5 text-leaf-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-forest-900 leading-tight">Vue d&apos;ensemble</h1>
          <p className="text-sm text-forest-700/50 mt-0.5">Tableau de bord IA4EARTH 2026</p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi
          label="Total candidatures"
          value={total}
          icon={
            <svg className="w-4.5 h-4.5 text-forest-700/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />
        <Kpi
          label="Jurés actifs"
          value={jurys.filter((j) => j.actif).length}
          icon={
            <svg className="w-4.5 h-4.5 text-forest-700/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <Kpi
          label="Évaluations terminées"
          value={`${evalsTerminees} / ${evalsReelles.length}`}
          icon={
            <svg className="w-4.5 h-4.5 text-forest-700/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
        />
        <Kpi
          label="Progression jury"
          value={`${progressGlobal}%`}
          accent
          icon={
            <svg className="w-4.5 h-4.5 text-leaf-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Par statut */}
        <div className="bg-white rounded-2xl border border-leaf-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <svg className="w-4 h-4 text-forest-700/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <h2 className="font-display font-semibold text-forest-900 text-sm">Candidatures par statut</h2>
          </div>
          <div className="space-y-3">
            {Object.entries(STATUT_LABELS).map(([key, label]) => {
              const count = parStatut[key] ?? 0;
              const pct = total > 0 ? (count / total) * 100 : 0;
              const isActive = count > 0;
              return (
                <div key={key}>
                  <div className="flex justify-between items-center text-sm mb-1.5">
                    <span className={`${isActive ? "text-forest-800 font-medium" : "text-forest-700/40"}`}>{label}</span>
                    <span className={`font-mono font-semibold ${isActive ? "text-forest-900" : "text-forest-700/30"}`}>{count}</span>
                  </div>
                  <div className="h-2 bg-leaf-50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${pct > 0 ? "bg-leaf-400" : ""}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Par thématique */}
        <div className="bg-white rounded-2xl border border-leaf-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <svg className="w-4 h-4 text-forest-700/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="font-display font-semibold text-forest-900 text-sm">Par thématique</h2>
          </div>
          {Object.keys(parThematique).length === 0 ? (
            <p className="text-forest-700/40 text-sm py-8 text-center">Aucune donnée</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(parThematique).map(([key, count]) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-forest-800 font-medium">{THEMATIQUE_LABELS[key] ?? key}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-forest-700/40 font-mono">{pct}%</span>
                        <span className="font-mono font-bold text-forest-900 text-sm">{count}</span>
                      </div>
                    </div>
                    <div className="h-2.5 bg-leaf-50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-circuit-500/70 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Progression jury */}
      {juryProgress.length > 0 && (
        <div className="bg-white rounded-2xl border border-leaf-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <svg className="w-4 h-4 text-forest-700/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            <h2 className="font-display font-semibold text-forest-900 text-sm">Progression des jurés</h2>
          </div>
          <div className="space-y-4">
            {juryProgress.map((j) => {
              const pct = j.total > 0 ? Math.round((j.done / j.total) * 100) : 0;
              const initials = j.nom.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();
              return (
                <div key={j.nom} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-forest-900 rounded-full flex items-center justify-center text-leaf-400 text-xs font-bold flex-none">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center text-sm mb-1.5">
                      <span className="text-forest-800 font-medium truncate">{j.nom}</span>
                      <span className="text-forest-700/60 font-mono text-xs ml-2 whitespace-nowrap">
                        {j.done} / {j.total}
                        <span className={`ml-1.5 font-semibold ${pct === 100 ? "text-leaf-600" : "text-forest-900"}`}>({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-2.5 bg-leaf-50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? "bg-leaf-500" : pct >= 50 ? "bg-leaf-400" : "bg-circuit-500/70"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dernières candidatures */}
      <div className="bg-white rounded-2xl border border-leaf-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-leaf-50 flex items-center gap-2">
          <svg className="w-4 h-4 text-forest-700/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="font-display font-semibold text-forest-900 text-sm">Dernières candidatures reçues</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-leaf-50/60">
              <tr className="text-left text-forest-700/50 text-xs uppercase tracking-wide">
                <th className="px-6 py-3 font-medium">Dossier</th>
                <th className="px-6 py-3 font-medium">Startup</th>
                <th className="px-6 py-3 font-medium">Statut</th>
                <th className="px-6 py-3 font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-leaf-50">
              {derniers.map((c: { id: string; numero_dossier: string; nom_startup: string; statut: string; created_at: string }) => (
                <tr key={c.id} className="hover:bg-leaf-50/40 transition-colors">
                  <td className="px-6 py-3 font-mono text-xs text-forest-700/50">{c.numero_dossier}</td>
                  <td className="px-6 py-3 font-semibold text-forest-900">{c.nom_startup}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUT_BADGE[c.statut] ?? "bg-leaf-50 text-forest-700"}`}>
                      {STATUT_LABELS[c.statut] ?? c.statut}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right text-forest-700/50 text-xs">
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

function Kpi({
  label,
  value,
  accent = false,
  icon,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl p-5 ${accent ? "text-white" : "bg-white border border-leaf-100"}`}
      style={accent ? { background: "linear-gradient(135deg, #062B24 0%, #0F5A45 100%)" } : {}}
    >
      {icon && (
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${accent ? "bg-white/10" : "bg-leaf-50"}`}>
          {icon}
        </div>
      )}
      <div className={`text-3xl font-display font-bold leading-none ${accent ? "text-leaf-400" : "text-forest-900"}`}>
        {value}
      </div>
      <div className={`text-xs mt-1.5 font-medium ${accent ? "text-white/55" : "text-forest-700/55"}`}>{label}</div>
    </div>
  );
}
