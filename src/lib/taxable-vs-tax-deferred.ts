// Taxable vs. tax-deferred investment growth engine.
//
// Models two accounts holding the same starting balance + annual contribution at the same gross
// return, but taxed differently:
//   - Taxable account: a `taxableSharePct` slice of each year's gain (e.g. dividends/interest) is
//     taxed at `taxRatePct` at the end of that same year, so only the after-tax remainder
//     compounds forward. The rest of the gain is unrealized appreciation that keeps compounding.
//   - Tax-deferred account (traditional 401(k)/IRA): the full balance compounds untaxed every
//     year, then the entire final balance is taxed once, at withdrawal, at `taxRatePct`.
// Both use the SAME tax rate so the comparison isolates the timing effect (annual drag vs.
// deferral), not a rate assumption. Year-by-year loop (not a closed-form formula) so every step is
// independently checkable by hand.

export interface TaxableVsDeferredInput {
  startingBalance: number;
  annualContribution: number;
  annualReturnPct: number;
  years: number;
  taxRatePct: number;
  /** % of each year's investment gain that is taxed that same year (dividends/interest paid out).
   *  The rest is unrealized appreciation, untaxed until final sale (still same taxRatePct then). */
  taxableSharePct: number;
}

export interface TaxableVsDeferredResult {
  taxableFinalBalance: number | null;
  deferredFinalBalanceAfterTax: number | null;
  deferredFinalBalancePreTax: number | null;
  totalContributions: number | null;
  taxableTotalTaxPaid: number | null;
  deferredTotalTaxPaid: number | null;
  advantageDollars: number | null; // deferred after-tax minus taxable (positive = deferred wins)
  advantagePct: number | null; // advantageDollars / taxableFinalBalance
}

const EMPTY: TaxableVsDeferredResult = {
  taxableFinalBalance: null,
  deferredFinalBalanceAfterTax: null,
  deferredFinalBalancePreTax: null,
  totalContributions: null,
  taxableTotalTaxPaid: null,
  deferredTotalTaxPaid: null,
  advantageDollars: null,
  advantagePct: null,
};

export function computeTaxableVsDeferred(input: TaxableVsDeferredInput): TaxableVsDeferredResult {
  const years = Math.round(input.years);
  if (!(years > 0)) return { ...EMPTY };

  const startingBalance = Math.max(0, input.startingBalance ?? 0);
  const annualContribution = Math.max(0, input.annualContribution ?? 0);
  const r = Math.max(0, input.annualReturnPct ?? 0) / 100;
  const taxRate = Math.min(100, Math.max(0, input.taxRatePct ?? 0)) / 100;
  const taxableShare = Math.min(100, Math.max(0, input.taxableSharePct ?? 0)) / 100;

  // ---- Taxable account: annual drag on the taxable slice of each year's gain ----
  let taxableBalance = startingBalance;
  let taxableTotalTaxPaid = 0;
  for (let y = 0; y < years; y++) {
    taxableBalance += annualContribution;
    const yearGain = taxableBalance * r;
    const taxedGain = yearGain * taxableShare;
    const taxOwed = taxedGain * taxRate;
    taxableTotalTaxPaid += taxOwed;
    taxableBalance += yearGain - taxOwed; // after-tax slice + untaxed slice both compound forward
  }

  // ---- Tax-deferred account: full untaxed growth, one tax bill at the end ----
  let deferredBalance = startingBalance;
  for (let y = 0; y < years; y++) {
    deferredBalance += annualContribution;
    deferredBalance *= 1 + r;
  }
  const deferredFinalBalancePreTax = deferredBalance;
  const deferredTotalTaxPaid = deferredBalance * taxRate;
  const deferredFinalBalanceAfterTax = deferredBalance - deferredTotalTaxPaid;

  const totalContributions = startingBalance + annualContribution * years;
  const advantageDollars = deferredFinalBalanceAfterTax - taxableBalance;
  const advantagePct = taxableBalance > 0 ? (advantageDollars / taxableBalance) * 100 : null;

  return {
    taxableFinalBalance: round2(taxableBalance),
    deferredFinalBalanceAfterTax: round2(deferredFinalBalanceAfterTax),
    deferredFinalBalancePreTax: round2(deferredFinalBalancePreTax),
    totalContributions: round2(totalContributions),
    taxableTotalTaxPaid: round2(taxableTotalTaxPaid),
    deferredTotalTaxPaid: round2(deferredTotalTaxPaid),
    advantageDollars: round2(advantageDollars),
    advantagePct: advantagePct == null ? null : round2(advantagePct),
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
