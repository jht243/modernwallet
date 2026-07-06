import { useMemo, useState } from "react";
import { computeFactoring, type FactoringInput } from "../lib/invoice-factoring";
import { fmtUSD, fmtPct, fmtNum } from "../lib/format";

// Invoice factoring / accounts-receivable financing calculator island. Turns an advance-rate +
// factoring-fee quote into cash-now, the total fee, and the true annualized cost of the advance.

interface Props {
  initialData?: Partial<FactoringInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: FactoringInput = {
  invoiceAmount: 100000,
  advanceRatePct: 85,
  factorFeePct: 1.5,
  daysUntilPaid: 45,
  feeStructure: "per30",
};

export default function InvoiceFactoringCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<FactoringInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => computeFactoring(input), [input]);
  const set = (patch: Partial<FactoringInput>) => setInput((s) => ({ ...s, ...patch }));

  const apr = result.effectiveAprPct;
  const aprTone = apr == null ? {} : apr >= 40 ? S.aprBad : apr >= 20 ? S.aprWarn : S.aprOk;

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
          <Field label="Invoice amount">
            <MoneyInput value={input.invoiceAmount} onChange={(v) => set({ invoiceAmount: v })} />
          </Field>
          <div style={S.row2}>
            <Field label="Advance rate">
              <PctInput value={input.advanceRatePct} onChange={(v) => set({ advanceRatePct: Math.min(100, v) })} />
            </Field>
            <Field label="Factoring fee (per 30 days)">
              <PctInput value={input.factorFeePct} onChange={(v) => set({ factorFeePct: v })} step />
            </Field>
          </div>
          <div style={S.row2}>
            <Field label="Days until customer pays">
              <input
                style={S.input}
                inputMode="numeric"
                value={input.daysUntilPaid || ""}
                onChange={(e) => set({ daysUntilPaid: Math.max(0, Number(e.target.value.replace(/[^0-9]/g, ""))) })}
                aria-label="Days until paid"
              />
            </Field>
            <Field label="Monthly invoice volume (optional)">
              <MoneyInput value={input.monthlyInvoiceVolume ?? 0} onChange={(v) => set({ monthlyInvoiceVolume: v })} />
            </Field>
          </div>
          <p style={S.hint}>
            Fee charged per started 30-day period the invoice is outstanding.
          </p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Cash you get now</span>
            <span style={S.bigValue}>{fmtUSD(result.advanceAmount)}</span>
            <span style={S.bigSub}>{result.reserveAmount == null ? "" : `${fmtUSD(result.reserveAmount)} reserve held back`}</span>
          </div>

          <div style={{ ...S.aprBox, ...aprTone }}>
            <span style={S.aprLabel}>Effective APR on the advance</span>
            <span style={S.aprValue}>{fmtPct(result.effectiveAprPct, 1)}</span>
            <span style={S.aprNote}>Annualized cost of the cash advanced for {fmtNum(input.daysUntilPaid)} days.</span>
          </div>

          <div style={S.statRow}>
            <Stat label="Factoring fee" value={fmtUSD(result.feeAmount)} />
            <Stat label="Rebate at payment" value={fmtUSD(result.rebateAmount)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Net proceeds" value={fmtUSD(result.netProceeds)} />
            <Stat label={result.annualFactoringCost == null ? "Fee periods" : "Annual fee (est.)"}
                  value={result.annualFactoringCost == null ? fmtNum(result.periods) : fmtUSD(result.annualFactoringCost)} />
          </div>

          <a href="#get-offers" style={S.cta}>Compare factoring rates for your invoices →</a>
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
function PctInput({ value, onChange, step }: { value: number; onChange: (v: number) => void; step?: boolean }) {
  return (
    <div style={S.suffixWrap}>
      <input
        style={S.input}
        inputMode="decimal"
        value={value === 0 ? "" : value}
        placeholder="0"
        onChange={(e) => onChange(Math.max(0, Number(e.target.value.replace(/[^0-9.]/g, ""))))}
        aria-label="Percent"
      />
      <span style={S.suffix}>%</span>
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
  hint: { fontSize: "0.82rem", color: "#666", lineHeight: 1.5, margin: "2px 0 0" },
  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12 },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 8, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "2rem", fontWeight: 800, color: PRIMARY, letterSpacing: "-0.02em" },
  bigSub: { fontSize: "0.8rem", color: "#777", marginTop: 2 },
  aprBox: { borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 1, border: "1px solid #E0EBE7", background: "#fff" },
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
  cta: { marginTop: 4, textAlign: "center", padding: "11px 12px", borderRadius: 8, background: PRIMARY, color: "#fff", fontSize: "0.9rem", fontWeight: 700, textDecoration: "none" },
};
