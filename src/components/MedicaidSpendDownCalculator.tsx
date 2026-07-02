import { useMemo, useState } from "react";
import { computeSpendDown, type MaritalStatus } from "../lib/medicaid-spend-down";
import { fmtUSD } from "../lib/format";
import { STATES } from "../data/states";

// Medicaid Spend-Down Calculator — the flagship differentiator. State + assets by class + income
// → countable assets, spend-down target, CSRA, MMMNA, home equity limit, income cap check.

interface Props {
  initialData?: Record<string, unknown>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS = {
  state: "california",
  maritalStatus: "married-both-well" as MaritalStatus,
  cashAndSavings: 45_000,
  investments: 180_000,
  retirement: 220_000,
  otherRealEstate: 0,
  extraVehicles: 0,
  lifeInsuranceCashValue: 0,
  applicantMonthlyIncome: 2_400,
  spouseMonthlyIncome: 1_800,
  homeEquity: 450_000,
};

export default function MedicaidSpendDownCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState({
    state: (initialData?.state as string) ?? DEFAULTS.state,
    maritalStatus: (initialData?.maritalStatus as MaritalStatus) ?? DEFAULTS.maritalStatus,
    cashAndSavings: n(initialData?.cashAndSavings, DEFAULTS.cashAndSavings),
    investments: n(initialData?.investments, DEFAULTS.investments),
    retirement: n(initialData?.retirement, DEFAULTS.retirement),
    otherRealEstate: n(initialData?.otherRealEstate, DEFAULTS.otherRealEstate),
    extraVehicles: n(initialData?.extraVehicles, DEFAULTS.extraVehicles),
    lifeInsuranceCashValue: n(initialData?.lifeInsuranceCashValue, DEFAULTS.lifeInsuranceCashValue),
    applicantMonthlyIncome: n(initialData?.applicantMonthlyIncome, DEFAULTS.applicantMonthlyIncome),
    spouseMonthlyIncome: n(initialData?.spouseMonthlyIncome, DEFAULTS.spouseMonthlyIncome),
    homeEquity: n(initialData?.homeEquity, DEFAULTS.homeEquity),
  });
  const r = useMemo(() => computeSpendDown(v), [v]);
  const set = (p: Partial<typeof v>) => setV((s) => ({ ...s, ...p }));

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
          <Field label="State">
            <select style={S.input} value={v.state} onChange={(e) => set({ state: e.target.value })}>
              {STATES.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
            </select>
          </Field>
          <Field label="Marital status">
            <select style={S.input} value={v.maritalStatus} onChange={(e) => set({ maritalStatus: e.target.value as MaritalStatus })}>
              <option value="single">Single</option>
              <option value="married-both-well">Married — both spouses well</option>
              <option value="married-spouse-needs-care">Married — one spouse needs care</option>
            </select>
          </Field>

          <div style={S.sectionLabel}>Assets — enter each category</div>
          <div style={S.row2}>
            <Field label="Cash + checking + savings"><Money v={v.cashAndSavings} on={(x) => set({ cashAndSavings: x })} /></Field>
            <Field label="Taxable investments"><Money v={v.investments} on={(x) => set({ investments: x })} /></Field>
          </div>
          <div style={S.row2}>
            <Field label="Retirement (401k, IRA)"><Money v={v.retirement} on={(x) => set({ retirement: x })} /></Field>
            <Field label="Home equity"><Money v={v.homeEquity} on={(x) => set({ homeEquity: x })} /></Field>
          </div>
          <div style={S.row2}>
            <Field label="Other real estate (non-primary)"><Money v={v.otherRealEstate} on={(x) => set({ otherRealEstate: x })} /></Field>
            <Field label="Cash value life insurance"><Money v={v.lifeInsuranceCashValue} on={(x) => set({ lifeInsuranceCashValue: x })} /></Field>
          </div>

          <div style={S.sectionLabel}>Monthly income</div>
          <div style={S.row2}>
            <Field label="Applicant income"><Money v={v.applicantMonthlyIncome} on={(x) => set({ applicantMonthlyIncome: x })} /></Field>
            <Field label="Spouse income"><Money v={v.spouseMonthlyIncome} on={(x) => set({ spouseMonthlyIncome: x })} /></Field>
          </div>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Spend-down target</span>
            <span style={S.bigValue}>{fmtUSD(r.spendDownTarget)}</span>
            <span style={S.bigSub}>
              Countable {fmtUSD(r.countableAssets)} · Asset limit {fmtUSD(r.assetLimit)}{v.maritalStatus !== "single" && ` + CSRA ${fmtUSD(r.csra)}`}
            </span>
          </div>

          {r.aboveIncomeCap && (
            <div style={S.warn}>
              <div style={S.warnLabel}>Above 2026 income cap ($2,982/mo)</div>
              {r.incomeCapState ? (
                <div style={S.warnLine}>This state is an income-cap state — you'll need a Qualified Income Trust (Miller Trust) under 42 U.S.C. §1396p(d)(4)(B) to redirect excess income and qualify.</div>
              ) : (
                <div style={S.warnLine}>This state uses a medically-needy pathway — spend excess income on medical costs each month until you hit the Medically Needy Income Level (MNIL).</div>
              )}
            </div>
          )}

          {r.homeEquityExceedsLimit && (
            <div style={S.warn}>
              <div style={S.warnLabel}>Home equity exceeds state limit ({fmtUSD(r.homeEquityLimit)})</div>
              <div style={S.warnLine}>Unless a community spouse resides in the home, home equity above the state limit blocks Medicaid. Options: HELOC to reduce equity, spousal transfer, or (planning tool) a Medicaid Asset Protection Trust funded 5+ years before application.</div>
            </div>
          )}

          <div style={S.breakdown}>
            <div style={S.breakdownTitle}>Federal figures applied</div>
            <div style={S.breakdownRow}><span style={S.breakdownLabel}>Asset limit (individual)</span><span style={S.breakdownValue}>{fmtUSD(r.assetLimit)}</span></div>
            {v.maritalStatus !== "single" && (
              <>
                <div style={S.breakdownRow}><span style={S.breakdownLabel}>CSRA (community spouse)</span><span style={S.breakdownValue}>{fmtUSD(r.csra)}</span></div>
                <div style={S.breakdownRow}><span style={S.breakdownLabel}>MMMNA (min monthly income allowance)</span><span style={S.breakdownValue}>{fmtUSD(r.mmmna)}/mo</span></div>
              </>
            )}
            <div style={S.breakdownRow}><span style={S.breakdownLabel}>Home equity limit</span><span style={S.breakdownValue}>{fmtUSD(r.homeEquityLimit)}</span></div>
            <div style={S.breakdownRow}><span style={S.breakdownLabel}>Institutional income cap</span><span style={S.breakdownValue}>$2,982/mo</span></div>
          </div>

          <div style={S.reasonBox}>
            <div style={S.reasonLabel}>Exempt assets</div>
            <p style={S.reason}>{r.exemptAssetsNarrative}</p>
          </div>

          <div style={S.reasonBox}>
            <div style={S.reasonLabel}>{v.state.replace(/-/g, " ")} state rules</div>
            <p style={S.reason}>{r.stateNote}</p>
          </div>

          <div style={S.note}>
            Estimates only, based on 2026 federal figures (CMS CIB 12/9/2025) and state-specific rules. Every state's Medicaid agency publishes its own current figures — consult a licensed elder-law attorney before executing any spend-down or transfer strategy. Transfers within 60 months of application trigger the lookback under 42 U.S.C. §1396p(c).
          </div>
        </div>
      </div>
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

  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12, alignSelf: "start" },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 12, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "2rem", fontWeight: 800, color: PRIMARY, letterSpacing: "-0.02em" },
  bigSub: { fontSize: "0.85rem", color: "#666" },

  warn: { background: "#FFF7E6", border: "1px solid #F0DDA5", borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", gap: 6 },
  warnLabel: { fontSize: "0.75rem", fontWeight: 700, color: "#8A6A00", textTransform: "uppercase", letterSpacing: "0.03em" },
  warnLine: { fontSize: "0.85rem", color: "#333", lineHeight: 1.55 },

  breakdown: { background: "#fff", border: "1px solid #E6F0EC", borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", gap: 4 },
  breakdownTitle: { fontSize: "0.72rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 4 },
  breakdownRow: { display: "flex", justifyContent: "space-between", fontSize: "0.85rem", padding: "3px 0" },
  breakdownLabel: { color: "#555" },
  breakdownValue: { fontWeight: 700, fontVariantNumeric: "tabular-nums", color: "#333" },

  reasonBox: { background: "#fff", border: "1px solid #E6F0EC", borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", gap: 6 },
  reasonLabel: { fontSize: "0.72rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: "0.03em" },
  reason: { margin: 0, fontSize: "0.87rem", lineHeight: 1.55, color: "#333" },

  note: { fontSize: "0.75rem", color: "#5a6b66", background: "#F1F8F5", border: "1px solid #DCECE6", borderRadius: 8, padding: "10px 12px", lineHeight: 1.55 },
};
