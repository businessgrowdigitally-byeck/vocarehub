import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-youth.jpg";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArcCards } from "@/components/ArcCards";
import { AltusBlock } from "@/components/AltusBlock";
import {
  IconProfissoes,
  IconCursos,
  IconOportunidades,
  IconDinheiro,
  IconConhecimento,
} from "@/components/brand/BrandIcons";

const title = "VOcare — O chamado para o que vem depois.";
const description =
  "Portal gratuito de orientação vocacional para jovens de 15 a 18 anos. Ser, Pensar e Fazer: existe mais de um caminho.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

const TEMAS = [
  { label: "Profissões", Icon: IconProfissoes, to: "/biblioteca" as const },
  { label: "Cursos gratuitos", Icon: IconCursos, to: "/biblioteca" as const },
  { label: "Oportunidades", Icon: IconOportunidades, to: "/oportunidades" as const },
  { label: "Dinheiro & trabalho", Icon: IconDinheiro, to: "/biblioteca" as const },
  { label: "Conhecimento", Icon: IconConhecimento, to: "/biblioteca" as const },
];

function Index() {
  return (
    <div className="min-h-screen bg-amazon">
      {/* HERO */}
      <section className="relative">
        <SiteHeader overlay />

        <div className="relative min-h-[62vh] w-full overflow-hidden sm:min-h-[78vh]">
          <img
            src={heroImg}
            alt="Jovem olhando para cima em um mirante urbano brasileiro ao pôr do sol"
            width={1024}
            height={1280}
            className="absolute inset-0 h-full w-full object-cover object-[60%_30%]"
          />
          <div className="hero-scrim absolute inset-0" />

          {/* recorte triangular Solar — assinatura visual */}
          <span
            className="pointer-events-none absolute right-0 top-16 h-40 w-40 sm:h-72 sm:w-72"
            style={{
              backgroundColor: "var(--solar)",
              clipPath: "polygon(100% 0, 100% 100%, 0 0)",
            }}
          />

          <div className="relative mx-auto flex min-h-[62vh] max-w-6xl flex-col justify-end px-5 pb-14 sm:min-h-[78vh] sm:pb-20">
            <p className="eyebrow text-solar">O chamado para o que vem depois.</p>
            <h1 className="mt-4 max-w-2xl text-4xl leading-[1.02] sm:text-6xl md:text-7xl">
              Existe mais
              <br />
              de um caminho.
            </h1>
            <p className="mt-4 max-w-md text-offwhite/80">
              Explore conteúdos, cursos, oportunidades e ferramentas para construir o seu futuro —
              e descobrir por onde começar.
            </p>
            <div className="mt-7">
              <Link
                to="/ser"
                className="tap inline-flex items-center gap-2 rounded-full bg-solar px-7 py-3.5 font-display font-bold text-ink transition-transform hover:-translate-y-0.5"
              >
                Comece por você
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* bottom-sheet: Explore por tema */}
        <div className="relative -mt-8 rounded-t-[28px] bg-offwhite px-5 pb-12 pt-9 text-ink">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl sm:text-3xl">Explore por tema</h2>
            <ul className="mt-5 divide-y divide-ink/10 md:grid md:grid-cols-2 md:gap-x-10 md:divide-y-0">
              {TEMAS.map(({ label, Icon, to }) => (
                <li key={label} className="md:border-b md:border-ink/10">
                  <Link
                    to={to}
                    className="tap flex w-full items-center gap-4 py-4 transition-colors hover:text-terra"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-ink/70" />
                    <span className="min-w-0 flex-1 truncate">{label}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 opacity-40" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ArcCards />

      {/* frase de marca */}
      <section className="bg-amazon px-5 pb-20">
        <div className="mx-auto max-w-6xl border-t border-offwhite/10 pt-12">
          <p className="max-w-2xl font-display text-3xl font-bold leading-tight sm:text-4xl">
            O futuro não é uma <span className="text-solar">resposta</span>.
            <br />É uma possibilidade.
          </p>
        </div>
      </section>

      <AltusBlock />
      <SiteFooter />
    </div>
  );
}
