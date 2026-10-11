// Expense ratio engine — standalone. An expense ratio is an annual percentage of assets taken out of a
// fund. This engine subtracts it from an assumed gross annual return (net = gross - ratio), compounds
// the net return monthly, and adds a fixed contribution at the end of each month. Every figure,
// including the gross return, is a reader input; no fund's real ratio or return is built in.

export interface ExpenseRatioInput {
  startBalance: number;
  monthlyContribution: number;
  years: number;
  /** Assumed gross annual return before fund costs, in percent. */
  grossReturnPct: number;
  /** Annual expense ratio of fund A, in percent. */
  ratioAPct: number;
  /** Annual expense ratio of fund B, in percent. */
  ratioBPct: number;
}

export interface ExpenseRatioResult {
  /** Ending balance with no fund cost at all (the benchmark). */
  noFeeBalance: number;
  balanceA: number;
  balanceB: number;
  /** Dollars of growth lost to fund A's ratio versus no fee. */
  costA: number;
  costB: number;
  /** Fund A ending balance minus fund B ending balance (positive when A ends higher). */
  differenceAB: number;
  totalContributed: number;
}

function endBalance(input: ExpenseRatioInput, ratioPct: number): number {
  const net = (input.grossReturnPct - ratioPct) / 100;
  const r = Math.pow(1 + net, 1 / 12) - 1;
  const months = Math.round(Math.max(input.years, 0) * 12);
  let bal = input.startBalance;
  for (let m = 1; m <= months; m++) bal = bal * (1 + r) + input.monthlyContribution;
  return bal;
}

export function computeExpenseRatio(input: ExpenseRatioInput): ExpenseRatioResult {
  const noFeeBalance = endBalance(input, 0);
  const balanceA = endBalance(input, input.ratioAPct);
  const balanceB = endBalance(input, input.ratioBPct);
  const months = Math.round(Math.max(input.years, 0) * 12);
  return {
    noFeeBalance,
    balanceA,
    balanceB,
    costA: noFeeBalance - balanceA,
    costB: noFeeBalance - balanceB,
    differenceAB: balanceA - balanceB,
    totalContributed: input.startBalance + input.monthlyContribution * months,
  };
}
