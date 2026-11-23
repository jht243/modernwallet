import { useMemo, useState } from "react";
import { computeRule78, FEDERAL_ACTUARIAL_TERM_MONTHS, MAX_APR_PCT, MAX_TERM_MONTHS, type Rule78Input } from "../lib/rule-of-78";
import { fmtUSD } from "../lib/format";
import { Field, MoneyInput, NumInput, PctInput, Stat, S, PRIMARY } from "./calc-ui";

// Rule of 78 island (trend-lane-c pass 2026-11-23). Shows how the Rule of 78 credits a precomputed loan's interest
// by sum of the digits and what an early payoff refunds versus the actuarial method. Logic: src/lib/rule-of-78.ts.

interface Props {
  initialData?: Partial<Rule78Input>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: Rule78Input = { amount: 15000, aprPct: 7, termMonths: 48, payoffAfter: 12 };
const STATUTE_URL = "https://www.govinfo.gov/content/pkg/USCODE-2024-title15/html/USCODE-2024-title15-chap41-subchapI-partA-sec1615.htm";

const T: Record<string, React.CSSProperties> = {
  barRow: { display: "grid", gridTemplateColumns: "minmax(88px, 110px) 1fr auto", alignItems: "center", gap: 8, fontSize: "0.8rem", color: "#444" },
  barTrack: { background: "#EEF3F1", borderRadius: 4, height: 14, overflow: "hidden" },
  tableWrap: { maxHeight: 260, overflow: "auto", border: "1px solid #E0EBE7", borderRadius: 8, background: "#fff" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", fontVariantNumeric: "tabular-nums" },
  th: { position: "sticky", top: 0, background: "#F4FAF8", textAlign: "left", padding: "6px 8px", fontWeight: 600, color: "#2A6A58", borderBottom: "1px solid #D8EEE6" },
  td: { padding: "5px 8px", borderBottom: "1px solid #F0F4F2" },
  right: { textAlign: "right" },
  payoffRow: { background: "#EAF7F1", fontWeight: 700 },
  after: { color: "#9aa5a1" },
};

export default function Rule78Calculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<Rule78Input>({ ...DEFAULTS, ...initialData });
  const r = useMemo(() => computeRule78(v), [v]);
  const set = (p: Partial<Rule78Input>) => setV((s) => ({ ...s, ...p }));
  const over = v.termMonths > FEDERAL_ACTUARIAL_TERM_MONTHS;
  const maxRefund = r ? Math.max(r.rule78Refund, r.actuarialRefund, 0.01) : 1;

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
          <Field label="Loan amount"><MoneyInput value={v.amount} onChange={(x) => set({ amount: x })} /></Field>
          <div style={S.twoCol}>
            <Field label="APR (annual percentage rate)"><PctInput value={v.aprPct} onChange={(x) => set({ aprPct: Math.min(MAX_APR_PCT, x) })} label="APR" /></Field>
            <Field label="Term in months"><NumInput value={v.termMonths} onChange={(x) => set({ termMonths: Math.min(MAX_TERM_MONTHS, Math.round(x)) })} /></Field>
          </div>
          <Field label="Paid off after payment number"><NumInput value={v.payoffAfter} onChange={(x) => set({ payoffAfter: Math.round(x) })} /></Field>
          <p style={S.hint}>
            Copy the amount, APR and term from the loan contract. The figures above are placeholders. Enter the number of scheduled payments you will have made when you pay the loan off, from 1 up to the term.
          </p>
        </div>

        <div style={S.results}>
          {r == null ? (
            <div style={S.bigStat}>
              <span style={S.bigLabel}>Check your entries</span>
              <span style={S.bigSub}>Enter an amount, an APR from 0% to {MAX_APR_PCT}%, a term from 1 to {MAX_TERM_MONTHS} months, and a payoff payment number from 1 up to the term.</span>
            </div>
          ) : (
            <>
              <div style={S.bigStat}>
                <span style={S.bigLabel}>Extra interest the Rule of 78 keeps</span>
                <span style={S.bigValue}>{fmtUSD(r.difference, { cents: true })}</span>
                <span style={S.bigSub}>
                  Paid off after payment {r.payoffAfter} of {r.termMonths}, on a {fmtUSD(r.payment, { cents: true })} monthly payment
                </span>
              </div>
              <div style={S.statRow}>
                <Stat label="Rule of 78 refund" value={fmtUSD(r.rule78Refund, { cents: true })} />
                <Stat label="Actuarial refund" value={fmtUSD(r.actuarialRefund, { cents: true })} />
              </div>
              <div style={S.statRow}>
                <Stat label="Interest earned, Rule of 78" value={fmtUSD(r.rule78Earned, { cents: true })} />
                <Stat label="Interest earned, actuarial" value={fmtUSD(r.actuarialEarned, { cents: true })} />
              </div>
              <div role="img" aria-label={`Refund of unearned interest: Rule of 78 ${fmtUSD(r.rule78Refund, { cents: true })}, actuarial ${fmtUSD(r.actuarialRefund, { cents: true })}`} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={T.barRow}>
                  <span>Rule of 78</span>
                  <div style={T.barTrack}><div style={{ width: `${(r.rule78Refund / maxRefund) * 100}%`, height: "100%", background: "#C98A1B" }} /></div>
                  <span>{fmtUSD(r.rule78Refund, { cents: true })}</span>
                </div>
                <div style={T.barRow}>
                  <span>Actuarial</span>
                  <div style={T.barTrack}><div style={{ width: `${(r.actuarialRefund / maxRefund) * 100}%`, height: "100%", background: PRIMARY }} /></div>
                  <span>{fmtUSD(r.actuarialRefund, { cents: true })}</span>
                </div>
              </div>
              {over && (
                <div style={{ ...S.aprBox, ...S.aprWarn }} role="note">
                  <span style={S.aprLabel}>Term over {FEDERAL_ACTUARIAL_TERM_MONTHS} months</span>
                  <span style={S.aprNote}>
                    This result is a formula illustration. For a precomputed consumer loan with a term over {FEDERAL_ACTUARIAL_TERM_MONTHS} months, <a href={STATUTE_URL} target="_blank" rel="noopener noreferrer">15 U.S.C. 1615(b)</a> requires a refund at least as favorable to you as the actuarial method, so the Rule of 78 refund shown here would not apply to that loan.
                  </span>
                </div>
              )}
              <div style={S.disclaimer}>
                Assumes a fixed-rate precomputed loan with level monthly payments, whole months and no fees. Your contract and state law decide the refund you receive, so ask your lender for a payoff statement.
              </div>
            </>
          )}
        </div>
      </div>

      {r != null && (
        <div style={{ marginTop: 18 }}>
          <div style={{ ...S.label, marginBottom: 6 }}>Interest credited each month, Rule of 78 vs actuarial</div>
          <div style={T.tableWrap} tabIndex={0} aria-label="Month-by-month interest allocation">
            <table style={T.table}>
              <caption style={{ position: "absolute", left: -9999 }}>Interest credited to each month under the Rule of 78 and under the actuarial method</caption>
              <thead>
                <tr>
                  <th style={T.th} scope="col">Month</th>
                  <th style={{ ...T.th, ...T.right }} scope="col">Rule of 78 interest</th>
                  <th style={{ ...T.th, ...T.right }} scope="col">Actuarial interest</th>
                </tr>
              </thead>
              <tbody>
                {r.schedule.map((row) => {
                  const isPayoff = row.month === r.payoffAfter;
                  const later = row.month > r.payoffAfter;
                  return (
                    <tr key={row.month} style={isPayoff ? T.payoffRow : later ? T.after : undefined}>
                      <td style={T.td}>{row.month}{isPayoff ? " (payoff)" : ""}</td>
                      <td style={{ ...T.td, ...T.right }}>{fmtUSD(row.rule78Interest, { cents: true })}</td>
                      <td style={{ ...T.td, ...T.right }}>{fmtUSD(row.actuarialInterest, { cents: true })}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
