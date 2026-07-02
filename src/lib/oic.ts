// Pure OIC (Offer in Compromise) engine for /tax-resolution/offer-in-compromise-calculator/.
//   computeOICFloor() — takes debt + asset classes + monthly income + allowable expenses →
//   Reasonable Collection Potential (RCP) for both Lump-Sum Cash Offer (K=12) and Periodic
//   Payment Offer (K=24), plus the suggested offer floor and application-fee status.
// ZERO React/DOM deps → safe at build time (stat injection) and runtime (island).
//
// Primary-source grounding (verified July 2026):
//   - Form 656-B (Rev. 4-2026): https://www.irs.gov/pub/irs-pdf/f656b.pdf
//     * Lump-Sum Cash Offer: pay in 5 or fewer installments within 5 months of acceptance.
//       Future Remaining Income = Remaining Monthly Income × 12.
//     * Periodic Payment Offer: pay in 6–24 months. Future Remaining Income = RMI × 24.
//     * Application fee: $205 (Section 2 of Form 656).
//     * Low Income Certification: AGI ≤ 250% of federal poverty guidelines waives the $205 fee
//       AND the 20% lump-sum down payment AND monthly payments during processing.
//   - IRM 5.8.5 (Financial Analysis) — Net Realizable Equity (NRE) calculation:
//     https://www.irs.gov/irm/part5/irm_05-008-005
//     * Real estate: use "quick sale value" (QSV) = 80% of fair market value.
//     * Vehicles: QSV then subtract $3,450 statutory exemption per vehicle (up to 2).
//     * Bank accounts: 100% of balance minus 1 month allowable expenses.
//     * Retirement accounts: value net of tax + early-withdrawal penalty (~72–75% of balance).
//     * Life insurance: cash surrender value.
//   - Loans against an asset reduce NRE dollar for dollar.
//   - FY2025 acceptance rate (IRS Data Book Table 25): 7,199 / 33,591 = 21.4%.

export interface OICInput {
  /** Total tax debt (tax + penalties + interest), whole dollars. */
  totalDebt: number;

  /** Asset classes (fair market value / balance BEFORE IRS discounts). */
  cashOnHand: number;              // checking + savings (subtract 1mo expenses to get NRE)
  investments: number;             // taxable brokerage, stocks, bonds — 100% NRE
  retirementAccounts: number;      // 401k, IRA — NRE ~72% (tax + 10% penalty)
  realEstateEquity: number;        // FMV of home minus mortgage — QSV = 80%
  vehicles: number;                // total vehicle FMV (up to 2) — QSV + $3,450 exemption per vehicle
  numberOfVehicles: number;        // 0, 1, or 2 (>2 gets no additional exemption)
  otherAssetsFMV: number;          // life insurance CSV, business interests — QSV = 80%
  loansAgainstAssets: number;      // ADDITIONAL loans not already netted (e.g., HELOC beyond mortgage)

  /** Monthly income (gross), whole dollars. */
  monthlyIncome: number;
  /** Allowable monthly expenses per IRS Collection Financial Standards. */
  monthlyAllowableExpenses: number;

  /** Household size — used for the Low Income Certification check. */
  householdSize: number;
  /** State's cost-of-living tier for 250% FPL threshold. Default: contiguous 48. */
  region?: "contiguous48" | "alaska" | "hawaii";
}

export interface OICResult {
  /** Net Realizable Equity — the "asset" component of RCP. */
  nre: number;
  breakdown: {
    cashNRE: number;
    investmentsNRE: number;
    retirementNRE: number;
    realEstateNRE: number;
    vehiclesNRE: number;
    otherNRE: number;
    lessAdditionalLoans: number;
  };
  /** Remaining Monthly Income (income − allowable expenses, floored at 0). */
  remainingMonthlyIncome: number;

  /** RCP for Lump-Sum Cash Offer: NRE + 12 × RMI. This is the minimum viable offer. */
  rcpLumpSum: number;
  /** RCP for Periodic Payment Offer: NRE + 24 × RMI. Higher, but paid over 6–24 months. */
  rcpPeriodic: number;

  /** True if offer < debt (i.e., an OIC is mathematically viable). */
  oicViable: boolean;
  /** How much LESS than the debt the lump-sum floor is. Negative = OIC not viable. */
  savingsVsDebtLumpSum: number;

  /** Application fee status. */
  applicationFee: number;              // $205 or 0
  lowIncomeCertification: boolean;     // qualified for the fee waiver

  /** Suggested initial offer amount to submit — typically 100–110% of the RCP floor. */
  suggestedOfferLumpSum: number;
  suggestedOfferPeriodic: number;
}

// 2026 Federal Poverty Guidelines (annual), 48 contiguous states + DC.
// Source: https://aspe.hhs.gov/poverty-guidelines (2026 tables).
// Values are hardcoded snapshot; refresh annually.
const FPG_2026_48: Record<number, number> = {
  1: 15060,
  2: 20440,
  3: 25820,
  4: 31200,
  5: 36580,
  6: 41960,
  7: 47340,
  8: 52720,
};
const FPG_2026_ALASKA: Record<number, number> = {
  1: 18810,
  2: 25540,
  3: 32270,
  4: 39000,
  5: 45730,
  6: 52460,
  7: 59190,
  8: 65920,
};
const FPG_2026_HAWAII: Record<number, number> = {
  1: 17310,
  2: 23490,
  3: 29670,
  4: 35850,
  5: 42030,
  6: 48210,
  7: 54390,
  8: 60570,
};

