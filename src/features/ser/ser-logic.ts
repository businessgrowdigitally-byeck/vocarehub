import type { Preferences, SerPhase } from "../../lib/journey/types.ts";
import type { SerOption } from "./ser-options.ts";
import {
  INTEREST_MAX,
  INTEREST_MIN,
  PREFERENCE_SCALES,
  STRENGTH_MAX,
  STRENGTH_MIN,
  VALUE_FINAL,
} from "./ser-options.ts";

export function isInterestSelectionValid(interests: readonly string[]): boolean {
  return interests.length >= INTEREST_MIN && interests.length <= INTEREST_MAX;
}

export function isStrengthSelectionValid(strengths: readonly string[]): boolean {
  return strengths.length >= STRENGTH_MIN && strengths.length <= STRENGTH_MAX;
}

export function isValueSelectionValid(values: readonly string[]): boolean {
  return values.length === VALUE_FINAL;
}

export function arePreferencesValid(preferences: Preferences): boolean {
  return PREFERENCE_SCALES.every((scale) => {
    const value = preferences[scale.key];
    return typeof value === "number" && value >= 1 && value <= 5;
  });
}

export function canCompleteSer(ser: SerPhase): boolean {
  return (
    isInterestSelectionValid(ser.interests) &&
    isStrengthSelectionValid(ser.strengths) &&
    isValueSelectionValid(ser.values) &&
    arePreferencesValid(ser.preferences)
  );
}

export function getSerResumeStep(ser: SerPhase): number {
  if (!isInterestSelectionValid(ser.interests)) return 1;
  if (!isStrengthSelectionValid(ser.strengths)) return 2;
  if (!isValueSelectionValid(ser.values)) return 3;
  if (!arePreferencesValid(ser.preferences)) return 4;
  return 5;
}

export function getOptionLabel(id: string, options: readonly SerOption[]): string {
  return options.find((option) => option.id === id)?.label ?? id;
}

export function getPreferenceSummary(preferences: Preferences): string[] {
  return PREFERENCE_SCALES.map((scale) => {
    const value = preferences[scale.key];
    if (value === null) return scale.neutralPhrase;
    if (value < 3) return scale.lowPhrase;
    if (value > 3) return scale.highPhrase;
    return scale.neutralPhrase;
  });
}
