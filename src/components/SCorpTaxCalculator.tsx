import { useMemo, useState } from "react";
import {
  calculateSCorp,
  type SCorpInput,
  DEFAULT_PAYROLL_COST,
} from "../lib/s-corp-tax";
import { type FilingStatus } from "../lib/self-employment-tax";
import { fmtUSD, fmtPct } from "../lib/format";

// S corporation election island. The headline is the NET saving after payroll costs and after the
// QBI deduction you give up — not the gross payroll tax avoided, which is the number every vendor
// calculator leads with and which overstates the benefit at every income level.
//
// It can and does return a negative result. That is the point: at low profit, or with a salary set
// high enough to be defensible, an S-corp election costs money, and a calculator that cannot say so
// is a sales tool rather than a calculator.

export type SCorpPreset = Partial<SCorpInput> & {
  /** Per-spoke note rendered under the results. */
  note?: string;
};

interface Props {
  initialData?: SCorpPreset;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: SCorpInput = {
  netProfit: 120000,
  reasonableSalary: 60000,
  filingStatus: "single",
  otherIncome: 0,
  payrollCost: DEFAULT_PAYROLL_COST,
  applyQbi: true,
};

export default function SCorpTaxCalculator({ initialData, heading, subheading }: Props) {
  const { note: presetNote, ...presetNumbers } = initialData ?? {};
  const [input, setInput] = useState<SCorpInput>({ ...DEFAULTS, ...presetNumbers });
  const result = useMemo(() => calculateSCorp(input), [input]);
  const set = (patch: Partial<SCorpInput>) => setInput((s) => ({ ...s, ...patch }));

  const saves = result.netSaving > 0;

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
          <Field label="Business profit before owner pay">
            <MoneyInput value={input.netProfit} onChange={(v) => set({ netProfit: v })} />
          </Field>

          <Field label="Salary you would pay yourself">
            <MoneyInput
              value={input.reasonableSalary}
              onChange={(v) => set({ reasonableSalary: v })}
            />
          </Field>
          <p style={S.hint}>
            This is the number the IRS scrutinises. There is no safe-harbor percentage — the
            60/40 and 2% "rules" circulating online are not IRS positions. Compensation is judged on
            your duties, hours, and what comparable businesses pay.
          </p>

          <Field label="Filing status">
            <div style={S.toggleRow}>
              {(["single", "mfj", "hoh"] as FilingStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  style={{ ...S.toggleBtn, ...(input.filingStatus === s ? S.toggleBtnActive : {}) }}
                  onClick={() => set({ filingStatus: s })}
                >
                  {s === "mfj" ? "Married" : s === "hoh" ? "Head of hh" : "Single"}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Other household income">
            <MoneyInput value={input.otherIncome ?? 0} onChange={(v) => set({ otherIncome: v })} />
          </Field>

          <div style={S.divider} />

          <Field label="Annual payroll service + extra return cost">
            <MoneyInput
              value={input.payrollCost ?? DEFAULT_PAYROLL_COST}
              onChange={(v) => set({ payrollCost: v })}
            />
          </Field>
          <p style={S.hint}>
            An S-corp must run real payroll and file Form 1120-S. This cost recurs every year and is
            what turns a small paper saving into no saving at all.
          </p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>{saves ? "Net saving a year" : "Extra cost a year"}</span>
            <span style={{ ...S.bigValue, color: saves ? PRIMARY : "#A6432F" }}>
              {fmtUSD(Math.abs(result.netSaving))}
            </span>
            <span style={S.bigSub}>
              after payroll costs and the QBI deduction you give up
            </span>
          </div>

          <div style={S.statRow}>
            <Stat label="Sole proprietor / LLC total tax" value={fmtUSD(result.soleProprietor.totalCost)} />
            <Stat label="S-corp total cost" value={fmtUSD(result.sCorp.totalCost)} />
          </div>

          <div style={S.breakdown}>
            <Row label="Payroll tax avoided on the distribution" value={`+ ${fmtUSD(result.grossPayrollTaxSaved)}`} />
            <Row label="QBI deduction given up (wages are not QBI)" value={`− ${fmtUSD(result.qbiDeductionLost)}`} />
            <Row label="Payroll service and extra return" value={`− ${fmtUSD(result.payrollCost)}`} />
            <Row
              label={`Distribution passed through on the K-1`}
              value={fmtUSD(result.distribution)}
            />
            <Row
              label="Salary as a share of profit"
              value={fmtPct(result.salaryShareOfProfit * 100, 0)}
            />
          </div>

          {result.electionCostsMoney && (
            <div style={{ ...S.noteBox, ...S.noteWarn }}>
              <span style={S.noteLabel}>An election would cost you money here</span>
              <span style={S.noteText}>
                At this profit and salary, the payroll tax you avoid is smaller than the QBI
                deduction you forfeit plus the cost of running payroll. Raising profit or lowering
                the salary changes that — but the salary has to stay defensible.
              </span>
            </div>
          )}

          {result.salaryExceedsProfit && (
            <div style={{ ...S.noteBox, ...S.noteWarn }}>
              <span style={S.noteLabel}>Salary exceeds profit</span>
              <span style={S.noteText}>
                A salary larger than the business earned is not a viable structure. The figure has
                been capped at profit for this calculation.
              </span>
            </div>
          )}

          {presetNote && (
            <div style={{ ...S.noteBox, ...S.noteOk }}>
              <span style={S.noteText}>{presetNote}</span>
            </div>
          )}

          <div style={S.disclaimer}>
            Estimate only, using 2026 federal figures. It excludes state income tax, state franchise
            or S-corp taxes (several states tax S-corps directly), health insurance and retirement
            plan interactions, and the value of your own time on payroll admin — all of which push
            the real threshold higher.
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
        value={value === 0 ? "" : value.toLocaleString("en-US")}
        placeholder="0"
        onChange={(e) =>
          onChange(e.target.value === "" ? 0 : Math.max(0, Number(e.target.value.replace(/[^0-9.]/g, ""))))
        }
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
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={S.row}>
      <span style={S.rowLabel}>{label}</span>
      <span style={S.rowValue}>{value}</span>
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
  divider: { borderTop: "1px solid #E6EEEA", margin: "6px 0" },
  toggleRow: { display: "flex", gap: 8 },
  toggleBtn: { flex: 1, padding: "9px 10px", fontSize: "0.85rem", fontWeight: 600, border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", color: "#444", cursor: "pointer" },
  toggleBtnActive: { background: PRIMARY, borderColor: PRIMARY, color: "#fff" },
  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12, alignSelf: "start" },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 8, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" },
  bigSub: { fontSize: "0.8rem", color: "#777", marginTop: 2 },
  statRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  stat: { display: "flex", flexDirection: "column", gap: 1 },
  statLabel: { fontSize: "0.78rem", color: "#666" },
  statValue: { fontSize: "1.15rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  breakdown: { display: "flex", flexDirection: "column", gap: 6, borderTop: "1px solid #E6F0EC", paddingTop: 10 },
  row: { display: "flex", justifyContent: "space-between", gap: 12, fontSize: "0.83rem" },
  rowLabel: { color: "#666" },
  rowValue: { fontWeight: 600, fontVariantNumeric: "tabular-nums" },
  noteBox: { borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 2, border: "1px solid #E0EBE7", background: "#fff" },
  noteOk: { background: "#EAF7F1", borderColor: "#BFE6D7" },
  noteWarn: { background: "#FBF4E4", borderColor: "#F0DEB4" },
  noteLabel: { fontSize: "0.78rem", fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: "0.03em" },
  noteText: { fontSize: "0.8rem", color: "#777", lineHeight: 1.5 },
  disclaimer: { fontSize: "0.76rem", color: "#7a8783", lineHeight: 1.5, marginTop: 2 },
};
