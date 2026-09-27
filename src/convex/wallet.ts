import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

const MIN_WITHDRAWAL = 5_000_00; // ₦5,000

export const requestWithdrawal = mutation({
  args: { amount: v.number() },
  handler: async (ctx, { amount }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    if (!user.bankDetails) {
      throw new Error("Add your bank details before withdrawing");
    }
    if (!user.activationStatus || user.activationStatus !== "active") {
      throw new Error("Activate your account before withdrawing");
    }
    if (amount < MIN_WITHDRAWAL) {
      throw new Error(`Minimum withdrawal is ₦${(MIN_WITHDRAWAL / 100).toLocaleString("en-NG")}`);
    }
    const balance = user.balance ?? 0;
    if (amount > balance) {
      throw new Error("Insufficient available balance");
    }

    const now = Date.now();
    await ctx.db.patch(userId, {
      balance: balance - amount,
      totalWithdrawn: (user.totalWithdrawn ?? 0) + amount,
    });

    await ctx.db.insert("withdrawals", {
      userId,
      amount,
      bankName: user.bankDetails.bankName,
      accountNumber: user.bankDetails.accountNumber,
      accountName: user.bankDetails.accountName,
      status: "pending",
      createdAt: now,
    });

    await ctx.db.insert("transactions", {
      userId,
      kind: "withdrawal",
      title: "Withdrawal request",
      detail: `${user.bankDetails.bankName} • ${user.bankDetails.accountNumber}`,
      amount: -amount,
      createdAt: now,
    });

    await ctx.db.insert("notifications", {
      userId,
      title: "Withdrawal requested",
      body: `₦${(amount / 100).toLocaleString("en-NG")} transfer to ${user.bankDetails.bankName} is being processed.`,
      createdAt: now,
    });

    await ctx.runMutation(internal.activities.bumpPaidOut, { amountKobo: amount });

    return { ok: true };
  },
});

export const myWithdrawals = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("withdrawals")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .order("desc")
      .take(30);
  },
});
