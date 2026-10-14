import { createFileRoute } from "@tanstack/react-router";

import { FazerJourney } from "@/features/fazer/FazerJourney";

const title = "Fazer — Olhe para frente | VOcare";
const description =
  "Fase 03 do arco VOcare: escolha um caminho, defina uma missão e marque seu primeiro passo.";

export const Route = createFileRoute("/fazer")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: FazerJourney,
});
