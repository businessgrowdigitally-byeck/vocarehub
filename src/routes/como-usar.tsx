import { createFileRoute } from "@tanstack/react-router";
import { GuidePage } from "@/features/guide/GuidePage";

const title = "Como usar o VOcare — passo a passo";
const description =
  "Guia visual para usar o VOcare no celular: responda o SER, explore caminhos no PENSAR, escolha uma missão no FAZER e baixe seu Passaporte.";

export const Route = createFileRoute("/como-usar")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: GuidePage,
});
