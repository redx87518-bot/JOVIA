/**
 * Jovia demo store — a self-contained, database-free backend that persists in
 * localStorage. Users can create accounts, log in, activate (upgrade), run
 * earning sessions and request withdrawals entirely client-side.
 *
 * Amounts are stored in kobo (₦1 = 100 kobo).
 */

export type Plan = "none" | "silver" | "gold";
export type ActivationStatus = "awaiting_payment" | "active";

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface JoviaUser {
  id: string;
  name: string;
  email: string;
  username: string;
  plan: Plan;
  activationStatus: ActivationStatus;
  balance: number;
  totalEarned: number;
  totalWithdrawn: number;
  whatsappConnected: boolean;
  bankDetails: BankDetails | null;
  passwordHash: string;
  createdAt: number;
}

export interface Transaction {
  id: string;
  userId: string;
  kind: "earn" | "withdrawal" | "activation" | "bonus";
  title: string;
  detail?: string;
  amount: number;
  createdAt: number;
}

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: "pending" | "paid" | "failed";
  createdAt: number;
}

export interface JoviaNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: number;
}

export interface Activity {
  id: string;
  slug: string;
  category: "videos" | "games" | "music" | "social";
  title: string;
  description: string;
  reward: number;
  rewardUnit: string;
  durationSeconds: number;
  accent: string;
  emoji: string;
  image: string;
}

export interface EarningSessionRecord {
  id: string;
  userId: string;
  activityId: string;
  activityTitle: string;
  reward: number;
  startedAt: number;
  endsAt: number;
  status: "active" | "completed" | "abandoned";
}

export interface PlatformStats {
  registeredUsers: number;
  rewarded: number;
  paidOutKobo: number;
}

/* ------------------------------------------------------------------ */
/* Persistence helpers                                                 */
/* ------------------------------------------------------------------ */

const USERS_KEY = "jovia.users";
const SESSION_KEY = "jovia.currentUserId";
const TX_KEY = "jovia.transactions";
const WD_KEY = "jovia.withdrawals";
const NOTIF_KEY = "jovia.notifications";
const STATS_KEY = "jovia.stats";
const ESESSIONS_KEY = "jovia.earningSessions";
const PRIVACY_KEY = "jovia.privacyMode";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked — demo continues in memory.
  }
}

function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

/** Simple non-cryptographic hash for demo purposes only. */
function demoHash(input: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return `demo:${(h1 >>> 0).toString(36)}${(h2 >>> 0).toString(36)}`;
}

/* ------------------------------------------------------------------ */
/* Activities catalog (static demo data)                               */
/* ------------------------------------------------------------------ */

export const ACTIVITIES: Activity[] = [
  {
    id: "a_videos_featured",
    slug: "fun-games-video",
    category: "videos",
    title: "Jovia Fun Games Video",
    description: "Featured game highlights — watch and earn by the minute.",
    reward: 10_000_00,
    rewardUnit: "hour watched",
    durationSeconds: 180,
    accent: "#FFD700",
    emoji: "📺",
    image: "/images/jovia-games-preview.jpg",
  },
  {
    id: "a_videos_celebrity",
    slug: "celebrity-videos",
    category: "videos",
    title: "Celebrity Videos",
    description: "Watch selected celebrity and entertainment clips with countdown rewards.",
    reward: 10_000_00,
    rewardUnit: "hour watched",
    durationSeconds: 300,
    accent: "#FFD700",
    emoji: "🎬",
    image: "/images/jovia-celebrity-preview.jpg",
  },
  {
    id: "a_games_temple",
    slug: "temple-run",
    category: "games",
    title: "Temple Run",
    description: "Run, dodge obstacles and keep your streak alive.",
    reward: 3_000_00,
    rewardUnit: "60 sec",
    durationSeconds: 60,
    accent: "#6B4FA1",
    emoji: "🏃",
    image: "/images/icon-temple-run.jpg",
  },
  {
    id: "a_games_subway",
    slug: "subway-surfers",
    category: "games",
    title: "Subway Surfers",
    description: "Jump, surf, dodge trains and keep running.",
    reward: 3_000_00,
    rewardUnit: "60 sec",
    durationSeconds: 60,
    accent: "#6B4FA1",
    emoji: "🛹",
    image: "/images/icon-subway-surfers.jpg",
  },
  {
    id: "a_games_dream",
    slug: "dream-league",
    category: "games",
    title: "Dream League",
    description: "Football action and competition on the go.",
    reward: 3_000_00,
    rewardUnit: "60 sec",
    durationSeconds: 60,
    accent: "#6B4FA1",
    emoji: "⚽",
    image: "/images/icon-dream-league.jpg",
  },
  {
    id: "a_social_status",
    slug: "whatsapp-status",
    category: "social",
    title: "Status Upload",
    description: "Share a Jovia status to WhatsApp and earn per view.",
    reward: 1_500_00,
    rewardUnit: "view",
    durationSeconds: 90,
    accent: "#2EFF00",
    emoji: "🟢",
    image: "/images/icon-whatsapp.jpg",
  },
  {
    id: "a_social_chat",
    slug: "chat-engagement",
    category: "social",
    title: "Chat Engagement",
    description: "Engage with community chats and earn per interaction.",
    reward: 500_00,
    rewardUnit: "engagement",
    durationSeconds: 120,
    accent: "#2EFF00",
    emoji: "💬",
    image: "/images/hero-meta.jpg",
  },
  {
    id: "a_music_spotify",
    slug: "music-listening",
    category: "music",
    title: "Spotify Listening",
    description: "Stream featured tracks on Spotify and earn per listen.",
    reward: 1_500_00,
    rewardUnit: "per listening",
    durationSeconds: 240,
    accent: "#1DB954",
    emoji: "🎧",
    image: "/images/icon-spotify.jpg",
  },
  {
    id: "a_music_klofeshe",
    slug: "klofeshe-zinoleesky",
    category: "music",
    title: "Klofeshe — Zinoleesky",
    description: "Featured artist track of the week. Listen and earn.",
    reward: 1_500_00,
    rewardUnit: "per listening",
    durationSeconds: 240,
    accent: "#1DB954",
    emoji: "🎵",
    image: "/images/cover-kilofeshe.jpg",
  },
];

