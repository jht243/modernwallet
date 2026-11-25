// Debt payoff engine — standalone. Runs the same set of debts three ways month by month:
//   1. avalanche  — extra money goes to the highest APR first
//   2. snowball   — extra money goes to the smallest balance first
//   3. minimums   — only each debt's minimum payment, no extra, no rollover, no lump sum
//
// Method sources: the CFPB's "How to reduce your debt" describes both orderings (highest interest
// rate first, smallest balance first): https://www.consumerfinance.gov/about-us/blog/how-reduce-your-debt
// Every balance, rate, minimum, extra amount and lump sum is a reader input. Nothing here assumes a market rate.
//
// Monthly loop (the same order for all three strategies):
//   1. interest = balance x APR / 12 is added to each open debt
//   2. each open debt receives its minimum payment (capped at what it owes)
//   3. the budget left over (extra + minimums freed by debts already paid off) goes to the target debt,
//      spilling to the next debt in order when the target is cleared
//   4. a lump sum, if entered, is added to the budget of month 1 only
// The monthly budget equals the sum of every ORIGINAL minimum plus the extra, so a freed minimum rolls over.
// Order is fixed from the starting balances and rates.

export interface DebtRow {
  name?: string;
  balance: number;
  aprPct: number;
  minPayment: number;
}

export interface DebtPayoffInput {
  debts: DebtRow[];
  /** Extra money per month beyond all minimums. */
  extraMonthly: number;
  /** One-time amount applied in month 1. */
  lumpSum: number;
}

export type StrategyId = "avalanche" | "snowball" | "minimums";

export interface StrategyResult {
  id: StrategyId;
  /** Months until every debt is zero; null when some debt is not cleared within MAX_MONTHS. */
  months: number | null;
  totalInterest: number | null;
  totalPaid: number | null;
  /** Debt indexes (into the input list of open debts) in the order they reach zero. */
  payoffOrder: number[];
  /** Month each debt reaches zero, same indexes as the open-debt list; null if never. */
  payoffMonth: (number | null)[];
  /** Total balance at the end of each month (index 0 = starting balance). */
  balanceByMonth: number[];
  /** Each open debt's balance at the end of each month (index 0 = starting balances). */
  debtBalanceByMonth: number[][];
  /** True when at least one debt is not cleared within MAX_MONTHS. */
  notCleared: boolean;
}

export interface DebtPayoffResult {
  debts: DebtRow[];
  totalBalance: number;
  totalMinimums: number;
  avalanche: StrategyResult;
  snowball: StrategyResult;
  minimums: StrategyResult;
  /** Interest snowball costs over avalanche (>= 0 unless rates tie). Null when either does not clear. */
  snowballExtraInterest: number | null;
  /** Months avalanche finishes before snowball; can be negative. Null when either does not clear. */
  avalancheMonthsSooner: number | null;
  /** True when every open debt has the same APR, so the two orders cost the same interest. */
  ratesTie: boolean;
  /** True when avalanche and snowball pick the same payoff order. */
  sameOrder: boolean;
  /** Input problems the reader can fix. */
  warnings: string[];
}

export const MAX_MONTHS = 600; // 50 years: well past any real payoff; guards infinite loops
const EPS = 0.005;

function openDebts(debts: DebtRow[]): DebtRow[] {
  return debts
    .filter((d) => d.balance > 0)
    .map((d) => ({ name: d.name, balance: d.balance, aprPct: Math.max(0, d.aprPct), minPayment: Math.max(0, d.minPayment) }));
}

function orderFor(id: StrategyId, debts: DebtRow[]): number[] {
  const idx = debts.map((_, i) => i);
  if (id === "avalanche") {
    // highest APR first; on a tie, the smaller balance first
    idx.sort((a, b) => debts[b].aprPct - debts[a].aprPct || debts[a].balance - debts[b].balance || a - b);
  } else if (id === "snowball") {
    // smallest balance first; on a tie, the higher APR first
    idx.sort((a, b) => debts[a].balance - debts[b].balance || debts[b].aprPct - debts[a].aprPct || a - b);
  }
  return idx;
}

