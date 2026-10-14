// Trump Account vs 529 engine — standalone. Same family money, same return, two accounts, value at 18 and
// what is left after tax.
//
// Trump Account (IRC §530A): $1,000 federal seed for eligible children born 2025–2028, private contributions
// capped at $5,000/yr, growth tax-deferred. At 18 it follows traditional-IRA rules (IRS Notice 2025-68):
// after-tax family contributions are basis and come out untaxed; the seed and the earnings are taxed as
// ordinary income, plus the 10% additional tax on distributions before 59½ unless an exception applies.
// Qualified higher-education expenses are an exception to the 10% (IRC §72(t)(2)(E), IRS Pub 590-B).
//
// 529 plan (IRS Pub 970 / Topic 313): no federal tax on growth or on withdrawals spent on qualified education.
// A non-qualified withdrawal taxes the earnings as ordinary income plus a 10% additional tax on the earnings.
//
// Growth mirrors src/lib/trump-account.ts: monthly compounding, contributions spread evenly each month.

import { FAMILY_AGGREGATE_CAP, SEED_AMOUNT, ACCOUNT_MATURITY_AGE } from "./trump-account";

export const ADDITIONAL_TAX_RATE = 0.10; // 10% additional tax (Pub 970 for 529 earnings; §72(t) for the Trump Account)

export interface TrumpVs529Input {
  childAge: number;
  yearlyContribution: number;
  returnPct: number;
  seedEligible: boolean;
  /** Ordinary income tax rate of whoever is taxed on the withdrawal (the child at 18, usually low). */
  taxRatePct: number;
  /** true = spent on qualified education; false = cashed out at 18 for something else. */
  forCollege: boolean;
}

export interface AccountOutcome {
  valueAt18: number;
  contributions: number; // private money put in
  earnings: number;
  tax: number;
  additionalTax: number;
  afterTax: number;
}

export interface TrumpVs529Result {
  years: number;
  trumpYearly: number; // contribution actually allowed into the Trump Account
  capped: boolean;
  trump: AccountOutcome & { seed: number };
  plan529: AccountOutcome;
  /** 529 after-tax minus Trump after-tax (positive = the 529 leaves more). */
  difference: number;
}

function grow(start: number, yearly: number, years: number, returnPct: number): number {
  const i = returnPct / 100 / 12;
  let b = start;
  for (let m = 0; m < years * 12; m++) b = b * (1 + i) + yearly / 12;
  return b;
}

export function computeTrumpVs529(inp: TrumpVs529Input): TrumpVs529Result | null {
  const age = Math.max(0, Math.min(ACCOUNT_MATURITY_AGE, Math.round(inp.childAge)));
  const years = ACCOUNT_MATURITY_AGE - age;
  if (!(years > 0) || inp.yearlyContribution < 0) return null;
  const rate = Math.max(0, inp.taxRatePct) / 100;
  const seed = inp.seedEligible ? SEED_AMOUNT : 0;
  const trumpYearly = Math.min(inp.yearlyContribution, FAMILY_AGGREGATE_CAP);

  const tValue = grow(seed, trumpYearly, years, inp.returnPct);
  const tContrib = trumpYearly * years;
  const tTaxable = Math.max(0, tValue - tContrib); // seed + earnings; family money is basis
  const tTax = tTaxable * rate;
  const tAdd = inp.forCollege ? 0 : tTaxable * ADDITIONAL_TAX_RATE;

  const pValue = grow(0, inp.yearlyContribution, years, inp.returnPct);
  const pContrib = inp.yearlyContribution * years;
  const pEarn = Math.max(0, pValue - pContrib);
  const pTax = inp.forCollege ? 0 : pEarn * rate;
  const pAdd = inp.forCollege ? 0 : pEarn * ADDITIONAL_TAX_RATE;

  const trump = { seed, valueAt18: tValue, contributions: tContrib, earnings: tValue - tContrib - seed, tax: tTax, additionalTax: tAdd, afterTax: tValue - tTax - tAdd };
  const plan529 = { valueAt18: pValue, contributions: pContrib, earnings: pEarn, tax: pTax, additionalTax: pAdd, afterTax: pValue - pTax - pAdd };
  return { years, trumpYearly, capped: inp.yearlyContribution > FAMILY_AGGREGATE_CAP, trump, plan529, difference: plan529.afterTax - trump.afterTax };
}
