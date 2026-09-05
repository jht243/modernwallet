// S corporation election engine — compares default sole-proprietor/LLC taxation against an
// S-corp election at the same business profit, and reports the net saving AFTER the cost of
// running payroll.
//
// The S-corp pitch is simple enough to be misleading: pay yourself a "reasonable salary", take
// the rest as a distribution, and the distribution escapes the 15.3% self-employment tax. That is
// true. Three things routinely left out of the calculators that make the pitch are why this engine
// exists:
//
//   1. THE QBI DEDUCTION SHRINKS. Wages are not qualified business income, so every dollar moved
//      from pass-through profit into salary removes a dollar from the §199A base. A 20% QBI
//      deduction on that dollar is forfeited to save 15.3% of payroll tax on it — which is why the
//      naive "salary × 15.3% saved" figure overstates the benefit, and why at low profit an
//      election can cost money.
//   2. PAYROLL IS NOT FREE. An S-corp must run real payroll and file Form 1120-S. Payroll service
//      plus the additional return typically runs several hundred to a couple of thousand dollars a
//      year, and it recurs. The engine subtracts it rather than quoting a gross saving.
//   3. THE EMPLOYER HALF OF FICA IS A BUSINESS DEDUCTION, and it reduces the profit passed through
//      on the K-1. Ignoring that overstates the distribution.
//
// On reasonable compensation the IRS is explicit that there is no safe harbor and no formula. The
// "60/40 rule" and the "2% rule" that circulate online are not IRS positions. Compensation is
// judged on facts and circumstances — training and experience, duties, time and effort, what
// comparable businesses pay — and above all on whether the corporation's gross receipts come from
// the shareholder's own services. This engine therefore takes the salary as an INPUT and shows the
// consequences of the number you choose; it does not invent a defensible salary for you.
//
// Estimates only, federal and 2026. No state income tax, no state payroll or franchise taxes (some
// states tax S-corps directly), no health insurance or retirement plan interactions.

import {
  SS_WAGE_BASE_2026,
  MEDICARE_RATE,
  ADDITIONAL_MEDICARE_RATE,
  ADDITIONAL_MEDICARE_THRESHOLD,
  STANDARD_DEDUCTION_2026,
  BRACKETS_2026,
  QBI_THRESHOLD_2026,
  QBI_RATE,
  SE_NET_EARNINGS_FACTOR,
  SS_RATE,
  taxFromBrackets,
  type FilingStatus,
} from "./self-employment-tax";

/** Employee-side FICA: 6.2% Social Security + 1.45% Medicare. The employer matches it. */
export const EMPLOYEE_SS_RATE = 0.062;
export const EMPLOYEE_MEDICARE_RATE = 0.0145;
export const EMPLOYEE_FICA_RATE = EMPLOYEE_SS_RATE + EMPLOYEE_MEDICARE_RATE;

/** Typical annual cost of payroll service plus the extra Form 1120-S return. */
export const DEFAULT_PAYROLL_COST = 1200;

export interface SCorpInput {
  /** Business profit before any owner compensation. */
  netProfit: number;
  /** The W-2 salary the owner would pay themselves as a shareholder-employee. */
  reasonableSalary: number;
  filingStatus: FilingStatus;
  /** Other household income, for the marginal-rate calculation. */
  otherIncome?: number;
  /** Annual cost of payroll service plus the additional business return. */
  payrollCost?: number;
  applyQbi?: boolean;
}

export interface SCorpPath {
  /** Payroll or self-employment tax paid under this structure. */
  employmentTax: number;
  /** Qualified business income eligible for the §199A deduction. */
  qbiBase: number;
  qbiDeduction: number;
  taxableIncome: number;
  incomeTax: number;
  /** employmentTax + incomeTax (+ payroll cost for the S-corp path). */
  totalCost: number;
}

export interface SCorpResult {
  soleProprietor: SCorpPath;
  sCorp: SCorpPath;
  /** Payroll tax avoided on the distribution, before any offsets. The headline everyone quotes. */
  grossPayrollTaxSaved: number;
  /** QBI deduction given up because salary is wages rather than qualified business income. */
  qbiDeductionLost: number;
  payrollCost: number;
  /** The figure that matters: soleProprietor.totalCost − sCorp.totalCost. Negative means it costs more. */
  netSaving: number;
  /** True when electing S-corp status leaves the owner worse off at these inputs. */
  electionCostsMoney: boolean;
  /** Salary as a share of profit, for comparison against the folk "rules" the page corrects. */
  salaryShareOfProfit: number;
  /** Distribution passed through on the K-1, after salary and employer FICA. */
  distribution: number;
  /** True when the salary entered exceeds profit, which is not a viable structure. */
  salaryExceedsProfit: boolean;
}

const round2 = (n: number) => Math.round(n * 100) / 100;
const clampNonNeg = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

/** Employer-side FICA on a salary, respecting the Social Security wage base. */
function employerFica(salary: number): number {
  const ss = Math.min(salary, SS_WAGE_BASE_2026) * EMPLOYEE_SS_RATE;
  return ss + salary * EMPLOYEE_MEDICARE_RATE;
}

/** Employee-side FICA, including the 0.9% Additional Medicare Tax above the threshold. */
function employeeFica(salary: number, filingStatus: FilingStatus, otherIncome: number): number {
  const ss = Math.min(salary, SS_WAGE_BASE_2026) * EMPLOYEE_SS_RATE;
  const medicare = salary * EMPLOYEE_MEDICARE_RATE;
  const over = Math.max(0, salary + otherIncome - ADDITIONAL_MEDICARE_THRESHOLD[filingStatus]);
  const additional = Math.min(over, salary) * ADDITIONAL_MEDICARE_RATE;
  return ss + medicare + additional;
}

