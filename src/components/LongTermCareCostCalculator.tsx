import { useMemo, useState } from "react";
import { projectLTCCost, type CareType } from "../lib/long-term-care-cost";
import { fmtUSD } from "../lib/format";
import { STATES } from "../data/states";

interface Props {
  initialData?: Record<string, unknown>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS = {
  careType: "assisted-living" as CareType,
  state: "florida",
  currentAge: 62,
  yearsUntilCare: 15,
  expectedYearsOfCare: 4,
  monthlySocialSecurity: 2_400,
  monthlyPension: 800,
  hasLTCInsurance: false,
  ltcInsuranceDailyBenefit: 0,
  otherLiquidAssets: 400_000,
};

export default function LongTermCareCostCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState({
    careType: (initialData?.careType as CareType) ?? DEFAULTS.careType,
    state: (initialData?.state as string) ?? DEFAULTS.state,
    currentAge: n(initialData?.currentAge, DEFAULTS.currentAge),
    yearsUntilCare: n(initialData?.yearsUntilCare, DEFAULTS.yearsUntilCare),
    expectedYearsOfCare: n(initialData?.expectedYearsOfCare, DEFAULTS.expectedYearsOfCare),
    monthlySocialSecurity: n(initialData?.monthlySocialSecurity, DEFAULTS.monthlySocialSecurity),
    monthlyPension: n(initialData?.monthlyPension, DEFAULTS.monthlyPension),
    hasLTCInsurance: Boolean(initialData?.hasLTCInsurance ?? DEFAULTS.hasLTCInsurance),
    ltcInsuranceDailyBenefit: n(initialData?.ltcInsuranceDailyBenefit, DEFAULTS.ltcInsuranceDailyBenefit),
    otherLiquidAssets: n(initialData?.otherLiquidAssets, DEFAULTS.otherLiquidAssets),
  });
  const r = useMemo(() => projectLTCCost(v), [v]);
  const set = (p: Partial<typeof v>) => setV((s) => ({ ...s, ...p }));

