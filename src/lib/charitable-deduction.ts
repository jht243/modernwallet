// Charitable donation deduction engine (GA4 top-pages pass 2026-10-26) — standalone, no React/DOM.
//
// Scope: CASH gifts to churches and other public charities, tax year 2026, federal return only.
// Sources: IRS Rev. Proc. 2025-32 / IRS 2026 inflation-adjustment release (standard deduction),
// IRS Publication 526 (60% of AGI limit on cash gifts), and the 2026 changes from Public Law 119-21:
//   - itemizers deduct only the gifts above 0.5% of AGI;
//   - non-itemizers may deduct cash gifts up to $1,000 ($2,000 married filing jointly).
// Not modeled: non-cash gifts, appreciated securities, carryovers, the extra standard deduction for
// age 65+ or blindness, the senior deduction, and gifts to donor-advised funds (not eligible for the
// non-itemizer deduction). The 60% limit is applied first and the 0.5% floor second; the IRS has not
// published a worksheet showing that ordering for 2026, so the page says so.

export type CdStatus = "single" | "mfj" | "mfs" | "hoh";

/** 2026 standard deduction (Rev. Proc. 2025-32). */
export const STANDARD_DEDUCTION: Record<CdStatus, number> = { single: 16100, mfj: 32200, mfs: 16100, hoh: 24150 };
/** Non-itemizer cash deduction cap, 2026 onward. */
export const NON_ITEMIZER_CAP: Record<CdStatus, number> = { single: 1000, mfj: 2000, mfs: 1000, hoh: 1000 };
/** Cash gifts to public charities cannot exceed this share of AGI (Pub 526). */
export const CASH_AGI_LIMIT = 0.6;
/** Itemizers lose the first 0.5% of AGI of giving, starting 2026. */
export const AGI_FLOOR = 0.005;

export interface CdInput {
  status: CdStatus;
  agi: number;
  /** Cash gifts this year to a church or other public charity. */
  cashGifts: number;
  /** Other itemized deductions (mortgage interest, state and local taxes up to the cap, medical above its floor…). */
  otherItemized: number;
  /** The reader's federal marginal rate, as a percent (e.g. 22). */
  marginalRatePct: number;
}

export interface CdYear {
  /** Charitable deduction if the reader itemizes: min(gifts, 60% AGI) minus 0.5% AGI, never below 0. */
  charityIfItemizing: number;
  itemizedTotal: number;
  /** Standard deduction plus the non-itemizer cash deduction. */
  standardTotal: number;
  nonItemizerDeduction: number;
  itemizes: boolean;
  bestTotal: number;
  /** What the gifts add on top of the standard deduction with no giving. */
  addedByGiving: number;
}

export interface CdResult extends CdYear {
  taxSaved: number;
  floorAmount: number;
  capAmount: number;
  /** Two-year bunching test: give double now and nothing next year vs the same total split evenly. */
  evenTwoYear: number;
  bunchedTwoYear: number;
  bunchingGain: number;
  bunchingTaxGain: number;
}

const clean = (v: number) => (Number.isFinite(v) ? Math.max(0, v) : 0);
const r2 = (v: number) => Math.round(v * 100) / 100;

export function computeYear(i: Pick<CdInput, "status" | "agi" | "otherItemized">, gifts: number): CdYear {
  const agi = clean(i.agi);
  const g = clean(gifts);
  const std = STANDARD_DEDUCTION[i.status];
  const charityIfItemizing = Math.max(0, Math.min(g, CASH_AGI_LIMIT * agi) - AGI_FLOOR * agi);
  const itemizedTotal = clean(i.otherItemized) + charityIfItemizing;
  const nonItemizerDeduction = Math.min(g, NON_ITEMIZER_CAP[i.status]);
  const standardTotal = std + nonItemizerDeduction;
  const itemizes = itemizedTotal > standardTotal;
  const bestTotal = Math.max(itemizedTotal, standardTotal);
  return {
    charityIfItemizing: r2(charityIfItemizing),
    itemizedTotal: r2(itemizedTotal),
    standardTotal: r2(standardTotal),
    nonItemizerDeduction: r2(nonItemizerDeduction),
    itemizes,
    bestTotal: r2(bestTotal),
    // Baseline with no giving: the better of the standard deduction and the other itemized deductions.
    addedByGiving: r2(bestTotal - Math.max(std, clean(i.otherItemized))),
  };
}

export function computeCharitable(i: CdInput): CdResult {
  const y = computeYear(i, i.cashGifts);
  const rate = Math.min(Math.max(clean(i.marginalRatePct), 0), 100) / 100;
  const g = clean(i.cashGifts);
  const even = 2 * computeYear(i, g).bestTotal;
  const bunched = computeYear(i, 2 * g).bestTotal + computeYear(i, 0).bestTotal;
  const gain = r2(bunched - even);
  return {
    ...y,
    taxSaved: r2(y.addedByGiving * rate),
    floorAmount: r2(AGI_FLOOR * clean(i.agi)),
    capAmount: r2(CASH_AGI_LIMIT * clean(i.agi)),
    evenTwoYear: r2(even),
    bunchedTwoYear: r2(bunched),
    bunchingGain: gain,
    bunchingTaxGain: r2(gain * rate),
  };
}
