import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  IconCursos,
  IconConhecimento,
  IconOportunidades,
  IconProfissoes,
} from "@/components/brand/BrandIcons";
import { ResourceCard } from "@/features/resources/ResourceCard";
import { OPPORTUNITY_SOURCES, type OpportunityCategory } from "@/data/opportunity-sources";
import type { ResourceAccent, ResourceTone } from "@/features/resources/ResourceCard";
import type { ReactElement } from "react";

const title = "Oportunidades — VOcare";
const description =
  "Fontes confiáveis de estágio, cursos, ensino superior e iniciação científica para dar o próximo passo — sem promessa de vaga ou resultado.";

export const Route = createFileRoute("/oportunidades")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Oportunidades,
});

type IconComponent = (props: { className?: string }) => ReactElement;

const SECTIONS: readonly {
  category: OpportunityCategory;
  number: string;
  title: string;
  description: string;
  Icon: IconComponent;
  accent: ResourceAccent;
  tone: ResourceTone;
}[] = [
  {
    category: "work",
    number: "01",
    title: "Trabalho e estágio",
    description:
      "Programas de estágio, aprendizagem e portais de emprego para começar a trabalhar.",
    Icon: IconProfissoes,
    accent: "cian",
    tone: "light",
  },
  {
    category: "learning",
    number: "02",
    title: "Cursos e formação",
    description: "Cursos gratuitos e trilhas de formação profissional em diversas áreas.",
    Icon: IconCursos,
    accent: "solar",
    tone: "light",
  },
  {
    category: "college",
    number: "03",
    title: "Ensino superior",
    description: "Caminhos para faculdade: seleção, bolsas e financiamento estudantil.",
    Icon: IconConhecimento,
    accent: "terra",
    tone: "light",
  },
  {
    category: "science",
    number: "04",
    title: "Ciência e iniciação",
    description: "Iniciação científica, olimpíadas e feiras para quem gosta de investigar.",
    Icon: IconOportunidades,
    accent: "solar",
    tone: "dark",
  },
];

const SAFETY_NOTES = [
  "A VOcare reúne fontes; quem mantém datas, vagas e regras são as próprias instituições.",
  "Confirme requisitos, elegibilidade e prazos no site oficial antes de se inscrever.",
  "Não há garantia de resultado: se inscrever não assegura vaga, bolsa ou aprovação.",
  "Na dúvida, fale com a sua escola, o instituto ou o órgão responsável pelo programa.",
] as const;

function Oportunidades() {
  return (
    <div className="min-h-screen bg-offwhite">
      <SiteHeader />

      <section className="bg-amazon px-5 pb-10 pt-12 text-offwhite">
        <div className="mx-auto max-w-5xl">
          <IconOportunidades className="h-6 w-6 text-solar" />
          <p className="eyebrow mt-4 text-solar">Fontes confiáveis</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">Encontre sua próxima oportunidade.</h1>
          <p className="mt-3 max-w-xl text-offwhite/75">
            Estágios, cursos, faculdade e ciência: onde procurar cada caminho. O VOcare indica as
            fontes — as instituições cuidam das regras e dos prazos.
          </p>

          <nav aria-label="Categorias de oportunidades" className="mt-7">
            <ul className="flex flex-wrap gap-2">
              {SECTIONS.map((section) => (
                <li key={section.category}>
                  <a
                    href={`#${section.category}`}
                    className="tap inline-flex items-center gap-2 rounded-full border border-offwhite/20 px-4 py-2 text-sm text-offwhite/85 transition-colors hover:border-solar hover:text-solar"
                  >
                    <section.Icon className="h-4 w-4" />
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {SECTIONS.map((section) => {
        const sources = OPPORTUNITY_SOURCES.filter(
          (source) => source.category === section.category,
        );
        const dark = section.tone === "dark";
        const content = (
          <div className="mx-auto max-w-5xl">
            <div className="mb-7 max-w-2xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-terra">
                {section.number}
              </p>
              <h2 className={`mt-2 text-2xl sm:text-3xl ${dark ? "text-offwhite" : "text-ink"}`}>
                {section.title}
              </h2>
              <p className={`mt-2 ${dark ? "text-offwhite/70" : "text-ink/65"}`}>
                {section.description}
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sources.map((source) => (
                <ResourceCard
                  key={source.id}
                  title={source.title}
                  description={source.description}
                  href={source.href}
                  cta={source.cta}
                  tags={source.tags}
                  accent={section.accent}
                  tone={section.tone}
                  {...(source.note ? { note: source.note } : {})}
                />
              ))}
            </div>
          </div>
        );

        return (
          <section
            key={section.category}
            id={section.category}
            className={
              dark
                ? "scroll-mt-20 bg-amazon px-5 py-12 sm:py-14"
                : "scroll-mt-20 px-5 py-12 sm:py-14"
            }
          >
            {content}
          </section>
        );
      })}

      <section className="px-5 pb-20 pt-4">
        <div className="mx-auto max-w-5xl rounded-3xl border border-ink/10 bg-white px-6 py-10 sm:px-10">
          <p className="eyebrow text-terra">Antes de se inscrever</p>
          <h2 className="mt-3 text-2xl text-ink sm:text-3xl">Use as fontes com cabeça.</h2>
          <ol className="mt-6 space-y-3">
            {SAFETY_NOTES.map((note, index) => (
              <li key={note} className="flex gap-3 text-ink/75">
                <span className="font-mono text-sm text-terra">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{note}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
