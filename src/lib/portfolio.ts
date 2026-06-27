// Pure portfolio / asset-allocation engine (Modern Portfolio Theory basics).
//
// Source: jht243/portfolio-optimizer. The repo's server.ts only had a risk-tier → fixed-return
// projection; the real per-asset weighting + volatility + Sharpe were client-side, so they're
// rebuilt here from standard formulas with documented long-run asset-class assumptions.
// ZERO React/DOM/host deps → build + runtime.
//
// ASSUMPTIONS (long-run historical estimates, nominal — these are model inputs, not guarantees;
// the page content says so and cites sources):
//   Stocks 10% return / 16% volatility · Bonds 4% / 5% · Real estate 8% / 15% · Cash 2.5% / 1%.
//   Risk-free rate 2.5%. Correlations approximate historical relationships.

export type AssetKey = "stocks" | "bonds" | "realEstate" | "cash";

export const ASSETS: Record<AssetKey, { label: string; expectedReturn: number; volatility: number }> = {
  stocks: { label: "Stocks", expectedReturn: 0.10, volatility: 0.16 },
  bonds: { label: "Bonds", expectedReturn: 0.04, volatility: 0.05 },
  realEstate: { label: "Real estate", expectedReturn: 0.08, volatility: 0.15 },
  cash: { label: "Cash", expectedReturn: 0.025, volatility: 0.01 },
};

export const RISK_FREE_RATE = 0.025;

const CORRELATION: Record<AssetKey, Record<AssetKey, number>> = {
  stocks: { stocks: 1, bonds: 0.1, realEstate: 0.6, cash: 0 },
  bonds: { stocks: 0.1, bonds: 1, realEstate: 0.2, cash: 0.2 },
  realEstate: { stocks: 0.6, bonds: 0.2, realEstate: 1, cash: 0 },
  cash: { stocks: 0, bonds: 0.2, realEstate: 0, cash: 1 },
};

const KEYS: AssetKey[] = ["stocks", "bonds", "realEstate", "cash"];

export interface PortfolioInput {
  stocks: number; // dollar amounts
  bonds: number;
  realEstate?: number;
  cash: number;
  monthlyContribution?: number;
  years?: number;
}

export interface AllocationSlice {
  key: AssetKey;
  label: string;
  amount: number;
  weightPct: number;
}

export interface PortfolioYear {
  year: number;
  balance: number;
}

export interface PortfolioResult {
  total: number | null;
  allocation: AllocationSlice[];
  expectedReturnPct: number | null; // weighted annual expected return
  volatilityPct: number | null; // portfolio standard deviation
  sharpeRatio: number | null;
  // a "likely 1-year range" = expected return ± 1 standard deviation, in dollars on the total
  oneYearBest: number | null;
  oneYearWorst: number | null;
  // growth projection at the expected return
  projectedValue: number | null;
  totalContributions: number | null;
  projectedGrowth: number | null;
  schedule: PortfolioYear[];
}

const EMPTY: PortfolioResult = {
  total: null, allocation: [], expectedReturnPct: null, volatilityPct: null, sharpeRatio: null,
  oneYearBest: null, oneYearWorst: null, projectedValue: null, totalContributions: null,
  projectedGrowth: null, schedule: [],
};

export function computePortfolio(input: PortfolioInput): PortfolioResult {
  const amounts: Record<AssetKey, number> = {
    stocks: Math.max(0, input.stocks ?? 0),
    bonds: Math.max(0, input.bonds ?? 0),
    realEstate: Math.max(0, input.realEstate ?? 0),
    cash: Math.max(0, input.cash ?? 0),
  };
  const total = KEYS.reduce((s, k) => s + amounts[k], 0);
  if (total <= 0) return { ...EMPTY };

  const weights: Record<AssetKey, number> = {
    stocks: amounts.stocks / total,
    bonds: amounts.bonds / total,
    realEstate: amounts.realEstate / total,
    cash: amounts.cash / total,
  };

  // Weighted expected return.
  const expectedReturn = KEYS.reduce((s, k) => s + weights[k] * ASSETS[k].expectedReturn, 0);

  // Portfolio variance = ΣΣ w_i w_j σ_i σ_j ρ_ij.
  let variance = 0;
  for (const i of KEYS) {
    for (const j of KEYS) {
      variance += weights[i] * weights[j] * ASSETS[i].volatility * ASSETS[j].volatility * CORRELATION[i][j];
    }
  }
  const volatility = Math.sqrt(Math.max(0, variance));
  const sharpe = volatility > 0 ? (expectedReturn - RISK_FREE_RATE) / volatility : null;

  // Growth projection at the expected return.
  const years = Math.max(0, Math.round(input.years ?? 20));
  const annualContribution = Math.max(0, input.monthlyContribution ?? 0) * 12;
  const schedule: PortfolioYear[] = [];
  let balance = total;
  for (let y = 1; y <= years; y++) {
    balance = balance * (1 + expectedReturn) + annualContribution;
    schedule.push({ year: y, balance: round2(balance) });
  }
  const projectedValue = years > 0 ? balance : total;
  const totalContributions = total + annualContribution * years;

  const allocation: AllocationSlice[] = KEYS
    .filter((k) => amounts[k] > 0)
    .map((k) => ({ key: k, label: ASSETS[k].label, amount: round2(amounts[k]), weightPct: round2(weights[k] * 100) }));

  return {
    total: round2(total),
    allocation,
    expectedReturnPct: round2(expectedReturn * 100),
    volatilityPct: round2(volatility * 100),
    sharpeRatio: sharpe == null ? null : round2(sharpe),
    oneYearBest: round2(total * (1 + expectedReturn + volatility)),
    oneYearWorst: round2(total * (1 + expectedReturn - volatility)),
    projectedValue: round2(projectedValue),
    totalContributions: round2(totalContributions),
    projectedGrowth: round2(projectedValue - totalContributions),
    schedule,
  };
}

function round2(n: number): number { return Math.round(n * 100) / 100; }
