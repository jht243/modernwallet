// Pure invoice-factoring / accounts-receivable financing engine.
//
// Invoice factoring sells an unpaid B2B invoice to a factor for an immediate cash advance (a % of
// face value), minus a fee that accrues while the invoice is outstanding. When the customer pays,
// the factor releases the reserve minus its fee. This module turns the quote (advance rate +
// factoring fee + days outstanding) into the numbers a business needs — cash now, total fee, and
// the true annualized cost. ZERO React/DOM deps → runs at build time AND runtime.

export type FeeStructure = "per30" | "prorated";

export interface FactoringInput {
  /** Face value of the invoice being factored. */
  invoiceAmount: number;
  /** Advance rate: % of face value paid up front (typically 70–90%). */
  advanceRatePct: number;
  /** Factoring fee as % of face value per 30-day period (typically 1–5%). */
  factorFeePct: number;
  /** Days until the customer pays the invoice. */
  daysUntilPaid: number;
  /** "per30" charges a full fee per started 30-day period (common); "prorated" charges daily. */
  feeStructure?: FeeStructure;
  /** Optional: total monthly invoice volume factored, to annualize the cost. */
  monthlyInvoiceVolume?: number;
}

export interface FactoringResult {
  advanceAmount: number | null; // cash you get now
  reserveAmount: number | null; // held back until the customer pays
  periods: number | null; // 30-day periods used for the fee
  feeAmount: number | null; // total factoring fee (dollars)
  rebateAmount: number | null; // reserve − fee, released when the invoice is paid
  netProceeds: number | null; // invoice − fee = total cash you ultimately keep
  effectiveAprPct: number | null; // annualized cost of the cash advanced
  annualFactoringCost: number | null; // extrapolated yearly fee at the given monthly volume
}

const EMPTY: FactoringResult = {
  advanceAmount: null,
  reserveAmount: null,
  periods: null,
  feeAmount: null,
  rebateAmount: null,
  netProceeds: null,
  effectiveAprPct: null,
  annualFactoringCost: null,
};

export function computeFactoring(input: FactoringInput): FactoringResult {
  const invoice = input.invoiceAmount > 0 ? input.invoiceAmount : null;
  const advancePct = input.advanceRatePct >= 0 ? Math.min(100, input.advanceRatePct) : null;
  const feePct = input.factorFeePct >= 0 ? input.factorFeePct : null;
  const days = input.daysUntilPaid > 0 ? input.daysUntilPaid : null;
  const structure: FeeStructure = input.feeStructure === "prorated" ? "prorated" : "per30";

  if (invoice == null || advancePct == null || feePct == null || days == null) return { ...EMPTY };

  const advanceAmount = invoice * (advancePct / 100);
  const reserveAmount = invoice - advanceAmount;

  const periods = structure === "prorated" ? days / 30 : Math.max(1, Math.ceil(days / 30));
  const feeAmount = invoice * (feePct / 100) * periods;
  const rebateAmount = reserveAmount - feeAmount;
  const netProceeds = invoice - feeAmount;

  // Effective APR of the money advanced: annualize the fee over the days the advance is outstanding.
  const effectiveAprPct = advanceAmount > 0 ? (feeAmount / advanceAmount) * (365 / days) * 100 : null;

  const monthlyVolume = Math.max(0, input.monthlyInvoiceVolume ?? 0);
  const annualFactoringCost = monthlyVolume > 0 ? (feeAmount / invoice) * monthlyVolume * 12 : null;

  return {
    advanceAmount: round2(advanceAmount),
    reserveAmount: round2(reserveAmount),
    periods: round2(periods),
    feeAmount: round2(feeAmount),
    rebateAmount: round2(rebateAmount),
    netProceeds: round2(netProceeds),
    effectiveAprPct: effectiveAprPct == null ? null : round2(effectiveAprPct),
    annualFactoringCost: annualFactoringCost == null ? null : round2(annualFactoringCost),
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
