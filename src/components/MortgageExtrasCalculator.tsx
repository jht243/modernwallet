import { useMemo, useState } from "react";
import { downPaymentBreakdown, closingCostEstimate } from "../lib/affordability";
import { fmtUSD, fmtPct } from "../lib/format";

// Mortgage-extras island: kind="down-payment" or kind="closing-cost".
interface Props {
  initialData?: Record<string, unknown> & { kind?: "down-payment" | "closing-cost" };
  heading?: string;
  subheading?: string;
}

export default function MortgageExtrasCalculator({ initialData, heading, subheading }: Props) {
  const kind = (initialData?.kind as "down-payment" | "closing-cost") ?? "down-payment";
  return (
    <div style={S.wrap}>
      {(heading || subheading) && (
        <div style={S.head}>
          {heading && <div style={S.heading}>{heading}</div>}
          {subheading && <div style={S.subheading}>{subheading}</div>}
        </div>
      )}
      {kind === "closing-cost" ? <Closing data={initialData} /> : <Down data={initialData} />}
    </div>
  );
}

function Down({ data }: { data?: Record<string, unknown> }) {
  const [price, setPrice] = useState(n(data?.homePrice, 400000));
  const [pct, setPct] = useState(n(data?.downPaymentPct, 10));
  const r = useMemo(() => downPaymentBreakdown(price, pct), [price, pct]);
  return (
    <div style={S.grid}>
      <div style={S.inputs}>
        <Field label="Home price"><Money v={price} on={setPrice} /></Field>
        <Field label="Down payment %"><Pct v={pct} on={setPct} /></Field>
        <div style={S.chips}>
          {[3, 5, 10, 20].map((p) => (
            <button key={p} type="button" style={{ ...S.chip, ...(pct === p ? S.chipOn : {}) }} onClick={() => setPct(p)}>{p}%</button>
          ))}
        </div>
      </div>
      <div style={S.results}>
        <div style={S.bigStat}>
          <span style={S.bigLabel}>Down payment</span>
          <span style={S.bigValue}>{fmtUSD(r?.downPaymentAmount)}</span>
          <span style={S.bigSub}>{fmtPct(pct, 0)} of {fmtUSD(price)}</span>
        </div>
        <div style={S.statRow}>
          <Stat label="Loan amount" value={fmtUSD(r?.loanAmount)} />
          <Stat label="Loan-to-value (LTV)" value={r ? fmtPct(r.ltvPct, 0) : "—"} />
        </div>
        <div style={r?.pmiLikely ? S.warnNote : S.goodNote}>
          {r?.pmiLikely
            ? `Under 20% down — you'll likely pay PMI. Putting down ${fmtUSD(r?.amountToReach20Pct)} more would reach 20% and avoid it.`
            : "20% or more down — no PMI required on a conventional loan."}
        </div>
      </div>
    </div>
  );
}

function Closing({ data }: { data?: Record<string, unknown> }) {
  const [price, setPrice] = useState(n(data?.homePrice, 400000));
  const r = useMemo(() => closingCostEstimate(price), [price]);
  return (
    <div style={S.grid}>
      <div style={S.inputs}>
        <Field label="Home price"><Money v={price} on={setPrice} /></Field>
        <div style={S.note}>Closing costs typically run 2–5% of the price. This estimates the midpoint (~3%) and a rough breakdown — actual costs vary by state and lender.</div>
      </div>
      <div style={S.results}>
        <div style={S.bigStat}>
          <span style={S.bigLabel}>Estimated closing costs</span>
          <span style={S.bigValue}>{fmtUSD(r?.typical)}</span>
          <span style={S.bigSub}>typical · range {fmtUSD(r?.low)} – {fmtUSD(r?.high)}</span>
        </div>
        {r && (
          <div>
            {r.items.map((it) => (
              <div key={it.label} style={S.bdRow}><span>{it.label}</span><span style={S.bdAmt}>{fmtUSD(it.amount)}</span></div>
            ))}
          </div>
        )}
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
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#444" },
  input: { width: "100%", padding: "10px 12px", fontSize: "1rem", border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A" },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  suffix: { position: "absolute", right: 12, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  chips: { display: "flex", gap: 8 },
  chip: { flex: 1, padding: "8px 0", border: "1px solid #D0DAD6", background: "#fff", borderRadius: 8, fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", color: "#444" },
  chipOn: { borderColor: PRIMARY, background: "#E4F4EF", color: PRIMARY },
  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12, alignSelf: "start" },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 10, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "2rem", fontWeight: 800, color: PRIMARY, letterSpacing: "-0.02em" },
  bigSub: { fontSize: "0.82rem", color: "#777" },
  statRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  stat: { display: "flex", flexDirection: "column", gap: 1 },
  statLabel: { fontSize: "0.78rem", color: "#666" },
  statValue: { fontSize: "1.12rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  bdRow: { display: "flex", justifyContent: "space-between", fontSize: "0.88rem", padding: "6px 0", borderBottom: "1px dashed #EAEFED" },
  bdAmt: { fontVariantNumeric: "tabular-nums", fontWeight: 600 },
  note: { fontSize: "0.83rem", color: "#5a6b66", background: "#F1F8F5", border: "1px solid #DCECE6", borderRadius: 8, padding: "10px 12px", lineHeight: 1.5 },
  goodNote: { fontSize: "0.85rem", color: "#1f5d3f", background: "#E8F6EF", border: "1px solid #C5E6D6", borderRadius: 8, padding: "10px 12px", lineHeight: 1.5 },
  warnNote: { fontSize: "0.85rem", color: "#7a5b1e", background: "#FBF4E4", border: "1px solid #F0DEB4", borderRadius: 8, padding: "10px 12px", lineHeight: 1.5 },
};
