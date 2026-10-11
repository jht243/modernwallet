// Social Security break-even engine — standalone. Compares two claiming ages for the same worker and
// finds the age at which the later claim's cumulative benefits catch up with the earlier claim's.
// The reader supplies their monthly benefit at full retirement age (FRA) from their SSA statement;
// nothing about their earnings record is estimated here.
//
// SSA rules encoded (SSA Benefits Planner, "Retirement Age and Benefit Reduction" and "Delayed
// Retirement Credits"; FRA table from "Full Retirement Age"):
//   • FRA by birth year: 1954 or earlier 66; 1955 66+2mo; 1956 66+4mo; 1957 66+6mo; 1958 66+8mo;
//     1959 66+10mo; 1960 or later 67.
//   • Claiming early: the benefit is reduced 5/9 of 1% per month for the first 36 months before FRA,
//     plus 5/12 of 1% per month for each additional month (earliest claim: 62).
//   • Claiming late: delayed retirement credits add 2/3 of 1% per month (8% a year) after FRA, up to
//     age 70. No credits accrue after 70.
// Cumulative totals start at each claiming age and add one monthly benefit per month. An optional
// cost-of-living adjustment (COLA) raises every benefit by the same percentage each year after 62,
// so it scales both claims alike. Simplification: claiming ages are whole years, and the earnings
// test, taxes, spousal and survivor benefits are not modeled.

export interface BreakEvenInput {
  /** Monthly benefit at full retirement age, from the reader's SSA statement. */
  benefitAtFra: number;
  birthYear: number;
  /** Earlier claiming age, whole years 62–70. */
  claimAgeA: number;
  /** Later claiming age, whole years 62–70. */
  claimAgeB: number;
  /** Assumed yearly cost-of-living adjustment, percent. 0 = today's dollars. */
  colaPct: number;
}

export interface ClaimOption {
  age: number;
  /** Monthly benefit at this claiming age (before any COLA). */
  monthly: number;
  /** Percent of the FRA benefit, e.g. 70 for a 30% reduction. */
  pctOfFra: number;
}

export interface BreakEvenResult {
  fraMonths: number;
  fraLabel: string;
  a: ClaimOption;
  b: ClaimOption;
  /** Age (in months) when the later claim's cumulative total first reaches the earlier claim's; null if never by 100. */
  breakEvenMonths: number | null;
  breakEvenLabel: string;
  /** Cumulative benefits received by each milestone age. */
  milestones: { age: number; totalA: number; totalB: number }[];
}

export const EARLIEST_CLAIM_AGE = 62;
export const LATEST_CREDIT_AGE = 70;
const HORIZON_AGE = 100;
const EARLY_TIER_MONTHS = 36; // SSA: the higher 5/9 rate applies to the first 36 months early
const EARLY_RATE_FIRST_36 = 5 / 9 / 100; // per month, first 36 months before FRA
const EARLY_RATE_BEYOND_36 = 5 / 12 / 100; // per month, each month beyond 36
const DELAYED_CREDIT_RATE = 2 / 3 / 100; // per month after FRA (8% a year), born 1943 or later
const MILESTONES = [70, 75, 80, 85, 90, 95];

/** Full retirement age in months, from SSA's table by year of birth. */
export function fraMonthsForBirthYear(birthYear: number): number {
  if (birthYear <= 1954) return 66 * 12;
  if (birthYear >= 1960) return 67 * 12;
  return 66 * 12 + (birthYear - 1954) * 2; // 1955 → 66+2mo … 1959 → 66+10mo
}

export function ageLabel(months: number): string {
  const y = Math.floor(months / 12);
  const m = Math.round(months - y * 12);
  return m === 0 ? `${y}` : `${y} and ${m} month${m === 1 ? "" : "s"}`;
}

/** Benefit as a share of the FRA benefit for a claim at `claimMonths` (age in months). */
export function claimFactor(claimMonths: number, fraMonths: number): number {
  if (claimMonths < fraMonths) {
    const early = fraMonths - claimMonths;
    return 1 - Math.min(early, EARLY_TIER_MONTHS) * EARLY_RATE_FIRST_36 - Math.max(early - EARLY_TIER_MONTHS, 0) * EARLY_RATE_BEYOND_36;
  }
  const late = Math.min(claimMonths, LATEST_CREDIT_AGE * 12) - fraMonths;
  return 1 + late * DELAYED_CREDIT_RATE;
}

function clampAge(a: number): number {
  return Math.min(LATEST_CREDIT_AGE, Math.max(EARLIEST_CLAIM_AGE, Math.round(a || 0)));
}

export function computeBreakEven(input: BreakEvenInput): BreakEvenResult {
  const fra = fraMonthsForBirthYear(Math.round(input.birthYear || 1960));
  let ageA = clampAge(input.claimAgeA);
  let ageB = clampAge(input.claimAgeB);
  if (ageB < ageA) [ageA, ageB] = [ageB, ageA];
  const base = Math.max(0, input.benefitAtFra || 0);
  const cola = Math.max(0, input.colaPct || 0) / 100;
  const factorA = claimFactor(ageA * 12, fra);
  const factorB = claimFactor(ageB * 12, fra);

  let totalA = 0;
  let totalB = 0;
  let breakEven: number | null = null;
  const milestones: BreakEvenResult["milestones"] = [];
  for (let m = EARLIEST_CLAIM_AGE * 12; m < HORIZON_AGE * 12; m++) {
    const colaFactor = Math.pow(1 + cola, Math.floor((m - EARLIEST_CLAIM_AGE * 12) / 12));
    if (m >= ageA * 12) totalA += base * factorA * colaFactor;
    if (m >= ageB * 12) totalB += base * factorB * colaFactor;
    // totals are "received by the end of month m"; break-even is the first age the later claim has caught up
    if (breakEven == null && base > 0 && ageB > ageA && m >= ageB * 12 && totalB >= totalA - 0.005) breakEven = m + 1; // half-cent tolerance for float sums
    if ((m + 1) % 12 === 0 && MILESTONES.includes((m + 1) / 12)) milestones.push({ age: (m + 1) / 12, totalA, totalB });
  }

  return {
    fraMonths: fra,
    fraLabel: ageLabel(fra),
    a: { age: ageA, monthly: base * factorA, pctOfFra: factorA * 100 },
    b: { age: ageB, monthly: base * factorB, pctOfFra: factorB * 100 },
    breakEvenMonths: breakEven,
    breakEvenLabel: breakEven == null ? (ageA === ageB ? "same claiming age" : base <= 0 ? "enter your benefit" : "not before 100") : ageLabel(breakEven),
    milestones,
  };
}
