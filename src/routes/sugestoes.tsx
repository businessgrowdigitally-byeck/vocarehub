import { createFileRoute } from "@tanstack/react-router";
import { FeedbackPage } from "@/features/feedback/FeedbackPage";

const title = "Sugestões — VOcare";
const description =
  "Mande uma sugestão, um problema ou um elogio para o VOcare pelo Instagram ou por e-mail.";

export const Route = createFileRoute("/sugestoes")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: FeedbackPage,
});
