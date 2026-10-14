import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { IconConhecimento } from "@/components/brand/BrandIcons";
import { ResourceCard } from "@/features/resources/ResourceCard";
import { ExternalLink } from "@/features/resources/ExternalLink";
import { CURATED_BOOKS, LIBRARY_RESOURCES } from "@/data/library-resources";
import type { CuratedBook, LibraryCategory } from "@/data/library-resources";
import type { ResourceAccent } from "@/features/resources/ResourceCard";
import type { ReactNode } from "react";

const title = "Biblioteca Essencial — VOcare";
const description =
  "Livros, cursos gratuitos e fontes confiáveis para explorar caminhos, aprender e entender o mundo do trabalho.";

export const Route = createFileRoute("/biblioteca")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Biblioteca,
});

const NAV = [
  { id: "leituras", label: "Leituras" },
  { id: "leia-gratuitamente", label: "Ler grátis" },
  { id: "aprender", label: "Aprender" },
  { id: "carreiras", label: "Carreiras" },
] as const;

const RESOURCE_SECTIONS: readonly {
  id: string;
  number: string;
  title: string;
  description: string;
  category: LibraryCategory;
  accent: ResourceAccent;
}[] = [
  {
    id: "leia-gratuitamente",
    number: "02",
    title: "Leia gratuitamente",
    description: "Acervos públicos e de acesso aberto para ler sem pagar nada.",
    category: "free-reading",
    accent: "cian",
  },
  {
    id: "aprender",
    number: "03",
    title: "Aprenda gratuitamente",
    description: "Cursos e trilhas gratuitas para desenvolver novas habilidades.",
    category: "learning",
    accent: "solar",
  },
  {
    id: "carreiras",
    number: "04",
    title: "Explore profissões e cursos",
    description: "Fontes oficiais para entender ocupações, cursos técnicos e faculdades.",
    category: "careers",
    accent: "terra",
  },
];

function Section({
  id,
  number,
  title: heading,
  description: intro,
  children,
}: {
  id: string;
  number: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 px-5 py-12 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-terra">{number}</p>
          <h2 className="mt-2 text-2xl text-ink sm:text-3xl">{heading}</h2>
          <p className="mt-2 text-ink/65">{intro}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

function BookCard({ book }: { book: CuratedBook }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-ink/10 bg-white p-6">
      <p className="eyebrow text-terra">{book.category}</p>
      <h3 className="mt-3 text-xl leading-tight text-ink">{book.title}</h3>
      <p className="mt-1 text-sm text-ink/60">{book.authors}</p>
      <p className="mt-3 text-sm text-ink/75">{book.description}</p>
      <div className="mt-4 border-l-2 border-terra/60 pl-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/45">
          Por que está aqui
        </p>
        <p className="mt-1 text-sm text-ink/70">{book.whyHere}</p>
      </div>
      <ul className="mt-4 flex flex-wrap gap-2">
        {book.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-ink/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/55"
          >
            {tag}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-5">
        <ExternalLink
          href={book.href}
          className="font-display text-sm font-bold text-ink hover:text-terra"
        >
          Conhecer o livro
        </ExternalLink>
      </div>
    </article>
  );
}

function Biblioteca() {
  return (
    <div className="min-h-screen bg-offwhite">
      <SiteHeader />

      <section className="bg-amazon px-5 pb-10 pt-12 text-offwhite">
        <div className="mx-auto max-w-5xl">
          <IconConhecimento className="h-6 w-6 text-solar" />
          <p className="eyebrow mt-4 text-solar">Curadoria VOcare</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">Biblioteca Essencial</h1>
          <p className="mt-3 max-w-xl text-offwhite/75">
            Livros, acervos gratuitos e fontes oficiais para explorar caminhos, aprender e entender
            o mundo do trabalho — sem enrolação.
          </p>

          <nav aria-label="Seções da biblioteca" className="mt-7">
            <ul className="flex flex-wrap gap-2">
              {NAV.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="tap inline-flex items-center rounded-full border border-offwhite/20 px-4 py-2 text-sm text-offwhite/85 transition-colors hover:border-solar hover:text-solar"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <Section
        id="leituras"
        number="01"
        title="Leituras que abrem cabeças"
        description="Uma estante enxuta de livros que ajudam a pensar escolhas, aprendizado e mundo."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CURATED_BOOKS.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </Section>

      {RESOURCE_SECTIONS.map((section) => (
        <Section
          key={section.id}
          id={section.id}
          number={section.number}
          title={section.title}
          description={section.description}
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {LIBRARY_RESOURCES.filter((resource) => resource.category === section.category).map(
              (resource) => (
                <ResourceCard
                  key={resource.id}
                  title={resource.title}
                  description={resource.description}
                  href={resource.href}
                  cta={resource.cta}
                  tags={resource.tags}
                  accent={section.accent}
                  {...(resource.note ? { note: resource.note } : {})}
                />
              ),
            )}
          </div>
        </Section>
      ))}

      <section className="px-5 pb-20 pt-4">
        <div className="mx-auto max-w-5xl rounded-3xl bg-amazon px-6 py-12 text-offwhite sm:px-10">
          <p className="eyebrow text-solar">Continue explorando</p>
          <h2 className="mt-3 max-w-xl text-2xl sm:text-3xl">
            Uma referência pode abrir a próxima pergunta.
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/pensar"
              className="tap inline-flex items-center gap-2 rounded-full bg-solar px-6 py-3 font-display font-bold text-ink transition-transform hover:-translate-y-0.5"
            >
              Explorar caminhos
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/oportunidades"
              className="tap inline-flex items-center gap-2 rounded-full border border-offwhite/25 px-6 py-3 font-display font-bold text-offwhite transition-colors hover:border-solar hover:text-solar"
            >
              Encontrar oportunidades
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
