import type { JourneyState } from "../../lib/journey/types.ts";
import { getCareerArea } from "../pensar/career-areas.ts";
import type { CareerPath } from "../pensar/career-paths.ts";
import { getCareerPath } from "../pensar/pensar-logic.ts";
import type { Mission } from "../fazer/missions.ts";
import { getMission } from "../fazer/missions.ts";
import { getInterestSummary, getOptionLabel, getPreferenceSummary } from "../ser/ser-logic.ts";
import { STRENGTH_OPTIONS, VALUE_OPTIONS } from "../ser/ser-options.ts";

export type LabeledItem = {
  id: string;
  label: string;
};

export type JourneyPlan = {
  path: CareerPath | null;
  areaTitle: string | null;
  mission: Mission | null;
  targetDate: string | null;
};

export type JourneySummary = {
  interests: LabeledItem[];
  strengths: LabeledItem[];
  values: LabeledItem[];
  preferences: string[];
  paths: CareerPath[];
  plan: JourneyPlan;
};

export function isJourneyComplete(state: JourneyState): boolean {
  return (
    state.ser.status === "completed" &&
    state.pensar.status === "completed" &&
    state.fazer.status === "completed"
  );
}

function toLabeledItems(
  ids: readonly string[],
  options: readonly { id: string; label: string }[],
): LabeledItem[] {
  return ids.map((id) => ({ id, label: getOptionLabel(id, options) }));
}

/** Temas de interesse em destaque; num perfil equilibrado, um único item que diz isso. */
function interestItems(state: JourneyState): LabeledItem[] {
  const summary = getInterestSummary(state.ser.interestResponses);
  if (!summary) return [];
  if (summary.themes.length === 0) return [{ id: "balanced", label: "Interesses equilibrados" }];
  return summary.themes.map((theme) => ({ id: theme.dimension, label: theme.label }));
}

export function buildJourneySummary(state: JourneyState): JourneySummary {
  const planPath = state.fazer.selectedPathId
    ? getCareerPath(state.fazer.selectedPathId)
    : undefined;
  return {
    interests: interestItems(state),
    strengths: toLabeledItems(state.ser.strengths, STRENGTH_OPTIONS),
    values: toLabeledItems(state.ser.values, VALUE_OPTIONS),
    preferences: getPreferenceSummary(state.ser.preferences),
    paths: state.pensar.selectedPathIds
      .map((id) => getCareerPath(id))
      .filter((path): path is CareerPath => Boolean(path)),
    plan: {
      path: planPath ?? null,
      areaTitle: planPath ? (getCareerArea(planPath.areaId)?.title ?? null) : null,
      mission: state.fazer.missionId ? (getMission(state.fazer.missionId) ?? null) : null,
      targetDate: state.fazer.targetDate,
    },
  };
}
