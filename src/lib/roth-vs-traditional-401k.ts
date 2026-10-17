// Roth vs. Traditional 401(k) engine — standalone. Compares the two on equal footing: the same take-home pay
// is given up in both cases, so the Roth deferral is smaller than the pre-tax Traditional deferral by the tax the
// Traditional deferral avoids today (Roth = Traditional x (1 - current rate)). Both balances then grow at the same
// return. Traditional withdrawals are taxed at the retirement rate; qualified Roth withdrawals are not taxed.
// Result: Roth / Traditional after tax = (1 - current rate) / (1 - retirement rate) x ... the growth factor cancels,
// so the break-even retirement rate equals the current rate. All rates, the return and the term are reader inputs.
// Contributions are made monthly (annual / 12) at month end and compound at the annual return / 12 per month.
// Employer match, fees, state-specific rules, and the progressive shape of tax brackets are not modeled: the two
// tax rates are flat rates the reader enters (federal plus state if they want both counted).

export interface RothVsTraditional401kInput {
  /** Pre-tax dollars deferred into the Traditional 401(k) each year. */
  traditionalAnnual: number;
  /** Marginal tax rate on income today, in percent. */
  currentRatePct: number;
  /** Expected tax rate on 401(k) withdrawals in retirement, in percent. */
  retirementRatePct: number;
  /** Annual investment return, in percent. */
  returnPct: number;
  years: number;
}

export interface RothVsTraditional401kResult {
  /** Dollars deferred into the Roth each year at the same take-home cost. */
  rothAnnual: number;
  /** Take-home pay given up each year in both cases. */
  takeHomeCostAnnual: number;
  rothBalance: number;
  traditionalBalancePreTax: number;
  traditionalTaxAtWithdrawal: number;
  traditionalBalanceAfterTax: number;
  /** Roth after-tax value minus Traditional after-tax value (positive = Roth ahead). */
  rothAdvantage: number;
  winner: "roth" | "traditional" | "tie";
  /** Retirement tax rate at which the two finish even (equals the current rate). */
  breakEvenRatePct: number;
  rothTotalContributed: number;
  traditionalTotalContributed: number;
}

const EMPTY: RothVsTraditional401kResult = {
  rothAnnual: 0, takeHomeCostAnnual: 0, rothBalance: 0, traditionalBalancePreTax: 0, traditionalTaxAtWithdrawal: 0,
  traditionalBalanceAfterTax: 0, rothAdvantage: 0, winner: "tie", breakEvenRatePct: 0,
  rothTotalContributed: 0, traditionalTotalContributed: 0,
};

/** Balance after `months` month-end contributions of `monthly`, compounding at `annualPct / 12` per month. */
function futureValue(monthly: number, annualPct: number, months: number): number {
  const r = annualPct / 100 / 12;
  let bal = 0;
  for (let m = 0; m < months; m++) bal = bal * (1 + r) + monthly;
  return bal;
}

export function computeRothVsTraditional401k(input: RothVsTraditional401kInput): RothVsTraditional401kResult {
  const { traditionalAnnual, currentRatePct, retirementRatePct, returnPct } = input;
  const years = Math.round(input.years);
  if (!(traditionalAnnual > 0) || !(years > 0) || returnPct < 0) return EMPTY;
  const now = Math.min(Math.max(currentRatePct, 0), 99) / 100;
  const later = Math.min(Math.max(retirementRatePct, 0), 99) / 100;
  const months = years * 12;

  const rothAnnual = traditionalAnnual * (1 - now);
  const takeHomeCostAnnual = rothAnnual;
  const rothBalance = futureValue(rothAnnual / 12, returnPct, months);
  const traditionalBalancePreTax = futureValue(traditionalAnnual / 12, returnPct, months);
  const traditionalTaxAtWithdrawal = traditionalBalancePreTax * later;
  const traditionalBalanceAfterTax = traditionalBalancePreTax - traditionalTaxAtWithdrawal;
  const rothAdvantage = rothBalance - traditionalBalanceAfterTax;
  const winner = Math.abs(rothAdvantage) < 0.005 ? "tie" : rothAdvantage > 0 ? "roth" : "traditional";
  return {
    rothAnnual, takeHomeCostAnnual, rothBalance, traditionalBalancePreTax, traditionalTaxAtWithdrawal,
    traditionalBalanceAfterTax, rothAdvantage, winner, breakEvenRatePct: now * 100,
    rothTotalContributed: rothAnnual * years, traditionalTotalContributed: traditionalAnnual * years,
  };
}
