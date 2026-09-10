-- Migration 001 — Correction de l'enum statut des candidatures
-- Contexte : le CHECK constraint initial contenait des valeurs manquantes (en_evaluation, laureat)
--             et une faute de frappe (preselectionee → preselectionnee).
-- À exécuter une seule fois via la console Supabase SQL Editor.

-- 1. Supprimer l'ancien constraint
alter table public.candidatures
  drop constraint if exists candidatures_statut_check;

-- 2. Recréer avec les bonnes valeurs
alter table public.candidatures
  add constraint candidatures_statut_check
  check (statut in ('soumise', 'en_evaluation', 'preselectionnee', 'finaliste', 'laureat', 'non_retenue'));

-- 3. Corriger les éventuelles valeurs mal orthographiées existantes
update public.candidatures
  set statut = 'preselectionnee'
  where statut = 'preselectionee';

-- 4. Vérification
select statut, count(*) from public.candidatures group by statut order by statut;