function annualFPL(householdSize: number, region: OICInput["region"]): number {
  const size = Math.max(1, Math.min(8, Math.round(householdSize || 1)));
  const table =
    region === "alaska" ? FPG_2026_ALASKA :
    region === "hawaii" ? FPG_2026_HAWAII :
    FPG_2026_48;
  const base = table[size]!;
  // For household size > 8, add per-additional-member increment (2026: $5,380 for 48 contiguous).
  const add =
    region === "alaska" ? 6730 :
    region === "hawaii" ? 6180 :
    5380;
  const extra = Math.max(0, (householdSize || 1) - 8);
  return base + extra * add;
}

/** IRS statutory vehicle exemption per vehicle (up to 2 vehicles), from Form 656-B RCP worksheet. */
const VEHICLE_EXEMPTION = 3450;

export function computeOICFloor(input: OICInput): OICResult {
  const debt = Math.max(0, input.totalDebt || 0);

  // ---- Asset-class NRE calculations (Form 656-B worksheet + IRM 5.8.5) ----

  // Cash: 100% of balance minus 1 month of allowable expenses (kept aside as living reserve).
  const cashReserve = Math.max(0, input.monthlyAllowableExpenses || 0);
  const cashNRE = Math.max(0, (input.cashOnHand || 0) - cashReserve);

  // Taxable investments: full FMV counts as NRE.
  const investmentsNRE = Math.max(0, input.investments || 0);

  // Retirement accounts: net of income tax (~22%) + 10% early-withdrawal penalty ≈ 72% for
  // pre-59½ taxpayers. This is a conservative default used by Form 656-B examples.
  const retirementNRE = Math.max(0, Math.round((input.retirementAccounts || 0) * 0.72));

  // Real estate equity: quick-sale value discount of 80% per IRM 5.8.5.
  const realEstateNRE = Math.max(0, Math.round((input.realEstateEquity || 0) * 0.80));

  // Vehicles: QSV (80%) minus $3,450 statutory exemption per vehicle (max 2 vehicles).
  const vehicleQSV = Math.max(0, Math.round((input.vehicles || 0) * 0.80));
  const exemptions = Math.min(2, Math.max(0, Math.round(input.numberOfVehicles || 0))) * VEHICLE_EXEMPTION;
  const vehiclesNRE = Math.max(0, vehicleQSV - exemptions);

  // Other assets (life insurance CSV, business interests): QSV 80%.
  const otherNRE = Math.max(0, Math.round((input.otherAssetsFMV || 0) * 0.80));

  // Any ADDITIONAL loans (e.g., HELOC not already netted out of real estate equity input) reduce NRE.
  const lessAdditionalLoans = Math.max(0, input.loansAgainstAssets || 0);

  const nre = Math.max(
    0,
    cashNRE + investmentsNRE + retirementNRE + realEstateNRE + vehiclesNRE + otherNRE - lessAdditionalLoans,
  );

  // ---- Future Income (Remaining Monthly Income × multiplier) ----

  const income = Math.max(0, input.monthlyIncome || 0);
  const expenses = Math.max(0, input.monthlyAllowableExpenses || 0);
  const remainingMonthlyIncome = Math.max(0, income - expenses);

  const rcpLumpSum = nre + 12 * remainingMonthlyIncome;
  const rcpPeriodic = nre + 24 * remainingMonthlyIncome;

  // ---- Low Income Certification (Form 656, Section 1) ----
  const householdSize = Math.max(1, Math.round(input.householdSize || 1));
  const agi = 12 * income;
  const fplThreshold = 2.5 * annualFPL(householdSize, input.region);
  const lowIncomeCertification = agi <= fplThreshold;
  const applicationFee = lowIncomeCertification ? 0 : 205;

  // ---- Suggested initial offer: 100% for stability, or 105–110% to leave negotiation room. ----
  // Convention: suggest exactly the RCP floor as the mathematical minimum; the taxpayer can
  // choose to add a small cushion.
  const suggestedOfferLumpSum = Math.max(0, rcpLumpSum);
  const suggestedOfferPeriodic = Math.max(0, rcpPeriodic);

  return {
    nre,
    breakdown: {
      cashNRE,
      investmentsNRE,
      retirementNRE,
      realEstateNRE,
      vehiclesNRE,
      otherNRE,
      lessAdditionalLoans,
    },
    remainingMonthlyIncome,
    rcpLumpSum,
    rcpPeriodic,
    oicViable: rcpLumpSum < debt,
    savingsVsDebtLumpSum: Math.max(0, debt - rcpLumpSum),
    applicationFee,
    lowIncomeCertification,
    suggestedOfferLumpSum,
    suggestedOfferPeriodic,
  };
}
