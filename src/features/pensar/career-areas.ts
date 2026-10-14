export type CareerAreaId =
  | "technology"
  | "creativity-design"
  | "business"
  | "engineering-construction"
  | "health"
  | "science-environment"
  | "communication-society"
  | "education-impact";

export type CareerArea = {
  id: CareerAreaId;
  title: string;
  shortDescription: string;
};

export const CAREER_AREAS: readonly CareerArea[] = [
  {
    id: "technology",
    title: "Tecnologia",
    shortDescription: "Sistemas, dados, segurança e produtos digitais.",
  },
  {
    id: "creativity-design",
    title: "Criatividade e Design",
    shortDescription: "Imagem, som, interfaces e ideias que ganham forma.",
  },
  {
    id: "business",
    title: "Negócios",
    shortDescription: "Organizações, mercado, comunicação e empreender.",
  },
  {
    id: "engineering-construction",
    title: "Engenharia e Construção",
    shortDescription: "Projetar, calcular e construir o mundo físico.",
  },
  {
    id: "health",
    title: "Saúde",
    shortDescription: "Cuidar das pessoas, do corpo e da mente.",
  },
  {
    id: "science-environment",
    title: "Ciência e Meio Ambiente",
    shortDescription: "Investigar a vida, a matéria e o planeta.",
  },
  {
    id: "communication-society",
    title: "Comunicação e Sociedade",
    shortDescription: "Informar, argumentar e entender o mundo social.",
  },
  {
    id: "education-impact",
    title: "Educação e Impacto",
    shortDescription: "Ensinar, aprender e transformar realidades.",
  },
];

export function getCareerArea(id: CareerAreaId): CareerArea | undefined {
  return CAREER_AREAS.find((area) => area.id === id);
}
