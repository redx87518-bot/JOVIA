import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";

/**
 * Initializes a user profile document the first time a user is created
 * (including anonymous users). Then enriches it once the account has an email.
 */
export const initUser = internalMutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, { id, name, email }) => {
    const user = await ctx.db.get(id);
    if (user === null) return;

    const patch: Partial<Doc<"users">> = {};
    if (name && user.name === undefined) patch.name = name;
    if (email && user.email === undefined) patch.email = email;
    if (
      user.username === undefined &&
      (name || email)
    ) {
      patch.username =
        name ||
        (email ? email.split("@")[0] : `user${id.slice(-4)}`);
    }
    if (user.plan === undefined) patch.plan = "none";
    if (user.activationStatus === undefined) patch.activationStatus = "awaiting_payment";
    if (user.balance === undefined) patch.balance = 0;
    if (user.totalEarned === undefined) patch.totalEarned = 0;
    if (user.totalWithdrawn === undefined) patch.totalWithdrawn = 0;
    if (user.whatsappConnected === undefined) patch.whatsappConnected = false;

    await ctx.db.patch(id, patch);
  },
});

/** Public-ish stats used by the landing page counters. */
export const stats = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("platformStats")
      .withIndex("key", (q) => q.eq("key", "global"))
      .unique();
    if (existing) return existing;
    const id = await ctx.db.insert("platformStats", {
      key: "global",
      registeredUsers: 0,
      rewarded: 0,
      paidOutKobo: 0,
    });
    return await ctx.db.get(id as Id<"platformStats">);
  },
});

/** Seeds the activity catalog. Idempotent. */
export const seedActivities = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("activities").first();
    if (existing) return;

    const rows: Array<{
      slug: string;
      category: "games" | "videos" | "music" | "social" | "market";
      title: string;
      description: string;
      reward: number;
      rewardUnit: string;
      durationSeconds: number;
      accent: string;
      emoji: string;
    }> = [
      {
        slug: "celebrity-videos",
        category: "videos",
        title: "Celebrity Videos",
        description:
          "Watch selected celebrity and entertainment clips with countdown-based rewards.",
        reward: 10_000_00,
        rewardUnit: "hour watched",
        durationSeconds: 300,
        accent: "#FFD700",
        emoji: "🎬",
      },
      {
        slug: "fun-games-video",
        category: "videos",
        title: "Jovia Fun Games Video",
        description: "Featured game highlights — watch and earn by the minute.",
        reward: 10_000_00,
        rewardUnit: "hour watched",
        durationSeconds: 180,
        accent: "#FFD700",
        emoji: "📺",
      },
      {
        slug: "temple-run",
        category: "games",
        title: "Temple Run",
        description: "Run, dodge obstacles and keep your streak alive.",
        reward: 3_000_00,
        rewardUnit: "60 sec",
        durationSeconds: 60,
        accent: "#6B4FA1",
        emoji: "🏃",
      },
      {
        slug: "subway-surfers",
        category: "games",
        title: "Subway Surfers",
        description: "Jump, surf, dodge trains and keep running.",
        reward: 3_000_00,
        rewardUnit: "60 sec",
        durationSeconds: 60,
        accent: "#6B4FA1",
        emoji: "🛹",
      },
      {
        slug: "dream-league",
        category: "games",
        title: "Dream League",
        description: "Football action and competition on the go.",
        reward: 3_000_00,
        rewardUnit: "60 sec",
        durationSeconds: 60,
        accent: "#6B4FA1",
        emoji: "⚽",
      },
      {
        slug: "whatsapp-status",
        category: "social",
        title: "Status Upload",
        description: "Share a Jovia status to WhatsApp and earn per view.",
        reward: 1_500_00,
        rewardUnit: "view",
        durationSeconds: 90,
        accent: "#2EFF00",
        emoji: "🟢",
      },
      {
        slug: "chat-engagement",
        category: "social",
        title: "Chat Engagement",
        description: "Engage with community chats and earn per interaction.",
        reward: 500_00,
        rewardUnit: "engagement",
        durationSeconds: 120,
        accent: "#2EFF00",
        emoji: "💬",
      },
      {
        slug: "music-listening",
        category: "music",
        title: "Spotify Listening",
        description: "Stream featured tracks on Spotify and earn per listen.",
        reward: 1_500_00,
        rewardUnit: "per listening",
        durationSeconds: 240,
        accent: "#1DB954",
        emoji: "🎧",
      },
      {
        slug: "klofeshe-zinoleesky",
        category: "music",
        title: "Klofeshe — Zinoleesky",
        description: "Featured artist track of the week. Listen and earn.",
        reward: 1_500_00,
        rewardUnit: "per listening",
        durationSeconds: 240,
        accent: "#1DB954",
        emoji: "🎵",
      },
    ];

    for (const row of rows) {
      await ctx.db.insert("activities", { ...row, active: true });
    }
  },
});

/**
 * Ensures stats row and activity catalog exist. Call from a client component
 * once on mount; cheap and idempotent.
 */
export const ensureSeed = internalMutation({
  args: {},
  handler: async (ctx) => {
    const statsRow = await ctx.db
      .query("platformStats")
      .withIndex("key", (q) => q.eq("key", "global"))
      .unique();
    if (!statsRow) {
      await ctx.db.insert("platformStats", {
        key: "global",
        registeredUsers: 0,
        rewarded: 0,
        paidOutKobo: 0,
      });
    }
    const activities = await ctx.db.query("activities").first();
    if (!activities) {
      await ctx.runMutation(internal.bootstrap.seedActivities, {});
    }
  },
});
