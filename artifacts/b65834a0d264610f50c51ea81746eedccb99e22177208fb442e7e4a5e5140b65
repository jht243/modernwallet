import { useMemo, useState } from "react";
import { computeCarryover, LOSS_LIMIT, type CarryoverInput, type LossStatus } from "../lib/capital-loss-carryover";
import { fmtUSD } from "../lib/format";
import { Field, MoneyInput, Stat, S } from "./calc-ui";
import CopyResultButton from "./CopyResultButton";

// Capital loss carryover island (tool-usage pass 2026-11-25). This year's short-term and long-term gains and losses, any carryover from
// earlier years and the filing status give the deduction against other income, the carryforward and a year-by-year schedule
// (IRS Topic 409; Publication 550, Worksheet 4-1).

interface Props {
  initialData?: Partial<CarryoverInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: CarryoverInput = { status: "single", stGains: 0, stLosses: 30000, ltGains: 0, ltLosses: 20000, priorSt: 0, priorLt: 0, futureGain: 0 };

const TOPIC_409 = "https://www.irs.gov/taxtopics/tc409";
const PUB_550 = "https://www.irs.gov/publications/p550";
const SHOW_ROWS = 40;

const STATUS_LABEL: Record<LossStatus, string> = {
  single: "Single, head of household or qualifying surviving spouse",
  mfj: "Married filing jointly",
  mfs: "Married filing separately",
};

const usd = (n: number) => fmtUSD(n);

export default function CapitalLossCarryoverCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<CarryoverInput>({ ...DEFAULTS, ...initialData });
  const r = useMemo(() => computeCarryover(v), [v]);
  const set = (p: Partial<CarryoverInput>) => setV((s) => ({ ...s, ...p }));

  const hasInput = v.stGains + v.stLosses + v.ltGains + v.ltLosses + v.priorSt + v.priorLt > 0;
  const rows = r.schedule.slice(0, SHOW_ROWS);
  const hidden = r.schedule.length - rows.length;

  const sub = !hasInput
    ? "Enter your gains and losses for the year."
    : !r.isNetLoss
      ? `Your gains are at least as large as your losses, so there is no loss to deduct or carry forward${r.netThisYear > 0 ? ` and ${usd(r.netThisYear)} of net gain is taxable` : ""}.`
      : `Net loss of ${usd(-r.netThisYear)} this year. The limit is ${usd(r.limit)} a year, so ${usd(r.carryTotal)} carries forward.`;

  const yearsText = r.yearsOfDeductions === 0 ? "" : `${r.yearsOfDeductions} tax year${r.yearsOfDeductions === 1 ? "" : "s"}`;

