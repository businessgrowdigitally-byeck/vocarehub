import type { FazerPhase, PensarPhase } from "../../lib/journey/types.ts";
import type { CareerPath } from "../pensar/career-paths.ts";
import { getCareerPath } from "../pensar/pensar-logic.ts";
import { isKnownMissionId } from "./missions.ts";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function getFazerPaths(pensar: PensarPhase): CareerPath[] {
  return pensar.selectedPathIds
    .map((id) => getCareerPath(id))
    .filter((path): path is CareerPath => Boolean(path));
}

export function isSelectedPathValid(fazer: FazerPhase, pensar: PensarPhase): boolean {
  return fazer.selectedPathId !== null && pensar.selectedPathIds.includes(fazer.selectedPathId);
}

export function setSelectedPath(fazer: FazerPhase, pensar: PensarPhase, id: string): FazerPhase {
  if (!pensar.selectedPathIds.includes(id)) return fazer;
  return { ...fazer, selectedPathId: id, status: "in_progress" };
}

export function setMission(fazer: FazerPhase, id: string): FazerPhase {
  if (!isKnownMissionId(id)) return fazer;
  return { ...fazer, missionId: id, status: "in_progress" };
}

export function setTargetDate(fazer: FazerPhase, date: string | null): FazerPhase {
  return { ...fazer, targetDate: date, status: "in_progress" };
}

export function isValidTargetDate(date: string | null, todayISO: string): boolean {
  if (!date || !ISO_DATE.test(date)) return false;
  const time = Date.parse(`${date}T00:00:00Z`);
  const today = Date.parse(`${todayISO}T00:00:00Z`);
  if (Number.isNaN(time) || Number.isNaN(today)) return false;
  return time >= today;
}

export function addDaysISO(baseISO: string, days: number): string {
  const base = Date.parse(`${baseISO}T00:00:00Z`);
  return new Date(base + days * 86_400_000).toISOString().slice(0, 10);
}

export function getFazerResumeStep(
  fazer: FazerPhase,
  pensar: PensarPhase,
  todayISO: string,
): number {
  if (!isSelectedPathValid(fazer, pensar)) return 1;
  if (!isKnownMissionId(fazer.missionId ?? "")) return 2;
  if (!isValidTargetDate(fazer.targetDate, todayISO)) return 3;
  return 3;
}

export function canCompleteFazer(
  fazer: FazerPhase,
  pensar: PensarPhase,
  todayISO: string,
): boolean {
  return (
    isSelectedPathValid(fazer, pensar) &&
    isKnownMissionId(fazer.missionId ?? "") &&
    isValidTargetDate(fazer.targetDate, todayISO)
  );
}
