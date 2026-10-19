// Florida Amendment 3 (Nov 3, 2026 ballot) homestead savings engine — standalone.
//
// Source: Florida TaxWatch property-tax resource center (floridataxwatch.org/research/florida-property-tax-resource-center/)
// and the Pinellas County Property Appraiser's Amendment 3 page. The larger exemption applies to NON-SCHOOL levies
// (county, city, special districts) only; school taxes are unchanged. Savings = extra exempt value x non-school millage.
// Not modelled: the CPI indexing that starts Jan 1, 2029, the 5-year phase-in for newcomers, Save Our Homes cap changes.

/** Current non-school homestead exemption, as used in Florida TaxWatch's own calculator ($50,000 base, indexed). */
export const CURRENT_EXEMPTION = 51_411;
/** Non-school homestead exemption if the amendment passes, by tax year (Jan 1 assessment date). */
export const NEW_EXEMPTION: Record<2027 | 2028, number> = { 2027: 150_000, 2028: 250_000 };
/** Statewide average non-school millage used in the published examples (10.5 mills = $10.50 per $1,000 of taxable value). */
export const AVG_NON_SCHOOL_MILLS = 10.5;

export interface FlAmendment3Input {
  /** Non-school millage rate in mills (per $1,000 of taxable value). */
  mills: number;
  /** Assessed (Save Our Homes) value of the homestead; the exemption cannot exceed it. */
  assessedValue: number;
}

export interface FlAmendment3Result {
  extraExempt2027: number;
  extraExempt2028: number;
  savings2027: number;
  savings2028: number;
  billNow: number;
  bill2027: number;
  bill2028: number;
  capped: boolean;
}

export function computeFlAmendment3(i: FlAmendment3Input): FlAmendment3Result | null {
  if (!(i.mills >= 0) || !(i.assessedValue > 0)) return null;
  const rate = i.mills / 1000;
  const taxable = (ex: number) => Math.max(0, i.assessedValue - ex);
  const billNow = taxable(CURRENT_EXEMPTION) * rate;
  const bill2027 = taxable(NEW_EXEMPTION[2027]) * rate;
  const bill2028 = taxable(NEW_EXEMPTION[2028]) * rate;
  return {
    extraExempt2027: taxable(CURRENT_EXEMPTION) - taxable(NEW_EXEMPTION[2027]),
    extraExempt2028: taxable(CURRENT_EXEMPTION) - taxable(NEW_EXEMPTION[2028]),
    savings2027: billNow - bill2027,
    savings2028: billNow - bill2028,
    billNow,
    bill2027,
    bill2028,
    capped: i.assessedValue < NEW_EXEMPTION[2028],
  };
}
