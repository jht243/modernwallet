// Florida Amendment 3 (Nov 3, 2026 ballot) homestead savings engine — standalone.
//
// Source: Florida TaxWatch property-tax resource center (floridataxwatch.org/research/florida-property-tax-resource-center/)
// and the Pinellas County Property Appraiser's Amendment 3 page. The larger exemption applies to NON-SCHOOL levies
// (county, city, special districts) only; school taxes are unchanged. Savings = extra exempt value x non-school millage.
// Not modelled: the CPI indexing that starts Jan 1, 2029, the phase-in schedule for newcomers, Save Our Homes cap changes.
//
// Today's exemption is banded (Fla. Const. Art. VII s.6(a); s. 196.031(1), F.S.): the first $25,000 of assessed value is
// exempt from all levies; the additional non-school exemption ($26,411 for 2026, CPI-indexed, FL DOR
// https://www.floridarevenue.com/property/Documents/cpi_homestead_exemption.pdf) covers only assessed value from $50,000
// up to $76,411. Homes assessed at $76,411 or more get the full $51,411. (Tool-usage pass 2026-11-04, row F1.)

/** Current non-school homestead exemption, as used in Florida TaxWatch's own calculator ($50,000 base, indexed). */
export const CURRENT_EXEMPTION = 51_411;
/** Non-school homestead exemption under Amendment 3 (approved by voters Nov 3, 2026), by tax year (Jan 1 assessment date). */
export const NEW_EXEMPTION: Record<2027 | 2028, number> = { 2027: 150_000, 2028: 250_000 };
/** Statewide average non-school millage used in the published examples (10.5 mills = $10.50 per $1,000 of taxable value). */
export const AVG_NON_SCHOOL_MILLS = 10.5;
/** First homestead exemption: assessed value from $0 to $25,000, all levies. */
export const FIRST_EXEMPTION = 25_000;
/** The additional non-school exemption starts at this assessed value. */
export const ADDITIONAL_EXEMPTION_START = 50_000;

/** Today's non-school exemption for a given assessed value: 25,000 + clamp(assessed - 50,000, 0, 26,411). */
export function currentExemptionFor(assessedValue: number): number {
  const band = Math.min(Math.max(assessedValue - ADDITIONAL_EXEMPTION_START, 0), CURRENT_EXEMPTION - FIRST_EXEMPTION);
  return FIRST_EXEMPTION + band;
}

export interface FlAmendment3Input {
  /** Non-school millage rate in mills (per $1,000 of taxable value). */
  mills: number;
  /** Assessed (Save Our Homes) value of the homestead; the exemption cannot exceed it. */
  assessedValue: number;
  /**
   * Florida resident with homestead on Dec 31, 2026? Optional, default true. When false, the 2027 and 2028 bills keep
   * today's exemption (the larger exemption phases in for newcomers; nothing new is computed).
   */
  residentBy2027?: boolean;
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
  const now = currentExemptionFor(i.assessedValue);
  const newcomer = i.residentBy2027 === false;
  const ex2027 = newcomer ? now : NEW_EXEMPTION[2027];
  const ex2028 = newcomer ? now : NEW_EXEMPTION[2028];
  const billNow = taxable(now) * rate;
  const bill2027 = taxable(ex2027) * rate;
  const bill2028 = taxable(ex2028) * rate;
  return {
    extraExempt2027: taxable(now) - taxable(ex2027),
    extraExempt2028: taxable(now) - taxable(ex2028),
    savings2027: billNow - bill2027,
    savings2028: billNow - bill2028,
    billNow,
    bill2027,
    bill2028,
    capped: i.assessedValue < NEW_EXEMPTION[2028],
  };
}
