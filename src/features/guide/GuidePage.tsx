import { Fragment } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { cn } from "@/lib/utils";
import { GUIDE_STEPS } from "./guide-steps";
import type { GuidePhase } from "./guide-steps";

const PHASE_COLORS: Record<GuidePhase, string> = {
  Início: "text-offwhite/70",
  SER: "text-solar",
  PENSAR: "text-cian",
  FAZER: "text-terra",
  Passaporte: "text-solar",
};

const TIPS = [
  {
    title: "Pode parar e voltar depois",
    text: "Seu progresso fica salvo neste celular, no mesmo navegador. Em outro aparelho, a jornada começa do zero.",
  },
  {
    title: "Pode mudar de ideia",
    text: "No Mapa, toque em Editar respostas. No Passaporte, Começar uma nova jornada apaga tudo e recomeça.",
  },
  {
    title: "Não é prova",
    text: "Não existe nota, resposta certa ou profissão ideal. As sugestões são pontos de partida para explorar.",
  },
];

function Marker({ n }: { n: string }) {
  return (
    <span
      className="mx-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-solar align-middle font-display text-xs font-bold text-ink"
      aria-label={`destaque ${n}`}
    >
      {n}
    </span>
  );
}

/** Troca {1}, {2}… pelos marcadores numerados que aparecem na imagem. */
function StepText({ text }: { text: string }) {
  const parts = text.split(/\{(\d)\}/);
  return (
    <p className="mt-3 leading-relaxed text-offwhite/80">
      {parts.map((part, index) =>
        index % 2 === 1 ? <Marker key={index} n={part} /> : <Fragment key={index}>{part}</Fragment>,
      )}
    </p>
  );
}

export function GuidePage() {
  return (
    <div className="min-h-screen bg-amazon text-offwhite">
      <SiteHeader />

      <main className="px-5 pb-24 pt-12">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow text-solar">Como usar</p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
            O VOcare passo a passo.
          </h1>
          <p className="mt-4 max-w-xl text-offwhite/75">
            São quatro etapas: SER, PENSAR, FAZER e o seu Passaporte. Dá para fazer tudo de uma vez
            ou aos poucos — você pode parar quando quiser.
          </p>
          <p className="mt-3 text-sm text-offwhite/60">
            Os números <Marker n="1" /> <Marker n="2" /> nas imagens mostram onde tocar.
          </p>

          <ol className="mt-12 space-y-16">
            {GUIDE_STEPS.map((step, index) => (
              <li key={step.image} className="grid items-center gap-6 md:grid-cols-2 md:gap-12">
                <div className={cn(index % 2 === 1 && "md:order-2")}>
                  <p className={cn("eyebrow", PHASE_COLORS[step.phase])}>
                    Passo {index + 1} · {step.phase}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-bold">{step.title}</h2>
                  <StepText text={step.text} />
                </div>
                <img
                  src={step.image}
                  alt={step.alt}
                  width={390}
                  height={760}
                  loading={index === 0 ? "eager" : "lazy"}
                  className="mx-auto w-full max-w-[280px] rounded-[2rem] border-4 border-offwhite/15 shadow-2xl"
                />
              </li>
            ))}
          </ol>

          <section className="mt-20">
            <h2 className="font-display text-2xl font-bold">Bom saber</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {TIPS.map((tip) => (
                <div
                  key={tip.title}
                  className="rounded-2xl border border-offwhite/12 bg-offwhite/5 p-5"
                >
                  <h3 className="font-display text-lg font-bold">{tip.title}</h3>
                  <p className="mt-2 text-sm text-offwhite/75">{tip.text}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-14 text-center">
            <Link
              to="/ser"
              className="tap inline-flex items-center gap-2 rounded-full bg-solar px-7 py-3.5 font-display font-bold text-ink transition-transform hover:-translate-y-0.5"
            >
              Começar pelo SER
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
