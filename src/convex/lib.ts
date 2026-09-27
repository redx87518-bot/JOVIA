import { QueryCtx, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const SILVER_PRICE = 9_000_00;
export const GOLD_PRICE = 15_000_00;

export function formatNaira(kobo: number): string {
  const naira = kobo / 100;
  return `₦${naira.toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;
}

export function shortNaira(kobo: number): string {
  const naira = kobo / 100;
  if (naira >= 1_000_000) return `₦${(naira / 1_000_000).toFixed(1)}M`;
  if (naira >= 1_000) return `₦${(naira / 1_000).toFixed(0)}K`;
  return `₦${naira}`;
}

export function planPrice(plan: "silver" | "gold"): number {
  return plan === "gold" ? GOLD_PRICE : SILVER_PRICE;
}

export function makeReference(userId: Id<"users">): string {
  const rand = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `JOV-${userId.slice(-6).toUpperCase()}-${rand}`;
}
