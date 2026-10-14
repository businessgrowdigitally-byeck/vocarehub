import { describe, it } from "node:test";
import assert from "node:assert/strict";

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
      interests: ["create", "technology"],
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
  it("traduz IDs do SER em rótulos legíveis", () => {
    const summary = buildJourneySummary(completedState());
    assert.deepEqual(
      summary.interests.map((item) => item.label),
      ["Criar", "Tecnologia"],
    );
    assert.deepEqual(
      summary.values.map((item) => item.label),
      ["Autonomia", "Aprendizado", "Impacto"],
    );
    assert.equal(summary.preferences.length, 4);
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
