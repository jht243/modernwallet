// Self-employment tax engine — Schedule SE (Form 1040) plus an optional federal income-tax
// estimate, built for the 1099 contractor / gig worker who wants one number: "how much do I set
// aside?"
//
// Why this engine exists at all: page one for "self employment tax calculator" and "1099 tax
// calculator" is vendor lead-gen (TaxAct, Jackson Hewitt, Keeper, Everlance, TurboTax). Those
// tools return a figure and a signup form. Three things they routinely get wrong or hide, and
// that this engine makes explicit:
//   1. The 92.35% step. SE tax is not 15.3% of profit — it is 15.3% of 92.35% of profit, so the
//      effective rate on net profit is 14.13%, not 15.3%. Tools that skip this overstate the bill.
//   2. The wage-base interaction with a day job. If you also have W-2 wages, those wages consume
//      the Social Security wage base FIRST (IRS Publication 334; Schedule SE Part I line 8).
//      A moonlighter with $150,000 of W-2 wages pays 12.4% on far less SE income than the
//      standalone case, and most calculators ignore the W-2 box entirely.
//   3. The deduction for half of SE tax is an above-the-line deduction against INCOME tax, and it
//      excludes the 0.9% Additional Medicare Tax (IRC §164(f)). Halving the whole SE tax figure —
//      what a naive implementation does — overstates the deduction for high earners.
//
// Statutory figures are 2026 and come from IRS primary sources:
//   - Social Security wage base $184,500; SS 12.4%; Medicare 2.9%; Additional Medicare 0.9% over
//     $200,000 (single) / $250,000 (MFJ) — IRS Topic no. 751.
//   - 92.35% net-earnings factor and the §164(f) half-of-SE-tax deduction — Schedule SE.
//   - 2026 ordinary brackets and standard deduction — IRS Rev. Proc. 2025-32.
//
// Everything here is an ESTIMATE for planning. It models a Schedule C sole proprietor with
// ordinary business income only. It does not model state or local income tax, self-employed
// health insurance or retirement-plan deductions, the child tax credit or any other credit,
// itemized deductions, AMT, capital gains, or a spouse's separate self-employment income.

export type FilingStatus = "single" | "mfj" | "hoh";

// ---- 2026 statutory constants (IRS Topic no. 751; Rev. Proc. 2025-32) ----

/** Net earnings from self-employment = net profit × 92.35% (Schedule SE). */
export const SE_NET_EARNINGS_FACTOR = 0.9235;
/** Social Security (OASDI) portion of SE tax. */
export const SS_RATE = 0.124;
/** Medicare (HI) portion of SE tax — no wage ceiling. */
export const MEDICARE_RATE = 0.029;
/** Additional Medicare Tax on earnings above the filing-status threshold (IRC §3101(b)(2)). */
export const ADDITIONAL_MEDICARE_RATE = 0.009;
/** Maximum earnings subject to Social Security tax in 2026. */
export const SS_WAGE_BASE_2026 = 184_500;

/** Additional Medicare Tax thresholds by filing status. Not inflation-adjusted — set by statute. */
export const ADDITIONAL_MEDICARE_THRESHOLD: Record<FilingStatus, number> = {
  single: 200_000,
  mfj: 250_000,
  hoh: 200_000,
};

/** 2026 standard deduction (Rev. Proc. 2025-32). */
export const STANDARD_DEDUCTION_2026: Record<FilingStatus, number> = {
  single: 16_100,
  mfj: 32_200,
  hoh: 24_150,
};

interface Bracket {
  /** Marginal rate applied to taxable income above `from` and up to `to`. */
  rate: number;
  from: number;
  /** Infinity for the top bracket. */
  to: number;
}

/** 2026 ordinary income brackets (Rev. Proc. 2025-32). HOH uses its own schedule. */
export const BRACKETS_2026: Record<FilingStatus, Bracket[]> = {
  single: [
    { rate: 0.1, from: 0, to: 12_400 },
    { rate: 0.12, from: 12_400, to: 50_400 },
    { rate: 0.22, from: 50_400, to: 105_700 },
    { rate: 0.24, from: 105_700, to: 201_775 },
    { rate: 0.32, from: 201_775, to: 256_225 },
    { rate: 0.35, from: 256_225, to: 640_600 },
    { rate: 0.37, from: 640_600, to: Infinity },
  ],
  mfj: [
    { rate: 0.1, from: 0, to: 24_800 },
    { rate: 0.12, from: 24_800, to: 100_800 },
    { rate: 0.22, from: 100_800, to: 211_400 },
    { rate: 0.24, from: 211_400, to: 403_550 },
    { rate: 0.32, from: 403_550, to: 512_450 },
    { rate: 0.35, from: 512_450, to: 768_700 },
    { rate: 0.37, from: 768_700, to: Infinity },
  ],
  hoh: [
    { rate: 0.1, from: 0, to: 17_700 },
    { rate: 0.12, from: 17_700, to: 67_450 },
    { rate: 0.22, from: 67_450, to: 105_700 },
    { rate: 0.24, from: 105_700, to: 201_775 },
    { rate: 0.32, from: 201_775, to: 256_200 },
    { rate: 0.35, from: 256_200, to: 640_600 },
    { rate: 0.37, from: 640_600, to: Infinity },
  ],
};

