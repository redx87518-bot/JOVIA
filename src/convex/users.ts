import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";
import { planPrice, makeReference } from "./lib";

export const me = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    if (!user) return null;
    return {
      _id: user._id,
      name: user.name ?? null,
      email: user.email ?? null,
      username: user.username ?? user.name ?? "Jovia user",
      plan: user.plan ?? "none",
      activationStatus: user.activationStatus ?? "awaiting_payment",
      balance: user.balance ?? 0,
      totalEarned: user.totalEarned ?? 0,
      totalWithdrawn: user.totalWithdrawn ?? 0,
      whatsappConnected: user.whatsappConnected ?? false,
      bankDetails: user.bankDetails ?? null,
    };
  },
});

/** Begins activation: creates a reference and marks the account as awaiting payment. */
export const beginActivation = mutation({
  args: { plan: v.union(v.literal("silver"), v.literal("gold")) },
  handler: async (ctx, { plan }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");
    if (user.activationStatus === "active") {
      throw new Error("Your account is already active");
    }

    const amount = planPrice(plan);
    const reference = makeReference(userId);

    await ctx.db.insert("activationRequests", {
      userId,
      plan,
      amount,
      reference,
      status: "awaiting_payment",
      createdAt: Date.now(),
    });

    await ctx.db.patch(userId, { activationStatus: "awaiting_payment" });

    await ctx.db.insert("notifications", {
      userId,
      title: "Activation started",
      body: `Your ${plan === "gold" ? "Gold" : "Silver"} activation reference ${reference} is ready. Complete payment to unlock all activities.`,
      createdAt: Date.now(),
    });

    return { reference, amount };
  },
});

/**
 * Confirms activation payment. In production this would verify a webhook from
 * the payment gateway; here it completes the JOVIA payment flow.
 */
export const confirmActivation = mutation({
  args: { reference: v.string() },
  handler: async (ctx, { reference }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const request = await ctx.db
      .query("activationRequests")
      .withIndex("reference", (q) => q.eq("reference", reference))
      .unique();
    if (!request || request.userId !== userId) {
      throw new Error("Activation request not found");
    }
    if (request.status === "active") return { ok: true };

    await ctx.db.patch(request._id, { status: "active", confirmedAt: Date.now() });
    await ctx.db.patch(userId, { activationStatus: "active", plan: request.plan });

    await ctx.db.insert("transactions", {
      userId,
      kind: "activation",
      title: `Jovia ${request.plan === "gold" ? "Gold" : "Silver"} activation`,
      detail: `Reference ${request.reference}`,
      amount: -request.amount,
      createdAt: Date.now(),
    });

    await ctx.db.insert("notifications", {
      userId,
      title: "Account activated 🎉",
      body: `Welcome to Jovia ${request.plan === "gold" ? "Gold" : "Silver"}! Music, games, celebrity videos and the marketplace are now unlocked.`,
      createdAt: Date.now(),
    });

    return { ok: true };
  },
});

export const saveBankDetails = mutation({
  args: {
    bankName: v.string(),
    bankCode: v.optional(v.string()),
    accountNumber: v.string(),
    accountName: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    if (!/^\d{10}$/.test(args.accountNumber)) {
      throw new Error("Account number must be 10 digits");
    }
    await ctx.db.patch(userId, { bankDetails: args });
    return { ok: true };
  },
});

export const connectWhatsApp = mutation({
  args: { connected: v.boolean() },
  handler: async (ctx, { connected }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    await ctx.db.patch(userId, { whatsappConnected: connected });
    return { ok: true };
  },
});

export const updateUsername = mutation({
  args: { username: v.string() },
  handler: async (ctx, { username }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const clean = username.trim();
    if (clean.length < 3 || clean.length > 24) {
      throw new Error("Username must be between 3 and 24 characters");
    }
    await ctx.db.patch(userId, { username: clean });
    return { ok: true };
  },
});

export const latestActivation = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const rows = await ctx.db
      .query("activationRequests")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();
    if (rows.length === 0) return null;
    rows.sort((a, b) => b.createdAt - a.createdAt);
    const latest = rows[0];
    return {
      reference: latest.reference,
      amount: latest.amount,
      plan: latest.plan,
      status: latest.status,
    };
  },
});

export const initializeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    if (!user) return null;
    if (user.balance !== undefined) return { initialized: true };
    await ctx.runMutation(internal.bootstrap.initUser, {
      id: userId,
      name: user.name,
      email: user.email,
    });
    return { initialized: true };
  },
});
