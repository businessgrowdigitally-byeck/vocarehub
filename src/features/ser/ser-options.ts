export type SerOption = {
  id: string;
  label: string;
};

export const STRENGTH_OPTIONS: readonly SerOption[] = [
  { id: "problem-solving", label: "Resolver problemas" },
  { id: "explaining", label: "Explicar algo para alguém" },
  { id: "creating-ideas", label: "Criar ideias" },
  { id: "organizing", label: "Organizar coisas" },
  { id: "teamwork", label: "Trabalhar em grupo" },
  { id: "fast-learning", label: "Aprender rapidamente" },
  { id: "attention-to-detail", label: "Prestar atenção aos detalhes" },
  { id: "taking-initiative", label: "Tomar iniciativa" },
  { id: "listening", label: "Ouvir e compreender pessoas" },
  { id: "focus", label: "Manter o foco" },
  { id: "adapting", label: "Adaptar-se" },
  { id: "hands-on", label: "Construir ou fazer algo na prática" },
];

export const VALUE_OPTIONS: readonly SerOption[] = [
  { id: "autonomy", label: "Autonomia" },
  { id: "security", label: "Segurança" },
  { id: "learning", label: "Aprendizado" },
  { id: "creativity", label: "Criatividade" },
  { id: "impact", label: "Impacto" },
  { id: "stability", label: "Estabilidade" },
  { id: "recognition", label: "Reconhecimento" },
  { id: "freedom", label: "Liberdade" },
  { id: "belonging", label: "Pertencimento" },
  { id: "growth", label: "Crescimento" },
  { id: "balance", label: "Equilíbrio" },
  { id: "challenge", label: "Desafio" },
];

export const STRENGTH_MIN = 2;
export const STRENGTH_MAX = 5;
export const VALUE_MAX = 5;
export const VALUE_FINAL = 3;

export type PreferenceKey = "social" | "routine" | "practical" | "structure";

export type PreferenceScale = {
  key: PreferenceKey;
  lowLabel: string;
  highLabel: string;
  lowPhrase: string;
  neutralPhrase: string;
  highPhrase: string;
};

export const PREFERENCE_SCALES: readonly PreferenceScale[] = [
  {
    key: "social",
    lowLabel: "Mais sozinho",
    highLabel: "Mais com pessoas",
    lowPhrase: "Você demonstrou preferência por momentos com mais autonomia individual.",
    neutralPhrase:
      "Você parece confortável tanto trabalhando sozinho quanto interagindo com outras pessoas.",
    highPhrase: "Você demonstrou preferência por contextos com mais interação com pessoas.",
  },
  {
    key: "routine",
    lowLabel: "Mais rotina",
    highLabel: "Mais variedade",
    lowPhrase: "Você demonstrou preferência por ambientes com mais rotina e previsibilidade.",
    neutralPhrase: "Você parece confortável tanto com rotina quanto com variedade.",
    highPhrase: "Você demonstrou preferência por contextos com mais variedade e mudança.",
  },
  {
    key: "practical",
    lowLabel: "Mais ideias e conceitos",
    highLabel: "Mais prática",
    lowPhrase: "Você demonstrou preferência por trabalhar com ideias e conceitos.",
    neutralPhrase: "Você parece confortável tanto com ideias e conceitos quanto com a prática.",
    highPhrase: "Você demonstrou preferência por aprender fazendo, com atividades práticas.",
  },
  {
    key: "structure",
    lowLabel: "Mais estrutura",
    highLabel: "Mais liberdade",
    lowPhrase: "Você demonstrou preferência por ambientes com mais estrutura e direção.",
    neutralPhrase:
      "Você parece confortável tanto em ambientes estruturados quanto com mais liberdade.",
    highPhrase: "Você demonstrou preferência por contextos com mais liberdade e flexibilidade.",
  },
];
