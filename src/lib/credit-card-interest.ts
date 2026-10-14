// Credit card interest engine — standalone. Card issuers charge interest on the average daily balance:
// each day's balance is multiplied by the daily periodic rate (APR / days in the year), and the days
// are summed over the billing cycle. This tool uses simple (non-compounding) daily interest inside one
// cycle with an optional payment on a chosen day, then shows what the same APR costs over a year if the
// balance is carried and interest compounds daily. APR, cycle length and year basis are reader inputs
// (issuers use 365 or 360); nothing is taken from a card agreement.

export interface CardInterestInput {
  /** Balance at the start of the billing cycle. */
  balance: number;
  aprPct: number;
  /** Days in the billing cycle (typically 28 to 31). */
  cycleDays: number;
  /** Days used for the daily rate: 365 or 360. */
  yearDays: number;
  /** A payment made during the cycle (0 = none). */
  payment: number;
  /** Day of the cycle the payment posts (1 = first day). Ignored when payment is 0. */
  paymentDay: number;
}

export interface CardInterestResult {
  dailyRatePct: number;
  averageDailyBalance: number;
  interestThisCycle: number;
  /** Interest for the cycle if no payment were made, for comparison. */
  interestNoPayment: number;
  /** Effective annual cost if the balance is carried and interest compounds daily. */
  effectiveAnnualPct: number;
  /** Simple annualised interest on a flat balance: balance x APR. */
  interestPerYearFlat: number;
}

const EMPTY: CardInterestResult = { dailyRatePct: 0, averageDailyBalance: 0, interestThisCycle: 0, interestNoPayment: 0, effectiveAnnualPct: 0, interestPerYearFlat: 0 };

export function computeCardInterest(input: CardInterestInput): CardInterestResult {
  const { balance, aprPct, cycleDays, yearDays, payment, paymentDay } = input;
  if (!(balance > 0) || !(cycleDays > 0) || !(yearDays > 0) || aprPct < 0) return EMPTY;
  const daily = aprPct / 100 / yearDays;
  const pay = Math.min(Math.max(payment, 0), balance);
  const day = Math.min(Math.max(Math.round(paymentDay) || 1, 1), Math.round(cycleDays));
  // Days before the payment posts carry the full balance; the payment day and after carry the reduced balance.
  const fullDays = pay > 0 ? day - 1 : cycleDays;
  const reducedDays = cycleDays - fullDays;
  const adb = (balance * fullDays + (balance - pay) * reducedDays) / cycleDays;
  return {
    dailyRatePct: daily * 100,
    averageDailyBalance: adb,
    interestThisCycle: adb * daily * cycleDays,
    interestNoPayment: balance * daily * cycleDays,
    effectiveAnnualPct: (Math.pow(1 + daily, yearDays) - 1) * 100,
    interestPerYearFlat: balance * (aprPct / 100),
  };
}
