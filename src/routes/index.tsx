import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Domains } from "@/components/sections/Domains";
import { Process } from "@/components/sections/Process";
import { Benefits } from "@/components/sections/Benefits";
import { Technologies } from "@/components/sections/Technologies";
import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";
import { ApplyModal } from "@/components/ApplyModal";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Rubicorn Internships — Apply for AI, Web, Data Science internships in India" },
      {
        name: "description",
        content:
          "Internship is free. Pay only for the industry training. MSME-registered. Apply online today.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function Index() {
  const ref = useReveal();
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState<string | undefined>();

  const apply = (slug?: string) => {
    setPreset(slug);
    setOpen(true);
  };

  return (
    <div ref={ref} className="min-h-screen">
      <Navbar onApply={() => apply()} />
      <main>
        <Hero onApply={() => apply()} />
        <About />
        <Domains onApply={apply} />
        <Process />
        <Benefits />
        <Technologies />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <ApplyModal open={open} onOpenChange={setOpen} presetDomain={preset} />
    </div>
  );
}
