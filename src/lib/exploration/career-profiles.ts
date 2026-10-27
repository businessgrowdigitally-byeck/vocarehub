import { CAREER_PATHS } from "../../features/pensar/career-paths.ts";
import { PENDING_CAREER_PATHS } from "./career-profile-mapping.ts";
import { SOURCED_CAREER_PROFILES } from "./career-profiles.generated.ts";
import type { CareerCandidate } from "./matching.ts";
import type { SourcedCareerProfile } from "./onet-import.ts";
import { isInterestProfile } from "./riasec.ts";

const PENDING_IDS = new Set(PENDING_CAREER_PATHS.map((path) => path.pathId));

export function isPendingCareerPath(pathId: string): boolean {
  return PENDING_IDS.has(pathId);
}

/**
 * Um perfil só entra no ranking se: for ocupacional, tiver confiança alta ou média,
 * citar ao menos um código O*NET, tiver pontuações válidas (0–1), existir no catálogo
 * de apresentação e não estar na lista de caminhos pendentes.
 */
export function isSourcedCareerProfileEligible(profile: SourcedCareerProfile): boolean {
  return (
    profile.sourceKind === "occupational" &&
    (profile.confidence === "high" || profile.confidence === "medium") &&
    Array.isArray(profile.onetSocCodes) &&
    profile.onetSocCodes.length > 0 &&
    isInterestProfile(profile.interests) &&
    !isPendingCareerPath(profile.pathId) &&
    CAREER_PATHS.some((path) => path.id === profile.pathId)
  );
}

/** Única fonte de candidatos do ranking em produção. */
export function getSourcedCareerCandidates(
  profiles: readonly SourcedCareerProfile[] = SOURCED_CAREER_PROFILES,
): CareerCandidate[] {
  const seen = new Set<string>();
  const candidates: CareerCandidate[] = [];
  for (const profile of profiles) {
    if (!isSourcedCareerProfileEligible(profile) || seen.has(profile.pathId)) continue;
    const path = CAREER_PATHS.find((item) => item.id === profile.pathId);
    if (!path) continue;
    seen.add(profile.pathId);
    candidates.push({ pathId: path.id, areaId: path.areaId, interests: profile.interests });
  }
  return candidates;
}

export function getSourcedCareerProfilePathIds(
  profiles: readonly SourcedCareerProfile[] = SOURCED_CAREER_PROFILES,
): string[] {
  return getSourcedCareerCandidates(profiles).map((candidate) => candidate.pathId);
}
