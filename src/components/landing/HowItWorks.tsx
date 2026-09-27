import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Banknote, Rocket, UserPlus, Wallet } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    num: "01",
    icon: UserPlus,
    title: "Create your account",
    description:
      "Sign up with your email in under a minute and pick the membership level you want.",
    accent: "#FFD700",
  },
  {
    num: "02",
    icon: Rocket,
    title: "Activate your plan",
    description:
      "Complete the one-time registration — ₦9,000 for Silver or ₦15,000 for Gold — through the JOVIA payment flow.",
    accent: "#6B4FA1",
  },
  {
    num: "03",
    icon: Wallet,
    title: "Pick an activity",
    description:
      "Open the app and choose from celebrity videos, fun games, music listening and social tasks.",
    accent: "#2EFF00",
  },
  {
    num: "04",
    icon: Banknote,
    title: "Earn and withdraw",
    description:
      "Finish each countdown to credit rewards to your wallet, then withdraw straight to your Nigerian bank account.",
    accent: "#B9A6E8",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="container scroll-mt-24 py-24">
      <SectionHeading
        eyebrow="How it works"
        title="From sign-up to withdrawal in four simple steps."
        subtitle="Jovia is built around your time — start earning through a clear, simple flow."
      />

      <div className="relative">
        {/* Connector line (desktop) */}
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-[#FFD700]/50 via-[#6B4FA1]/50 to-[#B9A6E8]/50 lg:block"
        />

        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <motion.li
              key={step.num}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.55 }}
              className="jovia-card group relative flex flex-col p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_36px_80px_-30px_rgba(107,79,161,0.5)]"
            >
              <div className="flex items-center justify-between">
                <span
                  className="relative z-10 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl text-2xl"
                  style={{
                    background: `linear-gradient(150deg, ${step.accent}26, ${step.accent}0d)`,
                    border: `1px solid ${step.accent}55`,
                    color: step.accent,
                  }}
                >
                  <step.icon className="h-8 w-8" />
                </span>
                <span
                  aria-hidden="true"
                  className="font-display text-5xl font-extrabold opacity-15"
                  style={{ color: step.accent }}
                >
                  {step.num}
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#B9A6E8]">
                {step.description}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55 }}
        className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
      >
        <Link to="/auth?mode=signup">
          <Button size="lg" className="gap-2">
            Start step one — create account <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <a href="#packages">
          <Button variant="secondary" size="lg">
            Compare Silver and Gold
          </Button>
        </a>
      </motion.div>
    </section>
  );
}
