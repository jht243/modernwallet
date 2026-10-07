import { useMemo, useState } from "react";
import { computeCd, type CdInput } from "../lib/cd";
import { fmtUSD, fmtPct } from "../lib/format";
import { Field, MoneyInput, NumInput, PctInput, Stat, S } from "./calc-ui";

// CD calculator island. Shows what a certificate of deposit grows to at its APY, the interest after tax,
// and what pulling the money out early costs when the bank charges a penalty of some months of interest.
// Every rate, term, tax rate and penalty length is an input; nothing is assumed from a market survey.

interface Props {
  initialData?: Partial<CdInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: CdInput = {
  deposit: 10000,
  apyPct: 4.5,
  termMonths: 12,
  taxRatePct: 22,
  penaltyMonths: 3,
  withdrawMonth: 6,
};

export default function CdCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<CdInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => computeCd(input), [input]);
  const set = (patch: Partial<CdInput>) => setInput((s) => ({ ...s, ...patch }));
  const early = result.penaltyAmount != null;

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
          <Field label="Deposit">
            <MoneyInput value={input.deposit} onChange={(v) => set({ deposit: v })} />
          </Field>
          <Field label="CD rate (APY)">
            <PctInput value={input.apyPct} onChange={(v) => set({ apyPct: v })} />
          </Field>
          <Field label="Term (months)">
            <NumInput value={input.termMonths} onChange={(v) => set({ termMonths: v })} />
          </Field>
          <Field label="Your tax rate on interest">
            <PctInput value={input.taxRatePct} onChange={(v) => set({ taxRatePct: v })} />
          </Field>
          <div style={S.twoCol}>
            <Field label="Early-withdrawal penalty (months of interest)">
              <NumInput value={input.penaltyMonths} onChange={(v) => set({ penaltyMonths: v })} />
            </Field>
            <Field label="Withdraw at month (0 = hold to term)">
              <NumInput value={input.withdrawMonth} onChange={(v) => set({ withdrawMonth: v })} />
            </Field>
          </div>
          <p style={S.hint}>
            Banks quote CDs by APY, which already includes compounding. Every bank sets its own penalty, so enter the figure from your CD's disclosure. The rate, tax rate and penalty above are placeholders, not quotes.
          </p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Balance at maturity</span>
            <span style={S.bigValue}>{fmtUSD(result.endingBalance, { cents: true })}</span>
            <span style={S.bigSub}>
              {fmtUSD(input.deposit)} at {fmtPct(input.apyPct)} APY for {input.termMonths} months
            </span>
          </div>
          <div style={S.statRow}>
            <Stat label="Interest earned" value={fmtUSD(result.interestEarned, { cents: true })} />
            <Stat label="Interest after tax" value={fmtUSD(result.interestAfterTax, { cents: true })} />
          </div>
          <div style={S.statRow}>
            <Stat label="Total return" value={fmtPct(result.totalReturnPct)} />
            <Stat label="Average interest per month" value={fmtUSD(result.avgMonthlyInterest, { cents: true })} />
          </div>
          {early && (
            <div style={{ ...S.aprBox, ...S.aprWarn }}>
              <span style={S.aprLabel}>If you withdraw at month {input.withdrawMonth}</span>
              <span style={S.aprValue}>{fmtUSD(result.earlyNetBalance, { cents: true })}</span>
              <span style={S.aprNote}>
                Interest earned {fmtUSD(result.earlyInterest, { cents: true })} minus a {fmtUSD(result.penaltyAmount, { cents: true })} penalty ({input.penaltyMonths} months of interest). Net {(result.earlyNetGain ?? 0) >= 0 ? "gain" : "loss"} against your deposit: {fmtUSD(Math.abs(result.earlyNetGain ?? 0), { cents: true })}.
              </span>
            </div>
          )}
          <div style={S.disclaimer}>
            Estimate only. Assumes the APY is fixed for the whole term, no additional deposits, and that the penalty is a set number of months of interest on the deposit at the APY. Some banks calculate the penalty differently, and the tax figure applies one flat rate. Check your CD's disclosure and a tax professional for your own situation.
          </div>
        </div>
      </div>
    </div>
  );
}
