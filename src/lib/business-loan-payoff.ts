// Pure business term-loan payoff engine.
//
// For a standard amortizing business loan (SBA 7(a), bank term loan, equipment loan — NOT a
// merchant cash advance or invoice factoring, which are priced by factor rate, not APR; see
// src/lib/merchant-cash-advance.ts / invoice-factoring.ts for those). Computes the scheduled
// payoff, then an extra-payment scenario showing interest saved and months shaved off.
//
// Formula matches src/lib/auto-loan.ts's amortization math (standard fully-amortizing payment,
// then a month-by-month extra-principal simulation) — the same battle-tested engine pattern, kept
// as an independent copy here so a change to the auto-loan tool can never silently affect this one.

export interface BusinessLoanPayoffInput {
  loanBalance: number;
  interestRatePct: number;
  /** Months remaining on the ORIGINAL amortization schedule (used to derive the scheduled payment). */
  remainingTermMonths: number;
  /** Extra fixed amount applied to principal every month. Ignored when `targetPayoffMonths` is set. */
  extraMonthlyPayment: number;
  /** Goal mode 2: "I want to be debt-free in N months" — solve for the required extra payment instead
   *  of taking one. When set (>0), this overrides extraMonthlyPayment. */
  targetPayoffMonths?: number;
}

export interface AmortRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface BusinessLoanPayoffResult {
  scheduledPayment: number | null;
  baselineMonths: number | null;
  baselineInterest: number | null;
  monthsToPayoff: number | null;
  totalInterest: number | null;
  interestSaved: number | null;
  monthsSaved: number | null;
  schedule: AmortRow[];
  /** Goal-mode-2 output: the extra monthly payment required to hit `targetPayoffMonths`. Null
   *  unless that mode is active, or null if the target is already at/beyond the baseline payoff
   *  (no extra needed) or is unreachable (target ≤ 0 or the scheduled payment alone can't amortize it). */
  requiredExtraForTarget: number | null;
}

const EMPTY: BusinessLoanPayoffResult = {
  scheduledPayment: null, baselineMonths: null, baselineInterest: null, monthsToPayoff: null,
  totalInterest: null, interestSaved: null, monthsSaved: null, schedule: [], requiredExtraForTarget: null,
};

/** Scheduled fully-amortizing monthly payment for a principal/rate/term. */
export function monthlyPayment(principal: number, annualRatePct: number, months: number): number {
  if (months <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}

function amortize(
  principal: number,
  annualRatePct: number,
  scheduledPayment: number,
  extraMonthlyPayment = 0,
): { schedule: AmortRow[]; totalInterest: number; months: number } {
  const r = annualRatePct / 100 / 12;
  const schedule: AmortRow[] = [];
  let balance = principal;
  let totalInterest = 0;
  let month = 0;
  const HARD_CAP_MONTHS = 720; // 60 years — guards against a non-amortizing input (e.g. payment ≤ interest)
  while (balance > 0.005 && month < HARD_CAP_MONTHS) {
    month++;
    const interest = balance * r;
    let principalPaid = scheduledPayment + extraMonthlyPayment - interest;
    if (principalPaid > balance) principalPaid = balance;
    if (principalPaid < 0) principalPaid = 0; // payment doesn't even cover interest — balance won't shrink
    balance = round2(balance - principalPaid);
    totalInterest += interest;
    schedule.push({ month, payment: round2(interest + principalPaid), principal: round2(principalPaid), interest: round2(interest), balance });
    if (principalPaid === 0) break; // non-amortizing — stop rather than loop to the hard cap
  }
  return { schedule, totalInterest: round2(totalInterest), months: month };
}

export function computeBusinessLoanPayoff(input: BusinessLoanPayoffInput): BusinessLoanPayoffResult {
  const principal = Math.max(0, input.loanBalance ?? 0);
  const rate = Math.max(0, input.interestRatePct ?? 0);
  const term = clampInt(input.remainingTermMonths, 1, 480);
  if (!(principal > 0)) return EMPTY;

  const scheduledPayment = round2(monthlyPayment(principal, rate, term));
  const baseline = amortize(principal, rate, scheduledPayment, 0);

  // Goal mode 2: "I want to be debt-free in N months" — solve for the extra payment that makes
  // the target-month payment fully amortize the balance, then run the real schedule at that extra.
  const target = input.targetPayoffMonths ?? 0;
  if (target > 0) {
    const targetMonths = clampInt(target, 1, term);
    if (targetMonths >= baseline.months) {
      // Already on pace (or the target is looser than the existing schedule) — no extra needed.
      return { ...EMPTY, scheduledPayment, baselineMonths: baseline.months, baselineInterest: baseline.totalInterest,
        monthsToPayoff: baseline.months, totalInterest: baseline.totalInterest, interestSaved: 0, monthsSaved: 0,
        schedule: baseline.schedule, requiredExtraForTarget: 0 };
    }
    const targetPayment = monthlyPayment(principal, rate, targetMonths);
    const requiredExtra = round2(Math.max(0, targetPayment - scheduledPayment));
    const withExtra = amortize(principal, rate, scheduledPayment, requiredExtra);
    return {
      scheduledPayment,
      baselineMonths: baseline.months,
      baselineInterest: baseline.totalInterest,
      monthsToPayoff: withExtra.months,
      totalInterest: withExtra.totalInterest,
      interestSaved: round2(baseline.totalInterest - withExtra.totalInterest),
      monthsSaved: baseline.months - withExtra.months,
      schedule: withExtra.schedule,
      requiredExtraForTarget: requiredExtra,
    };
  }

  // Goal mode 1 (default): a fixed extra monthly payment.
  const extra = Math.max(0, input.extraMonthlyPayment ?? 0);
  const withExtra = extra > 0 ? amortize(principal, rate, scheduledPayment, extra) : baseline;

  return {
    scheduledPayment,
    baselineMonths: baseline.months,
    baselineInterest: baseline.totalInterest,
    monthsToPayoff: withExtra.months,
    totalInterest: withExtra.totalInterest,
    interestSaved: round2(baseline.totalInterest - withExtra.totalInterest),
    monthsSaved: baseline.months - withExtra.months,
    schedule: withExtra.schedule,
    requiredExtraForTarget: null,
  };
}

function round2(n: number): number { return Math.round(n * 100) / 100; }
function clampInt(n: number, lo: number, hi: number): number {
  const v = Math.round(Number(n));
  if (!Number.isFinite(v)) return lo;
  return Math.min(hi, Math.max(lo, v));
}
