import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/payments")({
  head: () => ({ meta: [{ title: "Payments — Rubicorn Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <div>
      <h1 className="font-display text-3xl font-bold">Payments</h1>
      <p className="mt-2 text-sm text-muted-foreground">Razorpay payments appear in the Applicants table under the Status column. A dedicated reconciliation view is coming soon.</p>
    </div>
  ),
});
