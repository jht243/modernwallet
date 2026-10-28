import { useMemo, useState } from "react";
import { computeSsTaxable, BASE_AMOUNT, ADJUSTED_BASE, type SsTaxableInput, type SsStatus } from "../lib/social-security-taxable";
import { fmtUSD, fmtPct } from "../lib/format";
import { Field, MoneyInput, Stat, S, PRIMARY } from "./calc-ui";
import ToolPicks, { book } from "./ToolPicks";

// Taxable Social Security benefits island (tool-usage pass 2026-10-21). Filing status, the year's benefits,
// other income and tax-exempt interest → provisional income and the taxable part of the benefits (IRS Pub 915
// Worksheet 1).

interface Props {
  initialData?: Partial<SsTaxableInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: SsTaxableInput = { status: "mfj", benefits: 42000, otherIncome: 30000, taxExemptInterest: 0 };

const STATUS_LABEL: Record<SsStatus, string> = {
  single: "Single, head of household, or married filing separately (lived apart all year)",
  mfj: "Married filing jointly",
  "mfs-together": "Married filing separately (lived with spouse)",
};

export default function SocialSecurityTaxableCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<SsTaxableInput>({ ...DEFAULTS, ...initialData });
  const r = useMemo(() => computeSsTaxable(v), [v]);
  const set = (p: Partial<SsTaxableInput>) => setV((s) => ({ ...s, ...p }));

  const tierText =
    v.benefits <= 0 ? "Enter your Social Security benefits for the year."
    : r.tier === "none" ? `Your provisional income is at or below ${fmtUSD(r.baseAmount)}, so none of your benefits are taxable.`
    : r.tier === "up-to-50" ? `Your provisional income is between ${fmtUSD(r.baseAmount)} and ${fmtUSD(r.adjustedBase)}, so up to 50% of your benefits can be taxed.`
    : `Your provisional income is above ${fmtUSD(r.adjustedBase)}, so up to 85% of your benefits can be taxed.`;

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
            <select style={S.input} value={v.status} onChange={(e) => set({ status: e.target.value as SsStatus })} aria-label="Filing status">
              {(Object.keys(STATUS_LABEL) as SsStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </select>
          </Field>
          <Field label="Social Security benefits for the year"><MoneyInput value={v.benefits} onChange={(x) => set({ benefits: x })} /></Field>
          <p style={S.hint}>Box 5 of your Form SSA-1099 (both spouses' if filing jointly), or 12 × your monthly benefit before Medicare.</p>
          <Field label="All other income (pensions, IRA withdrawals, wages, interest, dividends)"><MoneyInput value={v.otherIncome} onChange={(x) => set({ otherIncome: x })} /></Field>
          <Field label="Tax-exempt interest (municipal bonds)"><MoneyInput value={v.taxExemptInterest} onChange={(x) => set({ taxExemptInterest: x })} /></Field>
          <p style={S.hint}>The figures above are placeholders. Thresholds for {v.status === "mfj" ? "joint filers" : "this status"}: {fmtUSD(BASE_AMOUNT[v.status])} and {fmtUSD(ADJUSTED_BASE[v.status])} (set by law, not adjusted for inflation).</p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Taxable part of your benefits</span>
            <span style={S.bigValue}>{fmtUSD(r.taxable)}</span>
            <span style={S.bigSub}>{tierText}</span>
          </div>
          <div style={S.statRow}>
            <Stat label="Provisional income" value={fmtUSD(r.provisionalIncome)} />
            <Stat label="Share of benefits taxable" value={fmtPct(r.pctTaxable, 1)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Benefits not taxed" value={fmtUSD(Math.max(0, v.benefits - r.taxable))} />
            <Stat label="Half of your benefits" value={fmtUSD(v.benefits / 2)} />
          </div>
          <p style={S.hint}>
            To estimate the tax, add this taxable amount to your other taxable income in the{" "}
            <a href="/tax-bracket-calculator/" style={{ color: PRIMARY }}>tax bracket calculator</a>. If you are 65 or older, the{" "}
            <a href="/guides/senior-deduction-social-security/" style={{ color: PRIMARY }}>$6,000 senior deduction</a> can lower that income.
          </p>
          <div style={S.disclaimer}>
            Estimate only, following IRS Publication 915, Worksheet 1. The taxable part is added to your other income and taxed at your normal rates; this tool does not compute that tax. Leaves out adjustments such as student loan interest, the foreign earned income exclusion and lump-sum back payments for earlier years. The IRS worksheet in your tax software is the exact figure.
          </div>
          <ToolPicks
            tool="social-security-taxable-benefits-calculator"
            heading="Further reading on how Social Security is taxed"
            picks={
              r.taxable > 0
                ? [
                    book("ssMadeSimple", "How benefits are taxed, plus the claiming choices that change it."),
                    book("taxesMadeSimple", "How the taxable part of your benefits meets the tax brackets."),
                    book("lasser2027", "A full guide for filing this year's return."),
                    book("pfauGuidebook", "Planning withdrawals so less of your benefit is taxed."),
                  ]
                : [
                    book("pfauGuidebook", "Keeping withdrawals below the threshold as your income changes."),
                    book("ssMadeSimple", "How benefits and their taxation work."),
                  ]
            }
          />
        </div>
      </div>
    </div>
  );
}
