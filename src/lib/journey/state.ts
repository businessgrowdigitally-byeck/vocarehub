import type {
  FazerPhase,
  JourneyPhase,
  JourneyState,
  PensarPhase,
  PhaseStatus,
  SerPhase,
  SerPhaseUpdate,
} from "./types.ts";
import { JOURNEY_VERSION } from "./types.ts";

export function createInitialJourneyState(): JourneyState {
  return {
    version: JOURNEY_VERSION,
    ser: {
      status: "not_started",
      interests: [],
      strengths: [],
      values: [],
      preferences: {
        social: null,
        routine: null,
        practical: null,
        structure: null,
      },
    },
    pensar: {
      status: "not_started",
      exploredPathIds: [],
      savedPathIds: [],
      selectedPathIds: [],
    },
    fazer: {
      status: "not_started",
      selectedPathId: null,
      missionId: null,
      targetDate: null,
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isPhaseStatus(value: unknown): value is PhaseStatus {
  return value === "not_started" || value === "in_progress" || value === "completed";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isNullableNumber(value: unknown): value is number | null {
  return value === null || typeof value === "number";
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

export function isJourneyStateV1(value: unknown): value is JourneyState {
  if (!isRecord(value)) return false;
  if (value["version"] !== JOURNEY_VERSION) return false;

  const ser = value["ser"];
  const pensar = value["pensar"];
  const fazer = value["fazer"];
  if (!isRecord(ser) || !isRecord(pensar) || !isRecord(fazer)) return false;

  if (!isPhaseStatus(ser["status"])) return false;
  if (!isStringArray(ser["interests"])) return false;
  if (!isStringArray(ser["strengths"])) return false;
  if (!isStringArray(ser["values"])) return false;

  const preferences = ser["preferences"];
  if (!isRecord(preferences)) return false;
  if (!isNullableNumber(preferences["social"])) return false;
  if (!isNullableNumber(preferences["routine"])) return false;
  if (!isNullableNumber(preferences["practical"])) return false;
  if (!isNullableNumber(preferences["structure"])) return false;

  if (!isPhaseStatus(pensar["status"])) return false;
  if (!isStringArray(pensar["exploredPathIds"])) return false;
  if (!isStringArray(pensar["savedPathIds"])) return false;
  if (!isStringArray(pensar["selectedPathIds"])) return false;

  if (!isPhaseStatus(fazer["status"])) return false;
  if (!isNullableString(fazer["selectedPathId"])) return false;
  if (!isNullableString(fazer["missionId"])) return false;
  if (!isNullableString(fazer["targetDate"])) return false;

  return true;
}

export function updateJourneyPhase(
  state: JourneyState,
  phase: "ser",
  update: SerPhaseUpdate,
): JourneyState;
export function updateJourneyPhase(
  state: JourneyState,
  phase: "pensar",
  update: Partial<PensarPhase>,
): JourneyState;
export function updateJourneyPhase(
  state: JourneyState,
  phase: "fazer",
  update: Partial<FazerPhase>,
): JourneyState;
export function updateJourneyPhase(
  state: JourneyState,
  phase: JourneyPhase,
  update: SerPhaseUpdate | Partial<PensarPhase> | Partial<FazerPhase>,
): JourneyState;
export function updateJourneyPhase(
  state: JourneyState,
  phase: JourneyPhase,
  update: SerPhaseUpdate | Partial<PensarPhase> | Partial<FazerPhase>,
): JourneyState {
  if (phase === "ser") {
    const patch = update as SerPhaseUpdate;
    const nextSer: SerPhase = {
      ...state.ser,
      ...patch,
      preferences: { ...state.ser.preferences, ...(patch.preferences ?? {}) },
    };
    return { ...state, ser: nextSer };
  }

  if (phase === "pensar") {
    const nextPensar: PensarPhase = { ...state.pensar, ...(update as Partial<PensarPhase>) };
    return { ...state, pensar: nextPensar };
  }

  const nextFazer: FazerPhase = { ...state.fazer, ...(update as Partial<FazerPhase>) };
  return { ...state, fazer: nextFazer };
}
