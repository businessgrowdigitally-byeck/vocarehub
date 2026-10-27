import type { JourneyState } from "./types.ts";
import { JOURNEY_STORAGE_KEY, JOURNEY_STORAGE_KEY_V1 } from "./types.ts";
import {
  createInitialJourneyState,
  isJourneyStateV1,
  isJourneyStateV2,
  migrateJourneyV1ToV2,
} from "./state.ts";

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

function readJson(store: Storage, key: string): unknown {
  try {
    const raw = store.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function createJourneyStorage(storage?: Storage): JourneyStorage {
  // Lê a v2; se não existir, aproveita a v1 sem apagá-la. A v2 só é gravada no próximo save.
  const load = (): JourneyState => {
    const store = resolveStorage(storage);
    if (!store) return createInitialJourneyState();

    const current = readJson(store, JOURNEY_STORAGE_KEY);
    if (current !== null) {
      return isJourneyStateV2(current) ? current : createInitialJourneyState();
    }

    const legacy = readJson(store, JOURNEY_STORAGE_KEY_V1);
    if (isJourneyStateV1(legacy)) return migrateJourneyV1ToV2(legacy);
    return createInitialJourneyState();
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
      // Remove também a v1; senão o progresso antigo voltaria no próximo load.
      store.removeItem(JOURNEY_STORAGE_KEY);
      store.removeItem(JOURNEY_STORAGE_KEY_V1);
    } catch {
      // localStorage indisponível: nada a remover.
    }
  };

  return { load, save, reset };
}
