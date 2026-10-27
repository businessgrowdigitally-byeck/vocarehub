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

export type OpportunityCategory =
  "work" | "learning" | "technical" | "college" | "science" | "projects";

export const OPPORTUNITY_CATEGORIES: readonly OpportunityCategory[] = [
  "work",
  "learning",
  "technical",
  "college",
  "science",
  "projects",
];

export type OpportunitySourceType = "official" | "institutional";

export interface OpportunitySource {
  id: string;
  category: OpportunityCategory;
  title: string;
  subtitle?: string;
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
    title: "Programa Senac de Gratuidade",
    description:
      "O Programa Senac de Gratuidade oferece formação profissional por meio dos departamentos regionais do Senac em todo o Brasil.",
    note: "Esta página institucional explica o programa em São Paulo, mas o PSG funciona por regionais em todo o país. Consulte o site do Senac do seu estado para verificar critérios, cursos e disponibilidade — não presumimos que existam vagas abertas.",
    tags: ["Cursos", "Gratuito", "Formação profissional"],
    href: "https://www.sp.senac.br/programa-senac-de-gratuidade/",
    cta: "Conhecer o programa ↗",
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
  {
    id: "unicef-1mio",
    category: "work",
    title: "1MiO — Um Milhão de Oportunidades",
    subtitle: "Iniciativa do UNICEF e parceiros",
    description:
      "Iniciativa voltada à inclusão produtiva de adolescentes e jovens, conectando formação, aprendizagem, estágio, emprego e desenvolvimento profissional.",
    note: "Conheça a iniciativa e consulte os canais indicados pelo UNICEF, sem presumir disponibilidade imediata de oportunidades.",
    tags: ["Jovens", "Formação", "Trabalho", "UNICEF"],
    href: "https://www.unicef.org/brazil/um-milhao-de-oportunidades-1mio-para-transformar-uma-geracao",
    cta: "Conhecer a 1MiO ↗",
    sourceType: "official",
  },
];

const TECHNICAL_OPPORTUNITIES: readonly OpportunitySource[] = [
  {
    id: "rede-federal",
    category: "technical",
    title: "Rede Federal / Institutos Federais",
    description:
      "Instituições públicas que oferecem formação técnica, tecnológica e superior em diferentes regiões do Brasil.",
    note: "Para quem ainda está no ensino médio, existem cursos técnicos integrados à educação básica, além de outras modalidades. Consulte cada instituição para conhecer a oferta local.",
    tags: ["Ensino técnico", "Público", "Educação profissional", "Brasil"],
    href: "https://www.gov.br/mec/pt-br/assuntos/ept/rede-federal",
    cta: "Conhecer a Rede Federal ↗",
    sourceType: "official",
  },
  {
    id: "tipos-cursos-tecnicos",
    category: "technical",
    title: "Entenda os tipos de cursos técnicos",
    subtitle: "Plataforma Nilo Peçanha / MEC",
    description:
      "Conheça diferenças entre modalidades como técnico integrado, concomitante, subsequente e outros tipos de formação profissional.",
    note: "Muitas opções possuem nomes que não são óbvios para quem está escolhendo o próximo passo.",
    tags: ["Curso técnico", "Ensino médio", "Formação"],
    href: "https://pnp.mec.gov.br/tipos-de-curso",
    cta: "Entender as modalidades ↗",
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

const PROJECT_OPPORTUNITIES: readonly OpportunitySource[] = [
  {
    id: "sebrae-cursos-online",
    category: "projects",
    title: "Sebrae — Aprenda a tirar ideias do papel",
    description:
      "Conteúdos e uma seleção de cursos gratuitos para desenvolver iniciativa, planejamento, projetos e noções de empreendedorismo.",
    note: "Empreender é uma possibilidade, não uma obrigação. Confira a identificação e as condições de cada conteúdo no portal do Sebrae.",
    tags: ["Projetos", "Iniciativa", "Empreendedorismo", "Aprendizado"],
    href: "https://loja.sebrae.com.br/cursos/cursos-online",
    cta: "Explorar conteúdos ↗",
    sourceType: "institutional",
  },
];

export const OPPORTUNITY_SOURCES: readonly OpportunitySource[] = [
  ...WORK_OPPORTUNITIES,
  ...LEARNING_AUTHORED,
  ...REUSED_LEARNING_OPPORTUNITIES,
  ...TECHNICAL_OPPORTUNITIES,
  ...COLLEGE_OPPORTUNITIES,
  ...SCIENCE_OPPORTUNITIES,
  ...PROJECT_OPPORTUNITIES,
];

export function getOpportunitySourcesByCategory(
  category: OpportunityCategory,
): readonly OpportunitySource[] {
  return OPPORTUNITY_SOURCES.filter((source) => source.category === category);
}
