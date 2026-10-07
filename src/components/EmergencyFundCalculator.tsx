import { useMemo, useState } from "react";
import { computeEmergencyFund, type EmergencyFundInput } from "../lib/emergency-fund";
import { fmtUSD, fmtNum, fmtMonths } from "../lib/format";
import { Field, MoneyInput, NumInput, PctInput, Stat, S } from "./calc-ui";

// Emergency fund island. Adds up the essential monthly spending a fund has to cover, multiplies by the
// number of months the reader chooses, and shows the gap and how long saving takes. The number of months
// is an input; nothing here says how many a household should hold.

interface Props {
  initialData?: Partial<EmergencyFundInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: EmergencyFundInput = {
  housing: 1500,
  food: 500,
  utilities: 250,
  insurance: 200,
  debtMinimums: 250,
  transport: 200,
  other: 100,
  targetMonths: 6,
  currentSavings: 3000,
  monthlyDeposit: 400,
  apyPct: 0,
};

export default function EmergencyFundCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<EmergencyFundInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => computeEmergencyFund(input), [input]);
  const set = (patch: Partial<EmergencyFundInput>) => setInput((s) => ({ ...s, ...patch }));

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
            <Field label="Rent or mortgage"><MoneyInput value={input.housing} onChange={(v) => set({ housing: v })} /></Field>
            <Field label="Food"><MoneyInput value={input.food} onChange={(v) => set({ food: v })} /></Field>
            <Field label="Utilities"><MoneyInput value={input.utilities} onChange={(v) => set({ utilities: v })} /></Field>
            <Field label="Insurance"><MoneyInput value={input.insurance} onChange={(v) => set({ insurance: v })} /></Field>
            <Field label="Minimum debt payments"><MoneyInput value={input.debtMinimums} onChange={(v) => set({ debtMinimums: v })} /></Field>
            <Field label="Transportation"><MoneyInput value={input.transport} onChange={(v) => set({ transport: v })} /></Field>
          </div>
          <Field label="Other must-pay costs"><MoneyInput value={input.other} onChange={(v) => set({ other: v })} /></Field>
          <div style={S.twoCol}>
            <Field label="Months of expenses to cover"><NumInput value={input.targetMonths} onChange={(v) => set({ targetMonths: v })} /></Field>
            <Field label="Saved so far"><MoneyInput value={input.currentSavings} onChange={(v) => set({ currentSavings: v })} /></Field>
            <Field label="Monthly deposit"><MoneyInput value={input.monthlyDeposit} onChange={(v) => set({ monthlyDeposit: v })} /></Field>
            <Field label="Savings yield (APY)"><PctInput value={input.apyPct} onChange={(v) => set({ apyPct: v })} /></Field>
          </div>
          <p style={S.hint}>
            Count only the bills you would still have to pay after a job loss. How many months to cover is your call; the 6 above is a placeholder. Leave the yield at 0 to ignore interest.
          </p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Emergency fund target</span>
            <span style={S.bigValue}>{fmtUSD(result.targetAmount)}</span>
            <span style={S.bigSub}>{fmtUSD(result.monthlyEssentials)} a month x {fmtNum(input.targetMonths, 1)} months</span>
          </div>
          <div style={S.statRow}>
            <Stat label="Still to save" value={fmtUSD(result.gap)} />
            <Stat label="Months covered today" value={fmtNum(result.monthsCovered, 1)} />
          </div>
          <div style={S.statRow}>
            <Stat
              label="Time to reach the target"
              value={result.goalReached ? "Already there" : result.monthsToGoal == null ? "Add a monthly deposit" : fmtMonths(result.monthsToGoal)}
            />
            <Stat label="Deposit to finish in 12 months" value={result.depositForOneYear == null ? "—" : fmtUSD(result.depositForOneYear)} />
          </div>
          <div style={S.disclaimer}>
            Estimate only. Assumes steady monthly spending and a fixed deposit, and compounds any yield monthly. It does not model inflation or a change in your bills. Your own cushion depends on your job stability, household and health, so treat the result as arithmetic, not a recommendation.
          </div>
        </div>
      </div>
    </div>
  );
}
