// Annuity engine — standalone. Three standard time-value-of-money questions, all closed-form:
//   payout   — a lump sum is spent down to zero by level payments (the "what will it pay" question)
//   future   — level deposits grow at a rate (the accumulation phase)
//   present  — a stream of level payments is worth one lump sum today at a discount rate
// The rate, term and payment timing are reader inputs. Nothing here is an insurer's quote: a real
// annuity contract also prices mortality, fees and the insurer's margin, which this does not model.

export type AnnuityMode = "payout" | "future" | "present";

export interface AnnuityInput {
  mode: AnnuityMode;
  /** payout: lump sum paid in. future: ignored. present: ignored. */
  lumpSum: number;
  /** future / present: the level payment made each period. payout: ignored (it is the result). */
  payment: number;
  /** Annual rate in percent (growth rate or discount rate). */
  ratePct: number;
  years: number;
  /** Payments per year: 1, 2, 4 or 12. */
  perYear: number;
  /** true = annuity due (payment at the start of each period); false = ordinary (end of period). */
  atStart: boolean;
}

export interface AnnuityResult {
  periods: number;
  /** payout: the level payment. future: the ending balance. present: the lump-sum value today. */
  headline: number;
  /** Sum of all payments made (payout: payments received; future: deposits; present: payments in the stream). */
  totalPayments: number;
  /** Growth or interest component: headline-related split, see label in the UI. */
  interest: number;
}

const EMPTY: AnnuityResult = { periods: 0, headline: 0, totalPayments: 0, interest: 0 };

/** Present-value factor of $1 per period for n periods at periodic rate i (ordinary annuity). */
function pvFactor(i: number, n: number): number {
  return i === 0 ? n : (1 - Math.pow(1 + i, -n)) / i;
}
/** Future-value factor of $1 per period for n periods at periodic rate i (ordinary annuity). */
function fvFactor(i: number, n: number): number {
  return i === 0 ? n : (Math.pow(1 + i, n) - 1) / i;
}

export function computeAnnuity(input: AnnuityInput): AnnuityResult {
  const { mode, lumpSum, payment, ratePct, years, perYear, atStart } = input;
  const n = Math.round(years * perYear);
  if (!(n > 0) || !(perYear > 0) || ratePct < 0) return EMPTY;
  const i = ratePct / 100 / perYear;
  const due = atStart ? 1 + i : 1; // annuity-due factor

  if (mode === "payout") {
    if (!(lumpSum > 0)) return EMPTY;
    const pmt = lumpSum / (pvFactor(i, n) * due);
    const total = pmt * n;
    return { periods: n, headline: pmt, totalPayments: total, interest: total - lumpSum };
  }
  if (!(payment > 0)) return EMPTY;
  if (mode === "future") {
    const fv = payment * fvFactor(i, n) * due;
    const deposits = payment * n;
    return { periods: n, headline: fv, totalPayments: deposits, interest: fv - deposits };
  }
  const pv = payment * pvFactor(i, n) * due;
  const total = payment * n;
  return { periods: n, headline: pv, totalPayments: total, interest: total - pv };
}
