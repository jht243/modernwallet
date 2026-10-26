import { useMemo, useState } from "react";
import { computeCharitable, STANDARD_DEDUCTION, NON_ITEMIZER_CAP, type CdInput, type CdStatus } from "../lib/charitable-deduction";
import { fmtUSD } from "../lib/format";
import { Field, MoneyInput, PctInput, Stat, S } from "./calc-ui";

// Charitable donation tax deduction island (GA4 top-pages pass 2026-10-26). Cash gifts to a church or other
// public charity, 2026 federal rules: itemize vs standard, the 0.5% AGI floor, the 60% AGI limit, the
// non-itemizer cash deduction and a two-year bunching test.

interface Props {
  initialData?: Partial<CdInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: CdInput = { status: "mfj", agi: 150000, cashGifts: 12000, otherItemized: 20000, marginalRatePct: 22 };

const STATUS_LABEL: Record<CdStatus, string> = {
  single: "Single",
  mfj: "Married filing jointly",
  hoh: "Head of household",
  mfs: "Married filing separately",
};

export default function CharitableDeductionCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<CdInput>({ ...DEFAULTS, ...initialData });
  const r = useMemo(() => computeCharitable(v), [v]);
  const set = (p: Partial<CdInput>) => setV((s) => ({ ...s, ...p }));

  const verdict =
    v.cashGifts <= 0 ? "Enter your cash gifts for the year."
    : r.itemizes ? `Itemizing wins: ${fmtUSD(r.itemizedTotal)} of deductions beats the ${fmtUSD(r.standardTotal)} standard route.`
    : `The standard deduction wins: ${fmtUSD(r.standardTotal)} beats ${fmtUSD(r.itemizedTotal)} itemized.`;

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
          <Field label="Filing status">
            <select style={S.input} value={v.status} onChange={(e) => set({ status: e.target.value as CdStatus })} aria-label="Filing status">
              {(Object.keys(STATUS_LABEL) as CdStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </select>
          </Field>
          <Field label="Adjusted gross income (AGI)"><MoneyInput value={v.agi} onChange={(x) => set({ agi: x })} /></Field>
          <Field label="Cash gifts to your church or other public charity this year"><MoneyInput value={v.cashGifts} onChange={(x) => set({ cashGifts: x })} /></Field>
          <Field label="Other itemized deductions (mortgage interest, state and local taxes, medical)"><MoneyInput value={v.otherItemized} onChange={(x) => set({ otherItemized: x })} /></Field>
          <Field label="Your federal marginal tax rate"><PctInput value={v.marginalRatePct} onChange={(x) => set({ marginalRatePct: x })} /></Field>
          <p style={S.hint}>The figures above are placeholders. 2026 standard deduction for this status: {fmtUSD(STANDARD_DEDUCTION[v.status])}. Non-itemizer cash deduction cap: {fmtUSD(NON_ITEMIZER_CAP[v.status])}.</p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Tax your gifts save this year</span>
            <span style={S.bigValue}>{fmtUSD(r.taxSaved)}</span>
            <span style={S.bigSub}>{verdict}</span>
          </div>
          <div style={S.statRow}>
            <Stat label="Deductions if you itemize" value={fmtUSD(r.itemizedTotal)} />
            <Stat label="Standard deduction + cash allowance" value={fmtUSD(r.standardTotal)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Giving deductible after the 0.5% floor" value={fmtUSD(r.charityIfItemizing)} />
            <Stat label="Added to your deductions by giving" value={fmtUSD(r.addedByGiving)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Two years, giving evenly" value={fmtUSD(r.evenTwoYear)} />
            <Stat label="Two years, bunched into year one" value={fmtUSD(r.bunchedTwoYear)} />
          </div>
          <p style={S.hint}>
            {r.bunchingGain > 0
              ? `Bunching two years of gifts into one adds ${fmtUSD(r.bunchingGain)} of deductions, about ${fmtUSD(r.bunchingTaxGain)} of tax at your rate.`
              : "Bunching does not add deductions with these numbers."}
          </p>
          <div style={S.disclaimer}>
            Estimate only, for cash gifts to a church or other public charity on a 2026 federal return. The 60% of AGI limit (cash, {fmtUSD(r.capAmount)} here) is applied before the 0.5% of AGI floor ({fmtUSD(r.floorAmount)} here); the IRS has not published a worksheet for that ordering. Leaves out non-cash gifts, appreciated stock, carryovers, the extra standard deduction for age 65 or older, the senior deduction and gifts to donor-advised funds (which do not qualify for the non-itemizer deduction). Tax saved is added deductions times the rate you enter; state tax is not included.
          </div>
        </div>
      </div>
    </div>
  );
}
