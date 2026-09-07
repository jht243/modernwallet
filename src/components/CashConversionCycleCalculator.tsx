import { useMemo, useState } from "react";
import { computeCashConversionCycle, type CashConversionCycleInput } from "../lib/cash-conversion-cycle";
import { fmtNum } from "../lib/format";

// Cash conversion cycle island (DIO + DSO - DPO). Built for the business-financing vertical: a
// long CCC is exactly the gap a merchant cash advance, factoring, or line of credit is priced to
// bridge, so this tool gives that reader the actual number their financing choice depends on.
// Standalone, no host coupling (mirrors InterestPerDayCalculator).

interface Props {
  initialData?: Partial<CashConversionCycleInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: CashConversionCycleInput = {
  cogs: 600000,
  averageInventory: 90000,
  revenue: 1000000,
  averageReceivables: 110000,
  averagePayables: 70000,
  periodDays: 365,
};

export default function CashConversionCycleCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<CashConversionCycleInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => computeCashConversionCycle(input), [input]);
  const set = (patch: Partial<CashConversionCycleInput>) => setInput((s) => ({ ...s, ...patch }));

  const isLong = (result.cashConversionCycle ?? 0) > 60;

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
          <Field label="Cost of goods sold (period)">
            <MoneyInput value={input.cogs} onChange={(v) => set({ cogs: v })} />
          </Field>
          <Field label="Average inventory">
            <MoneyInput value={input.averageInventory} onChange={(v) => set({ averageInventory: v })} />
          </Field>
          <Field label="Revenue (period)">
            <MoneyInput value={input.revenue} onChange={(v) => set({ revenue: v })} />
          </Field>
          <Field label="Average accounts receivable">
            <MoneyInput value={input.averageReceivables} onChange={(v) => set({ averageReceivables: v })} />
          </Field>
          <Field label="Average accounts payable">
            <MoneyInput value={input.averagePayables} onChange={(v) => set({ averagePayables: v })} />
          </Field>
          <Field label="Days in period">
            <NumInput value={input.periodDays} onChange={(v) => set({ periodDays: v })} />
          </Field>
          <p style={S.hint}>
            Use 365 for a full year or 90 for a quarter. All figures should cover the same period.
          </p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Cash conversion cycle</span>
            <span style={S.bigValue}>{fmtNum(result.cashConversionCycle, 1)} days</span>
            <span style={S.bigSub}>time cash is tied up before it comes back in</span>
          </div>

          <div style={S.statRow}>
            <Stat label="Days inventory outstanding" value={fmtNum(result.daysInventoryOutstanding, 1)} />
            <Stat label="Days sales outstanding" value={fmtNum(result.daysSalesOutstanding, 1)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Days payable outstanding" value={fmtNum(result.daysPayableOutstanding, 1)} />
          </div>

          <div style={{ ...S.aprBox, ...(isLong ? S.aprWarn : S.aprOk) }}>
            <span style={S.aprLabel}>What this means</span>
            <span style={S.aprNote}>
              {isLong
                ? "A cash conversion cycle over 60 days means cash stays tied up in inventory and receivables for two months or more before it returns — exactly the gap short-term financing like a line of credit or invoice factoring is priced to bridge."
                : "A shorter cash conversion cycle means cash returns from operations quickly, reducing how much external financing the business needs to fund its day-to-day cycle."}
            </span>
          </div>

          <div style={S.disclaimer}>
            Estimate only. Uses average balances for the period you enter; a business with sharp
            seasonal swings should check inventory and receivables at several points in the year
            rather than a single snapshot.
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
      placeholder="365"
      onChange={(e) => onChange(e.target.value === "" ? 0 : Math.max(1, Number(e.target.value.replace(/[^0-9.]/g, ""))))}
      aria-label="Days in period"
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
  aprBox: { borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 1, border: "1px solid #E0EBE7", background: "#fff" },
  aprOk: { background: "#EAF7F1", borderColor: "#BFE6D7" },
  aprWarn: { background: "#FBF4E4", borderColor: "#F0DEB4" },
  aprLabel: { fontSize: "0.78rem", fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: "0.03em" },
  aprNote: { fontSize: "0.8rem", color: "#777" },
  disclaimer: { fontSize: "0.76rem", color: "#7a8783", lineHeight: 1.5, marginTop: 2 },
};
