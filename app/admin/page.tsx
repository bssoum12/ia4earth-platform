"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else if (res.status === 429) {
      const retryAfter = res.headers.get("Retry-After");
      const minutes = retryAfter ? Math.ceil(Number(retryAfter) / 60) : 15;
      setError(`Trop de tentatives échouées. Réessayez dans ${minutes} minute${minutes > 1 ? "s" : ""}.`);
      setLoading(false);
    } else {
      setError("Mot de passe administrateur incorrect.");
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
          <h1 className="text-white text-lg font-semibold">Espace administration</h1>
          <p className="text-white/50 text-sm mt-1">Accès réservé à l'équipe organisatrice</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-1.5">
              Mot de passe administrateur
            </label>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              required
              autoFocus
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#8CC63F] focus:border-transparent"
              placeholder="••••••••••••"
            />
          </div>

          {error && (
            <div className="text-sm text-red-300 bg-red-900/30 border border-red-700/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !secret}
            className="w-full py-2.5 bg-[#8CC63F] hover:bg-[#8CC63F]/90 text-forest-900 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
