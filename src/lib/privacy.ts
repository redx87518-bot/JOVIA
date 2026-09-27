import { useSyncExternalStore } from "react";

/**
 * Tiny global store for privacy mode (masked balances) shared across screens.
 * Avoids prop drilling through the app shell.
 */
type PrivacyState = {
  privacyMode: boolean;
};

let state: PrivacyState = { privacyMode: true };
const listeners = new Set<() => void>();

function setState(next: Partial<PrivacyState>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function usePrivacyMode(): [boolean, (next: boolean) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => state.privacyMode,
    () => true
  );
  const setPrivacyMode = (next: boolean) => setState({ privacyMode: next });
  return [value, setPrivacyMode];
}

export function maskAmount(amount: string, hidden: boolean): string {
  return hidden ? "••••••" : amount;
}
