import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  ShoppingBag,
  UserRound,
  Wallet as WalletIcon,
  X,
  Zap,
} from "lucide-react";
import { useStore } from "@/lib/store-context";
import { JoviaMark, JoviaLogo } from "@/components/JoviaLogo";
import { Button } from "@/components/ui/button";
import { cn, initialsOf, timeAgo } from "@/lib/utils";
import DashboardTab from "./screens/Dashboard";
import TasksTab from "./screens/Tasks";
import WalletTab from "./screens/Wallet";
import MarketTab from "./screens/Market";
import ProfileTab from "./screens/Profile";
import EarningSession, { type SessionActivity } from "./EarningSession";

export type TabId = "dashboard" | "tasks" | "wallet" | "market" | "profile";

const TABS: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "tasks", label: "Tasks", icon: Zap },
  { id: "wallet", label: "Wallet", icon: WalletIcon },
  { id: "market", label: "Market", icon: ShoppingBag },
  { id: "profile", label: "Profile", icon: UserRound },
];

function useClock(): string {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(t);
  }, []);
  return useMemo(
    () =>
      now.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: false }),
    [now]
  );
}

function StatusBar() {
  const time = useClock();
  return (
    <div className="flex items-center justify-between px-5 pt-3 text-[11px] font-semibold text-white/90">
      <span>{time}</span>
      <div className="flex items-center gap-1.5" aria-hidden="true">
        <svg viewBox="0 0 18 12" className="h-3 w-4 fill-current">
          <rect x="0" y="8" width="3" height="4" rx="0.8" />
          <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.8" />
          <rect x="9" y="3" width="3" height="9" rx="0.8" />
          <rect x="13.5" y="0.5" width="3" height="11.5" rx="0.8" opacity="0.45" />
        </svg>
        <svg viewBox="0 0 16 12" className="h-3 w-4 fill-none stroke-current" strokeWidth="1.6">
          <path d="M1 4.5a10 10 0 0 1 14 0" strokeLinecap="round" />
          <path d="M3.5 7a6.5 6.5 0 0 1 9 0" strokeLinecap="round" />
          <circle cx="8" cy="10" r="1.2" className="fill-current stroke-none" />
        </svg>
        <svg viewBox="0 0 25 12" className="h-3 w-6">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3" className="fill-none stroke-current" opacity="0.5" />
          <rect x="2" y="2" width="15" height="8" rx="1.8" className="fill-current" />
          <rect x="22.5" y="3.5" width="2" height="5" rx="1" className="fill-current" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

export default function AppShell() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { user, notifications, actions } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [sessionActivity, setSessionActivity] = useState<SessionActivity | null>(null);

  const tab = (params.get("tab") as TabId | null) ?? "dashboard";

  const setTab = (next: TabId) => {
    setParams(next === "dashboard" ? {} : { tab: next }, { replace: true });
  };

  const unread = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  async function handleSignOut() {
    actions.signOut();
    navigate("/", { replace: true });
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center sm:p-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden sm:block">
        <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6B4FA1]/20 blur-[150px]" />
      </div>

      <div className="relative flex h-[100dvh] w-full max-w-[420px] flex-col overflow-hidden bg-[#0F0515] sm:h-[min(880px,94vh)] sm:rounded-[2.6rem] sm:border sm:border-[#6B4FA1]/35 sm:shadow-phone">
        <StatusBar />

        <header className="flex items-center justify-between px-5 py-3">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#6B4FA1]/35 text-white"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <JoviaMark className="h-8 w-8 rounded-lg" />
            <span className="font-display text-sm font-extrabold tracking-wide text-white">
              JOVIA <span className="text-[#FFD700]">NETWORK</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setNotifOpen(true)}
              aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#6B4FA1]/35 text-white"
            >
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF5C5C] px-1 text-[10px] font-bold text-white ring-2 ring-[#0F0515]">
                  {unread}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setTab("profile")}
              aria-label="Open profile"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFD700] font-display text-sm font-extrabold text-[#16032f]"
            >
              {initialsOf(user?.username)}
            </button>
          </div>
        </header>

        <main className="no-scrollbar relative flex-1 overflow-y-auto px-5 pb-28">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {tab === "dashboard" && (
                <DashboardTab onGoWallet={() => setTab("wallet")} onGoTasks={() => setTab("tasks")} />
              )}
              {tab === "tasks" && (
                <TasksTab
                  onStartSession={(a) => setSessionActivity(a)}
                  onGoWallet={() => setTab("wallet")}
                />
              )}
              {tab === "wallet" && <WalletTab />}
              {tab === "market" && <MarketTab onStartSession={(a) => setSessionActivity(a)} />}
              {tab === "profile" && <ProfileTab />}
            </motion.div>
          </AnimatePresence>
        </main>

        <nav
          aria-label="App navigation"
          className="safe-bottom absolute inset-x-0 bottom-0 z-20 border-t border-[#6B4FA1]/30 bg-[#16032f]/92 px-2 pb-2 pt-1.5 backdrop-blur-xl"
        >
          <ul className="flex items-stretch justify-between">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <li key={t.id} className="flex-1">
                  <button
                    type="button"
                    onClick={() => setTab(t.id)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex w-full flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-semibold transition-all",
                      active
                        ? "bg-[#6B4FA1]/35 text-[#FFD700]"
                        : "text-[#8f80b8] hover:text-[#CFC4EC]"
                    )}
                  >
                    <t.icon
                      className={cn("h-5 w-5", active && "drop-shadow-[0_0_8px_rgba(255,215,0,0.45)]")}
                    />
                    {t.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Side drawer */}
        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm"
                onClick={() => setMenuOpen(false)}
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 26, stiffness: 280 }}
                className="absolute inset-y-0 left-0 z-40 flex w-[78%] max-w-xs flex-col border-r border-[#6B4FA1]/30 bg-[#16032f]/97 p-5 backdrop-blur-xl"
                aria-label="App menu"
              >
                <div className="flex items-center justify-between">
                  <JoviaLogo />
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    aria-label="Close menu"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#6B4FA1]/40 text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {user && (
                  <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#6B4FA1]/35 bg-[#0F0515]/60 p-3.5">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFD700] font-display text-base font-extrabold text-[#16032f]">
                      {initialsOf(user.username)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-white">{user.username}</p>
                      <p className="truncate text-xs text-[#8f80b8]">
                        {user.plan === "gold"
                          ? "Jovia Gold member"
                          : user.plan === "silver"
                            ? "Jovia Silver member"
                            : "Not activated"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-1.5">
                  {TABS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setTab(t.id);
                        setMenuOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors",
                        tab === t.id
                          ? "bg-[#6B4FA1]/30 text-[#FFD700]"
                          : "text-[#E9E3F9] hover:bg-[#6B4FA1]/20"
                      )}
                    >
                      <t.icon className="h-4 w-4" />
                      {t.label}
                      <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setTab("wallet");
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-[#E9E3F9] transition-colors hover:bg-[#6B4FA1]/20"
                  >
                    <CreditCard className="h-4 w-4" /> Activate account
                    <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                  </button>
                </div>

                <div className="mt-auto flex flex-col gap-2 pt-4">
                  <a
                    href="https://wa.me/2349048625847"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-[#E9E3F9] transition-colors hover:bg-[#6B4FA1]/20"
                  >
                    <MessageCircle className="h-4 w-4 text-[#25D366]" /> Support on WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-[#FF8A8A] transition-colors hover:bg-[#FF5C5C]/10"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                  <p className="px-1 pt-2 text-[10px] text-[#8f80b8]">
                    Jovia Network · CAC registered · © 2026
                  </p>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Notifications panel */}
        <AnimatePresence>
          {notifOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm"
                onClick={() => setNotifOpen(false)}
              />
              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 26, stiffness: 280 }}
                className="absolute inset-y-0 right-0 z-40 flex w-[84%] max-w-sm flex-col border-l border-[#6B4FA1]/30 bg-[#16032f]/97 backdrop-blur-xl"
                aria-label="Notifications"
              >
                <div className="flex items-center justify-between border-b border-[#6B4FA1]/25 p-5">
                  <p className="font-display text-base font-bold text-white">Notifications</p>
                  <button
                    type="button"
                    onClick={() => setNotifOpen(false)}
                    aria-label="Close notifications"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#6B4FA1]/40 text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="no-scrollbar flex-1 overflow-y-auto p-4">
                  {notifications.length === 0 && (
                    <div className="flex flex-col items-center gap-3 pt-16 text-center">
                      <Bell className="h-8 w-8 text-[#6B4FA1]" />
                      <p className="text-sm text-[#8f80b8]">
                        No notifications yet. Start an activity to see updates here.
                      </p>
                    </div>
                  )}
                  <div className="flex flex-col gap-2.5">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          "rounded-2xl border p-4",
                          n.read
                            ? "border-[#6B4FA1]/25 bg-[#0F0515]/50"
                            : "border-[#FFD700]/35 bg-[#FFD700]/[0.06]"
                        )}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-bold text-white">{n.title}</p>
                          {!n.read && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-[#FFD700]" />
                          )}
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-[#B9A6E8]">{n.body}</p>
                        <p className="mt-2 text-[10px] uppercase tracking-wider text-[#8f80b8]">
                          {timeAgo(n.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                {unread > 0 && (
                  <div className="border-t border-[#6B4FA1]/25 p-4">
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => {
                        actions.markNotificationsRead();
                        setNotifOpen(false);
                      }}
                    >
                      Mark all as read
                    </Button>
                  </div>
                )}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {sessionActivity && (
          <EarningSession activity={sessionActivity} onClose={() => setSessionActivity(null)} />
        )}
      </div>
    </div>
  );
}
