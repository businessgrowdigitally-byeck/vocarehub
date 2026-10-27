import { getSourcedCareerCandidates } from "../../lib/exploration/career-profiles.ts";
import type { CareerCandidate } from "../../lib/exploration/matching.ts";
import { buildCareerRanking } from "../../lib/exploration/matching.ts";
import { computeInterestProfile } from "../../lib/exploration/scoring.ts";
import type { PensarPhase, SerPhase } from "../../lib/journey/types.ts";
import type { CareerPath } from "./career-paths.ts";
import { CAREER_PATHS } from "./career-paths.ts";

export function isKnownPathId(id: string): boolean {
  return CAREER_PATHS.some((path) => path.id === id);
}

export function getCareerPath(id: string): CareerPath | undefined {
  return CAREER_PATHS.find((path) => path.id === id);
}

export function addUniquePathId(list: readonly string[], id: string): string[] {
  if (list.includes(id)) return [...list];
  return [...list, id];
}

export function addExploredPath(pensar: PensarPhase, id: string): PensarPhase {
  if (!isKnownPathId(id)) return pensar;
  return {
    ...pensar,
    exploredPathIds: addUniquePathId(pensar.exploredPathIds, id),
    status: pensar.status === "not_started" ? "in_progress" : pensar.status,
  };
}

export function toggleSavedPath(pensar: PensarPhase, id: string): PensarPhase {
  if (!isKnownPathId(id)) return pensar;
  const isSaved = pensar.savedPathIds.includes(id);
  const savedPathIds = isSaved
    ? pensar.savedPathIds.filter((pathId) => pathId !== id)
    : [...pensar.savedPathIds, id];
  const selectedPathIds = isSaved
    ? pensar.selectedPathIds.filter((pathId) => pathId !== id)
    : pensar.selectedPathIds;
  return { ...pensar, savedPathIds, selectedPathIds, status: "in_progress" };
}

export function setSelectedPaths(pensar: PensarPhase, ids: readonly string[]): PensarPhase {
  const saved = new Set(pensar.savedPathIds);
  const clean = Array.from(new Set(ids.filter((id) => isKnownPathId(id) && saved.has(id))));
  return { ...pensar, selectedPathIds: clean, status: "in_progress" };
}

export function isValidPathSelection(ids: readonly string[]): boolean {
  if (ids.length !== 3) return false;
  if (new Set(ids).size !== 3) return false;
  return ids.every((id) => isKnownPathId(id));
}

export function canCompletePensar(pensar: PensarPhase): boolean {
  return isValidPathSelection(pensar.selectedPathIds);
}

export function getPensarResumeStep(pensar: PensarPhase): number {
  if (pensar.savedPathIds.length === 0) return 1;
  if (isValidPathSelection(pensar.selectedPathIds)) return 4;
  if (pensar.savedPathIds.length >= 3) return 3;
  return 2;
}

export type RecommendationStatus =
  /** O questionário de interesses ainda não foi respondido por completo. */
  | "incomplete-profile"
  /** Não há perfis profissionais com fonte disponíveis. */
  | "no-sourced-profiles"
  /** Há perfis, mas nenhum ficou acima do limiar de elegibilidade. */
  | "no-matches"
  | "ok";

export type RecommendationResult = {
  status: RecommendationStatus;
  paths: CareerPath[];
};

/**
 * Recomendações do PENSAR. Usa só o perfil de interesses do SER (forças, valores e
 * preferências não entram) e só candidatos com fonte ocupacional válida.
 * Não há ranking alternativo: sem candidatos válidos, a lista volta vazia com o motivo.
 */
export function getRecommendationResult(
  serState: SerPhase,
  candidates: readonly CareerCandidate[] = getSourcedCareerCandidates(),
): RecommendationResult {
  const profile = computeInterestProfile(serState.interestResponses);
  if (!profile) return { status: "incomplete-profile", paths: [] };
  if (candidates.length === 0) return { status: "no-sourced-profiles", paths: [] };

  const paths = buildCareerRanking(profile, candidates)
    .recommendations.map((entry) => getCareerPath(entry.pathId))
    .filter((path): path is CareerPath => Boolean(path));
  return { status: paths.length > 0 ? "ok" : "no-matches", paths };
}

export function getRecommendedPaths(
  serState: SerPhase,
  candidates?: readonly CareerCandidate[],
): CareerPath[] {
  return getRecommendationResult(serState, candidates).paths;
}
