import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  arePreferencesValid,
  canCompleteSer,
  getOptionLabel,
  getPreferenceSummary,
  getSerResumeStep,
  isInterestSelectionValid,
  isStrengthSelectionValid,
  isValueSelectionValid,
} from "./ser-logic.ts";
import { INTEREST_OPTIONS, STRENGTH_OPTIONS, VALUE_OPTIONS } from "./ser-options.ts";
import type { Preferences, SerPhase } from "../../lib/journey/types.ts";

function validPreferences(): Preferences {
  return { social: 4, routine: 2, practical: 5, structure: 1 };
}

function validSer(): SerPhase {
  return {
    status: "in_progress",
    interests: ["create", "technology", "help-people"],
    strengths: ["creating-ideas", "teamwork"],
    values: ["learning", "impact", "growth"],
    preferences: validPreferences(),
  };
}

describe("regras de seleção do SER", () => {
  it("valida interesses entre 3 e 5", () => {
    assert.equal(isInterestSelectionValid([]), false);
    assert.equal(isInterestSelectionValid(["a", "b"]), false);
    assert.equal(isInterestSelectionValid(["a", "b", "c"]), true);
    assert.equal(isInterestSelectionValid(["a", "b", "c", "d", "e"]), true);
    assert.equal(isInterestSelectionValid(["a", "b", "c", "d", "e", "f"]), false);
  });

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
    assert.equal(canCompleteSer({ ...validSer(), interests: ["create"] }), false);
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
      interests: [],
      strengths: [],
      values: [],
      preferences: { social: null, routine: null, practical: null, structure: null },
    };
    assert.equal(getSerResumeStep(base), 1);
    assert.equal(getSerResumeStep({ ...base, interests: ["a", "b", "c"] }), 2);
    assert.equal(
      getSerResumeStep({ ...base, interests: ["a", "b", "c"], strengths: ["a", "b"] }),
      3,
    );
    assert.equal(
      getSerResumeStep({
        ...base,
        interests: ["a", "b", "c"],
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
    assert.equal(getOptionLabel("create", INTEREST_OPTIONS), "Criar");
    assert.equal(getOptionLabel("teamwork", STRENGTH_OPTIONS), "Trabalhar em grupo");
    assert.equal(getOptionLabel("growth", VALUE_OPTIONS), "Crescimento");
    assert.equal(getOptionLabel("inexistente", INTEREST_OPTIONS), "inexistente");
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
