import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Candidature soumise — IA4EARTH Startup Challenge",
};

interface Props {
  searchParams: Promise<{ dossier?: string }>;
}

export default async function ConfirmationPage({ searchParams }: Props) {
  const { dossier } = await searchParams;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-leaf-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
        <div className="max-w-lg w-full text-center animate-fade-up">
          {/* Icône succès */}
          <div className="w-16 h-16 rounded-full bg-forest-700/10 border border-forest-700/20 flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12l5 5L19 7" stroke="#2D6030" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1 className="font-display text-3xl font-bold text-forest-900 mb-3">
            Candidature soumise !
          </h1>
          <p className="text-forest-700/70 mb-6 text-sm sm:text-base leading-relaxed">
            Votre dossier a bien été reçu. Un accusé de réception a été envoyé à votre adresse e-mail.
          </p>

          {dossier && (
            <div className="bg-white border border-leaf-200 rounded-xl p-5 mb-8 text-left">
              <div className="text-xs font-bold text-forest-700 uppercase tracking-wider mb-1.5">
                Votre numéro de dossier
              </div>
              <div className="font-mono text-2xl font-bold text-forest-900 tracking-wide">
                {dossier}
              </div>
              <p className="text-xs text-forest-600/60 mt-2">
                Conservez ce numéro. Il sera demandé pour tout échange avec le comité d'organisation.
              </p>
            </div>
          )}

          <div className="surface-card rounded-xl p-5 mb-6 text-left">
            <div className="text-xs font-bold text-forest-700 uppercase tracking-wider mb-3">
              La suite du calendrier
            </div>
            <ul className="space-y-2.5 text-sm text-forest-700/80">
              {[
                ["15 oct. 2026, 23h59", "Clôture des candidatures"],
                ["16–25 oct.", "Présélection sur dossier"],
                ["28 oct.", "Annonce des finalistes (par e-mail)"],
                ["5–6 nov.", "Finale & remise des prix — UTICA, Tunis"],
              ].map(([date, label]) => (
                <li key={date} className="flex gap-3">
                  <span className="font-semibold text-forest-700 w-28 flex-none text-xs leading-snug pt-0.5">{date}</span>
                  <span className="leading-snug">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link href="/" className="btn-ghost text-sm">
            ← Retour à l'accueil
          </Link>
        </div>
      </main>
    </>
  );
}
