// Biweekly mortgage engine — standalone (tool-usage pass 2026-10-28). Compares three ways to pay the same loan:
//   1. monthly: the scheduled payment P = B × r ÷ (1 − (1 + r)^−n), r = APR ÷ 12, n = months left;
//   2. biweekly: half of P every two weeks = 26 half-payments a year (13 full payments), each applied when paid,
//      with interest at APR ÷ 26 per two-week period (stated assumption: the servicer credits half-payments when
//      received; a servicer that holds them until a full payment builds up saves less);
//   3. monthly + 1/12: P + P ÷ 12 each month, the same yearly total as biweekly with no plan needed.
// Fees are reader inputs (a one-time setup fee and a fee per biweekly payment); none is assumed as standard.

import { payment } from "./mortgage-recast";

export interface BiweeklyInput {
  balance: number;
  ratePct: number;
  yearsLeft: number;
  setupFee: number;
  perPaymentFee: number;
}

export interface Schedule {
  /** Payments made (monthly) or half-payments made (biweekly). */
  payments: number;
  /** Years to pay off. */
  years: number;
  interest: number;
}

export interface BiweeklyResult {
  monthlyPayment: number;
  halfPayment: number;
  monthly: Schedule;
  biweekly: Schedule;
  extraTwelfth: Schedule;
  biweeklyInterestSaved: number;
  extraTwelfthInterestSaved: number;
  biweeklyYearsSooner: number;
  fees: number;
  /** Interest saved by the biweekly plan minus its fees. */
  biweeklyNetSaving: number;
}

const MAX_PERIODS = 2000;

function amortize(balance: number, periodRate: number, pay: number, periodsPerYear: number): Schedule {
  let b = balance, k = 0, interest = 0;
  while (b > 0.005 && k < MAX_PERIODS) {
    const it = b * periodRate;
    interest += it;
    b = b + it - Math.min(pay, b + it);
    k++;
  }
  return { payments: k, years: k / periodsPerYear, interest };
}

export function computeBiweekly(i: BiweeklyInput): BiweeklyResult | null {
  const n = Math.round(i.yearsLeft * 12);
  if (!(i.balance > 0) || !(n > 0) || !(i.ratePct >= 0)) return null;
  const apr = i.ratePct / 100;
  const p = payment(i.balance, i.ratePct, n);
  const monthly = amortize(i.balance, apr / 12, p, 12);
  const biweekly = amortize(i.balance, apr / 26, p / 2, 26);
  const extraTwelfth = amortize(i.balance, apr / 12, p + p / 12, 12);
  const fees = Math.max(0, i.setupFee) + Math.max(0, i.perPaymentFee) * biweekly.payments;
  const biweeklyInterestSaved = monthly.interest - biweekly.interest;
  return {
    monthlyPayment: p,
    halfPayment: p / 2,
    monthly,
    biweekly,
    extraTwelfth,
    biweeklyInterestSaved,
    extraTwelfthInterestSaved: monthly.interest - extraTwelfth.interest,
    biweeklyYearsSooner: monthly.years - biweekly.years,
    fees,
    biweeklyNetSaving: biweeklyInterestSaved - fees,
  };
}
