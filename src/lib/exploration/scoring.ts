import { INTEREST_ITEMS, INTEREST_SCALE_MAX, INTEREST_SCALE_MIN } from "./interest-items.ts";
import type { InterestProfile, RiasecDimension } from "./riasec.ts";
import { RIASEC_DIMENSIONS, clamp01 } from "./riasec.ts";

/** Respostas do estudante: id do item → valor de 1 a 5. */
export type InterestResponses = Readonly<Record<string, number>>;

export function isValidInterestAnswer(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= INTEREST_SCALE_MIN &&
    value <= INTEREST_SCALE_MAX
  );
}

export function countAnsweredInterestItems(responses: InterestResponses): number {
  return INTEREST_ITEMS.filter((item) => isValidInterestAnswer(responses[item.id])).length;
}

export function isInterestQuestionnaireComplete(responses: InterestResponses): boolean {
  return countAnsweredInterestItems(responses) === INTEREST_ITEMS.length;
}

/**
 * Calcula o perfil de interesses a partir das 30 respostas.
 * Para cada dimensão: média das respostas (1–5) normalizada com (média - 1) / 4.
 * Retorna null se faltar qualquer resposta: um perfil parcial não é calculado.
 */
export function computeInterestProfile(responses: InterestResponses): InterestProfile | null {
  if (!isInterestQuestionnaireComplete(responses)) return null;

  const sums: Record<RiasecDimension, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  const counts: Record<RiasecDimension, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  for (const item of INTEREST_ITEMS) {
    sums[item.dimension] += responses[item.id] as number;
    counts[item.dimension] += 1;
  }

  const profile = {} as Record<RiasecDimension, number>;
  for (const dimension of RIASEC_DIMENSIONS) {
    const mean = sums[dimension] / counts[dimension];
    profile[dimension] = clamp01((mean - 1) / 4);
  }
  return profile;
}
