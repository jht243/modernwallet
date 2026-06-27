import { useMemo, useState } from "react";
import { computePortfolio, type PortfolioInput } from "../lib/portfolio";
import { fmtUSD, fmtPct, fmtNum } from "../lib/format";

// PortfolioIQ island. Asset-allocation analysis: weighted expected return, volatility, Sharpe ratio,
// a likely 1-year range, and a long-run growth projection. Fully standalone — no host coupling.

interface Props {
  initialData?: Partial<PortfolioInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: PortfolioInput = {
  stocks: 60000, bonds: 30000, realEstate: 0, cash: 10000, monthlyContribution: 500, years: 20,
};

const SLICE_COLORS: Record<string, string> = {
  Stocks: "#0E7C66", Bonds: "#E0A43B", "Real estate": "#3B7CE0", Cash: "#9AA6A2",
};

export default function PortfolioCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<PortfolioInput>({ ...DEFAULTS, ...initialData });
  const [showSchedule, setShowSchedule] = useState(false);
  const r = useMemo(() => computePortfolio(v), [v]);
  const set = (p: Partial<PortfolioInput>) => setV((s) => ({ ...s, ...p }));

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
          <div style={S.groupTitle}>Your holdings</div>
          <div style={S.row2}>
            <Field label="Stocks"><Money v={v.stocks} on={(x) => set({ stocks: x })} /></Field>
            <Field label="Bonds"><Money v={v.bonds} on={(x) => set({ bonds: x })} /></Field>
          </div>
          <div style={S.row2}>
            <Field label="Real estate"><Money v={v.realEstate ?? 0} on={(x) => set({ realEstate: x })} /></Field>
            <Field label="Cash"><Money v={v.cash} on={(x) => set({ cash: x })} /></Field>
          </div>
          <div style={S.row2}>
            <Field label="Monthly contribution"><Money v={v.monthlyContribution ?? 0} on={(x) => set({ monthlyContribution: x })} /></Field>
            <Field label="Years"><Plain v={v.years ?? 0} on={(x) => set({ years: x })} /></Field>
          </div>
        </div>

        <div style={S.results}>
          <div style={S.bigRow}>
            <div style={S.bigStat}>
              <span style={S.bigLabel}>Expected return</span>
              <span style={S.bigValue}>{fmtPct(r.expectedReturnPct, 2)}</span>
            </div>
            <div style={S.bigStat}>
              <span style={S.bigLabel}>Volatility (risk)</span>
              <span style={{ ...S.bigValue, fontSize: "1.5rem", color: "#9a6a1e" }}>{fmtPct(r.volatilityPct, 2)}</span>
            </div>
          </div>

          {r.allocation.length > 0 && (
            <div style={S.barWrap} aria-hidden="true">
              <div style={S.barTrack}>
                {r.allocation.map((a) => (
                  <div key={a.key} style={{ width: `${a.weightPct}%`, background: SLICE_COLORS[a.label] ?? "#888", height: "100%" }} title={`${a.label} ${a.weightPct}%`} />
                ))}
              </div>
              <div style={S.barLegend}>
                {r.allocation.map((a) => (
                  <span key={a.key}><span style={{ ...S.dot, background: SLICE_COLORS[a.label] ?? "#888" }} /> {a.label} {fmtPct(a.weightPct, 0)}</span>
                ))}
              </div>
            </div>
          )}

          <div style={S.statRow}>
            <Stat label="Sharpe ratio" value={r.sharpeRatio == null ? "—" : fmtNum(r.sharpeRatio, 2)} />
            <Stat label="Portfolio value" value={fmtUSD(r.total)} />
          </div>
          <div style={S.note}>
            A typical year could range from <strong>{fmtUSD(r.oneYearWorst)}</strong> to <strong>{fmtUSD(r.oneYearBest)}</strong> (expected return ± one standard deviation). Higher Sharpe = more return per unit of risk.
          </div>

          {(v.years ?? 0) > 0 && (
            <div style={S.proj}>
              <Stat label={`Projected in ${v.years} years`} value={fmtUSD(r.projectedValue)} />
              <Stat label="Growth" value={fmtUSD(r.projectedGrowth)} />
            </div>
          )}
          {r.schedule.length > 0 && (
            <button style={S.toggle} type="button" onClick={() => setShowSchedule((x) => !x)}>
              {showSchedule ? "Hide" : "Show"} year-by-year projection
            </button>
          )}
        </div>
      </div>

