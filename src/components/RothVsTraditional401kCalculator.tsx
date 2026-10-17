import { useMemo, useState } from "react";
import { computeRothVsTraditional401k, type RothVsTraditional401kInput } from "../lib/roth-vs-traditional-401k";
import { fmtUSD, fmtPct } from "../lib/format";
import { Field, MoneyInput, NumInput, PctInput, Stat, S } from "./calc-ui";

// Roth vs Traditional 401(k) island. Same take-home cost on both sides, same return, Traditional withdrawals taxed at
// the retirement rate. Every input is the reader's; the starting values are placeholders.

interface Props {
  initialData?: Partial<RothVsTraditional401kInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: RothVsTraditional401kInput = { traditionalAnnual: 10000, currentRatePct: 22, retirementRatePct: 22, returnPct: 7, years: 25 };

export default function RothVsTraditional401kCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<RothVsTraditional401kInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => computeRothVsTraditional401k(input), [input]);
  const set = (patch: Partial<RothVsTraditional401kInput>) => setInput((s) => ({ ...s, ...patch }));

  const valid = input.traditionalAnnual > 0 && input.years > 0 && input.returnPct >= 0;
  const headline = !valid ? "Enter a deferral, a number of years, and a return of 0% or more" :
    result.winner === "roth" ? "Roth finishes ahead by" : result.winner === "traditional" ? "Traditional finishes ahead by" : "The two finish even";
  const headlineValue = !valid ? "" : result.winner === "tie" ? fmtUSD(0, { cents: true }) : fmtUSD(Math.abs(result.rothAdvantage), { cents: true });

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
          <Field label="Traditional (pre-tax) 401(k) deferral per year">
            <MoneyInput value={input.traditionalAnnual} onChange={(v) => set({ traditionalAnnual: v })} />
          </Field>
          <div style={S.twoCol}>
            <Field label="Tax rate today">
              <PctInput value={input.currentRatePct} onChange={(v) => set({ currentRatePct: v })} />
            </Field>
            <Field label="Tax rate in retirement">
              <PctInput value={input.retirementRatePct} onChange={(v) => set({ retirementRatePct: v })} />
            </Field>
          </div>
          <div style={S.twoCol}>
            <Field label="Annual return">
              <PctInput value={input.returnPct} onChange={(v) => set({ returnPct: v })} />
            </Field>
            <Field label="Years until you withdraw">
              <NumInput value={input.years} onChange={(v) => set({ years: v })} />
            </Field>
          </div>
          <p style={S.hint}>
            Both sides give up the same take-home pay each year, so the Roth deferral is smaller by the tax the Traditional deferral avoids today. Use your marginal rates (federal plus state if you want both counted). The starting values are placeholders.
          </p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>{headline}</span>
            <span style={S.bigValue}>{headlineValue}</span>
            <span style={S.bigSub}>
              After {input.years} years at {fmtPct(input.returnPct)} a year, with a {fmtPct(input.currentRatePct)} rate today and {fmtPct(input.retirementRatePct)} in retirement
            </span>
          </div>
          <div style={S.statRow}>
            <Stat label="Roth balance (tax-free)" value={fmtUSD(result.rothBalance, { cents: true })} />
            <Stat label="Traditional after tax" value={fmtUSD(result.traditionalBalanceAfterTax, { cents: true })} />
          </div>
          <div style={S.statRow}>
            <Stat label="Traditional before tax" value={fmtUSD(result.traditionalBalancePreTax, { cents: true })} />
            <Stat label="Tax on Traditional withdrawal" value={fmtUSD(result.traditionalTaxAtWithdrawal, { cents: true })} />
          </div>
          <div style={S.statRow}>
            <Stat label="Roth deferral per year" value={fmtUSD(result.rothAnnual, { cents: true })} />
            <Stat label="Traditional deferral per year" value={fmtUSD(input.traditionalAnnual, { cents: true })} />
          </div>
          <div style={S.aprBox}>
            <span style={S.aprLabel}>Break-even retirement tax rate</span>
            <span style={S.aprValue}>{fmtPct(result.breakEvenRatePct)}</span>
            <span style={S.aprNote}>
              If your retirement rate comes in below this, Traditional finishes ahead. Above it, Roth does.
            </span>
          </div>
          <div style={S.disclaimer}>
            Estimate only. Uses flat tax rates and month-end contributions, and leaves out employer match, fees, state rules and the 401(k) deferral limit. Your plan documents and a tax professional have the final word.
          </div>
        </div>
      </div>
    </div>
  );
}
