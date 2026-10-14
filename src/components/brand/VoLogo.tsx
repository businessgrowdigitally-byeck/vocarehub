import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** "light" = wordmark off-white (fundos escuros); "dark" = wordmark escuro */
  tone?: "light" | "dark" | "mono";
  showWordmark?: boolean;
};

export function VoSymbol({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: Props["tone"];
}) {
  const left = tone === "mono" ? "currentColor" : "var(--amazon)";
  const right = tone === "mono" ? "currentColor" : "var(--solar)";
  return (
    <svg viewBox="0 0 48 44" className={className} aria-hidden="true" fill="none">
      {/* metade esquerda do V — verde profundo */}
      <path
        d="M2 2h14l8 26-7 14L2 2Z"
        fill={left}
        stroke={tone === "light" ? "var(--offwhite)" : "none"}
        strokeWidth={tone === "light" ? 1.2 : 0}
      />
      {/* metade direita do V — Solar */}
      <path d="M46 2H32l-8 26 7 14L46 2Z" fill={right} opacity={tone === "mono" ? 0.5 : 1} />
    </svg>
  );
}

export function VoLogo({ className, tone = "light", showWordmark = true }: Props) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <VoSymbol className="h-7 w-7 shrink-0" tone={tone} />
      {showWordmark && (
        <span
          className={cn(
            "font-display text-xl leading-none tracking-tight",
            tone === "dark" ? "text-ink" : "text-offwhite",
          )}
        >
          <span className="font-bold">VO</span>
          <span className="font-bold">care</span>
        </span>
      )}
    </span>
  );
}
