import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useJourney } from "@/hooks/use-journey";
import { cn } from "@/lib/utils";
import type { Preferences, SerPhaseUpdate } from "@/lib/journey/types";
import {
  INTEREST_MAX,
  INTEREST_MIN,
  INTEREST_OPTIONS,
  PREFERENCE_SCALES,
  STRENGTH_MAX,
  STRENGTH_MIN,
  STRENGTH_OPTIONS,
  VALUE_FINAL,
  VALUE_MAX,
  VALUE_OPTIONS,
} from "./ser-options";
import type { PreferenceKey, SerOption } from "./ser-options";
import {
  arePreferencesValid,
  canCompleteSer,
  getOptionLabel,
  getPreferenceSummary,
  getSerResumeStep,
  isInterestSelectionValid,
  isStrengthSelectionValid,
  isValueSelectionValid,
} from "./ser-logic";

const TOTAL_STEPS = 5;
const STEP_TITLES = ["Interesses", "Forças", "Valores", "Preferências", "Meu Mapa"];

function toggleId(list: string[], id: string, max: number): string[] {
  if (list.includes(id)) return list.filter((item) => item !== id);
  if (list.length >= max) return list;
  return [...list, id];
}

function Chip({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "tap inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-left text-sm transition-colors",
        selected
          ? "border-solar bg-solar font-medium text-ink"
          : "border-offwhite/25 text-offwhite/85 hover:border-solar/70",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      {selected && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
      {label}
    </button>
  );
}

function MapSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="eyebrow text-solar">{title}</p>
      {items.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <li
              key={item}
              className="rounded-full border border-offwhite/20 px-3.5 py-1.5 text-sm text-offwhite/85"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-offwhite/50">Ainda não selecionado.</p>
      )}
    </div>
  );
}

function OptionGroup({
  options,
  selected,
  max,
  onToggle,
  ariaLabel,
}: {
  options: readonly SerOption[];
  selected: string[];
  max: number;
  onToggle: (id: string) => void;
  ariaLabel: string;
}) {
  return (
    <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const isSelected = selected.includes(option.id);
        const atMax = selected.length >= max && !isSelected;
        return (
          <Chip
            key={option.id}
            label={option.label}
            selected={isSelected}
            disabled={atMax}
            onClick={() => onToggle(option.id)}
          />
        );
      })}
    </div>
  );
}

