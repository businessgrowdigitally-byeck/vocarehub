import type { CareerProfileMapping, ProfileConfidence } from "./career-profile-mapping.ts";
import type { InterestProfile, RiasecDimension } from "./riasec.ts";
import { RIASEC_DIMENSIONS } from "./riasec.ts";

export type SourcedCareerProfile = {
  pathId: string;
  sourceKind: "occupational";
  confidence: ProfileConfidence;
  interests: InterestProfile;
  onetSocCodes: readonly string[];
};

export type OnetSource = {
  database: string;
  file: string;
  sha256: string;
};

const ELEMENT_TO_DIMENSION: Readonly<Record<string, RiasecDimension>> = {
  Realistic: "R",
  Investigative: "I",
  Artistic: "A",
  Social: "S",
  Enterprising: "E",
  Conventional: "C",
};

export const ONET_SCALE_MIN = 1;
export const ONET_SCALE_MAX = 7;

/** Escala O*NET de interesse ocupacional (1–7) para 0–1: (bruto - 1) / 6. */
export function normalizeOnetScore(raw: number): number {
  return (raw - ONET_SCALE_MIN) / (ONET_SCALE_MAX - ONET_SCALE_MIN);
}

export function roundTo4(value: number): number {
  return Math.round(value * 10_000) / 10_000;
}

/**
 * Divide uma linha em células. Aceita tabulação (formato texto) ou vírgula com campos entre
 * aspas (CSV), como em "Camera Operators, Television, Video, and Film".
 */
export function splitRow(line: string, delimiter: string): string[] {
  if (delimiter === "\t") return line.split("\t");
  const cells: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (quoted) {
      if (char === '"' && line[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"') quoted = true;
    else if (char === delimiter) {
      cells.push(cell);
      cell = "";
    } else cell += char;
  }
  cells.push(cell);
  return cells;
}

/**
 * Lê o arquivo de interesses do O*NET: "Career Interest Types" (CSV, versão 31.0) ou o
 * antigo `Interests.txt` (tabulação). Usa apenas as linhas da escala "OI"
 * (Occupational Interests, 1–7). Devolve, por código O*NET-SOC, as seis pontuações brutas.
 */
export function parseOnetInterests(text: string): Map<string, Record<RiasecDimension, number>> {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");
  const delimiter = (lines[0] ?? "").includes("\t") ? "\t" : ",";
  const header = splitRow(lines[0] ?? "", delimiter);
  const col = (name: string) => {
    const index = header.indexOf(name);
    if (index === -1) throw new Error(`Coluna ausente no arquivo O*NET: ${name}`);
    return index;
  };
  const codeCol = col("O*NET-SOC Code");
  const elementCol = col("Element Name");
  const scaleCol = col("Scale ID");
  const valueCol = col("Data Value");

  const partial = new Map<string, Partial<Record<RiasecDimension, number>>>();
  for (const line of lines.slice(1)) {
    const cells = splitRow(line, delimiter);
    if (cells[scaleCol] !== "OI") continue;
    const dimension = ELEMENT_TO_DIMENSION[cells[elementCol] ?? ""];
    if (!dimension) continue;
    const raw = Number(cells[valueCol]);
    if (!Number.isFinite(raw) || raw < ONET_SCALE_MIN || raw > ONET_SCALE_MAX) {
      throw new Error(`Valor inválido para ${cells[codeCol]} ${dimension}: ${cells[valueCol]}`);
    }
    const code = cells[codeCol] ?? "";
    const entry = partial.get(code) ?? {};
    entry[dimension] = raw;
    partial.set(code, entry);
  }

  const complete = new Map<string, Record<RiasecDimension, number>>();
  for (const [code, entry] of partial) {
    if (RIASEC_DIMENSIONS.every((dimension) => typeof entry[dimension] === "number")) {
      complete.set(code, entry as Record<RiasecDimension, number>);
    }
  }
  return complete;
}

/**
 * Monta os perfis: normaliza cada ocupação, tira a média aritmética entre as ocupações
 * do caminho e arredonda a 4 casas no final. Falha se algum código não existir.
 */
export function buildSourcedProfiles(
  onet: ReadonlyMap<string, Record<RiasecDimension, number>>,
  mappings: readonly CareerProfileMapping[],
): SourcedCareerProfile[] {
  const missing = mappings.flatMap((mapping) =>
    mapping.onetSocCodes
      .filter((code) => !onet.has(code))
      .map((code) => `${mapping.pathId}: ${code}`),
  );
  if (missing.length > 0) {
    throw new Error(`Códigos O*NET não encontrados no arquivo:\n${missing.join("\n")}`);
  }

  return mappings.map((mapping) => {
    const interests = {} as Record<RiasecDimension, number>;
    for (const dimension of RIASEC_DIMENSIONS) {
      const values = mapping.onetSocCodes.map((code) =>
        normalizeOnetScore(onet.get(code)?.[dimension] as number),
      );
      interests[dimension] = roundTo4(values.reduce((sum, v) => sum + v, 0) / values.length);
    }
    return {
      pathId: mapping.pathId,
      sourceKind: "occupational",
      confidence: mapping.confidence,
      interests,
      onetSocCodes: [...mapping.onetSocCodes],
    };
  });
}

export function renderGeneratedModule(
  profiles: readonly SourcedCareerProfile[],
  source: OnetSource | null,
): string {
  return `// Arquivo gerado por scripts/import-onet-interests.ts. Não edite à mão.
//
// Inclui informações do banco de dados O*NET do U.S. Department of Labor, Employment and
// Training Administration (USDOL/ETA), usadas sob a licença CC BY 4.0. O VOcare adaptou os
// dados (normalização e média entre ocupações). O*NET® é marca registrada do USDOL/ETA.

import type { OnetSource, SourcedCareerProfile } from "./onet-import.ts";

export const ONET_SOURCE: OnetSource | null = ${JSON.stringify(source, null, 2)};

export const SOURCED_CAREER_PROFILES: readonly SourcedCareerProfile[] = ${JSON.stringify(profiles, null, 2)};
`;
}
