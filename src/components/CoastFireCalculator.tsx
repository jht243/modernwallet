import { useMemo, useState } from "react";
import { computeCoastFire, type CoastFireInput } from "../lib/coast-fire";
import { fmtUSD, fmtMonths } from "../lib/format";

// Coast FIRE calculator island. Shows whether current savings, left untouched, will compound into
// a full retirement number by the target retirement age (the 25x / 4%-rule "FIRE number") — and if
// not yet there, simulates month-by-month with the user's real contribution to find the actual
// coast date. Standalone — no host coupling (mirrors TrumpAccountCalculator).

interface Props {
  initialData?: Record<string, unknown>;
  heading?: string;
  subheading?: string;
}

export default function CoastFireCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<CoastFireInput>({
    currentAge: n(initialData?.currentAge, 35),
    retirementAge: n(initialData?.retirementAge, 65),
    currentSavings: n(initialData?.currentSavings, 150000),
    monthlyContribution: n(initialData?.monthlyContribution, 500),
    annualReturnPct: n(initialData?.annualReturnPct, 7),
    desiredAnnualSpend: n(initialData?.desiredAnnualSpend, 60000),
    withdrawalRatePct: n(initialData?.withdrawalRatePct, 4),
  });
  const r = useMemo(() => computeCoastFire(v), [v]);
  const set = (p: Partial<CoastFireInput>) => setV((s) => ({ ...s, ...p }));

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
            <Field label="Your age now"><Plain v={v.currentAge} max={99} on={(x) => set({ currentAge: x })} /></Field>
            <Field label="Target retirement age"><Plain v={v.retirementAge} max={100} on={(x) => set({ retirementAge: x })} /></Field>
          </div>
          <Field label="Current retirement savings"><Money v={v.currentSavings} on={(x) => set({ currentSavings: x })} /></Field>
          <Field label="Still contributing per month?"><Money v={v.monthlyContribution} on={(x) => set({ monthlyContribution: x })} /></Field>
          <Field label="Expected annual return %"><Pct v={v.annualReturnPct} on={(x) => set({ annualReturnPct: x })} /></Field>
          <Field label="Desired annual retirement spending"><Money v={v.desiredAnnualSpend} on={(x) => set({ desiredAnnualSpend: x })} /></Field>
          <Field label="Safe withdrawal rate % (4 = the 25x rule)"><Pct v={v.withdrawalRatePct} on={(x) => set({ withdrawalRatePct: x })} /></Field>
          {v.retirementAge <= v.currentAge && (
            <div style={S.warn}>⚠️ Retirement age must be after your current age — using age {v.currentAge + 1} to calculate below.</div>
          )}
        </div>

        <div style={S.results}>
          {r.hasReachedCoastFire ? (
            <div style={S.bigStat}>
              <span style={{ ...S.bigLabel, color: PRIMARY }}>You've reached Coast FIRE</span>
              <span style={S.bigValue}>{fmtUSD(r.projectedNoContribValue)}</span>
              <span style={S.bigSub}>projected at age {v.retirementAge} with zero more contributions — {fmtUSD(r.surplus)} above your {fmtUSD(r.fireNumber)} number</span>
            </div>
          ) : (
            <div style={S.bigStat}>
              <span style={S.bigLabel}>Coast number today</span>
              <span style={S.bigValue}>{fmtUSD(r.coastNumberToday)}</span>
              <span style={S.bigSub}>you need this much invested today, untouched, to hit {fmtUSD(r.fireNumber)} by age {v.retirementAge}</span>
            </div>
          )}
          <div style={S.statRow}>
            <Stat label="Your FIRE number" value={fmtUSD(r.fireNumber)} />
            <Stat label={r.hasReachedCoastFire ? "Surplus" : "Gap to coast today"} value={fmtUSD(r.hasReachedCoastFire ? r.surplus : r.gapToday)} />
          </div>
          {!r.hasReachedCoastFire && v.monthlyContribution > 0 && (
            <div style={S.note}>
              {r.monthsToCoast != null
                ? <>At {fmtUSD(v.monthlyContribution)}/mo, you'd reach Coast FIRE in about <strong>{fmtMonths(r.monthsToCoast)}</strong> (age {r.ageAtCoast}).</>
                : <>At {fmtUSD(v.monthlyContribution)}/mo and {v.annualReturnPct}% growth, you won't reach Coast FIRE before age {v.retirementAge} — try a higher contribution or return.</>}
            </div>
          )}
          <div style={S.disclaimer}>
            Estimate only. The FIRE number uses the safe-withdrawal-rate rule (spend ÷ rate — 4% is the commonly used "25x" default); a fixed return is assumed, but real markets vary year to year.
          </div>
        </div>
      </div>
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
  warn: { fontSize: "0.82rem", color: "#8a5a00", background: "#FDF6E7", border: "1px solid #F0DFB0", borderRadius: 8, padding: "9px 11px", lineHeight: 1.45 },
  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12, alignSelf: "start" },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 10, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "1.9rem", fontWeight: 800, color: PRIMARY, letterSpacing: "-0.02em" },
  bigSub: { fontSize: "0.82rem", color: "#777" },
  statRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  stat: { display: "flex", flexDirection: "column", gap: 1 },
  statLabel: { fontSize: "0.78rem", color: "#666" },
  statValue: { fontSize: "1.12rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  note: { fontSize: "0.86rem", color: "#2A6A58", background: "#EEF7F3", border: "1px solid #D8EEE6", borderRadius: 8, padding: "9px 11px", lineHeight: 1.5 },
  disclaimer: { fontSize: "0.76rem", color: "#7a8783", lineHeight: 1.5, marginTop: 2 },
};
