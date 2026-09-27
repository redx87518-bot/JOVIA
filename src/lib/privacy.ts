/** Masks a formatted amount with dots when privacy mode is on. */
export function maskAmount(amount: string, hidden: boolean): string {
  return hidden ? "••••••" : amount;
}
