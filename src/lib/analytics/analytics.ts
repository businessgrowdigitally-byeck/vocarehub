export const ANALYTICS_CONSENT_KEY = "vocare:analytics:v1";
export const GA_MEASUREMENT_ID = "G-FDWLB64HKJ";

export type AnalyticsConsent = "granted" | "denied" | "unset";

export type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

function resolveStorage(storage?: Storage | null): Storage | null {
  if (storage) return storage;
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readConsent(storage?: Storage | null): AnalyticsConsent {
  const store = resolveStorage(storage);
  if (!store) return "unset";
  try {
    const value = store.getItem(ANALYTICS_CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : "unset";
  } catch {
    return "unset";
  }
}

export function writeConsent(consent: "granted" | "denied", storage?: Storage | null): void {
  const store = resolveStorage(storage);
  if (!store) return;
  try {
    store.setItem(ANALYTICS_CONSENT_KEY, consent);
  } catch {
    // Armazenamento indisponível: consentimento permanece apenas em memória.
  }
}

export function clearConsent(storage?: Storage | null): void {
  const store = resolveStorage(storage);
  if (!store) return;
  try {
    store.removeItem(ANALYTICS_CONSENT_KEY);
  } catch {
    // Armazenamento indisponível: nada a remover.
  }
}

export function isAnalyticsConfigured(): boolean {
  return import.meta.env["VITE_ENABLE_ANALYTICS"] === "true";
}

export function isAnalyticsActive(configured: boolean, consent: AnalyticsConsent): boolean {
  return configured && consent === "granted";
}

let loaded = false;

export function loadGoogleAnalytics(id: string = GA_MEASUREMENT_ID): void {
  if (typeof window === "undefined" || loaded) return;
  loaded = true;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", id, { anonymize_ip: true });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);
}

export function initAnalytics(storage?: Storage | null): void {
  if (!isAnalyticsConfigured()) return;
  if (!isAnalyticsActive(true, readConsent(storage))) return;
  loadGoogleAnalytics();
}

export function grantAnalyticsConsent(storage?: Storage | null): void {
  writeConsent("granted", storage);
  initAnalytics(storage);
}

export function denyAnalyticsConsent(storage?: Storage | null): void {
  writeConsent("denied", storage);
}

export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params ?? {});
}
