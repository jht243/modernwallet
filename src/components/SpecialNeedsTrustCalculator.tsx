import { useMemo, useState } from "react";
import { recommendSNT, type FundingSource, type BenefitStatus } from "../lib/special-needs-trust";
import { fmtUSD } from "../lib/format";

interface Props {
  initialData?: Record<string, unknown>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS = {
  beneficiaryAge: 12,
  fundingSource: "family-member" as FundingSource,
  benefitStatus: "ssi" as BenefitStatus,
  fundingAmount: 250_000,
};

export default function SpecialNeedsTrustCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState({
    beneficiaryAge: n(initialData?.beneficiaryAge, DEFAULTS.beneficiaryAge),
    fundingSource: (initialData?.fundingSource as FundingSource) ?? DEFAULTS.fundingSource,
    benefitStatus: (initialData?.benefitStatus as BenefitStatus) ?? DEFAULTS.benefitStatus,
    fundingAmount: n(initialData?.fundingAmount, DEFAULTS.fundingAmount),
  });
  const r = useMemo(() => recommendSNT(v), [v]);
  const set = (p: Partial<typeof v>) => setV((s) => ({ ...s, ...p }));

  const typeLabel = r.recommended === "first-party" ? "First-party SNT (d)(4)(A)"
    : r.recommended === "pooled" ? "Pooled SNT (d)(4)(C)"
    : "Third-party SNT";

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
          <Field label="Beneficiary's current age">
            <input style={S.input} type="number" min={0} max={120} value={v.beneficiaryAge} onChange={(e) => set({ beneficiaryAge: Math.max(0, Math.min(120, parseInt(e.target.value) || 0)) })} />
          </Field>

          <Field label="Whose money is funding the trust?">
            <select style={S.input} value={v.fundingSource} onChange={(e) => set({ fundingSource: e.target.value as FundingSource })}>
              <option value="beneficiary-own">Beneficiary's own money (settlement, inheritance, back SSDI)</option>
              <option value="family-member">Family member's money (parent, grandparent, sibling)</option>
              <option value="small-modest">Small/modest amount (under $100k)</option>
            </select>
          </Field>

          <Field label="Current government benefits status">
            <select style={S.input} value={v.benefitStatus} onChange={(e) => set({ benefitStatus: e.target.value as BenefitStatus })}>
              <option value="ssi">SSI (needs-based)</option>
              <option value="ssdi">SSDI (insurance-based)</option>
              <option value="medicaid">Medicaid</option>
              <option value="multiple">SSI + Medicaid + more</option>
              <option value="none-yet">Not receiving benefits yet</option>
            </select>
          </Field>

          <Field label="Amount funding the trust">
            <div style={S.suffixWrap}>
              <span style={S.prefix}>$</span>
              <input style={{ ...S.input, paddingLeft: 22 }} inputMode="numeric" value={v.fundingAmount === 0 ? "" : v.fundingAmount.toLocaleString("en-US")} placeholder="0" onChange={(e) => set({ fundingAmount: parse(e.target.value) })} />
            </div>
          </Field>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Recommended trust type</span>
            <span style={S.bigValue}>{typeLabel}</span>
            <span style={S.bigSub}>{r.statuteCite}</span>
          </div>

          <div style={S.costBox}>
            <div style={S.costLabel}>Typical setup cost</div>
            <div style={S.costValue}>{fmtUSD(r.setupCostLow)} – {fmtUSD(r.setupCostHigh)}</div>
            <div style={S.costNote}>
              {r.medicaidPayback ? "Medicaid payback required from remaining trust funds at beneficiary's death." : "NO Medicaid payback — remainder passes to family beneficiaries you name."}
            </div>
          </div>

          <div style={S.reasonBox}>
            <div style={S.reasonLabel}>Why this recommendation</div>
            <p style={S.reason}>{r.reasoning}</p>
          </div>

          <div style={S.reasonBox}>
            <div style={S.reasonLabel}>Impact on benefits</div>
            <p style={S.reason}>{r.benefitsImpact}</p>
          </div>

          <div style={S.reasonBox}>
            <div style={S.reasonLabel}>Age eligibility</div>
            <p style={S.reason}>{r.ageLimit}</p>
          </div>

          <div style={S.lists}>
            <div style={S.list}>
              <div style={S.listTitle}>SNT CAN pay for</div>
              <ul style={S.ul}>{r.canPayFor.map((x) => <li key={x} style={S.li}>{x}</li>)}</ul>
            </div>
            <div style={S.list}>
              <div style={S.listTitle}>SNT CANNOT pay directly</div>
              <ul style={S.ul}>{r.cannotPayFor.map((x) => <li key={x} style={{ ...S.li, color: "#8A2A2A" }}>{x}</li>)}</ul>
            </div>
          </div>

          <div style={S.note}>
            Estimates only. Every SNT must be drafted by a licensed attorney experienced in special-needs planning — self-drafted trusts routinely disqualify the beneficiary from SSI/Medicaid. Cost ranges reflect 2026 US-attorney fee surveys and do not include ongoing trustee fees (~1% of assets/year for professional trustees).
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label style={S.field}><span style={S.label}>{label}</span>{children}</label>;
}
function parse(s: string): number { if (s === "") return 0; return Math.max(0, Number(s.replace(/[^0-9.]/g, "")) || 0); }
function n(x: unknown, d: number): number { const v = Number(x); return Number.isFinite(v) ? v : d; }

const PRIMARY = "#0E7C66";
const S: Record<string, React.CSSProperties> = {
  wrap: { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1A1A1A" },
  head: { marginBottom: 16 },
  heading: { fontSize: "1.2rem", fontWeight: 700 },
  subheading: { fontSize: "0.95rem", color: "#555", marginTop: 2 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 },
  inputs: { display: "flex", flexDirection: "column", gap: 14 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#444" },
  input: { width: "100%", padding: "10px 12px", fontSize: "1rem", border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A" },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },

  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12, alignSelf: "start" },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 12, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "1.4rem", fontWeight: 800, color: PRIMARY, letterSpacing: "-0.02em" },
  bigSub: { fontSize: "0.85rem", color: "#666", fontFamily: "ui-monospace, monospace" },

  costBox: { background: "#fff", border: "1px solid #E6F0EC", borderRadius: 8, padding: 12 },
  costLabel: { fontSize: "0.72rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: "0.03em" },
  costValue: { fontSize: "1.4rem", fontWeight: 800, color: "#1A1A1A", marginTop: 4 },
  costNote: { fontSize: "0.83rem", color: "#555", marginTop: 4, lineHeight: 1.4 },

  reasonBox: { background: "#fff", border: "1px solid #E6F0EC", borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", gap: 6 },
  reasonLabel: { fontSize: "0.72rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: "0.03em" },
  reason: { margin: 0, fontSize: "0.87rem", lineHeight: 1.55, color: "#333" },

  lists: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  list: { background: "#fff", border: "1px solid #E6F0EC", borderRadius: 8, padding: 12 },
  listTitle: { fontSize: "0.75rem", fontWeight: 700, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 6 },
  ul: { margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 3 },
  li: { fontSize: "0.83rem", color: "#333", lineHeight: 1.4 },

  note: { fontSize: "0.75rem", color: "#5a6b66", background: "#F1F8F5", border: "1px solid #DCECE6", borderRadius: 8, padding: "10px 12px", lineHeight: 1.55 },
};
