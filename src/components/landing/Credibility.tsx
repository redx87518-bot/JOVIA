import { motion } from "framer-motion";
import { BadgeCheck, Landmark, ShieldCheck, FileCheck2 } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

export function Credibility() {
  return (
    <section id="credibility" className="container py-24">
      <SectionHeading
        eyebrow="Business credibility"
        title="Jovia Network registration and business credibility."
        subtitle="Jovia is registered and recognized by Nigeria's Corporate Affairs Commission (CAC)."
      />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto grid max-w-4xl items-center gap-8 md:grid-cols-[auto_1fr]"
      >
        {/* CAC badge */}
        <div className="relative mx-auto">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="relative flex h-56 w-44 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-[#FFD700]/50 bg-gradient-to-b from-[#1c0b38] to-[#16032f] p-5 text-center glow-gold"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFD700]/15 ring-2 ring-[#FFD700]/50">
              <Landmark className="h-7 w-7 text-[#FFD700]" />
            </span>
            <p className="font-display text-sm font-extrabold uppercase tracking-[0.18em] text-[#FFD700]">
              CAC
            </p>
            <p className="text-[11px] leading-snug text-[#B9A6E8]">
              Corporate Affairs
              <br />
              Commission
              <br />
              Nigeria
            </p>
            <span className="mt-1 rounded-full bg-[#2EFF00]/12 px-2.5 py-0.5 text-[10px] font-bold text-[#2EFF00] ring-1 ring-[#2EFF00]/30">
              Registered
            </span>
            <span
              aria-hidden="true"
              className="absolute inset-2 rounded-xl border border-dashed border-[#FFD700]/25"
            />
          </motion.div>
          <span
            aria-hidden="true"
            className="absolute -bottom-4 left-1/2 h-8 w-32 -translate-x-1/2 rounded-full bg-[#6B4FA1]/40 blur-xl"
          />
        </div>

        <div className="jovia-card p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD700]/12 ring-1 ring-[#FFD700]/35">
              <BadgeCheck className="h-5 w-5 text-[#FFD700]" />
            </span>
            <h3 className="font-display text-xl font-bold text-white">
              Jovia Is Registered and Recognized
            </h3>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[#B9A6E8]">
            Our activities, products, and services are designed to provide our users with
            valuable opportunities and experiences. JOVIA is officially registered with the
            Corporate Affairs Commission (CAC).
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2.5 rounded-xl border border-[#6B4FA1]/30 bg-[#16032f]/60 px-4 py-3">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[#2EFF00]" />
              <span className="text-xs font-medium text-[#E9E3F9]">
                Verified Nigerian business
              </span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-[#6B4FA1]/30 bg-[#16032f]/60 px-4 py-3">
              <FileCheck2 className="h-4 w-4 shrink-0 text-[#FFD700]" />
              <span className="text-xs font-medium text-[#E9E3F9]">
                Transparent activity rules
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
