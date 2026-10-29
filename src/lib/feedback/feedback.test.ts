import assert from "node:assert/strict";
import { test } from "node:test";

import {
  FEEDBACK_MAX_LENGTH,
  feedbackToCsv,
  normalizePage,
  retentionCutoff,
  validateFeedback,
} from "./feedback.ts";
import {
  checkAdminPassword,
  createAdminToken,
  isAdminConfigured,
  verifyAdminToken,
} from "./admin-session.ts";

const human = { website: "", elapsedMs: 10_000 };

test("valida e limpa um feedback normal", () => {
  const result = validateFeedback({
    kind: "sugestao",
    message: "  Mais caminhos de artes  ",
    rating: 4,
    page: "/resumo",
    ...human,
  });
  assert.deepEqual(result, {
    ok: true,
    spam: false,
    value: { kind: "sugestao", message: "Mais caminhos de artes", rating: 4, page: "/resumo" },
  });
});

test("rejeita tipo, mensagem e nota inválidos", () => {
  assert.equal(validateFeedback({ kind: "x", message: "oi oi", ...human }).ok, false);
  assert.equal(validateFeedback({ kind: "elogio", message: "  ", ...human }).ok, false);
  assert.equal(
    validateFeedback({ kind: "elogio", message: "a".repeat(FEEDBACK_MAX_LENGTH + 1), ...human }).ok,
    false,
  );
  assert.equal(
    validateFeedback({ kind: "elogio", message: "legal", rating: 6, ...human }).ok,
    false,
  );
  assert.equal(
    validateFeedback({ kind: "elogio", message: "legal", rating: 2.5, ...human }).ok,
    false,
  );
  assert.equal(validateFeedback(null).ok, false);
});

test("nota é opcional", () => {
  const result = validateFeedback({ kind: "problema", message: "travou", ...human });
  assert.ok(result.ok && result.value.rating === null);
});

test("marca como spam o campo invisível preenchido ou envio rápido demais", () => {
  const trap = validateFeedback({
    kind: "elogio",
    message: "legal",
    website: "x",
    elapsedMs: 9000,
  });
  const fast = validateFeedback({ kind: "elogio", message: "legal", website: "", elapsedMs: 500 });
  assert.ok(trap.ok && trap.spam);
  assert.ok(fast.ok && fast.spam);
});

test("só aceita caminhos internos como página", () => {
  assert.equal(normalizePage("/pensar"), "/pensar");
  assert.equal(normalizePage("https://evil.example"), null);
  assert.equal(normalizePage("//evil"), null);
  assert.equal(normalizePage("/a?b=1"), null);
  assert.equal(normalizePage(42), null);
});

test("retenção de 12 meses", () => {
  assert.equal(
    retentionCutoff(new Date("2026-10-28T12:00:00Z")).toISOString(),
    "2025-10-28T12:00:00.000Z",
  );
});

test("CSV escapa aspas e neutraliza fórmulas", () => {
  const csv = feedbackToCsv([
    {
      created_at: "2026-10-28T12:00:00Z",
      kind: "sugestao",
      rating: null,
      page: null,
      message: '=HYPERLINK("x") "oi"',
      read_at: null,
    },
  ]);
  const [, line] = csv.split("\r\n");
  assert.equal(line, `"2026-10-28T12:00:00Z";"Sugestão";"";"";"'=HYPERLINK(""x"") ""oi""";"não"`);
});

test("sessão do admin", () => {
  const secret = "uma-senha-bem-longa";
  const now = Date.UTC(2026, 9, 28);
  assert.equal(isAdminConfigured("curta"), false);
  assert.equal(isAdminConfigured(undefined), false);
  assert.equal(checkAdminPassword(secret, secret), true);
  assert.equal(checkAdminPassword(secret, "errada"), false);
  assert.equal(checkAdminPassword("curta", "curta"), false);

  const token = createAdminToken(secret, now);
  assert.equal(verifyAdminToken(secret, token, now + 1000), true);
  assert.equal(verifyAdminToken("outra-senha-bem-longa", token, now + 1000), false);
  assert.equal(verifyAdminToken(secret, token, now + 9 * 60 * 60 * 1000), false);
  const [expires] = token.split(".");
  assert.equal(verifyAdminToken(secret, `${expires}.${"0".repeat(64)}`, now + 1000), false);
  assert.equal(verifyAdminToken(secret, `${now + 10 ** 12}.abc`, now), false);
  assert.equal(verifyAdminToken(secret, undefined, now), false);
});