  const startAge = v.currentAge + v.yearsUntilCare;
  const likelihoodColor = r.medicaidLikelihood === "high" ? "#8A2A2A" : r.medicaidLikelihood === "medium" ? "#8A6A00" : "#0E7C66";

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
          <Field label="Type of care">
            <select style={S.input} value={v.careType} onChange={(e) => set({ careType: e.target.value as CareType })}>
              <option value="nursing-private">Nursing home — private room</option>
              <option value="nursing-semi-private">Nursing home — semi-private</option>
              <option value="assisted-living">Assisted living</option>
              <option value="home-health-aide">Home health aide (44 hr/wk)</option>
              <option value="adult-day-care">Adult day care</option>
            </select>
          </Field>
          <Field label="State">
            <select style={S.input} value={v.state} onChange={(e) => set({ state: e.target.value })}>
              {STATES.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
            </select>
          </Field>
          <div style={S.row2}>
            <Field label="Current age"><input style={S.input} type="number" min={30} max={100} value={v.currentAge} onChange={(e) => set({ currentAge: parseInt(e.target.value) || 0 })} /></Field>
            <Field label="Years until care starts"><input style={S.input} type="number" min={0} max={50} value={v.yearsUntilCare} onChange={(e) => set({ yearsUntilCare: parseInt(e.target.value) || 0 })} /></Field>
          </div>
          <Field label="Expected years of care"><input style={S.input} type="number" min={0} max={20} value={v.expectedYearsOfCare} onChange={(e) => set({ expectedYearsOfCare: parseInt(e.target.value) || 0 })} /></Field>

          <div style={S.sectionLabel}>Retirement income</div>
          <div style={S.row2}>
            <Field label="Monthly Social Security"><Money v={v.monthlySocialSecurity} on={(x) => set({ monthlySocialSecurity: x })} /></Field>
            <Field label="Monthly pension"><Money v={v.monthlyPension} on={(x) => set({ monthlyPension: x })} /></Field>
          </div>

          <Field label="Liquid assets available for care"><Money v={v.otherLiquidAssets} on={(x) => set({ otherLiquidAssets: x })} /></Field>

          <label style={S.checkboxRow}>
            <input type="checkbox" checked={v.hasLTCInsurance} onChange={(e) => set({ hasLTCInsurance: e.target.checked })} />
            <span>I have long-term care insurance</span>
          </label>
          {v.hasLTCInsurance && (
            <Field label="LTC insurance daily benefit"><Money v={v.ltcInsuranceDailyBenefit} on={(x) => set({ ltcInsuranceDailyBenefit: x })} /></Field>
          )}
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Projected total cost of care</span>
            <span style={S.bigValue}>{fmtUSD(r.totalLifetimeCost)}</span>
            <span style={S.bigSub}>{v.expectedYearsOfCare}-year care starting at age {startAge} in {v.state.replace(/-/g, " ")}</span>
          </div>

          <div style={S.stack}>
            <Row label="Cost today (annual)" value={fmtUSD(r.annualCostToday)} />
            <Row label={`Cost at start age ${startAge} (annual, 4.5% inflation)`} value={fmtUSD(r.annualCostAtStart)} />
            <Row label="Monthly cost at care start" value={fmtUSD(Math.round(r.annualCostAtStart / 12))} />
          </div>

          <div style={S.stack}>
            <Row label="Monthly income available" value={fmtUSD(r.monthlyIncomeAvailable)} />
            {v.hasLTCInsurance && <Row label="Monthly LTC insurance benefit" value={fmtUSD(r.monthlyLTCInsuranceBenefit)} />}
            <Row label="Monthly SHORTFALL" value={fmtUSD(r.monthlyShortfall)} negative={r.monthlyShortfall > 0} />
            <Row label="Total shortfall over care period" value={fmtUSD(r.totalShortfall)} negative={r.totalShortfall > 0} />
          </div>

          <div style={{ ...S.likelihood, borderColor: likelihoodColor }}>
            <div style={{ ...S.likelihoodLabel, color: likelihoodColor }}>Medicaid likelihood: {r.medicaidLikelihood.toUpperCase()}</div>
            <div style={S.likelihoodBody}>Your ${fmtUSD(v.otherLiquidAssets)} in liquid assets covers ~{r.yearsOfAssetsCoverage} years of the shortfall.</div>
          </div>

          <div style={S.reasonBox}>
            <div style={S.reasonLabel}>What this means for your plan</div>
            <p style={S.reason}>{r.reasoning}</p>
          </div>

          <div style={S.reasonBox}>
            <div style={S.reasonLabel}>Medicare coverage (what it will NOT cover)</div>
            <p style={S.reason}>{r.medicareCoverageNote}</p>
          </div>

          <div style={S.note}>
            Estimates use 2024 Genworth Cost of Care survey medians inflated to 2026 at 4.5%/year and projected forward with the same rate. Actual costs vary widely by county and facility — Genworth's own state median is a starting point, not an offer. Long-term care insurance premiums have risen sharply since 2018; obtain quotes before assuming coverage.
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, negative }: { label: string; value: string; negative?: boolean }) {
  return (
    <div style={S.row}>
      <span style={S.rowLabel}>{label}</span>
      <span style={{ ...S.rowValue, color: negative ? "#8A2A2A" : "#1A1A1A" }}>{value}</span>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label style={S.field}><span style={S.label}>{label}</span>{children}</label>;
}
function Money({ v, on }: { v: number; on: (n: number) => void }) {
  return (
    <div style={S.suffixWrap}>
      <span style={S.prefix}>$</span>
      <input style={{ ...S.input, paddingLeft: 22 }} inputMode="numeric" value={v === 0 ? "" : v.toLocaleString("en-US")} placeholder="0" onChange={(e) => on(parse(e.target.value))} />
    </div>
  );
}
function parse(s: string): number { if (s === "") return 0; return Math.max(0, Number(s.replace(/[^0-9.]/g, "")) || 0); }
function n(x: unknown, d: number): number { const v = Number(x); return Number.isFinite(v) ? v : d; }

const PRIMARY = "#0E7C66";
const S: Record<string, React.CSSProperties> = {
  wrap: { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1A1A1A" },
  head: { marginBottom: 16 },
  heading: { fontSize: "1.2rem", fontWeight: 700 },
  subheading: { fontSize: "0.95rem", color: "#555", marginTop: 2 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 },
  inputs: { display: "flex", flexDirection: "column", gap: 12 },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#444" },
  input: { width: "100%", padding: "10px 12px", fontSize: "1rem", border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A" },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  sectionLabel: { fontSize: "0.75rem", fontWeight: 700, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 6, borderTop: "1px solid #E6F0EC", paddingTop: 10 },
  checkboxRow: { display: "flex", alignItems: "center", gap: 8, fontSize: "0.9rem", color: "#333", marginTop: 4 },

  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12, alignSelf: "start" },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 12, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "2rem", fontWeight: 800, color: PRIMARY, letterSpacing: "-0.02em" },
  bigSub: { fontSize: "0.85rem", color: "#666", textTransform: "capitalize" },

  stack: { background: "#fff", border: "1px solid #E6F0EC", borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", gap: 4 },
  row: { display: "flex", justifyContent: "space-between", fontSize: "0.87rem", padding: "3px 0" },
  rowLabel: { color: "#555" },
  rowValue: { fontWeight: 700, fontVariantNumeric: "tabular-nums" },

  likelihood: { border: "2px solid", borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", gap: 4, background: "#fff" },
  likelihoodLabel: { fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.03em" },
  likelihoodBody: { fontSize: "0.85rem", color: "#333" },

  reasonBox: { background: "#fff", border: "1px solid #E6F0EC", borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", gap: 6 },
  reasonLabel: { fontSize: "0.72rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: "0.03em" },
  reason: { margin: 0, fontSize: "0.87rem", lineHeight: 1.55, color: "#333" },

  note: { fontSize: "0.75rem", color: "#5a6b66", background: "#F1F8F5", border: "1px solid #DCECE6", borderRadius: 8, padding: "10px 12px", lineHeight: 1.55 },
};
