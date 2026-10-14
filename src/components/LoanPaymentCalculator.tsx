import { useMemo, useState } from "react";
import { computeLoanPayment, type LoanPaymentInput } from "../lib/loan-payment";
import { fmtUSD, fmtPct, fmtMonths } from "../lib/format";
import { Field, MoneyInput, NumInput, PctInput, Stat, S } from "./calc-ui";

// Loan payment island. Level monthly payment on a fixed-rate amortizing loan, the interest it costs, and what an
// extra monthly payment saves. Amount, APR and term are the reader's inputs.

interface Props {
  initialData?: Partial<LoanPaymentInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: LoanPaymentInput = { amount: 25000, aprPct: 8, years: 5, extraMonthly: 0 };

export default function LoanPaymentCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<LoanPaymentInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => computeLoanPayment(input), [input]);
  const set = (patch: Partial<LoanPaymentInput>) => setInput((s) => ({ ...s, ...patch }));
  const extra = input.extraMonthly > 0 && result.monthsSaved > 0;

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
          <Field label="Loan amount">
            <MoneyInput value={input.amount} onChange={(v) => set({ amount: v })} />
          </Field>
          <Field label="Interest rate (APR)">
            <PctInput value={input.aprPct} onChange={(v) => set({ aprPct: v })} />
          </Field>
          <Field label="Loan term (years)">
            <NumInput value={input.years} onChange={(v) => set({ years: v })} />
          </Field>
          <Field label="Extra payment each month (optional)">
            <MoneyInput value={input.extraMonthly} onChange={(v) => set({ extraMonthly: v })} />
          </Field>
          <p style={S.hint}>
            Use the rate and term from your lender's offer. The amount, rate and term above are placeholders. Taxes, insurance and lender fees are not included, so a mortgage or car payment will run higher.
          </p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Monthly payment</span>
            <span style={S.bigValue}>{fmtUSD(result.payment, { cents: true })}</span>
            <span style={S.bigSub}>
              {fmtUSD(input.amount)} at {fmtPct(input.aprPct)} APR over {result.months} months
            </span>
          </div>
          <div style={S.statRow}>
            <Stat label="Total interest" value={fmtUSD(result.totalInterest, { cents: true })} />
            <Stat label="Total paid" value={fmtUSD(result.totalPaid, { cents: true })} />
          </div>
          <div style={S.statRow}>
            <Stat label="First payment: interest" value={fmtUSD(result.firstMonthInterest, { cents: true })} />
            <Stat label="First payment: principal" value={fmtUSD(result.firstMonthPrincipal, { cents: true })} />
          </div>
          {extra && (
            <div style={S.aprBox}>
              <span style={S.aprLabel}>With {fmtUSD(input.extraMonthly)} extra each month</span>
              <span style={S.aprValue}>{fmtUSD(result.interestSaved, { cents: true })} interest saved</span>
              <span style={S.aprNote}>
                Paid off in {fmtMonths(result.extraMonths)} instead of {fmtMonths(result.months)}, {fmtMonths(result.monthsSaved)} sooner, with total interest of {fmtUSD(result.extraTotalInterest, { cents: true })}.
              </span>
            </div>
          )}
          <div style={S.disclaimer}>
            Estimate only. Assumes a fixed rate, equal monthly payments from the first month, and no fees or prepayment penalties. Your lender's disclosure is the final word on the payment.
          </div>
        </div>
      </div>
    </div>
  );
}
