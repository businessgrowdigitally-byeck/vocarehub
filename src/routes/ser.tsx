import { createFileRoute } from "@tanstack/react-router";

import { SerJourney } from "@/features/ser/SerJourney";

const title = "SER — Olhe para dentro | VOcare";
const description =
  "Fase 01 do arco VOcare: quem sou, o que gosto, o que valorizo. Autoconhecimento para jovens de 15 a 18 anos.";

export const Route = createFileRoute("/ser")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: SerJourney,
});
