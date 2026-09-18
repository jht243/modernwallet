// Stock split adjustment engine — given a share count, a per-share price, and a per-share cost
// basis BEFORE a split, computes the post-split share count and the split-adjusted price and cost
// basis per share. A split (or reverse split) changes how many shares you hold and what each one
// is worth, but never changes the total dollar value of the position or your total cost basis —
// this engine makes that invariant explicit so the result is easy to sanity-check.
//
// ratio = splitFromRatio / splitToRatio (e.g. a 2-for-1 split: from=2, to=1, ratio=2 -> shares
// double, price and per-share cost basis are cut in half). A REVERSE split uses from < to (e.g. a
// 1-for-10 reverse split: from=1, to=10, ratio=0.1 -> shares shrink to 1/10th, price and per-share
// cost basis multiply by 10). Pure math, ZERO React/DOM/host deps -> build + runtime.

export interface StockSplitInput {
  shares: number;
  pricePerShare: number;
  costBasisPerShare: number;
  splitFromRatio: number;
  splitToRatio: number;
}

export interface StockSplitResult {
  ratio: number | null;
  newShares: number | null;
  newPricePerShare: number | null;
  newCostBasisPerShare: number | null;
  totalValueBefore: number | null;
  totalValueAfter: number | null;
  totalCostBasisBefore: number | null;
  totalCostBasisAfter: number | null;
}

const EMPTY: StockSplitResult = {
  ratio: null, newShares: null, newPricePerShare: null, newCostBasisPerShare: null,
  totalValueBefore: null, totalValueAfter: null, totalCostBasisBefore: null, totalCostBasisAfter: null,
};

export function computeStockSplit(input: StockSplitInput): StockSplitResult {
  const shares = Math.max(0, input.shares ?? 0);
  const price = Math.max(0, input.pricePerShare ?? 0);
  const costBasis = Math.max(0, input.costBasisPerShare ?? 0);
  const from = input.splitFromRatio ?? 0;
  const to = input.splitToRatio ?? 0;

  if (!(shares > 0) || !(from > 0) || !(to > 0)) return { ...EMPTY };

  const ratio = round6(from / to);
  const newShares = round4(shares * ratio);
  const newPricePerShare = ratio > 0 ? round4(price / ratio) : null;
  const newCostBasisPerShare = ratio > 0 ? round4(costBasis / ratio) : null;
  const totalValueBefore = round2(shares * price);
  const totalValueAfter = newPricePerShare !== null ? round2(newShares * newPricePerShare) : null;
  const totalCostBasisBefore = round2(shares * costBasis);
  const totalCostBasisAfter = newCostBasisPerShare !== null ? round2(newShares * newCostBasisPerShare) : null;

  return { ratio, newShares, newPricePerShare, newCostBasisPerShare, totalValueBefore, totalValueAfter, totalCostBasisBefore, totalCostBasisAfter };
}

function round2(n: number): number { return Math.round(n * 100) / 100; }
function round4(n: number): number { return Math.round(n * 10000) / 10000; }
function round6(n: number): number { return Math.round(n * 1000000) / 1000000; }
