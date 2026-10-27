import type { InterestProfile } from "./riasec.ts";
import { RIASEC_DIMENSIONS, clamp01 } from "./riasec.ts";

export type CareerCandidate = {
  pathId: string;
  areaId: string;
  interests: InterestProfile;
};

export type RankedCareer = {
  pathId: string;
  areaId: string;
  score: number;
};

export type CareerRanking = {
  /** Todos os candidatos, do mais ao menos parecido. */
  ranked: RankedCareer[];
  /** Limiar mínimo usado para a elegibilidade. */
  threshold: number;
  /** Seleção diversa exibida ao estudante, em ordem de pontuação. */
  recommendations: RankedCareer[];
};

export const ELIGIBILITY_MARGIN = 0.15;
export const ELIGIBILITY_FLOOR = 0.55;
export const MAX_RECOMMENDATIONS = 6;
export const MAX_AREAS = 4;
export const MAX_PATHS_PER_AREA = 2;

/** Similaridade por distância de Manhattan normalizada: clamp01(1 - Σ|diff| / 6). */
export function profileSimilarity(a: InterestProfile, b: InterestProfile): number {
  const distance = RIASEC_DIMENSIONS.reduce(
    (sum, dimension) => sum + Math.abs(a[dimension] - b[dimension]),
    0,
  );
  return clamp01(1 - distance / RIASEC_DIMENSIONS.length);
}

export function eligibilityThreshold(topScore: number): number {
  return Math.max(topScore - ELIGIBILITY_MARGIN, ELIGIBILITY_FLOOR);
}

/** Pontuação maior primeiro; empate resolvido pelo id do caminho (determinístico). */
export function compareRanked(a: RankedCareer, b: RankedCareer): number {
  return b.score - a.score || (a.pathId < b.pathId ? -1 : a.pathId > b.pathId ? 1 : 0);
}

export function buildCareerRanking(
  profile: InterestProfile,
  candidates: readonly CareerCandidate[],
): CareerRanking {
  const ranked = candidates
    .map((candidate) => ({
      pathId: candidate.pathId,
      areaId: candidate.areaId,
      score: profileSimilarity(profile, candidate.interests),
    }))
    .sort(compareRanked);

  const topScore = ranked[0]?.score ?? 0;
  const threshold = eligibilityThreshold(topScore);

  const perArea = new Map<string, number>();
  const recommendations: RankedCareer[] = [];
  for (const entry of ranked) {
    if (recommendations.length >= MAX_RECOMMENDATIONS) break;
    if (entry.score < threshold) break;
    const areaCount = perArea.get(entry.areaId) ?? 0;
    if (areaCount === 0 && perArea.size >= MAX_AREAS) continue;
    if (areaCount >= MAX_PATHS_PER_AREA) continue;
    perArea.set(entry.areaId, areaCount + 1);
    recommendations.push(entry);
  }

  return { ranked, threshold, recommendations: recommendations.sort(compareRanked) };
}
