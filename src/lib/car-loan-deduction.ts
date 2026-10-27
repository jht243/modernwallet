// Car loan interest deduction engine (X-trends pass 2026-10-27) — standalone, no React/DOM.
//
// Scope: the qualified passenger vehicle loan interest (QPVLI) deduction for tax years 2025 through 2028,
// federal return only. The arithmetic below is the arithmetic of Schedule 1-A (Form 1040), Part IV, lines 24
// through 30 (2025 form, IRS, created 11/4/25):
//   line 24  smaller of the interest paid or $10,000
//   line 26  $100,000 ($200,000 if married filing jointly)
//   line 27  modified adjusted gross income (Schedule 1-A line 3) minus line 26; if zero or less, no reduction
//   line 28  line 27 divided by $1,000, rounded UP to the next whole number
//   line 29  line 28 times $200
//   line 30  line 24 minus line 29, never below zero
// Vehicle and loan eligibility (new, personal use, final assembly in the U.S., under 14,000 lbs GVWR, bought
// after 2024) is described in IRS Publication 6126 and is NOT decided here: the reader confirms it.
// Not modeled: state tax, the standard-vs-itemized choice (the deduction is allowed to both), interest already
// deducted on Schedule C, E or F, and the other Schedule 1-A deductions.

export type CliStatus = "single" | "mfj" | "mfs" | "hoh";

/** Annual cap on the deduction (Schedule 1-A line 24; IRS Publication 6126). */
export const DEDUCTION_CAP = 10000;
/** MAGI above which the phase-out starts (Schedule 1-A line 26). */
export const PHASE_OUT_START: Record<CliStatus, number> = { single: 100000, mfj: 200000, mfs: 100000, hoh: 100000 };
/** Each $1,000 (or part of $1,000) of MAGI over the start cuts the deduction by this much (line 29). */
export const REDUCTION_PER_STEP = 200;
/** Size of one reduction step in MAGI dollars (line 28). */
export const STEP_SIZE = 1000;

export interface CliInput {
  status: CliStatus;
  /** Modified adjusted gross income, as defined for Schedule 1-A line 3. */
  magi: number;
  /** Qualified loan interest paid in the tax year, net of any amount deducted on Schedule C, E or F. */
  interestPaid: number;
  /** The reader's federal marginal rate, as a percent (e.g. 22). */
  marginalRatePct: number;
}

export interface CliResult {
  /** Line 24: min(interest paid, $10,000). */
  capped: number;
  /** Line 27: MAGI over the start of the phase-out, never below 0. */
  excess: number;
  /** Line 28: excess divided by $1,000, rounded up. */
  steps: number;
  /** Line 29: steps times $200. */
  reduction: number;
  /** Line 30: the deduction. */
  deduction: number;
  /** Deduction times the reader's marginal rate. */
  taxSaved: number;
  /** Interest that earns no deduction (over the cap, or phased out). */
  lost: number;
  /** Lowest MAGI at which the deduction is $0 for this capped interest amount. */
  zeroAtMagi: number;
  /** MAGI at which the phase-out starts for this status. */
  start: number;
}

const clean = (v: number) => (Number.isFinite(v) ? Math.max(0, v) : 0);
const r2 = (v: number) => Math.round(v * 100) / 100;

export function computeCarLoanDeduction(i: CliInput): CliResult {
  const interest = clean(i.interestPaid);
  const magi = clean(i.magi);
  const start = PHASE_OUT_START[i.status];
  const capped = Math.min(interest, DEDUCTION_CAP);
  const excess = Math.max(0, magi - start);
  const steps = excess > 0 ? Math.ceil(excess / STEP_SIZE) : 0;
  const reduction = steps * REDUCTION_PER_STEP;
  const deduction = Math.max(0, capped - reduction);
  const rate = Math.min(clean(i.marginalRatePct), 100) / 100;
  // Smallest number of steps that wipes the deduction out: capped / 200, rounded up. MAGI one step-edge past
  // (that many steps minus one) thousand dollars over the start is the first dollar at which the result is zero.
  const stepsToZero = capped > 0 ? Math.ceil(capped / REDUCTION_PER_STEP) : 0;
  const zeroAtMagi = capped > 0 ? start + (stepsToZero - 1) * STEP_SIZE + 1 : start;
  return {
    capped: r2(capped),
    excess: r2(excess),
    steps,
    reduction: r2(reduction),
    deduction: r2(deduction),
    taxSaved: r2(deduction * rate),
    lost: r2(interest - deduction),
    zeroAtMagi,
    start,
  };
}

/** Interest on a fixed-rate loan over the first `months` payments of a balance `principal` with `termMonths` left. */
export function interestOverMonths(principal: number, aprPct: number, termMonths: number, months: number): number {
  const p = clean(principal);
  const n = Math.floor(clean(termMonths));
  const m = Math.min(Math.floor(clean(months)), n);
  if (p <= 0 || n <= 0 || m <= 0) return 0;
  const r = clean(aprPct) / 100 / 12;
  const pay = r === 0 ? p / n : (p * r) / (1 - Math.pow(1 + r, -n));
  let bal = p;
  let interest = 0;
  for (let k = 0; k < m; k++) {
    const it = bal * r;
    interest += it;
    bal -= pay - it;
  }
  return r2(interest);
}
