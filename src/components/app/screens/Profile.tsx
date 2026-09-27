import { useState } from "react";
import {
  Bell,
  Check,
  ChevronRight,
  CreditCard,
  Globe,
  LifeBuoy,
  LogOut,
  MessageCircle,
  Moon,
  Pencil,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { initialsOf } from "@/lib/utils";
import { useStore } from "@/lib/store-context";

export default function Profile() {
  const { user, privacyMode, actions } = useStore();
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [notifications, setNotifications] = useState(true);

  if (!user) return null;
  const active = user.activationStatus === "active";

  function handleSaveUsername() {
    try {
      actions.updateUsername(draftName.trim());
      setEditing(false);
      toast.success("Username updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update username");
    }
  }

  function handleSignOut() {
    actions.signOut();
  }

  return (
    <div className="flex flex-col gap-4 pt-1">
      <div className="flex flex-col items-center gap-2 rounded-3xl border border-[#6B4FA1]/30 bg-[#1c0b38]/60 p-6">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FFD700] font-display text-3xl font-extrabold text-[#16032f] shadow-[0_16px_40px_-14px_rgba(255,215,0,0.55)]">
          {initialsOf(user.username)}
        </span>
        <div className="mt-1 flex items-center gap-2">
          {editing ? (
            <div className="flex items-center gap-2">
              <Input
                autoFocus
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                className="h-9 w-44 text-center"
                placeholder="New username"
              />
              <button
                type="button"
                aria-label="Save username"
                onClick={handleSaveUsername}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2EFF00]/15 text-[#2EFF00]"
              >
                <Check className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <p className="font-display text-lg font-bold text-white">{user.username}</p>
              <button
                type="button"
                aria-label="Edit username"
                onClick={() => {
                  setDraftName(user.username);
                  setEditing(true);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6B4FA1]/25 text-[#CFC4EC]"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
        <p className="text-xs text-[#8f80b8]">{user.email}</p>
        <Badge variant={active ? "success" : "danger"} className="mt-1">
          {active ? `JOVIA ${user.plan === "gold" ? "GOLD" : "SILVER"} · ACTIVE` : "NOT ACTIVATED"}
        </Badge>
      </div>

      <section className="rounded-3xl border border-[#6B4FA1]/30 bg-[#1c0b38]/60 p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FFD700]">
          Account Settings
        </p>
        <div className="mt-3 flex flex-col divide-y divide-[#6B4FA1]/20">
          <div className="flex items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6B4FA1]/20 text-[#CFC4EC]">
                <Shield className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Privacy mode</p>
                <p className="text-[11px] text-[#8f80b8]">Mask balances across the app</p>
              </div>
            </div>
            <Switch checked={privacyMode} onCheckedChange={() => actions.togglePrivacyMode()} />
          </div>

          <div className="flex items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6B4FA1]/20 text-[#CFC4EC]">
                <CreditCard className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Bank details</p>
                <p className="text-[11px] text-[#8f80b8]">
                  {user.bankDetails
                    ? `${user.bankDetails.bankName} • ${user.bankDetails.accountNumber}`
                    : "No withdrawal account saved"}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#FFD700]">
              {user.bankDetails ? "Saved" : "Add in Wallet"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#25D366]/15 text-[#25D366]">
                <MessageCircle className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">WhatsApp</p>
                <p className="text-[11px] text-[#8f80b8]">
                  {user.whatsappConnected ? "Connected" : "Not connected"}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant={user.whatsappConnected ? "secondary" : "whatsapp"}
              onClick={() => actions.setWhatsappConnected(!user.whatsappConnected)}
            >
              {user.whatsappConnected ? "Disconnect" : "Connect"}
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#6B4FA1]/30 bg-[#1c0b38]/60 p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FFD700]">
          App Settings
        </p>
        <div className="mt-3 flex flex-col divide-y divide-[#6B4FA1]/20">
          <div className="flex items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6B4FA1]/20 text-[#CFC4EC]">
                <Bell className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Notifications</p>
                <p className="text-[11px] text-[#8f80b8]">Reward and payout alerts</p>
              </div>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>

          <div className="flex items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6B4FA1]/20 text-[#CFC4EC]">
                <Moon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Theme</p>
                <p className="text-[11px] text-[#8f80b8]">Jovia dark (default)</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#FFD700]">Dark</span>
          </div>

          <div className="flex items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6B4FA1]/20 text-[#CFC4EC]">
                <Globe className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Language</p>
                <p className="text-[11px] text-[#8f80b8]">English (Nigeria)</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-[#8f80b8]" />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#6B4FA1]/30 bg-[#1c0b38]/60 p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FFD700]">
          Support &amp; Help
        </p>
        <div className="mt-3 flex flex-col gap-2.5">
          <a href="https://wa.me/2349048625847" target="_blank" rel="noreferrer" className="block">
            <Button className="w-full gap-2" size="lg">
              <LifeBuoy className="h-4 w-4" /> Contact Support
            </Button>
          </a>
          <p className="pt-1 text-center text-[11px] text-[#8f80b8]">
            Jovia Network is registered with Nigeria's CAC. Demo mode: data lives in your browser.
          </p>
        </div>
      </section>

      <Button
        variant="secondary"
        onClick={handleSignOut}
        className="w-full gap-2 border-[#FF5C5C]/35 text-[#FF8A8A] hover:bg-[#FF5C5C]/10"
      >
        <LogOut className="h-4 w-4" /> Sign out
      </Button>
      <p className="pb-2 text-center text-[10px] text-[#8f80b8]">
        © 2026 Jovia Network · Developed by DAG Group
      </p>
    </div>
  );
}
