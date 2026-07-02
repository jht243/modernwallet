import { useMemo, useState } from "react";
import { assessElderCarePlan, INCOME_CAP_2026, CSRA_MAX_2026, HOME_EQUITY_MIN_2026, HOME_EQUITY_MAX_2026, NURSING_HOME_ANNUAL_MEDIAN, type MaritalStatus, type CareRisk } from "../lib/elder-care-hub";
import { fmtUSD } from "../lib/format";

// Elder Care hub island. 6 inputs → risk tier + recommended plan steps with 5-year lookback deadline.

interface Props {
  initialData?: Record<string, unknown>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS = {
  age: 62,
  countableAssets: 550_000,
  monthlyIncome: 4_200,
  maritalStatus: "married-both-well" as MaritalStatus,
  careRisk: "within-5-years" as CareRisk,
  specialNeedsDependent: false,
};

export default function ElderCareHubCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState({
    age: n(initialData?.age, DEFAULTS.age),
    countableAssets: n(initialData?.countableAssets, DEFAULTS.countableAssets),
    monthlyIncome: n(initialData?.monthlyIncome, DEFAULTS.monthlyIncome),
    maritalStatus: (initialData?.maritalStatus as MaritalStatus) ?? DEFAULTS.maritalStatus,
    careRisk: (initialData?.careRisk as CareRisk) ?? DEFAULTS.careRisk,
    specialNeedsDependent: b(initialData?.specialNeedsDependent, DEFAULTS.specialNeedsDependent),
  });
  const r = useMemo(() => assessElderCarePlan(v), [v]);
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
          <Field label="Age">
            <input style={S.input} type="number" min={40} max={100} value={v.age} onChange={(e) => set({ age: Number(e.target.value) })} />
          </Field>
          <Field label="Marital status">
            <select style={S.input} value={v.maritalStatus} onChange={(e) => set({ maritalStatus: e.target.value as MaritalStatus })}>
              <option value="single">Single</option>
              <option value="married-both-well">Married — both spouses well</option>
              <option value="married-spouse-needs-care">Married — spouse needs care</option>
            </select>
          </Field>
          <Field label="Countable assets (excludes home + 1 vehicle)">
            <Money v={v.countableAssets} on={(x) => set({ countableAssets: x })} />
          </Field>
          <Field label="Monthly household income (SS + pensions + investments)">
            <Money v={v.monthlyIncome} on={(x) => set({ monthlyIncome: x })} />
          </Field>
          <Field label="Long-term care outlook">
            <select style={S.input} value={v.careRisk} onChange={(e) => set({ careRisk: e.target.value as CareRisk })}>
              <option value="none">No immediate concern</option>
              <option value="within-5-years">May be needed within 5 years</option>
              <option value="current">Care is needed now</option>
            </select>
          </Field>
          <label style={S.check}>
            <input type="checkbox" checked={v.specialNeedsDependent} onChange={(e) => set({ specialNeedsDependent: e.target.checked })} />
            <span>Planning for a special-needs dependent</span>
          </label>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Recommendation</span>
            <span style={S.bigValueSmall}>{r.headline}</span>
            <span style={S.bigSub}>Risk tier: {tierLabel(r.riskTier)}</span>
          </div>

          {(r.aboveIncomeCap || r.aboveAssetLimit) && (
            <div style={S.warn}>
              <div style={S.warnLabel}>Medicaid gates to plan around</div>
              {r.aboveIncomeCap && (
                <div style={S.warnLine}>Monthly income of {fmtUSD(v.monthlyIncome)} exceeds the 2026 institutional cap of {fmtUSD(INCOME_CAP_2026)} — you'll need a Miller Trust (QIT) in income-cap states, or the state's medically-needy spend-down pathway elsewhere.</div>
              )}
              {r.aboveAssetLimit && (
                <div style={S.warnLine}>Countable assets of {fmtUSD(v.countableAssets)} exceed the $2,000 individual limit{r.csra > 0 && ` (community spouse can keep up to ${fmtUSD(r.csra)} under CSRA rules — 2026 max ${fmtUSD(CSRA_MAX_2026)})`}. Spend-down or MAPT planning applies.</div>
              )}
            </div>
          )}

          <div style={S.deadline}>
            <div style={S.deadlineLabel}>5-year lookback deadline (42 U.S.C. §1396p(c))</div>
            <div style={S.deadlineValue}>{r.lookbackDeadline}</div>
          </div>

          <div style={S.steps}>
            <div style={S.stepsLabel}>Recommended plan steps</div>
            {r.steps.map((step, i) => (
              <div key={i} style={{ ...S.step, ...urgencyStyle(step.urgency) }}>
                <div style={S.stepHead}>
                  <span style={S.stepName}>{step.name}</span>
                  <span style={{ ...S.urgencyBadge, ...urgencyBadgeStyle(step.urgency) }}>{urgencyLabel(step.urgency)}</span>
                </div>
                <div style={S.stepReason}>{step.reason}</div>
                <div style={S.stepMeta}>
                  <span style={S.stepCost}>Cost: {fmtUSD(step.costLow)}–{fmtUSD(step.costHigh)}</span>
                  {step.deadline && <span style={S.stepDeadline}>· {step.deadline}</span>}
                </div>
              </div>
            ))}
          </div>

