import { useMemo, useState } from "react";
import { computeNetWorth, type NetWorthInput } from "../lib/net-worth";
import { fmtUSD, fmtPct } from "../lib/format";

// WealthCheck island: a balance sheet that adds up assets and subtracts liabilities, with an
// optional age benchmark from the Federal Reserve SCF (median by age).
// Fully standalone — no external host coupling.

interface Props {
  initialData?: Partial<NetWorthInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: NetWorthInput = {
  cash: 15000, investments: 40000, retirement: 120000, realEstate: 350000, vehicles: 25000, otherAssets: 0,
  mortgage: 250000, autoLoans: 18000, studentLoans: 22000, creditCards: 6000, otherDebt: 0, age: 40,
};

const PRIMARY = "#0E7C66";
const NEGATIVE = "#C0392B";

const ASSETS = [
  { key: "cash", label: "Cash & savings" },
  { key: "investments", label: "Investments (taxable)" },
  { key: "retirement", label: "Retirement accounts" },
  { key: "realEstate", label: "Real estate (market value)" },
  { key: "vehicles", label: "Vehicles" },
  { key: "otherAssets", label: "Other assets" },
] as const;

const LIABILITIES = [
  { key: "mortgage", label: "Mortgage" },
  { key: "autoLoans", label: "Auto loans" },
  { key: "studentLoans", label: "Student loans" },
  { key: "creditCards", label: "Credit cards" },
  { key: "otherDebt", label: "Other debt" },
] as const;

export default function NetWorthCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<NetWorthInput>({ ...DEFAULTS, ...initialData });
  const r = useMemo(() => computeNetWorth(v), [v]);
  const set = (p: Partial<NetWorthInput>) => setV((s) => ({ ...s, ...p }));
  const positive = (r.netWorth ?? 0) >= 0;

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
          <div style={S.groupTitle}>Assets (what you own)</div>
          <div style={S.gridFields}>
            {ASSETS.map((f) => (
              <Field key={f.key} label={f.label}>
                <Money v={(v[f.key as keyof NetWorthInput] as number) ?? 0} on={(x) => set({ [f.key]: x } as Partial<NetWorthInput>)} />
              </Field>
            ))}
          </div>
          <div style={{ ...S.groupTitle, marginTop: 8 }}>Liabilities (what you owe)</div>
          <div style={S.gridFields}>
            {LIABILITIES.map((f) => (
              <Field key={f.key} label={f.label}>
                <Money v={(v[f.key as keyof NetWorthInput] as number) ?? 0} on={(x) => set({ [f.key]: x } as Partial<NetWorthInput>)} />
              </Field>
            ))}
          </div>
          <Field label="Your age (for the benchmark)">
            <Plain v={v.age ?? 0} on={(x) => set({ age: x })} />
          </Field>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Net worth</span>
            <span style={{ ...S.bigValue, color: positive ? PRIMARY : NEGATIVE }}>{fmtUSD(r.netWorth)}</span>
            <span style={S.bigSub}>{fmtUSD(r.totalAssets)} in assets minus {fmtUSD(r.totalLiabilities)} in debt</span>
          </div>

          <div style={S.statRow}>
            <Stat label="Liquid net worth" value={fmtUSD(r.liquidNetWorth)} />
            <Stat label="Debt-to-asset" value={fmtPct(r.debtToAssetPct, 1)} />
          </div>

          {r.medianNetWorthForAge != null && (
            <div style={r.aboveMedian ? S.goodNote : S.warnNote}>
              <strong>Age {v.age} ({r.ageBracket}):</strong> the U.S. median net worth in this bracket
              is <strong>{fmtUSD(r.medianNetWorthForAge)}</strong>. You are{" "}
              <strong>{r.aboveMedian ? "above" : "below"}</strong> the median by{" "}
              <strong>{fmtUSD(Math.abs(r.vsMedian ?? 0))}</strong>.
              <div style={S.benchSrc}>Source: Federal Reserve, 2022 Survey of Consumer Finances (median by age of household head).</div>
            </div>
          )}

          {r.assetBreakdown.length > 0 && (
            <div>
              <div style={S.bdTitle}>Assets breakdown</div>
              {r.assetBreakdown.map((b) => (
                <div key={b.key} style={S.bdRow}>
                  <span>{b.label}</span><span style={S.bdAmt}>{fmtUSD(b.amount)} <span style={S.bdPct}>({fmtPct(b.pct, 0)})</span></span>
                </div>
              ))}
            </div>
          )}
          {r.liabilityBreakdown.length > 0 && (
            <div>
              <div style={S.bdTitle}>Liabilities breakdown</div>
              {r.liabilityBreakdown.map((b) => (
                <div key={b.key} style={S.bdRow}>
                  <span>{b.label}</span><span style={S.bdAmt}>{fmtUSD(b.amount)} <span style={S.bdPct}>({fmtPct(b.pct, 0)})</span></span>
                </div>
              ))}
            </div>
          )}
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
      <input style={{ ...S.input, paddingLeft: 22 }} inputMode="numeric"
        value={v === 0 ? "" : v.toLocaleString("en-US")} placeholder="0"
        onChange={(e) => on(parse(e.target.value))} />
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

const S: Record<string, React.CSSProperties> = {
  wrap: { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1A1A1A" },
  head: { marginBottom: 16 },
  heading: { fontSize: "1.2rem", fontWeight: 700 },
  subheading: { fontSize: "0.95rem", color: "#555", marginTop: 2 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 },
  inputs: { display: "flex", flexDirection: "column", gap: 10 },
  groupTitle: { fontSize: "0.78rem", fontWeight: 700, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  gridFields: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: "0.8rem", fontWeight: 600, color: "#444" },
  input: { width: "100%", padding: "9px 12px", fontSize: "0.98rem", border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A" },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12, alignSelf: "start" },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 10, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" },
  bigSub: { fontSize: "0.82rem", color: "#777" },
  statRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  stat: { display: "flex", flexDirection: "column", gap: 1 },
  statLabel: { fontSize: "0.78rem", color: "#666" },
  statValue: { fontSize: "1.12rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  goodNote: { fontSize: "0.88rem", color: "#1f5d3f", background: "#E8F6EF", border: "1px solid #C5E6D6", borderRadius: 8, padding: "10px 12px", lineHeight: 1.5 },
  warnNote: { fontSize: "0.88rem", color: "#7a5b1e", background: "#FBF4E4", border: "1px solid #F0DEB4", borderRadius: 8, padding: "10px 12px", lineHeight: 1.5 },
  benchSrc: { fontSize: "0.74rem", color: "#888", marginTop: 6 },
  bdTitle: { fontSize: "0.78rem", fontWeight: 700, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 },
  bdRow: { display: "flex", justifyContent: "space-between", fontSize: "0.88rem", padding: "4px 0", borderBottom: "1px dashed #EAEFED" },
  bdAmt: { fontVariantNumeric: "tabular-nums", fontWeight: 600 },
  bdPct: { color: "#888", fontWeight: 400 },
};
