import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/refund")({
  head: () => ({ meta: [{ title: "Refund Policy — Rubicorn Internships" }] }),
  component: () => (
    <div className="mx-auto max-w-3xl px-5 py-24 lg:px-8">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back home</Link>
      <h1 className="mt-6 font-display text-4xl font-bold">Refund Policy</h1>
      <div className="prose prose-invert mt-8 max-w-none text-muted-foreground">
        <p>Training fees are refundable within 7 days of payment if the cohort has not commenced. Once the program starts, fees are non-refundable.</p>
        <p>To request a refund, email admin@rubicorn.in with your order ID and reason. Approved refunds are processed to the original payment method within 7–10 working days.</p>
      </div>
    </div>
  ),
});
