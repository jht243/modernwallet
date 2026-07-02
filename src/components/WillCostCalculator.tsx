import { useMemo, useState } from "react";
import { estimateWillCost, type Complexity } from "../lib/will-cost";
import { fmtUSD } from "../lib/format";
import { STATES } from "../data/states";

// Will Cost island. State + complexity + attorney/DIY + supporting docs → cost range + itemized
// breakdown + online alternatives + state execution note.

interface Props {
  initialData?: Record<string, unknown>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS = {
  state: "texas",
  complexity: "moderate" as Complexity,
  useAttorney: true,
  includePOA: true,
  includeHealthcareDirective: true,
};

export default function WillCostCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState({
    state: (initialData?.state as string) ?? DEFAULTS.state,
    complexity: (initialData?.complexity as Complexity) ?? DEFAULTS.complexity,
    useAttorney: b(initialData?.useAttorney, DEFAULTS.useAttorney),
    includePOA: b(initialData?.includePOA, DEFAULTS.includePOA),
    includeHealthcareDirective: b(initialData?.includeHealthcareDirective, DEFAULTS.includeHealthcareDirective),
  });
  const r = useMemo(() => estimateWillCost(v), [v]);
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
            <select style={S.input} value={v.complexity} onChange={(e) => set({ complexity: e.target.value as Complexity })}>
              <option value="simple">Simple — single, standard heirs</option>
              <option value="moderate">Moderate — married + kids, some bequests</option>
              <option value="complex">Complex — blended family, business, multi-state</option>
            </select>
          </Field>
          <div style={S.sectionLabel}>Choose your path</div>
          <div style={S.toggleRow}>
            <button
              type="button"
              style={v.useAttorney ? { ...S.toggle, ...S.toggleActive } : S.toggle}
              onClick={() => set({ useAttorney: true })}
            >Attorney-drafted</button>
            <button
              type="button"
              style={!v.useAttorney ? { ...S.toggle, ...S.toggleActive } : S.toggle}
              onClick={() => set({ useAttorney: false })}
            >Online service</button>
          </div>
          <div style={S.sectionLabel}>Include supporting documents</div>
          <label style={S.check}>
            <input type="checkbox" checked={v.includePOA} onChange={(e) => set({ includePOA: e.target.checked })} />
            <span>Durable power of attorney</span>
          </label>
          <label style={S.check}>
            <input type="checkbox" checked={v.includeHealthcareDirective} onChange={(e) => set({ includeHealthcareDirective: e.target.checked })} />
            <span>Advance healthcare directive + HIPAA release</span>
          </label>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Estimated cost</span>
            <span style={S.bigValue}>{fmtUSD(r.costLow)}–{fmtUSD(r.costHigh)}</span>
            <span style={S.bigSub}>
              {v.complexity.charAt(0).toUpperCase() + v.complexity.slice(1)} will · {v.useAttorney ? "attorney" : "online"}
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
            <div style={S.reasonLabel}>State execution note</div>
            <p style={S.reason}>{r.stateNote}</p>
          </div>

          {v.useAttorney && r.onlineOptions.length > 0 && (
            <div style={S.docs}>
              <div style={S.docsLabel}>Online alternatives at your complexity</div>
              <ul style={S.docsList}>
                {r.onlineOptions.slice(0, 5).map((o) => (
                  <li key={o.name} style={S.docItem}>{o.name} — {o.priceLabel}</li>
                ))}
              </ul>
            </div>
          )}

          {r.stateTaxWarning && (
            <div style={S.note}>
              <strong>State tax note:</strong> {v.state.replace("-", " ")} has a state estate tax or inheritance tax that could reduce your heirs' inheritance regardless of the federal $15M exemption. Consider modeling with an [estate tax calculator] alongside the will.
            </div>
          )}

          <div style={S.note}>
            Attorney costs vary by market and complexity — this range applies a state cost multiplier to the national benchmark. Online tools are usually appropriate for simple and moderate cases with clear facts; attorney-drafted is worth it for blended families, business interests, or cross-state real estate.
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
  sectionLabel: { fontSize: "0.75rem", fontWeight: 700, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 6, borderTop: "1px solid #E6F0EC", paddingTop: 10 },
  toggleRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  toggle: { padding: "10px 12px", fontSize: "0.9rem", fontWeight: 600, border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", color: "#555", cursor: "pointer" },
  toggleActive: { background: PRIMARY, color: "#fff", borderColor: PRIMARY },
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

  docs: { background: "#fff", border: "1px solid #E6F0EC", borderRadius: 8, padding: 12 },
  docsLabel: { fontSize: "0.72rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 6 },
  docsList: { margin: 0, paddingLeft: 20, lineHeight: 1.6, fontSize: "0.85rem", color: "#333" },
  docItem: { marginBottom: 4 },

  note: { fontSize: "0.8rem", color: "#5a6b66", background: "#F1F8F5", border: "1px solid #DCECE6", borderRadius: 8, padding: "10px 12px", lineHeight: 1.5 },
};
