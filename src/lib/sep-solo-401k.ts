// SEP IRA and solo 401(k) contribution engine (tool-usage pass 2026-11-25) — standalone, no React/DOM.
//
// What it answers: "how much can a self-employed person put into a SEP IRA or a solo 401(k)?" for tax year 2026 or 2027.
//
// Sources (all saved under reports/mindmap-pass/2026-11-25-tool-usage/research/sources/):
//   - IRS Publication 560 (2025), Retirement Plans for Small Business: the employer contribution for a self-employed
//     person is figured with the "reduced" rate, 20% (a 25% plan rate becomes 20%), applied to net earnings after the
//     deduction for half of self-employment tax (Rate Worksheet / Deduction Worksheet for Self-Employed). The
//     compensation counted is capped by the annual limit (Pub 560: $360,000 for 2026).
//   - IRS Notice 2026-66 (2027 cost-of-living adjustments), the IRS news release "401(k) limit increases to $25,500 for 2027" and IR-2026-136 (2026):
//       2026: 415(c) defined contribution limit $72,000; 402(g) elective deferral $24,500; age 50+ catch-up $8,000;
//             age 60 to 63 catch-up $11,250; compensation limit $360,000.
//       2027: 415(c) limit $75,000; 402(g) deferral $25,500; age 50+ catch-up $8,500; age 60 to 63 catch-up $11,750;
//             compensation limit $375,000.
//   - Catch-up contributions sit outside the 415(c) limit (Pub 560 "Defined contribution limits ... other than catch-up").
//   - Self-employment tax (for the half-SE-tax deduction) reuses ./self-employment-tax.ts. That engine carries the
//     2026 base by default; this tool passes the base for the chosen year ($184,500 for 2026, $192,300 for 2027, from the SSA notice
//     in Federal Register 2026-21796, saved as research/sources/ssa-fr-2026-21796.txt).
//
// Simplifications, stated on the page: sole proprietor or single-member LLC with no employees (a SEP must cover eligible
// employees; a solo 401(k) is for owners and spouses only), Schedule C profit only, no Roth catch-up wage test (that test
// looks at W-2 wages, not self-employed earnings), the 401(k) employee deferral limit is shared across every plan the
// reader participates in (entered as "other deferrals"), and spouse participation is not modeled.

import { calculateSelfEmploymentTax } from "./self-employment-tax";

/** Social Security wage base (contribution and benefit base): $184,500 for 2026 (IRS Topic 751) and $192,300 for 2027 (SSA, Federal Register 2026-21796, Oct 26 2026). */
export const SS_WAGE_BASE: Record<2026 | 2027, number> = { 2026: 184_500, 2027: 192_300 };

export type PlanYear = 2026 | 2027;
/** under50 | age 50 or older (not 60 to 63) | age 60, 61, 62 or 63 at any time in the plan year. */
export type AgeBand = "under50" | "50plus" | "60to63";

export interface YearLimits {
  /** IRC 415(c)(1)(A) defined contribution limit, excluding catch-up. */
  annualAdditionsLimit: number;
  /** IRC 402(g)(1) elective deferral limit. */
  deferralLimit: number;
  /** IRC 414(v) catch-up, age 50 and older. */
  catchUp50: number;
  /** IRC 414(v)(2)(E) catch-up for ages 60 to 63. */
  catchUp60to63: number;
  /** Annual compensation limit (IRC 401(a)(17) / 404(l)). */
  compensationLimit: number;
}

export const LIMITS: Record<PlanYear, YearLimits> = {
  2026: { annualAdditionsLimit: 72_000, deferralLimit: 24_500, catchUp50: 8_000, catchUp60to63: 11_250, compensationLimit: 360_000 },
  2027: { annualAdditionsLimit: 75_000, deferralLimit: 25_500, catchUp50: 8_500, catchUp60to63: 11_750, compensationLimit: 375_000 },
};

/** Pub 560 reduced rate for a 25% plan rate: 0.25 / 1.25 = 20%. */
export const REDUCED_RATE = 0.2;

export interface SepSoloInput {
  /** Schedule C net profit (self-employment income before the half-SE-tax deduction). */
  netProfit: number;
  year: PlanYear;
  age: AgeBand;
  /** Elective deferrals already made to another 401(k), 403(b) or similar plan this year (uses the shared limit). */
  otherDeferrals: number;
}

