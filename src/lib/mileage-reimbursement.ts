// Mileage reimbursement engine — standalone. Works out what an employer owes an employee for business
// miles, at the employer's own cents-per-mile rate or, by default, the IRS business standard mileage
// rate, and how much of a payment above the IRS rate counts as taxable wages.
//
// Rates and rules (IRS):
//   • 2026 business standard mileage rate: 72.5¢/mile Jan 1 – Jun 30 (IR-2025-128) and 76¢/mile
//     Jul 1 – Dec 31 (IR-2026-29), per irs.gov/tax-professionals/standard-mileage-rates. Reused from
//     src/lib/mileage-deduction.ts so the two tools never disagree.
//   • Under an accountable plan, a mileage allowance at or below the federal rate is not wages; the
//     part paid above the federal rate is included in the employee's wages (IRS Publication 463,
//     chapter 6; Publication 15).
//   • Business parking fees and tolls are reimbursed separately from the per-mile rate (Publication 463).
// No employer is required by federal law to use the IRS rate; the rate is the employer's policy input.

import { BUSINESS_RATE_2026_H1, BUSINESS_RATE_2026_H2 } from "./mileage-deduction";

export { BUSINESS_RATE_2026_H1, BUSINESS_RATE_2026_H2 };

export interface MileageReimbursementInput {
  /** Business miles driven Jan 1 – Jun 30, 2026. */
  milesFirstHalf: number;
  /** Business miles driven Jul 1 – Dec 31, 2026. */
  milesSecondHalf: number;
  /** Employer's own rate in cents per mile; 0 = use the IRS rate for each half. */
  employerRateCents: number;
  /** Business parking fees and tolls to add. */
  tollsAndParking: number;
}

export interface MileageReimbursementResult {
  rateFirstHalf: number; // $/mile applied Jan–Jun
  rateSecondHalf: number; // $/mile applied Jul–Dec
  mileageAmount: number; // miles × applied rates
  reimbursement: number; // mileage amount + tolls and parking
  irsRateAmount: number; // miles × IRS rates
  /** Mileage payment above the IRS rate — counted as wages under an accountable plan. */
  taxableExcess: number;
  /** IRS-rate amount minus the mileage payment, when the employer pays less than the IRS rate. */
  belowIrs: number;
  totalMiles: number;
  blendedRateCents: number | null;
}

export function computeMileageReimbursement(input: MileageReimbursementInput): MileageReimbursementResult {
  const h1 = Math.max(0, input.milesFirstHalf || 0);
  const h2 = Math.max(0, input.milesSecondHalf || 0);
  const employer = Math.max(0, input.employerRateCents || 0) / 100;
  const rate1 = employer > 0 ? employer : BUSINESS_RATE_2026_H1;
  const rate2 = employer > 0 ? employer : BUSINESS_RATE_2026_H2;
  const mileageAmount = h1 * rate1 + h2 * rate2;
  const irsRateAmount = h1 * BUSINESS_RATE_2026_H1 + h2 * BUSINESS_RATE_2026_H2;
  // excess is measured per half-year, since the federal rate changed on July 1
  const taxableExcess = h1 * Math.max(0, rate1 - BUSINESS_RATE_2026_H1) + h2 * Math.max(0, rate2 - BUSINESS_RATE_2026_H2);
  const totalMiles = h1 + h2;
  return {
    rateFirstHalf: rate1,
    rateSecondHalf: rate2,
    mileageAmount,
    reimbursement: mileageAmount + Math.max(0, input.tollsAndParking || 0),
    irsRateAmount,
    taxableExcess,
    belowIrs: Math.max(0, irsRateAmount - mileageAmount),
    totalMiles,
    blendedRateCents: totalMiles > 0 ? (mileageAmount / totalMiles) * 100 : null,
  };
}
