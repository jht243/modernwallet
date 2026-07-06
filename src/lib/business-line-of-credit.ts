// Pure business line of credit (LOC) engine.
//
// A business line of credit is revolving: you draw what you need, pay interest only on the drawn
// balance, and repay over a term (or interest-only during a draw period). This engine models a
// single draw amortized over a repayment term, plus an optional per-draw fee, and reports the
// monthly payment, total interest, and the true APR including the fee. Reuses the shared
// amortization primitives from the auto-loan engine (pure, dependency-free) so it runs at build
// time AND runtime.

import { monthlyPayment as amortizedPayment, amortize, type AmortRow } from "./auto-loan";

export interface LocInput {
  /** Amount drawn from the credit line. */
  drawAmount: number;
  /** Annual percentage rate on the drawn balance. */
  aprPct: number;
  /** Months over which the draw is repaid (amortized). */
  repaymentTermMonths: number;
  /** Optional per-draw fee, as % of the draw (many LOCs charge 1–3% per draw). */
  drawFeePct?: number;
}

export interface LocResult {
  monthlyPayment: number | null; // amortized principal + interest
  totalInterest: number | null;
  drawFee: number | null; // dollars
  totalCost: number | null; // interest + draw fee = cost of the money
  totalRepaid: number | null; // draw + interest + fee
  /** True APR including the draw fee (fee financed alongside the draw). */
  effectiveAprPct: number | null;
  schedule: AmortRow[];
}

const EMPTY: LocResult = {
  monthlyPayment: null,
  totalInterest: null,
  drawFee: null,
  totalCost: null,
  totalRepaid: null,
  effectiveAprPct: null,
  schedule: [],
};

export function computeLoc(input: LocInput): LocResult {
  const draw = input.drawAmount > 0 ? input.drawAmount : null;
  const apr = input.aprPct >= 0 ? input.aprPct : null;
  const term = input.repaymentTermMonths > 0 ? Math.round(input.repaymentTermMonths) : null;
  const drawFeePct = Math.max(0, input.drawFeePct ?? 0);

  if (draw == null || apr == null || term == null) return { ...EMPTY };

  const drawFee = draw * (drawFeePct / 100);
  const pi = amortizedPayment(draw, apr, term);
  const { schedule, totalInterest } = amortize(draw, apr, pi, 0);

  const totalCost = totalInterest + drawFee;
  const totalRepaid = draw + totalInterest + drawFee;

  // APR including the fee: solve the rate that equates the NET cash received (draw − fee) to the
  // same monthly payment stream. Fee raises the effective cost above the nominal APR.
  const effectiveAprPct = locEffectiveApr(draw - drawFee, pi, term);

  return {
    monthlyPayment: round2(pi),
    totalInterest: round2(totalInterest),
    drawFee: round2(drawFee),
    totalCost: round2(totalCost),
    totalRepaid: round2(totalRepaid),
    effectiveAprPct: effectiveAprPct == null ? null : round2(effectiveAprPct),
    schedule,
  };
}

/** Monthly-IRR → APR: solve netReceived = payment × (1 − (1+r)^−n)/r, annualize by ×12×100. */
export function locEffectiveApr(netReceived: number, payment: number, n: number): number | null {
  if (netReceived <= 0 || payment <= 0 || n <= 0) return null;
  if (payment * n <= netReceived) return 0;
  const pv = (r: number) => (r === 0 ? payment * n : (payment * (1 - Math.pow(1 + r, -n))) / r);
  let lo = 0;
  let hi = 2; // 200%/month ceiling
  if (pv(hi) > netReceived) return round2(hi * 12 * 100);
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const val = pv(mid);
    if (Math.abs(val - netReceived) < 1e-7) return round2(mid * 12 * 100);
    if (val > netReceived) lo = mid;
    else hi = mid;
  }
  return round2(((lo + hi) / 2) * 12 * 100);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
