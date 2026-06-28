import { useMemo, useState } from "react";
import { computeRental, type RentalInput } from "../lib/rental";
import { fmtUSD, fmtPct, fmtNum } from "../lib/format";

// RealEstateIQ island. Reads initial inputs from the `initialData` prop (the page preset).
// Fully standalone — no external host coupling.

interface Props {
  initialData?: Partial<RentalInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: RentalInput = {
  purchasePrice: 350000,
  downPaymentPct: 25,
  closingCostsPct: 3,
  rehabCost: 0,
  interestRatePct: 7,
  loanTermYears: 30,
  monthlyRent: 2800,
  otherMonthlyIncome: 0,
  vacancyRatePct: 5,
  propertyTaxAnnual: 4200,
  insuranceAnnual: 1500,
  hoaMonthly: 0,
  maintenancePctOfRent: 8,
  managementPctOfRent: 8,
  otherMonthlyExpenses: 0,
  appreciationPct: 3,
  rentGrowthPct: 2,
  expenseGrowthPct: 2,
  sellingCostsPct: 7,
  holdYears: 20,
};

export default function RentalCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<RentalInput>({ ...DEFAULTS, ...initialData });
  const [showProjection, setShowProjection] = useState(false);
  const r = useMemo(() => computeRental(input), [input]);

  const set = (patch: Partial<RentalInput>) => setInput((s) => ({ ...s, ...patch }));
  const cfPositive = (r.annualCashFlow ?? 0) >= 0;

