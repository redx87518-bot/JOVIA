import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

/* Official Jovia promo clips extracted from joviapltform.site and served
   locally from /public/videos so playback is fast and never blocked by
   hotlink or CORS restrictions. */
const PROMO_CLIP = "/videos/jovia-games.mp4";
const PROMO_CLIP_FALLBACK = "/videos/jovia-celebrity.mp4";
const PROMO_POSTER = "/images/jovia-games-preview.jpg";

export function HomeVideo({
  open,
  onOpen,
  onClose,
}: {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  return (
    <section className="container pb-20 pt-4">
      <div className="mx-auto max-w-4xl">
        <motion.button
          type="button"
          onClick={onOpen}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          aria-label="Play the Jovia introduction video"
          className="group relative block aspect-video w-full overflow-hidden rounded-3xl border border-[#FFD700]/30 text-left shadow-[0_40px_90px_-40px_rgba(107,79,161,0.7)]"
          style={{ background: "linear-gradient(140deg, #2D1B4E, #16032f)" }}
        >
          {/* Real promo poster extracted from joviapltform.site */}
          <img
            src={PROMO_POSTER}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover object-top opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#16032f] via-[#16032f]/55 to-transparent" />
          <div className="absolute inset-0 animate-pulse-glow bg-[radial-gradient(circle_at_50%_35%,rgba(255,215,0,0.2),transparent_60%)]" />
          <div className="absolute left-6 top-6 flex items-center gap-2.5">
            <span className="font-display text-sm font-extrabold tracking-wide text-white drop-shadow">
              JOVIA <span className="text-[#FFD700]">NETWORK</span>
            </span>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-end gap-4 pb-10 sm:items-center sm:justify-center sm:pb-0">
            <motion.span
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#FFD700] drop-shadow"
            >
              Watch how Jovia works
            </motion.span>
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFD700] text-[#16032f] shadow-2xl transition-transform duration-300 group-hover:scale-110">
              <Play className="ml-1 h-7 w-7" fill="currentColor" />
            </span>
          </div>
          <span className="absolute bottom-5 right-5 rounded-full bg-black/45 px-3 py-1.5 text-[10px] font-semibold text-white/85 backdrop-blur">
            0:26 INTRO
          </span>
        </motion.button>

        <p className="mt-4 text-center text-xs text-[#8f80b8]">
          See the platform in motion — activation, activities, earnings and withdrawals.
        </p>
      </div>

      {/* Lightbox player */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Jovia introduction video"
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
                <p className="text-sm font-bold text-white">
                  Jovia Network — Introduction
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close video"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#6B4FA1]/40 text-white/80 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <video
                className="aspect-video w-full bg-black"
                controls
                autoPlay
                playsInline
                onError={(e) => {
                  // Both clips are served locally; if they still fail (offline
                  // dev server, etc.), surface the branded fallback stage.
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const fallback = document.createElement("div");
                  fallback.className =
                    "flex aspect-video w-full flex-col items-center justify-center gap-3";
                  fallback.style.background = "linear-gradient(140deg, #2D1B4E, #16032f)";
                  fallback.innerHTML =
                    '<span style="color:#FFD700;font-weight:700;letter-spacing:0.3em;font-size:11px">PREVIEW UNAVAILABLE OFFLINE</span>';
                  target.parentElement?.appendChild(fallback);
                }}
              >
                <source src={PROMO_CLIP} type="video/mp4" />
                <source src={PROMO_CLIP_FALLBACK} type="video/mp4" />
              </video>
              <div className="flex items-center justify-between gap-3 px-5 py-4">
                <p className="text-xs text-[#B9A6E8]">
                  Sample promo clip — the full experience lives in the app.
                </p>
                <Link to="/auth?mode=signup">
                  <Button size="sm">Create account</Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
