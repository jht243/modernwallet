// Annualized return (CAGR) engine — solves BACKWARD from a beginning value, an ending value, and
// a holding period to the single constant annual growth rate that would produce that same ending
// value. This is the mirror image of `investment.ts` (which projects FORWARD from a rate to a
// future value): here the rate is the unknown being solved for, not an input.
//
// CAGR = (Ending Value / Beginning Value)^(1/years) − 1
//
// Also computes the simple (arithmetic) average annual return — total return divided evenly by
// the number of years — so the page can show the real, commonly-misunderstood gap between the
// two: CAGR reflects compounding and is pulled down by volatility ("variance drag"), while the
// simple average ignores the order and size of year-to-year swings and is always >= CAGR whenever
// returns vary. Pure math, ZERO React/DOM/host deps → build + runtime.

export interface AnnualizedReturnInput {
  beginningValue: number;
  endingValue: number;
  years: number;
}

export interface AnnualizedReturnResult {
  totalReturnPct: number | null;
  /** Compound annual growth rate (CAGR), as a percent. */
  annualizedReturnPct: number | null;
  /** Simple arithmetic average: totalReturnPct / years. Always >= CAGR when returns vary. */
  simpleAverageAnnualPct: number | null;
  /** simpleAverageAnnualPct − annualizedReturnPct. The "volatility drag" the simple average hides. */
  gapPct: number | null;
}

const EMPTY: AnnualizedReturnResult = {
  totalReturnPct: null, annualizedReturnPct: null, simpleAverageAnnualPct: null, gapPct: null,
};

export function computeAnnualizedReturn(input: AnnualizedReturnInput): AnnualizedReturnResult {
  const beginningValue = Math.max(0, input.beginningValue ?? 0);
  const endingValue = Math.max(0, input.endingValue ?? 0);
  const years = input.years ?? 0;

  if (!(beginningValue > 0) || !(years > 0)) return { ...EMPTY };

  const totalReturnPct = round4(((endingValue - beginningValue) / beginningValue) * 100);
  const ratio = endingValue / beginningValue;
  // A total loss (ratio 0) has no real root for a fractional exponent — report -100% and skip CAGR.
  const annualizedReturnPct = ratio > 0 ? round4((Math.pow(ratio, 1 / years) - 1) * 100) : null;
  const simpleAverageAnnualPct = round4(totalReturnPct / years);
  const gapPct = annualizedReturnPct !== null ? round4(simpleAverageAnnualPct - annualizedReturnPct) : null;

  return { totalReturnPct, annualizedReturnPct, simpleAverageAnnualPct, gapPct };
}

function round4(n: number): number { return Math.round(n * 10000) / 10000; }
