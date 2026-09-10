import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { FROM_EMAIL } from "@/lib/resend";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    return await _handle(req);
  } catch (err) {
    console.error("[contact] unhandled error", err);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Erreur serveur — veuillez réessayer." },
      { status: 500 }
    );
  }
}

async function _handle(req: NextRequest): Promise<NextResponse> {
  const body = await req.json() as {
    nom?: string;
    email?: string;
    sujet?: string;
    message?: string;
  };

  const nom     = (body.nom     ?? "").trim();
  const email   = (body.email   ?? "").trim();
  const sujet   = (body.sujet   ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!nom || !email || !sujet || !message) {
    return NextResponse.json({ error: "MISSING_FIELDS", message: "Tous les champs sont obligatoires." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "INVALID_EMAIL", message: "Adresse e-mail invalide." }, { status: 400 });
  }
  if (message.length > 4000) {
    return NextResponse.json({ error: "TOO_LONG", message: "Message trop long (4 000 caractères max)." }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY manquant");
  const resend = new Resend(key);

  const adminTo = process.env.CONTACT_INBOX_EMAIL ?? "contact@salondedeveloppementdurable.com";

  const nomSafe     = escapeHtml(nom);
  const emailSafe   = escapeHtml(email);
  const sujetSafe   = escapeHtml(sujet);
  const messageSafe = escapeHtml(message).replace(/\n/g, "<br>");

  await resend.emails.send({
    from:    FROM_EMAIL,
    replyTo: email,
    to:      [adminTo],
    subject: `[Contact] ${sujet}`,
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#EBF7D4;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#FAFFF5;border:1px solid #D4EFA5;border-radius:8px;overflow:hidden;">
    <div style="background:#2D6030;padding:24px 32px;">
      <div style="color:#8CC63F;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;">IA4EARTH · Formulaire de contact</div>
      <div style="color:#FAFFF5;font-size:18px;font-weight:700;">${sujetSafe}</div>
    </div>
    <div style="padding:24px 32px;font-size:14px;color:#163718;line-height:1.6;">
      <table style="border-collapse:collapse;margin-bottom:20px;">
        <tr><td style="padding:4px 12px 4px 0;color:#3D7A3F;font-weight:600;white-space:nowrap;">Nom</td><td>${nomSafe}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#3D7A3F;font-weight:600;white-space:nowrap;">E-mail</td><td><a href="mailto:${emailSafe}" style="color:#2D6030;">${emailSafe}</a></td></tr>
      </table>
      <div style="background:#EBF7D4;border-left:3px solid #8CC63F;padding:14px 18px;border-radius:4px;white-space:pre-wrap;">${messageSafe}</div>
    </div>
    <div style="background:#EBF7D4;padding:14px 32px;font-size:11px;color:#3D7A3F;border-top:1px solid #D4EFA5;">
      Envoyé via le formulaire de contact — challenge.salondedeveloppementdurable.com
    </div>
  </div>
</body>
</html>`,
  });

  return NextResponse.json({ ok: true });
}
