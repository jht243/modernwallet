import { useMemo, useState } from "react";
import { assessBackTaxesImpact, type Impact, type ImpactLevel } from "../lib/back-taxes-impact";
import { fmtUSD } from "../lib/format";

// Back Taxes Impact island. Plain-English impact grid across mortgage, credit, passport,
// professional licenses, wage garnishment. Numbers grounded in src/lib/back-taxes-impact.ts.

interface Props {
  initialData?: Record<string, unknown>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS = {
  balance: 45000,
  yearsSinceAssessment: 3,
  hasFederalTaxLien: false,
  onInstallmentAgreementWith3Payments: false,
  receivedIntentToLevy: false,
};

export default function BackTaxesImpactCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState({
    balance: n(initialData?.balance, DEFAULTS.balance),
    yearsSinceAssessment: n(initialData?.yearsSinceAssessment, DEFAULTS.yearsSinceAssessment),
    hasFederalTaxLien: b(initialData?.hasFederalTaxLien, DEFAULTS.hasFederalTaxLien),
    onInstallmentAgreementWith3Payments: b(initialData?.onInstallmentAgreementWith3Payments, DEFAULTS.onInstallmentAgreementWith3Payments),
    receivedIntentToLevy: b(initialData?.receivedIntentToLevy, DEFAULTS.receivedIntentToLevy),
  });
  const r = useMemo(() => assessBackTaxesImpact(v), [v]);
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
          <Field label="Balance owed to the IRS">
            <Money v={v.balance} on={(x) => set({ balance: x })} />
          </Field>
          <Field label="Years since tax was assessed">
            <select style={S.input} value={v.yearsSinceAssessment} onChange={(e) => set({ yearsSinceAssessment: Number(e.target.value) })}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </Field>
          <div style={S.sectionLabel}>IRS collection status</div>
          <label style={S.check}>
            <input type="checkbox" checked={v.hasFederalTaxLien} onChange={(e) => set({ hasFederalTaxLien: e.target.checked })} />
            <span>Notice of Federal Tax Lien filed</span>
          </label>
          <label style={S.check}>
            <input type="checkbox" checked={v.onInstallmentAgreementWith3Payments} onChange={(e) => set({ onInstallmentAgreementWith3Payments: e.target.checked })} />
            <span>On installment agreement, ≥ 3 on-time payments made</span>
          </label>
          <label style={S.check}>
            <input type="checkbox" checked={v.receivedIntentToLevy} onChange={(e) => set({ receivedIntentToLevy: e.target.checked })} />
            <span>Received Notice of Intent to Levy (Letter 1058 / LT11)</span>
          </label>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Estimated CSED remaining</span>
            <span style={S.bigValue}>{r.csedYearsRemaining} years</span>
            <span style={S.bigSub}>
              {r.seriouslyDelinquent ? "⚠ Balance ≥ $65k — Seriously Delinquent (passport risk)" : `Balance ${fmtUSD(v.balance)} · below $65k threshold`}
            </span>
          </div>

          <div style={S.impactList}>
            {r.impacts.map((imp, i) => (
              <ImpactCard key={i} impact={imp} />
            ))}
          </div>

          <div style={S.note}>
            CSED (Collection Statute Expiration Date) = 10 years from assessment under IRC §6502(a)(1).
            Pending OIC, IA request, bankruptcy, CDP appeal, and Innocent Spouse claims all pause the
            clock. If the CSED expires before you pay, the debt is written off — a real forgiveness path.
          </div>
        </div>
      </div>
    </div>
  );
}

function ImpactCard({ impact }: { impact: Impact }) {
  const style = levelStyle(impact.level);
  return (
    <div style={{ ...S.impactCard, ...style.card }}>
      <div style={S.impactHead}>
        <span style={{ ...S.impactBadge, ...style.badge }}>{levelLabel(impact.level)}</span>
        <span style={S.impactArea}>{areaLabel(impact.area)}</span>
      </div>
      <div style={S.impactHeadline}>{impact.headline}</div>
      <div style={S.impactDetail}>{impact.detail}</div>
    </div>
  );
}

function areaLabel(a: Impact["area"]): string {
  return a === "mortgage" ? "Mortgage" :
         a === "credit" ? "Credit report" :
         a === "passport" ? "Passport" :
         a === "professional-licenses" ? "Professional licenses" :
         a === "wage-garnishment" ? "Wage garnishment" : "Bank levy";
}
function levelLabel(l: ImpactLevel): string {
  return l === "clear" ? "Clear" : l === "flag" ? "Flag" : l === "block" ? "Blocked" : "Active";
}
function levelStyle(l: ImpactLevel): { card: React.CSSProperties; badge: React.CSSProperties } {
  if (l === "clear") return { card: { borderColor: "#B3DACC" }, badge: { background: "#E4F4EF", color: "#0E7C66" } };
  if (l === "flag") return { card: { borderColor: "#F0DDA5" }, badge: { background: "#FFF7E6", color: "#8A6A00" } };
  if (l === "block") return { card: { borderColor: "#EDC5C1" }, badge: { background: "#FBEAE9", color: "#8B2E24" } };
  return { card: { borderColor: "#EDC5C1" }, badge: { background: "#8B2E24", color: "#fff" } };
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

  impactList: { display: "flex", flexDirection: "column", gap: 10 },
  impactCard: { background: "#fff", border: "1px solid #E6F0EC", borderRadius: 10, padding: 12, display: "flex", flexDirection: "column", gap: 6 },
  impactHead: { display: "flex", alignItems: "center", gap: 8 },
  impactBadge: { fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 999 },
  impactArea: { fontSize: "0.75rem", fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: "0.03em" },
  impactHeadline: { fontSize: "0.95rem", fontWeight: 700, color: "#1A1A1A" },
  impactDetail: { fontSize: "0.85rem", lineHeight: 1.55, color: "#444" },

  note: { fontSize: "0.8rem", color: "#5a6b66", background: "#F1F8F5", border: "1px solid #DCECE6", borderRadius: 8, padding: "10px 12px", lineHeight: 1.5 },
};
