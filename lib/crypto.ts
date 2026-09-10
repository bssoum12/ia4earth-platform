/** Retourne le hash SHA-256 d'une chaîne sous forme hexadécimale (64 chars). */
export async function sha256Hex(text: string): Promise<string> {
  const buf = await globalThis.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Génère un token de session aléatoire par requête.
 * Format : `<sessionId>.<mac>` où mac = sha256(sessionId + ":" + adminSecret).
 * Fonctionne dans Node.js et Edge runtime (Web Crypto API uniquement).
 */
export async function makeSessionToken(adminSecret: string): Promise<string> {
  const idBytes = new Uint8Array(32);
  globalThis.crypto.getRandomValues(idBytes);
  const id = Array.from(idBytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  const mac = await sha256Hex(id + ":" + adminSecret);
  return `${id}.${mac}`;
}

/**
 * Vérifie un token de session. Comparaison XOR timing-safe, compatible Edge.
 */
export async function verifySessionToken(token: string, adminSecret: string): Promise<boolean> {
  const dot = token.indexOf(".");
  if (dot !== 64) return false;
  const id = token.slice(0, 64);
  const mac = token.slice(65);
  const expected = await sha256Hex(id + ":" + adminSecret);
  if (mac.length !== expected.length) return false;
  const a = new TextEncoder().encode(mac);
  const b = new TextEncoder().encode(expected);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i]! ^ b[i]!;
  return diff === 0;
}
