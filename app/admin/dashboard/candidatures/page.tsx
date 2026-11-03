"use client";

import { Fragment, useState, useEffect, useCallback, useMemo } from "react";
import { CRITERES_SCORE, type CandidatureScore, type Etape } from "@/lib/scores";

interface Candidature {
  id: string;
  numero_dossier: string;
  nom_startup: string;
  thematiques: string[];
  statut: string;
  email_contact: string;
  composante_ia: boolean;
  created_at: string;
  pitch_deck_url: string | null;
}

const STATUTS = [
  { value: "",               label: "Tous" },
  { value: "soumise",        label: "Soumises" },
  { value: "en_evaluation",  label: "En évaluation" },
  { value: "preselectionnee",label: "Présélectionnées" },
  { value: "finaliste",      label: "Finalistes" },
  { value: "laureat",        label: "Lauréats" },
  { value: "non_retenue",    label: "Non retenues" },
];

const THEMATIQUE_LABELS: Record<string, string> = {
  economie_verte:        "Éco. verte",
  finance_responsable:   "Finance resp.",
  developpement_durable: "Dev. durable",
};

const ETAPE_LABELS: Record<Etape, string> = {
  preselection: "Présélection",
  finale:       "Finale",
};

// Libellé et barème (Art. 8) de chaque critère
const CRITERE_INFO: Record<(typeof CRITERES_SCORE)[number], { label: string; max: number }> = {
  impact:      { label: "Impact",       max: 25 },
  viabilite:   { label: "Viabilité",    max: 25 },
  innovation:  { label: "Innovation",   max: 20 },
  equipe:      { label: "Équipe",       max: 15 },
  scalabilite: { label: "Scalabilité",  max: 15 },
};

const fmt = (n: number | null): string =>
  n == null ? "—" : n.toLocaleString("fr-FR", { maximumFractionDigits: 2 });

