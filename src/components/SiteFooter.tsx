import { Link } from "@tanstack/react-router";
import { VoLogo } from "@/components/brand/VoLogo";

export function SiteFooter() {
  return (
    <footer className="border-t border-offwhite/10 bg-amazon px-5 py-12">
      <div className="mx-auto max-w-6xl">
        <VoLogo />
        <p className="mt-4 max-w-sm font-display text-lg text-offwhite/80">
          O futuro não é uma resposta. É uma possibilidade.
        </p>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
          {[
            { label: "Ser", to: "/ser" },
            { label: "Pensar", to: "/pensar" },
            { label: "Fazer", to: "/fazer" },
            { label: "Como usar", to: "/como-usar" },
            { label: "Sobre o VOcare", to: "/sobre" },
            { label: "Biblioteca", to: "/biblioteca" },
            { label: "Oportunidades", to: "/oportunidades" },
            { label: "Para escolas", to: "/escolas" },
            { label: "Privacidade", to: "/privacidade" },
          ].map((l) => (
            <Link key={l.to} to={l.to} className="eyebrow text-offwhite/60 hover:text-solar">
              {l.label}
            </Link>
          ))}
        </div>
        <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.18em] text-offwhite/40">
          100% gratuito · Online · Feito para jovens
        </p>
        <p className="mt-3 text-[11px] text-offwhite/50">
          Contato:{" "}
          <a
            href="mailto:vocare.institucional@gmail.com"
            className="underline underline-offset-2 hover:text-offwhite/80"
          >
            vocare.institucional@gmail.com
          </a>
        </p>
        <p className="mt-3 text-[11px] text-offwhite/35">
          feito por{" "}
          <a
            href="https://www.bgdsystems.com.br/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-offwhite/70"
          >
            BGD Systems
          </a>
        </p>
      </div>
    </footer>
  );
}
