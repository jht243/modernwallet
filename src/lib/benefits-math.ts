// FY2027 USDA COLA tables, contiguous 48 states/DC, effective Oct 1 2026–Sep 30 2027.
// https://fns-prod.azureedge.us/snap/allotment/cola (checked 2026-11-04).
export const SNAP_MAXIMUM = [306, 562, 808, 1023, 1217, 1463, 1616, 1841] as const;
export const SNAP_STANDARD_DEDUCTION = [217, 217, 217, 229, 268, 308, 308, 308] as const;
export const SNAP_NET_REFERENCE = [1330, 1804, 2277, 2750, 3224, 3697, 4170, 4644] as const;
export const SNAP_GROSS_REFERENCE = [1729, 2345, 2960, 3575, 4191, 4806, 5421, 6037] as const;
export const SNAP_SHELTER_CAP = 769;
export const SNAP_MINIMUM = 25; // Eligible one- and two-member households only.
// USDA deduction and allotment method: https://fns-prod.azureedge.us/snap/recipient/eligibility
export const SNAP_EARNED_DEDUCTION_RATE = 0.2;
export const SNAP_MEDICAL_THRESHOLD = 35;
export const SNAP_SHELTER_INCOME_SHARE = 0.5;
export const SNAP_NET_CONTRIBUTION_RATE = 0.3;
// 2026 poverty guidelines used for 2027 Marketplace coverage, contiguous 48/DC.
// https://www.healthcare.gov/glossary/federal-poverty-level-fpl/ (checked 2026-11-04).
export const ACA_FPL_2026 = [15960, 21640, 27320, 33000, 38680, 44360, 50040, 55720] as const;
// IRS Rev Proc 2026-26, 2027 applicable percentage table, section 2.01.
// https://www.irs.gov/irb/2026-31_irb
export const ACA_2027_BANDS = [
  {lower: 100, upper: 133, initial: 2.15, final: 2.15},
  {lower: 133, upper: 150, initial: 3.23, final: 4.30},
  {lower: 150, upper: 200, initial: 4.30, final: 6.78},
  {lower: 200, upper: 250, initial: 6.78, final: 8.66},
  {lower: 250, upper: 300, initial: 8.66, final: 10.22},
  {lower: 300, upper: 400, initial: 10.22, final: 10.22},
] as const;
export const BENEFITS_MAX_INPUT = 100_000_000; // Interface precision guard, not a program rule.
const MONTHS_PER_YEAR = 12;
const PERCENT = 100;
export type BenefitsRegion = "contiguous" | "other";
export type Eligibility = "unknown" | "confirmed" | "excluded";
export const validMoney = (n: number) => Number.isFinite(n) && n >= 0 && n <= BENEFITS_MAX_INPUT && Math.abs(n * 100 - Math.round(n * 100)) < 0.00001;
const validHousehold = (n: number) => Number.isInteger(n) && n >= 1 && n <= 8;
const validEligibility = (v: Eligibility) => ["unknown", "confirmed", "excluded"].includes(v);
export type SnapInput = {household: number; earned: number; unearned: number; dependentCare: number; childSupport: number; medical: number; rent: number; utilities: number; elderlyDisabled: boolean; region: BenefitsRegion; eligibility: Eligibility};
export const SNAP_DEFAULTS: SnapInput = {household: 4, earned: 2000, unearned: 0, dependentCare: 0, childSupport: 0, medical: 0, rent: 1200, utilities: 0, elderlyDisabled: false, region: "contiguous", eligibility: "unknown"};
export function snapBenefits(i: SnapInput) {
  if (!validHousehold(i.household) || ![i.earned, i.unearned, i.dependentCare, i.childSupport, i.medical, i.rent, i.utilities].every(validMoney) || !validEligibility(i.eligibility) || typeof i.elderlyDisabled !== "boolean") return {error: "Enter a whole household size from 1 to 8 and nonnegative amounts with no more than two decimal places within the field limits."} as const;
  if (i.region !== "contiguous") return {error: "This calculation covers the 48 contiguous states and District of Columbia. Use the official tables for Alaska, Hawaii and other areas."} as const;
  const h = i.household - 1;
  const gross = i.earned + i.unearned;
  const earnedDeduction = i.earned * SNAP_EARNED_DEDUCTION_RATE;
  const standardDeduction = SNAP_STANDARD_DEDUCTION[h];
  const medicalDeduction = i.elderlyDisabled ? Math.max(0, i.medical - SNAP_MEDICAL_THRESHOLD) : 0;
  const adjusted = Math.max(0, gross - earnedDeduction - standardDeduction - i.dependentCare - i.childSupport - medicalDeduction);
  const shelter = i.rent + i.utilities;
  const excessShelter = Math.max(0, shelter - adjusted * SNAP_SHELTER_INCOME_SHARE);
  const shelterDeduction = i.elderlyDisabled ? excessShelter : Math.min(SNAP_SHELTER_CAP, excessShelter);
  const net = Math.max(0, adjusted - shelterDeduction);
  // Cent inputs create at most half-cent net amounts. Scale to avoid binary float
  // overshooting an exact whole-dollar 30% contribution before rounding upward.
  const contribution = Math.ceil(Math.round(net * 1000) * 3 / 10000);
  const maximum = SNAP_MAXIMUM[h];
  const formulaAmount = Math.max(0, maximum - contribution);
  const aboveNetReference = net > SNAP_NET_REFERENCE[h];
  const suppressed = i.eligibility === "excluded" || (aboveNetReference && i.eligibility !== "confirmed");
  const conditionalAmount = suppressed ? null : i.household <= 2 ? Math.max(SNAP_MINIMUM, formulaAmount) : formulaAmount;
  return {gross, earnedDeduction, standardDeduction, medicalDeduction, adjusted, shelter, excessShelter, shelterDeduction, net, contribution, maximum, formulaAmount, conditionalAmount, aboveNetReference, netReference: SNAP_NET_REFERENCE[h], grossReference: SNAP_GROSS_REFERENCE[h], minimumApplied: conditionalAmount !== null && conditionalAmount > formulaAmount};
}
export type AcaInput = {household: number; income: number; benchmark: number; enrollment: number; region: BenefitsRegion; eligibility: Eligibility};
export const ACA_DEFAULTS: AcaInput = {household: 2, income: 50000, benchmark: 600, enrollment: 550, region: "contiguous", eligibility: "unknown"};
export function acaApplicablePercentage(fplPercent: number): number | null {
  if (!Number.isFinite(fplPercent) || fplPercent < 100 || fplPercent > 400) return null;
  const band = ACA_2027_BANDS.find(b => fplPercent < b.upper) ?? ACA_2027_BANDS[ACA_2027_BANDS.length - 1];
  return band.initial + (band.final - band.initial) * (fplPercent - band.lower) / (band.upper - band.lower);
}
export function acaSubsidy(i: AcaInput) {
  if (!validHousehold(i.household) || ![i.income, i.benchmark, i.enrollment].every(validMoney) || !validEligibility(i.eligibility)) return {error: "Enter a whole household size from 1 to 8 and nonnegative amounts with no more than two decimal places within the field limits."} as const;
  if (i.region !== "contiguous") return {error: "This calculation uses the poverty guidelines for the 48 contiguous states and District of Columbia. Alaska, Hawaii and other areas are outside its scope."} as const;
  const poverty = ACA_FPL_2026[i.household - 1];
  const fplPercent = i.income / poverty * PERCENT;
  // Input precision was validated above. Integer cents preserve exact dollar
  // thresholds such as $21,226.80 (133% of the one-person guideline). A ratio
  // rounded down by binary arithmetic must not select the lower percentage band.
  const incomeCents = Math.round(i.income * 100);
  const inRange = incomeCents >= poverty * 100 && incomeCents <= poverty * 400;
  const band = ACA_2027_BANDS.find(b => incomeCents < poverty * b.upper) ?? ACA_2027_BANDS[ACA_2027_BANDS.length - 1];
  const percentage = inRange ? band.initial + (band.final - band.initial) * (incomeCents - poverty * band.lower) / (poverty * (band.upper - band.lower)) : null;
  const contribution = percentage === null ? null : i.income * percentage / PERCENT / MONTHS_PER_YEAR;
  // IRS PTC Q24/Q26: non-tobacco benchmark; eligible enrollment cap can include
  // the actual smoker premium. Nonessential benefit charges are excluded per
  // https://www.irs.gov/instructions/i8962 (enrollment-premium instructions).
  // https://www.irs.gov/affordable-care-act/individuals-and-families/questions-and-answers-on-the-premium-tax-credit
  const credit = contribution === null || i.eligibility !== "confirmed" ? null : Math.min(i.enrollment, Math.max(0, i.benchmark - contribution));
  return {poverty, fplPercent, inRange, percentage, contribution, credit, netPremium: credit === null ? null : i.enrollment - credit};
}
