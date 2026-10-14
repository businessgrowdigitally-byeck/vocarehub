import { cn } from "@/lib/utils";
import { ExternalLink } from "./ExternalLink";

export type ResourceAccent = "cian" | "solar" | "terra";
export type ResourceTone = "light" | "dark";

const ACCENT: Record<ResourceAccent, string> = {
  cian: "var(--cian)",
  solar: "var(--solar)",
  terra: "var(--terra)",
};

const TONE: Record<
  ResourceTone,
  {
    card: string;
    subtitle: string;
    title: string;
    body: string;
    note: string;
    tag: string;
    link: string;
  }
> = {
  light: {
    card: "border-ink/10 bg-white",
    subtitle: "text-ink/45",
    title: "text-ink",
    body: "text-ink/70",
    note: "bg-ink/[0.04] text-ink/70",
    tag: "border-ink/15 text-ink/55",
    link: "text-ink hover:text-terra",
  },
  dark: {
    card: "border-offwhite/12 bg-offwhite/[0.04]",
    subtitle: "text-offwhite/45",
    title: "text-offwhite",
    body: "text-offwhite/70",
    note: "bg-offwhite/[0.07] text-offwhite/75",
    tag: "border-offwhite/15 text-offwhite/60",
    link: "text-offwhite hover:text-solar",
  },
};

type ResourceCardProps = {
  title: string;
  description: string;
  href: string;
  cta: string;
  tags: readonly string[];
  subtitle?: string;
  note?: string;
  accent?: ResourceAccent;
  tone?: ResourceTone;
};

export function ResourceCard({
  title,
  description,
  href,
  cta,
  tags,
  subtitle,
  note,
  accent = "cian",
  tone = "light",
}: ResourceCardProps) {
  const t = TONE[tone];
  return (
    <article className={cn("flex h-full flex-col rounded-2xl border p-6", t.card)}>
      <span
        aria-hidden="true"
        className="h-1 w-10 rounded-full"
        style={{ backgroundColor: ACCENT[accent] }}
      />
      {subtitle ? <p className={cn("eyebrow mt-4", t.subtitle)}>{subtitle}</p> : null}
      <h3 className={cn("mt-3 text-xl leading-tight", t.title)}>{title}</h3>
      <p className={cn("mt-2 text-sm", t.body)}>{description}</p>
      {note ? <p className={cn("mt-3 rounded-xl px-3 py-2 text-xs", t.note)}>{note}</p> : null}

      {tags.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li
              key={tag}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em]",
                t.tag,
              )}
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-auto pt-5">
        <ExternalLink href={href} className={cn("font-display text-sm font-bold", t.link)}>
          {cta}
        </ExternalLink>
      </div>
    </article>
  );
}
