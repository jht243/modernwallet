// Life insurance needs engine — a needs-based (human life value) calculation, not a flat
// "10x your income" rule of thumb. Most free needs calculators stop at income x years; this one
// present-values the income-replacement years at a stated real discount rate (net of inflation),
// which is the more defensible way to size a level-term policy, then nets out debt, final
// expenses, an education fund, existing coverage, and liquid savings the family could draw on
// immediately. Every constant is named and stated on-page, not hidden inside the formula.

export interface LifeInsuranceNeedsInput {
  /** Annual income this policy needs to replace for dependents. */
  annualIncome: number;
  /** Years of income replacement needed (e.g., until the youngest child is grown or a spouse retires). */
  yearsToReplace: number;
  /** Non-mortgage debt to pay off (credit cards, auto loans, student loans). */
  otherDebt: number;
  /** Remaining mortgage balance to pay off. */
  mortgageBalance: number;
  /** Funeral, estate settlement, and other final expenses. */
  finalExpenses: number;
  /** Future education costs to fund (total across all children). */
  educationFund: number;
  /** Existing life insurance coverage already in force. */
  existingCoverage: number;
  /** Liquid savings and investments available immediately to the family. */
  liquidSavings: number;
}

export interface LifeInsuranceNeedsResult {
  /** Present value of the income-replacement years, discounted at REAL_DISCOUNT_RATE. */
  incomeReplacementPV: number | null;
  /** Sum of debt, mortgage, final expenses, and education fund. */
  obligationsTotal: number | null;
  /** Sum of existing coverage and liquid savings. */
  resourcesTotal: number | null;
  /** The recommended coverage amount, floored at 0. */
  recommendedCoverage: number | null;
}

const EMPTY: LifeInsuranceNeedsResult = {
  incomeReplacementPV: null, obligationsTotal: null, resourcesTotal: null, recommendedCoverage: null,
};

/** Real (inflation-adjusted) annual discount rate used to present-value the income-replacement
 *  years. 3% approximates a conservative long-run real return on a balanced portfolio net of
 *  inflation — the same assumption a fee-only planner commonly uses for a needs-based estimate. */
const REAL_DISCOUNT_RATE: number = 0.03;

export function computeLifeInsuranceNeeds(input: LifeInsuranceNeedsInput): LifeInsuranceNeedsResult {
  const annualIncome = Math.max(0, input.annualIncome ?? 0);
  const yearsToReplace = Math.max(0, input.yearsToReplace ?? 0);
  const otherDebt = Math.max(0, input.otherDebt ?? 0);
  const mortgageBalance = Math.max(0, input.mortgageBalance ?? 0);
  const finalExpenses = Math.max(0, input.finalExpenses ?? 0);
  const educationFund = Math.max(0, input.educationFund ?? 0);
  const existingCoverage = Math.max(0, input.existingCoverage ?? 0);
  const liquidSavings = Math.max(0, input.liquidSavings ?? 0);

  if (!(annualIncome > 0) && otherDebt === 0 && mortgageBalance === 0 && finalExpenses === 0 && educationFund === 0) {
    return EMPTY;
  }

  // Present value of an n-year annuity of annualIncome at REAL_DISCOUNT_RATE.
  const r = REAL_DISCOUNT_RATE;
  const incomeReplacementPV = yearsToReplace > 0 && annualIncome > 0
    ? round2(r === 0 ? annualIncome * yearsToReplace : annualIncome * ((1 - Math.pow(1 + r, -yearsToReplace)) / r))
    : 0;

  const obligationsTotal = round2(otherDebt + mortgageBalance + finalExpenses + educationFund);
  const resourcesTotal = round2(existingCoverage + liquidSavings);
  const recommendedCoverage = round2(Math.max(0, incomeReplacementPV + obligationsTotal - resourcesTotal));

  return { incomeReplacementPV, obligationsTotal, resourcesTotal, recommendedCoverage };
}

function round2(n: number): number { return Math.round(n * 100) / 100; }
