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
  { ico: "🥇", titre: "1er Prix", desc: "Dotation principale, visibilité maximum sur les supports du Salon et dans les médias partenaires." },
  { ico: "🌿", titre: "Prix Impact Environnemental", desc: "Récompense la startup dont l'impact environnemental et social mesuré est le plus significatif." },
  { ico: "💡", titre: "Prix Coup de Cœur du Jury", desc: "Attribué sur critères qualitatifs par le jury pour reconnaître une innovation particulièrement marquante." },
  { ico: "👥", titre: "Prix du Public", desc: "Plébiscité par les visiteurs du Salon lors de la cérémonie de remise des prix." },
];

/* Feuilles SVG décoratives — alignées avec le post LinkedIn officiel */
function FloatingLeaf({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} aria-hidden>
      <path d="M30 75 C30 75 5 55 5 30 C5 10 18 2 30 2 C42 2 55 10 55 30 C55 55 30 75 30 75Z" fill="#8CC63F" fillOpacity="0.35" />
      <path d="M30 75 C30 75 5 55 5 30 C5 10 18 2 30 2" stroke="#56901A" strokeWidth="1.2" strokeOpacity="0.5" fill="none" />
      <line x1="30" y1="8" x2="30" y2="72" stroke="#56901A" strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="30" y1="25" x2="12" y2="42" stroke="#56901A" strokeWidth="0.6" strokeOpacity="0.3" />
      <line x1="30" y1="25" x2="48" y2="42" stroke="#56901A" strokeWidth="0.6" strokeOpacity="0.3" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main>

        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden circuit-bg" style={{ background: "linear-gradient(135deg, #eef8de 0%, #d8f0a8 40%, #e8f8cc 100%)" }}>
          {/* Overlay gradient */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(238,248,222,0.9) 0%, rgba(216,240,168,0.7) 60%, rgba(232,248,204,0.85) 100%)" }} />

          {/* Feuilles décoratives flottantes */}
          <FloatingLeaf className="absolute animate-float" style={{ width: 90, height: 120, top: 40, right: "12%", opacity: 0.7, animationDelay: "0s" }} />
          <FloatingLeaf className="absolute animate-float-slow" style={{ width: 60, height: 80, top: 20, right: "6%", opacity: 0.5, animationDelay: "1.5s", transform: "rotate(25deg)" }} />
          <FloatingLeaf className="absolute animate-float" style={{ width: 50, height: 65, bottom: 80, left: "8%", opacity: 0.4, animationDelay: "2s", transform: "rotate(-30deg) scaleX(-1)" }} />
          <FloatingLeaf className="absolute animate-float-slow" style={{ width: 40, height: 55, top: 120, left: "3%", opacity: 0.35, animationDelay: "3s", transform: "rotate(15deg)" }} />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
            <div className="grid lg:grid-cols-[1.15fr_0.9fr] gap-12 lg:gap-16 items-start">

              {/* Gauche */}
              <div className="animate-fade-up">
                <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: "rgba(45,96,48,0.1)", border: "1px solid rgba(45,96,48,0.2)", color: "#2D6030" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-leaf-400 animate-pulse-slow" />
                  3ème édition · Salon ÉV FR DD · Candidatures ouvertes
                </div>

                {/* Thème officiel */}
                <p className="text-sm font-semibold mb-2 tracking-wide" style={{ color: "#2D6030" }}>
                  3ème édition sous le thème :
                </p>
                <h1 className="font-display font-black leading-[1.05] mb-3" style={{ fontSize: "clamp(2.2rem,4.5vw,3.6rem)", color: "#8B2E2E" }}>
                  IA4EARTH : Innover pour<br />un monde durable
                </h1>
                <p className="font-display font-semibold text-lg mb-6" style={{ color: "#2D6030" }}>
                  Startup Challenge — Candidatures ouvertes
                </p>

                <p className="text-base mb-3 max-w-[50ch] leading-relaxed" style={{ color: "#1F4820" }}>
                  Le IA4EARTH Startup Challenge récompense les startups tunisiennes qui font
                  avancer l'économie verte, la finance responsable et le développement durable —{" "}
                  <strong>avec ou sans intelligence artificielle.</strong>
                </p>

                {/* Lieu + date (alignés sur le post) */}
                <div className="flex flex-col gap-2 mb-8">
                  <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#2D6030" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden><rect x="3" y="4" width="18" height="18" rx="2" stroke="#2D6030" strokeWidth="1.8"/><line x1="3" y1="9" x2="21" y2="9" stroke="#2D6030" strokeWidth="1.8"/><line x1="8" y1="2" x2="8" y2="6" stroke="#2D6030" strokeWidth="1.8" strokeLinecap="round"/><line x1="16" y1="2" x2="16" y2="6" stroke="#2D6030" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    5–6 Novembre 2026
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#2D6030" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#2D6030" strokeWidth="1.8"/><circle cx="12" cy="9" r="2.5" stroke="#2D6030" strokeWidth="1.8"/></svg>
                    Centre International des Congrès – Siège de l'UTICA, Tunis
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-10">
                  <Link href="/candidater" className="btn-primary">
                    Déposer ma candidature
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                  <Link href="/reglement" className="btn-ghost">
                    Lire le règlement
                  </Link>
                </div>

                {/* Compte à rebours */}
                <CountdownTimer />
              </div>

              {/* Droite — carte éligibilité */}
              <div className="animate-fade-up [animation-delay:120ms]" id="eligibilite">
                <div className="rounded-2xl overflow-hidden shadow-card-hover" style={{ border: "1px solid rgba(140,198,63,0.4)", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)" }}>
                  <div className="px-6 py-4 flex items-center gap-3" style={{ background: "#2D6030" }}>
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM4.5 8l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-display font-bold text-base leading-tight">Vous êtes éligible si…</div>
                      <div className="text-xs mt-0.5" style={{ color: "rgba(140,198,63,0.8)" }}>4 critères de recevabilité</div>
                    </div>
                  </div>

                  <div className="px-6 py-5">
                    <ul className="space-y-4">
                      {[
                        { text: "Votre startup est constituée, ou en cours de constitution avancée", ref: "Art. 4" },
                        { text: "Vous avez une traction démontrable : premiers clients, CA, preuve de marché", ref: null },
                        { text: "Votre projet touche à l'économie verte, la finance responsable ou le DD", ref: "Art. 3.2" },
                        { text: "L'IA n'est pas requise — elle est un plus, pas une condition", ref: "Art. 3.2" },
                      ].map(({ text, ref }, i) => (
                        <li key={i} className="flex gap-3 items-start">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "#EBF7D4", border: "1px solid #B8E070" }}>
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                              <path d="M2.5 6l2.5 2.5 4.5-5" stroke="#2D6030" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div>
                            <span className="text-sm leading-snug" style={{ color: "#1F4820" }}>{text}</span>
                            {ref && <span className="ml-1.5 text-2xs font-mono font-semibold" style={{ color: "rgba(45,96,48,0.45)" }}>({ref})</span>}
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 pt-4" style={{ borderTop: "1px solid #EBF7D4" }}>
                      <Link href="/candidater" className="btn-primary w-full justify-center">
                        Déposer ma candidature →
                      </Link>
                      <p className="text-2xs text-center mt-2" style={{ color: "rgba(45,96,48,0.45)" }}>
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
                  <div className="absolute top-[22px] left-[5%] right-[5%] h-px bg-forest-700" aria-hidden />
                  <div className="absolute top-[22px] left-[5%] w-[30%] h-px bg-leaf-400" aria-hidden />
                  {steps.map((s, i) => (
                    <div key={i} className="relative flex flex-col items-center text-center flex-1 px-2">
                      <div className={`relative z-10 w-11 h-11 rounded-full flex items-center justify-center mb-3 border-2 shrink-0 ${s.done ? "bg-leaf-400 border-leaf-400" : s.highlight ? "bg-earth-700 border-earth-600 shadow-lg shadow-earth-700/40" : "bg-forest-800 border-forest-600"}`}>
                        {s.done ? (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                            <path d="M3.5 8l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <span className={`text-xs font-bold font-mono ${s.highlight ? "text-white" : "text-leaf-400"}`}>{i + 1}</span>
                        )}
                      </div>
                      <span className={`font-display font-bold text-base sm:text-lg block leading-none mb-1 ${s.done ? "text-leaf-400" : s.highlight ? "text-earth-400" : "text-white"}`}>{s.date}</span>
                      <span className={`text-xs font-bold uppercase tracking-wider block mb-0.5 ${s.highlight ? "text-earth-400" : "text-leaf-100/80"}`}>{s.label}</span>
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
              <h2 className="font-display text-3xl font-bold mb-3" style={{ color: "#8B2E2E" }}>Ce que vous gagnez</h2>
              <p className="text-forest-700/70">Au-delà de la dotation, un accompagnement pensé pour durer après la cérémonie.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PRIX.map((p) => (
                <div key={p.titre} className="surface-card card-3d rounded-xl p-5 hover:shadow-card-hover transition-all duration-300 cursor-default">
                  <div className="text-2xl mb-3">{p.ico}</div>
                  <h3 className="font-display font-bold text-base mb-2 text-forest-900">{p.titre}</h3>
                  <p className="text-sm text-forest-700/70 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl p-6 sm:p-8 grid sm:grid-cols-2 gap-6" style={{ background: "linear-gradient(135deg, #eef8de, #d8f0a8)", border: "1px solid #B8E070" }}>
              <div>
                <div className="inline-flex items-center gap-2 mb-3 px-2.5 py-1 rounded-full text-xs font-bold text-white" style={{ background: "#2D6030" }}>
                  Accompagnement post-concours
                </div>
                <h3 className="font-display font-bold text-xl text-forest-900 mb-2">Un mentorat qui dure</h3>
                <p className="text-sm text-forest-700/80">3 à 6 mois d'accompagnement par des mentors issus du réseau du Comité de pilotage et de ses partenaires institutionnels.</p>
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-forest-900 mb-2">Un accès direct aux investisseurs</h3>
                <p className="text-sm text-forest-700/80">Mise en relation structurée avec les investisseurs et partenaires présents au Salon — pas laissée au hasard des couloirs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CALENDRIER ===== */}
        <section id="calendrier" className="py-16 sm:py-20 circuit-bg" style={{ background: "#eef8de" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-xl mb-10">
              <h2 className="font-display text-3xl font-bold mb-3" style={{ color: "#8B2E2E" }}>Calendrier du concours</h2>
              <p className="text-forest-700/70">Le calendrier s'applique sans exception — toute modification est communiquée par voie électronique.</p>
            </div>
            <div className="relative max-w-2xl">
              <div className="absolute left-[15px] top-4 bottom-4 w-px bg-leaf-200" aria-hidden />
              <ol className="space-y-0">
                {CALENDRIER.map((item, i) => (
                  <li key={i} className="relative pl-10 pb-8 last:pb-0">
                    <div className={`absolute left-0 top-1 w-[30px] h-[30px] rounded-full flex items-center justify-center border-2 z-10 ${item.done ? "bg-earth-700 border-earth-700" : item.highlight ? "bg-forest-700 border-forest-700" : "bg-white border-leaf-300"}`}>
                      {item.done ? (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                          <path d="M2.5 6l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <div className={`w-2.5 h-2.5 rounded-full ${item.highlight ? "bg-white" : "bg-leaf-400"}`} />
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                      <time className={`text-xs font-bold uppercase tracking-wider flex-none w-28 ${item.highlight ? "text-earth-700" : "text-forest-700"}`}>{item.date}</time>
                      <div>
                        <span className={`font-semibold text-base block mb-0.5 ${item.highlight ? "text-earth-700" : "text-forest-900"}`}>{item.event}</span>
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
              <h2 className="font-display text-3xl font-bold mb-3" style={{ color: "#8B2E2E" }}>Questions fréquentes</h2>
              <p className="text-forest-700/70">Tout ce que vous devez savoir avant de candidater.</p>
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
        <section className="py-14 sm:py-20 relative overflow-hidden circuit-bg" style={{ background: "#2D6030" }}>
          <div className="absolute inset-0" style={{ background: "rgba(45,96,48,0.92)" }} />
          {/* Feuilles décoratives */}
          <FloatingLeaf className="absolute animate-float-slow" style={{ width: 120, height: 160, top: -20, right: "5%", opacity: 0.2, animationDelay: "1s" }} />
          <FloatingLeaf className="absolute animate-float" style={{ width: 80, height: 110, bottom: -10, left: "4%", opacity: 0.15, animationDelay: "2s", transform: "rotate(-20deg) scaleX(-1)" }} />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: "rgba(140,198,63,0.2)", border: "1px solid rgba(140,198,63,0.3)", color: "#8CC63F" }}>
              Candidatures ouvertes jusqu'au 15 octobre 2026
            </div>
            <h2 className="font-display font-black text-white mb-4" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
              Prêt à concourir ?
            </h2>
            <p className="text-leaf-100/70 text-base mb-8 max-w-lg mx-auto">
              Comptez environ 20 minutes pour remplir le formulaire. Candidatures closes le 15 octobre 2026 à 23h59.
            </p>
            <Link href="/candidater" className="btn-primary inline-flex mx-auto" style={{ background: "#8B2E2E", boxShadow: "0 4px 20px rgba(139,46,46,0.4)" }}>
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
            <Link href="/jury" className="border border-leaf-400/20 rounded px-2.5 py-1 text-leaf-400/60 hover:text-leaf-300 hover:border-leaf-400/40 transition-colors text-xs font-medium">Espace jury</Link>
            <Link href="/admin" className="border border-leaf-400/20 rounded px-2.5 py-1 text-leaf-400/60 hover:text-leaf-300 hover:border-leaf-400/40 transition-colors text-xs font-medium">Admin</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
