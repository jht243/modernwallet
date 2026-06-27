import { useMemo, useState } from "react";
import { carAffordability, homeAffordability } from "../lib/affordability";
import { fmtUSD } from "../lib/format";

// "What can I afford?" island. kind="car" (monthly budget → max price) or kind="home" (28/36 DTI → max price).
interface Props {
  initialData?: Record<string, unknown> & { kind?: "car" | "home" };
  heading?: string;
  subheading?: string;
}

export default function AffordabilityCalculator({ initialData, heading, subheading }: Props) {
  const kind = (initialData?.kind as "car" | "home") ?? "car";
  return (
    <div style={S.wrap}>
      {(heading || subheading) && (
        <div style={S.head}>
          {heading && <div style={S.heading}>{heading}</div>}
          {subheading && <div style={S.subheading}>{subheading}</div>}
        </div>
      )}
      {kind === "home" ? <Home data={initialData} /> : <Car data={initialData} />}
    </div>
  );
}

function Car({ data }: { data?: Record<string, unknown> }) {
  const [v, setV] = useState({
    monthlyBudget: n(data?.monthlyBudget, 450),
    downPayment: n(data?.downPayment, 3000),
    tradeInValue: n(data?.tradeInValue, 0),
    interestRatePct: n(data?.interestRatePct, 7.5),
    loanTermMonths: n(data?.loanTermMonths, 60),
  });
  const r = useMemo(() => carAffordability(v), [v]);
  const set = (p: Partial<typeof v>) => setV((s) => ({ ...s, ...p }));
  return (
    <div style={S.grid}>
      <div style={S.inputs}>
        <Field label="Monthly payment budget"><Money v={v.monthlyBudget} on={(x) => set({ monthlyBudget: x })} /></Field>
        <div style={S.row2}>
          <Field label="Down payment"><Money v={v.downPayment} on={(x) => set({ downPayment: x })} /></Field>
          <Field label="Trade-in value"><Money v={v.tradeInValue} on={(x) => set({ tradeInValue: x })} /></Field>
        </div>
        <div style={S.row2}>
          <Field label="Interest rate %"><Pct v={v.interestRatePct} on={(x) => set({ interestRatePct: x })} /></Field>
          <Field label="Loan term">
            <select style={S.input} value={v.loanTermMonths} onChange={(e) => set({ loanTermMonths: Number(e.target.value) })}>
              {[36, 48, 60, 72, 84].map((t) => <option key={t} value={t}>{t} months</option>)}
            </select>
          </Field>
        </div>
      </div>
      <div style={S.results}>
        <div style={S.bigStat}>
          <span style={S.bigLabel}>Car you can afford</span>
          <span style={S.bigValue}>{fmtUSD(r.maxVehiclePrice)}</span>
          <span style={S.bigSub}>at {fmtUSD(v.monthlyBudget)}/mo for {v.loanTermMonths} months</span>
        </div>
        <div style={S.statRow}>
          <Stat label="Max loan amount" value={fmtUSD(r.maxLoanAmount)} />
          <Stat label="Total interest" value={fmtUSD(r.totalInterest)} />
        </div>
        <div style={S.note}>This is the sticker price you can finance. Budget extra for taxes, registration, and insurance on top.</div>
      </div>
    </div>
  );
}

