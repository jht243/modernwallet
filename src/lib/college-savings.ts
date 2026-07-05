// Pure 529 / college-savings projection engine.
//
// Projects a 529 balance from today to college start (compound growth, monthly contributions),
// and — when a college-cost target is given — projects the inflated 4-year cost and the funding
// gap, plus the monthly contribution needed to fully fund it. ZERO React/DOM/host deps.
//
// Math mirrors src/lib/investment.ts: monthly compounding (r = annual/12), month-by-month sim.

export const COLLEGE_START_AGE = 18;

export interface CollegeSavingsInput {
  /** Child's current age in years (0 = newborn). */
  childCurrentAge: number;
  /** Current 529 balance. */
  currentBalance: number;
  /** Monthly contribution. */
  monthlyContribution: number;
  /** Expected average annual investment return (%). 529 age-based portfolios ≈ 5–7%. */
  annualReturnPct: number;
  /** Optional: estimated TOTAL 4-year college cost in today's dollars. Enables the gap solver. */
  collegeCostToday?: number;
  /** College-cost inflation (%). Historically ≈ 5%/yr (higher than general CPI). Default 5. */
  costInflationPct?: number;
}

export interface CollegeSavingsYear {
  year: number;
  age: number;
  balance: number;
  contributions: number; // cumulative incl. starting balance
  growth: number;
}

export interface CollegeSavingsResult {
  projectedBalance: number | null; // 529 value at age 18
  yearsToCollege: number | null;
  totalContributions: number | null;
  totalGrowth: number | null;
  // Goal fields (only when collegeCostToday > 0) --------------------------------
  projectedCollegeCost: number | null; // 4-yr cost inflated to college start
  fundingGap: number | null; // projectedCollegeCost - projectedBalance (>0 = shortfall)
  coveragePct: number | null; // projectedBalance / projectedCollegeCost
  monthlyNeededToFund: number | null; // contribution to fully cover the projected cost
  schedule: CollegeSavingsYear[];
}

const EMPTY: CollegeSavingsResult = {
  projectedBalance: null, yearsToCollege: null, totalContributions: null, totalGrowth: null,
  projectedCollegeCost: null, fundingGap: null, coveragePct: null, monthlyNeededToFund: null, schedule: [],
};

export function computeCollegeSavings(input: CollegeSavingsInput): CollegeSavingsResult {
  const age = clampInt(input.childCurrentAge, 0, COLLEGE_START_AGE);
  const years = COLLEGE_START_AGE - age;
  if (!(years > 0)) return { ...EMPTY, yearsToCollege: 0, projectedBalance: round2(Math.max(0, input.currentBalance ?? 0)) };

  const pv = Math.max(0, input.currentBalance ?? 0);
  const pmt = Math.max(0, input.monthlyContribution ?? 0);
  const i = (input.annualReturnPct ?? 0) / 100 / 12;
  const months = years * 12;

  let balance = pv;
  const schedule: CollegeSavingsYear[] = [];
  for (let m = 1; m <= months; m++) {
    balance = balance * (1 + i) + pmt;
    if (m % 12 === 0) {
      const y = m / 12;
      const contributions = pv + pmt * m;
      schedule.push({ year: y, age: age + y, balance: round2(balance), contributions: round2(contributions), growth: round2(balance - contributions) });
    }
  }

  const projectedBalance = balance;
  const totalContributions = pv + pmt * months;
  const totalGrowth = projectedBalance - totalContributions;

  let projectedCollegeCost: number | null = null;
  let fundingGap: number | null = null;
  let coveragePct: number | null = null;
  let monthlyNeededToFund: number | null = null;

  const costToday = input.collegeCostToday ?? 0;
  if (costToday > 0) {
    const infl = (input.costInflationPct ?? 5) / 100;
    projectedCollegeCost = costToday * Math.pow(1 + infl, years);
    fundingGap = projectedCollegeCost - projectedBalance;
    coveragePct = round2((projectedBalance / projectedCollegeCost) * 100);
    monthlyNeededToFund = monthlyNeededForGoal(projectedCollegeCost, pv, input.annualReturnPct ?? 0, years);
  }

  return {
    projectedBalance: round2(projectedBalance),
    yearsToCollege: years,
    totalContributions: round2(totalContributions),
    totalGrowth: round2(totalGrowth),
    projectedCollegeCost: projectedCollegeCost != null ? round2(projectedCollegeCost) : null,
    fundingGap: fundingGap != null ? round2(fundingGap) : null,
    coveragePct,
    monthlyNeededToFund,
    schedule,
  };
}

/** Monthly contribution needed to reach `target` in `years`, given a starting balance. */
export function monthlyNeededForGoal(target: number, currentBalance: number, annualReturnPct: number, years: number): number | null {
  const months = Math.round(years) * 12;
  if (!(months > 0)) return null;
  const i = annualReturnPct / 100 / 12;
  const grown = currentBalance * Math.pow(1 + i, months);
  if (grown >= target) return 0;
  if (i === 0) return round2((target - currentBalance) / months);
  const annuityFactor = (Math.pow(1 + i, months) - 1) / i;
  return round2((target - grown) / annuityFactor);
}

function round2(n: number): number { return Math.round(n * 100) / 100; }
function clampInt(n: number, lo: number, hi: number): number {
  const v = Math.round(Number(n));
  if (!Number.isFinite(v)) return lo;
  return Math.min(hi, Math.max(lo, v));
}
