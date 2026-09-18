import { useMemo, useState } from "react";
import { computeStockProfit, type StockProfitInput } from "../lib/stock-profit";
import { fmtUSD, fmtPct } from "../lib/format";

// Stock buy/sell profit-and-loss island. Enter one buy leg and one sell leg (with commissions on
// each), and see your net cost, net proceeds, dollar profit/loss, return percentage, and the exact
// break-even sale price. Standalone, no host coupling (mirrors AnnualizedReturnCalculator).

interface Props {
  initialData?: Partial<StockProfitInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: StockProfitInput = {
  shares: 100,
  buyPrice: 40,
  buyCommission: 0,
  sellPrice: 48,
  sellCommission: 0,
};

export default function StockProfitCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<StockProfitInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => computeStockProfit(input), [input]);
  const set = (patch: Partial<StockProfitInput>) => setInput((s) => ({ ...s, ...patch }));
  const isProfit = (result.profit ?? 0) >= 0;

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
          <Field label="Shares">
            <PlainInput value={input.shares} onChange={(v) => set({ shares: v })} />
          </Field>
          <div style={S.groupTitle}>Buy</div>
          <div style={S.row2}>
            <Field label="Buy price / share">
              <MoneyInput value={input.buyPrice} onChange={(v) => set({ buyPrice: v })} />
            </Field>
            <Field label="Buy commission">
              <MoneyInput value={input.buyCommission} onChange={(v) => set({ buyCommission: v })} />
            </Field>
          </div>
          <div style={S.groupTitle}>Sell</div>
          <div style={S.row2}>
            <Field label="Sell price / share">
              <MoneyInput value={input.sellPrice} onChange={(v) => set({ sellPrice: v })} />
            </Field>
            <Field label="Sell commission">
              <MoneyInput value={input.sellCommission} onChange={(v) => set({ sellCommission: v })} />
            </Field>
          </div>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>{isProfit ? "Profit" : "Loss"}</span>
            <span style={{ ...S.bigValue, color: isProfit ? PRIMARY : "#B4442E" }}>
              {result.profit != null ? fmtUSD(Math.abs(result.profit), { cents: true }) : "—"}
            </span>
            <span style={S.bigSub}>{result.returnPct != null ? `${fmtPct(result.returnPct)} return` : "—"}</span>
          </div>

          <div style={S.statRow}>
            <Stat label="Net cost (buy + commission)" value={result.netCost != null ? fmtUSD(result.netCost, { cents: true }) : "—"} />
            <Stat label="Net proceeds (sell − commission)" value={result.netProceeds != null ? fmtUSD(result.netProceeds, { cents: true }) : "—"} />
          </div>

          <div style={S.checkBox}>
            <span style={S.checkLabel}>Break-even sale price</span>
            <span style={S.checkValue}>{result.breakEvenPrice != null ? fmtUSD(result.breakEvenPrice, { cents: true }) : "—"}</span>
            <span style={S.checkNote}>
              The price per share where net proceeds exactly equal net cost — sell above this and you profit,
              below it and you lose money, after both commissions.
            </span>
          </div>

          <div style={S.disclaimer}>
            This estimate excludes taxes. A gain on shares held one year or less is usually taxed as short-term
            capital gain (your ordinary income rate); shares held longer than one year usually qualify for the
            lower long-term capital gains rate. Confirm your actual holding period and rate with the IRS's own
            guidance or a tax professional before you file.
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
  groupTitle: { fontSize: "0.78rem", fontWeight: 700, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.03em", marginTop: 4 },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#444" },
  input: { width: "100%", padding: "10px 12px", fontSize: "1rem", border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A" },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12, alignSelf: "start" },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 8, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" },
  bigSub: { fontSize: "0.8rem", color: "#777", marginTop: 2 },
  statRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  stat: { display: "flex", flexDirection: "column", gap: 1 },
  statLabel: { fontSize: "0.78rem", color: "#666" },
  statValue: { fontSize: "1.15rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  checkBox: { borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 2, border: "1px solid #E0EBE7", background: "#fff" },
  checkLabel: { fontSize: "0.76rem", fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: "0.03em" },
  checkValue: { fontSize: "1.3rem", fontWeight: 800, color: PRIMARY, fontVariantNumeric: "tabular-nums" },
  checkNote: { fontSize: "0.8rem", color: "#777" },
  disclaimer: { fontSize: "0.76rem", color: "#7a8783", lineHeight: 1.5, marginTop: 2 },
};
