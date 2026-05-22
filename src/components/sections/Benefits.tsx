import { Briefcase, Users, GraduationCap, FileBadge, FileCheck, FileSignature, Wallet, ShieldCheck, BadgeCheck } from "lucide-react";

const benefits = [
  { icon: Briefcase, title: "Real Industry Projects" },
  { icon: Users, title: "Mentor Support" },
  { icon: GraduationCap, title: "Internship Experience" },
  { icon: FileBadge, title: "Training Certificate" },
  { icon: FileCheck, title: "Internship Certificate" },
  { icon: FileSignature, title: "Letter of Recommendation" },
  { icon: Wallet, title: "Performance-Based Stipend" },
  { icon: ShieldCheck, title: "AICTE Recognition" },
  { icon: BadgeCheck, title: "MSME Registered" },
];

export function Benefits() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Benefits</p>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">Everything you get</h2>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ icon: Icon, title }) => (
            <div key={title} className="reveal glass hover-lift flex items-center gap-4 rounded-2xl p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <Icon className="h-5 w-5" />
              </span>
              <p className="font-display text-base font-semibold">{title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
