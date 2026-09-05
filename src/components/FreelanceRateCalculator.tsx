import { useMemo, useState } from "react";
import {
  calculateFreelanceRate,
  type FreelanceRateInput,
} from "../lib/freelance-rate";
import { type FilingStatus } from "../lib/self-employment-tax";
import { fmtUSD, fmtNum, fmtPct } from "../lib/format";

// Freelance rate island. Works backwards from the take-home pay you want to the hourly rate that
// produces it, rather than forwards from a salary with a guessed markup.
//
// The comparison that does the teaching here is "rate vs. an employee's hourly equivalent". A
// freelancer needs roughly double an employee's salary-per-2,080-hours, and this tool shows WHY
// from the inputs: utilization below 100%, both halves of FICA, unpaid time off, and overhead —
// not a folk multiplier.

interface Props {
  initialData?: Partial<FreelanceRateInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: FreelanceRateInput = {
  targetTakeHome: 70000,
  billableHoursPerWeek: 25,
  weeksWorkedPerYear: 46,
  annualOverhead: 6000,
  filingStatus: "single",
  otherIncome: 0,
  hoursPerDay: 8,
  totalHoursPerWeek: 40,
};

const HOURS_IN_FULL_TIME_YEAR = 2080;

export default function FreelanceRateCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<FreelanceRateInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => calculateFreelanceRate(input), [input]);
  const set = (patch: Partial<FreelanceRateInput>) => setInput((s) => ({ ...s, ...patch }));

  // What an employee earning the equivalent salary makes per hour across a standard 2,080-hour
  // year — the number freelancers wrongly benchmark their rate against.
  const employeeHourly = result.equivalentW2Salary / HOURS_IN_FULL_TIME_YEAR;
  const rateMultiple = employeeHourly > 0 ? result.hourlyRate / employeeHourly : 0;

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
          <Field label="Take-home pay you want (after tax, after expenses)">
            <MoneyInput value={input.targetTakeHome} onChange={(v) => set({ targetTakeHome: v })} />
          </Field>

          <Field label="Hours per week you can actually bill">
            <PlainInput
              value={input.billableHoursPerWeek}
              onChange={(v) => set({ billableHoursPerWeek: v })}
              suffix="hrs"
            />
          </Field>
          <p style={S.hint}>
            Billable hours only — not hours worked. Admin, sales calls, invoicing, and unpaid
            revisions are real work that no client pays for.
          </p>

          <Field label="Hours per week you work in total">
            <PlainInput
              value={input.totalHoursPerWeek ?? 40}
              onChange={(v) => set({ totalHoursPerWeek: v })}
              suffix="hrs"
            />
          </Field>

          <Field label="Weeks per year you work (52 minus time off)">
            <PlainInput
              value={input.weeksWorkedPerYear}
              onChange={(v) => set({ weeksWorkedPerYear: Math.min(52, v) })}
              suffix="wks"
            />
          </Field>

          <div style={S.divider} />

          <Field label="Annual business overhead">
            <MoneyInput value={input.annualOverhead ?? 0} onChange={(v) => set({ annualOverhead: v })} />
          </Field>
          <p style={S.hint}>
            Software, insurance, equipment, accounting, coworking — anything you pay for to be able
            to do the work.
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
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Rate you need to charge</span>
            <span style={S.bigValue}>{fmtUSD(result.hourlyRate, { cents: true })}/hr</span>
            <span style={S.bigSub}>
              {fmtUSD(result.dayRate)} per day · {fmtUSD(result.weeklyRevenueTarget)} per working week
            </span>
          </div>

          <div style={S.statRow}>
            <Stat label="Revenue you must invoice" value={fmtUSD(result.requiredRevenue)} />
            <Stat label="Billable hours a year" value={fmtNum(result.billableHours)} />
          </div>
          <div style={S.statRow}>
            <Stat
              label="Utilization"
              value={result.utilization === null ? "—" : fmtPct(result.utilization * 100, 0)}
            />
            <Stat label="Federal tax on this income" value={fmtUSD(result.federalTax)} />
          </div>

          <div style={S.breakdown}>
            <Row label="Gross revenue" value={fmtUSD(result.requiredRevenue)} />
            <Row label="Business overhead" value={`− ${fmtUSD(input.annualOverhead ?? 0)}`} />
            <Row label="Federal tax (SE + income)" value={`− ${fmtUSD(result.federalTax)}`} />
            <Row label="Your take-home" value={fmtUSD(input.targetTakeHome)} />
          </div>

          <div style={{ ...S.noteBox, ...S.noteOk }}>
            <span style={S.noteLabel}>Why it is not just your old salary ÷ 2,080</span>
            <span style={S.noteText}>
              A salaried employee taking home the same {fmtUSD(input.targetTakeHome)} earns about{" "}
              {fmtUSD(result.equivalentW2Salary)} — roughly {fmtUSD(employeeHourly, { cents: true })} an
              hour across a 2,080-hour year. Your {fmtUSD(result.hourlyRate, { cents: true })} rate is{" "}
              {rateMultiple.toFixed(1)}× that, and the gap is not profit: it covers the{" "}
              {result.utilization === null ? "unbillable" : `${fmtPct((1 - result.utilization) * 100, 0)} of your`}{" "}
              hours nobody pays for, both halves of Social Security and Medicare, your unpaid time
              off, and {fmtUSD(input.annualOverhead ?? 0)} of overhead.
            </span>
          </div>

          {result.unsolvable && (
            <div style={{ ...S.noteBox, ...S.noteWarn }}>
              <span style={S.noteLabel}>Target out of range</span>
              <span style={S.noteText}>
                That combination of take-home and overhead could not be solved. Check the inputs.
              </span>
            </div>
          )}

          <div style={S.disclaimer}>
            Estimate only, using 2026 federal figures. It does not include state or local income
            tax, health insurance premiums, a retirement-plan deduction, or tax credits — all of
            which move the rate you need.
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
  toggleRow: { display: "flex", gap: 8 },
  toggleBtn: { flex: 1, padding: "9px 10px", fontSize: "0.85rem", fontWeight: 600, border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", color: "#444", cursor: "pointer" },
  toggleBtnActive: { background: PRIMARY, borderColor: PRIMARY, color: "#fff" },
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
