import { createFileRoute } from "@tanstack/react-router";
import { PhasePage } from "@/components/PhasePage";

const title = "Fazer — Olhe para frente | VOcare";
const description =
  "Fase 03 do arco VOcare: qual é o primeiro passo, onde experimentar, por onde começar.";

export const Route = createFileRoute("/fazer")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: () => <PhasePage phase="fazer" />,
});
