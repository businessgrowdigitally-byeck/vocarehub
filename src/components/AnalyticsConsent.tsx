import { useEffect, useState } from "react";

import {
  type AnalyticsConsent,
  denyAnalyticsConsent,
  grantAnalyticsConsent,
  isAnalyticsConfigured,
  readConsent,
} from "@/lib/analytics/analytics";

export function AnalyticsConsentBanner() {
  const [consent, setConsent] = useState<AnalyticsConsent>("unset");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setConsent(readConsent());
    setMounted(true);
  }, []);

  if (!mounted || !isAnalyticsConfigured() || consent !== "unset") return null;

  const accept = () => {
    grantAnalyticsConsent();
    setConsent("granted");
  };
  const decline = () => {
    denyAnalyticsConsent();
    setConsent("denied");
  };

  return (
    <div
      role="region"
      aria-label="Preferências de analytics"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-offwhite/10 bg-amazon/95 px-5 py-4 backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-offwhite/75">
          Ajuda a melhorar o VOcare? Usamos analytics anônimo para entender como a jornada é usada.
          Nenhum dado pessoal é coletado.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={decline}
            className="tap rounded-full border border-offwhite/25 px-4 py-2 text-sm text-offwhite/85 transition-colors hover:bg-offwhite/10"
          >
            Agora não
          </button>
          <button
            type="button"
            onClick={accept}
            className="tap rounded-full bg-solar px-5 py-2 text-sm font-display font-bold text-ink"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
