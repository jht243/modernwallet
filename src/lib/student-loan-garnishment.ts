// Defaulted federal student loan collection exposure — standalone engine (X-trends pass 2026-10-20).
//
// Sources:
//  - Wage garnishment: 20 U.S.C. 1095a(a)(1), deduction for any pay period may not exceed 15% of disposable pay
//    (disposable pay = compensation left after legally required withholdings, 1095a(e)).
//  - Tax refund offset: the Treasury can apply part or all of a federal refund to the debt (IRS, "Tax Refunds May Be Applied to Offset Certain Debts").
//  - Social Security offset: 31 CFR 285.4, the lesser of 15% of the monthly benefit or the amount of the benefit above $750.
// Not modelled: other garnishments, state rules, hardship hearings, collection costs added to the balance, interest.

/** Maximum share of disposable pay an administrative wage garnishment may take per pay period (20 U.S.C. 1095a(a)(1)). */
export const AWG_RATE = 0.15;
/** Maximum share of a monthly Social Security benefit that can be offset (31 CFR 285.4). */
export const SS_OFFSET_RATE = 0.15;
/** Monthly benefit amount protected from offset (31 CFR 285.4). */
export const SS_PROTECTED = 750;

export type PayFrequency = "weekly" | "biweekly" | "semimonthly" | "monthly";
export const PERIODS_PER_YEAR: Record<PayFrequency, number> = { weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12 };

export interface GarnishmentInput {
  /** Pay left after legally required deductions (taxes etc.), per paycheck. */
  disposablePay: number;
  frequency: PayFrequency;
  /** Expected federal tax refund for the year. */
  taxRefund: number;
  /** Monthly Social Security benefit (0 if none). */
  ssBenefit: number;
  /** Defaulted balance. */
  balance: number;
}

export interface GarnishmentResult {
  perPaycheck: number;
  perMonth: number;
  perYear: number;
  refundTaken: number;
  ssPerMonth: number;
  ssPerYear: number;
  /** Total taken in the first 12 months from all three tools, never more than the balance. */
  firstYearTotal: number;
  /** Months of wage garnishment alone to clear the balance (null when pay is zero). */
  monthsToClear: number | null;
}

export function computeGarnishment(i: GarnishmentInput): GarnishmentResult | null {
  if (!(i.balance > 0)) return null;
  const n = PERIODS_PER_YEAR[i.frequency];
  const pay = Math.max(0, i.disposablePay || 0);
  const perPaycheckRaw = pay * AWG_RATE;
  const perYearRaw = perPaycheckRaw * n;
  const ssPerMonthRaw = Math.max(0, Math.min((i.ssBenefit || 0) * SS_OFFSET_RATE, (i.ssBenefit || 0) - SS_PROTECTED));
  const refund = Math.max(0, i.taxRefund || 0);
  const perPaycheck = Math.min(perPaycheckRaw, i.balance);
  const perYear = Math.min(perYearRaw, i.balance);
  const refundTaken = Math.min(refund, i.balance);
  const ssPerMonth = ssPerMonthRaw;
  const ssPerYear = Math.min(ssPerMonthRaw * 12, i.balance);
  const firstYearTotal = Math.min(i.balance, perYearRaw + refundTaken + ssPerMonthRaw * 12);
  const monthlyWage = perYearRaw / 12;
  return {
    perPaycheck,
    perMonth: Math.min(monthlyWage, i.balance),
    perYear,
    refundTaken,
    ssPerMonth,
    ssPerYear,
    firstYearTotal,
    monthsToClear: monthlyWage > 0 ? i.balance / monthlyWage : null,
  };
}
