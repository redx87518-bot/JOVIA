import { motion } from "framer-motion";
import { BadgeCheck, TrendingUp, Users, Wallet } from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";

interface StatsProps {
  registeredUsers: number;
  rewarded: number;
  paidOutKobo: number;
}

function compact(n: number): { value: number; suffix: string; decimals: number } {
  if (n >= 1_000_000) return { value: n / 1_000_000, suffix: "M+", decimals: 1 };
  if (n >= 1_000) return { value: n / 1_000, suffix: "K+", decimals: 0 };
  return { value: n, suffix: "", decimals: 0 };
}

export function Stats({ registeredUsers, rewarded, paidOutKobo }: StatsProps) {
  const paid = compact(paidOutKobo / 100);

  const cards = [
    {
      icon: Users,
      label: "Registered Users",
      format: compact(registeredUsers), // 200,000 -> "200K+"
      accent: "#FFD700",
    },
    {
      icon: BadgeCheck,
      label: "Rewarded",
      format: compact(rewarded),
      accent: "#2EFF00",
    },
    {
      icon: Wallet,
      label: "Paid Out",
      format: paid,
      accent: "#B9A6E8",
      prefix: "₦",
    },
  ];

  return (
    <section className="container relative z-10 -mt-6 pb-24">
      <div className="grid gap-5 sm:grid-cols-3">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.1, duration: 0.55 }}
            whileHover={{ y: -4 }}
            className="jovia-card group flex items-center gap-5 p-6 transition-shadow duration-300 hover:shadow-[0_36px_80px_-30px_rgba(107,79,161,0.55)]"
          >
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
              style={{
                backgroundColor: `${card.accent}1f`,
                color: card.accent,
                border: `1px solid ${card.accent}40`,
              }}
            >
              <card.icon className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-3xl font-bold text-white">
                <AnimatedCounter
                  to={card.format.value}
                  decimals={card.format.decimals}
                  prefix={card.prefix ?? ""}
                  suffix={card.format.suffix}
                />
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-[#B9A6E8]">
                {card.label}
                <TrendingUp
                  className="h-3 w-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ color: card.accent }}
                />
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
