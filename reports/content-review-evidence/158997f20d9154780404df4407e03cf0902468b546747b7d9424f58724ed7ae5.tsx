import { useMemo, useState } from "react";
import { computeSalary, PERIOD_LABEL, SALARY_DEFAULTS, type PayPeriod, type SalaryInput } from "../lib/salary";
import { fmtUSD } from "../lib/format";
import { Field, MoneyInput, NumInput, Stat, S } from "./calc-ui";

// Salary calculator island (mindmap keyword-gap pass 2026-11-15). Conversion math lives in src/lib/salary.ts.

interface Props {
  initialData?: Partial<SalaryInput>;
  heading?: string;
  subheading?: string;
}

const selectStyle = { width: "100%", padding: "10px 12px", fontSize: 16, borderRadius: 8, border: "1px solid #cbd5d1" } as const;

export default function SalaryCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<SalaryInput>({ ...SALARY_DEFAULTS, ...initialData });
  const r = useMemo(() => computeSalary(v), [v]);
  const set = (p: Partial<SalaryInput>) => setV((s) => ({ ...s, ...p }));
  const cents = { cents: true };

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
          <Field label="Pay amount (before tax)"><MoneyInput value={v.amount} onChange={(x) => set({ amount: x })} /></Field>
          <Field label="That amount is paid per">
            <select value={v.period} onChange={(e) => set({ period: e.target.value as PayPeriod })} style={selectStyle}>
              {(Object.keys(PERIOD_LABEL) as PayPeriod[]).map((k) => (
                <option key={k} value={k}>{PERIOD_LABEL[k]}</option>
              ))}
            </select>
          </Field>
          <div style={S.twoCol}>
            <Field label="Hours per week"><NumInput value={v.hoursPerWeek} onChange={(x) => set({ hoursPerWeek: x })} /></Field>
            <Field label="Weeks per year"><NumInput value={v.weeksPerYear} onChange={(x) => set({ weeksPerYear: x })} /></Field>
          </div>
          <Field label="Days worked per week"><NumInput value={v.daysPerWeek} onChange={(x) => set({ daysPerWeek: x })} /></Field>
        </div>

        <div style={S.results}>
          {r == null ? (
            <div style={S.bigStat}><span style={S.bigLabel}>Enter a pay amount, hours and weeks above $0</span></div>
          ) : (
            <>
              <div style={S.bigStat}>
                <span style={S.bigLabel}>Hourly rate</span>
                <span style={S.bigValue} data-testid="hourly">{fmtUSD(r.hourly, cents)}</span>
                <span style={S.bigSub}>Annual pay {fmtUSD(r.annual, cents)} over {r.hoursPerYear.toLocaleString("en-US")} hours a year</span>
              </div>
              <div style={S.statRow}>
                <Stat label="Annual" value={fmtUSD(r.annual, cents)} />
                <Stat label="Monthly" value={fmtUSD(r.monthly, cents)} />
                <Stat label="Twice a month" value={fmtUSD(r.semimonthly, cents)} />
                <Stat label="Every two weeks" value={fmtUSD(r.biweekly, cents)} />
                <Stat label="Weekly" value={fmtUSD(r.weekly, cents)} />
                <Stat label="Daily" value={fmtUSD(r.daily, cents)} />
              </div>
              <div style={S.disclaimer}>
                Gross pay before tax and deductions. Weekly, every-two-weeks, daily and hourly amounts are pay for time worked, so they follow your hours and weeks. Monthly and twice-a-month amounts are annual pay divided by 12 and 24. Overtime, bonuses and unpaid leave are not modelled.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
