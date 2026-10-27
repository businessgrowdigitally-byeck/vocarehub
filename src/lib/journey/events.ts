import type { JourneyState } from "./types.ts";
import { JOURNEY_PHASES } from "./types.ts";

/**
 * Eventos anônimos do funil da jornada. Só dizem qual etapa foi alcançada —
 * nunca respostas, caminhos escolhidos ou qualquer dado pessoal.
 */
export type JourneyEventName =
  "ser_started" | "ser_completed" | "pensar_completed" | "fazer_completed" | "passport_downloaded";

/** Eventos disparados por uma mudança de estado (ex.: SER passou de não iniciado para iniciado). */
export function getJourneyTransitionEvents(
  previous: JourneyState,
  next: JourneyState,
): JourneyEventName[] {
  const events: JourneyEventName[] = [];
  if (previous.ser.status === "not_started" && next.ser.status !== "not_started") {
    events.push("ser_started");
  }
  for (const phase of JOURNEY_PHASES) {
    if (previous[phase].status !== "completed" && next[phase].status === "completed") {
      events.push(`${phase}_completed`);
    }
  }
  return events;
}
