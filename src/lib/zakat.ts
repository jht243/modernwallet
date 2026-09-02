// Zakat engine — obligatory Islamic wealth tax: 2.5% of net zakatable wealth held for one full
// lunar year (the hawl), once that wealth clears the nisab minimum threshold. Most day-to-day
// "zakat calculators" hardcode a stale dollar nisab figure that goes wrong the moment gold/silver
// prices move. This engine instead takes today's metal price as an input (gold or silver standard,
// user's choice) and derives the threshold live, the same way the nisab is actually defined: as a
// weight of metal (87.48g gold or 612.36g silver), not a fixed dollar amount.
// Silver standard is the lower, more inclusive threshold most scholars recommend by default —
// see Islamic Relief's zakat guidance (sources on the calculator page).

export type NisabStandard = "silver" | "gold";

export interface ZakatInput {
  cashAndBank: number;
  investmentsAndStock: number;
  goldValue: number;
  silverValue: number;
  receivables: number;
  debtsDueNow: number;
  nisabStandard: NisabStandard;
  metalPricePerGram: number;
}

export interface ZakatResult {
  zakatableWealth: number;
  nisabThreshold: number;
  meetsNisab: boolean;
  zakatDue: number;
  nisabGramsUsed: number;
}

const GOLD_NISAB_GRAMS = 87.48;
const SILVER_NISAB_GRAMS = 612.36;
const ZAKAT_RATE = 0.025;

export function computeZakat(input: ZakatInput): ZakatResult {
  const cashAndBank = Math.max(0, input.cashAndBank ?? 0);
  const investmentsAndStock = Math.max(0, input.investmentsAndStock ?? 0);
  const goldValue = Math.max(0, input.goldValue ?? 0);
  const silverValue = Math.max(0, input.silverValue ?? 0);
  const receivables = Math.max(0, input.receivables ?? 0);
  const debtsDueNow = Math.max(0, input.debtsDueNow ?? 0);
  const metalPricePerGram = Math.max(0, input.metalPricePerGram ?? 0);

  const grossAssets = cashAndBank + investmentsAndStock + goldValue + silverValue + receivables;
  const zakatableWealth = round2(Math.max(0, grossAssets - debtsDueNow));

  const nisabGramsUsed = input.nisabStandard === "gold" ? GOLD_NISAB_GRAMS : SILVER_NISAB_GRAMS;
  const nisabThreshold = round2(nisabGramsUsed * metalPricePerGram);

  const meetsNisab = metalPricePerGram > 0 && zakatableWealth >= nisabThreshold;
  const zakatDue = meetsNisab ? round2(zakatableWealth * ZAKAT_RATE) : 0;

  return { zakatableWealth, nisabThreshold, meetsNisab, zakatDue, nisabGramsUsed };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
