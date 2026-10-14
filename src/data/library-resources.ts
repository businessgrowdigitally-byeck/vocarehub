/**
 * Biblioteca Essencial — dados estáticos curados pelo VOcare.
 *
 * Regra de produto: o VOcare reúne e organiza fontes confiáveis; quem mantém
 * datas, vagas, preços e regras são as próprias instituições. Por isso nenhum
 * item aqui carrega informação temporal (prazos, valores, disponibilidade).
 */

export type LibrarySourceType = "official" | "institutional" | "open-access";

export type LibraryCategory = "free-reading" | "learning" | "careers";

export interface CuratedBook {
  id: string;
  category: string;
  title: string;
  authors: string;
  description: string;
  whyHere: string;
  tags: readonly string[];
  href: string;
}

export interface LibraryResource {
  id: string;
  category: LibraryCategory;
  title: string;
  description: string;
  note?: string;
  tags: readonly string[];
  href: string;
  cta: string;
  sourceType: LibrarySourceType;
}

/** Página neutra de busca do Google Books — não depende de nenhuma loja. */
function bookSearch(title: string, authors: string): string {
  return `https://books.google.com/books?q=${encodeURIComponent(`${title} ${authors}`)}`;
}

export const CURATED_BOOKS: readonly CuratedBook[] = [
  {
    id: "design-da-sua-vida",
    category: "Explorar caminhos",
    title: "Design da sua vida",
    authors: "Bill Burnett e Dave Evans",
    description:
      "Aplica princípios de design para experimentar possibilidades antes de escolher um único caminho.",
    whyHere: "Ensina a testar hipóteses de vida na prática em vez de esperar a resposta certa.",
    tags: ["Carreira", "Experimentos", "Autoconhecimento"],
    href: "https://rocco.com.br/produto/o-design-da-sua-vida/",
  },
  {
    id: "generalistas-vencem",
    category: "Explorar caminhos",
    title: "Os generalistas vencem",
    authors: "David Epstein",
    description:
      "Mostra por que conhecimentos amplos e experiências variadas costumam compensar mais do que a especialização precoce.",
    whyHere: "Ajuda a ver valor em explorar vários interesses antes de se fixar em um só.",
    tags: ["Carreira", "Aprendizagem", "Amplitude"],
    href: bookSearch("Os generalistas vencem", "David Epstein"),
  },
  {
    id: "aprendendo-a-aprender",
    category: "Aprender a aprender",
    title: "Aprendendo a aprender",
    authors: "Barbara Oakley, Terrence Sejnowski e Alistair McConville",
    description:
      "Técnicas de estudo baseadas em como o cérebro aprende, escritas para estudantes do ensino médio.",
    whyHere: "Transforma o estudo em método, o que serve para qualquer caminho escolhido.",
    tags: ["Estudo", "Método", "Foco"],
    href: "https://www.record.com.br/products/aprendendo-a-aprender-para-criancas-e-adolescentes/",
  },
  {
    id: "habitos-atomicos",
    category: "Constância",
    title: "Hábitos atômicos",
    authors: "James Clear",
    description:
      "Explica como pequenas mudanças de rotina se acumulam em resultados ao longo do tempo.",
    whyHere: "Constância é o que sustenta qualquer plano — aqui estão as bases práticas.",
    tags: ["Hábitos", "Rotina", "Constância"],
    href: "https://altabooks.com.br/produto/habitos-atomicos/",
  },
  {
    id: "psicologia-financeira",
    category: "Dinheiro & vida",
    title: "A psicologia financeira",
    authors: "Morgan Housel",
    description:
      "Ensina como comportamento e decisões do dia a dia pesam mais no dinheiro do que planilhas complexas.",
    whyHere: "Prepara para lidar com dinheiro antes de ter os primeiros ganhos.",
    tags: ["Dinheiro", "Decisões", "Vida adulta"],
    href: "https://harpercollins.com.br/products/a-psicologia-financeira-morgan-housel",
  },
  {
    id: "perigo-historia-unica",
    category: "Olhar o mundo",
    title: "O perigo de uma história única",
    authors: "Chimamanda Ngozi Adichie",
    description:
      "Mostra como uma visão única sobre pessoas e lugares limita o que conseguimos enxergar.",
    whyHere: "Abre a cabeça para caminhos e mundos que não aparecem no óbvio.",
    tags: ["Mundo", "Pertencimento", "Perspectiva"],
    href: "https://www.companhiadasletras.com.br/livro/9788535932539/o-perigo-de-uma-historia-unica",
  },
  {
    id: "ideias-adiar-fim-mundo",
    category: "Olhar o mundo",
    title: "Ideias para adiar o fim do mundo",
    authors: "Ailton Krenak",
    description:
      "Reflete sobre a relação entre humanidade, natureza e futuro a partir de uma voz indígena brasileira.",
    whyHere: "Convida a pensar o futuro coletivo, não só o individual.",
    tags: ["Brasil", "Futuro", "Coletivo"],
    href: "https://www.companhiadasletras.com.br/livro/9788535933581/ideias-para-adiar-o-fim-do-mundo-nova-edicao",
  },
  {
    id: "quarto-de-despejo",
    category: "Olhar o mundo",
    title: "Quarto de despejo",
    authors: "Carolina Maria de Jesus",
    description:
      "Diário de uma catadora de papel que se tornou um clássico sobre a vida nas periferias do Brasil.",
    whyHere: "Reconhece realidades brasileiras que costumam ficar fora das narrativas de sucesso.",
    tags: ["Brasil", "Realidade", "Literatura"],
    href: "https://carolinamariadejesus.ims.com.br/quarto-de-despejo/",
  },
  {
    id: "factfulness",
    category: "Olhar o mundo",
    title: "Factfulness",
    authors: "Hans Rosling, Ola Rosling e Anna Rosling Rönnlund",
    description:
      "Mostra como nossos vieses distorcem a leitura do mundo e ensina a olhar para dados com calma.",
    whyHere: "Ajuda a tomar decisões com base em fatos, não em medo ou suposição.",
    tags: ["Dados", "Mundo", "Pensamento crítico"],
    href: "https://www.record.com.br/products/factfulness/",
  },
];

