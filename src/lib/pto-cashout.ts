// PTO / leave-days cash-out (sell-back) engine — standalone (mirrors credit-card-payoff.ts /
// personal-loan.ts: an independent copy of the math rather than importing another engine).
//
// Competitor-monitor pass (2026-08-17): most "sell leave days" tools stop at a single gross-payout
// number. This engine also (a) derives the daily rate the same way for salaried and hourly pay so
// the two are directly comparable, (b) shows an estimated NET payout after a simplified flat-rate
// tax estimate — since a lump-sum PTO payout is commonly withheld at a flat supplemental-wage rate
// rather than blended into a regular paycheck (see IRS Publication 15, supplemental wages) — and
// (c) frames the unpaid-time-off value side by side with the cash payout so the reader sees the
// real tradeoff is cash-now vs. rest/flexibility, not a math trick that makes one path "worth more."
//
// Stated assumptions (all figures are estimates, not payroll advice):
//  - Daily rate for salaried pay = annual salary ÷ (work days/week × 52 weeks). This assumes a
//    fixed number of paid work days per week all year (no unpaid weeks, no overtime, no bonuses/
//    commissions folded in) — the same simplification most payroll systems use to compute a daily
//    PTO accrual/payout rate.
//  - Monthly salary is annualized (× 12) before applying the same daily-rate formula.
//  - Daily rate for hourly pay = hourly rate × standard hours per day (default 8). No overtime
//    premium is modeled; a "day" is exactly the standard shift length entered.
//  - Gross payout = daily rate × days sold. Linear — no proration or partial-day rules.
//  - Estimated net payout = gross payout × (1 − marginal tax rate estimate). This is a simplified,
//    single flat-rate estimate of income tax withholding on a lump sum. It does NOT model FICA/
//    Medicare, state-specific supplemental-wage withholding rules, or an employer's actual payroll
//    system — real withholding varies by employer, state, and how the payout is coded. Users should
//    treat the net figure as a rough planning estimate only.
//  - Unpaid-time-off value uses the identical daily rate × days sold, by design: it is the same
//    dollar figure as the gross payout, shown to make the point that selling days doesn't create or
//    destroy value — it converts paid rest into cash now, at the same daily price.

export type PayBasis = "annual" | "monthly" | "hourly";

export interface PtoCashoutInput {
  payBasis: PayBasis;
  /** Used when payBasis === "annual". */
  annualSalary?: number;
  /** Used when payBasis === "monthly". */
  monthlySalary?: number;
  /** Used when payBasis === "hourly". */
  hourlyRate?: number;
  /** Used when payBasis === "hourly": scheduled hours per week (for context; not used in the
   *  daily-rate formula, which uses hoursPerDay directly). */
  hoursPerWeek?: number;
  /** Standard paid hours in one workday. Default 8. */
  hoursPerDay: number;
  /** Standard paid workdays in one week. Default 5. Drives the annual-salary daily rate. */
  workDaysPerWeek: number;
  /** Leave/PTO days available to sell. */
  daysAvailable: number;
  /** Leave/PTO days the user actually wants to sell (clamped to daysAvailable). */
  daysToSell: number;
  /** Estimated marginal/withholding tax rate, as a percent (0–100). Optional — omit for gross-only. */
  taxRatePct?: number;
}

export interface PtoCashoutResult {
  dailyRate: number | null;
  daysSold: number;
  daysSoldExceedsAvailable: boolean;
  grossPayout: number | null;
  /** null when no tax rate estimate was entered. */
  estimatedNetPayout: number | null;
  estimatedTaxWithheld: number | null;
  /** Same dollar figure as grossPayout, surfaced separately for the "same value either way" framing. */
  unpaidTimeOffValue: number | null;
  remainingDaysAfterSale: number;
}

const EMPTY: PtoCashoutResult = {
  dailyRate: null,
  daysSold: 0,
  daysSoldExceedsAvailable: false,
  grossPayout: null,
  estimatedNetPayout: null,
  estimatedTaxWithheld: null,
  unpaidTimeOffValue: null,
  remainingDaysAfterSale: 0,
};

export function computePtoCashout(input: PtoCashoutInput): PtoCashoutResult {
  const hoursPerDay = positive(input.hoursPerDay, 8);
  const workDaysPerWeek = positive(input.workDaysPerWeek, 5);
  const daysAvailable = Math.max(0, input.daysAvailable ?? 0);
  const daysToSellRaw = Math.max(0, input.daysToSell ?? 0);
  const daysSoldExceedsAvailable = daysAvailable > 0 && daysToSellRaw > daysAvailable;
  const daysSold = daysAvailable > 0 ? Math.min(daysToSellRaw, daysAvailable) : daysToSellRaw;

  let dailyRate: number | null = null;
  if (input.payBasis === "annual") {
    const annual = Math.max(0, input.annualSalary ?? 0);
    if (annual > 0) dailyRate = annual / (workDaysPerWeek * 52);
  } else if (input.payBasis === "monthly") {
    const monthly = Math.max(0, input.monthlySalary ?? 0);
    if (monthly > 0) dailyRate = (monthly * 12) / (workDaysPerWeek * 52);
  } else {
    const hourly = Math.max(0, input.hourlyRate ?? 0);
    if (hourly > 0) dailyRate = hourly * hoursPerDay;
  }

  if (dailyRate == null || !(dailyRate > 0) || daysSold <= 0) {
    return { ...EMPTY, daysSoldExceedsAvailable, remainingDaysAfterSale: Math.max(0, daysAvailable - daysSold) };
  }

  const grossPayout = round2(dailyRate * daysSold);
  const unpaidTimeOffValue = grossPayout; // same dollar figure, by design — see header comment.

  let estimatedNetPayout: number | null = null;
  let estimatedTaxWithheld: number | null = null;
  const taxRatePct = input.taxRatePct;
  if (taxRatePct != null && Number.isFinite(taxRatePct) && taxRatePct > 0) {
    const rate = Math.min(100, Math.max(0, taxRatePct)) / 100;
    estimatedTaxWithheld = round2(grossPayout * rate);
    estimatedNetPayout = round2(grossPayout - estimatedTaxWithheld);
  }

  return {
    dailyRate: round2(dailyRate),
    daysSold,
    daysSoldExceedsAvailable,
    grossPayout,
    estimatedNetPayout,
    estimatedTaxWithheld,
    unpaidTimeOffValue,
    remainingDaysAfterSale: round2(Math.max(0, daysAvailable - daysSold)),
  };
}

function positive(n: number | undefined, fallback: number): number {
  return n != null && Number.isFinite(n) && n > 0 ? n : fallback;
}
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
