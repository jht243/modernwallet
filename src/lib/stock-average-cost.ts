// Average cost basis engine — combines up to 4 separate buy lots (shares + price per lot, plus
// an optional flat commission charged per trade) into one blended (weighted-average) cost basis
// per share. This is the number a brokerage statement calls your "average cost" and the number
// you subtract from a later sale price to find your capital gain or loss per share.
//
// averageCostPerShare = totalCost / totalShares, where totalCost includes every lot's
// (shares * price) PLUS that lot's commission if one was paid. Pure math, ZERO React/DOM/host
// deps -> build + runtime.

export interface StockLot {
  shares: number;
  price: number;
}

export interface StockAverageCostInput {
  lots: StockLot[];
  commissionPerTrade: number;
}

export interface StockAverageCostResult {
  totalShares: number;
  totalCost: number;
  totalCommissions: number;
  averageCostPerShare: number | null;
  lotCount: number;
}

const EMPTY: StockAverageCostResult = {
  totalShares: 0, totalCost: 0, totalCommissions: 0, averageCostPerShare: null, lotCount: 0,
};

export function computeStockAverageCost(input: StockAverageCostInput): StockAverageCostResult {
  const commission = Math.max(0, input.commissionPerTrade ?? 0);
  const activeLots = (input.lots ?? []).filter((l) => (l.shares ?? 0) > 0 && (l.price ?? 0) >= 0);

  if (activeLots.length === 0) return { ...EMPTY };

  let totalShares = 0;
  let totalCost = 0;
  for (const lot of activeLots) {
    const shares = Math.max(0, lot.shares ?? 0);
    const price = Math.max(0, lot.price ?? 0);
    totalShares += shares;
    totalCost += shares * price + commission;
  }
  const totalCommissions = commission * activeLots.length;

  if (!(totalShares > 0)) return { ...EMPTY };

  return {
    totalShares: round4(totalShares),
    totalCost: round2(totalCost),
    totalCommissions: round2(totalCommissions),
    averageCostPerShare: round4(totalCost / totalShares),
    lotCount: activeLots.length,
  };
}

function round2(n: number): number { return Math.round(n * 100) / 100; }
function round4(n: number): number { return Math.round(n * 10000) / 10000; }
