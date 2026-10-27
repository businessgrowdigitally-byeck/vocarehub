import { classifyProfile, rankDimensions } from "./classification.ts";
import type { InterestProfile, RiasecDimension } from "./riasec.ts";

/** Pontuação mínima (0–1) para dizer que o estudante demonstrou interesse: "Mais ou menos". */
export const SHARED_THEME_MIN_SCORE = 0.5;
export const MAX_SHARED_THEMES = 2;

/**
 * Explica uma sugestão: temas que estão entre os 3 mais fortes do estudante (com pelo menos
 * "Mais ou menos") e também entre os 3 mais fortes da profissão. Ordem: força no estudante.
 * Só descreve a semelhança já calculada — não muda o ranking. Num perfil plano não há tema
 * que se destaque, então não há explicação (a ordem de empate não é um interesse real).
 */
export function getSharedThemes(
  student: InterestProfile,
  career: InterestProfile,
): RiasecDimension[] {
  if (classifyProfile(student).pattern === "flat") return [];
  const careerTop = new Set(rankDimensions(career).slice(0, 3));
  return rankDimensions(student)
    .slice(0, 3)
    .filter((dimension) => student[dimension] >= SHARED_THEME_MIN_SCORE)
    .filter((dimension) => careerTop.has(dimension))
    .slice(0, MAX_SHARED_THEMES);
}
