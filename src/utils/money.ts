/** Formats a number the way Sauce Demo displays prices, e.g. 29.99 -> "$29.99". */
export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/** Rounds to 2 decimal places to avoid floating-point noise (0.1 + 0.2 = 0.30000000000000004). */
export function roundToCents(amount: number): number {
  return Math.round(amount * 100) / 100;
}
