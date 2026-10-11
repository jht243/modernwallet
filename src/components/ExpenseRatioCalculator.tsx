import { useMemo, useState } from "react";
import { computeExpenseRatio, type ExpenseRatioInput } from "../lib/expense-ratio";
import { fmtUSD, fmtPct } from "../lib/format";
import { Field, MoneyInput, NumInput, PctInput, Stat, S } from "./calc-ui";

// Expense ratio island. Compares the ending balance of two funds that differ only by expense ratio, plus a
// no-fee benchmark. The gross return and both ratios are the reader's inputs.

interface Props {
  initialData?: Partial<ExpenseRatioInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: ExpenseRatioInput = {
  startBalance: 10000,
  monthlyContribution: 500,
  years: 30,
  grossReturnPct: 7,
  ratioAPct: 0.05,
  ratioBPct: 1,
};

export default function ExpenseRatioCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<ExpenseRatioInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => computeExpenseRatio(input), [input]);
  const set = (patch: Partial<ExpenseRatioInput>) => setInput((s) => ({ ...s, ...patch }));

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
          <div style={S.twoCol}>
            <Field label="Starting balance"><MoneyInput value={input.startBalance} onChange={(v) => set({ startBalance: v })} /></Field>
            <Field label="Monthly contribution"><MoneyInput value={input.monthlyContribution} onChange={(v) => set({ monthlyContribution: v })} /></Field>
            <Field label="Years invested"><NumInput value={input.years} onChange={(v) => set({ years: v })} /></Field>
            <Field label="Assumed return before fees"><PctInput value={input.grossReturnPct} onChange={(v) => set({ grossReturnPct: v })} /></Field>
            <Field label="Fund A expense ratio"><PctInput value={input.ratioAPct} onChange={(v) => set({ ratioAPct: v })} /></Field>
            <Field label="Fund B expense ratio"><PctInput value={input.ratioBPct} onChange={(v) => set({ ratioBPct: v })} /></Field>
          </div>
          <p style={S.hint}>
            The return and both ratios above are placeholders. Find a fund's real expense ratio in its prospectus or fact sheet, and enter your own return assumption.
          </p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Fund A ends higher than Fund B by</span>
            <span style={S.bigValue}>{fmtUSD(result.differenceAB)}</span>
            <span style={S.bigSub}>{fmtPct(input.ratioAPct, 2)} vs {fmtPct(input.ratioBPct, 2)} a year over {input.years} years</span>
          </div>
          <div style={S.statRow}>
            <Stat label="Fund A ending balance" value={fmtUSD(result.balanceA)} />
            <Stat label="Fund B ending balance" value={fmtUSD(result.balanceB)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Growth lost to Fund A's ratio" value={fmtUSD(result.costA)} />
            <Stat label="Growth lost to Fund B's ratio" value={fmtUSD(result.costB)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Ending balance with no fund cost" value={fmtUSD(result.noFeeBalance)} />
            <Stat label="Total you put in" value={fmtUSD(result.totalContributed)} />
          </div>
          <div style={S.disclaimer}>
            Estimate only. Subtracts each ratio from one steady assumed return, compounds monthly and adds each contribution at month end. Real returns vary, and funds also differ in trading costs, taxes and holdings. Arithmetic, not a prediction or advice.
          </div>
        </div>
      </div>
    </div>
  );
}
