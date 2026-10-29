import assert from "node:assert/strict";
import { test } from "node:test";

import { createSupabaseFetch } from "./feedback.server.ts";

async function captureHeaders(key: string, init: RequestInit): Promise<Headers> {
  const original = globalThis.fetch;
  let seen = new Headers();
  globalThis.fetch = (async (_input: RequestInfo | URL, request?: RequestInit) => {
    seen = new Headers(request?.headers);
    return new Response(null, { status: 204 });
  }) as typeof fetch;
  try {
    await createSupabaseFetch(key)("https://example.supabase.co/rest/v1/feedback", init);
  } finally {
    globalThis.fetch = original;
  }
  return seen;
}

test("chave sb_secret_ vai só no apikey, sem Bearer", async () => {
  const headers = await captureHeaders("sb_secret_abc", {
    headers: { Authorization: "Bearer sb_secret_abc" },
  });
  assert.equal(headers.get("apikey"), "sb_secret_abc");
  assert.equal(headers.get("Authorization"), null);
});

test("chave JWT antiga mantém o Bearer", async () => {
  const headers = await captureHeaders("eyJ.a.b", { headers: { Authorization: "Bearer eyJ.a.b" } });
  assert.equal(headers.get("apikey"), "eyJ.a.b");
  assert.equal(headers.get("Authorization"), "Bearer eyJ.a.b");
});
