export type JourneyPhase = "ser" | "pensar" | "fazer";

export type PhaseStatus = "not_started" | "in_progress" | "completed";

export type Preferences = {
  social: number | null;
  routine: number | null;
  practical: number | null;
  structure: number | null;
};

export type SerPhase = {
  status: PhaseStatus;
  interests: string[];
  strengths: string[];
  values: string[];
  preferences: Preferences;
};

export type SerPhaseUpdate = Partial<Omit<SerPhase, "preferences">> & {
  preferences?: Partial<Preferences>;
};

export type PensarPhase = {
  status: PhaseStatus;
  exploredPathIds: string[];
  savedPathIds: string[];
  selectedPathIds: string[];
};

export type FazerPhase = {
  status: PhaseStatus;
  selectedPathId: string | null;
  missionId: string | null;
  targetDate: string | null;
};

export type JourneyState = {
  version: 1;
  ser: SerPhase;
  pensar: PensarPhase;
  fazer: FazerPhase;
};

export const JOURNEY_VERSION = 1 as const;

export const JOURNEY_STORAGE_KEY = "vocare:journey:v1";

export const JOURNEY_PHASES: readonly JourneyPhase[] = ["ser", "pensar", "fazer"];
