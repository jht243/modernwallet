// Pure rental-property investment engine.
//
// Source: jht243/rental-property-calculator. That repo's server.ts holds only the loan/P&I math;
// the investment metrics (NOI, cap rate, cash-on-cash, IRR, multi-year projection) were computed in
// the compiled widget, so they're rebuilt here from the standard real-estate formulas using the
// repo's documented input set. ZERO React/DOM/host deps → runs at BUILD TIME and RUNTIME.

import { monthlyPayment } from "./auto-loan";

export interface RentalInput {
  purchasePrice: number;
  downPaymentPct: number; // % of purchase price
  closingCostsPct?: number; // % of purchase price (cash to close, on top of down payment)
  rehabCost?: number; // initial repairs / value-add cash
  interestRatePct: number;
  loanTermYears: number;

  monthlyRent: number;
  otherMonthlyIncome?: number; // laundry, parking, etc.
  vacancyRatePct?: number; // % of gross rent lost to vacancy

  // Operating expenses
  propertyTaxAnnual?: number;
  insuranceAnnual?: number;
  hoaMonthly?: number;
  maintenancePctOfRent?: number; // % of rent set aside for maintenance/capex
  managementPctOfRent?: number; // property management fee, % of rent
  otherMonthlyExpenses?: number;

  // Projection
  appreciationPct?: number; // annual property value growth
  rentGrowthPct?: number; // annual rent growth
  expenseGrowthPct?: number; // annual expense growth
  sellingCostsPct?: number; // % of sale price (agent + closing) at exit
  holdYears?: number; // projection horizon (default 20)
}

export interface RentalYear {
  year: number;
  grossRent: number;
  effectiveIncome: number;
  operatingExpenses: number;
  noi: number;
  debtService: number;
  cashFlow: number;
  propertyValue: number;
  loanBalance: number;
  equity: number;
}

export interface RentalResult {
  loanAmount: number | null;
  monthlyPI: number | null;
  cashInvested: number | null;

  // Year-1 income statement
  grossAnnualRent: number | null;
  effectiveGrossIncome: number | null;
  operatingExpensesAnnual: number | null;
  noi: number | null; // net operating income (excludes debt service)
  annualDebtService: number | null;
  annualCashFlow: number | null;
  monthlyCashFlow: number | null;

  // Headline return metrics
  capRate: number | null; // NOI / purchase price (%)
  cashOnCashReturn: number | null; // year-1 cash flow / cash invested (%)
  dscr: number | null; // NOI / annual debt service
  onePercentRatio: number | null; // monthly rent / purchase price (%)

  // Long-run projection
  projection: RentalYear[];
  saleProceedsAtHorizon: number | null; // net of selling costs + loan payoff
  totalProfitAtHorizon: number | null; // cumulative cash flow + net sale proceeds − cash invested
  irr: number | null; // annualized IRR over the hold period (%)
}

const EMPTY: RentalResult = {
  loanAmount: null, monthlyPI: null, cashInvested: null,
  grossAnnualRent: null, effectiveGrossIncome: null, operatingExpensesAnnual: null,
  noi: null, annualDebtService: null, annualCashFlow: null, monthlyCashFlow: null,
  capRate: null, cashOnCashReturn: null, dscr: null, onePercentRatio: null,
  projection: [], saleProceedsAtHorizon: null, totalProfitAtHorizon: null, irr: null,
};

