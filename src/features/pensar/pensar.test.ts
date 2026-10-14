import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { CAREER_AREAS } from "./career-areas.ts";
import { CAREER_PATHS } from "./career-paths.ts";
import {
  addExploredPath,
  addUniquePathId,
  canCompletePensar,
  getCareerPath,
  getPathRelevance,
  getPensarResumeStep,
  getRecommendedPaths,
  isKnownPathId,
  isValidPathSelection,
  setSelectedPaths,
  toggleSavedPath,
} from "./pensar-logic.ts";
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
    interests: [],
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

describe("relevância e recomendação", () => {
  it("pontua tags presentes no estado do SER", () => {
    const software = getCareerPath("software-development");
    assert.ok(software);
    const score = getPathRelevance(software, serState({ interests: ["technology", "create"] }));
    assert.equal(score, 2);
  });

  it("recomenda de forma determinística, sem duplicados e ordenada", () => {
    const ser = serState({
      interests: ["technology", "problem-solving", "create"],
      strengths: ["focus", "learning"],
    });
    const first = getRecommendedPaths(ser);
    const second = getRecommendedPaths(ser);
    assert.deepEqual(
      first.map((path) => path.id),
      second.map((path) => path.id),
    );
    assert.ok(first.length <= 6);
    assert.equal(new Set(first.map((path) => path.id)).size, first.length);

    const scores = first.map((path) => getPathRelevance(path, ser));
    for (let i = 1; i < scores.length; i += 1) {
      assert.ok((scores[i - 1] ?? 0) >= (scores[i] ?? 0), "ordenação por score descendente");
    }
  });

  it("respeita o limite informado", () => {
    const ser = serState({ interests: ["technology", "create", "help-people", "learning"] });
    assert.ok(getRecommendedPaths(ser, 3).length <= 3);
  });
});