      {showSchedule && r.schedule.length > 0 && (
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead><tr><th style={S.th}>Year</th><th style={{ ...S.th, ...S.right }}>Projected value</th></tr></thead>
            <tbody>
              {r.schedule.filter((row) => row.year <= 5 || row.year % 5 === 0 || row.year === r.schedule.length).map((row) => (
                <tr key={row.year}><td style={S.td}>{row.year}</td><td style={{ ...S.td, ...S.right }}>{fmtUSD(row.balance)}</td></tr>
              ))}
            </tbody>
          </table>
          <p style={S.tableNote}>Projection uses the portfolio's weighted expected return. Real returns vary year to year.</p>
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
function Plain({ v, on }: { v: number; on: (n: number) => void }) {
  return <input style={S.input} inputMode="numeric" value={v} onChange={(e) => on(parse(e.target.value))} />;
}
function Stat({ label, value }: { label: string; value: string }) {
  return <div style={S.stat}><span style={S.statLabel}>{label}</span><span style={S.statValue}>{value}</span></div>;
}
function parse(s: string): number { if (s === "") return 0; return Math.max(0, Number(s.replace(/[^0-9.]/g, "")) || 0); }

const PRIMARY = "#0E7C66";
const S: Record<string, React.CSSProperties> = {
  wrap: { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1A1A1A" },
  head: { marginBottom: 16 },
  heading: { fontSize: "1.2rem", fontWeight: 700 },
  subheading: { fontSize: "0.95rem", color: "#555", marginTop: 2 },
  grid: { display: "grid", gridTemplateColumns: "minmax(260px, 1fr) minmax(260px, 1fr)", gap: 24 },
  inputs: { display: "flex", flexDirection: "column", gap: 10 },
  groupTitle: { fontSize: "0.78rem", fontWeight: 700, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#444" },
  input: { width: "100%", padding: "10px 12px", fontSize: "1rem", border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A" },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12, alignSelf: "start" },
  bigRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, paddingBottom: 10, borderBottom: "1px solid #E6F0EC" },
  bigStat: { display: "flex", flexDirection: "column", gap: 2 },
  bigLabel: { fontSize: "0.78rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "1.7rem", fontWeight: 800, color: PRIMARY, letterSpacing: "-0.02em" },
  barWrap: { marginTop: 2 },
  barTrack: { display: "flex", height: 12, borderRadius: 6, overflow: "hidden", background: "#EEF4F2" },
  barLegend: { display: "flex", gap: 14, flexWrap: "wrap", fontSize: "0.78rem", color: "#555", marginTop: 6 },
  dot: { display: "inline-block", width: 9, height: 9, borderRadius: 3, marginRight: 5, verticalAlign: "middle" },
  statRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  stat: { display: "flex", flexDirection: "column", gap: 1 },
  statLabel: { fontSize: "0.78rem", color: "#666" },
  statValue: { fontSize: "1.12rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  note: { fontSize: "0.83rem", color: "#5a6b66", background: "#F1F8F5", border: "1px solid #DCECE6", borderRadius: 8, padding: "10px 12px", lineHeight: 1.5 },
  proj: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, paddingTop: 4, borderTop: "1px solid #E6F0EC" },
  toggle: { marginTop: 2, padding: "9px 12px", border: "1px solid #CFE3DC", background: "#fff", borderRadius: 8, fontSize: "0.88rem", fontWeight: 600, color: PRIMARY, cursor: "pointer" },
  tableWrap: { marginTop: 18, overflowX: "auto", border: "1px solid #EAEFED", borderRadius: 10 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" },
  th: { textAlign: "left", padding: "10px 12px", background: "#F4FAF8", fontWeight: 700, color: "#2A6A58", borderBottom: "1px solid #E0EBE7" },
  td: { padding: "8px 12px", borderBottom: "1px solid #F0F4F2", fontVariantNumeric: "tabular-nums" },
  right: { textAlign: "right" },
  tableNote: { fontSize: "0.78rem", color: "#888", padding: "8px 12px", margin: 0 },
};
