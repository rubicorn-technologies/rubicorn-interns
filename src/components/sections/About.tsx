import { Award, Users, Shield, Zap } from "lucide-react";

const items = [
  {
    icon: Users,
    title: "Mentor-led cohorts",
    text: "Weekly 1:1 reviews with industry mentors who ship code in production.",
  },
  {
    icon: Zap,
    title: "Real industry projects",
    text: "Build mini + major capstones aligned with what tech teams actually do.",
  },
  {
    icon: Award,
    title: "Certificates + LOR",
    text: "Training certificate, internship certificate and Letter of Recommendation on completion.",
  },
  {
    icon: Shield,
    title: "Recognized & trusted",
    text: "MSME registered · transparent training-based model.",
  },
];

export function About() {
  return (
    <section id="about" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            About Rubicorn Internships
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">
            An internship ecosystem, not a course.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Rubicorn Technologies runs a training-first internship program. The internship
            participation is free — the fee is exclusively for the industry-focused training that
            prepares you for it.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, text }) => (
            <div key={title} className="reveal glass hover-lift rounded-2xl p-6">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
