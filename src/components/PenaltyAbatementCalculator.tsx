import { useMemo, useState } from "react";
import { estimateAbatement, type LikelihoodBand, type PenaltyType } from "../lib/penalty-abatement";
import { fmtUSD } from "../lib/format";

// Penalty Abatement island. Routes taxpayer to FTA (administrative waiver), Reasonable Cause, or
// "not eligible" and shows the estimated abatement dollars + how to request.

interface Props {
  initialData?: Record<string, unknown>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS = {
  penaltyType: "failure-to-file" as PenaltyType,
  penaltyAmount: 2400,
  cleanPriorThreeYears: true,
  filingCurrent: true,
  taxPaidOrArranged: true,
  reasonableCauseEvent: false,
};

export default function PenaltyAbatementCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState({
    penaltyType: (initialData?.penaltyType as PenaltyType) ?? DEFAULTS.penaltyType,
    penaltyAmount: n(initialData?.penaltyAmount, DEFAULTS.penaltyAmount),
    cleanPriorThreeYears: b(initialData?.cleanPriorThreeYears, DEFAULTS.cleanPriorThreeYears),
    filingCurrent: b(initialData?.filingCurrent, DEFAULTS.filingCurrent),
    taxPaidOrArranged: b(initialData?.taxPaidOrArranged, DEFAULTS.taxPaidOrArranged),
    reasonableCauseEvent: b(initialData?.reasonableCauseEvent, DEFAULTS.reasonableCauseEvent),
  });
  const r = useMemo(() => estimateAbatement(v), [v]);
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
          <Field label="Penalty type">
            <select style={S.input} value={v.penaltyType} onChange={(e) => set({ penaltyType: e.target.value as PenaltyType })}>
              <option value="failure-to-file">Failure to File — §6651(a)(1)</option>
              <option value="failure-to-pay">Failure to Pay — §6651(a)(2)</option>
              <option value="failure-to-deposit">Failure to Deposit — §6656</option>
              <option value="accuracy-related">Accuracy-Related — §6662</option>
              <option value="estimated-tax">Estimated Tax — §6654</option>
            </select>
          </Field>
          <Field label="Penalty amount assessed">
            <Money v={v.penaltyAmount} on={(x) => set({ penaltyAmount: x })} />
          </Field>

          <div style={S.sectionLabel}>First Time Abate criteria</div>
          <label style={S.check}>
            <input type="checkbox" checked={v.cleanPriorThreeYears} onChange={(e) => set({ cleanPriorThreeYears: e.target.checked })} />
            <span>Penalty-free for the prior 3 tax years</span>
          </label>
          <label style={S.check}>
            <input type="checkbox" checked={v.filingCurrent} onChange={(e) => set({ filingCurrent: e.target.checked })} />
            <span>All required returns filed (or extension on file)</span>
          </label>
          <label style={S.check}>
            <input type="checkbox" checked={v.taxPaidOrArranged} onChange={(e) => set({ taxPaidOrArranged: e.target.checked })} />
            <span>Tax paid or under an installment agreement</span>
          </label>

          <div style={S.sectionLabel}>Reasonable Cause</div>
          <label style={S.check}>
            <input type="checkbox" checked={v.reasonableCauseEvent} onChange={(e) => set({ reasonableCauseEvent: e.target.checked })} />
            <span>Documented event: illness, disaster, records lost, IRS-written advice reliance</span>
          </label>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Estimated abatement</span>
            <span style={S.bigValue}>{fmtUSD(r.estimatedAbatement)}</span>
            <span style={S.bigSub}>Route: {routeLabel(r.path)} · Likelihood: {likelihoodLabel(r.likelihood)}</span>
          </div>

          <div style={{ ...S.pill, ...pillStyle(r.likelihood) }}>{routeLabel(r.path)}</div>

          <div style={S.reasonBox}>
            <div style={S.reasonLabel}>Why this route</div>
            <p style={S.reason}>{r.reason}</p>
          </div>

          <div style={S.reasonBox}>
            <div style={S.reasonLabel}>How to request</div>
            <p style={S.reason}>{r.howToRequest}</p>
          </div>

          <div style={S.eligRow}>
            <EligTag label="First Time Abate" active={r.ftaEligible} />
            <EligTag label="Reasonable Cause" active={r.reasonableCauseEligible} />
          </div>

          <div style={S.note}>
            First Time Abate is an administrative waiver — grant is essentially automatic when the 3
            criteria are met. Reasonable Cause is case-by-case; documented events (medical records,
            disaster declaration, IRS written advice) make the difference.
          </div>
        </div>
      </div>
    </div>
  );
}

function routeLabel(p: "fta" | "reasonable-cause" | "none"): string {
  return p === "fta" ? "First Time Abate" : p === "reasonable-cause" ? "Reasonable Cause" : "No abatement path available";
}
function likelihoodLabel(l: LikelihoodBand): string {
  return l === "high" ? "High" : l === "moderate" ? "Moderate" : l === "low" ? "Low" : "Not eligible";
}
function pillStyle(l: LikelihoodBand): React.CSSProperties {
  return l === "high" ? { background: "#E4F4EF", color: "#0E7C66", border: "1px solid #B3DACC" } :
         l === "moderate" ? { background: "#FFF7E6", color: "#8A6A00", border: "1px solid #F0DDA5" } :
         l === "low" ? { background: "#FBEAE9", color: "#8B2E24", border: "1px solid #EDC5C1" } :
         { background: "#F5F5F5", color: "#666", border: "1px solid #E0E0E0" };
}

function EligTag({ label, active }: { label: string; active: boolean }) {
  return (
    <div style={{ ...S.eligTag, ...(active ? S.eligActive : S.eligInactive) }}>
      <span style={S.eligDot}>{active ? "●" : "○"}</span>
      <span>{label}</span>
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
  sectionLabel: { fontSize: "0.75rem", fontWeight: 700, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 6, borderTop: "1px solid #E6F0EC", paddingTop: 10 },
  check: { display: "flex", alignItems: "center", gap: 8, fontSize: "0.9rem", color: "#333", cursor: "pointer" },

  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12, alignSelf: "start" },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 10, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "2rem", fontWeight: 800, color: PRIMARY, letterSpacing: "-0.02em" },
  bigSub: { fontSize: "0.85rem", color: "#666" },

  pill: { fontSize: "0.85rem", fontWeight: 700, padding: "8px 12px", borderRadius: 999, textAlign: "center" as const },

  reasonBox: { background: "#fff", border: "1px solid #E6F0EC", borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", gap: 6 },
  reasonLabel: { fontSize: "0.72rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: "0.03em" },
  reason: { fontSize: "0.9rem", lineHeight: 1.55, color: "#333", margin: 0 },

  eligRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  eligTag: { display: "flex", alignItems: "center", gap: 6, fontSize: "0.82rem", fontWeight: 600, padding: "8px 10px", borderRadius: 8 },
  eligActive: { background: "#E4F4EF", color: PRIMARY, border: `1px solid ${PRIMARY}` },
  eligInactive: { background: "#F5F5F5", color: "#888", border: "1px solid #E0E0E0" },
  eligDot: { fontSize: "0.7rem" },

  note: { fontSize: "0.8rem", color: "#5a6b66", background: "#F1F8F5", border: "1px solid #DCECE6", borderRadius: 8, padding: "10px 12px", lineHeight: 1.5 },
};
