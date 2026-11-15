// 2026 federal paycheck (take-home) estimate engine (mindmap keyword-gap pass 2026-11-15).
//
// Sources (saved under reports/mindmap-pass/2026-11-15-keyword-gap-run/research/sources/):
//  - IRS Rev. Proc. 2025-32: 2026 brackets and standard deductions (reused from ./tax-bracket).
//  - IRS Topic no. 751: Social Security 6.2% on wages up to $184,500, Medicare 1.45%, Additional Medicare 0.9% withheld on wages above $200,000.
//  - IRS Topic no. 560: Additional Medicare Tax thresholds ($250,000 MFJ, $125,000 MFS, $200,000 others) apply to the final return.
// Annual-liability estimate with the standard deduction. Not IRS Pub. 15-T withholding. Not modelled: state and local tax, credits,
// itemized deductions, Section 125 premiums, HSA, other pre-tax items, extra W-4 withholding, tips, overtime and senior or QBI deductions.

import { computeBrackets, STANDARD_DEDUCTION, type FilingStatus } from "./tax-bracket";

export type PaycheckStatus = Extract<FilingStatus, "single" | "mfj" | "hoh">;
export type PayFrequency = "weekly" | "biweekly" | "semimonthly" | "monthly";
export type PayBasis = "annual" | "paycheck";

export const PAY_FREQUENCY_PERIODS: Record<PayFrequency, number> = { weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12 };
export const PAY_FREQUENCY_LABEL: Record<PayFrequency, string> = {
  weekly: "Weekly (52 a year)",
  biweekly: "Every two weeks (26 a year)",
  semimonthly: "Twice a month (24 a year)",
  monthly: "Monthly (12 a year)",
};
export const PAYCHECK_STATUS_LABEL: Record<PaycheckStatus, string> = {
  single: "Single",
  mfj: "Married filing jointly",
  hoh: "Head of household",
};

export const SS_RATE = 0.062;
export const SS_WAGE_BASE = 184500;
export const MEDICARE_RATE = 0.0145;
export const ADDL_MEDICARE_RATE = 0.009;
export const ADDL_MEDICARE_WITHHOLDING_THRESHOLD = 200000;

export interface PaycheckInput {
  /** Gross pay amount, interpreted per `basis`. */
  gross: number;
  basis: PayBasis;
  frequency: PayFrequency;
  status: PaycheckStatus;
  /** Annual pre-tax retirement deferral (traditional 401(k) or 403(b) style). Lowers income tax only, not payroll tax. */
  pretax: number;
}

export interface PaycheckResult {
  periods: number;
  grossAnnual: number;
  pretax: number;
  taxableIncome: number;
  federal: number;
  socialSecurity: number;
  medicare: number;
  net: number;
  federalBracket: number;
  /** Per-paycheck amounts. */
  perCheck: { gross: number; pretax: number; federal: number; socialSecurity: number; medicare: number; net: number };
  takeHomeShare: number;
}

export const PAYCHECK_DEFAULTS: PaycheckInput = { gross: 60000, basis: "annual", frequency: "biweekly", status: "single", pretax: 0 };

export function computePaycheck(i: PaycheckInput): PaycheckResult | null {
  if (!(i.gross > 0)) return null;
  const periods = PAY_FREQUENCY_PERIODS[i.frequency];
  const grossAnnual = i.basis === "annual" ? i.gross : i.gross * periods;
  const pretax = Math.min(Math.max(0, i.pretax), grossAnnual);
  const fed = computeBrackets({ income: grossAnnual - pretax, status: i.status, useStandard: true, itemized: 0 });
  const taxableIncome = Math.max(0, grossAnnual - pretax - STANDARD_DEDUCTION[i.status]);
  const federal = fed ? fed.tax : 0;
  const socialSecurity = Math.min(grossAnnual, SS_WAGE_BASE) * SS_RATE;
  const medicare = grossAnnual * MEDICARE_RATE + Math.max(0, grossAnnual - ADDL_MEDICARE_WITHHOLDING_THRESHOLD) * ADDL_MEDICARE_RATE;
  const net = grossAnnual - pretax - federal - socialSecurity - medicare;
  return {
    periods,
    grossAnnual,
    pretax,
    taxableIncome,
    federal,
    socialSecurity,
    medicare,
    net,
    federalBracket: fed && taxableIncome > 0 ? fed.marginalRate : 0,
    perCheck: {
      gross: grossAnnual / periods,
      pretax: pretax / periods,
      federal: federal / periods,
      socialSecurity: socialSecurity / periods,
      medicare: medicare / periods,
      net: net / periods,
    },
    takeHomeShare: net / grossAnnual,
  };
}
