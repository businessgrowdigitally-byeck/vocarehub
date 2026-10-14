import type { JourneyState } from "./types.ts";
import { JOURNEY_STORAGE_KEY } from "./types.ts";
import { createInitialJourneyState, isJourneyStateV1 } from "./state.ts";

export type JourneyStorage = {
  load: () => JourneyState;
  save: (state: JourneyState) => void;
  reset: () => void;
};

function resolveStorage(storage?: Storage): Storage | null {
  if (storage) return storage;
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function createJourneyStorage(storage?: Storage): JourneyStorage {
  const load = (): JourneyState => {
    const store = resolveStorage(storage);
    if (!store) return createInitialJourneyState();

    let raw: string | null;
    try {
      raw = store.getItem(JOURNEY_STORAGE_KEY);
    } catch {
      return createInitialJourneyState();
    }
    if (!raw) return createInitialJourneyState();

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return createInitialJourneyState();
    }

    if (!isJourneyStateV1(parsed)) return createInitialJourneyState();
    return parsed;
  };

  const save = (state: JourneyState): void => {
    const store = resolveStorage(storage);
    if (!store) return;
    try {
      store.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage indisponível ou cota excedida: mantém funcionamento em memória.
    }
  };

  const reset = (): void => {
    const store = resolveStorage(storage);
    if (!store) return;
    try {
      store.removeItem(JOURNEY_STORAGE_KEY);
    } catch {
      // localStorage indisponível: nada a remover.
    }
  };

  return { load, save, reset };
}
