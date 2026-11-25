import { useMemo, useState } from "react";
import { computeSepSolo, wholeDollars, LIMITS, type SepSoloInput, type PlanYear, type AgeBand } from "../lib/sep-solo-401k";
import { fmtUSD } from "../lib/format";
import { Field, MoneyInput, Stat, S } from "./calc-ui";
import CopyResultButton from "./CopyResultButton";

// SEP IRA and solo 401(k) contribution island (tool-usage pass 2026-11-25). Net self-employment profit, plan year,
// age band and other-plan deferrals produce both plans' maximum contribution side by side (IRS Pub 560 reduced-rate
// method; limits from IRS Notice 2026-66 and IR-2026-136).

interface Props {
  initialData?: Partial<SepSoloInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: SepSoloInput = { netProfit: 100000, year: 2027, age: "under50", otherDeferrals: 0 };

const PUB_560 = "https://www.irs.gov/publications/p560";
const NOTICE_2026_66 = "https://www.irs.gov/pub/irs-drop/n-26-66.pdf";

const AGE_LABEL: Record<AgeBand, string> = {
  under50: "Under 50",
  "50plus": "50 or older (not 60 to 63)",
  "60to63": "60, 61, 62 or 63",
};

const usd = (v: number) => fmtUSD(wholeDollars(v));

export default function SepSolo401kCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<SepSoloInput>({ ...DEFAULTS, ...initialData });
  const r = useMemo(() => computeSepSolo(v), [v]);
  const set = (p: Partial<SepSoloInput>) => setV((s) => ({ ...s, ...p }));
  const lim = LIMITS[v.year];

  const summary = [
    `SEP IRA and solo 401(k) maximums, tax year ${v.year}`,
    `Net self-employment profit: ${usd(v.netProfit)}`,
    `SEP IRA maximum: ${usd(r.sepMax)}`,
    `Solo 401(k) maximum: ${usd(r.soloMax)} (employee ${usd(r.employeeDeferral)} + employer ${usd(r.employer)})`,
    r.catchUp > 0 ? `Solo 401(k) with catch-up: ${usd(r.soloMaxWithCatchUp)}` : "",
    "Estimate based on IRS Publication 560 and the tax-year limits above. themodernwallet.com/sep-ira-solo-401k-contribution-calculator/",
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
          <Field label="Net self-employment profit for the year (Schedule C)"><MoneyInput value={v.netProfit} onChange={(x) => set({ netProfit: x })} /></Field>
          <p style={S.hint}>Business income minus business expenses, before the deduction for half of self-employment tax. The figure above is a placeholder.</p>
          <Field label="Tax year">
            <select style={S.input} value={v.year} onChange={(e) => set({ year: Number(e.target.value) as PlanYear })} aria-label="Tax year">
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
            </select>
          </Field>
          <Field label="Your age during the year">
            <select style={S.input} value={v.age} onChange={(e) => set({ age: e.target.value as AgeBand })} aria-label="Age band">
              {(Object.keys(AGE_LABEL) as AgeBand[]).map((a) => <option key={a} value={a}>{AGE_LABEL[a]}</option>)}
            </select>
          </Field>
          <Field label="Deferrals already made to another 401(k) or 403(b) this year (optional)"><MoneyInput value={v.otherDeferrals} onChange={(x) => set({ otherDeferrals: x })} /></Field>
          <p style={S.hint}>The employee deferral limit ({fmtUSD(lim.deferralLimit)} for {v.year}) is shared across every plan you defer into, so a day job's 401(k) uses it up first.</p>
        </div>

        <div style={S.results} className="mw-out">
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Solo 401(k) maximum, {v.year}</span>
            <span style={S.bigValue}>{usd(r.soloMax)}</span>
            <span style={S.bigSub}>
              {r.flags.noEarnings
                ? "Enter your net self-employment profit to see both maximums."
                : r.catchUp > 0
                  ? `Plus ${usd(r.catchUp)} catch-up, for ${usd(r.soloMaxWithCatchUp)} in total.`
                  : `Employee deferral ${usd(r.employeeDeferral)} plus employer share ${usd(r.employer)}.`}
            </span>
          </div>
          <div style={S.statRow}>
            <Stat label="SEP IRA maximum" value={usd(r.sepMax)} />
            <Stat label="Solo 401(k) allows more by" value={usd(r.soloAdvantage)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Self-employment tax" value={usd(r.seTax)} />
            <Stat label="Earnings the plans use" value={usd(r.netEarnings)} />
          </div>
          {r.flags.employerCapped && (
            <div style={{ ...S.aprBox, ...S.aprWarn }}>
              <span style={S.aprNote}>The 20% employer share reaches the {v.year} annual limit of {fmtUSD(lim.annualAdditionsLimit)}, so a SEP IRA and a solo 401(k) allow the same employer amount here.</span>
            </div>
          )}
          {r.flags.compensationCapped && !r.flags.employerCapped && (
            <div style={{ ...S.aprBox, ...S.aprWarn }}>
              <span style={S.aprNote}>Plans count earnings only up to {fmtUSD(lim.compensationLimit)} for {v.year}; the rest is ignored.</span>
            </div>
          )}
          {r.flags.deferralReducedByOtherPlans && (
            <div style={{ ...S.aprBox, ...S.aprWarn }}>
              <span style={S.aprNote}>Your other plan's deferrals cut the room for an employee deferral here. A SEP IRA is not limited by them.</span>
            </div>
          )}
          {r.flags.deferralLimitedByEarnings && !r.flags.noEarnings && (
            <div style={{ ...S.aprBox, ...S.aprWarn }}>
              <span style={S.aprNote}>At this profit the solo 401(k) deferral is limited by your earnings, so the plan total equals your net earnings.</span>
            </div>
          )}
          {r.flags.belowSeFloor && (
            <div style={S.aprBox}>
              <span style={S.aprNote}>Net earnings under $400 owe no self-employment tax, so no half-tax deduction is taken.</span>
            </div>
          )}
          <div style={S.disclaimer}>
            Estimate for a sole proprietor or single-member LLC with no employees, following <a href={PUB_560} target="_blank" rel="noopener noreferrer">IRS Publication 560</a> and the {v.year} limits in <a href={NOTICE_2026_66} target="_blank" rel="noopener noreferrer">IRS Notice 2026-66</a> and the IRS limit announcements. A SEP IRA must cover eligible employees, and your plan document can set lower limits. Confirm unusual situations with a tax professional.
          </div>
          {!r.flags.noEarnings && <CopyResultButton text={summary} />}
        </div>
      </div>
    </div>
  );
}
