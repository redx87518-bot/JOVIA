import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

export const listActivities = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("activities").withIndex("by_creation_time").collect();
  },
});

export const startSession = mutation({
  args: { activityId: v.id("activities") },
  handler: async (ctx, { activityId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");
    if (user.activationStatus !== "active") {
      throw new Error("Activate your account to start earning");
    }

    const activity = await ctx.db.get(activityId);
    if (!activity) throw new Error("Activity not found");

    const now = Date.now();
    const endsAt = now + activity.durationSeconds * 1000;

    // Abandon any dangling active sessions for this user.
    const active = await ctx.db
      .query("earningSessions")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();
    for (const s of active) {
      if (s.status === "active" && s.endsAt <= now) {
        await ctx.db.patch(s._id, { status: "abandoned" });
      }
    }

    const id = await ctx.db.insert("earningSessions", {
      userId,
      activityId,
      activityTitle: activity.title,
      reward: activity.reward,
      startedAt: now,
      endsAt,
      status: "active",
    });

    return { sessionId: id, endsAt, reward: activity.reward };
  },
});

/** Completes a session after its countdown has elapsed and credits the reward. */
export const completeSession = mutation({
  args: { sessionId: v.id("earningSessions") },
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const session = await ctx.db.get(sessionId);
    if (!session || session.userId !== userId) throw new Error("Session not found");
    if (session.status !== "active") return { credited: false };

    const now = Date.now();
    if (now < session.endsAt) {
      throw new Error("Countdown still running");
    }

    await ctx.db.patch(sessionId, { status: "completed", completedAt: now });

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const balance = (user.balance ?? 0) + session.reward;
    const totalEarned = (user.totalEarned ?? 0) + session.reward;

    await ctx.db.patch(userId, { balance, totalEarned });

    await ctx.db.insert("transactions", {
      userId,
      kind: "earn",
      title: session.activityTitle,
      detail: "Activity reward credited",
      amount: session.reward,
      createdAt: now,
    });

    await ctx.db.insert("notifications", {
      userId,
      title: "Reward credited 🎉",
      body: `₦${(session.reward / 100).toLocaleString("en-NG")} from ${session.activityTitle} is now in your available balance.`,
      createdAt: now,
    });

    await ctx.runMutation(internal.activities.bumpRewarded, {});

    return { credited: true, reward: session.reward, balance };
  },
});

export const mySessions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("earningSessions")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .order("desc")
      .take(20);
  },
});

export const myNotifications = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("notifications")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .order("desc")
      .take(20);
  },
});

export const markNotificationsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return;
    const rows = await ctx.db
      .query("notifications")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();
    for (const n of rows) {
      if (!n.read) await ctx.db.patch(n._id, { read: true });
    }
  },
});

export const myTransactions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("transactions")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .order("desc")
      .take(50);
  },
});

export const publicStats = query({
  args: {},
  handler: async (ctx) => {
    const row = await ctx.db
      .query("platformStats")
      .withIndex("key", (q) => q.eq("key", "global"))
      .unique();
    return (
      row ?? { registeredUsers: 0, rewarded: 0, paidOutKobo: 0 }
    );
  },
});

/** Bumps the global stats when a user registers (called from the auth page). */
export const bumpRegistered = internalMutation({
  args: {},
  handler: async (ctx) => {
    const row = await ctx.db
      .query("platformStats")
      .withIndex("key", (q) => q.eq("key", "global"))
      .unique();
    if (!row) return;
    await ctx.db.patch(row._id, { registeredUsers: row.registeredUsers + 1 });
  },
});

/** Counts one rewarded user event (activity reward credited). */
export const bumpRewarded = internalMutation({
  args: {},
  handler: async (ctx) => {
    const row = await ctx.db
      .query("platformStats")
      .withIndex("key", (q) => q.eq("key", "global"))
      .unique();
    if (!row) return;
    await ctx.db.patch(row._id, { rewarded: row.rewarded + 1 });
  },
});

/** Adds to the total paid out, in kobo (called on withdrawal requests). */
export const bumpPaidOut = internalMutation({
  args: { amountKobo: v.number() },
  handler: async (ctx, { amountKobo }) => {
    const row = await ctx.db
      .query("platformStats")
      .withIndex("key", (q) => q.eq("key", "global"))
      .unique();
    if (!row) return;
    await ctx.db.patch(row._id, { paidOutKobo: row.paidOutKobo + amountKobo });
  },
});

/** Public mutation: called once per fresh signup from the client. */
export const trackSignup = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return;
    const user = await ctx.db.get(userId);
    if (!user || user.balance !== undefined) return;
    await ctx.runMutation(internal.bootstrap.initUser, { id: userId });
    await ctx.runMutation(internal.activities.bumpRegistered, {});
  },
});

export const seedIfEmpty = mutation({
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
    const existing = await ctx.db.query("activities").first();
    if (existing) return { seeded: false };
    await ctx.runMutation(internal.bootstrap.seedActivities, {});
    return { seeded: true };
  },
});
