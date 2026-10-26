import { useMemo, useState } from "react";
import { computeBrackets, STANDARD_DEDUCTION, STATUS_LABEL, type BracketInput, type FilingStatus } from "../lib/tax-bracket";
import { fmtUSD } from "../lib/format";
import { Field, MoneyInput, Stat, S } from "./calc-ui";

// Tax bracket calculator island (mindmap Autocomplete pass 2026-10-21). 2026 federal brackets, rules and sources live in src/lib/tax-bracket.ts.

interface Props {
  initialData?: Partial<BracketInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: BracketInput = { income: 85000, status: "single", useStandard: true, itemized: 0 };
const pct = (x: number) => `${(x * 100).toFixed(1)}%`;

export default function TaxBracketCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<BracketInput>({ ...DEFAULTS, ...initialData });
  const r = useMemo(() => computeBrackets(v), [v]);
  const set = (p: Partial<BracketInput>) => setV((s) => ({ ...s, ...p }));

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
          <Field label="Income before deductions (wages, interest, other taxable income)"><MoneyInput value={v.income} onChange={(x) => set({ income: x })} /></Field>
          <Field label="Filing status">
            <select
              value={v.status}
              onChange={(e) => set({ status: e.target.value as FilingStatus })}
              style={{ width: "100%", padding: "10px 12px", fontSize: 16, borderRadius: 8, border: "1px solid #cbd5d1" }}
            >
              {(Object.keys(STATUS_LABEL) as FilingStatus[]).map((k) => (
                <option key={k} value={k}>{STATUS_LABEL[k]}</option>
              ))}
            </select>
          </Field>
          <Field label="Deduction">
            <select
              value={v.useStandard ? "standard" : "itemized"}
              onChange={(e) => set({ useStandard: e.target.value === "standard" })}
              style={{ width: "100%", padding: "10px 12px", fontSize: 16, borderRadius: 8, border: "1px solid #cbd5d1" }}
            >
              <option value="standard">Standard deduction ({fmtUSD(STANDARD_DEDUCTION[v.status])})</option>
              <option value="itemized">Itemized or other deduction</option>
            </select>
          </Field>
          {!v.useStandard && (
            <Field label="Total deductions"><MoneyInput value={v.itemized} onChange={(x) => set({ itemized: x })} /></Field>
          )}
        </div>

        <div style={S.results}>
          {r == null ? (
            <div style={S.bigStat}><span style={S.bigLabel}>Enter an income above $0</span></div>
          ) : (
            <>
              <div style={S.bigStat}>
                <span style={S.bigLabel}>Your 2026 federal tax bracket</span>
                <span style={S.bigValue}>{Math.round(r.marginalRate * 100)}%</span>
                <span style={S.bigSub}>Taxable income {fmtUSD(r.taxableIncome)}, estimated tax {fmtUSD(r.tax)}</span>
              </div>
              <div style={S.statRow}>
                <Stat label="Effective rate (of income)" value={pct(r.effectiveRate)} />
                <Stat label="Room left in this bracket" value={r.roomInBracket == null ? "Top bracket" : fmtUSD(r.roomInBracket)} />
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, marginTop: 12 }}>
                <caption style={{ textAlign: "left", fontWeight: 600, paddingBottom: 6 }}>Tax by bracket</caption>
                <thead>
                  <tr><th style={{ textAlign: "left" }}>Rate</th><th style={{ textAlign: "right" }}>Taxed in band</th><th style={{ textAlign: "right" }}>Tax</th></tr>
                </thead>
                <tbody>
                  {r.bands.filter((b) => b.amount > 0).map((b) => (
                    <tr key={b.rate}>
                      <td>{Math.round(b.rate * 100)}%</td>
                      <td style={{ textAlign: "right" }}>{fmtUSD(b.amount)}</td>
                      <td style={{ textAlign: "right" }}>{fmtUSD(b.tax)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={S.disclaimer}>
                Estimate only, using the 2026 ordinary-income brackets and standard deductions in <a href="https://www.irs.gov/pub/irs-drop/rp-25-32.pdf" target="_blank" rel="noopener noreferrer">IRS Rev. Proc. 2025-32</a>. Credits, capital gains rates, the qualified business income deduction, payroll tax and state tax are not modelled. Not tax advice.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
