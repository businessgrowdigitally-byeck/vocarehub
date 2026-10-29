import { createHmac, timingSafeEqual } from "node:crypto";

/** Sessão do admin: cookie "expiraEm.assinatura", assinado com a ADMIN_PASSWORD. */
export const ADMIN_COOKIE = "vocare_admin";
export const ADMIN_SESSION_HOURS = 8;
/** Senhas curtas são fáceis de adivinhar; abaixo disso o admin fica desligado. */
export const ADMIN_PASSWORD_MIN_LENGTH = 12;

function sign(secret: string, expiresAt: number): string {
  return createHmac("sha256", secret).update(`vocare-admin:${expiresAt}`).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const left = createHmac("sha256", "compare").update(a).digest();
  const right = createHmac("sha256", "compare").update(b).digest();
  return timingSafeEqual(left, right);
}

export function isAdminConfigured(secret: string | undefined): secret is string {
  return typeof secret === "string" && secret.length >= ADMIN_PASSWORD_MIN_LENGTH;
}

export function checkAdminPassword(secret: string | undefined, attempt: unknown): boolean {
  if (!isAdminConfigured(secret) || typeof attempt !== "string") return false;
  return safeEqual(secret, attempt);
}

export function createAdminToken(secret: string, now: number): string {
  const expiresAt = now + ADMIN_SESSION_HOURS * 60 * 60 * 1000;
  return `${expiresAt}.${sign(secret, expiresAt)}`;
}

export function verifyAdminToken(
  secret: string | undefined,
  token: string | undefined,
  now: number,
): boolean {
  if (!isAdminConfigured(secret) || !token) return false;
  const [expires, signature] = token.split(".");
  const expiresAt = Number(expires);
  if (!signature || !Number.isFinite(expiresAt) || expiresAt <= now) return false;
  return safeEqual(sign(secret, expiresAt), signature);
}
