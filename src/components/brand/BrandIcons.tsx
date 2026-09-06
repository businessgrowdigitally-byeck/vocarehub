type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Ser — círculo com ponto central (autoconhecimento) */
export function IconSer({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Pensar — losango (possibilidades) */
export function IconPensar({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 2.5 21.5 12 12 21.5 2.5 12 12 2.5Z" />
    </svg>
  );
}

/** Fazer — seta (primeiros passos) */
export function IconFazer({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 12h17" />
      <path d="m14 6 6 6-6 6" />
    </svg>
  );
}

/** Oportunidades — sparkle (conexões) */
export function IconOportunidades({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 2.5c.6 5 3.9 8.3 9 9-5.1.7-8.4 4-9 9-.6-5-3.9-8.3-9-9 5.1-.7 8.4-4 9-9Z" />
    </svg>
  );
}

/** Conhecimento — cruz/plus (recursos) */
export function IconConhecimento({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3v18M3 12h18" />
    </svg>
  );
}

/** Caminhos — duas barras diagonais (exploração) */
export function IconCaminhos({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M14 3 8 21M20 3l-6 18" />
    </svg>
  );
}

/** Profissões */
export function IconProfissoes({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="7" width="18" height="13" rx="1.5" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18" />
    </svg>
  );
}

/** Cursos gratuitos */
export function IconCursos({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m12 4 9 4.5-9 4.5-9-4.5L12 4Z" />
      <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
    </svg>
  );
}

/** Dinheiro & trabalho */
export function IconDinheiro({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M9.5 9.5h4a2 2 0 0 1 0 4h-3a2 2 0 0 0 0 4h4" />
    </svg>
  );
}
