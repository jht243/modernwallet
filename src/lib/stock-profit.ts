// Stock buy/sell profit-and-loss engine — the net dollar profit or loss, the return percentage,
// and the break-even sale price for a single round-trip trade (one buy, one sell), accounting for
// commission on both legs. This is the number a broker's own trade confirmation shows as "realized
// gain/loss", computed transparently so a reader can see exactly where each dollar went.
//
// netCost      = shares * buyPrice + buyCommission
// netProceeds  = shares * sellPrice - sellCommission
// profit       = netProceeds - netCost
// returnPct    = profit / netCost * 100
// breakEvenPrice = the sale price per share that would make netProceeds == netCost, i.e. the price
//                  at which the trade neither gains nor loses money after both commissions.
// Pure math, ZERO React/DOM/host deps -> build + runtime.

export interface StockProfitInput {
  shares: number;
  buyPrice: number;
  buyCommission: number;
  sellPrice: number;
  sellCommission: number;
}

export interface StockProfitResult {
  netCost: number | null;
  netProceeds: number | null;
  profit: number | null;
  returnPct: number | null;
  breakEvenPrice: number | null;
}

const EMPTY: StockProfitResult = {
  netCost: null, netProceeds: null, profit: null, returnPct: null, breakEvenPrice: null,
};

export function computeStockProfit(input: StockProfitInput): StockProfitResult {
  const shares = Math.max(0, input.shares ?? 0);
  const buyPrice = Math.max(0, input.buyPrice ?? 0);
  const buyCommission = Math.max(0, input.buyCommission ?? 0);
  const sellPrice = Math.max(0, input.sellPrice ?? 0);
  const sellCommission = Math.max(0, input.sellCommission ?? 0);

  if (!(shares > 0)) return { ...EMPTY };

  const netCost = round2(shares * buyPrice + buyCommission);
  const netProceeds = round2(shares * sellPrice - sellCommission);
  const profit = round2(netProceeds - netCost);
  const returnPct = netCost > 0 ? round4((profit / netCost) * 100) : null;
  const breakEvenPrice = round4((netCost + sellCommission) / shares);

  return { netCost, netProceeds, profit, returnPct, breakEvenPrice };
}

function round2(n: number): number { return Math.round(n * 100) / 100; }
function round4(n: number): number { return Math.round(n * 10000) / 10000; }
