import { useMemo, useState } from "react";
import { useDraft } from "./calc-ui";
import { computeInterestPerDay, type InterestPerDayInput } from "../lib/interest-per-day";
import { fmtUSD, fmtPct } from "../lib/format";
import { computePerDiem, daysBetween, DAY_BASES, type DayBasis } from "../lib/per-diem-interest";
import ToolPicks, { book } from "./ToolPicks";

/** APR at or above this reads as a card or loan balance, below it as savings (book picks only). */
const DEBT_APR_PCT = 10;

// Interest-per-day island. Beyond the basic "principal x rate / 365" most day-rate tools stop at,
// this one also surfaces the effective annual yield (APY) once that daily rate compounds daily —
// the same interest-rate-vs-APY gap the CFPB flags for savers comparing account offers. Standalone,
// no host coupling (mirrors PersonalLoanCalculator / BusinessLoanPayoffCalculator).

interface Props {
  initialData?: Partial<InterestPerDayInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: InterestPerDayInput = {
  principal: 10000,
  annualRatePct: 4.5,
};

export default function InterestPerDayCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<InterestPerDayInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => computeInterestPerDay(input), [input]);
  const set = (patch: Partial<InterestPerDayInput>) => setInput((s) => ({ ...s, ...patch }));

  const hasCompoundingGain = (result.compoundingGain ?? 0) >= 0.5;

  // Payoff on a date: days of unpaid interest typed directly, or counted from two dates.
  const [payoff, setPayoff] = useState({ days: 0, from: "", to: "", basis: 365 as DayBasis });
  const datedDays = daysBetween(payoff.from, payoff.to);
  const days = datedDays ?? payoff.days;
  const pd = useMemo(
    () => computePerDiem({ principal: input.principal, annualRatePct: input.annualRatePct, dayBasis: payoff.basis, days }),
    [input.principal, input.annualRatePct, payoff.basis, days],
  );
  const isDebt = input.annualRatePct >= DEBT_APR_PCT;

  return (
    <div style={S.wrap}>
      {(heading || subheading) && (
        <div style={S.head}>
          {heading && <div style={S.heading}>{heading}</div>}
          {subheading && <div style={S.subheading}>{subheading}</div>}
        </div>
      )}

      <div style={S.grid} className="mw-stack">
        <div style={S.inputs} className="mw-in">
          <Field label="Balance or loan amount">
            <MoneyInput value={input.principal} onChange={(v) => set({ principal: v })} />
          </Field>
          <Field label="Annual interest rate (APR)">
            <PctInput value={input.annualRatePct} onChange={(v) => set({ annualRatePct: v })} />
          </Field>
          <p style={S.hint}>
            Works for either side: a savings/HYSA/CD balance earning interest, or a loan/credit card balance accruing it. Enter the stated annual rate — the calculator does the daily math.
          </p>
        </div>

        <div style={S.results} className="mw-out">
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Interest per day</span>
            <span style={S.bigValue}>{fmtUSD(result.perDay, { cents: true })}</span>
            <span style={S.bigSub}>on {fmtUSD(input.principal)} at {fmtPct(input.annualRatePct)}</span>
          </div>

          <div style={S.statRow}>
            <Stat label="Per week" value={fmtUSD(result.perWeek, { cents: true })} />
            <Stat label="Per month (30 days)" value={fmtUSD(result.perMonth, { cents: true })} />
          </div>
          <div style={S.statRow}>
            <Stat label="Simple annual (no compounding)" value={fmtUSD(result.simpleAnnual)} />
            <Stat label="Effective annual yield (APY)" value={fmtPct(result.apyPct, 3)} />
          </div>

          <div style={{ ...S.aprBox, ...(hasCompoundingGain ? S.aprWarn : S.aprOk) }}>
            <span style={S.aprLabel}>What daily compounding adds over a year</span>
            <span style={S.aprValue}>{fmtUSD(result.compoundingGain, { cents: true })}</span>
            <span style={S.aprNote}>
              {hasCompoundingGain
                ? `A stated rate of ${fmtPct(input.annualRatePct)}, compounded daily, actually yields ${fmtPct(result.apyPct, 3)} (APY) over a year — worth ${fmtUSD(result.compoundingGain, { cents: true })} more than the simple, non-compounding total.`
                : "At this rate and balance, daily compounding adds less than 50 cents over a year — the simple and compounded totals are effectively the same."}
            </span>
          </div>

          <div style={S.payoffBox}>
            <span style={S.aprLabel}>Paying it off on a date?</span>
            <div style={S.statRow}>
              <Field label="Days of unpaid interest">
                <input style={S.input} inputMode="numeric" value={datedDays ?? (payoff.days || "")} placeholder="0" disabled={datedDays != null}
                  aria-label="Days of unpaid interest"
                  onChange={(e) => setPayoff((s) => ({ ...s, days: Math.min(3660, Math.max(0, Math.round(Number(e.target.value.replace(/[^0-9]/g, "")) || 0))) }))} />
              </Field>
              <Field label="Day count">
                <select style={S.input} value={payoff.basis} aria-label="Days in the interest year"
                  onChange={(e) => setPayoff((s) => ({ ...s, basis: Number(e.target.value) as DayBasis }))}>
                  {DAY_BASES.map((b) => <option key={b} value={b}>{b}-day year</option>)}
                </select>
              </Field>
            </div>
            <div style={S.statRow}>
              <Field label="Or: interest paid through">
                <input style={S.input} type="date" value={payoff.from} onChange={(e) => setPayoff((s) => ({ ...s, from: e.target.value }))} />
              </Field>
              <Field label="Payoff date">
                <input style={S.input} type="date" value={payoff.to} onChange={(e) => setPayoff((s) => ({ ...s, to: e.target.value }))} />
              </Field>
            </div>
            {days > 0 && input.principal > 0 ? (
              <>
                <div style={S.statRow}>
                  <Stat label={`Per diem (${payoff.basis}-day year)`} value={fmtUSD(pd.perDiem, { cents: true })} />
                  <Stat label={`Interest for ${days} day${days === 1 ? "" : "s"}`} value={fmtUSD(pd.accrued, { cents: true })} />
                </div>
                <div style={S.stat}>
                  <span style={S.statLabel}>Estimated payoff amount</span>
                  <span style={S.payoffValue}>{fmtUSD(pd.payoff, { cents: true })}</span>
                </div>
              </>
            ) : (
              <span style={S.aprNote}>Enter the days since interest was last paid (or both dates) to see the payoff amount.</span>
            )}
            <span style={S.aprNote}>Balance + daily interest for each unpaid day. Your lender's written payoff statement can add fees and is the figure to pay.</span>
          </div>

          <div style={S.disclaimer}>
            Estimate only. Assumes a 365-day year (the payoff box above lets you pick 360) and that interest accrues on the full balance every day (the common method for savings accounts and revolving credit). Some accounts use a 360-day count or compound monthly instead of daily — check your account's disclosure for its exact method.
          </div>

          {input.principal > 0 && input.annualRatePct > 0 && (
            <ToolPicks
              tool="interest-per-day"
              heading={isDebt ? "Further reading on paying down high-interest debt" : "Further reading on growing your savings"}
              picks={isDebt
                ? [
                    book("totalMoneyMakeover", "A step-by-step plan to clear the balance that's costing you every day."),
                    book("iwtytbr", "The automatic system that keeps the balance from coming back."),
                  ]
                : [
                    book("iwtytbr", "Where to keep a savings balance and how to automate adding to it."),
                    book("littleBook", "The next step once the money has outgrown a savings account."),
                  ]}
            />
          )}
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
  // useDraft keeps a typed "6430." while the reader enters "6430.55" (re-rendering the parsed number dropped the point).
  const d = useDraft(value, onChange, (v) => v.toLocaleString("en-US"));
  return (
    <div style={S.suffixWrap}>
      <span style={S.prefix}>$</span>
      <input
        style={{ ...S.input, paddingLeft: 22 }}
        inputMode="decimal"
        value={d.text}
        placeholder="0"
        onChange={(e) => d.onChange(e.target.value)}
        onBlur={d.onBlur}
      />
    </div>
  );
}
function PctInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  // useDraft keeps a typed "6." while the reader enters "6.5" (re-rendering the parsed number dropped the point).
  const d = useDraft(value, onChange);
  return (
    <div style={S.suffixWrap}>
      <input
        style={S.input}
        inputMode="decimal"
        value={d.text}
        placeholder="0"
        onChange={(e) => d.onChange(e.target.value)}
        onBlur={d.onBlur}
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
  statRow: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 12 },
  stat: { display: "flex", flexDirection: "column", gap: 1 },
  statLabel: { fontSize: "0.78rem", color: "#666" },
  statValue: { fontSize: "1.15rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  aprBox: { borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 1, border: "1px solid #E0EBE7", background: "#fff" },
  aprOk: { background: "#EAF7F1", borderColor: "#BFE6D7" },
  aprWarn: { background: "#FBF4E4", borderColor: "#F0DEB4" },
  aprLabel: { fontSize: "0.78rem", fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: "0.03em" },
  aprValue: { fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" },
  aprNote: { fontSize: "0.8rem", color: "#777" },
  disclaimer: { fontSize: "0.76rem", color: "#7a8783", lineHeight: 1.5, marginTop: 2 },
  payoffBox: { borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8, border: "1px solid #E0EBE7", background: "#fff" },
  payoffValue: { fontSize: "1.4rem", fontWeight: 800, color: PRIMARY, fontVariantNumeric: "tabular-nums" },
};