/** QBI (§199A) phase-in start, above which the wage/property limits begin to bite. */
export const QBI_THRESHOLD_2026: Record<FilingStatus, number> = {
  single: 201_775,
  mfj: 403_500,
  hoh: 201_775,
};
export const QBI_RATE = 0.2;

export interface SelfEmploymentTaxInput {
  /** Schedule C net profit: gross business income minus business expenses. */
  netProfit: number;
  filingStatus: FilingStatus;
  /** W-2 wages from a job. These consume the Social Security wage base before SE income does. */
  w2Wages?: number;
  /** Other taxable household income (spouse's wages, interest) added for the income-tax estimate. */
  otherIncome?: number;
  /** Include a federal income-tax estimate alongside SE tax. Default true. */
  includeIncomeTax?: boolean;
  /** Apply the §199A QBI deduction in the income-tax estimate. Default true. */
  applyQbi?: boolean;
}

export interface SelfEmploymentTaxResult {
  /** Net profit × 92.35% — the figure SE tax is actually charged on. */
  netEarnings: number;
  /** Portion of net earnings that fell under the Social Security wage base. */
  socialSecurityTaxable: number;
  socialSecurityTax: number;
  medicareTax: number;
  additionalMedicareTax: number;
  /** SS + Medicare + Additional Medicare. */
  totalSelfEmploymentTax: number;
  /** §164(f) above-the-line deduction: half of SE tax EXCLUDING Additional Medicare. */
  halfSeTaxDeduction: number;
  /** SE tax ÷ net profit. The number people mean when they say "my rate". */
  effectiveSeRateOnProfit: number;
  /** True when W-2 wages alone met or exceeded the wage base, so no SS tax is due on SE income. */
  wageBaseFullyUsedByW2: boolean;

  // ---- Income-tax estimate (null when includeIncomeTax is false) ----
  qbiDeduction: number | null;
  taxableIncome: number | null;
  federalIncomeTax: number | null;
  /** Marginal ordinary rate the last dollar of taxable income landed in. */
  marginalRate: number | null;
  /** True when income exceeded the QBI phase-in threshold, where the estimate gets unreliable. */
  qbiAboveThreshold: boolean;

