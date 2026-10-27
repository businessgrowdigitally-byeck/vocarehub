import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "@/features/privacy/PrivacyPage";

const title = "Política de Privacidade | VOcare";
const description =
  "Como o VOcare trata seus dados: respostas guardadas só no seu aparelho, analytics apenas com consentimento e nenhum dado vendido.";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: PrivacyPage,
});
