import { useMemo, useState } from "react";
import { computeHurricaneDeductible, type HurricaneDeductibleInput } from "../lib/hurricane-deductible";
import { fmtUSD } from "../lib/format";
import { Field, MoneyInput, Stat, S } from "./calc-ui";

// Hurricane deductible island. Percent (or flat dollar) deductible x dwelling limit, then what the
// policyholder and insurer each pay on a covered loss, with Florida's calendar-year carryover.

interface Props {
  initialData?: Partial<HurricaneDeductibleInput>;
  heading?: string;
  subheading?: string;
}

// Illustrative defaults; $1,000 all-other-perils matches the Florida CFO worked example.
const DEFAULTS: HurricaneDeductibleInput = { dwellingLimit: 300000, kind: "percent", deductibleValue: 5, damage: 40000, alreadyUsed: 0, otherPerilsDeductible: 1000 };
const OPTIONS = [
  { key: "2", label: "2% of dwelling limit", kind: "percent" as const, value: 2 },
  { key: "5", label: "5% of dwelling limit", kind: "percent" as const, value: 5 },
  { key: "10", label: "10% of dwelling limit", kind: "percent" as const, value: 10 },
  { key: "flat", label: "Flat dollar amount (e.g. $500)", kind: "flat" as const, value: 500 },
];

export default function HurricaneDeductibleCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<HurricaneDeductibleInput>({ ...DEFAULTS, ...initialData });
  const r = useMemo(() => computeHurricaneDeductible(input), [input]);
  const set = (patch: Partial<HurricaneDeductibleInput>) => setInput((s) => ({ ...s, ...patch }));
  const optKey = input.kind === "flat" ? "flat" : String(input.deductibleValue);
  const selected = OPTIONS.some((o) => o.key === optKey) ? optKey : "5";

  const onOption = (key: string) => {
    const o = OPTIONS.find((x) => x.key === key)!;
    set({ kind: o.kind, deductibleValue: o.kind === "flat" && input.kind === "flat" ? input.deductibleValue : o.value });
  };

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
          <Field label="Dwelling coverage limit (Coverage A on your declarations page)">
            <MoneyInput value={input.dwellingLimit} onChange={(v) => set({ dwellingLimit: v })} />
          </Field>
          <Field label="Hurricane deductible option">
            <select style={S.input} value={selected} onChange={(e) => onOption(e.target.value)} aria-label="Hurricane deductible option">
              {OPTIONS.map((o) => (
                <option key={o.key} value={o.key}>{o.label}</option>
              ))}
            </select>
          </Field>
          {input.kind === "flat" && (
            <Field label="Flat hurricane deductible, dollars">
              <MoneyInput value={input.deductibleValue} onChange={(v) => set({ deductibleValue: v })} />
            </Field>
          )}
          <Field label="Covered hurricane damage (wind loss from this storm)">
            <MoneyInput value={input.damage} onChange={(v) => set({ damage: v })} />
          </Field>
          <Field label="Hurricane deductible already used by earlier storms this calendar year">
            <MoneyInput value={input.alreadyUsed} onChange={(v) => set({ alreadyUsed: v })} />
          </Field>
          <Field label="Your 'all other perils' deductible">
            <MoneyInput value={input.otherPerilsDeductible} onChange={(v) => set({ otherPerilsDeductible: v })} />
          </Field>
          <p style={S.hint}>Leave "already used" at $0 for the first hurricane of the year. The figure to use is on your declarations page.</p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>You pay</span>
            <span style={S.bigValue}>{fmtUSD(r.youPay)}</span>
            <span style={S.bigSub}>
              Your hurricane deductible is {fmtUSD(r.fullDeductible)}; the insurer pays {fmtUSD(r.insurerPays)}
            </span>
          </div>
          <div style={S.statRow}>
            <Stat label="Full hurricane deductible" value={fmtUSD(r.fullDeductible)} />
            <Stat label="Deductible applied to this claim" value={fmtUSD(r.applied)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Insurer pays" value={fmtUSD(r.insurerPays)} />
            <Stat label="Deductible balance left this year" value={fmtUSD(r.balanceAfter)} />
          </div>
          {r.belowDeductible && input.damage > 0 && !r.usesOtherPerils && (
            <div style={{ ...S.aprBox, ...S.aprWarn }}>
              <span style={S.aprNote}>The damage is no more than the deductible that applies, so you pay all {fmtUSD(r.youPay)} and the insurer pays nothing. This claim still counts toward the year's hurricane deductible.</span>
            </div>
          )}
          {r.usesOtherPerils && (
            <div style={{ ...S.aprBox, ...S.aprWarn }}>
              <span style={S.aprNote}>The balance left on your hurricane deductible is below your all-other-perils deductible, so the all-other-perils amount applies.</span>
            </div>
          )}
          <div style={S.disclaimer}>
            Estimate only, for a single dwelling under a Florida personal residential policy. Your insurer's adjuster decides how a claim is applied. Other states' wind and hurricane deductibles work differently and are not modeled.
          </div>
        </div>
      </div>
    </div>
  );
}