  /** Household total: SE tax + federal income tax on ALL income entered. */
  totalFederalTax: number;
  /** Federal income tax the household would owe with no self-employment income at all. */
  baselineFederalTaxWithoutSe: number;
  /**
   * The federal tax the self-employment income itself causes: household total minus the
   * no-self-employment baseline. This — not the household total — is what a 1099 earner has to
   * cover out of their own pocket, because a day job's W-2 withholding already covers the
   * baseline. It is the honest basis for "set aside X%".
   */
  incrementalFederalTax: number;
  /** incrementalFederalTax ÷ net profit — the "set aside this share of every invoice" answer. */
  setAsideRate: number;
  /** One quarter of incrementalFederalTax — the rough 1040-ES payment. */
  quarterlyPayment: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;
const clampNonNeg = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

/** Progressive tax on `taxableIncome` for the given bracket schedule. */
export function taxFromBrackets(taxableIncome: number, brackets: Bracket[]): number {
  let tax = 0;
  for (const b of brackets) {
    if (taxableIncome <= b.from) break;
    const slice = Math.min(taxableIncome, b.to) - b.from;
    tax += slice * b.rate;
  }
  return tax;
}

/** Marginal rate for the last dollar of `taxableIncome`. */
export function marginalRateFor(taxableIncome: number, brackets: Bracket[]): number {
  let rate = brackets[0].rate;
  for (const b of brackets) {
    if (taxableIncome > b.from) rate = b.rate;
  }
  return rate;
}

export function calculateSelfEmploymentTax(input: SelfEmploymentTaxInput): SelfEmploymentTaxResult {
  const netProfit = clampNonNeg(input.netProfit);
  const filingStatus = input.filingStatus;
  const w2Wages = clampNonNeg(input.w2Wages ?? 0);
  const otherIncome = clampNonNeg(input.otherIncome ?? 0);
  const includeIncomeTax = input.includeIncomeTax !== false;
  const applyQbi = input.applyQbi !== false;

  // ---- Schedule SE ----
  const netEarnings = netProfit * SE_NET_EARNINGS_FACTOR;

  // W-2 wages consume the Social Security wage base first (Schedule SE Part I).
  const remainingWageBase = Math.max(0, SS_WAGE_BASE_2026 - w2Wages);
  const socialSecurityTaxable = Math.min(netEarnings, remainingWageBase);
  const socialSecurityTax = socialSecurityTaxable * SS_RATE;

  // Medicare has no ceiling — the full net earnings figure is taxed.
  const medicareTax = netEarnings * MEDICARE_RATE;

  // Additional Medicare Tax applies to combined wages + SE earnings above the threshold. The
  // self-employed pay the full 0.9% (there is no employer half to match).
  const additionalMedicareBase = Math.max(
    0,
    w2Wages + netEarnings - ADDITIONAL_MEDICARE_THRESHOLD[filingStatus],
  );
  const additionalMedicareOnSe = Math.min(additionalMedicareBase, netEarnings);
  const additionalMedicareTax = additionalMedicareOnSe * ADDITIONAL_MEDICARE_RATE;

  const totalSelfEmploymentTax = socialSecurityTax + medicareTax + additionalMedicareTax;

  // §164(f): half of SE tax, excluding the Additional Medicare Tax, is deductible above the line.
  const halfSeTaxDeduction = (socialSecurityTax + medicareTax) / 2;

  // ---- Federal income tax estimate ----
  let qbiDeduction: number | null = null;
  let taxableIncome: number | null = null;
  let federalIncomeTax: number | null = null;
  let marginalRate: number | null = null;

  const qbiAboveThreshold =
    netProfit + w2Wages + otherIncome > QBI_THRESHOLD_2026[filingStatus];

  if (includeIncomeTax) {
    const agi = netProfit + w2Wages + otherIncome - halfSeTaxDeduction;
    const afterStandard = Math.max(0, agi - STANDARD_DEDUCTION_2026[filingStatus]);

    // QBI is 20% of qualified business income, capped at 20% of taxable income before the QBI
    // deduction. Below the phase-in threshold there is no wage or property limit to apply.
    const qbiBase = Math.max(0, netProfit - halfSeTaxDeduction);
    qbiDeduction = applyQbi ? Math.min(qbiBase * QBI_RATE, afterStandard * QBI_RATE) : 0;

    taxableIncome = Math.max(0, afterStandard - qbiDeduction);
    federalIncomeTax = taxFromBrackets(taxableIncome, BRACKETS_2026[filingStatus]);
    marginalRate = marginalRateFor(taxableIncome, BRACKETS_2026[filingStatus]);
  }

  const totalFederalTax = totalSelfEmploymentTax + (federalIncomeTax ?? 0);

  // Baseline: what the household would owe on W-2 and other income alone, with no Schedule C.
  // The difference is the tax the self-employment income actually causes — the figure a 1099
  // earner must set aside, since W-2 withholding already covers the baseline.
  let baselineFederalTaxWithoutSe = 0;
  if (includeIncomeTax) {
    const baselineAgi = w2Wages + otherIncome;
    const baselineTaxable = Math.max(0, baselineAgi - STANDARD_DEDUCTION_2026[filingStatus]);
    baselineFederalTaxWithoutSe = taxFromBrackets(baselineTaxable, BRACKETS_2026[filingStatus]);
  }
  const incrementalFederalTax = Math.max(0, totalFederalTax - baselineFederalTaxWithoutSe);

  return {
    netEarnings: round2(netEarnings),
    socialSecurityTaxable: round2(socialSecurityTaxable),
    socialSecurityTax: round2(socialSecurityTax),
    medicareTax: round2(medicareTax),
    additionalMedicareTax: round2(additionalMedicareTax),
    totalSelfEmploymentTax: round2(totalSelfEmploymentTax),
    halfSeTaxDeduction: round2(halfSeTaxDeduction),
    effectiveSeRateOnProfit: netProfit > 0 ? totalSelfEmploymentTax / netProfit : 0,
    wageBaseFullyUsedByW2: w2Wages >= SS_WAGE_BASE_2026,
    qbiDeduction: qbiDeduction === null ? null : round2(qbiDeduction),
    taxableIncome: taxableIncome === null ? null : round2(taxableIncome),
    federalIncomeTax: federalIncomeTax === null ? null : round2(federalIncomeTax),
    marginalRate,
    qbiAboveThreshold,
    totalFederalTax: round2(totalFederalTax),
    baselineFederalTaxWithoutSe: round2(baselineFederalTaxWithoutSe),
    incrementalFederalTax: round2(incrementalFederalTax),
    setAsideRate: netProfit > 0 ? incrementalFederalTax / netProfit : 0,
    quarterlyPayment: round2(incrementalFederalTax / 4),
  };
}
