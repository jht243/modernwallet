// Pure net-worth engine for WealthCheck.
//
// No source repo existed for this calculator (the ChatGPT app's code is gone), so it is a
// clean-room build from the standard definition: net worth = total assets − total liabilities.
// The differentiator is the age benchmark, using published Federal Reserve Survey of Consumer
// Finances (SCF, 2022) MEDIAN net worth by age of household head. Content cites the Fed source and
// notes these are medians (means are far higher because wealth is skewed).
// ZERO React/DOM/host deps → build + runtime.

export interface NetWorthInput {
  // Assets
  cash?: number; // checking, savings, money market
  investments?: number; // taxable brokerage, stocks, bonds
  retirement?: number; // 401(k), IRA, pensions
  realEstate?: number; // home + other property (market value)
  vehicles?: number;
  otherAssets?: number; // business, collectibles, etc.
  // Liabilities
  mortgage?: number;
  autoLoans?: number;
  studentLoans?: number;
  creditCards?: number;
  otherDebt?: number;
  // Optional, for the age benchmark
  age?: number;
}

export interface LineItem {
  key: string;
  label: string;
  amount: number;
  pct: number; // share of its side (assets or liabilities)
}

export interface NetWorthResult {
  totalAssets: number | null;
  totalLiabilities: number | null;
  netWorth: number | null;
  /** Liquid net worth = liquid assets (cash + taxable investments) − total liabilities. */
  liquidNetWorth: number | null;
  liquidAssets: number | null;
  debtToAssetPct: number | null;
  assetBreakdown: LineItem[];
  liabilityBreakdown: LineItem[];
  // Age benchmark (only when a valid age is supplied) ----
  ageBracket: string | null;
  medianNetWorthForAge: number | null;
  vsMedian: number | null; // netWorth − median (positive = above median)
  aboveMedian: boolean | null;
}

// 2022 SCF median net worth by age of household head (USD), Federal Reserve.
const MEDIAN_BY_AGE: { bracket: string; min: number; max: number; median: number }[] = [
  { bracket: "Under 35", min: 0, max: 34, median: 39000 },
  { bracket: "35–44", min: 35, max: 44, median: 135600 },
  { bracket: "45–54", min: 45, max: 54, median: 247200 },
  { bracket: "55–64", min: 55, max: 64, median: 364500 },
  { bracket: "65–74", min: 65, max: 74, median: 409900 },
  { bracket: "75 or older", min: 75, max: 200, median: 335600 },
];

export function medianNetWorthForAge(age: number): { bracket: string; median: number } | null {
  if (!(age > 0)) return null;
  const row = MEDIAN_BY_AGE.find((r) => age >= r.min && age <= r.max);
  return row ? { bracket: row.bracket, median: row.median } : null;
}

const ASSET_FIELDS: { key: keyof NetWorthInput; label: string; liquid: boolean }[] = [
  { key: "cash", label: "Cash & savings", liquid: true },
  { key: "investments", label: "Investments", liquid: true },
  { key: "retirement", label: "Retirement accounts", liquid: false },
  { key: "realEstate", label: "Real estate", liquid: false },
  { key: "vehicles", label: "Vehicles", liquid: false },
  { key: "otherAssets", label: "Other assets", liquid: false },
];

const LIABILITY_FIELDS: { key: keyof NetWorthInput; label: string }[] = [
  { key: "mortgage", label: "Mortgage" },
  { key: "autoLoans", label: "Auto loans" },
  { key: "studentLoans", label: "Student loans" },
  { key: "creditCards", label: "Credit cards" },
  { key: "otherDebt", label: "Other debt" },
];

export function computeNetWorth(input: NetWorthInput): NetWorthResult {
  const val = (k: keyof NetWorthInput) => Math.max(0, Number(input[k]) || 0);

  const totalAssets = ASSET_FIELDS.reduce((s, f) => s + val(f.key), 0);
  const liquidAssets = ASSET_FIELDS.filter((f) => f.liquid).reduce((s, f) => s + val(f.key), 0);
  const totalLiabilities = LIABILITY_FIELDS.reduce((s, f) => s + val(f.key), 0);
  const netWorth = totalAssets - totalLiabilities;
  const liquidNetWorth = liquidAssets - totalLiabilities;

  const assetBreakdown: LineItem[] = ASSET_FIELDS
    .filter((f) => val(f.key) > 0)
    .map((f) => ({ key: String(f.key), label: f.label, amount: round2(val(f.key)), pct: totalAssets > 0 ? round2((val(f.key) / totalAssets) * 100) : 0 }));
  const liabilityBreakdown: LineItem[] = LIABILITY_FIELDS
    .filter((f) => val(f.key) > 0)
    .map((f) => ({ key: String(f.key), label: f.label, amount: round2(val(f.key)), pct: totalLiabilities > 0 ? round2((val(f.key) / totalLiabilities) * 100) : 0 }));

  const benchmark = input.age ? medianNetWorthForAge(input.age) : null;

  return {
    totalAssets: round2(totalAssets),
    totalLiabilities: round2(totalLiabilities),
    netWorth: round2(netWorth),
    liquidNetWorth: round2(liquidNetWorth),
    liquidAssets: round2(liquidAssets),
    debtToAssetPct: totalAssets > 0 ? round2((totalLiabilities / totalAssets) * 100) : null,
    assetBreakdown,
    liabilityBreakdown,
    ageBracket: benchmark ? benchmark.bracket : null,
    medianNetWorthForAge: benchmark ? benchmark.median : null,
    vsMedian: benchmark ? round2(netWorth - benchmark.median) : null,
    aboveMedian: benchmark ? netWorth >= benchmark.median : null,
  };
}

function round2(n: number): number { return Math.round(n * 100) / 100; }
