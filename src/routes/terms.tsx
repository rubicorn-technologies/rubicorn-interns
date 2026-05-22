import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms & Conditions — Rubicorn Internships" }] }),
  component: () => (
    <div className="mx-auto max-w-3xl px-5 py-24 lg:px-8">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back home</Link>
      <h1 className="mt-6 font-display text-4xl font-bold">Terms & Conditions</h1>
      <div className="prose prose-invert mt-8 max-w-none text-muted-foreground">
        <p>By applying, you agree to these terms. Internship participation is free; the fee charged is exclusively for industry training and mentorship.</p>
        <h2>Eligibility</h2><p>Open to students and early-career professionals in India.</p>
        <h2>Code of conduct</h2><p>Plagiarism, harassment, or misrepresentation results in immediate removal without refund.</p>
        <h2>Certificates</h2><p>Issued upon successful completion of at least 80% project validation.</p>
        <h2>Limitation of liability</h2><p>Rubicorn is not liable for indirect damages arising from program participation.</p>
      </div>
    </div>
  ),
});
