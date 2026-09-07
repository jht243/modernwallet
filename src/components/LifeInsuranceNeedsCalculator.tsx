import { useMemo, useState } from "react";
import { computeLifeInsuranceNeeds, type LifeInsuranceNeedsInput } from "../lib/life-insurance-needs";
import { fmtUSD } from "../lib/format";

// Life insurance needs island. Most free "how much life insurance do I need" calculators stop at
// a flat income multiple (e.g. "10x your income"). This one present-values the income-replacement
// years at a stated real discount rate, then nets out debt, final expenses, an education fund,
// existing coverage, and liquid savings — a defensible needs-based (human life value) estimate
// with every assumption named on-page. Standalone, no host coupling (mirrors InterestPerDayCalculator).

interface Props {
  initialData?: Partial<LifeInsuranceNeedsInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: LifeInsuranceNeedsInput = {
  annualIncome: 70000,
  yearsToReplace: 15,
  otherDebt: 10000,
  mortgageBalance: 250000,
  finalExpenses: 15000,
  educationFund: 60000,
  existingCoverage: 50000,
  liquidSavings: 30000,
};

export default function LifeInsuranceNeedsCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<LifeInsuranceNeedsInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => computeLifeInsuranceNeeds(input), [input]);
  const set = (patch: Partial<LifeInsuranceNeedsInput>) => setInput((s) => ({ ...s, ...patch }));

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
          <Field label="Annual income to replace">
            <MoneyInput value={input.annualIncome} onChange={(v) => set({ annualIncome: v })} />
          </Field>
          <Field label="Years of income replacement needed">
            <NumInput value={input.yearsToReplace} onChange={(v) => set({ yearsToReplace: v })} />
          </Field>
          <Field label="Other debt to pay off (cards, auto, student loans)">
            <MoneyInput value={input.otherDebt} onChange={(v) => set({ otherDebt: v })} />
          </Field>
          <Field label="Remaining mortgage balance">
            <MoneyInput value={input.mortgageBalance} onChange={(v) => set({ mortgageBalance: v })} />
          </Field>
          <Field label="Final expenses (funeral, estate settlement)">
            <MoneyInput value={input.finalExpenses} onChange={(v) => set({ finalExpenses: v })} />
          </Field>
          <Field label="Education fund to cover (all children)">
            <MoneyInput value={input.educationFund} onChange={(v) => set({ educationFund: v })} />
          </Field>
          <Field label="Existing life insurance coverage">
            <MoneyInput value={input.existingCoverage} onChange={(v) => set({ existingCoverage: v })} />
          </Field>
          <Field label="Liquid savings and investments">
            <MoneyInput value={input.liquidSavings} onChange={(v) => set({ liquidSavings: v })} />
          </Field>
          <p style={S.hint}>
            Income replacement is present-valued at a 3% real annual return, not a flat multiple — the same conservative assumption a fee-only planner commonly uses for a needs-based estimate.
          </p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Recommended coverage</span>
            <span style={S.bigValue}>{fmtUSD(result.recommendedCoverage)}</span>
            <span style={S.bigSub}>on top of any coverage you already carry</span>
          </div>

          <div style={S.statRow}>
            <Stat label="Income replacement (present value)" value={fmtUSD(result.incomeReplacementPV)} />
            <Stat label="Debt + final expenses + education" value={fmtUSD(result.obligationsTotal)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Existing coverage + savings (subtracted)" value={fmtUSD(result.resourcesTotal)} />
          </div>

          <div style={S.disclaimer}>
            Estimate only, not a policy quote or financial advice. Assumes a 3% real annual
            return on the income-replacement years; a different assumed return changes the
            present-value figure. Underwriting, health rating, and the insurer's own pricing
            determine your actual premium — get a quote from a licensed insurer or agent for
            your exact cost.
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
function NumInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      style={S.input}
      inputMode="numeric"
      value={value === 0 ? "" : value}
      placeholder="0"
      onChange={(e) => onChange(e.target.value === "" ? 0 : Math.max(0, Number(e.target.value.replace(/[^0-9.]/g, ""))))}
      aria-label="Years"
    />
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
  disclaimer: { fontSize: "0.76rem", color: "#7a8783", lineHeight: 1.5, marginTop: 2 },
};
