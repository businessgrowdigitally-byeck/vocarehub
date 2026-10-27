import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { INTEREST_ITEMS } from "../../lib/exploration/interest-items.ts";
import { createInitialJourneyState } from "../../lib/journey/state.ts";
import type { JourneyState } from "../../lib/journey/types.ts";
import { buildCertificatePdf, escapePdfText, latin1Bytes } from "./certificate.ts";
import { buildJourneySummary, isJourneyComplete } from "./summary-logic.ts";

function completedState(): JourneyState {
  const state = createInitialJourneyState();
  return {
    ...state,
    ser: {
      status: "completed",
      // Criar (A) se destaca: A=5, demais=2.
      interestResponses: Object.fromEntries(
        INTEREST_ITEMS.map((item) => [item.id, item.dimension === "A" ? 5 : 2]),
      ),
      strengths: ["focus"],
      values: ["autonomy", "learning", "impact"],
      preferences: { social: 4, routine: 2, practical: 3, structure: 1 },
    },
    pensar: {
      status: "completed",
      exploredPathIds: ["data"],
      savedPathIds: ["data", "graphic-design", "pedagogy"],
      selectedPathIds: ["data", "graphic-design", "pedagogy"],
    },
    fazer: {
      status: "completed",
      selectedPathId: "data",
      missionId: "mini-project",
      targetDate: "2026-11-01",
    },
  };
}

describe("isJourneyComplete", () => {
  it("só é verdadeira com as três fases concluídas", () => {
    assert.equal(isJourneyComplete(createInitialJourneyState()), false);
    assert.equal(isJourneyComplete(completedState()), true);

    const partial = completedState();
    partial.fazer = { ...partial.fazer, status: "in_progress" };
    assert.equal(isJourneyComplete(partial), false);
  });
});

describe("buildJourneySummary", () => {
  it("traduz o SER em rótulos legíveis", () => {
    const summary = buildJourneySummary(completedState());
    assert.deepEqual(
      summary.interests.map((item) => item.label),
      ["Criar"],
    );
    assert.deepEqual(
      summary.values.map((item) => item.label),
      ["Autonomia", "Aprendizado", "Impacto"],
    );
    assert.equal(summary.preferences.length, 4);
  });

  it("interesses incompletos ficam vazios; equilibrados viram um único item", () => {
    const incomplete = completedState();
    incomplete.ser = { ...incomplete.ser, interestResponses: {} };
    assert.deepEqual(buildJourneySummary(incomplete).interests, []);

    const balanced = completedState();
    balanced.ser = {
      ...balanced.ser,
      interestResponses: Object.fromEntries(INTEREST_ITEMS.map((item) => [item.id, 3])),
    };
    assert.deepEqual(
      buildJourneySummary(balanced).interests.map((item) => item.label),
      ["Interesses equilibrados"],
    );
  });

  it("reúne caminhos e o plano final", () => {
    const summary = buildJourneySummary(completedState());
    assert.deepEqual(
      summary.paths.map((path) => path.id),
      ["data", "graphic-design", "pedagogy"],
    );
    assert.equal(summary.plan.path?.id, "data");
    assert.equal(summary.plan.areaTitle, "Tecnologia");
    assert.equal(summary.plan.mission?.id, "mini-project");
    assert.equal(summary.plan.targetDate, "2026-11-01");
  });

  it("é tolerante a um plano incompleto", () => {
    const state = createInitialJourneyState();
    const summary = buildJourneySummary(state);
    assert.deepEqual(summary.paths, []);
    assert.equal(summary.plan.path, null);
    assert.equal(summary.plan.mission, null);
    assert.equal(summary.plan.targetDate, null);
  });
});

describe("passaporte em PDF", () => {
  it("escapa caracteres especiais do conteúdo", () => {
    assert.equal(escapePdfText("Ana (teste)"), "Ana \\(teste\\)");
    assert.equal(escapePdfText("caminho\\teste"), "caminho\\\\teste");
    assert.equal(escapePdfText("linha 1\nlinha 2"), "linha 1 linha 2");
  });

  it("gera um PDF válido com nome e caminhos", () => {
    const pdf = buildCertificatePdf({
      name: "Ana (teste)",
      pathTitles: ["Dados", "Design gráfico", "Pedagogia"],
      missionTitle: "Faça um mini-projeto",
      targetPathTitle: "Dados",
      targetDate: "01/11/2026",
    });

    assert.ok(pdf.startsWith("%PDF-1.4"));
    assert.ok(pdf.endsWith("%%EOF"));
    assert.ok(pdf.includes("/WinAnsiEncoding"));
    assert.ok(pdf.includes("xref"));
    assert.ok(pdf.includes("startxref"));
    assert.ok(pdf.includes("Ana \\(teste\\)"));
    assert.ok(pdf.includes("Design gráfico"));
    assert.ok(pdf.includes("01/11/2026"));
  });

  it("converte para bytes em Latin-1 preservando o cabeçalho", () => {
    const pdf = buildCertificatePdf({
      name: null,
      pathTitles: [],
      missionTitle: null,
      targetPathTitle: null,
      targetDate: null,
    });
    const bytes = latin1Bytes(pdf);
    assert.equal(bytes.length, pdf.length);
    assert.equal(bytes[0], 0x25);
  });
});

describe("Passaporte", () => {
  it("mostra as preferências no cartão do SER, onde elas são respondidas", async () => {
    const { readFileSync } = await import("node:fs");
    const page = readFileSync("src/features/journey-summary/JourneySummary.tsx", "utf-8");
    const ser = page.indexOf('eyebrow text-cian">SER');
    const pensar = page.indexOf('eyebrow text-cian">PENSAR');
    const prefs = page.indexOf("Preferências de trabalho");
    assert.ok(ser !== -1 && pensar !== -1 && prefs !== -1);
    assert.ok(prefs > ser && prefs < pensar, "preferências devem ficar no cartão do SER");
  });
});
