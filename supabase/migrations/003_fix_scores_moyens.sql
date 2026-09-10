-- ============================================================
-- Migration 003 — Corriger la vue v_scores_moyens
--
-- Problème [C-2] : la vue incluait les évaluations `en_cours`
-- dans le calcul des moyennes. Le COALESCE(score, 0) traitait
-- les critères non notés comme 0, biaisiant fortement les scores.
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
  and e.statut = 'terminee';  -- n'inclure que les évaluations finalisées

-- Réappliquer les droits (CREATE OR REPLACE les révoque)
revoke all privileges on public.v_scores_moyens from public;
revoke all privileges on public.v_scores_moyens from anon;
revoke all privileges on public.v_scores_moyens from authenticated;
grant select on public.v_scores_moyens to service_role;
