import { useMemo, useState } from "react";
import { computeBiweekly, type BiweeklyInput } from "../lib/biweekly-mortgage";
import { fmtUSD, fmtNum } from "../lib/format";
import { Field, MoneyInput, NumInput, PctInput, Stat, S } from "./calc-ui";

// Biweekly mortgage island (tool-usage pass 2026-10-28). Balance, rate, years left and any plan fees → payoff
// time and interest for monthly vs biweekly (26 half-payments a year) vs monthly + 1/12 extra, and the fee drag.

interface Props {
  initialData?: Partial<BiweeklyInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: BiweeklyInput = { balance: 300000, ratePct: 6.5, yearsLeft: 30, setupFee: 0, perPaymentFee: 0 };

function yrs(y: number): string {
  const whole = Math.floor(y + 1e-9);
  const months = Math.round((y - whole) * 12);
  if (months === 12) return `${whole + 1} yr`;
  return months ? `${whole} yr ${months} mo` : `${whole} yr`;
}

export default function BiweeklyMortgageCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<BiweeklyInput>({ ...DEFAULTS, ...initialData });
  const r = useMemo(() => computeBiweekly(v), [v]);
  const set = (p: Partial<BiweeklyInput>) => setV((s) => ({ ...s, ...p }));

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
          <Field label="Loan balance"><MoneyInput value={v.balance} onChange={(x) => set({ balance: x })} /></Field>
          <div style={S.twoCol}>
            <Field label="Interest rate"><PctInput value={v.ratePct} onChange={(x) => set({ ratePct: x })} /></Field>
            <Field label="Years left"><NumInput value={v.yearsLeft} onChange={(x) => set({ yearsLeft: x })} /></Field>
          </div>
          <div style={S.twoCol}>
            <Field label="Plan setup fee (if any)"><MoneyInput value={v.setupFee} onChange={(x) => set({ setupFee: x })} /></Field>
            <Field label="Fee per biweekly payment"><MoneyInput value={v.perPaymentFee} onChange={(x) => set({ perPaymentFee: x })} /></Field>
          </div>
          <p style={S.hint}>
            The figures above are an example. Assumes your servicer applies each half-payment when it arrives; if it holds half-payments until a full payment builds up, you save less. Leave the fees at $0 if you set up biweekly payments yourself.
          </p>
        </div>

        <div style={S.results}>
          {r == null ? (
            <div style={S.bigStat}><span style={S.bigSub}>Enter a balance, a rate and the years left.</span></div>
          ) : (
            <>
              <div style={S.bigStat}>
                <span style={S.bigLabel}>Biweekly payments save</span>
                <span style={S.bigValue}>{fmtUSD(r.biweeklyInterestSaved)}</span>
                <span style={S.bigSub}>
                  of interest and finish {yrs(r.biweeklyYearsSooner)} sooner, paying {fmtUSD(r.halfPayment)} every two weeks instead of {fmtUSD(r.monthlyPayment)} a month.
                </span>
              </div>
              <div style={S.statRow}>
                <Stat label="Monthly: payoff time" value={yrs(r.monthly.years)} />
                <Stat label="Monthly: total interest" value={fmtUSD(r.monthly.interest)} />
              </div>
              <div style={S.statRow}>
                <Stat label="Biweekly: payoff time" value={yrs(r.biweekly.years)} />
                <Stat label="Biweekly: total interest" value={fmtUSD(r.biweekly.interest)} />
              </div>
              <div style={S.statRow}>
                <Stat label={`Monthly + ${fmtUSD(r.monthlyPayment / 12)} extra: payoff`} value={yrs(r.extraTwelfth.years)} />
                <Stat label="Monthly + 1/12 extra: interest saved" value={fmtUSD(r.extraTwelfthInterestSaved)} />
              </div>
              {r.fees > 0 && (
                <div style={{ ...S.aprBox, ...(r.biweeklyNetSaving > r.extraTwelfthInterestSaved ? S.aprOk : S.aprWarn) }}>
                  <span style={S.aprLabel}>After {fmtUSD(r.fees)} in plan fees</span>
                  <span style={S.aprValue}>{fmtUSD(r.biweeklyNetSaving)}</span>
                  <span style={S.aprNote}>
                    net saving from the biweekly plan, vs {fmtUSD(r.extraTwelfthInterestSaved)} from adding 1/12 of a payment each month yourself ({fmtNum(r.biweekly.payments, 0)} biweekly payments).
                  </span>
                </div>
              )}
              <div style={S.disclaimer}>
                Estimate only. Fixed-rate loan, principal and interest only (taxes, insurance and PMI left out). Biweekly interest is figured at the annual rate ÷ 26 per two-week period. Check your loan for a prepayment penalty and ask your servicer how it applies extra payments. Not financial advice.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