  return (
    <div style={S.wrap}>
      {(heading || subheading) && (
        <div style={S.head}>
          {heading && <div style={S.heading}>{heading}</div>}
          {subheading && <div style={S.subheading}>{subheading}</div>}
        </div>
      )}

      <div style={S.grid}>
        {/* Inputs */}
        <div style={S.inputs}>
          <Group label="Purchase">
            <Field label="Purchase price"><Money v={input.purchasePrice} on={(v) => set({ purchasePrice: v })} /></Field>
            <div style={S.row2}>
              <Field label="Down payment %"><Pct v={input.downPaymentPct} on={(v) => set({ downPaymentPct: v })} /></Field>
              <Field label="Closing costs %"><Pct v={input.closingCostsPct ?? 0} on={(v) => set({ closingCostsPct: v })} /></Field>
            </div>
            <div style={S.row2}>
              <Field label="Interest rate %"><Pct v={input.interestRatePct} on={(v) => set({ interestRatePct: v })} /></Field>
              <Field label="Loan term (yrs)"><Plain v={input.loanTermYears} on={(v) => set({ loanTermYears: v })} /></Field>
            </div>
          </Group>

          <Group label="Income">
            <div style={S.row2}>
              <Field label="Monthly rent"><Money v={input.monthlyRent} on={(v) => set({ monthlyRent: v })} /></Field>
              <Field label="Vacancy %"><Pct v={input.vacancyRatePct ?? 0} on={(v) => set({ vacancyRatePct: v })} /></Field>
            </div>
          </Group>

          <Group label="Operating expenses">
            <div style={S.row2}>
              <Field label="Property tax / yr"><Money v={input.propertyTaxAnnual ?? 0} on={(v) => set({ propertyTaxAnnual: v })} /></Field>
              <Field label="Insurance / yr"><Money v={input.insuranceAnnual ?? 0} on={(v) => set({ insuranceAnnual: v })} /></Field>
            </div>
            <div style={S.row2}>
              <Field label="Maintenance % of rent"><Pct v={input.maintenancePctOfRent ?? 0} on={(v) => set({ maintenancePctOfRent: v })} /></Field>
              <Field label="Management % of rent"><Pct v={input.managementPctOfRent ?? 0} on={(v) => set({ managementPctOfRent: v })} /></Field>
            </div>
            <Field label="HOA / month"><Money v={input.hoaMonthly ?? 0} on={(v) => set({ hoaMonthly: v })} /></Field>
          </Group>
        </div>

        {/* Results */}
        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Monthly cash flow</span>
            <span style={{ ...S.bigValue, color: cfPositive ? PRIMARY : NEGATIVE }}>{fmtUSD(r.monthlyCashFlow)}</span>
            <span style={S.bigSub}>{fmtUSD(r.annualCashFlow)} / year after the mortgage & all expenses</span>
          </div>

          <div style={S.statRow}>
            <Stat label="Cap rate" value={fmtPct(r.capRate, 2)} />
            <Stat label="Cash-on-cash" value={fmtPct(r.cashOnCashReturn, 2)} />
          </div>
          <div style={S.statRow}>
            <Stat label="NOI / year" value={fmtUSD(r.noi)} />
            <Stat label="DSCR" value={r.dscr == null ? "—" : fmtNum(r.dscr, 2)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Cash invested" value={fmtUSD(r.cashInvested)} />
            <Stat label="Monthly P&I" value={fmtUSD(r.monthlyPI)} />
          </div>

          <div style={S.miniNote}>
            1% rule: rent is <strong>{fmtPct(r.onePercentRatio, 2)}</strong> of price
            {(r.onePercentRatio ?? 0) >= 1 ? " — meets the 1% rule." : " — below the 1% guideline."}
          </div>

          {r.projection.length > 0 && (
            <button style={S.toggle} type="button" onClick={() => setShowProjection((v) => !v)}>
              {showProjection ? "Hide" : "Show"} {r.projection.length}-year projection
            </button>
          )}
        </div>
      </div>

      {showProjection && r.projection.length > 0 && (
        <div style={S.proj}>
          <div style={S.projSummary}>
            <Stat label={`Value in year ${r.projection.length}`} value={fmtUSD(r.projection[r.projection.length - 1].propertyValue)} />
            <Stat label="Net sale proceeds" value={fmtUSD(r.saleProceedsAtHorizon)} />
            <Stat label="Total profit" value={fmtUSD(r.totalProfitAtHorizon)} />
            <Stat label="Annualized IRR" value={fmtPct(r.irr, 2)} />
          </div>
          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead><tr>
                <th style={S.th}>Yr</th>
                <th style={{ ...S.th, ...S.right }}>Cash flow</th>
                <th style={{ ...S.th, ...S.right }}>Property value</th>
                <th style={{ ...S.th, ...S.right }}>Loan balance</th>
                <th style={{ ...S.th, ...S.right }}>Equity</th>
              </tr></thead>
              <tbody>
                {r.projection.filter((p) => p.year <= 5 || p.year % 5 === 0).map((p) => (
                  <tr key={p.year}>
                    <td style={S.td}>{p.year}</td>
                    <td style={{ ...S.td, ...S.right }}>{fmtUSD(p.cashFlow)}</td>
                    <td style={{ ...S.td, ...S.right }}>{fmtUSD(p.propertyValue)}</td>
                    <td style={{ ...S.td, ...S.right }}>{fmtUSD(p.loanBalance)}</td>
                    <td style={{ ...S.td, ...S.right }}>{fmtUSD(p.equity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset style={S.group}>
      <legend style={S.legend}>{label}</legend>
      <div style={S.groupBody}>{children}</div>
    </fieldset>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label style={S.field}><span style={S.label}>{label}</span>{children}</label>;
}
function Money({ v, on }: { v: number; on: (n: number) => void }) {
  return (
    <div style={S.suffixWrap}>
      <span style={S.prefix}>$</span>
      <input style={{ ...S.input, paddingLeft: 22 }} inputMode="numeric"
        value={v === 0 ? "" : v.toLocaleString("en-US")} placeholder="0"
        onChange={(e) => on(parseNum(e.target.value))} />
    </div>
  );
}
function Pct({ v, on }: { v: number; on: (n: number) => void }) {
  return (
    <div style={S.suffixWrap}>
      <input style={S.input} inputMode="decimal" value={v} onChange={(e) => on(parseNum(e.target.value))} />
      <span style={S.suffix}>%</span>
    </div>
  );
}
function Plain({ v, on }: { v: number; on: (n: number) => void }) {
  return <input style={S.input} inputMode="numeric" value={v} onChange={(e) => on(parseNum(e.target.value))} />;
}
function Stat({ label, value }: { label: string; value: string }) {
  return <div style={S.stat}><span style={S.statLabel}>{label}</span><span style={S.statValue}>{value}</span></div>;
}
function parseNum(s: string): number {
  if (s === "") return 0;
  return Math.max(0, Number(s.replace(/[^0-9.]/g, "")) || 0);
}

const PRIMARY = "#0E7C66";
const NEGATIVE = "#C0392B";
const S: Record<string, React.CSSProperties> = {
  wrap: { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1A1A1A" },
  head: { marginBottom: 16 },
  heading: { fontSize: "1.2rem", fontWeight: 700 },
  subheading: { fontSize: "0.95rem", color: "#555", marginTop: 2 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 },
  inputs: { display: "flex", flexDirection: "column", gap: 14 },
  group: { border: "1px solid #E2EDE9", borderRadius: 12, padding: "8px 14px 14px", margin: 0 },
  legend: { fontSize: "0.78rem", fontWeight: 700, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em", padding: "0 6px" },
  groupBody: { display: "flex", flexDirection: "column", gap: 10 },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: "0.8rem", fontWeight: 600, color: "#444" },
  input: { width: "100%", padding: "9px 12px", fontSize: "0.98rem", border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A" },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  suffix: { position: "absolute", right: 12, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12, alignSelf: "start" },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 10, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "1.9rem", fontWeight: 800, letterSpacing: "-0.02em" },
  bigSub: { fontSize: "0.82rem", color: "#777" },
  statRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  stat: { display: "flex", flexDirection: "column", gap: 1 },
  statLabel: { fontSize: "0.78rem", color: "#666" },
  statValue: { fontSize: "1.12rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  miniNote: { fontSize: "0.82rem", color: "#5a6b66", background: "#F1F8F5", border: "1px solid #DCECE6", borderRadius: 8, padding: "8px 10px" },
  toggle: { marginTop: 2, padding: "9px 12px", border: "1px solid #CFE3DC", background: "#fff", borderRadius: 8, fontSize: "0.88rem", fontWeight: 600, color: PRIMARY, cursor: "pointer" },
  proj: { marginTop: 18 },
  projSummary: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 12, padding: 14, background: "#F6FBF9", border: "1px solid #E0EFE9", borderRadius: 10 },
  tableWrap: { overflowX: "auto", border: "1px solid #EAEFED", borderRadius: 10 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" },
  th: { textAlign: "left", padding: "10px 12px", background: "#F4FAF8", fontWeight: 700, color: "#2A6A58", borderBottom: "1px solid #E0EBE7" },
  td: { padding: "8px 12px", borderBottom: "1px solid #F0F4F2", fontVariantNumeric: "tabular-nums" },
  right: { textAlign: "right" },
};