/* ------------------------------------------------------------------ */
/* Accounts                                                            */
/* ------------------------------------------------------------------ */

function publicUser(u: JoviaUser): Omit<JoviaUser, "passwordHash"> {
  const { passwordHash: _ignored, ...rest } = u;
  void _ignored;
  return rest;
}

export function getCurrentUser(): Omit<JoviaUser, "passwordHash"> | null {
  const id = read<string | null>(SESSION_KEY, null);
  if (!id) return null;
  const users = read<JoviaUser[]>(USERS_KEY, []);
  const found = users.find((u) => u.id === id);
  return found ? publicUser(found) : null;
}

export function signUp(
  name: string,
  email: string,
  password: string,
  plan: "silver" | "gold" | null = null
): JoviaUser {
  const users = read<JoviaUser[]>(USERS_KEY, []);
  const normalized = email.trim().toLowerCase();
  if (users.some((u) => u.email === normalized)) {
    throw new Error("An account with this email already exists");
  }
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }
  const user: JoviaUser = {
    id: uid("u"),
    name: name.trim(),
    email: normalized,
    username: name.trim().split(" ")[0] || normalized.split("@")[0],
    // The plan picked at signup is remembered so the activation flow can
    // reference it (e.g. in the prefilled Telegram message) before payment.
    plan: plan ?? "none",
    activationStatus: "awaiting_payment",
    balance: 0,
    totalEarned: 0,
    totalWithdrawn: 0,
    whatsappConnected: false,
    bankDetails: null,
    passwordHash: demoHash(`${normalized}:${password}`),
    createdAt: Date.now(),
  };
  users.push(user);
  write(USERS_KEY, users);
  write(SESSION_KEY, user.id);

  const stats = read<PlatformStats>(STATS_KEY, { registeredUsers: 0, rewarded: 0, paidOutKobo: 0 });
  stats.registeredUsers += 1;
  write(STATS_KEY, stats);

  pushNotification(user.id, "Welcome to Jovia 🎉", "Activate your account to unlock every earning activity.");
  return user;
}

export function signIn(email: string, password: string): JoviaUser {
  const users = read<JoviaUser[]>(USERS_KEY, []);
  const normalized = email.trim().toLowerCase();
  const user = users.find((u) => u.email === normalized);
  if (!user || user.passwordHash !== demoHash(`${normalized}:${password}`)) {
    throw new Error("Invalid email or password");
  }
  write(SESSION_KEY, user.id);
  return user;
}

