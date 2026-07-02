import { useMemo, useState } from "react";
import { computeOICFloor } from "../lib/oic";
import { fmtUSD } from "../lib/format";

// Offer in Compromise island. Applies IRS Form 656-B RCP math to compute the minimum viable offer
// for Lump-Sum Cash Offer (K=12) and Periodic Payment Offer (K=24). Every displayed number is
// grounded in src/lib/oic.ts — no black-box "estimate."

interface Props {
  initialData?: Record<string, unknown>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS = {
  totalDebt: 55000,
  cashOnHand: 3000,
  investments: 4000,
  retirementAccounts: 22000,
  realEstateEquity: 12000,
  vehicles: 15000,
  numberOfVehicles: 1,
  otherAssetsFMV: 0,
  loansAgainstAssets: 0,
  monthlyIncome: 5200,
  monthlyAllowableExpenses: 4700,
  householdSize: 3,
  region: "contiguous48" as const,
};

export default function OfferInCompromiseCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState({
    totalDebt: n(initialData?.totalDebt, DEFAULTS.totalDebt),
    cashOnHand: n(initialData?.cashOnHand, DEFAULTS.cashOnHand),
    investments: n(initialData?.investments, DEFAULTS.investments),
    retirementAccounts: n(initialData?.retirementAccounts, DEFAULTS.retirementAccounts),
    realEstateEquity: n(initialData?.realEstateEquity, DEFAULTS.realEstateEquity),
    vehicles: n(initialData?.vehicles, DEFAULTS.vehicles),
    numberOfVehicles: n(initialData?.numberOfVehicles, DEFAULTS.numberOfVehicles),
    otherAssetsFMV: n(initialData?.otherAssetsFMV, DEFAULTS.otherAssetsFMV),
    loansAgainstAssets: n(initialData?.loansAgainstAssets, DEFAULTS.loansAgainstAssets),
    monthlyIncome: n(initialData?.monthlyIncome, DEFAULTS.monthlyIncome),
    monthlyAllowableExpenses: n(initialData?.monthlyAllowableExpenses, DEFAULTS.monthlyAllowableExpenses),
    householdSize: n(initialData?.householdSize, DEFAULTS.householdSize),
    region: (initialData?.region as "contiguous48" | "alaska" | "hawaii") ?? DEFAULTS.region,
  });
  const r = useMemo(() => computeOICFloor(v), [v]);
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
          <Field label="Total tax debt owed (tax + penalties + interest)">
            <Money v={v.totalDebt} on={(x) => set({ totalDebt: x })} />
          </Field>

          <div style={S.sectionLabel}>Assets — enter fair market value; IRS discounts apply</div>
          <div style={S.row2}>
            <Field label="Cash + bank accounts">
              <Money v={v.cashOnHand} on={(x) => set({ cashOnHand: x })} />
            </Field>
            <Field label="Taxable investments">
              <Money v={v.investments} on={(x) => set({ investments: x })} />
            </Field>
          </div>
          <div style={S.row2}>
            <Field label="Retirement accounts (401k, IRA)">
              <Money v={v.retirementAccounts} on={(x) => set({ retirementAccounts: x })} />
            </Field>
            <Field label="Home equity (FMV − mortgage)">
              <Money v={v.realEstateEquity} on={(x) => set({ realEstateEquity: x })} />
            </Field>
          </div>
          <div style={S.row2}>
            <Field label="Vehicle FMV (up to 2)">
              <Money v={v.vehicles} on={(x) => set({ vehicles: x })} />
            </Field>
            <Field label="# vehicles (exempt)">
              <select style={S.input} value={v.numberOfVehicles} onChange={(e) => set({ numberOfVehicles: Number(e.target.value) })}>
                <option value={0}>0</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
              </select>
            </Field>
          </div>
          <div style={S.row2}>
            <Field label="Other assets (life insurance, business)">
              <Money v={v.otherAssetsFMV} on={(x) => set({ otherAssetsFMV: x })} />
            </Field>
            <Field label="Additional loans against assets">
              <Money v={v.loansAgainstAssets} on={(x) => set({ loansAgainstAssets: x })} />
            </Field>
          </div>

          <div style={S.sectionLabel}>Income & allowable expenses (Collection Financial Standards)</div>
          <div style={S.row2}>
            <Field label="Monthly household income">
              <Money v={v.monthlyIncome} on={(x) => set({ monthlyIncome: x })} />
            </Field>
            <Field label="Allowable monthly expenses">
              <Money v={v.monthlyAllowableExpenses} on={(x) => set({ monthlyAllowableExpenses: x })} />
            </Field>
          </div>
          <div style={S.row2}>
            <Field label="Household size">
              <select style={S.input} value={v.householdSize} onChange={(e) => set({ householdSize: Number(e.target.value) })}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </Field>
            <Field label="Region (poverty guidelines)">
              <select style={S.input} value={v.region} onChange={(e) => set({ region: e.target.value as typeof v.region })}>
                <option value="contiguous48">48 states + DC</option>
                <option value="alaska">Alaska</option>
                <option value="hawaii">Hawaii</option>
              </select>
            </Field>
          </div>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Suggested lump-sum offer floor</span>
            <span style={S.bigValue}>{fmtUSD(r.suggestedOfferLumpSum)}</span>
            <span style={S.bigSub}>
              paid in ≤ 5 installments within 5 months
            </span>
          </div>

