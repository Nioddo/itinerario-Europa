import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const TICKETS_BUCKET = "tickets";

/** ¿Está configurada la conexión a Supabase? Si no, la app corre en modo demo. */
export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}

export function hasServiceRole(): boolean {
  return Boolean(url && serviceKey);
}

/** Cliente de sólo lectura (anon key). Respeta RLS: sólo puede leer. */
export function getReadClient(): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error("Supabase no configurado (falta NEXT_PUBLIC_SUPABASE_URL / ANON_KEY).");
  }
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

/**
 * Cliente de administración (service role). Ignora RLS.
 * SÓLO usar en el servidor, dentro de acciones ya autorizadas por cookie.
 */
export function getAdminClient(): SupabaseClient {
  if (!url || !serviceKey) {
    throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY para poder editar.");
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

/** URL pública de un PDF guardado en Storage. */
export function publicPdfUrl(storagePath: string): string {
  return `${url}/storage/v1/object/public/${TICKETS_BUCKET}/${storagePath}`;
}
