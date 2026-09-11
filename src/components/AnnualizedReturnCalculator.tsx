import { useMemo, useState } from "react";
import { computeAnnualizedReturn, type AnnualizedReturnInput } from "../lib/annualized-return";
import { fmtUSD, fmtPct } from "../lib/format";

// Annualized return (CAGR) island. Solves backward from a beginning value, an ending value, and a
// holding period to the constant annual growth rate (CAGR) that explains the move — and shows the
// gap against the simple average annual return, the distinction most calculators of this kind skip
// entirely. Standalone, no host coupling (mirrors InterestPerDayCalculator / PersonalLoanCalculator).

interface Props {
  initialData?: Partial<AnnualizedReturnInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: AnnualizedReturnInput = {
  beginningValue: 10000,
  endingValue: 16000,
  years: 5,
};

export default function AnnualizedReturnCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<AnnualizedReturnInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => computeAnnualizedReturn(input), [input]);
  const set = (patch: Partial<AnnualizedReturnInput>) => setInput((s) => ({ ...s, ...patch }));

  const showGap = (result.gapPct ?? 0) >= 0.1;

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
          <Field label="Starting value">
            <MoneyInput value={input.beginningValue} onChange={(v) => set({ beginningValue: v })} />
          </Field>
          <Field label="Ending value">
            <MoneyInput value={input.endingValue} onChange={(v) => set({ endingValue: v })} />
          </Field>
          <Field label="Holding period (years)">
            <YearsInput value={input.years} onChange={(v) => set({ years: v })} />
          </Field>
          <p style={S.hint}>
            Works for a single lump sum only — a starting balance that grew (or shrank) to an ending balance with no
            deposits or withdrawals in between. Partial years are fine (e.g. 2.5).
          </p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Annualized return (CAGR)</span>
            <span style={S.bigValue}>{fmtPct(result.annualizedReturnPct)}</span>
            <span style={S.bigSub}>
              per year, from {fmtUSD(input.beginningValue)} to {fmtUSD(input.endingValue)} over {input.years || 0}{" "}
              {input.years === 1 ? "year" : "years"}
            </span>
          </div>

          <div style={S.statRow}>
            <Stat label="Total return" value={fmtPct(result.totalReturnPct)} />
            <Stat label="Simple average annual return" value={fmtPct(result.simpleAverageAnnualPct)} />
          </div>

          <div style={{ ...S.aprBox, ...(showGap ? S.aprWarn : S.aprOk) }}>
            <span style={S.aprLabel}>Why CAGR and the simple average differ</span>
            <span style={S.aprValue}>{fmtPct(result.gapPct)} gap</span>
            <span style={S.aprNote}>
              {showGap
                ? `The simple average (${fmtPct(result.simpleAverageAnnualPct)}) just divides your total return evenly across ${input.years || 0} years. CAGR (${fmtPct(result.annualizedReturnPct)}) accounts for compounding instead, which is why it reads lower whenever the path between your starting and ending value wasn't a smooth, identical gain every year.`
                : "At this total return and holding period, CAGR and the simple average land within a tenth of a percent of each other — the compounding effect only widens the gap over a longer period or a larger total return."}
            </span>
          </div>

          <div style={S.disclaimer}>
            Estimate only. This calculator assumes one lump sum growing (or shrinking) with no added contributions or
            withdrawals along the way. If you added or withdrew money during the period, CAGR will not match your
            actual return — that instead needs a money-weighted (internal rate of return) calculation.
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
function YearsInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={S.suffixWrap}>
      <input
        style={S.input}
        inputMode="decimal"
        value={value === 0 ? "" : value}
        placeholder="0"
        onChange={(e) => onChange(Math.max(0, Number(e.target.value.replace(/[^0-9.]/g, ""))))}
        aria-label="Years"
      />
      <span style={S.suffix}>yrs</span>
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
