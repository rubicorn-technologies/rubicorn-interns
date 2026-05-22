import { Button } from "@/components/ui/button";
import { BlurOrbs } from "../BlurOrbs";
import { ArrowRight, Sparkles } from "lucide-react";

const domains = [
  "Web Development",
  "Python",
  "AI Engineer",
  "Prompt Engineer",
  "Data Science",
  "Cybersecurity",
];

export function Hero({ onApply }: { onApply: () => void }) {
  return (
    <section id="home" className="relative isolate overflow-hidden pt-32 pb-24 md:pt-44 md:pb-32">
      <div aria-hidden className="absolute inset-0 -z-10 bg-hero" />
      <div aria-hidden className="absolute inset-0 -z-10 grid-overlay opacity-60" />
      <BlurOrbs />

      <div className="relative mx-auto max-w-5xl px-5 text-center lg:px-8">
        <div className="reveal mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-foreground/80 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          AICTE Recognized · MSME Registered · India-wide Cohorts
        </div>

        <h1 className="reveal mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
          Industry-grade internships
          <br />
          built on <span className="text-gradient animated-gradient">real projects</span>.
        </h1>

        <p className="reveal mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          The internship is <span className="text-foreground">free</span>. Pay only for the industry
          training that gets you there — mentorship, capstone projects, certificates, LOR and
          performance-based stipend opportunities.
        </p>

        <div className="reveal mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="group bg-gradient-primary px-7 text-primary-foreground shadow-glow hover:opacity-95"
          >
            <a href="#about">
              About
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </Button>
          <Button asChild size="lg" variant="secondary" className="px-7">
            <a href="#programs">Explore programs →</a>
          </Button>
        </div>

        <div className="reveal mt-14 flex flex-wrap justify-center gap-2.5">
          {domains.map((d) => (
            <span
              key={d}
              className="glass rounded-full px-4 py-1.5 text-xs font-medium text-foreground/80"
            >
              {d}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
