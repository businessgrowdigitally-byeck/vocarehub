export type WorkModel = {
  id: string;
  title: string;
  description: string;
};

export const WORK_MODELS: readonly WorkModel[] = [
  {
    id: "clt",
    title: "Emprego CLT",
    description:
      "Vínculo formal com uma empresa, com carteira assinada, jornada definida e direitos trabalhistas.",
  },
  {
    id: "internship",
    title: "Estágio",
    description:
      "Oportunidade de aprender na prática durante os estudos, com supervisão e carga horária reduzida.",
  },
  {
    id: "apprentice",
    title: "Jovem Aprendiz",
    description:
      "Programa que combina trabalho e formação para jovens, com contrato específico e aprendizado acompanhado.",
  },
  {
    id: "freelancer",
    title: "Freelancer",
    description:
      "Trabalho por projetos ou demandas, geralmente para vários clientes, com autonomia de agenda.",
  },
  {
    id: "self-employed",
    title: "Trabalho autônomo",
    description:
      "Você oferece um serviço diretamente, define seus horários e organiza a própria rotina.",
  },
  {
    id: "entrepreneur",
    title: "Empreendedor / MEI",
    description:
      "Você cria e conduz um negócio próprio, podendo formalizar como Microempreendedor Individual.",
  },
];
