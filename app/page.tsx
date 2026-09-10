import Link from "next/link";
import Navbar from "@/components/Navbar";
import CountdownTimer from "@/components/CountdownTimer";
import FaqAccordion from "@/components/FaqAccordion";

const CALENDRIER = [
  { date: "12 sept. 2026", event: "Lancement officiel", detail: "Ouverture des candidatures, 10h00", done: true },
  { date: "15 oct. 2026", event: "Clôture des candidatures", detail: "23h59, sans prolongation (Art. 5)", done: false, highlight: true },
  { date: "16–25 oct.", event: "Présélection sur dossier", detail: "Évaluation par la commission de présélection", done: false },
  { date: "28 oct. 2026", event: "Annonce des finalistes", detail: "6 à 10 startups retenues", done: false },
  { date: "5–6 nov. 2026", event: "Finale & remise des prix", detail: "UTICA, Tunis — pendant le Salon", done: false },
];

const PRIX = [
  {
    ico: "🥇",
    titre: "1er Prix",
    desc: "Dotation principale, visibilité maximum sur les supports du Salon et dans les médias partenaires.",
  },
  {
    ico: "🌿",
    titre: "Prix Impact Environnemental",
    desc: "Récompense la startup dont l'impact environnemental et social mesuré est le plus significatif.",
  },
  {
    ico: "💡",
    titre: "Prix Coup de Cœur du Jury",
    desc: "Attribué sur critères qualitatifs par le jury pour reconnaître une innovation particulièrement marquante.",
  },
  {
    ico: "👥",
    titre: "Prix du Public",
    desc: "Plébiscité par les visiteurs du Salon lors de la cérémonie de remise des prix.",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden bg-leaf-50 circuit-bg">
          {/* Gradient overlay sur le motif circuit */}
          <div className="absolute inset-0 bg-gradient-to-br from-leaf-50 via-leaf-50/95 to-leaf-100/80 pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
            <div className="grid lg:grid-cols-[1.2fr_0.9fr] gap-12 lg:gap-16 items-start">
              {/* Gauche */}
              <div className="animate-fade-up">
                <div className="inline-flex items-center gap-2 bg-forest-700/8 border border-forest-700/15 rounded-full px-3 py-1 text-xs font-semibold text-forest-700 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-leaf-400 animate-pulse-slow" />
                  3ème édition · Salon ÉV FR DD · Candidatures ouvertes
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-forest-900 leading-[1.06] mb-5">
                  Votre startup a de{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 text-forest-700">l'impact.</span>
                    <svg className="absolute -bottom-1 left-0 w-full h-2" viewBox="0 0 200 8" preserveAspectRatio="none" aria-hidden>
                      <path d="M0 6 Q50 1 100 5 Q150 9 200 4" stroke="#8CC63F" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <br />
                  <em className="not-italic text-earth-700">Faites-le savoir.</em>
                </h1>

                <p className="text-base sm:text-lg text-forest-700/80 max-w-[52ch] mb-8 leading-relaxed">
                  Le IA4EARTH Startup Challenge récompense les startups tunisiennes qui font
                  avancer l&apos;économie verte, la finance responsable et le développement durable
                  — <strong className="text-forest-800">avec ou sans intelligence artificielle.</strong>
                </p>

                <div className="flex flex-wrap gap-3 mb-10">
                  <Link href="/candidater" className="btn-primary text-sm">
                    Déposer ma candidature
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                  <Link href="/reglement" className="btn-ghost text-sm">
                    Lire le règlement
                  </Link>
                </div>

                {/* Compte à rebours */}
                <CountdownTimer />
              </div>

              {/* Droite — carte éligibilité */}
              <div className="animate-fade-up [animation-delay:120ms]" id="eligibilite">
                <div className="rounded-xl overflow-hidden shadow-card border border-leaf-200">
                  {/* En-tête coloré */}
                  <div className="bg-forest-700 px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM4.5 8l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-display font-bold text-base leading-tight">
                        Vous êtes éligible si…
                      </div>
                      <div className="text-leaf-300/70 text-xs mt-0.5">4 critères de recevabilité</div>
                    </div>
                  </div>

                  {/* Corps */}
                  <div className="bg-white px-6 py-5">
                    <ul className="space-y-4">
                      {[
                        { text: "Votre startup est constituée, ou en cours de constitution avancée", ref: "Art. 4" },
                        { text: "Vous avez une traction démontrable : premiers clients, CA, preuve de marché", ref: null },
                        { text: "Votre projet touche à l'économie verte, la finance responsable ou le DD", ref: "Art. 3.2" },
                        { text: "L'IA n'est pas requise — elle est un plus, pas une condition", ref: "Art. 3.2" },
                      ].map(({ text, ref }, i) => (
                        <li key={i} className="flex gap-3 items-start">
                          <div className="w-6 h-6 rounded-full bg-leaf-100 border border-leaf-300 flex items-center justify-center shrink-0 mt-0.5">
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                              <path d="M2.5 6l2.5 2.5 4.5-5" stroke="#2D6030" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div>
                            <span className="text-sm text-forest-800 leading-snug">{text}</span>
                            {ref && (
                              <span className="ml-1.5 text-2xs font-mono text-forest-700/40 font-semibold">({ref})</span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 pt-4 border-t border-leaf-100">
                      <Link href="/candidater" className="btn-primary w-full justify-center text-sm">
                        Déposer ma candidature →
                      </Link>
                      <p className="text-2xs text-forest-700/40 text-center mt-2">
                        Clôture le 15 octobre 2026 à 23h59
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FRISE CHRONOLOGIQUE ===== */}
        <div className="bg-forest-900 text-white py-10 overflow-x-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 min-w-[600px]">
            {(() => {
              const steps = [
                { date: "12 sept.", label: "Ouverture", sub: "Candidatures ouvertes", done: true },
                { date: "15 oct.", label: "Clôture", sub: "23h59 — sans prolongation", highlight: true },
                { date: "28 oct.", label: "Finalistes", sub: "Annonce des sélectionnés" },
                { date: "5–6 nov.", label: "Finale", sub: "Pitchs & remise des prix" },
              ];
              return (
                <div className="relative flex items-start justify-between gap-0">
                  {/* Ligne de connexion */}
                  <div className="absolute top-[22px] left-[5%] right-[5%] h-px bg-forest-700" aria-hidden />
                  {/* Ligne de progression (12 sept → 15 oct passé) */}
                  <div className="absolute top-[22px] left-[5%] w-[30%] h-px bg-leaf-400" aria-hidden />

                  {steps.map((s, i) => (
                    <div key={i} className="relative flex flex-col items-center text-center flex-1 px-2">
                      {/* Dot */}
                      <div
                        className={`
                          relative z-10 w-11 h-11 rounded-full flex items-center justify-center mb-3 border-2 shrink-0
                          ${s.done
                            ? "bg-leaf-400 border-leaf-400"
                            : s.highlight
                            ? "bg-earth-700 border-earth-600 shadow-lg shadow-earth-700/40"
                            : "bg-forest-800 border-forest-600"}
                        `}
                      >
                        {s.done ? (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                            <path d="M3.5 8l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <span className={`text-xs font-bold font-mono ${s.highlight ? "text-white" : "text-leaf-400"}`}>
                            {i + 1}
                          </span>
                        )}
                      </div>

                      {/* Date */}
                      <span className={`font-display font-bold text-base sm:text-lg block leading-none mb-1 ${s.done ? "text-leaf-400" : s.highlight ? "text-earth-400" : "text-white"}`}>
                        {s.date}
                      </span>
                      {/* Label */}
                      <span className={`text-xs font-bold uppercase tracking-wider block mb-0.5 ${s.highlight ? "text-earth-400" : "text-leaf-100/80"}`}>
                        {s.label}
                      </span>
                      {/* Sous-titre */}
                      <span className="text-2xs text-leaf-100/40 leading-tight hidden sm:block">{s.sub}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>

        {/* ===== PRIX ===== */}
        <section id="prix" className="py-16 sm:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-xl mb-10">
              <h2 className="font-display text-3xl font-bold text-forest-900 mb-3">Ce que vous gagnez</h2>
              <p className="text-forest-700/70">
                Au-delà de la dotation, un accompagnement pensé pour durer après la cérémonie.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PRIX.map((p) => (
                <div key={p.titre} className="surface-card rounded-lg p-5 hover:shadow-card-hover transition-shadow duration-200">
                  <div className="text-2xl mb-3">{p.ico}</div>
                  <h3 className="font-display font-bold text-base text-forest-900 mb-2">{p.titre}</h3>
                  <p className="text-sm text-forest-700/70 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>

            {/* Accompagnement */}
            <div className="mt-6 bg-leaf-100 border border-leaf-200 rounded-xl p-6 sm:p-8 grid sm:grid-cols-2 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-forest-700 text-white text-xs font-bold px-2.5 py-1 rounded-full mb-3">
                  Accompagnement post-concours
                </div>
                <h3 className="font-display font-bold text-xl text-forest-900 mb-2">Un mentorat qui dure</h3>
                <p className="text-sm text-forest-700/80">
                  3 à 6 mois d'accompagnement par des mentors issus du réseau du Comité de pilotage
                  et de ses partenaires institutionnels.
                </p>
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-forest-900 mb-2">Un accès direct aux investisseurs</h3>
                <p className="text-sm text-forest-700/80">
                  Mise en relation structurée avec les investisseurs et partenaires présents au Salon
                  — pas laissée au hasard des couloirs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CALENDRIER ===== */}
        <section id="calendrier" className="py-16 sm:py-20 bg-leaf-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-xl mb-10">
              <h2 className="font-display text-3xl font-bold text-forest-900 mb-3">Calendrier du concours</h2>
              <p className="text-forest-700/70">
                Le calendrier s'applique sans exception — toute modification est communiquée par voie électronique.
              </p>
            </div>

            <div className="relative">
              {/* Ligne verticale */}
              <div className="absolute left-[15px] top-4 bottom-4 w-px bg-leaf-200" aria-hidden />

              <ol className="space-y-0">
                {CALENDRIER.map((item, i) => (
                  <li key={i} className="relative pl-10 pb-8 last:pb-0">
                    {/* Dot */}
                    <div
                      className={`absolute left-0 top-1 w-[30px] h-[30px] rounded-full flex items-center justify-center border-2 z-10
                        ${item.done ? "bg-earth-700 border-earth-700" : item.highlight ? "bg-forest-700 border-forest-700" : "bg-white border-leaf-300"}`}
                    >
                      {item.done ? (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                          <path d="M2.5 6l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <div className={`w-2.5 h-2.5 rounded-full ${item.highlight ? "bg-white" : "bg-leaf-400"}`} />
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                      <time className={`text-xs font-bold uppercase tracking-wider flex-none w-28 ${item.highlight ? "text-earth-700" : "text-forest-700"}`}>
                        {item.date}
                      </time>
                      <div>
                        <span className={`font-semibold text-base block mb-0.5 ${item.highlight ? "text-earth-700" : "text-forest-900"}`}>
                          {item.event}
                        </span>
                        <span className="text-sm text-forest-700/60">{item.detail}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section id="faq" className="py-16 sm:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-xl mb-10">
              <h2 className="font-display text-3xl font-bold text-forest-900 mb-3">Questions fréquentes</h2>
              <p className="text-forest-700/70">
                Tout ce que vous devez savoir avant de candidater.
              </p>
            </div>
            <div className="max-w-3xl">
              <FaqAccordion />
              <p className="mt-8 text-sm text-forest-700/50">
                Une question non couverte ici ?{" "}
                <Link href="/contact" className="text-forest-700 underline underline-offset-2 hover:text-earth-700 transition-colors">
                  Écrivez-nous
                </Link>{" "}
                — nous répondons sous 48h.
              </p>
            </div>
          </div>
        </section>

        {/* ===== CTA FINAL ===== */}
        <section className="py-14 sm:py-18 bg-forest-900 circuit-bg relative overflow-hidden">
          <div className="absolute inset-0 bg-forest-900/95 pointer-events-none" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-leaf-400/15 border border-leaf-400/20 rounded-full px-3 py-1 text-xs font-semibold text-leaf-300 mb-5">
              Candidatures ouvertes jusqu'au 15 octobre 2026
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Prêt à concourir ?
            </h2>
            <p className="text-leaf-100/60 text-base mb-8 max-w-lg mx-auto">
              Comptez environ 20 minutes pour remplir le formulaire. Vous pouvez sauvegarder et revenir avant la clôture.
            </p>
            <Link href="/candidater" className="btn-primary text-sm inline-flex mx-auto">
              Déposer ma candidature
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-forest-900 border-t border-forest-800/60 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-leaf-100/40">
          <div>
            <div className="font-semibold text-leaf-100/60 mb-0.5">IA4EARTH Startup Challenge</div>
            <div>3ème édition du Salon de l'Économie Verte, Finance Responsable et Développement Durable</div>
          </div>
          <div className="flex flex-wrap gap-5 items-center">
            <Link href="/reglement" className="hover:text-leaf-300 transition-colors">Règlement</Link>
            <Link href="/#faq" className="hover:text-leaf-300 transition-colors">FAQ</Link>
            <Link href="/contact" className="hover:text-leaf-300 transition-colors">Contact</Link>
            <Link href="/jury" className="border border-leaf-400/20 rounded px-2.5 py-1 text-leaf-400/60 hover:text-leaf-300 hover:border-leaf-400/40 transition-colors text-xs font-medium">
              Espace jury
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
