// Pure auto-loan / mortgage amortization engine.
//
// Ported from the AutoIQ source app's `computeSummary()` (auto-loan-calculator/src/server.ts:250),
// with all app-store / MCP server coupling stripped out. This module has ZERO React/DOM/external
// dependencies, so it runs at BUILD TIME (Astro stat injection) AND at RUNTIME (the React island).
//
// Beyond the original (price → payment, payment → price, trade-in / incentives / tax / fees), this
// adds the extra-payment payoff scenario the "auto loan payoff calculator" spoke needs: feed an
// `extraMonthlyPayment` and get back interest saved + months saved + a full amortization schedule.

export interface AutoLoanInput {
  vehiclePrice: number;
  downPayment?: number;
  tradeInValue?: number;
  tradeInOwed?: number;
  cashIncentives?: number;
  salesTaxPct?: number;
  titleFees?: number;
  includeTaxesFees?: boolean;
  interestRatePct: number;
  loanTermMonths: number;
  /** Optional extra principal paid every month (for payoff / early-payoff scenarios). */
  extraMonthlyPayment?: number;
  /** Reverse mode: solve for the price you can afford from a target payment. */
  calculateBy?: "price" | "payment";
  monthlyPayment?: number;
}

export interface AmortRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface AutoLoanResult {
  vehiclePrice: number | null;
  loanAmount: number | null;
  /** Scheduled principal + interest payment (excludes any extra payment). */
  monthlyPaymentPI: number | null;
  monthsToPayoff: number | null;
  lifetimeInterest: number | null;
  totalCost: number | null; // loan amount + lifetime interest
  taxes: number | null;
  schedule: AmortRow[];
  // Extra-payment scenario (null when no extra payment supplied) ----
  interestSaved: number | null;
  monthsSaved: number | null;
  baselineMonths: number | null; // payoff months WITHOUT the extra payment
}

const EMPTY: AutoLoanResult = {
  vehiclePrice: null,
  loanAmount: null,
  monthlyPaymentPI: null,
  monthsToPayoff: null,
  lifetimeInterest: null,
  totalCost: null,
  taxes: null,
  schedule: [],
  interestSaved: null,
  monthsSaved: null,
  baselineMonths: null,
};

/** Scheduled fully-amortizing monthly payment for a principal/rate/term. */
export function monthlyPayment(principal: number, annualRatePct: number, months: number): number {
  if (months <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}

/**
 * Amortize a loan to payoff, optionally with a fixed extra principal payment each month.
 * Returns the schedule plus total interest and the actual number of months to reach $0.
 */
export function amortize(
  principal: number,
  annualRatePct: number,
  scheduledPayment: number,
  extraMonthlyPayment = 0,
): { schedule: AmortRow[]; totalInterest: number; months: number } {
  const r = annualRatePct / 100 / 12;
  const schedule: AmortRow[] = [];
  let balance = principal;
  let totalInterest = 0;
  let month = 0;
  // Guard against runaway loops when the payment can't cover interest.
  const MAX_MONTHS = 1200;
  while (balance > 0.005 && month < MAX_MONTHS) {
    month += 1;
    const interest = balance * r;
    let principalPaid = scheduledPayment + extraMonthlyPayment - interest;
    if (principalPaid <= 0) {
      // Payment doesn't cover interest — loan never amortizes. Bail out.
      return { schedule, totalInterest, months: MAX_MONTHS };
    }
    if (principalPaid > balance) principalPaid = balance;
    const payment = interest + principalPaid;
    balance -= principalPaid;
    totalInterest += interest;
    schedule.push({
      month,
      payment: round2(payment),
      principal: round2(principalPaid),
      interest: round2(interest),
      balance: round2(Math.max(0, balance)),
    });
  }
  return { schedule, totalInterest, months: month };
}

export function computeAutoLoan(input: AutoLoanInput): AutoLoanResult {
  const downPayment = Math.max(0, input.downPayment ?? 0);
  const tradeInValue = Math.max(0, input.tradeInValue ?? 0);
  const tradeInOwed = Math.max(0, input.tradeInOwed ?? 0);
  const cashIncentives = Math.max(0, input.cashIncentives ?? 0);
  const salesTaxPct = Math.max(0, input.salesTaxPct ?? 0);
  const titleFees = Math.max(0, input.titleFees ?? 0);
  const includeTaxesFees = Boolean(input.includeTaxesFees);
  const apr = input.interestRatePct >= 0 ? input.interestRatePct : null;
  const months = input.loanTermMonths > 0 ? Math.round(input.loanTermMonths) : null;
  const extra = Math.max(0, input.extraMonthlyPayment ?? 0);

  let vehiclePrice = input.vehiclePrice > 0 ? input.vehiclePrice : null;

  // ---- Reverse mode: target payment → affordable price (ported from the original) ----
  if (input.calculateBy === "payment" && input.monthlyPayment && input.monthlyPayment > 0 && months && apr != null) {
    const r = apr / 100 / 12;
    const pay = input.monthlyPayment;
    const principalFromPayment = r === 0 ? pay * months : (pay * (Math.pow(1 + r, months) - 1)) / (r * Math.pow(1 + r, months));
    const taxRate = salesTaxPct / 100;
    let vNet: number;
    if (includeTaxesFees) {
      vNet = (principalFromPayment + cashIncentives + downPayment - tradeInOwed - titleFees) / (1 + taxRate);
    } else {
      vNet = principalFromPayment + cashIncentives + downPayment - tradeInOwed;
    }
    vehiclePrice = Math.max(0, vNet + tradeInValue);
  }

  if (vehiclePrice == null || apr == null || months == null) return { ...EMPTY };

  // ---- Forward: price → financed principal (ported from the original) ----
  const priceAfterIncentives = Math.max(0, vehiclePrice - cashIncentives);
  const signedNetTrade = tradeInValue - tradeInOwed; // positive reduces principal, negative increases
  const taxableBase = Math.max(0, priceAfterIncentives - Math.max(0, tradeInValue));
  const taxes = (salesTaxPct / 100) * taxableBase;
  const financedExtras = includeTaxesFees ? taxes + titleFees : 0;
  const baseToFinance = Math.max(0, priceAfterIncentives - downPayment - signedNetTrade);
  const principal = Math.max(0, baseToFinance + financedExtras);

  if (principal <= 0) return { ...EMPTY, vehiclePrice: round2(vehiclePrice), loanAmount: 0, taxes: round2(taxes) };

  const pi = monthlyPayment(principal, apr, months);

  // Baseline payoff (no extra) — needed for "interest saved" even when extra > 0.
  const baseline = amortize(principal, apr, pi, 0);
  const actual = extra > 0 ? amortize(principal, apr, pi, extra) : baseline;

  return {
    vehiclePrice: round2(vehiclePrice),
    loanAmount: Math.round(principal),
    monthlyPaymentPI: round2(pi),
    monthsToPayoff: actual.months,
    lifetimeInterest: round2(actual.totalInterest),
    totalCost: round2(principal + actual.totalInterest),
    taxes: round2(taxes),
    schedule: actual.schedule,
    interestSaved: extra > 0 ? round2(baseline.totalInterest - actual.totalInterest) : null,
    monthsSaved: extra > 0 ? baseline.months - actual.months : null,
    baselineMonths: baseline.months,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
