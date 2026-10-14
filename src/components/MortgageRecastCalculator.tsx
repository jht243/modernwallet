import { useMemo, useState } from "react";
import { computeRecast, type RecastInput } from "../lib/mortgage-recast";
import { fmtUSD, fmtMonths } from "../lib/format";
import { Field, MoneyInput, NumInput, PctInput, Stat, S } from "./calc-ui";

// Mortgage recast island (tool-usage pass 2026-10-14). New payment after a lump-sum recast, and the same lump
// sum prepaid without a recast for comparison. Balance, rate, months left and the lender's fee are inputs.

interface Props {
  initialData?: Partial<RecastInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: RecastInput = { balance: 238000, ratePct: 6.875, monthsLeft: 312, lumpSum: 30000, fee: 250 };

export default function MortgageRecastCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<RecastInput>({ ...DEFAULTS, ...initialData });
  const r = useMemo(() => computeRecast(v), [v]);
  const set = (p: Partial<RecastInput>) => setV((s) => ({ ...s, ...p }));

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
          <Field label="Lump sum toward principal"><MoneyInput value={v.lumpSum} onChange={(x) => set({ lumpSum: x })} /></Field>
          <Field label="Lender's recast fee"><MoneyInput value={v.fee} onChange={(x) => set({ fee: x })} /></Field>
          <p style={S.hint}>
            Copy the balance, rate and months left from your mortgage statement. The figures above are placeholders. Ask your servicer for its recast fee and minimum lump sum; both vary by lender.
          </p>
        </div>

        <div style={S.results}>
          {r == null ? (
            <div style={S.bigStat}><span style={S.bigLabel}>Enter a balance and months left</span></div>
          ) : (
            <>
              <div style={S.bigStat}>
                <span style={S.bigLabel}>New payment after the recast</span>
                <span style={S.bigValue}>{fmtUSD(r.recastPayment, { cents: true })}</span>
                <span style={S.bigSub}>down {fmtUSD(r.monthlySavings, { cents: true })} a month from {fmtUSD(r.currentPayment, { cents: true })} (principal and interest)</span>
              </div>
              <div style={S.statRow}>
                <Stat label="New balance" value={fmtUSD(r.newBalance)} />
                <Stat label="Interest saved (recast)" value={fmtUSD(r.recastInterestSaved)} />
              </div>
              {r.feePaybackMonths != null && (
                <div style={S.statRow}>
                  <Stat label="Fee earned back in" value={fmtMonths(r.feePaybackMonths)} />
                  <Stat label="Interest saved, after the fee" value={fmtUSD(r.recastInterestSaved - v.fee)} />
                </div>
              )}
              <div style={{ ...S.aprBox, ...S.aprOk }}>
                <span style={S.aprLabel}>Same lump sum, no recast</span>
                <span style={S.aprValue}>{fmtUSD(r.prepay.interestSaved)} interest saved</span>
                <span style={S.aprNote}>
                  Keep paying {fmtUSD(r.currentPayment, { cents: true })} and the loan ends in {fmtMonths(r.prepay.months)}, {fmtMonths(r.prepay.monthsSooner)} sooner, with no fee. A recast lowers the payment instead and saves less interest.
                </span>
              </div>
              <div style={S.disclaimer}>
                Estimate only. Assumes a fixed-rate loan, the same rate and months left after the recast, and principal and interest only (taxes and insurance not included). Not every loan can be recast: your servicer decides, and many do not recast government-backed loans such as FHA and VA loans.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
