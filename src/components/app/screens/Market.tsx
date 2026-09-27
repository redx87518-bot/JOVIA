import { useState } from "react";
import { ChevronRight, Clock3, Flame, Lock, Sparkles, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNaira, cn } from "@/lib/utils";
import { useStore } from "@/lib/store-context";
import type { SessionActivity } from "../EarningSession";

interface MarketProps {
  onStartSession: (activity: SessionActivity) => void;
}

const CATEGORY_TABS = [
  { id: "all", label: "All" },
  { id: "videos", label: "Videos" },
  { id: "games", label: "Games" },
  { id: "music", label: "Music" },
  { id: "social", label: "Social" },
] as const;

const CATEGORY_NAMES: Record<string, string> = {
  videos: "Celebrity Videos",
  games: "Fun Games",
  music: "Music",
  social: "Social",
};

export default function Market({ onStartSession }: MarketProps) {
  const { user, activities } = useStore();
  const [tab, setTab] = useState<(typeof CATEGORY_TABS)[number]["id"]>("all");

  const activated = user?.activationStatus === "active";

  const filtered = tab === "all" ? activities : activities.filter((a) => a.category === tab);
  const featured = activities.find((a) => a.category === "videos") ?? activities[0];

  return (
    <div className="flex flex-col gap-5 pt-1">
      <div>
        <h1 className="font-display text-xl font-bold text-white">Market</h1>
        <p className="text-xs text-[#8f80b8]">
          Featured opportunities and available activities.
        </p>
      </div>

      {/* Featured banner */}
      {featured && (
        <button
          type="button"
          onClick={() => (activated ? onStartSession(featured) : undefined)}
          className="relative overflow-hidden rounded-3xl border border-[#FFD700]/35 bg-gradient-to-br from-[#2D1B4E] to-[#16032f] p-5 text-left transition-transform enabled:hover:-translate-y-0.5"
        >
          <span className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#FFD700]/15 blur-2xl" />
          <Badge className="gap-1">
            <Sparkles className="h-3 w-3" /> Featured today
          </Badge>
          <p className="mt-2.5 font-display text-lg font-bold text-white">{featured.title}</p>
          <p className="mt-0.5 text-xs text-[#B9A6E8]">
            {CATEGORY_NAMES[featured.category]} · {featured.durationSeconds}s session
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span className="font-display text-xl font-extrabold text-[#2EFF00]">
              {formatNaira(featured.reward)}
            </span>
            <span className="text-[11px] text-[#8f80b8]">/ {featured.rewardUnit}</span>
            <span className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#FFD700] text-[#16032f]">
              {activated ? <ChevronRight className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            </span>
          </div>
        </button>
      )}

      {/* Category tabs */}
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {CATEGORY_TABS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setTab(c.id)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-xs font-bold transition-all",
              tab === c.id
                ? "border-[#FFD700] bg-[#FFD700]/15 text-[#FFD700]"
                : "border-[#6B4FA1]/35 text-[#B9A6E8] hover:border-[#FFD700]/40"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Limited-time strip */}
      <div className="flex items-center gap-2.5 rounded-2xl border border-[#FF9F1C]/35 bg-[#FF9F1C]/[0.07] px-4 py-3">
        <Flame className="h-4 w-4 shrink-0 text-[#FFB85C]" />
        <p className="text-xs font-medium text-[#FFD9A8]">
          Limited-time: Friday Bonus Rewards are live for Gold members.
        </p>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-3">
        {filtered.map((a) => (
          <div
            key={a.id}
            className="flex items-center gap-3.5 rounded-2xl border border-[#6B4FA1]/30 bg-[#1c0b38]/60 p-3.5 transition-all hover:border-[#FFD700]/40"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2D1B4E] to-[#16032f] text-xl ring-1 ring-[#6B4FA1]/40">
              {a.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-bold text-white">{a.title}</p>
                <span className="rounded-md bg-[#6B4FA1]/25 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#CFC4EC]">
                  {CATEGORY_NAMES[a.category] ?? a.category}
                </span>
              </div>
              <p className="truncate text-xs text-[#B9A6E8]">{a.description}</p>
              <div className="mt-1 flex items-center gap-2 text-[11px]">
                <span className="font-bold text-[#2EFF00]">
                  {formatNaira(a.reward)} / {a.rewardUnit}
                </span>
                <span className="flex items-center gap-1 text-[#8f80b8]">
                  <Clock3 className="h-3 w-3" /> {a.durationSeconds}s
                </span>
                <span className="flex items-center gap-1 text-[#B9A6E8]">
                  <TrendingUp className="h-3 w-3" /> Hot
                </span>
              </div>
            </div>
            {activated ? (
              <Button size="sm" onClick={() => onStartSession(a)}>
                Start
              </Button>
            ) : (
              <Button size="sm" variant="secondary" className="gap-1" disabled>
                <Lock className="h-3 w-3" /> Locked
              </Button>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="rounded-2xl border border-dashed border-[#6B4FA1]/30 p-6 text-center text-xs text-[#8f80b8]">
            No activities in this category yet.
          </p>
        )}
      </div>
    </div>
  );
}
