import { useMemo, useState } from "react";
import { recommendReliefPrograms, type FitLabel, type ProgramRecommendation } from "../lib/tax-resolution-hub";
import { fmtUSD } from "../lib/format";

// Tax Resolution hub island. Six inputs → recommended IRS relief program + cost band + reasoning.
// Grounds every number in src/lib/tax-resolution-hub.ts (RCP formula, IA thresholds, CNC criteria).

interface Props {
  initialData?: Record<string, unknown>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS = {
  totalDebt: 42000,
  yearsBehind: 0,
  monthlyIncome: 6500,
  monthlyAllowableExpenses: 5800,
  assetEquity: 8000,
  isJointSpousal: false,
  cleanPriorThreeYears: false,
};

export default function TaxResolutionHubCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState({
    totalDebt: n(initialData?.totalDebt, DEFAULTS.totalDebt),
    yearsBehind: n(initialData?.yearsBehind, DEFAULTS.yearsBehind),
    monthlyIncome: n(initialData?.monthlyIncome, DEFAULTS.monthlyIncome),
    monthlyAllowableExpenses: n(initialData?.monthlyAllowableExpenses, DEFAULTS.monthlyAllowableExpenses),
    assetEquity: n(initialData?.assetEquity, DEFAULTS.assetEquity),
    isJointSpousal: b(initialData?.isJointSpousal, DEFAULTS.isJointSpousal),
    cleanPriorThreeYears: b(initialData?.cleanPriorThreeYears, DEFAULTS.cleanPriorThreeYears),
  });
  const r = useMemo(() => recommendReliefPrograms(v), [v]);
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
          <Field label="Total tax debt (tax + penalties + interest)">
            <Money v={v.totalDebt} on={(x) => set({ totalDebt: x })} />
          </Field>
          <Field label="Years behind on filing">
            <select style={S.input} value={v.yearsBehind} onChange={(e) => set({ yearsBehind: Number(e.target.value) })}>
              <option value={0}>Current — all returns filed</option>
              <option value={1}>1 year behind</option>
              <option value={2}>2 years behind</option>
              <option value={3}>3+ years behind</option>
            </select>
          </Field>
          <div style={S.row2}>
            <Field label="Monthly household income (gross)">
              <Money v={v.monthlyIncome} on={(x) => set({ monthlyIncome: x })} />
            </Field>
            <Field label="Allowable monthly expenses">
              <Money v={v.monthlyAllowableExpenses} on={(x) => set({ monthlyAllowableExpenses: x })} />
            </Field>
          </div>
          <div style={S.helpNote}>
            Use the IRS Collection Financial Standards for your county + family size (housing, food, transportation, healthcare, taxes). If unsure, start with ~85% of income and refine.
          </div>
          <Field label="Net asset equity (home + car + savings − loans)">
            <Money v={v.assetEquity} on={(x) => set({ assetEquity: x })} />
          </Field>
          <label style={S.check}>
            <input
              type="checkbox"
              checked={v.isJointSpousal}
              onChange={(e) => set({ isJointSpousal: e.target.checked })}
            />
            <span>Debt is joint with, or caused by, a spouse</span>
          </label>
          <label style={S.check}>
            <input
              type="checkbox"
              checked={v.cleanPriorThreeYears}
              onChange={(e) => set({ cleanPriorThreeYears: e.target.checked })}
            />
            <span>No IRS penalties in the 3 prior tax years</span>
          </label>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>{r.headline.label}</span>
            <span style={S.bigValue}>{r.headline.value}</span>
            <span style={S.bigSub}>Primary path: {r.primary.name}</span>
          </div>

          <div style={S.primaryCard}>
            <div style={S.programHeader}>
              <span style={S.programName}>{r.primary.name}</span>
              <FitPill fit={r.primary.fit} />
            </div>
            <p style={S.reason}>{r.primary.reason}</p>
            {r.primary.keyRequirement && (
              <div style={S.reqRow}>
                <span style={S.reqLabel}>Key requirement</span>
                <span style={S.reqValue}>{r.primary.keyRequirement}</span>
              </div>
            )}
            <div style={S.costRow}>
              <span style={S.costLabel}>Typical professional cost</span>
              <span style={S.costValue}>
                {r.primary.costLow === 0
                  ? `${fmtUSD(r.primary.costHigh)} or less`
                  : `${fmtUSD(r.primary.costLow)}–${fmtUSD(r.primary.costHigh)}`}
              </span>
            </div>
          </div>

