import { createFileRoute } from "@tanstack/react-router";
import { PhasePage } from "@/components/PhasePage";

const title = "Pensar — Olhe ao redor | VOcare";
const description =
  "Fase 02 do arco VOcare: quais possibilidades existem, que vida quero construir, o que preciso aprender.";

export const Route = createFileRoute("/pensar")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: () => <PhasePage phase="pensar" />,
});
