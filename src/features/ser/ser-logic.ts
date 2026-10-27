import type { ProfilePattern } from "../../lib/exploration/classification.ts";
import { classifyProfile } from "../../lib/exploration/classification.ts";
import { INTEREST_ITEMS, INTEREST_ITEMS_PER_PAGE } from "../../lib/exploration/interest-items.ts";
import type { RiasecTheme } from "../../lib/exploration/riasec.ts";
import { RIASEC_THEMES } from "../../lib/exploration/riasec.ts";
import type { InterestResponses } from "../../lib/exploration/scoring.ts";
import {
  computeInterestProfile,
  isInterestQuestionnaireComplete,
  isValidInterestAnswer,
} from "../../lib/exploration/scoring.ts";
import type { Preferences, SerPhase } from "../../lib/journey/types.ts";
import type { SerOption } from "./ser-options.ts";
import { PREFERENCE_SCALES, STRENGTH_MAX, STRENGTH_MIN, VALUE_FINAL } from "./ser-options.ts";

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
    isInterestQuestionnaireComplete(ser.interestResponses) &&
    isStrengthSelectionValid(ser.strengths) &&
    isValueSelectionValid(ser.values) &&
    arePreferencesValid(ser.preferences)
  );
}

export function getSerResumeStep(ser: SerPhase): number {
  if (!isInterestQuestionnaireComplete(ser.interestResponses)) return 1;
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

/** Primeira página do questionário com alguma pergunta sem resposta (0 se todas respondidas). */
export function getFirstUnansweredInterestPage(responses: InterestResponses): number {
  const index = INTEREST_ITEMS.findIndex((item) => !isValidInterestAnswer(responses[item.id]));
  return index === -1 ? 0 : Math.floor(index / INTEREST_ITEMS_PER_PAGE);
}

export type InterestSummary = {
  pattern: ProfilePattern;
  message: string;
  themes: RiasecTheme[];
};

const PATTERN_MESSAGES: Record<ProfilePattern, string> = {
  flat: "Seus interesses aparecem bem equilibrados. Isso abre espaço para explorar áreas variadas.",
  dual: "Dois temas chamaram sua atenção com força parecida.",
  dominant: "Um tema se destacou nas suas respostas.",
  distributed: "Alguns temas chamaram mais a sua atenção.",
};

const PATTERN_THEME_COUNT: Record<ProfilePattern, number> = {
  flat: 0,
  dual: 2,
  dominant: 1,
  distributed: 3,
};

/** Resumo para o estudante: descreve o que chamou atenção, sem diagnosticar. */
export function getInterestSummary(responses: InterestResponses): InterestSummary | null {
  const profile = computeInterestProfile(responses);
  if (!profile) return null;
  const { pattern, ranked } = classifyProfile(profile);
  return {
    pattern,
    message: PATTERN_MESSAGES[pattern],
    themes: ranked
      .slice(0, PATTERN_THEME_COUNT[pattern])
      .map((dimension) => RIASEC_THEMES[dimension]),
  };
}

/**
 * Teclado no grupo de respostas (padrão WAI-ARIA de radio group): setas mudam a resposta
 * com volta ao início/fim; Home e End vão às pontas. Sem resposta, o foco está na
 * primeira opção. Devolve null para teclas que não mudam a resposta.
 */
export function getNextScaleValue(
  current: number | undefined,
  key: string,
  max: number,
): number | null {
  const position = current ?? 1;
  if (key === "ArrowRight" || key === "ArrowDown") return position >= max ? 1 : position + 1;
  if (key === "ArrowLeft" || key === "ArrowUp") return position <= 1 ? max : position - 1;
  if (key === "Home") return 1;
  if (key === "End") return max;
  return null;
}
