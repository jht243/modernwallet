import { useMemo, useState } from "react";
import { computeLoc, type LocInput } from "../lib/business-line-of-credit";
import { fmtUSD, fmtPct } from "../lib/format";

// Business line of credit calculator island. Models a single draw amortized over a repayment term
// (plus an optional per-draw fee) → monthly payment, total interest, and the true APR with the fee.

interface Props {
  initialData?: Partial<LocInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: LocInput = {
  drawAmount: 50000,
  aprPct: 12,
  repaymentTermMonths: 24,
  drawFeePct: 2,
};

const TERM_OPTIONS = [6, 12, 18, 24, 36, 48, 60];

export default function BusinessLineOfCreditCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<LocInput>({ ...DEFAULTS, ...initialData });
  const [showSchedule, setShowSchedule] = useState(false);
  const result = useMemo(() => computeLoc(input), [input]);
  const set = (patch: Partial<LocInput>) => setInput((s) => ({ ...s, ...patch }));

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
          <Field label="Draw amount">
            <MoneyInput value={input.drawAmount} onChange={(v) => set({ drawAmount: v })} />
          </Field>
          <div style={S.row2}>
            <Field label="Interest rate (APR)">
              <div style={S.suffixWrap}>
                <input
                  style={S.input}
                  inputMode="decimal"
                  value={input.aprPct}
                  onChange={(e) => set({ aprPct: Math.max(0, Number(e.target.value.replace(/[^0-9.]/g, ""))) })}
                  aria-label="Interest rate percent"
                />
                <span style={S.suffix}>%</span>
              </div>
            </Field>
            <Field label="Repayment term">
              <select
                style={S.input}
                value={input.repaymentTermMonths}
                onChange={(e) => set({ repaymentTermMonths: Number(e.target.value) })}
                aria-label="Repayment term in months"
              >
                {TERM_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t} months</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Draw fee (optional)">
            <div style={S.suffixWrap}>
              <input
                style={S.input}
                inputMode="decimal"
                value={input.drawFeePct ?? 0}
                onChange={(e) => set({ drawFeePct: Math.max(0, Number(e.target.value.replace(/[^0-9.]/g, ""))) })}
                aria-label="Draw fee percent"
              />
              <span style={S.suffix}>%</span>
            </div>
          </Field>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Monthly payment</span>
            <span style={S.bigValue}>{fmtUSD(result.monthlyPayment)}</span>
            <span style={S.bigSub}>
              {result.effectiveAprPct == null ? "" : `${fmtPct(result.effectiveAprPct, 1)} APR with fees`}
            </span>
          </div>

          <div style={S.statRow}>
            <Stat label="Total interest" value={fmtUSD(result.totalInterest)} />
            <Stat label="Draw fee" value={fmtUSD(result.drawFee)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Total cost of the money" value={fmtUSD(result.totalCost)} />
            <Stat label="Total repaid" value={fmtUSD(result.totalRepaid)} />
          </div>

          {result.schedule.length > 0 && (
            <button style={S.toggle} onClick={() => setShowSchedule((v) => !v)} type="button">
              {showSchedule ? "Hide" : "Show"} amortization schedule ({result.schedule.length} payments)
            </button>
          )}

          <a href="#get-offers" style={S.cta}>See business credit line offers →</a>
        </div>
      </div>

      {showSchedule && result.schedule.length > 0 && (
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Month</th>
                <th style={{ ...S.th, ...S.right }}>Payment</th>
                <th style={{ ...S.th, ...S.right }}>Principal</th>
                <th style={{ ...S.th, ...S.right }}>Interest</th>
                <th style={{ ...S.th, ...S.right }}>Balance</th>
              </tr>
            </thead>
            <tbody>
              {result.schedule.filter((r) => r.month <= 12 || r.month % 6 === 0 || r.month === result.schedule.length).map((r) => (
                <tr key={r.month}>
                  <td style={S.td}>{r.month}</td>
                  <td style={{ ...S.td, ...S.right }}>{fmtUSD(r.payment, { cents: true })}</td>
                  <td style={{ ...S.td, ...S.right }}>{fmtUSD(r.principal, { cents: true })}</td>
                  <td style={{ ...S.td, ...S.right }}>{fmtUSD(r.interest, { cents: true })}</td>
                  <td style={{ ...S.td, ...S.right }}>{fmtUSD(r.balance, { cents: true })}</td>
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
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#444" },
  input: { width: "100%", padding: "10px 12px", fontSize: "1rem", border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A" },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  suffix: { position: "absolute", right: 12, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12 },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 8, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "2rem", fontWeight: 800, color: PRIMARY, letterSpacing: "-0.02em" },
  bigSub: { fontSize: "0.8rem", color: "#777", marginTop: 2 },
  statRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  stat: { display: "flex", flexDirection: "column", gap: 1 },
  statLabel: { fontSize: "0.78rem", color: "#666" },
  statValue: { fontSize: "1.15rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  toggle: { marginTop: 2, padding: "9px 12px", border: "1px solid #CFE3DC", background: "#fff", borderRadius: 8, fontSize: "0.88rem", fontWeight: 600, color: PRIMARY, cursor: "pointer" },
  cta: { marginTop: 4, textAlign: "center", padding: "11px 12px", borderRadius: 8, background: PRIMARY, color: "#fff", fontSize: "0.9rem", fontWeight: 700, textDecoration: "none" },
  tableWrap: { marginTop: 18, overflowX: "auto", border: "1px solid #EAEFED", borderRadius: 10 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" },
  th: { textAlign: "left", padding: "10px 12px", background: "#F4FAF8", fontWeight: 700, color: "#2A6A58", borderBottom: "1px solid #E0EBE7" },
  td: { padding: "8px 12px", borderBottom: "1px solid #F0F4F2", fontVariantNumeric: "tabular-nums" },
  right: { textAlign: "right" },
};
