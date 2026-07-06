import { useMemo, useState } from "react";
import { computeMca, type McaInput, type PaymentFrequency } from "../lib/merchant-cash-advance";
import { fmtUSD, fmtPct, fmtNum } from "../lib/format";

// Merchant Cash Advance calculator island. Converts a factor-rate quote into the numbers that
// actually matter — total payback, the daily/weekly remittance, and the TRUE annualized cost
// (effective APR), which MCA offers never disclose. Reads its initial inputs from `initialData`.

interface Props {
  initialData?: Partial<McaInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: McaInput = {
  advanceAmount: 50000,
  factorRate: 1.3,
  termMonths: 12,
  paymentFrequency: "daily",
};

const TERM_OPTIONS = [3, 4, 6, 9, 12, 15, 18, 24];

export default function MerchantCashAdvanceCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<McaInput>({ ...DEFAULTS, ...initialData });
  const [showSchedule, setShowSchedule] = useState(false);
  const result = useMemo(() => computeMca(input), [input]);
  const set = (patch: Partial<McaInput>) => setInput((s) => ({ ...s, ...patch }));

  const apr = result.effectiveAprPct;
  const aprTone = apr == null ? "" : apr >= 60 ? S.aprBad : apr >= 35 ? S.aprWarn : S.aprOk;

  return (
    <div style={S.wrap}>
      {(heading || subheading) && (
        <div style={S.head}>
          {heading && <div style={S.heading}>{heading}</div>}
          {subheading && <div style={S.subheading}>{subheading}</div>}
        </div>
      )}

      <div style={S.grid}>
        {/* ---- Inputs ---- */}
        <div style={S.inputs}>
          <Field label="Advance amount (funding you receive)">
            <MoneyInput value={input.advanceAmount} onChange={(v) => set({ advanceAmount: v })} />
          </Field>
          <div style={S.row2}>
            <Field label="Factor rate">
              <input
                style={S.input}
                inputMode="decimal"
                value={input.factorRate}
                onChange={(e) => set({ factorRate: clampNum(e.target.value, 0, 3) })}
                aria-label="Factor rate"
              />
            </Field>
            <Field label="Estimated term">
              <select
                style={S.input}
                value={input.termMonths}
                onChange={(e) => set({ termMonths: Number(e.target.value) })}
                aria-label="Estimated term in months"
              >
                {TERM_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t} months</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Payment frequency">
            <div style={S.toggleGroup} role="group" aria-label="Payment frequency">
              {(["daily", "weekly"] as PaymentFrequency[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => set({ paymentFrequency: f })}
                  style={{ ...S.toggleBtn, ...(input.paymentFrequency === f ? S.toggleBtnActive : {}) }}
                  aria-pressed={input.paymentFrequency === f}
                >
                  {f === "daily" ? "Daily" : "Weekly"}
                </button>
              ))}
            </div>
          </Field>
          <p style={S.hint}>
            A factor rate of {fmtNum(input.factorRate, 2)} means you repay{" "}
            {fmtUSD(input.advanceAmount * input.factorRate)} on {fmtUSD(input.advanceAmount)} — a cost of{" "}
            {fmtUSD(input.advanceAmount * (input.factorRate - 1))}.
          </p>
        </div>

        {/* ---- Results ---- */}
        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>{input.paymentFrequency === "daily" ? "Daily" : "Weekly"} payment</span>
            <span style={S.bigValue}>{fmtUSD(result.periodicPayment)}</span>
            <span style={S.bigSub}>
              {result.numberOfPayments == null ? "" : `${fmtNum(result.numberOfPayments)} payments · ${fmtUSD(result.estimatedMonthlyPayment)}/mo`}
            </span>
          </div>

          <div style={{ ...S.aprBox, ...aprTone }}>
            <span style={S.aprLabel}>True cost — effective APR</span>
            <span style={S.aprValue}>{fmtPct(result.effectiveAprPct, 1)}</span>
            <span style={S.aprNote}>The annual rate a factor rate hides. A bank term loan is often 8–30%.</span>
          </div>

