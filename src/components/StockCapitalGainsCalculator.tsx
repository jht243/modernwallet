import { useMemo, useState } from "react";
import { computeStockGains, LTCG_ZERO_TOP, type SgInput } from "../lib/stock-capital-gains";
import { STATUS_LABEL, type FilingStatus } from "../lib/tax-bracket";
import { fmtUSD, fmtPct } from "../lib/format";
import { Field, MoneyInput, Stat, S } from "./calc-ui";

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
          <p style={S.hint}>Taxable income is your income after the standard or itemized deduction. The 0% long-term bracket ends at {fmtUSD(LTCG_ZERO_TOP[v.status])} of taxable income for this filing status in 2026. The figures above are placeholders.</p>
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
            </>
          ) : (
            <p style={S.hint}>{verdict}</p>
          )}
          <div style={S.disclaimer}>
            Estimate only, for tax year 2026, federal tax only. It stacks the gain on top of the taxable income you enter, using the 2026 rates in <a href="https://www.irs.gov/pub/irs-drop/rp-25-32.pdf" rel="noopener">IRS Revenue Procedure 2025-32</a>. The Net Investment Income Tax uses your taxable income plus the standard deduction plus the gain as modified adjusted gross income. It leaves out state tax, other investment income, loss carryovers, wash sales and qualified dividends.
          </div>
        </div>
      </div>
    </div>
  );
}
