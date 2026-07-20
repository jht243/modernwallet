import { useMemo, useState } from "react";
import { computePersonalLoan, type PersonalLoanInput } from "../lib/personal-loan";
import { fmtUSD, fmtPct } from "../lib/format";

// Personal loan calculator island. Unlike a basic "amount + rate + term → payment" tool, this one
// also models the origination fee almost every online lender deducts from your disbursed cash —
// and surfaces the effective APR that fee creates, not just the stated rate. Standalone, no host
// coupling (mirrors AutoLoanCalculator / BusinessLoanPayoffCalculator).

interface Props {
  initialData?: Partial<PersonalLoanInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: PersonalLoanInput = {
  loanAmount: 15000,
  interestRatePct: 12.5,
  loanTermMonths: 48,
  originationFeePct: 3,
};

const TERM_OPTIONS = [24, 36, 48, 60, 72, 84];

export default function PersonalLoanCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<PersonalLoanInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => computePersonalLoan(input), [input]);
  const set = (patch: Partial<PersonalLoanInput>) => setInput((s) => ({ ...s, ...patch }));

  const feeGapPct = result.effectiveAprPct != null
    ? Math.max(0, result.effectiveAprPct - input.interestRatePct)
    : 0;

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
          <Field label="Loan amount">
            <MoneyInput value={input.loanAmount} onChange={(v) => set({ loanAmount: v })} />
          </Field>
          <div style={S.row2}>
            <Field label="Interest rate (APR)">
              <PctInput value={input.interestRatePct} onChange={(v) => set({ interestRatePct: v })} />
            </Field>
            <Field label="Loan term">
              <select
                style={S.input}
                value={input.loanTermMonths}
                onChange={(e) => set({ loanTermMonths: Number(e.target.value) })}
                aria-label="Loan term in months"
              >
                {TERM_OPTIONS.map((m) => (
                  <option key={m} value={m}>{m} months</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Origination fee (deducted from what you receive)">
            <PctInput value={input.originationFeePct} onChange={(v) => set({ originationFeePct: Math.min(10, v) })} />
          </Field>
          <p style={S.hint}>
            Most online personal loan lenders subtract this fee from your payout before you ever see the cash — your payment is still based on the full loan amount. Enter 0 if your offer has no origination fee.
          </p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Monthly payment</span>
            <span style={S.bigValue}>{fmtUSD(result.monthlyPayment)}</span>
            <span style={S.bigSub}>for {input.loanTermMonths} months</span>
          </div>

          <div style={S.statRow}>
            <Stat label="Cash you'll actually receive" value={fmtUSD(result.amountReceived)} />
            <Stat label="Origination fee" value={fmtUSD(result.originationFeeAmount)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Total interest" value={fmtUSD(result.totalInterest)} />
            <Stat label="Total cost of borrowing" value={fmtUSD(result.totalCostOfBorrowing)} />
          </div>

          <div style={{ ...S.aprBox, ...(feeGapPct >= 1.5 ? S.aprWarn : S.aprOk) }}>
            <span style={S.aprLabel}>Effective APR (including the fee)</span>
            <span style={S.aprValue}>{fmtPct(result.effectiveAprPct, 2)}</span>
            <span style={S.aprNote}>
              {feeGapPct >= 0.05
                ? `Your stated rate is ${fmtPct(input.interestRatePct, 2)}, but the origination fee makes your real cost ${fmtPct(result.effectiveAprPct, 2)} on the cash you actually get.`
                : "No origination fee entered — effective APR matches your stated rate."}
            </span>
          </div>

          <div style={S.disclaimer}>
            Estimate only. Assumes a fixed-rate, fully-amortizing loan with the origination fee deducted from disbursement (the most common structure). Some lenders finance the fee into your balance instead — confirm your lender's exact structure before signing.
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
        onChange={(e) => onChange(e.target.value === "" ? 0 : Math.max(0, Number(e.target.value.replace(/[^0-9.]/g, ""))))}
      />
    </div>
  );
}
function PctInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={S.suffixWrap}>
      <input
        style={S.input}
        inputMode="decimal"
        value={value === 0 ? "" : value}
        placeholder="0"
        onChange={(e) => onChange(Math.max(0, Number(e.target.value.replace(/[^0-9.]/g, ""))))}
        aria-label="Percent"
      />
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
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, alignItems: "end" },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#444" },
  input: { width: "100%", padding: "10px 12px", fontSize: "1rem", border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A" },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  suffix: { position: "absolute", right: 12, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
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
