import { useMemo, useState } from "react";
import { computeStockSplit, type StockSplitInput } from "../lib/stock-split";
import { fmtUSD, fmtNum } from "../lib/format";

// Stock split adjustment island. Enter your shares, price, and cost basis BEFORE a split, plus the
// split ratio, and see the post-split share count and split-adjusted price/cost basis — the total
// dollar value and total cost basis of the position never change, only how it's sliced. Standalone,
// no host coupling (mirrors AnnualizedReturnCalculator).

interface Props {
  initialData?: Partial<StockSplitInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: StockSplitInput = {
  shares: 100,
  pricePerShare: 200,
  costBasisPerShare: 150,
  splitFromRatio: 2,
  splitToRatio: 1,
};

const PRESETS = [
  { label: "2-for-1 split", from: 2, to: 1 },
  { label: "3-for-1 split", from: 3, to: 1 },
  { label: "3-for-2 split", from: 3, to: 2 },
  { label: "1-for-10 reverse split", from: 1, to: 10 },
];

export default function StockSplitCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<StockSplitInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => computeStockSplit(input), [input]);
  const set = (patch: Partial<StockSplitInput>) => setInput((s) => ({ ...s, ...patch }));
  const isReverse = (result.ratio ?? 1) < 1;

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
            <Field label="Shares held (before split)">
              <PlainInput value={input.shares} onChange={(v) => set({ shares: v })} />
            </Field>
            <Field label="Price per share (before)">
              <MoneyInput value={input.pricePerShare} onChange={(v) => set({ pricePerShare: v })} />
            </Field>
          </div>
          <Field label="Your cost basis per share (before)">
            <MoneyInput value={input.costBasisPerShare} onChange={(v) => set({ costBasisPerShare: v })} />
          </Field>
          <div style={S.row2}>
            <Field label="Split ratio — new shares">
              <PlainInput value={input.splitFromRatio} onChange={(v) => set({ splitFromRatio: v })} />
            </Field>
            <Field label="for every">
              <PlainInput value={input.splitToRatio} onChange={(v) => set({ splitToRatio: v })} />
            </Field>
          </div>
          <div style={S.presetRow}>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                style={S.presetBtn}
                onClick={() => set({ splitFromRatio: p.from, splitToRatio: p.to })}
              >
                {p.label}
              </button>
            ))}
          </div>
          <p style={S.hint}>
            A "2-for-1" split means 2 new shares for every 1 old share. A "1-for-10 reverse split" means 1 new
            share for every 10 old shares — enter that as new = 1, for every = 10.
          </p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Shares after the split</span>
            <span style={S.bigValue}>{result.newShares != null ? fmtNum(result.newShares) : "—"}</span>
            <span style={S.bigSub}>
              {isReverse ? "consolidated from" : "split from"} {fmtNum(input.shares || 0)} share
              {(input.shares || 0) === 1 ? "" : "s"}
            </span>
          </div>

          <div style={S.statRow}>
            <Stat label="New price per share" value={result.newPricePerShare != null ? fmtUSD(result.newPricePerShare) : "—"} />
            <Stat label="New cost basis per share" value={result.newCostBasisPerShare != null ? fmtUSD(result.newCostBasisPerShare) : "—"} />
          </div>

          <div style={S.checkBox}>
            <span style={S.checkLabel}>Sanity check — total value is unchanged</span>
            <span style={S.checkRow}>
              <span>Before: {result.totalValueBefore != null ? fmtUSD(result.totalValueBefore) : "—"}</span>
              <span>After: {result.totalValueAfter != null ? fmtUSD(result.totalValueAfter) : "—"}</span>
            </span>
            <span style={S.checkRow}>
              <span>Cost basis before: {result.totalCostBasisBefore != null ? fmtUSD(result.totalCostBasisBefore) : "—"}</span>
              <span>Cost basis after: {result.totalCostBasisAfter != null ? fmtUSD(result.totalCostBasisAfter) : "—"}</span>
            </span>
          </div>

          <div style={S.disclaimer}>
            A stock split changes how many shares you hold and what each one is worth. It never changes the
            total dollar value of your position or your total cost basis — only the split-adjusted PER-SHARE
            numbers change. Your broker automatically adjusts your account; this tool is for checking the math
            yourself, not a substitute for your official brokerage statement.
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
        inputMode="decimal"
        value={value === 0 ? "" : value}
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
      inputMode="decimal"
      value={value === 0 ? "" : value}
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
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#444" },
  input: { width: "100%", padding: "10px 12px", fontSize: "1rem", border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A" },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  presetRow: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 2 },
  presetBtn: { fontSize: "0.78rem", fontWeight: 600, padding: "6px 10px", borderRadius: 999, border: "1px solid #D8EEE6", background: "#F4FAF8", color: PRIMARY, cursor: "pointer" },
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
  checkBox: { borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 4, border: "1px solid #E0EBE7", background: "#fff" },
  checkLabel: { fontSize: "0.76rem", fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: "0.03em" },
  checkRow: { display: "flex", justifyContent: "space-between", fontSize: "0.88rem", fontVariantNumeric: "tabular-nums", color: "#333" },
  disclaimer: { fontSize: "0.76rem", color: "#7a8783", lineHeight: 1.5, marginTop: 2 },
};
