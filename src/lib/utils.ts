import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formats an amount stored in kobo as Naira. */
export function formatNaira(kobo: number, opts?: { compact?: boolean }): string {
  const naira = kobo / 100;
  if (opts?.compact) {
    if (Math.abs(naira) >= 1_000_000) return `₦${(naira / 1_000_000).toFixed(1)}M`;
    if (Math.abs(naira) >= 1_000) return `₦${(naira / 1_000).toFixed(naira >= 10_000 ? 0 : 1)}K`;
    return `₦${naira.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
  }
  return `₦${naira.toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;
}

export function initialsOf(name?: string | null): string {
  if (!name) return "J";
  const clean = name.trim();
  return clean.length > 0 ? clean[0].toUpperCase() : "J";
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
