import { createFileRoute, Link } from "@tanstack/react-router";

function LegalPage({ title, body }: { title: string; body: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24 lg:px-8">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back home</Link>
      <h1 className="mt-6 font-display text-4xl font-bold">{title}</h1>
      <div className="prose prose-invert mt-8 max-w-none text-muted-foreground">{body}</div>
    </div>
  );
}

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — Rubicorn Internships" }] }),
  component: () => (
    <LegalPage
      title="Privacy Policy"
      body={
        <>
          <p>Rubicorn Technologies Pvt. Ltd. ("we", "us") respects your privacy. This policy explains what personal data we collect when you apply to our internship program and how we use it.</p>
          <h2>Data we collect</h2>
          <p>Name, email, phone, college details, resume, links, and payment information processed via Razorpay.</p>
          <h2>How we use it</h2>
          <p>To process your application, issue offer letters & certificates, send program updates, and provide customer support.</p>
          <h2>Storage & security</h2>
          <p>Data is stored on secured cloud infrastructure with industry-standard encryption in transit and at rest.</p>
          <h2>Your rights</h2>
          <p>Email admin@rubicorn.in to access, correct, or delete your data.</p>
        </>
      }
    />
  ),
});
