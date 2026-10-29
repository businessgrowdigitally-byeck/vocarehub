import assert from "node:assert/strict";
import { test } from "node:test";

import { readFileSync } from "node:fs";

import { CONTACT_EMAIL, INSTAGRAM_URL, feedbackMailto, partnershipMailto } from "./contact.ts";

test("mailto de sugestão leva assunto e corpo codificados", () => {
  const url = new URL(feedbackMailto());
  assert.equal(url.protocol, "mailto:");
  assert.equal(url.pathname, CONTACT_EMAIL);
  assert.equal(url.searchParams.get("subject"), "Sugestão para o VOcare");
  assert.match(url.searchParams.get("body") ?? "", /^Oi, equipe VOcare!\n/);
});

test("link do Instagram aponta para @vocare.hub", () => {
  assert.equal(INSTAGRAM_URL, "https://www.instagram.com/vocare.hub/");
});

test("mailto de parceria pede escola, cidade e função", () => {
  const url = new URL(partnershipMailto());
  assert.equal(url.pathname, CONTACT_EMAIL);
  assert.equal(url.searchParams.get("subject"), "Parceria VOcare — escola");
  const body = url.searchParams.get("body") ?? "";
  for (const field of ["Escola:", "Cidade/UF:", "Meu nome e função:"]) {
    assert.ok(body.includes(field), field);
  }
});

test("Para escolas leva a parceria para um canal do VOcare, não para o site da agência", () => {
  const page = readFileSync("src/features/escolas/EscolasPage.tsx", "utf-8");
  assert.ok(!page.includes("bgdsystems.com.br"));
  assert.ok(page.includes("href={partnershipMailto()}"));
  assert.ok(page.includes("Falar sobre uma parceria"));
});

test("o site credita só o VOcare, sem mencionar a agência", () => {
  for (const file of [
    "src/components/SiteFooter.tsx",
    "src/features/about/AboutPage.tsx",
    "src/features/privacy/PrivacyPage.tsx",
    "src/features/escolas/EscolasPage.tsx",
  ]) {
    const source = readFileSync(file, "utf-8");
    assert.ok(!/bgd/i.test(source), file);
  }
  assert.ok(
    readFileSync("src/components/SiteFooter.tsx", "utf-8").includes("Desenvolvido por VOcare"),
  );
});

test("Para escolas mostra a parceria, o guia do professor e o cartaz", () => {
  const page = readFileSync("src/features/escolas/EscolasPage.tsx", "utf-8");
  for (const text of [
    "Sem risco para a escola",
    "Como trazer o VOcare para a sua escola",
    "Conversa rápida de 15 minutos",
    "Depois da parceria combinada — guia rápido para o professor",
    "Baixar cartaz para imprimir",
    "Resposta em até 3 dias úteis.",
  ]) {
    assert.ok(page.includes(text), text);
  }
  assert.ok(page.includes('"/cartaz-vocare.pdf"'));
  // O bloco da parceria vem antes do guia do professor.
  assert.ok(page.indexOf("COMO FORMALIZAR A PARCERIA") < page.indexOf("TRÊS FASES, UM PERCURSO"));
  assert.ok(readFileSync("public/cartaz-vocare.pdf").subarray(0, 5).toString() === "%PDF-");
});
