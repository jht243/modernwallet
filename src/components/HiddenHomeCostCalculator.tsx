import { useMemo, useState } from "react";
import { computeHiddenCosts, DEFAULT_GROWTH_PCT, NATIONAL_TYPICAL, NATIONAL_TYPICAL_TOTAL, type HocInput } from "../lib/home-ownership-costs";
import { fmtUSD } from "../lib/format";
import { Field, MoneyInput, NumInput, PctInput, Stat, S } from "./calc-ui";

// Hidden cost of owning a home island (X-trends pass 2026-10-29). Maintenance + property tax + insurance (+ HOA)
// on top of the mortgage payment. Defaults are the Zillow and Thumbtack 2026 typical-homeowner figures.

interface Props {
  initialData?: Partial<HocInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: HocInput = {
  maintenance: NATIONAL_TYPICAL.maintenance,
  propertyTax: NATIONAL_TYPICAL.propertyTax,
  insurance: NATIONAL_TYPICAL.insurance,
  hoaMonthly: 0,
  mortgageMonthly: 0,
  homeValue: 0,
  growthPct: DEFAULT_GROWTH_PCT,
  years: 5,
};

export default function HiddenHomeCostCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<HocInput>({ ...DEFAULTS, ...initialData });
  const set = (p: Partial<HocInput>) => setV((s) => ({ ...s, ...p }));
  const r = useMemo(() => computeHiddenCosts(v), [v]);
  const last = r.schedule[r.schedule.length - 1];

  const gap = r.vsNationalAnnual;
  const verdict =
    r.annual <= 0 ? "Enter your yearly maintenance, property tax and insurance."
    : Math.abs(gap) < 1 ? "Your maintenance, tax and insurance total matches the typical U.S. homeowner."
    : gap > 0 ? `Your maintenance, tax and insurance run ${fmtUSD(gap)} a year above the typical U.S. homeowner.`
    : `Your maintenance, tax and insurance run ${fmtUSD(-gap)} a year below the typical U.S. homeowner.`;

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
          <Field label="Maintenance and repairs per year"><MoneyInput value={v.maintenance} onChange={(x) => set({ maintenance: x })} /></Field>
          <Field label="Property taxes per year"><MoneyInput value={v.propertyTax} onChange={(x) => set({ propertyTax: x })} /></Field>
          <Field label="Homeowners insurance per year"><MoneyInput value={v.insurance} onChange={(x) => set({ insurance: x })} /></Field>
          <Field label="HOA dues per month (0 if none)"><MoneyInput value={v.hoaMonthly} onChange={(x) => set({ hoaMonthly: x })} /></Field>
          <Field label="Mortgage principal and interest per month (optional)"><MoneyInput value={v.mortgageMonthly} onChange={(x) => set({ mortgageMonthly: x })} /></Field>
          <Field label="Home value (optional)"><MoneyInput value={v.homeValue} onChange={(x) => set({ homeValue: x })} /></Field>
          <Field label="Yearly growth in these costs"><PctInput value={v.growthPct} onChange={(x) => set({ growthPct: x })} label="Yearly growth in these costs" /></Field>
          <Field label="Years to project"><NumInput value={v.years} onChange={(x) => set({ years: x })} /></Field>
          <p style={S.hint}>The first three figures start at the typical U.S. homeowner: {fmtUSD(NATIONAL_TYPICAL.maintenance)} maintenance, {fmtUSD(NATIONAL_TYPICAL.propertyTax)} property taxes and {fmtUSD(NATIONAL_TYPICAL.insurance)} insurance, {fmtUSD(NATIONAL_TYPICAL_TOTAL)} in all. Replace them with your own numbers.</p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Cost of owning on top of the mortgage, per month</span>
            <span style={S.bigValue}>{fmtUSD(r.monthly)}</span>
            <span style={S.bigSub}>{verdict}</span>
          </div>
          <div style={S.statRow}>
            <Stat label="Per year" value={fmtUSD(r.annual)} />
            <Stat label="Set aside for maintenance, per month" value={fmtUSD(r.maintenanceMonthly)} />
          </div>
          <div style={S.statRow}>
            <Stat label={`Total over ${r.schedule.length} year${r.schedule.length === 1 ? "" : "s"}`} value={fmtUSD(r.cumulative)} />
            <Stat label={`Year ${last.year} at ${v.growthPct}% growth`} value={fmtUSD(last.total)} />
          </div>
          {(r.allInMonthly !== null || r.pctOfValue !== null) && (
            <div style={S.statRow}>
              {r.allInMonthly !== null && <Stat label="Mortgage plus these costs, per month" value={fmtUSD(r.allInMonthly)} />}
              {r.pctOfValue !== null && <Stat label="Share of home value, per year" value={`${r.pctOfValue.toFixed(1)}%`} />}
            </div>
          )}
          <p style={S.hint}>
            Maintenance {Math.round(r.share.maintenance * 100)}%, property taxes {Math.round(r.share.propertyTax * 100)}%, insurance {Math.round(r.share.insurance * 100)}%{r.hoaAnnual > 0 ? `, HOA ${Math.round(r.share.hoa * 100)}%` : ""} of the yearly total.
          </p>
          <div style={S.disclaimer}>
            Estimate only. The starting figures are national typical amounts reported from the 2026 Zillow and Thumbtack study, not a quote for any house. Utilities, furnishings, remodeling you choose to do, mortgage insurance and income-tax effects of owning are not included.
          </div>
        </div>
      </div>
    </div>
  );
}
