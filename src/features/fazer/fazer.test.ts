import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { MISSIONS, getMission, isKnownMissionId } from "./missions.ts";
import {
  addDaysISO,
  canCompleteFazer,
  getFazerPaths,
  getFazerResumeStep,
  isSelectedPathValid,
  isValidTargetDate,
  setMission,
  setSelectedPath,
  setTargetDate,
} from "./fazer-logic.ts";
import type { FazerPhase, PensarPhase } from "../../lib/journey/types.ts";

const TODAY = "2026-10-14";

function emptyFazer(): FazerPhase {
  return {
    status: "not_started",
    selectedPathId: null,
    missionId: null,
    targetDate: null,
  };
}

function readyPensar(): PensarPhase {
  return {
    status: "completed",
    exploredPathIds: ["data"],
    savedPathIds: ["data", "graphic-design", "pedagogy"],
    selectedPathIds: ["data", "graphic-design", "pedagogy"],
  };
}

describe("catálogo de missões", () => {
  it("tem IDs únicos e dados mínimos", () => {
    const ids = MISSIONS.map((mission) => mission.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const mission of MISSIONS) {
      assert.ok(mission.title.length > 0, `title vazio em ${mission.id}`);
      assert.ok(mission.description.length > 0, `description vazia em ${mission.id}`);
      assert.ok(mission.durationHint.length > 0, `durationHint vazio em ${mission.id}`);
    }
  });

  it("reconhece IDs conhecidos", () => {
    assert.equal(isKnownMissionId("mini-project"), true);
    assert.equal(isKnownMissionId("missao-impossivel"), false);
    assert.equal(getMission("follow-content")?.title, "Acompanhe conteúdo");
    assert.equal(getMission("nao-existe"), undefined);
  });
});

describe("escolha do caminho", () => {
  it("lista apenas os caminhos selecionados no PENSAR", () => {
    const paths = getFazerPaths(readyPensar());
    assert.deepEqual(
      paths.map((path) => path.id),
      ["data", "graphic-design", "pedagogy"],
    );
  });

  it("valida que o caminho escolhido pertence à seleção", () => {
    const pensar = readyPensar();
    assert.equal(isSelectedPathValid(emptyFazer(), pensar), false);
    const chosen = setSelectedPath(emptyFazer(), pensar, "data");
    assert.equal(isSelectedPathValid(chosen, pensar), true);
  });

  it("ignora caminhos que não estão entre os selecionados", () => {
    const pensar = readyPensar();
    const next = setSelectedPath(emptyFazer(), pensar, "medicine");
    assert.equal(next.selectedPathId, null);
    assert.equal(next.status, "not_started");
  });
});

describe("missão e data-alvo", () => {
  it("aceita apenas missões conhecidas e inicia a fase", () => {
    const next = setMission(emptyFazer(), "mini-project");
    assert.equal(next.missionId, "mini-project");
    assert.equal(next.status, "in_progress");
    assert.equal(setMission(emptyFazer(), "nao-existe").missionId, null);
  });

  it("valida datas no formato ISO, não retroativas", () => {
    assert.equal(isValidTargetDate(TODAY, TODAY), true);
    assert.equal(isValidTargetDate("2026-12-31", TODAY), true);
    assert.equal(isValidTargetDate("2026-10-13", TODAY), false);
    assert.equal(isValidTargetDate("2026-02-31", TODAY), false);
    assert.equal(isValidTargetDate("15/10/2026", TODAY), false);
    assert.equal(isValidTargetDate(null, TODAY), false);
  });

  it("soma dias a partir de uma data ISO", () => {
    assert.equal(addDaysISO("2026-10-14", 7), "2026-10-21");
    assert.equal(addDaysISO("2026-10-14", 30), "2026-11-13");
  });
});

describe("getFazerResumeStep", () => {
  it("retoma conforme o estado", () => {
    const pensar = readyPensar();
    assert.equal(getFazerResumeStep(emptyFazer(), pensar, TODAY), 1);

    const withPath = setSelectedPath(emptyFazer(), pensar, "data");
    assert.equal(getFazerResumeStep(withPath, pensar, TODAY), 2);

    const withMission = setMission(withPath, "mini-project");
    assert.equal(getFazerResumeStep(withMission, pensar, TODAY), 3);

    const withDate = setTargetDate(withMission, "2026-11-01");
    assert.equal(getFazerResumeStep(withDate, pensar, TODAY), 3);
  });
});

describe("canCompleteFazer", () => {
  it("exige caminho válido, missão e data futura", () => {
    const pensar = readyPensar();
    let fazer = setSelectedPath(emptyFazer(), pensar, "data");
    assert.equal(canCompleteFazer(fazer, pensar, TODAY), false);

    fazer = setMission(fazer, "mini-project");
    assert.equal(canCompleteFazer(fazer, pensar, TODAY), false);

    fazer = setTargetDate(fazer, "2026-10-20");
    assert.equal(canCompleteFazer(fazer, pensar, TODAY), true);
  });

  it("falha se o caminho sair da seleção do PENSAR", () => {
    const pensar = readyPensar();
    let fazer = setSelectedPath(emptyFazer(), pensar, "data");
    fazer = setMission(fazer, "mini-project");
    fazer = setTargetDate(fazer, "2026-10-20");

    const changedPensar: PensarPhase = { ...pensar, selectedPathIds: ["graphic-design"] };
    assert.equal(canCompleteFazer(fazer, changedPensar, TODAY), false);
  });
});