          <div style={S.viabilityRow}>
            {r.oicViable ? (
              <div style={{ ...S.pill, ...S.pillGood }}>
                OIC viable — ${fmtNum(r.savingsVsDebtLumpSum)} below the ${fmtNum(v.totalDebt)} balance
              </div>
            ) : (
              <div style={{ ...S.pill, ...S.pillWarn }}>
                RCP ≥ debt — IRS unlikely to accept an OIC; consider an installment agreement instead
              </div>
            )}
          </div>

          <div style={S.statRow}>
            <Stat label="Lump-sum RCP" value={fmtUSD(r.rcpLumpSum)} />
            <Stat label="Periodic RCP (6–24 mo)" value={fmtUSD(r.rcpPeriodic)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Net Realizable Equity" value={fmtUSD(r.nre)} />
            <Stat label="Remaining monthly income" value={fmtUSD(r.remainingMonthlyIncome)} />
          </div>

          <div style={S.breakdown}>
            <div style={S.breakdownTitle}>Asset breakdown (after IRS discounts)</div>
            <BreakdownRow label="Cash (net of 1-mo expenses)" value={r.breakdown.cashNRE} />
            <BreakdownRow label="Taxable investments (100%)" value={r.breakdown.investmentsNRE} />
            <BreakdownRow label="Retirement (72% after tax + penalty)" value={r.breakdown.retirementNRE} />
            <BreakdownRow label="Real estate (80% QSV)" value={r.breakdown.realEstateNRE} />
            <BreakdownRow label="Vehicles (80% QSV − exemption)" value={r.breakdown.vehiclesNRE} />
            <BreakdownRow label="Other assets (80% QSV)" value={r.breakdown.otherNRE} />
            {r.breakdown.lessAdditionalLoans > 0 && (
              <BreakdownRow label="Less: additional loans" value={-r.breakdown.lessAdditionalLoans} />
            )}
          </div>

          <div style={S.feeRow}>
            <span style={S.feeLabel}>Application fee</span>
            {r.applicationFee === 0 ? (
              <span style={S.feeWaived}>Waived — Low Income Certification ({v.householdSize}-person household)</span>
            ) : (
              <span style={S.feeAmount}>${r.applicationFee}</span>
            )}
          </div>

          <div style={S.note}>
            The IRS accepted 7,199 of 33,591 offers in FY2025 — a 21.4% acceptance rate. Offers built to
            the RCP floor above have a real shot, but the IRS re-runs this math on your Form 433-A(OIC).
          </div>
        </div>
      </div>
    </div>
  );
}

function BreakdownRow({ label, value }: { label: string; value: number }) {
  return (
    <div style={S.breakdownRow}>
      <span style={S.breakdownLabel}>{label}</span>
      <span style={{ ...S.breakdownValue, color: value < 0 ? "#B44" : "#333" }}>
        {value < 0 ? "−" : ""}{fmtUSD(Math.abs(value))}
      </span>
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
function Stat({ label, value }: { label: string; value: string }) {
  return <div style={S.stat}><span style={S.statLabel}>{label}</span><span style={S.statValue}>{value}</span></div>;
}
function parse(s: string): number { if (s === "") return 0; return Math.max(0, Number(s.replace(/[^0-9.]/g, "")) || 0); }
function n(x: unknown, d: number): number { const v = Number(x); return Number.isFinite(v) ? v : d; }
function fmtNum(n: number): string { return Math.round(n).toLocaleString("en-US"); }

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
  sectionLabel: { fontSize: "0.75rem", fontWeight: 700, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 6, borderTop: "1px solid #E6F0EC", paddingTop: 10 },

  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 14, alignSelf: "start" },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 12, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "2rem", fontWeight: 800, color: PRIMARY, letterSpacing: "-0.02em" },
  bigSub: { fontSize: "0.85rem", color: "#666" },

  viabilityRow: { display: "flex" },
  pill: { fontSize: "0.85rem", fontWeight: 600, padding: "8px 12px", borderRadius: 999, width: "100%", textAlign: "center" as const },
  pillGood: { background: "#E4F4EF", color: PRIMARY, border: "1px solid #B3DACC" },
  pillWarn: { background: "#FFF7E6", color: "#8A6A00", border: "1px solid #F0DDA5" },

  statRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  stat: { display: "flex", flexDirection: "column", gap: 1 },
  statLabel: { fontSize: "0.75rem", color: "#666" },
  statValue: { fontSize: "1rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" },

  breakdown: { background: "#fff", border: "1px solid #E6F0EC", borderRadius: 8, padding: 10, display: "flex", flexDirection: "column", gap: 4 },
  breakdownTitle: { fontSize: "0.75rem", fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 4 },
  breakdownRow: { display: "flex", justifyContent: "space-between", fontSize: "0.85rem", padding: "3px 0" },
  breakdownLabel: { color: "#555" },
  breakdownValue: { fontWeight: 700, fontVariantNumeric: "tabular-nums", color: "#333" },

  feeRow: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", border: "1px solid #E6F0EC", borderRadius: 8, padding: "10px 12px" },
  feeLabel: { fontSize: "0.85rem", fontWeight: 600, color: "#555" },
  feeAmount: { fontSize: "0.95rem", fontWeight: 700, color: PRIMARY, fontVariantNumeric: "tabular-nums" },
  feeWaived: { fontSize: "0.82rem", fontWeight: 600, color: PRIMARY },

  note: { fontSize: "0.8rem", color: "#5a6b66", background: "#F1F8F5", border: "1px solid #DCECE6", borderRadius: 8, padding: "10px 12px", lineHeight: 1.5 },
};
