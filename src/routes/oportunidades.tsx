import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { NotionEmbed } from "@/components/NotionEmbed";
import { IconOportunidades } from "@/components/brand/BrandIcons";
import { NOTION } from "@/lib/vocare";

const title = "Oportunidades — O que está aberto agora | VOcare";
const description =
  "Bolsas, cursos, programas e vagas abertas agora para jovens que querem dar o primeiro passo.";

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

function Oportunidades() {
  return (
    <div className="min-h-screen bg-amazon">
      <SiteHeader />

      <section className="px-5 pb-8 pt-12">
        <div className="mx-auto max-w-5xl">
          <IconOportunidades className="h-6 w-6 text-solar" />
          <h1 className="mt-4 text-4xl sm:text-5xl">O que está aberto agora.</h1>
          <p className="mt-3 max-w-md text-offwhite/70">
            Portas que existem hoje. Escolha uma e comece.
          </p>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-5">
        <div className="mx-auto max-w-5xl text-offwhite">
          <NotionEmbed
            src={NOTION.oportunidades}
            title="Oportunidades VOcare"
            accent="var(--solar)"
          />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
