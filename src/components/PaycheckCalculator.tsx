import { useMemo, useState } from "react";
import {
  computePaycheck, PAYCHECK_DEFAULTS, PAYCHECK_STATUS_LABEL, PAY_FREQUENCY_LABEL,
  type PayBasis, type PayFrequency, type PaycheckInput, type PaycheckStatus,
} from "../lib/paycheck";
import { fmtUSD } from "../lib/format";
import { Field, MoneyInput, Stat, S } from "./calc-ui";

// Paycheck calculator island (mindmap keyword-gap pass 2026-11-15). 2026 federal and payroll tax rules and sources live in src/lib/paycheck.ts.

interface Props {
  initialData?: Partial<PaycheckInput>;
  heading?: string;
  subheading?: string;
}

const selectStyle = { width: "100%", padding: "10px 12px", fontSize: 16, borderRadius: 8, border: "1px solid #cbd5d1" } as const;
const pct = (x: number) => `${(x * 100).toFixed(1)}%`;

export default function PaycheckCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<PaycheckInput>({ ...PAYCHECK_DEFAULTS, ...initialData });
  const r = useMemo(() => computePaycheck(v), [v]);
  const set = (p: Partial<PaycheckInput>) => setV((s) => ({ ...s, ...p }));
  const c = { cents: true };

  return (
    <div style={S.wrap}>
      {(heading || subheading) && (
        <div style={S.head}>
          {heading && <div style={S.heading}>{heading}</div>}
          {subheading && <div style={S.subheading}>{subheading}</div>}
        </div>
      )}
      <div style={S.grid}>
        <div style={S.inputs} className="mw-pin">
          <Field label="Gross pay (before any tax)"><MoneyInput value={v.gross} onChange={(x) => set({ gross: x })} /></Field>
          <Field label="That amount is">
            <select value={v.basis} onChange={(e) => set({ basis: e.target.value as PayBasis })} style={selectStyle}>
              <option value="annual">Per year (annual salary)</option>
              <option value="paycheck">Per paycheck</option>
            </select>
          </Field>
          <Field label="How often you are paid">
            <select value={v.frequency} onChange={(e) => set({ frequency: e.target.value as PayFrequency })} style={selectStyle}>
              {(Object.keys(PAY_FREQUENCY_LABEL) as PayFrequency[]).map((k) => (
                <option key={k} value={k}>{PAY_FREQUENCY_LABEL[k]}</option>
              ))}
            </select>
          </Field>
          <Field label="Filing status">
            <select value={v.status} onChange={(e) => set({ status: e.target.value as PaycheckStatus })} style={selectStyle}>
              {(Object.keys(PAYCHECK_STATUS_LABEL) as PaycheckStatus[]).map((k) => (
                <option key={k} value={k}>{PAYCHECK_STATUS_LABEL[k]}</option>
              ))}
            </select>
          </Field>
          <Field label="Pre-tax retirement contribution per year (traditional 401(k) or 403(b))"><MoneyInput value={v.pretax} onChange={(x) => set({ pretax: x })} /></Field>
        </div>

        <div style={S.results}>
          {r == null ? (
            <div style={S.bigStat}><span style={S.bigLabel}>Enter gross pay above $0</span></div>
          ) : (
            <>
              <div style={S.bigStat}>
                <span style={S.bigLabel}>Estimated take-home per paycheck</span>
                <span style={S.bigValue} data-testid="net-per-check">{fmtUSD(r.perCheck.net, c)}</span>
                <span style={S.bigSub}>{fmtUSD(r.net, c)} a year, {pct(r.takeHomeShare)} of gross, before state tax</span>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <caption style={{ textAlign: "left", fontWeight: 600, paddingBottom: 6 }}>Where the gross pay goes</caption>
                <thead>
                  <tr><th style={{ textAlign: "left" }}>Item</th><th style={{ textAlign: "right" }}>Per paycheck</th><th style={{ textAlign: "right" }}>Per year</th></tr>
                </thead>
                <tbody>
                  <tr><td>Gross pay</td><td style={{ textAlign: "right" }}>{fmtUSD(r.perCheck.gross, c)}</td><td style={{ textAlign: "right" }}>{fmtUSD(r.grossAnnual, c)}</td></tr>
                  <tr><td>Pre-tax retirement</td><td style={{ textAlign: "right" }}>{fmtUSD(r.perCheck.pretax, c)}</td><td style={{ textAlign: "right" }}>{fmtUSD(r.pretax, c)}</td></tr>
                  <tr><td>Federal income tax</td><td style={{ textAlign: "right" }}>{fmtUSD(r.perCheck.federal, c)}</td><td style={{ textAlign: "right" }}>{fmtUSD(r.federal, c)}</td></tr>
                  <tr><td>Social Security (6.2%)</td><td style={{ textAlign: "right" }}>{fmtUSD(r.perCheck.socialSecurity, c)}</td><td style={{ textAlign: "right" }}>{fmtUSD(r.socialSecurity, c)}</td></tr>
                  <tr><td>Medicare (1.45%, plus 0.9% above $200,000)</td><td style={{ textAlign: "right" }}>{fmtUSD(r.perCheck.medicare, c)}</td><td style={{ textAlign: "right" }}>{fmtUSD(r.medicare, c)}</td></tr>
                  <tr style={{ fontWeight: 700 }}><td>Take-home pay</td><td style={{ textAlign: "right" }}>{fmtUSD(r.perCheck.net, c)}</td><td style={{ textAlign: "right" }}>{fmtUSD(r.net, c)}</td></tr>
                </tbody>
              </table>
              <div style={S.statRow}>
                <Stat label="Federal bracket" value={r.federalBracket > 0 ? `${Math.round(r.federalBracket * 100)}%` : "None (below deduction)"} />
                <Stat label="Taxable income" value={fmtUSD(r.taxableIncome)} />
              </div>
              <div style={S.disclaimer}>
                Annual-liability estimate with the 2026 standard deduction, using <a href="https://www.irs.gov/pub/irs-drop/rp-25-32.pdf" target="_blank" rel="noopener noreferrer">IRS Rev. Proc. 2025-32</a> and <a href="https://www.irs.gov/taxtopics/tc751" target="_blank" rel="noopener noreferrer">IRS Topic 751</a>. State and local tax, credits, health premiums, other withholding and W-4 choices are not modelled, so your real paycheck will differ. Not tax advice.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
