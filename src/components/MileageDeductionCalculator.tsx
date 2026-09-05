import { useMemo, useState } from "react";
import {
  calculateMileageDeduction,
  type MileageDeductionInput,
  BUSINESS_RATE_2026_H1,
  BUSINESS_RATE_2026_H2,
} from "../lib/mileage-deduction";
import { fmtUSD, fmtNum, fmtPct } from "../lib/format";

// Business mileage deduction island. Two design decisions that separate it from every other
// mileage calculator:
//
//   1. Miles are entered by HALF-YEAR, because 2026 has two business standard rates — 72.5¢ for
//      January–June and 76¢ for July–December. A single annual box would be wrong by construction.
//   2. The headline is TAX SAVED, not deduction size. A mileage deduction cuts self-employment tax
//      as well as income tax, so its real value is roughly double what an income-tax-only figure
//      implies, and that is the number a driver is actually deciding about.

interface Props {
  initialData?: Partial<MileageDeductionInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: MileageDeductionInput = {
  milesFirstHalf: 5000,
  milesSecondHalf: 7000,
  actualExpensesTotal: 0,
  businessUsePercent: 100,
  marginalRate: 0.12,
  subjectToSeTax: true,
  firstYearForVehicle: false,
};

const RATE_OPTIONS: { label: string; value: number }[] = [
  { label: "10%", value: 0.1 },
  { label: "12%", value: 0.12 },
  { label: "22%", value: 0.22 },
  { label: "24%", value: 0.24 },
  { label: "32%", value: 0.32 },
];

export default function MileageDeductionCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<MileageDeductionInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => calculateMileageDeduction(input), [input]);
  const set = (patch: Partial<MileageDeductionInput>) => setInput((s) => ({ ...s, ...patch }));

  const showsComparison = result.actualDeduction !== null;

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
          <Field label={`Business miles, Jan 1 – Jun 30 (${(BUSINESS_RATE_2026_H1 * 100).toFixed(1)}¢/mi)`}>
            <PlainInput value={input.milesFirstHalf} onChange={(v) => set({ milesFirstHalf: v })} suffix="mi" />
          </Field>
          <Field label={`Business miles, Jul 1 – Dec 31 (${(BUSINESS_RATE_2026_H2 * 100).toFixed(0)}¢/mi)`}>
            <PlainInput value={input.milesSecondHalf} onChange={(v) => set({ milesSecondHalf: v })} suffix="mi" />
          </Field>
          <p style={S.hint}>
            The IRS raised the business rate mid-year in 2026, so the two halves are deducted at
            different rates. Commuting from home to a regular workplace never counts.
          </p>

          <div style={S.divider} />

          <Field label="Marginal income tax rate">
            <div style={S.toggleRow}>
              {RATE_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  style={{ ...S.toggleBtnSm, ...(input.marginalRate === o.value ? S.toggleBtnActive : {}) }}
                  onClick={() => set({ marginalRate: o.value })}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Total actual vehicle costs for the year (optional)">
            <MoneyInput
              value={input.actualExpensesTotal ?? 0}
              onChange={(v) => set({ actualExpensesTotal: v })}
            />
          </Field>
          <p style={S.hint}>
            Gas, insurance, repairs, tires, registration, and depreciation or lease payments. Fill
            this in to compare the two methods.
          </p>

          {(input.actualExpensesTotal ?? 0) > 0 && (
            <Field label="Share of driving that was for business">
              <PlainInput
                value={input.businessUsePercent ?? 100}
                onChange={(v) => set({ businessUsePercent: Math.min(100, v) })}
                suffix="%"
              />
            </Field>
          )}

          <label style={S.checkRow}>
            <input
              type="checkbox"
              checked={input.firstYearForVehicle === true}
              onChange={(e) => set({ firstYearForVehicle: e.target.checked })}
            />
            <span style={S.checkLabel}>2026 is the first year I used this vehicle for business</span>
          </label>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Tax this deduction saves you</span>
            <span style={S.bigValue}>{fmtUSD(result.totalTaxSaved)}</span>
            <span style={S.bigSub}>
              on a {fmtUSD(result.chosenDeduction)} deduction — a combined{" "}
              {fmtPct(result.combinedSavingsRate * 100, 2)} of income tax and self-employment tax
            </span>
          </div>

          <div style={S.statRow}>
            <Stat label="Income tax saved" value={fmtUSD(result.incomeTaxSaved)} />
            <Stat label="Self-employment tax saved" value={fmtUSD(result.seTaxSaved)} />
          </div>

          <div style={S.breakdown}>
            <Row
              label={`${fmtNum(input.milesFirstHalf)} mi × ${(BUSINESS_RATE_2026_H1 * 100).toFixed(1)}¢ (Jan–Jun)`}
              value={fmtUSD(result.standardFirstHalf)}
            />
            <Row
              label={`${fmtNum(input.milesSecondHalf)} mi × ${(BUSINESS_RATE_2026_H2 * 100).toFixed(0)}¢ (Jul–Dec)`}
              value={fmtUSD(result.standardSecondHalf)}
            />
            <Row
              label={`Standard mileage total (${fmtNum(result.totalBusinessMiles)} mi, blended ${(result.blendedRate * 100).toFixed(2)}¢)`}
              value={fmtUSD(result.standardDeduction)}
            />
            {showsComparison && (
              <Row
                label={`Actual expenses × ${fmtNum(input.businessUsePercent ?? 100)}% business use`}
                value={fmtUSD(result.actualDeduction)}
              />
            )}
          </div>

          {showsComparison && (
            <div style={{ ...S.noteBox, ...S.noteOk }}>
              <span style={S.noteLabel}>
                {result.betterMethod === "standard" ? "Standard mileage wins" : "Actual expenses win"}
              </span>
              <span style={S.noteText}>
                The {result.betterMethod === "standard" ? "standard mileage rate" : "actual expense method"} is
                worth {fmtUSD(result.advantage)} more this year.
              </span>
            </div>
          )}

          {result.methodChoiceLocksIn && (
            <div style={{ ...S.noteBox, ...S.noteWarn }}>
              <span style={S.noteLabel}>This choice is permanent for this vehicle</span>
              <span style={S.noteText}>
                Actual expenses wins this year, but if you take it in the first year you use a
                vehicle for business, you can never switch to the standard mileage rate for that
                vehicle. Standard mileage taken first keeps both doors open.
              </span>
            </div>
          )}

          <div style={S.disclaimer}>
            Estimate only, using the 2026 IRS business standard mileage rates. It assumes you own or
            lease the vehicle and keep a contemporaneous mileage log, and it does not model
            depreciation recapture, §179 expensing, or lease inclusion amounts.
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
function PlainInput({
  value,
  onChange,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div style={S.suffixWrap}>
      <input
        style={S.input}
        inputMode="decimal"
        value={value === 0 ? "" : value.toLocaleString("en-US")}
        placeholder="0"
        onChange={(e) =>
          onChange(e.target.value === "" ? 0 : Math.max(0, Number(e.target.value.replace(/[^0-9.]/g, ""))))
        }
      />
      {suffix && <span style={S.suffix}>{suffix}</span>}
    </div>
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
  suffix: { position: "absolute", right: 11, color: "#888", fontSize: "0.9rem", pointerEvents: "none" },
  hint: { fontSize: "0.82rem", color: "#666", lineHeight: 1.5, margin: "2px 0 0" },
  divider: { borderTop: "1px solid #E6EEEA", margin: "6px 0" },
  toggleRow: { display: "flex", gap: 6 },
  toggleBtnSm: { flex: 1, padding: "8px 4px", fontSize: "0.82rem", fontWeight: 600, border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", color: "#444", cursor: "pointer" },
  toggleBtnActive: { background: PRIMARY, borderColor: PRIMARY, color: "#fff" },
  checkRow: { display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" },
  checkLabel: { fontSize: "0.85rem", color: "#444", lineHeight: 1.4 },
  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12, alignSelf: "start" },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 8, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "2rem", fontWeight: 800, color: PRIMARY, letterSpacing: "-0.02em" },
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
