-- ============================================================
-- Migration 004 — Rétablir le GROUP BY de la vue v_scores_moyens
--
-- Problème : la migration 003 redéfinit la vue avec des agrégats
-- (count, avg) mais sans clause GROUP BY. PostgreSQL rejette cette
-- requête ("column e.candidature_id must appear in the GROUP BY
-- clause or be used in an aggregate function") : la migration 003
-- échoue donc et ne peut pas être appliquée telle quelle.
--
-- Cette migration redéfinit la vue avec les mêmes règles que 003
-- (évaluations finalisées uniquement, hors calibration et hors
-- conflit d'intérêt) et le GROUP BY d'origine de schema.sql.
--
-- Note : l'interface admin calcule désormais les moyennes côté
-- serveur (lib/scores.ts) avec les mêmes règles ; cette vue reste
-- disponible pour les requêtes SQL directes (exports, contrôles).
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
  e.est_calibration = false
  and e.conflit_interet = false
  and e.statut = 'terminee'
group by e.candidature_id, e.etape, c.nom_startup, c.statut;

-- Réappliquer les droits (CREATE OR REPLACE peut les réinitialiser)
revoke all privileges on public.v_scores_moyens from public;
revoke all privileges on public.v_scores_moyens from anon;
revoke all privileges on public.v_scores_moyens from authenticated;
grant select on public.v_scores_moyens to service_role;