export function SerJourney() {
  const { state, isHydrated, updateSer } = useJourney();
  const [step, setStep] = useState<number | null>(null);
  const ser = state.ser;

  useEffect(() => {
    if (!isHydrated || step !== null) return;
    setStep(getSerResumeStep(state.ser));
    if (state.ser.status === "not_started") {
      updateSer({ status: "in_progress" });
    }
  }, [isHydrated, step, state.ser, updateSer]);

  useEffect(() => {
    if (step !== 5 || !isHydrated) return;
    if (canCompleteSer(state.ser) && state.ser.status !== "completed") {
      updateSer({ status: "completed" });
    }
  }, [step, isHydrated, state.ser, updateSer]);

  const setField = (patch: SerPhaseUpdate) => {
    updateSer({ status: "in_progress", ...patch });
  };

  const setPreference = (key: PreferenceKey, value: number) => {
    setField({ preferences: { [key]: value } as Partial<Preferences> });
  };

  const displayStep = step ?? 1;
  const currentTitle = STEP_TITLES[displayStep - 1] ?? "";

  const isStepValid = (() => {
    if (displayStep === 1) return isInterestSelectionValid(ser.interests);
    if (displayStep === 2) return isStrengthSelectionValid(ser.strengths);
    if (displayStep === 3) return isValueSelectionValid(ser.values);
    if (displayStep === 4) return arePreferencesValid(ser.preferences);
    return true;
  })();

  const goNext = () => {
    if (displayStep === 4) {
      if (!canCompleteSer(ser)) return;
      updateSer({ status: "completed" });
      setStep(5);
      return;
    }
    setStep(Math.min(TOTAL_STEPS, displayStep + 1));
  };

  const editAnswers = () => {
    updateSer({ status: "in_progress" });
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-amazon text-offwhite">
      <SiteHeader />

      <section className="px-5 pb-10 pt-12">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow text-solar">SER</p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Olhe para dentro.
          </h1>
          <p className="mt-4 max-w-xl text-offwhite/75">
            Antes de pensar no que você quer fazer, vale entender um pouco melhor quem você é hoje.
          </p>

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
              aria-label="Progresso do SER"
            >
              <div
                className="h-full rounded-full bg-solar transition-all duration-300"
                style={{ width: `${(displayStep / TOTAL_STEPS) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-28">
        <div className="mx-auto max-w-3xl rounded-3xl border border-offwhite/12 bg-offwhite/5 p-6 sm:p-8">
          {!isHydrated || step === null ? (
            <p className="text-offwhite/60">Carregando…</p>
          ) : (
            <>
              {displayStep === 1 && (
                <div>
                  <h2 className="font-display text-2xl font-bold">
                    O que costuma despertar sua curiosidade?
                  </h2>
                  <p className="mt-2 text-sm text-offwhite/70">
                    Escolha as opções que mais chamam sua atenção. Não pense em profissão ainda.
                  </p>
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-offwhite/50">
                    {ser.interests.length} selecionados · escolha de {INTEREST_MIN} a {INTEREST_MAX}
                  </p>
                  <OptionGroup
                    options={INTEREST_OPTIONS}
                    selected={ser.interests}
                    max={INTEREST_MAX}
                    onToggle={(id) =>
                      setField({ interests: toggleId(ser.interests, id, INTEREST_MAX) })
                    }
                    ariaLabel="Interesses"
                  />
                </div>
              )}

              {displayStep === 2 && (
                <div>
                  <h2 className="font-display text-2xl font-bold">
                    Em quais situações você sente que costuma se sair bem?
                  </h2>
                  <p className="mt-2 text-sm text-offwhite/70">
                    Não precisa ser algo extraordinário. Pense em coisas que outras pessoas talvez
                    já tenham reconhecido em você.
                  </p>
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-offwhite/50">
                    {ser.strengths.length} selecionadas · escolha de {STRENGTH_MIN} a {STRENGTH_MAX}
                  </p>
                  <OptionGroup
                    options={STRENGTH_OPTIONS}
                    selected={ser.strengths}
                    max={STRENGTH_MAX}
                    onToggle={(id) =>
                      setField({ strengths: toggleId(ser.strengths, id, STRENGTH_MAX) })
                    }
                    ariaLabel="Forças"
                  />
                </div>
              )}

              {displayStep === 3 && (
                <div>
                  <h2 className="font-display text-2xl font-bold">
                    O que importa para você em uma vida que vale a pena construir?
                  </h2>
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-offwhite/50">
                    {ser.values.length} selecionados · escolha até {VALUE_MAX}
                  </p>
                  {ser.values.length > VALUE_FINAL && (
                    <p className="mt-3 text-sm text-solar" role="status">
                      Agora escolha os 3 que mais importam para você.
                    </p>
                  )}
                  <OptionGroup
                    options={VALUE_OPTIONS}
                    selected={ser.values}
                    max={VALUE_MAX}
                    onToggle={(id) => setField({ values: toggleId(ser.values, id, VALUE_MAX) })}
                    ariaLabel="Valores"
                  />
                </div>
              )}

              {displayStep === 4 && (
                <div>
                  <h2 className="font-display text-2xl font-bold">
                    Que tipo de ambiente costuma combinar mais com você?
                  </h2>
                  <div className="mt-6 space-y-7">
                    {PREFERENCE_SCALES.map((scale) => {
                      const value = ser.preferences[scale.key];
                      return (
                        <div key={scale.key}>
                          <div className="flex items-center justify-between gap-4 text-xs text-offwhite/60">
                            <span>{scale.lowLabel}</span>
                            <span className="text-right">{scale.highLabel}</span>
                          </div>
                          <div
                            className="mt-2 grid grid-cols-5 gap-2"
                            role="group"
                            aria-label={`${scale.lowLabel} a ${scale.highLabel}`}
                          >
                            {[1, 2, 3, 4, 5].map((n) => {
                              const active = value === n;
                              return (
                                <button
                                  key={n}
                                  type="button"
                                  aria-pressed={active}
                                  aria-label={`Nível ${n} de 5`}
                                  onClick={() => setPreference(scale.key, n)}
                                  className={cn(
                                    "tap rounded-xl border py-2.5 font-mono text-sm transition-colors",
                                    active
                                      ? "border-solar bg-solar text-ink"
                                      : "border-offwhite/20 text-offwhite/80 hover:border-solar/60",
                                  )}
                                >
                                  {n}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {displayStep === 5 && (
                <div>
                  <h2 className="font-display text-3xl font-bold">Seu Mapa começou a aparecer.</h2>
                  <p className="mt-3 text-offwhite/75">
                    Isso não define quem você é nem determina uma profissão. É apenas um retrato do
                    que chamou sua atenção agora — e ele pode mudar conforme você vive novas
                    experiências.
                  </p>

                  <div className="mt-8 space-y-7">
                    <MapSection
                      title="INTERESSES"
                      items={ser.interests.map((id) => getOptionLabel(id, INTEREST_OPTIONS))}
                    />
                    <MapSection
                      title="FORÇAS"
                      items={ser.strengths.map((id) => getOptionLabel(id, STRENGTH_OPTIONS))}
                    />
                    <MapSection
                      title="O QUE VOCÊ VALORIZA"
                      items={ser.values.map((id) => getOptionLabel(id, VALUE_OPTIONS))}
                    />
                    <div>
                      <p className="eyebrow text-solar">COMO VOCÊ PREFERE EXPLORAR</p>
                      <ul className="mt-3 space-y-1.5 text-sm text-offwhite/80">
                        {getPreferenceSummary(ser.preferences).map((phrase) => (
                          <li key={phrase}>{phrase}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      to="/pensar"
                      className="tap inline-flex items-center gap-2 rounded-full bg-solar px-6 py-3.5 font-display font-bold text-ink transition-transform hover:-translate-y-0.5"
                    >
                      Explorar possibilidades
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={editAnswers}
                      className="tap rounded-full border border-offwhite/25 px-6 py-3.5 text-sm text-offwhite/85 transition-colors hover:bg-offwhite/10"
                    >
                      Editar respostas
                    </button>
                  </div>
                </div>
              )}

              {displayStep >= 1 && displayStep <= 4 && (
                <div className="mt-8 flex items-center justify-between gap-3 border-t border-offwhite/10 pt-6">
                  <button
                    type="button"
                    disabled={displayStep <= 1}
                    onClick={() => setStep(Math.max(1, displayStep - 1))}
                    className={cn(
                      "tap inline-flex items-center gap-2 rounded-full border border-offwhite/25 px-5 py-3 text-sm transition-colors hover:bg-offwhite/10",
                      displayStep <= 1 && "cursor-not-allowed opacity-40 hover:bg-transparent",
                    )}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                  </button>
                  <button
                    type="button"
                    disabled={!isStepValid}
                    onClick={goNext}
                    className={cn(
                      "tap inline-flex items-center gap-2 rounded-full bg-solar px-6 py-3 font-display font-bold text-ink transition-opacity",
                      !isStepValid && "cursor-not-allowed opacity-40",
                    )}
                  >
                    {displayStep === 4 ? "Ver meu Mapa" : "Continuar"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
