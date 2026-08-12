import { useMemo, useState } from "react";
import { computeCreditCardPayoff, type CreditCardPayoffInput, type PayoffMode } from "../lib/credit-card-payoff";
import { fmtUSD, fmtMonths } from "../lib/format";

// Credit card payoff calculator island. Unlike a basic "payment → payoff date" tool, this one runs
// the minimum-payment-only path side by side automatically, using the greater-of-$25-or-1%-plus-
// interest formula behind the minimum-payment warning box required on every statement (Reg Z, 12
// CFR 1026.7(b)(12)) — so a reader sees the real cost of paying only the minimum, not just a
// warning that it's expensive. Standalone engine (mirrors PersonalLoanCalculator / AutoLoanCalculator).

interface Props {
  initialData?: Partial<CreditCardPayoffInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: CreditCardPayoffInput = {
  balance: 6000,
  aprPct: 24,
  mode: "payment",
  monthlyPayment: 250,
  targetMonths: 24,
};

export default function CreditCardPayoffCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<CreditCardPayoffInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => computeCreditCardPayoff(input), [input]);
  const set = (patch: Partial<CreditCardPayoffInput>) => setInput((s) => ({ ...s, ...patch }));

  const setMode = (mode: PayoffMode) => set({ mode });

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
          <Field label="Current balance">
            <MoneyInput value={input.balance} onChange={(v) => set({ balance: v })} />
          </Field>
          <Field label="APR (interest rate)">
            <PctInput value={input.aprPct} onChange={(v) => set({ aprPct: v })} />
          </Field>

          <div style={S.modeRow}>
            <button
              type="button"
              style={{ ...S.modeBtn, ...(input.mode === "payment" ? S.modeBtnOn : {}) }}
              onClick={() => setMode("payment")}
            >
              I know my payment
            </button>
            <button
              type="button"
              style={{ ...S.modeBtn, ...(input.mode === "months" ? S.modeBtnOn : {}) }}
              onClick={() => setMode("months")}
            >
              I have a payoff date
            </button>
          </div>

          {input.mode === "payment" ? (
            <Field label="Monthly payment">
              <MoneyInput value={input.monthlyPayment ?? 0} onChange={(v) => set({ monthlyPayment: v })} />
            </Field>
          ) : (
            <Field label="Pay it off in">
              <select
                style={S.input}
                value={input.targetMonths ?? 24}
                onChange={(e) => set({ targetMonths: Number(e.target.value) })}
                aria-label="Target payoff time in months"
              >
                {[6, 12, 18, 24, 36, 48, 60].map((m) => (
                  <option key={m} value={m}>{fmtMonths(m)}</option>
                ))}
              </select>
            </Field>
          )}

          <p style={S.hint}>
            The "minimum payment only" comparison below assumes the common issuer formula of the greater of $25 or 1% of your balance plus that month's interest, recalculated every month. Your card's actual minimum may differ slightly — check your statement.
          </p>
        </div>

        <div style={S.results}>
          {input.mode === "payment" && result.paymentTooLow && (
            <div style={S.warnBox}>
              <span style={S.warnLabel}>This payment won't pay off the balance</span>
              <span style={S.warnNote}>
                At {fmtUSD(input.balance, { cents: false })} and {input.aprPct}% APR, interest alone runs about {fmtUSD((input.balance * (input.aprPct / 100)) / 12, { cents: true })} a month. Raise the monthly payment above that to see a payoff date.
              </span>
            </div>
          )}

          {(input.mode === "months" || (input.mode === "payment" && !result.paymentTooLow)) && (
            <>
              <div style={S.bigStat}>
                <span style={S.bigLabel}>
                  {input.mode === "months" ? "Payment needed" : "Time to pay off"}
                </span>
                <span style={S.bigValue}>
                  {input.mode === "months" ? fmtUSD(result.requiredMonthlyPayment) : fmtMonths(result.monthsToPayoff)}
                </span>
                <span style={S.bigSub}>
                  {input.mode === "months" ? `per month for ${fmtMonths(input.targetMonths)}` : "at the payment you entered"}
                </span>
              </div>

              <div style={S.statRow}>
                <Stat label="Total interest paid" value={fmtUSD(result.totalInterest)} />
                <Stat label="Total you'll pay" value={fmtUSD(result.totalPaid)} />
              </div>

              <div style={S.cmpBox}>
                <span style={S.cmpLabel}>Vs. paying only the minimum</span>
                {result.minimumOnly.neverPaysOff ? (
                  <span style={S.cmpNote}>
                    At {input.aprPct}% APR, the typical minimum payment on this balance would barely cover interest — the balance would never meaningfully shrink. Your plan above is the only path that actually pays this off.
                  </span>
                ) : (
                  <>
                    <span style={S.cmpValue}>
                      Saves {fmtUSD(result.interestSavedVsMinimum)} in interest
                    </span>
                    <span style={S.cmpNote}>
                      Minimum payments alone would take {fmtMonths(result.minimumOnly.monthsToPayoff)}{result.minimumOnly.monthsCapped ? "+" : ""} and cost {fmtUSD(result.minimumOnly.totalInterest)} in interest — starting around {fmtUSD(result.minimumOnly.firstMonthPayment)}/month and shrinking as the balance does.
                    </span>
                  </>
                )}
              </div>
            </>
          )}

          <div style={S.disclaimer}>
            Estimate only. Assumes interest accrues monthly on the remaining balance at a fixed APR, with no new charges, fees, or promotional rate changes. A real card statement may compound differently or add fees this calculator doesn't model.
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
        inputMode="numeric"
        value={value === 0 ? "" : value.toLocaleString("en-US")}
        placeholder="0"
        onChange={(e) => onChange(e.target.value === "" ? 0 : Math.max(0, Number(e.target.value.replace(/[^0-9.]/g, ""))))}
      />
    </div>
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
  modeRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "2px 0" },
  modeBtn: { padding: "9px 10px", fontSize: "0.85rem", fontWeight: 600, border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", color: "#444", cursor: "pointer" },
  modeBtnOn: { background: PRIMARY, borderColor: PRIMARY, color: "#fff" },
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
  cmpBox: { borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 3, border: "1px solid #E0EBE7", background: "#EAF7F1", borderColor: "#BFE6D7" },
  cmpLabel: { fontSize: "0.78rem", fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: "0.03em" },
  cmpValue: { fontSize: "1.25rem", fontWeight: 800, color: PRIMARY, letterSpacing: "-0.01em" },
  cmpNote: { fontSize: "0.8rem", color: "#777", lineHeight: 1.4 },
  warnBox: { borderRadius: 10, padding: "14px", display: "flex", flexDirection: "column", gap: 4, border: "1px solid #F0DEB4", background: "#FBF4E4" },
  warnLabel: { fontSize: "0.95rem", fontWeight: 700, color: "#8A5A16" },
  warnNote: { fontSize: "0.85rem", color: "#6B5628", lineHeight: 1.5 },
  disclaimer: { fontSize: "0.76rem", color: "#7a8783", lineHeight: 1.5, marginTop: 2 },
};