export function signOut(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

export function updateUsername(userId: string, username: string): void {
  const users = read<JoviaUser[]>(USERS_KEY, []);
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");
  const clean = username.trim();
  if (clean.length < 3 || clean.length > 24) {
    throw new Error("Username must be between 3 and 24 characters");
  }
  user.username = clean;
  write(USERS_KEY, users);
}

/* ------------------------------------------------------------------ */
/* Activation (upgrade)                                                */
/* ------------------------------------------------------------------ */

export const PLAN_PRICES: Record<"silver" | "gold", number> = {
  silver: 9_000_00,
  gold: 15_000_00,
};

export function beginActivation(userId: string, plan: "silver" | "gold"): { reference: string; amount: number } {
  const user = findUser(userId);
  if (user.activationStatus === "active") throw new Error("Your account is already active");
  const reference = `JOV-${userId.slice(-6).toUpperCase()}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
  const amount = PLAN_PRICES[plan];
  pushNotification(
    userId,
    "Activation started",
    `Your ${plan === "gold" ? "Gold" : "Silver"} activation reference ${reference} is ready.`
  );
  return { reference, amount };
}

export function confirmActivation(
  userId: string,
  plan: "silver" | "gold",
  reference: string
): void {
  const users = read<JoviaUser[]>(USERS_KEY, []);
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");
  user.plan = plan;
  user.activationStatus = "active";
  write(USERS_KEY, users);

  addTransaction(userId, "activation", `Jovia ${plan === "gold" ? "Gold" : "Silver"} activation`, `Reference ${reference}`, -PLAN_PRICES[plan]);
  pushNotification(userId, "Account activated 🎉", `Welcome to Jovia ${plan === "gold" ? "Gold" : "Silver"}! All activities are now unlocked.`);
}

/* ------------------------------------------------------------------ */
/* Activation payment details & Telegram handoff                       */
/* ------------------------------------------------------------------ */

/** Members pay the one-time activation fee into this account. */
export const PAYMENT_ACCOUNT = {
  bankName: "Opay",
  accountNumber: "8149947771",
  accountName: "Suleman Kasim",
} as const;

/** Jovia support on Telegram — activation payments are confirmed here. */
export const TELEGRAM_SUPPORT_URL = "https://t.me/Jovia_Limited";

export function planLabel(plan: "silver" | "gold"): string {
  return plan === "gold" ? "Jovia Gold (₦15,000)" : "Jovia Silver (₦9,000)";
}

/**
 * Prefilled message for Jovia support on Telegram: the activation notice
 * followed by the plan and every signup detail — except the password.
 */
export function buildActivationMessage(
  user: Pick<JoviaUser, "name" | "email" | "username">,
  plan: "silver" | "gold",
  reference: string
): string {
  const label = planLabel(plan);
  return [
    `Jovia support I've made an activational payment of ${label}`,
    "",
    `Name: ${user.name}`,
    `Email: ${user.email}`,
    `Username: ${user.username}`,
    `Plan: ${label}`,
    `Amount: ₦${(PLAN_PRICES[plan] / 100).toLocaleString("en-NG")}`,
    `Reference: ${reference}`,
  ].join("\n");
}

/* ------------------------------------------------------------------ */
/* Wallet                                                              */
/* ------------------------------------------------------------------ */

export function saveBankDetails(
  userId: string,
  details: { bankName: string; accountNumber: string; accountName: string }
): void {
  if (!/^\d{10}$/.test(details.accountNumber)) {
    throw new Error("Account number must be 10 digits");
  }
  const users = read<JoviaUser[]>(USERS_KEY, []);
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");
  user.bankDetails = details;
  write(USERS_KEY, users);
}

export function setWhatsappConnected(userId: string, connected: boolean): void {
  const users = read<JoviaUser[]>(USERS_KEY, []);
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");
  user.whatsappConnected = connected;
  write(USERS_KEY, users);
}

const MIN_WITHDRAWAL = 5_000_00;

export function requestWithdrawal(userId: string, amount: number): void {
  const users = read<JoviaUser[]>(USERS_KEY, []);
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");
  if (!user.bankDetails) throw new Error("Add your bank details before withdrawing");
  if (user.activationStatus !== "active") {
    throw new Error("Activate your account before withdrawing");
  }
  if (amount < MIN_WITHDRAWAL) {
    throw new Error(`Minimum withdrawal is ₦${(MIN_WITHDRAWAL / 100).toLocaleString("en-NG")}`);
  }
  if (amount > user.balance) throw new Error("Insufficient available balance");

  user.balance -= amount;
  user.totalWithdrawn += amount;
  write(USERS_KEY, users);

  const withdrawals = read<Withdrawal[]>(WD_KEY, []);
  withdrawals.unshift({
    id: uid("w"),
    userId,
    amount,
    bankName: user.bankDetails.bankName,
    accountNumber: user.bankDetails.accountNumber,
    accountName: user.bankDetails.accountName,
    status: "pending",
    createdAt: Date.now(),
  });
  write(WD_KEY, withdrawals);

  addTransaction(userId, "withdrawal", "Withdrawal request", `${user.bankDetails.bankName} • ${user.bankDetails.accountNumber}`, -amount);
  pushNotification(userId, "Withdrawal requested", `₦${(amount / 100).toLocaleString("en-NG")} transfer to ${user.bankDetails.bankName} is being processed.`);

  const stats = read<PlatformStats>(STATS_KEY, { registeredUsers: 0, rewarded: 0, paidOutKobo: 0 });
  stats.paidOutKobo += amount;
  write(STATS_KEY, stats);
}

/* ------------------------------------------------------------------ */
/* Earning sessions                                                    */
/* ------------------------------------------------------------------ */

