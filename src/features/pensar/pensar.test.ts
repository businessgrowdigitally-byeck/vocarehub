import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { CAREER_AREAS } from "./career-areas.ts";
import { CAREER_PATHS } from "./career-paths.ts";
import {
  addExploredPath,
  addUniquePathId,
  canCompletePensar,
  getCareerPath,
  getPensarResumeStep,
  getRecommendationResult,
  getRecommendedPaths,
  isKnownPathId,
  isValidPathSelection,
  setSelectedPaths,
  toggleSavedPath,
} from "./pensar-logic.ts";
import { SOURCED_CAREER_PROFILES } from "../../lib/exploration/career-profiles.generated.ts";
import { getSourcedCareerCandidates } from "../../lib/exploration/career-profiles.ts";
import { INTEREST_ITEMS } from "../../lib/exploration/interest-items.ts";
import { buildCareerRanking } from "../../lib/exploration/matching.ts";
import type { SourcedCareerProfile } from "../../lib/exploration/onet-import.ts";
import type { InterestProfile, RiasecDimension } from "../../lib/exploration/riasec.ts";
import { computeInterestProfile } from "../../lib/exploration/scoring.ts";
import type { PensarPhase, SerPhase } from "../../lib/journey/types.ts";

function emptyPensar(): PensarPhase {
  return {
    status: "not_started",
    exploredPathIds: [],
    savedPathIds: [],
    selectedPathIds: [],
  };
}

function serState(overrides: Partial<SerPhase> = {}): SerPhase {
  return {
    status: "completed",
    interestResponses: {},
    strengths: [],
    values: [],
    preferences: { social: null, routine: null, practical: null, structure: null },
    ...overrides,
  };
}

