import { useMemo, useState } from "react";
import { computePayoffVsInvest, type PayoffInvestInput } from "../lib/payoff-vs-invest";
import { fmtUSD, fmtMonths } from "../lib/format";
import { Field, MoneyInput, NumInput, PctInput, Stat, S } from "./calc-ui";

// Pay off mortgage or invest island (tool-usage pass 2026-11-04). Same cash on both paths until the loan's scheduled
// payoff; compares after-tax invested balances and finds the break-even return. Logic: src/lib/payoff-vs-invest.ts.

interface Props {
  initialData?: Partial<PayoffInvestInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: PayoffInvestInput = { balance: 300000, ratePct: 6.5, monthsLeft: 360, extraPerMonth: 300, returnPct: 7, taxOnGainsPct: 15 };

export default function PayoffVsInvestCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<PayoffInvestInput>({ ...DEFAULTS, ...initialData });
  const r = useMemo(() => computePayoffVsInvest(v), [v]);
  const set = (p: Partial<PayoffInvestInput>) => setV((s) => ({ ...s, ...p }));
  const investAhead = r != null && r.investMinusPrepay > 0;

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
          <Field label="Current loan balance"><MoneyInput value={v.balance} onChange={(x) => set({ balance: x })} /></Field>
          <div style={S.twoCol}>
            <Field label="Mortgage rate"><PctInput value={v.ratePct} onChange={(x) => set({ ratePct: x })} /></Field>
            <Field label="Months left"><NumInput value={v.monthsLeft} onChange={(x) => set({ monthsLeft: Math.min(480, x) })} /></Field>
          </div>
          <Field label="Extra cash each month"><MoneyInput value={v.extraPerMonth} onChange={(x) => set({ extraPerMonth: x })} /></Field>
          <div style={S.twoCol}>
            <Field label="Your expected annual return"><PctInput value={v.returnPct} onChange={(x) => set({ returnPct: x })} /></Field>
            <Field label="Tax rate on investment gains"><PctInput value={v.taxOnGainsPct} onChange={(x) => set({ taxOnGainsPct: x })} /></Field>
          </div>
          <p style={S.hint}>
            The 7% return and 15% tax rate are placeholders, not a forecast. Enter the return you expect after fees, and 0% tax if the money goes into a Roth IRA or other account with no tax on gains.
          </p>
        </div>

        <div style={S.results}>
          {r == null ? (
            <div style={S.bigStat}><span style={S.bigLabel}>Enter a balance and months left</span></div>
          ) : (
            <>
              <div style={S.bigStat}>
                <span style={S.bigLabel}>{v.extraPerMonth > 0 ? (investAhead ? "Investing ends ahead by" : "Paying off early ends ahead by") : "Enter an extra amount to compare"}</span>
                <span style={S.bigValue}>{fmtUSD(Math.abs(r.investMinusPrepay))}</span>
                <span style={S.bigSub}>after tax, at the loan's scheduled payoff in {fmtMonths(Math.round(v.monthsLeft))}</span>
              </div>
              {r.breakEvenReturnPct != null && (
                <div style={{ ...S.aprBox, ...(investAhead ? S.aprOk : S.aprWarn) }}>
                  <span style={S.aprLabel}>Break-even return</span>
                  <span style={S.aprValue}>{r.breakEvenReturnPct.toFixed(2)}%</span>
                  <span style={S.aprNote}>
                    Investing beats paying off early only if your steady annual return beats this rate, after the tax rate you entered.
                  </span>
                </div>
              )}
              <div style={S.statRow}>
                <Stat label="Pay off early: invested after tax" value={fmtUSD(r.prepayWealth)} />
                <Stat label="Invest the extra: invested after tax" value={fmtUSD(r.investWealth)} />
              </div>
              <div style={S.statRow}>
                <Stat label="Interest saved by paying off early" value={fmtUSD(r.interestSaved)} />
                <Stat label="Loan gone sooner by" value={fmtMonths(r.monthsSooner)} />
              </div>
              <div style={S.disclaimer}>
                Estimate only. Both paths spend the same cash each month until the scheduled payoff: paying off early sends the extra to principal, then invests the full payment once the loan is gone. Returns are treated as steady, with no market losses. The mortgage-interest deduction is left out because it only applies if you itemize (<a href="https://www.irs.gov/publications/p936" target="_blank" rel="noopener noreferrer">IRS Publication 936</a>). Principal and interest only.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
