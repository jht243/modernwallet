// Bridge loan cost engine — standalone. Every figure comes from reader inputs; no lender rate, fee, term or
// loan-to-value limit is assumed anywhere in this file.
//
// Conventions (stated on the page):
//   Bridge interest = loan x APR / 12 x months until the old home sells (simple, interest accrues and is repaid
//   from the sale proceeds at payoff).
//   Bridge fees = loan x origination percent + other fees, charged once.
//   Bridge cost = bridge fees + bridge interest.
//   Selling costs = percent of the expected sale price.
//   Net proceeds = sale price - old mortgage payoff - bridge loan - bridge cost - selling costs.
//   Monthly overlap outlay = new mortgage payment + monthly carrying costs of the old home (reader enters the old
//   mortgage payment, taxes, insurance and utilities inside that carrying figure).
//   Break-even months vs an alternative = bridge fees / (alternative monthly cost - bridge monthly interest), only
//   when the alternative costs more each month than the bridge interest; otherwise null.
//   Maximum bridge from a combined loan-to-value limit = sale price x limit - old mortgage payoff (floored at 0).
//   The limit is entered by the reader; none is assumed.

export interface BridgeInput {
  salePrice: number;
  oldMortgagePayoff: number;
  bridgeLoan: number;
  aprPct: number;
  originationPct: number;
  otherFees: number;
  months: number;
  newMortgagePayment: number;
  oldMonthlyCarrying: number;
  sellingCostPct: number;
  /** Optional: monthly cost of an alternative, with no up-front fee. 0 = not entered. */
  alternativeMonthlyCost: number;
  /** Optional: the lender's maximum combined loan-to-value, percent. 0 = not entered. */
  maxCombinedLtvPct: number;
}

export interface BridgeMonthRow {
  months: number;
  interest: number;
  bridgeCost: number;
  overlapOutlay: number;
  netProceeds: number;
}

export interface BridgeResult {
  valid: boolean;
  fees: number;
  monthlyInterest: number;
  interest: number;
  bridgeCost: number;
  sellingCosts: number;
  netProceeds: number;
  negativeProceeds: boolean;
  monthlyOverlapOutlay: number;
  totalOverlapOutlay: number;
  breakEvenMonths: number | null;
  maxBridgeFromLtv: number | null;
  byMonth: BridgeMonthRow[];
}

const nz = (x: number): number => (Number.isFinite(x) && x > 0 ? x : 0);

function at(i: BridgeInput, months: number) {
  const loan = nz(i.bridgeLoan);
  const fees = loan * nz(i.originationPct) / 100 + nz(i.otherFees);
  const monthlyInterest = loan * nz(i.aprPct) / 100 / 12;
  const interest = monthlyInterest * months;
  const bridgeCost = fees + interest;
  const sale = nz(i.salePrice);
  const sellingCosts = sale * Math.min(100, nz(i.sellingCostPct)) / 100;
  const netProceeds = sale - nz(i.oldMortgagePayoff) - loan - bridgeCost - sellingCosts;
  const monthlyOverlapOutlay = nz(i.newMortgagePayment) + nz(i.oldMonthlyCarrying);
  return { loan, fees, monthlyInterest, interest, bridgeCost, sellingCosts, netProceeds, monthlyOverlapOutlay };
}

export function computeBridge(i: BridgeInput): BridgeResult {
  const months = Math.max(0, Math.round(nz(i.months)));
  const x = at(i, months);
  const valid = x.loan > 0;
  const alt = nz(i.alternativeMonthlyCost);
  const breakEvenMonths = valid && alt > x.monthlyInterest ? x.fees / (alt - x.monthlyInterest) : null;
  const ltv = nz(i.maxCombinedLtvPct);
  const maxBridgeFromLtv = ltv > 0 ? Math.max(0, nz(i.salePrice) * Math.min(ltv, 100) / 100 - nz(i.oldMortgagePayoff)) : null;
  const marks = Array.from(new Set([3, 6, 9, months].filter((m) => m > 0))).sort((a, b) => a - b);
  const byMonth = marks.map((m) => {
    const y = at(i, m);
    return { months: m, interest: y.interest, bridgeCost: y.bridgeCost, overlapOutlay: y.monthlyOverlapOutlay * m, netProceeds: y.netProceeds };
  });
  return {
    valid,
    fees: x.fees,
    monthlyInterest: x.monthlyInterest,
    interest: x.interest,
    bridgeCost: x.bridgeCost,
    sellingCosts: x.sellingCosts,
    netProceeds: x.netProceeds,
    negativeProceeds: valid && x.netProceeds < 0,
    monthlyOverlapOutlay: x.monthlyOverlapOutlay,
    totalOverlapOutlay: x.monthlyOverlapOutlay * months,
    breakEvenMonths,
    maxBridgeFromLtv,
    byMonth,
  };
}
