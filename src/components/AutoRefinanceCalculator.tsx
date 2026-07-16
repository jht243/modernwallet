import { useMemo, useState } from "react";
import { computeAutoRefinance, type RefinanceInput } from "../lib/auto-loan";
import { fmtUSD } from "../lib/format";

// Auto loan refinance calculator island. Compares keeping the current loan for its remaining
// term against refinancing the same balance into a new loan — two input sets, one result panel.

interface Props {
  initialData?: Partial<RefinanceInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: RefinanceInput = {
  currentBalance: 22000,
  currentApr: 9.5,
  remainingMonths: 42,
  newApr: 6.5,
  newTermMonths: 42,
};

const TERM_OPTIONS = [24, 36, 42, 48, 60, 72, 84];

export default function AutoRefinanceCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<RefinanceInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => computeAutoRefinance(input), [input]);
  const set = (patch: Partial<RefinanceInput>) => setInput((s) => ({ ...s, ...patch }));
  const num = (v: string) => (v === "" ? 0 : Math.max(0, Number(v.replace(/[^0-9.]/g, ""))));

  const paymentDrops = (result.monthlyPaymentChange ?? 0) < 0;
  const savesInterest = (result.interestSavings ?? 0) > 0;

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
          <div style={S.groupLabel}>Your current loan</div>
          <Field label="Remaining balance">
            <MoneyInput value={input.currentBalance} onChange={(v) => set({ currentBalance: v })} />
          </Field>
          <div style={S.row2}>
            <Field label="Current APR">
              <PctInput value={input.currentApr} onChange={(v) => set({ currentApr: v })} num={num} />
            </Field>
            <Field label="Months remaining">
              <input
                style={S.input}
                inputMode="numeric"
                value={input.remainingMonths}
                onChange={(e) => set({ remainingMonths: num(e.target.value) })}
                aria-label="Months remaining on current loan"
              />
            </Field>
          </div>

          <div style={S.groupLabel}>Refinance offer</div>
          <div style={S.row2}>
            <Field label="New APR">
              <PctInput value={input.newApr} onChange={(v) => set({ newApr: v })} num={num} />
            </Field>
            <Field label="New loan term">
              <select
                style={S.input}
                value={input.newTermMonths}
                onChange={(e) => set({ newTermMonths: Number(e.target.value) })}
                aria-label="New loan term in months"
              >
                {TERM_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t} months</option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Interest {savesInterest ? "saved" : "difference"}</span>
            <span style={{ ...S.bigValue, color: savesInterest ? PRIMARY : WARN }}>
              {fmtUSD(Math.abs(result.interestSavings ?? 0))}
            </span>
            <span style={S.bigSub}>
              {savesInterest ? "less interest than keeping your current loan" : "more interest than keeping your current loan"}
            </span>
          </div>

          <div style={S.statRow}>
            <Stat label="Current payment" value={fmtUSD(result.currentMonthlyPayment)} />
            <Stat label="New payment" value={fmtUSD(result.newMonthlyPayment)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Current remaining interest" value={fmtUSD(result.currentRemainingInterest)} />
            <Stat label="New loan total interest" value={fmtUSD(result.newTotalInterest)} />
          </div>

          {result.monthlyPaymentChange != null && (
            <div style={S.savings}>
              Monthly payment {paymentDrops ? "drops" : "rises"} by{" "}
              <strong>{fmtUSD(Math.abs(result.monthlyPaymentChange))}</strong>
              {savesInterest !== !paymentDrops && (
                <span style={S.savingsSub}>
                  {" "}— note a {paymentDrops ? "lower payment" : "higher payment"} doesn't always mean{" "}
                  {savesInterest ? "more" : "less"} interest paid; compare both numbers above.
                </span>
              )}
            </div>
          )}
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

function PctInput({ value, onChange, num }: { value: number; onChange: (v: number) => void; num: (v: string) => number }) {
  return (
    <div style={S.suffixWrap}>
      <input
        style={S.input}
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(num(e.target.value))}
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
const WARN = "#B5501E";

const S: Record<string, React.CSSProperties> = {
  wrap: { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1A1A1A" },
  head: { marginBottom: 16 },
  heading: { fontSize: "1.2rem", fontWeight: 700 },
  subheading: { fontSize: "0.95rem", color: "#555", marginTop: 2 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 },
  inputs: { display: "flex", flexDirection: "column", gap: 12 },
  groupLabel: { fontSize: "0.78rem", fontWeight: 700, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 6 },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, alignItems: "end" },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#444" },
  input: {
    width: "100%", padding: "10px 12px", fontSize: "1rem", border: "1px solid #D0DAD6",
    borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A",
  },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  suffix: { position: "absolute", right: 12, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  results: {
    background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)",
    border: "1px solid #D8EEE6", borderRadius: 14, padding: 18,
    display: "flex", flexDirection: "column", gap: 12,
  },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 8, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" },
  bigSub: { fontSize: "0.8rem", color: "#777", marginTop: 2 },
  statRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  stat: { display: "flex", flexDirection: "column", gap: 1 },
  statLabel: { fontSize: "0.78rem", color: "#666" },
  statValue: { fontSize: "1.15rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  savings: {
    background: "#FBF4E4", border: "1px solid #F0DEB4", borderRadius: 10,
    padding: "12px 14px", fontSize: "0.92rem", lineHeight: 1.5, color: "#5A4420",
  },
  savingsSub: { color: "#8A7340" },
};
