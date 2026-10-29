import { Instagram, Mail } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  CONTACT_EMAIL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  feedbackMailto,
} from "@/lib/contact/contact";

const IDEAS = [
  "Algo que ficou confuso ou não funcionou",
  "Um caminho ou profissão que faltou",
  "O que você mais curtiu",
  "Uma ideia para o VOcare ficar melhor",
];

export function FeedbackPage() {
  return (
    <div className="min-h-screen bg-amazon text-offwhite">
      <SiteHeader />

      <main className="px-5 pb-24 pt-12">
        <div className="mx-auto max-w-xl">
          <p className="eyebrow text-solar">Sua opinião</p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Ajude a melhorar o VOcare.
          </h1>
          <p className="mt-4 text-offwhite/75">
            Sugestão, problema ou elogio: conta pra gente pelo canal que for mais fácil pra você.
            Lemos todas as mensagens.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="tap flex items-center gap-3 rounded-2xl border border-offwhite/15 p-5 transition-colors hover:border-solar"
            >
              <Instagram className="h-7 w-7 shrink-0 text-solar" aria-hidden="true" />
              <span>
                <span className="block font-display font-bold">Direct no Instagram</span>
                <span className="block text-sm text-offwhite/60">@{INSTAGRAM_HANDLE}</span>
              </span>
            </a>
            <a
              href={feedbackMailto()}
              className="tap flex items-center gap-3 rounded-2xl border border-offwhite/15 p-5 transition-colors hover:border-solar"
            >
              <Mail className="h-7 w-7 shrink-0 text-solar" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block font-display font-bold">Mandar um e-mail</span>
                <span className="block break-all text-sm text-offwhite/60">{CONTACT_EMAIL}</span>
              </span>
            </a>
          </div>

          <section className="mt-10">
            <h2 className="font-display text-lg font-bold">Não sabe o que escrever?</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-6 text-offwhite/75">
              {IDEAS.map((idea) => (
                <li key={idea}>{idea}</li>
              ))}
            </ul>
          </section>

          <p className="mt-10 text-sm text-offwhite/55">
            Não precisa mandar nome completo, telefone ou o nome da sua escola.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
