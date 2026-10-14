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

export function getPathRelevance(path: CareerPath, serState: SerPhase): number {
  const known = new Set([...serState.interests, ...serState.strengths, ...serState.values]);
  return path.tags.filter((tag) => known.has(tag)).length;
}

export function getRecommendedPaths(serState: SerPhase, limit = 6): CareerPath[] {
  return CAREER_PATHS.map((path, index) => ({
    path,
    index,
    score: getPathRelevance(path, serState),
  }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map((entry) => entry.path);
}
