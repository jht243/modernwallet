// Personal loan engine — standard amortizing unsecured personal loan (debt consolidation, home
// improvement, etc.), NOT a business term loan (see business-loan-payoff.ts) or a factor-rate
// product (MCA/invoice factoring). Kept as an independent copy of the amortization math rather
// than importing auto-loan.ts, so a change to that engine can never silently affect this one.
//
// The one thing most "personal loan calculator" tools skip: almost every unsecured personal
// loan lender (SoFi, LendingClub, Upstart, etc.) deducts an origination fee from the amount you
// actually receive, while your monthly payment is still calculated on the full face value of the
// loan. That gap between "what you owe" and "what you got" means your stated APR understates your
// real borrowing cost. This engine computes that real cost as an effective APR — the same concept
// the Truth in Lending Act requires lenders to disclose, per the CFPB's explanation of APR
// (https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-mortgage-interest-rate-and-an-apr-en-135/).

export interface PersonalLoanInput {
  loanAmount: number;
  interestRatePct: number;
  loanTermMonths: number;
  /** Origination fee, deducted from the disbursed amount (not financed into the balance) —
   *  the common structure among online personal loan lenders. 0–10% typical range. */
  originationFeePct: number;
}

export interface PersonalLoanResult {
  monthlyPayment: number | null;
  totalRepaid: number | null;
  totalInterest: number | null;
  originationFeeAmount: number | null;
  amountReceived: number | null;
  /** Interest + origination fee combined — the true dollar cost of borrowing. */
  totalCostOfBorrowing: number | null;
  /** The annualized rate that equates your monthly payment stream to the amount you ACTUALLY
   *  received (vs. the loan's face value). Always ≥ the stated interestRatePct when a fee applies. */
  effectiveAprPct: number | null;
}

const EMPTY: PersonalLoanResult = {
  monthlyPayment: null, totalRepaid: null, totalInterest: null, originationFeeAmount: null,
  amountReceived: null, totalCostOfBorrowing: null, effectiveAprPct: null,
};

/** Standard fully-amortizing monthly payment for a principal/annual-rate/term. */
function monthlyPaymentFor(principal: number, annualRatePct: number, months: number): number {
  if (months <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}

/** Present value of a level monthly payment stream at a given annual rate. */
function presentValue(payment: number, annualRatePct: number, months: number): number {
  const r = annualRatePct / 100 / 12;
  if (r === 0) return payment * months;
  return payment * (1 - Math.pow(1 + r, -months)) / r;
}

/** Solves for the annual rate whose payment stream (at `payment`) has a present value equal to
 *  `targetPV` (the amount actually disbursed). Bisection — monotonic, so it always converges. */
function solveEffectiveApr(payment: number, targetPV: number, months: number): number {
  let lo = 0;
  let hi = 200; // 200% APR ceiling — well above any realistic personal loan, guards convergence
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const pv = presentValue(payment, mid, months);
    // Higher rate → lower PV of the same payment stream (money later is worth less).
    if (pv > targetPV) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

export function computePersonalLoan(input: PersonalLoanInput): PersonalLoanResult {
  const loanAmount = Math.max(0, input.loanAmount ?? 0);
  const rate = Math.max(0, input.interestRatePct ?? 0);
  const term = clampInt(input.loanTermMonths, 1, 120);
  const feePct = Math.min(10, Math.max(0, input.originationFeePct ?? 0));
  if (!(loanAmount > 0)) return EMPTY;

  const monthlyPayment = round2(monthlyPaymentFor(loanAmount, rate, term));
  const totalRepaid = round2(monthlyPayment * term);
  const totalInterest = round2(totalRepaid - loanAmount);
  const originationFeeAmount = round2(loanAmount * (feePct / 100));
  const amountReceived = round2(loanAmount - originationFeeAmount);
  const totalCostOfBorrowing = round2(totalRepaid - amountReceived);

  const effectiveAprPct = amountReceived > 0
    ? round2(solveEffectiveApr(monthlyPayment, amountReceived, term))
    : null;

  return { monthlyPayment, totalRepaid, totalInterest, originationFeeAmount, amountReceived, totalCostOfBorrowing, effectiveAprPct };
}

function round2(n: number): number { return Math.round(n * 100) / 100; }
function clampInt(n: number, lo: number, hi: number): number {
  const v = Math.round(Number(n));
  if (!Number.isFinite(v)) return lo;
  return Math.min(hi, Math.max(lo, v));
}
