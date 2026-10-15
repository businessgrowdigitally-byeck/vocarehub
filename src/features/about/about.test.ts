import { test } from "node:test";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const routeFile = readFileSync("src/routes/sobre.tsx", "utf-8");
const pageFile = readFileSync("src/features/about/AboutPage.tsx", "utf-8");
const footerFile = readFileSync("src/components/SiteFooter.tsx", "utf-8");

test("registers the /sobre route and exposes it in the footer", () => {
  assert.ok(routeFile.includes('createFileRoute("/sobre")'), "route file should register /sobre");
  assert.ok(footerFile.includes("Sobre o VOcare"), "footer should contain 'Sobre o VOcare' label");
  assert.ok(footerFile.includes('to: "/sobre"'), "footer should link to /sobre");
});

test("describes the real phases and their concrete outputs", () => {
  const required = [
    "SER",
    "PENSAR",
    "FAZER",
    "Meu Mapa",
    "Meus 3 Caminhos",
    "Meu Primeiro Experimento",
    "PASSAPORTE VOCARE",
  ];
  for (const term of required) {
    assert.ok(pageFile.includes(term), `AboutPage should mention "${term}"`);
  }
});

test("states that VOcare does not choose a profession or promise a diagnosis", () => {
  assert.ok(
    pageFile.includes("O VOcare não escolhe por você"),
    "should state VOcare does not choose for you",
  );
  const passaporteText = [
    "não um diploma",
    "diagnóstico",
    "documento oficial",
    "avaliação psicológica",
  ];
  for (const term of passaporteText) {
    assert.ok(
      pageFile.toLowerCase().includes(term.toLowerCase()),
      `should mention Passaporte is not "${term}"`,
    );
  }
});

test("avoids deterministic promises", () => {
  const forbidden = [
    "descubra sua verdadeira vocação",
    "encontre sua profissão perfeita",
    "descubra quem você nasceu para ser",
    "garanta seu futuro",
    "teste vocacional definitivo",
    "resultado científico",
    "perfil psicológico",
  ];
  const lower = pageFile.toLowerCase();
  for (const phrase of forbidden) {
    assert.ok(
      !lower.includes(phrase.toLowerCase()),
      `should not contain deterministic promise: "${phrase}"`,
    );
  }
});

test("offers calls to action for young people and educators", () => {
  assert.ok(pageFile.includes('to="/ser"'), "should link to /ser for young people");
  assert.ok(pageFile.includes('to="/escolas"'), "should link to /escolas for educators");
});
