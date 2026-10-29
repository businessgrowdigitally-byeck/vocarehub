import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * As chaves novas do Supabase (sb_secret_…) são opacas, não JWT: vão só no header apikey,
 * nunca como Bearer. Mesma regra de src/integrations/supabase/client.server.ts.
 */
export function createSupabaseFetch(key: string): typeof fetch {
  const opaque = key.startsWith("sb_publishable_") || key.startsWith("sb_secret_");
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) new Headers(init.headers).forEach((value, name) => headers.set(name, value));
    if (opaque && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
    headers.set("apikey", key);
    return fetch(input, { ...init, headers });
  };
}

/**
 * Cliente com a service role, só para o servidor. A URL do projeto é pública (já vem no
 * .env); a chave secreta vem de SUPABASE_SERVICE_ROLE_KEY nas variáveis da Vercel.
 */
export function createFeedbackClient() {
  const url = process.env["SUPABASE_URL"] || import.meta.env["VITE_SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) {
    throw new Error("Feedback indisponível: configure SUPABASE_SERVICE_ROLE_KEY.");
  }
  return createClient<Database>(url, key, {
    global: { fetch: createSupabaseFetch(key) },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}
