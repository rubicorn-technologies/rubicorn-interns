import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2 } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/success")({
  validateSearch: z.object({ id: z.string().optional() }),
  component: Success,
  head: () => ({ meta: [{ title: "Application Successful — Rubicorn Internships" }] }),
});

function Success() {
  const { id } = Route.useSearch();
  useEffect(() => {
    const end = Date.now() + 1500;
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 70, origin: { x: 0 }, colors: ["#1cb5c9", "#0a2540"] });
      confetti({ particleCount: 4, angle: 120, spread: 70, origin: { x: 1 }, colors: ["#1cb5c9", "#0a2540"] });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  return (
    <div className="grid min-h-screen place-items-center px-5">
      <div className="glass-strong shadow-elevated w-full max-w-lg rounded-2xl p-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold">Payment Successful</h1>
        <p className="mt-2 text-muted-foreground">Your application has been submitted successfully.</p>
        {id && (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Your Intern ID</p>
            <p className="mt-1 font-display text-xl font-semibold text-gradient">{id}</p>
          </div>
        )}
        <p className="mt-6 text-sm text-muted-foreground">
          You will receive your Offer Letter within 1 working day at the email you provided.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/" className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium hover:bg-white/5">Back home</Link>
          <a href="mailto:admin@rubicorn.in" className="rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">Contact support</a>
        </div>
      </div>
    </div>
  );
}
