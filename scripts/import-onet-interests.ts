// Gera src/lib/exploration/career-profiles.generated.ts a partir do arquivo oficial do O*NET.
//
// Uso:
//   node scripts/import-onet-interests.ts <caminho/para/arquivo> "O*NET 31.0"
//
// Arquivo: "Career Interest Types" em CSV (O*NET 31.0+, seção "Career Interests" de
// https://www.onetcenter.org/database.html) ou o antigo Interests.txt (tabulação).

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { CAREER_PROFILE_MAPPINGS } from "../src/lib/exploration/career-profile-mapping.ts";
import {
  buildSourcedProfiles,
  parseOnetInterests,
  renderGeneratedModule,
} from "../src/lib/exploration/onet-import.ts";

const [inputPath, database] = process.argv.slice(2);
if (!inputPath || !database) {
  console.error('Uso: node scripts/import-onet-interests.ts <arquivo> "O*NET 31.0"');
  process.exit(1);
}

const buffer = readFileSync(inputPath);
const profiles = buildSourcedProfiles(
  parseOnetInterests(buffer.toString("utf8")),
  CAREER_PROFILE_MAPPINGS,
);
const source = {
  database,
  file: basename(inputPath),
  sha256: createHash("sha256").update(buffer).digest("hex"),
};

const outPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/lib/exploration/career-profiles.generated.ts",
);
writeFileSync(outPath, renderGeneratedModule(profiles, source));
console.log(`${profiles.length} perfis gerados em ${outPath}`);
console.log("Rode `npx prettier --write` no arquivo gerado e depois `npm test`.");
