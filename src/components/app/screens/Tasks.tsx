import { useQuery } from "convex/react";
import { useState } from "react";
import {
  ChevronRight,
  Eye,
  Flame,
  Lock,
  MessageCircle,
  Music2,
  Play,
  Upload,
} from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatNaira } from "@/lib/utils";
import type { SessionActivity } from "../EarningSession";

interface TasksProps {
  activated: boolean;
  whatsappConnected: boolean;
  onStartSession: (activity: SessionActivity) => void;
  onGoWallet: () => void;
}

export default function Tasks({
  activated,
  whatsappConnected,
  onStartSession,
  onGoWallet,
}: TasksProps) {
  const activities = useQuery(api.activities.listActivities, {});
  const [expandedTasks, setExpandedTasks] = useState(false);

  if (activities === undefined) {
    return (
      <div className="flex flex-col gap-3 pt-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-[#6B4FA1]/15" />
        ))}
      </div>
    );
  }

  const videos = activities.filter((a) => a.category === "videos");
  const games = activities.filter((a) => a.category === "games");
  const social = activities.filter((a) => a.category === "social");
  const music = activities.filter((a) => a.category === "music");

  const featured = videos[0];
  const moreVideos = videos.slice(1);

  const toSession = (a: (typeof activities)[number]): SessionActivity => ({
    id: a._id,
    title: a.title,
    reward: a.reward,
    emoji: a.emoji,
    durationSeconds: a.durationSeconds,
  });

  return (
    <div className="flex flex-col gap-6 pt-1">
      {/* WATCH & EARN */}
      <section aria-labelledby="watch-earn">
        <div className="flex items-center justify-between">
          <h2 id="watch-earn" className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FFD700]">
            Watch &amp; Earn
          </h2>
          <span className="text-[11px] text-[#8f80b8]">{formatNaira(10_000_00)} / hour</span>
        </div>

        {featured && (
          <div className="mt-3 overflow-hidden rounded-3xl border border-[#FFD700]/25 bg-[#16032f]/70">
            <div className="relative h-44 bg-gradient-to-br from-[#2D1B4E] to-[#16032f]">
              <div className="absolute inset-0 animate-pulse-glow bg-[radial-gradient(circle_at_50%_30%,rgba(255,215,0,0.22),transparent_60%)]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <span className="text-4xl">{featured.emoji}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FFD700]">
                  Jovia Fun Games Video
                </span>
              </div>
              <button
                type="button"
                onClick={() => onStartSession(toSession(featured))}
                aria-label="Start watching to earn"
                className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFD700] text-[#16032f] shadow-2xl transition-transform hover:scale-110"
              >
                <Play className="ml-0.5 h-6 w-6" fill="currentColor" />
              </button>
              <span className="absolute right-3 top-3 rounded-full bg-[#2EFF00]/15 px-2.5 py-1 text-[10px] font-bold text-[#2EFF00] ring-1 ring-[#2EFF00]/35">
                {formatNaira(featured.reward)} / {featured.rewardUnit}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="text-sm font-bold text-white">{featured.title}</p>
                <p className="text-xs text-[#B9A6E8]">
                  Fun Games • Watch &amp; Earn · {featured.durationSeconds}s session
                </p>
              </div>
              <button
                type="button"
                onClick={() => onStartSession(toSession(featured))}
                className="flex shrink-0 items-center gap-1 text-xs font-bold text-[#FFD700] hover:underline"
              >
                Tap to start watching <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* More video tasks */}
        {moreVideos.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            {moreVideos.map((v) => (
              <button
                key={v._id}
                type="button"
                onClick={() => onStartSession(toSession(v))}
                className="flex items-center gap-3 rounded-2xl border border-[#6B4FA1]/30 bg-[#1c0b38]/60 p-3.5 text-left transition-all hover:border-[#FFD700]/40"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD700]/12 text-lg">
                  {v.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-white">{v.title}</span>
                  <span className="block text-xs text-[#8f80b8]">
                    {formatNaira(v.reward)} / {v.rewardUnit}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-[#8f80b8]" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* GAME CENTER */}
      <section aria-labelledby="game-center">
        <div className="flex items-center justify-between">
          <h2 id="game-center" className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FFD700]">
            Game Center
          </h2>
          <button
            type="button"
            onClick={() => setExpandedTasks((v) => !v)}
            className="text-xs font-bold text-[#FFD700] hover:underline"
          >
            {expandedTasks ? "Show fewer" : "Open game center"}
          </button>
        </div>
        <p className="mt-0.5 text-xs text-[#8f80b8]">Featured Games</p>

        <div className="mt-3 flex flex-col gap-3">
          {games.map((g) => (
            <div
              key={g._id}
              className="flex items-center gap-3.5 rounded-2xl border border-[#6B4FA1]/30 bg-[#1c0b38]/60 p-3.5 transition-all hover:border-[#FFD700]/40"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2D1B4E] to-[#16032f] text-2xl ring-1 ring-[#6B4FA1]/40">
                {g.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white">{g.title}</p>
                <p className="truncate text-xs text-[#B9A6E8]">{g.description}</p>
                <p className="mt-1 text-[11px] font-bold text-[#2EFF00]">
                  Up to {formatNaira(g.reward)} / {g.rewardUnit}
                </p>
              </div>
              {activated ? (
                <Button size="sm" onClick={() => onStartSession(toSession(g))}>
                  Play
                </Button>
              ) : (
                <Button size="sm" variant="secondary" onClick={onGoWallet} className="gap-1">
                  <Lock className="h-3 w-3" /> Activate
                </Button>
              )}
            </div>
          ))}

          {expandedTasks && (
            <div className="flex flex-col gap-2">
              {music.concat(social).map((t) => (
                <button
                  key={t._id}
                  type="button"
                  onClick={() => activated && onStartSession(toSession(t))}
                  disabled={!activated}
                  className="flex items-center gap-3 rounded-2xl border border-[#6B4FA1]/25 bg-[#16032f]/60 p-3.5 text-left transition-all enabled:hover:border-[#FFD700]/40 disabled:opacity-60"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6B4FA1]/20 text-lg">
                    {t.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-white">{t.title}</span>
                    <span className="block text-xs text-[#8f80b8]">
                      {formatNaira(t.reward)} / {t.rewardUnit}
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-[#8f80b8]" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SOCIAL ACTIVITIES */}
      <section aria-labelledby="social-activities">
        <h2 id="social-activities" className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FFD700]">
          Social &amp; Market Rewards
        </h2>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[#6B4FA1]/30 bg-[#1c0b38]/60 p-4">
            <Eye className="h-5 w-5 text-[#2EFF00]" />
            <p className="mt-2 font-display text-lg font-bold text-white">₦1,500</p>
            <p className="text-[11px] text-[#8f80b8]">per status view</p>
          </div>
          <div className="rounded-2xl border border-[#6B4FA1]/30 bg-[#1c0b38]/60 p-4">
            <MessageCircle className="h-5 w-5 text-[#FFD700]" />
            <p className="mt-2 font-display text-lg font-bold text-white">₦500</p>
            <p className="text-[11px] text-[#8f80b8]">per chat engagement</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-[#6B4FA1]/30 bg-[#1c0b38]/60 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2EFF00]/12">
              <Upload className="h-5 w-5 text-[#2EFF00]" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white">
                {activated ? "Upload a status" : "Activate to upload status"}
              </p>
              <p className="text-xs text-[#8f80b8]">
                {activated
                  ? "Post to your WhatsApp status and earn per view."
                  : "Activate your account to unlock status posting."}
              </p>
            </div>
          </div>
          {activated ? (
            <Button
              variant="whatsapp"
              className="mt-3.5 w-full gap-2"
              onClick={() => {
                const socialActivity = social[0];
                if (socialActivity) onStartSession(toSession(socialActivity));
              }}
            >
              <MessageCircle className="h-4 w-4" />
              Choose status &amp; share to WhatsApp
            </Button>
          ) : (
            <Button variant="secondary" className="mt-3.5 w-full gap-2" onClick={onGoWallet}>
              <Lock className="h-4 w-4" /> Activate to unlock
            </Button>
          )}
        </div>
      </section>

      {/* MUSIC */}
      <section aria-labelledby="music-section">
        <div className="flex items-center justify-between">
          <h2 id="music-section" className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FFD700]">
            Music
          </h2>
          <Badge variant="success" className="gap-1">
            <Flame className="h-3 w-3" /> ₦1,500 per listening
          </Badge>
        </div>
        <p className="mt-0.5 text-xs text-[#8f80b8]">Stream &amp; Listen</p>

        <div className="mt-3 flex flex-col gap-3">
          {music.map((m) => (
            <div
              key={m._id}
              className="flex items-center gap-3.5 rounded-2xl border border-[#6B4FA1]/30 bg-[#1c0b38]/60 p-3.5"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1DB954]/15 ring-1 ring-[#1DB954]/40">
                {m.slug === "music-listening" ? (
                  <Music2 className="h-5 w-5 text-[#1DB954]" />
                ) : (
                  <span className="text-lg">{m.emoji}</span>
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white">{m.title}</p>
                <p className="truncate text-xs text-[#B9A6E8]">{m.description}</p>
                <p className="mt-0.5 text-[11px] font-bold text-[#1DB954]">
                  {formatNaira(m.reward)} {m.rewardUnit}
                </p>
              </div>
              {activated ? (
                <Button size="sm" variant="outline" onClick={() => onStartSession(toSession(m))}>
                  Listen
                </Button>
              ) : (
                <Button size="sm" variant="secondary" onClick={onGoWallet} className="gap-1">
                  <Lock className="h-3 w-3" /> Activate
                </Button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