export function computeRental(input: RentalInput): RentalResult {
  const price = input.purchasePrice;
  if (!(price > 0) || !(input.monthlyRent >= 0)) return { ...EMPTY };

  const downPct = clampPct(input.downPaymentPct ?? 0);
  const downPayment = price * (downPct / 100);
  const closingCosts = price * (clampPct(input.closingCostsPct ?? 0) / 100);
  const rehab = Math.max(0, input.rehabCost ?? 0);
  const loanAmount = Math.max(0, price - downPayment);
  const cashInvested = downPayment + closingCosts + rehab;

  const termMonths = Math.round((input.loanTermYears > 0 ? input.loanTermYears : 30) * 12);
  const pi = loanAmount > 0 ? monthlyPayment(loanAmount, input.interestRatePct ?? 0, termMonths) : 0;
  const annualDebtService = pi * 12;

  const vacancy = clampPct(input.vacancyRatePct ?? 0) / 100;
  const mgmtPct = clampPct(input.managementPctOfRent ?? 0) / 100;
  const maintPct = clampPct(input.maintenancePctOfRent ?? 0) / 100;

  // Year-1 income statement
  const grossAnnualRent = (input.monthlyRent + (input.otherMonthlyIncome ?? 0)) * 12;
  const effectiveGrossIncome = grossAnnualRent * (1 - vacancy);
  const fixedOpEx =
    (input.propertyTaxAnnual ?? 0) +
    (input.insuranceAnnual ?? 0) +
    (input.hoaMonthly ?? 0) * 12 +
    (input.otherMonthlyExpenses ?? 0) * 12;
  const variableOpEx = grossAnnualRent * (mgmtPct + maintPct);
  const operatingExpensesAnnual = fixedOpEx + variableOpEx;

  const noi = effectiveGrossIncome - operatingExpensesAnnual;
  const annualCashFlow = noi - annualDebtService;

  const capRate = (noi / price) * 100;
  const cashOnCashReturn = cashInvested > 0 ? (annualCashFlow / cashInvested) * 100 : null;
  const dscr = annualDebtService > 0 ? noi / annualDebtService : null;
  const onePercentRatio = (input.monthlyRent / price) * 100;

  // Multi-year projection ----
  const holdYears = Math.max(1, Math.round(input.holdYears ?? 20));
  const appr = (input.appreciationPct ?? 3) / 100;
  const rentGrowth = (input.rentGrowthPct ?? 2) / 100;
  const expGrowth = (input.expenseGrowthPct ?? 2) / 100;
  const sellingCostsPct = clampPct(input.sellingCostsPct ?? 7) / 100;
  const monthlyRate = (input.interestRatePct ?? 0) / 100 / 12;

  const projection: RentalYear[] = [];
  let balance = loanAmount;
  const cashFlows: number[] = [-cashInvested]; // for IRR: year 0 = cash out

  for (let y = 1; y <= holdYears; y++) {
    const growth = (base: number, rate: number) => base * Math.pow(1 + rate, y - 1);
    const yrGross = grossAnnualRent === 0 ? 0 : growth(grossAnnualRent, rentGrowth);
    const yrEffective = yrGross * (1 - vacancy);
    const yrFixed = growth(fixedOpEx, expGrowth);
    const yrVariable = yrGross * (mgmtPct + maintPct);
    const yrOpEx = yrFixed + yrVariable;
    const yrNoi = yrEffective - yrOpEx;

    // Amortize 12 months to track loan balance.
    for (let mth = 0; mth < 12 && balance > 0; mth++) {
      const interest = balance * monthlyRate;
      const principalPaid = Math.min(balance, pi - interest);
      balance = Math.max(0, balance - principalPaid);
    }

    const yrCashFlow = yrNoi - annualDebtService;
    const propertyValue = price * Math.pow(1 + appr, y);
    const equity = propertyValue - balance;

    projection.push({
      year: y,
      grossRent: round2(yrGross),
      effectiveIncome: round2(yrEffective),
      operatingExpenses: round2(yrOpEx),
      noi: round2(yrNoi),
      debtService: round2(annualDebtService),
      cashFlow: round2(yrCashFlow),
      propertyValue: round2(propertyValue),
      loanBalance: round2(balance),
      equity: round2(equity),
    });

    // For IRR: operating cash flow each year, plus net sale proceeds in the final year.
    let yearCash = yrCashFlow;
    if (y === holdYears) {
      const saleValue = propertyValue;
      const netSale = saleValue * (1 - sellingCostsPct) - balance;
      yearCash += netSale;
    }
    cashFlows.push(yearCash);
  }

  const last = projection[projection.length - 1];
  const finalValue = last.propertyValue;
  const saleProceedsAtHorizon = finalValue * (1 - sellingCostsPct) - last.loanBalance;
  const cumulativeCashFlow = projection.reduce((s, p) => s + p.cashFlow, 0);
  const totalProfitAtHorizon = cumulativeCashFlow + saleProceedsAtHorizon - cashInvested;
  const irr = computeIRR(cashFlows);

  return {
    loanAmount: Math.round(loanAmount),
    monthlyPI: round2(pi),
    cashInvested: round2(cashInvested),
    grossAnnualRent: round2(grossAnnualRent),
    effectiveGrossIncome: round2(effectiveGrossIncome),
    operatingExpensesAnnual: round2(operatingExpensesAnnual),
    noi: round2(noi),
    annualDebtService: round2(annualDebtService),
    annualCashFlow: round2(annualCashFlow),
    monthlyCashFlow: round2(annualCashFlow / 12),
    capRate: round2(capRate),
    cashOnCashReturn: cashOnCashReturn == null ? null : round2(cashOnCashReturn),
    dscr: dscr == null ? null : round2(dscr),
    onePercentRatio: round2(onePercentRatio),
    projection,
    saleProceedsAtHorizon: round2(saleProceedsAtHorizon),
    totalProfitAtHorizon: round2(totalProfitAtHorizon),
    irr: irr == null ? null : round2(irr * 100),
  };
}

/** IRR via bisection on NPV. Returns a per-period rate, or null if it can't bracket a root. */
function computeIRR(cashFlows: number[]): number | null {
  const npv = (rate: number) => cashFlows.reduce((s, cf, t) => s + cf / Math.pow(1 + rate, t), 0);
  let lo = -0.9999;
  let hi = 1.0; // 100%/yr upper bound
  let flo = npv(lo);
  let fhi = npv(hi);
  if (flo * fhi > 0) {
    // Try a wider upper bound once.
    hi = 10;
    fhi = npv(hi);
    if (flo * fhi > 0) return null;
  }
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fmid = npv(mid);
    if (Math.abs(fmid) < 1e-6) return mid;
    if (flo * fmid < 0) { hi = mid; fhi = fmid; } else { lo = mid; flo = fmid; }
  }
  return (lo + hi) / 2;
}

function clampPct(n: number): number {
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
