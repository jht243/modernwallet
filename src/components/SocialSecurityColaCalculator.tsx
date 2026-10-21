import { useMemo, useState } from "react";
import { computeCola, colaChart, COLA_2027_PCT, PART_B_2026_STANDARD, PART_B_2027_PROJECTED, type ColaInput } from "../lib/social-security-cola";
import ToolPicks, { book } from "./ToolPicks";
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
  // Deposit mode: the reader knows what lands in the bank, not the benefit before Medicare. The benefit is
  // rebuilt as deposit + the 2026 Part B premium taken out, then the COLA math runs unchanged.
  const [depositMode, setDepositMode] = useState(false);
  const [dep, setDep] = useState({ deposit: 0, premium2026: PART_B_2026_STANDARD });
  const rebuilt = Math.round((dep.deposit + dep.premium2026) * 100) / 100;
  const effective = depositMode ? { ...input, currentBenefit: dep.deposit > 0 ? rebuilt : 0 } : input;
  const r = computeCola(effective);
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
          <label style={C.check}>
            <input type="checkbox" style={C.checkBox} checked={depositMode} onChange={(e) => setDepositMode(e.target.checked)} />
            <span>I only know my monthly deposit</span>
          </label>
          {depositMode ? (
            <>
              <Field label="Your 2026 monthly deposit"><MoneyInput value={dep.deposit} onChange={(v) => setDep((s) => ({ ...s, deposit: v }))} /></Field>
              <Field label="2026 Part B premium taken out"><MoneyInput value={dep.premium2026} onChange={(v) => setDep((s) => ({ ...s, premium2026: v }))} /></Field>
              <p style={S.hint}>Starts at the 2026 standard premium, $202.90. Change it if yours differs, or enter 0 if no Medicare premium comes out of your check.{dep.deposit > 0 ? ` Your benefit before Medicare is about ${fmtUSD(rebuilt, { cents: true })} (within $1, because SSA rounds the payment down to the dollar).` : ""}</p>
            </>
          ) : (
            <>
              <Field label="Your monthly Social Security benefit now"><MoneyInput value={input.currentBenefit} onChange={(v) => set({ currentBenefit: v })} /></Field>
              <p style={S.hint}>Use the benefit amount before any Medicare deduction, from your 2026 COLA notice or your <a href="https://www.ssa.gov/myaccount/" target="_blank" rel="noopener">my Social Security account</a>.</p>
            </>
          )}
          <Field label="Medicare Part B premium deducted in 2027 (optional)"><MoneyInput value={input.partBPremium} onChange={(v) => set({ partBPremium: v })} /></Field>
          <p style={S.hint}>The 2027 Part B premium has not been announced. Leave at 0 to see the gross raise, or enter the premium from your notice once it posts in late November.</p>
          <button type="button" style={C.btn} onClick={() => set({ partBPremium: PART_B_2027_PROJECTED })}>Use the projected {fmtUSD(PART_B_2027_PROJECTED, { cents: true })}</button>
          <p style={S.hint}>2026 Medicare Trustees Report projection. CMS sets the final 2027 premium in the fall.</p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Estimated 2027 monthly benefit</span>
            <span style={S.bigValue}>{fmtUSD(r.newBenefit, { cents: true })}</span>
            <span style={S.bigSub}>
              {effective.currentBenefit > 0
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
          {r.newBenefit > 0 && (
            <ToolPicks
              tool="social-security-cola-calculator"
              heading="Further reading on your Social Security check"
              picks={r.hasPartB || depositMode
                ? [
                    book("medicareGetWhatsYours", "Explains the Part B premium that comes out of the raise, and the surcharges above it."),
                    book("ssMadeSimple", "How your benefit, the COLA and spousal and survivor rules work."),
                    book("moneyLast", "Turning the new monthly amount and your savings into a budget that lasts."),
                  ]
                : [
                    book("ssMadeSimple", "How your benefit, the COLA and spousal and survivor rules work."),
                    book("getWhatsYours", "Checks you're collecting every benefit you're owed."),
                    book("moneyLast", "Turning the new monthly amount and your savings into a budget that lasts."),
                  ]}
            />
          )}
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

const C: Record<string, React.CSSProperties> = {
  check: { display: "flex", alignItems: "center", gap: 10, fontSize: "0.88rem", color: "#333", cursor: "pointer", minHeight: 32 },
  checkBox: { width: 20, height: 20, margin: 0, flexShrink: 0 },
  btn: { alignSelf: "flex-start", padding: "8px 12px", minHeight: 36, border: "1px solid #0E7C66", background: "#fff", color: "#0E7C66", borderRadius: 8, fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" },
};

const T: Record<string, React.CSSProperties> = {
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", fontVariantNumeric: "tabular-nums", marginTop: 8 },
  th: { textAlign: "left", padding: "6px 4px", borderBottom: "1px solid #DCE6E2", color: "#555", fontWeight: 600 },
  td: { padding: "6px 4px", borderBottom: "1px solid #EEF3F1" },
  right: { textAlign: "right" },
};
