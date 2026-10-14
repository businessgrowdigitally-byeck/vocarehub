import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Bookmark, Check, ChevronDown, X } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useJourney } from "@/hooks/use-journey";
import { cn } from "@/lib/utils";
import { getCareerArea, CAREER_AREAS } from "./career-areas";
import type { CareerPath } from "./career-paths";
import { CAREER_PATHS } from "./career-paths";
import { WORK_MODELS } from "./work-models";
import {
  addExploredPath,
  getCareerPath,
  getPensarResumeStep,
  getRecommendedPaths,
  isValidPathSelection,
  setSelectedPaths,
  toggleSavedPath,
} from "./pensar-logic";

const TOTAL_STEPS = 4;
const STEP_TITLES = ["Explorar", "Meus caminhos", "Escolher 3", "Comparar"];

function PathCard({
  path,
  isSaved,
  onOpen,
  onToggleSave,
}: {
  path: CareerPath;
  isSaved: boolean;
  onOpen: () => void;
  onToggleSave: () => void;
}) {
  const area = getCareerArea(path.areaId);
  return (
    <article className="flex flex-col rounded-2xl border border-offwhite/12 bg-offwhite/5 p-5">
      <p className="eyebrow text-cian">{area?.title}</p>
      <h4 className="mt-2 font-display text-lg font-bold leading-tight">{path.title}</h4>
      <p className="mt-2 flex-1 text-sm text-offwhite/75">{path.shortDescription}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onOpen}
          className="tap rounded-full border border-offwhite/25 px-4 py-2 text-sm text-offwhite/85 transition-colors hover:bg-offwhite/10"
        >
          Ver detalhes
        </button>
        <button
          type="button"
          aria-pressed={isSaved}
          onClick={onToggleSave}
          className={cn(
            "tap inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-colors",
            isSaved
              ? "bg-solar font-medium text-ink"
              : "border border-offwhite/25 text-offwhite/85 hover:bg-offwhite/10",
          )}
        >
          {isSaved && <Check className="h-4 w-4" aria-hidden="true" />}
          {isSaved ? "Salvo" : "Salvar"}
        </button>
      </div>
    </article>
  );
}

