import { useMemo, useState } from "react";
import { computeSalaryInflation, type SalaryInflationInput } from "../lib/salary-inflation";
import { CPI_FIRST_YEAR, CPI_LAST_FULL_YEAR, CPI_LATEST, CPI_YEAR_AGO, CPI_SOURCE_URL } from "../lib/cpi-u";
import { fmtUSD, fmtPct } from "../lib/format";
import { Field, MoneyInput, Stat, S } from "./calc-ui";

// Salary inflation island (tool-usage pass 2026-10-28). Past salary + year → that salary in today's dollars
// (BLS CPI-U), compared with today's salary, plus the raise that matches the latest 12-month CPI-U change.

interface Props {
  initialData?: Partial<SalaryInflationInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: SalaryInflationInput = { pastSalary: 52000, pastYear: 2010, currentSalary: 78000 };

export default function SalaryInflationCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<SalaryInflationInput>({ ...DEFAULTS, ...initialData });
  const r = useMemo(() => computeSalaryInflation(v), [v]);
  const set = (p: Partial<SalaryInflationInput>) => setV((s) => ({ ...s, ...p }));
  const years: number[] = [];
  for (let y = CPI_LAST_FULL_YEAR; y >= CPI_FIRST_YEAR; y--) years.push(y);
  const ahead = r?.gap != null && r.gap >= 0;

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
          <Field label="Your salary back then"><MoneyInput value={v.pastSalary} onChange={(x) => set({ pastSalary: x })} /></Field>
          <label style={S.field}>
            <span style={S.label}>Year you earned it</span>
            <select style={S.input} value={v.pastYear} onChange={(e) => set({ pastYear: Number(e.target.value) })}>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </label>
          <Field label="Your salary now (optional)"><MoneyInput value={v.currentSalary} onChange={(x) => set({ currentSalary: x })} /></Field>
          <p style={S.hint}>
            The figures above are an example. Uses the Bureau of Labor Statistics consumer price index (CPI-U) for each year from {CPI_FIRST_YEAR} to {CPI_LAST_FULL_YEAR}, compared with {CPI_LATEST.label}, the latest month in our data. Use gross annual pay for both salaries.
          </p>
        </div>

        <div style={S.results}>
          {r == null ? (
            <div style={S.bigStat}><span style={S.bigSub}>Enter a past salary and pick a year.</span></div>
          ) : (
            <>
              <div style={S.bigStat}>
                <span style={S.bigLabel}>{fmtUSD(v.pastSalary)} in {v.pastYear} equals</span>
                <span style={S.bigValue}>{fmtUSD(r.adjusted)}</span>
                <span style={S.bigSub}>in {CPI_LATEST.label} dollars. Prices are up {fmtPct(r.cumulativePct, 1)} since {v.pastYear}.</span>
              </div>
              {r.gap != null && r.gapPct != null && (
                <div style={{ ...S.aprBox, ...(ahead ? S.aprOk : S.aprWarn) }}>
                  <span style={S.aprLabel}>{ahead ? "Your pay beat inflation" : "Your pay fell behind inflation"}</span>
                  <span style={S.aprValue}>{ahead ? "+" : "−"}{fmtUSD(Math.abs(r.gap))}</span>
                  <span style={S.aprNote}>
                    {fmtUSD(v.currentSalary)} buys {fmtPct(Math.abs(r.gapPct), 1)} {ahead ? "more" : "less"} than {fmtUSD(v.pastSalary)} did in {v.pastYear}.
                  </span>
                </div>
              )}
              <div style={S.statRow}>
                <Stat label="Average raise per year" value={r.nominalChangePerYearPct == null ? "—" : fmtPct(r.nominalChangePerYearPct, 2)} />
                <Stat label="Real change per year (after inflation)" value={r.realChangePerYearPct == null ? "—" : fmtPct(r.realChangePerYearPct, 2)} />
              </div>
              {r.keepPaceRaise != null && (
                <div style={S.statRow}>
                  <Stat label={`Raise to match the last 12 months of prices (${fmtPct(r.keepPacePct, 1)})`} value={fmtUSD(r.keepPaceRaise)} />
                  <Stat label="Salary after that raise" value={fmtUSD(v.currentSalary + r.keepPaceRaise)} />
                </div>
              )}
              <div style={S.disclaimer}>
                Estimate only. Uses the national CPI-U for all items ({CPI_YEAR_AGO.label} to {CPI_LATEST.label} for the 12-month change); your own costs, city and taxes can differ. Index values from the <a href={CPI_SOURCE_URL} target="_blank" rel="noopener" style={{ color: "inherit" }}>Bureau of Labor Statistics</a>, series CUUR0000SA0. Not career or financial advice.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
