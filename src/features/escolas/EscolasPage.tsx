import { Link } from "@tanstack/react-router";
import { ArrowRight, Compass, Instagram, Lock, Mail, Sparkles, Users } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  CONTACT_EMAIL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  partnershipMailto,
} from "@/lib/contact/contact";

const REASONS = [
  {
    Icon: Compass,
    title: "Uma linguagem simples",
    text: "Ser, Pensar e Fazer organizam o autoconhecimento, a exploração e o primeiro passo em três fases claras.",
  },
  {
    Icon: Lock,
    title: "Sem cadastro e sem dados pessoais",
    text: "As respostas ficam no próprio dispositivo do estudante e nunca são enviadas. Sem conta, sem cadastro.",
  },
  {
    Icon: Users,
    title: "Feito para a sala de aula",
    text: "Cada fase cabe em uma aula. O passaporte final vira um registro concreto do percurso do estudante.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Apresente a jornada",
    text: "Comece pela fase SER e convide a turma a olhar para dentro.",
  },
  {
    num: "02",
    title: "Reserve um tempo por fase",
    text: "Uma aula para o SER, uma para o PENSAR e uma para o FAZER já dão conta do essencial.",
  },
  {
    num: "03",
    title: "Use o passaporte",
    text: "Ao final, cada estudante gera um PDF da própria jornada para guardar ou apresentar.",
  },
];

export function EscolasPage() {
  return (
    <div className="min-h-screen bg-amazon">
      <SiteHeader />

      <section className="px-5 pb-12 pt-16">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow text-solar">PARA ESCOLAS</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.05] text-offwhite sm:text-6xl">
            Orientação vocacional gratuita, pronta para a sala de aula.
          </h1>
          <p className="mt-5 max-w-xl text-offwhite/75">
            O VOcare é um portal aberto que ajuda jovens de 15 a 18 anos a se conhecerem, explorarem
            caminhos e darem o primeiro passo — sem cadastro e sem pedir dados pessoais.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to="/ser"
              className="tap inline-flex items-center gap-2 rounded-full bg-solar px-7 py-3.5 font-display font-bold text-ink transition-transform hover:-translate-y-0.5"
            >
              Conhecer a jornada
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={partnershipMailto()}
              className="tap inline-flex items-center gap-2 rounded-full border border-offwhite/25 px-6 py-3.5 text-sm text-offwhite/85 transition-colors hover:bg-offwhite/10"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Falar sobre uma parceria
            </a>
          </div>
        </div>
      </section>

      <section className="px-5 pb-16">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {REASONS.map(({ Icon, title, text }) => (
            <article
              key={title}
              className="rounded-3xl border border-offwhite/12 bg-offwhite/5 p-6"
            >
              <Icon className="h-6 w-6 text-solar" aria-hidden="true" />
              <h2 className="mt-4 font-display text-xl font-bold text-offwhite">{title}</h2>
              <p className="mt-2 text-sm text-offwhite/70">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-offwhite px-5 py-16 text-ink">
        <div className="mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-terra" aria-hidden="true" />
            <span className="eyebrow text-terra">TRÊS FASES, UM PERCURSO</span>
          </span>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.num} className="border-t border-ink/10 pt-5">
                <span className="font-mono text-sm text-terra">{step.num}</span>
                <h3 className="mt-3 font-display text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-sm text-ink/70">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-6xl rounded-3xl border border-solar/40 bg-solar/10 p-8 sm:p-10">
          <h2 className="max-w-2xl font-display text-3xl font-bold text-offwhite">
            Leve o VOcare para os seus estudantes.
          </h2>
          <p className="mt-3 max-w-xl text-offwhite/80">
            É gratuito, funciona no navegador e não exige nenhum cadastro. Comece pela fase SER e
            descubra o percurso completo.
          </p>
          <Link
            to="/ser"
            className="tap mt-6 inline-flex items-center gap-2 rounded-full bg-solar px-7 py-3.5 font-display font-bold text-ink transition-transform hover:-translate-y-0.5"
          >
            Começar agora
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="mt-8 border-t border-offwhite/15 pt-6">
            <h3 className="font-display text-lg font-bold text-offwhite">
              Quer usar com a sua escola?
            </h3>
            <p className="mt-1 text-sm text-offwhite/75">
              Fale com a equipe do VOcare. Respondemos por e-mail ou pelo Instagram.
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm sm:flex-row sm:flex-wrap sm:gap-6">
              <a
                href={partnershipMailto()}
                className="inline-flex items-center gap-2 text-solar underline underline-offset-4"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="break-all">{CONTACT_EMAIL}</span>
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-solar underline underline-offset-4"
              >
                <Instagram className="h-4 w-4 shrink-0" aria-hidden="true" />@{INSTAGRAM_HANDLE}
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
