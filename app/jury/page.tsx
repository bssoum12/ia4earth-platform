"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JuryLoginPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const t = token.trim();
    if (!t) return;
    setLoading(true);
    setError("");

    const res = await fetch(`/api/jury/${encodeURIComponent(t)}`, { method: "GET" });
    if (res.ok) {
      router.push(`/jury/${encodeURIComponent(t)}`);
    } else if (res.status === 404) {
      setError("Token invalide — vérifiez le lien reçu par e-mail.");
      setLoading(false);
    } else {
      setError("Erreur serveur — veuillez réessayer.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#163718] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <svg className="w-8 h-8 text-[#8CC63F]" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
              <path d="M10 22 L16 10 L22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 18 h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-white font-display font-bold text-xl">IA4EARTH</span>
          </div>
          <h1 className="text-white text-lg font-semibold">Espace Jury</h1>
          <p className="text-white/50 text-sm mt-1">Saisissez votre token d'accès reçu par e-mail</p>
        </div>

        <form onSubmit={submit} className="bg-white/10 backdrop-blur rounded-2xl p-6 space-y-4">
          <div>
            <label htmlFor="token" className="block text-white/80 text-sm font-medium mb-1.5">
              Token d'accès
            </label>
            <input
              id="token"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              autoFocus
              autoComplete="off"
              spellCheck={false}
              placeholder="ex : abc123def456…"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#8CC63F] focus:border-transparent font-mono text-sm"
            />
          </div>

          {error && (
            <div className="text-sm text-red-300 bg-red-900/30 border border-red-700/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !token.trim()}
            className="w-full py-2.5 bg-[#8CC63F] hover:bg-[#8CC63F]/90 text-[#163718] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Vérification…" : "Accéder à mon espace"}
          </button>
        </form>

        <p className="text-center text-white/30 text-xs mt-6">
          Votre token vous a été envoyé par l'équipe organisatrice.
          <br />Contactez-nous si vous ne l'avez pas reçu.
        </p>
      </div>
    </div>
  );
}