export function calculateSCorp(input: SCorpInput): SCorpResult {
  const netProfit = clampNonNeg(input.netProfit);
  const filingStatus = input.filingStatus;
  const otherIncome = clampNonNeg(input.otherIncome ?? 0);
  const payrollCost = clampNonNeg(input.payrollCost ?? DEFAULT_PAYROLL_COST);
  const applyQbi = input.applyQbi !== false;
  const standard = STANDARD_DEDUCTION_2026[filingStatus];
  const brackets = BRACKETS_2026[filingStatus];

  // Salary cannot exceed what the business earned; clamp and flag it.
  const salaryExceedsProfit = clampNonNeg(input.reasonableSalary) > netProfit;
  const salary = Math.min(clampNonNeg(input.reasonableSalary), netProfit);

  // ---- Path A: sole proprietor / single-member LLC (default taxation) ----
  const seEarnings = netProfit * SE_NET_EARNINGS_FACTOR;
  const seSs = Math.min(seEarnings, SS_WAGE_BASE_2026) * SS_RATE;
  const seMedicare = seEarnings * MEDICARE_RATE;
  const seAdditionalBase = Math.max(
    0,
    seEarnings + otherIncome - ADDITIONAL_MEDICARE_THRESHOLD[filingStatus],
  );
  const seAdditional = Math.min(seAdditionalBase, seEarnings) * ADDITIONAL_MEDICARE_RATE;
  const seTax = seSs + seMedicare + seAdditional;
  const halfSe = (seSs + seMedicare) / 2;

  const spAgi = netProfit + otherIncome - halfSe;
  const spAfterStandard = Math.max(0, spAgi - standard);
  const spQbiBase = Math.max(0, netProfit - halfSe);
  const spQbi = applyQbi ? Math.min(spQbiBase * QBI_RATE, spAfterStandard * QBI_RATE) : 0;
  const spTaxable = Math.max(0, spAfterStandard - spQbi);
  const spIncomeTax = taxFromBrackets(spTaxable, brackets);

  const soleProprietor: SCorpPath = {
    employmentTax: round2(seTax),
    qbiBase: round2(spQbiBase),
    qbiDeduction: round2(spQbi),
    taxableIncome: round2(spTaxable),
    incomeTax: round2(spIncomeTax),
    totalCost: round2(seTax + spIncomeTax),
  };

  // ---- Path B: S corporation ----
  // Employer FICA is a business expense, so it reduces the profit passed through on the K-1.
  const erFica = employerFica(salary);
  const eeFica = employeeFica(salary, filingStatus, otherIncome);
  const distribution = Math.max(0, netProfit - salary - erFica - payrollCost);

  // Wages are NOT qualified business income — only the pass-through profit is.
  const scQbiBase = distribution;
  const scAgi = salary + distribution + otherIncome;
  const scAfterStandard = Math.max(0, scAgi - standard);
  const scQbi = applyQbi ? Math.min(scQbiBase * QBI_RATE, scAfterStandard * QBI_RATE) : 0;
  const scTaxable = Math.max(0, scAfterStandard - scQbi);
  const scIncomeTax = taxFromBrackets(scTaxable, brackets);

  // The owner bears both halves economically: the employer half comes out of business profit.
  const scEmploymentTax = erFica + eeFica;

  const sCorp: SCorpPath = {
    employmentTax: round2(scEmploymentTax),
    qbiBase: round2(scQbiBase),
    qbiDeduction: round2(scQbi),
    taxableIncome: round2(scTaxable),
    incomeTax: round2(scIncomeTax),
    totalCost: round2(scEmploymentTax + scIncomeTax + payrollCost),
  };

  const netSaving = soleProprietor.totalCost - sCorp.totalCost;

  return {
    soleProprietor,
    sCorp,
    grossPayrollTaxSaved: round2(Math.max(0, seTax - scEmploymentTax)),
    qbiDeductionLost: round2(Math.max(0, spQbi - scQbi)),
    payrollCost: round2(payrollCost),
    netSaving: round2(netSaving),
    electionCostsMoney: netSaving < 0,
    salaryShareOfProfit: netProfit > 0 ? salary / netProfit : 0,
    distribution: round2(distribution),
    salaryExceedsProfit,
  };
}

/**
 * The profit at which an S-corp election clears `minSaving` a year, holding the salary at
 * `salaryShare` of profit. Scans upward rather than solving algebraically because the tax function
 * is piecewise (brackets, the wage base, the QBI cap).
 *
 * `minSaving` defaults to $1,000 rather than $0 deliberately. On federal arithmetic alone the net
 * saving turns positive surprisingly early — around $20,000 of profit it is roughly $140 — but a
 * saving that small is wiped out by state franchise taxes, a higher accounting bill, or one hour
 * of your own time on payroll admin. Reporting the first dollar of theoretical benefit as the
 * threshold would be arithmetically true and practically misleading.
 */
export function breakEvenProfit(
  filingStatus: FilingStatus,
  salaryShare = 0.5,
  payrollCost = DEFAULT_PAYROLL_COST,
  otherIncome = 0,
  minSaving = 1000,
): number | null {
  for (let profit = 5000; profit <= 400000; profit += 1000) {
    const r = calculateSCorp({
      netProfit: profit,
      reasonableSalary: profit * salaryShare,
      filingStatus,
      payrollCost,
      otherIncome,
    });
    if (r.netSaving >= minSaving) return profit;
  }
  return null;
}
