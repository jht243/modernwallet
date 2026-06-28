// Pure budgeting engine — the 50/30/20 rule + a zero-based ("every dollar a job") view.
//   computeBudget() — take-home income + spending by line → bucket targets, actuals, variance,
//                     leftover-to-assign, and savings rate.
// The 50/30/20 split (needs 50% / wants 30% / savings+debt 20%) comes from Sen. Elizabeth Warren &
// Amelia Warren Tyagi, "All Your Worth" (2005); see NerdWallet and Ramsey for the modern category
// definitions. ZERO React/DOM deps → safe at build time (stat injection) and runtime (island).

export type BudgetMode = "50-30-20" | "zero-based";
export type Bucket = "needs" | "wants" | "savings";

export interface BudgetLine {
  key: string;
  label: string;
  bucket: Bucket;
}

// The default line items, grouped by bucket. Needs = can't-skip costs (incl. minimum debt payments);
// Wants = lifestyle; Savings = saving + investing + EXTRA debt payoff above the minimum.
export const BUDGET_LINES: BudgetLine[] = [
  { key: "housing", label: "Housing (rent/mortgage)", bucket: "needs" },
  { key: "utilities", label: "Utilities", bucket: "needs" },
  { key: "groceries", label: "Groceries", bucket: "needs" },
  { key: "transportation", label: "Transportation", bucket: "needs" },
  { key: "insurance", label: "Insurance", bucket: "needs" },
  { key: "minimumDebt", label: "Minimum debt payments", bucket: "needs" },
  { key: "dining", label: "Dining & takeout", bucket: "wants" },
  { key: "entertainment", label: "Entertainment & subscriptions", bucket: "wants" },
  { key: "shopping", label: "Shopping & personal", bucket: "wants" },
  { key: "funMisc", label: "Travel, hobbies & other", bucket: "wants" },
  { key: "emergencyFund", label: "Emergency fund", bucket: "savings" },
  { key: "retirement", label: "Retirement & investing", bucket: "savings" },
  { key: "extraDebt", label: "Extra debt payoff", bucket: "savings" },
];

// The 50/30/20 target share of take-home income for each bucket.
export const TARGET_SHARE: Record<Bucket, number> = { needs: 0.5, wants: 0.3, savings: 0.2 };

export const BUCKET_LABEL: Record<Bucket, string> = {
  needs: "Needs",
  wants: "Wants",
  savings: "Savings & debt payoff",
};

export interface BudgetInput {
  monthlyIncome: number; // take-home (after-tax) pay per month
  amounts: Record<string, number>; // keyed by BudgetLine.key
}

export interface BucketResult {
  bucket: Bucket;
  actual: number; // dollars spent/allocated in this bucket
  target: number; // 50/30/20 dollar target for this bucket
  actualPct: number | null; // actual as a % of income
  variance: number; // actual − target (>0 = over target, <0 = under)
}

export interface BudgetResult {
  income: number;
  totalSpending: number; // sum of every line
  leftover: number; // income − totalSpending (the zero-based "to assign" number)
  buckets: BucketResult[]; // needs, wants, savings (always in that order)
  savingsRate: number | null; // savings bucket as a % of income
  status: "surplus" | "balanced" | "over"; // headline verdict
}

export function computeBudget(input: BudgetInput): BudgetResult {
  const income = Math.max(0, input.monthlyIncome || 0);
  const amounts = input.amounts ?? {};

  const sumBucket = (b: Bucket) =>
    BUDGET_LINES.filter((l) => l.bucket === b).reduce((s, l) => s + Math.max(0, amounts[l.key] || 0), 0);

  const buckets: BucketResult[] = (["needs", "wants", "savings"] as Bucket[]).map((b) => {
    const actual = round2(sumBucket(b));
    const target = round2(income * TARGET_SHARE[b]);
    return {
      bucket: b,
      actual,
      target,
      actualPct: income > 0 ? round2((actual / income) * 100) : null,
      variance: round2(actual - target),
    };
  });

  const totalSpending = round2(buckets.reduce((s, b) => s + b.actual, 0));
  const leftover = round2(income - totalSpending);
  const savingsActual = buckets.find((b) => b.bucket === "savings")!.actual;

  // "balanced" if within $5 of zero — a zero-based budget is meant to land on zero.
  const status: BudgetResult["status"] = leftover > 5 ? "surplus" : leftover < -5 ? "over" : "balanced";

  return {
    income,
    totalSpending,
    leftover,
    buckets,
    savingsRate: income > 0 ? round2((savingsActual / income) * 100) : null,
    status,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
