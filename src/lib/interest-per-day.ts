// Interest-per-day engine — how much interest a balance earns (savings/HYSA/CD) or costs
// (loan/credit card) in a single day, plus the APY gap most day-rate tools skip: the daily simple
// rate quoted by a bank is NOT the same as its effective annual yield once daily compounding is
// applied. Most calculators of this kind stop at "principal x rate / 365" — this one also shows
// the compounded effective annual yield (APY), the same distinction Regulation DD (Truth in
// Savings) draws between a stated "interest rate" and the compounded "annual percentage yield"
// a depositor actually earns (https://www.consumerfinance.gov/rules-policy/regulations/1030/A).

export interface InterestPerDayInput {
  principal: number;
  annualRatePct: number;
}

export interface InterestPerDayResult {
  perDay: number | null;
  perWeek: number | null;
  perMonth: number | null;
  /** Simple annual interest: principal x rate, no compounding. */
  simpleAnnual: number | null;
  /** Effective annual yield if the daily rate compounds daily (APY), as a percent. */
  apyPct: number | null;
  /** Dollar gap between the compounded APY total and the simple annual total over one year. */
  compoundingGain: number | null;
}

const EMPTY: InterestPerDayResult = {
  perDay: null, perWeek: null, perMonth: null, simpleAnnual: null, apyPct: null, compoundingGain: null,
};

const DAYS_IN_YEAR = 365;

export function computeInterestPerDay(input: InterestPerDayInput): InterestPerDayResult {
  const principal = Math.max(0, input.principal ?? 0);
  const annualRatePct = Math.max(0, input.annualRatePct ?? 0);
  if (!(principal > 0) || !(annualRatePct > 0)) return EMPTY;

  const dailyRate = annualRatePct / 100 / DAYS_IN_YEAR;
  const dailyInterest = principal * dailyRate;
  const perDay = round2(dailyInterest);
  const perWeek = round2(dailyInterest * 7);
  const perMonth = round2(dailyInterest * 30);
  const simpleAnnual = round2(principal * (annualRatePct / 100));

  const apyPct = round4((Math.pow(1 + dailyRate, DAYS_IN_YEAR) - 1) * 100);
  const compoundedAnnual = principal * (apyPct / 100);
  const compoundingGain = round2(compoundedAnnual - simpleAnnual);

  return { perDay, perWeek, perMonth, simpleAnnual, apyPct, compoundingGain };
}

function round2(n: number): number { return Math.round(n * 100) / 100; }
function round4(n: number): number { return Math.round(n * 10000) / 10000; }
