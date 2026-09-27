import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    image: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    // Jovia profile fields
    username: v.optional(v.string()),
    plan: v.optional(v.union(v.literal("none"), v.literal("silver"), v.literal("gold"))),
    activationStatus: v.optional(v.union(v.literal("pending"), v.literal("awaiting_payment"), v.literal("active"))),
    balance: v.optional(v.number()), // in kobo
    totalEarned: v.optional(v.number()),
    totalWithdrawn: v.optional(v.number()),
    whatsappConnected: v.optional(v.boolean()),
    bankDetails: v.optional(
      v.object({
        bankName: v.string(),
        bankCode: v.optional(v.string()),
        accountNumber: v.string(),
        accountName: v.string(),
      })
    ),
  })
    .index("email", ["email"])
    .index("username", ["username"]),

  activationRequests: defineTable({
    userId: v.id("users"),
    plan: v.union(v.literal("silver"), v.literal("gold")),
    amount: v.number(), // kobo
    reference: v.string(),
    status: v.union(
      v.literal("awaiting_payment"),
      v.literal("confirming"),
      v.literal("active")
    ),
    createdAt: v.number(),
    confirmedAt: v.optional(v.number()),
  })
    .index("userId", ["userId"])
    .index("reference", ["reference"]),

  transactions: defineTable({
    userId: v.id("users"),
    kind: v.union(
      v.literal("earn"),
      v.literal("withdrawal"),
      v.literal("activation"),
      v.literal("bonus")
    ),
    title: v.string(),
    detail: v.optional(v.string()),
    amount: v.number(), // positive = credit, negative = debit (kobo)
    createdAt: v.number(),
  }).index("userId", ["userId"]),

  activities: defineTable({
    slug: v.string(),
    category: v.union(
      v.literal("games"),
      v.literal("videos"),
      v.literal("music"),
      v.literal("social"),
      v.literal("market")
    ),
    title: v.string(),
    description: v.string(),
    reward: v.number(), // kobo
    rewardUnit: v.string(), // e.g. "60 sec", "hour watched", "per listening"
    durationSeconds: v.number(),
    accent: v.string(),
    emoji: v.string(),
    active: v.optional(v.boolean()),
  })
    .index("slug", ["slug"])
    .index("category", ["category"]),

  earningSessions: defineTable({
    userId: v.id("users"),
    activityId: v.id("activities"),
    activityTitle: v.string(),
    reward: v.number(),
    startedAt: v.number(),
    endsAt: v.number(),
    status: v.union(v.literal("active"), v.literal("completed"), v.literal("abandoned")),
    completedAt: v.optional(v.number()),
  })
    .index("userId", ["userId"])
    .index("status", ["status"]),

  notifications: defineTable({
    userId: v.id("users"),
    title: v.string(),
    body: v.string(),
    read: v.optional(v.boolean()),
    createdAt: v.number(),
  }).index("userId", ["userId"]),

  withdrawals: defineTable({
    userId: v.id("users"),
    amount: v.number(),
    bankName: v.string(),
    accountNumber: v.string(),
    accountName: v.string(),
    status: v.union(v.literal("pending"), v.literal("paid"), v.literal("failed")),
    createdAt: v.number(),
  }).index("userId", ["userId"]),

  platformStats: defineTable({
    key: v.string(),
    registeredUsers: v.number(),
    rewarded: v.number(),
    paidOutKobo: v.number(),
  }).index("key", ["key"]),
});
