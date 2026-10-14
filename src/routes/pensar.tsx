import { createFileRoute } from "@tanstack/react-router";

import { PensarJourney } from "@/features/pensar/PensarJourney";

const title = "Pensar — Olhe ao redor | VOcare";
const description =
  "Fase 02 do arco VOcare: explore possibilidades, compare caminhos e escolha três para investigar melhor.";

export const Route = createFileRoute("/pensar")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: PensarJourney,
});
