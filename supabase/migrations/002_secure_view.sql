-- ============================================================
-- Migration 002 — Sécuriser la vue v_scores_moyens
--
-- Problème : la vue n'a pas de politique RLS propre. En PostgreSQL,
-- les vues s'exécutent dans le contexte du rôle appelant (SECURITY
-- INVOKER par défaut depuis PG15). Le rôle `anon` n'a donc aucun
-- droit sur les tables sous-jacentes (elles ont toutes RLS
-- service_role only). Mais la vue elle-même hérite des privilèges
-- GRANT par défaut accordés au rôle `public`, ce qui peut laisser
-- un chemin d'accès indirect via PostgREST.
--
-- Solution : révoquer explicitement l'accès public/anon à la vue,
-- et ne garder que le service_role.
-- ============================================================

-- Révoquer l'accès accordé par défaut au rôle public (inclut anon)
revoke all privileges on public.v_scores_moyens from public;
revoke all privileges on public.v_scores_moyens from anon;
revoke all privileges on public.v_scores_moyens from authenticated;

-- Accorder uniquement au service_role (utilisé par le back-office Next.js)
grant select on public.v_scores_moyens to service_role;

-- Même protection sur les tables sous-jacentes (redondant mais explicite)
revoke all privileges on public.evaluations from public;
revoke all privileges on public.evaluations from anon;
revoke all privileges on public.evaluations from authenticated;

revoke all privileges on public.candidatures from public;
revoke all privileges on public.candidatures from anon;
revoke all privileges on public.candidatures from authenticated;

revoke all privileges on public.jury from public;
revoke all privileges on public.jury from anon;
revoke all privileges on public.jury from authenticated;
