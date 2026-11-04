import { useMemo, useState } from "react";
import { computeBiweekly, type BiweeklyInput } from "../lib/biweekly-mortgage";
import { fmtUSD, fmtMonths } from "../lib/format";
import { Field, MoneyInput, NumInput, PctInput, Stat, S } from "./calc-ui";

// Biweekly mortgage island (tool-usage pass 2026-11-04). Compares monthly payments, 26 half-payments a year and
// the monthly payment plus 1/12 extra, with optional biweekly plan fees. Logic lives in src/lib/biweekly-mortgage.ts.

interface Props {
  initialData?: Partial<BiweeklyInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: BiweeklyInput = { balance: 300000, ratePct: 6.5, monthsLeft: 360, setupFee: 0, perDebitFee: 0 };

export default function BiweeklyMortgageCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<BiweeklyInput>({ ...DEFAULTS, ...initialData });
  const r = useMemo(() => computeBiweekly(v), [v]);
  const set = (p: Partial<BiweeklyInput>) => setV((s) => ({ ...s, ...p }));
  const hasFees = v.setupFee > 0 || v.perDebitFee > 0;

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
            <Field label="Interest rate"><PctInput value={v.ratePct} onChange={(x) => set({ ratePct: x })} /></Field>
            <Field label="Months left"><NumInput value={v.monthsLeft} onChange={(x) => set({ monthsLeft: Math.min(480, x) })} /></Field>
          </div>
          <div style={S.twoCol}>
            <Field label="Biweekly plan setup fee"><MoneyInput value={v.setupFee} onChange={(x) => set({ setupFee: x })} /></Field>
            <Field label="Fee per biweekly debit"><MoneyInput value={v.perDebitFee} onChange={(x) => set({ perDebitFee: x })} /></Field>
          </div>
          <p style={S.hint}>
            Copy the balance, rate and months left from your mortgage statement. The figures above are placeholders. Leave the fees at $0 if you set up biweekly payments yourself. Enter them if a servicer or company charges for a biweekly plan.
          </p>
        </div>

        <div style={S.results}>
          {r == null ? (
            <div style={S.bigStat}><span style={S.bigLabel}>Enter a balance and months left</span></div>
          ) : (
            <>
              <div style={S.bigStat}>
                <span style={S.bigLabel}>Biweekly payments end the loan</span>
                <span style={S.bigValue}>{fmtMonths(Math.round(r.biweekly.monthsSooner))} sooner</span>
                <span style={S.bigSub}>
                  {fmtUSD(r.halfPayment, { cents: true })} every two weeks instead of {fmtUSD(r.monthlyPayment, { cents: true })} a month (principal and interest)
                </span>
              </div>
              <div style={S.statRow}>
                <Stat label="Interest saved (biweekly)" value={fmtUSD(r.biweekly.interestSaved)} />
                <Stat label="Paid off in" value={fmtMonths(Math.round(r.biweekly.monthsEquivalent))} />
              </div>
              {hasFees && (
                <div style={S.statRow}>
                  <Stat label="Plan fees over the loan" value={fmtUSD(r.biweekly.fees)} />
                  <Stat label="Interest saved, after fees" value={fmtUSD(r.biweekly.netSaved)} />
                </div>
              )}
              <div style={{ ...S.aprBox, ...S.aprOk }}>
                <span style={S.aprLabel}>Same 13th payment, no plan</span>
                <span style={S.aprValue}>{fmtUSD(r.extraTwelfth.interestSaved)} interest saved</span>
                <span style={S.aprNote}>
                  Add {fmtUSD(r.extraTwelfth.extraPerMonth, { cents: true })} (1/12 of a payment) to each monthly payment and the loan ends in {fmtMonths(r.extraTwelfth.months)}, {fmtMonths(r.extraTwelfth.monthsSooner)} sooner, with no fees and no half-payments to time.
                </span>
              </div>
              <div style={S.statRow}>
                <Stat label="Monthly schedule" value={fmtMonths(r.monthly.months)} />
                <Stat label="Interest, monthly schedule" value={fmtUSD(r.monthly.interest)} />
              </div>
              <div style={S.disclaimer}>
                Estimate only. Assumes a fixed-rate loan and principal and interest only (taxes and insurance not included). Biweekly results assume each half-payment is applied the day it is paid. Under <a href="https://www.consumerfinance.gov/rules-policy/regulations/1026/36/" target="_blank" rel="noopener noreferrer">Regulation Z, 12 CFR 1026.36(c)</a>, a servicer may hold a payment smaller than a full monthly payment until a full payment builds up, which would make the biweekly savings somewhat smaller.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
