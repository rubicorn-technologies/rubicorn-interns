import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const items = [
  { q: "Is the internship free?", a: "Yes. The internship participation is free. The fee is charged only for industry-focused training and mentorship." },
  { q: "Will I receive a certificate?", a: "Yes. Eligible interns receive internship certificates and training completion certificates." },
  { q: "Is this internship online?", a: "Internships are available in Online, Hybrid, and Offline modes depending on availability." },
  { q: "Will I get a stipend?", a: "Top-performing interns may receive performance-based stipend opportunities after successful completion." },
  { q: "How long does the internship last?", a: "Typically 6 weeks depending on the selected domain." },
  { q: "Do I need prior experience?", a: "No. Beginner-friendly guidance is included." },
  { q: "When will I receive my offer letter?", a: "Within 1 working day after successful verification." },
  { q: "Are projects included?", a: "Yes. Both mini and major capstone projects are included." },
];

export function FAQ() {
  return (
    <section id="faq" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <div className="reveal text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">FAQ</p>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">People also ask</h2>
        </div>

        <div className="reveal glass mt-12 rounded-2xl p-2 md:p-4">
          <Accordion type="single" collapsible className="w-full">
            {items.map((it, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-white/10">
                <AccordionTrigger className="px-4 text-left font-display text-base font-semibold">
                  {it.q}
                </AccordionTrigger>
                <AccordionContent className="px-4 text-muted-foreground">{it.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
