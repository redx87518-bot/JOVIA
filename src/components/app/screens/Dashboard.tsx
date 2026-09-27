import { EyeOff, Eye, Plus, Send, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNaira, initialsOf } from "@/lib/utils";
import { maskAmount, usePrivacyMode } from "@/lib/privacy";

interface DashboardProps {
  username: string;
  activationStatus: "awaiting_payment" | "pending" | "active";
  balance: number;
  totalEarned: number;
  totalWithdrawn: number;
  onGoWallet: () => void;
}

export default function Dashboard({
  username,
  activationStatus,
  balance,
  totalEarned,
  totalWithdrawn,
  onGoWallet,
}: DashboardProps) {
  const [privacyMode, setPrivacyMode] = usePrivacyMode();
  const active = activationStatus === "active";

  return (
    <div className="flex flex-col gap-4 pt-1">
      {/* Welcome */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-xl font-bold text-white">
            Welcome, {username.split(" ")[0]}!
          </p>
          <p className="text-xs text-[#8f80b8]">Here is your Jovia overview.</p>
        </div>
        <Badge variant={active ? "success" : "danger"} className="shrink-0 px-3 py-1">
          {active ? "ACTIVE" : "NOT ACTIVATED"}
        </Badge>
      </div>

      {/* Activation CTA */}
      {!active && (
        <div className="rounded-2xl border border-[#FFD700]/45 bg-[#FFD700]/[0.06] p-4">
          <p className="text-sm leading-relaxed text-[#F3EFFF]">
            Activate to unlock music, games, celebrity videos and the marketplace, and earn.
          </p>
          <Button onClick={onGoWallet} className="mt-3 w-full gap-2" size="lg">
            <Zap className="h-4 w-4" /> Activate Account ⚡
          </Button>
        </div>
      )}

      {/* JOVIA NETWORK card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2D1B4E] via-[#1c0b38] to-[#16032f] p-5 ring-1 ring-[#FFD700]/30 shadow-[0_30px_60px_-30px_rgba(107,79,161,0.6)]">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#6B4FA1]/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-[#FFD700]/10 blur-3xl"
        />
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-xs font-extrabold tracking-[0.22em] text-white">
              JOVIA NETWORK
            </span>
            <button
              type="button"
              onClick={() => setPrivacyMode(!privacyMode)}
              aria-label={privacyMode ? "Show balance" : "Hide balance"}
              className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 text-white/80"
            >
              {privacyMode ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
          <span className="rounded-md bg-[#FFD700]/15 px-2 py-1 text-[10px] font-bold text-[#FFD700]">
            DEBIT
          </span>
        </div>

        {/* Card chip */}
        <div className="relative mt-5 flex items-center gap-3">
          <span className="h-8 w-11 rounded-md bg-gradient-to-br from-[#FFE566] to-[#C9A400] ring-1 ring-[#FFD700]/60" />
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-6 w-6 rounded-full bg-[#EB001B]/85" />
            <span className="-ml-3 h-6 w-6 rounded-full bg-[#F79E1B]/85" />
          </span>
          <span className="h-6 w-9 rounded-md bg-gradient-to-br from-[#1A1F71]/80 to-[#3b4bd8]/60 ring-1 ring-white/20" />
        </div>

        <div className="relative mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B9A6E8]">
            Available Balance
          </p>
          <p className="mt-1 font-display text-[26px] font-extrabold tracking-wide text-white">
            {maskAmount(formatNaira(balance), privacyMode)}
          </p>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8f80b8]">
            Available to withdraw
          </p>
        </div>
      </div>

      {/* Total balance */}
      <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-[0_18px_40px_-22px_rgba(0,0,0,0.7)]">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B4FA1]">
            Total Balance
          </p>
          <p className="mt-0.5 font-display text-2xl font-extrabold text-[#2D1B4E]">
            {maskAmount(balance.toLocaleString("en-NG"), privacyMode)}
          </p>
        </div>
        <span className="rounded-full bg-[#2D1B4E] px-3 py-1.5 text-xs font-bold text-[#FFD700]">
          NGN ₦
        </span>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onGoWallet}
          className="flex flex-col items-start gap-2 rounded-2xl border border-[#6B4FA1]/35 bg-[#1c0b38]/70 p-4 text-left transition-all hover:border-[#FFD700]/45 hover:-translate-y-0.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFD700]/15 text-[#FFD700]">
            <Plus className="h-4 w-4" />
          </span>
          <span className="text-sm font-bold text-white">Earnings</span>
          <span className="text-[11px] text-[#8f80b8]">
            {maskAmount(formatNaira(totalEarned, { compact: true }), privacyMode)} earned
          </span>
        </button>
        <button
          type="button"
          onClick={onGoWallet}
          className="flex flex-col items-start gap-2 rounded-2xl border border-[#6B4FA1]/35 bg-[#1c0b38]/70 p-4 text-left transition-all hover:border-[#FFD700]/45 hover:-translate-y-0.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2EFF00]/12 text-[#2EFF00]">
            <Send className="h-4 w-4" />
          </span>
          <span className="text-sm font-bold text-white">Withdrawn</span>
          <span className="text-[11px] text-[#8f80b8]">
            {maskAmount(formatNaira(totalWithdrawn, { compact: true }), privacyMode)} paid out
          </span>
        </button>
      </div>

      {/* Quick tip */}
      <div className="rounded-2xl border border-[#6B4FA1]/30 bg-[#16032f]/60 p-4">
        <p className="flex items-center gap-2 text-xs font-semibold text-[#CFC4EC]">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFD700]/15 text-[#FFD700]">
            {initialsOf("Jovia")}
          </span>
          Tip: complete a game session to see your balance update in real time.
        </p>
      </div>
    </div>
  );
}
