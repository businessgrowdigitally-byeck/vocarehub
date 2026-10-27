import type { InterestProfile, RiasecDimension } from "./riasec.ts";
import { RIASEC_DIMENSIONS } from "./riasec.ts";

export type ProfilePattern = "flat" | "dual" | "dominant" | "distributed";

// Limiares provisórios: são escolhas de produto, não padrões validados cientificamente.
export const FLAT_RANGE_MAX = 0.12;
export const DUAL_GAP_MAX = 0.1;
export const DOMINANT_TOP_MIN = 0.67;
export const DOMINANT_GAP_MIN = 0.15;

export type ProfileClassification = {
  pattern: ProfilePattern;
  /** Dimensões da maior para a menor; empate resolvido pela ordem R-I-A-S-E-C. */
  ranked: RiasecDimension[];
};

export function rankDimensions(profile: InterestProfile): RiasecDimension[] {
  return RIASEC_DIMENSIONS.map((dimension, index) => ({ dimension, index }))
    .sort((a, b) => profile[b.dimension] - profile[a.dimension] || a.index - b.index)
    .map((entry) => entry.dimension);
}

/** Precedência: flat → dual → dominant → distributed. */
export function classifyProfile(profile: InterestProfile): ProfileClassification {
  const ranked = rankDimensions(profile);
  const scores = ranked.map((dimension) => profile[dimension]);
  const top = scores[0] ?? 0;
  const second = scores[1] ?? 0;
  const bottom = scores[scores.length - 1] ?? 0;
  const range = top - bottom;
  const gap = top - second;

  let pattern: ProfilePattern = "distributed";
  if (range <= FLAT_RANGE_MAX) pattern = "flat";
  else if (gap <= DUAL_GAP_MAX) pattern = "dual";
  else if (top >= DOMINANT_TOP_MIN && gap >= DOMINANT_GAP_MIN) pattern = "dominant";

  return { pattern, ranked };
}
