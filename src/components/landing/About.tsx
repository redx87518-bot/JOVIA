import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowDown, CheckCircle2, Eye, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { ActivityImage } from "@/components/ActivityImage";

const HIGHLIGHTS = [
  {
    title: "User-focused design",
    description: "Clear activity flows and easy-to-understand options.",
    emoji: "🧭",
    image: "/images/hero-cac.jpg",
  },
  {
    title: "Multiple activity categories",
    description: "Video, games, music, social activities and more.",
    emoji: "🗂️",
    image: "/images/hero-meta.jpg",
  },
  {
    title: "Two membership levels",
    description: "Choose Silver or Gold based on the access level you want.",
    emoji: "🏅",
    image: "/images/hero-music.jpg",
  },
];

const VALUES = [
  {
    icon: HeartHandshake,
    title: "Empowerment",
    description: "Your time and attention have value — Jovia turns them into real rewards.",
    accent: "#FFD700",
  },
  {
    icon: ShieldCheck,
    title: "Transparency",
    description: "Clear rules, visible rewards and a CAC-registered business behind every payout.",
    accent: "#2EFF00",
  },
  {
    icon: Sparkles,
    title: "Entertainment first",
    description: "Celebrity videos, games and music you'd enjoy even without the earning.",
    accent: "#6B4FA1",
  },
  {
    icon: Eye,
    title: "Community",
    description: "Built with Nigerian creators, artists and players — for the network that grows together.",
    accent: "#B9A6E8",
  },
];

export function About() {
  return (
    <section id="about" className="container py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65 }}
        >
          <SectionHeading
            align="left"
            eyebrow="About Jovia"
            title="Discover the Jovia Network experience."
            subtitle="Jovia Network presents a mix of entertainment, networking and digital activities in an interface designed to make participation simple and engaging."
          />
          <Link
            to="/#packages"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#FFD700] transition-colors hover:text-[#FFE566]"
          >
            See package differences <ArrowDown className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="flex flex-col gap-4">
          {HIGHLIGHTS.map((h, i) => (
            <motion.div
              key={h.title}
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.55 }}
              className="jovia-card flex items-start gap-4 p-5"
            >
              <ActivityImage
                src={h.image}
                emoji={h.emoji}
                alt={h.title}
                className="h-11 w-11 shrink-0 rounded-2xl ring-1 ring-[#2EFF00]/30"
              />
              <div>
                <p className="flex items-center gap-2 font-display text-base font-bold text-white">
                  <CheckCircle2 className="h-4 w-4 text-[#2EFF00]" />
                  {h.title}
                </p>
                <p className="mt-1 text-sm text-[#B9A6E8]">{h.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="mt-16 grid gap-5 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-3xl border border-[#FFD700]/35 bg-gradient-to-br from-[#2D1B4E]/90 to-[#16032f]/90 p-7"
        >
          <span
            aria-hidden="true"
            className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#FFD700]/12 blur-3xl"
          />
          <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFD700]/12 ring-1 ring-[#FFD700]/40">
            <Sparkles className="h-5 w-5 text-[#FFD700]" />
          </span>
          <h3 className="relative mt-4 text-[11px] font-bold uppercase tracking-[0.24em] text-[#FFD700]">
            Our Mission
          </h3>
          <p className="relative mt-2.5 text-base leading-relaxed text-[#E9E3F9]">
            To reward people's everyday time and attention — turning the videos they watch,
            the games they play and the communities they engage with into real, withdrawable
            income across Nigeria.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.1, duration: 0.55 }}
          className="relative overflow-hidden rounded-3xl border border-[#6B4FA1]/40 bg-gradient-to-br from-[#1c0b38]/90 to-[#16032f]/90 p-7"
        >
          <span
            aria-hidden="true"
            className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-[#6B4FA1]/25 blur-3xl"
          />
          <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6B4FA1]/20 ring-1 ring-[#6B4FA1]/50">
            <Eye className="h-5 w-5 text-[#B9A6E8]" />
          </span>
          <h3 className="relative mt-4 text-[11px] font-bold uppercase tracking-[0.24em] text-[#B9A6E8]">
            Our Vision
          </h3>
          <p className="relative mt-2.5 text-base leading-relaxed text-[#E9E3F9]">
            To become Africa's most trusted entertainment monetization network — where
            creators earn alongside their audiences, and every member shares in the value
            they help create.
          </p>
        </motion.div>
      </div>

      {/* Core values */}
      <div className="mt-12">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center font-display text-2xl font-bold text-white"
        >
          What we stand for
        </motion.h3>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="jovia-card group flex flex-col p-5 transition-all duration-300 hover:-translate-y-1"
            >
              <span
                className="flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{
                  background: `${v.accent}14`,
                  border: `1px solid ${v.accent}40`,
                  color: v.accent,
                }}
              >
                <v.icon className="h-5 w-5" />
              </span>
              <p className="mt-3.5 font-display text-base font-bold text-white">{v.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-[#B9A6E8]">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
