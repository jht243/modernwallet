import { useMemo, useState } from "react";
import { computeGarnishment, type GarnishmentInput, type PayFrequency } from "../lib/student-loan-garnishment";
import { fmtUSD } from "../lib/format";
import { Field, MoneyInput, Stat, S } from "./calc-ui";

// Student loan wage garnishment island (X-trends pass 2026-10-20). 15% of disposable pay, refund offset, Social Security offset.
// Rules and sources live in src/lib/student-loan-garnishment.ts.

interface Props {
  initialData?: Partial<GarnishmentInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: GarnishmentInput = { disposablePay: 2000, frequency: "biweekly", taxRefund: 3000, ssBenefit: 0, balance: 30000 };

export default function StudentLoanGarnishmentCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<GarnishmentInput>({ ...DEFAULTS, ...initialData });
  const r = useMemo(() => computeGarnishment(v), [v]);
  const set = (p: Partial<GarnishmentInput>) => setV((s) => ({ ...s, ...p }));

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
          <Field label="Defaulted federal student loan balance"><MoneyInput value={v.balance} onChange={(x) => set({ balance: x })} /></Field>
          <Field label="Disposable pay per paycheck (after taxes and other required deductions)"><MoneyInput value={v.disposablePay} onChange={(x) => set({ disposablePay: x })} /></Field>
          <Field label="How often you are paid">
            <select
              value={v.frequency}
              onChange={(e) => set({ frequency: e.target.value as PayFrequency })}
              style={{ width: "100%", padding: "10px 12px", fontSize: 16, borderRadius: 8, border: "1px solid #cbd5d1" }}
            >
              <option value="weekly">Weekly</option>
              <option value="biweekly">Every two weeks</option>
              <option value="semimonthly">Twice a month</option>
              <option value="monthly">Monthly</option>
            </select>
          </Field>
          <Field label="Expected federal tax refund this year"><MoneyInput value={v.taxRefund} onChange={(x) => set({ taxRefund: x })} /></Field>
          <Field label="Monthly Social Security benefit (leave 0 if none)"><MoneyInput value={v.ssBenefit} onChange={(x) => set({ ssBenefit: x })} /></Field>
          <p style={S.hint}>
            Disposable pay is what is left of your paycheck after legally required withholdings such as income and payroll taxes. Voluntary deductions like 401(k) contributions or health premiums are not subtracted.
          </p>
        </div>

        <div style={S.results}>
          {r == null ? (
            <div style={S.bigStat}><span style={S.bigLabel}>Enter a balance above $0</span></div>
          ) : (
            <>
              <div style={S.bigStat}>
                <span style={S.bigLabel}>Most a wage garnishment could take per paycheck</span>
                <span style={S.bigValue}>{fmtUSD(r.perPaycheck, { cents: true })}</span>
                <span style={S.bigSub}>{fmtUSD(r.perMonth)} a month, {fmtUSD(r.perYear)} a year</span>
              </div>
              <div style={S.statRow}>
                <Stat label="Tax refund that could be taken" value={fmtUSD(r.refundTaken)} />
                <Stat label="Social Security offset per month" value={fmtUSD(r.ssPerMonth)} />
              </div>
              <div style={S.statRow}>
                <Stat label="Total exposure, first 12 months" value={fmtUSD(r.firstYearTotal)} />
                <Stat label="Months of garnishment to clear the balance" value={r.monthsToClear == null ? "n/a" : String(Math.ceil(r.monthsToClear))} />
              </div>
              <div style={S.disclaimer}>
                Estimate only. Wage garnishment is capped at 15% of disposable pay (<a href="https://www.law.cornell.edu/uscode/text/20/1095a" target="_blank" rel="noopener noreferrer">20 U.S.C. 1095a</a>). A Social Security offset takes the lesser of 15% of the benefit or the amount above $750 a month (<a href="https://www.law.cornell.edu/cfr/text/31/285.4" target="_blank" rel="noopener noreferrer">31 CFR 285.4</a>). Interest, collection costs, other garnishments and hardship hearings are not modelled, and the Education Department has not announced when collections will expand. Not legal advice.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