function PathDetailDialog({
  path,
  isSaved,
  onToggleSave,
  onClose,
}: {
  path: CareerPath;
  isSaved: boolean;
  onToggleSave: () => void;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const area = getCareerArea(path.areaId);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/70 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pensar-dialog-title"
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-offwhite/15 bg-amazon p-6 sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-cian">{area?.title}</p>
            <h2 id="pensar-dialog-title" className="mt-2 font-display text-2xl font-bold">
              {path.title}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Fechar detalhes do caminho"
            className="tap -mr-2 -mt-2 inline-flex items-center justify-center rounded-full text-offwhite/70 transition-colors hover:bg-offwhite/10"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <p className="mt-4 text-sm text-offwhite/80">{path.shortDescription}</p>

        <div className="mt-5 space-y-5">
          <div>
            <p className="eyebrow text-solar">O QUE FAZ</p>
            <p className="mt-2 text-sm text-offwhite/80">{path.whatTheyDo}</p>
          </div>
          <div>
            <p className="eyebrow text-solar">COMO COMEÇAR</p>
            <ul className="mt-2 space-y-1 text-sm text-offwhite/80">
              {path.entryPaths.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-solar">HABILIDADES</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {path.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-offwhite/20 px-3 py-1 text-xs text-offwhite/80"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-solar">COMO EXPERIMENTAR</p>
            <p className="mt-2 text-sm text-offwhite/80">{path.experimentIdea}</p>
          </div>
        </div>

        <button
          type="button"
          aria-pressed={isSaved}
          onClick={onToggleSave}
          className={cn(
            "tap mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-display font-bold transition-colors",
            isSaved ? "border border-offwhite/25 text-offwhite" : "bg-solar text-ink",
          )}
        >
          {isSaved ? (
            <>
              <Check className="h-4 w-4" aria-hidden="true" />
              Remover dos meus caminhos
            </>
          ) : (
            <>
              <Bookmark className="h-4 w-4" aria-hidden="true" />
              Salvar caminho
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function WorkModelsBlock() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-offwhite/12">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="tap flex w-full items-center justify-between gap-4 p-5 text-left"
      >
        <span className="font-display text-lg font-bold">
          Existem diferentes formas de trabalhar.
        </span>
        <ChevronDown
          className={cn("h-5 w-5 shrink-0 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="grid gap-3 px-5 pb-5 sm:grid-cols-2">
          {WORK_MODELS.map((model) => (
            <div key={model.id} className="rounded-xl bg-offwhite/5 p-4">
              <p className="font-display font-bold">{model.title}</p>
              <p className="mt-1 text-sm text-offwhite/70">{model.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function VisualQuestion({
  question,
  pathOptions,
}: {
  question: string;
  pathOptions: CareerPath[];
}) {
  const [answer, setAnswer] = useState<string | null>(null);
  return (
    <div className="rounded-2xl border border-offwhite/12 bg-offwhite/5 p-5">
      <p className="text-sm text-offwhite/85">{question}</p>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={question}>
        {pathOptions.map((path) => {
          const active = answer === path.id;
          return (
            <button
              key={path.id}
              type="button"
              aria-pressed={active}
              onClick={() => setAnswer(active ? null : path.id)}
              className={cn(
                "tap rounded-full border px-4 py-2 text-sm transition-colors",
                active
                  ? "border-cian bg-cian font-medium text-ink"
                  : "border-offwhite/25 text-offwhite/80 hover:border-cian/60",
              )}
            >
              {path.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function PensarJourney() {
  const { state, isHydrated, updatePensar } = useJourney();
  const navigate = useNavigate();
  const pensar = state.pensar;
  const [step, setStep] = useState<number | null>(null);
  const [activePathId, setActivePathId] = useState<string | null>(null);
  const [showAllAreas, setShowAllAreas] = useState(false);

  useEffect(() => {
    if (!isHydrated || step !== null) return;
    setStep(getPensarResumeStep(state.pensar));
  }, [isHydrated, step, state.pensar]);

  const recommendations = getRecommendedPaths(state.ser);
  const savedPaths = pensar.savedPathIds
    .map((id) => getCareerPath(id))
    .filter((path): path is CareerPath => Boolean(path));
  const selectedPaths = pensar.selectedPathIds
    .map((id) => getCareerPath(id))
    .filter((path): path is CareerPath => Boolean(path));
  const activePath = activePathId ? getCareerPath(activePathId) : undefined;

  const openPath = (id: string) => {
    setActivePathId(id);
    updatePensar(addExploredPath(pensar, id));
  };

  const toggleSave = (id: string) => {
    updatePensar(toggleSavedPath(pensar, id));
  };

  const toggleSelection = (id: string) => {
    const current = pensar.selectedPathIds;
    const next = current.includes(id)
      ? current.filter((pathId) => pathId !== id)
      : current.length >= 3
        ? current
        : [...current, id];
    updatePensar(setSelectedPaths(pensar, next));
  };

  const displayStep = step ?? 1;
  const currentTitle = STEP_TITLES[displayStep - 1] ?? "";

  const canAdvance = (() => {
    if (displayStep === 1) return pensar.savedPathIds.length >= 1;
    if (displayStep === 2) return pensar.savedPathIds.length >= 3;
    if (displayStep === 3) return isValidPathSelection(pensar.selectedPathIds);
    return false;
  })();

  const goNext = () => {
    if (displayStep === 4) {
      if (!isValidPathSelection(pensar.selectedPathIds)) return;
      updatePensar({ status: "completed" });
      void navigate({ to: "/fazer" });
      return;
    }
    setStep(Math.min(TOTAL_STEPS, displayStep + 1));
  };

  const goBack = () => setStep(Math.max(1, displayStep - 1));

  return (
    <div className="min-h-screen bg-amazon text-offwhite">
      <SiteHeader />

      <section className="px-5 pb-10 pt-12">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow text-cian">PENSAR</p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Olhe ao redor.
          </h1>
          <p className="mt-4 max-w-xl text-offwhite/75">
            O objetivo não é decidir agora — é descobrir possibilidades.
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
              aria-label="Progresso do PENSAR"
            >
              <div
                className="h-full rounded-full bg-cian transition-all duration-300"
                style={{ width: `${(displayStep / TOTAL_STEPS) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-28">
        <div className="mx-auto max-w-4xl">
          {!isHydrated || step === null ? (
            <p className="text-offwhite/60">Carregando…</p>
          ) : (
            <div className="rounded-3xl border border-offwhite/12 bg-offwhite/5 p-6 sm:p-8">
              {displayStep === 1 && (
                <div>
                  <h2 className="font-display text-2xl font-bold">Explore possibilidades</h2>
                  <p className="mt-2 text-sm text-offwhite/70">
                    Salve os caminhos que despertarem curiosidade. Você pode mudar de ideia quando
                    quiser.
                  </p>

                  {recommendations.length > 0 && (
                    <section className="mt-7">
                      <h3 className="font-display text-xl font-bold">
                        Alguns caminhos para começar
                      </h3>
                      <p className="mt-2 max-w-2xl text-sm text-offwhite/70">
                        Eles aparecem porque compartilham elementos com o que chamou sua atenção no
                        SER. Isso não significa que sejam as escolhas certas para você — use como
                        ponto de partida.
                      </p>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {recommendations.map((path) => (
                          <PathCard
                            key={path.id}
                            path={path}
                            isSaved={pensar.savedPathIds.includes(path.id)}
                            onOpen={() => openPath(path.id)}
                            onToggleSave={() => toggleSave(path.id)}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  <button
                    type="button"
                    aria-expanded={showAllAreas}
                    onClick={() => setShowAllAreas((value) => !value)}
                    className="tap mt-8 inline-flex items-center gap-2 rounded-full border border-offwhite/25 px-5 py-3 text-sm text-offwhite/85 transition-colors hover:bg-offwhite/10"
                  >
                    {showAllAreas ? "Ocultar áreas" : "Explorar todas as áreas"}
                    <ChevronDown
                      className={cn("h-4 w-4 transition-transform", showAllAreas && "rotate-180")}
                      aria-hidden="true"
                    />
                  </button>

                  {showAllAreas && (
                    <div className="mt-6 space-y-8">
                      {CAREER_AREAS.map((area) => (
                        <section key={area.id}>
                          <h3 className="font-display text-xl font-bold">{area.title}</h3>
                          <p className="mt-1 text-sm text-offwhite/60">{area.shortDescription}</p>
                          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {CAREER_PATHS.filter((path) => path.areaId === area.id).map((path) => (
                              <PathCard
                                key={path.id}
                                path={path}
                                isSaved={pensar.savedPathIds.includes(path.id)}
                                onOpen={() => openPath(path.id)}
                                onToggleSave={() => toggleSave(path.id)}
                              />
                            ))}
                          </div>
                        </section>
                      ))}
                    </div>
                  )}

                  <WorkModelsBlock />
                </div>
              )}

              {displayStep === 2 && (
                <div>
                  <h2 className="font-display text-2xl font-bold">Meus caminhos</h2>
                  {savedPaths.length === 0 ? (
                    <>
                      <p className="mt-2 text-sm text-offwhite/70">
                        Você ainda não salvou nenhum caminho.
                      </p>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="tap mt-5 inline-flex items-center gap-2 rounded-full bg-cian px-6 py-3 font-display font-bold text-ink"
                      >
                        Explorar possibilidades
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="mt-2 text-sm text-offwhite/70">
                        Abra para rever, remova o que não interessa ou selecione os que quer
                        comparar.
                      </p>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        {savedPaths.map((path) => (
                          <div
                            key={path.id}
                            className="flex flex-col rounded-2xl border border-offwhite/12 bg-offwhite/5 p-5"
                          >
                            <p className="eyebrow text-cian">{getCareerArea(path.areaId)?.title}</p>
                            <h3 className="mt-2 font-display text-lg font-bold">{path.title}</h3>
                            <p className="mt-2 flex-1 text-sm text-offwhite/75">
                              {path.shortDescription}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => openPath(path.id)}
                                className="tap rounded-full border border-offwhite/25 px-4 py-2 text-sm text-offwhite/85 hover:bg-offwhite/10"
                              >
                                Abrir
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleSave(path.id)}
                                className="tap rounded-full border border-offwhite/25 px-4 py-2 text-sm text-offwhite/85 hover:bg-offwhite/10"
                              >
                                Remover
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {savedPaths.length < 3 && (
                        <p className="mt-5 text-sm text-solar" role="status">
                          Salve pelo menos 3 caminhos para continuar.
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="tap mt-5 inline-flex items-center gap-2 text-sm text-offwhite/70 underline underline-offset-4 hover:text-solar"
                      >
                        Explorar mais caminhos
                      </button>
                    </>
                  )}
                </div>
              )}

              {displayStep === 3 && (
                <div>
                  <h2 className="font-display text-2xl font-bold">Escolha 3 caminhos</h2>
                  <p className="mt-2 text-sm text-offwhite/70">
                    Você não precisa escolher uma profissão agora. Escolha apenas três caminhos que
                    gostaria de investigar melhor.
                  </p>
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-offwhite/50">
                    {pensar.selectedPathIds.length} de 3 selecionados
                  </p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {savedPaths.map((path) => {
                      const selected = pensar.selectedPathIds.includes(path.id);
                      return (
                        <button
                          key={path.id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => toggleSelection(path.id)}
                          className={cn(
                            "tap rounded-2xl border p-5 text-left transition-colors",
                            selected
                              ? "border-cian bg-cian/15"
                              : "border-offwhite/12 bg-offwhite/5 hover:border-cian/50",
                          )}
                        >
                          <span className="flex items-center justify-between gap-2">
                            <span className="eyebrow text-cian">
                              {getCareerArea(path.areaId)?.title}
                            </span>
                            {selected && <Check className="h-4 w-4 text-cian" aria-hidden="true" />}
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

              {displayStep === 4 && (
                <div>
                  <h2 className="font-display text-2xl font-bold">MEUS 3 CAMINHOS</h2>
                  <p className="mt-2 text-sm text-offwhite/70">
                    Relacionado ao que chamou sua atenção. Talvez valha a pena conhecer melhor.
                  </p>

                  <div className="mt-5 grid gap-4 lg:grid-cols-3">
                    {selectedPaths.map((path) => (
                      <article
                        key={path.id}
                        className="rounded-2xl border border-offwhite/12 bg-offwhite/5 p-5"
                      >
                        <p className="eyebrow text-cian">{getCareerArea(path.areaId)?.title}</p>
                        <h3 className="mt-2 font-display text-lg font-bold">{path.title}</h3>
                        <div className="mt-4 space-y-4 text-sm text-offwhite/80">
                          <div>
                            <p className="eyebrow text-solar">O QUE FAZ</p>
                            <p className="mt-1">{path.whatTheyDo}</p>
                          </div>
                          <div>
                            <p className="eyebrow text-solar">FORMAS DE COMEÇAR</p>
                            <ul className="mt-1 space-y-0.5">
                              {path.entryPaths.map((entry) => (
                                <li key={entry}>{entry}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="eyebrow text-solar">HABILIDADES</p>
                            <p className="mt-1">{path.skills.join(" · ")}</p>
                          </div>
                          <div>
                            <p className="eyebrow text-solar">EXPERIÊNCIA POSSÍVEL</p>
                            <p className="mt-1">{path.experimentIdea}</p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="mt-8 space-y-4">
                    <VisualQuestion
                      question="Qual despertou mais curiosidade?"
                      pathOptions={selectedPaths}
                    />
                    <VisualQuestion
                      question="Qual você gostaria de experimentar primeiro?"
                      pathOptions={selectedPaths}
                    />
                    <VisualQuestion
                      question="Sobre qual você ainda quer aprender mais?"
                      pathOptions={selectedPaths}
                    />
                  </div>

                  <div className="mt-8">
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={!isValidPathSelection(pensar.selectedPathIds)}
                      className={cn(
                        "tap inline-flex items-center gap-2 rounded-full bg-solar px-6 py-3.5 font-display font-bold text-ink transition-transform hover:-translate-y-0.5",
                        !isValidPathSelection(pensar.selectedPathIds) &&
                          "cursor-not-allowed opacity-40 hover:translate-y-0",
                      )}
                    >
                      Experimentar um caminho
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {displayStep >= 1 && displayStep <= 3 && (
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
                </div>
              )}

              {displayStep === 4 && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={goBack}
                    className="tap inline-flex items-center gap-2 text-sm text-offwhite/70 underline underline-offset-4 hover:text-solar"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para a seleção
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {activePath && (
        <PathDetailDialog
          path={activePath}
          isSaved={pensar.savedPathIds.includes(activePath.id)}
          onToggleSave={() => toggleSave(activePath.id)}
          onClose={() => setActivePathId(null)}
        />
      )}

      <SiteFooter />

      <div className="px-5 pb-10">
        <div className="mx-auto max-w-4xl">
          <Link to="/ser" className="text-sm text-offwhite/50 underline underline-offset-4">
            Rever meu Mapa no SER
          </Link>
        </div>
      </div>
    </div>
  );
}
