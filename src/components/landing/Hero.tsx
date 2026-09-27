import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, LogIn, Play, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const cardX = useTransform(sx, [-1, 1], [-14, 14]);
  const cardY = useTransform(sy, [-1, 1], [-10, 10]);
  const cardX2 = useTransform(sx, [-1, 1], [12, -12]);
  const cardY2 = useTransform(sy, [-1, 1], [8, -8]);

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    my.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  return (
    <section
      ref={ref}
      onMouseMove={onMouseMove}
      className="relative overflow-hidden pb-24 pt-36 sm:pt-44"
    >
      {/* Background decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(185,166,232,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(185,166,232,0.35) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent 75%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[820px] -translate-x-1/2 rounded-full bg-[#6B4FA1]/25 blur-[140px]"
      />

      <div className="container relative grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col items-start gap-7">
          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="section-label"
          >
            <Sparkles className="h-3.5 w-3.5" /> Jovia Network — Nigeria
          </motion.span>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="font-display text-4xl font-bold leading-[1.08] text-white sm:text-6xl"
          >
            Watch, play, connect and{" "}
            <em className="text-gradient-gold italic font-bold">earn.</em>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="max-w-xl text-base leading-relaxed text-[#B9A6E8] sm:text-lg"
          >
            Jovia connects you with monetization programs, freelancing tasks, gaming,
            celebrity videos and digital activities — built around your time, with
            opportunities to earn by the second.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="flex flex-wrap items-center gap-3"
          >
            <Link to="/auth?mode=signup">
              <Button size="lg" className="gap-2">
                Create account <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="secondary" size="lg" className="gap-2">
                <LogIn className="h-4 w-4" /> Login to account
              </Button>
            </Link>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="text-xs text-[#8f80b8]"
          >
            Silver ₦9,000 · Gold ₦15,000 · Registered with Nigeria's CAC
          </motion.p>
        </div>

        {/* Floating visual stack */}
        <div className="relative mx-auto hidden h-[460px] w-full max-w-md sm:block">
          <motion.div
            aria-hidden="true"
            style={{ x: cardX, y: cardY }}
            initial={{ opacity: 0, y: 40, rotate: -4 }}
            animate={{ opacity: 1, y: 0, rotate: -4 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="absolute left-0 top-8 w-64 rounded-3xl glass-gold p-5 glow-gold"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFD700]">
                Jovia Balance
              </span>
              <span className="flex h-6 w-9 items-center justify-center rounded-md bg-[#FFD700]/15 text-[10px] font-bold text-[#FFD700]">
                NGN
              </span>
            </div>
            <p className="font-display text-3xl font-bold text-white">₦148,250</p>
            <p className="mt-1 text-xs text-[#B9A6E8]">Available to withdraw</p>
            <div className="mt-4 h-px bg-gradient-to-r from-[#FFD700]/50 to-transparent" />
            <div className="mt-4 flex items-center gap-2 text-[11px] text-[#CFC4EC]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2EFF00]/15 text-[#2EFF00]">
                <Zap className="h-3 w-3" />
              </span>
              +₦3,000 · Temple Run session
            </div>
          </motion.div>

          <motion.div
            aria-hidden="true"
            style={{ x: cardX2, y: cardY2 }}
            initial={{ opacity: 0, y: 60, rotate: 5 }}
            animate={{ opacity: 1, y: 0, rotate: 5 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute bottom-6 right-0 w-60 rounded-3xl glass p-5"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFD700]/15 text-xl">
                🎬
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Celebrity Videos</p>
                <p className="text-xs text-[#B9A6E8]">₦10,000 / hour watched</p>
              </div>
            </div>
            <div className="relative mt-4 flex h-24 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#2D1B4E] to-[#16032f] ring-1 ring-[#FFD700]/25">
              <span className="absolute inset-0 animate-pulse-glow bg-[radial-gradient(circle_at_30%_20%,rgba(255,215,0,0.25),transparent_60%)]" />
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFD700] text-[#16032f] shadow-lg">
                <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
              </span>
            </div>
          </motion.div>

          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="absolute right-8 top-0 flex items-center gap-2 rounded-full border border-[#2EFF00]/40 bg-[#0F0515]/85 px-4 py-2 text-xs font-semibold text-[#2EFF00] backdrop-blur"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#2EFF00]" />
            Earning live · by the second
          </motion.div>
        </div>
      </div>
    </section>
  );
}
