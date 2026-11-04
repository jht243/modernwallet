import { useMemo, useState } from "react";
import { computeInflation, type InflationInput } from "../lib/inflation";
import { fmtUSD, fmtNum, fmtPct } from "../lib/format";
import { Field, MoneyInput, NumInput, PctInput, Stat, S } from "./calc-ui";
import ToolPicks, { book } from "./ToolPicks";

// Inflation island. Takes an amount, a number of years and an assumed inflation rate, and shows what the
// same purchase costs later and what the amount buys later. The rate is the reader's input, not a forecast.

interface Props {
  initialData?: Partial<InflationInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: InflationInput = { amount: 10000, years: 10, inflationPct: 3, nominalReturnPct: 0 };

// Tool-usage pass 2026-11-04 (rows F2, M2): rate chips, year-by-year table and further reading.
const RATE_CHIPS: { pct: number; label: string }[] = [
  { pct: 2, label: "2% (Fed target)" },
  { pct: 3, label: "3%" },
  { pct: 4, label: "4%" },
];
const MAX_TABLE_YEARS = 100;
const L: Record<string, React.CSSProperties> = {
  chips: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: { minHeight: 36, padding: "6px 12px", fontSize: "0.85rem", border: "1px solid #D0DAD6", borderRadius: 999, background: "#fff", color: "#1A1A1A", cursor: "pointer" },
  chipOn: { background: "#EAF7F1", borderColor: "#0E7C66", color: "#0E7C66", fontWeight: 700 },
  btnRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  btn: { minHeight: 36, padding: "6px 12px", fontSize: "0.85rem", border: "1px solid #0E7C66", borderRadius: 8, background: "#fff", color: "#0E7C66", fontWeight: 600, cursor: "pointer" },
  tableWrap: { overflowX: "auto", WebkitOverflowScrolling: "touch", border: "1px solid #E0EBE7", borderRadius: 8, background: "#fff" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", fontVariantNumeric: "tabular-nums" },
  th: { textAlign: "right", padding: "6px 8px", borderBottom: "1px solid #E0EBE7", color: "#444", fontWeight: 600, whiteSpace: "nowrap" },
  td: { textAlign: "right", padding: "5px 8px", borderBottom: "1px solid #F0F4F2", whiteSpace: "nowrap" },
};

export default function InflationCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<InflationInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => computeInflation(input), [input]);
  const [showTable, setShowTable] = useState(false);
  const [copied, setCopied] = useState<"" | "ok" | "fail">("");
  const set = (patch: Partial<InflationInput>) => {
    setCopied("");
    setInput((s) => ({ ...s, ...patch }));
  };

  // Year-by-year rows reuse the engine's own formula (amount x (1 + rate)^t) for each whole year t.
  const wholeYears = Math.min(Math.floor(Math.max(input.years, 0)), MAX_TABLE_YEARS);
  const rows = useMemo(
    () => Array.from({ length: wholeYears }, (_, k) => ({ year: k + 1, ...computeInflation({ ...input, years: k + 1 }) })),
    [input, wholeYears],
  );
  const hasResult = input.amount > 0 && input.years > 0;
  const copyTable = async () => {
    const header = ["Year", "Future cost", "Buying power (today's dollars)", "Balance at the return"].join("\t");
    const body = rows.map((row) => [row.year, row.futureCost.toFixed(2), row.purchasingPower.toFixed(2), row.nominalEnding.toFixed(2)].join("\t"));
    try {
      await navigator.clipboard.writeText([header, ...body].join("\n"));
      setCopied("ok");
    } catch {
      setCopied("fail");
    }
  };

  // Further-reading tier (persona table, row M2).
  const picks =
    input.nominalReturnPct <= 0
      ? [
          book("bogleheads", "How to move idle cash into low-cost index funds that can outpace the inflation rate you entered."),
          book("moneyLast", "How to make savings last while prices rise."),
        ]
      : result.realReturnPct < 0
        ? [
            book("fourPillars", "Why the return you entered loses to inflation, and how asset allocation changes the real return."),
            book("bogleheads", "A low-cost investing plan aimed at returns above inflation."),
          ]
        : input.years >= 10
          ? [
              book("pfauGuidebook", "Turning this future-cost number into a retirement-income plan that handles inflation risk."),
              book("moneyLast", "How to make savings last while prices rise."),
            ]
          : [
              book("fourPillars", "Keeping a short-horizon plan ahead of prices without taking on more risk than needed."),
              book("pfauGuidebook", "How inflation risk fits into a wider plan for your savings."),
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
          <Field label="Amount in today's dollars"><MoneyInput value={input.amount} onChange={(v) => set({ amount: v })} /></Field>
          <div style={S.twoCol}>
            <Field label="Years"><NumInput value={input.years} onChange={(v) => set({ years: v })} /></Field>
            <Field label="Average annual inflation"><PctInput value={input.inflationPct} onChange={(v) => set({ inflationPct: v })} /></Field>
          </div>
          <div style={L.chips} role="group" aria-label="Inflation rate presets">
            {RATE_CHIPS.map((c) => (
              <button key={c.pct} type="button" aria-pressed={input.inflationPct === c.pct} style={{ ...L.chip, ...(input.inflationPct === c.pct ? L.chipOn : {}) }} onClick={() => set({ inflationPct: c.pct })}>
                {c.label}
              </button>
            ))}
          </div>
          <p style={S.hint}>
            2% is the <a href="https://www.federalreserve.gov/faqs/economy_14400.htm" target="_blank" rel="noopener noreferrer">Federal Reserve's long-run inflation target</a>. For the latest 12-month price change, see the <a href="https://www.bls.gov/cpi/" target="_blank" rel="noopener noreferrer">BLS Consumer Price Index</a>. Rates below 0% (deflation) are not supported. A minus sign is ignored.
          </p>
          <Field label="Annual return on the money (optional)"><PctInput value={input.nominalReturnPct} onChange={(v) => set({ nominalReturnPct: v })} /></Field>
          <p style={S.hint}>
            The 3% inflation rate above is a placeholder, not a forecast. Enter the rate you want to test. Leave the return at 0 to see money held as cash.
          </p>
        </div>

        <div style={S.results}>
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
          {wholeYears >= 1 && (
            <div style={L.btnRow}>
              <button type="button" style={L.btn} aria-expanded={showTable} onClick={() => setShowTable((x) => !x)}>
                {showTable ? "Hide year-by-year" : "Show year-by-year"}
              </button>
              {showTable && (
                <button type="button" style={L.btn} onClick={copyTable}>
                  {copied === "ok" ? "Copied" : copied === "fail" ? "Copy failed, select the table instead" : "Copy table"}
                </button>
              )}
            </div>
          )}
          {showTable && wholeYears >= 1 && (
            <div style={L.tableWrap}>
              <table style={L.table}>
                <thead>
                  <tr>
                    <th style={L.th} scope="col">Year</th>
                    <th style={L.th} scope="col">Future cost</th>
                    <th style={L.th} scope="col">Buying power, today's dollars</th>
                    <th style={L.th} scope="col">Balance at the return</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.year}>
                      <td style={L.td}>{row.year}</td>
                      <td style={L.td}>{fmtUSD(row.futureCost)}</td>
                      <td style={L.td}>{fmtUSD(row.purchasingPower)}</td>
                      <td style={L.td}>{fmtUSD(row.nominalEnding)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {hasResult && (
            <ToolPicks tool="inflation-calculator" heading="Further reading on beating inflation" picks={picks} />
          )}
        </div>
      </div>
    </div>
  );
}
