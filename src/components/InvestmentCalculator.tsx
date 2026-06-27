import { useMemo, useState } from "react";
import { computeInvestment, type InvestmentInput } from "../lib/investment";
import { fmtUSD, fmtPct } from "../lib/format";

// InvestmentIQ island. Default "growth" view (future value); "goal" view (monthly needed to hit a
// target) when initialData.goalMode is set. Optional compounding-frequency control for compound
// interest. Fully standalone — no external host coupling.

interface Props {
  initialData?: Record<string, unknown> & { goalMode?: boolean; showFrequency?: boolean };
  heading?: string;
  subheading?: string;
}

const FREQ = [
  { label: "Annually", value: 1 },
  { label: "Quarterly", value: 4 },
  { label: "Monthly", value: 12 },
  { label: "Daily", value: 365 },
];

export default function InvestmentCalculator({ initialData, heading, subheading }: Props) {
  const goalMode = Boolean(initialData?.goalMode);
  const showFrequency = Boolean(initialData?.showFrequency);
  const [v, setV] = useState<InvestmentInput>({
    currentBalance: n(initialData?.currentBalance, goalMode ? 20000 : 10000),
    monthlyContribution: n(initialData?.monthlyContribution, goalMode ? 0 : 500),
    annualReturnPct: n(initialData?.annualReturnPct, goalMode ? 7 : 7),
    years: n(initialData?.years, goalMode ? 30 : 20),
    compoundsPerYear: n(initialData?.compoundsPerYear, 12),
    targetAmount: n(initialData?.targetAmount, goalMode ? 1000000 : 0),
  });
  const [showSchedule, setShowSchedule] = useState(false);
  const r = useMemo(() => computeInvestment(v), [v]);
  const set = (p: Partial<InvestmentInput>) => setV((s) => ({ ...s, ...p }));

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
          {goalMode ? (
            <Field label="Savings goal"><Money v={v.targetAmount ?? 0} on={(x) => set({ targetAmount: x })} /></Field>
          ) : (
            <Field label="Starting balance"><Money v={v.currentBalance} on={(x) => set({ currentBalance: x })} /></Field>
          )}
          {goalMode ? (
            <Field label="Starting balance"><Money v={v.currentBalance} on={(x) => set({ currentBalance: x })} /></Field>
          ) : (
            <Field label="Monthly contribution"><Money v={v.monthlyContribution} on={(x) => set({ monthlyContribution: x })} /></Field>
          )}
          <div style={S.row2}>
            <Field label="Annual return %"><Pct v={v.annualReturnPct} on={(x) => set({ annualReturnPct: x })} /></Field>
            <Field label="Years"><Plain v={v.years} on={(x) => set({ years: x })} /></Field>
          </div>
          {showFrequency && (
            <Field label="Compounding frequency">
              <select style={S.input} value={v.compoundsPerYear} onChange={(e) => set({ compoundsPerYear: Number(e.target.value) })}>
                {FREQ.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </Field>
          )}
        </div>

        <div style={S.results}>
          {goalMode ? (
            <div style={S.bigStat}>
              <span style={S.bigLabel}>You need to save</span>
              <span style={S.bigValue}>{fmtUSD(r.monthlyNeededForTarget)}<span style={S.per}>/mo</span></span>
              <span style={S.bigSub}>to reach {fmtUSD(r.targetAmount)} in {v.years} years</span>
            </div>
          ) : (
            <div style={S.bigStat}>
              <span style={S.bigLabel}>Future value</span>
              <span style={S.bigValue}>{fmtUSD(r.futureValue)}</span>
              <span style={S.bigSub}>after {v.years} years at {v.annualReturnPct}%</span>
            </div>
          )}
          <div style={S.statRow}>
            <Stat label="You put in" value={fmtUSD(r.totalContributions)} />
            <Stat label="Investment growth" value={fmtUSD(r.totalGrowth)} />
          </div>
          {!goalMode && r.totalGrowth != null && r.futureValue != null && r.futureValue > 0 && (
            <div style={S.barWrap} aria-hidden="true">
              <div style={S.barTrack}>
                <div style={{ ...S.barA, width: `${Math.round(((r.totalContributions ?? 0) / r.futureValue) * 100)}%` }} />
                <div style={{ ...S.barB, width: `${Math.round((r.totalGrowth / r.futureValue) * 100)}%` }} />
              </div>
              <div style={S.barLegend}>
                <span><span style={{ ...S.dot, background: PRIMARY }} /> Contributions</span>
                <span><span style={{ ...S.dot, background: ACCENT }} /> Growth</span>
              </div>
            </div>
          )}
          {goalMode && r.progressPct != null && (
            <div style={S.note}>At your current pace, the starting balance alone reaches {fmtPct(r.progressPct, 0)} of the goal.</div>
          )}
          {r.schedule.length > 0 && (
            <button style={S.toggle} type="button" onClick={() => setShowSchedule((x) => !x)}>
              {showSchedule ? "Hide" : "Show"} year-by-year growth
            </button>
          )}
        </div>
      </div>

      {showSchedule && r.schedule.length > 0 && (
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead><tr><th style={S.th}>Year</th><th style={{ ...S.th, ...S.right }}>Balance</th><th style={{ ...S.th, ...S.right }}>Contributions</th><th style={{ ...S.th, ...S.right }}>Growth</th></tr></thead>
            <tbody>
              {r.schedule.filter((row) => row.year <= 5 || row.year % 5 === 0 || row.year === r.schedule.length).map((row) => (
                <tr key={row.year}>
                  <td style={S.td}>{row.year}</td>
                  <td style={{ ...S.td, ...S.right }}>{fmtUSD(row.balance)}</td>
                  <td style={{ ...S.td, ...S.right }}>{fmtUSD(row.contributions)}</td>
                  <td style={{ ...S.td, ...S.right }}>{fmtUSD(row.growth)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label style={S.field}><span style={S.label}>{label}</span>{children}</label>;
}
function Money({ v, on }: { v: number; on: (n: number) => void }) {
  return (
    <div style={S.suffixWrap}>
      <span style={S.prefix}>$</span>
      <input style={{ ...S.input, paddingLeft: 22 }} inputMode="numeric" value={v === 0 ? "" : v.toLocaleString("en-US")} placeholder="0" onChange={(e) => on(parse(e.target.value))} />
    </div>
  );
}
function Pct({ v, on }: { v: number; on: (n: number) => void }) {
  return <div style={S.suffixWrap}><input style={S.input} inputMode="decimal" value={v} onChange={(e) => on(parse(e.target.value))} /><span style={S.suffix}>%</span></div>;
}
function Plain({ v, on }: { v: number; on: (n: number) => void }) {
  return <input style={S.input} inputMode="numeric" value={v} onChange={(e) => on(parse(e.target.value))} />;
}
function Stat({ label, value }: { label: string; value: string }) {
  return <div style={S.stat}><span style={S.statLabel}>{label}</span><span style={S.statValue}>{value}</span></div>;
}
function parse(s: string): number { if (s === "") return 0; return Math.max(0, Number(s.replace(/[^0-9.]/g, "")) || 0); }
function n(x: unknown, d: number): number { const v = Number(x); return Number.isFinite(v) ? v : d; }

const PRIMARY = "#0E7C66";
const ACCENT = "#E0A43B";
const S: Record<string, React.CSSProperties> = {
  wrap: { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1A1A1A" },
  head: { marginBottom: 16 },
  heading: { fontSize: "1.2rem", fontWeight: 700 },
  subheading: { fontSize: "0.95rem", color: "#555", marginTop: 2 },
  grid: { display: "grid", gridTemplateColumns: "minmax(260px, 1fr) minmax(260px, 1fr)", gap: 24 },
  inputs: { display: "flex", flexDirection: "column", gap: 12 },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#444" },
  input: { width: "100%", padding: "10px 12px", fontSize: "1rem", border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A" },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  suffix: { position: "absolute", right: 12, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12, alignSelf: "start" },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 10, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "1.9rem", fontWeight: 800, color: PRIMARY, letterSpacing: "-0.02em" },
  per: { fontSize: "1rem", fontWeight: 600, color: "#777" },
  bigSub: { fontSize: "0.82rem", color: "#777" },
  statRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  stat: { display: "flex", flexDirection: "column", gap: 1 },
  statLabel: { fontSize: "0.78rem", color: "#666" },
  statValue: { fontSize: "1.12rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  barWrap: { marginTop: 2 },
  barTrack: { display: "flex", height: 10, borderRadius: 6, overflow: "hidden", background: "#EEF4F2" },
  barA: { background: PRIMARY, height: "100%" },
  barB: { background: ACCENT, height: "100%" },
  barLegend: { display: "flex", gap: 16, fontSize: "0.78rem", color: "#555", marginTop: 6 },
  dot: { display: "inline-block", width: 9, height: 9, borderRadius: 3, marginRight: 5, verticalAlign: "middle" },
  note: { fontSize: "0.85rem", color: "#5a6b66", background: "#F1F8F5", border: "1px solid #DCECE6", borderRadius: 8, padding: "10px 12px", lineHeight: 1.5 },
  toggle: { marginTop: 2, padding: "9px 12px", border: "1px solid #CFE3DC", background: "#fff", borderRadius: 8, fontSize: "0.88rem", fontWeight: 600, color: PRIMARY, cursor: "pointer" },
  tableWrap: { marginTop: 18, overflowX: "auto", border: "1px solid #EAEFED", borderRadius: 10 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" },
  th: { textAlign: "left", padding: "10px 12px", background: "#F4FAF8", fontWeight: 700, color: "#2A6A58", borderBottom: "1px solid #E0EBE7" },
  td: { padding: "8px 12px", borderBottom: "1px solid #F0F4F2", fontVariantNumeric: "tabular-nums" },
  right: { textAlign: "right" },
};
