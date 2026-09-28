import { useMemo, useState } from "react";
import { computeHeloc, type HelocInput, type DrawPaymentType } from "../lib/heloc";
import { fmtUSD, fmtPct } from "../lib/format";

// HELOC payment island. Answers the two questions a borrower has: how large a line does my equity
// support, and what will the payment be in the draw period versus the repayment period. Every rate,
// cap and term is an input the borrower sets; nothing is assumed from a market survey. Standalone,
// no host coupling (mirrors InterestPerDayCalculator / PersonalLoanCalculator).

interface Props {
  initialData?: Partial<HelocInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: HelocInput = {
  homeValue: 400000,
  mortgageBalance: 250000,
  maxCltvPct: 85,
  drawnBalance: 50000,
  aprPct: 8.5,
  drawYears: 10,
  repayYears: 20,
  drawPaymentType: "interest-only",
  stressPoints: 2,
};

export default function HelocCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<HelocInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => computeHeloc(input), [input]);
  const set = (patch: Partial<HelocInput>) => setInput((s) => ({ ...s, ...patch }));
  const interestOnly = input.drawPaymentType === "interest-only" && input.drawYears > 0;

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
          <Field label="Home value">
            <MoneyInput value={input.homeValue} onChange={(v) => set({ homeValue: v })} />
          </Field>
          <Field label="Mortgage balance still owed">
            <MoneyInput value={input.mortgageBalance} onChange={(v) => set({ mortgageBalance: v })} />
          </Field>
          <Field label="Lender's max combined loan-to-value (CLTV)">
            <PctInput value={input.maxCltvPct} onChange={(v) => set({ maxCltvPct: v })} />
          </Field>
          <Field label="Amount you plan to draw">
            <MoneyInput value={input.drawnBalance} onChange={(v) => set({ drawnBalance: v })} />
          </Field>
          <Field label="HELOC interest rate (APR)">
            <PctInput value={input.aprPct} onChange={(v) => set({ aprPct: v })} />
          </Field>
          <div style={S.twoCol}>
            <Field label="Draw period (years)">
              <NumInput value={input.drawYears} onChange={(v) => set({ drawYears: v })} />
            </Field>
            <Field label="Repayment period (years)">
              <NumInput value={input.repayYears} onChange={(v) => set({ repayYears: v })} />
            </Field>
          </div>
          <Field label="Payment during the draw period">
            <select
              style={S.input}
              value={input.drawPaymentType}
              onChange={(e) => set({ drawPaymentType: e.target.value as DrawPaymentType })}
            >
              <option value="interest-only">Interest only</option>
              <option value="amortizing">Principal and interest</option>
            </select>
          </Field>
          <Field label="Rate-rise stress test (extra points)">
            <NumInput value={input.stressPoints} onChange={(v) => set({ stressPoints: v })} />
          </Field>
          <p style={S.hint}>
            HELOC rates are usually variable and every lender sets its own CLTV cap, draw period and repayment term. Enter the figures from your lender's offer. The rate and cap above are placeholders, not a quote.
          </p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Most your equity supports</span>
            <span style={S.bigValue}>{fmtUSD(result.maxLine)}</span>
            <span style={S.bigSub}>
              {fmtUSD(input.homeValue)} x {fmtPct(input.maxCltvPct, 0)} CLTV, minus {fmtUSD(input.mortgageBalance)} owed
            </span>
          </div>

          {result.drawExceedsLine && (
            <div style={{ ...S.aprBox, ...S.aprWarn }}>
              <span style={S.aprLabel}>Draw is above the equity limit</span>
              <span style={S.aprNote}>
                {fmtUSD(input.drawnBalance)} is more than the {fmtUSD(result.maxLine)} this CLTV cap allows. A lender would cap the line at the lower figure.
              </span>
            </div>
          )}

          <div style={S.statRow}>
            <Stat label={interestOnly ? "Draw-period payment (interest only)" : "Draw-period payment (P&I)"} value={fmtUSD(result.drawPayment, { cents: true })} />
            <Stat label="Repayment-period payment" value={fmtUSD(result.repayPayment, { cents: true })} />
          </div>
          <div style={S.statRow}>
            <Stat label="Total interest, draw period" value={fmtUSD(result.totalInterestDraw)} />
            <Stat label="Total interest, repayment" value={fmtUSD(result.totalInterestRepay)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Total interest over the life" value={fmtUSD(result.totalInterest)} />
            <Stat label="CLTV after your draw" value={result.cltvAfterDrawPct == null ? "—" : fmtPct(result.cltvAfterDrawPct, 1)} />
          </div>

          {interestOnly && (result.paymentJump ?? 0) > 0.5 && (
            <div style={{ ...S.aprBox, ...S.aprWarn }}>
              <span style={S.aprLabel}>Payment when repayment starts</span>
              <span style={S.aprValue}>+{fmtUSD(result.paymentJump, { cents: true })}/mo</span>
              <span style={S.aprNote}>
                The payment goes from {fmtUSD(result.drawPayment, { cents: true })} to {fmtUSD(result.repayPayment, { cents: true })} once principal is added, at the same rate.
              </span>
            </div>
          )}

          {input.stressPoints > 0 && result.stressRepayPayment != null && (
            <div style={S.aprBox}>
              <span style={S.aprLabel}>If the rate rises {input.stressPoints} points to {fmtPct(input.aprPct + input.stressPoints)}</span>
              <span style={S.aprNote}>
                Draw-period payment {fmtUSD(result.stressDrawPayment, { cents: true })}, repayment payment {fmtUSD(result.stressRepayPayment, { cents: true })}.
              </span>
            </div>
          )}

          <div style={S.disclaimer}>
            Estimate only. Assumes one lump-sum draw at the start, a fixed rate for the whole term, and no fees, no further draws and no rate caps. Real HELOCs are variable-rate and lenders differ on how they calculate interest and set the repayment payment. Check your lender's disclosure and talk to a licensed loan officer before borrowing against your home.
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
