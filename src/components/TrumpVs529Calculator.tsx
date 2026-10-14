import { useMemo, useState } from "react";
import { computeTrumpVs529, type TrumpVs529Input } from "../lib/trump-vs-529";
import { fmtUSD } from "../lib/format";
import { Field, MoneyInput, NumInput, PctInput, Stat, S } from "./calc-ui";

// Trump Account vs 529 island (tool-usage pass 2026-10-14). Same yearly money, same return; value at 18 in
// each account and what is left after tax, for college or for anything else. Rules live in src/lib/trump-vs-529.ts.

interface Props {
  initialData?: Partial<TrumpVs529Input>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: TrumpVs529Input = { childAge: 0, yearlyContribution: 2400, returnPct: 7, seedEligible: true, taxRatePct: 12, forCollege: true };

export default function TrumpVs529Calculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<TrumpVs529Input>({ ...DEFAULTS, ...initialData });
  const r = useMemo(() => computeTrumpVs529(v), [v]);
  const set = (p: Partial<TrumpVs529Input>) => setV((s) => ({ ...s, ...p }));
  const winner = r == null ? null : r.difference > 0.5 ? "529 plan" : r.difference < -0.5 ? "Trump Account" : null;

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
          <div style={S.twoCol}>
            <Field label="Child's age now"><NumInput value={v.childAge} onChange={(x) => set({ childAge: Math.min(17, x) })} /></Field>
            <Field label="Expected annual return"><PctInput value={v.returnPct} onChange={(x) => set({ returnPct: x })} /></Field>
          </div>
          <Field label="Yearly family contribution"><MoneyInput value={v.yearlyContribution} onChange={(x) => set({ yearlyContribution: x })} /></Field>
          <Field label="Tax rate on the withdrawal (usually the child's rate at 18)"><PctInput value={v.taxRatePct} onChange={(x) => set({ taxRatePct: x })} /></Field>
          <label style={S.field}>
            <span style={S.label}>What the money pays for</span>
            <select style={S.input} value={v.forCollege ? "college" : "other"} onChange={(e) => set({ forCollege: e.target.value === "college" })} aria-label="What the money pays for">
              <option value="college">College (qualified education costs)</option>
              <option value="other">Something else, cashed out at 18</option>
            </select>
          </label>
          <label style={{ ...S.field, flexDirection: "row", alignItems: "center", gap: 10, minHeight: 32 }}>
            <input type="checkbox" checked={v.seedEligible} onChange={(e) => set({ seedEligible: e.target.checked })} style={{ width: 20, height: 20, margin: 0 }} />
            <span style={S.label}>Eligible for the $1,000 federal seed (U.S. citizen born 2025 to 2028)</span>
          </label>
          <p style={S.hint}>
            The return is a placeholder, not a forecast. A Trump Account takes at most $5,000 a year from family and employers combined; a 529 has no federal yearly limit.
          </p>
        </div>

        <div style={S.results}>
          {r == null ? (
            <div style={S.bigStat}><span style={S.bigLabel}>The child must be under 18</span></div>
          ) : (
            <>
              <div style={S.bigStat}>
                <span style={S.bigLabel}>{winner ? `The ${winner} leaves more` : "They leave about the same"}</span>
                <span style={S.bigValue}>{fmtUSD(Math.abs(r.difference))}</span>
                <span style={S.bigSub}>more after tax at 18, {v.forCollege ? "spent on college" : "cashed out for another use"}</span>
              </div>
              <div style={S.statRow}>
                <Stat label="Trump Account after tax" value={fmtUSD(r.trump.afterTax)} />
                <Stat label="529 plan after tax" value={fmtUSD(r.plan529.afterTax)} />
              </div>
              <div style={S.statRow}>
                <Stat label="Trump Account at 18" value={fmtUSD(r.trump.valueAt18)} />
                <Stat label="529 plan at 18" value={fmtUSD(r.plan529.valueAt18)} />
              </div>
              <div style={S.statRow}>
                <Stat label="Trump Account tax" value={fmtUSD(r.trump.tax + r.trump.additionalTax)} />
                <Stat label="529 plan tax" value={fmtUSD(r.plan529.tax + r.plan529.additionalTax)} />
              </div>
              <div style={{ ...S.aprBox, ...S.aprOk }}>
                <span style={S.aprLabel}>How the tax is figured</span>
                <span style={S.aprNote}>
                  Trump Account: your {fmtUSD(r.trump.contributions)} of contributions come out untaxed; the {r.trump.seed > 0 ? `${fmtUSD(r.trump.seed)} seed and the ` : ""}growth are taxed at {v.taxRatePct}%{v.forCollege ? " (college costs avoid the 10% additional tax)" : ", plus a 10% additional tax before age 59½"}.
                  {" "}529 plan: {v.forCollege ? "no tax when spent on qualified education." : `the ${fmtUSD(r.plan529.earnings)} of earnings is taxed at ${v.taxRatePct}% plus a 10% additional tax.`}
                </span>
              </div>
              {r.capped && (
                <div style={{ ...S.aprBox, ...S.aprWarn }}>
                  <span style={S.aprNote}>The Trump Account is capped at $5,000 a year, so it gets {fmtUSD(r.trumpYearly)} a year here while the 529 gets the full {fmtUSD(v.yearlyContribution)}.</span>
                </div>
              )}
              <div style={S.disclaimer}>
                Estimate only. One fixed return, compounded monthly, with contributions spread evenly through each year. Rules from <a href="https://www.irs.gov/trumpaccounts" target="_blank" rel="noopener noreferrer">IRS Trump Accounts</a> and <a href="https://www.irs.gov/publications/p970" target="_blank" rel="noopener noreferrer">IRS Publication 970</a>. State tax breaks on 529 contributions are not included.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
