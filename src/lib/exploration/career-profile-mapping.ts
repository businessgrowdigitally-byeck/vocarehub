/**
 * Mapeamento dos caminhos do VOcare para ocupações do O*NET (taxonomia O*NET-SOC 2019).
 *
 * É uma adaptação: o O*NET descreve ocupações dos EUA. A confiança expressa o quanto as
 * ocupações escolhidas representam o caminho brasileiro — não é um percentual de
 * compatibilidade nem uma validação científica para adolescentes brasileiros.
 *
 * As pontuações NÃO ficam aqui. Elas são geradas a partir do arquivo oficial do O*NET por
 * `scripts/import-onet-interests.ts`, que falha se algum código não existir no arquivo.
 */

export type ProfileConfidence = "high" | "medium" | "low";

export type CareerProfileMapping = {
  pathId: string;
  onetSocCodes: readonly string[];
  confidence: ProfileConfidence;
  note?: string;
};

export type PendingCareerPath = {
  pathId: string;
  reason: string;
};

export const CAREER_PROFILE_MAPPINGS: readonly CareerProfileMapping[] = [
  // Tecnologia
  {
    pathId: "software-development",
    onetSocCodes: ["15-1252.00", "15-1254.00"],
    confidence: "high",
  },
  { pathId: "data", onetSocCodes: ["15-2051.00", "15-2041.00"], confidence: "high" },
  { pathId: "cybersecurity", onetSocCodes: ["15-1212.00"], confidence: "high" },
  // Criatividade e Design
  { pathId: "graphic-design", onetSocCodes: ["27-1024.00"], confidence: "high" },
  { pathId: "ux-ui", onetSocCodes: ["15-1255.00"], confidence: "high" },
  {
    pathId: "audiovisual",
    onetSocCodes: ["27-4031.00", "27-4032.00"],
    confidence: "medium",
    note: "Câmera e edição; não cobre direção nem roteiro.",
  },
  { pathId: "photography", onetSocCodes: ["27-4021.00"], confidence: "high" },
  // Negócios
  {
    pathId: "administration",
    onetSocCodes: ["11-1021.00", "13-1111.00"],
    confidence: "medium",
    note: "Administração é ampla; gestão geral e análise de processos como referência.",
  },
  { pathId: "marketing", onetSocCodes: ["11-2021.00", "13-1161.00"], confidence: "high" },
  {
    pathId: "sales",
    onetSocCodes: ["41-4012.00", "41-2031.00"],
    confidence: "medium",
    note: "Vendas no atacado e no varejo.",
  },
  // Engenharia e Construção
  { pathId: "civil-engineering", onetSocCodes: ["17-2051.00"], confidence: "high" },
  { pathId: "mechanical-engineering", onetSocCodes: ["17-2141.00"], confidence: "high" },
  { pathId: "electrical-engineering", onetSocCodes: ["17-2071.00"], confidence: "high" },
  { pathId: "architecture", onetSocCodes: ["17-1011.00"], confidence: "high" },
  // Saúde
  {
    pathId: "medicine",
    onetSocCodes: ["29-1215.00", "29-1216.00"],
    confidence: "high",
    note: "Medicina de família e clínica geral como referência.",
  },
  { pathId: "nursing", onetSocCodes: ["29-1141.00"], confidence: "high" },
  { pathId: "psychology", onetSocCodes: ["19-3033.00"], confidence: "high" },
  { pathId: "physiotherapy", onetSocCodes: ["29-1123.00"], confidence: "high" },
  // Ciência e Meio Ambiente
  {
    pathId: "biology",
    onetSocCodes: ["19-1029.04", "19-1022.00"],
    confidence: "medium",
    note: "Biologia geral e microbiologia; a biologia brasileira inclui também licenciatura.",
  },
  { pathId: "chemistry", onetSocCodes: ["19-2031.00"], confidence: "high" },
  { pathId: "environmental-science", onetSocCodes: ["19-2041.00"], confidence: "high" },
  // Comunicação e Sociedade
  { pathId: "journalism", onetSocCodes: ["27-3023.00"], confidence: "high" },
  {
    pathId: "advertising",
    onetSocCodes: ["11-2011.00", "41-3011.00"],
    confidence: "medium",
    note: "Gestão e venda de publicidade; a criação publicitária não tem ocupação própria.",
  },
  { pathId: "law", onetSocCodes: ["23-1011.00"], confidence: "high" },
  // Educação e Impacto
  {
    pathId: "pedagogy",
    onetSocCodes: ["25-9031.00", "25-2021.00"],
    confidence: "medium",
    note: "Coordenação pedagógica e ensino fundamental.",
  },
  { pathId: "teaching-degrees", onetSocCodes: ["25-2031.00"], confidence: "high" },
  { pathId: "social-work", onetSocCodes: ["21-1021.00", "21-1029.00"], confidence: "high" },
];

/** Caminhos sem perfil ocupacional adequado. Nunca recebem pontuação inventada. */
export const PENDING_CAREER_PATHS: readonly PendingCareerPath[] = [
  {
    pathId: "digital-product",
    reason: "Não há ocupação O*NET equivalente a gestão de produto digital.",
  },
  {
    pathId: "entrepreneurship",
    reason: "Empreender é uma forma de trabalhar, não uma ocupação com perfil próprio.",
  },
  {
    pathId: "international-relations",
    reason: "Não há ocupação O*NET que represente bem a área no contexto brasileiro.",
  },
];
