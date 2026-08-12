// Credit card payoff engine — standalone (mirrors personal-loan.ts / auto-loan.ts: an independent
// copy of the amortization math rather than importing another engine, so a change to one product
// can never silently affect this one).
//
// Competitor-monitor pass (2026-08-12): most "credit card payoff calculator" tools only answer one
// question — how long at a fixed payment? This engine also runs the minimum-payment-only path side
// by side, using the same greater-of-$25-or-1%-plus-interest formula card issuers commonly use for
// the minimum-payment box required on every statement under Regulation Z, 12 CFR 1026.7(b)(12)
// (https://www.consumerfinance.gov/rules-policy/regulations/1026/7/). That side-by-side is the real
// "next step" most payoff tools describe in prose but never actually compute for the reader.

export type PayoffMode = "payment" | "months";

export interface CreditCardPayoffInput {
  balance: number;
  aprPct: number;
  mode: PayoffMode;
  /** Used when mode === "payment": the fixed amount paid each month. */
  monthlyPayment?: number;
  /** Used when mode === "months": the payoff timeline the user wants to hit. */
  targetMonths?: number;
}

export interface CreditCardPayoffResult {
  /** True once a balance is entered but the chosen fixed payment never covers a month's interest —
   *  the balance would grow forever at that payment, so no payoff timeline exists. */
  paymentTooLow: boolean;
  monthsToPayoff: number | null;
  totalInterest: number | null;
  totalPaid: number | null;
  /** Only populated for mode === "months": the fixed payment required to hit that timeline. */
  requiredMonthlyPayment: number | null;
  /** The minimum-payment-only path, always computed for comparison regardless of mode. */
  minimumOnly: {
    /** True if the minimum payment never exceeds that month's interest — balance never shrinks. */
    neverPaysOff: boolean;
    /** Capped at MAX_MONTHS (50 years) when the payoff is technically reachable but absurdly long. */
    monthsToPayoff: number | null;
    monthsCapped: boolean;
    totalInterest: number | null;
    firstMonthPayment: number | null;
  };
  interestSavedVsMinimum: number | null;
  monthsSavedVsMinimum: number | null;
}

const MAX_MONTHS = 600; // 50 years — well past any realistic card payoff; guards infinite loops
const MIN_PAYMENT_PCT = 0.01; // 1% of balance
const MIN_PAYMENT_FLOOR = 25; // $25 statement-minimum floor, standard across major issuers

const EMPTY: CreditCardPayoffResult = {
  paymentTooLow: false,
  monthsToPayoff: null,
  totalInterest: null,
  totalPaid: null,
  requiredMonthlyPayment: null,
  minimumOnly: { neverPaysOff: false, monthsToPayoff: null, monthsCapped: false, totalInterest: null, firstMonthPayment: null },
  interestSavedVsMinimum: null,
  monthsSavedVsMinimum: null,
};

/** Standard fully-amortizing monthly payment for a principal/annual-rate/term (same formula used
 *  across the site's other amortizing calculators — auto-loan.ts, personal-loan.ts). */
function paymentFor(principal: number, annualRatePct: number, months: number): number {
  if (months <= 0) return principal;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}

/** Runs a fixed-payment payoff schedule to exhaustion. Returns null months/interest if the
 *  payment never covers interest (balance never shrinks). */
function runFixedPayment(balance: number, monthlyRate: number, payment: number): { months: number | null; totalInterest: number | null; totalPaid: number | null } {
  if (payment <= balance * monthlyRate) return { months: null, totalInterest: null, totalPaid: null };
  let bal = balance;
  let months = 0;
  let totalInterest = 0;
  let totalPaid = 0;
  while (bal > 0.005 && months < MAX_MONTHS) {
    const interest = bal * monthlyRate;
    const thisPayment = Math.min(payment, bal + interest);
    const principal = thisPayment - interest;
    bal -= principal;
    totalInterest += interest;
    totalPaid += thisPayment;
    months++;
  }
  if (bal > 0.005) return { months: null, totalInterest: null, totalPaid: null }; // hit the cap unpaid
  return { months, totalInterest: round2(totalInterest), totalPaid: round2(totalPaid) };
}

/** Runs the issuer-style minimum-payment-only path: each month's minimum is recalculated as the
 *  greater of $25 or 1% of the remaining balance plus that month's interest, which is why the
 *  required payment shrinks as the balance does — and why minimum-only payoff takes so long. */
