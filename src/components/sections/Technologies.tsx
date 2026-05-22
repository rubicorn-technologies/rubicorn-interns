const tech = ["React", "Python", "Kali Linux", "SQL", "Power BI", "GitHub", "APIs", "AI Tools", "JavaScript", "Linux", "Node.js", "TypeScript"];

export function Technologies() {
  const items = [...tech, ...tech];
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Tech Stack</p>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">Tools we cover</h2>
        </div>
      </div>

      <div className="reveal relative mt-12 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
        <div className="marquee flex w-max gap-4 px-5">
          {items.map((t, i) => (
            <span key={i} className="glass rounded-full px-5 py-2.5 text-sm font-medium text-foreground/90">
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
