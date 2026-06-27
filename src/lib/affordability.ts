// Pure "what can I afford?" engines — the top-of-funnel question buyers ask first.
//   carAffordability()  — reverse of an auto loan: monthly budget → max car price.
//   homeAffordability() — the 28/36 DTI rule + PITI → max home price.
//   downPaymentBreakdown() — price + down% → down $, loan, PMI status.
//   closingCostEstimate()  — price → typical closing-cost range + breakdown.
// ZERO React/DOM deps → build + runtime.

import { monthlyPayment } from "./auto-loan";

// ---------- Car affordability (reverse auto loan) ----------

export interface CarAffordabilityInput {
  monthlyBudget: number; // what you can pay per month (principal + interest)
  downPayment?: number;
  tradeInValue?: number;
  interestRatePct: number;
  loanTermMonths: number;
}
export interface CarAffordabilityResult {
  maxVehiclePrice: number | null;
  maxLoanAmount: number | null;
  totalInterest: number | null;
  totalOfPayments: number | null;
}

export function carAffordability(input: CarAffordabilityInput): CarAffordabilityResult {
  const budget = Math.max(0, input.monthlyBudget);
  const n = Math.round(input.loanTermMonths);
  if (!(budget > 0) || !(n > 0)) return { maxVehiclePrice: null, maxLoanAmount: null, totalInterest: null, totalOfPayments: null };
  const r = (input.interestRatePct ?? 0) / 100 / 12;
  const down = Math.max(0, input.downPayment ?? 0);
  const trade = Math.max(0, input.tradeInValue ?? 0);

  const maxLoan = r === 0 ? budget * n : budget * (1 - Math.pow(1 + r, -n)) / r;
  const totalPaid = budget * n;
  return {
    maxVehiclePrice: round2(maxLoan + down + trade),
    maxLoanAmount: round2(maxLoan),
    totalInterest: round2(totalPaid - maxLoan),
    totalOfPayments: round2(totalPaid),
  };
}

// ---------- Home affordability (28/36 rule + PITI) ----------

export interface HomeAffordabilityInput {
  annualIncome: number;
  monthlyDebts?: number; // existing non-housing debt payments (car, student, cards)
  downPayment?: number;
  interestRatePct: number;
  loanTermYears: number;
  propertyTaxRatePct?: number; // annual % of home value (default 1.1)
  homeInsuranceAnnual?: number; // default 1800
  hoaMonthly?: number;
  dtiFrontPct?: number; // housing ratio (default 28)
  dtiBackPct?: number; // total-debt ratio (default 36)
}
export interface HomeAffordabilityResult {
  maxHomePrice: number | null;
  maxLoanAmount: number | null;
  maxMonthlyPayment: number | null; // the PITI budget the ratios allow
  principalInterest: number | null;
  monthlyTax: number | null;
  monthlyInsurance: number | null;
  monthlyPMI: number | null;
  limitedBy: "housing ratio (28%)" | "total-debt ratio (36%)" | null;
}

const PMI_ANNUAL_RATE = 0.006; // ~0.6% of loan/yr when LTV > 80%