function runMinimumOnly(balance: number, monthlyRate: number): { neverPaysOff: boolean; months: number | null; monthsCapped: boolean; totalInterest: number | null; firstMonthPayment: number | null } {
  const firstInterest = balance * monthlyRate;
  const firstMin = Math.max(MIN_PAYMENT_FLOOR, balance * MIN_PAYMENT_PCT + firstInterest);
  if (firstMin <= firstInterest) {
    return { neverPaysOff: true, months: null, monthsCapped: false, totalInterest: null, firstMonthPayment: round2(firstMin) };
  }
  let bal = balance;
  let months = 0;
  let totalInterest = 0;
  let firstMonthPayment: number | null = null;
  while (bal > 0.005 && months < MAX_MONTHS) {
    const interest = bal * monthlyRate;
    const min = Math.max(MIN_PAYMENT_FLOOR, bal * MIN_PAYMENT_PCT + interest);
    const payment = Math.min(min, bal + interest);
    if (firstMonthPayment === null) firstMonthPayment = round2(payment);
    const principal = payment - interest;
    if (principal <= 0) {
      // Safety net: if a later month's minimum somehow stops covering interest, treat as never-payoff.
      return { neverPaysOff: true, months: null, monthsCapped: false, totalInterest: null, firstMonthPayment };
    }
    bal -= principal;
    totalInterest += interest;
    months++;
  }
  const monthsCapped = bal > 0.005;
  return {
    neverPaysOff: false,
    months: monthsCapped ? MAX_MONTHS : months,
    monthsCapped,
    totalInterest: round2(totalInterest),
    firstMonthPayment,
  };
}

export function computeCreditCardPayoff(input: CreditCardPayoffInput): CreditCardPayoffResult {
  const balance = Math.max(0, input.balance ?? 0);
  const aprPct = Math.max(0, input.aprPct ?? 0);
  if (!(balance > 0)) return EMPTY;
  const monthlyRate = aprPct / 100 / 12;

  const minimumRaw = runMinimumOnly(balance, monthlyRate);
  const minimumOnly = {
    neverPaysOff: minimumRaw.neverPaysOff,
    monthsToPayoff: minimumRaw.months,
    monthsCapped: minimumRaw.monthsCapped,
    totalInterest: minimumRaw.totalInterest,
    firstMonthPayment: minimumRaw.firstMonthPayment,
  };

  let monthsToPayoff: number | null = null;
  let totalInterest: number | null = null;
  let totalPaid: number | null = null;
  let requiredMonthlyPayment: number | null = null;
  let paymentTooLow = false;

  if (input.mode === "months") {
    const months = clampInt(input.targetMonths, 1, 360);
    requiredMonthlyPayment = round2(paymentFor(balance, aprPct, months));
    const run = runFixedPayment(balance, monthlyRate, requiredMonthlyPayment);
    monthsToPayoff = run.months;
    totalInterest = run.totalInterest;
    totalPaid = run.totalPaid;
  } else {
    const payment = Math.max(0, input.monthlyPayment ?? 0);
    if (payment > 0 && payment <= balance * monthlyRate) {
      paymentTooLow = true;
    } else if (payment > 0) {
      const run = runFixedPayment(balance, monthlyRate, payment);
      monthsToPayoff = run.months;
      totalInterest = run.totalInterest;
      totalPaid = run.totalPaid;
    }
  }

  const interestSavedVsMinimum =
    totalInterest != null && minimumOnly.totalInterest != null && !minimumOnly.neverPaysOff
      ? round2(minimumOnly.totalInterest - totalInterest)
      : null;
  const monthsSavedVsMinimum =
    monthsToPayoff != null && minimumOnly.monthsToPayoff != null && !minimumOnly.neverPaysOff
      ? minimumOnly.monthsToPayoff - monthsToPayoff
      : null;

  return {
    paymentTooLow,
    monthsToPayoff,
    totalInterest,
    totalPaid,
    requiredMonthlyPayment,
    minimumOnly,
    interestSavedVsMinimum,
    monthsSavedVsMinimum,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
function clampInt(n: number | undefined, lo: number, hi: number): number {
  const v = Math.round(Number(n));
  if (!Number.isFinite(v)) return lo;
  return Math.min(hi, Math.max(lo, v));
}
