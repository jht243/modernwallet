import { useMemo, useState } from "react";
import { recommendEstatePlan, FEDERAL_ESTATE_EXEMPTION_2026 } from "../lib/estate-planning-hub";
import { fmtUSD } from "../lib/format";
import { STATES } from "../data/states";

// Estate Planning hub island. Six inputs → recommended plan + documents + attorney/DIY cost bands.

interface Props {
  initialData?: Record<string, unknown>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS = {
  married: true,
  kids: true,
  multipleStates: false,
  netWorth: 850000,
  state: "california",
  specialNeedsDependent: false,
};

export default function EstatePlanningHubCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState({
    married: b(initialData?.married, DEFAULTS.married),
    kids: b(initialData?.kids, DEFAULTS.kids),
    multipleStates: b(initialData?.multipleStates, DEFAULTS.multipleStates),
    netWorth: n(initialData?.netWorth, DEFAULTS.netWorth),
    state: (initialData?.state as string) ?? DEFAULTS.state,
    specialNeedsDependent: b(initialData?.specialNeedsDependent, DEFAULTS.specialNeedsDependent),
  });
  const r = useMemo(() => recommendEstatePlan(v), [v]);
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
          <Field label="Net worth (assets − debts)">
            <Money v={v.netWorth} on={(x) => set({ netWorth: x })} />
          </Field>
          <div style={S.sectionLabel}>Family situation</div>
          <label style={S.check}>
            <input type="checkbox" checked={v.married} onChange={(e) => set({ married: e.target.checked })} />
            <span>Married or in a committed partnership</span>
          </label>
          <label style={S.check}>
            <input type="checkbox" checked={v.kids} onChange={(e) => set({ kids: e.target.checked })} />
            <span>Minor children (need guardian nomination)</span>
          </label>
          <label style={S.check}>
            <input type="checkbox" checked={v.specialNeedsDependent} onChange={(e) => set({ specialNeedsDependent: e.target.checked })} />
            <span>Dependent with special needs (SSI/Medicaid recipient)</span>
          </label>
          <div style={S.sectionLabel}>Assets</div>
          <label style={S.check}>
            <input type="checkbox" checked={v.multipleStates} onChange={(e) => set({ multipleStates: e.target.checked })} />
            <span>Own real estate or business interests in more than one state</span>
          </label>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Recommended plan</span>
            <span style={S.bigValueSmall}>{r.name}</span>
            <span style={S.bigSub}>
              Attorney: {fmtUSD(r.costLow)}–{fmtUSD(r.costHigh)}
              {r.diyHigh > 0 && ` · DIY: ${r.diyLow === 0 ? "Free" : fmtUSD(r.diyLow)}${r.diyHigh > r.diyLow ? `–${fmtUSD(r.diyHigh)}` : ""}`}
            </span>
          </div>

          <div style={S.reasonBox}>
            <p style={S.reason}>{r.reason}</p>
          </div>

          <div style={S.docs}>
            <div style={S.docsLabel}>Documents recommended</div>
            <ul style={S.docsList}>
              {r.documents.map((d, i) => <li key={i} style={S.docItem}>{d}</li>)}
            </ul>
          </div>

          {(r.federalExposure > 0 || r.stateExposure > 0) && (
            <div style={S.warn}>
              <div style={S.warnLabel}>Estate tax exposure</div>
              {r.federalExposure > 0 && <div style={S.warnLine}>Federal: <strong>{fmtUSD(r.federalExposure)}</strong> above the 2026 $15M exemption · potential 40% tax on excess</div>}
              {r.stateExposure > 0 && <div style={S.warnLine}>State ({v.state}): <strong>{fmtUSD(r.stateExposure)}</strong> above state exemption · potential tax on excess</div>}
            </div>
          )}

          {r.stateInheritanceTax && (
            <div style={S.note}>
              <strong>Heads-up:</strong> {v.state.replace("-", " ")} has a state inheritance tax that could reduce what your heirs receive — separate from estate tax. Beneficiary class determines the rate.
            </div>
          )}

          <div style={S.note}>
            The 2026 federal estate tax exemption is <strong>{fmtUSD(FEDERAL_ESTATE_EXEMPTION_2026)}</strong> per individual (permanent under OBBBA, indexed). Married couples can shield up to $30M via portability. This calculator provides estimates only — attorney advice is recommended for anything above simple facts.
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
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 12, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValueSmall: { fontSize: "1.35rem", fontWeight: 800, color: PRIMARY, lineHeight: 1.25 },
  bigSub: { fontSize: "0.85rem", color: "#666", marginTop: 4 },

  reasonBox: { background: "#fff", border: "1px solid #E6F0EC", borderRadius: 8, padding: 12 },
  reason: { margin: 0, fontSize: "0.9rem", lineHeight: 1.55, color: "#333" },

  docs: { background: "#fff", border: "1px solid #E6F0EC", borderRadius: 8, padding: 12 },
  docsLabel: { fontSize: "0.72rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 6 },
  docsList: { margin: 0, paddingLeft: 20, lineHeight: 1.6, fontSize: "0.88rem", color: "#333" },
  docItem: { marginBottom: 4 },

  warn: { background: "#FBEAE9", border: "1px solid #EDC5C1", borderRadius: 8, padding: 12 },
  warnLabel: { fontSize: "0.72rem", fontWeight: 700, color: "#8B2E24", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 4 },
  warnLine: { fontSize: "0.87rem", color: "#8B2E24", marginBottom: 2 },

  note: { fontSize: "0.8rem", color: "#5a6b66", background: "#F1F8F5", border: "1px solid #DCECE6", borderRadius: 8, padding: "10px 12px", lineHeight: 1.5 },
};
