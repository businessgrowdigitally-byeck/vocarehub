import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  createInitialJourneyState,
  isJourneyStateV1,
  isJourneyStateV2,
  migrateJourneyV1ToV2,
  updateJourneyPhase,
} from "./state.ts";
import { createJourneyStorage } from "./storage.ts";
import {
  getNextPhase,
  getOverallProgress,
  getPhaseProgress,
  hasJourneyStarted,
} from "./progress.ts";
import { JOURNEY_STORAGE_KEY, JOURNEY_STORAGE_KEY_V1 } from "./types.ts";
import type { JourneyState, JourneyStateV1 } from "./types.ts";

function createMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.has(key) ? (map.get(key) as string) : null;
    },
    key(index: number) {
      return Array.from(map.keys())[index] ?? null;
    },
    removeItem(key: string) {
      map.delete(key);
    },
    setItem(key: string, value: string) {
      map.set(key, value);
    },
  } as Storage;
}

describe("createInitialJourneyState", () => {
  it("cria estado inicial vazio e válido", () => {
    const state = createInitialJourneyState();
    assert.equal(state.version, 2);
    assert.equal(state.ser.status, "not_started");
    assert.deepEqual(state.ser.interestResponses, {});
    assert.deepEqual(state.ser.strengths, []);
    assert.deepEqual(state.ser.values, []);
    assert.deepEqual(state.ser.preferences, {
      social: null,
      routine: null,
      practical: null,
      structure: null,
    });
    assert.equal(state.pensar.status, "not_started");
    assert.deepEqual(state.pensar.exploredPathIds, []);
    assert.deepEqual(state.pensar.savedPathIds, []);
    assert.deepEqual(state.pensar.selectedPathIds, []);
    assert.equal(state.fazer.status, "not_started");
    assert.equal(state.fazer.selectedPathId, null);
    assert.equal(state.fazer.missionId, null);
    assert.equal(state.fazer.targetDate, null);
  });
});

function legacyState(): JourneyStateV1 {
  return {
    version: 1,
    ser: {
      status: "completed",
      interests: ["create", "technology", "help-people"],
      strengths: ["teamwork", "focus"],
      values: ["autonomy", "learning", "impact"],
      preferences: { social: 4, routine: 2, practical: 5, structure: 3 },
    },
    pensar: {
      status: "completed",
      exploredPathIds: ["data"],
      savedPathIds: ["data", "nursing", "law"],
      selectedPathIds: ["data", "nursing"],
    },
    fazer: {
      status: "in_progress",
      selectedPathId: "data",
      missionId: null,
      targetDate: null,
    },
  };
}

describe("isJourneyStateV2", () => {
  it("aceita o estado inicial", () => {
    assert.equal(isJourneyStateV2(createInitialJourneyState()), true);
  });

  it("rejeita valores que não são objeto", () => {
    assert.equal(isJourneyStateV2(null), false);
    assert.equal(isJourneyStateV2("x"), false);
    assert.equal(isJourneyStateV2(42), false);
  });

  it("rejeita outra versão, inclusive a v1", () => {
    assert.equal(isJourneyStateV2({ ...createInitialJourneyState(), version: 3 }), false);
    assert.equal(isJourneyStateV2(legacyState()), false);
  });

  it("rejeita campos ausentes ou malformados", () => {
    const base = createInitialJourneyState();
    const ser = (patch: object) => ({ ...base, ser: { ...base.ser, ...patch } });
    assert.equal(isJourneyStateV2({ ...base, ser: undefined }), false);
    assert.equal(isJourneyStateV2(ser({ interestResponses: [] })), false);
    assert.equal(isJourneyStateV2(ser({ interestResponses: { r1: 6 } })), false);
    assert.equal(isJourneyStateV2(ser({ interestResponses: { r1: "5" } })), false);
    assert.equal(isJourneyStateV2({ ...base, fazer: { ...base.fazer, missionId: 7 } }), false);
    assert.equal(isJourneyStateV2(ser({ status: "onfire" })), false);
  });

  it("aceita respostas válidas", () => {
    const base = createInitialJourneyState();
    const state = { ...base, ser: { ...base.ser, interestResponses: { r1: 1, c5: 5 } } };
    assert.equal(isJourneyStateV2(state), true);
  });
});

