import { useCallback, useEffect, useSyncExternalStore } from "react";

import type {
  FazerPhase,
  JourneyPhase,
  JourneyState,
  PensarPhase,
  PhaseStatus,
  SerPhaseUpdate,
} from "@/lib/journey/types";
import { createInitialJourneyState, updateJourneyPhase } from "@/lib/journey/state";
import { createJourneyStorage } from "@/lib/journey/storage";
import { getNextPhase, hasJourneyStarted } from "@/lib/journey/progress";
import { getJourneyTransitionEvents } from "@/lib/journey/events";
import { trackEvent } from "@/lib/analytics/analytics";

const storage = createJourneyStorage();
const SERVER_STATE = createInitialJourneyState();

let currentState: JourneyState = SERVER_STATE;
let hydrated = false;
const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getStateSnapshot(): JourneyState {
  return currentState;
}

function getServerStateSnapshot(): JourneyState {
  return SERVER_STATE;
}

function getHydratedSnapshot(): boolean {
  return hydrated;
}

function getServerHydratedSnapshot(): boolean {
  return false;
}

function commit(next: JourneyState, persist: boolean): void {
  // Sem consentimento, trackEvent não faz nada (o Google Analytics nem é carregado).
  for (const event of getJourneyTransitionEvents(currentState, next)) trackEvent(event);
  currentState = next;
  if (persist) storage.save(next);
  emit();
}

function hydrate(): void {
  if (hydrated) return;
  currentState = storage.load();
  hydrated = true;
  emit();
}

export function useJourney() {
  const state = useSyncExternalStore(subscribe, getStateSnapshot, getServerStateSnapshot);
  const isHydrated = useSyncExternalStore(
    subscribe,
    getHydratedSnapshot,
    getServerHydratedSnapshot,
  );

  useEffect(() => {
    hydrate();
  }, []);

  const updateSer = useCallback((update: SerPhaseUpdate) => {
    commit(updateJourneyPhase(currentState, "ser", update), true);
  }, []);

  const updatePensar = useCallback((update: Partial<PensarPhase>) => {
    commit(updateJourneyPhase(currentState, "pensar", update), true);
  }, []);

  const updateFazer = useCallback((update: Partial<FazerPhase>) => {
    commit(updateJourneyPhase(currentState, "fazer", update), true);
  }, []);

  const setPhaseStatus = useCallback((phase: JourneyPhase, status: PhaseStatus) => {
    if (phase === "ser") commit(updateJourneyPhase(currentState, "ser", { status }), true);
    else if (phase === "pensar")
      commit(updateJourneyPhase(currentState, "pensar", { status }), true);
    else commit(updateJourneyPhase(currentState, "fazer", { status }), true);
  }, []);

  const resetJourney = useCallback(() => {
    storage.reset();
    hydrated = true;
    commit(createInitialJourneyState(), false);
  }, []);

  return {
    state,
    isHydrated,
    updateSer,
    updatePensar,
    updateFazer,
    setPhaseStatus,
    resetJourney,
    hasStarted: hasJourneyStarted(state),
    nextPhase: getNextPhase(state),
  };
}
