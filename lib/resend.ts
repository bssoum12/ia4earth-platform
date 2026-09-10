import { Resend } from "resend";

export const FROM_EMAIL = process.env.FROM_EMAIL ?? "onboarding@resend.dev";
export const REPLY_TO   = process.env.REPLY_TO_EMAIL ?? "contact@salondedeveloppementdurable.com";

// Client instancié à la demande pour éviter l'échec au build sans API key
function getResendClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY manquant — configurez cette variable d'environnement");
  }
  return new Resend(key);
}

interface AccuseReceptionParams {
  to: string;
  nomStartup: string;
  numeroDossier: string;
}

// [M-12] Encodage HTML pour les valeurs provenant de l'utilisateur injectées dans le template
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function envoyerAccuseReception({
  to,
  nomStartup,
  numeroDossier,
}: AccuseReceptionParams): Promise<void> {
  const resend = getResendClient();
  const nomStartupSafe = escapeHtml(nomStartup);

  await resend.emails.send({
    from:     FROM_EMAIL,
    replyTo:  REPLY_TO,
    to:       [to],
    subject:  `✓ Candidature reçue — ${numeroDossier} | IA4EARTH Startup Challenge`,
    html: `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Candidature reçue</title></head>
<body style="margin:0;padding:0;background:#EBF7D4;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#FAFFF5;border:1px solid #D4EFA5;border-radius:8px;overflow:hidden;">
    <div style="background:#2D6030;padding:28px 32px;">
      <div style="color:#8CC63F;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;">IA4EARTH Startup Challenge</div>
      <div style="color:#FAFFF5;font-size:22px;font-weight:700;line-height:1.3;">Votre candidature a bien été reçue</div>
    </div>
    <div style="padding:28px 32px;">
      <p style="color:#163718;font-size:15px;margin:0 0 18px;">Bonjour,</p>
      <p style="color:#163718;font-size:15px;margin:0 0 18px;">
        Nous avons bien reçu la candidature de <strong>${nomStartupSafe}</strong> au IA4EARTH Startup Challenge —
        3ème édition du Salon de l'Économie Verte, Finance Responsable et Développement Durable.
      </p>
      <div style="background:#EBF7D4;border:1px solid #D4EFA5;border-radius:6px;padding:16px 20px;margin:20px 0;">
        <div style="font-size:11px;font-weight:700;color:#2D6030;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">Numéro de dossier</div>
        <div style="font-family:'Courier New',monospace;font-size:22px;font-weight:700;color:#163718;letter-spacing:.04em;">${numeroDossier}</div>
        <div style="font-size:12px;color:#3D7A3F;margin-top:4px;">Conservez ce numéro pour vos échanges avec le comité d'organisation.</div>
      </div>
      <p style="color:#163718;font-size:14px;margin:0 0 12px;">La suite du calendrier :</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <tr><td style="padding:8px 0;border-bottom:1px solid #D4EFA5;color:#3D7A3F;font-weight:600;width:140px;">15 oct. 2026, 23:59</td><td style="padding:8px 0;border-bottom:1px solid #D4EFA5;color:#163718;">Clôture des candidatures</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #D4EFA5;color:#3D7A3F;font-weight:600;">16–25 oct. 2026</td><td style="padding:8px 0;border-bottom:1px solid #D4EFA5;color:#163718;">Présélection sur dossier</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #D4EFA5;color:#3D7A3F;font-weight:600;">28 oct. 2026</td><td style="padding:8px 0;border-bottom:1px solid #D4EFA5;color:#163718;">Annonce des finalistes</td></tr>
        <tr><td style="padding:8px 0;color:#3D7A3F;font-weight:600;">5–6 nov. 2026</td><td style="padding:8px 0;color:#163718;">Finale &amp; remise des prix — UTICA, Tunis</td></tr>
      </table>
      <p style="color:#163718;font-size:14px;margin:24px 0 0;">
        Pour toute question, répondez directement à cet e-mail ou écrivez à
        <a href="mailto:contact@salondedeveloppementdurable.com" style="color:#2D6030;font-weight:600;">contact@salondedeveloppementdurable.com</a>.
      </p>
    </div>
    <div style="background:#EBF7D4;padding:16px 32px;font-size:11px;color:#3D7A3F;border-top:1px solid #D4EFA5;">
      IA4EARTH Startup Challenge — Salon de l'Économie Verte, Finance Responsable et Développement Durable<br>
      Centre International des Congrès, Siège de l'UTICA, Tunis
    </div>
  </div>
</body>
</html>`,
  });
}
