import { useMemo, useState } from "react";
import { computeWithholding, TAX_YEAR, type WithholdingInput, type WithholdingStatus } from "../lib/social-security-withholding";
import { fmtUSD, fmtPct } from "../lib/format";
import { Field, MoneyInput, Stat, S } from "./calc-ui";
import CopyResultButton from "./CopyResultButton";

// Social Security withholding (Form W-4V) island (tool-usage pass 2026-11-25). Monthly benefit, filing status and other income
// give an estimated federal tax (2026 rules), then the four W-4V rates are compared by what each would withhold.

interface Props {
  initialData?: Partial<WithholdingInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: WithholdingInput = { status: "single", monthlyBenefit: 2400, months: 12, otherIncome: 30000, filers65: 1, alreadyPaid: 0 };

const FORM_W4V = "https://www.irs.gov/pub/irs-pdf/fw4v.pdf";
const SSA_WITHHOLD = "https://www.ssa.gov/manage-benefits/request-withhold-taxes";
const PUB_915 = "https://www.irs.gov/publications/p915";
const REV_PROC = "https://www.irs.gov/pub/irs-drop/rp-25-32.pdf";

const STATUS_LABEL: Record<WithholdingStatus, string> = {
  single: "Single",
  hoh: "Head of household",
  mfj: "Married filing jointly",
  "mfs-together": "Married filing separately (lived with spouse)",
};

const usd = (n: number) => fmtUSD(n);

export default function SocialSecurityWithholdingCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<WithholdingInput>({ ...DEFAULTS, ...initialData });
  const r = useMemo(() => computeWithholding(v), [v]);
  const set = (p: Partial<WithholdingInput>) => setV((s) => ({ ...s, ...p }));
  const maxFilers = v.status === "mfj" ? 2 : 1;
  const filers65 = Math.min(v.filers65, maxFilers);

  const headline =
    v.monthlyBenefit <= 0 ? "Enter your monthly benefit."
    : r.advice === "none" ? "No withholding needed"
    : `${Math.round((r.best ?? 0) * 100)}% on Form W-4V`;
  const sub =
    v.monthlyBenefit <= 0 ? "Use the amount before any Medicare premium comes out."
    : r.advice === "none" ? (r.estimatedTax <= 0 ? "At these figures the estimated federal tax is $0, so a W-4V request is not needed." : "The tax you entered as already paid covers the estimate, so a W-4V request is not needed.")
    : r.advice === "short" ? `Even 22% withholds ${usd(Math.abs(r.rows[3].surplus))} less than the estimated tax. Add estimated payments or withholding on your other income.`
    : `The lowest allowed rate that covers your estimated ${usd(r.taxToCover)} of tax. It withholds ${usd(r.rows.find((x) => x.rate === r.best)!.withheld)} over ${v.months} month${v.months === 1 ? "" : "s"}.`;

  const summary = [
    `Social Security withholding estimate (${TAX_YEAR} tax rules)`,
    `Monthly benefit: ${usd(v.monthlyBenefit)}; other income: ${usd(v.otherIncome)}; ${STATUS_LABEL[v.status]}`,
    `Taxable part of benefits: ${usd(r.taxableBenefits)}; estimated federal tax: ${usd(r.estimatedTax)}`,
    ...r.rows.map((x) => `${Math.round(x.rate * 100)}% withholds ${usd(x.withheld)} (${x.surplus >= 0 ? "over by " : "short by "}${usd(Math.abs(x.surplus))})`),
    "themodernwallet.com/social-security-withholding-calculator/",
  ].join("\n");

