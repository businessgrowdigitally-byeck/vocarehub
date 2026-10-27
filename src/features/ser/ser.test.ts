import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  arePreferencesValid,
  canCompleteSer,
  getOptionLabel,
  getPreferenceSummary,
  getFirstUnansweredInterestPage,
  getInterestSummary,
  getNextScaleValue,
  getSerResumeStep,
  isStrengthSelectionValid,
  isValueSelectionValid,
} from "./ser-logic.ts";
import { STRENGTH_OPTIONS, VALUE_OPTIONS } from "./ser-options.ts";
import { INTEREST_ITEMS } from "../../lib/exploration/interest-items.ts";
import type { RiasecDimension } from "../../lib/exploration/riasec.ts";
import type { Preferences, SerPhase } from "../../lib/journey/types.ts";

function allAnswers(
  byDimension: Partial<Record<RiasecDimension, number>> = {},
): Record<string, number> {
  return Object.fromEntries(
    INTEREST_ITEMS.map((item) => [item.id, byDimension[item.dimension] ?? 3]),
  );
}

function validPreferences(): Preferences {
  return { social: 4, routine: 2, practical: 5, structure: 1 };
}

function validSer(): SerPhase {
  return {
    status: "in_progress",
    interestResponses: allAnswers(),
    strengths: ["creating-ideas", "teamwork"],
    values: ["learning", "impact", "growth"],
    preferences: validPreferences(),
  };
}

describe("regras de seleção do SER", () => {
  it("valida forças entre 2 e 5", () => {
    assert.equal(isStrengthSelectionValid(["a"]), false);
    assert.equal(isStrengthSelectionValid(["a", "b"]), true);
    assert.equal(isStrengthSelectionValid(["a", "b", "c", "d", "e"]), true);
    assert.equal(isStrengthSelectionValid(["a", "b", "c", "d", "e", "f"]), false);
  });

  it("valida valores com exatamente 3", () => {
    assert.equal(isValueSelectionValid(["a", "b"]), false);
    assert.equal(isValueSelectionValid(["a", "b", "c"]), true);
    assert.equal(isValueSelectionValid(["a", "b", "c", "d"]), false);
  });

  it("valida preferências (quatro escalas de 1 a 5)", () => {
    assert.equal(arePreferencesValid(validPreferences()), true);
    assert.equal(
      arePreferencesValid({ social: null, routine: 3, practical: 3, structure: 3 }),
      false,
    );
    assert.equal(arePreferencesValid({ social: 0, routine: 3, practical: 3, structure: 3 }), false);
    assert.equal(arePreferencesValid({ social: 6, routine: 3, practical: 3, structure: 3 }), false);
  });

  it("permite concluir apenas com tudo válido", () => {
    assert.equal(canCompleteSer(validSer()), true);
    const partial = allAnswers();
    delete partial["c5"];
    assert.equal(canCompleteSer({ ...validSer(), interestResponses: partial }), false);
    assert.equal(canCompleteSer({ ...validSer(), values: [] }), false);
    assert.equal(
      canCompleteSer({ ...validSer(), preferences: { ...validPreferences(), social: null } }),
      false,
    );
  });
});

describe("getSerResumeStep", () => {
  it("retoma do primeiro passo incompleto", () => {
    const base: SerPhase = {
      status: "not_started",
      interestResponses: {},
      strengths: [],
      values: [],
      preferences: { social: null, routine: null, practical: null, structure: null },
    };
    assert.equal(getSerResumeStep(base), 1);
    assert.equal(getSerResumeStep({ ...base, interestResponses: allAnswers() }), 2);
    assert.equal(
      getSerResumeStep({ ...base, interestResponses: allAnswers(), strengths: ["a", "b"] }),
      3,
    );
    assert.equal(
      getSerResumeStep({
        ...base,
        interestResponses: allAnswers(),
        strengths: ["a", "b"],
        values: ["a", "b", "c"],
      }),
      4,
    );
    assert.equal(getSerResumeStep(validSer()), 5);
  });
});

describe("getOptionLabel", () => {
  it("converte IDs para rótulos e mantém desconhecidos", () => {
    assert.equal(getOptionLabel("teamwork", STRENGTH_OPTIONS), "Trabalhar em grupo");
    assert.equal(getOptionLabel("growth", VALUE_OPTIONS), "Crescimento");
    assert.equal(getOptionLabel("inexistente", VALUE_OPTIONS), "inexistente");
  });
});

describe("getPreferenceSummary", () => {
  it("mapeia polos e neutro em frases", () => {
    const low = getPreferenceSummary({ social: 1, routine: 3, practical: 3, structure: 3 });
    assert.equal(low[0], "Você demonstrou preferência por momentos com mais autonomia individual.");
    assert.equal(low[1], "Você parece confortável tanto com rotina quanto com variedade.");

    const high = getPreferenceSummary({ social: 5, routine: 5, practical: 5, structure: 5 });
    assert.equal(
      high[0],
      "Você demonstrou preferência por contextos com mais interação com pessoas.",
    );
    assert.equal(
      high[3],
      "Você demonstrou preferência por contextos com mais liberdade e flexibilidade.",
    );
  });
});

describe("questionário de interesses", () => {
  it("retoma na primeira página com pergunta sem resposta", () => {
    assert.equal(getFirstUnansweredInterestPage({}), 0);
    const answers = allAnswers();
    assert.equal(getFirstUnansweredInterestPage(answers), 0);
    delete answers[INTEREST_ITEMS[13]?.id ?? ""];
    assert.equal(getFirstUnansweredInterestPage(answers), 2);
  });

  it("não resume interesses incompletos", () => {
    assert.equal(getInterestSummary({}), null);
  });

  it("resume um tema dominante sem rótulos de diagnóstico", () => {
    const summary = getInterestSummary(allAnswers({ S: 5, E: 3, R: 1, I: 1, A: 1, C: 1 }));
    assert.equal(summary?.pattern, "dominant");
    assert.deepEqual(
      summary?.themes.map((theme) => theme.dimension),
      ["S"],
    );
  });

  it("perfil equilibrado não destaca temas", () => {
    const summary = getInterestSummary(allAnswers());
    assert.equal(summary?.pattern, "flat");
    assert.deepEqual(summary?.themes, []);
  });
});

describe("getNextScaleValue (teclado)", () => {
  it("setas avançam e voltam, com volta nas pontas", () => {
    assert.equal(getNextScaleValue(3, "ArrowRight", 5), 4);
    assert.equal(getNextScaleValue(3, "ArrowDown", 5), 4);
    assert.equal(getNextScaleValue(3, "ArrowLeft", 5), 2);
    assert.equal(getNextScaleValue(3, "ArrowUp", 5), 2);
    assert.equal(getNextScaleValue(5, "ArrowRight", 5), 1);
    assert.equal(getNextScaleValue(1, "ArrowLeft", 5), 5);
  });

  it("Home e End vão às pontas; sem resposta, parte da primeira opção", () => {
    assert.equal(getNextScaleValue(3, "Home", 5), 1);
    assert.equal(getNextScaleValue(3, "End", 5), 5);
    assert.equal(getNextScaleValue(undefined, "ArrowRight", 5), 2);
    assert.equal(getNextScaleValue(undefined, "ArrowLeft", 5), 5);
  });

  it("outras teclas não mudam a resposta", () => {
    assert.equal(getNextScaleValue(3, "Tab", 5), null);
    assert.equal(getNextScaleValue(3, " ", 5), null);
  });
});
