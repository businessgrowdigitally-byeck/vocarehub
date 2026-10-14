import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  CURATED_BOOKS,
  LEARNING_RESOURCE_IDS,
  LIBRARY_RESOURCES,
  getLibraryResource,
} from "../../data/library-resources.ts";
import {
  OPPORTUNITY_CATEGORIES,
  OPPORTUNITY_SOURCES,
  getOpportunitySourcesByCategory,
} from "../../data/opportunity-sources.ts";

const here = dirname(fileURLToPath(import.meta.url));
const readSource = (relative: string) => readFileSync(resolve(here, relative), "utf8");

const FORBIDDEN = [
  /aberto agora/,
  /(?<!existam )vagas? abertas?/,
  /inscri[çc][õo]es abertas/,
  /prazo final/,
  /sal[aá]rio/,
  /deadline/,
  /garant(id[oa]|imos)/,
];

function expectNoTemporalText(label: string, parts: (string | undefined)[]) {
  const text = parts.filter(Boolean).join(" ").toLowerCase();
  for (const pattern of FORBIDDEN) {
    assert.equal(pattern.test(text), false, `${label} contém termo proibido: ${pattern}`);
  }
}

describe("biblioteca — dados", () => {
  it("tem 9 livros curados com ids únicos", () => {
    assert.equal(CURATED_BOOKS.length, 9);
    const ids = new Set(CURATED_BOOKS.map((book) => book.id));
    assert.equal(ids.size, CURATED_BOOKS.length);
  });

  it("tem 12 recursos com ids únicos e categorias válidas", () => {
    assert.equal(LIBRARY_RESOURCES.length, 12);
    const ids = new Set(LIBRARY_RESOURCES.map((resource) => resource.id));
    assert.equal(ids.size, LIBRARY_RESOURCES.length);
    const categories = new Set(["free-reading", "learning", "careers"]);
    for (const resource of LIBRARY_RESOURCES) {
      assert.ok(categories.has(resource.category), `categoria inválida: ${resource.category}`);
    }
  });

  it("usa apenas links https e tags não vazias", () => {
    for (const item of [...CURATED_BOOKS, ...LIBRARY_RESOURCES]) {
      assert.match(item.href, /^https:\/\//, `${item.id} não é https`);
      assert.ok(item.tags.length > 0, `${item.id} sem tags`);
    }
  });

  it("não guarda informação temporal nem promessa de resultado", () => {
    for (const book of CURATED_BOOKS) {
      expectNoTemporalText(book.id, [book.title, book.description, book.whyHere]);
    }
    for (const resource of LIBRARY_RESOURCES) {
      expectNoTemporalText(resource.id, [resource.title, resource.description, resource.note]);
    }
  });

  it("LEARNING_RESOURCE_IDS apontam para recursos de aprendizagem existentes", () => {
    for (const id of LEARNING_RESOURCE_IDS) {
      const resource = getLibraryResource(id);
      assert.ok(resource, `recurso ausente: ${id}`);
      assert.equal(resource.category, "learning");
    }
  });

  it("getLibraryResource devolve undefined para id desconhecido", () => {
    assert.equal(getLibraryResource("nao-existe"), undefined);
  });
});

describe("oportunidades — dados", () => {
  it("reúne 12 fontes curadas + 4 recursos de aprendizagem reutilizados", () => {
    const reused = new Set<string>(LEARNING_RESOURCE_IDS);
    const authored = OPPORTUNITY_SOURCES.filter((source) => !reused.has(source.id));
    assert.equal(authored.length, 12);
    assert.equal(OPPORTUNITY_SOURCES.length, 16);
    const ids = new Set(OPPORTUNITY_SOURCES.map((source) => source.id));
    assert.equal(ids.size, OPPORTUNITY_SOURCES.length);
  });

  it("categorias e tipos de fonte são válidos", () => {
    const allowedCategories = new Set<string>(OPPORTUNITY_CATEGORIES);
    for (const source of OPPORTUNITY_SOURCES) {
      assert.ok(allowedCategories.has(source.category), `categoria inválida: ${source.category}`);
      assert.ok(
        source.sourceType === "official" || source.sourceType === "institutional",
        `tipo inválido: ${source.sourceType}`,
      );
      assert.match(source.href, /^https:\/\//, `${source.id} não é https`);
      assert.ok(source.tags.length > 0, `${source.id} sem tags`);
    }
  });

  it("reutiliza os recursos de aprendizagem com a categoria learning", () => {
    const learning = getOpportunitySourcesByCategory("learning");
    assert.equal(learning.length, 5);
    for (const id of LEARNING_RESOURCE_IDS) {
      const source = learning.find((item) => item.id === id);
      assert.ok(source, `recurso reutilizado ausente: ${id}`);
      assert.equal(source.category, "learning");
    }
  });

  it("não guarda informação temporal nem promessa de resultado", () => {
    for (const source of OPPORTUNITY_SOURCES) {
      expectNoTemporalText(source.id, [source.title, source.description, source.note]);
    }
  });
});

describe("migração — Notion e Altus fora da experiência pública", () => {
  it("a biblioteca não referencia o Notion", () => {
    const source = readSource("../../routes/biblioteca.tsx");
    assert.equal(/NotionEmbed/.test(source), false);
    assert.equal(/NOTION/.test(source), false);
  });

  it("as oportunidades não referenciam o Notion", () => {
    const source = readSource("../../routes/oportunidades.tsx");
    assert.equal(/NotionEmbed/.test(source), false);
    assert.equal(/NOTION/.test(source), false);
  });

  it("a home não expõe o Altus", () => {
    const source = readSource("../../routes/index.tsx");
    assert.equal(/AltusBlock/.test(source), false);
    assert.equal(/EDUCACIONALXBGD/.test(source), false);
    assert.equal(/ALTUS_/.test(source), false);
  });

  it("o componente de link externo usa atributos seguros e indicação textual", () => {
    const source = readSource("./ExternalLink.tsx");
    assert.ok(source.includes('target="_blank"'));
    assert.ok(source.includes('rel="noopener noreferrer"'));
    assert.ok(source.includes("abre em nova aba"));
  });

  it("a estante de livros usa o componente de link externo seguro", () => {
    const source = readSource("../../routes/biblioteca.tsx");
    assert.ok(source.includes("ExternalLink"));
  });
});
