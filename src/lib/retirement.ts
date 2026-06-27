// Pure retirement engine — three related tools used by RetirementIQ:
//   1. projectRetirement() — accumulation (FV of savings + contributions) + 4% safe-withdrawal
//      drawdown / longevity. Mirrors the source app's model (jht243/retirement-calculator: the math
//      lived in the widget component, not server.ts).
//   2. early401kWithdrawal() — the 10% early-withdrawal penalty + income tax + lost future growth.
//   3. computeRMD() — IRS Uniform Lifetime Table required minimum distribution.
// ZERO React/DOM/host deps → runs at BUILD TIME and RUNTIME.

// ---------- 1. Accumulation + drawdown projection ----------

export interface RetirementProjectionInput {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  annualReturnPct: number; // pre-retirement return
  retirementReturnPct?: number; // post-retirement return (default 5)
  inflationPct?: number; // default 3
  lifeExpectancy?: number; // default 95
  currentAnnualIncome?: number; // optional, for replacement-ratio context
}

export interface RetirementProjectionResult {
  yearsToRetirement: number | null;
  balanceAtRetirement: number | null; // nominal dollars
  balanceAtRetirementTodaysDollars: number | null;
  firstYearWithdrawal: number | null; // 4% rule
  monthlyRetirementIncome: number | null; // 4% rule / 12, nominal
  yearsFunded: number | null; // how long the money lasts in retirement
  lastsThroughLifeExpectancy: boolean | null;
  totalContributions: number | null;
  growth: number | null; // balance − savings − contributions
}

const SAFE_WITHDRAWAL_RATE = 0.04;

export function projectRetirement(input: RetirementProjectionInput): RetirementProjectionResult {
  const { currentAge, retirementAge, currentSavings } = input;
  const yearsPre = retirementAge - currentAge;
  if (!(yearsPre > 0) || currentAge <= 0) {
    return blankProjection();
  }
  const preRate = (input.annualReturnPct ?? 0) / 100;
  const postRate = (input.retirementReturnPct ?? 5) / 100;
  const infl = (input.inflationPct ?? 3) / 100;
  const lifeExpectancy = input.lifeExpectancy ?? 95;
  const annualContribution = Math.max(0, input.monthlyContribution ?? 0) * 12;

  const fvSavings = currentSavings * Math.pow(1 + preRate, yearsPre);
  const fvContributions =
    preRate === 0
      ? annualContribution * yearsPre
      : annualContribution * ((Math.pow(1 + preRate, yearsPre) - 1) / preRate);
  const balanceAtRetirement = fvSavings + fvContributions;
  const totalContributions = annualContribution * yearsPre;

  // 4% safe withdrawal, first year; grows with inflation thereafter.
  const firstYearWithdrawal = balanceAtRetirement * SAFE_WITHDRAWAL_RATE;

  // Drawdown simulation: start-of-year withdrawal growing with inflation, balance earns postRate.
  let balance = balanceAtRetirement;
  let withdrawal = firstYearWithdrawal;
  let yearsFunded = 0;
  const maxYears = lifeExpectancy - retirementAge;
  for (let y = 0; y < 100; y++) {
    if (balance < withdrawal) break;
    balance -= withdrawal; // start-of-year withdrawal
    balance *= 1 + postRate; // grows during the year
    withdrawal *= 1 + infl;
    yearsFunded += 1;
    if (yearsFunded >= maxYears && balance > 0) break; // funded through life expectancy
  }

  return {
    yearsToRetirement: yearsPre,
    balanceAtRetirement: round2(balanceAtRetirement),
    balanceAtRetirementTodaysDollars: round2(balanceAtRetirement / Math.pow(1 + infl, yearsPre)),
    firstYearWithdrawal: round2(firstYearWithdrawal),
    monthlyRetirementIncome: round2(firstYearWithdrawal / 12),
    yearsFunded,
    lastsThroughLifeExpectancy: yearsFunded >= maxYears,
    totalContributions: round2(totalContributions),
    growth: round2(balanceAtRetirement - currentSavings - totalContributions),
  };
}