          <div style={S.note}>
            <strong>2026 federal figures:</strong> Institutional income cap ${INCOME_CAP_2026.toLocaleString()}/mo (300% SSI FBR $994) ·
            CSRA min $32,532 / max ${CSRA_MAX_2026.toLocaleString()} · MMMNA min $2,644 · Home equity min ${HOME_EQUITY_MIN_2026.toLocaleString()} /
            max ${HOME_EQUITY_MAX_2026.toLocaleString()} (12 states + DC use max). OBBBA (P.L. 119-21) caps home equity at $1M effective 1/1/2028.
            California re-added asset test 1/1/2026 at $130k individual / $195k couple. National median nursing home ${(NURSING_HOME_ANNUAL_MEDIAN / 1000).toFixed(0)}k/year
            (CareScout 2025) — every month of unplanned care burns roughly ${Math.round(NURSING_HOME_ANNUAL_MEDIAN / 12 / 1000)}k in private-pay costs.
          </div>
        </div>
      </div>
    </div>
  );
}

function tierLabel(t: string): string {
  return t === "urgent" ? "URGENT — care needed now" :
         t === "planning-window" ? "PLANNING WINDOW — act now" :
         "STABLE — long horizon";
}

function urgencyLabel(u: "critical" | "recommended" | "optional"): string {
  return u === "critical" ? "CRITICAL" : u === "recommended" ? "RECOMMENDED" : "OPTIONAL";
}

function urgencyStyle(u: "critical" | "recommended" | "optional"): React.CSSProperties {
  if (u === "critical") return { borderLeft: "3px solid #8B2E24" };
  if (u === "recommended") return { borderLeft: "3px solid #0E7C66" };
  return { borderLeft: "3px solid #999" };
}

function urgencyBadgeStyle(u: "critical" | "recommended" | "optional"): React.CSSProperties {
  if (u === "critical") return { background: "#FBEAE9", color: "#8B2E24" };
  if (u === "recommended") return { background: "#E4F4EF", color: "#0E7C66" };
  return { background: "#F5F5F5", color: "#666" };
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
function b(x: unknown, d: boolean): boolean { return typeof x === "boolean" ? x : d; }

const PRIMARY = "#0E7C66";
const S: Record<string, React.CSSProperties> = {
  wrap: { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1A1A1A" },
  head: { marginBottom: 16 },
  heading: { fontSize: "1.2rem", fontWeight: 700 },
  subheading: { fontSize: "0.95rem", color: "#555", marginTop: 2 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 },
  inputs: { display: "flex", flexDirection: "column", gap: 12 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#444" },
  input: { width: "100%", padding: "10px 12px", fontSize: "1rem", border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A" },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  check: { display: "flex", alignItems: "center", gap: 8, fontSize: "0.9rem", color: "#333", cursor: "pointer" },

  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12, alignSelf: "start" },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 12, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValueSmall: { fontSize: "1.15rem", fontWeight: 700, color: PRIMARY, lineHeight: 1.35 },
  bigSub: { fontSize: "0.85rem", color: "#666" },

  warn: { background: "#FFF7E6", border: "1px solid #F0DDA5", borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", gap: 6 },
  warnLabel: { fontSize: "0.75rem", fontWeight: 700, color: "#8A6A00", textTransform: "uppercase", letterSpacing: "0.03em" },
  warnLine: { fontSize: "0.85rem", color: "#333", lineHeight: 1.55 },

  deadline: { background: "#fff", border: "1px solid #E6F0EC", borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", gap: 4 },
  deadlineLabel: { fontSize: "0.72rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: "0.03em" },
  deadlineValue: { fontSize: "0.9rem", color: "#333", lineHeight: 1.55 },

  steps: { display: "flex", flexDirection: "column", gap: 8 },
  stepsLabel: { fontSize: "0.75rem", fontWeight: 700, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.03em" },
  step: { background: "#fff", border: "1px solid #E6F0EC", borderRadius: 8, padding: 12, paddingLeft: 15, display: "flex", flexDirection: "column", gap: 6 },
  stepHead: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" },
  stepName: { fontSize: "0.95rem", fontWeight: 700, color: "#1A1A1A" },
  urgencyBadge: { fontSize: "0.7rem", fontWeight: 700, padding: "3px 8px", borderRadius: 999, letterSpacing: "0.03em" },
  stepReason: { fontSize: "0.87rem", lineHeight: 1.5, color: "#333" },
  stepMeta: { fontSize: "0.82rem", color: "#555", display: "flex", gap: 4, flexWrap: "wrap" },
  stepCost: { fontWeight: 700, color: PRIMARY },
  stepDeadline: { color: "#666" },

  note: { fontSize: "0.75rem", color: "#5a6b66", background: "#F1F8F5", border: "1px solid #DCECE6", borderRadius: 8, padding: "10px 12px", lineHeight: 1.55 },
};
