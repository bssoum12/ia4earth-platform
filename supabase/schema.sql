-- ============================================================
-- IA4EARTH Startup Challenge — Schéma Supabase
-- Version : 1.0 — basé sur la section 8 du cahier des charges
-- ============================================================

-- Extension UUID
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLE : candidatures
-- ============================================================
create table if not exists public.candidatures (
  id                          uuid primary key default gen_random_uuid(),
  numero_dossier              text not null unique,

  -- Identité
  nom_startup                 text not null,
  statut_juridique            text not null check (statut_juridique in ('constituee', 'en_cours_constitution')),
  date_constitution           text not null,
  thematiques                 text[] not null check (array_length(thematiques, 1) >= 1),
  composante_ia               boolean not null default false,
  description_ia              text,

  -- Équipe (JSON array de {nom, role, linkedin?})
  equipe                      jsonb not null default '[]'::jsonb,

  -- Traction
  traction                    jsonb not null default '{}'::jsonb,
  -- structure : { clients_actifs, ca_12_mois, preuve_marche }

  -- Contact
  email_contact               text not null,

  -- Consentements (Art. 12, Art. 14)
  acceptation_reglement       boolean not null default false,
  autorisation_communication  boolean not null default false,

  -- Documents
  pitch_deck_url              text,
  documents_complementaires   jsonb default '[]'::jsonb,

  -- Statut de la candidature
  statut                      text not null default 'soumise'
                              check (statut in ('soumise', 'en_evaluation', 'preselectionnee', 'finaliste', 'laureat', 'non_retenue')),

  -- Horodatage
  date_soumission             timestamptz,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

-- Index utiles
create index on public.candidatures (statut);
create index on public.candidatures (email_contact);
create index on public.candidatures (created_at desc);

-- Trigger mise à jour automatique de updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger candidatures_updated_at
  before update on public.candidatures
  for each row execute function public.set_updated_at();

-- ============================================================
-- TABLE : jury
-- ============================================================
create table if not exists public.jury (
  id                  uuid primary key default gen_random_uuid(),
  nom                 text not null,
  email               text not null unique,
  etapes              text[] not null default array['preselection'],
  lien_acces_unique   text not null unique default encode(gen_random_bytes(32), 'hex'),
  actif               boolean not null default true,
  created_at          timestamptz not null default now()
);

-- ============================================================
-- TABLE : evaluations
-- ============================================================
create table if not exists public.evaluations (
  id                  uuid primary key default gen_random_uuid(),
  candidature_id      uuid not null references public.candidatures(id) on delete cascade,
  jury_id             uuid not null references public.jury(id) on delete cascade,
  etape               text not null check (etape in ('preselection', 'finale')),

  -- Grille Art. 8 (sur 100 pts total)
  score_impact        integer check (score_impact between 0 and 25),  -- 25 pts
  score_viabilite     integer check (score_viabilite between 0 and 25), -- 25 pts
  score_innovation    integer check (score_innovation between 0 and 20), -- 20 pts
  score_equipe        integer check (score_equipe between 0 and 15),  -- 15 pts
  score_scalabilite   integer check (score_scalabilite between 0 and 15), -- 15 pts

  -- Pénalité temps de pitch (Art. 6.2) — uniquement en finale
  penalite_temps      integer default 0 check (penalite_temps >= 0),

  -- Commentaires qualitatifs — JAMAIS exposés au candidat (Art. 7.2)
  commentaires        text,
  points_forts        text,
  points_vigilance    text,

  -- Déclaration non-conflit d'intérêt (Art. 7.2)
  conflit_interet     boolean not null default false,

  -- Statut
  statut              text not null default 'en_cours'
                      check (statut in ('en_cours', 'terminee')),

  -- Session de calibration (Art. 7.2) — non comptabilisée
  est_calibration     boolean not null default false,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  -- Un juré ne peut évaluer qu'une fois par candidature par étape
  unique (candidature_id, jury_id, etape)
);

create index on public.evaluations (candidature_id);
create index on public.evaluations (jury_id);
create index on public.evaluations (etape);

create trigger evaluations_updated_at
  before update on public.evaluations
  for each row execute function public.set_updated_at();

-- ============================================================
-- VUE : scores moyens par candidature (Art. 8 — moyenne arithmétique)
-- NOTE : les évaluations de calibration sont exclues du calcul
-- NOTE : les évaluations avec conflit d'intérêt sont automatiquement exclues
-- ============================================================
create or replace view public.v_scores_moyens as
select
  e.candidature_id,
  e.etape,
  c.nom_startup,
  c.statut,
  count(*) filter (where e.statut = 'terminee') as jurés_ayant_noté,
  round(avg(e.score_impact)::numeric, 2)      as moy_impact,
  round(avg(e.score_viabilite)::numeric, 2)   as moy_viabilite,
  round(avg(e.score_innovation)::numeric, 2)  as moy_innovation,
  round(avg(e.score_equipe)::numeric, 2)      as moy_equipe,
  round(avg(e.score_scalabilite)::numeric, 2) as moy_scalabilite,
  round(avg(
    coalesce(e.score_impact, 0)
    + coalesce(e.score_viabilite, 0)
    + coalesce(e.score_innovation, 0)
    + coalesce(e.score_equipe, 0)
    + coalesce(e.score_scalabilite, 0)
    - coalesce(e.penalite_temps, 0)
  )::numeric, 2) as score_total_moyen
from public.evaluations e
join public.candidatures c on c.id = e.candidature_id
where
  e.est_calibration = false      -- exclure sessions de calibration
  and e.conflit_interet = false  -- exclure jurés en conflit d'intérêt
  and e.statut = 'terminee'      -- [C-2] n'inclure que les évaluations finalisées (évite le biais COALESCE 0)
group by e.candidature_id, e.etape, c.nom_startup, c.statut;

-- ============================================================
-- NOTE : admin_users supprimée — l'auth admin utilise un cookie
-- SHA-256(ADMIN_SECRET), sans dépendance à auth.users.
-- ============================================================

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- candidatures : pas de lecture publique (les candidats n'ont pas de compte)
alter table public.candidatures enable row level security;
create policy "Service role full access"
  on public.candidatures for all
  to service_role using (true) with check (true);

-- evaluations : chaque juré ne voit que ses propres évaluations
alter table public.evaluations enable row level security;
create policy "Service role full access"
  on public.evaluations for all
  to service_role using (true) with check (true);

-- jury : admin seulement
alter table public.jury enable row level security;
create policy "Service role full access"
  on public.jury for all
  to service_role using (true) with check (true);

-- ============================================================
-- PRIVILEGE RESTRICTION : aucune lecture publique
-- Le service_role est le seul compte autorisé (back-office Next.js)
-- ============================================================

revoke all privileges on public.candidatures   from public;
revoke all privileges on public.candidatures   from anon;
revoke all privileges on public.candidatures   from authenticated;

revoke all privileges on public.evaluations    from public;
revoke all privileges on public.evaluations    from anon;
revoke all privileges on public.evaluations    from authenticated;

revoke all privileges on public.jury           from public;
revoke all privileges on public.jury           from anon;
revoke all privileges on public.jury           from authenticated;

revoke all privileges on public.v_scores_moyens from public;
revoke all privileges on public.v_scores_moyens from anon;
revoke all privileges on public.v_scores_moyens from authenticated;
grant select on public.v_scores_moyens to service_role;

-- ============================================================
-- STORAGE : bucket pitch-decks
-- (À créer manuellement dans la console Supabase ou via CLI)
-- insert into storage.buckets (id, name, public) values ('pitch-decks', 'pitch-decks', false);
-- ============================================================
