import { useMemo, useState } from "react";
import { computeStockAverageCost, type StockAverageCostInput, type StockLot } from "../lib/stock-average-cost";
import { fmtUSD, fmtNum } from "../lib/format";

// Average (blended) cost basis island. Enter up to 4 separate buy lots and an optional per-trade
// commission, and see your total shares, total cost, and the single blended average cost per
// share — the number you compare against a later sale price to find your gain or loss. Standalone,
// no host coupling (mirrors AnnualizedReturnCalculator).

interface Props {
  initialData?: Partial<StockAverageCostInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULT_LOTS: StockLot[] = [
  { shares: 50, price: 20 },
  { shares: 30, price: 25 },
  { shares: 0, price: 0 },
  { shares: 0, price: 0 },
];

export default function StockAverageCostCalculator({ initialData, heading, subheading }: Props) {
  const [lots, setLots] = useState<StockLot[]>(initialData?.lots?.length ? padLots(initialData.lots) : DEFAULT_LOTS);
  const [commission, setCommission] = useState<number>(initialData?.commissionPerTrade ?? 0);
  const result = useMemo(() => computeStockAverageCost({ lots, commissionPerTrade: commission }), [lots, commission]);

  const setLot = (i: number, patch: Partial<StockLot>) =>
    setLots((s) => s.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));

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
          <div style={S.groupTitle}>Your buy lots</div>
          {lots.map((lot, i) => (
            <div key={i} style={S.row2}>
              <Field label={`Lot ${i + 1} — shares`}>
                <PlainInput value={lot.shares} onChange={(v) => setLot(i, { shares: v })} />
              </Field>
              <Field label={`Lot ${i + 1} — price/share`}>
                <MoneyInput value={lot.price} onChange={(v) => setLot(i, { price: v })} />
              </Field>
            </div>
          ))}
          <Field label="Commission per trade (optional)">
            <MoneyInput value={commission} onChange={setCommission} />
          </Field>
          <p style={S.hint}>Leave a lot's shares at 0 to skip it. Commission is added once per lot that has shares.</p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Average cost per share</span>
            <span style={S.bigValue}>{result.averageCostPerShare != null ? fmtUSD(result.averageCostPerShare, { cents: true }) : "—"}</span>
            <span style={S.bigSub}>
              across {result.lotCount} lot{result.lotCount === 1 ? "" : "s"} and {fmtNum(result.totalShares)} total shares
            </span>
          </div>

          <div style={S.statRow}>
            <Stat label="Total shares" value={fmtNum(result.totalShares)} />
            <Stat label="Total cost (incl. commissions)" value={fmtUSD(result.totalCost)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Total commissions paid" value={fmtUSD(result.totalCommissions)} />
            <Stat label="Lots counted" value={fmtNum(result.lotCount)} />
          </div>

          <div style={S.disclaimer}>
            This is the weighted-average cost method: every lot's dollars are pooled, then divided by total
            shares. Some brokers let you choose a different accounting method (FIFO, LIFO, or specific-lot
            identification) for tax purposes — those can report a different realized gain on a partial sale
            even though the blended average shown here stays the same. Check your 1099-B or brokerage
            statement for the method actually used on your account.
          </div>
        </div>
      </div>
    </div>
  );
}

function padLots(lots: StockLot[]): StockLot[] {
  const out = [...lots];
  while (out.length < 4) out.push({ shares: 0, price: 0 });
  return out.slice(0, 4);
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
  groupTitle: { fontSize: "0.82rem", fontWeight: 700, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.03em" },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
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
