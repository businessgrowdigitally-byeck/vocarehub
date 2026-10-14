/**
 * Oportunidades — fontes estáticas curadas pelo VOcare.
 *
 * Regra de produto: o VOcare aponta onde procurar; quem mantém datas, vagas,
 * preços e regras são as instituições responsáveis. Nenhum item carrega
 * informação temporal ou promessa de resultado.
 */

import {
  LEARNING_RESOURCE_IDS,
  getLibraryResource,
  type LibraryResource,
} from "./library-resources.ts";

export const OPPORTUNITY_CATEGORIES = ["work", "learning", "college", "science"] as const;

export type OpportunityCategory = (typeof OPPORTUNITY_CATEGORIES)[number];

export type OpportunitySourceType = "official" | "institutional";

export interface OpportunitySource {
  id: string;
  category: OpportunityCategory;
  title: string;
  description: string;
  note?: string;
  emphasis?: "eligibility" | "caution";
  tags: readonly string[];
  href: string;
  cta: string;
  sourceType: OpportunitySourceType;
}

/**
 * Converte um recurso de aprendizagem da Biblioteca em fonte de Oportunidades.
 * Evita duplicar manualmente os mesmos objetos.
 */
function fromLearningResource(resource: LibraryResource): OpportunitySource {
  return {
    id: resource.id,
    category: "learning",
    title: resource.title,
    description: resource.description,
    ...(resource.note ? { note: resource.note } : {}),
    tags: resource.tags,
    href: resource.href,
    cta: resource.cta,
    sourceType: resource.sourceType === "open-access" ? "institutional" : resource.sourceType,
  };
}

const LEARNING_AUTHORED: readonly OpportunitySource[] = [
  {
    id: "senac-psg",
    category: "learning",
    title: "Programa Senac de Gratuidade (PSG)",
    description:
      "Cursos gratuitos de formação profissional oferecidos para pessoas de baixa renda.",
    note: "Elegibilidade, oferta e regras são definidas pelo Senac em cada unidade.",
    tags: ["Cursos gratuitos", "Formação profissional", "Gratuidade"],
    href: "https://www.sp.senac.br/programa-senac-de-gratuidade/",
    cta: "Ver o programa",
    sourceType: "institutional",
  },
];

const REUSED_LEARNING_OPPORTUNITIES: readonly OpportunitySource[] = LEARNING_RESOURCE_IDS.flatMap(
  (id) => {
    const resource = getLibraryResource(id);
    return resource ? [fromLearningResource(resource)] : [];
  },
);

const WORK_OPPORTUNITIES: readonly OpportunitySource[] = [
  {
    id: "ciee",
    category: "work",
    title: "CIEE — Estágios e aprendizagem",
    description:
      "Intermediação de estágios e programas de aprendizagem para estudantes de todo o país.",
    tags: ["Estágio", "Jovem aprendiz", "Experiência"],
    href: "https://portal.ciee.org.br/",
    cta: "Ver oportunidades",
    sourceType: "institutional",
  },
  {
    id: "nube",
    category: "work",
    title: "Nube — Estágios e aprendizagem",
    description:
      "Plataforma que conecta estudantes a programas de estágio e de aprendizagem profissional.",
    tags: ["Estágio", "Jovem aprendiz", "Experiência"],
    href: "https://www.nube.com.br/estudantes/painel_vagas/",
    cta: "Buscar oportunidades",
    sourceType: "institutional",
  },
  {
    id: "iel-carreiras",
    category: "work",
    title: "IEL — Estágios e carreira",
    description: "Programas de estágio e desenvolvimento profissional ligados ao setor industrial.",
    note: "Regras, períodos e requisitos são definidos pelo IEL e pelas empresas parceiras.",
    tags: ["Estágio", "Indústria", "Carreira"],
    href: "https://www.iel.portaldaindustria.com.br/para-voce/vagas-de-estagio",
    cta: "Conhecer o IEL",
    sourceType: "institutional",
  },
  {
    id: "emprega-brasil",
    category: "work",
    title: "Portal Emprega Brasil",
    description:
      "Portal do Ministério do Trabalho com serviços de emprego, qualificação e orientação profissional.",
    tags: ["Emprego", "Fonte oficial", "Qualificação"],
    href: "https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/sistema-nacional-de-emprego-sine/portal-emprega-brasil",
    cta: "Acessar o portal",
    sourceType: "official",
  },
];