export function homeAffordability(input: HomeAffordabilityInput): HomeAffordabilityResult {
  const blank: HomeAffordabilityResult = {
    maxHomePrice: null, maxLoanAmount: null, maxMonthlyPayment: null,
    principalInterest: null, monthlyTax: null, monthlyInsurance: null, monthlyPMI: null, limitedBy: null,
  };
  const income = input.annualIncome;
  if (!(income > 0)) return blank;

  const grossMonthly = income / 12;
  const front = grossMonthly * ((input.dtiFrontPct ?? 28) / 100);
  const back = grossMonthly * ((input.dtiBackPct ?? 36) / 100) - Math.max(0, input.monthlyDebts ?? 0);
  const maxPITI = Math.max(0, Math.min(front, back));
  const limitedBy: HomeAffordabilityResult["limitedBy"] = front <= back ? "housing ratio (28%)" : "total-debt ratio (36%)";

  const down = Math.max(0, input.downPayment ?? 0);
  const termMonths = Math.round((input.loanTermYears > 0 ? input.loanTermYears : 30) * 12);
  const taxRate = (input.propertyTaxRatePct ?? 1.1) / 100;
  const insMonthly = (input.homeInsuranceAnnual ?? 1800) / 12;
  const hoa = Math.max(0, input.hoaMonthly ?? 0);

  const pitiFor = (price: number) => {
    const loan = Math.max(0, price - down);
    const pi = monthlyPayment(loan, input.interestRatePct ?? 0, termMonths);
    const tax = (price * taxRate) / 12;
    const pmi = loan > 0 && down / price < 0.2 ? (loan * PMI_ANNUAL_RATE) / 12 : 0;
    return { piti: pi + tax + insMonthly + pmi + hoa, pi, tax, pmi };
  };

  // Binary search for the max price whose PITI fits the budget.
  let lo = down, hi = down + 10_000_000;
  if (pitiFor(lo).piti > maxPITI) {
    // Can't even cover fixed costs (insurance/HOA/tax on a down-payment-only home) — not affordable.
    return { ...blank, maxMonthlyPayment: round2(maxPITI), limitedBy };
  }
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (pitiFor(mid).piti <= maxPITI) lo = mid;
    else hi = mid;
  }
  const price = lo;
  const parts = pitiFor(price);
  return {
    maxHomePrice: Math.round(price / 1000) * 1000, // round to nearest $1k (affordability is an estimate)
    maxLoanAmount: Math.round(Math.max(0, price - down)),
    maxMonthlyPayment: round2(maxPITI),
    principalInterest: round2(parts.pi),
    monthlyTax: round2(parts.tax),
    monthlyInsurance: round2(insMonthly),
    monthlyPMI: round2(parts.pmi),
    limitedBy,
  };
}

// ---------- Down payment ----------

export interface DownPaymentResult {
  downPaymentAmount: number;
  loanAmount: number;
  ltvPct: number;
  pmiLikely: boolean;
  amountToReach20Pct: number;
}
export function downPaymentBreakdown(homePrice: number, downPaymentPct: number): DownPaymentResult | null {
  if (!(homePrice > 0)) return null;
  const pct = Math.max(0, Math.min(100, downPaymentPct));
  const down = homePrice * (pct / 100);
  const loan = Math.max(0, homePrice - down);
  const ltv = (loan / homePrice) * 100;
  return {
    downPaymentAmount: round2(down),
    loanAmount: round2(loan),
    ltvPct: round2(ltv),
    pmiLikely: pct < 20,
    amountToReach20Pct: round2(Math.max(0, homePrice * 0.2 - down)),
  };
}

// ---------- Closing costs ----------

export interface ClosingCostItem { label: string; amount: number; }
export interface ClosingCostResult {
  low: number; // ~2%
  high: number; // ~5%
  typical: number; // ~3%
  items: ClosingCostItem[]; // rough breakdown at the typical estimate
}
export function closingCostEstimate(homePrice: number, loanAmount?: number): ClosingCostResult | null {
  if (!(homePrice > 0)) return null;
  const loan = loanAmount && loanAmount > 0 ? loanAmount : homePrice * 0.8;
  const typical = Math.round(homePrice * 0.03);
  // Rough, transparent breakdown (varies widely by state/lender); items sum to the ~3% typical.
  const named: ClosingCostItem[] = [
    { label: "Loan origination (~0.5–1% of loan)", amount: round2(loan * 0.0075) },
    { label: "Appraisal & inspection", amount: 800 },
    { label: "Title insurance & search (~0.5% of price)", amount: round2(homePrice * 0.005) },
    { label: "Recording & transfer taxes (~0.5% of price)", amount: round2(homePrice * 0.005) },
    { label: "Prepaid taxes & insurance (escrow setup)", amount: round2(homePrice * 0.005) },
  ];
  const namedSum = named.reduce((s, i) => s + i.amount, 0);
  const items = [...named, { label: "Other lender & third-party fees", amount: round2(Math.max(0, typical - namedSum)) }];
  return {
    low: Math.round(homePrice * 0.02),
    high: Math.round(homePrice * 0.05),
    typical,
    items,
  };
}

function round2(n: number): number { return Math.round(n * 100) / 100; }
