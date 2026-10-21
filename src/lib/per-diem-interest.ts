// Per diem interest / payoff amount engine (tool-usage pass 2026-10-21) — standalone, no React/DOM.
//
// Simple daily interest, the method lenders use for a payoff quote: per diem = principal × annual
// rate ÷ days in the year (365 for most consumer loans and mortgages; some lenders use a 360-day
// year — the loan note states which). Accrued interest = per diem × days since interest was last
// paid. Estimated payoff = principal + accrued interest. The lender's written payoff statement can
// add fees (recording, payoff-statement or prepayment charges) and is the binding figure.

export type DayBasis = 365 | 360;
export const DAY_BASES: DayBasis[] = [365, 360];

export interface PerDiemInput {
  principal: number;
  annualRatePct: number;
  dayBasis: DayBasis;
  /** Days of unpaid interest through the payoff date. */
  days: number;
}

export interface PerDiemResult {
  perDiem: number;
  accrued: number;
  payoff: number;
  /** Per diem on the other day basis, for comparison. */
  perDiemOtherBasis: number;
}

const clean = (v: number) => (Number.isFinite(v) ? Math.max(0, v) : 0);
const r2 = (v: number) => Math.round(v * 100) / 100;

export function computePerDiem(i: PerDiemInput): PerDiemResult {
  const p = clean(i.principal);
  const rate = clean(i.annualRatePct) / 100;
  const days = Math.round(clean(i.days));
  const raw = (p * rate) / i.dayBasis;
  const other: DayBasis = i.dayBasis === 365 ? 360 : 365;
  return { perDiem: r2(raw), accrued: r2(raw * days), payoff: r2(p + raw * days), perDiemOtherBasis: r2((p * rate) / other) };
}

/** Whole days from `from` to `to` (ISO yyyy-mm-dd), never negative; null if either is missing/invalid. */
export function daysBetween(from: string, to: string): number | null {
  const a = Date.parse(from + "T00:00:00Z");
  const b = Date.parse(to + "T00:00:00Z");
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return Math.max(0, Math.round((b - a) / 86400000));
}
