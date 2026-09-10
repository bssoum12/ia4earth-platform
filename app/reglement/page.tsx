import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Règlement — IA4EARTH Startup Challenge 2026",
  description:
    "Règlement officiel du IA4EARTH Startup Challenge, 3ème édition du Salon de l'Économie Verte, Finance Responsable et Développement Durable.",
};

interface ArticleProps {
  num: string;
  title: string;
  children: React.ReactNode;
}

function Article({ num, title, children }: ArticleProps) {
  return (
    <section id={`art-${num}`} className="scroll-mt-24">
      <h2 className="text-lg font-display font-bold text-forest-900 mb-3 flex items-baseline gap-3">
        <span className="text-xs font-mono font-semibold text-earth-700 bg-earth-700/10 px-2 py-0.5 rounded shrink-0">
          Art. {num}
        </span>
        {title}
      </h2>
      <div className="text-sm text-forest-700 leading-relaxed space-y-2 pl-2 border-l-2 border-leaf-200">
        {children}
      </div>
    </section>
  );
}

const TOC = [
  { num: "1",  title: "Objet et organisateurs" },
  { num: "2",  title: "Contexte et thématiques" },
  { num: "3",  title: "Conditions de participation" },
  { num: "4",  title: "Profil des candidats" },
  { num: "5",  title: "Calendrier du concours" },
  { num: "6",  title: "Déroulement de la finale" },
  { num: "7",  title: "Jury et gouvernance" },
  { num: "8",  title: "Grille d'évaluation" },
  { num: "9",  title: "Prix et récompenses" },
  { num: "10", title: "Accompagnement post-concours" },
  { num: "11", title: "Propriété intellectuelle" },
  { num: "12", title: "Utilisation de l'image" },
  { num: "13", title: "Décisions du jury" },
  { num: "14", title: "Acceptation du règlement" },
];