function simulate(id: StrategyId, debts: DebtRow[], extraMonthly: number, lumpSum: number): StrategyResult {
  const n = debts.length;
  const bal = debts.map((d) => d.balance);
  const order = orderFor(id, debts);
  const payoffMonth: (number | null)[] = debts.map(() => null);
  const payoffOrder: number[] = [];
  const startTotal = bal.reduce((s, b) => s + b, 0);
  const balanceByMonth = [startTotal];
  const debtBalanceByMonth: number[][] = [bal.slice()];
  const minimumsTotal = debts.reduce((s, d) => s + d.minPayment, 0);
  const extra = id === "minimums" ? 0 : Math.max(0, extraMonthly);
  const lump = id === "minimums" ? 0 : Math.max(0, lumpSum);
  let interestTotal = 0;
  let paidTotal = 0;
  let month = 0;

  while (month < MAX_MONTHS && bal.some((b) => b > EPS)) {
    month++;
    // 1. interest
    for (let i = 0; i < n; i++) {
      if (bal[i] > EPS) {
        const it = (bal[i] * debts[i].aprPct) / 100 / 12;
        bal[i] += it;
        interestTotal += it;
      }
    }
    // 2. minimums on open debts; under "minimums" the freed minimum is not rolled over
    let budget = id === "minimums" ? 0 : minimumsTotal + extra + (month === 1 ? lump : 0);
    for (let i = 0; i < n; i++) {
      if (bal[i] > EPS) {
        const pay = Math.min(debts[i].minPayment, bal[i]);
        bal[i] -= pay;
        paidTotal += pay;
        if (id !== "minimums") budget -= pay;
      }
    }
    // 3. leftover budget goes to the target debt, then spills down the order
    if (id !== "minimums") {
      for (const i of order) {
        if (budget <= EPS) break;
        if (bal[i] > EPS) {
          const pay = Math.min(budget, bal[i]);
          bal[i] -= pay;
          paidTotal += pay;
          budget -= pay;
        }
      }
    }
    for (const i of order) {
      if (bal[i] <= EPS && payoffMonth[i] === null) {
        bal[i] = 0;
        payoffMonth[i] = month;
        payoffOrder.push(i);
      }
    }
    balanceByMonth.push(bal.reduce((s, b) => s + b, 0));
    debtBalanceByMonth.push(bal.slice());
  }
  const notCleared = bal.some((b) => b > EPS);
  return {
    id,
    months: notCleared ? null : month,
    totalInterest: notCleared ? null : interestTotal,
    totalPaid: notCleared ? null : paidTotal,
    payoffOrder,
    payoffMonth,
    balanceByMonth,
    debtBalanceByMonth,
    notCleared,
  };
}

export function computeDebtPayoff(input: DebtPayoffInput): DebtPayoffResult {
  const debts = openDebts(input.debts);
  const totalBalance = debts.reduce((s, d) => s + d.balance, 0);
  const totalMinimums = debts.reduce((s, d) => s + d.minPayment, 0);
  const warnings: string[] = [];
  debts.forEach((d, i) => {
    const interest = (d.balance * d.aprPct) / 100 / 12;
    if (d.minPayment <= interest + EPS) {
      warnings.push(`Debt ${i + 1}: the minimum payment does not cover a month of interest (about $${interest.toFixed(2)}).`);
    }
  });
  const avalanche = simulate("avalanche", debts, input.extraMonthly, input.lumpSum);
  const snowball = simulate("snowball", debts, input.extraMonthly, input.lumpSum);
  const minimums = simulate("minimums", debts, input.extraMonthly, input.lumpSum);
  const both = avalanche.months != null && snowball.months != null;
  const rates = debts.map((d) => d.aprPct);
  const ratesTie = rates.length > 0 && rates.every((r) => Math.abs(r - rates[0]) < 1e-9);
  return {
    debts,
    totalBalance,
    totalMinimums,
    avalanche,
    snowball,
    minimums,
    snowballExtraInterest: both ? (snowball.totalInterest as number) - (avalanche.totalInterest as number) : null,
    avalancheMonthsSooner: both ? (snowball.months as number) - (avalanche.months as number) : null,
    ratesTie,
    sameOrder: avalanche.payoffOrder.join(",") === snowball.payoffOrder.join(","),
    warnings,
  };
}

/** Calendar label for a payoff `months` after `from` (the first payment lands next month). */
export function payoffDateLabel(months: number, from: Date = new Date()): string {
  const d = new Date(from.getFullYear(), from.getMonth() + months, 1);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
