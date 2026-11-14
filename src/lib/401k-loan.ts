// 401(k) plan-loan engine — standalone. Federal limits only; the plan document controls what a plan allows.
//
// Source: 26 U.S.C. 72(p)(2) (https://www.law.cornell.edu/uscode/text/26/72).
//   72(p)(2)(A): a loan, added to the outstanding balance of all other loans from the plan, may not exceed the
//   lesser of (i) $50,000 reduced by the excess (if any) of the highest outstanding loan balance in the 1-year
//   period ending the day before the loan over the outstanding balance on the day the loan is made, or
//   (ii) the greater of one-half of the vested (nonforfeitable) accrued benefit or $10,000.
//   72(p)(2)(B): the loan must be repayable within 5 years, except a loan used to buy a dwelling that will be the
//   principal residence of the participant.
//   72(p)(2)(C): substantially level amortization with payments not less frequently than quarterly.
// Level payment per period = P x r / (1 - (1 + r)^-n), r = APR / payments per year, n = years x payments per year.
// APR, balances and term are reader inputs. Fees, taxes and lost investment growth are not included.

/** 72(p)(2)(A)(i): the dollar ceiling. */
export const LOAN_DOLLAR_CAP = 50000;
/** 72(p)(2)(A)(ii)(II): the floor of the greater-of prong. */
export const LOAN_FLOOR = 10000;
/** 72(p)(2)(A)(ii)(I): the share of the vested balance in the greater-of prong. */
export const VESTED_SHARE = 0.5;
/** 72(p)(2)(B)(i): maximum term in years for a general-purpose loan. */
export const MAX_GENERAL_TERM_YEARS = 5;
/** 72(p)(2)(C): fewest payments per year that still counts as level amortization. */
export const MIN_PAYMENTS_PER_YEAR = 4;

export type LoanPurpose = "general" | "residence";

export interface Loan401kInput {
  vestedBalance: number;
  /** Outstanding balance of all plan loans on the day the new loan is made. */
  outstandingLoans: number;
  /** Highest outstanding plan-loan balance in the 12 months ending the day before the new loan. */
  highest12: number;
  /** Amount the reader wants to borrow. */
  loanAmount: number;
  aprPct: number;
  termYears: number;
  paymentsPerYear: number;
  purpose: LoanPurpose;
}

export interface ScheduleRow {
  period: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

export interface YearRow {
  year: number;
  paid: number;
  interest: number;
  principal: number;
  endBalance: number;
}

export interface Loan401kResult {
  /** $50,000 reduced by the 12-month peak excess over today's balance (prong 1). */
  prongDollar: number;
  /** The greater of half the vested balance or $10,000 (prong 2). */
  prongVested: number;
  /** The lesser of the two prongs: the ceiling on all plan loans together. */
  totalLimit: number;
  /** Room left for a new loan after subtracting loans already owed (never below 0). */
  maxNewLoan: number;
  /** The amount actually modelled: the reader's amount. */
  loanAmount: number;
  overLimit: boolean;
  /** Amount over the limit (0 when within). */
  excessOverLimit: number;
  periods: number;
  payment: number;
  totalInterest: number;
  totalRepaid: number;
  schedule: ScheduleRow[];
  yearly: YearRow[];
  /** True when the term exceeds 5 years for a non-residence loan. */
  termTooLong: boolean;
  /** True when payments are less frequent than quarterly. */
  tooInfrequent: boolean;
  /** Any rule check failed: the loan would be treated as a distribution under 72(p)(1). */
  deemedDistributionRisk: boolean;
  flags: string[];
  valid: boolean;
}

const EMPTY: Loan401kResult = {
  prongDollar: 0, prongVested: 0, totalLimit: 0, maxNewLoan: 0, loanAmount: 0, overLimit: false,
  excessOverLimit: 0, periods: 0, payment: 0, totalInterest: 0, totalRepaid: 0, schedule: [], yearly: [],
  termTooLong: false, tooInfrequent: false, deemedDistributionRisk: false, flags: [], valid: false,
};

const nz = (x: number): number => (Number.isFinite(x) && x > 0 ? x : 0);

/** The statutory room for a new loan, with no payment math. */
export function loanLimit(vestedBalance: number, outstandingLoans: number, highest12: number) {
  const vested = nz(vestedBalance);
  const owed = nz(outstandingLoans);
  const peak = nz(highest12);
  const prongDollar = Math.max(0, LOAN_DOLLAR_CAP - Math.max(0, peak - owed));
  const prongVested = Math.max(VESTED_SHARE * vested, LOAN_FLOOR);
  const totalLimit = Math.min(prongDollar, prongVested);
  const maxNewLoan = Math.max(0, totalLimit - owed);
  return { prongDollar, prongVested, totalLimit, maxNewLoan };
}

/** Level payment for `periods` payments at periodic rate `r`. */
export function levelPayment(principal: number, r: number, periods: number): number {
  if (!(principal > 0) || !(periods > 0)) return 0;
  return r === 0 ? principal / periods : (principal * r) / (1 - Math.pow(1 + r, -periods));
}

export function computeLoan401k(input: Loan401kInput): Loan401kResult {
  const lim = loanLimit(input.vestedBalance, input.outstandingLoans, input.highest12);
  const loanAmount = nz(input.loanAmount);
  const apr = Number.isFinite(input.aprPct) && input.aprPct > 0 ? input.aprPct : 0;
  const ppy = Math.round(nz(input.paymentsPerYear));
  const termYears = nz(input.termYears);
  const periods = Math.round(termYears * ppy);
  const overLimit = loanAmount > lim.maxNewLoan + 0.005;
  const termTooLong = input.purpose !== "residence" && termYears > MAX_GENERAL_TERM_YEARS;
  const tooInfrequent = ppy > 0 && ppy < MIN_PAYMENTS_PER_YEAR;

  const flags: string[] = [];
  if (overLimit) flags.push("over-limit");
  if (termTooLong) flags.push("term-over-5-years");
  if (tooInfrequent) flags.push("less-than-quarterly");

  const base = {
    ...EMPTY,
    ...lim,
    loanAmount,
    overLimit,
    excessOverLimit: overLimit ? loanAmount - lim.maxNewLoan : 0,
    termTooLong,
    tooInfrequent,
    deemedDistributionRisk: overLimit || termTooLong || tooInfrequent,
    flags,
  };
  if (!(loanAmount > 0) || !(periods > 0) || !(ppy > 0)) return { ...base, periods: Math.max(periods, 0) };

  const r = apr / 100 / ppy;
  const payment = levelPayment(loanAmount, r, periods);
  const schedule: ScheduleRow[] = [];
  const yearly: YearRow[] = [];
  let bal = loanAmount;
  let totalInterest = 0;
  let yPaid = 0, yInt = 0, yPrin = 0;
  for (let k = 1; k <= periods; k++) {
    const interest = bal * r;
    const principal = k === periods ? bal : payment - interest;
    bal = k === periods ? 0 : bal - principal;
    totalInterest += interest;
    schedule.push({ period: k, payment: principal + interest, interest, principal, balance: bal });
    yPaid += principal + interest; yInt += interest; yPrin += principal;
    if (k % ppy === 0 || k === periods) {
      yearly.push({ year: Math.ceil(k / ppy), paid: yPaid, interest: yInt, principal: yPrin, endBalance: bal });
      yPaid = 0; yInt = 0; yPrin = 0;
    }
  }
  const totalRepaid = loanAmount + totalInterest;
  return { ...base, valid: true, periods, payment, totalInterest, totalRepaid, schedule, yearly };
}
