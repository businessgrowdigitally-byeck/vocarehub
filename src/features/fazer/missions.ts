export type Mission = {
  id: string;
  title: string;
  description: string;
  durationHint: string;
};

export const MISSIONS: readonly Mission[] = [
  {
    id: "mini-project",
    title: "Faça um mini-projeto",
    description: "Reserve algumas horas para criar algo pequeno relacionado a esse caminho.",
    durationHint: "1 a 3 horas",
  },
  {
    id: "follow-content",
    title: "Acompanhe conteúdo",
    description: "Siga canais, perfis ou podcasts de pessoas que já atuam nesse caminho.",
    durationHint: "alguns minutos por dia",
  },
  {
    id: "talk-to-professional",
    title: "Converse com alguém da área",
    description:
      "Procure uma pessoa que trabalha nisso e faça algumas perguntas sobre o dia a dia.",
    durationHint: "30 a 60 minutos",
  },
  {
    id: "experimental-class",
    title: "Faça uma aula introdutória",
    description: "Assista a uma aula ou mini-curso gratuito sobre o tema.",
    durationHint: "1 a 2 horas",
  },
  {
    id: "visit-workplace",
    title: "Conheça um lugar",
    description: "Visite um ambiente de estudo ou de trabalho relacionado a esse caminho.",
    durationHint: "meio período",
  },
  {
    id: "list-questions",
    title: "Liste suas dúvidas",
    description: "Anote o que você ainda quer descobrir antes de tomar qualquer decisão.",
    durationHint: "20 a 30 minutos",
  },
];

export function getMission(id: string): Mission | undefined {
  return MISSIONS.find((mission) => mission.id === id);
}

export function isKnownMissionId(id: string): boolean {
  return MISSIONS.some((mission) => mission.id === id);
}