  const summary = [
    "Capital loss carryover estimate",
    `Net result this year: ${r.netThisYear < 0 ? "-" : ""}${usd(Math.abs(r.netThisYear))}`,
    `Deduction against other income this year: ${usd(r.deductionThisYear)} (limit ${usd(r.limit)})`,
    `Carried forward: ${usd(r.carryTotal)} (short-term ${usd(r.carrySt)}, long-term ${usd(r.carryLt)})`,
    yearsText ? `Years of deductions: ${yearsText}; final-year deduction ${usd(r.lastYearDeduction)}` : "",
    "themodernwallet.com/capital-loss-carryover-calculator/",
  ].filter(Boolean).join("\n");

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
            <select style={S.input} value={v.status} onChange={(e) => set({ status: e.target.value as LossStatus })} aria-label="Filing status">
              {(Object.keys(STATUS_LABEL) as LossStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </select>
          </Field>
          <div style={S.twoCol}>
            <Field label="Short-term gains"><MoneyInput value={v.stGains} onChange={(x) => set({ stGains: x })} /></Field>
            <Field label="Short-term losses"><MoneyInput value={v.stLosses} onChange={(x) => set({ stLosses: x })} /></Field>
            <Field label="Long-term gains"><MoneyInput value={v.ltGains} onChange={(x) => set({ ltGains: x })} /></Field>
            <Field label="Long-term losses"><MoneyInput value={v.ltLosses} onChange={(x) => set({ ltLosses: x })} /></Field>
          </div>
          <p style={S.hint}>Totals for the year from Form 8949 or your broker's 1099-B, each as a positive amount. Short-term means held one year or less. The figures above are placeholders.</p>
          <div style={S.twoCol}>
            <Field label="Short-term carryover from earlier years"><MoneyInput value={v.priorSt} onChange={(x) => set({ priorSt: x })} /></Field>
            <Field label="Long-term carryover from earlier years"><MoneyInput value={v.priorLt} onChange={(x) => set({ priorLt: x })} /></Field>
          </div>
          <p style={S.hint}>Find these on last year's Capital Loss Carryover Worksheet (Publication 550, Worksheet 4-1). Leave at 0 if you had none.</p>
          <Field label="Net long-term gain you expect in each later year (optional)"><MoneyInput value={v.futureGain} onChange={(x) => set({ futureGain: x })} /></Field>
          <p style={S.hint}>Later gains use up the carryover before any deduction against other income, so entering one shortens the schedule.</p>
        </div>

        <div style={S.results} className="mw-out">
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Deductible against other income this year</span>
            <span style={S.bigValue}>{usd(r.deductionThisYear)}</span>
            <span style={S.bigSub}>{sub}</span>
          </div>
          <div style={S.statRow}>
            <Stat label="Carries to next year" value={usd(r.carryTotal)} />
            <Stat label="Years of deductions" value={r.yearsOfDeductions ? String(r.yearsOfDeductions) : "None"} />
          </div>
          {r.carryTotal > 0 && (
            <div style={S.statRow}>
              <Stat label="Short-term carryover" value={usd(r.carrySt)} />
              <Stat label="Long-term carryover" value={usd(r.carryLt)} />
            </div>
          )}
          {r.yearsOfDeductions > 1 && (
            <div style={S.aprBox}>
              <span style={S.aprNote}>
                {v.futureGain > 0
                  ? `With ${usd(v.futureGain)} of net long-term gain each later year, the loss is used over ${yearsText}, ending with a ${usd(r.lastYearDeduction)} deduction.`
                  : `With no later gains, the loss is deducted over ${yearsText}: ${usd(r.limit)} a year, ending with ${usd(r.lastYearDeduction)} in the last year.`}
              </span>
            </div>
          )}
          {r.schedule.length > 1 || r.deductionThisYear > 0 ? (
            <div style={{ overflowX: "auto", maxHeight: 360, overflowY: "auto" }}>
              <table style={T.table}>
                <caption style={T.caption}>Year-by-year schedule (year 1 is this tax year)</caption>
                <thead>
                  <tr>
                    <th style={T.th} scope="col">Year</th>
                    <th style={{ ...T.th, ...T.right }} scope="col">Net result</th>
                    <th style={{ ...T.th, ...T.right }} scope="col">Deduction</th>
                    <th style={{ ...T.th, ...T.right }} scope="col">Carries forward</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.year}>
                      <td style={T.td}>{row.year}</td>
                      <td style={{ ...T.td, ...T.right }}>{row.net < 0 ? "-" : ""}{usd(Math.abs(row.net))}</td>
                      <td style={{ ...T.td, ...T.right }}>{usd(row.deduction)}</td>
                      <td style={{ ...T.td, ...T.right }}>{usd(row.carryTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {hidden > 0 && <p style={S.hint}>{hidden} more year{hidden === 1 ? "" : "s"} follow at {usd(r.limit)} a year{r.unusedAfterMax > 0 ? `; ${usd(r.unusedAfterMax)} would still be unused at the end of this table` : ""}.</p>}
            </div>
          ) : null}
          <div style={S.disclaimer}>
            Estimate following <a href={TOPIC_409} target="_blank" rel="noopener noreferrer">IRS Topic no. 409</a> and <a href={PUB_550} target="_blank" rel="noopener noreferrer">Publication 550</a>: losses offset gains first, then up to {usd(LOSS_LIMIT[v.status])} a year offsets other income, and short-term losses are used first. It assumes your taxable income covers the deduction every year (a low-income year carries more forward), counts later gains as long-term, and leaves out wash-sale disallowed losses, the alternative minimum tax and state rules. Your Schedule D worksheet is the exact figure. Confirm unusual situations with a tax professional.
          </div>
          {r.isNetLoss && <CopyResultButton text={summary} />}
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
};
