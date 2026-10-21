// Rental-property sale tax engine (tool-usage pass 2026-10-21) — standalone, no React/DOM.
// Estimates the federal tax on selling a rental held more than one year.
//
// Sources:
//   • Gain, amount realized and adjusted basis: IRS Publication 544 (Sales and Other Dispositions of
//     Assets) — gain = amount realized (sale price minus selling expenses) minus adjusted basis;
//     adjusted basis = cost (price + purchase closing costs) + capital improvements − depreciation.
//   • Depreciation recapture on a residential rental: IRS Topic 409 — the part of the gain equal to
//     depreciation allowed or allowable ("unrecaptured section 1250 gain") is taxed at a MAXIMUM 25%.
//   • 27.5-year straight-line recovery of the building (not the land): IRS Publication 527.
//   • 2026 long-term capital gain thresholds (taxable income): IRS Rev. Proc. 2025-32 / Topic 409.
//   • Net investment income tax 3.8% above $200,000 (single) / $250,000 (MFJ) of MAGI: IRS Topic 559.
// Simplifications (stated in the UI): the depreciation part is shown at its 25% ceiling (it can be
// taxed lower when your ordinary bracket is below 25%); no NIIT, state tax, AMT, §121 exclusion,
// installment sale or 1031 deferral is computed; the property was held more than one year.

export type SaleFilingStatus = "single" | "mfj";

/** Maximum federal rate on unrecaptured section 1250 gain (IRS Topic 409). */
export const RECAPTURE_MAX_RATE = 0.25;
/** Residential rental recovery period in years (IRS Pub 527). */
export const RECOVERY_YEARS = 27.5;
/** 2026 taxable-income tops of the 0% and 15% long-term gain bands (Rev. Proc. 2025-32). */
export const LTCG_TOPS_2026: Record<SaleFilingStatus, [number, number]> = {
  single: [49450, 545500],
  mfj: [98900, 613700],
};
/** NIIT rate and 2026 MAGI thresholds (IRS Topic 559; thresholds are not indexed). */
export const NIIT_RATE = 0.038;
export const NIIT_THRESHOLD: Record<SaleFilingStatus, number> = { single: 200000, mfj: 250000 };

export interface SaleTaxInput {
  salePrice: number;
  sellingCostsPct: number;
  purchasePrice: number;
  purchaseClosingCosts: number;
  improvements: number;
  depreciation: number;
  status: SaleFilingStatus;
  /** Taxable income before the sale (after deductions). */
  otherTaxableIncome: number;
}

export interface SaleTaxResult {
  sellingCosts: number;
  amountRealized: number;
  adjustedBasis: number;
  /** Negative = a loss. */
  gain: number;
  /** Part of the gain equal to depreciation (unrecaptured §1250 gain). */
  recaptureGain: number;
  /** recaptureGain × 25% — the ceiling on that part's tax. */
  recaptureTaxMax: number;
  /** Gain left after the depreciation part. */
  remainingGain: number;
  /** Remaining gain split across the 0/15/20% bands. */
  bands: { rate: number; amount: number }[];
  remainingTax: number;
  /** recaptureTaxMax + remainingTax. */
  totalTaxMax: number;
  /** True when other income + gain clears the NIIT threshold (a MAGI proxy). */
  niitMayApply: boolean;
}

const clean = (v: number) => (Number.isFinite(v) ? Math.max(0, v) : 0);
const r2 = (v: number) => Math.round(v * 100) / 100;

/** Straight-line building depreciation for whole years rented (Pub 527), land excluded. */
export function estimateDepreciation(price: number, closing: number, landPct: number, years: number): number {
  const basis = (clean(price) + clean(closing)) * (1 - Math.min(100, clean(landPct)) / 100);
  const y = Math.min(RECOVERY_YEARS, clean(years));
  return r2((basis / RECOVERY_YEARS) * y);
}

export function computeSaleTax(i: SaleTaxInput): SaleTaxResult {
  const sale = clean(i.salePrice);
  const sellingCosts = r2(sale * Math.min(100, clean(i.sellingCostsPct)) / 100);
  const amountRealized = r2(sale - sellingCosts);
  const depreciation = clean(i.depreciation);
  const adjustedBasis = r2(clean(i.purchasePrice) + clean(i.purchaseClosingCosts) + clean(i.improvements) - depreciation);
  const gain = r2(amountRealized - adjustedBasis);
  const positive = Math.max(0, gain);
  const recaptureGain = r2(Math.min(depreciation, positive));
  const recaptureTaxMax = r2(recaptureGain * RECAPTURE_MAX_RATE);
  const remainingGain = r2(positive - recaptureGain);

  // The long-term gain sits on top of ordinary income and the depreciation part (Schedule D Tax Worksheet order).
  const [top0, top15] = LTCG_TOPS_2026[i.status];
  const start = clean(i.otherTaxableIncome) + recaptureGain;
  const end = start + remainingGain;
  const slice = (lo: number, hi: number) => Math.max(0, Math.min(end, hi) - Math.max(start, lo));
  const bands = [
    { rate: 0, amount: r2(slice(0, top0)) },
    { rate: 0.15, amount: r2(slice(top0, top15)) },
    { rate: 0.2, amount: r2(slice(top15, Infinity)) },
  ];
  const remainingTax = r2(bands.reduce((s, b) => s + b.amount * b.rate, 0));
  return {
    sellingCosts, amountRealized, adjustedBasis, gain, recaptureGain, recaptureTaxMax, remainingGain, bands, remainingTax,
    totalTaxMax: r2(recaptureTaxMax + remainingTax),
    niitMayApply: clean(i.otherTaxableIncome) + positive > NIIT_THRESHOLD[i.status],
  };
}
