import { useMemo, useState } from "react";
import { computeInflation, type InflationInput } from "../lib/inflation";
import { fmtUSD, fmtNum, fmtPct } from "../lib/format";
import { Field, MoneyInput, NumInput, PctInput, Stat, S, PRIMARY } from "./calc-ui";
import { CPI_U_ANNUAL, CPI_FIRST_YEAR, CPI_LAST_FULL_YEAR, CPI_LATEST, CPI_SOURCE_URL, pastToToday } from "../lib/cpi-u";
import ToolPicks, { book } from "./ToolPicks";

// Inflation island. Takes an amount, a number of years and an assumed inflation rate, and shows what the
// same purchase costs later and what the amount buys later. The rate is the reader's input, not a forecast.
// Tool-usage pass 2026-10-28: an additive "From a past year" mode restates a past amount in today's dollars with
// BLS CPI-U (src/lib/cpi-u.ts). The forward mode above stays the default and is unchanged.

interface Props {
  initialData?: Partial<InflationInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: InflationInput = { amount: 10000, years: 10, inflationPct: 3, nominalReturnPct: 0 };

export default function InflationCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<InflationInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => computeInflation(input), [input]);
  const set = (patch: Partial<InflationInput>) => setInput((s) => ({ ...s, ...patch }));
  const [mode, setMode] = useState<"forward" | "past">("forward");
  const [pastAmount, setPastAmount] = useState(10000);
  const [pastYear, setPastYear] = useState(2010);
  const past = useMemo(() => pastToToday(pastAmount, pastYear), [pastAmount, pastYear]);
  const years: number[] = [];
  for (let y = CPI_LAST_FULL_YEAR; y >= CPI_FIRST_YEAR; y--) years.push(y);

  const picks =
    mode === "past"
      ? [
          book("littleBook", "Index funds are the usual way to earn more than inflation over long periods."),
          book("ymoyl", "A plan for spending less as prices keep rising."),
        ]
      : result.realReturnPct <= 0
        ? [
            book("littleBook", "How a low-cost index fund can earn a return above inflation."),
            book("fourPillars", "Building a stock and bond mix, including inflation-protected bonds, that keeps up."),
            book("ymoyl", "Making each dollar go further while prices rise."),
          ]
        : [
            book("fourPillars", "Keeping an inflation-beating mix of stocks and bonds balanced."),
            book("littleBook", "The low-cost index logic behind a return above inflation."),
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
          <div style={T.toggleRow} role="group" aria-label="Calculator mode">
            <button type="button" style={{ ...T.toggleBtn, ...(mode === "forward" ? T.toggleBtnActive : {}) }} aria-pressed={mode === "forward"} onClick={() => setMode("forward")}>
              Future cost
            </button>
            <button type="button" style={{ ...T.toggleBtn, ...(mode === "past" ? T.toggleBtnActive : {}) }} aria-pressed={mode === "past"} onClick={() => setMode("past")}>
              From a past year
            </button>
          </div>
          {mode === "past" ? (
            <>
              <Field label="Amount in that year's dollars"><MoneyInput value={pastAmount} onChange={setPastAmount} /></Field>
              <label style={S.field}>
                <span style={S.label}>Year</span>
                <select style={S.input} value={pastYear} onChange={(e) => setPastYear(Number(e.target.value))}>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </label>
              <p style={S.hint}>
                Uses the Bureau of Labor Statistics consumer price index (CPI-U, U.S. city average) for each year from {CPI_FIRST_YEAR} to {CPI_LAST_FULL_YEAR}, compared with {CPI_LATEST.label}, the latest month in our data.
              </p>
            </>
          ) : (
            <>
          <Field label="Amount in today's dollars"><MoneyInput value={input.amount} onChange={(v) => set({ amount: v })} /></Field>
          <div style={S.twoCol}>
            <Field label="Years"><NumInput value={input.years} onChange={(v) => set({ years: v })} /></Field>
            <Field label="Average annual inflation"><PctInput value={input.inflationPct} onChange={(v) => set({ inflationPct: v })} /></Field>
          </div>
          <Field label="Annual return on the money (optional)"><PctInput value={input.nominalReturnPct} onChange={(v) => set({ nominalReturnPct: v })} /></Field>
          <p style={S.hint}>
            The {fmtPct(input.inflationPct, 1)} inflation rate above is an assumption, not a forecast. Enter the rate you want to test. Leave the return at 0 to see money held as cash.
          </p>
            </>
          )}
        </div>

        <div style={S.results}>
          {mode === "past" ? (
            past == null ? (
              <div style={S.bigStat}><span style={S.bigSub}>Pick a year from {CPI_FIRST_YEAR} to {CPI_LAST_FULL_YEAR}.</span></div>
            ) : (
              <>
                <div style={S.bigStat}>
                  <span style={S.bigLabel}>{fmtUSD(pastAmount)} in {pastYear} is worth</span>
                  <span style={S.bigValue}>{fmtUSD(past.todayValue)}</span>
                  <span style={S.bigSub}>in {CPI_LATEST.label} dollars (BLS CPI-U)</span>
                </div>
                <div style={S.statRow}>
                  <Stat label={`Prices since ${pastYear}`} value={`+${fmtPct(past.cumulativePct, 1)}`} />
                  <Stat label="Average inflation per year" value={past.avgYearlyPct == null ? "—" : fmtPct(past.avgYearlyPct, 2)} />
                </div>
                <div style={S.statRow}>
                  <Stat label={`CPI-U, ${pastYear} average`} value={fmtNum(CPI_U_ANNUAL[pastYear], 1)} />
                  <Stat label={`CPI-U, ${CPI_LATEST.label}`} value={fmtNum(CPI_LATEST.value, 1)} />
                </div>
                <p style={S.hint}>
                  Comparing an old salary with today&apos;s pay? The <a href="/salary-inflation-calculator/" style={{ color: PRIMARY }}>salary inflation calculator</a> shows whether your raises kept up.
                </p>
                <div style={S.disclaimer}>
                  Estimate only. Uses the national average price change for all items; your own costs may have risen faster or slower. Index values from the <a href={CPI_SOURCE_URL} target="_blank" rel="noopener" style={{ color: "inherit" }}>Bureau of Labor Statistics</a>, series CUUR0000SA0. Arithmetic, not advice.
                </div>
              </>
            )
          ) : (
            <>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Cost later of what {fmtUSD(input.amount)} buys today</span>
            <span style={S.bigValue}>{fmtUSD(result.futureCost)}</span>
            <span style={S.bigSub}>after {fmtNum(input.years, 1)} years at {fmtPct(input.inflationPct, 1)} a year</span>
          </div>
          <div style={S.statRow}>
            <Stat label={`What ${fmtUSD(input.amount)} buys then, in today's dollars`} value={fmtUSD(result.purchasingPower)} />
            <Stat label="Buying power lost" value={fmtPct(result.powerLostPct, 1)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Years for buying power to halve" value={result.yearsToHalve == null ? "—" : fmtNum(result.yearsToHalve, 1)} />
            <Stat label="Real return after inflation" value={fmtPct(result.realReturnPct, 2)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Ending balance at the return" value={fmtUSD(result.nominalEnding)} />
            <Stat label="That balance in today's dollars" value={fmtUSD(result.realEnding)} />
          </div>
          <div style={S.disclaimer}>
            Estimate only. Assumes one steady inflation rate every year, while real inflation changes from year to year and differs by what you buy. For measured price changes, see the Bureau of Labor Statistics CPI data. Arithmetic, not a forecast or advice.
          </div>
            </>
          )}
          <ToolPicks tool="inflation-calculator" heading="Further reading on protecting your money from inflation" picks={picks} />
        </div>
      </div>
    </div>
  );
}

const T: Record<string, React.CSSProperties> = {
  toggleRow: { display: "flex", gap: 8 },
  toggleBtn: { flex: 1, padding: "9px 10px", fontSize: "0.85rem", fontWeight: 600, border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", color: "#444", cursor: "pointer", minHeight: 40 },
  toggleBtnActive: { background: PRIMARY, borderColor: PRIMARY, color: "#fff" },
};
