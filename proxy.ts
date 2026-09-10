import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/crypto";

// [C-3] Vérification cryptographique du token dans le middleware Edge.
// lib/crypto.ts n'utilise que globalThis.crypto (Web Crypto API), compatible Edge.
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin/dashboard")) {
    const session = req.cookies.get("ia4earth_admin_session");
    if (!session?.value) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret || adminSecret === "change-me") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    const valid = await verifySessionToken(session.value, adminSecret);
    if (!valid) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
