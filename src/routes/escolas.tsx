import { createFileRoute } from "@tanstack/react-router";

import { EscolasPage } from "@/features/escolas/EscolasPage";

const title = "VOcare para escolas — orientação vocacional gratuita";
const description =
  "Leve o VOcare para a sala de aula: jornada em três fases, sem cadastro e sem coleta de dados pessoais.";

export const Route = createFileRoute("/escolas")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: EscolasPage,
});
