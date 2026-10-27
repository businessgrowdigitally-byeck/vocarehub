import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/features/about/AboutPage";

const title = "Sobre o VOcare — Ser, Pensar e Fazer";
const description =
  "Conheça a proposta do VOcare: uma jornada gratuita para jovens se conhecerem, explorarem possibilidades e transformarem uma ideia em um primeiro passo.";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: AboutPage,
});
