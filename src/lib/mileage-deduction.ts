// Business mileage deduction engine — standard mileage rate vs. actual expenses, for the
// self-employed filer who deducts vehicle costs on Schedule C.
//
// Two things nearly every mileage calculator online gets wrong for 2026, and that this engine
// handles explicitly:
//
//   1. 2026 HAS TWO BUSINESS RATES. The IRS set the business standard mileage rate at 72.5
//      cents/mile effective January 1, 2026, then raised it to 76 cents/mile for July 1 through
//      December 31, 2026. A tool that multiplies annual miles by a single rate is wrong for every
//      full-year filer. This engine takes first-half and second-half miles separately and applies
//      each rate to its own period (IRS, "Standard mileage rates").
//
//   2. A MILEAGE DEDUCTION SAVES TWO TAXES, NOT ONE. Because it reduces Schedule C net profit, a
//      business mileage deduction cuts self-employment tax as well as income tax. Its true value
//      is roughly (marginal income-tax rate + 14.13% effective SE rate) × the deduction — not the
//      marginal rate alone. Tools that quote only the income-tax saving understate the benefit by
//      more than half for a typical driver in the 12% bracket.
//
// A third trap the engine surfaces rather than silently resolving: the standard mileage rate must
// be chosen in the FIRST year a vehicle is used for business if you ever want to use it for that
// vehicle. Start with actual expenses and you are locked out of the standard rate for that car's
// life (IRS Publication 463). The engine flags this on the comparison rather than just naming a
// winner for the current year.
//
// Estimates only. Does not model depreciation recapture, §179 expensing, bonus depreciation,
// lease inclusion amounts, or state treatment.

/** Business standard mileage rate, January 1 – June 30, 2026 (IRS). */
export const BUSINESS_RATE_2026_H1 = 0.725;
/** Business standard mileage rate, July 1 – December 31, 2026 (IRS). */
export const BUSINESS_RATE_2026_H2 = 0.76;
/** Medical/moving standard rates for 2026, first and second half (IRS). */
export const MEDICAL_RATE_2026_H1 = 0.205;
export const MEDICAL_RATE_2026_H2 = 0.235;
/** Charitable rate — fixed by statute, not adjusted for inflation (IRC §170(i)). */
export const CHARITABLE_RATE = 0.14;

/** Effective SE-tax rate on a dollar of Schedule C profit: 15.3% × 92.35%. */
export const EFFECTIVE_SE_RATE = 0.1413;

export interface MileageDeductionInput {
  /** Business miles driven January 1 – June 30, 2026. */
  milesFirstHalf: number;
  /** Business miles driven July 1 – December 31, 2026. */
  milesSecondHalf: number;
  /** Total actual vehicle costs for the year: gas, insurance, repairs, tires, registration, depreciation or lease payments. */
  actualExpensesTotal?: number;
  /** Share of total vehicle use that was for business, as a percent (0–100). */
  businessUsePercent?: number;
  /** Marginal ordinary income-tax rate as a decimal (e.g. 0.12). */
  marginalRate?: number;
  /** Whether self-employment tax applies to this income (a Schedule C filer: yes). Default true. */
  subjectToSeTax?: boolean;
  /** True when 2026 is the first year this vehicle was used for business — the year the method choice locks in. */
  firstYearForVehicle?: boolean;
}

export type MileageMethod = "standard" | "actual";

export interface MileageDeductionResult {
  totalBusinessMiles: number;
  /** Miles × 72.5¢ for the first half of 2026. */
  standardFirstHalf: number;
  /** Miles × 76¢ for the second half of 2026. */
  standardSecondHalf: number;
  standardDeduction: number;
  /** Blended cents-per-mile actually achieved across the two periods. */
  blendedRate: number;
  /** Actual expenses × business-use share. null when actual expenses were not entered. */
  actualDeduction: number | null;
  /** Which method produces the larger deduction this year. null when actuals were not entered. */
  betterMethod: MileageMethod | null;
  /** How much larger the better method is. null when actuals were not entered. */
  advantage: number | null;
  /** The deduction the taxpayer would take, using the better method when both are known. */
  chosenDeduction: number;
  /** Income tax saved by the chosen deduction. */
  incomeTaxSaved: number;
  /** Self-employment tax saved by the chosen deduction (0 when not subject to SE tax). */
  seTaxSaved: number;
  /** incomeTaxSaved + seTaxSaved — the real value of the deduction. */
  totalTaxSaved: number;
  /** Combined rate at which the deduction pays back, as a decimal. */
  combinedSavingsRate: number;
  /** True when choosing actual expenses now would forfeit the standard rate for this vehicle's life. */
  methodChoiceLocksIn: boolean;
}

const round2 = (n: number) => Math.round(n * 100) / 100;
const clampNonNeg = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function calculateMileageDeduction(input: MileageDeductionInput): MileageDeductionResult {
  const milesH1 = clampNonNeg(input.milesFirstHalf);
  const milesH2 = clampNonNeg(input.milesSecondHalf);
  const totalBusinessMiles = milesH1 + milesH2;

  const standardFirstHalf = milesH1 * BUSINESS_RATE_2026_H1;
  const standardSecondHalf = milesH2 * BUSINESS_RATE_2026_H2;
  const standardDeduction = standardFirstHalf + standardSecondHalf;
  const blendedRate = totalBusinessMiles > 0 ? standardDeduction / totalBusinessMiles : 0;

  const hasActuals =
    input.actualExpensesTotal !== undefined && clampNonNeg(input.actualExpensesTotal) > 0;
  const businessShare = Math.min(100, clampNonNeg(input.businessUsePercent ?? 100)) / 100;
  const actualDeduction = hasActuals
    ? clampNonNeg(input.actualExpensesTotal!) * businessShare
    : null;

  let betterMethod: MileageMethod | null = null;
  let advantage: number | null = null;
  if (actualDeduction !== null) {
    betterMethod = actualDeduction > standardDeduction ? "actual" : "standard";
    advantage = Math.abs(actualDeduction - standardDeduction);
  }

  const chosenDeduction =
    actualDeduction !== null ? Math.max(standardDeduction, actualDeduction) : standardDeduction;

  const marginalRate = clampNonNeg(input.marginalRate ?? 0);
  const subjectToSeTax = input.subjectToSeTax !== false;
  const incomeTaxSaved = chosenDeduction * marginalRate;
  const seTaxSaved = subjectToSeTax ? chosenDeduction * EFFECTIVE_SE_RATE : 0;
  const totalTaxSaved = incomeTaxSaved + seTaxSaved;

  return {
    totalBusinessMiles: round2(totalBusinessMiles),
    standardFirstHalf: round2(standardFirstHalf),
    standardSecondHalf: round2(standardSecondHalf),
    standardDeduction: round2(standardDeduction),
    blendedRate: Math.round(blendedRate * 10000) / 10000,
    actualDeduction: actualDeduction === null ? null : round2(actualDeduction),
    betterMethod,
    advantage: advantage === null ? null : round2(advantage),
    chosenDeduction: round2(chosenDeduction),
    incomeTaxSaved: round2(incomeTaxSaved),
    seTaxSaved: round2(seTaxSaved),
    totalTaxSaved: round2(totalTaxSaved),
    combinedSavingsRate: marginalRate + (subjectToSeTax ? EFFECTIVE_SE_RATE : 0),
    methodChoiceLocksIn: input.firstYearForVehicle === true && betterMethod === "actual",
  };
}
