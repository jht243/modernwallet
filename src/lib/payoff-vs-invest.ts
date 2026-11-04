// Pay off mortgage or invest engine — standalone (tool-usage pass 2026-11-04).
// Horizon = the loan's scheduled payoff (months left). Both paths spend the same cash each month: payment + extra.
//  Prepay path: the extra goes to principal; once the loan is gone, the full payment + extra is invested monthly.
//  Invest path: the extra is invested monthly and the loan runs on schedule.
// Investments compound monthly at (1 + g)^(1/12) − 1, where g is the reader's own expected annual return (no default
// return is claimed as expected). Tax on gains at the horizon = the reader's tax rate × (balance − contributions).
// At the horizon both homes are paid off, so the comparison is the after-tax invested balance on each path.
// Ignored: the mortgage-interest deduction (most filers take the standard deduction; IRS Pub 936
// https://www.irs.gov/publications/p936), market swings and sequence risk, PMI, taxes and insurance.

export interface PayoffInvestInput {
  balance: number;
  ratePct: number;
  monthsLeft: number;
  extraPerMonth: number;
  returnPct: number;
  taxOnGainsPct: number;
}

export interface PayoffInvestResult {
  payment: number;
  payoffMonth: number;
  monthsSooner: number;
  interestSaved: number;
  prepayWealth: number;
  investWealth: number;
  /** Positive = investing ends ahead. */
  investMinusPrepay: number;
  breakEvenReturnPct: number | null;
}

function pmt(b: number, r: number, n: number) {
  return r === 0 ? b / n : (b * r) / (1 - Math.pow(1 + r, -n));
}

function simulate(i: PayoffInvestInput, returnPct: number) {
  const n = Math.round(i.monthsLeft);
  const r = i.ratePct / 100 / 12;
  const p = pmt(i.balance, r, n);
  const gm = Math.pow(1 + returnPct / 100, 1 / 12) - 1;
  const extra = Math.max(0, i.extraPerMonth);
  const tax = Math.min(Math.max(0, i.taxOnGainsPct), 100) / 100;
  let bal = i.balance, k = 0, intPre = 0, leftover = 0;
  while (bal > 0.005 && k < n) {
    const it = bal * r; intPre += it;
    const due = bal + it;
    if (p + extra >= due) { leftover = p + extra - due; bal = 0; } // cash left in the payoff month is invested
    else bal = due - (p + extra);
    k++;
  }
  let inv = leftover, contrib = leftover;
  for (let t = 0; t < n - k; t++) { inv = inv * (1 + gm) + p + extra; contrib += p + extra; }
  const prepayWealth = inv - Math.max(0, inv - contrib) * tax;
  let inv2 = 0, c2 = 0;
  for (let t = 0; t < n; t++) { inv2 = inv2 * (1 + gm) + extra; c2 += extra; }
  const investWealth = inv2 - Math.max(0, inv2 - c2) * tax;
  return { p, k, n, interestSaved: p * n - i.balance - intPre, prepayWealth, investWealth };
}

export function computePayoffVsInvest(i: PayoffInvestInput): PayoffInvestResult | null {
  if (!(i.balance > 0) || !(Math.round(i.monthsLeft) > 0) || !(i.ratePct >= 0) || !(i.returnPct > -100)) return null;
  const s = simulate(i, i.returnPct);
  let breakEvenReturnPct: number | null = null;
  if (i.extraPerMonth > 0) {
    let lo = 0, hi = 30;
    for (let it = 0; it < 60; it++) {
      const mid = (lo + hi) / 2;
      const t = simulate(i, mid);
      if (t.investWealth - t.prepayWealth > 0) hi = mid; else lo = mid;
    }
    breakEvenReturnPct = (lo + hi) / 2;
  }
  return {
    payment: s.p, payoffMonth: s.k, monthsSooner: s.n - s.k, interestSaved: s.interestSaved,
    prepayWealth: s.prepayWealth, investWealth: s.investWealth, investMinusPrepay: s.investWealth - s.prepayWealth,
    breakEvenReturnPct,
  };
}
