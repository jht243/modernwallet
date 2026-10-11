// Portfolio rebalancing engine — standalone, pure arithmetic. Given what each holding is worth now, a
// target percentage for each, and any new money, it returns the dollar amount to buy (+) or sell (−)
// in each holding so the portfolio lands on target.
//
//   target value_i = target%_i × (current total + new money)
//   trade_i        = target value_i − current value_i
//
// "New money only" mode never sells: it sends the new money to the holdings below target, in
// proportion to how far below target each one is. If the new money is more than enough to reach
// every target, the remainder is split by target percentage. If it is not enough, the portfolio ends
// closer to target but not on it, and the result says so. Taxes and trading costs are not modeled.

export interface Holding {
  label: string;
  value: number;
  targetPct: number;
}

export interface RebalanceInput {
  holdings: Holding[];
  newMoney: number;
  /** true = invest new money only, never sell. */
  noSell: boolean;
}

export interface RebalanceRow {
  label: string;
  value: number;
  currentPct: number;
  targetPct: number;
  /** Dollar amount to buy (positive) or sell (negative). */
  trade: number;
  after: number;
  afterPct: number;
}

export interface RebalanceResult {
  rows: RebalanceRow[];
  currentTotal: number;
  finalTotal: number;
  targetSum: number;
  /** Targets must add to 100 for a meaningful answer. */
  targetsValid: boolean;
  /** No-sell mode: true when the new money reached every target. */
  reachedTarget: boolean;
  totalBuys: number;
  totalSells: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function computeRebalance(input: RebalanceInput): RebalanceResult {
  const hs = input.holdings.map((h) => ({ ...h, value: Math.max(0, h.value || 0), targetPct: Math.max(0, h.targetPct || 0) }));
  const newMoney = Math.max(0, input.newMoney || 0);
  const currentTotal = hs.reduce((s, h) => s + h.value, 0);
  const finalTotal = currentTotal + newMoney;
  const targetSum = hs.reduce((s, h) => s + h.targetPct, 0);
  const targetsValid = Math.abs(targetSum - 100) < 0.01;

  const targetValue = hs.map((h) => (h.targetPct / 100) * finalTotal);
  let trades = hs.map((h, i) => targetValue[i] - h.value);
  let reachedTarget = true;

  if (input.noSell) {
    const deficits = trades.map((t) => Math.max(0, t));
    const deficitSum = deficits.reduce((s, d) => s + d, 0);
    if (deficitSum <= newMoney + 0.005) {
      // fill every gap, then split anything left by target percentage
      const left = newMoney - deficitSum;
      trades = deficits.map((d, i) => d + (targetSum > 0 ? left * (hs[i].targetPct / targetSum) : 0));
      // a holding already above target is not sold, so the portfolio can only land exactly on target
      // when no holding was over target to begin with
      reachedTarget = trades.every((t, i) => Math.abs(hs[i].value + t - targetValue[i]) < 0.5);
    } else {
      trades = deficits.map((d) => (deficitSum > 0 ? newMoney * (d / deficitSum) : 0));
      reachedTarget = false;
    }
  }

  const rows: RebalanceRow[] = hs.map((h, i) => {
    const after = h.value + trades[i];
    return {
      label: h.label,
      value: h.value,
      currentPct: currentTotal > 0 ? (h.value / currentTotal) * 100 : 0,
      targetPct: h.targetPct,
      trade: round2(trades[i]),
      after: round2(after),
      afterPct: finalTotal > 0 ? (after / finalTotal) * 100 : 0,
    };
  });

  return {
    rows,
    currentTotal,
    finalTotal,
    targetSum,
    targetsValid,
    reachedTarget,
    totalBuys: round2(rows.reduce((s, r) => s + Math.max(0, r.trade), 0)),
    totalSells: round2(rows.reduce((s, r) => s + Math.max(0, -r.trade), 0)),
  };
}
