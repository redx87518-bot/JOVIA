import { motion } from "framer-motion";
import { Activity, Clapperboard, Music, Share2, Zap } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

const FEATURES = [
  {
    num: "01",
    icon: Clapperboard,
    title: "Celebrity Videos",
    description:
      "Explore selected celebrity-video activities with countdown-based interaction.",
    accent: "#FFD700",
    emoji: "🎬",
    reward: "₦10,000 / hour watched",
  },
  {
    num: "02",
    icon: Activity,
    title: "Fun Games",
    description:
      "Jump into supported games and time-based challenges that pay per completed session.",
    accent: "#6B4FA1",
    emoji: "🎮",
    reward: "Up to ₦3,000 / 60 sec",
  },
  {
    num: "03",
    icon: Music,
    title: "Music & Social Activities",
    description:
      "JOVIA is building strategic partnerships with singers, artists, producers, and music creators to bring exciting digital experiences to our growing community.",
    accent: "#2EFF00",
    emoji: "🎧",
    reward: "₦1,500 / listening",
  },
  {
    num: "04",
    icon: Share2,
    title: "Meta Activities",
    description:
      "Participate in supported social activities such as sharing and engaging with content.",
    accent: "#B9A6E8",
    emoji: "🚀",
    reward: "₦1,500 / view · ₦500 / engagement",
  },
];

export function Features() {
  return (
    <section id="features" className="container scroll-mt-24 py-24">
      <SectionHeading
        eyebrow="What you can do"
        title="From videos and gaming to music and social activities, Jovia brings several digital experience."
        subtitle="One account unlocks every activity category — each with its own rewards and countdown mechanics."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {FEATURES.map((f, i) => (
          <motion.article
            key={f.title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.08, duration: 0.55 }}
            className="jovia-card group relative overflow-hidden p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_36px_80px_-30px_rgba(107,79,161,0.5)]"
          >
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
              style={{ background: f.accent }}
            />
            <div className="flex items-start justify-between">
              <span
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
                style={{ background: `${f.accent}1f`, border: `1px solid ${f.accent}45` }}
              >
                {f.emoji}
              </span>
              <span
                className="font-display text-4xl font-extrabold opacity-25"
                style={{ color: f.accent }}
              >
                {f.num}
              </span>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <f.icon className="h-4 w-4" style={{ color: f.accent }} />
              <h3 className="font-display text-lg font-bold text-white">{f.title}</h3>
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-[#B9A6E8]">{f.description}</p>
            <span
              className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold"
              style={{
                background: `${f.accent}14`,
                color: f.accent,
                border: `1px solid ${f.accent}35`,
              }}
            >
              <Zap className="h-3 w-3" />
              {f.reward}
            </span>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
