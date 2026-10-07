// Debt consolidation engine — standalone. Compares keeping up to four debts on their current
// payments against rolling them into one new fixed-rate loan. The old debts are simulated month by
// month at the payment the borrower enters; the new loan is a level-payment loan sized to cover the
// balances plus an origination fee taken out of the proceeds.
//
// Every balance, rate, payment, term and fee is a user input. Nothing here assumes a market rate.

export interface DebtLine {
  balance: number;
  aprPct: number;
  /** Monthly payment the borrower makes today. */
  payment: number;
}

export interface DebtConsolidationInput {
  debts: DebtLine[];
  newAprPct: number;
  newTermMonths: number;
  /** Origination fee as a percent of the new loan, taken out of the proceeds. */
  feePct: number;
}

export interface DebtConsolidationResult {
  totalBalance: number;
  currentMonthlyPayment: number;
  /** Months until the last debt is gone at today's payments; null if any payment never clears its debt. */
  currentMonths: number | null;
  currentTotalInterest: number | null;
  /** True when at least one payment does not cover its monthly interest. */
  currentNeverPaysOff: boolean;
  newLoanAmount: number;
  feeAmount: number;
  newMonthlyPayment: number;
  newTotalInterest: number;
  newTotalPaid: number;
  /** Today's total interest minus the new loan's interest plus fee (positive = consolidating costs less). */
  netSavings: number | null;
  paymentChange: number;
}

function simulate(d: DebtLine): { months: number; interest: number } | null {
  if (!(d.balance > 0)) return { months: 0, interest: 0 };
  const r = d.aprPct / 100 / 12;
  if (!(d.payment > d.balance * r + 0.005)) return null;
  let bal = d.balance;
  let interest = 0;
  let m = 0;
  while (bal > 0.005 && m < 1200) {
    const i = bal * r;
    interest += i;
    bal = bal + i - Math.min(d.payment, bal + i);
    m++;
  }
  return m >= 1200 ? null : { months: m, interest };
}

export function computeDebtConsolidation(input: DebtConsolidationInput): DebtConsolidationResult {
  const debts = input.debts.filter((d) => d.balance > 0);
  const totalBalance = debts.reduce((s, d) => s + d.balance, 0);
  const currentMonthlyPayment = debts.reduce((s, d) => s + d.payment, 0);

  let currentMonths: number | null = 0;
  let currentTotalInterest: number | null = 0;
  let currentNeverPaysOff = false;
  for (const d of debts) {
    const s = simulate(d);
    if (!s) { currentNeverPaysOff = true; currentMonths = null; currentTotalInterest = null; break; }
    currentMonths = Math.max(currentMonths ?? 0, s.months);
    currentTotalInterest = (currentTotalInterest ?? 0) + s.interest;
  }

  const fee = Math.min(Math.max(input.feePct, 0), 99) / 100;
  const newLoanAmount = totalBalance > 0 ? totalBalance / (1 - fee) : 0;
  const feeAmount = newLoanAmount - totalBalance;
  const n = Math.round(input.newTermMonths);
  const r = input.newAprPct / 100 / 12;
  let newMonthlyPayment = 0;
  if (newLoanAmount > 0 && n > 0) newMonthlyPayment = r === 0 ? newLoanAmount / n : (newLoanAmount * r) / (1 - Math.pow(1 + r, -n));
  const newTotalPaid = newMonthlyPayment * Math.max(n, 0);
  const newTotalInterest = Math.max(0, newTotalPaid - newLoanAmount);

  const netSavings = currentTotalInterest == null ? null : currentTotalInterest - (newTotalInterest + feeAmount);
  return {
    totalBalance, currentMonthlyPayment, currentMonths, currentTotalInterest, currentNeverPaysOff,
    newLoanAmount, feeAmount, newMonthlyPayment, newTotalInterest, newTotalPaid, netSavings,
    paymentChange: newMonthlyPayment - currentMonthlyPayment,
  };
}
