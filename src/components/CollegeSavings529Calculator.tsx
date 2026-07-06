import { useMemo, useState } from "react";
import { computeCollegeSavings, type CollegeSavingsInput } from "../lib/college-savings";
import { fmtUSD } from "../lib/format";

// 529 / college-savings calculator island. Projects a 529 balance to college start; when a college
// cost target is entered, adds inflation-adjusted cost, coverage %, funding gap, and the monthly
// contribution needed to fully fund it. Standalone — mirrors TrumpAccountCalculator/InvestmentCalculator.

interface Props {
  initialData?: Record<string, unknown>;
  heading?: string;
  subheading?: string;
}

export default function CollegeSavings529Calculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<CollegeSavingsInput>({
    childCurrentAge: n(initialData?.childCurrentAge, 0),
    currentBalance: n(initialData?.currentBalance, 0),
    monthlyContribution: n(initialData?.monthlyContribution, 300),
    annualReturnPct: n(initialData?.annualReturnPct, 6),
    collegeCostToday: n(initialData?.collegeCostToday, 0),
    costInflationPct: n(initialData?.costInflationPct, 5),
  });
  const [showSchedule, setShowSchedule] = useState(false);
  const r = useMemo(() => computeCollegeSavings(v), [v]);
  const set = (p: Partial<CollegeSavingsInput>) => setV((s) => ({ ...s, ...p }));

  const matured = r.yearsToCollege === 0;
  const bal = r.projectedBalance ?? 0;
  const contribShare = bal > 0 ? Math.round(((r.totalContributions ?? 0) / bal) * 100) : 0;
  const growthShare = bal > 0 ? Math.round(((r.totalGrowth ?? 0) / bal) * 100) : 0;
  const hasTarget = (v.collegeCostToday ?? 0) > 0 && r.projectedCollegeCost != null;

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
          <div style={S.row2}>
            <Field label="Child's age now"><Plain v={v.childCurrentAge} max={17} on={(x) => set({ childCurrentAge: x })} /></Field>
            <Field label="Current 529 balance"><Money v={v.currentBalance} on={(x) => set({ currentBalance: x })} /></Field>
          </div>
          <div style={S.row2}>
            <Field label="Monthly contribution"><Money v={v.monthlyContribution} on={(x) => set({ monthlyContribution: x })} /></Field>
            <Field label="Annual return %"><Pct v={v.annualReturnPct} on={(x) => set({ annualReturnPct: x })} /></Field>
          </div>
          <Field label="Total 4-yr college cost today (optional)"><Money v={v.collegeCostToday ?? 0} on={(x) => set({ collegeCostToday: x })} /></Field>
          {hasTarget && (
            <Field label="College-cost inflation %"><Pct v={v.costInflationPct ?? 5} on={(x) => set({ costInflationPct: x })} /></Field>
          )}
        </div>

        <div style={S.results}>
          {matured ? (
            <div style={S.bigStat}>
              <span style={S.bigLabel}>Already college age</span>
              <span style={S.bigValue}>{fmtUSD(r.projectedBalance)}</span>
              <span style={S.bigSub}>Enter a younger age to project 529 growth.</span>
            </div>
          ) : (
            <div style={S.bigStat}>
              <span style={S.bigLabel}>529 balance at college (age 18)</span>
              <span style={S.bigValue}>{fmtUSD(r.projectedBalance)}</span>
              <span style={S.bigSub}>in {r.yearsToCollege} years at {v.annualReturnPct}%</span>
            </div>
          )}
          <div style={S.statRow}>
            <Stat label="You put in" value={fmtUSD(r.totalContributions)} />
            <Stat label="Tax-free growth" value={fmtUSD(r.totalGrowth)} />
          </div>
          {!matured && bal > 0 && (
            <div style={S.barWrap} aria-hidden="true">
              <div style={S.barTrack}>
                <div style={{ ...S.barA, width: `${contribShare}%` }} />
                <div style={{ ...S.barB, width: `${growthShare}%` }} />
              </div>
              <div style={S.barLegend}>
                <span><span style={{ ...S.dot, background: PRIMARY }} /> Contributions</span>
                <span><span style={{ ...S.dot, background: ACCENT }} /> Growth</span>
              </div>
            </div>
          )}
          {hasTarget && (
            <div style={S.goalBox}>
              <div style={S.goalRow}><span>Projected 4-yr cost</span><strong>{fmtUSD(r.projectedCollegeCost)}</strong></div>
              <div style={S.goalRow}><span>You'd cover</span><strong style={{ color: (r.coveragePct ?? 0) >= 100 ? PRIMARY : "#b26a00" }}>{r.coveragePct}%</strong></div>
              {(r.fundingGap ?? 0) > 0 ? (
                <div style={S.goalNote}>Shortfall of {fmtUSD(r.fundingGap)}. Contribute about <strong>{fmtUSD(r.monthlyNeededToFund)}/mo</strong> to fully fund it.</div>
              ) : (
                <div style={{ ...S.goalNote, color: "#2A6A58" }}>On track to fully fund the projected cost. 🎉</div>
              )}
            </div>
          )}
          {r.schedule.length > 0 && (
            <button style={S.toggle} type="button" onClick={() => setShowSchedule((x) => !x)}>
              {showSchedule ? "Hide" : "Show"} year-by-year growth
            </button>
          )}
          <div style={S.disclaimer}>
            Estimate only. Assumes a fixed return compounded monthly and a fixed cost-inflation rate; real
            returns and college costs vary. 529 growth is tax-free when used for qualified education.
          </div>
        </div>
      </div>

      {showSchedule && r.schedule.length > 0 && (
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead><tr>
              <th style={S.th}>Age</th>
              <th style={{ ...S.th, ...S.right }}>Balance</th>
              <th style={{ ...S.th, ...S.right }}>Contributed</th>
              <th style={{ ...S.th, ...S.right }}>Growth</th>
            </tr></thead>
            <tbody>
              {r.schedule
                .filter((row) => row.age <= 5 || row.age % 3 === 0 || row.year === r.schedule.length)
                .map((row) => (
                  <tr key={row.year}>
                    <td style={S.td}>{row.age}</td>
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
function Plain({ v, on, max }: { v: number; on: (n: number) => void; max?: number }) {
  return <input style={S.input} inputMode="numeric" value={v} onChange={(e) => on(clamp(parse(e.target.value), max))} />;
}
function Stat({ label, value }: { label: string; value: string }) {
  return <div style={S.stat}><span style={S.statLabel}>{label}</span><span style={S.statValue}>{value}</span></div>;
}
function parse(s: string): number { if (s === "") return 0; return Math.max(0, Number(s.replace(/[^0-9.]/g, "")) || 0); }
function clamp(n: number, max?: number): number { return typeof max === "number" ? Math.min(n, max) : n; }
function n(x: unknown, d: number): number { const v = Number(x); return Number.isFinite(v) ? v : d; }

const PRIMARY = "#0E7C66";
const ACCENT = "#E0A43B";
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
  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12, alignSelf: "start" },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 10, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "1.9rem", fontWeight: 800, color: PRIMARY, letterSpacing: "-0.02em" },
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
  goalBox: { background: "#F1F8F5", border: "1px solid #DCECE6", borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 6 },
  goalRow: { display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#33443f" },
  goalNote: { fontSize: "0.85rem", color: "#b26a00", lineHeight: 1.5, marginTop: 2 },
  toggle: { marginTop: 2, padding: "9px 12px", border: "1px solid #CFE3DC", background: "#fff", borderRadius: 8, fontSize: "0.88rem", fontWeight: 600, color: PRIMARY, cursor: "pointer" },
  disclaimer: { fontSize: "0.76rem", color: "#7a8783", lineHeight: 1.5, marginTop: 2 },
  tableWrap: { marginTop: 18, overflowX: "auto", border: "1px solid #EAEFED", borderRadius: 10 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" },
  th: { textAlign: "left", padding: "10px 12px", background: "#F4FAF8", fontWeight: 700, color: "#2A6A58", borderBottom: "1px solid #E0EBE7" },
  td: { padding: "8px 12px", borderBottom: "1px solid #F0F4F2", fontVariantNumeric: "tabular-nums" },
  right: { textAlign: "right" },
};
