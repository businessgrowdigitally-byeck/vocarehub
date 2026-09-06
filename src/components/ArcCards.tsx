import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PHASES, type PhaseKey } from "@/lib/vocare";

const ORDER: PhaseKey[] = ["ser", "pensar", "fazer"];

export function ArcCards() {
  return (
    <section className="bg-amazon px-5 py-16">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow text-offwhite/50">Ser → Pensar → Fazer</p>
        <h2 className="mt-3 max-w-xl text-3xl sm:text-4xl">
          Um arco de descoberta em três etapas.
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {ORDER.map((key) => {
            const p = PHASES[key];
            const dark = p.text === "dark";
            return (
              <Link
                key={key}
                to={p.path}
                className="group relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: p.color,
                  color: dark ? "var(--ink)" : "var(--offwhite)",
                }}
              >
                <span
                  className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rotate-12"
                  style={{
                    backgroundColor: dark ? "rgba(11,11,11,0.08)" : "var(--solar)",
                    clipPath: "polygon(0 0, 100% 0, 100% 100%)",
                    opacity: dark ? 1 : 0.9,
                  }}
                />
                <div>
                  <span className="font-mono text-xs opacity-70">{p.num}</span>
                  <h3 className="mt-4 font-display text-4xl font-bold leading-none">{p.name}</h3>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] opacity-70">
                    {p.title}
                  </p>
                </div>
                <ul className="mt-8 space-y-1.5 text-sm opacity-85">
                  {p.questions.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em]">
                  Entrar na fase
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
