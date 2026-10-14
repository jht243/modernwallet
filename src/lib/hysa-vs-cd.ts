// HYSA vs CD engine — standalone. Grows one deposit in a high-yield savings account (HYSA) and in a
// certificate of deposit (CD) over the same term and compares the interest. Both rates are APYs, so the
// monthly growth factor is (1 + APY)^(1/12) (APY already includes compounding). No deposits after day one.
// Optional: the HYSA rate changes after N months (savings rates are variable; a CD's rate is fixed), and the
// CD is broken early, paying a penalty of N months of interest — the bank sets that number, so it is an input.

export interface HysaVsCdInput {
  deposit: number;
  termMonths: number;
  hysaApyPct: number;
  cdApyPct: number;
  /** HYSA APY after `changeAfterMonths` (0 = the rate never changes). */
  hysaLaterApyPct: number;
  changeAfterMonths: number;
  /** Early-withdrawal penalty in months of CD interest (bank-set; reader input). */
  penaltyMonths: number;
  /** Month the CD is broken (0 = held to maturity). */
  withdrawMonth: number;
}

export interface HysaVsCdResult {
  hysaValue: number;
  hysaInterest: number;
  cdValue: number;
  cdInterest: number;
  /** CD interest minus HYSA interest over the term (negative = the HYSA earns more). */
  cdAdvantage: number;
  /** The HYSA APY after month `changeAfterMonths` that would tie the CD over the term (null when that month is 0 or not inside the term). */
  breakEvenLaterApyPct: number | null;
  /** Early withdrawal at `withdrawMonth` (null when held to maturity). */
  early: null | { month: number; cdValueBeforePenalty: number; penalty: number; cdCashOut: number; hysaValueThen: number };
}

const monthlyFactor = (apyPct: number) => Math.pow(1 + apyPct / 100, 1 / 12);

function hysaValueAt(i: HysaVsCdInput, month: number): number {
  const change = i.hysaLaterApyPct > 0 && i.changeAfterMonths > 0 && i.changeAfterMonths < month;
  const firstMonths = change ? i.changeAfterMonths : month;
  let v = i.deposit * Math.pow(monthlyFactor(i.hysaApyPct), firstMonths);
  if (change) v *= Math.pow(monthlyFactor(i.hysaLaterApyPct), month - i.changeAfterMonths);
  return v;
}

export function computeHysaVsCd(i: HysaVsCdInput): HysaVsCdResult | null {
  const T = Math.round(i.termMonths);
  if (!(i.deposit > 0) || !(T > 0) || i.hysaApyPct < 0 || i.cdApyPct < 0) return null;
  const cdF = monthlyFactor(i.cdApyPct);
  const cdValue = i.deposit * Math.pow(cdF, T);
  const hysaValue = hysaValueAt(i, T);

  let breakEvenLaterApyPct: number | null = null;
  if (i.changeAfterMonths > 0 && i.changeAfterMonths < T) {
    // Solve deposit × hysaF^N × L^(T−N) = cdValue for the monthly factor L, then convert it back to an APY.
    const N = i.changeAfterMonths;
    const L = Math.pow(cdValue / (i.deposit * Math.pow(monthlyFactor(i.hysaApyPct), N)), 1 / (T - N));
    breakEvenLaterApyPct = (Math.pow(L, 12) - 1) * 100;
  }

  let early: HysaVsCdResult["early"] = null;
  const W = Math.round(i.withdrawMonth);
  if (W > 0 && W < T) {
    const before = i.deposit * Math.pow(cdF, W);
    // Penalty = N months of interest at the CD rate on the deposit (the common way banks state it).
    const penalty = i.deposit * (cdF - 1) * Math.max(0, i.penaltyMonths);
    early = { month: W, cdValueBeforePenalty: before, penalty, cdCashOut: before - penalty, hysaValueThen: hysaValueAt(i, W) };
  }

  return {
    hysaValue, hysaInterest: hysaValue - i.deposit,
    cdValue, cdInterest: cdValue - i.deposit,
    cdAdvantage: cdValue - hysaValue,
    breakEvenLaterApyPct, early,
  };
}
