"use client";

import { useState } from "react";

const FAQ = [
  {
    q: "Qui peut participer au concours ?",
    a: "Toute startup constituée juridiquement, ou en cours de constitution avancée, avec une traction démontrable (premiers clients, CA, preuve de marché) et une équipe de 1 à 5 personnes. Les membres du jury, du Comité de pilotage et leurs proches ne peuvent pas candidater.",
  },
  {
    q: "L'intelligence artificielle est-elle obligatoire ?",
    a: "Non. L'IA n'est pas un critère de participation ou de sélection. Les projets sans composante IA sont parfaitement éligibles dès lors qu'ils s'inscrivent dans l'une des thématiques : économie verte, finance responsable ou développement durable. Lorsqu'une composante IA est présente, elle est évaluée sur sa pertinence réelle, pas comme un simple badge (Art. 3.2).",
  },
  {
    q: "Quelles thématiques sont éligibles ?",
    a: "Trois thématiques : Économie verte, Finance responsable, Développement durable. Votre startup peut s'inscrire dans plusieurs thématiques à la fois.",
  },
  {
    q: "Comment se déroule la finale ?",
    a: "Les startups finalistes présentent leur projet lors d'un pitch de 5 minutes maximum devant le jury, suivi de 3 à 5 minutes de questions-réponses. La présentation peut être en français, arabe ou anglais. Un signal est donné à 4 minutes. Un dépassement peut entraîner une pénalité (Art. 6.2).",
  },
  {
    q: "Quels sont les prix ?",
    a: "Le 1er Prix comprend une dotation financière et une mise en relation avec des investisseurs. Des prix spéciaux sont remis pour l'Impact Environnemental et le Coup de Cœur du Jury. Un Prix du Public est également prévu. La liste définitive sera communiquée avant la finale.",
  },
  {
    q: "Puis-je modifier ma candidature après soumission ?",
    a: "Non. Une fois soumis, le dossier est verrouillé. Vérifiez l'intégralité de vos informations — startup, équipe, traction, pitch deck — avant de cliquer sur « Soumettre ma candidature ».",
  },
  {
    q: "Les startups hors Tunisie peuvent-elles participer ?",
    a: "Le concours cible prioritairement les startups tunisiennes et africaines. Si votre projet a un lien direct avec la Tunisie ou l'Afrique (équipe, marché, impact), votre dossier sera examiné. Posez-nous la question via le formulaire de contact.",
  },
  {
    q: "Que se passe-t-il après la clôture du 15 octobre ?",
    a: "La commission de présélection évalue les dossiers du 16 au 25 octobre. Les finalistes sont annoncés le 28 octobre par e-mail. La finale se tient les 5 et 6 novembre 2026 à Tunis (UTICA). Aucun dossier reçu après le 15 octobre à 23h59 ne sera examiné, quelle qu'en soit la raison (Art. 5).",
  },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {FAQ.map((item, i) => (
        <div
          key={i}
          className="border border-leaf-200 rounded-xl overflow-hidden bg-white transition-shadow duration-200 hover:shadow-card"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
            aria-expanded={open === i}
          >
            <span className="font-semibold text-forest-900 text-sm leading-snug">
              {item.q}
            </span>
            <div
              className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                open === i
                  ? "bg-forest-700 border-forest-700 rotate-45"
                  : "border-leaf-300"
              }`}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                <path
                  d="M5 2v6M2 5h6"
                  stroke={open === i ? "white" : "#8CC63F"}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </button>

          {open === i && (
            <div className="px-5 pb-5">
              <div className="border-t border-leaf-100 pt-4 text-sm text-forest-700/80 leading-relaxed">
                {item.a}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
