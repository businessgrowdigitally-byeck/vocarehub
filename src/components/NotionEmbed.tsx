import { useState } from "react";
import { ExternalLink } from "lucide-react";

type Props = {
  src: string;
  title: string;
  /** cor da moldura/spinner: valor css */
  accent?: string;
};

export function NotionEmbed({ src, title, accent = "var(--solar)" }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="w-full">
      <div className="mb-3 flex justify-end">
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="tap inline-flex items-center gap-2 rounded-full border border-current/25 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] opacity-80 transition-opacity hover:opacity-100"
        >
          Abrir em tela cheia
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div
        className="relative overflow-hidden rounded-2xl bg-offwhite p-1.5 sm:p-2"
        style={{ boxShadow: `0 0 0 2px ${accent}` }}
      >
        {!loaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-2xl bg-offwhite">
            <span
              className="h-9 w-9 animate-spin rounded-full border-[3px] border-transparent"
              style={{ borderTopColor: accent, borderRightColor: accent }}
            />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">
              Carregando conteúdo
            </span>
          </div>
        )}
        <iframe
          src={src}
          title={title}
          onLoad={() => setLoaded(true)}
          allowFullScreen
          className="h-[80vh] min-h-[520px] w-full rounded-xl border-0 bg-offwhite md:h-[720px]"
        />
      </div>
    </div>
  );
}
