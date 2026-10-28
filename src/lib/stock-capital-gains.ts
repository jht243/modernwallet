// Stock capital gains tax engine (Autocomplete pass 2026-10-28) - standalone, no React/DOM.
//
// Federal tax on one sale of stock, ETF or fund shares held in a taxable account, tax year 2026.
// Long-term (held more than one year): the gain is stacked on top of the reader's other taxable income and taxed at
//   0% / 15% / 20% using the 2026 thresholds in IRS Revenue Procedure 2025-32, section 4.03.
// Short-term (held one year or less): taxed as ordinary income, so the tax is the ordinary-income tax on
//   (other taxable income + gain) minus the ordinary-income tax on the other taxable income, using the 2026
//   brackets in ./tax-bracket (Rev. Proc. 2025-32, section 4).
// Net Investment Income Tax: 3.8% of the smaller of the gain or the MAGI above the threshold (IRS Topic 559).
//   MAGI is approximated as taxable income + the 2026 standard deduction + the gain.
// Not modeled: state tax, other investment income, loss carryovers, wash sales, qualified dividends,
// collectibles, small-business stock, and the $3,000 yearly limit on deducting net capital losses.
// Reference implementation and boundary scenarios: evidence/stock-capital-gains-tax-calculator/check.py.

import { BRACKET_TOPS, RATES, STANDARD_DEDUCTION, type FilingStatus } from "./tax-bracket";

/** Highest taxable income taxed at 0%, then at 15%, per filing status. Rev. Proc. 2025-32 section 4.03. */
export const LTCG_ZERO_TOP: Record<FilingStatus, number> = { single: 49450, mfj: 98900, hoh: 66200, mfs: 49450 };
export const LTCG_FIFTEEN_TOP: Record<FilingStatus, number> = { single: 545500, mfj: 613700, hoh: 579600, mfs: 306850 };
/** NIIT rate and MAGI thresholds. IRS Topic 559. */
export const NIIT_RATE = 0.038;
export const NIIT_THRESHOLD: Record<FilingStatus, number> = { single: 200000, mfj: 250000, hoh: 200000, mfs: 125000 };

export interface SgInput {
  status: FilingStatus;
  /** Taxable income before this sale (after deductions). */
  taxableIncome: number;
  basis: number;
  proceeds: number;
  /** True when held more than one year. */
  longTerm: boolean;
}

export interface SgResult {
  gain: number;
  incomeTax: number;
  niit: number;
  totalTax: number;
  effectiveRate: number;
  afterTax: number;
  /** Gain taxed at 0 / 15 / 20 (long-term only). */
  at0: number;
  at15: number;
  at20: number;
  /** Taxable income left in the 0% bracket before the sale (long-term). */
  zeroRoom: number;
  /** Marginal rate on the last dollar of gain. */
  marginalRate: number;
  isLoss: boolean;
}

/** Ordinary income tax on `ti` of taxable income, 2026 brackets. */
export function ordinaryTax(status: FilingStatus, ti: number): number {
  const tops = BRACKET_TOPS[status];
  let tax = 0;
  let prev = 0;
  for (let b = 0; b < RATES.length; b++) {
    const top = b < tops.length ? tops[b] : Infinity;
    if (ti > prev) tax += (Math.min(ti, top) - prev) * RATES[b];
    prev = top;
    if (ti <= top) break;
  }
  return tax;
}

function ordinaryMarginal(status: FilingStatus, ti: number): number {
  const tops = BRACKET_TOPS[status];
  for (let b = 0; b < tops.length; b++) if (ti <= tops[b]) return RATES[b];
  return RATES[RATES.length - 1];
}

export function computeStockGains(i: SgInput): SgResult | null {
  if (![i.taxableIncome, i.basis, i.proceeds].every((x) => Number.isFinite(x)) || i.taxableIncome < 0 || i.basis < 0 || i.proceeds < 0) return null;
  const gain = i.proceeds - i.basis;
  const base: SgResult = {
    gain, incomeTax: 0, niit: 0, totalTax: 0, effectiveRate: 0, afterTax: i.proceeds,
    at0: 0, at15: 0, at20: 0, zeroRoom: Math.max(0, LTCG_ZERO_TOP[i.status] - i.taxableIncome), marginalRate: 0, isLoss: gain < 0,
  };
  if (gain <= 0) return base;
  const T = i.taxableIncome;
  let incomeTax: number;
  let marginal: number;
  if (i.longTerm) {
    const z = LTCG_ZERO_TOP[i.status];
    const f = LTCG_FIFTEEN_TOP[i.status];
    const at0 = Math.max(0, Math.min(gain, z - T));
    const at15 = Math.max(0, Math.min(gain - at0, f - Math.max(T, z)));
    const at20 = gain - at0 - at15;
    base.at0 = at0; base.at15 = at15; base.at20 = at20;
    incomeTax = at15 * 0.15 + at20 * 0.2;
    marginal = at20 > 0 ? 0.2 : at15 > 0 ? 0.15 : 0;
  } else {
    incomeTax = ordinaryTax(i.status, T + gain) - ordinaryTax(i.status, T);
    marginal = ordinaryMarginal(i.status, T + gain);
  }
  const magi = T + STANDARD_DEDUCTION[i.status] + gain;
  const niit = NIIT_RATE * Math.max(0, Math.min(gain, magi - NIIT_THRESHOLD[i.status]));
  if (niit > 0) marginal += NIIT_RATE;
  const total = incomeTax + niit;
  return { ...base, incomeTax, niit, totalTax: total, effectiveRate: total / gain, afterTax: i.proceeds - total, marginalRate: marginal };
}
