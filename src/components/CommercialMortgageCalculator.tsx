import { useMemo, useState } from "react";
import { computeCommercialMortgage, type CommercialMortgageInput } from "../lib/commercial-mortgage";
import { fmtUSD, fmtPct } from "../lib/format";

// Commercial mortgage island. Answers what a commercial borrower needs before a lender call: the
// monthly payment, the balloon balance due when the term ends (the loan amortizes over longer than
// it runs), and the debt service coverage ratio lenders underwrite the property on. Every rate,
// term and threshold is an input the borrower sets; nothing is assumed from a market survey.
// Standalone, no host coupling (mirrors HelocCalculator).

interface Props {
  initialData?: Partial<CommercialMortgageInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: CommercialMortgageInput = {
  propertyValue: 1000000,
  ltvPct: 75,
  aprPct: 7,
  amortYears: 25,
  termYears: 10,
  ioYears: 0,
  noi: 100000,
  minDscr: 1.25,
};

export default function CommercialMortgageCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<CommercialMortgageInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => computeCommercialMortgage(input), [input]);
  const set = (patch: Partial<CommercialMortgageInput>) => setInput((s) => ({ ...s, ...patch }));
  const hasIo = input.ioYears > 0 && result.ioPayment != null;
  const hasBalloon = (result.balloon ?? 0) > 0.5;

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
          <Field label="Property value (price or appraisal)">
            <MoneyInput value={input.propertyValue} onChange={(v) => set({ propertyValue: v })} />
          </Field>
          <Field label="Loan-to-value (LTV)">
            <PctInput value={input.ltvPct} onChange={(v) => set({ ltvPct: v })} />
          </Field>
          <Field label="Interest rate (APR)">
            <PctInput value={input.aprPct} onChange={(v) => set({ aprPct: v })} />
          </Field>
          <div style={S.twoCol}>
            <Field label="Amortization (years)">
              <NumInput value={input.amortYears} onChange={(v) => set({ amortYears: v })} />
            </Field>
            <Field label="Loan term (years)">
              <NumInput value={input.termYears} onChange={(v) => set({ termYears: v })} />
            </Field>
          </div>
          <Field label="Interest-only period (years, 0 for none)">
            <NumInput value={input.ioYears} onChange={(v) => set({ ioYears: v })} />
          </Field>
          <Field label="Annual net operating income (NOI)">
            <MoneyInput value={input.noi} onChange={(v) => set({ noi: v })} />
          </Field>
          <Field label="Lender's minimum DSCR">
            <NumInput value={input.minDscr} onChange={(v) => set({ minDscr: v })} />
          </Field>
          <p style={S.hint}>
            Every lender sets its own rate, LTV cap, amortization, term and minimum DSCR. Enter the figures from your term sheet. The values above are placeholders, not a quote.
          </p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Monthly payment (principal and interest)</span>
            <span style={S.bigValue}>{fmtUSD(result.amortPayment, { cents: true })}</span>
            <span style={S.bigSub}>
              {fmtUSD(result.loanAmount)} loan at {fmtPct(input.aprPct)} over {input.amortYears} years
            </span>
          </div>

          {hasBalloon && (
            <div style={{ ...S.aprBox, ...S.aprWarn }}>
              <span style={S.aprLabel}>Balloon due at the end of year {input.termYears}</span>
              <span style={S.aprValue}>{fmtUSD(result.balloon)}</span>
              <span style={S.aprNote}>
                The payment is calculated over {input.amortYears} years but the loan comes due after {input.termYears}, so this balance has to be paid or refinanced.
              </span>
            </div>
          )}

          <div style={S.statRow}>
            <Stat label="Down payment" value={fmtUSD(result.downPayment)} />
            <Stat label="Loan amount" value={fmtUSD(result.loanAmount)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Annual debt service" value={fmtUSD(result.annualDebtService)} />
            <Stat label="Interest over the term" value={fmtUSD(result.totalInterestOverTerm)} />
          </div>
          {hasIo && (
            <div style={S.statRow}>
              <Stat label={`Interest-only payment (first ${input.ioYears} yr)`} value={fmtUSD(result.ioPayment, { cents: true })} />
              <Stat label="Payment once amortizing" value={fmtUSD(result.amortPayment, { cents: true })} />
            </div>
          )}

          {result.dscr != null && (
            <div style={{ ...S.aprBox, ...(result.meetsMinDscr === false ? S.aprWarn : S.aprOk) }}>
              <span style={S.aprLabel}>Debt service coverage ratio (DSCR)</span>
              <span style={S.aprValue}>{result.dscr.toFixed(2)}x</span>
              <span style={S.aprNote}>
                {fmtUSD(input.noi)} NOI divided by {fmtUSD(result.annualDebtService)} annual debt service
                {result.meetsMinDscr != null && input.minDscr > 0
                  ? result.meetsMinDscr
                    ? `, at or above your ${input.minDscr.toFixed(2)}x minimum.`
                    : `, below your ${input.minDscr.toFixed(2)}x minimum.`
                  : "."}
              </span>
            </div>
          )}

          {result.maxLoanAtMinDscr != null && (
            <div style={S.statRow}>
              <Stat label={`Largest loan at ${input.minDscr.toFixed(2)}x DSCR`} value={fmtUSD(result.maxLoanAtMinDscr)} />
              <Stat label="Debt yield (NOI / loan)" value={result.debtYieldPct == null ? "—" : fmtPct(result.debtYieldPct, 1)} />
            </div>
          )}

          <div style={S.disclaimer}>
            Estimate only. Assumes a fixed rate for the whole term, monthly payments, amortization that starts after any interest-only period, and no fees, reserves, prepayment charges or taxes. DSCR uses the amortizing payment. Lenders define NOI, DSCR and debt yield their own way, so check your term sheet and talk to a commercial lender before you commit.
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={S.field}>
      <span style={S.label}>{label}</span>
      {children}
    </label>
  );
}
function MoneyInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={S.suffixWrap}>
      <span style={S.prefix}>$</span>
      <input
        style={{ ...S.input, paddingLeft: 22 }}
        inputMode="numeric"
        value={value === 0 ? "" : value.toLocaleString("en-US")}
        placeholder="0"
        onChange={(e) => { const n = parseFloat(e.target.value.replace(/[^0-9.]/g, "")); onChange(Number.isFinite(n) ? Math.max(0, n) : 0); }}
      />
    </div>
  );
}
function useDraft(value: number, onChange: (v: number) => void) {
  const [draft, setDraft] = useState<string | null>(null);
  return {
    text: draft ?? (value === 0 ? "" : String(value)),
    onChange: (raw: string) => {
      const cleaned = raw.replace(/[^0-9.]/g, "");
      setDraft(cleaned);
      const n = parseFloat(cleaned);
      onChange(Number.isFinite(n) ? Math.max(0, n) : 0);
    },
    onBlur: () => setDraft(null),
  };
}
function NumInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const d = useDraft(value, onChange);
  return <input style={S.input} inputMode="decimal" value={d.text} placeholder="0" onChange={(e) => d.onChange(e.target.value)} onBlur={d.onBlur} />;
}
function PctInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const d = useDraft(value, onChange);
  return (
    <div style={S.suffixWrap}>
      <input style={S.input} inputMode="decimal" value={d.text} placeholder="0" onChange={(e) => d.onChange(e.target.value)} onBlur={d.onBlur} aria-label="Percent" />
      <span style={S.suffix}>%</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={S.stat}>
      <span style={S.statLabel}>{label}</span>
      <span style={S.statValue}>{value}</span>
    </div>
  );
}