export function startEarningSession(userId: string, activityId: string): EarningSessionRecord {
  const user = findUser(userId);
  if (user.activationStatus !== "active") {
    throw new Error("Activate your account to start earning");
  }
  const activity = ACTIVITIES.find((a) => a.id === activityId);
  if (!activity) throw new Error("Activity not found");

  // Abandon stale active sessions.
  const sessions = read<EarningSessionRecord[]>(ESESSIONS_KEY, []);
  for (const s of sessions) {
    if (s.userId === userId && s.status === "active" && s.endsAt <= Date.now()) {
      s.status = "abandoned";
    }
  }
  const record: EarningSessionRecord = {
    id: uid("s"),
    userId,
    activityId,
    activityTitle: activity.title,
    reward: activity.reward,
    startedAt: Date.now(),
    endsAt: Date.now() + activity.durationSeconds * 1000,
    status: "active",
  };
  sessions.unshift(record);
  write(ESESSIONS_KEY, sessions);
  return record;
}

export function completeEarningSession(userId: string, sessionId: string): number {
  const sessions = read<EarningSessionRecord[]>(ESESSIONS_KEY, []);
  const session = sessions.find((s) => s.id === sessionId && s.userId === userId);
  if (!session) throw new Error("Session not found");
  if (session.status !== "active") throw new Error("Session already handled");
  if (Date.now() < session.endsAt) throw new Error("Countdown still running");

  session.status = "completed";
  write(ESESSIONS_KEY, sessions);

  const users = read<JoviaUser[]>(USERS_KEY, []);
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");
  user.balance += session.reward;
  user.totalEarned += session.reward;
  write(USERS_KEY, users);

  addTransaction(userId, "earn", session.activityTitle, "Activity reward credited", session.reward);
  pushNotification(userId, "Reward credited 🎉", `₦${(session.reward / 100).toLocaleString("en-NG")} from ${session.activityTitle} is now in your balance.`);

  const stats = read<PlatformStats>(STATS_KEY, { registeredUsers: 0, rewarded: 0, paidOutKobo: 0 });
  stats.rewarded += 1;
  write(STATS_KEY, stats);

  return session.reward;
}

/* ------------------------------------------------------------------ */
/* Transactions, notifications, stats                                  */
/* ------------------------------------------------------------------ */

function addTransaction(
  userId: string,
  kind: Transaction["kind"],
  title: string,
  detail: string | undefined,
  amount: number
): void {
  const txs = read<Transaction[]>(TX_KEY, []);
  txs.unshift({ id: uid("t"), userId, kind, title, detail, amount, createdAt: Date.now() });
  write(TX_KEY, txs.slice(0, 100));
}

export function getTransactions(userId: string): Transaction[] {
  return read<Transaction[]>(TX_KEY, []).filter((t) => t.userId === userId);
}

export function getWithdrawals(userId: string): Withdrawal[] {
  return read<Withdrawal[]>(WD_KEY, []).filter((w) => w.userId === userId);
}

function pushNotification(userId: string, title: string, body: string): void {
  const all = read<JoviaNotification[]>(NOTIF_KEY, []);
  all.unshift({ id: uid("n"), userId, title, body, read: false, createdAt: Date.now() });
  write(NOTIF_KEY, all.slice(0, 60));
}

export function getNotifications(userId: string): JoviaNotification[] {
  return read<JoviaNotification[]>(NOTIF_KEY, []).filter((n) => n.userId === userId);
}

export function markNotificationsRead(userId: string): void {
  const all = read<JoviaNotification[]>(NOTIF_KEY, []);
  for (const n of all) if (n.userId === userId) n.read = true;
  write(NOTIF_KEY, all);
}

export function getStats(): PlatformStats {
  return read<PlatformStats>(STATS_KEY, {
    registeredUsers: 0,
    rewarded: 0,
    paidOutKobo: 0,
  });
}

/** Demo baseline so the landing counters tell a launch story. */
export function ensureDemoStats(): PlatformStats {
  const stats = getStats();
  if (stats.registeredUsers === 0) {
    const seeded: PlatformStats = {
      registeredUsers: 200_000,
      rewarded: 150_000,
      paidOutKobo: 300_000_000 * 100, // ₦300M in kobo
    };
    write(STATS_KEY, seeded);
    return seeded;
  }
  return stats;
}

/* ------------------------------------------------------------------ */
/* Privacy mode                                                        */
/* ------------------------------------------------------------------ */

export function getPrivacyMode(): boolean {
  return read<boolean>(PRIVACY_KEY, true);
}

export function setPrivacyMode(value: boolean): void {
  write(PRIVACY_KEY, value);
}

function findUser(userId: string): JoviaUser {
  const users = read<JoviaUser[]>(USERS_KEY, []);
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");
  return user;
}
