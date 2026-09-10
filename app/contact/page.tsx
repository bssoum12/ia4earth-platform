"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type Status = "idle" | "sending" | "ok" | "error";

const SUJETS = [
  "Question sur mon éligibilité",
  "Question sur le dossier de candidature",
  "Partenariat / sponsoring",
  "Accréditation presse",
  "Problème technique",
  "Autre",
];

export default function ContactPage() {
  const [form, setForm] = useState({ nom: "", email: "", sujet: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      let json: { message?: string } = {};
      try { json = await res.json(); } catch { /* non-JSON */ }
      if (!res.ok) {
        setError(json.message ?? "Erreur — veuillez réessayer.");
        setStatus("error");
        return;
      }
      setStatus("ok");
    } catch {
      setError("Erreur réseau — vérifiez votre connexion et réessayez.");
      setStatus("error");
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-leaf-50">
        {/* En-tête */}
        <div className="bg-forest-900 py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <Link href="/" className="inline-flex items-center gap-1.5 text-leaf-300/60 hover:text-leaf-300 text-sm mb-6 transition-colors">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Retour
            </Link>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">Nous contacter</h1>
            <p className="text-leaf-100/60">
              Nous répondons sous 48h ouvrées.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          {status === "ok" ? (
            <div className="bg-white border border-leaf-200 rounded-2xl p-10 text-center shadow-card">
              <div className="w-14 h-14 rounded-full bg-leaf-100 flex items-center justify-center mx-auto mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12l4.5 4.5L19 7" stroke="#2D6030" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="font-display font-bold text-2xl text-forest-900 mb-3">Message envoyé</h2>
              <p className="text-forest-700/70 mb-8">
                Nous vous répondrons à <strong>{form.email}</strong> sous 48h ouvrées.
              </p>
              <Link href="/" className="btn-primary inline-flex mx-auto">
                Retour à l'accueil
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-leaf-200 rounded-2xl shadow-card overflow-hidden">
              <form onSubmit={submit} noValidate className="p-6 sm:p-8 space-y-5">
                {/* Nom */}
                <div>
                  <label htmlFor="nom" className="block text-sm font-semibold text-forest-900 mb-1.5">
                    Nom complet <span className="text-earth-600">*</span>
                  </label>
                  <input
                    id="nom"
                    type="text"
                    required
                    value={form.nom}
                    onChange={set("nom")}
                    placeholder="Votre nom"
                    className="w-full border border-leaf-200 rounded-lg px-4 py-2.5 text-sm text-forest-900 placeholder-forest-700/30 focus:outline-none focus:ring-2 focus:ring-forest-700/30 focus:border-forest-700 transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-forest-900 mb-1.5">
                    Adresse e-mail <span className="text-earth-600">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={set("email")}
                    placeholder="vous@exemple.com"
                    className="w-full border border-leaf-200 rounded-lg px-4 py-2.5 text-sm text-forest-900 placeholder-forest-700/30 focus:outline-none focus:ring-2 focus:ring-forest-700/30 focus:border-forest-700 transition-colors"
                  />
                </div>

                {/* Sujet */}
                <div>
                  <label htmlFor="sujet" className="block text-sm font-semibold text-forest-900 mb-1.5">
                    Sujet <span className="text-earth-600">*</span>
                  </label>
                  <select
                    id="sujet"
                    required
                    value={form.sujet}
                    onChange={set("sujet")}
                    className="w-full border border-leaf-200 rounded-lg px-4 py-2.5 text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-700/30 focus:border-forest-700 transition-colors bg-white"
                  >
                    <option value="">— Choisir un sujet —</option>
                    {SUJETS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-forest-900 mb-1.5">
                    Message <span className="text-earth-600">*</span>
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    maxLength={4000}
                    value={form.message}
                    onChange={set("message")}
                    placeholder="Décrivez votre demande..."
                    className="w-full border border-leaf-200 rounded-lg px-4 py-2.5 text-sm text-forest-900 placeholder-forest-700/30 focus:outline-none focus:ring-2 focus:ring-forest-700/30 focus:border-forest-700 transition-colors resize-y"
                  />
                  <p className="text-right text-2xs text-forest-700/30 mt-1">
                    {form.message.length} / 4 000
                  </p>
                </div>

                {/* Erreur */}
                {status === "error" && (
                  <div className="bg-earth-50 border border-earth-200 rounded-lg px-4 py-3 text-sm text-earth-700">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "sending" ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Envoi en cours…
                    </>
                  ) : (
                    <>
                      Envoyer le message
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Pied de formulaire */}
              <div className="border-t border-leaf-100 bg-leaf-50 px-6 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-forest-700/60">
                <span>
                  Vous pouvez aussi écrire directement à{" "}
                  <a href="mailto:contact@salondedeveloppementdurable.com" className="text-forest-700 font-medium hover:text-earth-700 transition-colors">
                    contact@salondedeveloppementdurable.com
                  </a>
                </span>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-forest-900 border-t border-forest-800/60 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-leaf-100/40">
          <div>
            <div className="font-semibold text-leaf-100/60 mb-0.5">IA4EARTH Startup Challenge</div>
            <div>3ème édition du Salon de l'Économie Verte, Finance Responsable et Développement Durable</div>
          </div>
          <div className="flex gap-5">
            <Link href="/reglement" className="hover:text-leaf-300 transition-colors">Règlement</Link>
            <Link href="/#faq" className="hover:text-leaf-300 transition-colors">FAQ</Link>
            <Link href="/contact" className="hover:text-leaf-300 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
