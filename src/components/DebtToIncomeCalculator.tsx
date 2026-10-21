import { useMemo, useState } from "react";
import { computeDti, MANUAL_MAX_DTI_PCT, MANUAL_EXCEPTION_DTI_PCT, DU_MAX_DTI_PCT, type DtiInput } from "../lib/debt-to-income";
import { fmtUSD, fmtPct } from "../lib/format";
import { Field, MoneyInput, Stat, S } from "./calc-ui";

// Debt-to-income ratio island (tool-usage pass 2026-10-21). Gross monthly income and the monthly payments a
// lender counts → back-end and front-end DTI, plus the payment room left before Fannie Mae's 36%, 45% and 50% lines.

interface Props {
  initialData?: Partial<DtiInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: DtiInput = { grossMonthlyIncome: 6500, housing: 1650, auto: 450, studentLoans: 250, creditCards: 120, otherDebts: 0 };

// Fannie Mae Selling Guide B3-6-02 reference lines (see src/lib/debt-to-income.ts).
const BAND_TEXT: Record<string, string> = {
  "36-or-under": `At or under ${MANUAL_MAX_DTI_PCT}%, inside Fannie Mae's limit even for a manually underwritten mortgage.`,
  "36-to-45": `Above ${MANUAL_MAX_DTI_PCT}%: Fannie Mae allows up to ${MANUAL_EXCEPTION_DTI_PCT}% on a manually underwritten mortgage only with set credit score and reserve requirements.`,
  "45-to-50": `Above ${MANUAL_EXCEPTION_DTI_PCT}%, near Fannie Mae's ${DU_MAX_DTI_PCT}% ceiling for loans run through its automated underwriting.`,
  "over-50": `Above ${DU_MAX_DTI_PCT}%, Fannie Mae's maximum for any loan it buys.`,
};

export default function DebtToIncomeCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<DtiInput>({ ...DEFAULTS, ...initialData });
  const r = useMemo(() => computeDti(v), [v]);
  const set = (p: Partial<DtiInput>) => setV((s) => ({ ...s, ...p }));
  const color = r.band === "over-50" || r.band === "45-to-50" ? "#C0392B" : r.band === "36-to-45" ? "#B7791F" : S.bigValue.color;

  return (
    <div style={S.wrap}>
      {(heading || subheading) && (
        <div style={S.head}>
          {heading && <div style={S.heading}>{heading}</div>}
          {subheading && <div style={S.subheading}>{subheading}</div>}
        </div>
      )}
      <div style={S.grid}>
        <div style={S.inputs}>
          <Field label="Gross monthly income (before taxes)"><MoneyInput value={v.grossMonthlyIncome} onChange={(x) => set({ grossMonthlyIncome: x })} /></Field>
          <Field label="Rent or mortgage payment (with taxes, insurance, HOA)"><MoneyInput value={v.housing} onChange={(x) => set({ housing: x })} /></Field>
          <div style={S.twoCol}>
            <Field label="Auto loan payments"><MoneyInput value={v.auto} onChange={(x) => set({ auto: x })} /></Field>
            <Field label="Student loan payments"><MoneyInput value={v.studentLoans} onChange={(x) => set({ studentLoans: x })} /></Field>
          </div>
          <div style={S.twoCol}>
            <Field label="Credit card minimums"><MoneyInput value={v.creditCards} onChange={(x) => set({ creditCards: x })} /></Field>
            <Field label="Other debt payments"><MoneyInput value={v.otherDebts} onChange={(x) => set({ otherDebts: x })} /></Field>
          </div>
          <p style={S.hint}>
            Use monthly minimum payments, not balances. Personal loans, child support and alimony go in "Other". Utilities, phone, groceries and insurance you pay on your own don't count. The figures above are placeholders.
          </p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Your debt-to-income ratio</span>
            <span style={{ ...S.bigValue, color }}>{r.dtiPct == null ? "—" : fmtPct(r.dtiPct, 1)}</span>
            <span style={S.bigSub}>
              {r.dtiPct == null
                ? "Enter your gross monthly income to see your ratio."
                : `${fmtUSD(r.totalDebt)} a month in debt payments ÷ ${fmtUSD(v.grossMonthlyIncome)} gross income. ${BAND_TEXT[r.band]}`}
            </span>
          </div>
          <div style={S.statRow}>
            <Stat label="Housing only (front-end ratio)" value={r.frontEndPct == null ? "—" : fmtPct(r.frontEndPct, 1)} />
            <Stat label="Total monthly debt payments" value={fmtUSD(r.totalDebt)} />
          </div>
          <div style={S.statRow}>
            <Stat label={`Room before ${MANUAL_MAX_DTI_PCT}%`} value={fmtUSD(r.roomTo36)} />
            <Stat label={`Room before ${MANUAL_EXCEPTION_DTI_PCT}%`} value={fmtUSD(r.roomTo45)} />
          </div>
          <Stat label={`Room before ${DU_MAX_DTI_PCT}%`} value={fmtUSD(r.roomTo50)} />
          <div style={S.disclaimer}>
            Reference lines from the Fannie Mae Selling Guide (B3-6-02), not approvals: FHA, VA, auto and personal lenders set their own limits, and every lender also weighs credit and savings. Room = the extra monthly payment you could add before reaching each line.
          </div>
        </div>
      </div>
    </div>
  );
}
