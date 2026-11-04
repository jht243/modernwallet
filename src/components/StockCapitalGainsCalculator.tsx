import { useMemo, useState } from "react";
import { computeStockGains, ordinaryTax, LTCG_ZERO_TOP, type SgInput } from "../lib/stock-capital-gains";
import { STATUS_LABEL, STANDARD_DEDUCTION, type FilingStatus } from "../lib/tax-bracket";
import { fmtUSD, fmtPct } from "../lib/format";
import { Field, MoneyInput, Stat, S } from "./calc-ui";
import ToolPicks, { book } from "./ToolPicks";

// Stock capital gains tax island (Autocomplete pass 2026-10-28). Federal only, tax year 2026: see src/lib/stock-capital-gains.ts.

interface Props {
  initialData?: Partial<SgInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: SgInput = { status: "single", taxableIncome: 85000, basis: 30000, proceeds: 50000, longTerm: true };

export default function StockCapitalGainsCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<SgInput>({ ...DEFAULTS, ...initialData });
  const set = (p: Partial<SgInput>) => setV((s) => ({ ...s, ...p }));
  const r = useMemo(() => computeStockGains(v), [v]);

  // Loss figures, assuming this is the only capital transaction this year (IRS Topic 409). The saving is the
  // ordinary tax on the entered taxable income minus the tax after the deduction, so it is approximate.
  const lossLimit = v.status === "mfs" ? 1500 : 3000;
  const loss = r && r.isLoss ? -r.gain : 0;
  const lossDeductible = Math.min(loss, lossLimit);
  const lossCarried = loss - lossDeductible;
  const lossSaving = r && r.isLoss
    ? ordinaryTax(v.status, v.taxableIncome) - ordinaryTax(v.status, Math.max(0, v.taxableIncome - lossDeductible))
    : 0;
  // 0% room left once this long-term gain is stacked on top.
  const roomAfter = r ? Math.max(0, r.zeroRoom - r.at0) : 0;
  const picks = !r
    ? []
    : r.niit > 0 || r.at20 > 0
      ? [
          book("lasser2027", "A full reference for the 2026 return, including Form 8960 and the 20% band at this income."),
          book("taxesMadeSimple", "A plain-English overview of how capital gains are taxed."),
        ]
      : r.isLoss
        ? [
            book("taxesMadeSimple", "How the $3,000 loss limit and the carryforward work."),
            book("bogleheads", "Staying invested through a loss, and harvesting losses without a wash sale."),
          ]
        : !v.longTerm && r.gain > 0
          ? [
              book("taxesMadeSimple", "Why a short-term gain is taxed at your ordinary income rates."),
              book("bogleheads", "Buy-and-hold habits that turn future gains into long-term ones."),
            ]
          : [
              book("taxesMadeSimple", "Why part of a gain can be taxed at 0%, and how to use that band on purpose."),
              book("bogleheads", "Tax-efficient fund placement for your next sale."),
            ];

