import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { VoLogo } from "@/components/brand/VoLogo";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Início", to: "/" },
  { label: "Ser", to: "/ser" },
  { label: "Pensar", to: "/pensar" },
  { label: "Fazer", to: "/fazer" },
  { label: "Biblioteca", to: "/biblioteca" },
  { label: "Oportunidades", to: "/oportunidades" },
] as const;

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header
        className={cn(
          "z-40 w-full",
          overlay
            ? "absolute inset-x-0 top-0"
            : "sticky top-0 border-b border-offwhite/10 bg-amazon/90 backdrop-blur",
        )}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4">
          <Link to="/" className="min-w-0" aria-label="VOcare — início">
            <VoLogo />
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-6 md:flex">
              {LINKS.slice(1, 4).map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="eyebrow text-offwhite/70 transition-colors hover:text-solar"
                  activeProps={{ className: "text-solar" }}
                >
                  {l.label}
                </Link>
              ))}
              <span className="h-3 w-px bg-offwhite/25" />
              {LINKS.slice(4).map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="eyebrow text-offwhite/70 transition-colors hover:text-solar"
                  activeProps={{ className: "text-solar" }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Abrir menu"
              className="tap -mr-2 inline-flex items-center justify-center text-offwhite md:hidden"
            >
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 bg-amazon md:hidden">
          <div className="flex items-center justify-between px-5 py-4">
            <VoLogo />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
              className="tap -mr-2 inline-flex items-center justify-center text-offwhite"
            >
              <X className="h-6 w-6" strokeWidth={1.5} />
            </button>
          </div>
          <nav className="flex flex-col px-5 pt-6">
            {LINKS.map((l, i) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="tap flex items-baseline gap-4 border-b border-offwhite/10 py-5"
                activeProps={{ className: "text-solar" }}
              >
                <span className="font-mono text-[11px] text-solar/70">
                  {String(i).padStart(2, "0")}
                </span>
                <span className="font-display text-2xl font-bold">{l.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
