import { test } from "node:test";
import { existsSync, readFileSync } from "node:fs";
import assert from "node:assert/strict";

import { GUIDE_STEPS } from "./guide-steps.ts";

test("registra /como-usar e o expõe no rodapé e na página inicial", () => {
  const route = readFileSync("src/routes/como-usar.tsx", "utf-8");
  const footer = readFileSync("src/components/SiteFooter.tsx", "utf-8");
  const home = readFileSync("src/routes/index.tsx", "utf-8");
  assert.ok(route.includes('createFileRoute("/como-usar")'));
  assert.ok(footer.includes('to: "/como-usar"'));
  assert.ok(home.includes('to="/como-usar"'));
});

test("cada passo tem imagem existente e texto alternativo", () => {
  assert.ok(GUIDE_STEPS.length >= 8);
  for (const step of GUIDE_STEPS) {
    assert.ok(existsSync(`public${step.image}`), `imagem ausente: ${step.image}`);
    assert.ok(step.alt.length > 20, `alt curto em ${step.image}`);
  }
});

test("cobre as quatro etapas na ordem da jornada", () => {
  const phases = [...new Set(GUIDE_STEPS.map((step) => step.phase))];
  assert.deepEqual(phases, ["Início", "SER", "PENSAR", "FAZER", "Passaporte"]);
});

test("os marcadores do texto são numerados a partir de 1, sem pular", () => {
  for (const step of GUIDE_STEPS) {
    const numbers = [...step.text.matchAll(/\{(\d)\}/g)].map((match) => Number(match[1]));
    assert.ok(numbers.length > 0, `${step.title} sem marcador`);
    numbers.forEach((n, index) => assert.equal(n, index + 1, step.title));
  }
});
