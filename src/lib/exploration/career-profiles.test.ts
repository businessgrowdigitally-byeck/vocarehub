import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { CAREER_PATHS } from "../../features/pensar/career-paths.ts";
import { CAREER_PROFILE_MAPPINGS, PENDING_CAREER_PATHS } from "./career-profile-mapping.ts";
import { ONET_SOURCE, SOURCED_CAREER_PROFILES } from "./career-profiles.generated.ts";
import {
  getSourcedCareerCandidates,
  getSourcedCareerProfilePathIds,
  isPendingCareerPath,
  isSourcedCareerProfileEligible,
} from "./career-profiles.ts";
import type { SourcedCareerProfile } from "./onet-import.ts";
import {
  buildSourcedProfiles,
  normalizeOnetScore,
  parseOnetInterests,
  renderGeneratedModule,
} from "./onet-import.ts";

const PENDING = ["digital-product", "entrepreneurship", "international-relations"];

// Fixture sintética, só para testes. Nunca é usada em produção.
function fixtureProfile(overrides: Partial<SourcedCareerProfile> = {}): SourcedCareerProfile {
  return {
    pathId: "data",
    sourceKind: "occupational",
    confidence: "high",
    interests: { R: 0.1, I: 0.9, A: 0.2, S: 0.2, E: 0.3, C: 0.7 },
    onetSocCodes: ["00-0000.00"],
    ...overrides,
  };
}

const HEADER =
  "O*NET-SOC Code\tTitle\tElement ID\tElement Name\tScale ID\tData Value\tDate\tDomain Source";
const NAMES = ["Realistic", "Investigative", "Artistic", "Social", "Enterprising", "Conventional"];

function onetRows(code: string, values: number[]): string[] {
  return NAMES.map(
    (name, i) => `${code}\tFake\t1.B.1.${"abcdef"[i]}\t${name}\tOI\t${values[i]}\t07/2024\tAnalyst`,
  );
}

describe("mapeamento de perfis", () => {
  it("cobre os 30 caminhos: 27 mapeados e 3 pendentes, sem sobreposição", () => {
    const mapped = CAREER_PROFILE_MAPPINGS.map((m) => m.pathId);
    const pending = PENDING_CAREER_PATHS.map((p) => p.pathId);
    assert.equal(mapped.length, 27);
    assert.deepEqual([...pending].sort(), [...PENDING].sort());
    assert.equal(new Set([...mapped, ...pending]).size, 30);
    assert.deepEqual([...mapped, ...pending].sort(), CAREER_PATHS.map((path) => path.id).sort());
  });

  it("todo mapeamento cita códigos O*NET-SOC bem formados", () => {
    for (const mapping of CAREER_PROFILE_MAPPINGS) {
      assert.ok(mapping.onetSocCodes.length > 0, mapping.pathId);
      for (const code of mapping.onetSocCodes) assert.match(code, /^\d{2}-\d{4}\.\d{2}$/);
    }
  });
});

describe("dados gerados", () => {
  it("só há perfis se a fonte estiver registrada, e todos são elegíveis", () => {
    if (SOURCED_CAREER_PROFILES.length > 0) assert.ok(ONET_SOURCE);
    for (const profile of SOURCED_CAREER_PROFILES) {
      assert.ok(isSourcedCareerProfileEligible(profile), profile.pathId);
    }
  });

  it("nenhum caminho pendente tem perfil gerado", () => {
    for (const profile of SOURCED_CAREER_PROFILES) {
      assert.ok(!PENDING.includes(profile.pathId), profile.pathId);
    }
  });
});

describe("isSourcedCareerProfileEligible", () => {
  it("aceita um perfil ocupacional válido", () => {
    assert.equal(isSourcedCareerProfileEligible(fixtureProfile()), true);
    assert.equal(isSourcedCareerProfileEligible(fixtureProfile({ confidence: "medium" })), true);
  });

  it("recusa confiança baixa, sem fonte, valores fora de 0–1 ou caminho desconhecido", () => {
    assert.equal(isSourcedCareerProfileEligible(fixtureProfile({ confidence: "low" })), false);
    assert.equal(isSourcedCareerProfileEligible(fixtureProfile({ onetSocCodes: [] })), false);
    assert.equal(
      isSourcedCareerProfileEligible(
        fixtureProfile({ interests: { R: 1.2, I: 0, A: 0, S: 0, E: 0, C: 0 } }),
      ),
      false,
    );
    assert.equal(isSourcedCareerProfileEligible(fixtureProfile({ pathId: "astronauta" })), false);
    assert.equal(
      isSourcedCareerProfileEligible({
        ...fixtureProfile(),
        sourceKind: "synthetic",
      } as unknown as SourcedCareerProfile),
      false,
    );
  });

  it("recusa os três caminhos pendentes mesmo com dados válidos", () => {
    for (const pathId of PENDING) {
      assert.equal(isPendingCareerPath(pathId), true);
      assert.equal(isSourcedCareerProfileEligible(fixtureProfile({ pathId })), false);
    }
  });
});

