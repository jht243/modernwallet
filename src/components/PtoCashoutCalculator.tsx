import { useMemo, useState } from "react";
import { computePtoCashout, type PtoCashoutInput, type PayBasis } from "../lib/pto-cashout";
import { fmtUSD, fmtNum } from "../lib/format";

// PTO / leave-days cash-out calculator island. Unlike a gross-only "sell your leave days" tool,
// this one (a) derives a daily rate the same way for salaried and hourly pay, (b) shows an
// estimated NET payout after a simplified flat-rate tax estimate — since employers commonly
// withhold lump-sum payouts at a flat supplemental-wage rate rather than a blended paycheck rate
// (IRS Publication 15) — and (c) shows the unpaid-time-off value side by side with the cash payout,
// since it's the same dollar figure either way; the real tradeoff is cash-now vs. rest.

interface Props {
  initialData?: Partial<PtoCashoutInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: PtoCashoutInput = {
  payBasis: "annual",
  annualSalary: 72000,
  monthlySalary: 6000,
  hourlyRate: 35,
  hoursPerWeek: 40,
  hoursPerDay: 8,
  workDaysPerWeek: 5,
  daysAvailable: 15,
  daysToSell: 5,
  taxRatePct: 22,
};

export default function PtoCashoutCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<PtoCashoutInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => computePtoCashout(input), [input]);
  const set = (patch: Partial<PtoCashoutInput>) => setInput((s) => ({ ...s, ...patch }));

  const setBasis = (payBasis: PayBasis) => set({ payBasis });
  const hasRate = result.dailyRate != null;

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
          <div style={S.modeRow3}>
            <button type="button" style={{ ...S.modeBtn, ...(input.payBasis === "annual" ? S.modeBtnOn : {}) }} onClick={() => setBasis("annual")}>
              Annual salary
            </button>
            <button type="button" style={{ ...S.modeBtn, ...(input.payBasis === "monthly" ? S.modeBtnOn : {}) }} onClick={() => setBasis("monthly")}>
              Monthly salary
            </button>
            <button type="button" style={{ ...S.modeBtn, ...(input.payBasis === "hourly" ? S.modeBtnOn : {}) }} onClick={() => setBasis("hourly")}>
              Hourly rate
            </button>
          </div>

          {input.payBasis === "annual" && (
            <Field label="Annual salary">
              <MoneyInput value={input.annualSalary ?? 0} onChange={(v) => set({ annualSalary: v })} />
            </Field>
          )}
          {input.payBasis === "monthly" && (
            <Field label="Monthly salary">
              <MoneyInput value={input.monthlySalary ?? 0} onChange={(v) => set({ monthlySalary: v })} />
            </Field>
          )}
          {input.payBasis === "hourly" && (
            <div style={S.twoCol}>
              <Field label="Hourly rate">
                <MoneyInput value={input.hourlyRate ?? 0} onChange={(v) => set({ hourlyRate: v })} cents />
              </Field>
              <Field label="Hours per week">
                <NumberInput value={input.hoursPerWeek ?? 40} onChange={(v) => set({ hoursPerWeek: v })} />
              </Field>
            </div>
          )}

          <div style={S.twoCol}>
            <Field label="Work hours per day">
              <NumberInput value={input.hoursPerDay} onChange={(v) => set({ hoursPerDay: v || 8 })} />
            </Field>
            <Field label="Work days per week">
              <NumberInput value={input.workDaysPerWeek} onChange={(v) => set({ workDaysPerWeek: v || 5 })} />
            </Field>
          </div>

          <div style={S.twoCol}>
            <Field label="Leave days available">
              <NumberInput value={input.daysAvailable} onChange={(v) => set({ daysAvailable: v })} />
            </Field>
            <Field label="Days you want to sell">
              <NumberInput value={input.daysToSell} onChange={(v) => set({ daysToSell: v })} />
            </Field>
          </div>

          <Field label="Estimated tax rate on the payout (optional)">
            <PctInput value={input.taxRatePct ?? 0} onChange={(v) => set({ taxRatePct: v })} />
          </Field>

          <p style={S.hint}>
            Net payout uses one flat rate you enter as a simplified estimate. Real payroll withholding on a lump sum often uses a flat supplemental-wage rate that can differ from your regular paycheck rate — check your pay stub or ask HR for the exact figure.
          </p>
        </div>

        <div style={S.results}>
          {result.daysSoldExceedsAvailable && (
            <div style={S.warnBox}>
              <span style={S.warnLabel}>Days to sell exceeds days available</span>
              <span style={S.warnNote}>
                You entered {fmtNum(input.daysToSell)} days to sell but only {fmtNum(input.daysAvailable)} are available. The numbers below use {fmtNum(result.daysSold)} days, capped at what you have.
              </span>
            </div>
          )}

          {hasRate ? (
            <>
              <div style={S.bigStat}>
                <span style={S.bigLabel}>Gross payout</span>
                <span style={S.bigValue}>{fmtUSD(result.grossPayout)}</span>
                <span style={S.bigSub}>
                  {fmtUSD(result.dailyRate, { cents: true })}/day &times; {fmtNum(result.daysSold)} day{result.daysSold === 1 ? "" : "s"} sold
                </span>
              </div>

              <div style={S.statRow}>
                <Stat label="Daily rate" value={fmtUSD(result.dailyRate, { cents: true })} />
                <Stat label="Days remaining after sale" value={fmtNum(result.remainingDaysAfterSale)} />
              </div>

              {result.estimatedNetPayout != null && (
                <div style={S.cmpBox}>
                  <span style={S.cmpLabel}>Estimated net payout (after tax estimate)</span>
                  <span style={S.cmpValue}>{fmtUSD(result.estimatedNetPayout)}</span>
                  <span style={S.cmpNote}>
                    Roughly {fmtUSD(result.estimatedTaxWithheld)} withheld at the {input.taxRatePct}% estimate you entered. This is a simplified planning figure, not a payroll calculation.
                  </span>
                </div>
              )}

              <div style={S.cmpBox2}>
                <span style={S.cmpLabel}>Value if you used those days as time off instead</span>
                <span style={S.cmpValue2}>{fmtUSD(result.unpaidTimeOffValue)}</span>
                <span style={S.cmpNote}>
                  Same dollar value as the gross payout above, at the same daily rate. Selling the days doesn't create extra money — it trades paid rest for cash now. The real decision is which one you need more.
                </span>
              </div>
            </>
          ) : (
            <div style={S.warnBox}>
              <span style={S.warnLabel}>Enter your pay and days to sell</span>
              <span style={S.warnNote}>Fill in your salary or hourly rate and the number of days above to see your payout.</span>
            </div>
          )}

          <div style={S.disclaimer}>
            Estimate only, not tax or payroll advice. Assumes a fixed number of paid work days per week all year, no overtime, and a single flat tax-rate estimate for withholding. Actual withholding depends on your employer's payroll system and applicable{" "}
            <a href="https://www.irs.gov/publications/p15" target="_blank" rel="noopener">IRS supplemental-wage rules</a>, which this calculator does not replicate exactly.
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
function MoneyInput({ value, onChange, cents }: { value: number; onChange: (v: number) => void; cents?: boolean }) {
  return (
    <div style={S.suffixWrap}>
      <span style={S.prefix}>$</span>
      <input
        style={{ ...S.input, paddingLeft: 22 }}
        inputMode={cents ? "decimal" : "numeric"}
        value={value === 0 ? "" : value.toLocaleString("en-US")}
        placeholder="0"
        onChange={(e) => onChange(e.target.value === "" ? 0 : Math.max(0, Number(e.target.value.replace(/[^0-9.]/g, ""))))}
      />
    </div>
  );
}
function NumberInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
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
function PctInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
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
  modeRow3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, margin: "2px 0" },
  modeBtn: { padding: "9px 8px", fontSize: "0.82rem", fontWeight: 600, border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", color: "#444", cursor: "pointer" },
  modeBtnOn: { background: PRIMARY, borderColor: PRIMARY, color: "#fff" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#444" },
  input: { width: "100%", padding: "10px 12px", fontSize: "1rem", border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A" },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  suffix: { position: "absolute", right: 12, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
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
  cmpBox: { borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 3, border: "1px solid #BFE6D7", background: "#EAF7F1" },
  cmpBox2: { borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 3, border: "1px solid #E0E4EB", background: "#F3F5FA" },
  cmpLabel: { fontSize: "0.78rem", fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: "0.03em" },
  cmpValue: { fontSize: "1.25rem", fontWeight: 800, color: PRIMARY, letterSpacing: "-0.01em" },
  cmpValue2: { fontSize: "1.25rem", fontWeight: 800, color: "#3D4A66", letterSpacing: "-0.01em" },
  cmpNote: { fontSize: "0.8rem", color: "#777", lineHeight: 1.4 },
  warnBox: { borderRadius: 10, padding: "14px", display: "flex", flexDirection: "column", gap: 4, border: "1px solid #F0DEB4", background: "#FBF4E4" },
  warnLabel: { fontSize: "0.95rem", fontWeight: 700, color: "#8A5A16" },
  warnNote: { fontSize: "0.85rem", color: "#6B5628", lineHeight: 1.5 },
  disclaimer: { fontSize: "0.76rem", color: "#7a8783", lineHeight: 1.5, marginTop: 2 },
};
