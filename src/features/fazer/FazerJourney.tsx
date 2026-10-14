import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Flag, Target } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useJourney } from "@/hooks/use-journey";
import { cn } from "@/lib/utils";
import { getCareerArea } from "../pensar/career-areas";
import { getCareerPath } from "../pensar/pensar-logic";
import { MISSIONS, getMission } from "./missions";
import {
  addDaysISO,
  canCompleteFazer,
  getFazerPaths,
  getFazerResumeStep,
  isSelectedPathValid,
  setMission,
  setSelectedPath,
  setTargetDate,
} from "./fazer-logic";

const TOTAL_STEPS = 3;
const STEP_TITLES = ["Escolher caminho", "Escolher missão", "Definir prazo"];

const DATE_PRESETS = [
  { label: "Em 1 semana", days: 7 },
  { label: "Em 2 semanas", days: 14 },
  { label: "Em 1 mês", days: 30 },
] as const;

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}/${month}/${year}`;
}

export function FazerJourney() {
  const { state, isHydrated, updateFazer } = useJourney();
  const pensar = state.pensar;
  const fazer = state.fazer;
  const todayISO = new Date().toISOString().slice(0, 10);
  const [step, setStep] = useState<number | null>(null);

  const paths = getFazerPaths(pensar);
  const pensarReady = pensar.status === "completed" && paths.length === 3;
  const complete = canCompleteFazer(fazer, pensar, todayISO);

  useEffect(() => {
    if (!isHydrated || step !== null) return;
    setStep(getFazerResumeStep(fazer, pensar, todayISO));
  }, [isHydrated, step, fazer, pensar, todayISO]);

  const selectedPath = fazer.selectedPathId ? getCareerPath(fazer.selectedPathId) : undefined;
  const mission = fazer.missionId ? getMission(fazer.missionId) : undefined;

  const choosePath = (id: string) => updateFazer(setSelectedPath(fazer, pensar, id));
  const chooseMission = (id: string) => updateFazer(setMission(fazer, id));
  const chooseDate = (date: string | null) => updateFazer(setTargetDate(fazer, date));

  const displayStep = step ?? 1;
  const currentTitle = STEP_TITLES[displayStep - 1] ?? "";
  const canAdvance =
    displayStep === 1
      ? isSelectedPathValid(fazer, pensar)
      : displayStep === 2
        ? Boolean(mission)
        : complete;

  const finish = () => {
    if (complete) updateFazer({ status: "completed" });
  };

  const goNext = () => setStep(Math.min(TOTAL_STEPS, displayStep + 1));
  const goBack = () => setStep(Math.max(1, displayStep - 1));

  return (
    <div className="min-h-screen bg-amazon text-offwhite">
      <SiteHeader />

      <section className="px-5 pb-10 pt-12">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow text-solar">FAZER</p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Olhe para frente.
          </h1>
          <p className="mt-4 max-w-xl text-offwhite/75">
            Escolha um caminho, defina uma missão e marque quando vai começar. Um passo pequeno já
            conta.
          </p>

          {pensarReady && !(complete && fazer.status === "completed") && (
            <div className="mt-8">
              <div className="flex items-center justify-between gap-4">
                <span className="eyebrow text-offwhite/60">{currentTitle}</span>
                <span className="font-mono text-[11px] text-offwhite/60">
                  {displayStep} de {TOTAL_STEPS}
                </span>
              </div>
              <div
                className="mt-2 h-2 w-full overflow-hidden rounded-full bg-offwhite/10"
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={TOTAL_STEPS}
                aria-valuenow={displayStep}
                aria-label="Progresso do FAZER"
              >
                <div
                  className="h-full rounded-full bg-solar transition-all duration-300"
                  style={{ width: `${(displayStep / TOTAL_STEPS) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="px-5 pb-28">
        <div className="mx-auto max-w-4xl">
          {!isHydrated || step === null ? (
            <p className="text-offwhite/60">Carregando…</p>
          ) : !pensarReady ? (
            <div className="rounded-3xl border border-offwhite/12 bg-offwhite/5 p-6 sm:p-8">
              <h2 className="font-display text-2xl font-bold">Antes de fazer, pense.</h2>
              <p className="mt-2 text-sm text-offwhite/70">
                O FAZER parte dos três caminhos que você escolheu. Finalize o PENSAR e selecione
                três caminhos para montar seu primeiro passo.
              </p>
              <Link
                to="/pensar"
                className="tap mt-5 inline-flex items-center gap-2 rounded-full bg-solar px-6 py-3 font-display font-bold text-ink"
              >
                Ir para o PENSAR
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : complete && fazer.status === "completed" ? (
            <div className="rounded-3xl border border-solar/40 bg-solar/10 p-6 sm:p-8">
              <p className="eyebrow text-solar">PLANO TRAÇADO</p>
              <h2 className="mt-2 font-display text-3xl font-bold">Você deu o primeiro passo.</h2>
              <p className="mt-2 max-w-xl text-offwhite/80">
                Guarde este plano. Não precisa ser perfeito — precisa ser o seu próximo passo.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-offwhite/12 bg-amazon/40 p-5">
                  <Flag className="h-5 w-5 text-solar" aria-hidden="true" />
                  <p className="eyebrow mt-3 text-offwhite/50">CAMINHO</p>
                  <p className="mt-1 font-display font-bold">{selectedPath?.title}</p>
                  <p className="text-xs text-offwhite/60">
                    {selectedPath ? getCareerArea(selectedPath.areaId)?.title : ""}
                  </p>
                </div>
                <div className="rounded-2xl border border-offwhite/12 bg-amazon/40 p-5">
                  <Target className="h-5 w-5 text-solar" aria-hidden="true" />
                  <p className="eyebrow mt-3 text-offwhite/50">MISSÃO</p>
                  <p className="mt-1 font-display font-bold">{mission?.title}</p>
                  <p className="text-xs text-offwhite/60">{mission?.durationHint}</p>
                </div>
                <div className="rounded-2xl border border-offwhite/12 bg-amazon/40 p-5">
                  <CalendarDays className="h-5 w-5 text-solar" aria-hidden="true" />
                  <p className="eyebrow mt-3 text-offwhite/50">ATÉ</p>
                  <p className="mt-1 font-display font-bold">
                    {fazer.targetDate ? formatDate(fazer.targetDate) : ""}
                  </p>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  to="/resumo"
                  className="tap inline-flex items-center gap-2 rounded-full bg-solar px-6 py-3 font-display font-bold text-ink"
                >
                  Ver meu passaporte
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => updateFazer({ status: "in_progress" })}
                  className="tap rounded-full border border-offwhite/25 px-5 py-3 text-sm text-offwhite/85 transition-colors hover:bg-offwhite/10"
                >
                  Editar plano
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-offwhite/12 bg-offwhite/5 p-6 sm:p-8">
              {displayStep === 1 && (
                <div>
                  <h2 className="font-display text-2xl font-bold">Escolha um caminho</h2>
                  <p className="mt-2 text-sm text-offwhite/70">
                    Você não precisa abandonar os outros. Comece por aquele que quer investigar
                    primeiro.
                  </p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    {paths.map((path) => {
                      const active = fazer.selectedPathId === path.id;
                      return (
                        <button
                          key={path.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => choosePath(path.id)}
                          className={cn(
                            "tap rounded-2xl border p-5 text-left transition-colors",
                            active
                              ? "border-solar bg-solar/15"
                              : "border-offwhite/12 bg-offwhite/5 hover:border-solar/50",
                          )}
                        >
                          <span className="flex items-center justify-between gap-2">
                            <span className="eyebrow text-solar">
                              {getCareerArea(path.areaId)?.title}
                            </span>
                            {active && <Check className="h-4 w-4 text-solar" aria-hidden="true" />}
                          </span>
                          <span className="mt-2 block font-display text-lg font-bold">
                            {path.title}
                          </span>
                          <span className="mt-2 block text-sm text-offwhite/75">
                            {path.shortDescription}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {displayStep === 2 && (
                <div>
                  <h2 className="font-display text-2xl font-bold">Escolha uma missão</h2>
                  <p className="mt-2 text-sm text-offwhite/70">
                    Uma ação pequena e concreta para experimentar{" "}
                    <span className="text-solar">{selectedPath?.title}</span> na prática.
                  </p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {MISSIONS.map((item) => {
                      const active = fazer.missionId === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => chooseMission(item.id)}
                          className={cn(
                            "tap rounded-2xl border p-5 text-left transition-colors",
                            active
                              ? "border-solar bg-solar/15"
                              : "border-offwhite/12 bg-offwhite/5 hover:border-solar/50",
                          )}
                        >
                          <span className="flex items-start justify-between gap-2">
                            <span className="font-display text-lg font-bold">{item.title}</span>
                            {active && (
                              <Check
                                className="mt-0.5 h-4 w-4 shrink-0 text-solar"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                          <span className="mt-2 block text-sm text-offwhite/75">
                            {item.description}
                          </span>
                          <span className="mt-3 inline-block font-mono text-[11px] uppercase tracking-[0.14em] text-offwhite/50">
                            {item.durationHint}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {displayStep === 3 && (
                <div>
                  <h2 className="font-display text-2xl font-bold">Quando você vai começar?</h2>
                  <p className="mt-2 text-sm text-offwhite/70">
                    Escolha uma data para concluir sua missão. Uma meta com prazo é mais fácil de
                    cumprir.
                  </p>

                  <div className="mt-5 max-w-xs">
                    <label htmlFor="fazer-target-date" className="eyebrow block text-offwhite/60">
                      DATA-ALVO
                    </label>
                    <input
                      id="fazer-target-date"
                      type="date"
                      value={fazer.targetDate ?? ""}
                      min={todayISO}
                      onChange={(event) => chooseDate(event.target.value || null)}
                      className="mt-2 w-full rounded-xl border border-offwhite/25 bg-amazon/40 px-4 py-3 text-offwhite outline-none focus:border-solar"
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {DATE_PRESETS.map((preset) => (
                      <button
                        key={preset.days}
                        type="button"
                        onClick={() => chooseDate(addDaysISO(todayISO, preset.days))}
                        className="tap rounded-full border border-offwhite/25 px-4 py-2 text-sm text-offwhite/85 transition-colors hover:bg-offwhite/10"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {fazer.targetDate && (
                    <p className="mt-4 text-sm text-offwhite/70" role="status">
                      Missão <span className="text-solar">{mission?.title}</span> para{" "}
                      <span className="text-solar">{formatDate(fazer.targetDate)}</span>.
                    </p>
                  )}
                </div>
              )}

              <div className="mt-8 flex items-center justify-between gap-3 border-t border-offwhite/10 pt-6">
                <button
                  type="button"
                  disabled={displayStep <= 1}
                  onClick={goBack}
                  className={cn(
                    "tap inline-flex items-center gap-2 rounded-full border border-offwhite/25 px-5 py-3 text-sm transition-colors hover:bg-offwhite/10",
                    displayStep <= 1 && "cursor-not-allowed opacity-40 hover:bg-transparent",
                  )}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </button>

                {displayStep < TOTAL_STEPS ? (
                  <button
                    type="button"
                    disabled={!canAdvance}
                    onClick={goNext}
                    className={cn(
                      "tap inline-flex items-center gap-2 rounded-full bg-solar px-6 py-3 font-display font-bold text-ink transition-opacity",
                      !canAdvance && "cursor-not-allowed opacity-40",
                    )}
                  >
                    Continuar
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!complete}
                    onClick={finish}
                    className={cn(
                      "tap inline-flex items-center gap-2 rounded-full bg-solar px-6 py-3 font-display font-bold text-ink transition-transform hover:-translate-y-0.5",
                      !complete && "cursor-not-allowed opacity-40 hover:translate-y-0",
                    )}
                  >
                    Concluir meu plano
                    <Flag className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />

      <div className="px-5 pb-10">
        <div className="mx-auto max-w-4xl">
          <Link to="/pensar" className="text-sm text-offwhite/50 underline underline-offset-4">
            Rever meus 3 caminhos
          </Link>
        </div>
      </div>
    </div>
  );
}
