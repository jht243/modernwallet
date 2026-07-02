import { useMemo, useState } from "react";
import { computeEstateTax, type FilingStatus } from "../lib/estate-tax";
import { fmtUSD } from "../lib/format";
import { STATES } from "../data/states";

// Estate Tax island. Net worth + state + filing status → federal + state estate tax exposure.

interface Props {
  initialData?: Record<string, unknown>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS = {
  netWorth: 8_500_000,
  state: "new-york",
  filingStatus: "married" as FilingStatus,
};

export default function EstateTaxCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState({
    netWorth: n(initialData?.netWorth, DEFAULTS.netWorth),
    state: (initialData?.state as string) ?? DEFAULTS.state,
    filingStatus: (initialData?.filingStatus as FilingStatus) ?? DEFAULTS.filingStatus,
  });
  const r = useMemo(() => computeEstateTax(v), [v]);
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
          <Field label="Net worth (gross estate)">
            <Money v={v.netWorth} on={(x) => set({ netWorth: x })} />
          </Field>
          <Field label="Filing status">
            <select style={S.input} value={v.filingStatus} onChange={(e) => set({ filingStatus: e.target.value as FilingStatus })}>
              <option value="single">Single ($15M federal exemption)</option>
              <option value="married">Married ($30M combined with portability)</option>
            </select>
          </Field>
          <Field label="State">
            <select style={S.input} value={v.state} onChange={(e) => set({ state: e.target.value })}>
              {STATES.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
            </select>
          </Field>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Total estate tax owed</span>
            <span style={S.bigValue}>{fmtUSD(r.totalTax)}</span>
            <span style={S.bigSub}>To heirs: {fmtUSD(r.toHeirs)}</span>
          </div>

          <div style={S.breakdown}>
            <div style={S.breakdownTitle}>Federal (IRC §2010)</div>
            <div style={S.breakdownRow}><span style={S.breakdownLabel}>Effective exemption</span><span style={S.breakdownValue}>{fmtUSD(r.effectiveFederalExemption)}</span></div>
            <div style={S.breakdownRow}><span style={S.breakdownLabel}>Taxable estate</span><span style={S.breakdownValue}>{fmtUSD(r.federalTaxable)}</span></div>
            <div style={S.breakdownRow}><span style={S.breakdownLabel}>Federal tax (40% flat)</span><span style={S.breakdownValue}>{fmtUSD(r.federalTax)}</span></div>
          </div>

          <div style={S.breakdown}>
            <div style={S.breakdownTitle}>State</div>
            {r.stateExemption > 0 ? (
              <>
                <div style={S.breakdownRow}><span style={S.breakdownLabel}>State exemption</span><span style={S.breakdownValue}>{fmtUSD(r.stateExemption)}</span></div>
                <div style={S.breakdownRow}><span style={S.breakdownLabel}>State taxable estate</span><span style={S.breakdownValue}>{fmtUSD(r.stateTaxable)}</span></div>
                <div style={S.breakdownRow}><span style={S.breakdownLabel}>State estate tax</span><span style={S.breakdownValue}>{fmtUSD(r.stateTax)}</span></div>
              </>
            ) : (
              <div style={S.breakdownRow}><span style={S.breakdownLabel}>No state estate tax</span><span style={S.breakdownValue}>—</span></div>
            )}
          </div>

          {r.nyCliff && (
            <div style={S.warn}>
              <div style={S.warnLabel}>⚠ NY estate tax cliff triggered</div>
              <div style={S.warnLine}>Your estate exceeds 105% of the New York exemption ($7.35M × 1.05 = $7.72M), so the entire estate is taxed from dollar one — not just the excess. Consider gifting or trust planning before death to bring the taxable estate below the cliff.</div>
            </div>
          )}

          {r.stateInheritanceTax && (
            <div style={S.note}>
              <strong>Heads-up:</strong> {v.state.replace(/-/g, " ")} also has a state inheritance tax that beneficiaries pay separately — the amount depends on beneficiary class. Not included in the total above.
            </div>
          )}

          <div style={S.note}>
            2026 federal exemption per OBBBA (P.L. 119-21) is <strong>$15M per individual</strong>, permanent and indexed. Married couples shield up to $30M via portability (Form 706 election). Rate is 40% flat on the excess. The annual gift-tax exclusion is $19,000 per donee, and the GST exemption mirrors at $15M.
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

  breakdown: { background: "#fff", border: "1px solid #E6F0EC", borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", gap: 4 },
  breakdownTitle: { fontSize: "0.72rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 4 },
  breakdownRow: { display: "flex", justifyContent: "space-between", fontSize: "0.85rem", padding: "3px 0" },
  breakdownLabel: { color: "#555" },
  breakdownValue: { fontWeight: 700, fontVariantNumeric: "tabular-nums", color: "#333" },

  warn: { background: "#FBEAE9", border: "1px solid #EDC5C1", borderRadius: 8, padding: 12 },
  warnLabel: { fontSize: "0.85rem", fontWeight: 700, color: "#8B2E24", marginBottom: 4 },
  warnLine: { fontSize: "0.87rem", color: "#8B2E24", lineHeight: 1.5 },

  note: { fontSize: "0.8rem", color: "#5a6b66", background: "#F1F8F5", border: "1px solid #DCECE6", borderRadius: 8, padding: "10px 12px", lineHeight: 1.5 },
};
