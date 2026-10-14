import type { JourneyPhase, JourneyState, PhaseStatus } from "./types.ts";
import { JOURNEY_PHASES } from "./types.ts";

const PHASE_STATUS_PROGRESS: Record<PhaseStatus, number> = {
  not_started: 0,
  in_progress: 50,
  completed: 100,
};

export function getPhaseProgress(status: PhaseStatus): number {
  return PHASE_STATUS_PROGRESS[status];
}

export function getOverallProgress(state: JourneyState): number {
  const total = JOURNEY_PHASES.reduce(
    (sum, phase) => sum + getPhaseProgress(state[phase].status),
    0,
  );
  return Math.round(total / JOURNEY_PHASES.length);
}

export function hasJourneyStarted(state: JourneyState): boolean {
  return JOURNEY_PHASES.some((phase) => state[phase].status !== "not_started");
}

export function getNextPhase(state: JourneyState): JourneyPhase | null {
  for (const phase of JOURNEY_PHASES) {
    if (state[phase].status !== "completed") return phase;
  }
  return null;
}
