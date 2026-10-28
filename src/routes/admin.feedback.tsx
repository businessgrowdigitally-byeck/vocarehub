import { createFileRoute } from "@tanstack/react-router";
import { AdminFeedbackPage } from "@/features/feedback/AdminFeedbackPage";

export const Route = createFileRoute("/admin/feedback")({
  head: () => ({
    meta: [
      { title: "Admin · Feedback — VOcare" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminFeedbackPage,
});
