// Short-term interest-only loan cost engine ("hard money") — standalone. Every figure comes from reader inputs.
// No lender rate, point, fee or term is assumed anywhere in this file; defaults used by the page are labelled
// examples and not market data.
//
// Conventions (stated on the page):
//   Loan = purchase advance + rehab advance. Points are a percent of the full loan, paid at closing.
//   Interest is simple, interest-only: loan balance x APR / 12 for each month held, including extension months.
//   Rehab drawn "at closing": the full rehab advance accrues interest from month 1.
//   Rehab drawn "evenly": one equal rehab draw at the start of each month, so month k carries k/N of the rehab advance.
//   Extension fee = a percent of the loan balance, charged once if extension months > 0.
//   Balloon payoff = the full loan balance, due at exit.
//   Loan-to-cost (LTC) = loan / (purchase + rehab). Loan-to-ARV = loan / after-repair value.
//   Simple annualized cost = total financing cost / loan / (months held / 12). Simple, not an IRR.
//   Profit (when ARV is entered) = ARV - selling costs - purchase - rehab - financing cost - holding costs. Pre-tax.

export type DrawMode = "closing" | "even";

export interface HardMoneyInput {
  purchasePrice: number;
  rehabBudget: number;
  /** Percent of purchase price the lender advances (0 to 100). */
  purchaseAdvancePct: number;
  /** Percent of the rehab budget the lender advances (0 to 100). */
  rehabAdvancePct: number;
  aprPct: number;
  pointsPct: number;
  months: number;
  /** Lender, document and other fees paid at closing, in dollars. */
  otherFees: number;
  extensionMonths: number;
  /** Percent of the loan balance charged if the loan is extended. */
  extensionFeePct: number;
  drawMode: DrawMode;
  /** Optional. 0 or blank means not entered. */
  arv: number;
  /** Selling costs as a percent of ARV (optional). */
  sellingCostPct: number;
  /** Holding costs per month other than loan interest, in dollars (optional). */
  monthlyHoldingCost: number;
}

export interface MonthRow {
  month: number;
  balance: number;
  interest: number;
  cumulativeInterest: number;
}

export interface HardMoneyResult {
  valid: boolean;
  purchaseLoan: number;
  rehabLoan: number;
  loan: number;
  downPayment: number;
  rehabOutOfPocket: number;
  points: number;
  otherFees: number;
  /** Down payment plus points plus fees: cash needed at closing before any rehab spending. */
  cashToClose: number;
  /** Monthly interest on the full loan balance. */
  monthlyInterestFull: number;
  totalMonths: number;
  interest: number;
  extensionFee: number;
  extensionInterest: number;
  /** Points + fees + interest + extension fee. */
  totalFinancingCost: number;
  balloon: number;
  ltcPct: number;
  ltarvPct: number | null;
  annualizedCostPct: number;
  sellingCosts: number | null;
  holdingCosts: number;
  profit: number | null;
  months: MonthRow[];
}

const EMPTY: HardMoneyResult = {
  valid: false, purchaseLoan: 0, rehabLoan: 0, loan: 0, downPayment: 0, rehabOutOfPocket: 0, points: 0, otherFees: 0,
  cashToClose: 0, monthlyInterestFull: 0, totalMonths: 0, interest: 0, extensionFee: 0, extensionInterest: 0,
  totalFinancingCost: 0, balloon: 0, ltcPct: 0, ltarvPct: null, annualizedCostPct: 0, sellingCosts: null,
  holdingCosts: 0, profit: null, months: [],
};

const nz = (x: number): number => (Number.isFinite(x) && x > 0 ? x : 0);
const pct = (x: number): number => Math.min(100, nz(x));

