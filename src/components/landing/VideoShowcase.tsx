import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, ShieldCheck, Sparkles, X } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";

/* Public sample clips used as placeholder video content until the real
   celebrity/games media library is connected. They play inline with no
   external player scripts and degrade gracefully when offline. */
const SAMPLE_CLIPS = [
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
];

interface Showcase {
  id: string;
  title: string;
  description: string;
  from: string;
  to: string;
  accent: string;
  emoji: string;
  meta: string;
  clip: string;
  stat: string;
}

const SHOWCASES: Showcase[] = [
  {
    id: "celebrity",
    title: "Jovia Celebrity Videos",
    description:
      "Watch selected celebrity and entertainment video content through the JOVIA network.",
    from: "#2D1B4E",
    to: "#16032f",
    accent: "#FFD700",
    emoji: "🎬",
    meta: "Countdown-based rewards",
    clip: SAMPLE_CLIPS[0],
    stat: "₦10,000 / hour watched",
  },
  {
    id: "games",
    title: "Jovia Fun Games",
    description:
      "Explore supported games and time-based activities within the Jovia network.",
    from: "#3b2364",
    to: "#1c0b38",
    accent: "#2EFF00",
    emoji: "🎮",
    meta: "60-second earning sessions",
    clip: SAMPLE_CLIPS[1],
    stat: "Up to ₦3,000 / 60 sec",
  },
];

function Poster({ showcase, onPlay }: { showcase: Showcase; onPlay: () => void }) {
  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={`Play ${showcase.title} preview`}
      className="group relative block h-56 w-full overflow-hidden rounded-2xl text-left sm:h-64"
      style={{ background: `linear-gradient(140deg, ${showcase.from}, ${showcase.to})` }}
    >
      {/* Film-strip decorations */}
      <div className="absolute inset-x-0 top-0 flex justify-between px-4 pt-3 opacity-40">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="h-3 w-1.5 rounded bg-white/60" />
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 flex justify-between px-4 pb-3 opacity-40">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="h-3 w-1.5 rounded bg-white/60" />
        ))}
      </div>

      {/* Spotlight */}
      <div className="absolute inset-0 animate-pulse-glow bg-[radial-gradient(circle_at_50%_35%,rgba(255,215,0,0.22),transparent_65%)]" />

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <span className="text-5xl">{showcase.emoji}</span>
        <span
          className="text-[11px] font-bold uppercase tracking-[0.3em]"
          style={{ color: showcase.accent }}
        >
          JOVIA {showcase.id === "games" ? "FUN GAMES" : "CELEBRITY"}
        </span>
        <div
          className="h-1 w-24 rounded-full opacity-70"
          style={{ background: showcase.accent }}
        />
      </div>

      {/* Play affordance */}
      <span className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full text-[#16032f] shadow-2xl transition-transform duration-300 group-hover:scale-110"
        style={{ background: showcase.accent }}
      >
        <Play className="ml-1 h-7 w-7" fill="currentColor" />
      </span>

      <span className="absolute right-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-semibold text-white/85 backdrop-blur">
        PREVIEW
      </span>
    </button>
  );
}

export function VideoShowcase() {
  const [active, setActive] = useState<Showcase | null>(null);

  // Close the lightbox with Escape.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <section id="videos" className="container scroll-mt-24 py-24">
      <SectionHeading
        eyebrow="Watch & Earn"
        title="Celebrity videos and fun games, built for earning."
        subtitle="Preview the kinds of content Jovia rewards — then unlock the full library inside the app."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {SHOWCASES.map((s, i) => (
          <motion.article
            key={s.id}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.12, duration: 0.6 }}
            className="jovia-card group overflow-hidden p-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_36px_80px_-30px_rgba(255,215,0,0.22)]"
          >
            <Poster showcase={s} onPlay={() => setActive(s)} />
            <div className="flex items-start justify-between gap-4 p-3 pt-5">
              <div>
                <h3 className="font-display text-xl font-bold text-white">{s.title}</h3>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-[#B9A6E8]">
                  {s.description}
                </p>
              </div>
              <span
                className="shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold"
                style={{ background: `${s.accent}1f`, color: s.accent }}
              >
                {s.meta}
              </span>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Clear call to action */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55 }}
        className="relative mt-10 overflow-hidden rounded-3xl border border-[#FFD700]/35 bg-gradient-to-r from-[#2D1B4E]/90 via-[#1c0b38]/90 to-[#16032f]/90 p-7 sm:p-9"
      >
        <span
          aria-hidden="true"
          className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#FFD700]/15 blur-3xl"
        />
        <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#FFD700]">
              <Sparkles className="h-3.5 w-3.5" /> Ready to start earning?
            </p>
            <p className="mt-2 max-w-xl font-display text-xl font-bold text-white sm:text-2xl">
              Create your Jovia account and turn every watch and game into real rewards.
            </p>
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#8f80b8]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#2EFF00]" />
              One-time registration · Silver ₦9,000 or Gold ₦15,000
            </p>
          </div>
          <Link to="/auth?mode=signup" className="shrink-0">
            <Button size="lg" className="gap-2">
              Create account <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Video lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${active.title} video preview`}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 280 }}
              className="w-full max-w-3xl overflow-hidden rounded-3xl border border-[#FFD700]/30 bg-[#16032f] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#6B4FA1]/30 px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{active.emoji}</span>
                  <div>
                    <p className="text-sm font-bold text-white">{active.title}</p>
                    <p className="text-[11px]" style={{ color: active.accent }}>
                      {active.stat}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  aria-label="Close video"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#6B4FA1]/40 text-white/80 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <video
                key={active.id}
                className="aspect-video w-full bg-black"
                src={active.clip}
                controls
                autoPlay
                playsInline
                onError={(e) => {
                  // Offline or blocked: surface the branded fallback stage.
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const fallback = document.createElement("div");
                  fallback.className =
                    "flex aspect-video w-full flex-col items-center justify-center gap-3";
                  fallback.style.background = `linear-gradient(140deg, ${active.from}, ${active.to})`;
                  fallback.innerHTML = `
                    <span style="font-size:3rem">${active.emoji}</span>
                    <span style="color:${active.accent};font-weight:700;letter-spacing:0.3em;font-size:11px">
                      JOVIA PREVIEW UNAVAILABLE OFFLINE
                    </span>`;
                  target.parentElement?.appendChild(fallback);
                }}
              />
              <div className="flex flex-col items-start justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center">
                <p className="text-xs text-[#B9A6E8]">
                  Sample preview clip. The full library unlocks inside the Jovia app.
                </p>
                <Link to="/auth?mode=signup">
                  <Button size="sm" className="gap-1.5">
                    Start earning <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
