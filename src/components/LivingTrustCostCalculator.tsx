import { useMemo, useState } from "react";
import { estimateLivingTrustCost, type TrustType, type EstateComplexity } from "../lib/living-trust-cost";
import { fmtUSD } from "../lib/format";
import { STATES } from "../data/states";

// Living Trust Cost island. State + trust type + complexity + attorney/DIY + funding →
// cost range + itemized breakdown + best online options.

interface Props {
  initialData?: Record<string, unknown>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS = {
  state: "california",
  trustType: "revocable" as TrustType,
  complexity: "moderate" as EstateComplexity,
  useAttorney: true,
  includeFunding: true,
  numberOfProperties: 1,
};

export default function LivingTrustCostCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState({
    state: (initialData?.state as string) ?? DEFAULTS.state,
    trustType: (initialData?.trustType as TrustType) ?? DEFAULTS.trustType,
    complexity: (initialData?.complexity as EstateComplexity) ?? DEFAULTS.complexity,
    useAttorney: b(initialData?.useAttorney, DEFAULTS.useAttorney),
    includeFunding: b(initialData?.includeFunding, DEFAULTS.includeFunding),
    numberOfProperties: n(initialData?.numberOfProperties, DEFAULTS.numberOfProperties),
  });
  const r = useMemo(() => estimateLivingTrustCost(v), [v]);
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
          <Field label="Trust type">
            <select style={S.input} value={v.trustType} onChange={(e) => set({ trustType: e.target.value as TrustType })}>
              <option value="revocable">Revocable living trust (RLT)</option>
              <option value="irrevocable-ilit">Irrevocable Life Insurance Trust (ILIT)</option>
              <option value="irrevocable-mapt">Medicaid Asset Protection Trust (MAPT)</option>
              <option value="irrevocable-dynasty">Dynasty / GST trust</option>
            </select>
          </Field>
          {v.trustType === "revocable" && (
            <Field label="Complexity">
              <select style={S.input} value={v.complexity} onChange={(e) => set({ complexity: e.target.value as EstateComplexity })}>
                <option value="simple">Simple — 1 property, standard heirs</option>
                <option value="moderate">Moderate — multiple assets or beneficiaries</option>
                <option value="complex">Complex — business, blended family, multi-state</option>
              </select>
            </Field>
          )}
          <div style={S.sectionLabel}>Choose your path</div>
          <div style={S.toggleRow}>
            <button
              type="button"
              style={v.useAttorney ? { ...S.toggle, ...S.toggleActive } : S.toggle}
              onClick={() => set({ useAttorney: true })}
            >Attorney</button>
            <button
              type="button"
              style={!v.useAttorney ? { ...S.toggle, ...S.toggleActive } : S.toggle}
              onClick={() => set({ useAttorney: false })}
            >Online</button>
          </div>
          <div style={S.sectionLabel}>Trust funding</div>
          <label style={S.check}>
            <input type="checkbox" checked={v.includeFunding} onChange={(e) => set({ includeFunding: e.target.checked })} />
            <span>Include funding (deed recording + retitling accounts)</span>
          </label>
          {v.includeFunding && (
            <Field label="Number of properties to retitle">
              <select style={S.input} value={v.numberOfProperties} onChange={(e) => set({ numberOfProperties: Number(e.target.value) })}>
                {[0, 1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </Field>
          )}
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Estimated total cost</span>
            <span style={S.bigValue}>{fmtUSD(r.costLow)}–{fmtUSD(r.costHigh)}</span>
            <span style={S.bigSub}>
              {v.trustType === "revocable"
                ? `Revocable living trust · ${v.useAttorney ? "attorney" : "online"}`
                : v.trustType === "irrevocable-ilit"
                ? "ILIT · attorney-only"
                : v.trustType === "irrevocable-mapt"
                ? "Medicaid Asset Protection Trust · attorney-only"
                : "Dynasty trust · attorney-only"}
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
            <div style={S.reasonLabel}>State + trust-type note</div>
            <p style={S.reason}>{r.stateNote}</p>
          </div>

          {v.useAttorney && v.trustType === "revocable" && r.onlineOptions.length > 0 && (
            <div style={S.docs}>
              <div style={S.docsLabel}>Online alternatives (RLT only)</div>
              <ul style={S.docsList}>
                {r.onlineOptions.map((o) => (
                  <li key={o.name} style={S.docItem}>{o.name} — {o.priceLabel}</li>
                ))}
              </ul>
            </div>
          )}

          {r.stateTaxWarning && (
            <div style={S.note}>
              <strong>State tax note:</strong> {v.state.replace(/-/g, " ")} imposes a state estate tax or inheritance tax that a revocable trust does NOT reduce. An irrevocable trust (funded during life) can move assets out of the taxable estate — model both.
            </div>
          )}

          <div style={S.note}>
            Attorney trust prep varies by market and complexity. Online RLT tools like Trust & Will ($499/$599) work for straightforward facts; attorney-drafted is warranted for irrevocable structures (ILIT, MAPT, dynasty), Medicaid planning under the 5-year lookback, or blended families.
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label style={S.field}><span style={S.label}>{label}</span>{children}</label>;
}
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
