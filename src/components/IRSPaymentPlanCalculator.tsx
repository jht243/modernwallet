import { useMemo, useState } from "react";
import { computePaymentPlans, type PlanTier } from "../lib/irs-payment-plan";
import { fmtUSD } from "../lib/format";

// IRS Payment Plan island. Three tiers side-by-side: short-term (≤180 days), streamlined long-term
// (72 months), non-streamlined (up to CSED). Numbers grounded in src/lib/irs-payment-plan.ts.

interface Props {
  initialData?: Record<string, unknown>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS = {
  balance: 32000,
  monthlyCapacity: 450,
  householdSize: 2,
  region: "contiguous48" as const,
  annualIncome: 58000,
};

export default function IRSPaymentPlanCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState({
    balance: n(initialData?.balance, DEFAULTS.balance),
    monthlyCapacity: n(initialData?.monthlyCapacity, DEFAULTS.monthlyCapacity),
    householdSize: n(initialData?.householdSize, DEFAULTS.householdSize),
    region: (initialData?.region as "contiguous48" | "alaska" | "hawaii") ?? DEFAULTS.region,
    annualIncome: n(initialData?.annualIncome, DEFAULTS.annualIncome),
  });
  const r = useMemo(() => computePaymentPlans(v), [v]);
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
          <Field label="Balance owed (tax + penalties + interest)">
            <Money v={v.balance} on={(x) => set({ balance: x })} />
          </Field>
          <Field label="Monthly payment capacity">
            <Money v={v.monthlyCapacity} on={(x) => set({ monthlyCapacity: x })} />
          </Field>
          <div style={S.row2}>
            <Field label="Household size">
              <select style={S.input} value={v.householdSize} onChange={(e) => set({ householdSize: Number(e.target.value) })}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </Field>
            <Field label="Region">
              <select style={S.input} value={v.region} onChange={(e) => set({ region: e.target.value as typeof v.region })}>
                <option value="contiguous48">48 states + DC</option>
                <option value="alaska">Alaska</option>
                <option value="hawaii">Hawaii</option>
              </select>
            </Field>
          </div>
          <Field label="Annual income (for fee waiver check)">
            <Money v={v.annualIncome} on={(x) => set({ annualIncome: x })} />
          </Field>
          {r.lowIncomeCertification && (
            <div style={S.lowIncomeBadge}>
              Low Income Certification: setup fees waived / reduced to $43
            </div>
          )}
        </div>

        <div style={S.results}>
          {r.plans.map((p) => (
            <div key={p.tier} style={p.tier === r.recommendedTier ? { ...S.planCard, ...S.planCardRecommended } : S.planCard}>
              <div style={S.planHeader}>
                <span style={S.planName}>{tierLabel(p.tier)}</span>
                {p.tier === r.recommendedTier && <span style={S.badge}>Recommended</span>}
                {!p.eligible && <span style={S.badgeMuted}>Not eligible</span>}
              </div>
              <div style={S.planStatRow}>
                <PlanStat label="Monthly" value={`${fmtUSD(p.monthlyPayment)}`} />
                <PlanStat label="Term" value={`${p.termMonths} mo`} />
                <PlanStat label="Setup fee" value={p.setupFee === 0 ? "None" : `$${p.setupFee}`} />
              </div>
              <div style={S.planStatRow}>
                <PlanStat label="Interest" value={fmtUSD(p.totalInterest)} sub="over life of plan" />
                <PlanStat label="Penalty" value={fmtUSD(p.totalPenalty)} sub="failure-to-pay" />
                <PlanStat label="Total repaid" value={fmtUSD(p.totalRepayment)} strong />
              </div>
              <p style={S.planReason}>{p.reason}</p>
              <p style={S.planApply}>{p.howToApply}</p>
            </div>
          ))}
          <div style={S.note}>
            Interest = 7%/year (2026 Q3 IRS underpayment rate). FTP penalty = 0.5%/month standard, or
            0.25%/month once an installment agreement is approved (§6651(a)(2)). Estimates assume
            linear payoff; the IRS accrues on your actual outstanding balance.
          </div>
        </div>
      </div>
    </div>
  );
}

function tierLabel(t: PlanTier): string {
  return t === "short-term" ? "Short-term (≤ 180 days)" :
         t === "streamlined-long-term" ? "Streamlined online (≤ $50k, 72 months)" :
         "Non-streamlined (Form 433-F required)";
}

function PlanStat({ label, value, sub, strong }: { label: string; value: string; sub?: string; strong?: boolean }) {
  return (
    <div style={S.pstat}>
      <span style={S.pstatLabel}>{label}</span>
      <span style={{ ...S.pstatValue, fontWeight: strong ? 800 : 700, color: strong ? PRIMARY : "#333" }}>{value}</span>
      {sub && <span style={S.pstatSub}>{sub}</span>}
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
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#444" },
  input: { width: "100%", padding: "10px 12px", fontSize: "1rem", border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A" },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  lowIncomeBadge: { fontSize: "0.82rem", fontWeight: 600, color: PRIMARY, background: "#E4F4EF", border: "1px solid #B3DACC", borderRadius: 8, padding: "8px 10px", textAlign: "center" as const },

  results: { display: "flex", flexDirection: "column", gap: 12 },
  planCard: { background: "#fff", border: "1px solid #E6F0EC", borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 10 },
  planCardRecommended: { border: `2px solid ${PRIMARY}`, background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)" },
  planHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" },
  planName: { fontSize: "1rem", fontWeight: 700, color: "#1A1A1A" },
  badge: { fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 999, background: PRIMARY, color: "#fff" },
  badgeMuted: { fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 999, background: "#F5F5F5", color: "#888", border: "1px solid #E0E0E0" },

  planStatRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 },
  pstat: { display: "flex", flexDirection: "column", gap: 1 },
  pstatLabel: { fontSize: "0.7rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.03em" },
  pstatValue: { fontSize: "1rem", fontVariantNumeric: "tabular-nums" },
  pstatSub: { fontSize: "0.7rem", color: "#888" },

  planReason: { fontSize: "0.85rem", lineHeight: 1.55, color: "#444", margin: "4px 0 0" },
  planApply: { fontSize: "0.8rem", color: "#666", margin: 0, fontStyle: "italic" as const },

  note: { fontSize: "0.8rem", color: "#5a6b66", background: "#F1F8F5", border: "1px solid #DCECE6", borderRadius: 8, padding: "10px 12px", lineHeight: 1.5 },
};
