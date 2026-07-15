import { useMemo, useState } from "react";
import { computeBusinessLoanPayoff, type BusinessLoanPayoffInput } from "../lib/business-loan-payoff";
import { fmtUSD, fmtMonths } from "../lib/format";

// Business term-loan payoff calculator island. For a standard amortizing SBA/bank/equipment loan
// (NOT an MCA or invoice factoring — those are priced by factor rate; see the dedicated business
// financing hub calculators for those). Shows the scheduled payoff plus an extra-payment scenario.
// Standalone — no host coupling (mirrors TrumpAccountCalculator / AutoLoanCalculator).

interface Props {
  initialData?: Record<string, unknown>;
  heading?: string;
  subheading?: string;
}

type Goal = "extra-payment" | "target-date";

export default function BusinessLoanPayoffCalculator({ initialData, heading, subheading }: Props) {
  const [goal, setGoal] = useState<Goal>("extra-payment");
  const [v, setV] = useState<BusinessLoanPayoffInput>({
    loanBalance: n(initialData?.loanBalance, 100000),
    interestRatePct: n(initialData?.interestRatePct, 9.5),
    remainingTermMonths: n(initialData?.remainingTermMonths, 60),
    extraMonthlyPayment: n(initialData?.extraMonthlyPayment, 300),
    targetPayoffMonths: n(initialData?.targetPayoffMonths, 36),
  });
  const effectiveInput: BusinessLoanPayoffInput =
    goal === "target-date" ? { ...v, targetPayoffMonths: v.targetPayoffMonths } : { ...v, targetPayoffMonths: 0 };
  const r = useMemo(() => computeBusinessLoanPayoff(effectiveInput), [effectiveInput]);
  const set = (p: Partial<BusinessLoanPayoffInput>) => setV((s) => ({ ...s, ...p }));

  return (
    <div style={S.wrap}>
      {(heading || subheading) && (
        <div style={S.head}>
          {heading && <div style={S.heading}>{heading}</div>}
          {subheading && <div style={S.subheading}>{subheading}</div>}
        </div>
      )}
      <div style={S.goalToggle} role="tablist" aria-label="Payoff goal">
        <button type="button" style={{ ...S.goalBtn, ...(goal === "extra-payment" ? S.goalBtnActive : {}) }} onClick={() => setGoal("extra-payment")}>I can pay extra each month</button>
        <button type="button" style={{ ...S.goalBtn, ...(goal === "target-date" ? S.goalBtnActive : {}) }} onClick={() => setGoal("target-date")}>I want a payoff date</button>
      </div>
      <div style={S.grid}>
        <div style={S.inputs}>
          <Field label="Remaining loan balance"><Money v={v.loanBalance} on={(x) => set({ loanBalance: x })} /></Field>
          <div style={S.row2}>
            <Field label="Interest rate (APR)"><Pct v={v.interestRatePct} on={(x) => set({ interestRatePct: x })} /></Field>
            <Field label="Remaining term (months)"><Plain v={v.remainingTermMonths} max={480} on={(x) => set({ remainingTermMonths: x })} /></Field>
          </div>
          {goal === "extra-payment" ? (
            <Field label="Extra monthly payment"><Money v={v.extraMonthlyPayment} on={(x) => set({ extraMonthlyPayment: x })} /></Field>
          ) : (
            <Field label="Debt-free in how many months?"><Plain v={v.targetPayoffMonths ?? 36} max={v.remainingTermMonths} on={(x) => set({ targetPayoffMonths: x })} /></Field>
          )}
        </div>

        <div style={S.results}>
          {goal === "target-date" ? (
            <div style={S.bigStat}>
              <span style={S.bigLabel}>Extra payment needed</span>
              <span style={S.bigValue}>{fmtUSD(r.requiredExtraForTarget)}</span>
              <span style={S.bigSub}>{r.requiredExtraForTarget === 0 ? "you're already on pace for this — no extra needed" : `per month, on top of your scheduled payment, to be debt-free in ${fmtMonths(v.targetPayoffMonths)}`}</span>
            </div>
          ) : (
            <div style={S.bigStat}>
              <span style={S.bigLabel}>New payoff time</span>
              <span style={S.bigValue}>{fmtMonths(r.monthsToPayoff)}</span>
              <span style={S.bigSub}>vs {fmtMonths(r.baselineMonths)} on the original schedule</span>
            </div>
          )}
          <div style={S.statRow}>
            <Stat label="Scheduled payment (P&I)" value={fmtUSD(r.scheduledPayment)} />
            <Stat label="Interest saved" value={fmtUSD(r.interestSaved)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Total interest (with extra)" value={fmtUSD(r.totalInterest)} />
            <Stat label="Months saved" value={r.monthsSaved != null ? `${r.monthsSaved}` : "—"} />
          </div>
          <div style={S.disclaimer}>
            Estimate only. Assumes a standard fully-amortizing loan (fixed rate, extra payment applied straight to principal). Confirm your lender applies extra payments to principal and does not charge a prepayment penalty before sending extra money — some SBA and bank loan agreements restrict early payoff.
          </div>
        </div>
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
function Plain({ v, on, max }: { v: number; on: (n: number) => void; max?: number }) {
  return <input style={S.input} inputMode="numeric" value={v} onChange={(e) => on(clamp(parse(e.target.value), max))} />;
}
function Stat({ label, value }: { label: string; value: string }) {
  return <div style={S.stat}><span style={S.statLabel}>{label}</span><span style={S.statValue}>{value}</span></div>;
}
function parse(s: string): number { if (s === "") return 0; return Math.max(0, Number(s.replace(/[^0-9.]/g, "")) || 0); }
function clamp(n: number, max?: number): number { return typeof max === "number" ? Math.min(n, max) : n; }
function n(x: unknown, d: number): number { const v = Number(x); return Number.isFinite(v) ? v : d; }

const PRIMARY = "#0E7C66";
const S: Record<string, React.CSSProperties> = {
  wrap: { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1A1A1A" },
  head: { marginBottom: 16 },
  heading: { fontSize: "1.2rem", fontWeight: 700 },
  subheading: { fontSize: "0.95rem", color: "#555", marginTop: 2 },
  goalToggle: { display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" },
  goalBtn: { padding: "8px 14px", borderRadius: 999, border: "1px solid #D0DAD6", background: "#fff", color: "#444", fontSize: "0.86rem", fontWeight: 600, cursor: "pointer" },
  goalBtnActive: { background: PRIMARY, borderColor: PRIMARY, color: "#fff" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 },
  inputs: { display: "flex", flexDirection: "column", gap: 12 },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, alignItems: "end" },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#444" },
  input: { width: "100%", padding: "10px 12px", fontSize: "1rem", border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A" },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  suffix: { position: "absolute", right: 12, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12, alignSelf: "start" },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 10, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "1.9rem", fontWeight: 800, color: PRIMARY, letterSpacing: "-0.02em" },
  bigSub: { fontSize: "0.82rem", color: "#777" },
  statRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  stat: { display: "flex", flexDirection: "column", gap: 1 },
  statLabel: { fontSize: "0.78rem", color: "#666" },
  statValue: { fontSize: "1.12rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  disclaimer: { fontSize: "0.76rem", color: "#7a8783", lineHeight: 1.5, marginTop: 2 },
};