  let verdict = "Enter your cost basis and what you sold for.";
  if (r) {
    if (r.isLoss) verdict = "This sale is a loss, so it owes no capital gains tax. A net capital loss can offset up to $3,000 of other income a year ($1,500 if married filing separately), and any excess carries forward.";
    else if (r.gain === 0) verdict = "There is no gain or loss, so there is nothing to tax.";
    else if (r.totalTax === 0) verdict = "This gain falls inside the 0% long-term bracket, so it owes no federal tax.";
    else verdict = v.longTerm ? `Held more than a year, ${fmtUSD(r.at0)} of the gain is taxed at 0%, ${fmtUSD(r.at15)} at 15% and ${fmtUSD(r.at20)} at 20%.` : "Held a year or less, the whole gain is taxed as ordinary income at your bracket rates.";
  }

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
            <select style={S.input} value={v.status} onChange={(e) => set({ status: e.target.value as FilingStatus })} aria-label="Filing status">
              {(Object.keys(STATUS_LABEL) as FilingStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </select>
          </Field>
          <Field label="Taxable income before this sale (after deductions)"><MoneyInput value={v.taxableIncome} onChange={(x) => set({ taxableIncome: x })} /></Field>
          <Field label="Cost basis (what you paid, including fees)"><MoneyInput value={v.basis} onChange={(x) => set({ basis: x })} /></Field>
          <Field label="Sale proceeds (after fees)"><MoneyInput value={v.proceeds} onChange={(x) => set({ proceeds: x })} /></Field>
          <Field label="How long did you hold it?">
            <select style={S.input} value={v.longTerm ? "long" : "short"} onChange={(e) => set({ longTerm: e.target.value === "long" })} aria-label="Holding period">
              <option value="long">More than one year (long-term)</option>
              <option value="short">One year or less (short-term)</option>
            </select>
          </Field>
          <p style={S.hint}>Long-term means held more than one year. Count from the day after you bought: shares bought March 10, 2025 are long-term if sold on or after March 11, 2026 (<a href="https://www.irs.gov/publications/p550" target="_blank" rel="noopener noreferrer">IRS Publication 550</a>).</p>
          <p style={S.hint}>Taxable income is your income after the standard or itemized deduction. If you don't itemize, that is your income minus the 2026 standard deduction of {fmtUSD(STANDARD_DEDUCTION[v.status])} for this filing status ({fmtUSD(STANDARD_DEDUCTION.single)} single or married filing separately, {fmtUSD(STANDARD_DEDUCTION.mfj)} married filing jointly, {fmtUSD(STANDARD_DEDUCTION.hoh)} head of household). The 0% long-term bracket ends at {fmtUSD(LTCG_ZERO_TOP[v.status])} of taxable income for this filing status in 2026. The figures above are placeholders.</p>
        </div>

        <div style={S.results}>
          {r ? (
            <>
              <div style={S.bigStat}>
                <span style={S.bigLabel}>Federal tax on this sale</span>
                <span style={S.bigValue}>{fmtUSD(r.totalTax)}</span>
                <span style={S.bigSub}>{verdict}</span>
              </div>
              <div style={S.statRow}>
                <Stat label={r.isLoss ? "Capital loss" : "Capital gain"} value={fmtUSD(Math.abs(r.gain))} />
                <Stat label={r.isLoss ? "Income tax" : "Income tax on the gain"} value={fmtUSD(r.incomeTax)} />
              </div>
              <div style={S.statRow}>
                <Stat label="Net Investment Income Tax (3.8%)" value={fmtUSD(r.niit)} />
                <Stat label="Share of the gain paid as tax" value={fmtPct(r.effectiveRate * 100, 1)} />
              </div>
              <div style={S.statRow}>
                <Stat label="Proceeds after tax" value={fmtUSD(r.afterTax)} />
                <Stat label="Room left in the 0% bracket" value={v.longTerm ? fmtUSD(r.zeroRoom) : "Short-term: n/a"} />
              </div>
              {v.longTerm && r.gain > 0 && (
                <p style={S.hint}>Before this sale. This sale uses {fmtUSD(r.at0)} at 0%, leaving {fmtUSD(roomAfter)}.</p>
              )}
              {r.isLoss && (
                <>
                  <div style={S.statRow}>
                    <Stat label="Deductible against other income this year" value={fmtUSD(lossDeductible)} />
                    <Stat label="Carried forward to 2027" value={fmtUSD(lossCarried)} />
                  </div>
                  <p style={S.hint}>Estimate assuming this is your only capital transaction this year. Deducting {fmtUSD(lossDeductible)} saves about {fmtUSD(lossSaving)} of federal income tax at your taxable income. Source: <a href="https://www.irs.gov/taxtopics/tc409" target="_blank" rel="noopener noreferrer">IRS Topic 409</a>.</p>
                </>
              )}
            </>
          ) : (
            <p style={S.hint}>{verdict}</p>
          )}
          <div style={S.disclaimer}>
            Estimate only, for tax year 2026, federal tax only. It stacks the gain on top of the taxable income you enter, using the 2026 rates in <a href="https://www.irs.gov/pub/irs-drop/rp-25-32.pdf" rel="noopener">IRS Revenue Procedure 2025-32</a>. The Net Investment Income Tax uses your taxable income plus the standard deduction plus the gain as modified adjusted gross income. It leaves out state tax, other investment income, loss carryovers, wash sales and qualified dividends.
          </div>
          {r && (
            <ToolPicks tool="stock-capital-gains-tax-calculator" heading="Further reading on taxes when you sell investments" picks={picks} />
          )}
        </div>
      </div>
    </div>
  );
}