describe("getSourcedCareerCandidates", () => {
  it("usa a área do catálogo de apresentação e ignora inelegíveis e duplicados", () => {
    const candidates = getSourcedCareerCandidates([
      fixtureProfile(),
      fixtureProfile({ interests: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 } }),
      fixtureProfile({ pathId: "entrepreneurship" }),
      fixtureProfile({ pathId: "nursing", confidence: "low" }),
    ]);
    assert.deepEqual(
      candidates.map((c) => [c.pathId, c.areaId]),
      [["data", "technology"]],
    );
    assert.deepEqual(getSourcedCareerProfilePathIds([fixtureProfile()]), ["data"]);
  });

  it("sem perfis, não há candidatos", () => {
    assert.deepEqual(getSourcedCareerCandidates([]), []);
  });
});

describe("importação O*NET", () => {
  it("normaliza a escala 1–7 com (bruto - 1) / 6", () => {
    assert.equal(normalizeOnetScore(1), 0);
    assert.equal(normalizeOnetScore(7), 1);
    assert.equal(normalizeOnetScore(4), 0.5);
  });

  it("lê só a escala OI e calcula média entre ocupações, arredondando a 4 casas", () => {
    const text = [
      HEADER,
      ...onetRows("11-1111.00", [1, 7, 4, 2, 3, 5]),
      ...onetRows("22-2222.00", [2, 6, 4, 3, 3, 6]),
      "11-1111.00\tFake\t1.B.1.g\tFirst Interest High-Point\tIH\t2.00\t07/2024\tAnalyst",
    ].join("\n");
    const parsed = parseOnetInterests(text);
    assert.equal(parsed.size, 2);
    const [profile] = buildSourcedProfiles(parsed, [
      { pathId: "data", onetSocCodes: ["11-1111.00", "22-2222.00"], confidence: "high" },
    ]);
    // R: (0 + 1/6) / 2 = 0,0833…; I: (1 + 5/6) / 2 = 0,9166…
    assert.deepEqual(profile?.interests, {
      R: 0.0833,
      I: 0.9167,
      A: 0.5,
      S: 0.25,
      E: 0.3333,
      C: 0.75,
    });
    assert.equal(profile?.sourceKind, "occupational");
  });

  it("falha quando um código mapeado não existe no arquivo", () => {
    const parsed = parseOnetInterests(
      [HEADER, ...onetRows("11-1111.00", [1, 1, 1, 1, 1, 1])].join("\n"),
    );
    assert.throws(
      () =>
        buildSourcedProfiles(parsed, [
          { pathId: "data", onetSocCodes: ["99-9999.00"], confidence: "high" },
        ]),
      /99-9999\.00/,
    );
  });

  it("falha com valores fora da escala ou colunas ausentes", () => {
    assert.throws(() =>
      parseOnetInterests([HEADER, ...onetRows("11-1111.00", [9, 1, 1, 1, 1, 1])].join("\n")),
    );
    assert.throws(() => parseOnetInterests("Código\tValor\n"), /Coluna ausente/);
  });

  it("ignora ocupações sem as seis dimensões", () => {
    const rows = onetRows("11-1111.00", [1, 2, 3, 4, 5, 6]).slice(0, 5);
    assert.equal(parseOnetInterests([HEADER, ...rows].join("\n")).size, 0);
  });

  it("o módulo gerado traz a atribuição CC BY 4.0", () => {
    const output = renderGeneratedModule([], {
      database: "O*NET 30.0",
      file: "Interests.txt",
      sha256: "abc",
    });
    assert.match(output, /CC BY 4\.0/);
    assert.match(output, /USDOL\/ETA/);
  });
});
