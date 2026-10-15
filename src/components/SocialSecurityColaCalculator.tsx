import { useMemo, useState } from "react";
import { computeCola, colaChart, COLA_2027_PCT, type ColaInput } from "../lib/social-security-cola";
import { fmtUSD } from "../lib/format";
import { Field, MoneyInput, Stat, S } from "./calc-ui";

// Social Security COLA island. The reader enters the monthly benefit they get now; the engine applies
// the 3.6% 2027 COLA with SSA's rounding (down to the dime, then the payment down to the dollar after
// any Medicare Part B deduction) and shows a before/after chart across common benefit levels.

interface Props {
  initialData?: Partial<ColaInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: ColaInput = { currentBenefit: 2000, partBPremium: 0 };

export default function SocialSecurityColaCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<ColaInput>({ ...DEFAULTS, ...initialData });
  const r = useMemo(() => computeCola(input), [input]);
  const chart = useMemo(() => colaChart(), []);
  const set = (patch: Partial<ColaInput>) => setInput((s) => ({ ...s, ...patch }));

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
          <Field label="Your monthly Social Security benefit now"><MoneyInput value={input.currentBenefit} onChange={(v) => set({ currentBenefit: v })} /></Field>
          <p style={S.hint}>Use the benefit amount before any Medicare deduction, from your 2026 COLA notice or your <a href="https://www.ssa.gov/myaccount/" target="_blank" rel="noopener">my Social Security account</a>.</p>
          <Field label="Medicare Part B premium deducted in 2027 (optional)"><MoneyInput value={input.partBPremium} onChange={(v) => set({ partBPremium: v })} /></Field>
          <p style={S.hint}>The 2027 Part B premium has not been announced. Leave at 0 to see the gross raise, or enter the premium from your notice once it posts in late November.</p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Estimated 2027 monthly benefit</span>
            <span style={S.bigValue}>{fmtUSD(r.newBenefit, { cents: true })}</span>
            <span style={S.bigSub}>
              {input.currentBenefit > 0
                ? `After the ${COLA_2027_PCT}% COLA, starting with the January 2027 payment.`
                : "Enter your current monthly benefit to see your 2027 amount."}
            </span>
          </div>
          <div style={S.statRow}>
            <Stat label="Monthly increase" value={fmtUSD(r.monthlyIncrease, { cents: true })} />
            <Stat label="Increase over 12 months" value={fmtUSD(r.yearlyIncrease, { cents: true })} />
          </div>
          {r.hasPartB && (
            <div style={S.statRow}>
              <Stat label="Payment after Part B" value={fmtUSD(r.netPayment)} />
              <Stat label="Part B deducted" value={fmtUSD(input.partBPremium, { cents: true })} />
            </div>
          )}
          <div style={S.disclaimer}>
            Estimate only. Applies the {COLA_2027_PCT}% COLA to the amount you enter, rounds the benefit down to the dime, and rounds the payment down to the dollar after any Part B premium. SSA applies the COLA to your primary insurance amount, so an early-claim or family benefit can differ by cents. Your COLA notice is the exact figure.
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={S.heading}>2027 COLA increase chart</div>
        <p style={S.hint}>Gross monthly benefit before and after the {COLA_2027_PCT}% COLA, before any Medicare deduction.</p>
        <table style={T.table}>
          <thead>
            <tr>
              <th style={T.th}>Benefit now</th>
              <th style={{ ...T.th, ...T.right }}>2027 benefit</th>
              <th style={{ ...T.th, ...T.right }}>Monthly increase</th>
            </tr>
          </thead>
          <tbody>
            {chart.map((row) => (
              <tr key={row.current}>
                <td style={T.td}>{fmtUSD(row.current)}</td>
                <td style={{ ...T.td, ...T.right }}>{fmtUSD(row.newBenefit, { cents: true })}</td>
                <td style={{ ...T.td, ...T.right }}>{fmtUSD(row.monthlyIncrease, { cents: true })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const T: Record<string, React.CSSProperties> = {
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", fontVariantNumeric: "tabular-nums", marginTop: 8 },
  th: { textAlign: "left", padding: "6px 4px", borderBottom: "1px solid #DCE6E2", color: "#555", fontWeight: 600 },
  td: { padding: "6px 4px", borderBottom: "1px solid #EEF3F1" },
  right: { textAlign: "right" },
};