function Home({ data }: { data?: Record<string, unknown> }) {
  const [v, setV] = useState({
    annualIncome: n(data?.annualIncome, 90000),
    monthlyDebts: n(data?.monthlyDebts, 400),
    downPayment: n(data?.downPayment, 40000),
    interestRatePct: n(data?.interestRatePct, 6.5),
    loanTermYears: n(data?.loanTermYears, 30),
  });
  const r = useMemo(() => homeAffordability(v), [v]);
  const set = (p: Partial<typeof v>) => setV((s) => ({ ...s, ...p }));
  return (
    <div style={S.grid}>
      <div style={S.inputs}>
        <Field label="Gross annual income"><Money v={v.annualIncome} on={(x) => set({ annualIncome: x })} /></Field>
        <div style={S.row2}>
          <Field label="Monthly debt payments"><Money v={v.monthlyDebts} on={(x) => set({ monthlyDebts: x })} /></Field>
          <Field label="Down payment"><Money v={v.downPayment} on={(x) => set({ downPayment: x })} /></Field>
        </div>
        <div style={S.row2}>
          <Field label="Interest rate %"><Pct v={v.interestRatePct} on={(x) => set({ interestRatePct: x })} /></Field>
          <Field label="Loan term">
            <select style={S.input} value={v.loanTermYears} onChange={(e) => set({ loanTermYears: Number(e.target.value) })}>
              {[15, 20, 30].map((t) => <option key={t} value={t}>{t} years</option>)}
            </select>
          </Field>
        </div>
      </div>
      <div style={S.results}>
        <div style={S.bigStat}>
          <span style={S.bigLabel}>Home you can afford</span>
          <span style={S.bigValue}>{fmtUSD(r.maxHomePrice)}</span>
          <span style={S.bigSub}>{fmtUSD(r.maxMonthlyPayment)}/mo budget · capped by your {r.limitedBy}</span>
        </div>
        <div style={S.statRow}>
          <Stat label="Loan amount" value={fmtUSD(r.maxLoanAmount)} />
          <Stat label="Principal & interest" value={fmtUSD(r.principalInterest)} />
        </div>
        <div style={S.statRow}>
          <Stat label="Est. taxes/mo" value={fmtUSD(r.monthlyTax)} />
          <Stat label="Est. insurance + PMI/mo" value={fmtUSD((r.monthlyInsurance ?? 0) + (r.monthlyPMI ?? 0))} />
        </div>
        <div style={S.note}>Based on the 28/36 rule: housing ≤ 28% of gross income, total debt ≤ 36%. Lenders vary, and a budget you're comfortable with may be lower.</div>
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
function Pct({ v, on }: { v: number; on: (n: number) => void }) {
  return <div style={S.suffixWrap}><input style={S.input} inputMode="decimal" value={v} onChange={(e) => on(parse(e.target.value))} /><span style={S.suffix}>%</span></div>;
}
function Stat({ label, value }: { label: string; value: string }) {
  return <div style={S.stat}><span style={S.statLabel}>{label}</span><span style={S.statValue}>{value}</span></div>;
}
function parse(s: string): number { if (s === "") return 0; return Math.max(0, Number(s.replace(/[^0-9.]/g, "")) || 0); }
function n(x: unknown, d: number): number { const v = Number(x); return Number.isFinite(v) ? v : d; }

const PRIMARY = "#0E7C66";
const S: Record<string, React.CSSProperties> = {
  wrap: { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1A1A1A" },
  head: { marginBottom: 16 },
  heading: { fontSize: "1.2rem", fontWeight: 700 },
  subheading: { fontSize: "0.95rem", color: "#555", marginTop: 2 },
  grid: { display: "grid", gridTemplateColumns: "minmax(260px, 1fr) minmax(260px, 1fr)", gap: 24 },
  inputs: { display: "flex", flexDirection: "column", gap: 12 },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#444" },
  input: { width: "100%", padding: "10px 12px", fontSize: "1rem", border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A" },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  suffix: { position: "absolute", right: 12, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12, alignSelf: "start" },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 10, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "2rem", fontWeight: 800, color: PRIMARY, letterSpacing: "-0.02em" },
  bigSub: { fontSize: "0.82rem", color: "#777" },
  statRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  stat: { display: "flex", flexDirection: "column", gap: 1 },
  statLabel: { fontSize: "0.78rem", color: "#666" },
  statValue: { fontSize: "1.12rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  note: { fontSize: "0.83rem", color: "#5a6b66", background: "#F1F8F5", border: "1px solid #DCECE6", borderRadius: 8, padding: "10px 12px", lineHeight: 1.5 },
};
