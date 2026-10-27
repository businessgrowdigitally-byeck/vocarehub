import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { getSharedThemes } from "./explanation.ts";
import type { InterestProfile, RiasecDimension } from "./riasec.ts";

function profile(values: Partial<Record<RiasecDimension, number>>): InterestProfile {
  return { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0, ...values };
}

describe("getSharedThemes", () => {
  it("devolve temas fortes em comum, na ordem de força do estudante", () => {
    const student = profile({ I: 1, C: 0.75, S: 0.3 });
    const career = profile({ C: 0.8, I: 0.9, R: 0.4 });
    assert.deepEqual(getSharedThemes(student, career), ["I", "C"]);
  });

  it("ignora temas abaixo de “Mais ou menos” (0,5) no estudante", () => {
    const student = profile({ I: 0.75, C: 0.45, A: 0.4 });
    const career = profile({ I: 0.9, C: 0.8, A: 0.7 });
    assert.deepEqual(getSharedThemes(student, career), ["I"]);
  });

  it("ignora temas que não estão entre os 3 mais fortes da profissão", () => {
    const student = profile({ A: 1, S: 0.8 });
    const career = profile({ R: 0.9, I: 0.8, C: 0.7, A: 0.6 });
    assert.deepEqual(getSharedThemes(student, career), []);
  });

  it("mostra no máximo 2 temas", () => {
    const student = profile({ R: 1, I: 0.9, A: 0.8 });
    const career = profile({ R: 1, I: 0.9, A: 0.8 });
    assert.equal(getSharedThemes(student, career).length, 2);
  });

  it("perfil plano não ganha explicação (empate não é interesse)", () => {
    const flat = profile({ R: 0.5, I: 0.5, A: 0.5, S: 0.5, E: 0.5, C: 0.5 });
    assert.deepEqual(getSharedThemes(flat, profile({ R: 0.9, I: 0.8, A: 0.7 })), []);
  });
});
