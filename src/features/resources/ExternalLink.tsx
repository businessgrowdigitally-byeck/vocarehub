import type { ReactNode } from "react";
import { ExternalLink as ExternalLinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ExternalLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

/**
 * Único ponto de saída para fora do site. Garante os atributos de segurança
 * (nova aba + noopener/noreferrer) e a indicação textual de abertura em nova aba.
 */
export function ExternalLink({ href, children, className }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "tap inline-flex items-center gap-2 underline-offset-4 transition-colors hover:underline focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current",
        className,
      )}
    >
      <span>{children}</span>
      <ExternalLinkIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span className="sr-only">(abre em nova aba)</span>
    </a>
  );
}
