import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { sha256Hex, makeSessionToken } from "@/lib/crypto";
import { createRateLimiter } from "@/lib/rate-limit";

// 5 tentatives échouées par IP sur 15 minutes
const loginLimiter = createRateLimiter({ max: 5, windowMs: 15 * 60 * 1000 });

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

function timingSafeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, "hex");
  const bBuf = Buffer.from(b, "hex");
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export async function POST(req: NextRequest) {
  // [M-1] Reject requests if ADMIN_SECRET is not properly configured
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret || adminSecret === "change-me") {
    console.error("[admin/login] ADMIN_SECRET non configuré ou laissé à la valeur par défaut.");
    return NextResponse.json({ error: "SERVER_MISCONFIGURED" }, { status: 500 });
  }

  let body: { secret?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const { secret } = body;
  if (!secret || typeof secret !== "string") {
    return NextResponse.json({ error: "MISSING_SECRET" }, { status: 400 });
  }

  const ip = getIp(req);
  const rl = loginLimiter.check(ip);
  if (rl.blocked) {
    return NextResponse.json(
      { error: "TOO_MANY_ATTEMPTS" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  const inputHash    = await sha256Hex(secret);
  const expectedHash = await sha256Hex(adminSecret);

  if (!timingSafeEqual(inputHash, expectedHash)) {
    loginLimiter.increment(ip);
    await new Promise((r) => setTimeout(r, 200));
    return NextResponse.json({ error: "INVALID_SECRET" }, { status: 401 });
  }

  loginLimiter.clear(ip);

  // [C-1] Token aléatoire par session — jamais le hash statique du secret
  const sessionToken = await makeSessionToken(adminSecret);

  const jar = await cookies();
  jar.set("ia4earth_admin_session", sessionToken, {
    httpOnly: true,
    sameSite: "strict", // [M-3] strict > lax pour un cookie admin
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8, // 8 h
    path: "/",
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete("ia4earth_admin_session");
  return NextResponse.json({ ok: true });
}
