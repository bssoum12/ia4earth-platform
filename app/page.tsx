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

export default function Home() {
  return (
    <>
      <Navbar />
      <main>

        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden" style={{ background: "#060d07", minHeight: "92vh" }}>
          {/* Dot grid */}
          <div className="absolute inset-0 dot-grid opacity-60" />

          {/* Orbes flottantes */}
          <div className="orb animate-float" style={{ width: 500, height: 500, top: -100, left: -120, background: "radial-gradient(circle, rgba(140,198,63,0.18) 0%, transparent 70%)" }} />
          <div className="orb animate-float-slow" style={{ width: 400, height: 400, top: 60, right: -80, background: "radial-gradient(circle, rgba(42,191,160,0.14) 0%, transparent 70%)", animationDelay: "2s" }} />
          <div className="orb" style={{ width: 300, height: 300, bottom: -60, left: "40%", background: "radial-gradient(circle, rgba(140,198,63,0.1) 0%, transparent 70%)", animation: "float 11s ease-in-out infinite", animationDelay: "1s" }} />

          {/* Ligne scanline */}
          <div className="scan-line absolute inset-0 pointer-events-none overflow-hidden" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 flex flex-col lg:flex-row items-start gap-14 lg:gap-20">

            {/* Gauche */}
            <div className="flex-1 animate-fade-up">
              <div className="ai-tag mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-leaf-400 animate-pulse-slow" />
                3ème édition · Candidatures ouvertes
              </div>

              <h1 className="font-display font-black leading-[1.02] mb-6" style={{ fontSize: "clamp(2.6rem,5vw,4.2rem)" }}>
                <span style={{ color: "rgba(255,255,255,0.92)" }}>Votre startup a de</span>
                <br />
                <span className="text-gradient">l'impact.</span>
                <br />
                <span style={{ color: "rgba(255,255,255,0.55)", fontStyle: "italic" }}>Faites-le savoir.</span>
              </h1>

              <p className="text-base sm:text-lg mb-10 max-w-[50ch] leading-relaxed" style={{ color: "rgba(200,230,180,0.6)" }}>
                Le IA4EARTH Startup Challenge récompense les startups tunisiennes qui font
                avancer l'économie verte, la finance responsable et le développement durable —{" "}
                <strong style={{ color: "rgba(200,230,180,0.9)" }}>avec ou sans intelligence artificielle.</strong>
              </p>

              <div className="flex flex-wrap gap-3 mb-14">
                <Link href="/candidater" className="btn-ai">
                  Déposer ma candidature
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link href="/reglement" className="btn-ai-ghost">
                  Lire le règlement
                </Link>
              </div>

              {/* Compte à rebours */}
              <CountdownTimer />
            </div>

            {/* Droite — carte éligibilité glass */}
            <div className="w-full lg:w-[380px] shrink-0 animate-fade-up [animation-delay:120ms]" id="eligibilite">
              <div className="glass-card card-3d rounded-2xl overflow-hidden">
                <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(140,198,63,0.15)" }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 neon-glow" style={{ background: "rgba(140,198,63,0.15)", border: "1px solid rgba(140,198,63,0.3)" }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM4.5 8l2.5 2.5 4.5-4.5" stroke="#8CC63F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-display font-bold text-base leading-tight" style={{ color: "rgba(255,255,255,0.92)" }}>
                      Vous êtes éligible si…
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "rgba(140,198,63,0.6)" }}>4 critères de recevabilité</div>
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
                        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(140,198,63,0.15)", border: "1px solid rgba(140,198,63,0.35)" }}>
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                            <path d="M2.5 6l2.5 2.5 4.5-5" stroke="#8CC63F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div>
                          <span className="text-sm leading-snug" style={{ color: "rgba(220,240,200,0.85)" }}>{text}</span>
                          {ref && <span className="ml-1.5 text-2xs font-mono font-semibold" style={{ color: "rgba(140,198,63,0.45)" }}>({ref})</span>}
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(140,198,63,0.12)" }}>
                    <Link href="/candidater" className="btn-ai w-full justify-center">
                      Déposer ma candidature →
                    </Link>
                    <p className="text-2xs text-center mt-2" style={{ color: "rgba(140,198,63,0.35)" }}>
                      Clôture le 15 octobre 2026 à 23h59
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bas du hero — ligne de dégradé */}
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(140,198,63,0.3), transparent)" }} />
        </section>

        {/* ===== FRISE CHRONOLOGIQUE ===== */}
        <div className="py-10 overflow-x-auto" style={{ background: "#0a1309", borderTop: "1px solid rgba(140,198,63,0.1)", borderBottom: "1px solid rgba(140,198,63,0.1)" }}>
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
                  <div className="absolute top-[22px] left-[5%] right-[5%] h-px" style={{ background: "rgba(140,198,63,0.15)" }} aria-hidden />
                  <div className="absolute top-[22px] left-[5%] w-[30%] h-px" style={{ background: "linear-gradient(90deg, #8CC63F, rgba(42,191,160,0.6))" }} aria-hidden />

                  {steps.map((s, i) => (
                    <div key={i} className="relative flex flex-col items-center text-center flex-1 px-2">
                      <div className={`relative z-10 w-11 h-11 rounded-full flex items-center justify-center mb-3 border-2 shrink-0 ${s.done ? "neon-glow" : ""}`}
                        style={{
                          background: s.done ? "rgba(140,198,63,0.2)" : s.highlight ? "rgba(139,46,46,0.3)" : "rgba(22,55,24,0.6)",
                          border: `2px solid ${s.done ? "#8CC63F" : s.highlight ? "#8B2E2E" : "rgba(140,198,63,0.25)"}`,
                        }}
                      >
                        {s.done ? (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                            <path d="M3.5 8l3 3 6-6" stroke="#8CC63F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <span className="text-xs font-bold font-mono" style={{ color: s.highlight ? "#C46060" : "#8CC63F" }}>{i + 1}</span>
                        )}
                      </div>
                      <span className="font-display font-bold text-base sm:text-lg block leading-none mb-1" style={{ color: s.done ? "#8CC63F" : s.highlight ? "#C46060" : "rgba(255,255,255,0.85)" }}>
                        {s.date}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider block mb-0.5" style={{ color: s.highlight ? "#C46060" : "rgba(140,198,63,0.7)" }}>
                        {s.label}
                      </span>
                      <span className="text-2xs leading-tight hidden sm:block" style={{ color: "rgba(200,230,180,0.35)" }}>{s.sub}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>

        {/* ===== PRIX ===== */}
        <section id="prix" className="py-20" style={{ background: "#080d08" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-xl mb-12">
              <div className="ai-tag mb-4">Récompenses</div>
              <h2 className="font-display text-3xl font-bold mb-3" style={{ color: "rgba(255,255,255,0.92)" }}>
                Ce que vous <span className="text-gradient">gagnez</span>
              </h2>
              <p style={{ color: "rgba(200,230,180,0.5)" }}>
                Au-delà de la dotation, un accompagnement pensé pour durer après la cérémonie.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PRIX.map((p) => (
                <div key={p.titre} className="glass-card card-3d rounded-xl p-5 cursor-default">
                  <div className="text-3xl mb-4">{p.ico}</div>
                  <h3 className="font-display font-bold text-base mb-2" style={{ color: "rgba(255,255,255,0.9)" }}>{p.titre}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(200,230,180,0.55)" }}>{p.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 glass-card rounded-xl p-6 sm:p-8 grid sm:grid-cols-2 gap-6">
              <div>
                <div className="ai-tag mb-3">Accompagnement post-concours</div>
                <h3 className="font-display font-bold text-xl mb-2" style={{ color: "rgba(255,255,255,0.9)" }}>Un mentorat qui dure</h3>
                <p className="text-sm" style={{ color: "rgba(200,230,180,0.55)" }}>
                  3 à 6 mois d'accompagnement par des mentors issus du réseau du Comité de pilotage
                  et de ses partenaires institutionnels.
                </p>
              </div>
              <div>
                <h3 className="font-display font-bold text-xl mb-2" style={{ color: "rgba(255,255,255,0.9)" }}>Un accès direct aux investisseurs</h3>
                <p className="text-sm" style={{ color: "rgba(200,230,180,0.55)" }}>
                  Mise en relation structurée avec les investisseurs et partenaires présents au Salon
                  — pas laissée au hasard des couloirs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CALENDRIER ===== */}
        <section id="calendrier" className="py-20" style={{ background: "#060d07", borderTop: "1px solid rgba(140,198,63,0.08)" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-xl mb-12">
              <div className="ai-tag mb-4">Timeline</div>
              <h2 className="font-display text-3xl font-bold mb-3" style={{ color: "rgba(255,255,255,0.92)" }}>
                Calendrier du <span className="text-gradient">concours</span>
              </h2>
              <p style={{ color: "rgba(200,230,180,0.5)" }}>
                Le calendrier s'applique sans exception — toute modification est communiquée par voie électronique.
              </p>
            </div>

            <div className="relative max-w-2xl">
              <div className="absolute left-[14px] top-4 bottom-4 w-px" style={{ background: "linear-gradient(180deg, #8CC63F, rgba(42,191,160,0.3), transparent)" }} aria-hidden />

              <ol className="space-y-0">
                {CALENDRIER.map((item, i) => (
                  <li key={i} className="relative pl-10 pb-8 last:pb-0">
                    <div className={`absolute left-0 top-1 w-[28px] h-[28px] rounded-full flex items-center justify-center border z-10 ${item.done ? "neon-glow" : ""}`}
                      style={{
                        background: item.done ? "rgba(140,198,63,0.2)" : item.highlight ? "rgba(139,46,46,0.25)" : "rgba(22,55,24,0.8)",
                        border: `1px solid ${item.done ? "rgba(140,198,63,0.7)" : item.highlight ? "rgba(139,46,46,0.6)" : "rgba(140,198,63,0.2)"}`,
                      }}
                    >
                      {item.done ? (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                          <path d="M2.5 6l2.5 2.5 4.5-5" stroke="#8CC63F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <div className="w-2 h-2 rounded-full" style={{ background: item.highlight ? "#C46060" : "rgba(140,198,63,0.5)" }} />
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                      <time className="text-xs font-bold uppercase tracking-wider flex-none w-28" style={{ color: item.highlight ? "#C46060" : "#8CC63F" }}>
                        {item.date}
                      </time>
                      <div>
                        <span className="font-semibold text-base block mb-0.5" style={{ color: item.highlight ? "#C46060" : "rgba(255,255,255,0.85)" }}>
                          {item.event}
                        </span>
                        <span className="text-sm" style={{ color: "rgba(200,230,180,0.4)" }}>{item.detail}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section id="faq" className="py-20" style={{ background: "#080d08", borderTop: "1px solid rgba(140,198,63,0.08)" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-xl mb-12">
              <div className="ai-tag mb-4">FAQ</div>
              <h2 className="font-display text-3xl font-bold mb-3" style={{ color: "rgba(255,255,255,0.92)" }}>
                Questions <span className="text-gradient">fréquentes</span>
              </h2>
              <p style={{ color: "rgba(200,230,180,0.5)" }}>
                Tout ce que vous devez savoir avant de candidater.
              </p>
            </div>
            <div className="max-w-3xl">
              <FaqAccordion />
              <p className="mt-8 text-sm" style={{ color: "rgba(200,230,180,0.35)" }}>
                Une question non couverte ici ?{" "}
                <Link href="/contact" className="underline underline-offset-2 transition-colors" style={{ color: "rgba(140,198,63,0.7)" }}>
                  Écrivez-nous
                </Link>{" "}
                — nous répondons sous 48h.
              </p>
            </div>
          </div>
        </section>

        {/* ===== CTA FINAL ===== */}
        <section className="py-20 relative overflow-hidden" style={{ background: "#060d07", borderTop: "1px solid rgba(140,198,63,0.1)" }}>
          <div className="orb" style={{ width: 600, height: 600, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle, rgba(140,198,63,0.12) 0%, transparent 65%)" }} />
          <div className="scan-line absolute inset-0 pointer-events-none overflow-hidden" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <div className="ai-tag mx-auto mb-6" style={{ width: "fit-content" }}>
              Candidatures ouvertes jusqu'au 15 octobre 2026
            </div>
            <h2 className="font-display font-black mb-4" style={{ fontSize: "clamp(2rem,4vw,3.2rem)", color: "rgba(255,255,255,0.95)" }}>
              Prêt à <span className="text-gradient">concourir</span> ?
            </h2>
            <p className="text-base mb-10 max-w-lg mx-auto" style={{ color: "rgba(200,230,180,0.5)" }}>
              Comptez environ 20 minutes pour remplir le formulaire.
            </p>
            <Link href="/candidater" className="btn-ai text-sm inline-flex mx-auto">
              Déposer ma candidature
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: "#040a05", borderTop: "1px solid rgba(140,198,63,0.1)" }} className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm" style={{ color: "rgba(200,230,180,0.3)" }}>
          <div>
            <div className="font-semibold mb-0.5" style={{ color: "rgba(200,230,180,0.55)" }}>IA4EARTH Startup Challenge</div>
            <div>3ème édition du Salon de l'Économie Verte, Finance Responsable et Développement Durable</div>
          </div>
          <div className="flex flex-wrap gap-5 items-center">
            <Link href="/reglement" className="hover:text-leaf-300 transition-colors">Règlement</Link>
            <Link href="/#faq" className="hover:text-leaf-300 transition-colors">FAQ</Link>
            <Link href="/contact" className="hover:text-leaf-300 transition-colors">Contact</Link>
            <Link href="/jury" className="text-xs font-medium px-2.5 py-1 rounded transition-colors hover:text-leaf-300" style={{ border: "1px solid rgba(140,198,63,0.15)" }}>
              Espace jury
            </Link>
            <Link href="/admin" className="text-xs font-medium px-2.5 py-1 rounded transition-colors hover:text-leaf-300" style={{ border: "1px solid rgba(140,198,63,0.15)" }}>
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
