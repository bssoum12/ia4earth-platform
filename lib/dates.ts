// Règle métier critique (Art. 5) : toujours vérifier côté serveur
// La date de clôture ne doit JAMAIS être vérifiée uniquement côté client.

export const CLOTURE_DATE = new Date("2026-10-15T22:59:00Z"); // 23:59 heure de Tunis = UTC+1

export function isCandidatureOuverte(): boolean {
  return new Date() < CLOTURE_DATE;
}

export function getTimeRemaining(): {
  jours: number;
  heures: number;
  minutes: number;
  secondes: number;
  termine: boolean;
} {
  const diff = CLOTURE_DATE.getTime() - Date.now();
  if (diff <= 0) return { jours: 0, heures: 0, minutes: 0, secondes: 0, termine: true };

  const jours    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const heures   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secondes = Math.floor((diff % (1000 * 60)) / 1000);

  return { jours, heures, minutes, secondes, termine: false };
}

// Génère un numéro de dossier lisible : IA4E-2026-XXXXXX
// Utilise crypto.getRandomValues pour éviter les collisions de Math.random()
export function genererNumeroDossier(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes).map((b) => chars[b % chars.length]).join("");
  return `IA4E-2026-${suffix}`;
}
