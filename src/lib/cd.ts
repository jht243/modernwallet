// CD engine — standalone. A certificate of deposit is quoted by its APY (annual percentage yield),
// which already folds compounding in, so the ending balance is deposit x (1 + APY) ^ years. The tool
// also shows interest after tax and what an early withdrawal costs when the bank charges a penalty
// of a set number of months of interest.
//
// Every rate, term, tax rate and penalty length is a user input. Nothing here assumes a market rate
// or a bank's penalty schedule.

export interface CdInput {
  deposit: number;
  /** Annual percentage yield, in percent. */
  apyPct: number;
  termMonths: number;
  /** Marginal tax rate on the interest, in percent (0 to skip). */
  taxRatePct: number;
  /** Early-withdrawal penalty, in months of interest on the deposit at the APY. */
  penaltyMonths: number;
  /** Month the money would be pulled out early (0 or at/after the term = no early withdrawal). */
  withdrawMonth: number;
}

export interface CdResult {
  endingBalance: number;
  interestEarned: number;
  /** Interest left after the tax rate is applied. */
  interestAfterTax: number;
  /** Effective growth over the term, in percent. */
  totalReturnPct: number;
  avgMonthlyInterest: number;
  /** Interest accrued at the early-withdrawal month, before the penalty. */
  earlyInterest: number | null;
  penaltyAmount: number | null;
  /** Balance received after the penalty if withdrawn early. */
  earlyNetBalance: number | null;
  /** Net gain or loss against the deposit if withdrawn early. */
  earlyNetGain: number | null;
}

const EMPTY: CdResult = {
  endingBalance: 0, interestEarned: 0, interestAfterTax: 0, totalReturnPct: 0, avgMonthlyInterest: 0,
  earlyInterest: null, penaltyAmount: null, earlyNetBalance: null, earlyNetGain: null,
};

export function computeCd(input: CdInput): CdResult {
  const { deposit, apyPct, termMonths, taxRatePct, penaltyMonths, withdrawMonth } = input;
  if (!(deposit > 0) || !(termMonths > 0) || apyPct < 0) return EMPTY;
  const growth = (months: number) => deposit * Math.pow(1 + apyPct / 100, months / 12);

  const endingBalance = growth(termMonths);
  const interestEarned = endingBalance - deposit;
  const tax = Math.min(Math.max(taxRatePct, 0), 100) / 100;
  const interestAfterTax = interestEarned * (1 - tax);

  let earlyInterest: number | null = null;
  let penaltyAmount: number | null = null;
  let earlyNetBalance: number | null = null;
  let earlyNetGain: number | null = null;
  if (withdrawMonth > 0 && withdrawMonth < termMonths) {
    earlyInterest = growth(withdrawMonth) - deposit;
    penaltyAmount = (deposit * (apyPct / 100) / 12) * Math.max(penaltyMonths, 0);
    earlyNetBalance = deposit + earlyInterest - penaltyAmount;
    earlyNetGain = earlyNetBalance - deposit;
  }

  return {
    endingBalance, interestEarned, interestAfterTax,
    totalReturnPct: (interestEarned / deposit) * 100,
    avgMonthlyInterest: interestEarned / termMonths,
    earlyInterest, penaltyAmount, earlyNetBalance, earlyNetGain,
  };
}
