// Rule of 78 engine — standalone (trend-lane-c pass 2026-11-23). Compares how a precomputed installment loan
// credits the lender with interest when it is paid off early:
//  1. Level payment: payment = P × r ÷ (1 − (1 + r)^−n), r = APR ÷ 12, n = scheduled monthly payments
//     (reused from computeLoanPayment). Total finance charge I = payment × n − P.
//  2. Rule of 78 (sum of the digits): month j of an n-month loan is credited (n − j + 1) ÷ S of I, where
//     S = n(n + 1) ÷ 2 (78 when n = 12, hence the name). After k payments the lender has earned
//     I × k(2n − k + 1) ÷ (n(n + 1)); the refund of unearned interest is I minus that.
//  3. Actuarial method: interest earned is the interest in the first k payments of the standard amortization
//     schedule; the refund is I minus that. The extra interest the Rule of 78 keeps is the difference.
// Statute: 15 U.S.C. 1615(b) (Truth in Lending Act): for a precomputed consumer credit transaction consummated
// after September 30, 1993 with a term longer than 61 months, the refund of unearned interest must be at least
// as favorable to the consumer as the actuarial method. Source:
// https://www.govinfo.gov/content/pkg/USCODE-2024-title15/html/USCODE-2024-title15-chap41-subchapI-partA-sec1615.htm
// Assumes fixed-rate, level monthly payments, whole months, no fees, no state law, no default rebate.

import { computeLoanPayment } from "./loan-payment";

/** Term (in months) above which 15 U.S.C. 1615(b) requires an actuarial-or-better refund on precomputed consumer loans. */
export const FEDERAL_ACTUARIAL_TERM_MONTHS = 61;
export const MAX_TERM_MONTHS = 120;
export const MAX_APR_PCT = 30;

export interface Rule78Input {
  amount: number;
  aprPct: number;
  /** Scheduled number of monthly payments (whole months). */
  termMonths: number;
  /** The loan is paid off after this many scheduled payments have been made (1 to termMonths). */
  payoffAfter: number;
}

export interface Rule78Row {
  month: number;
  /** Interest credited to this month under the Rule of 78. */
  rule78Interest: number;
  /** Interest in this month's payment under the actuarial method. */
  actuarialInterest: number;
}

export interface Rule78Result {
  payment: number;
  termMonths: number;
  payoffAfter: number;
  remainingPayments: number;
  /** Sum of the digits, n(n + 1) / 2. */
  digitSum: number;
  /** Total finance charge over the full term. */
  financeCharge: number;
  rule78Earned: number;
  rule78Refund: number;
  actuarialEarned: number;
  actuarialRefund: number;
  /** Extra interest the Rule of 78 keeps versus the actuarial method (rule78Earned - actuarialEarned). */
  difference: number;
  /** Amount to pay to settle after k payments: unpaid scheduled payments minus the refund. */
  payoffRule78: number;
  payoffActuarial: number;
  /** True when the term is over 61 months, where 15 U.S.C. 1615(b) bars the Rule of 78 on precomputed consumer loans. */
  overFederalLimit: boolean;
  schedule: Rule78Row[];
}

export function computeRule78(input: Rule78Input): Rule78Result | null {
  const { amount, aprPct, termMonths, payoffAfter } = input;
  const n = termMonths;
  const k = payoffAfter;
  if (![amount, aprPct, n, k].every(Number.isFinite)) return null;
  if (!(amount > 0) || aprPct < 0 || aprPct > MAX_APR_PCT) return null;
  if (!Number.isInteger(n) || n < 1 || n > MAX_TERM_MONTHS) return null;
  if (!Number.isInteger(k) || k < 1 || k > n) return null;

  const { payment } = computeLoanPayment({ amount, aprPct, years: n / 12, extraMonthly: 0 });
  const r = aprPct / 100 / 12;
  const financeCharge = payment * n - amount;
  const digitSum = (n * (n + 1)) / 2;

  const rule78Earned = (financeCharge * (k * (2 * n - k + 1))) / (n * (n + 1));

  const schedule: Rule78Row[] = [];
  let bal = amount;
  let actuarialEarned = 0;
  for (let j = 1; j <= n; j++) {
    const interest = bal * r;
    schedule.push({ month: j, rule78Interest: (financeCharge * (n - j + 1)) / digitSum, actuarialInterest: interest });
    if (j <= k) actuarialEarned += interest;
    bal = bal + interest - payment;
  }
  // Balance after k payments from the closed form (avoids carrying rounding drift from the loop).
  const balanceAfterK = r === 0 ? amount - (amount / n) * k : amount * Math.pow(1 + r, k) - (payment * (Math.pow(1 + r, k) - 1)) / r;
  const remainingPayments = n - k;
  const rule78Refund = financeCharge - rule78Earned;
  const actuarialRefund = financeCharge - actuarialEarned;
  const difference = rule78Earned - actuarialEarned;

  return {
    payment, termMonths: n, payoffAfter: k, remainingPayments, digitSum, financeCharge,
    rule78Earned, rule78Refund, actuarialEarned, actuarialRefund, difference,
    payoffRule78: payment * remainingPayments - rule78Refund,
    payoffActuarial: Math.max(balanceAfterK, 0),
    overFederalLimit: n > FEDERAL_ACTUARIAL_TERM_MONTHS,
    schedule,
  };
}
