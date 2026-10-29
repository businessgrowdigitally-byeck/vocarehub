import { test } from "node:test";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const page = readFileSync("src/features/privacy/PrivacyPage.tsx", "utf-8");
const route = readFileSync("src/routes/privacidade.tsx", "utf-8");
const footer = readFileSync("src/components/SiteFooter.tsx", "utf-8");
const banner = readFileSync("src/components/AnalyticsConsent.tsx", "utf-8");

test("registra /privacidade e o expõe no rodapé e no aviso de analytics", () => {
  assert.ok(route.includes('createFileRoute("/privacidade")'));
  assert.ok(footer.includes('to: "/privacidade"'));
  assert.ok(banner.includes('to="/privacidade"'));
});

test("identifica o responsável e um contato", () => {
  assert.ok(page.includes("equipe do VOcare"));
  assert.ok(page.includes("vocare.institucional@gmail.com"));
  assert.ok(footer.includes("vocare.institucional@gmail.com"));
});

test("descreve o que é e o que não é coletado", () => {
  for (const term of [
    "navegador do seu aparelho",
    "só depois que você aceita",
    "Nunca enviamos",
    "LGPD",
    "art. 14",
    "Retirar o consentimento",
  ]) {
    assert.ok(page.includes(term), `PrivacyPage deve mencionar "${term}"`);
  }
});

test("permite mudar a escolha de analytics a qualquer momento", () => {
  assert.ok(page.includes("clearConsent()"));
  assert.ok(page.includes("Mudar minha escolha"));
});

test("a política lista exatamente os eventos de funil que existem no código", () => {
  const events = readFileSync("src/lib/journey/events.ts", "utf-8");
  for (const name of ["ser_started", "ser_completed", "pensar_completed", "fazer_completed"]) {
    assert.ok(events.includes(`"${name}"`));
  }
  for (const step of [
    "começou o SER",
    "terminou o SER",
    "terminou o PENSAR",
    "terminou o FAZER",
    "baixou o Passaporte",
  ]) {
    assert.ok(page.includes(step), `PrivacyPage deve listar "${step}"`);
  }
});
