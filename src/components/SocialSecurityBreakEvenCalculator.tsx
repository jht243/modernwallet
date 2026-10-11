import { useMemo, useState } from "react";
import { computeBreakEven, type BreakEvenInput, EARLIEST_CLAIM_AGE, LATEST_CREDIT_AGE } from "../lib/social-security-break-even";
import { fmtUSD, fmtPct } from "../lib/format";
import { Field, MoneyInput, NumInput, PctInput, Stat, S } from "./calc-ui";

// Social Security break-even island. The reader enters the monthly benefit at full retirement age from
// their SSA statement; the engine applies SSA's early-claim reduction and delayed retirement credits to
// two claiming ages and finds the age where the later claim's lifetime total catches up.

interface Props {
  initialData?: Partial<BreakEvenInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: BreakEvenInput = { benefitAtFra: 2000, birthYear: 1962, claimAgeA: 62, claimAgeB: 67, colaPct: 0 };
const AGES = Array.from({ length: LATEST_CREDIT_AGE - EARLIEST_CLAIM_AGE + 1 }, (_, i) => EARLIEST_CLAIM_AGE + i);

export default function SocialSecurityBreakEvenCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<BreakEvenInput>({ ...DEFAULTS, ...initialData });
  const r = useMemo(() => computeBreakEven(input), [input]);
  const set = (patch: Partial<BreakEvenInput>) => setInput((s) => ({ ...s, ...patch }));

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
          <Field label="Monthly benefit at full retirement age"><MoneyInput value={input.benefitAtFra} onChange={(v) => set({ benefitAtFra: v })} /></Field>
          <p style={S.hint}>Use the full-retirement-age amount on your Social Security statement in your <a href="https://www.ssa.gov/myaccount/" target="_blank" rel="noopener">my Social Security account</a>.</p>
          <Field label="Year you were born"><NumInput value={input.birthYear} onChange={(v) => set({ birthYear: v })} /></Field>
          <div style={S.twoCol}>
            <Field label="Claim at age (earlier)">
              <select style={S.input} value={input.claimAgeA} onChange={(e) => set({ claimAgeA: Number(e.target.value) })}>
                {AGES.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </Field>
            <Field label="Or claim at age (later)">
              <select style={S.input} value={input.claimAgeB} onChange={(e) => set({ claimAgeB: Number(e.target.value) })}>
                {AGES.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Yearly cost-of-living increase (optional)"><PctInput value={input.colaPct} onChange={(v) => set({ colaPct: v })} /></Field>
          <p style={S.hint}>Leave at 0 to compare in today's dollars. A COLA raises both claims by the same percentage, so it moves the totals more than the break-even age.</p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Break-even age</span>
            <span style={S.bigValue}>{r.breakEvenLabel}</span>
            <span style={S.bigSub}>
              {r.a.age === r.b.age
                ? "Pick two different claiming ages to compare."
                : r.breakEvenMonths == null
                  ? "Enter your monthly benefit at full retirement age to see when the later claim catches up."
                  : `Claiming at ${r.b.age} instead of ${r.a.age} pays more in total if you live past this age.`}
            </span>
          </div>
          <div style={S.statRow}>
            <Stat label={`Monthly at ${r.a.age}`} value={fmtUSD(r.a.monthly)} />
            <Stat label={`Monthly at ${r.b.age}`} value={fmtUSD(r.b.monthly)} />
          </div>
          <div style={S.statRow}>
            <Stat label={`Share of full benefit at ${r.a.age}`} value={fmtPct(r.a.pctOfFra, 1)} />
            <Stat label={`Share of full benefit at ${r.b.age}`} value={fmtPct(r.b.pctOfFra, 1)} />
          </div>
          <div style={S.hint}>Your full retirement age: {r.fraLabel}.</div>
          {r.milestones.length > 0 && r.a.age !== r.b.age && (
            <table style={T.table}>
              <thead>
                <tr><th style={T.th}>Total received by age</th><th style={{ ...T.th, ...T.right }}>Claim at {r.a.age}</th><th style={{ ...T.th, ...T.right }}>Claim at {r.b.age}</th></tr>
              </thead>
              <tbody>
                {r.milestones.map((m) => (
                  <tr key={m.age}>
                    <td style={T.td}>{m.age}</td>
                    <td style={{ ...T.td, ...T.right, fontWeight: m.totalA >= m.totalB ? 700 : 400 }}>{fmtUSD(m.totalA)}</td>
                    <td style={{ ...T.td, ...T.right, fontWeight: m.totalB > m.totalA ? 700 : 400 }}>{fmtUSD(m.totalB)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div style={S.disclaimer}>
            Estimate only. Uses SSA's reduction of 5/9 of 1% a month for the first 36 months before full retirement age and 5/12 of 1% for each month beyond, and delayed credits of 2/3 of 1% a month up to age 70. It does not model the earnings test, taxes, or spousal and survivor benefits.
          </div>
        </div>
      </div>
    </div>
  );
}

const T: Record<string, React.CSSProperties> = {
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", fontVariantNumeric: "tabular-nums" },
  th: { textAlign: "left", padding: "6px 4px", borderBottom: "1px solid #DCE6E2", color: "#555", fontWeight: 600 },
  td: { padding: "6px 4px", borderBottom: "1px solid #EEF3F1" },
  right: { textAlign: "right" },
};
