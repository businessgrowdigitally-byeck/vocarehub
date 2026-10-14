export type PhaseKey = "ser" | "pensar" | "fazer";

export const PHASES: Record<
  PhaseKey,
  {
    num: string;
    name: string;
    title: string;
    color: string;
    text: "light" | "dark";
    questions: string[];
    path: "/ser" | "/pensar" | "/fazer";
    next?: { label: string; path: "/pensar" | "/fazer" };
  }
> = {
  ser: {
    num: "01",
    name: "SER",
    title: "OLHE PARA DENTRO",
    color: "var(--amazon)",
    text: "light",
    questions: ["Quem sou?", "O que gosto?", "O que valorizo?"],
    path: "/ser",
    next: { label: "Pensar", path: "/pensar" },
  },
  pensar: {
    num: "02",
    name: "PENSAR",
    title: "OLHE AO REDOR",
    color: "var(--cian)",
    text: "dark",
    questions: [
      "Quais possibilidades existem?",
      "Que tipo de vida quero construir?",
      "O que preciso aprender?",
    ],
    path: "/pensar",
    next: { label: "Fazer", path: "/fazer" },
  },
  fazer: {
    num: "03",
    name: "FAZER",
    title: "OLHE PARA FRENTE",
    color: "var(--solar)",
    text: "dark",
    questions: ["Qual é o primeiro passo?", "Onde posso experimentar?", "Onde começo?"],
    path: "/fazer",
  },
};
