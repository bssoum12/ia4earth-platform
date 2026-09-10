import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/crypto";
// [M-2] Centraliser createServiceClient — une seule implémentation dans lib/supabase.ts
import { createServiceClient } from "@/lib/supabase";

export { createServiceClient }; // re-export pour les callers existants

const SESSION_COOKIE = "ia4earth_admin_session";

export async function verifyAdminSession(): Promise<boolean> {
  const adminSecret = process.env.ADMIN_SECRET;
  // [M-1] Fail explicitly — never silently fall back to "change-me"
  if (!adminSecret || adminSecret === "change-me") return false;

  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return false;

  return verifySessionToken(token, adminSecret);
}

export const ADMIN_SESSION_COOKIE = SESSION_COOKIE;
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 heures
