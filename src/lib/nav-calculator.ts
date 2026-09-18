// Net Asset Value (NAV) per share engine — the same formula the SEC's own investor-education
// glossary publishes for how a mutual fund or ETF share is priced once per trading day:
//
// NAV per share = (total fund assets - total fund liabilities) / total shares outstanding
//
// This engine also reports the fund's total net assets (assets minus liabilities) on its own,
// since that intermediate figure is what a fund's own shareholder report usually shows before
// dividing by shares outstanding. Pure math, ZERO React/DOM/host deps -> build + runtime.

export interface NavInput {
  totalAssets: number;
  totalLiabilities: number;
  sharesOutstanding: number;
}

export interface NavResult {
  netAssets: number | null;
  navPerShare: number | null;
}

const EMPTY: NavResult = { netAssets: null, navPerShare: null };

export function computeNav(input: NavInput): NavResult {
  const totalAssets = Math.max(0, input.totalAssets ?? 0);
  const totalLiabilities = Math.max(0, input.totalLiabilities ?? 0);
  const sharesOutstanding = Math.max(0, input.sharesOutstanding ?? 0);

  if (!(totalAssets > 0) && !(totalLiabilities > 0)) return { ...EMPTY };

  const netAssets = round2(totalAssets - totalLiabilities);
  const navPerShare = sharesOutstanding > 0 ? round4(netAssets / sharesOutstanding) : null;

  return { netAssets, navPerShare };
}

function round2(n: number): number { return Math.round(n * 100) / 100; }
function round4(n: number): number { return Math.round(n * 10000) / 10000; }
