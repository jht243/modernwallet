// Commercial mortgage engine — standalone. A commercial loan differs from a home loan in three ways
// this tool models: the payment is amortized over a longer period than the loan term (so a balloon
// balance is due when the term ends), the lender qualifies the property on debt service coverage
// ratio (DSCR = net operating income / annual debt service) rather than personal income, and many
// loans start with an interest-only period.
//
// Every rate, term, LTV and DSCR threshold is a user input. Nothing here assumes a market rate or a
// lender's underwriting minimum.

export interface CommercialMortgageInput {
  propertyValue: number;
  /** Loan-to-value as a percent of the property value (price or appraisal). */
  ltvPct: number;
  aprPct: number;
  /** Amortization period in years, counted from the end of any interest-only period. */
  amortYears: number;
  /** Loan term in years; the unpaid balance is due as a balloon when it ends. */
  termYears: number;
  /** Interest-only years at the start of the term (0 for none). */
  ioYears: number;
  /** Annual net operating income of the property (0 to skip the coverage rows). */
  noi: number;
  /** Lender's minimum DSCR, used for the maximum-loan row. */
  minDscr: number;
}

export interface CommercialMortgageResult {
  loanAmount: number;
  downPayment: number;
  /** Monthly payment during the interest-only period, if any. */
  ioPayment: number | null;
  /** Monthly principal-and-interest payment once amortization starts. */
  amortPayment: number | null;
  /** Balance still owed when the term ends (0 if the loan fully amortizes inside the term). */
  balloon: number | null;
  totalInterestOverTerm: number | null;
  /** Annual debt service in the first amortizing year (or the IO year if the term is all IO). */
  annualDebtService: number | null;
  dscr: number | null;
  /** NOI / loan amount, in percent. */
  debtYieldPct: number | null;
  /** Largest loan whose amortizing payment still meets minDscr on this NOI. */
  maxLoanAtMinDscr: number | null;
  meetsMinDscr: boolean | null;
}

const EMPTY: CommercialMortgageResult = {
  loanAmount: 0, downPayment: 0, ioPayment: null, amortPayment: null, balloon: null,
  totalInterestOverTerm: null, annualDebtService: null, dscr: null, debtYieldPct: null,
  maxLoanAtMinDscr: null, meetsMinDscr: null,
};

function level(balance: number, aprPct: number, months: number): number {
  const r = aprPct / 100 / 12;
  if (months <= 0) return balance;
  if (r === 0) return balance / months;
  return (balance * r) / (1 - Math.pow(1 + r, -months));
}

function presentValue(payment: number, aprPct: number, months: number): number {
  const r = aprPct / 100 / 12;
  if (months <= 0) return 0;
  if (r === 0) return payment * months;
  return payment * ((1 - Math.pow(1 + r, -months)) / r);
}

export function computeCommercialMortgage(input: CommercialMortgageInput): CommercialMortgageResult {
  const { propertyValue, ltvPct, aprPct, amortYears, termYears, ioYears, noi, minDscr } = input;
  if (!(propertyValue > 0) || !(ltvPct > 0)) return EMPTY;
  const loanAmount = propertyValue * (Math.min(ltvPct, 100) / 100);
  const downPayment = propertyValue - loanAmount;
  if (aprPct < 0 || !(amortYears > 0) || !(termYears > 0)) return { ...EMPTY, loanAmount, downPayment };

  const r = aprPct / 100 / 12;
  const amortMonths = Math.round(amortYears * 12);
  const termMonths = Math.round(termYears * 12);
  const ioMonths = Math.min(Math.max(0, Math.round(ioYears * 12)), termMonths);

  const ioPayment = ioMonths > 0 ? loanAmount * r : null;
  const amortPayment = level(loanAmount, aprPct, amortMonths);
  const amortPaid = Math.min(Math.max(0, termMonths - ioMonths), amortMonths);

  // Balance after `amortPaid` level payments.
  let balloon: number;
  if (amortPaid >= amortMonths) balloon = 0;
  else if (r === 0) balloon = loanAmount - amortPayment * amortPaid;
  else balloon = loanAmount * Math.pow(1 + r, amortPaid) - amortPayment * ((Math.pow(1 + r, amortPaid) - 1) / r);
  balloon = Math.max(0, balloon);

  const totalPaid = (ioPayment ?? 0) * ioMonths + amortPayment * amortPaid;
  const totalInterestOverTerm = totalPaid - (loanAmount - balloon);

  const allIo = ioMonths >= termMonths && ioMonths > 0;
  const annualDebtService = (allIo ? (ioPayment ?? 0) : amortPayment) * 12;

  const hasNoi = noi > 0;
  const dscr = hasNoi && annualDebtService > 0 ? noi / annualDebtService : null;
  const debtYieldPct = hasNoi ? (noi / loanAmount) * 100 : null;
  const maxLoanAtMinDscr = hasNoi && minDscr > 0 ? presentValue(noi / minDscr / 12, aprPct, amortMonths) : null;
  const meetsMinDscr = dscr != null && minDscr > 0 ? dscr >= minDscr : null;

  return {
    loanAmount, downPayment, ioPayment, amortPayment, balloon, totalInterestOverTerm,
    annualDebtService, dscr, debtYieldPct, maxLoanAtMinDscr, meetsMinDscr,
  };
}
