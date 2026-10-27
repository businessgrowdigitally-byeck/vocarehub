import type { RiasecDimension } from "./riasec.ts";

export type InterestItem = {
  id: string;
  dimension: RiasecDimension;
  text: string;
};

export const INTEREST_SCALE_MIN = 1;
export const INTEREST_SCALE_MAX = 5;

export const INTEREST_SCALE_LABELS: readonly string[] = [
  "Nada",
  "Pouco",
  "Mais ou menos",
  "Bastante",
  "Muito",
];

/**
 * 30 itens originais, 5 por dimensão RIASEC. Cada item descreve uma atividade
 * e pergunta o quanto ela atrai o estudante — não se ele sabe fazê-la.
 * A ordem intercala as dimensões para que cada página de 6 itens tenha uma de cada.
 */
export const INTEREST_ITEMS: readonly InterestItem[] = [
  {
    id: "r1",
    dimension: "R",
    text: "Montar ou consertar objetos, como uma bicicleta ou um móvel.",
  },
  {
    id: "i1",
    dimension: "I",
    text: "Pesquisar a fundo um assunto até entender como ele funciona.",
  },
  { id: "a1", dimension: "A", text: "Desenhar, pintar, fotografar ou criar algo visual." },
  { id: "s1", dimension: "S", text: "Ajudar um colega a entender uma matéria." },
  { id: "e1", dimension: "E", text: "Liderar um grupo para alcançar um objetivo." },
  {
    id: "c1",
    dimension: "C",
    text: "Organizar materiais, arquivos ou informações de um jeito claro.",
  },

  {
    id: "r2",
    dimension: "R",
    text: "Trabalhar ao ar livre, cuidando de plantas, animais ou do ambiente.",
  },
  { id: "i2", dimension: "I", text: "Fazer experimentos para testar se uma ideia está certa." },
  { id: "a2", dimension: "A", text: "Escrever histórias, poemas, letras de música ou roteiros." },
  {
    id: "s2",
    dimension: "S",
    text: "Ouvir e apoiar alguém que está passando por um momento difícil.",
  },
  { id: "e2", dimension: "E", text: "Convencer outras pessoas a apoiar uma ideia sua." },
  { id: "c2", dimension: "C", text: "Montar planilhas, listas ou tabelas para acompanhar algo." },

  { id: "r3", dimension: "R", text: "Usar ferramentas ou máquinas para construir alguma coisa." },
  {
    id: "i3",
    dimension: "I",
    text: "Resolver problemas de lógica, matemática ou desafios de raciocínio.",
  },
  { id: "a3", dimension: "A", text: "Tocar um instrumento, cantar, dançar ou atuar." },
  {
    id: "s3",
    dimension: "S",
    text: "Participar de ações voluntárias ou projetos na sua comunidade.",
  },
  { id: "e3", dimension: "E", text: "Vender um produto ou serviço, ou negociar um bom acordo." },
  {
    id: "c3",
    dimension: "C",
    text: "Seguir um procedimento passo a passo para que tudo saia certo.",
  },

  {
    id: "r4",
    dimension: "R",
    text: "Entender como funciona por dentro um motor, um circuito ou um aparelho.",
  },
  {
    id: "i4",
    dimension: "I",
    text: "Ler ou assistir conteúdos sobre ciência, saúde ou tecnologia.",
  },
  { id: "a4", dimension: "A", text: "Inventar formas novas e originais de fazer alguma coisa." },
  { id: "s4", dimension: "S", text: "Cuidar da saúde ou do bem-estar de outras pessoas." },
  { id: "e4", dimension: "E", text: "Começar do zero um projeto ou um pequeno negócio." },
  { id: "c4", dimension: "C", text: "Cuidar das contas, de um orçamento ou de registros." },

  {
    id: "r5",
    dimension: "R",
    text: "Fazer atividades práticas em que dá para ver o resultado com as próprias mãos.",
  },
  { id: "i5", dimension: "I", text: "Analisar informações para descobrir a causa de um problema." },
  { id: "a5", dimension: "A", text: "Criar vídeos, posts ou outros conteúdos com o seu estilo." },
  {
    id: "s5",
    dimension: "S",
    text: "Trabalhar em grupo para ajudar pessoas a resolverem algo.",
  },
  {
    id: "e5",
    dimension: "E",
    text: "Representar sua turma ou seu grupo em uma conversa importante.",
  },
  { id: "c5", dimension: "C", text: "Conferir detalhes para encontrar e corrigir erros." },
];

export const INTEREST_ITEMS_PER_PAGE = 6;

export function getInterestItemPage(page: number): readonly InterestItem[] {
  const start = page * INTEREST_ITEMS_PER_PAGE;
  return INTEREST_ITEMS.slice(start, start + INTEREST_ITEMS_PER_PAGE);
}

export const INTEREST_PAGE_COUNT = Math.ceil(INTEREST_ITEMS.length / INTEREST_ITEMS_PER_PAGE);
