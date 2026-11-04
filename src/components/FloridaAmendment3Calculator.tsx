import { useMemo, useState } from "react";
import { computeFlAmendment3, type FlAmendment3Input } from "../lib/florida-amendment-3";
import { fmtUSD } from "../lib/format";
import { Field, MoneyInput, NumInput, Stat, S } from "./calc-ui";

// Florida Amendment 3 island (X-trends pass 2026-10-19). Extra homestead exemption x the owner's non-school millage.
// Rules and sources live in src/lib/florida-amendment-3.ts.

interface Props {
  initialData?: Partial<FlAmendment3Input>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: FlAmendment3Input = { mills: 10.5, assessedValue: 400000, residentBy2027: true };

// Yes/No toggle styles (tool-usage pass 2026-11-04, row F1). Local so the shared calc-ui stays untouched.
const T: Record<string, React.CSSProperties> = {
  row: { display: "flex", gap: 8 },
  btn: { flex: 1, minHeight: 40, padding: "8px 12px", fontSize: "0.95rem", border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", color: "#1A1A1A", cursor: "pointer" },
  on: { background: "#EAF7F1", borderColor: "#0E7C66", color: "#0E7C66", fontWeight: 700 },
};
const APPRAISERS = "https://floridarevenue.com/property/Pages/LocalOfficials.aspx";

export default function FloridaAmendment3Calculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<FlAmendment3Input>({ ...DEFAULTS, ...initialData });
  const r = useMemo(() => computeFlAmendment3(v), [v]);
  const set = (p: Partial<FlAmendment3Input>) => setV((s) => ({ ...s, ...p }));

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
          <Field label="Assessed value of your homestead"><MoneyInput value={v.assessedValue} onChange={(x) => set({ assessedValue: x })} /></Field>
          <Field label="Your non-school millage (mills, from your TRIM notice)"><NumInput value={v.mills} onChange={(x) => set({ mills: x })} /></Field>
          <p style={S.hint}>
            Mills are dollars of tax per $1,000 of taxable value. 10.5 is the statewide average for non-school levies. Use the county, city and district lines on your tax bill, not the school line.
          </p>
          <Field label="Florida resident with homestead on Dec 31, 2026?">
            <div style={T.row} role="group" aria-label="Florida resident with homestead on Dec 31, 2026?">
              <button type="button" aria-pressed={v.residentBy2027 !== false} style={{ ...T.btn, ...(v.residentBy2027 !== false ? T.on : {}) }} onClick={() => set({ residentBy2027: true })}>Yes</button>
              <button type="button" aria-pressed={v.residentBy2027 === false} style={{ ...T.btn, ...(v.residentBy2027 === false ? T.on : {}) }} onClick={() => set({ residentBy2027: false })}>No</button>
            </div>
          </Field>
        </div>

        <div style={S.results}>
          {r == null ? (
            <div style={S.bigStat}><span style={S.bigLabel}>Enter a home value above $0</span></div>
          ) : (
            <>
              <div style={S.bigStat}>
                <span style={S.bigLabel}>Yearly savings once fully phased in (2028)</span>
                <span style={S.bigValue}>{fmtUSD(r.savings2028)}</span>
                <span style={S.bigSub}>{fmtUSD(r.savings2027)} in 2027 (approved by voters Nov 3, 2026)</span>
              </div>
              <div style={S.statRow}>
                <Stat label="Non-school bill today" value={fmtUSD(r.billNow)} />
                <Stat label="Bill in 2027" value={fmtUSD(r.bill2027)} />
                <Stat label="Bill in 2028" value={fmtUSD(r.bill2028)} />
              </div>
              <div style={S.statRow}>
                <Stat label="Extra value exempt, 2027" value={fmtUSD(r.extraExempt2027)} />
                <Stat label="Extra value exempt, 2028" value={fmtUSD(r.extraExempt2028)} />
              </div>
              {v.mills === 0 && (
                <p style={S.hint}>Enter your non-school millage from your TRIM notice to see dollar savings. 10.5 is the statewide average.</p>
              )}
              {v.residentBy2027 === false && (
                <div style={{ ...S.aprBox, ...S.aprWarn }}>
                  <span style={S.aprNote}>
                    The larger exemption phases in for people who become Florida residents after Jan 1, 2027. Newcomers may not get the full increase right away, so the 2027 and 2028 bills above keep today's exemption. Check with your <a href={APPRAISERS} target="_blank" rel="noopener noreferrer">county property appraiser</a> for when it starts for you.
                  </span>
                </div>
              )}
              {r.capped && (
                <div style={{ ...S.aprBox, ...S.aprWarn }}>
                  <span style={S.aprNote}>Your assessed value is below the $250,000 exemption, so the exemption cannot remove more than your home's value. The savings above already reflect that.</span>
                </div>
              )}
              <div style={S.disclaimer}>
                Estimate only. School taxes are not changed by the amendment and are left out. Based on the current $51,411 non-school exemption (less for homes assessed under $76,411: the first $25,000, plus value from $50,000 to $76,411) versus $150,000 (2027) and $250,000 (2028), as published by <a href="https://floridataxwatch.org/research/florida-property-tax-resource-center/" target="_blank" rel="noopener noreferrer">Florida TaxWatch</a>. Your county's actual millage and any later local changes decide your real bill. Not tax advice.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