  return (
    <div style={S.wrap}>
      {(heading || subheading) && (
        <div style={S.head}>
          {heading && <div style={S.heading}>{heading}</div>}
          {subheading && <div style={S.subheading}>{subheading}</div>}
        </div>
      )}
      <div style={S.grid} className="mw-stack">
        <div style={S.inputs} className="mw-in">
          <Field label="Filing status">
            <select style={S.input} value={v.status} onChange={(e) => set({ status: e.target.value as WithholdingStatus })} aria-label="Filing status">
              {(Object.keys(STATUS_LABEL) as WithholdingStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </select>
          </Field>
          <Field label="Monthly Social Security benefit (before Medicare premium)"><MoneyInput value={v.monthlyBenefit} onChange={(x) => set({ monthlyBenefit: x })} /></Field>
          <p style={S.hint}>If you file jointly, enter both spouses' benefits together. The figures above are placeholders.</p>
          <Field label="Other taxable income for the year (pension, IRA withdrawals, wages, interest)"><MoneyInput value={v.otherIncome} onChange={(x) => set({ otherIncome: x })} /></Field>
          <Field label="Filers age 65 or older on the return">
            <select style={S.input} value={filers65} onChange={(e) => set({ filers65: Number(e.target.value) })} aria-label="Filers age 65 or older">
              <option value={0}>None</option>
              <option value={1}>One</option>
              {maxFilers === 2 && <option value={2}>Two</option>}
            </select>
          </Field>
          <Field label="Federal tax already withheld or paid on other income (optional)"><MoneyInput value={v.alreadyPaid} onChange={(x) => set({ alreadyPaid: x })} /></Field>
          <Field label="Months the W-4V rate would apply this year">
            <select style={S.input} value={v.months} onChange={(e) => set({ months: Number(e.target.value) })} aria-label="Months of withholding">
              {Array.from({ length: 12 }, (_, i) => 12 - i).map((m) => <option key={m} value={m}>{m}{m === 12 ? " (full year)" : ""}</option>)}
            </select>
          </Field>
        </div>

        <div style={S.results} className="mw-out">
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Closest W-4V choice</span>
            <span style={S.bigValue}>{headline}</span>
            <span style={S.bigSub}>{sub}</span>
          </div>
          <div style={S.statRow}>
            <Stat label="Taxable part of benefits" value={`${usd(r.taxableBenefits)} (${fmtPct(r.pctTaxable, 1)})`} />
            <Stat label={`Estimated federal tax, ${TAX_YEAR} rules`} value={usd(r.estimatedTax)} />
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={T.table}>
              <caption style={T.caption}>The four rates Form W-4V allows</caption>
              <thead>
                <tr>
                  <th style={T.th} scope="col">Rate</th>
                  <th style={{ ...T.th, ...T.right }} scope="col">Withheld</th>
                  <th style={{ ...T.th, ...T.right }} scope="col">Versus tax to cover</th>
                </tr>
              </thead>
              <tbody>
                {r.rows.map((x) => (
                  <tr key={x.rate} style={x.rate === r.best && r.advice !== "none" ? T.best : undefined}>
                    <td style={T.td}>{Math.round(x.rate * 100)}%</td>
                    <td style={{ ...T.td, ...T.right }}>{usd(x.withheld)}</td>
                    <td style={{ ...T.td, ...T.right }}>{r.taxToCover <= 0 ? "Not needed" : x.surplus >= 0 ? `${usd(x.surplus)} over` : `${usd(-x.surplus)} short`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={S.hint}>Tax to cover: {usd(r.taxToCover)}. Estimated {TAX_YEAR} tax uses a {usd(r.deduction)} deduction. Form W-4V allows only 7%, 10%, 12% or 22% of each payment, with no other percentage or amount.</p>
          <div style={{ ...S.aprBox, ...S.aprWarn }}>
            <span style={S.aprNote}>Tax year basis: {TAX_YEAR}. The brackets and standard deduction are the {TAX_YEAR} figures from <a href={REV_PROC} target="_blank" rel="noopener noreferrer">IRS Revenue Procedure 2025-32</a>. This tool does not apply 2027 brackets, so treat a 2027 request as a planning estimate.</span>
          </div>
          {r.advice !== "none" && v.monthlyBenefit > 0 && (
            <div style={S.aprBox}>
              <span style={S.aprNote}>
                To request a rate, complete <a href={FORM_W4V} target="_blank" rel="noopener noreferrer">Form W-4V</a> and give it to Social Security, not the IRS, or use SSA's <a href={SSA_WITHHOLD} target="_blank" rel="noopener noreferrer">online withholding request</a>.
              </span>
            </div>
          )}
          <div style={S.disclaimer}>
            Estimate only. The taxable part of your benefits follows <a href={PUB_915} target="_blank" rel="noopener noreferrer">IRS Publication 915</a>, Worksheet 1. The tax is ordinary-income tax on that amount plus your other income. It leaves out state tax, credits, the senior deduction for 2025 to 2028 and itemized deductions, so the estimate can run high. Confirm unusual situations with a tax professional.
          </div>
          {v.monthlyBenefit > 0 && <CopyResultButton text={summary} />}
        </div>
      </div>
    </div>
  );
}

const T: Record<string, React.CSSProperties> = {
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", fontVariantNumeric: "tabular-nums" },
  caption: { captionSide: "top", textAlign: "left", fontSize: "0.78rem", color: "#666", paddingBottom: 4 },
  th: { textAlign: "left", padding: "6px 4px", borderBottom: "1px solid #DCE6E2", color: "#555", fontWeight: 600 },
  td: { padding: "6px 4px", borderBottom: "1px solid #EEF3F1" },
  right: { textAlign: "right" },
  best: { background: "#EAF7F1", fontWeight: 600 },
};
