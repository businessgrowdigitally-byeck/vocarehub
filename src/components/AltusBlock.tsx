import { useState } from "react";
import { ArrowRight, X, Check, Ticket, Sparkles } from "lucide-react";
import { VoSymbol } from "@/components/brand/VoLogo";
import { ALTUS_URL, ALTUS_DASHBOARD_URL, ALTUS_EDU_CUPOM } from "@/lib/vocare";
import { cn } from "@/lib/utils";
import { logCouponRedemption } from "@/lib/coupon-log";

type Step = "closed" | "choice" | "coupon" | "granted";

export function AltusBlock() {
  const [step, setStep] = useState<Step>("closed");
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    setStep("closed");
    setValue("");
    setError(null);
  };

  const validate = () => {
    const code = value.trim().toUpperCase();
    if (!code) {
      setError("Digite o seu cupom.");
      return;
    }
    if (code === ALTUS_EDU_CUPOM) {
      setError(null);
      setStep("granted");
      void logCouponRedemption(code);
      return;
    }
    setError("Cupom inválido. Confira com a sua escola.");
  };

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
          <button
            type="button"
            onClick={() => setStep("choice")}
            className="tap inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-display font-bold text-offwhite transition-opacity hover:opacity-90"
          >
            Continuar no Altus
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {step !== "closed" && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 px-4 pb-4 pt-10 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Continuar no Altus"
          onClick={close}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-offwhite text-ink shadow-[0_24px_60px_rgba(0,0,0,0.4)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Fechar"
              className="tap absolute right-3 top-3 z-10 inline-flex items-center justify-center rounded-full text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>

            {/* Etapa: escolha */}
            {step === "choice" && (
              <div className="p-7 pt-8">
                <p className="eyebrow text-ink/50">Próximo passo</p>
                <h3 className="mt-3 font-display text-3xl font-bold leading-[0.95]">
                  Continuar no Altus
                </h3>
                <p className="mt-3 text-sm text-ink/70">
                  Escolha o seu caminho para começar a construir com constância.
                </p>

                <div className="mt-6 space-y-3">
                  {/* Adquirir */}
                  <a
                    href={ALTUS_URL}
                    target="_blank"
                    rel="noreferrer"
                    onClick={close}
                    className="tap group flex items-center gap-4 rounded-2xl bg-ink px-5 py-4 text-offwhite transition-opacity hover:opacity-90"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-solar text-ink">
                      <ArrowRight className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg font-bold leading-tight">
                        Adquirir
                      </span>
                      <span className="block text-xs text-offwhite/70">
                        Acesso completo ao Altus Life OS.
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 opacity-50 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </a>

                  {/* Cupom educacional */}
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setStep("coupon");
                    }}
                    className="tap group flex w-full items-center gap-4 rounded-2xl border border-ink/15 bg-offwhite px-5 py-4 text-left transition-colors hover:border-terra/50 hover:bg-terra/5"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terra/15 text-terra">
                      <Ticket className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg font-bold leading-tight text-ink">
                        Tem cupom educacional?
                      </span>
                      <span className="block text-xs text-ink/60">
                        Aluno(a) de escola pública acessa o Altus de graça.
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-ink/40 transition group-hover:translate-x-0.5 group-hover:text-terra" />
                  </button>
                </div>
              </div>
            )}

            {/* Etapa: cupom */}
            {step === "coupon" && (
              <div className="p-7 pt-8">
                <p className="eyebrow text-terra">Cupom educacional</p>
                <h3 className="mt-3 font-display text-3xl font-bold leading-[0.95]">
                  Acesso gratuito ao Altus
                </h3>
                <p className="mt-3 text-sm text-ink/70">
                  Você é aluno(a) de escola pública? Digite o cupom fornecido pela sua escola para
                  liberar o acesso gratuito ao seu sistema Altus Life OS.
                </p>

                <label className="mt-6 block">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50">
                    Cupom
                  </span>
                  <input
                    type="text"
                    value={value}
                    autoFocus
                    onChange={(e) => {
                      setValue(e.target.value);
                      if (error) setError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") validate();
                    }}
                    placeholder="Digite o seu cupom"
                    autoCapitalize="characters"
                    autoCorrect="off"
                    spellCheck={false}
                    className={cn(
                      "mt-2 w-full rounded-xl border bg-white px-4 py-3.5 font-mono text-base tracking-wide text-ink outline-none transition",
                      error
                        ? "border-destructive focus:border-destructive"
                        : "border-ink/20 focus:border-terra",
                    )}
                  />
                </label>

                {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

                <button
                  type="button"
                  onClick={validate}
                  className="tap mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-terra px-6 py-3.5 font-display font-bold text-offwhite transition-opacity hover:opacity-90"
                >
                  Liberar acesso gratuito
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setStep("choice")}
                  className="tap mt-2 w-full rounded-full px-6 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 transition-colors hover:text-ink"
                >
                  ← Voltar
                </button>
              </div>
            )}

            {/* Etapa: acesso liberado */}
            {step === "granted" && (
              <div className="p-7 pt-10 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cian/15 text-cian">
                  <Check className="h-8 w-8" strokeWidth={2} />
                </span>
                <p className="eyebrow mt-5 text-cian">Acesso liberado</p>
                <h3 className="mt-3 font-display text-3xl font-bold leading-[0.95]">
                  Bem-vindo(a) ao Altus
                </h3>
                <p className="mt-3 text-sm text-ink/70">
                  Seu cupom educacional foi validado. Você tem acesso gratuito ao sistema de
                  execução e constância.
                </p>

                <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-amazon/5 px-4 py-3">
                  <Sparkles className="h-4 w-4 text-solar" strokeWidth={1.75} />
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink/60">
                    Cupom {ALTUS_EDU_CUPOM} · ativo
                  </span>
                </div>

                <a
                  href={ALTUS_DASHBOARD_URL}
                  target="_blank"
                  rel="noreferrer"
                  onClick={close}
                  className="tap mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-solar px-6 py-3.5 font-display font-bold text-ink transition-transform hover:-translate-y-0.5"
                >
                  Entrar no Altus
                  <ArrowRight className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={close}
                  className="tap mt-2 w-full rounded-full px-6 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 transition-colors hover:text-ink"
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
