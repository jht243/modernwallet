// Inflation engine — standalone. Every figure is arithmetic on three reader inputs: a dollar amount,
// a number of years, and an assumed average annual inflation rate. No historical CPI series and no
// forecast rate is built in; the reader supplies the rate. An optional nominal return turns the
// result into a real (after-inflation) return using (1 + nominal) / (1 + inflation) - 1.

export interface InflationInput {
  /** Dollar amount in today's money. */
  amount: number;
  years: number;
  /** Assumed average annual inflation, in percent. */
  inflationPct: number;
  /** Optional nominal annual return on the amount, in percent (0 = held as cash, earning nothing). */
  nominalReturnPct: number;
}

export interface InflationResult {
  /** What it takes in future dollars to buy what `amount` buys today. */
  futureCost: number;
  /** What `amount` held unchanged will buy, expressed in today's dollars. */
  purchasingPower: number;
  /** Share of buying power lost, in percent. */
  powerLostPct: number;
  /** Years for buying power to halve; null when inflation is zero or negative. */
  yearsToHalve: number | null;
  /** Real annual return after inflation, in percent. */
  realReturnPct: number;
  /** The amount grown at the nominal return, stated in future dollars. */
  nominalEnding: number;
  /** The same ending value expressed in today's dollars. */
  realEnding: number;
}

export function computeInflation(input: InflationInput): InflationResult {
  const years = Math.max(input.years, 0);
  const i = input.inflationPct / 100;
  const n = input.nominalReturnPct / 100;
  const factor = Math.pow(1 + i, years);
  const futureCost = input.amount * factor;
  const purchasingPower = factor > 0 ? input.amount / factor : 0;
  const powerLostPct = input.amount > 0 ? (1 - purchasingPower / input.amount) * 100 : 0;
  const yearsToHalve = i > 0 ? Math.log(2) / Math.log(1 + i) : null;
  const realReturnPct = ((1 + n) / (1 + i) - 1) * 100;
  const nominalEnding = input.amount * Math.pow(1 + n, years);
  const realEnding = factor > 0 ? nominalEnding / factor : 0;
  return { futureCost, purchasingPower, powerLostPct, yearsToHalve, realReturnPct, nominalEnding, realEnding };
}