          <div style={S.statRow}>
            <Stat label="Reasonable Collection Potential (lump-sum)" value={fmtUSD(r.rcpLumpSum)} />
            <Stat label="RCP (periodic 6–24 mo)" value={fmtUSD(r.rcpPeriodic)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Monthly disposable income" value={fmtUSD(r.monthlyDisposable)} />
            {r.streamlinedIAMonthly != null ? (
              <Stat label="Est. streamlined IA (72 mo)" value={`${fmtUSD(r.streamlinedIAMonthly)}/mo`} />
            ) : (
              <Stat label="Streamlined IA" value="Over $50k limit" />
            )}
          </div>

          {r.others.length > 0 && (
            <div style={S.othersSection}>
              <div style={S.othersLabel}>Also consider</div>
              {r.others.map((o) => (
                <div key={o.key} style={S.otherCard}>
                  <div style={S.programHeader}>
                    <span style={S.otherName}>{o.name}</span>
                    <FitPill fit={o.fit} />
                  </div>
                  <p style={S.otherReason}>{o.reason}</p>
                </div>
              ))}
            </div>
          )}

          <div style={S.note}>
            Estimates only. Every result depends on IRS review of your Form 433 financial disclosures. Consult a licensed tax attorney, CPA, or Enrolled Agent before acting.
          </div>
        </div>
      </div>
    </div>
  );
}

function FitPill({ fit }: { fit: FitLabel }) {
  const style = fitStyles[fit];
  return <span style={{ ...S.pill, ...style }}>{fitLabels[fit]}</span>;
}

const fitLabels: Record<FitLabel, string> = {
  primary: "Best fit",
  strong: "Strong fit",
  possible: "Also possible",
  unlikely: "Unlikely",
};

const fitStyles: Record<FitLabel, React.CSSProperties> = {
  primary: { background: "#0E7C66", color: "#fff" },
  strong: { background: "#E4F4EF", color: "#0E7C66", border: "1px solid #B3DACC" },
  possible: { background: "#FFF7E6", color: "#8A6A00", border: "1px solid #F0DDA5" },
  unlikely: { background: "#F5F5F5", color: "#666", border: "1px solid #E0E0E0" },
};

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
function Stat({ label, value }: { label: string; value: string }) {
  return <div style={S.stat}><span style={S.statLabel}>{label}</span><span style={S.statValue}>{value}</span></div>;
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
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#444" },
  input: { width: "100%", padding: "10px 12px", fontSize: "1rem", border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A" },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  suffix: { position: "absolute", right: 12, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  helpNote: { fontSize: "0.78rem", color: "#666", background: "#F8F8F8", border: "1px solid #ECECEC", borderRadius: 8, padding: "8px 10px", lineHeight: 1.5 },
  check: { display: "flex", alignItems: "center", gap: 8, fontSize: "0.9rem", color: "#333", cursor: "pointer" },

  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 14, alignSelf: "start" },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 12, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "2rem", fontWeight: 800, color: PRIMARY, letterSpacing: "-0.02em" },
  bigSub: { fontSize: "0.85rem", color: "#666" },

  primaryCard: { background: "#fff", border: "1px solid #D8EEE6", borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", gap: 10 },
  programHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" },
  programName: { fontSize: "1.05rem", fontWeight: 700, color: "#1A1A1A" },
  reason: { fontSize: "0.92rem", lineHeight: 1.6, color: "#333", margin: 0 },
  reqRow: { display: "flex", flexDirection: "column", gap: 2, padding: "8px 0", borderTop: "1px dashed #E6F0EC" },
  reqLabel: { fontSize: "0.72rem", fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: "0.03em" },
  reqValue: { fontSize: "0.87rem", color: "#333" },
  costRow: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 4, borderTop: "1px dashed #E6F0EC" },
  costLabel: { fontSize: "0.82rem", color: "#666" },
  costValue: { fontSize: "0.95rem", fontWeight: 700, color: PRIMARY, fontVariantNumeric: "tabular-nums" },

  statRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  stat: { display: "flex", flexDirection: "column", gap: 1 },
  statLabel: { fontSize: "0.75rem", color: "#666" },
  statValue: { fontSize: "1rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" },

  othersSection: { display: "flex", flexDirection: "column", gap: 8, marginTop: 4 },
  othersLabel: { fontSize: "0.78rem", fontWeight: 700, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  otherCard: { background: "#fff", border: "1px solid #EDEDED", borderRadius: 8, padding: 10, display: "flex", flexDirection: "column", gap: 6 },
  otherName: { fontSize: "0.92rem", fontWeight: 600, color: "#333" },
  otherReason: { fontSize: "0.85rem", lineHeight: 1.55, color: "#444", margin: 0 },

  pill: { fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 999 },

  note: { fontSize: "0.8rem", color: "#5a6b66", background: "#F1F8F5", border: "1px solid #DCECE6", borderRadius: 8, padding: "10px 12px", lineHeight: 1.5 },
};
