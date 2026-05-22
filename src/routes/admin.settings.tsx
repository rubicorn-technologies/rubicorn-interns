import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Rubicorn Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <div>
      <h1 className="font-display text-3xl font-bold">Settings</h1>
      <p className="mt-2 text-sm text-muted-foreground">Domain pricing and admin configuration. Toggle Razorpay test/live keys in Cloud → Secrets.</p>
    </div>
  ),
});
