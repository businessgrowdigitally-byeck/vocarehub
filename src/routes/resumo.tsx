import { createFileRoute } from "@tanstack/react-router";

import { JourneySummary } from "@/features/journey-summary/JourneySummary";

const title = "Passaporte da jornada | VOcare";
const description =
  "Resumo da jornada VOcare: seu mapa do SER, seus 3 caminhos e o seu primeiro passo.";

export const Route = createFileRoute("/resumo")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: JourneySummary,
});
