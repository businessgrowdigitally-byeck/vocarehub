import type {
  FazerPhase,
  JourneyPhase,
  JourneyState,
  JourneyStateV1,
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
      interestResponses: {},
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

function isAnswerRecord(value: unknown): value is Record<string, number> {
  if (!isRecord(value) || Array.isArray(value)) return false;
  return Object.values(value).every(
    (answer) =>
      typeof answer === "number" && Number.isInteger(answer) && answer >= 1 && answer <= 5,
  );
}

/** Valida as partes comuns às versões 1 e 2 (tudo menos os interesses do SER). */
function hasValidPhases(value: Record<string, unknown>): boolean {
  const ser = value["ser"];
  const pensar = value["pensar"];
  const fazer = value["fazer"];
  if (!isRecord(ser) || !isRecord(pensar) || !isRecord(fazer)) return false;

  if (!isPhaseStatus(ser["status"])) return false;
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

export function isJourneyStateV1(value: unknown): value is JourneyStateV1 {
  if (!isRecord(value) || value["version"] !== 1) return false;
  const ser = value["ser"];
  if (!isRecord(ser) || !isStringArray(ser["interests"])) return false;
  return hasValidPhases(value);
}

export function isJourneyStateV2(value: unknown): value is JourneyState {
  if (!isRecord(value) || value["version"] !== JOURNEY_VERSION) return false;
  const ser = value["ser"];
  if (!isRecord(ser) || !isAnswerRecord(ser["interestResponses"])) return false;
  return hasValidPhases(value);
}

/**
 * Leva o progresso da versão 1 para a 2. As etiquetas de interesse antigas não viram
 * respostas do questionário (não há como convertê-las com validade), então o SER volta
 * para "em andamento" e o estudante responde o questionário. Forças, valores,
 * preferências, PENSAR e FAZER são mantidos como estão.
 */
export function migrateJourneyV1ToV2(v1: JourneyStateV1): JourneyState {
  const { interests: _discarded, ...ser } = v1.ser;
  return {
    version: JOURNEY_VERSION,
    ser: {
      ...ser,
      status: ser.status === "not_started" ? "not_started" : "in_progress",
      interestResponses: {},
    },
    pensar: { ...v1.pensar },
    fazer: { ...v1.fazer },
  };
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
