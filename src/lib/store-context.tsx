import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ACTIVITIES,
  beginActivation,
  completeEarningSession,
  confirmActivation,
  ensureDemoStats,
  getNotifications,
  getCurrentUser,
  getPrivacyMode,
  getStats,
  getTransactions,
  getWithdrawals,
  markNotificationsRead,
  requestWithdrawal,
  saveBankDetails,
  setPrivacyMode,
  setWhatsappConnected,
  signIn,
  signUp,
  signOut as storeSignOut,
  startEarningSession,
  updateUsername,
  type Activity,
  type JoviaNotification,
  type JoviaUser,
  type Transaction,
  type Withdrawal,
} from "./store";

interface StoreContextValue {
  user: Omit<JoviaUser, "passwordHash"> | null;
  activities: Activity[];
  transactions: Transaction[];
  withdrawals: Withdrawal[];
  notifications: JoviaNotification[];
  stats: { registeredUsers: number; rewarded: number; paidOutKobo: number };
  privacyMode: boolean;
  version: number;
  actions: {
    signIn: (email: string, password: string) => void;
    signUp: (name: string, email: string, password: string) => void;
    signOut: () => void;
    updateUsername: (username: string) => void;
    beginActivation: (plan: "silver" | "gold") => { reference: string; amount: number };
    confirmActivation: (plan: "silver" | "gold", reference: string) => void;
    saveBankDetails: (details: { bankName: string; accountNumber: string; accountName: string }) => void;
    setWhatsappConnected: (connected: boolean) => void;
    requestWithdrawal: (amount: number) => void;
    startEarningSession: (activityId: string) => { endsAt: number };
    completeEarningSession: (sessionId: string) => number;
    markNotificationsRead: () => void;
    togglePrivacyMode: () => void;
  };
}

const StoreContext = createContext<StoreContextValue | null>(null);

/* Seed the demo stats before first paint so landing counters never flash 0.
   Idempotent: only writes when no stats are stored yet. */
let statsSeeded = false;
function seedDemoStatsOnce() {
  if (statsSeeded) return;
  ensureDemoStats();
  statsSeeded = true;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [version, setVersion] = useState(0);
  const [user, setUser] = useState(() => getCurrentUser());

  seedDemoStatsOnce();

  const bump = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    ensureDemoStats();
  }, []);

  // Keep `user` fresh whenever any store mutation bumps the version.
  useEffect(() => {
    setUser(getCurrentUser());
  }, [version]);

  const actions = useMemo(() => {
    const requireUser = () => {
      const current = getCurrentUser();
      if (!current) throw new Error("Not signed in");
      return current;
    };
    return {
      signIn: (email: string, password: string) => {
        signIn(email, password);
        bump();
      },
      signUp: (name: string, email: string, password: string) => {
        signUp(name, email, password);
        bump();
      },
      signOut: () => {
        storeSignOut();
        bump();
      },
      updateUsername: (username: string) => {
        updateUsername(requireUser().id, username);
        bump();
      },
      beginActivation: (plan: "silver" | "gold") => beginActivation(requireUser().id, plan),
      confirmActivation: (plan: "silver" | "gold", reference: string) => {
        confirmActivation(requireUser().id, plan, reference);
        bump();
      },
      saveBankDetails: (details: { bankName: string; accountNumber: string; accountName: string }) => {
        saveBankDetails(requireUser().id, details);
        bump();
      },
      setWhatsappConnected: (connected: boolean) => {
        setWhatsappConnected(requireUser().id, connected);
        bump();
      },
      requestWithdrawal: (amount: number) => {
        requestWithdrawal(requireUser().id, amount);
        bump();
      },
      startEarningSession: (activityId: string) => {
        const session = startEarningSession(requireUser().id, activityId);
        bump();
        return { endsAt: session.endsAt };
      },
      completeEarningSession: (sessionId: string) => {
        const reward = completeEarningSession(requireUser().id, sessionId);
        bump();
        return reward;
      },
      markNotificationsRead: () => {
        markNotificationsRead(requireUser().id);
        bump();
      },
      togglePrivacyMode: () => {
        setPrivacyMode(!getPrivacyMode());
        bump();
      },
    };
  }, [bump]);

  const value = useMemo<StoreContextValue>(
    () => ({
      user,
      activities: ACTIVITIES,
      transactions: user ? getTransactions(user.id) : [],
      withdrawals: user ? getWithdrawals(user.id) : [],
      notifications: user ? getNotifications(user.id) : [],
      stats: getStats(),
      privacyMode: getPrivacyMode(),
      version,
      actions,
    }),
    // getTransactions etc. read localStorage on each render of the provider,
    // which is cheap for demo data sizes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, version, actions]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
