// Biweekly mortgage engine — standalone (tool-usage pass 2026-11-04). Compares three ways to pay a fixed-rate loan:
//  1. Monthly: payment = B × r ÷ (1 − (1 + r)^−n), r = APR ÷ 12 (standard amortization).
//  2. Biweekly: half the monthly payment every two weeks, 26 a year (13 monthly payments' worth). Modeled as applied
//     when paid, so each two-week period accrues APR ÷ 26 interest. Servicers that hold half-payments until a full
//     payment builds up save slightly less; the CFPB notes you can match the result yourself without a plan fee:
//     https://www.consumerfinance.gov/ask-cfpb/someone-offered-me-the-ability-to-make-26-bi-weekly-mortgage-payments-a-year-for-a-fee-is-there-a-way-i-can-pay-down-my-loan-faster-on-my-own-without-paying-a-fee-to-sign-up-for-this-plan-en-203/
//  3. Do-it-yourself: the monthly payment plus 1/12 of it each month (the same 13 payments a year, no plan).
// Plan fees (one-time setup + a fee per debit) are reader inputs; no fee is assumed as standard.

export interface BiweeklyInput {
  balance: number;
  ratePct: number;
  monthsLeft: number;
  setupFee: number;
  perDebitFee: number;
}

export interface BiweeklyResult {
  monthlyPayment: number;
  halfPayment: number;
  monthly: { months: number; interest: number };
  biweekly: { payments: number; monthsEquivalent: number; interest: number; interestSaved: number; fees: number; netSaved: number; monthsSooner: number };
  extraTwelfth: { extraPerMonth: number; months: number; interest: number; interestSaved: number; monthsSooner: number };
}

function amortize(balance: number, periodRate: number, pay: number, cap: number): { periods: number; interest: number } | null {
  let bal = balance, k = 0, interest = 0;
  while (bal > 0.005 && k < cap) {
    const it = bal * periodRate;
    const principal = Math.min(pay - it, bal);
    if (principal <= 0) return null;
    bal -= principal; interest += it; k++;
  }
  return { periods: k, interest };
}

export function computeBiweekly(i: BiweeklyInput): BiweeklyResult | null {
  const n = Math.round(i.monthsLeft);
  if (!(i.balance > 0) || !(n > 0) || !(i.ratePct >= 0)) return null;
  const r = i.ratePct / 100 / 12;
  const p = r === 0 ? i.balance / n : (i.balance * r) / (1 - Math.pow(1 + r, -n));
  const m = amortize(i.balance, r, p, 2000);
  const b = amortize(i.balance, i.ratePct / 100 / 26, p / 2, 5000);
  const e = amortize(i.balance, r, p + p / 12, 2000);
  if (!m || !b || !e) return null;
  const fees = Math.max(0, i.setupFee) + Math.max(0, i.perDebitFee) * b.periods;
  const bMonths = (b.periods * 12) / 26;
  return {
    monthlyPayment: p,
    halfPayment: p / 2,
    monthly: { months: m.periods, interest: m.interest },
    biweekly: { payments: b.periods, monthsEquivalent: bMonths, interest: b.interest, interestSaved: m.interest - b.interest, fees, netSaved: m.interest - b.interest - fees, monthsSooner: m.periods - bMonths },
    extraTwelfth: { extraPerMonth: p / 12, months: e.periods, interest: e.interest, interestSaved: m.interest - e.interest, monthsSooner: m.periods - e.periods },
  };
}