export const LIBRARY_RESOURCES: readonly LibraryResource[] = [
  {
    id: "mec-livros",
    category: "free-reading",
    title: "MEC Livros",
    description:
      "Acervo público de obras literárias e didáticas para leitura, mantido pelo Ministério da Educação.",
    tags: ["Leitura", "Literatura", "Educação"],
    href: "https://meclivros.mec.gov.br/",
    cta: "Acessar o acervo",
    sourceType: "official",
  },
  {
    id: "dominio-publico",
    category: "free-reading",
    title: "Domínio Público",
    description: "Base do MEC com obras de domínio público para ler e baixar gratuitamente.",
    tags: ["Leitura", "Obras clássicas", "Download"],
    href: "https://dominiopublico.mec.gov.br/pesquisa/PesquisaObraForm.do",
    cta: "Explorar obras",
    sourceType: "official",
  },
  {
    id: "scielo-livros",
    category: "free-reading",
    title: "SciELO Livros",
    description:
      "Coleção de livros acadêmicos de acesso aberto, revisados e publicados por editoras universitárias.",
    tags: ["Leitura", "Acadêmico", "Acesso aberto"],
    href: "https://search.livros.scielo.org/?lang=pt",
    cta: "Buscar livros",
    sourceType: "open-access",
  },
  {
    id: "escola-trabalhador-40",
    category: "learning",
    title: "Escola do Trabalhador 4.0",
    description:
      "Trilhas de formação gratuitas em tecnologia, dados e produtividade para o mundo do trabalho.",
    tags: ["Cursos gratuitos", "Tecnologia", "Fonte oficial"],
    href: "https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/qualificacao-profissional/caminho-digital",
    cta: "Ver trilhas",
    sourceType: "official",
  },
  {
    id: "escola-virtual-bradesco",
    category: "learning",
    title: "Fundação Bradesco — Escola Virtual",
    description:
      "Cursos online gratuitos com certificado em administração, tecnologia e desenvolvimento pessoal.",
    tags: ["Cursos gratuitos", "Certificado", "Online"],
    href: "https://www.ev.org.br/",
    cta: "Ver cursos",
    sourceType: "institutional",
  },
  {
    id: "escola-virtual-gov",
    category: "learning",
    title: "Escola Virtual de Governo",
    description:
      "Catálogo de cursos livres gratuitos e abertos em áreas como gestão, tecnologia e cidadania.",
    tags: ["Cursos gratuitos", "Fonte oficial", "Online"],
    href: "https://www.escolavirtual.gov.br/catalogo",
    cta: "Explorar catálogo",
    sourceType: "official",
  },
  {
    id: "senai-futuro-digital",
    category: "learning",
    title: "Futuro Digital (SENAI)",
    description:
      "Cursos gratuitos de tecnologia e indústria digital pensados para quem está começando.",
    note: "A disponibilidade e as regras de certificado são definidas pelo SENAI e podem mudar.",
    tags: ["Cursos gratuitos", "Tecnologia", "Formação profissional"],
    href: "https://secure.futuro.digital/cursos-gratuitos",
    cta: "Ver cursos",
    sourceType: "institutional",
  },
  {
    id: "cidadania-financeira",
    category: "learning",
    title: "Cidadania Financeira (Banco Central)",
    description:
      "Conteúdos oficiais sobre orçamento, crédito, poupança e uso consciente do dinheiro.",
    tags: ["Dinheiro", "Fonte oficial", "Educação financeira"],
    href: "https://www.bcb.gov.br/cidadaniafinanceira/indexcidadaniafinanceira",
    cta: "Aprender sobre dinheiro",
    sourceType: "official",
  },
  {
    id: "qbq",
    category: "careers",
    title: "Quem é Quem no Brasil (QBQ)",
    description:
      "Catálogo do Ministério do Trabalho com informações sobre profissões e ocupações brasileiras.",
    tags: ["Profissões", "Fonte oficial", "Explorar"],
    href: "https://qbq.trabalho.gov.br/",
    cta: "Explorar profissões",
    sourceType: "official",
  },
  {
    id: "cbo",
    category: "careers",
    title: "Classificação Brasileira de Ocupações (CBO)",
    description:
      "Lista oficial de ocupações do país, com descrições e atividades típicas de cada uma.",
    tags: ["Profissões", "Fonte oficial", "Referência"],
    href: "https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/cbo/pagina-inicial/",
    cta: "Consultar a CBO",
    sourceType: "official",
  },
  {
    id: "cnct",
    category: "careers",
    title: "Catálogo Nacional de Cursos Técnicos (CNCT)",
    description:
      "Cursos técnicos de nível médio reconhecidos em todo o país, organizados por área.",
    tags: ["Cursos técnicos", "Fonte oficial", "Formação"],
    href: "https://cnct.mec.gov.br/",
    cta: "Ver cursos técnicos",
    sourceType: "official",
  },
  {
    id: "e-mec",
    category: "careers",
    title: "e-MEC",
    description:
      "Base oficial para consultar instituições e cursos de ensino superior reconhecidos no Brasil.",
    tags: ["Faculdades", "Fonte oficial", "Ensino superior"],
    href: "https://emec.mec.gov.br/emec/nova-index/",
    cta: "Consultar instituições",
    sourceType: "official",
  },
];

/**
 * IDs dos recursos de aprendizagem que também aparecem em Oportunidades.
 * Oportunidades reutiliza esses recursos para não duplicar dados.
 */
export const LEARNING_RESOURCE_IDS = [
  "escola-trabalhador-40",
  "escola-virtual-bradesco",
  "escola-virtual-gov",
  "senai-futuro-digital",
] as const;

export function getLibraryResource(id: string): LibraryResource | undefined {
  return LIBRARY_RESOURCES.find((resource) => resource.id === id);
}