describe("isJourneyStateV1", () => {
  it("reconhece o formato antigo e recusa o novo", () => {
    assert.equal(isJourneyStateV1(legacyState()), true);
    assert.equal(isJourneyStateV1(createInitialJourneyState()), false);
    const broken = legacyState() as unknown as { ser: { interests: unknown } };
    broken.ser.interests = "nada";
    assert.equal(isJourneyStateV1(broken), false);
  });
});

describe("migrateJourneyV1ToV2", () => {
  it("mantém forças, valores, preferências, PENSAR e FAZER", () => {
    const v1 = legacyState();
    const v2 = migrateJourneyV1ToV2(v1);
    assert.equal(isJourneyStateV2(v2), true);
    assert.deepEqual(v2.ser.strengths, v1.ser.strengths);
    assert.deepEqual(v2.ser.values, v1.ser.values);
    assert.deepEqual(v2.ser.preferences, v1.ser.preferences);
    assert.deepEqual(v2.pensar, v1.pensar);
    assert.deepEqual(v2.fazer, v1.fazer);
  });

  it("não converte etiquetas antigas em respostas e reabre o SER", () => {
    const v2 = migrateJourneyV1ToV2(legacyState());
    assert.deepEqual(v2.ser.interestResponses, {});
    assert.equal(v2.ser.status, "in_progress");
    assert.equal("interests" in v2.ser, false);
  });

  it("um SER não iniciado continua não iniciado", () => {
    const v1 = legacyState();
    v1.ser.status = "not_started";
    assert.equal(migrateJourneyV1ToV2(v1).ser.status, "not_started");
  });
});

describe("updateJourneyPhase", () => {
  it("atualiza uma fase sem destruir as outras", () => {
    const initial = createInitialJourneyState();
    const next = updateJourneyPhase(initial, "ser", {
      status: "in_progress",
      interestResponses: { r1: 4 },
    });
    assert.deepEqual(next.ser.interestResponses, { r1: 4 });
    assert.equal(next.ser.status, "in_progress");
    assert.deepEqual(next.pensar, initial.pensar);
    assert.deepEqual(next.fazer, initial.fazer);
    assert.notEqual(next, initial);
  });

  it("preserva preferências não alteradas na atualização parcial", () => {
    const withPrefs = updateJourneyPhase(createInitialJourneyState(), "ser", {
      preferences: { social: 5, routine: 2 },
    });
    const next = updateJourneyPhase(withPrefs, "ser", { preferences: { social: 1 } });
    assert.deepEqual(next.ser.preferences, {
      social: 1,
      routine: 2,
      practical: null,
      structure: null,
    });
  });

  it("não modifica o estado original (imutável)", () => {
    const initial = createInitialJourneyState();
    updateJourneyPhase(initial, "fazer", { selectedPathId: "software-development" });
    assert.equal(initial.fazer.selectedPathId, null);
  });
});

