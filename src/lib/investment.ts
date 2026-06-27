// Pure investment / compound-interest engine.
//
// Source: jht243/investment-calculator computeSummary() —
//   FV = PV·(1+r)^n + PMT·((1+r)^n − 1)/r, monthly compounding (r = annual/12, n = years·12).
// Extended here with configurable compounding frequency (for the compound-interest spoke), a
// year-by-year schedule, and a reverse goal solver. ZERO React/DOM/host deps → build + runtime.

export interface InvestmentInput {
  currentBalance: number;
  monthlyContribution: number;
  annualReturnPct: number;
  years: number;
  /** Compounding periods per year (1, 4, 12, 365). Default 12 (monthly), matching the source. */
  compoundsPerYear?: number;
  /** Optional savings goal — enables progress + "monthly needed" output. */
  targetAmount?: number;
}

export interface InvestmentYear {
  year: number;
  balance: number;
  contributions: number; // cumulative contributions (incl. starting balance)
  growth: number; // cumulative growth
}

export interface InvestmentResult {
  futureValue: number | null;
  totalContributions: number | null; // starting balance + all monthly contributions
  totalGrowth: number | null;
  effectiveMonthlyRatePct: number | null;
  schedule: InvestmentYear[];
  // Goal (only when targetAmount > 0) ----
  targetAmount: number | null;
  progressPct: number | null; // futureValue / target
  monthlyNeededForTarget: number | null; // contribution to exactly hit the target
}

const EMPTY: InvestmentResult = {
  futureValue: null, totalContributions: null, totalGrowth: null, effectiveMonthlyRatePct: null,
  schedule: [], targetAmount: null, progressPct: null, monthlyNeededForTarget: null,
};

/** Effective monthly rate given an annual rate compounded `compoundsPerYear` times. */
export function effectiveMonthlyRate(annualReturnPct: number, compoundsPerYear: number): number {
  const annual = annualReturnPct / 100;
  if (compoundsPerYear === 12) return annual / 12; // exact match to the source model
  if (annual <= -1) return -1;
  return Math.pow(1 + annual / compoundsPerYear, compoundsPerYear / 12) - 1;
}

export function computeInvestment(input: InvestmentInput): InvestmentResult {
  const years = Math.round(input.years);
  if (!(years > 0)) return { ...EMPTY };

  const pv = Math.max(0, input.currentBalance ?? 0);
  const pmt = Math.max(0, input.monthlyContribution ?? 0);
  const cpy = input.compoundsPerYear && input.compoundsPerYear > 0 ? input.compoundsPerYear : 12;
  const i = effectiveMonthlyRate(input.annualReturnPct ?? 0, cpy);
  const months = years * 12;

  // Month-by-month simulation (handles any compounding frequency + monthly contributions).
  let balance = pv;
  const schedule: InvestmentYear[] = [];
  for (let m = 1; m <= months; m++) {
    balance = balance * (1 + i) + pmt;
    if (m % 12 === 0) {
      const year = m / 12;
      const contributions = pv + pmt * m;
      schedule.push({
        year,
        balance: round2(balance),
        contributions: round2(contributions),
        growth: round2(balance - contributions),
      });
    }
  }

  const futureValue = balance;
  const totalContributions = pv + pmt * months;
  const totalGrowth = futureValue - totalContributions;

  let progressPct: number | null = null;
  let monthlyNeededForTarget: number | null = null;
  const target = input.targetAmount ?? 0;
  if (target > 0) {
    progressPct = round2((futureValue / target) * 100);
    monthlyNeededForTarget = monthlyNeededForGoal(target, pv, input.annualReturnPct ?? 0, years, cpy);
  }

  return {
    futureValue: round2(futureValue),
    totalContributions: round2(totalContributions),
    totalGrowth: round2(totalGrowth),
    effectiveMonthlyRatePct: round4(i * 100),
    schedule,
    targetAmount: target > 0 ? target : null,
    progressPct,
    monthlyNeededForTarget,
  };
}

/** Reverse solver: the monthly contribution needed to reach `target` in `years`. */
export function monthlyNeededForGoal(
  target: number, currentBalance: number, annualReturnPct: number, years: number, compoundsPerYear = 12,
): number | null {
  const months = Math.round(years) * 12;
  if (!(months > 0)) return null;
  const i = effectiveMonthlyRate(annualReturnPct, compoundsPerYear);
  const grown = currentBalance * Math.pow(1 + i, months);
  if (grown >= target) return 0; // already on track from the starting balance alone
  if (i === 0) return round2((target - currentBalance) / months);
  const annuityFactor = (Math.pow(1 + i, months) - 1) / i;
  return round2((target - grown) / annuityFactor);
}

function round2(n: number): number { return Math.round(n * 100) / 100; }
function round4(n: number): number { return Math.round(n * 10000) / 10000; }
