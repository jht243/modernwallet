// Loan payment engine — standalone. The level monthly payment on a fixed-rate, fully amortizing loan is
// P x r / (1 - (1 + r)^-n), with r the monthly rate (APR / 12) and n the number of monthly payments.
// An optional extra monthly payment shortens the term; the schedule is run month by month for that case.
// Principal, APR and term are reader inputs. Taxes, insurance and lender fees are not included.

export interface LoanPaymentInput {
  amount: number;
  aprPct: number;
  years: number;
  /** Extra principal paid on top of the required payment each month (0 = none). */
  extraMonthly: number;
}

export interface LoanPaymentResult {
  months: number;
  payment: number;
  totalInterest: number;
  totalPaid: number;
  firstMonthInterest: number;
  firstMonthPrincipal: number;
  /** With the extra payment applied. Equal to the base figures when extraMonthly is 0. */
  extraMonths: number;
  extraTotalInterest: number;
  interestSaved: number;
  monthsSaved: number;
}

const EMPTY: LoanPaymentResult = {
  months: 0, payment: 0, totalInterest: 0, totalPaid: 0, firstMonthInterest: 0, firstMonthPrincipal: 0,
  extraMonths: 0, extraTotalInterest: 0, interestSaved: 0, monthsSaved: 0,
};

export function computeLoanPayment(input: LoanPaymentInput): LoanPaymentResult {
  const { amount, aprPct, years, extraMonthly } = input;
  const n = Math.round(years * 12);
  if (!(amount > 0) || !(n > 0) || aprPct < 0) return EMPTY;
  const r = aprPct / 100 / 12;
  const payment = r === 0 ? amount / n : (amount * r) / (1 - Math.pow(1 + r, -n));
  const totalPaid = payment * n;
  const totalInterest = totalPaid - amount;
  const firstMonthInterest = amount * r;

  let extraMonths = n;
  let extraTotalInterest = totalInterest;
  const extra = Math.max(extraMonthly, 0);
  if (extra > 0) {
    let bal = amount;
    let interest = 0;
    let m = 0;
    while (bal > 0.005 && m < 1200) {
      const i = bal * r;
      interest += i;
      bal = bal + i - Math.min(payment + extra, bal + i);
      m++;
    }
    extraMonths = m;
    extraTotalInterest = interest;
  }
  return {
    months: n, payment, totalInterest, totalPaid, firstMonthInterest,
    firstMonthPrincipal: payment - firstMonthInterest,
    extraMonths, extraTotalInterest,
    interestSaved: totalInterest - extraTotalInterest,
    monthsSaved: n - extraMonths,
  };
}
