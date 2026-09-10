import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";

// Client public (côté client, lecture seule via RLS)
// Placeholders allow build-time tree-shaking without env vars — real values required at runtime.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client serveur avec service_role (API routes uniquement — jamais exposé au client)
export function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY manquant — vérifier les variables d'environnement");
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
}

export const STORAGE_BUCKET = "pitch-decks";
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 Mo

/**
 * [H-4] Génère une URL signée courte durée depuis un chemin de stockage.
 * Rétrocompatible : si la valeur stockée est déjà une URL https:// (anciens enregistrements
 * avec URL signée 10 ans), elle est retournée telle quelle jusqu'à migration.
 */
export async function getSignedPitchDeckUrl(
  supabase: SupabaseClient,
  pathOrLegacyUrl: string | null,
  expiresIn = 3600 // 1 heure
): Promise<string | null> {
  if (!pathOrLegacyUrl) return null;
  if (pathOrLegacyUrl.startsWith("https://")) return pathOrLegacyUrl;
  const { data } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(pathOrLegacyUrl, expiresIn);
  return data?.signedUrl ?? null;
}