describe("catálogo de caminhos", () => {
  it("tem entre 24 e 32 caminhos com IDs únicos", () => {
    assert.ok(CAREER_PATHS.length >= 24 && CAREER_PATHS.length <= 32);
    const ids = CAREER_PATHS.map((path) => path.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  it("usa áreas conhecidas em todos os caminhos", () => {
    const areaIds = new Set(CAREER_AREAS.map((area) => area.id));
    for (const path of CAREER_PATHS) {
      assert.ok(areaIds.has(path.areaId), `área desconhecida em ${path.id}`);
    }
  });

  it("possui todos os dados mínimos preenchidos", () => {
    for (const path of CAREER_PATHS) {
      assert.ok(path.title.length > 0, `title vazio em ${path.id}`);
      assert.ok(path.shortDescription.length > 0, `shortDescription vazio em ${path.id}`);
      assert.ok(path.whatTheyDo.length > 0, `whatTheyDo vazio em ${path.id}`);
      assert.ok(path.entryPaths.length >= 2, `entryPaths insuficiente em ${path.id}`);
      assert.ok(path.skills.length >= 3, `skills insuficiente em ${path.id}`);
      assert.ok(path.tags.length >= 1, `tags insuficiente em ${path.id}`);
      assert.ok(path.experimentIdea.length > 0, `experimentIdea vazio em ${path.id}`);
    }
  });
});

describe("helpers de IDs", () => {
  it("reconhece IDs conhecidos e desconhecidos", () => {
    assert.equal(isKnownPathId("software-development"), true);
    assert.equal(isKnownPathId("curso-de-magia"), false);
    assert.equal(getCareerPath("data")?.title, "Dados");
    assert.equal(getCareerPath("nao-existe"), undefined);
  });

  it("adiciona IDs únicos sem duplicar", () => {
    assert.deepEqual(addUniquePathId(["a"], "b"), ["a", "b"]);
    assert.deepEqual(addUniquePathId(["a", "b"], "a"), ["a", "b"]);
  });
});

describe("explorar e salvar", () => {
  it("registra exploração sem duplicar e inicia a fase", () => {
    let pensar = emptyPensar();
    pensar = addExploredPath(pensar, "data");
    pensar = addExploredPath(pensar, "data");
    pensar = addExploredPath(pensar, "nao-existe");
    assert.deepEqual(pensar.exploredPathIds, ["data"]);
    assert.equal(pensar.status, "in_progress");
  });

  it("salva e remove caminhos, retirando da seleção ao remover", () => {
    let pensar = emptyPensar();
    pensar = toggleSavedPath(pensar, "data");
    pensar = toggleSavedPath(pensar, "graphic-design");
    assert.deepEqual(pensar.savedPathIds, ["data", "graphic-design"]);

    pensar = setSelectedPaths(pensar, ["data"]);
    assert.deepEqual(pensar.selectedPathIds, ["data"]);

    pensar = toggleSavedPath(pensar, "data");
    assert.deepEqual(pensar.savedPathIds, ["graphic-design"]);
    assert.deepEqual(pensar.selectedPathIds, []);
  });

  it("ao salvar novamente após conclusão, volta para in_progress", () => {
    const completed: PensarPhase = {
      ...emptyPensar(),
      status: "completed",
      savedPathIds: ["data"],
      selectedPathIds: ["data"],
    };
    assert.equal(toggleSavedPath(completed, "data").status, "in_progress");
  });
});

describe("seleção de três caminhos", () => {
  it("exige exatamente três IDs conhecidos e únicos", () => {
    assert.equal(isValidPathSelection(["data", "graphic-design"]), false);
    assert.equal(isValidPathSelection(["data", "graphic-design", "data"]), false);
    assert.equal(isValidPathSelection(["data", "graphic-design", "nao-existe"]), false);
    assert.equal(isValidPathSelection(["data", "graphic-design", "pedagogy"]), true);
  });

  it("filtra desconhecidos, não salvos e duplicados", () => {
    const pensar: PensarPhase = {
      ...emptyPensar(),
      savedPathIds: ["data", "graphic-design"],
    };
    const next = setSelectedPaths(pensar, ["data", "data", "pedagogy", "nao-existe"]);
    assert.deepEqual(next.selectedPathIds, ["data"]);
  });

  it("permite concluir apenas com seleção válida", () => {
    const valid: PensarPhase = {
      ...emptyPensar(),
      selectedPathIds: ["data", "graphic-design", "pedagogy"],
    };
    assert.equal(canCompletePensar(valid), true);
    assert.equal(canCompletePensar(emptyPensar()), false);
  });
});

describe("getPensarResumeStep", () => {
  it("retoma conforme o estado", () => {
    assert.equal(getPensarResumeStep(emptyPensar()), 1);

    const someSaved: PensarPhase = { ...emptyPensar(), savedPathIds: ["data"] };
    assert.equal(getPensarResumeStep(someSaved), 2);

    const threeSaved: PensarPhase = {
      ...emptyPensar(),
      savedPathIds: ["data", "graphic-design", "pedagogy"],
    };
    assert.equal(getPensarResumeStep(threeSaved), 3);

    const selected: PensarPhase = {
      ...threeSaved,
      selectedPathIds: ["data", "graphic-design", "pedagogy"],
    };
    assert.equal(getPensarResumeStep(selected), 4);
  });
});

// Perfis sintéticos: existem só nos testes e nunca entram no ranking de produção.
function fixture(pathId: string, interests: InterestProfile): SourcedCareerProfile {
  return {
    pathId,
    sourceKind: "occupational",
    confidence: "high",
    interests,
    onetSocCodes: ["00-0000.00"],
  };
}

const INVESTIGATIVE: InterestProfile = { R: 0.3, I: 1, A: 0.2, S: 0.3, E: 0.1, C: 0.6 };
const SOCIAL: InterestProfile = { R: 0.1, I: 0.3, A: 0.4, S: 1, E: 0.4, C: 0.2 };

const FIXTURES: SourcedCareerProfile[] = [
  fixture("data", INVESTIGATIVE),
  fixture("chemistry", { ...INVESTIGATIVE, C: 0.5 }),
  fixture("cybersecurity", { ...INVESTIGATIVE, R: 0.4 }),
  fixture("nursing", SOCIAL),
  fixture("social-work", { ...SOCIAL, E: 0.5 }),
  // Pendentes: mesmo com dados "perfeitos", não podem ser recomendados.
  fixture("digital-product", INVESTIGATIVE),
  fixture("entrepreneurship", INVESTIGATIVE),
  fixture("international-relations", INVESTIGATIVE),
];

function answers(byDimension: Partial<Record<RiasecDimension, number>>): Record<string, number> {
  return Object.fromEntries(
    INTEREST_ITEMS.map((item) => [item.id, byDimension[item.dimension] ?? 1]),
  );
}

// Estudante com interesse investigativo forte: I=5, C=3, R=2, A=2, S=2, E=1.
const INVESTIGATIVE_ANSWERS = answers({ I: 5, C: 3, R: 2, A: 2, S: 2, E: 1 });

describe("recomendação (SER → perfil RIASEC → candidatos com fonte → ranking)", () => {
  const candidates = getSourcedCareerCandidates(FIXTURES);

  it("sem o questionário completo, não recomenda nada", () => {
    const result = getRecommendationResult(serState(), candidates);
    assert.deepEqual(result, { status: "incomplete-profile", paths: [] });
  });

  it("sem perfis com fonte, devolve vazio — sem ranking alternativo", () => {
    const ser = serState({ interestResponses: INVESTIGATIVE_ANSWERS, values: ["impact"] });
    assert.deepEqual(getRecommendationResult(ser, []), {
      status: "no-sourced-profiles",
      paths: [],
    });
  });

  it("em produção usa getSourcedCareerCandidates()", () => {
    const ser = serState({ interestResponses: INVESTIGATIVE_ANSWERS });
    assert.deepEqual(
      getRecommendationResult(ser),
      getRecommendationResult(ser, getSourcedCareerCandidates()),
    );
    if (SOURCED_CAREER_PROFILES.length === 0) {
      assert.equal(getRecommendationResult(ser).status, "no-sourced-profiles");
    }
  });

  it("recomenda exatamente o ranking calculado a partir dos interesses", () => {
    const ser = serState({ interestResponses: INVESTIGATIVE_ANSWERS });
    const profile = computeInterestProfile(INVESTIGATIVE_ANSWERS);
    assert.ok(profile);
    const expected = buildCareerRanking(profile, candidates).recommendations.map(
      (entry) => entry.pathId,
    );
    const result = getRecommendationResult(ser, candidates);
    assert.equal(result.status, "ok");
    assert.deepEqual(
      result.paths.map((path) => path.id),
      expected,
    );
    // Perfil do estudante: R .25, I 1, A .25, S .25, E 0, C .5.
    // Distância Σ|diff|: chemistry 0,25 < data 0,35 < cybersecurity 0,45.
    assert.deepEqual(
      result.paths.slice(0, 3).map((path) => path.id),
      ["chemistry", "data", "cybersecurity"],
    );
    assert.ok(!result.paths.some((path) => path.id === "nursing"));
  });

  it("nunca recomenda os três caminhos pendentes", () => {
    const ser = serState({ interestResponses: INVESTIGATIVE_ANSWERS });
    const ids = getRecommendedPaths(ser, candidates).map((path) => path.id);
    for (const pending of ["digital-product", "entrepreneurship", "international-relations"]) {
      assert.ok(!ids.includes(pending), pending);
    }
  });

  it("forças, valores e preferências não alteram o resultado", () => {
    const base = serState({ interestResponses: INVESTIGATIVE_ANSWERS });
    const other = serState({
      interestResponses: INVESTIGATIVE_ANSWERS,
      strengths: ["listening", "teamwork", "explaining"],
      values: ["impact", "belonging", "balance"],
      preferences: { social: 5, routine: 5, practical: 1, structure: 5 },
    });
    assert.deepEqual(
      getRecommendationResult(other, candidates),
      getRecommendationResult(base, candidates),
    );
  });

  it("interesses diferentes levam a recomendações diferentes", () => {
    const social = serState({ interestResponses: answers({ S: 5, A: 2, E: 2, I: 2, C: 1, R: 1 }) });
    assert.equal(getRecommendedPaths(social, candidates)[0]?.id, "nursing");
  });

  it("informa quando nenhum caminho fica acima do limiar", () => {
    const ser = serState({ interestResponses: answers({ R: 5, A: 5, E: 5 }) });
    const onlySocial = getSourcedCareerCandidates([fixture("nursing", SOCIAL)]);
    assert.deepEqual(getRecommendationResult(ser, onlySocial), { status: "no-matches", paths: [] });
  });

  it("é determinístico e sem duplicados, com no máximo 6 caminhos", () => {
    const ser = serState({ interestResponses: INVESTIGATIVE_ANSWERS });
    const first = getRecommendedPaths(ser, candidates).map((path) => path.id);
    assert.deepEqual(
      getRecommendedPaths(ser, candidates).map((path) => path.id),
      first,
    );
    assert.ok(first.length <= 6);
    assert.equal(new Set(first).size, first.length);
  });
});
