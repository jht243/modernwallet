// Social Security withholding (Form W-4V) engine — tool-usage pass 2026-11-25. Standalone, no React/DOM.
//
// What it answers: "which W-4V rate should I pick, if any?" The reader enters a monthly benefit and other income. The engine
//   1. finds the taxable part of the benefits (reuses ./social-security-taxable, IRS Publication 915 Worksheet 1),
//   2. estimates federal income tax on taxable benefits + other income with the 2026 brackets and standard deduction
//      (reuses ./tax-bracket and ordinaryTax in ./stock-capital-gains; IRS Rev. Proc. 2025-32),
//   3. compares the four withholding rates Form W-4V allows (7%, 10%, 12%, 22% of each payment; "no other percentage or amount")
//      by what they would withhold over the year against the tax still to cover.
//
// TAX YEAR BASIS: every bracket and deduction here is 2026. The 2027 brackets are not applied. A W-4V filed for 2027 payments is
// compared with a 2026-rules estimate, so the result is a planning figure; the page says so beside the result.
//
// Left out (stated on the page): state tax, credits, the $6,000-per-person senior deduction for 2025 to 2028, itemized deductions,
// capital-gain rates, the additional Medicare tax and any tax already paid through estimated payments unless the reader enters it.
// Leaving out the senior deduction can overstate the tax, which pushes the suggestion toward over-withholding rather than a shortfall.

import { computeSsTaxable, type SsStatus } from "./social-security-taxable";
import { STANDARD_DEDUCTION, type FilingStatus } from "./tax-bracket";
import { ordinaryTax } from "./stock-capital-gains";

/** The four rates Form W-4V line 6 allows for Social Security benefits (IRS Form W-4V, Rev. January 2026). */
export const W4V_RATES = [0.07, 0.1, 0.12, 0.22] as const;
export type W4vRate = (typeof W4V_RATES)[number];

/** Tax year of the brackets, standard deduction and extra deduction used by this engine. */
export const TAX_YEAR = 2026;

/** Additional standard deduction for age 65 or older, 2026 (IRS Rev. Proc. 2025-32): $2,050 unmarried, $1,650 per spouse if married. */
export const EXTRA_STANDARD_65: Record<SsStatus | "hoh", number> = { single: 2050, hoh: 2050, mfj: 1650, "mfs-together": 1650 };

export type WithholdingStatus = "single" | "hoh" | "mfj" | "mfs-together";

export interface WithholdingInput {
  status: WithholdingStatus;
  /** Monthly Social Security benefit before any Medicare premium is taken out. */
  monthlyBenefit: number;
  /** Months of the year the chosen rate would apply (1 to 12). */
  months: number;
  /** Other taxable income for the year (pensions, IRA withdrawals, wages, interest). Not Social Security. */
  otherIncome: number;
  /** Number of filers on the return who are 65 or older (0, 1 or 2). */
  filers65: number;
  /** Federal tax already withheld or paid toward this year's bill from other sources. */
  alreadyPaid: number;
}

export interface RateRow {
  rate: W4vRate;
  /** Tax withheld from benefits over the months entered. */
  withheld: number;
  /** withheld minus the tax still to cover. Positive: refund-sized overage. Negative: shortfall. */
  surplus: number;
  coversTax: boolean;
}

export type Advice =
  /** Benefits not taxable or other payments already cover the tax: no W-4V needed. */
  | "none"
  /** One rate covers the tax; the lowest covering rate is `best`. */
  | "rate"
  /** Even 22% falls short: add estimated payments or withholding on other income. */
  | "short";

export interface WithholdingResult {
  taxYear: number;
  annualBenefits: number;
  taxableBenefits: number;
  pctTaxable: number;
  provisionalIncome: number;
  deduction: number;
  taxableIncome: number;
  /** Estimated federal income tax for the year, 2026 rules. */
  estimatedTax: number;
  /** estimatedTax minus alreadyPaid, never below 0. */
  taxToCover: number;
  rows: RateRow[];
  advice: Advice;
  /** The lowest rate that covers the tax ("rate"), or 22% when even that falls short ("short"); null for "none". */
  best: W4vRate | null;
  /** Yearly benefit-payment share needed to cover taxToCover (taxToCover ÷ benefits withheld over the months entered). */
  neededShare: number;
}

const toTaxStatus = (s: WithholdingStatus): FilingStatus => (s === "mfs-together" ? "mfs" : s);
const toSsStatus = (s: WithholdingStatus): SsStatus => (s === "hoh" ? "single" : s);
const clean = (v: number) => (Number.isFinite(v) ? Math.max(0, v) : 0);
const r2 = (v: number) => Math.round(v * 100) / 100;

export function computeWithholding(i: WithholdingInput): WithholdingResult {
  const monthly = clean(i.monthlyBenefit);
  const months = Math.min(12, Math.max(1, Math.round(clean(i.months) || 12)));
  const annual = monthly * 12;
  const other = clean(i.otherIncome);
  const maxFilers = i.status === "mfj" ? 2 : 1;
  const filers65 = Math.min(maxFilers, Math.max(0, Math.round(clean(i.filers65))));

  const ss = computeSsTaxable({ status: toSsStatus(i.status), benefits: annual, otherIncome: other, taxExemptInterest: 0 });
  const agi = other + ss.taxable;
  const deduction = STANDARD_DEDUCTION[toTaxStatus(i.status)] + filers65 * EXTRA_STANDARD_65[i.status];
  const taxableIncome = Math.max(0, agi - deduction);
  const estimatedTax = ordinaryTax(toTaxStatus(i.status), taxableIncome);
  const taxToCover = Math.max(0, estimatedTax - clean(i.alreadyPaid));

  const rows: RateRow[] = W4V_RATES.map((rate) => {
    const withheld = r2(monthly * months * rate);
    const surplus = r2(withheld - taxToCover);
    return { rate, withheld, surplus, coversTax: surplus >= 0 };
  });

  let advice: Advice;
  let best: W4vRate | null;
  if (taxToCover <= 0 || monthly <= 0) {
    advice = "none";
    best = null;
  } else {
    const covering = rows.find((r) => r.coversTax);
    if (!covering) {
      advice = "short";
      best = W4V_RATES[W4V_RATES.length - 1];
    } else {
      best = covering.rate;
      advice = "rate";
    }
  }

  const withheldBase = monthly * months;
  return {
    taxYear: TAX_YEAR,
    annualBenefits: r2(annual),
    taxableBenefits: ss.taxable,
    pctTaxable: ss.pctTaxable,
    provisionalIncome: ss.provisionalIncome,
    deduction,
    taxableIncome: r2(taxableIncome),
    estimatedTax: r2(estimatedTax),
    taxToCover: r2(taxToCover),
    rows,
    advice,
    best,
    neededShare: withheldBase > 0 ? taxToCover / withheldBase : 0,
  };
}
