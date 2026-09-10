"use client";

import { useState, useEffect, useCallback } from "react";

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

export default function CandidaturesAdminPage() {
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [filtreStatut, setFiltreStatut] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = filtreStatut ? `?statut=${filtreStatut}` : "";
    const res = await fetch(`/api/admin/candidatures${params}`);
    const data = await res.json();
    setCandidatures(data.candidatures ?? []);
    setLoading(false);
  }, [filtreStatut]);

  useEffect(() => { load(); }, [load]);

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

  const filtered = candidatures.filter((c) =>
    !search || c.nom_startup.toLowerCase().includes(search.toLowerCase()) || c.numero_dossier.toLowerCase().includes(search.toLowerCase())
  );

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
                <th className="px-4 py-3 font-medium">Pitch</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-leaf-50">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-forest-700/40">
                    Aucune candidature trouvée
                  </td>
                </tr>
              )}
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-leaf-50/40 transition-colors">
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
