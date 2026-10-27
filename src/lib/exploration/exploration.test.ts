import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { classifyProfile, rankDimensions } from "./classification.ts";
import {
  INTEREST_ITEMS,
  INTEREST_PAGE_COUNT,
  INTEREST_SCALE_LABELS,
  getInterestItemPage,
} from "./interest-items.ts";
import type { CareerCandidate } from "./matching.ts";
import {
  MAX_AREAS,
  MAX_PATHS_PER_AREA,
  MAX_RECOMMENDATIONS,
  buildCareerRanking,
  eligibilityThreshold,
  profileSimilarity,
} from "./matching.ts";
import type { InterestProfile, RiasecDimension } from "./riasec.ts";
import { RIASEC_DIMENSIONS, clamp01, isInterestProfile } from "./riasec.ts";
import type { InterestResponses } from "./scoring.ts";
import {
  computeInterestProfile,
  countAnsweredInterestItems,
  isInterestQuestionnaireComplete,
} from "./scoring.ts";

function profile(values: Partial<Record<RiasecDimension, number>> = {}): InterestProfile {
  return { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0, ...values };
}

/** Responde todos os itens; `byDimension` define o valor (1–5) de cada dimensão. */
function answers(byDimension: Partial<Record<RiasecDimension, number>>): Record<string, number> {
  const result: Record<string, number> = {};
  for (const item of INTEREST_ITEMS) result[item.id] = byDimension[item.dimension] ?? 1;
  return result;
}

describe("itens de interesse", () => {
  it("tem 30 itens, 5 por dimensão, com ids únicos", () => {
    assert.equal(INTEREST_ITEMS.length, 30);
    for (const dimension of RIASEC_DIMENSIONS) {
      assert.equal(INTEREST_ITEMS.filter((item) => item.dimension === dimension).length, 5);
    }
    assert.equal(new Set(INTEREST_ITEMS.map((item) => item.id)).size, 30);
  });

  it("cada página de 6 itens traz uma dimensão de cada", () => {
    assert.equal(INTEREST_PAGE_COUNT, 5);
    for (let page = 0; page < INTEREST_PAGE_COUNT; page++) {
      const dims = getInterestItemPage(page).map((item) => item.dimension);
      assert.deepEqual([...dims].sort(), [...RIASEC_DIMENSIONS].sort());
    }
  });

  it("a escala tem 5 rótulos", () => {
    assert.equal(INTEREST_SCALE_LABELS.length, 5);
  });
});

describe("computeInterestProfile", () => {
  it("normaliza a média de cada dimensão com (média - 1) / 4", () => {
    const result = computeInterestProfile(answers({ R: 5, I: 3, A: 1, S: 4, E: 2, C: 5 }));
    assert.deepEqual(result, { R: 1, I: 0.5, A: 0, S: 0.75, E: 0.25, C: 1 });
  });

  it("usa a média dos 5 itens da dimensão", () => {
    const responses = answers({});
    // R: 1, 2, 3, 4, 5 → média 3 → 0,5
    const rItems = INTEREST_ITEMS.filter((item) => item.dimension === "R");
    rItems.forEach((item, index) => {
      responses[item.id] = index + 1;
    });
    assert.equal(computeInterestProfile(responses)?.R, 0.5);
  });

  it("não calcula perfil parcial", () => {
    const responses = answers({ R: 5 });
    delete responses["c5"];
    assert.equal(computeInterestProfile(responses), null);
    assert.equal(isInterestQuestionnaireComplete(responses), false);
    assert.equal(countAnsweredInterestItems(responses), 29);
  });

  it("ignora respostas fora da escala", () => {
    const responses: InterestResponses = { ...answers({}), r1: 6 };
    assert.equal(computeInterestProfile(responses), null);
    assert.equal(computeInterestProfile({ ...answers({}), r1: 2.5 }), null);
    assert.equal(computeInterestProfile({ ...answers({}), r1: 0 }), null);
  });

  it("ignora chaves que não são itens de interesse", () => {
    const base = computeInterestProfile(answers({ S: 4 }));
    const withExtra = computeInterestProfile({ ...answers({ S: 4 }), autonomy: 5, extra: 1 });
    assert.deepEqual(withExtra, base);
  });

  it("sempre produz um perfil válido entre 0 e 1", () => {
    assert.ok(isInterestProfile(computeInterestProfile(answers({ R: 2, A: 4 }))));
  });
});

describe("classifyProfile", () => {
  it("perfil plano quando a amplitude é ≤ 0,12", () => {
    const result = classifyProfile(profile({ R: 0.5, I: 0.55, A: 0.6, S: 0.5, E: 0.52, C: 0.6 }));
    assert.equal(result.pattern, "flat");
  });

  it("perfil duplo quando a diferença entre os dois primeiros é ≤ 0,10", () => {
    assert.equal(classifyProfile(profile({ I: 0.9, A: 0.85 })).pattern, "dual");
  });

  it("perfil dominante quando o topo ≥ 0,67 e a diferença ≥ 0,15", () => {
    assert.equal(classifyProfile(profile({ S: 0.8, E: 0.5 })).pattern, "dominant");
  });

  it("perfil distribuído nos demais casos", () => {
    // topo baixo demais para dominante
    assert.equal(classifyProfile(profile({ C: 0.6, R: 0.4 })).pattern, "distributed");
  });

  it("plano tem precedência sobre duplo", () => {
    assert.equal(classifyProfile(profile({ R: 0.1, I: 0.1 })).pattern, "flat");
  });

  it("ordena dimensões de forma determinística", () => {
    assert.deepEqual(rankDimensions(profile({ A: 0.5, S: 0.5, R: 0.2 })), [
      "A",
      "S",
      "R",
      "I",
      "E",
      "C",
    ]);
  });
});

