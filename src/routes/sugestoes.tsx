import { createFileRoute } from "@tanstack/react-router";
import { FeedbackPage } from "@/features/feedback/FeedbackPage";
import { normalizePage } from "@/lib/feedback/feedback";

const title = "Sugestões — VOcare";
const description = "Mande uma sugestão, um problema ou um elogio para o VOcare. É anônimo.";

export const Route = createFileRoute("/sugestoes")({
  validateSearch: (search: Record<string, unknown>): { de?: string } => {
    const de = normalizePage(search["de"]);
    return de ? { de } : {};
  },
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: SugestoesRoute,
});

function SugestoesRoute() {
  const { de } = Route.useSearch();
  return <FeedbackPage from={de} />;
}
