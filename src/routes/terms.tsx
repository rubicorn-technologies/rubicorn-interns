import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms & Conditions - Rubicorn Internships" }] }),
  component: () => (
    <div className="mx-auto max-w-3xl px-5 py-24 lg:px-8">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
        Back home
      </Link>
      <h1 className="mt-6 font-display text-4xl font-bold">Terms & Conditions</h1>
      <div className="prose prose-invert mt-8 max-w-none text-muted-foreground">
        <p>
          These Terms & Conditions govern your access to and participation in Rubicorn Technologies
          Pvt. Ltd. internship and industry training programs. By applying, registering, paying,
          attending, submitting work, or using this website, you agree to be bound by these terms.
        </p>

        <h2>Nature of Program</h2>
        <p>
          Rubicorn offers training-led internship programs designed for learning, mentorship,
          project exposure, and skill development. Internship participation may be provided along
          with the training program, but the fee charged is for training, mentorship, platform
          access, administrative processing, and related services. Unless separately confirmed in
          writing, no stipend, employment, job placement, government recognition, academic credit,
          or guaranteed outcome is promised.
        </p>

        <h2>Eligibility and Accuracy</h2>
        <p>
          You must provide accurate, complete, and current information. Rubicorn may reject,
          suspend, withhold certificates, or terminate access if information is false, incomplete,
          misleading, unverifiable, or violates any policy. The applicant is responsible for
          ensuring that participation does not conflict with college, employer, guardian, or legal
          obligations.
        </p>

        <h2>Fees and Payment</h2>
        <p>
          Fees are displayed before payment and may vary by domain, cohort, offer, mode, or time.
          Taxes, gateway charges, bank charges, and third-party fees may apply where applicable.
          Access may be denied, paused, or cancelled if payment is incomplete, reversed, disputed,
          fraudulent, or not traceable to the applicant.
        </p>

        <h2>Conduct and Removal</h2>
        <p>
          Participants must behave professionally and must not harass others, misuse resources,
          spam, plagiarize, submit copied work, share paid access, attack systems, attempt
          unauthorized access, abuse mentors, damage Rubicorn's reputation, or violate law. Rubicorn
          may remove any participant without refund for misconduct, fraud, policy breach, chargeback
          abuse, or security risk.
        </p>

        <h2>Content, Projects, and Intellectual Property</h2>
        <p>
          Rubicorn materials, recordings, assignments, templates, designs, processes, brand assets,
          and platform content remain the property of Rubicorn or its licensors. You may not copy,
          resell, publish, redistribute, record, scrape, or commercially exploit program material
          without written permission. You remain responsible for any content you submit and grant
          Rubicorn permission to review, store, assess, and use submitted work for program
          administration, quality review, verification, and showcase purposes unless you request
          otherwise in writing.
        </p>

        <h2>Certificates and Completion</h2>
        <p>
          Certificates, internship IDs, letters, or completion records may be issued only after
          Rubicorn determines that the participant has met completion requirements, conduct
          standards, payment requirements, attendance expectations, project validation, and identity
          checks. Rubicorn may correct, revoke, delay, or refuse certificates in cases of error,
          misconduct, non-completion, plagiarism, payment dispute, or policy violation.
        </p>

        <h2>Availability and Changes</h2>
        <p>
          Rubicorn may modify curriculum, mentors, schedules, batch dates, mode, tools, prices,
          features, policies, or program structure at any time for operational, technical, business,
          legal, or quality reasons. We may reschedule sessions or provide alternatives when needed.
          Temporary interruptions do not automatically create a refund right.
        </p>

        <h2>Disclaimers</h2>
        <p>
          Services are provided on an "as available" basis. Rubicorn does not guarantee employment,
          income, interview selection, academic approval, uninterrupted service, specific learning
          results, third-party platform availability, or acceptance of certificates by any external
          institution or employer.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Rubicorn will not be liable for indirect,
          incidental, special, punitive, consequential, or business losses, including loss of data,
          opportunity, profit, goodwill, academic benefit, job opportunity, or third-party access.
          Rubicorn's aggregate liability for any claim will not exceed the amount actually paid by
          the applicant for the disputed program.
        </p>

        <h2>Governing Terms</h2>
        <p>
          Rubicorn may update these terms from time to time. Continued use or participation after
          changes means you accept the updated terms. Any dispute must first be raised by emailing
          admin@rubicorn.in with full details and payment reference.
        </p>
      </div>
    </div>
  ),
});