const PRIMARY = "#0E7C66";
const S: Record<string, React.CSSProperties> = {
  wrap: { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1A1A1A" },
  head: { marginBottom: 16 },
  heading: { fontSize: "1.2rem", fontWeight: 700 },
  subheading: { fontSize: "0.95rem", color: "#555", marginTop: 2 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 },
  inputs: { display: "flex", flexDirection: "column", gap: 12 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#444" },
  input: { width: "100%", padding: "10px 12px", fontSize: "1rem", border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A" },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  suffix: { position: "absolute", right: 12, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  hint: { fontSize: "0.82rem", color: "#666", lineHeight: 1.5, margin: "2px 0 0" },
  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12, alignSelf: "start" },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 8, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "2rem", fontWeight: 800, color: PRIMARY, letterSpacing: "-0.02em" },
  bigSub: { fontSize: "0.8rem", color: "#777", marginTop: 2 },
  statRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  stat: { display: "flex", flexDirection: "column", gap: 1 },
  statLabel: { fontSize: "0.78rem", color: "#666" },
  statValue: { fontSize: "1.15rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  aprBox: { borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 1, border: "1px solid #E0EBE7", background: "#fff" },
  aprOk: { background: "#EAF7F1", borderColor: "#BFE6D7" },
  aprWarn: { background: "#FBF4E4", borderColor: "#F0DEB4" },
  aprLabel: { fontSize: "0.78rem", fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: "0.03em" },
  aprValue: { fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" },
  aprNote: { fontSize: "0.8rem", color: "#777" },
  disclaimer: { fontSize: "0.76rem", color: "#7a8783", lineHeight: 1.5, marginTop: 2 },
};
