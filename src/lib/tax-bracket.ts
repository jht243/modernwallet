// 2026 federal income tax bracket engine (mindmap Autocomplete pass 2026-10-21).
//
// Source: IRS Rev. Proc. 2025-32, section 3 (2026 rate tables, standard deductions). Ordinary-income brackets only.
// Not modelled: credits, capital gains rates, QBI deduction, the additional senior deduction, AMT, NIIT, payroll and state taxes.

export type FilingStatus = "single" | "mfj" | "hoh" | "mfs";

/** 2026 standard deduction by filing status (Rev. Proc. 2025-32). */
export const STANDARD_DEDUCTION: Record<FilingStatus, number> = { single: 16100, mfj: 32200, hoh: 24150, mfs: 16100 };

export const STATUS_LABEL: Record<FilingStatus, string> = {
  single: "Single",
  mfj: "Married filing jointly",
  hoh: "Head of household",
  mfs: "Married filing separately",
};

export const RATES = [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37] as const;

/** Upper edge of each of the first six brackets, taxable income, 2026 (Rev. Proc. 2025-32 tables 1 to 4). The 37% band has no cap. */
export const BRACKET_TOPS: Record<FilingStatus, number[]> = {
  single: [12400, 50400, 105700, 201775, 256225, 640600],
  mfj: [24800, 100800, 211400, 403550, 512450, 768700],
  hoh: [17700, 67450, 105700, 201750, 256200, 640600],
  mfs: [12400, 50400, 105700, 201775, 256225, 384350],
};

export interface BracketInput {
  /** Income before deductions (wages, interest, etc.). */
  income: number;
  status: FilingStatus;
  /** True to use the standard deduction; false to use `itemized`. */
  useStandard: boolean;
  itemized: number;
}

export interface BracketBand {
  rate: number;
  from: number;
  to: number | null;
  /** Taxable dollars that fall inside this band. */
  amount: number;
  tax: number;
}

export interface BracketResult {
  deduction: number;
  taxableIncome: number;
  tax: number;
  marginalRate: number;
  /** Total tax divided by income before deductions. */
  effectiveRate: number;
  /** Total tax divided by taxable income. */
  effectiveOnTaxable: number;
  bands: BracketBand[];
  /** Taxable income left before the next bracket starts, null in the top bracket. */
  roomInBracket: number | null;
}

export function computeBrackets(i: BracketInput): BracketResult | null {
  if (!(i.income > 0)) return null;
  const deduction = i.useStandard ? STANDARD_DEDUCTION[i.status] : Math.max(0, i.itemized);
  const taxableIncome = Math.max(0, i.income - deduction);
  const tops = BRACKET_TOPS[i.status];
  const bands: BracketBand[] = [];
  let prev = 0;
  let tax = 0;
  let marginalRate: number = RATES[0];
  let roomInBracket: number | null = null;
  RATES.forEach((rate, idx) => {
    const top = idx < tops.length ? tops[idx] : null;
    const upper = top == null ? Infinity : top;
    const amount = Math.max(0, Math.min(taxableIncome, upper) - prev);
    const bandTax = amount * rate;
    bands.push({ rate, from: prev, to: top, amount, tax: bandTax });
    tax += bandTax;
    if (taxableIncome > prev) {
      marginalRate = rate;
      roomInBracket = top == null ? null : Math.max(0, top - taxableIncome);
    }
    prev = top == null ? prev : top;
  });
  return {
    deduction,
    taxableIncome,
    tax,
    marginalRate,
    effectiveRate: tax / i.income,
    effectiveOnTaxable: taxableIncome > 0 ? tax / taxableIncome : 0,
    bands,
    roomInBracket,
  };
}