export function computeHardMoney(i: HardMoneyInput): HardMoneyResult {
  const purchase = nz(i.purchasePrice);
  const rehab = nz(i.rehabBudget);
  const months = Math.round(nz(i.months));
  const extMonths = Math.round(nz(i.extensionMonths));
  const apr = nz(i.aprPct);
  const purchaseLoan = purchase * pct(i.purchaseAdvancePct) / 100;
  const rehabLoan = rehab * pct(i.rehabAdvancePct) / 100;
  const loan = purchaseLoan + rehabLoan;
  if (!(loan > 0) || !(months > 0)) return EMPTY;

  const totalMonths = months + extMonths;
  const rm = apr / 100 / 12;
  const points = loan * nz(i.pointsPct) / 100;
  const otherFees = nz(i.otherFees);
  const downPayment = purchase - purchaseLoan;
  const rehabOutOfPocket = rehab - rehabLoan;

  const rows: MonthRow[] = [];
  let cumulative = 0;
  let interest = 0;
  let extensionInterest = 0;
  for (let k = 1; k <= totalMonths; k++) {
    const rehabShare = i.drawMode === "even" && k <= months ? rehabLoan * (k / months) : rehabLoan;
    const balance = purchaseLoan + rehabShare;
    const m = balance * rm;
    cumulative += m;
    if (k > months) extensionInterest += m; else interest += m;
    rows.push({ month: k, balance, interest: m, cumulativeInterest: cumulative });
  }
  const extensionFee = extMonths > 0 ? loan * nz(i.extensionFeePct) / 100 : 0;
  const totalInterest = interest + extensionInterest;
  const totalFinancingCost = points + otherFees + totalInterest + extensionFee;
  const arv = nz(i.arv);
  const sellingCosts = arv > 0 ? arv * pct(i.sellingCostPct) / 100 : null;
  const holdingCosts = nz(i.monthlyHoldingCost) * totalMonths;
  const profit = arv > 0 ? arv - (sellingCosts ?? 0) - purchase - rehab - totalFinancingCost - holdingCosts : null;

  return {
    valid: true,
    purchaseLoan, rehabLoan, loan, downPayment, rehabOutOfPocket, points, otherFees,
    cashToClose: downPayment + points + otherFees,
    monthlyInterestFull: loan * rm,
    totalMonths,
    interest: totalInterest - extensionInterest,
    extensionFee, extensionInterest,
    totalFinancingCost,
    balloon: loan,
    ltcPct: purchase + rehab > 0 ? (loan / (purchase + rehab)) * 100 : 0,
    ltarvPct: arv > 0 ? (loan / arv) * 100 : null,
    annualizedCostPct: (totalFinancingCost / loan / (totalMonths / 12)) * 100,
    sellingCosts, holdingCosts, profit, months: rows,
  };
}

export interface SensitivityRow {
  label: string;
  totalFinancingCost: number;
  change: number;
}

const pointsLabel = (p: number): string => `${p} ${p === 1 ? "point" : "points"}`;

/** What moves the total most: months held +/-3, points +/-1, APR +/-2 percentage points. */
export function hardMoneySensitivity(i: HardMoneyInput): SensitivityRow[] {
  const base = computeHardMoney(i).totalFinancingCost;
  const variants: Array<[string, Partial<HardMoneyInput>]> = [
    [`${Math.max(1, i.months - 3)} months held`, { months: Math.max(1, i.months - 3) }],
    [`${i.months + 3} months held`, { months: i.months + 3 }],
    [pointsLabel(Math.max(0, i.pointsPct - 1)), { pointsPct: Math.max(0, i.pointsPct - 1) }],
    [pointsLabel(i.pointsPct + 1), { pointsPct: i.pointsPct + 1 }],
    [`${Math.max(0, i.aprPct - 2)}% APR`, { aprPct: Math.max(0, i.aprPct - 2) }],
    [`${i.aprPct + 2}% APR`, { aprPct: i.aprPct + 2 }],
  ];
  return variants.map(([label, patch]) => {
    const t = computeHardMoney({ ...i, ...patch }).totalFinancingCost;
    return { label, totalFinancingCost: t, change: t - base };
  });
}