// ---------- 2. 401(k) early withdrawal ----------

export interface EarlyWithdrawalInput {
  withdrawalAmount: number;
  age: number;
  federalTaxRatePct: number; // marginal income tax bracket
  stateTaxRatePct?: number;
  annualReturnPct?: number; // for opportunity-cost projection (default 7)
  yearsToRetirement?: number; // for lost-growth projection
}

export interface EarlyWithdrawalResult {
  penalty: number; // 10% if under 59.5
  federalTax: number;
  stateTax: number;
  totalCost: number; // penalty + taxes
  netReceived: number;
  effectiveCostPct: number; // totalCost / withdrawalAmount
  lostFutureValue: number | null; // what the withdrawal would have grown to
}

export function early401kWithdrawal(input: EarlyWithdrawalInput): EarlyWithdrawalResult {
  const amount = Math.max(0, input.withdrawalAmount);
  const subjectToPenalty = input.age < 59.5;
  const penalty = subjectToPenalty ? amount * 0.1 : 0;
  const federalTax = amount * (Math.max(0, input.federalTaxRatePct) / 100);
  const stateTax = amount * (Math.max(0, input.stateTaxRatePct ?? 0) / 100);
  const totalCost = penalty + federalTax + stateTax;
  const netReceived = amount - totalCost;

  let lostFutureValue: number | null = null;
  if (input.yearsToRetirement != null && input.yearsToRetirement > 0) {
    const r = (input.annualReturnPct ?? 7) / 100;
    lostFutureValue = amount * Math.pow(1 + r, input.yearsToRetirement) - amount;
  }

  return {
    penalty: round2(penalty),
    federalTax: round2(federalTax),
    stateTax: round2(stateTax),
    totalCost: round2(totalCost),
    netReceived: round2(netReceived),
    effectiveCostPct: amount > 0 ? round2((totalCost / amount) * 100) : 0,
    lostFutureValue: lostFutureValue == null ? null : round2(lostFutureValue),
  };
}

// ---------- 3. Required Minimum Distribution (RMD) ----------

// IRS Uniform Lifetime Table (effective 2022). Distribution period by age. RMD age is 73 (SECURE 2.0).
const UNIFORM_LIFETIME_TABLE: Record<number, number> = {
  72: 27.4, 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0, 79: 21.1, 80: 20.2,
  81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0, 86: 15.2, 87: 14.4, 88: 13.7, 89: 12.9,
  90: 12.2, 91: 11.5, 92: 10.8, 93: 10.1, 94: 9.5, 95: 8.9, 96: 8.4, 97: 7.8, 98: 7.3, 99: 6.8,
  100: 6.4, 101: 6.0, 102: 5.6, 103: 5.2, 104: 4.9, 105: 4.6,
};

export interface RMDResult {
  factor: number | null; // distribution period
  rmd: number | null;
  monthlyRmd: number | null;
  rmdPctOfBalance: number | null;
  required: boolean; // RMDs required at this age (73+)
}

export function computeRMD(accountBalance: number, age: number): RMDResult {
  if (!(accountBalance > 0) || !(age >= 72)) {
    return { factor: null, rmd: null, monthlyRmd: null, rmdPctOfBalance: null, required: age >= 73 };
  }
  const clampedAge = Math.min(105, Math.max(72, Math.round(age)));
  const factor = UNIFORM_LIFETIME_TABLE[clampedAge] ?? UNIFORM_LIFETIME_TABLE[105];
  const rmd = accountBalance / factor;
  return {
    factor,
    rmd: round2(rmd),
    monthlyRmd: round2(rmd / 12),
    rmdPctOfBalance: round2((rmd / accountBalance) * 100),
    required: age >= 73,
  };
}

function blankProjection(): RetirementProjectionResult {
  return {
    yearsToRetirement: null, balanceAtRetirement: null, balanceAtRetirementTodaysDollars: null,
    firstYearWithdrawal: null, monthlyRetirementIncome: null, yearsFunded: null,
    lastsThroughLifeExpectancy: null, totalContributions: null, growth: null,
  };
}
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