export default function ReglementPage() {
  return (
    <div className="min-h-screen bg-[#F4FBEA]">
      {/* Header */}
      <header className="bg-[#163718] text-white px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-xs text-leaf-400 font-mono uppercase tracking-widest mb-2">
            3ème édition · Salon de l'Économie Verte · 2026
          </div>
          <h1 className="text-3xl font-display font-bold mb-2">
            Règlement du concours
          </h1>
          <p className="text-white/60 text-sm">
            IA4EARTH Startup Challenge — Innover pour un monde durable
          </p>
          <p className="text-white/40 text-xs mt-2">
            5-6 novembre 2026 · Centre International des Congrès (UTICA), Tunis
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10 flex gap-10">
        {/* Table des matières sticky */}
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-24 surface-card p-4">
            <p className="text-xs font-bold text-forest-900 uppercase tracking-wider mb-3">
              Articles
            </p>
            <nav className="space-y-1">
              {TOC.map(({ num, title }) => (
                <a
                  key={num}
                  href={`#art-${num}`}
                  className="flex items-start gap-2 text-xs text-forest-700 hover:text-forest-900 transition-colors py-0.5"
                >
                  <span className="font-mono text-earth-700 w-6 shrink-0 mt-px">{num}.</span>
                  <span>{title}</span>
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Corps */}
        <main className="flex-1 space-y-10">

          <Article num="1" title="Objet et organisateurs">
            <p>
              Le présent règlement a pour objet de définir les conditions de participation,
              le déroulement, les modalités d'évaluation et les récompenses du concours
              « IA4EARTH Startup Challenge » (ci-après « le Concours »), organisé dans le
              cadre de la 3ème édition du Salon de l'Économie Verte, de la Finance
              Responsable et du Développement Durable, sur le thème{" "}
              <strong>« IA4EARTH : Innover pour un monde durable »</strong>.
            </p>
            <p>
              Le Concours est organisé par le Comité de pilotage du Salon, en partenariat
              avec les institutions et entreprises mentionnées à l'Article 12.
            </p>
            <p>
              La participation au Concours implique l'acceptation pleine et entière du
              présent règlement par le candidat (Article 14).
            </p>
          </Article>

          <Article num="2" title="Contexte et thématiques du Salon">
            <p>
              Le Concours vise à identifier, valoriser et accompagner des startups et
              porteurs de projets proposant des solutions innovantes face aux enjeux
              environnementaux, sociétaux et économiques actuels, en mobilisant
              l'intelligence artificielle comme un levier — parmi d'autres — de
              transformation durable.
            </p>
          </Article>

          <Article num="3" title="Conditions de participation et éligibilité">
            <h3 className="font-semibold text-forest-900 mt-2">3.1 — Qui peut participer</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Startups constituées juridiquement, ou en cours de constitution avancée.</li>
              <li>
                En phase de commercialisation ou de croissance, avec une traction
                démontrable (premiers clients, chiffre d'affaires, preuve de marché).
              </li>
              <li>Équipes de 1 à 5 personnes ; candidatures individuelles ou collectives.</li>
              <li>
                Tout membre du jury, du Comité de pilotage ou du personnel organisateur,
                ainsi que leurs proches directs, ne peut candidater au Concours.
              </li>
            </ul>
            <h3 className="font-semibold text-forest-900 mt-3">3.2 — Thématiques éligibles</h3>
            <p>
              Sont éligibles les projets et startups s'inscrivant dans au moins une des
              thématiques suivantes :
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Économie verte</strong></li>
              <li><strong>Finance responsable</strong></li>
              <li><strong>Développement durable</strong></li>
            </ul>
            <p>
              L'intelligence artificielle n'est pas un critère obligatoire de participation
              ou de sélection. Les projets ne comportant pas de composante IA sont acceptés
              dès lors qu'ils répondent à l'une des thématiques ci-dessus. Lorsqu'une
              composante IA est présente, elle est évaluée sur ses mérites et sa pertinence
              réelle (voir Article 8), et non comme un simple élément de conformité.
            </p>
          </Article>

          <Article num="4" title="Profil des candidats et stade de maturité">
            <p>
              Le Concours cible les startups constituées juridiquement, ou en cours de
              constitution avancée, en phase de commercialisation ou de croissance, avec
              une traction démontrable (premiers clients, chiffre d'affaires, preuve de
              marché).
            </p>
            <p>Le jury évalue :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>La viabilité du modèle économique.</li>
              <li>L'impact environnemental ou social déjà réalisé et mesurable.</li>
              <li>La capacité d'exécution de l'équipe.</li>
              <li>Le potentiel de scalabilité, d'innovation et de différenciation.</li>
            </ul>
            <p>
              La vérification de la recevabilité du dossier est effectuée par la commission
              de présélection (Article 5, 16-25 octobre) ; les organisateurs se réservent
              le droit d'échanger avec le candidat si le dossier déposé ne correspond
              manifestement pas au profil attendu.
            </p>
          </Article>

          <Article num="5" title="Calendrier du concours">
            <p>
              Le calendrier ci-dessous s'applique sans exception. Toute modification sera
              communiquée aux candidats par voie électronique dans les meilleurs délais
              (voir Article 13).
            </p>
            <div className="mt-3 rounded-lg overflow-hidden border border-leaf-200">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-leaf-100 text-forest-900">
                    <th className="text-left px-4 py-2 font-semibold">Étape</th>
                    <th className="text-left px-4 py-2 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-leaf-100">
                  {[
                    ["Lancement officiel — ouverture des candidatures", "12 septembre 2026, 10:00"],
                    ["Clôture des candidatures (stricte, sans prolongation)", "15 octobre 2026, 23:59"],
                    ["Présélection sur dossier", "16 – 25 octobre 2026"],
                    ["Annonce des finalistes", "28 octobre 2026"],
                    ["Finale — pitchs en direct", "5 – 6 novembre 2026"],
                    ["Remise des prix", "6 novembre 2026, 15:00"],
                  ].map(([etape, date]) => (
                    <tr key={etape} className="bg-white/60">
                      <td className="px-4 py-2 text-forest-900">{etape}</td>
                      <td className="px-4 py-2 font-mono text-forest-700 whitespace-nowrap">{date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Article>

          <Article num="6" title="Déroulement de la finale">
            <h3 className="font-semibold text-forest-900 mt-2">6.1 — Format</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Supports autorisés : diaporama et/ou démonstration produit, sous réserve
                de faisabilité technique sur place.
              </li>
              <li>Langue de présentation : français, arabe ou anglais.</li>
              <li>Séance de questions-réponses avec le jury : 3 à 5 minutes.</li>
            </ul>
            <h3 className="font-semibold text-forest-900 mt-3">6.2 — Temps de pitch et pénalités</h3>
            <p>
              La durée de présentation (pitch) est fixée à{" "}
              <strong>5 minutes maximum</strong>, chronométrées, avec un signal
              d'avertissement à 4 minutes.
            </p>
            <p>
              Tout dépassement du temps imparti pourra entraîner une pénalité dans la
              notation, appliquée à la discrétion du jury (voir Article 8).
            </p>
          </Article>

          <Article num="7" title="Jury et gouvernance">
            <h3 className="font-semibold text-forest-900 mt-2">7.1 — Composition</h3>
            <p>
              Un jury de présélection, distinct du jury de finale (avec chevauchement
              partiel possible), examine l'ensemble des candidatures reçues.
            </p>
            <p>Le jury de finale comprend 5 à 7 membres, dont :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Un(e) président(e) de jury, désigné(e) par le Comité de pilotage,
                disposant d'une voix prépondérante en cas d'égalité.
              </li>
              <li>1 à 2 représentants du Comité de pilotage du Salon.</li>
              <li>
                1 à 2 experts thématiques (économie verte, finance durable, ou
                intelligence artificielle selon le profil des candidats).
              </li>
              <li>1 représentant du monde académique.</li>
              <li>1 investisseur ou représentant d'institution financière.</li>
              <li>1 représentant de partenaire institutionnel.</li>
            </ul>
            <h3 className="font-semibold text-forest-900 mt-3">7.2 — Règles de gouvernance et de déontologie</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Les délibérations du jury sont confidentielles ; les décisions sont sans
                appel (voir également Article 13).
              </li>
              <li>
                Tout membre du jury ayant un lien direct (personnel, professionnel ou
                financier) avec un candidat doit se déporter de l'évaluation du projet
                concerné.
              </li>
              <li>
                En cas d'égalité de notes entre deux projets, le président du jury dispose
                d'une voix prépondérante.
              </li>
              <li>
                Une charte de confidentialité et de non-conflit d'intérêt est signée par
                chaque membre du jury avant le début du processus d'évaluation.
              </li>
              <li>
                Une session de calibration du jury (30–45 min) est organisée avant chaque
                phase de notation, afin d'harmoniser la lecture des critères entre
                évaluateurs.
              </li>
            </ul>
          </Article>

          <Article num="8" title="Critères et grille d'évaluation">
            <p>
              Chaque membre du jury note individuellement chaque candidature ; la note
              finale par critère est la moyenne arithmétique des notes individuelles.
            </p>
            <div className="mt-3 rounded-lg overflow-hidden border border-leaf-200">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-leaf-100 text-forest-900">
                    <th className="text-left px-4 py-2 font-semibold">Critère</th>
                    <th className="text-right px-4 py-2 font-semibold">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-leaf-100">
                  {[
                    ["Impact environnemental / social réalisé et mesurable", 25],
                    ["Viabilité économique et modèle d'affaires", 25],
                    ["Innovation technologique et pertinence du modèle", 20],
                    ["Qualité de l'équipe et capacité d'exécution", 15],
                    ["Potentiel de scalabilité, innovation et différenciation", 15],
                  ].map(([label, pts]) => (
                    <tr key={label as string} className="bg-white/60">
                      <td className="px-4 py-2 text-forest-900">{label}</td>
                      <td className="px-4 py-2 text-right font-mono font-bold text-earth-700">{pts}</td>
                    </tr>
                  ))}
                  <tr className="bg-leaf-50">
                    <td className="px-4 py-2 font-bold text-forest-900">TOTAL</td>
                    <td className="px-4 py-2 text-right font-mono font-bold text-forest-900">100</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2">
              Un dépassement du temps de pitch (Article 6.2) pourra entraîner une pénalité
              additionnelle.
            </p>
          </Article>

          <Article num="9" title="Prix et récompenses">
            <div className="mt-2 rounded-lg overflow-hidden border border-leaf-200">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-leaf-100 text-forest-900">
                    <th className="text-left px-4 py-2 font-semibold">Prix</th>
                    <th className="text-left px-4 py-2 font-semibold">Composition de la récompense</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-leaf-100">
                  {[
                    ["1er Prix", "Dotation financière, mise en relation investisseurs, médiatisation"],
                    ["Prix Impact Environnemental", "Mention spéciale pour le projet à plus fort impact mesurable"],
                    ["Prix Coup de Cœur du Jury", "Reconnaissance discrétionnaire, sans critère prédéfini"],
                    ["Prix du Public (optionnel)", "Vote du public présent au Salon, sous réserve de validation par le Comité"],
                  ].map(([prix, desc]) => (
                    <tr key={prix} className="bg-white/60">
                      <td className="px-4 py-2 font-semibold text-forest-900 whitespace-nowrap">{prix}</td>
                      <td className="px-4 py-2 text-forest-700">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2">
              La liste précise et définitive des prix sera communiquée avant l'ouverture
              des candidatures et pourra être enrichie en fonction des partenariats conclus
              par les organisateurs.
            </p>
          </Article>

          <Article num="10" title="Accompagnement post-concours">
            <p>Au-delà de la remise des prix, les lauréats bénéficient :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                D'un programme de mentorat de 3 à 6 mois, avec des mentors issus du réseau
                du Comité de pilotage et des partenaires.
              </li>
              <li>
                D'une mise en relation structurée avec les investisseurs et partenaires
                présents au Salon.
              </li>
              <li>
                D'un accès privilégié à la 4ème édition du Salon (visibilité en tant
                qu'exposant ou intervenant).
              </li>
              <li>
                D'une valorisation médiatique continue, au-delà du jour de la remise des
                prix, via les canaux de communication du Salon.
              </li>
            </ul>
            <p>
              La mise en œuvre de ces engagements est conditionnée à la confirmation des
              partenariats correspondants (mentorat, mise en relation investisseurs) par le
              Comité de pilotage.
            </p>
          </Article>

          <Article num="11" title="Propriété intellectuelle et confidentialité">
            <p>
              Chaque candidat demeure seul propriétaire de son projet, de ses idées et de
              la propriété intellectuelle associée. La participation au Concours n'emporte
              aucune cession de droits au profit des organisateurs.
            </p>
            <p>
              Les membres du jury et les organisateurs s'engagent à respecter la
              confidentialité des informations sensibles communiquées par les candidats et
              à ne pas les divulguer à des tiers non autorisés.
            </p>
          </Article>

          <Article num="12" title="Utilisation de l'image et communication">
            <p>
              Les candidats autorisent les organisateurs à utiliser le nom du projet, son
              logo (si existant) et un résumé de sa présentation à des fins de
              communication autour du Salon et du Concours, sauf demande contraire expresse
              formulée par écrit.
            </p>
          </Article>

          <Article num="13" title="Décisions du jury, réclamations et dispositions finales">
            <p>
              Les décisions du jury, à chaque étape du processus (présélection et finale),
              sont <strong>définitives et sans appel</strong>. La grille d'évaluation étant
              transparente et communiquée aux candidats, aucune contestation individuelle
              des notes attribuées ne pourra être examinée après l'annonce des résultats.
            </p>
            <p>
              Les organisateurs se réservent le droit de modifier le présent règlement ou
              le calendrier du Concours si les circonstances l'exigent. Toute modification
              sera communiquée aux candidats par voie électronique dans les meilleurs
              délais.
            </p>
          </Article>

          <Article num="14" title="Acceptation du règlement">
            <p>
              Le dépôt d'une candidature au Concours IA4EARTH Startup Challenge implique
              l'acceptation pleine et entière du présent règlement par le candidat, sans
              réserve.
            </p>
            <p>
              Pour toute question relative au présent règlement, contactez le comité
              d'organisation à{" "}
              <a
                href="mailto:contact@ia4earth.tn"
                className="text-forest-700 underline hover:text-forest-900"
              >
                contact@ia4earth.tn
              </a>
              .
            </p>
          </Article>

          {/* CTA */}
          <div className="surface-card text-center py-8">
            <p className="text-forest-700 text-sm mb-4">
              Prêt à soumettre votre candidature ?
            </p>
            <Link href="/candidater" className="btn-primary">
              Candidater maintenant →
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
