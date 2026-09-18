import { useMemo, useState } from "react";
import { computeNav, type NavInput } from "../lib/nav-calculator";
import { fmtUSD } from "../lib/format";

// Fund Net Asset Value (NAV) per share island. Enter a fund's total assets, total liabilities, and
// shares outstanding, and see its total net assets and NAV per share — the same formula the SEC's
// own investor glossary publishes and the number every mutual fund prices once a day at market
// close. Standalone, no host coupling (mirrors AnnualizedReturnCalculator).

interface Props {
  initialData?: Partial<NavInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: NavInput = {
  totalAssets: 500_000_000,
  totalLiabilities: 10_000_000,
  sharesOutstanding: 20_000_000,
};

export default function NavCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<NavInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => computeNav(input), [input]);
  const set = (patch: Partial<NavInput>) => setInput((s) => ({ ...s, ...patch }));

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
          <Field label="Total fund assets">
            <MoneyInput value={input.totalAssets} onChange={(v) => set({ totalAssets: v })} />
          </Field>
          <Field label="Total fund liabilities">
            <MoneyInput value={input.totalLiabilities} onChange={(v) => set({ totalLiabilities: v })} />
          </Field>
          <Field label="Shares outstanding">
            <PlainInput value={input.sharesOutstanding} onChange={(v) => set({ sharesOutstanding: v })} />
          </Field>
          <p style={S.hint}>
            Use figures from the fund's own published financials (a shareholder report or prospectus) — this
            tool does not look up a fund's numbers for you.
          </p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>NAV per share</span>
            <span style={S.bigValue}>{result.navPerShare != null ? fmtUSD(result.navPerShare, { cents: true }) : "—"}</span>
            <span style={S.bigSub}>
              net assets of {result.netAssets != null ? fmtUSD(result.netAssets) : "—"} ÷{" "}
              {input.sharesOutstanding ? input.sharesOutstanding.toLocaleString("en-US") : "0"} shares
            </span>
          </div>

          <div style={S.statRow}>
            <Stat label="Total assets" value={fmtUSD(input.totalAssets)} />
            <Stat label="Total liabilities" value={fmtUSD(input.totalLiabilities)} />
          </div>

          <div style={S.disclaimer}>
            Mutual funds recalculate and publish NAV once per business day, after the major U.S. exchanges
            close, so every mutual fund trade executes at that day's closing NAV rather than a live intraday
            price. An ETF's market price can trade slightly above or below its NAV throughout the day; this
            calculator computes NAV itself, not an ETF's live trading premium or discount.
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
function PlainInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      style={S.input}
      inputMode="numeric"
      value={value === 0 ? "" : value.toLocaleString("en-US")}
      placeholder="0"
      onChange={(e) => onChange(e.target.value === "" ? 0 : Math.max(0, Number(e.target.value.replace(/[^0-9.]/g, ""))))}
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
