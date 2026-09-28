import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PartyPopper, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store-context";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatNaira } from "@/lib/utils";
import { ActivityImage } from "@/components/ActivityImage";
import { formatCountdown, playSessionChime } from "@/lib/session";
import type { Activity } from "@/lib/store";

export type SessionActivity = Activity;

type Phase = "preparing" | "running" | "claiming" | "done";

export default function EarningSession({
  activity,
  onClose,
}: {
  activity: SessionActivity;
  onClose: () => void;
}) {
  const { actions } = useStore();
  const [phase, setPhase] = useState<Phase>("preparing");
  const [remaining, setRemaining] = useState(activity.durationSeconds);
  const [endedAt, setEndedAt] = useState<number | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const startedRef = useRef(false);

  const earnedKobo = useMemo(() => {
    if (!endedAt) return 0;
    const total = activity.durationSeconds;
    const elapsed = Math.min(total, total - remaining);
    return Math.floor((elapsed / total) * activity.reward);
  }, [endedAt, remaining, activity.durationSeconds, activity.reward]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    try {
      const { endsAt } = actions.startEarningSession(activity.id);
      sessionIdRef.current = `s_${activity.id}_${endsAt}`;
      setEndedAt(endsAt);
      setPhase("running");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start session");
      onClose();
    }
  }, [activity.id, actions, onClose]);

  useEffect(() => {
    if (phase !== "running" || !endedAt) return;
    const t = setInterval(() => {
      const left = Math.max(0, Math.round((endedAt - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) {
        setPhase("claiming");
        playSessionChime();
      }
    }, 250);
    return () => clearInterval(t);
  }, [phase, endedAt]);

  useEffect(() => {
    if (phase !== "claiming") return;
    let cancelled = false;
    (async () => {
      try {
        // Find and complete the newest active session for this activity.
        const sessionId = findActiveSessionId(activity.id);
        if (!sessionId) throw new Error("No active session found");
        await new Promise((r) => setTimeout(r, 400));
        const reward = actions.completeEarningSession(sessionId);
        if (!cancelled) {
          toast.success(`+${formatNaira(reward)} credited from ${activity.title}!`);
          setPhase("done");
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not credit reward");
        onClose();
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const progress = 100 - (remaining / Math.max(1, activity.durationSeconds)) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label={`${activity.title} earning session`}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 300 }}
          className="relative w-full max-w-sm rounded-3xl border border-[#FFD700]/35 bg-[#16032f]/97 p-6 text-center shadow-2xl"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close session"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg border border-[#6B4FA1]/40 text-white/80"
          >
            <X className="h-4 w-4" />
          </button>

          <ActivityImage
            src={activity.image}
            emoji={activity.emoji}
            alt=""
            className="mx-auto mt-2 h-20 w-20 rounded-3xl ring-1 ring-[#FFD700]/40"
          />

          {phase === "preparing" && (
            <>
              <p className="mt-5 font-display text-lg font-bold text-white">
                Preparing your session…
              </p>
              <div className="mx-auto mt-4 h-2 w-40 animate-pulse rounded-full bg-[#6B4FA1]/40" />
            </>
          )}

          {(phase === "running" || phase === "claiming") && (
            <>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#FFD700]">
                Earning in progress
              </p>
              <p className="mt-1 font-display text-xl font-bold text-white">{activity.title}</p>

              <div className="mt-6 font-display text-5xl font-extrabold tabular-nums text-white">
                {formatCountdown(remaining)}
              </div>
              <Progress value={phase === "claiming" ? 100 : progress} className="mt-4" />

              <div className="mt-5 rounded-2xl border border-[#2EFF00]/30 bg-[#2EFF00]/[0.07] p-3.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2EFF00]">
                  Earning live
                </p>
                <p className="mt-0.5 font-display text-xl font-bold text-[#2EFF00]">
                  {formatNaira(phase === "claiming" ? activity.reward : earnedKobo)}
                </p>
                <p className="text-[10px] text-[#8f80b8]">
                  of {formatNaira(activity.reward)} session reward
                </p>
              </div>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[#8f80b8]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#2EFF00]" />
                Keep this screen open until the countdown ends
              </p>
            </>
          )}

          {phase === "done" && (
            <>
              <span className="mx-auto mt-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#2EFF00]/15 text-[#2EFF00]">
                <PartyPopper className="h-6 w-6" />
              </span>
              <p className="mt-4 font-display text-lg font-bold text-white">Reward credited!</p>
              <p className="mt-1 font-display text-3xl font-extrabold text-gradient-gold">
                +{formatNaira(activity.reward)}
              </p>
              <p className="mt-1.5 text-xs text-[#B9A6E8]">
                {activity.title} · added to your available balance
              </p>
              <Button onClick={onClose} className="mt-6 w-full">
                Done
              </Button>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/** Finds the newest active earning session id for an activity via the store. */
function findActiveSessionId(activityId: string): string | null {
  try {
    const raw = localStorage.getItem("jovia.earningSessions");
    if (!raw) return null;
    const sessions = JSON.parse(raw) as Array<{
      id: string;
      activityId: string;
      status: string;
    }>;
    const match = sessions.find((s) => s.activityId === activityId && s.status === "active");
    return match?.id ?? null;
  } catch {
    return null;
  }
}
