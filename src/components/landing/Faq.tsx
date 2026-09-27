import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/SectionHeading";

const FAQS = [
  {
    q: "What is Jovia Network?",
    a: "Jovia Network is a Nigerian entertainment monetization platform. Members watch celebrity videos, play fun games, stream music and complete social activities — earning real money in Naira as they participate. It brings entertainment, networking and digital tasks together in one simple dashboard.",
  },
  {
    q: "How much is Jovia registration?",
    a: "Registration is a one-time fee: ₦9,000 for Jovia Silver or ₦15,000 for Jovia Gold. Your plan determines the activities and bonus features you can access, including Friday Bonus Rewards and Jovia AI on the Gold package.",
  },
  {
    q: "Can I watch celebrity videos and play fun games on Jovia?",
    a: "Yes. Both celebrity videos and the fun games arcade are core activities. Each video and game session runs on a countdown — complete the countdown and your reward is credited straight to your Jovia wallet.",
  },
  {
    q: "What is the difference between Silver and Gold?",
    a: "Silver gives you full access to core activities — celebrity videos, fun games, music and meta activities — with a fixed countdown time. Gold includes everything in Silver plus the Friday Bonus Rewards feature, Jovia AI access and adjustable countdown time for extra earning flexibility.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="container scroll-mt-24 py-24">
      <SectionHeading
        eyebrow="FAQ"
        title="Jovia Network questions."
        subtitle="Quick answers before you create your Jovia account."
      />

      <div className="mx-auto max-w-3xl">
        <Accordion type="single" collapsible className="flex flex-col gap-3">
          {FAQS.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent className="leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
