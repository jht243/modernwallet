// Debt-to-income (DTI) ratio engine (tool-usage pass 2026-10-21) — standalone, no React/DOM.
//
// DTI = all monthly debt payments ÷ gross monthly income (CFPB, "What is a debt-to-income ratio?").
// Front-end ratio = the housing payment alone ÷ gross monthly income.
// Reference lines shown to the reader — Fannie Mae Selling Guide B3-6-02, Debt-to-Income Ratios (04/02/2025):
//   • 36% — maximum total DTI for a manually underwritten loan;
//   • 45% — the most that maximum can be exceeded to, with the credit score and reserve requirements met;
//   • 50% — maximum DTI for a loan underwritten through Desktop Underwriter (DU).
// These are one mortgage investor's limits, not approvals: other loan types and lenders set their own.

/** Fannie Mae total-DTI reference lines, percent (Selling Guide B3-6-02). */
export const MANUAL_MAX_DTI_PCT = 36;
export const MANUAL_EXCEPTION_DTI_PCT = 45;
export const DU_MAX_DTI_PCT = 50;

export interface DtiInput {
  grossMonthlyIncome: number;
  housing: number;
  auto: number;
  studentLoans: number;
  creditCards: number;
  otherDebts: number;
}

export interface DtiResult {
  totalDebt: number;
  /** Back-end (total) DTI, percent; null without income. */
  dtiPct: number | null;
  /** Housing-only DTI, percent; null without income. */
  frontEndPct: number | null;
  /** Monthly payment room left before 36% / 45% / 50% (0 when already over). */
  roomTo36: number;
  roomTo45: number;
  roomTo50: number;
  band: "none" | "36-or-under" | "36-to-45" | "45-to-50" | "over-50";
}

const clean = (v: number) => (Number.isFinite(v) ? Math.max(0, v) : 0);
const r1 = (v: number) => Math.round(v * 10) / 10;
const r2 = (v: number) => Math.round(v * 100) / 100;

export function computeDti(i: DtiInput): DtiResult {
  const inc = clean(i.grossMonthlyIncome);
  const totalDebt = r2(clean(i.housing) + clean(i.auto) + clean(i.studentLoans) + clean(i.creditCards) + clean(i.otherDebts));
  if (inc <= 0) return { totalDebt, dtiPct: null, frontEndPct: null, roomTo36: 0, roomTo45: 0, roomTo50: 0, band: "none" };
  const exact = (totalDebt / inc) * 100;
  const room = (pct: number) => r2(Math.max(0, (inc * pct) / 100 - totalDebt));
  const band = exact <= MANUAL_MAX_DTI_PCT ? "36-or-under" : exact <= MANUAL_EXCEPTION_DTI_PCT ? "36-to-45" : exact <= DU_MAX_DTI_PCT ? "45-to-50" : "over-50";
  return {
    totalDebt, dtiPct: r1(exact), frontEndPct: r1((clean(i.housing) / inc) * 100),
    roomTo36: room(MANUAL_MAX_DTI_PCT), roomTo45: room(MANUAL_EXCEPTION_DTI_PCT), roomTo50: room(DU_MAX_DTI_PCT), band,
  };
}
