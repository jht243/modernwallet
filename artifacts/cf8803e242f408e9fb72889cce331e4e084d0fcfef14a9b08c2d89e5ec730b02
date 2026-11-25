import { useMemo, useState } from "react";
import { computeDebtPayoff, payoffDateLabel, type DebtPayoffInput, type DebtRow, type StrategyResult } from "../lib/debt-payoff";
import { fmtUSD, fmtMonths } from "../lib/format";
import { Field, MoneyInput, PctInput, Stat, S } from "./calc-ui";

// Debt payoff island. The reader enters several debts, an extra monthly amount and an optional lump
// sum. The result table compares avalanche (highest APR first), snowball (smallest balance first)
// and minimums-only on payoff date, total interest and payoff order. A month slider steps the three
// plans forward so the reader sees how a freed minimum rolls onto the next debt. Reduced-motion safe:
// bars change width without a CSS transition unless the reader allows motion.

interface Props {
  initialData?: Partial<DebtPayoffInput>;
  heading?: string;
  subheading?: string;
}

const MAX_DEBTS = 10;
const COLORS = ["#0E7C66", "#C2410C", "#1D4ED8", "#7C3AED", "#B45309", "#0F766E", "#BE185D", "#4D7C0F", "#475569", "#A21CAF"];

const DEFAULTS: DebtPayoffInput = {
  debts: [
    { name: "Store card", balance: 2500, aprPct: 19.99, minPayment: 75 },
    { name: "Credit card", balance: 6000, aprPct: 27.99, minPayment: 160 },
    { name: "Personal loan", balance: 11000, aprPct: 11, minPayment: 280 },
  ],
  extraMonthly: 200,
  lumpSum: 0,
};

const STRATEGY_LABEL: Record<string, string> = {
  avalanche: "Avalanche (highest APR first)",
  snowball: "Snowball (smallest balance first)",
  minimums: "Minimums only",
};