export default function CandidaturesAdminPage() {
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [filtreStatut, setFiltreStatut] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // Scores moyens des jurés
  const [etape, setEtape] = useState<Etape>("preselection");
  const [scores, setScores] = useState<Record<string, CandidatureScore>>({});
  const [scoresError, setScoresError] = useState(false);
  const [triMoyenne, setTriMoyenne] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = filtreStatut ? `?statut=${filtreStatut}` : "";
    const res = await fetch(`/api/admin/candidatures${params}`);
    const data = await res.json();
    setCandidatures(data.candidatures ?? []);
    setLoading(false);
  }, [filtreStatut]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    let annule = false;
    setScoresError(false);
    fetch(`/api/admin/scores?etape=${etape}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data) => { if (!annule) setScores(data.scores ?? {}); })
      .catch(() => { if (!annule) { setScores({}); setScoresError(true); } });
    return () => { annule = true; };
  }, [etape]);

  async function updateStatut(id: string, statut: string) {
    setUpdating(id);
    await fetch("/api/admin/candidatures", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, statut }),
    });
    setCandidatures((prev) => prev.map((c) => c.id === id ? { ...c, statut } : c));
    setUpdating(null);
  }

  const filtered = useMemo(() => {
    const liste = candidatures.filter((c) =>
      !search || c.nom_startup.toLowerCase().includes(search.toLowerCase()) || c.numero_dossier.toLowerCase().includes(search.toLowerCase())
    );
    if (!triMoyenne) return liste;
    // Meilleure moyenne en premier ; les candidatures sans moyenne en dernier
    return [...liste].sort(
      (a, b) => (scores[b.id]?.moyenne_total ?? -1) - (scores[a.id]?.moyenne_total ?? -1)
    );
  }, [candidatures, search, triMoyenne, scores]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold text-forest-900">Candidatures</h1>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Rechercher…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input max-w-xs"
        />
        <div className="flex gap-2 flex-wrap">
          {STATUTS.map((s) => (
            <button
              key={s.value}
              onClick={() => setFiltreStatut(s.value)}
              className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                filtreStatut === s.value
                  ? "bg-forest-900 text-white border-forest-900"
                  : "bg-white text-forest-700 border-leaf-200 hover:border-forest-700"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scores des jurés : étape et tri */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="text-forest-700/60">Scores des jurés :</span>
        {(Object.keys(ETAPE_LABELS) as Etape[]).map((e) => (
          <button
            key={e}
            onClick={() => setEtape(e)}
            className={`px-3 py-1.5 rounded-full border transition-colors ${
              etape === e
                ? "bg-forest-900 text-white border-forest-900"
                : "bg-white text-forest-700 border-leaf-200 hover:border-forest-700"
            }`}
          >
            {ETAPE_LABELS[e]}
          </button>
        ))}
        <label className="flex items-center gap-2 cursor-pointer text-forest-700">
          <input
            type="checkbox"
            checked={triMoyenne}
            onChange={(e) => setTriMoyenne(e.target.checked)}
            className="accent-leaf-400"
          />
          Trier par moyenne
        </label>
        {scoresError && (
          <span className="text-red-600">Impossible de charger les scores.</span>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="surface-card py-12 text-center text-forest-700/50">Chargement…</div>
      ) : (
        <div className="surface-card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-leaf-50/60">
              <tr className="text-left text-forest-700/60 text-xs uppercase tracking-wide">
                <th className="px-4 py-3 font-medium">Dossier</th>
                <th className="px-4 py-3 font-medium">Startup</th>
                <th className="px-4 py-3 font-medium">Thématiques</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Moyenne</th>
                <th className="px-4 py-3 font-medium">Jurés</th>
                <th className="px-4 py-3 font-medium">Pitch</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-leaf-50">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-forest-700/40">
                    Aucune candidature trouvée
                  </td>
                </tr>
              )}
              {filtered.map((c) => {
                const s = scores[c.id];
                return (
                <Fragment key={c.id}>
                <tr className="hover:bg-leaf-50/40 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-forest-700/60 whitespace-nowrap">{c.numero_dossier}</td>
                  <td className="px-4 py-3 font-semibold text-forest-900 whitespace-nowrap">
                    {c.nom_startup}
                    {c.composante_ia && <span className="ml-1 text-circuit-500 text-xs">⚡</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {c.thematiques.map((t) => (
                        <span key={t} className="text-2xs bg-leaf-100 text-forest-700 px-1.5 py-0.5 rounded-full">
                          {THEMATIQUE_LABELS[t] ?? t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-forest-700/70 text-xs">{c.email_contact}</td>
                  <td className="px-4 py-3">
                    <select
                      value={c.statut}
                      disabled={updating === c.id}
                      onChange={(e) => updateStatut(c.id, e.target.value)}
                      className="text-xs border border-leaf-200 rounded-lg px-2 py-1 bg-white text-forest-900 focus:outline-none focus:ring-1 focus:ring-leaf-400 disabled:opacity-50"
                    >
                      {STATUTS.filter((s) => s.value).map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {s?.moyenne_total != null ? (
                      <span className="font-semibold text-forest-900">
                        {fmt(s.moyenne_total)}
                        <span className="text-forest-700/40 text-xs font-normal"> /100</span>
                      </span>
                    ) : (
                      <span className="text-forest-700/30 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs">
                    {s ? (
                      <button
                        onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                        aria-expanded={expanded === c.id}
                        className="text-circuit-500 hover:underline"
                      >
                        {s.jures_ayant_note}/{s.jures_attendus} {expanded === c.id ? "▴" : "▾"}
                      </button>
                    ) : (
                      <span className="text-forest-700/30">Non assignée</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {c.pitch_deck_url ? (
                      <a href={c.pitch_deck_url} target="_blank" rel="noopener noreferrer" className="text-circuit-500 hover:underline text-xs">
                        PDF
                      </a>
                    ) : (
                      <span className="text-forest-700/30 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-forest-700/50 text-xs whitespace-nowrap">
                    {new Date(c.created_at).toLocaleDateString("fr-TN")}
                  </td>
                </tr>
                {s && expanded === c.id && (
                  <tr className="bg-leaf-50/30">
                    <td colSpan={9} className="px-4 py-4">
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-forest-700">
                          <span className="font-medium text-forest-900">
                            Moyennes par critère ({ETAPE_LABELS[etape]})
                          </span>
                          {CRITERES_SCORE.map((k) => (
                            <span key={k}>
                              {CRITERE_INFO[k].label} : <strong>{fmt(s.moyennes[k])}</strong>/{CRITERE_INFO[k].max}
                            </span>
                          ))}
                        </div>
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-left text-forest-700/60 uppercase tracking-wide">
                              <th className="py-1 pr-4 font-medium">Juré</th>
                              {CRITERES_SCORE.map((k) => (
                                <th key={k} className="py-1 pr-4 font-medium">{CRITERE_INFO[k].label}</th>
                              ))}
                              {etape === "finale" && <th className="py-1 pr-4 font-medium">Pénalité</th>}
                              <th className="py-1 pr-4 font-medium">Total</th>
                              <th className="py-1 font-medium">État</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-leaf-100">
                            {s.evaluations.map((ev, i) => (
                              <tr key={i}>
                                <td className="py-1.5 pr-4 font-medium text-forest-900">{ev.jury_nom}</td>
                                {CRITERES_SCORE.map((k) => (
                                  <td key={k} className="py-1.5 pr-4">
                                    {ev.conflit_interet ? "—" : fmt(ev.scores[k])}
                                  </td>
                                ))}
                                {etape === "finale" && (
                                  <td className="py-1.5 pr-4">
                                    {ev.conflit_interet ? "—" : fmt(ev.penalite_temps)}
                                  </td>
                                )}
                                <td className="py-1.5 pr-4 font-semibold">{fmt(ev.total)}</td>
                                <td className="py-1.5 text-forest-700/70">
                                  {ev.conflit_interet
                                    ? "Conflit d'intérêt (exclu de la moyenne)"
                                    : ev.statut === "terminee"
                                      ? "Terminée"
                                      : "En cours"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
                </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