          <div style={S.statRow}>
            <Stat label="Total payback" value={fmtUSD(result.totalPayback)} />
            <Stat label="Cost of capital" value={fmtUSD(result.totalCost)} />
          </div>

          {result.schedule.length > 0 && (
            <button style={S.toggle} onClick={() => setShowSchedule((v) => !v)} type="button">
              {showSchedule ? "Hide" : "Show"} payoff schedule
            </button>
          )}

          <a href="#get-offers" style={S.cta}>See lower-cost offers for your business →</a>
        </div>
      </div>

      {showSchedule && result.schedule.length > 0 && (
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Month</th>
                <th style={{ ...S.th, ...S.right }}>Paid</th>
                <th style={{ ...S.th, ...S.right }}>Payback remaining</th>
              </tr>
            </thead>
            <tbody>
              {result.schedule.map((r) => (
                <tr key={r.month}>
                  <td style={S.td}>{r.month}</td>
                  <td style={{ ...S.td, ...S.right }}>{fmtUSD(r.paid, { cents: true })}</td>
                  <td style={{ ...S.td, ...S.right }}>{fmtUSD(r.remaining, { cents: true })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function clampNum(v: string, min: number, max: number): number {
  const n = Number(v.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
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
  input: {
    width: "100%", padding: "10px 12px", fontSize: "1rem", border: "1px solid #D0DAD6",
    borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A",
  },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  toggleGroup: { display: "flex", gap: 8 },
  toggleBtn: {
    flex: 1, padding: "10px 12px", border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff",
    fontSize: "0.95rem", fontWeight: 600, color: "#555", cursor: "pointer",
  },
  toggleBtnActive: { borderColor: PRIMARY, background: "#E4F4EF", color: PRIMARY },
  hint: { fontSize: "0.82rem", color: "#666", lineHeight: 1.5, margin: "2px 0 0" },
  results: {
    background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)",
    border: "1px solid #D8EEE6", borderRadius: 14, padding: 18,
    display: "flex", flexDirection: "column", gap: 12,
  },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 8, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "2rem", fontWeight: 800, color: PRIMARY, letterSpacing: "-0.02em" },
  bigSub: { fontSize: "0.8rem", color: "#777", marginTop: 2 },
  aprBox: {
    borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 1,
    border: "1px solid #E0EBE7", background: "#fff",
  },
  aprOk: { background: "#EAF7F1", borderColor: "#BFE6D7" },
  aprWarn: { background: "#FBF4E4", borderColor: "#F0DEB4" },
  aprBad: { background: "#FBEAE6", borderColor: "#F0C7BC" },
  aprLabel: { fontSize: "0.78rem", fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: "0.03em" },
  aprValue: { fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" },
  aprNote: { fontSize: "0.8rem", color: "#777" },
  statRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  stat: { display: "flex", flexDirection: "column", gap: 1 },
  statLabel: { fontSize: "0.78rem", color: "#666" },
  statValue: { fontSize: "1.15rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  toggle: {
    marginTop: 2, padding: "9px 12px", border: "1px solid #CFE3DC", background: "#fff",
    borderRadius: 8, fontSize: "0.88rem", fontWeight: 600, color: PRIMARY, cursor: "pointer",
  },
  cta: {
    marginTop: 4, textAlign: "center", padding: "11px 12px", borderRadius: 8, background: PRIMARY,
    color: "#fff", fontSize: "0.9rem", fontWeight: 700, textDecoration: "none",
  },
  tableWrap: { marginTop: 18, overflowX: "auto", border: "1px solid #EAEFED", borderRadius: 10 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" },
  th: { textAlign: "left", padding: "10px 12px", background: "#F4FAF8", fontWeight: 700, color: "#2A6A58", borderBottom: "1px solid #E0EBE7" },
  td: { padding: "8px 12px", borderBottom: "1px solid #F0F4F2", fontVariantNumeric: "tabular-nums" },
  right: { textAlign: "right" },
};
