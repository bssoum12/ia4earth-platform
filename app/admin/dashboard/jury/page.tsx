"use client";

import { useState, useEffect, useCallback } from "react";

interface Jury {
  id: string;
  nom: string;
  email: string;
  etapes: string[];
  lien_acces_unique: string;
  actif: boolean;
  created_at: string;
}

interface Candidature {
  id: string;
  numero_dossier: string;
  nom_startup: string;
}

// NEXT_PUBLIC_APP_URL doit être défini en prod ; en dev on utilise l'origine courante
function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

export default function JuryAdminPage() {
  const [jurys, setJurys] = useState<Jury[]>([]);
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Assign modal state
  const [assigningJury, setAssigningJury] = useState<Jury | null>(null);
  const [selectedCandidatures, setSelectedCandidatures] = useState<string[]>([]);
  const [assigning, setAssigning] = useState(false);

  // New jury form
  const [newNom, setNewNom] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newEtapes, setNewEtapes] = useState<string[]>(["preselection"]);
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [jurysRes, candRes] = await Promise.all([
      fetch("/api/admin/jurys").then((r) => r.json()),
      fetch("/api/admin/candidatures").then((r) => r.json()),
    ]);
    setJurys(jurysRes.jurys ?? []);
    setCandidatures(candRes.candidatures ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function copyLink(token: string) {
    const url = `${getAppUrl()}/jury/${token}`;
    navigator.clipboard.writeText(url);
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  }

  async function addJury(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    const res = await fetch("/api/admin/jurys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom: newNom, email: newEmail, etapes: newEtapes }),
    });
    if (res.ok) {
      const data = await res.json();
      setJurys((prev) => [data.jury, ...prev]);
      setNewNom("");
      setNewEmail("");
      setNewEtapes(["preselection"]);
      setShowAddForm(false);
    }
    setAdding(false);
  }

  async function assign() {
    if (!assigningJury || selectedCandidatures.length === 0) return;
    setAssigning(true);
    await fetch("/api/admin/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jury_id: assigningJury.id,
        candidature_ids: selectedCandidatures,
        etape: "preselection",
      }),
    });
    setAssigningJury(null);
    setSelectedCandidatures([]);
    setAssigning(false);
  }

  if (loading) {
    return <div className="text-forest-700/50 py-12 text-center">Chargement…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-forest-900">Gestion du jury</h1>
        <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary text-sm">
          + Ajouter un juré
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <form onSubmit={addJury} className="surface-card space-y-4 border-2 border-leaf-400">
          <h2 className="font-display font-semibold text-forest-900">Nouveau juré</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Nom complet</label>
              <input
                type="text"
                value={newNom}
                onChange={(e) => setNewNom(e.target.value)}
                required
                className="form-input"
                placeholder="Prénom Nom"
              />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                className="form-input"
                placeholder="juré@exemple.com"
              />
            </div>
          </div>
          <div>
            <label className="form-label">Étapes</label>
            <div className="flex gap-4">
              {["preselection", "finale"].map((e) => (
                <label key={e} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newEtapes.includes(e)}
                    onChange={() =>
                      setNewEtapes((prev) =>
                        prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]
                      )
                    }
                    className="accent-leaf-400"
                  />
                  {e === "preselection" ? "Présélection" : "Finale"}
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={adding || !newNom || !newEmail || newEtapes.length === 0} className="btn-primary disabled:opacity-50">
              {adding ? "Création…" : "Créer le juré"}
            </button>
            <button type="button" onClick={() => setShowAddForm(false)} className="btn-ghost">
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Jury list */}
      {jurys.length === 0 ? (
        <div className="surface-card py-12 text-center text-forest-700/50">
          Aucun juré n'a encore été ajouté.
        </div>
      ) : (
        <div className="space-y-3">
          {jurys.map((j) => (
            <div key={j.id} className="surface-card flex items-start gap-4 flex-wrap">
              <div className="w-10 h-10 bg-forest-900 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                {j.nom.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-forest-900">{j.nom}</div>
                <div className="text-sm text-forest-700/60">{j.email}</div>
                <div className="flex gap-1 mt-1">
                  {j.etapes.map((e: string) => (
                    <span key={e} className="text-2xs bg-leaf-100 text-forest-700 px-2 py-0.5 rounded-full capitalize">
                      {e === "preselection" ? "Présélection" : "Finale"}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  onClick={() => copyLink(j.lien_acces_unique)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    copied === j.lien_acces_unique
                      ? "bg-leaf-400 text-forest-900 border-leaf-400"
                      : "border-leaf-300 text-forest-700 hover:border-forest-700"
                  }`}
                >
                  {copied === j.lien_acces_unique ? "Lien copié ✓" : "Copier le lien"}
                </button>
                <button
                  onClick={() => { setAssigningJury(j); setSelectedCandidatures([]); }}
                  className="text-xs px-3 py-1.5 rounded-lg border border-circuit-500/30 text-circuit-500 hover:bg-circuit-500/10 transition-colors"
                >
                  Assigner des candidatures
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign modal */}
      {assigningJury && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[80vh] flex flex-col shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-forest-900">
                Assigner à {assigningJury.nom}
              </h2>
              <button onClick={() => setAssigningJury(null)} className="text-forest-700/50 hover:text-forest-900">
                ✕
              </button>
            </div>
            <p className="text-sm text-forest-700/60 mb-4">
              Sélectionnez les candidatures à confier à ce juré pour la présélection.
            </p>
            <div className="flex-1 overflow-y-auto space-y-2">
              {candidatures.map((c) => (
                <label key={c.id} className="flex items-center gap-3 p-3 border border-leaf-100 rounded-lg cursor-pointer hover:bg-leaf-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedCandidatures.includes(c.id)}
                    onChange={() =>
                      setSelectedCandidatures((prev) =>
                        prev.includes(c.id) ? prev.filter((x) => x !== c.id) : [...prev, c.id]
                      )
                    }
                    className="accent-leaf-400 w-4 h-4"
                  />
                  <div>
                    <div className="font-medium text-sm text-forest-900">{c.nom_startup}</div>
                    <div className="text-xs text-forest-700/50 font-mono">{c.numero_dossier}</div>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex gap-3 mt-4 pt-4 border-t border-leaf-100">
              <button
                onClick={assign}
                disabled={assigning || selectedCandidatures.length === 0}
                className="btn-primary disabled:opacity-50 flex-1"
              >
                {assigning ? "Assignation…" : `Assigner ${selectedCandidatures.length} candidature(s)`}
              </button>
              <button onClick={() => setAssigningJury(null)} className="btn-ghost">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
