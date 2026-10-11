import { useMemo, useState } from "react";
import { computeInflation, type InflationInput } from "../lib/inflation";
import { fmtUSD, fmtNum, fmtPct } from "../lib/format";
import { Field, MoneyInput, NumInput, PctInput, Stat, S } from "./calc-ui";

// Inflation island. Takes an amount, a number of years and an assumed inflation rate, and shows what the
// same purchase costs later and what the amount buys later. The rate is the reader's input, not a forecast.

interface Props {
  initialData?: Partial<InflationInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: InflationInput = { amount: 10000, years: 10, inflationPct: 3, nominalReturnPct: 0 };

export default function InflationCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<InflationInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => computeInflation(input), [input]);
  const set = (patch: Partial<InflationInput>) => setInput((s) => ({ ...s, ...patch }));

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
          <Field label="Amount in today's dollars"><MoneyInput value={input.amount} onChange={(v) => set({ amount: v })} /></Field>
          <div style={S.twoCol}>
            <Field label="Years"><NumInput value={input.years} onChange={(v) => set({ years: v })} /></Field>
            <Field label="Average annual inflation"><PctInput value={input.inflationPct} onChange={(v) => set({ inflationPct: v })} /></Field>
          </div>
          <Field label="Annual return on the money (optional)"><PctInput value={input.nominalReturnPct} onChange={(v) => set({ nominalReturnPct: v })} /></Field>
          <p style={S.hint}>
            The 3% inflation rate above is a placeholder, not a forecast. Enter the rate you want to test. Leave the return at 0 to see money held as cash.
          </p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Cost later of what {fmtUSD(input.amount)} buys today</span>
            <span style={S.bigValue}>{fmtUSD(result.futureCost)}</span>
            <span style={S.bigSub}>after {fmtNum(input.years, 1)} years at {fmtPct(input.inflationPct, 1)} a year</span>
          </div>
          <div style={S.statRow}>
            <Stat label={`What ${fmtUSD(input.amount)} buys then, in today's dollars`} value={fmtUSD(result.purchasingPower)} />
            <Stat label="Buying power lost" value={fmtPct(result.powerLostPct, 1)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Years for buying power to halve" value={result.yearsToHalve == null ? "—" : fmtNum(result.yearsToHalve, 1)} />
            <Stat label="Real return after inflation" value={fmtPct(result.realReturnPct, 2)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Ending balance at the return" value={fmtUSD(result.nominalEnding)} />
            <Stat label="That balance in today's dollars" value={fmtUSD(result.realEnding)} />
          </div>
          <div style={S.disclaimer}>
            Estimate only. Assumes one steady inflation rate every year, while real inflation changes from year to year and differs by what you buy. For measured price changes, see the Bureau of Labor Statistics CPI data. Arithmetic, not a forecast or advice.
          </div>
        </div>
      </div>
    </div>
  );
}
