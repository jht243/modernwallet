import { useMemo, useState } from "react";
import { maxSustainableWithdrawal, withdrawalSchedule } from "../lib/investment";
import { fmtUSD } from "../lib/format";

// InvestmentIQ "reverse withdrawal" island — the inverse of the forward withdrawal-calculator tool.
// Given a balance, an expected return, and how many years the money needs to last, solves for the
// maximum flat monthly withdrawal that exactly depletes the balance by the end of that horizon.
// Standalone, additive island (registered under its own CalculatorIsland key) — does not touch or
// replace the existing InvestmentCalculator component or any page that already uses it.

interface Props {
  initialData?: Record<string, unknown>;
  heading?: string;
  subheading?: string;
}

export default function WithdrawalReverseCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState({
    currentBalance: n(initialData?.currentBalance, 500000),
    annualReturnPct: n(initialData?.annualReturnPct, 6),
    years: n(initialData?.years, 30),
  });
  const [showSchedule, setShowSchedule] = useState(false);
  const set = (p: Partial<typeof v>) => setV((s) => ({ ...s, ...p }));

  const maxWithdrawal = useMemo(
    () => maxSustainableWithdrawal(v.currentBalance, v.annualReturnPct, v.years),
    [v.currentBalance, v.annualReturnPct, v.years],
  );
  const schedule = useMemo(
    () => (maxWithdrawal ? withdrawalSchedule(v.currentBalance, v.annualReturnPct, v.years, maxWithdrawal) : []),
    [v.currentBalance, v.annualReturnPct, v.years, maxWithdrawal],
  );
  const annualWithdrawal = maxWithdrawal != null ? maxWithdrawal * 12 : null;
  const initialRatePct = annualWithdrawal != null && v.currentBalance > 0 ? (annualWithdrawal / v.currentBalance) * 100 : null;

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
          <Field label="Current balance"><Money v={v.currentBalance} on={(x) => set({ currentBalance: x })} /></Field>
          <div style={S.row2}>
            <Field label="Annual return %"><Pct v={v.annualReturnPct} on={(x) => set({ annualReturnPct: x })} /></Field>
            <Field label="Years it should last"><Plain v={v.years} on={(x) => set({ years: x })} /></Field>
          </div>
        </div>
        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>You can withdraw</span>
            <span style={S.bigValue}>{maxWithdrawal != null ? fmtUSD(maxWithdrawal) : "—"}<span style={S.per}>/mo</span></span>
            <span style={S.bigSub}>for {v.years} years before the balance hits $0</span>
          </div>
          <div style={S.statRow}>
            <Stat label="Per year" value={annualWithdrawal != null ? fmtUSD(annualWithdrawal) : "—"} />
            <Stat label="Initial withdrawal rate" value={initialRatePct != null ? `${initialRatePct.toFixed(2)}%` : "—"} />
          </div>
          {schedule.length > 0 && (
            <button style={S.toggle} type="button" onClick={() => setShowSchedule((x) => !x)}>
              {showSchedule ? "Hide" : "Show"} year-by-year balance
            </button>
          )}
        </div>
      </div>

      {showSchedule && schedule.length > 0 && (
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead><tr><th style={S.th}>Year</th><th style={{ ...S.th, ...S.right }}>Balance</th><th style={{ ...S.th, ...S.right }}>Total withdrawn</th></tr></thead>
            <tbody>
              {schedule.filter((row) => row.year <= 5 || row.year % 5 === 0 || row.year === schedule.length).map((row) => (
                <tr key={row.year}>
                  <td style={S.td}>{row.year}</td>
                  <td style={{ ...S.td, ...S.right }}>{fmtUSD(row.balance)}</td>
                  <td style={{ ...S.td, ...S.right }}>{fmtUSD(row.totalWithdrawn)}</td>
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
  per: { fontSize: "1rem", fontWeight: 600, color: "#777" },
  bigSub: { fontSize: "0.82rem", color: "#777" },
  statRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  stat: { display: "flex", flexDirection: "column", gap: 1 },
  statLabel: { fontSize: "0.78rem", color: "#666" },
  statValue: { fontSize: "1.12rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  toggle: { marginTop: 2, padding: "9px 12px", border: "1px solid #CFE3DC", background: "#fff", borderRadius: 8, fontSize: "0.88rem", fontWeight: 600, color: PRIMARY, cursor: "pointer" },
  tableWrap: { marginTop: 18, overflowX: "auto", border: "1px solid #EAEFED", borderRadius: 10 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" },
  th: { textAlign: "left", padding: "10px 12px", background: "#F4FAF8", fontWeight: 700, color: "#2A6A58", borderBottom: "1px solid #E0EBE7" },
  td: { padding: "8px 12px", borderBottom: "1px solid #F0F4F2", fontVariantNumeric: "tabular-nums" },
  right: { textAlign: "right" },
};
