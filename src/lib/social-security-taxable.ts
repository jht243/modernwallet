// Taxable Social Security benefits engine (tool-usage pass 2026-10-21) — standalone, no React/DOM.
//
// Source: IRS Publication 915 (Social Security and Equivalent Railroad Retirement Benefits),
// Worksheet 1, and 26 U.S.C. §86. "Provisional income" (the IRS calls it combined income) =
// income other than Social Security (modified AGI) + tax-exempt interest + half of the benefits.
// Base amounts: $25,000 (single, head of household, qualifying surviving spouse, or married filing
// separately and lived apart all year), $32,000 (married filing jointly), $0 (married filing
// separately and lived with your spouse). Adjusted base amounts: $34,000 / $44,000 / $0.
// These amounts are set by statute and are not indexed for inflation.

export type SsStatus = "single" | "mfj" | "mfs-together";

export const BASE_AMOUNT: Record<SsStatus, number> = { single: 25000, mfj: 32000, "mfs-together": 0 };
export const ADJUSTED_BASE: Record<SsStatus, number> = { single: 34000, mfj: 44000, "mfs-together": 0 };
/** Share of benefits counted in provisional income, and the two inclusion caps (§86(a)). */
export const HALF = 0.5;
export const MAX_INCLUSION = 0.85;

export interface SsTaxableInput {
  status: SsStatus;
  /** Social Security benefits for the year (box 5 of Form SSA-1099). */
  benefits: number;
  /** All other income for the year (wages, pensions, IRA withdrawals, interest, dividends, gains…). */
  otherIncome: number;
  taxExemptInterest: number;
}

export interface SsTaxableResult {
  provisionalIncome: number;
  baseAmount: number;
  adjustedBase: number;
  taxable: number;
  /** taxable ÷ benefits, 0–85%, rounded to one decimal. */
  pctTaxable: number;
  tier: "none" | "up-to-50" | "up-to-85";
}

const clean = (v: number) => (Number.isFinite(v) ? Math.max(0, v) : 0);
const r2 = (v: number) => Math.round(v * 100) / 100;

export function computeSsTaxable(i: SsTaxableInput): SsTaxableResult {
  const b = clean(i.benefits);
  const base = BASE_AMOUNT[i.status];
  const adj = ADJUSTED_BASE[i.status];
  const pi = r2(clean(i.otherIncome) + clean(i.taxExemptInterest) + HALF * b);
  let taxable = 0;
  let tier: SsTaxableResult["tier"] = "none";
  if (b > 0 && pi > base) {
    if (pi <= adj) {
      taxable = Math.min(HALF * b, HALF * (pi - base));
      tier = "up-to-50";
    } else {
      // Pub 915 Worksheet 1: 85% of the excess over the adjusted base, plus the smaller of half the
      // benefits or half the gap between the two base amounts ($4,500 single / $6,000 joint / $0).
      const firstTier = Math.min(HALF * b, HALF * (adj - base));
      taxable = Math.min(MAX_INCLUSION * b, MAX_INCLUSION * (pi - adj) + firstTier);
      tier = "up-to-85";
    }
  }
  taxable = r2(taxable);
  return { provisionalIncome: pi, baseAmount: base, adjustedBase: adj, taxable, pctTaxable: b > 0 ? Math.round((taxable / b) * 1000) / 10 : 0, tier };
}
