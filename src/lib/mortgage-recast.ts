// Mortgage recast engine — standalone. A recast applies a lump sum to principal and re-amortizes the lower
// balance over the SAME months left at the SAME rate, so the payment drops. Prepaying the same lump sum
// without a recast keeps the payment and ends the loan sooner. Payment = B × r ÷ (1 − (1 + r)^−n), r = APR ÷ 12.
// The lender's recast fee is a reader input; no fee is assumed as standard.

export interface RecastInput {
  balance: number;
  ratePct: number;
  monthsLeft: number;
  lumpSum: number;
  fee: number;
}

export interface RecastResult {
  currentPayment: number;
  newBalance: number;
  recastPayment: number;
  monthlySavings: number;
  interestNoLump: number;
  interestRecast: number;
  /** Interest saved by recasting, before the fee. */
  recastInterestSaved: number;
  /** Months of payment savings needed to earn back the fee (null if no fee or no savings). */
  feePaybackMonths: number | null;
  prepay: { months: number; interest: number; interestSaved: number; monthsSooner: number };
}

export function payment(balance: number, ratePct: number, months: number): number {
  const r = ratePct / 100 / 12;
  if (months <= 0) return 0;
  return r === 0 ? balance / months : (balance * r) / (1 - Math.pow(1 + r, -months));
}

export function computeRecast(i: RecastInput): RecastResult | null {
  const n = Math.round(i.monthsLeft);
  if (!(i.balance > 0) || !(n > 0) || i.ratePct < 0) return null;
  const lump = Math.min(Math.max(0, i.lumpSum), i.balance);
  const r = i.ratePct / 100 / 12;
  const p0 = payment(i.balance, i.ratePct, n);
  const b1 = i.balance - lump;
  const p1 = payment(b1, i.ratePct, n);
  const interestNoLump = p0 * n - i.balance;
  const interestRecast = p1 * n - b1;

  // Prepay without recast: keep paying p0 on the lower balance until it is gone.
  let bal = b1, m = 0, interest = 0;
  while (bal > 0.005 && m < 1200) {
    const it = bal * r;
    interest += it;
    bal = bal + it - Math.min(p0, bal + it);
    m++;
  }
  const savings = p0 - p1;
  return {
    currentPayment: p0, newBalance: b1, recastPayment: p1, monthlySavings: savings,
    interestNoLump, interestRecast, recastInterestSaved: interestNoLump - interestRecast,
    feePaybackMonths: i.fee > 0 && savings > 0 ? Math.ceil(i.fee / savings) : null,
    prepay: { months: m, interest, interestSaved: interestNoLump - interest, monthsSooner: n - m },
  };
}
