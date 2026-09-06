import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { NotionEmbed } from "@/components/NotionEmbed";
import {
  IconConhecimento,
  IconProfissoes,
  IconCursos,
  IconDinheiro,
  IconOportunidades,
} from "@/components/brand/BrandIcons";
import { NOTION } from "@/lib/vocare";

const title = "Biblioteca — Explore por tema | VOcare";
const description =
  "Profissões, cursos gratuitos, oportunidades, dinheiro & trabalho e conhecimento reunidos em um só lugar.";

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

const TEMAS = [
  { label: "Profissões", Icon: IconProfissoes },
  { label: "Cursos gratuitos", Icon: IconCursos },
  { label: "Oportunidades", Icon: IconOportunidades },
  { label: "Dinheiro & trabalho", Icon: IconDinheiro },
  { label: "Conhecimento", Icon: IconConhecimento },
];

function Biblioteca() {
  return (
    <div className="min-h-screen bg-amazon">
      <SiteHeader />

      <section className="px-5 pb-8 pt-12">
        <div className="mx-auto max-w-5xl">
          <IconConhecimento className="h-6 w-6 text-solar" />
          <h1 className="mt-4 text-4xl sm:text-5xl">Explore por tema</h1>
          <p className="mt-3 max-w-md text-offwhite/70">
            Você tem mais possibilidades do que imagina. Role até o tema que te interessa.
          </p>

          <ul className="mt-8 flex flex-wrap gap-2">
            {TEMAS.map(({ label, Icon }) => (
              <li
                key={label}
                className="tap inline-flex items-center gap-2 rounded-full border border-offwhite/20 px-4 py-2 text-sm text-offwhite/85"
              >
                <Icon className="h-4 w-4 text-cian" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-5">
        <div className="mx-auto max-w-5xl text-offwhite">
          <NotionEmbed src={NOTION.biblioteca} title="Biblioteca VOcare" accent="var(--cian)" />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