export default function DebtPayoffCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<DebtPayoffInput>({ ...DEFAULTS, ...initialData });
  const [month, setMonth] = useState(0);
  const result = useMemo(() => computeDebtPayoff(input), [input]);
  const set = (patch: Partial<DebtPayoffInput>) => setInput((s) => ({ ...s, ...patch }));
  const setDebt = (i: number, patch: Partial<DebtRow>) =>
    set({ debts: input.debts.map((d, j) => (j === i ? { ...d, ...patch } : d)) });
  const addDebt = () => {
    if (input.debts.length < MAX_DEBTS) set({ debts: [...input.debts, { name: `Debt ${input.debts.length + 1}`, balance: 0, aprPct: 0, minPayment: 0 }] });
  };
  const removeDebt = (i: number) => set({ debts: input.debts.filter((_, j) => j !== i) });

  const names = result.debts.map((d, i) => d.name?.trim() || `Debt ${i + 1}`);
  const { avalanche, snowball, minimums } = result;
  const horizon = Math.min(
    Math.max(avalanche.months ?? 0, snowball.months ?? 0, 1),
    Math.max(avalanche.balanceByMonth.length - 1, snowball.balanceByMonth.length - 1),
  );
  const step = Math.min(month, horizon);
  const today = new Date();

  const dateOf = (r: StrategyResult) => (r.months == null ? "Not paid off" : payoffDateLabel(r.months, today));
  const orderOf = (r: StrategyResult) => (r.payoffOrder.length ? r.payoffOrder.map((i) => names[i]).join(", then ") : "none");
  const interestOf = (r: StrategyResult) => (r.totalInterest == null ? "Never at these payments" : fmtUSD(r.totalInterest, { cents: false }));

  const hasDebts = result.debts.length > 0;

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
          {input.debts.map((d, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={S.label}>Debt {i + 1}</span>
                {input.debts.length > 1 && (
                  <button type="button" onClick={() => removeDebt(i)} style={miniBtn} aria-label={`Remove debt ${i + 1}`}>
                    Remove
                  </button>
                )}
              </div>
              <input
                style={S.input}
                value={d.name ?? ""}
                onChange={(e) => setDebt(i, { name: e.target.value })}
                aria-label={`Name of debt ${i + 1}`}
                placeholder="Name (optional)"
                maxLength={30}
              />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 8 }}>
                <Field label="Balance"><MoneyInput value={d.balance} onChange={(v) => setDebt(i, { balance: v })} /></Field>
                <Field label="APR"><PctInput value={d.aprPct} onChange={(v) => setDebt(i, { aprPct: v })} label={`APR of debt ${i + 1}`} /></Field>
                <Field label="Minimum payment"><MoneyInput value={d.minPayment} onChange={(v) => setDebt(i, { minPayment: v })} /></Field>
              </div>
            </div>
          ))}
          {input.debts.length < MAX_DEBTS && (
            <button type="button" onClick={addDebt} style={addBtn}>
              + Add a debt
            </button>
          )}
          <div style={S.twoCol}>
            <Field label="Extra per month"><MoneyInput value={input.extraMonthly} onChange={(v) => set({ extraMonthly: v })} /></Field>
            <Field label="One-time lump sum"><MoneyInput value={input.lumpSum} onChange={(v) => set({ lumpSum: v })} /></Field>
          </div>
          <p style={S.hint}>
            Enter each debt's current balance, annual percentage rate (APR) and required minimum. The extra amount is paid on top of
            every minimum each month, and the lump sum is applied once, next month. The rates, balances and minimums shown start as an
            example, so replace them with the figures on your statements.
          </p>
        </div>

        <div style={S.results}>
          {!hasDebts && <div style={S.disclaimer}>Enter at least one debt with a balance above zero.</div>}
          {hasDebts && (
            <>
              <div style={S.bigStat}>
                <span style={S.bigLabel}>Debt-free with avalanche</span>
                <span style={S.bigValue}>{avalanche.months == null ? "Not paid off" : dateOf(avalanche)}</span>
                <span style={S.bigSub}>
                  {avalanche.months == null
                    ? "At these payments at least one debt never reaches zero."
                    : `${fmtMonths(avalanche.months)} from now, ${interestOf(avalanche)} total interest on ${fmtUSD(result.totalBalance, { cents: false })} owed`}
                </span>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={tbl} aria-label="Payoff strategy comparison">
                  <thead>
                    <tr>
                      <th style={th}>Plan</th>
                      <th style={th}>Debt-free</th>
                      <th style={th}>Total interest</th>
                      <th style={th}>Payoff order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[avalanche, snowball, minimums].map((r) => (
                      <tr key={r.id}>
                        <td style={td}>{STRATEGY_LABEL[r.id]}</td>
                        <td style={td}>
                          {dateOf(r)}
                          {r.months != null && <div style={sub}>{fmtMonths(r.months)}</div>}
                        </td>
                        <td style={td}>{interestOf(r)}</td>
                        <td style={td}>{r.id === "minimums" ? `${orderOf(r)} (each on its own minimum)` : orderOf(r)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {result.snowballExtraInterest != null && avalanche.months != null && snowball.months != null && (
                <div style={{ ...S.aprBox, ...S.aprOk }}>
                  <span style={S.aprLabel}>
                    {result.ratesTie
                      ? "Same interest either way"
                      : result.sameOrder
                        ? "Both methods pay the same order"
                        : "Avalanche vs snowball"}
                  </span>
                  <span style={S.aprValue}>{fmtUSD(Math.max(0, result.snowballExtraInterest), { cents: false })}</span>
                  <span style={S.aprNote}>
                    {result.ratesTie
                      ? "Every debt has the same APR, so the order does not change the interest."
                      : result.sameOrder
                        ? "The smallest balance also carries the highest APR, so snowball and avalanche are the same plan here."
                        : `More interest with snowball, and it finishes ${
                            Math.abs(result.avalancheMonthsSooner ?? 0) === 0
                              ? "in the same month"
                              : `${Math.abs(result.avalancheMonthsSooner ?? 0)} month${Math.abs(result.avalancheMonthsSooner ?? 0) === 1 ? "" : "s"} ${(result.avalancheMonthsSooner ?? 0) > 0 ? "later" : "sooner"}`
                          }. Snowball clears ${names[snowball.payoffOrder[0]] ?? "its first debt"} in month ${snowball.payoffMonth[snowball.payoffOrder[0]]}, avalanche clears ${names[avalanche.payoffOrder[0]] ?? "its first debt"} in month ${avalanche.payoffMonth[avalanche.payoffOrder[0]]}.`}
                  </span>
                </div>
              )}
              {minimums.totalInterest != null && avalanche.totalInterest != null && (
                <div style={S.statRow}>
                  <Stat label="Interest avoided vs minimums only" value={fmtUSD(minimums.totalInterest - avalanche.totalInterest, { cents: false })} />
                  <Stat label="Monthly budget" value={fmtUSD(result.totalMinimums + input.extraMonthly, { cents: false })} />
                </div>
              )}
              {result.warnings.length > 0 && (
                <div style={{ ...S.aprBox, ...S.aprWarn }}>
                  <span style={S.aprLabel}>Check these minimums</span>
                  {result.warnings.map((w) => (
                    <span key={w} style={S.aprNote}>{w}</span>
                  ))}
                  <span style={S.aprNote}>Under the minimums-only plan that debt does not shrink, so the extra payment is what clears it.</span>
                </div>
              )}

              <div>
                <label style={{ ...S.label, display: "block", marginBottom: 4 }} htmlFor="debt-payoff-month">
                  Step through the months: month {step}
                  {step > 0 ? ` (${payoffDateLabel(step, today)})` : " (today)"}
                </label>
                <input
                  id="debt-payoff-month"
                  type="range"
                  min={0}
                  max={horizon}
                  value={step}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
                {[avalanche, snowball].map((r) => (
                  <Bars key={r.id} r={r} step={step} names={names} total={result.totalBalance} />
                ))}
              </div>
            </>
          )}
          <div style={S.disclaimer}>
            Estimate only. Assumes fixed rates, interest added monthly at APR divided by 12, no new charges, fees or penalties, and that you
            pay the full monthly budget every month. When a debt is cleared, its minimum rolls onto the next debt in the plan. A real lender
            may round, compound daily or charge fees, and a promotional 0% rate or a prepayment penalty would change the order that costs least.
          </div>
        </div>
      </div>
    </div>
  );
}

function Bars({ r, step, names, total }: { r: StrategyResult; step: number; names: string[]; total: number }) {
  const row = r.debtBalanceByMonth[Math.min(step, r.debtBalanceByMonth.length - 1)] ?? [];
  const left = row.reduce((s, b) => s + b, 0);
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ fontSize: "0.78rem", color: "#555", display: "flex", justifyContent: "space-between" }}>
        <span>{STRATEGY_LABEL[r.id]}</span>
        <span>{fmtUSD(left, { cents: false })} left</span>
      </div>
      <div
        role="img"
        aria-label={`${STRATEGY_LABEL[r.id]}, month ${step}: ${fmtUSD(left, { cents: false })} left of ${fmtUSD(total, { cents: false })}. ${row
          .map((b, i) => `${names[i]} ${fmtUSD(b, { cents: false })}`)
          .join(", ")}`}
        style={{ display: "flex", height: 16, background: "#EEF3F1", borderRadius: 6, overflow: "hidden" }}
      >
        {row.map((b, i) => (
          <div key={i} style={{ width: `${total > 0 ? (b / total) * 100 : 0}%`, background: COLORS[i % COLORS.length] }} />
        ))}
      </div>
    </div>
  );
}

const tbl: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" };
const th: React.CSSProperties = { textAlign: "left", padding: "6px 8px", borderBottom: "1px solid #D8EEE6", color: "#2A6A58", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.03em" };
const td: React.CSSProperties = { padding: "7px 8px", borderBottom: "1px solid #E6F0EC", verticalAlign: "top", fontVariantNumeric: "tabular-nums" };
const sub: React.CSSProperties = { fontSize: "0.72rem", color: "#777" };
const miniBtn: React.CSSProperties = { fontSize: "0.75rem", border: "1px solid #D0DAD6", background: "#fff", borderRadius: 6, padding: "2px 8px", cursor: "pointer", color: "#555" };
const addBtn: React.CSSProperties = { fontSize: "0.85rem", border: "1px dashed #0E7C66", background: "#fff", color: "#0E7C66", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontWeight: 600 };
