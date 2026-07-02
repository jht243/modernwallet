import { useMemo, useState } from "react";
import { estimatePrenupCost, type PrenupComplexity } from "../lib/prenup-cost";
import { fmtUSD } from "../lib/format";
import { STATES } from "../data/states";

interface Props {
  initialData?: Record<string, unknown>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS = {
  state: "california",
  complexity: "moderate" as PrenupComplexity,
  bothPartiesAttorney: true,
};

export default function PrenupCostCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState({
    state: (initialData?.state as string) ?? DEFAULTS.state,
    complexity: (initialData?.complexity as PrenupComplexity) ?? DEFAULTS.complexity,
    bothPartiesAttorney: b(initialData?.bothPartiesAttorney, DEFAULTS.bothPartiesAttorney),
  });
  const r = useMemo(() => estimatePrenupCost(v), [v]);
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
          <Field label="Complexity">
            <select style={S.input} value={v.complexity} onChange={(e) => set({ complexity: e.target.value as PrenupComplexity })}>
              <option value="simple">Simple — clean assets, similar net worth</option>
              <option value="moderate">Moderate — asymmetric net worth, some premarital assets</option>
              <option value="complex">Complex — business interests, HNW, international assets</option>
            </select>
          </Field>
          <label style={S.check}>
            <input type="checkbox" checked={v.bothPartiesAttorney} onChange={(e) => set({ bothPartiesAttorney: e.target.checked })} />
            <span>Both parties have their own attorneys (recommended, often required)</span>
          </label>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Estimated total cost</span>
            <span style={S.bigValue}>{fmtUSD(r.costLow)}–{fmtUSD(r.costHigh)}</span>
            <span style={S.bigSub}>
              {v.complexity.charAt(0).toUpperCase() + v.complexity.slice(1)} · {v.bothPartiesAttorney ? "both parties represented" : "one attorney (higher enforcement risk)"}
            </span>
          </div>

          <div style={S.breakdown}>
            <div style={S.breakdownTitle}>Cost breakdown</div>
            {r.breakdown.map((b, i) => (
              <div key={i} style={S.breakdownRow}>
                <span style={S.breakdownLabel}>{b.item}</span>
                <span style={S.breakdownValue}>{fmtUSD(b.costLow)}–{fmtUSD(b.costHigh)}</span>
              </div>
            ))}
          </div>

          <div style={S.reasonBox}>
            <div style={S.reasonLabel}>State enforceability note</div>
            <p style={S.reason}>{r.stateNote}</p>
          </div>

          <div style={S.tagsRow}>
            {r.upaaState && <span style={S.tag}>UPAA (1983)</span>}
            {r.upmaaState && <span style={S.tag}>UPMAA (2012)</span>}
            {r.isCommunityProperty && <span style={S.tag}>Community property</span>}
            {r.californiaRules && <span style={{ ...S.tag, ...S.tagWarn }}>7-day CA rule</span>}
          </div>

          {!v.bothPartiesAttorney && (
            <div style={S.warn}>
              <strong>Enforceability risk:</strong> A prenup where only one party has counsel is much more vulnerable to challenge on unconscionability or lack of voluntariness. In California, waivers without independent counsel are unenforceable under Cal. Fam. Code §1615(c).
            </div>
          )}

          <div style={S.note}>
            No state recognizes oral prenups; all require written form, voluntary execution, full disclosure of assets/income/debts, and terms not unconscionable at execution. Prenups cannot bind child custody or child support decisions.
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label style={S.field}><span style={S.label}>{label}</span>{children}</label>;
}
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
  check: { display: "flex", alignItems: "center", gap: 8, fontSize: "0.9rem", color: "#333", cursor: "pointer" },

  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12, alignSelf: "start" },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 12, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "2rem", fontWeight: 800, color: PRIMARY, letterSpacing: "-0.02em" },
  bigSub: { fontSize: "0.85rem", color: "#666" },

  breakdown: { background: "#fff", border: "1px solid #E6F0EC", borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", gap: 4 },
  breakdownTitle: { fontSize: "0.72rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 4 },
  breakdownRow: { display: "flex", justifyContent: "space-between", fontSize: "0.85rem", padding: "3px 0" },
  breakdownLabel: { color: "#555" },
  breakdownValue: { fontWeight: 700, fontVariantNumeric: "tabular-nums", color: "#333" },

  reasonBox: { background: "#fff", border: "1px solid #E6F0EC", borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", gap: 6 },
  reasonLabel: { fontSize: "0.72rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: "0.03em" },
  reason: { margin: 0, fontSize: "0.87rem", lineHeight: 1.55, color: "#333" },

  tagsRow: { display: "flex", flexWrap: "wrap", gap: 6 },
  tag: { fontSize: "0.72rem", fontWeight: 700, padding: "4px 10px", borderRadius: 999, background: "#E4F4EF", color: PRIMARY, border: "1px solid #B3DACC" },
  tagWarn: { background: "#FFF7E6", color: "#8A6A00", border: "1px solid #F0DDA5" },

  warn: { fontSize: "0.85rem", color: "#8B2E24", background: "#FBEAE9", border: "1px solid #EDC5C1", borderRadius: 8, padding: "10px 12px", lineHeight: 1.5 },

  note: { fontSize: "0.8rem", color: "#5a6b66", background: "#F1F8F5", border: "1px solid #DCECE6", borderRadius: 8, padding: "10px 12px", lineHeight: 1.5 },
};
