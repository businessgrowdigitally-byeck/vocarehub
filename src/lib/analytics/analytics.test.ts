import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  ANALYTICS_CONSENT_KEY,
  clearConsent,
  installGtag,
  isAnalyticsActive,
  readConsent,
  resolveAnalyticsEnabled,
  trackEvent,
  writeConsent,
} from "./analytics.ts";

function createMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key: string) => (map.has(key) ? (map.get(key) ?? null) : null),
    key: (index: number) => Array.from(map.keys())[index] ?? null,
    removeItem: (key: string) => {
      map.delete(key);
    },
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
  };
}

describe("consentimento de analytics", () => {
  it("começa como não definido", () => {
    const storage = createMemoryStorage();
    assert.equal(readConsent(storage), "unset");
    assert.equal(readConsent(null), "unset");
  });

  it("registra e recupera a escolha do usuário", () => {
    const storage = createMemoryStorage();
    writeConsent("granted", storage);
    assert.equal(storage.getItem(ANALYTICS_CONSENT_KEY), "granted");
    assert.equal(readConsent(storage), "granted");

    writeConsent("denied", storage);
    assert.equal(readConsent(storage), "denied");
  });

  it("trata valores inválidos como não definido", () => {
    const storage = createMemoryStorage();
    storage.setItem(ANALYTICS_CONSENT_KEY, "talvez");
    assert.equal(readConsent(storage), "unset");
  });

  it("remove o consentimento ao limpar", () => {
    const storage = createMemoryStorage();
    writeConsent("granted", storage);
    clearConsent(storage);
    assert.equal(readConsent(storage), "unset");
  });
});

describe("isAnalyticsActive", () => {
  it("exige configuração e consentimento explícito", () => {
    assert.equal(isAnalyticsActive(false, "granted"), false);
    assert.equal(isAnalyticsActive(true, "unset"), false);
    assert.equal(isAnalyticsActive(true, "denied"), false);
    assert.equal(isAnalyticsActive(true, "granted"), true);
  });
});

describe("trackEvent", () => {
  it("não lança sem ambiente de navegador", () => {
    assert.doesNotThrow(() => trackEvent("journey_started"));
  });
});

describe("resolveAnalyticsEnabled", () => {
  it("liga por padrão em produção e desliga em desenvolvimento", () => {
    assert.equal(resolveAnalyticsEnabled(undefined, true), true);
    assert.equal(resolveAnalyticsEnabled(undefined, false), false);
  });

  it("VITE_ENABLE_ANALYTICS=false desliga em qualquer ambiente", () => {
    assert.equal(resolveAnalyticsEnabled("false", true), false);
    assert.equal(resolveAnalyticsEnabled("false", false), false);
  });

  it("VITE_ENABLE_ANALYTICS=true liga também em desenvolvimento", () => {
    assert.equal(resolveAnalyticsEnabled("true", false), true);
  });

  it("valores desconhecidos seguem o padrão do ambiente", () => {
    assert.equal(resolveAnalyticsEnabled("sim", true), true);
    assert.equal(resolveAnalyticsEnabled("", false), false);
  });
});

describe("installGtag", () => {
  it("empilha comandos como objeto arguments, como o snippet oficial do Google", () => {
    const target: { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void } = {};
    installGtag(target);
    target.gtag?.("config", "G-TESTE", { anonymize_ip: true });
    target.gtag?.("event", "ser_started");
    assert.equal(target.dataLayer?.length, 2);
    for (const entry of target.dataLayer ?? []) {
      // gtag.js ignora arrays comuns; só processa objetos Arguments.
      assert.equal(Object.prototype.toString.call(entry), "[object Arguments]");
      assert.equal(Array.isArray(entry), false);
    }
    assert.deepEqual(Array.from(target.dataLayer?.[1] as ArrayLike<unknown>), [
      "event",
      "ser_started",
    ]);
  });

  it("reaproveita um dataLayer existente", () => {
    const existing: unknown[] = ["antigo"];
    const target: { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void } = {
      dataLayer: existing,
    };
    installGtag(target);
    target.gtag?.("js", new Date());
    assert.equal(target.dataLayer, existing);
    assert.equal(existing.length, 2);
  });
});
