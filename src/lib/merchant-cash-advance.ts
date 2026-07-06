// Pure merchant cash advance (MCA) engine.
//
// An MCA is NOT a loan: a funder buys a slice of your future revenue at a discount. Cost is quoted
// as a FACTOR RATE (e.g. 1.30 = you repay $1.30 per $1 advanced), not an interest rate, and is
// repaid via fixed daily or weekly payments until the total is met. This module converts that
// opaque structure into the numbers a borrower actually needs — total payback, the periodic
// payment, and the true annualized cost (effective APR) — with ZERO React/DOM deps so it runs at
// BUILD TIME (Astro stat injection) and at RUNTIME (the React island).

export type PaymentFrequency = "daily" | "weekly";

export interface McaInput {
  /** Amount funded to the business ("advance"). */
  advanceAmount: number;
  /** Factor rate, e.g. 1.30. Repay advanceAmount × factorRate in total. */
  factorRate: number;
  /** Estimated repayment term in months (MCA terms are typically 3–18 months). */
  termMonths: number;
  /** Fixed remittance cadence. "daily" bills every business day. */
  paymentFrequency: PaymentFrequency;
  /** Optional origination/underwriting fee added to the cost (dollars). */
  originationFee?: number;
}

export interface McaMonthRow {
  month: number;
  paid: number;
  remaining: number;
}

export interface McaResult {
  totalPayback: number | null; // advance × factor
  totalCost: number | null; // payback − advance (+ origination fee) = what the money costs
  costPerDollar: number | null; // factor − 1, e.g. 0.30
  numberOfPayments: number | null;
  periodicPayment: number | null; // each daily/weekly remittance
  paymentsPerMonth: number | null;
  estimatedMonthlyPayment: number | null;
  /** True annualized cost via the internal rate of return of the cash flows. */
  effectiveAprPct: number | null;
  schedule: McaMonthRow[];
}

// Business days ≈ 21/month (252/yr); weeks ≈ 4.333/month (52/yr). MCAs bill on business days.
const PERIODS_PER_MONTH: Record<PaymentFrequency, number> = { daily: 21, weekly: 4.333 };
const PERIODS_PER_YEAR: Record<PaymentFrequency, number> = { daily: 252, weekly: 52 };

const EMPTY: McaResult = {
  totalPayback: null,
  totalCost: null,
  costPerDollar: null,
  numberOfPayments: null,
  periodicPayment: null,
  paymentsPerMonth: null,
  estimatedMonthlyPayment: null,
  effectiveAprPct: null,
  schedule: [],
};

export function computeMca(input: McaInput): McaResult {
  const advance = input.advanceAmount > 0 ? input.advanceAmount : null;
  const factor = input.factorRate > 0 ? input.factorRate : null;
  const termMonths = input.termMonths > 0 ? input.termMonths : null;
  const freq: PaymentFrequency = input.paymentFrequency === "weekly" ? "weekly" : "daily";
  const originationFee = Math.max(0, input.originationFee ?? 0);

  if (advance == null || factor == null || termMonths == null) return { ...EMPTY };

  const totalPayback = advance * factor;
  const perMonth = PERIODS_PER_MONTH[freq];
  const numberOfPayments = Math.max(1, Math.round(perMonth * termMonths));
  const periodicPayment = totalPayback / numberOfPayments;
  const estimatedMonthlyPayment = periodicPayment * perMonth;
  const totalCost = totalPayback - advance + originationFee;

  const effectiveAprPct = mcaEffectiveApr(advance - originationFee, periodicPayment, numberOfPayments, PERIODS_PER_YEAR[freq]);

  // Monthly roll-up of the fixed remittances (MCA has no amortizing balance — just payback remaining).
  const schedule: McaMonthRow[] = [];
  let remaining = totalPayback;
  const months = Math.ceil(numberOfPayments / perMonth);
  for (let m = 1; m <= months; m++) {
    const paidThisMonth = Math.min(remaining, periodicPayment * perMonth);
    remaining = Math.max(0, remaining - paidThisMonth);
    schedule.push({ month: m, paid: round2(paidThisMonth), remaining: round2(remaining) });
  }

  return {
    totalPayback: round2(totalPayback),
    totalCost: round2(totalCost),
    costPerDollar: round2(factor - 1),
    numberOfPayments,
    periodicPayment: round2(periodicPayment),
    paymentsPerMonth: perMonth,
    estimatedMonthlyPayment: round2(estimatedMonthlyPayment),
    effectiveAprPct: effectiveAprPct == null ? null : round2(effectiveAprPct),
    schedule,
  };
}

/**
 * Effective APR = the annualized internal rate of return of an MCA's cash flows.
 * You receive `netAdvance` today, then pay `payment` for `n` periods. Solve for the periodic rate r
 * where netAdvance = payment × (1 − (1+r)^−n) / r, then annualize by periodsPerYear.
 * Bisection on r ∈ (0, 5] per period — robust and dependency-free.
 */
export function mcaEffectiveApr(netAdvance: number, payment: number, n: number, periodsPerYear: number): number | null {
  if (netAdvance <= 0 || payment <= 0 || n <= 0) return null;
  const totalPaid = payment * n;
  if (totalPaid <= netAdvance) return 0; // no cost

  const pv = (r: number): number => {
    if (r === 0) return payment * n;
    return (payment * (1 - Math.pow(1 + r, -n))) / r;
  };
  // Find r such that pv(r) = netAdvance. pv is decreasing in r.
  let lo = 0;
  let hi = 5; // 500% per period is a generous ceiling
  // Ensure a sign change; if pv(hi) still > netAdvance, cost is astronomically high — cap out.
  if (pv(hi) > netAdvance) return round2(hi * periodsPerYear * 100);
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const val = pv(mid);
    if (Math.abs(val - netAdvance) < 1e-7) {
      lo = hi = mid;
      break;
    }
    if (val > netAdvance) lo = mid;
    else hi = mid;
  }
  const rPeriodic = (lo + hi) / 2;
  return rPeriodic * periodsPerYear * 100;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
