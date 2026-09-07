// Cash conversion cycle (CCC) engine — the standard days-based measure of how long cash is tied
// up in operations: CCC = Days Inventory Outstanding + Days Sales Outstanding - Days Payable
// Outstanding. A shorter (or negative) CCC means a business converts spending on inventory back
// into cash faster, and needs less external financing to fund its operating cycle.

export interface CashConversionCycleInput {
  /** Cost of goods sold over the period. */
  cogs: number;
  /** Average inventory value over the period. */
  averageInventory: number;
  /** Total revenue over the period. */
  revenue: number;
  /** Average accounts receivable over the period. */
  averageReceivables: number;
  /** Average accounts payable over the period. */
  averagePayables: number;
  /** Number of days in the period (365 for a year, 90 for a quarter). */
  periodDays: number;
}

export interface CashConversionCycleResult {
  daysInventoryOutstanding: number | null;
  daysSalesOutstanding: number | null;
  daysPayableOutstanding: number | null;
  cashConversionCycle: number | null;
}

const EMPTY: CashConversionCycleResult = {
  daysInventoryOutstanding: null, daysSalesOutstanding: null, daysPayableOutstanding: null, cashConversionCycle: null,
};

export function computeCashConversionCycle(input: CashConversionCycleInput): CashConversionCycleResult {
  const cogs = Math.max(0, input.cogs ?? 0);
  const averageInventory = Math.max(0, input.averageInventory ?? 0);
  const revenue = Math.max(0, input.revenue ?? 0);
  const averageReceivables = Math.max(0, input.averageReceivables ?? 0);
  const averagePayables = Math.max(0, input.averagePayables ?? 0);
  const periodDays = Math.max(1, input.periodDays ?? 365);

  if (!(cogs > 0) && !(revenue > 0)) return EMPTY;

  const dio = cogs > 0 ? round1((averageInventory / cogs) * periodDays) : 0;
  const dso = revenue > 0 ? round1((averageReceivables / revenue) * periodDays) : 0;
  const dpo = cogs > 0 ? round1((averagePayables / cogs) * periodDays) : 0;
  const ccc = round1(dio + dso - dpo);

  return { daysInventoryOutstanding: dio, daysSalesOutstanding: dso, daysPayableOutstanding: dpo, cashConversionCycle: ccc };
}

function round1(n: number): number { return Math.round(n * 10) / 10; }
