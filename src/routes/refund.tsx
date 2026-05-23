import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/refund")({
  head: () => ({ meta: [{ title: "Refund Policy - Rubicorn Internships" }] }),
  component: () => (
    <div className="mx-auto max-w-3xl px-5 py-24 lg:px-8">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
        Back home
      </Link>
      <h1 className="mt-6 font-display text-4xl font-bold">Refund Policy</h1>
      <div className="prose prose-invert mt-8 max-w-none text-muted-foreground">
        <p>
          This Refund Policy applies to payments made for Rubicorn industry training and related
          internship program services. By making a payment, you acknowledge that the fee is charged
          for training, mentorship, platform access, administrative processing, and related
          services.
        </p>

        <h2>Refund Window</h2>
        <p>
          A refund request may be considered only if it is emailed to contact@rubicorn.in within 7
          calendar days of payment and before the applicant has received substantial access to
          program materials, cohort communication, mentor support, recorded/live sessions,
          assignments, project review, or administrative processing. Once access or processing has
          meaningfully started, fees are generally non-refundable.
        </p>

        <h2>Non-Refundable Cases</h2>
        <p>
          Refunds will not be provided for change of mind, schedule mismatch after enrollment,
          failure to attend, lack of interest, incomplete participation, non-submission of work,
          device/internet issues, college or employer refusal, incorrect details submitted by the
          applicant, violation of conduct rules, plagiarism, misuse, chargeback abuse, or removal
          due to policy breach.
        </p>

        <h2>Duplicate or Failed Payments</h2>
        <p>
          If a duplicate payment is confirmed in our payment records, Rubicorn may refund the extra
          payment after verification. Failed, pending, or bank-side debits are subject to payment
          gateway and bank timelines. Applicants must share payment ID, order ID, date, amount,
          registered email, and proof of debit for investigation.
        </p>

        <h2>Partial Refunds and Deductions</h2>
        <p>
          Where Rubicorn approves a refund at its discretion, gateway charges, taxes, administrative
          costs, used services, discounts, and already-delivered access may be deducted. Approval of
          one refund does not create a right to future refunds.
        </p>

        <h2>Processing Timeline</h2>
        <p>
          Approved refunds are normally initiated to the original payment method within 7 to 10
          working days after verification. Bank, UPI, card network, and payment gateway delays are
          outside Rubicorn's control.
        </p>

        <h2>How to Request</h2>
        <p>
          Email contact@rubicorn.in with your full name, registered email, phone number, selected
          domain, payment ID, order ID, payment date, amount paid, reason for request, and any
          supporting proof. Incomplete requests may be rejected or delayed.
        </p>

        <h2>Final Decision</h2>
        <p>
          Rubicorn reserves the right to approve, reject, or partially approve refund requests after
          reviewing payment status, access logs, communication records, program progress, policy
          compliance, and operational circumstances.
        </p>
      </div>
    </div>
  ),
});
