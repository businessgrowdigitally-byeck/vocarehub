export type RiasecDimension = "R" | "I" | "A" | "S" | "E" | "C";

export const RIASEC_DIMENSIONS: readonly RiasecDimension[] = ["R", "I", "A", "S", "E", "C"];

/** Perfil de interesses normalizado: cada dimensão vai de 0 a 1. */
export type InterestProfile = Readonly<Record<RiasecDimension, number>>;

export type RiasecTheme = {
  dimension: RiasecDimension;
  label: string;
  description: string;
};

// Rótulos voltados ao estudante. Descrevem atividades, não traços de personalidade.
export const RIASEC_THEMES: Readonly<Record<RiasecDimension, RiasecTheme>> = {
  R: {
    dimension: "R",
    label: "Fazer na prática",
    description: "Construir, consertar, usar ferramentas e trabalhar com o mundo físico.",
  },
  I: {
    dimension: "I",
    label: "Investigar",
    description: "Pesquisar, analisar e entender como as coisas funcionam.",
  },
  A: {
    dimension: "A",
    label: "Criar",
    description: "Expressar ideias com imagem, som, escrita ou movimento.",
  },
  S: {
    dimension: "S",
    label: "Cuidar e ensinar",
    description: "Ajudar, apoiar, ensinar e trabalhar junto com pessoas.",
  },
  E: {
    dimension: "E",
    label: "Liderar e empreender",
    description: "Tomar iniciativa, convencer, negociar e conduzir projetos.",
  },
  C: {
    dimension: "C",
    label: "Organizar",
    description: "Planejar, registrar e cuidar de detalhes e informações.",
  },
};

export function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function isInterestProfile(value: unknown): value is InterestProfile {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return RIASEC_DIMENSIONS.every((dimension) => {
    const score = record[dimension];
    return typeof score === "number" && Number.isFinite(score) && score >= 0 && score <= 1;
  });
}
