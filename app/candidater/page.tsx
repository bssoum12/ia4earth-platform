import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ApplicationForm from "@/components/ApplicationForm";
import { isCandidatureOuverte } from "@/lib/dates";
import Link from "next/link";

// [M-9] Force le rendu dynamique à chaque requête : isCandidatureOuverte() dépend de
// new Date() — sans ce flag Next.js pourrait mettre en cache la réponse et continuer
// d'accepter des candidatures après la clôture du 15 octobre 2026.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Candidater — IA4EARTH Startup Challenge",
  description: "Déposez votre candidature pour le IA4EARTH Startup Challenge. Clôture : 15 octobre 2026, 23h59.",
};

export default function CandidaterPage() {
  const ouvert = isCandidatureOuverte();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-leaf-50">
        {!ouvert ? (
          /* Candidatures closes — rendu côté serveur */
          <div className="max-w-2xl mx-auto px-4 py-20 text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h1 className="font-display text-3xl font-bold text-forest-900 mb-3">
              Candidatures closes
            </h1>
            <p className="text-forest-700/70 mb-8">
              Les candidatures ont été clôturées le <strong>15 octobre 2026 à 23h59</strong> (Art. 5 du règlement —
              sans prolongation). Aucun dossier soumis après cette date ne sera examiné.
            </p>
            <Link href="/" className="btn-ghost">← Retour à l'accueil</Link>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
            <div className="grid lg:grid-cols-[1fr_300px] gap-10 lg:gap-14 items-start">
              {/* Formulaire */}
              <div>
                <header className="mb-8">
                  <div className="inline-flex items-center gap-2 bg-leaf-100 border border-leaf-200 rounded-full px-3 py-1 text-xs font-semibold text-forest-700 mb-3">
                    Formulaire de candidature
                  </div>
                  <h1 className="font-display text-3xl sm:text-4xl font-bold text-forest-900 mb-2">
                    Déposez votre dossier
                  </h1>
                  <p className="text-forest-700/70 text-sm sm:text-base max-w-[54ch]">
                    Comptez environ 20 minutes. Vous pouvez enregistrer votre progression et y revenir
                    avant le <strong>15 octobre 2026, 23h59</strong>.
                  </p>
                </header>

                <ApplicationForm />
              </div>

              {/* Sidebar */}
              <aside className="lg:sticky lg:top-24">
                <div className="surface-card rounded-xl p-5 sm:p-6 mb-4">
                  <h2 className="font-display font-bold text-base text-forest-900 mb-4">
                    Avant de commencer
                  </h2>
                  <ul className="space-y-3 text-sm text-forest-700/80">
                    {[
                      ["📄", "Un pitch deck au format PDF (10 pages max. recommandé, 10 Mo max.)"],
                      ["📊", "Vos indicateurs de traction des 12 derniers mois"],
                      ["👥", "La composition de votre équipe (1 à 5 personnes)"],
                      ["🌍", "En quoi votre projet répond aux thématiques éligibles"],
                    ].map(([ico, txt]) => (
                      <li key={txt as string} className="flex gap-2.5 leading-snug">
                        <span className="flex-none">{ico}</span>
                        <span>{txt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-earth-100 border border-earth-400/20 rounded-xl p-4 sm:p-5">
                  <div className="font-bold text-earth-700 text-sm mb-1.5 flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <circle cx="8" cy="8" r="7" stroke="#8B2E2E" strokeWidth="1.5"/>
                      <path d="M8 5v3.5M8 11v.5" stroke="#8B2E2E" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Clôture stricte
                  </div>
                  <div className="text-sm text-earth-800">
                    <strong>15 octobre 2026, 23h59.</strong><br />
                    Aucun dossier reçu après cette date ne sera examiné (Art. 5 du règlement, sans prolongation).
                  </div>
                </div>

                <div className="mt-4 surface-card rounded-xl p-4 sm:p-5">
                  <h3 className="font-semibold text-sm text-forest-900 mb-3">Grille d'évaluation jury</h3>
                  <ul className="space-y-2">
                    {[
                      ["Impact environnemental / social", 25],
                      ["Viabilité économique", 25],
                      ["Innovation technologique", 20],
                      ["Équipe & capacité d'exécution", 15],
                      ["Scalabilité & différenciation", 15],
                    ].map(([lbl, pts]) => (
                      <li key={lbl as string} className="flex justify-between items-center gap-2 text-xs text-forest-700/80">
                        <span className="leading-snug">{lbl}</span>
                        <span className="font-mono font-bold text-forest-700 flex-none">{pts} pts</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-3 border-t border-leaf-200 flex justify-between text-xs font-bold text-forest-900">
                    <span>Total</span>
                    <span className="font-mono">100 pts</span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
