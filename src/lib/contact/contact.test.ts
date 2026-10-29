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
