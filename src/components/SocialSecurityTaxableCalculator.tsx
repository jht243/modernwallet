import { useMemo, useState } from "react";
import { computeSsTaxable, BASE_AMOUNT, ADJUSTED_BASE, type SsTaxableInput, type SsStatus } from "../lib/social-security-taxable";
import { fmtUSD, fmtPct } from "../lib/format";
import { Field, MoneyInput, Stat, S } from "./calc-ui";
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

const PUB_915 = "https://www.irs.gov/publications/p915";
const W4V = "https://www.irs.gov/forms-pubs/about-form-w-4-v";

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
  // Tool-usage pass 2026-11-04 (row F3): the generic "above $0" sentence reads like a glitch for this status.
  const mfsTogether = v.status === "mfs-together" && v.benefits > 0 && r.tier === "up-to-85";

  // Further-reading tier (persona table, row M3).
  const picks =
    r.tier === "up-to-85"
      ? [
          book("pfauGuidebook", "Ordering IRA, Roth and taxable withdrawals so less of your benefit is taxed."),
          book("taxesMadeSimple", "How the taxable part of your benefit is taxed at your normal rates."),
          book("lasser2027", "A full reference for preparing your 2026 return."),
        ]
      : r.tier === "up-to-50"
        ? [
            book("taxesMadeSimple", "Explains provisional income and the 50% tier you are in."),
            book("ssMadeSimple", "How claiming and spousal rules interact with the tax on your benefit."),
            book("pfauGuidebook", "How to plan withdrawals to stay under the next threshold."),
          ]
        : [
            book("ssMadeSimple", "No tax to plan for here, so the next question is how your benefit itself works."),
            book("getWhatsYours", "Checks you are collecting every benefit you are owed."),
          ];

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
          <p style={S.hint}>
            Use taxable amounts only, such as Form 1099-R box 2a, not box 1a. Leave out qualified Roth IRA withdrawals and the tax-free part of a pension. Each dollar wrongly added can raise the taxable part of your benefits by up to 85 cents (<a href={PUB_915} target="_blank" rel="noopener noreferrer">IRS Pub 915</a>).
          </p>
          <Field label="Tax-exempt interest (municipal bonds)"><MoneyInput value={v.taxExemptInterest} onChange={(x) => set({ taxExemptInterest: x })} /></Field>
          <p style={S.hint}>The figures above are placeholders. Thresholds for {v.status === "mfj" ? "joint filers" : "this status"}: {fmtUSD(BASE_AMOUNT[v.status])} and {fmtUSD(ADJUSTED_BASE[v.status])} (set by law, not adjusted for inflation).</p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Taxable part of your benefits</span>
            <span style={S.bigValue}>{fmtUSD(r.taxable)}</span>
            <span style={S.bigSub}>
              {mfsTogether ? (
                <>Married filing separately and living with your spouse at any time in the year, the base amount is $0, so up to 85% of your benefits can be taxed from the first dollar (<a href={PUB_915} target="_blank" rel="noopener noreferrer">IRS Pub 915</a>).</>
              ) : tierText}
            </span>
          </div>
          <div style={S.statRow}>
            <Stat label="Provisional income" value={fmtUSD(r.provisionalIncome)} />
            <Stat label="Share of benefits taxable" value={fmtPct(r.pctTaxable, 1)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Benefits not taxed" value={fmtUSD(Math.max(0, v.benefits - r.taxable))} />
            <Stat label="Half of your benefits" value={fmtUSD(v.benefits / 2)} />
          </div>
          {r.taxable > 0 && (
            <div style={S.aprBox}>
              <span style={S.aprNote}>
                This taxable amount is added to your other taxable income. To have federal tax taken out of your benefit, file <a href={W4V} target="_blank" rel="noopener noreferrer">Form W-4V</a> and choose 7%, 10%, 12% or 22% of each payment. Our <a href="/tax-bracket-calculator/">tax bracket calculator</a> shows your rate. If you are 65 or older, the <a href="/guides/senior-deduction-social-security/">senior deduction for 2025 to 2028</a> can lower the tax, but not this taxable figure.
              </span>
            </div>
          )}
          <div style={S.disclaimer}>
            Estimate only, following IRS Publication 915, Worksheet 1. The taxable part is added to your other income and taxed at your normal rates; this tool does not compute that tax. Leaves out adjustments such as student loan interest, the foreign earned income exclusion and lump-sum back payments for earlier years. The IRS worksheet in your tax software is the exact figure.
          </div>
          {v.benefits > 0 && (
            <ToolPicks tool="social-security-taxable-benefits-calculator" heading="Further reading on how your Social Security is taxed" picks={picks} />
          )}
        </div>
      </div>
    </div>
  );
}
