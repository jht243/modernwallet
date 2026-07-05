// Pure Trump Account (federal child savings account) growth engine.
//
// Models the account created by the One Big Beautiful Bill / Working Families Tax Cuts, live
// 2026-07-04: a $1,000 federal seed for children born 2025–2028, plus capped annual contributions,
// invested in a U.S.-equity index fund and compounded tax-deferred until the child turns 18.
//
// Contribution rules encoded here (verified against IRS guidance + CRS report R48910):
//   • Aggregate contribution cap: $5,000/year from all non-government sources ("other persons").
//   • Employers may add up to $2,500/year — but that amount COUNTS AGAINST the $5,000 cap, it is
//     NOT on top of it. So the most that can go in from family + employer combined is $5,000/year.
//   • The $1,000 federal seed does NOT count against the $5,000 cap (it is a government pilot deposit).
//   • Withdrawals are generally blocked until January 1 of the year the child turns 18.
//
// Math mirrors src/lib/investment.ts: monthly compounding (r = annual/12), month-by-month simulation
// so partial years and the seed's head start are handled exactly. ZERO React/DOM/host deps.

export const FAMILY_AGGREGATE_CAP = 5000; // $/yr — total from all private sources (incl. employer)
export const EMPLOYER_SUBCAP = 2500; // $/yr — employer portion, counted within the $5,000 cap
export const SEED_AMOUNT = 1000; // $ — one-time federal seed for children born 2025–2028
export const ACCOUNT_MATURITY_AGE = 18;

export interface TrumpAccountInput {
  /** Child's current age in years (0 = newborn). Growth runs until age 18. */
  childCurrentAge: number;
  /** Federal seed deposit. Default $1,000 for eligible 2025–2028 births; set 0 if not eligible. */
  seedDeposit: number;
  /** Annual contribution from family/friends (before caps). */
  annualFamilyContribution: number;
  /** Annual employer contribution (before the $2,500 sub-cap). Counts within the $5,000 cap. */
  annualEmployerContribution: number;
  /** Expected average annual return (%). S&P 500 long-run avg ≈ 10% nominal; 6–7% is a common real/conservative assumption. */
  annualReturnPct: number;
}

export interface TrumpAccountYear {
  /** Years from today (1..N). */
  year: number;
  /** Child's age at the end of that year. */
  age: number;
  balance: number;
  /** Cumulative dollars put in (seed + contributions). */
  contributions: number;
  /** Cumulative tax-deferred growth. */
  growth: number;
}

export interface TrumpAccountResult {
  valueAt18: number | null;
  yearsToGrow: number | null;
  /** Seed + every contribution actually made (after caps). */
  totalContributions: number | null;
  totalGrowth: number | null;
  /** Annual private contribution actually applied after enforcing the caps. */
  annualContributionApplied: number | null;
  /** Ratio of ending value to dollars contributed (e.g. 2.4 = ending value is 2.4× what went in). */
  growthMultiple: number | null;
  /** Populated when the user's inputs exceed a statutory cap and were trimmed. */
  capWarning: string | null;
  schedule: TrumpAccountYear[];
}

const EMPTY: TrumpAccountResult = {
  valueAt18: null, yearsToGrow: null, totalContributions: null, totalGrowth: null,
  annualContributionApplied: null, growthMultiple: null, capWarning: null, schedule: [],
};

export function computeTrumpAccount(input: TrumpAccountInput): TrumpAccountResult {
  const age = clampInt(input.childCurrentAge, 0, ACCOUNT_MATURITY_AGE);
  const yearsToGrow = ACCOUNT_MATURITY_AGE - age;
  if (!(yearsToGrow > 0)) {
    // Child is already 18+ — the contribution/growth window has closed.
    return { ...EMPTY, yearsToGrow: 0, valueAt18: round2(Math.max(0, input.seedDeposit ?? 0)) };
  }

  const seed = Math.max(0, input.seedDeposit ?? 0);
  const rawFamily = Math.max(0, input.annualFamilyContribution ?? 0);
  const rawEmployer = Math.max(0, input.annualEmployerContribution ?? 0);

  // Enforce caps: employer ≤ $2,500, and family + employer ≤ $5,000 aggregate.
  const employer = Math.min(rawEmployer, EMPLOYER_SUBCAP);
  const annualApplied = Math.min(rawFamily + employer, FAMILY_AGGREGATE_CAP);

  let capWarning: string | null = null;
  if (rawEmployer > EMPLOYER_SUBCAP && rawFamily + employer >= FAMILY_AGGREGATE_CAP) {
    capWarning = `Employer contributions are capped at $${EMPLOYER_SUBCAP.toLocaleString()}/yr and total private contributions at $${FAMILY_AGGREGATE_CAP.toLocaleString()}/yr — the extra was not counted.`;
  } else if (rawEmployer > EMPLOYER_SUBCAP) {
    capWarning = `Employer contributions are capped at $${EMPLOYER_SUBCAP.toLocaleString()}/yr — the amount above that was not counted.`;
  } else if (rawFamily + employer > FAMILY_AGGREGATE_CAP) {
    capWarning = `Total private contributions are capped at $${FAMILY_AGGREGATE_CAP.toLocaleString()}/yr — the amount above that was not counted.`;
  }

  const i = (input.annualReturnPct ?? 0) / 100 / 12; // monthly rate, monthly compounding
  const pmt = annualApplied / 12;
  const months = yearsToGrow * 12;

  let balance = seed;
  const schedule: TrumpAccountYear[] = [];
  for (let m = 1; m <= months; m++) {
    balance = balance * (1 + i) + pmt;
    if (m % 12 === 0) {
      const year = m / 12;
      const contributions = seed + pmt * m;
      schedule.push({
        year,
        age: age + year,
        balance: round2(balance),
        contributions: round2(contributions),
        growth: round2(balance - contributions),
      });
    }
  }

  const valueAt18 = balance;
  const totalContributions = seed + pmt * months;
  const totalGrowth = valueAt18 - totalContributions;

  return {
    valueAt18: round2(valueAt18),
    yearsToGrow,
    totalContributions: round2(totalContributions),
    totalGrowth: round2(totalGrowth),
    annualContributionApplied: round2(annualApplied),
    growthMultiple: totalContributions > 0 ? round2(valueAt18 / totalContributions) : null,
    capWarning,
    schedule,
  };
}

function round2(n: number): number { return Math.round(n * 100) / 100; }
function clampInt(n: number, lo: number, hi: number): number {
  const v = Math.round(Number(n));
  if (!Number.isFinite(v)) return lo;
  return Math.min(hi, Math.max(lo, v));
}
