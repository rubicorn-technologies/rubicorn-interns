const steps = [
  {
    n: "01",
    title: "Choose your Internship Domain",
    text: "Pick from 6 specialized tracks designed with industry input.",
  },
  {
    n: "02",
    title: "Complete Registration & Payment",
    text: "Submit your details and complete training payment securely.",
  },
  {
    n: "03",
    title: "Receive Offer Letter in 1 Working Day",
    text: "We verify and issue your offer letter within one working day.",
  },
  {
    n: "04",
    title: "Internship — Online / Hybrid / Offline",
    text: "Flexible modes so you can intern from anywhere in India.",
  },
  {
    n: "05",
    title: "Mini + Major Capstone Projects",
    text: "Ship real projects, not toy tutorials.",
  },
  {
    n: "06",
    title: "80% Project Validation with 1:1 Mentor Review",
    text: "Pass the mentor-led validation milestone.",
  },
  {
    n: "07",
    title: "Receive LOR + Internship Certificate",
    text: "Letter of Recommendation and certificates issued.",
  },
  {
    n: "08",
    title: "Stipend-based opportunities for top performers",
    text: "Top performers may receive stipend-based offers.",
  },
];

export function Process() {
  return (
    <section id="process" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Process</p>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">
            From application to LOR — clearly mapped.
          </h2>
        </div>

        <ol className="relative mt-16 grid gap-6 md:grid-cols-2">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-primary/40 via-white/10 to-transparent md:block"
          />
          {steps.map((s) => (
            <li key={s.n} className="reveal glass hover-lift relative rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-primary font-display text-base font-bold text-primary-foreground shadow-glow">
                  {s.n}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{s.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
