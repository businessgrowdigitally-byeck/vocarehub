import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { getJourneyTransitionEvents } from "./events.ts";
import { createInitialJourneyState, updateJourneyPhase } from "./state.ts";

describe("getJourneyTransitionEvents", () => {
  const initial = createInitialJourneyState();

  it("dispara ser_started quando o SER sai de não iniciado", () => {
    const next = updateJourneyPhase(initial, "ser", { status: "in_progress" });
    assert.deepEqual(getJourneyTransitionEvents(initial, next), ["ser_started"]);
  });

  it("dispara a conclusão de cada fase uma vez, na transição", () => {
    let state = updateJourneyPhase(initial, "ser", { status: "in_progress" });
    const serDone = updateJourneyPhase(state, "ser", { status: "completed" });
    assert.deepEqual(getJourneyTransitionEvents(state, serDone), ["ser_completed"]);
    // Gravar de novo o mesmo status não repete o evento.
    assert.deepEqual(getJourneyTransitionEvents(serDone, serDone), []);

    state = updateJourneyPhase(serDone, "pensar", { status: "completed" });
    assert.deepEqual(getJourneyTransitionEvents(serDone, state), ["pensar_completed"]);
    const fazerDone = updateJourneyPhase(state, "fazer", { status: "completed" });
    assert.deepEqual(getJourneyTransitionEvents(state, fazerDone), ["fazer_completed"]);
  });

  it("pular direto para concluído conta início e conclusão", () => {
    const next = updateJourneyPhase(initial, "ser", { status: "completed" });
    assert.deepEqual(getJourneyTransitionEvents(initial, next), ["ser_started", "ser_completed"]);
  });

  it("mudanças sem troca de status e o reinício não disparam eventos", () => {
    const started = updateJourneyPhase(initial, "ser", { status: "in_progress" });
    const answered = updateJourneyPhase(started, "ser", { interestResponses: { r1: 4 } });
    assert.deepEqual(getJourneyTransitionEvents(started, answered), []);
    assert.deepEqual(getJourneyTransitionEvents(answered, createInitialJourneyState()), []);
  });

  it("os eventos não carregam dados: são só nomes de etapa", () => {
    const done = updateJourneyPhase(initial, "ser", { status: "completed" });
    for (const event of getJourneyTransitionEvents(initial, done)) {
      assert.match(event, /^(ser|pensar|fazer|passport)_[a-z]+$/);
    }
  });
});
