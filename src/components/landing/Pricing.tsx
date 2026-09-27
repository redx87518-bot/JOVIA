import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BadgeCheck, Check, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

interface Plan {
  id: "silver" | "gold";
  label: string;
  price: string;
  period: string;
  tagline: string;
  audience: string;
  popular?: boolean;
  features: { label: string; included: boolean }[];
}

const PLANS: Plan[] = [
  {
    id: "silver",
    label: "Jovia Silver",
    price: "₦9,000",
    period: "registration fee",
    tagline: "Everything you need to start earning.",
    audience: "Perfect for first-time members exploring every activity.",
    features: [
      { label: "Access to core Jovia activities", included: true },
      { label: "Celebrity-video activity access", included: true },
      { label: "Fun games and music activities", included: true },
      { label: "Meta activity participation", included: true },
      { label: "Fixed countdown time", included: false },
    ],
  },
  {
    id: "gold",
    label: "Jovia Gold",
    price: "₦15,000",
    period: "registration fee",
    tagline: "Maximum flexibility and premium rewards.",
    audience: "For active earners who want bonuses, AI tools and flexibility.",
    popular: true,
    features: [
      { label: "Access to core Jovia activities", included: true },
      { label: "Celebrity-video, games & music activities", included: true },
      { label: "Friday Bonus Rewards feature", included: true },
      { label: "Jovia AI access (indicated in materials)", included: true },
      { label: "Adjustable countdown time", included: false },
    ],
  },
];

export function Pricing() {
  return (
    <section id="packages" className="relative scroll-mt-24 py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6B4FA1]/15 blur-[130px]"
      />
      <div className="container relative">
        <SectionHeading
          eyebrow="Membership"
          title="Register Jovia: Choose the Jovia Network package that fits you."
          subtitle="One registration fee unlocks your dashboard, wallet and every activity in your plan."
        />

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className={cn(
                "relative rounded-3xl p-[1px]",
                plan.popular
                  ? "bg-gradient-to-b from-[#FFD700]/70 via-[#FFD700]/25 to-transparent glow-gold"
                  : "bg-gradient-to-b from-[#6B4FA1]/50 via-[#6B4FA1]/20 to-transparent"
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 right-6 rounded-full bg-[#FFD700] px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#16032f] shadow-lg">
                  Most Popular
                </span>
              )}
              <div
                className={cn(
                  "flex h-full flex-col rounded-[calc(1.5rem-1px)] p-7",
                  plan.popular
                    ? "bg-[#1c0b38]/92 backdrop-blur-xl"
                    : "bg-[#16032f]/85 backdrop-blur-xl"
                )}
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-lg font-bold text-white">{plan.label}</h3>
                  {plan.popular && (
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFD700]">
                      Premium
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-end gap-2">
                  <span
                    className={cn(
                      "font-display text-4xl font-extrabold",
                      plan.popular ? "text-gradient-gold" : "text-white"
                    )}
                  >
                    {plan.price}
                  </span>
                  <span className="pb-1.5 text-xs text-[#8f80b8]">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-[#B9A6E8]">{plan.tagline}</p>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#8f80b8]">
                  <Users className="h-3.5 w-3.5" style={{ color: plan.popular ? "#FFD700" : "#6B4FA1" }} />
                  {plan.audience}
                </p>

                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {plan.features.map((f) => (
                    <li key={f.label} className="flex items-start gap-2.5 text-sm">
                      {f.included ? (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2EFF00]" />
                      ) : (
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-[#8f80b8]/70" />
                      )}
                      <span className={f.included ? "text-[#E9E3F9]" : "text-[#8f80b8]"}>
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link to={`/auth?mode=signup&plan=${plan.id}`} className="mt-8 block">
                  <Button
                    size="lg"
                    className="w-full"
                    variant={plan.popular ? "default" : "secondary"}
                  >
                    Choose {plan.id === "gold" ? "Gold" : "Silver"}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {["One-time payment", "No monthly charges", "Withdraw to any Nigerian bank"].map(
            (item) => (
              <span
                key={item}
                className="flex items-center gap-1.5 text-xs font-medium text-[#B9A6E8]"
              >
                <BadgeCheck className="h-3.5 w-3.5 text-[#2EFF00]" />
                {item}
              </span>
            )
          )}
        </div>

        <p className="mt-4 text-center text-xs text-[#8f80b8]">
          Registration is a one-time fee. Activate once — earn every day.
        </p>
      </div>
    </section>
  );
}