describe("profileSimilarity", () => {
  it("é 1 para perfis iguais e 0 para opostos", () => {
    const p = profile({ R: 0.3, I: 0.7, A: 0.2, S: 0.9, E: 0.4, C: 0.6 });
    assert.equal(profileSimilarity(p, p), 1);
    const ones = profile({ R: 1, I: 1, A: 1, S: 1, E: 1, C: 1 });
    assert.equal(profileSimilarity(profile(), ones), 0);
  });

  it("segue clamp01(1 - Σ|diff| / 6)", () => {
    const a = profile({ R: 1, I: 0.5 });
    const b = profile({ R: 0.4, I: 0.2, C: 0.3 });
    // Σ|diff| = 0,6 + 0,3 + 0,3 = 1,2 → 1 - 0,2 = 0,8
    assert.ok(Math.abs(profileSimilarity(a, b) - 0.8) < 1e-12);
  });

  it("clamp01 limita a 0–1", () => {
    assert.equal(clamp01(-1), 0);
    assert.equal(clamp01(2), 1);
    assert.equal(clamp01(Number.NaN), 0);
  });
});

describe("buildCareerRanking", () => {
  const student = profile({ R: 0.2, I: 0.9, A: 0.3, S: 0.4, E: 0.2, C: 0.6 });

  function candidate(pathId: string, areaId: string, interests: InterestProfile): CareerCandidate {
    return { pathId, areaId, interests };
  }

  it("limiar de elegibilidade é max(topo - 0,15, 0,55)", () => {
    assert.ok(Math.abs(eligibilityThreshold(0.95) - 0.8) < 1e-12);
    assert.equal(eligibilityThreshold(0.6), 0.55);
  });

  it("devolve lista vazia sem candidatos", () => {
    const result = buildCareerRanking(student, []);
    assert.deepEqual(result.ranked, []);
    assert.deepEqual(result.recommendations, []);
  });

  it("exclui candidatos abaixo do limiar", () => {
    const result = buildCareerRanking(student, [
      candidate("perto", "a", student),
      candidate("longe", "b", profile({ R: 1, A: 1, E: 1 })),
    ]);
    assert.deepEqual(
      result.recommendations.map((entry) => entry.pathId),
      ["perto"],
    );
    assert.equal(result.ranked.length, 2);
  });

  it("não recomenda nada quando todos ficam abaixo de 0,55", () => {
    const result = buildCareerRanking(profile(), [
      candidate("x", "a", profile({ R: 1, I: 1, A: 1, S: 1 })),
    ]);
    assert.equal(result.recommendations.length, 0);
  });

  it("aplica os limites de diversidade e mantém a ordem por pontuação", () => {
    // 5 áreas com 3 caminhos cada, todos muito parecidos com o estudante.
    const candidates: CareerCandidate[] = [];
    for (const area of ["a1", "a2", "a3", "a4", "a5"]) {
      for (let i = 0; i < 3; i++) {
        candidates.push(candidate(`${area}-p${i}`, area, { ...student, C: student.C - 0.01 * i }));
      }
    }
    const { recommendations } = buildCareerRanking(student, candidates);
    assert.ok(recommendations.length <= MAX_RECOMMENDATIONS);
    const areas = new Map<string, number>();
    for (const entry of recommendations)
      areas.set(entry.areaId, (areas.get(entry.areaId) ?? 0) + 1);
    assert.ok(areas.size <= MAX_AREAS);
    for (const count of areas.values()) assert.ok(count <= MAX_PATHS_PER_AREA);
    const scores = recommendations.map((entry) => entry.score);
    assert.deepEqual(
      scores,
      [...scores].sort((a, b) => b - a),
    );
  });

  it("regressão: a lista exibida fica ordenada por pontuação mesmo quando a diversidade pula itens", () => {
    const candidates = [
      candidate("a-1", "a", student),
      candidate("a-2", "a", { ...student, R: 0.21 }),
      candidate("a-3", "a", { ...student, R: 0.22 }),
      candidate("b-1", "b", { ...student, R: 0.3 }),
    ];
    const { recommendations } = buildCareerRanking(student, candidates);
    assert.deepEqual(
      recommendations.map((entry) => entry.pathId),
      ["a-1", "a-2", "b-1"],
    );
  });

  it("é determinístico e desempata pelo id", () => {
    const candidates = [
      candidate("zeta", "a", student),
      candidate("alfa", "b", student),
      candidate("meio", "c", student),
    ];
    const first = buildCareerRanking(student, candidates);
    const second = buildCareerRanking(student, [...candidates].reverse());
    assert.deepEqual(first, second);
    assert.deepEqual(
      first.recommendations.map((entry) => entry.pathId),
      ["alfa", "meio", "zeta"],
    );
  });

  it("preserva a pontuação de similaridade de cada candidato", () => {
    const other = profile({ I: 0.8, C: 0.5 });
    const { ranked } = buildCareerRanking(student, [candidate("x", "a", other)]);
    assert.equal(ranked[0]?.score, profileSimilarity(student, other));
  });
});
