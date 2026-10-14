import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { createInitialJourneyState, isJourneyStateV1, updateJourneyPhase } from "./state.ts";
import { createJourneyStorage } from "./storage.ts";
import {
  getNextPhase,
  getOverallProgress,
  getPhaseProgress,
  hasJourneyStarted,
} from "./progress.ts";
import { JOURNEY_STORAGE_KEY } from "./types.ts";
import type { JourneyState } from "./types.ts";

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
    assert.equal(state.version, 1);
    assert.equal(state.ser.status, "not_started");
    assert.deepEqual(state.ser.interests, []);
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

describe("isJourneyStateV1", () => {
  it("aceita o estado inicial", () => {
    assert.equal(isJourneyStateV1(createInitialJourneyState()), true);
  });

  it("rejeita valores que não são objeto", () => {
    assert.equal(isJourneyStateV1(null), false);
    assert.equal(isJourneyStateV1("x"), false);
    assert.equal(isJourneyStateV1(42), false);
  });

  it("rejeita versão desconhecida", () => {
    const state = { ...createInitialJourneyState(), version: 2 };
    assert.equal(isJourneyStateV1(state), false);
  });

  it("rejeita campos ausentes ou malformados", () => {
    const base = createInitialJourneyState();
    assert.equal(isJourneyStateV1({ ...base, ser: undefined }), false);
    assert.equal(isJourneyStateV1({ ...base, ser: { ...base.ser, interests: "nada" } }), false);
    assert.equal(isJourneyStateV1({ ...base, fazer: { ...base.fazer, missionId: 7 } }), false);
    assert.equal(isJourneyStateV1({ ...base, ser: { ...base.ser, status: "onfire" } }), false);
  });
});

describe("updateJourneyPhase", () => {
  it("atualiza uma fase sem destruir as outras", () => {
    const initial = createInitialJourneyState();
    const next = updateJourneyPhase(initial, "ser", {
      status: "in_progress",
      interests: ["create"],
    });
    assert.deepEqual(next.ser.interests, ["create"]);
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
      interests: ["create", "technology"],
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
    const foreign: JourneyState = { ...createInitialJourneyState(), version: 1 };
    const raw = JSON.stringify({ ...foreign, version: 99 });
    memory.setItem(JOURNEY_STORAGE_KEY, raw);
    const storage = createJourneyStorage(memory);
    assert.deepEqual(storage.load(), createInitialJourneyState());
    assert.equal(memory.getItem(JOURNEY_STORAGE_KEY), raw);
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
