export const NOTION = {
  ser: "https://thinkable-whip-d06.notion.site/ebd//3d3c2d7e1ecf806a8d2cf87e44989504",
  pensar: "https://thinkable-whip-d06.notion.site/ebd//3d3c2d7e1ecf800f9b61e867c11804e1",
  fazer: "https://thinkable-whip-d06.notion.site/ebd//3d3c2d7e1ecf80a49007fe456a6ee79c",
  biblioteca:
    "https://thinkable-whip-d06.notion.site/ebd//d0ed8a7ee2814bd1b55d8b0b931c5a86?v=6133f4685318408d91c56eca78ac86c1",
  oportunidades: "https://thinkable-whip-d06.notion.site/ebd//3d3c2d7e1ecf80f28357c851eaa3d4bc",
} as const;

export const ALTUS_URL = "https://altus-life-os.vercel.app/en";
export const ALTUS_DASHBOARD_URL = "https://altus-dashboard-gray.vercel.app/";
export const ALTUS_EDU_CUPOM = "EDUCACIONALXBGD";

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
