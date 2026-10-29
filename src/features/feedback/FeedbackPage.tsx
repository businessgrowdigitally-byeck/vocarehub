import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Check, Star } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { cn } from "@/lib/utils";
import {
  FEEDBACK_KINDS,
  FEEDBACK_KIND_LABELS,
  FEEDBACK_MAX_LENGTH,
  type FeedbackKind,
} from "@/lib/feedback/feedback";
import { submitFeedback } from "@/lib/feedback/feedback.functions";

const KIND_HINTS: Record<FeedbackKind, string> = {
  sugestao: "Uma ideia para o VOcare ficar melhor",
  problema: "Algo não funcionou ou ficou confuso",
  elogio: "Algo de que você gostou",
};

export function FeedbackPage({ from }: { from?: string | undefined }) {
  const send = useServerFn(submitFeedback);
  const openedAt = useRef(Date.now());
  const [kind, setKind] = useState<FeedbackKind | null>(null);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!kind) return setError("Escolha o tipo de mensagem.");
    if (message.trim().length < 3) return setError("Escreva sua mensagem.");
    setError(null);
    setStatus("sending");
    try {
      const result = await send({
        data: {
          kind,
          message,
          rating,
          page: from ?? null,
          website,
          elapsedMs: Date.now() - openedAt.current,
        },
      });
      if (result.ok) {
        setStatus("sent");
      } else {
        setError(result.error);
        setStatus("idle");
      }
    } catch {
      setError("Não conseguimos enviar agora. Tente de novo mais tarde.");
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen bg-amazon text-offwhite">
      <SiteHeader />

      <main className="px-5 pb-24 pt-12">
        <div className="mx-auto max-w-xl">
          <p className="eyebrow text-solar">Sua opinião</p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Ajude a melhorar o VOcare.
          </h1>

          {status === "sent" ? (
            <div
              className="mt-10 rounded-2xl border border-offwhite/12 bg-offwhite/5 p-6"
              role="status"
            >
              <Check className="h-8 w-8 text-solar" aria-hidden="true" />
              <h2 className="mt-3 font-display text-2xl font-bold">Recebemos, obrigado!</h2>
              <p className="mt-2 text-offwhite/75">
                Lemos todas as mensagens. Elas ajudam a decidir o que melhorar primeiro.
              </p>
              <Link
                to={from ?? "/"}
                className="tap mt-6 inline-flex rounded-full bg-solar px-6 py-3 font-display font-bold text-ink"
              >
                Voltar
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-8 space-y-8" noValidate>
              <p className="text-offwhite/75">
                Sugestão, problema ou elogio: conta pra gente. É anônimo — não pedimos nome nem
                contato.
              </p>

              <fieldset>
                <legend className="font-display text-lg font-bold">Sobre o que é?</legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {FEEDBACK_KINDS.map((option) => (
                    <label
                      key={option}
                      className={cn(
                        "tap cursor-pointer rounded-2xl border p-4 transition-colors",
                        kind === option
                          ? "border-solar bg-solar/10"
                          : "border-offwhite/15 hover:border-offwhite/35",
                      )}
                    >
                      <input
                        type="radio"
                        name="kind"
                        value={option}
                        checked={kind === option}
                        onChange={() => setKind(option)}
                        className="sr-only"
                      />
                      <span className="block font-display font-bold">
                        {FEEDBACK_KIND_LABELS[option]}
                      </span>
                      <span className="mt-1 block text-xs text-offwhite/60">
                        {KIND_HINTS[option]}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="feedback-message" className="font-display text-lg font-bold">
                  Sua mensagem
                </label>
                <textarea
                  id="feedback-message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  maxLength={FEEDBACK_MAX_LENGTH}
                  rows={6}
                  aria-describedby="feedback-privacy"
                  className="mt-3 w-full rounded-xl border border-offwhite/25 bg-amazon/40 px-4 py-3 text-offwhite outline-none placeholder:text-offwhite/40 focus:border-solar"
                  placeholder="O que você mudaria, o que travou, o que curtiu…"
                />
                <div className="mt-1 flex justify-between gap-4 text-xs text-offwhite/55">
                  <span id="feedback-privacy">
                    Não escreva seu nome, telefone, e-mail ou escola.
                  </span>
                  <span>
                    {message.length}/{FEEDBACK_MAX_LENGTH}
                  </span>
                </div>
              </div>

              <fieldset>
                <legend className="font-display text-lg font-bold">
                  Que nota você dá para o VOcare?{" "}
                  <span className="font-sans text-sm font-normal text-offwhite/55">(opcional)</span>
                </legend>
                <div className="mt-3 flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(rating === value ? null : value)}
                      aria-pressed={rating === value}
                      aria-label={`Nota ${value} de 5`}
                      className="tap rounded-full p-1.5"
                    >
                      <Star
                        className={cn(
                          "h-8 w-8",
                          rating !== null && value <= rating
                            ? "fill-solar text-solar"
                            : "text-offwhite/35",
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Armadilha para robôs: invisível para pessoas e leitores de tela. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label>
                  Site
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                  />
                </label>
              </div>

              {error && (
                <p className="text-sm text-terra" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="tap inline-flex rounded-full bg-solar px-7 py-3.5 font-display font-bold text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {status === "sending" ? "Enviando…" : "Enviar"}
              </button>

              <p className="text-xs text-offwhite/55">
                Como tratamos as mensagens:{" "}
                <Link to="/privacidade" className="underline underline-offset-4">
                  Política de Privacidade
                </Link>
                .
              </p>
            </form>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
