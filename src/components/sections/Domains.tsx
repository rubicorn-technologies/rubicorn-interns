import { Code2, Brain, MessageSquare, Cpu, BarChart3, Shield } from "lucide-react";

const domains = [
  {
    slug: "web-dev",
    name: "Web Development",
    icon: Code2,
    blurb: "React, Node, APIs, deployments.",
  },
  {
    slug: "python",
    name: "Python Development",
    icon: Cpu,
    blurb: "Backend, automation, scripting.",
  },
  {
    slug: "ai-engineer",
    name: "AI Engineer",
    icon: Brain,
    blurb: "LLMs, RAG, vector search, evals.",
  },
  {
    slug: "prompt-engineer",
    name: "Prompt Engineer",
    icon: MessageSquare,
    blurb: "Prompt design, evals, tooling.",
  },
  {
    slug: "data-science",
    name: "Data Science",
    icon: BarChart3,
    blurb: "Pandas, SQL, Power BI, projects.",
  },
  {
    slug: "cybersecurity",
    name: "Cybersecurity",
    icon: Shield,
    blurb: "Kali Linux, network, ethical hacking.",
  },
];

export function Domains({ onApply }: { onApply: (slug?: string) => void }) {
  return (
    <section id="programs" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Programs</p>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">
            Pick your internship domain
          </h2>
          <p className="mt-4 text-muted-foreground">
            Six tracks across the most in-demand skills in 2026. All include mentorship, capstones,
            and certification.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {domains.map(({ slug, name, icon: Icon, blurb }) => (
            <button
              key={slug}
              onClick={() => onApply(slug)}
              className="reveal glass hover-lift group relative overflow-hidden rounded-2xl p-6 text-left"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{blurb}</p>
              <span className="mt-5 inline-flex text-sm font-medium text-primary transition-transform group-hover:translate-x-0.5">
                Apply for this →
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
