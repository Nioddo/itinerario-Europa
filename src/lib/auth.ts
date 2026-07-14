import "server-only";
import { cookies } from "next/headers";
import crypto from "node:crypto";

const COOKIE_NAME = "edit_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 días

function secret(): string {
  // El propio EDIT_CODE actúa como clave HMAC. Si cambia el código,
  // las sesiones viejas dejan de ser válidas automáticamente.
  const code = process.env.EDIT_CODE;
  if (!code) throw new Error("Falta EDIT_CODE en las variables de entorno.");
  return code;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

/** Compara el código ingresado contra EDIT_CODE en tiempo constante. */
export function codeIsValid(input: string): boolean {
  const expected = process.env.EDIT_CODE ?? "";
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/** Genera el valor firmado de la cookie de sesión de edición. */
export function makeSessionValue(): string {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const payload = `editor.${exp}`;
  return `${payload}.${sign(payload)}`;
}

function verify(value: string | undefined): boolean {
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 3) return false;
  const [role, expStr, sig] = parts;
  const payload = `${role}.${expStr}`;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false;
  return role === "editor";
}

/** ¿El dispositivo actual tiene una sesión de edición válida? */
export function isEditor(): boolean {
  try {
    return verify(cookies().get(COOKIE_NAME)?.value);
  } catch {
    return false;
  }
}

/** Lanza si no hay sesión de edición. Usar al inicio de cada mutación. */
export function requireEditor(): void {
  if (!isEditor()) {
    throw new Error("No autorizado. Ingresá el código de edición.");
  }
}

export const EDIT_COOKIE = {
  name: COOKIE_NAME,
  maxAge: MAX_AGE_SECONDS,
};