describe("createJourneyStorage", () => {
  it("faz round-trip de serialização e recuperação", () => {
    const storage = createJourneyStorage(createMemoryStorage());
    const state = updateJourneyPhase(createInitialJourneyState(), "ser", {
      status: "in_progress",
      interestResponses: { r1: 4, i1: 2 },
    });
    storage.save(state);
    assert.deepEqual(storage.load(), state);
  });

  it("retorna estado inicial quando o JSON está corrompido", () => {
    const memory = createMemoryStorage();
    memory.setItem(JOURNEY_STORAGE_KEY, "{ isso não é json");
    const storage = createJourneyStorage(memory);
    assert.deepEqual(storage.load(), createInitialJourneyState());
  });

  it("retorna estado inicial para versão desconhecida sem sobrescrever", () => {
    const memory = createMemoryStorage();
    const foreign: JourneyState = createInitialJourneyState();
    const raw = JSON.stringify({ ...foreign, version: 99 });
    memory.setItem(JOURNEY_STORAGE_KEY, raw);
    const storage = createJourneyStorage(memory);
    assert.deepEqual(storage.load(), createInitialJourneyState());
    assert.equal(memory.getItem(JOURNEY_STORAGE_KEY), raw);
  });

  it("carrega dados v1 migrados sem apagar a chave v1", () => {
    const memory = createMemoryStorage();
    const raw = JSON.stringify(legacyState());
    memory.setItem(JOURNEY_STORAGE_KEY_V1, raw);
    const storage = createJourneyStorage(memory);
    assert.deepEqual(storage.load(), migrateJourneyV1ToV2(legacyState()));
    assert.equal(memory.getItem(JOURNEY_STORAGE_KEY_V1), raw);
    assert.equal(memory.getItem(JOURNEY_STORAGE_KEY), null);
  });

  it("prefere a v2 quando as duas versões existem", () => {
    const memory = createMemoryStorage();
    memory.setItem(JOURNEY_STORAGE_KEY_V1, JSON.stringify(legacyState()));
    const storage = createJourneyStorage(memory);
    const state = updateJourneyPhase(createInitialJourneyState(), "ser", { status: "in_progress" });
    storage.save(state);
    assert.deepEqual(storage.load(), state);
  });

  it("ignora v1 inválida", () => {
    const memory = createMemoryStorage();
    memory.setItem(JOURNEY_STORAGE_KEY_V1, JSON.stringify({ version: 1, ser: {} }));
    assert.deepEqual(createJourneyStorage(memory).load(), createInitialJourneyState());
  });

  it("reset também remove a v1, para o progresso antigo não voltar", () => {
    const memory = createMemoryStorage();
    memory.setItem(JOURNEY_STORAGE_KEY_V1, JSON.stringify(legacyState()));
    const storage = createJourneyStorage(memory);
    storage.reset();
    assert.equal(memory.getItem(JOURNEY_STORAGE_KEY_V1), null);
    assert.deepEqual(storage.load(), createInitialJourneyState());
  });

  it("reset remove a chave armazenada", () => {
    const memory = createMemoryStorage();
    const storage = createJourneyStorage(memory);
    storage.save(updateJourneyPhase(createInitialJourneyState(), "ser", { status: "in_progress" }));
    assert.notEqual(memory.getItem(JOURNEY_STORAGE_KEY), null);
    storage.reset();
    assert.equal(memory.getItem(JOURNEY_STORAGE_KEY), null);
  });

  it("funciona sem localStorage (SSR) sem lançar", () => {
    const storage = createJourneyStorage();
    assert.deepEqual(storage.load(), createInitialJourneyState());
    storage.save(createInitialJourneyState());
    storage.reset();
  });

  it("não quebra quando o storage lança erro", () => {
    const blocked = {
      getItem() {
        throw new Error("bloqueado");
      },
      setItem() {
        throw new Error("bloqueado");
      },
      removeItem() {
        throw new Error("bloqueado");
      },
    } as unknown as Storage;
    const storage = createJourneyStorage(blocked);
    assert.deepEqual(storage.load(), createInitialJourneyState());
    storage.save(createInitialJourneyState());
    storage.reset();
  });
});

describe("progresso", () => {
  it("mapeia status para percentual", () => {
    assert.equal(getPhaseProgress("not_started"), 0);
    assert.equal(getPhaseProgress("in_progress"), 50);
    assert.equal(getPhaseProgress("completed"), 100);
  });

  it("calcula progresso geral pela média das fases", () => {
    let state = createInitialJourneyState();
    assert.equal(getOverallProgress(state), 0);
    state = updateJourneyPhase(state, "ser", { status: "completed" });
    assert.equal(getOverallProgress(state), 33);
    state = updateJourneyPhase(state, "pensar", { status: "in_progress" });
    assert.equal(getOverallProgress(state), 50);
    state = updateJourneyPhase(state, "fazer", { status: "completed" });
    assert.equal(getOverallProgress(state), 83);
    state = updateJourneyPhase(state, "pensar", { status: "completed" });
    assert.equal(getOverallProgress(state), 100);
  });

  it("detecta jornada iniciada e próxima fase", () => {
    let state = createInitialJourneyState();
    assert.equal(hasJourneyStarted(state), false);
    assert.equal(getNextPhase(state), "ser");

    state = updateJourneyPhase(state, "ser", { status: "completed" });
    assert.equal(hasJourneyStarted(state), true);
    assert.equal(getNextPhase(state), "pensar");

    state = updateJourneyPhase(state, "pensar", { status: "completed" });
    state = updateJourneyPhase(state, "fazer", { status: "completed" });
    assert.equal(getNextPhase(state), null);
  });
});