const COLLEGE_OPPORTUNITIES: readonly OpportunitySource[] = [
  {
    id: "sisu",
    category: "college",
    title: "SISU — Sistema de Seleção Unificada",
    description:
      "Seleção para vagas em instituições públicas de ensino superior usando a nota do Enem.",
    tags: ["Ensino superior", "Enem", "Fonte oficial"],
    href: "https://sisu.mec.gov.br/",
    cta: "Entender o SISU",
    sourceType: "official",
  },
  {
    id: "prouni",
    category: "college",
    title: "ProUni — Universidade para Todos",
    description:
      "Bolsas de estudo em instituições privadas de ensino superior para estudantes com nota do Enem.",
    tags: ["Bolsas", "Ensino superior", "Fonte oficial"],
    href: "https://prounialuno.mec.gov.br/index/index",
    cta: "Conhecer o ProUni",
    sourceType: "official",
  },
  {
    id: "fies",
    category: "college",
    title: "FIES — Financiamento Estudantil",
    description: "Financiamento de cursos de ensino superior com juros reduzidos para estudantes.",
    note: "Financiamento não é bolsa: o valor é pago depois da formação. Leia as condições oficiais antes de decidir.",
    emphasis: "caution",
    tags: ["Financiamento", "Ensino superior", "Fonte oficial"],
    href: "https://www.gov.br/mec/pt-br/fies",
    cta: "Conhecer o FIES",
    sourceType: "official",
  },
  {
    id: "e-mec-opportunity",
    category: "college",
    title: "e-MEC — Instituições e cursos",
    description:
      "Base oficial para checar quais instituições e cursos de ensino superior são reconhecidos.",
    tags: ["Ensino superior", "Fonte oficial", "Consulta"],
    href: "https://emec.mec.gov.br/emec/nova-index/",
    cta: "Consultar o e-MEC",
    sourceType: "official",
  },
];

const SCIENCE_OPPORTUNITIES: readonly OpportunitySource[] = [
  {
    id: "pibic-em",
    category: "science",
    title: "PIBIC-EM — Iniciação científica no ensino médio",
    description: "Programa de bolsas de iniciação científica para estudantes do ensino médio.",
    note: "Instituições participantes e regras de seleção são definidas pelo CNPq e por cada instituição. Confirme a elegibilidade antes de se inscrever.",
    emphasis: "eligibility",
    tags: ["Iniciação científica", "Ensino médio", "Pesquisa"],
    href: "https://www.gov.br/cnpq/pt-br/acesso-a-informacao/acoes-e-programas/programas/programas-ict/pibic-em",
    cta: "Conhecer o PIBIC-EM",
    sourceType: "official",
  },
  {
    id: "febrace",
    category: "science",
    title: "FEBRACE — Feira Brasileira de Ciências",
    description:
      "Feira de ciências e engenharia em que estudantes apresentam projetos de pesquisa.",
    tags: ["Ciência", "Projetos", "Feira"],
    href: "https://febrace.org.br/",
    cta: "Conhecer a FEBRACE",
    sourceType: "institutional",
  },
  {
    id: "obmep-pic",
    category: "science",
    title: "PIC — Iniciação científica (OBMEP)",
    description:
      "Programa de iniciação científica em matemática para estudantes que se destacam na OBMEP.",
    note: "Para medalhistas da OBMEP. Elegibilidade e regras são definidas pela OBMEP.",
    emphasis: "eligibility",
    tags: ["Matemática", "Olimpíada", "Iniciação científica"],
    href: "https://www.obmep.org.br/pic.htm",
    cta: "Conhecer o PIC",
    sourceType: "institutional",
  },
];

export const OPPORTUNITY_SOURCES: readonly OpportunitySource[] = [
  ...WORK_OPPORTUNITIES,
  ...LEARNING_AUTHORED,
  ...REUSED_LEARNING_OPPORTUNITIES,
  ...COLLEGE_OPPORTUNITIES,
  ...SCIENCE_OPPORTUNITIES,
];

export function getOpportunitySourcesByCategory(
  category: OpportunityCategory,
): readonly OpportunitySource[] {
  return OPPORTUNITY_SOURCES.filter((source) => source.category === category);
}
