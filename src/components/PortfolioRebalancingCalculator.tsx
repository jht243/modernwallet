import { useMemo, useState } from "react";
import { computeRebalance, type Holding } from "../lib/portfolio-rebalancing";
import { fmtUSD, fmtPct } from "../lib/format";
import { Field, MoneyInput, PctInput, Stat, S } from "./calc-ui";

// Portfolio rebalancing island. Current value + target % for four holdings, plus optional new money; returns
// the dollars to buy or sell in each. "New money only" never sells and steers contributions to the holdings
// below target.

interface Props {
  initialData?: { holdings?: Holding[]; newMoney?: number; noSell?: boolean };
  heading?: string;
  subheading?: string;
}

const DEFAULT_HOLDINGS: Holding[] = [
  { label: "Stocks", value: 70000, targetPct: 60 },
  { label: "Bonds", value: 25000, targetPct: 35 },
  { label: "Real estate / other", value: 0, targetPct: 0 },
  { label: "Cash", value: 5000, targetPct: 5 },
];

export default function PortfolioRebalancingCalculator({ initialData, heading, subheading }: Props) {
  const [holdings, setHoldings] = useState<Holding[]>(initialData?.holdings ?? DEFAULT_HOLDINGS);
  const [newMoney, setNewMoney] = useState<number>(initialData?.newMoney ?? 0);
  const [noSell, setNoSell] = useState<boolean>(initialData?.noSell ?? false);
  const r = useMemo(() => computeRebalance({ holdings, newMoney, noSell }), [holdings, newMoney, noSell]);
  const setH = (i: number, patch: Partial<Holding>) => setHoldings((hs) => hs.map((h, j) => (j === i ? { ...h, ...patch } : h)));

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
          {holdings.map((h, i) => (
            <div key={h.label} style={S.twoCol}>
              <Field label={`${h.label} — value now`}><MoneyInput value={h.value} onChange={(v) => setH(i, { value: v })} /></Field>
              <Field label={`${h.label} — target`}><PctInput value={h.targetPct} onChange={(v) => setH(i, { targetPct: v })} /></Field>
            </div>
          ))}
          <Field label="New money to invest (optional)"><MoneyInput value={newMoney} onChange={setNewMoney} /></Field>
          <label style={R.checkRow}>
            <input type="checkbox" style={R.checkbox} checked={noSell} onChange={(e) => setNoSell(e.target.checked)} />
            <span>Use new money only — don't sell anything</span>
          </label>
          {!r.targetsValid && (
            <p style={{ ...S.hint, color: "#8a5a00" }}>Your targets add up to {fmtPct(r.targetSum, 1)}. Set them to total 100%.</p>
          )}
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>{noSell ? "Invest the new money like this" : "Trades to reach your target"}</span>
            <span style={S.bigValue}>{fmtUSD(r.totalBuys)}</span>
            <span style={S.bigSub}>
              {noSell
                ? r.reachedTarget ? "to buy — this lands every holding on target" : "to buy — moves you toward target without selling"
                : `to buy, funded by ${fmtUSD(r.totalSells)} in sales${newMoney > 0 ? ` and ${fmtUSD(newMoney)} of new money` : ""}`}
            </span>
          </div>
          <table style={R.table}>
            <thead>
              <tr>
                <th style={R.th}>Holding</th>
                <th style={{ ...R.th, ...R.right }}>Now</th>
                <th style={{ ...R.th, ...R.right }}>Target</th>
                <th style={{ ...R.th, ...R.right }}>Buy / sell</th>
              </tr>
            </thead>
            <tbody>
              {r.rows.filter((row) => row.value > 0 || row.targetPct > 0).map((row) => (
                <tr key={row.label}>
                  <td style={R.td}>{row.label}</td>
                  <td style={{ ...R.td, ...R.right }}>{fmtPct(row.currentPct, 1)}</td>
                  <td style={{ ...R.td, ...R.right }}>{fmtPct(row.targetPct, 1)}</td>
                  <td style={{ ...R.td, ...R.right, fontWeight: 700, color: row.trade < 0 ? "#B23A3A" : "#0E7C66" }}>
                    {Math.abs(row.trade) < 0.5 ? "—" : `${row.trade > 0 ? "Buy" : "Sell"} ${fmtUSD(Math.abs(row.trade))}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={S.statRow}>
            <Stat label="Portfolio now" value={fmtUSD(r.currentTotal)} />
            <Stat label="After rebalancing" value={fmtUSD(r.finalTotal)} />
          </div>
          <div style={S.disclaimer}>
            Arithmetic only: target % × total, minus what each holding is worth now. Selling in a taxable account can trigger capital gains tax, and trades can carry costs; neither is modeled. Not investment advice.
          </div>
        </div>
      </div>
    </div>
  );
}

const R: Record<string, React.CSSProperties> = {
  checkRow: { display: "flex", alignItems: "center", gap: 10, minHeight: 40, fontSize: "0.88rem", color: "#444", cursor: "pointer" },
  checkbox: { width: 20, height: 20, margin: 0, flexShrink: 0, accentColor: "#0E7C66", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", fontVariantNumeric: "tabular-nums" },
  th: { textAlign: "left", padding: "6px 4px", borderBottom: "1px solid #DCE6E2", color: "#555", fontWeight: 600 },
  td: { padding: "6px 4px", borderBottom: "1px solid #EEF3F1" },
  right: { textAlign: "right" },
};
