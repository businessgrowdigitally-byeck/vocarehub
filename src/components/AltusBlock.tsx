import { ArrowRight } from "lucide-react";
import { VoSymbol } from "@/components/brand/VoLogo";
import { ALTUS_URL } from "@/lib/vocare";

export function AltusBlock() {
  return (
    <section className="bg-offwhite px-5 py-16 text-ink">
      <div className="mx-auto max-w-4xl">
        <p className="eyebrow text-center text-ink/50">The Altus Universe</p>

        <div className="mt-8 grid gap-px overflow-hidden rounded-2xl bg-ink/15 sm:grid-cols-2">
          <div className="bg-offwhite p-8 text-center">
            <VoSymbol className="mx-auto h-10 w-10" />
            <p className="mt-4 font-display text-2xl font-bold">VOcare</p>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.22em]">Discover</p>
            <p className="mt-1 text-sm text-ink/70">Possibilidades.</p>
            <ul className="mt-6 space-y-1 text-sm text-ink/60">
              <li>Quem sou eu?</li>
              <li>O que é possível?</li>
              <li>O que eu quero fazer?</li>
            </ul>
          </div>

          <div className="bg-offwhite p-8 text-center">
            <svg viewBox="0 0 48 44" className="mx-auto h-10 w-10" aria-hidden="true">
              <path d="M24 3 45 41H31L24 26 17 41H3L24 3Z" fill="var(--ink)" />
            </svg>
            <p className="mt-4 font-display text-2xl font-bold">Altus</p>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.22em]">Become</p>
            <p className="mt-1 text-sm text-ink/70">Consistência.</p>
            <ul className="mt-6 space-y-1 text-sm text-ink/60">
              <li>Vamos construir.</li>
            </ul>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-ink/70">
          Duas marcas. Um mesmo propósito: mais jovens no controle do seu futuro.
        </p>

        <div className="mt-8 flex justify-center">
          <a
            href={ALTUS_URL}
            target="_blank"
            rel="noreferrer"
            className="tap inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-display font-bold text-offwhite transition-opacity hover:opacity-90"
          >
            Continuar no Altus
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
