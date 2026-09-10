import Link from "next/link";
import Navbar from "@/components/Navbar";
import CountdownTimer from "@/components/CountdownTimer";

const CALENDRIER = [
  { date: "12 sept. 2026", event: "Lancement officiel", detail: "Ouverture des candidatures, 10h00", done: true },
  { date: "18 sept. 2026", event: "Webinaire informatif", detail: "18h00 — présentation du règlement et Q&R", done: false },
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
                  <a href="/reglement.pdf" target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">
                    Lire le règlement
                  </a>
                </div>

                {/* Compte à rebours */}
                <CountdownTimer />
              </div>

              {/* Droite — carte éligibilité */}
              <div className="animate-fade-up [animation-delay:120ms]" id="eligibilite">
                <div className="surface-card rounded-xl p-6 sm:p-7">
                  <div className="text-xs font-bold text-forest-700 uppercase tracking-wider mb-4">
                    Vous êtes éligible si…
                  </div>
                  <ul className="space-y-3.5 mb-6">
                    {[
                      "Votre startup est constituée, ou en cours de constitution avancée (Art. 4)",
                      "Vous avez une traction démontrable : premiers clients, CA, preuve de marché",
                      "Votre projet touche à l'économie verte, la finance responsable ou le DD",
                      "L'IA n'est pas requise — elle est un plus, pas une condition (Art. 3.2)",
                    ].map((item) => (
                      <li key={item} className="flex gap-3 text-sm text-forest-700">
                        <svg className="flex-none mt-0.5" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                          <circle cx="8" cy="8" r="7" fill="#EBF7D4" stroke="#8CC63F" strokeWidth="1.2"/>
                          <path d="M5 8l2 2 4-4" stroke="#2D6030" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="bg-earth-100 border border-earth-400/20 rounded-md p-3.5">
                    <div className="text-xs font-bold text-earth-700 mb-1">Webinaire informatif</div>
                    <div className="text-sm text-earth-800">
                      <strong>18 septembre 2026, 18h00</strong> — présentation du règlement et questions-réponses.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== BAND DATES CLÉS ===== */}
        <div className="bg-forest-900 text-white py-9">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              {[
                { n: "12 sept.", l: "Ouverture des candidatures" },
                { n: "16–25 oct.", l: "Présélection sur dossier" },
                { n: "28 oct.", l: "Annonce des finalistes" },
                { n: "5–6 nov.", l: "Finale & remise des prix" },
              ].map(({ n, l }) => (
                <div key={n}>
                  <span className="font-display font-bold text-xl sm:text-2xl text-leaf-300 block">{n}</span>
                  <span className="text-xs sm:text-sm text-leaf-100/50 mt-1 block">{l}</span>
                </div>
              ))}
            </div>
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
          <div className="flex gap-5">
            <a href="/reglement.pdf" className="hover:text-leaf-300 transition-colors">Règlement</a>
            <Link href="/#faq" className="hover:text-leaf-300 transition-colors">FAQ</Link>
            <a href="mailto:contact@ia4earth.tn" className="hover:text-leaf-300 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </>
  );
}
