import { useMemo, useState } from "react";
import { estimateProbate, smallEstateThreshold, type ProbateComplexity } from "../lib/probate-hub";
import { fmtUSD } from "../lib/format";
import { STATES } from "../data/states";

// Probate hub island. State + estate value + complexity + ancillary → total cost + timeline +
// living-trust savings comparison.

interface Props {
  initialData?: Record<string, unknown>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS = {
  state: "california",
  estateValue: 750_000,
  complexity: "moderate" as ProbateComplexity,
  ancillaryStates: 0,
};

export default function ProbateHubCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState({
    state: (initialData?.state as string) ?? DEFAULTS.state,
    estateValue: n(initialData?.estateValue, DEFAULTS.estateValue),
    complexity: (initialData?.complexity as ProbateComplexity) ?? DEFAULTS.complexity,
    ancillaryStates: n(initialData?.ancillaryStates, DEFAULTS.ancillaryStates),
  });
  const r = useMemo(() => estimateProbate(v), [v]);
  const set = (p: Partial<typeof v>) => setV((s) => ({ ...s, ...p }));
  const smallEstate = smallEstateThreshold(v.state);
  const underSmallEstate = smallEstate > 0 && v.estateValue > 0 && v.estateValue <= smallEstate;

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
          <Field label="Gross estate value">
            <Money v={v.estateValue} on={(x) => set({ estateValue: x })} />
          </Field>
          <Field label="Complexity">
            <select style={S.input} value={v.complexity} onChange={(e) => set({ complexity: e.target.value as ProbateComplexity })}>
              <option value="simple">Simple — uncontested, no real estate</option>
              <option value="moderate">Moderate — uncontested with real estate</option>
              <option value="contested">Contested — will contest or creditor litigation</option>
            </select>
          </Field>
          <Field label="Additional states with real property (ancillary probate)">
            <select style={S.input} value={v.ancillaryStates} onChange={(e) => set({ ancillaryStates: Number(e.target.value) })}>
              {[0, 1, 2, 3].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </Field>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Total probate cost</span>
            <span style={S.bigValue}>{fmtUSD(r.totalLow)}–{fmtUSD(r.totalHigh)}</span>
            <span style={S.bigSub}>
              Timeline: {r.timelineMonthsLow}–{r.timelineMonthsHigh} months
            </span>
          </div>

          {underSmallEstate && (
            <div style={S.warn}>
              <div style={S.warnLabel}>Small estate — you can likely skip full probate</div>
              <div style={S.warnLine}>
                {v.state.replace(/-/g, " ")} allows a small-estate affidavit for estates up to {fmtUSD(smallEstate)}. At {fmtUSD(v.estateValue)}, you qualify. Fees drop to under $1,000 and timeline to weeks, not months.
              </div>
            </div>
          )}

          <div style={S.breakdown}>
            <div style={S.breakdownTitle}>Cost breakdown</div>
            <div style={S.breakdownRow}><span style={S.breakdownLabel}>Attorney fees {r.statutoryScheme ? "(statutory)" : "(reasonable-fee)"}</span><span style={S.breakdownValue}>{fmtUSD(r.attorneyFeeLow)}–{fmtUSD(r.attorneyFeeHigh)}</span></div>
            <div style={S.breakdownRow}><span style={S.breakdownLabel}>Executor commission</span><span style={S.breakdownValue}>{fmtUSD(r.executorFeeLow)}–{fmtUSD(r.executorFeeHigh)}</span></div>
            <div style={S.breakdownRow}><span style={S.breakdownLabel}>Court filing + publication</span><span style={S.breakdownValue}>{fmtUSD(r.courtFeesLow)}–{fmtUSD(r.courtFeesHigh)}</span></div>
            {v.ancillaryStates > 0 && (
              <div style={S.breakdownRow}><span style={S.breakdownLabel}>Ancillary probate × {v.ancillaryStates}</span><span style={S.breakdownValue}>{fmtUSD(r.ancillaryFeeLow)}–{fmtUSD(r.ancillaryFeeHigh)}</span></div>
            )}
          </div>

          <div style={S.reasonBox}>
            <div style={S.reasonLabel}>{r.statuteCite ?? "State probate practice"}</div>
            <p style={S.reason}>{r.stateNote}</p>
          </div>

          <div style={S.savings}>
            <div style={S.savingsTitle}>What a living trust would have cost</div>
            <div style={S.savingsRow}>
              <span style={S.savingsLabel}>Trust setup cost</span>
              <span style={S.savingsValue}>{fmtUSD(r.trustAvoidanceCostLow)}–{fmtUSD(r.trustAvoidanceCostHigh)}</span>
            </div>
            <div style={S.savingsRow}>
              <span style={S.savingsLabel}>Net probate savings avoided</span>
              <span style={{ ...S.savingsValue, color: PRIMARY, fontWeight: 800 }}>{fmtUSD(r.savingsIfTrustLow)}–{fmtUSD(r.savingsIfTrustHigh)}</span>
            </div>
          </div>

          <div style={S.note}>
            Estimates only. Actual probate costs depend on estate composition, court backlog in your county, and creditor claims. Consult a licensed attorney in your state before acting on these numbers.
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
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#444" },
  input: { width: "100%", padding: "10px 12px", fontSize: "1rem", border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A" },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },

  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12, alignSelf: "start" },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 12, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "2rem", fontWeight: 800, color: PRIMARY, letterSpacing: "-0.02em" },
  bigSub: { fontSize: "0.85rem", color: "#666" },

  warn: { background: "#E4F4EF", border: "1px solid #B3DACC", borderRadius: 8, padding: 12 },
  warnLabel: { fontSize: "0.85rem", fontWeight: 700, color: PRIMARY, marginBottom: 4 },
  warnLine: { fontSize: "0.87rem", color: "#333", lineHeight: 1.55 },

  breakdown: { background: "#fff", border: "1px solid #E6F0EC", borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", gap: 4 },
  breakdownTitle: { fontSize: "0.72rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 4 },
  breakdownRow: { display: "flex", justifyContent: "space-between", fontSize: "0.85rem", padding: "3px 0" },
  breakdownLabel: { color: "#555" },
  breakdownValue: { fontWeight: 700, fontVariantNumeric: "tabular-nums", color: "#333" },

  reasonBox: { background: "#fff", border: "1px solid #E6F0EC", borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", gap: 6 },
  reasonLabel: { fontSize: "0.72rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: "0.03em" },
  reason: { margin: 0, fontSize: "0.87rem", lineHeight: 1.55, color: "#333" },

  savings: { background: "#F1F8F5", border: "1px solid #DCECE6", borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", gap: 4 },
  savingsTitle: { fontSize: "0.72rem", fontWeight: 700, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 4 },
  savingsRow: { display: "flex", justifyContent: "space-between", fontSize: "0.85rem", padding: "3px 0" },
  savingsLabel: { color: "#555" },
  savingsValue: { fontWeight: 700, fontVariantNumeric: "tabular-nums", color: "#333" },

  note: { fontSize: "0.8rem", color: "#5a6b66", background: "#F1F8F5", border: "1px solid #DCECE6", borderRadius: 8, padding: "10px 12px", lineHeight: 1.5 },
};
