// Social Security COLA engine — standalone. Turns the reader's current monthly benefit into its
// estimated January 2027 amount after the 3.6% cost-of-living adjustment, and builds a before/after
// chart across common benefit levels.
//
// Sources:
//   • COLA: SSA press release, October 14, 2026 — "a 3.6 percent benefit increase for 2027",
//     beginning with January 2027 benefits (SSI from December 31, 2026).
//   • Rounding: SSA POMS RS 00601.020 — a monthly benefit amount that is not a multiple of $0.10 is
//     rounded down to the next lower dime; after deductions such as the Medicare Part B premium the
//     claimant pays, the final payment is rounded down to the next lower whole dollar.
// Simplification: SSA applies the COLA to the primary insurance amount and recomputes the benefit
// from it, so a reduced (early-claim) or family benefit can differ from this estimate by cents. The
// COLA notice is the exact figure.

/** 2027 Social Security COLA, percent (SSA press release, 2026-10-14). */
export const COLA_2027_PCT = 3.6;
/** Chart rows: benefit levels from $500 to $4,000 in $250 steps. */
export const CHART_MIN = 500;
export const CHART_MAX = 4000;
export const CHART_STEP = 250;

export interface ColaInput {
  /** Current (December 2026) monthly benefit before any Medicare deduction. */
  currentBenefit: number;
  /** Monthly Medicare Part B premium deducted from the 2027 benefit. 0 = none. */
  partBPremium: number;
}

export interface ColaResult {
  colaPct: number;
  /** 2027 monthly benefit before deductions, rounded down to the dime. */
  newBenefit: number;
  /** newBenefit minus currentBenefit. */
  monthlyIncrease: number;
  /** monthlyIncrease × 12. */
  yearlyIncrease: number;
  /** newBenefit minus the Part B premium, rounded down to the dollar (never below 0). */
  netPayment: number;
  hasPartB: boolean;
}

/** Round down to the next lower multiple of $0.10 (POMS RS 00601.020 A.2). */
export function floorDime(v: number): number {
  return Math.floor(Math.round(v * 1000) / 100) / 10;
}

/** Round down to the next lower whole dollar (POMS RS 00601.020 D). */
export function floorDollar(v: number): number {
  return Math.floor(Math.round(v * 100) / 100);
}

export function applyCola(benefit: number, colaPct = COLA_2027_PCT): number {
  const b = Math.max(0, Number.isFinite(benefit) ? benefit : 0);
  return floorDime(b * (1 + colaPct / 100));
}

export function computeCola(input: ColaInput): ColaResult {
  const current = Math.max(0, Number.isFinite(input.currentBenefit) ? input.currentBenefit : 0);
  const partB = Math.max(0, Number.isFinite(input.partBPremium) ? input.partBPremium : 0);
  const newBenefit = applyCola(current);
  const monthlyIncrease = Math.round((newBenefit - current) * 100) / 100;
  return {
    colaPct: COLA_2027_PCT,
    newBenefit,
    monthlyIncrease,
    yearlyIncrease: Math.round(monthlyIncrease * 12 * 100) / 100,
    netPayment: Math.max(0, floorDollar(newBenefit - partB)),
    hasPartB: partB > 0,
  };
}

export interface ColaChartRow {
  current: number;
  newBenefit: number;
  monthlyIncrease: number;
}

export function colaChart(): ColaChartRow[] {
  const rows: ColaChartRow[] = [];
  for (let b = CHART_MIN; b <= CHART_MAX; b += CHART_STEP) {
    const nb = applyCola(b);
    rows.push({ current: b, newBenefit: nb, monthlyIncrease: Math.round((nb - b) * 100) / 100 });
  }
  return rows;
}
