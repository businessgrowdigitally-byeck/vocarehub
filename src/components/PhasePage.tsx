import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AltusBlock } from "@/components/AltusBlock";
import { NotionEmbed } from "@/components/NotionEmbed";
import { IconSer, IconPensar, IconFazer } from "@/components/brand/BrandIcons";
import { NOTION, PHASES, type PhaseKey } from "@/lib/vocare";
import { cn } from "@/lib/utils";

const ORDER: PhaseKey[] = ["ser", "pensar", "fazer"];
const ICONS = { ser: IconSer, pensar: IconPensar, fazer: IconFazer };

export function PhasePage({ phase }: { phase: PhaseKey }) {
  const p = PHASES[phase];
  const dark = p.text === "dark";
  const Icon = ICONS[phase];

  return (
    <div className="min-h-screen bg-amazon">
      <SiteHeader />

      {/* Cabeçalho da fase */}
      <section
        className="relative overflow-hidden px-5 py-14"
        style={{ backgroundColor: p.color, color: dark ? "var(--ink)" : "var(--offwhite)" }}
      >
        <span
          className="pointer-events-none absolute -right-10 -top-10 h-52 w-52"
          style={{
            backgroundColor: dark ? "rgba(11,11,11,0.07)" : "var(--solar)",
            clipPath: "polygon(0 0, 100% 0, 100% 100%)",
          }}
        />
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5" />
            <span className="font-mono text-xs opacity-70">{p.num}</span>
          </div>
          <h1 className="mt-4 font-display text-5xl font-bold leading-[0.95] sm:text-7xl">
            {p.name}
          </h1>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.22em] opacity-70">
            {p.title}
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1 text-sm opacity-85">
            {p.questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>

          {/* Progresso do arco */}
          <div className="mt-9 flex items-center gap-2">
            {ORDER.map((k, i) => (
              <span key={k} className="flex items-center gap-2">
                <Link
                  to={PHASES[k].path}
                  className={cn(
                    "tap inline-flex items-center rounded-full px-3 py-1.5 font-mono text-[11px] tracking-[0.18em]",
                    k === phase ? "opacity-100" : "opacity-45",
                  )}
                  style={{
                    border: `1px solid ${dark ? "rgba(11,11,11,0.35)" : "rgba(244,241,232,0.4)"}`,
                    backgroundColor:
                      k === phase ? (dark ? "rgba(11,11,11,0.1)" : "rgba(244,241,232,0.12)") : "transparent",
                  }}
                >
                  {PHASES[k].num}
                </Link>
                {i < ORDER.length - 1 && <span className="opacity-40">→</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Conteúdo (Notion) */}
      <section className="px-4 py-10 pb-28 sm:px-5">
        <div className="mx-auto max-w-5xl text-offwhite">
          <NotionEmbed src={NOTION[phase]} title={`Fase ${p.num} — ${p.name}`} accent={p.color} />
        </div>
      </section>

      {phase === "fazer" && <AltusBlock />}

      <SiteFooter />

      {/* CTA sticky */}
      {p.next && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
          <Link
            to={p.next.path}
            className="tap pointer-events-auto mx-auto flex max-w-md items-center justify-center gap-2 rounded-full bg-solar px-6 py-3.5 font-display font-bold text-ink shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
          >
            Próxima etapa: {p.next.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
      {!p.next && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
          <Link
            to="/oportunidades"
            className="tap pointer-events-auto mx-auto flex max-w-md items-center justify-center gap-2 rounded-full bg-solar px-6 py-3.5 font-display font-bold text-ink shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
          >
            Ver oportunidades abertas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