export interface SepSoloResult {
  year: PlanYear;
  limits: YearLimits;
  /** Social Security plus Medicare self-employment tax on the profit (Schedule SE; excludes the 0.9% Additional Medicare Tax). */
  seTax: number;
  /** Deduction for half of self-employment tax. */
  halfSeTax: number;
  /** Net profit minus the half-SE-tax deduction: the earned income the plan formulas use. */
  netEarnings: number;
  /** Net earnings counted after the annual compensation limit. */
  countedEarnings: number;
  /** 20% of counted earnings, before the annual additions cap. */
  employerBeforeCap: number;
  /** Employer share after the annual additions cap. Same formula for a SEP IRA and a solo 401(k). */
  employer: number;
  /** SEP IRA maximum for the year (employer share only). */
  sepMax: number;
  /** Employee deferral allowed in the solo 401(k) after other plans and the earned-income limit. */
  employeeDeferral: number;
  /** Catch-up allowed (outside the annual additions cap). 0 under age 50. */
  catchUp: number;
  /** Solo 401(k) maximum excluding catch-up (employee deferral + employer share, within the annual additions cap). */
  soloMax: number;
  /** Solo 401(k) maximum including catch-up. */
  soloMaxWithCatchUp: number;
  /** soloMaxWithCatchUp minus sepMax. */
  soloAdvantage: number;
  flags: {
    /** Employer share reached the annual additions limit. */
    employerCapped: boolean;
    /** Earnings above the compensation limit were ignored. */
    compensationCapped: boolean;
    /** Other plans already used part or all of the shared deferral limit. */
    deferralReducedByOtherPlans: boolean;
    /** The deferral was cut because earned income is the ceiling. */
    deferralLimitedByEarnings: boolean;
    /** Profit too low for any self-employment tax (net earnings under $400). */
    belowSeFloor: boolean;
    /** No contribution possible (zero or negative profit). */
    noEarnings: boolean;
  };
}

const clean = (v: number) => (Number.isFinite(v) ? Math.max(0, v) : 0);
const r2 = (v: number) => Math.round(v * 100) / 100;

/** Dollar figure shown to the reader: rounded to the nearest whole dollar. */
export const wholeDollars = (v: number) => Math.round(v);

export function computeSepSolo(input: SepSoloInput): SepSoloResult {
  const limits = LIMITS[input.year];
  const profit = clean(input.netProfit);
  const other = clean(input.otherDeferrals);

  const se = calculateSelfEmploymentTax({ netProfit: profit, filingStatus: "single", includeIncomeTax: false, socialSecurityWageBase: SS_WAGE_BASE[input.year] });
  const halfSeTax = se.halfSeTaxDeduction;
  const netEarnings = Math.max(0, r2(profit - halfSeTax));
  const countedEarnings = Math.min(netEarnings, limits.compensationLimit);
  const employerBeforeCap = countedEarnings * REDUCED_RATE;
  const employer = Math.min(employerBeforeCap, limits.annualAdditionsLimit);

  // Employee deferral: shared 402(g) limit minus other plans, never more than earned income left after the employer share.
  const deferralRoom = Math.max(0, limits.deferralLimit - other);
  const earnedIncomeRoom = Math.max(0, netEarnings - employer);
  const employeeDeferral = Math.min(deferralRoom, earnedIncomeRoom);

  // Employee deferral + employer share must fit inside the annual additions limit.
  const soloMax = Math.min(employeeDeferral + employer, limits.annualAdditionsLimit);

  // Catch-up: age-based limit, minus any other-plan deferrals above the shared 402(g) limit, and never above earned income left.
  const catchLimit = input.age === "60to63" ? limits.catchUp60to63 : input.age === "50plus" ? limits.catchUp50 : 0;
  const catchUsedByOther = Math.max(0, other - limits.deferralLimit);
  const catchRoom = Math.max(0, catchLimit - catchUsedByOther);
  const catchUp = Math.min(catchRoom, Math.max(0, netEarnings - employer - employeeDeferral));

  const soloMaxWithCatchUp = soloMax + catchUp;
  const sepMax = employer;

  return {
    year: input.year,
    limits,
    seTax: r2(se.socialSecurityTax + se.medicareTax),
    halfSeTax,
    netEarnings,
    countedEarnings,
    employerBeforeCap: r2(employerBeforeCap),
    employer: r2(employer),
    sepMax: r2(sepMax),
    employeeDeferral: r2(employeeDeferral),
    catchUp: r2(catchUp),
    soloMax: r2(soloMax),
    soloMaxWithCatchUp: r2(soloMaxWithCatchUp),
    soloAdvantage: r2(soloMaxWithCatchUp - sepMax),
    flags: {
      employerCapped: employerBeforeCap >= limits.annualAdditionsLimit,
      compensationCapped: netEarnings > limits.compensationLimit,
      deferralReducedByOtherPlans: other > 0 && deferralRoom < limits.deferralLimit,
      deferralLimitedByEarnings: earnedIncomeRoom < deferralRoom,
      belowSeFloor: se.belowSeFloor,
      noEarnings: profit <= 0,
    },
  };
}

/** Net earnings at which the employer share reaches the annual additions cap (shown in the how-it-works table). */
export function earningsForCap(year: PlanYear): number {
  const l = LIMITS[year];
  return Math.min(l.annualAdditionsLimit / REDUCED_RATE, l.compensationLimit);
}
