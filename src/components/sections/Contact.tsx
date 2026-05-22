import { Mail, Phone, Linkedin, Instagram, Twitter, Github } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="relative py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 lg:grid-cols-2 lg:px-8">
        <div className="reveal">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Contact</p>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">
            Talk to the Rubicorn team.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Have a question about programs, payments, or partnerships? We respond within one working
            day.
          </p>

          <div className="mt-8 space-y-3">
            <a
              href="mailto:admin@rubicorn.in"
              className="glass hover-lift flex items-center gap-3 rounded-xl p-4 text-sm"
            >
              <Mail className="h-4 w-4 text-primary" /> admin@rubicorn.in
            </a>
            <a
              href="tel:+918978943122"
              className="glass hover-lift flex items-center gap-3 rounded-xl p-4 text-sm"
            >
              <Phone className="h-4 w-4 text-primary" /> +91 89789 43122
            </a>
          </div>

          <div className="mt-6 flex gap-3">
            {[Linkedin, Instagram, Twitter, Github].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="glass hover-lift grid h-10 w-10 place-items-center rounded-lg text-foreground/80"
                aria-label="Social link"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <form
          className="reveal glass rounded-2xl p-6"
          onSubmit={(e) => {
            e.preventDefault();
            window.location.href = "mailto:admin@rubicorn.in";
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none ring-primary/60 focus:ring"
              placeholder="Full name"
              required
            />
            <input
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none ring-primary/60 focus:ring"
              placeholder="Email"
              type="email"
              required
            />
          </div>
          <input
            className="mt-4 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none ring-primary/60 focus:ring"
            placeholder="Subject"
            required
          />
          <textarea
            className="mt-4 min-h-32 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none ring-primary/60 focus:ring"
            placeholder="Your message"
            required
          />
          <button className="mt-5 w-full rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">
            Send message
          </button>
        </form>
      </div>
    </section>
  );
}
