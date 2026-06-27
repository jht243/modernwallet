// Shared formatting helpers — used by both build-time stat injection (Astro) and the React islands.

export function fmtUSD(n: number | null | undefined, opts: { cents?: boolean } = {}): string {
  if (n == null || !Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: opts.cents ? 2 : 0,
    maximumFractionDigits: opts.cents ? 2 : 0,
  });
}

export function fmtNum(n: number | null | undefined, decimals = 0): string {
  if (n == null || !Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function fmtPct(n: number | null | undefined, decimals = 2): string {
  if (n == null || !Number.isFinite(n)) return "—";
  return `${n.toFixed(decimals)}%`;
}

/** Capitalize the first letter of each word for display. Preserves existing caps, so acronyms
 *  already uppercase in the source (ROI, RMD) stay intact. Used for card titles / crumbs that
 *  render the lowercase targetKeyword. */
export function titleCase(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** "5 years 4 months" from a month count. */
export function fmtMonths(totalMonths: number | null | undefined): string {
  if (totalMonths == null || !Number.isFinite(totalMonths)) return "—";
  const m = Math.round(totalMonths);
  const years = Math.floor(m / 12);
  const months = m % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years === 1 ? "" : "s"}`);
  if (months > 0) parts.push(`${months} month${months === 1 ? "" : "s"}`);
  return parts.length ? parts.join(" ") : "0 months";
}
