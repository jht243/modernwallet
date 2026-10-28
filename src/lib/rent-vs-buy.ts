// Rent vs buy engine (Autocomplete pass 2026-10-28) - standalone, no React/DOM.
//
// Modeled, not measured. Buying: down payment and closing cost up front, then each month the mortgage
// payment (principal and interest), property tax, insurance and maintenance (as a percent of the home's
// current value), HOA, and mortgage insurance (PMI) while the loan is above 80% of the purchase price.
// Renting: rent (grows each year) plus renter's insurance, and the down payment plus buyer closing cost are
// invested on day one. Each month the cheaper path invests the monthly difference. At every year-end:
//   buyer net worth  = home value x (1 - selling cost) - loan balance + buyer's investment pot
//   renter net worth = renter's investment pot
// Not modeled: federal or state income-tax effects of owning (mortgage interest and SALT deductions help
// only filers who itemize), moving costs, vacancy, special assessments, and any change in the reader's job.
// Reference implementation and boundary scenarios: evidence/rent-vs-buy-calculator/check.py.

export interface RvbInput {
  price: number;
  downPct: number;
  ratePct: number;
  termYears: number;
  propTaxPct: number;
  insurancePct: number;
  maintPct: number;
  hoaMonth: number;
  closingPct: number;
  sellPct: number;
  apprPct: number;
  rent: number;
  rentGrowthPct: number;
  renterInsMonth: number;
  returnPct: number;
  years: number;
}

/** Default assumptions. The rate is Freddie Mac's 30-year average (7.32%, week of 2026-10-22,
 *  https://www.freddiemac.com/pmms). The rest are stated planning assumptions the reader can change. */
export const RVB_DEFAULTS: RvbInput = {
  price: 400000, downPct: 20, ratePct: 7.32, termYears: 30,
  propTaxPct: 1.0, insurancePct: 0.5, maintPct: 1.0, hoaMonth: 0,
  closingPct: 3.0, sellPct: 6.0, apprPct: 3.0,
  rent: 2200, rentGrowthPct: 3.0, renterInsMonth: 15, returnPct: 6.0, years: 7,
};

/** Mortgage insurance, percent of the original loan per year, charged while the balance is above 80% of price. */
export const PMI_PCT = 0.5;
/** The model runs 30 years so a break-even year can be found. */
export const MAX_YEARS = 30;

export interface RvbYear { year: number; buy: number; rent: number; diff: number; }

export interface RvbResult {
  payment: number;
  loan: number;
  cashUpfront: number;
  years: RvbYear[];
  /** First year-end at which buying is ahead, null if never within 30 years. */
  breakEven: number | null;
  atHorizon: RvbYear;
  /** Month-one owner cost (all-in) and renter cost, for the monthly split. */
  ownerMonth1: number;
  renterMonth1: number;
  priceToRent: number;
}

export function computeRentVsBuy(i: RvbInput): RvbResult | null {
  const { price, downPct, ratePct, termYears } = i;
  if (!(price > 0) || !(termYears > 0) || !(i.rent > 0) || downPct < 0 || downPct > 100) return null;
  const loan0 = price * (1 - downPct / 100);
  const n = Math.round(termYears * 12);
  const r = ratePct / 1200;
  const pay = loan0 === 0 ? 0 : r === 0 ? loan0 / n : (loan0 * r) / (1 - Math.pow(1 + r, -n));
  const mret = Math.pow(1 + i.returnPct / 100, 1 / 12) - 1;
  const cash0 = (price * downPct) / 100 + (price * i.closingPct) / 100;
  let renter = cash0;
  let ownerPot = 0;
  let bal = loan0;
  const years: RvbYear[] = [];
  let ownerMonth1 = 0;
  let renterMonth1 = 0;
  for (let m = 1; m <= MAX_YEARS * 12; m++) {
    const yr = Math.floor((m - 1) / 12);
    const valueStart = price * Math.pow(1 + i.apprPct / 100, yr);
    let pi = 0;
    if (m <= n) {
      const interest = bal * r;
      bal = Math.max(0, bal - (pay - interest));
      pi = pay;
    }
    const pmi = bal > 0.8 * price && downPct < 20 ? (loan0 * PMI_PCT) / 100 / 12 : 0;
    const own = pi + (valueStart * (i.propTaxPct + i.insurancePct + i.maintPct)) / 1200 + i.hoaMonth + pmi;
    const rentNow = i.rent * Math.pow(1 + i.rentGrowthPct / 100, yr) + i.renterInsMonth;
    if (m === 1) { ownerMonth1 = own; renterMonth1 = rentNow; }
    renter = renter * (1 + mret) + Math.max(0, own - rentNow);
    ownerPot = ownerPot * (1 + mret) + Math.max(0, rentNow - own);
    if (m % 12 === 0) {
      const y = m / 12;
      const value = price * Math.pow(1 + i.apprPct / 100, y);
      const buy = value * (1 - i.sellPct / 100) - bal + ownerPot;
      years.push({ year: y, buy, rent: renter, diff: buy - renter });
    }
  }
  const be = years.find((y) => y.diff >= 0);
  const h = Math.min(Math.max(Math.round(i.years), 1), MAX_YEARS);
  return {
    payment: pay, loan: loan0, cashUpfront: cash0, years,
    breakEven: be ? be.year : null, atHorizon: years[h - 1],
    ownerMonth1, renterMonth1, priceToRent: i.rent > 0 ? price / (i.rent * 12) : 0,
  };
}
