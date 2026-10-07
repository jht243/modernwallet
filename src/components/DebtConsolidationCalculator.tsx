import { useMemo, useState } from "react";
import { computeDebtConsolidation, type DebtConsolidationInput, type DebtLine } from "../lib/debt-consolidation";
import { fmtUSD, fmtPct, fmtMonths } from "../lib/format";
import { Field, MoneyInput, NumInput, PctInput, Stat, S } from "./calc-ui";

// Debt consolidation island. Compares paying up to four debts at today's payments against one new
// fixed-rate loan, counting the origination fee. Every balance, rate, payment, term and fee is an
// input the borrower sets; nothing is assumed from a market survey.

interface Props {
  initialData?: Partial<DebtConsolidationInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: DebtConsolidationInput = {
  debts: [
    { balance: 8000, aprPct: 24, payment: 250 },
    { balance: 5000, aprPct: 19, payment: 150 },
    { balance: 3000, aprPct: 29, payment: 100 },
    { balance: 0, aprPct: 0, payment: 0 },
  ],
  newAprPct: 12,
  newTermMonths: 48,
  feePct: 3,
};

export default function DebtConsolidationCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<DebtConsolidationInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => computeDebtConsolidation(input), [input]);
  const set = (patch: Partial<DebtConsolidationInput>) => setInput((s) => ({ ...s, ...patch }));
  const setDebt = (i: number, patch: Partial<DebtLine>) =>
    set({ debts: input.debts.map((d, j) => (j === i ? { ...d, ...patch } : d)) });
  const saves = (result.netSavings ?? 0) >= 0;

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
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={S.label}>Debt {i + 1}</span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <Field label="Balance"><MoneyInput value={d.balance} onChange={(v) => setDebt(i, { balance: v })} /></Field>
                <Field label="APR"><PctInput value={d.aprPct} onChange={(v) => setDebt(i, { aprPct: v })} /></Field>
                <Field label="Monthly payment"><MoneyInput value={d.payment} onChange={(v) => setDebt(i, { payment: v })} /></Field>
              </div>
            </div>
          ))}
          <div style={S.twoCol}>
            <Field label="New loan APR"><PctInput value={input.newAprPct} onChange={(v) => set({ newAprPct: v })} /></Field>
            <Field label="New loan term (months)"><NumInput value={input.newTermMonths} onChange={(v) => set({ newTermMonths: v })} /></Field>
          </div>
          <Field label="Origination fee (% of the new loan)"><PctInput value={input.feePct} onChange={(v) => set({ feePct: v })} /></Field>
          <p style={S.hint}>
            Enter the payment you make today on each debt. The new rate, term and fee are placeholders: use the figures from a lender's offer. The fee is taken out of the loan proceeds, so the new loan is sized to cover your balances plus the fee.
          </p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>New monthly payment</span>
            <span style={S.bigValue}>{fmtUSD(result.newMonthlyPayment, { cents: true })}</span>
            <span style={S.bigSub}>
              {fmtUSD(result.newLoanAmount)} loan at {fmtPct(input.newAprPct)} for {input.newTermMonths} months, versus {fmtUSD(result.currentMonthlyPayment, { cents: true })} a month today
            </span>
          </div>
          <div style={S.statRow}>
            <Stat label="Interest on the new loan" value={fmtUSD(result.newTotalInterest)} />
            <Stat label="Origination fee" value={fmtUSD(result.feeAmount)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Interest if you keep your debts" value={result.currentTotalInterest == null ? "Never paid off" : fmtUSD(result.currentTotalInterest)} />
            <Stat label="Payoff time today" value={result.currentMonths == null ? "Never" : fmtMonths(result.currentMonths)} />
          </div>
          {result.netSavings != null && (
            <div style={{ ...S.aprBox, ...(saves ? S.aprOk : S.aprWarn) }}>
              <span style={S.aprLabel}>{saves ? "Consolidating costs less" : "Consolidating costs more"}</span>
              <span style={S.aprValue}>{fmtUSD(Math.abs(result.netSavings))}</span>
              <span style={S.aprNote}>
                Interest and fee on the new loan against the interest you would pay keeping each debt on today's payment. Payment change: {result.paymentChange <= 0 ? "-" : "+"}{fmtUSD(Math.abs(result.paymentChange), { cents: true })} a month.
              </span>
            </div>
          )}
          {result.currentNeverPaysOff && (
            <div style={{ ...S.aprBox, ...S.aprWarn }}>
              <span style={S.aprLabel}>A payment does not cover its interest</span>
              <span style={S.aprNote}>At least one payment is no larger than that debt's monthly interest, so it would never reach zero at today's payment.</span>
            </div>
          )}
          <div style={S.disclaimer}>
            Estimate only. Assumes fixed rates and no new borrowing on any card or loan, and that you keep paying today's amounts on the old debts. A longer new term lowers the payment but can raise total interest. Lenders set their own rates, fees and eligibility, so compare real offers.
          </div>
        </div>
      </div>
    </div>
  );
}
