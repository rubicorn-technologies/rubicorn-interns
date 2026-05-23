import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy - Rubicorn Internships" }] }),
  component: () => (
    <div className="mx-auto max-w-3xl px-5 py-24 lg:px-8">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
        Back home
      </Link>
      <h1 className="mt-6 font-display text-4xl font-bold">Privacy Policy</h1>
      <div className="prose prose-invert mt-8 max-w-none text-muted-foreground">
        <p>
          This Privacy Policy explains how Rubicorn Technologies Pvt. Ltd. collects, uses, stores,
          protects, and discloses information submitted through the Rubicorn internship and industry
          training platform. By using this website, submitting an application, making a payment, or
          communicating with us, you consent to this policy.
        </p>

        <h2>Information We Collect</h2>
        <p>
          We may collect your name, email address, phone number, college or institution details,
          degree, year of study, selected domain, preferred mode, resume, portfolio links, GitHub or
          LinkedIn links, motivation statements, payment status, transaction identifiers, technical
          logs, device/browser information, and any other information you voluntarily provide.
        </p>

        <h2>Purpose of Use</h2>
        <p>
          We use collected information to verify and process applications, provide training access,
          communicate updates, issue program records, generate certificates or internship IDs,
          process payments, prevent misuse, maintain internal audit trails, resolve disputes,
          improve services, and comply with legal, tax, accounting, security, and operational
          requirements.
        </p>

        <h2>Payments</h2>
        <p>
          Payments are processed through third-party payment partners such as Razorpay. We do not
          store full card, UPI, or banking credentials on our servers. Payment partners may process
          your payment information under their own policies, terms, and security standards.
        </p>

        <h2>Data Sharing</h2>
        <p>
          We may share limited information with service providers, payment processors, hosting
          providers, communication tools, mentors, auditors, legal advisors, government authorities,
          or regulators where required for program delivery, dispute handling, fraud prevention,
          compliance, or business operations. We do not sell personal information as a standalone
          product.
        </p>

        <h2>Retention</h2>
        <p>
          We may retain application, payment, attendance, certificate, and communication records for
          as long as reasonably required for business, legal, audit, tax, fraud-prevention,
          certification, and dispute-resolution purposes. Deletion requests may be declined or
          delayed where retention is necessary to protect our rights, comply with law, or maintain
          accurate transaction records.
        </p>

        <h2>Security</h2>
        <p>
          We use reasonable technical and organizational safeguards including access control,
          private storage, encrypted connections, and restricted administrative access. No online
          system is completely risk-free, and Rubicorn is not responsible for unauthorized access
          caused by user-side compromise, weak passwords, third-party failures, or events outside
          our reasonable control.
        </p>

        <h2>User Responsibilities</h2>
        <p>
          You are responsible for submitting accurate information and ensuring that any resume,
          links, documents, or statements provided by you are lawful, truthful, and owned or
          authorized by you. Rubicorn may reject, suspend, or remove applications that appear
          fraudulent, misleading, abusive, or harmful.
        </p>

        <h2>Your Requests</h2>
        <p>
          You may request access, correction, or deletion of your information by emailing
          contact@rubicorn.in. We may verify your identity before acting on a request and may preserve
          records where legally or operationally necessary.
        </p>

        <h2>Policy Updates</h2>
        <p>
          Rubicorn may update this Privacy Policy at any time. Continued use of the platform after
          an update means you accept the revised policy.
        </p>
      </div>
    </div>
  ),
});
