import { useMemo, useState } from "react";
import {
  projectRetirement, early401kWithdrawal, computeRMD,
  type RetirementProjectionInput, type EarlyWithdrawalInput,
} from "../lib/retirement";
import { fmtUSD, fmtPct, fmtNum } from "../lib/format";

// RetirementIQ island. One component, three modes (chosen via initialData.mode):
//   "projection" (accumulation + 4% drawdown), "early-withdrawal" (401k penalty+tax), "rmd".
// Fully standalone — no external host coupling.

type Mode = "projection" | "early-withdrawal" | "rmd";
interface Props {
  initialData?: Record<string, unknown> & { mode?: Mode };
  heading?: string;
  subheading?: string;
}

export default function RetirementCalculator({ initialData, heading, subheading }: Props) {
  const mode: Mode = (initialData?.mode as Mode) ?? "projection";
  return (
    <div style={S.wrap}>
      {(heading || subheading) && (
        <div style={S.head}>
          {heading && <div style={S.heading}>{heading}</div>}
          {subheading && <div style={S.subheading}>{subheading}</div>}
        </div>
      )}
      {mode === "projection" && <Projection data={initialData} />}
      {mode === "early-withdrawal" && <EarlyWithdrawal data={initialData} />}
      {mode === "rmd" && <RMD data={initialData} />}
    </div>
  );
}

// ---------- Projection ----------
function Projection({ data }: { data?: Record<string, unknown> }) {
  const [v, setV] = useState<RetirementProjectionInput>({
    currentAge: num(data?.currentAge, 35),
    retirementAge: num(data?.retirementAge, 67),
    currentSavings: num(data?.currentSavings, 50000),
    monthlyContribution: num(data?.monthlyContribution, 500),
    annualReturnPct: num(data?.annualReturnPct, 7),
    inflationPct: num(data?.inflationPct, 3),
    lifeExpectancy: num(data?.lifeExpectancy, 95),
  });
  const r = useMemo(() => projectRetirement(v), [v]);
  const set = (p: Partial<RetirementProjectionInput>) => setV((s) => ({ ...s, ...p }));
  return (
    <div style={S.grid}>
      <div style={S.inputs}>
        <div style={S.row2}>
          <Field label="Current age"><Plain v={v.currentAge} on={(n) => set({ currentAge: n })} /></Field>
          <Field label="Retirement age"><Plain v={v.retirementAge} on={(n) => set({ retirementAge: n })} /></Field>
        </div>
        <Field label="Current retirement savings"><Money v={v.currentSavings} on={(n) => set({ currentSavings: n })} /></Field>
        <Field label="Monthly contribution"><Money v={v.monthlyContribution} on={(n) => set({ monthlyContribution: n })} /></Field>
        <div style={S.row2}>
          <Field label="Annual return %"><Pct v={v.annualReturnPct} on={(n) => set({ annualReturnPct: n })} /></Field>
          <Field label="Inflation %"><Pct v={v.inflationPct ?? 3} on={(n) => set({ inflationPct: n })} /></Field>
        </div>
      </div>
      <div style={S.results}>
        <div style={S.bigStat}>
          <span style={S.bigLabel}>Savings at retirement</span>
          <span style={S.bigValue}>{fmtUSD(r.balanceAtRetirement)}</span>
          <span style={S.bigSub}>≈ {fmtUSD(r.balanceAtRetirementTodaysDollars)} in today's dollars</span>
        </div>
        <div style={S.statRow}>
          <Stat label="Monthly income (4% rule)" value={fmtUSD(r.monthlyRetirementIncome)} />
          <Stat label="You contribute" value={fmtUSD(r.totalContributions)} />
        </div>
        <div style={S.statRow}>
          <Stat label="Investment growth" value={fmtUSD(r.growth)} />
          <Stat label="Years funded" value={r.yearsFunded == null ? "—" : `${r.yearsFunded} yrs`} />
        </div>
        <div style={r.lastsThroughLifeExpectancy ? S.goodNote : S.warnNote}>
          {r.lastsThroughLifeExpectancy
            ? `On track — at a 4% withdrawal rate, your savings last through age ${v.lifeExpectancy ?? 95}.`
            : `Heads up — at a 4% withdrawal rate, your savings run low before age ${v.lifeExpectancy ?? 95}. Consider saving more or retiring later.`}
        </div>
      </div>
    </div>
  );
}

// ---------- 401(k) early withdrawal ----------
function EarlyWithdrawal({ data }: { data?: Record<string, unknown> }) {
  const [v, setV] = useState<EarlyWithdrawalInput>({
    withdrawalAmount: num(data?.withdrawalAmount, 25000),
    age: num(data?.age, 40),
    federalTaxRatePct: num(data?.federalTaxRatePct, 22),
    stateTaxRatePct: num(data?.stateTaxRatePct, 5),
    yearsToRetirement: num(data?.yearsToRetirement, 27),
    annualReturnPct: num(data?.annualReturnPct, 7),
  });
  const r = useMemo(() => early401kWithdrawal(v), [v]);
  const set = (p: Partial<EarlyWithdrawalInput>) => setV((s) => ({ ...s, ...p }));
  const underAge = v.age < 59.5;
  return (
    <div style={S.grid}>
      <div style={S.inputs}>
        <Field label="Amount to withdraw"><Money v={v.withdrawalAmount} on={(n) => set({ withdrawalAmount: n })} /></Field>
        <div style={S.row2}>
          <Field label="Your age"><Plain v={v.age} on={(n) => set({ age: n })} /></Field>
          <Field label="Years to retirement"><Plain v={v.yearsToRetirement ?? 0} on={(n) => set({ yearsToRetirement: n })} /></Field>
        </div>
        <div style={S.row2}>
          <Field label="Federal tax rate %"><Pct v={v.federalTaxRatePct} on={(n) => set({ federalTaxRatePct: n })} /></Field>
          <Field label="State tax rate %"><Pct v={v.stateTaxRatePct ?? 0} on={(n) => set({ stateTaxRatePct: n })} /></Field>
        </div>
        <Field label="Expected annual return %"><Pct v={v.annualReturnPct ?? 7} on={(n) => set({ annualReturnPct: n })} /></Field>
      </div>
      <div style={S.results}>
        <div style={S.bigStat}>
          <span style={S.bigLabel}>You actually keep</span>
          <span style={{ ...S.bigValue, color: NEGATIVE }}>{fmtUSD(r.netReceived)}</span>
          <span style={S.bigSub}>of your {fmtUSD(v.withdrawalAmount)} withdrawal — {fmtPct(r.effectiveCostPct, 0)} lost to taxes & penalty</span>
        </div>
        <div style={S.statRow}>
          <Stat label={underAge ? "10% early penalty" : "Penalty (59½+: none)"} value={fmtUSD(r.penalty)} />
          <Stat label="Federal tax" value={fmtUSD(r.federalTax)} />
        </div>
        <div style={S.statRow}>
          <Stat label="State tax" value={fmtUSD(r.stateTax)} />
          <Stat label="Total cost" value={fmtUSD(r.totalCost)} />
        </div>
        {r.lostFutureValue != null && r.lostFutureValue > 0 && (
          <div style={S.warnNote}>
            Bigger picture: left invested, that {fmtUSD(v.withdrawalAmount)} could grow by about{" "}
            <strong>{fmtUSD(r.lostFutureValue)}</strong> before retirement. That's the real cost of cashing out early.
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- RMD ----------
function RMD({ data }: { data?: Record<string, unknown> }) {
  const [balance, setBalance] = useState<number>(num(data?.accountBalance, 500000));
  const [age, setAge] = useState<number>(num(data?.age, 73));
  const r = useMemo(() => computeRMD(balance, age), [balance, age]);
  return (
    <div style={S.grid}>
      <div style={S.inputs}>
        <Field label="Account balance (Dec 31 last year)"><Money v={balance} on={setBalance} /></Field>
        <Field label="Your age this year"><Plain v={age} on={setAge} /></Field>
      </div>
      <div style={S.results}>
        <div style={S.bigStat}>
          <span style={S.bigLabel}>This year's RMD</span>
          <span style={S.bigValue}>{fmtUSD(r.rmd)}</span>
          <span style={S.bigSub}>{r.rmd == null ? "RMDs begin at age 73." : `${fmtUSD(r.monthlyRmd)}/mo · ${fmtPct(r.rmdPctOfBalance, 2)} of the balance`}</span>
        </div>
        <div style={S.statRow}>
          <Stat label="IRS distribution period" value={r.factor == null ? "—" : fmtNum(r.factor, 1)} />
          <Stat label="RMD required?" value={r.required ? "Yes (73+)" : "Not yet"} />
        </div>
        <div style={S.warnNote}>
          Miss your RMD and the IRS can charge a 25% excise tax on the shortfall (10% if corrected promptly). The deadline is December 31 each year (April 1 the first year).
        </div>
      </div>
    </div>
  );
}

// ---------- shared bits ----------
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label style={S.field}><span style={S.label}>{label}</span>{children}</label>;
}
function Money({ v, on }: { v: number; on: (n: number) => void }) {
  return (
    <div style={S.suffixWrap}>
      <span style={S.prefix}>$</span>
      <input style={{ ...S.input, paddingLeft: 22 }} inputMode="numeric"
        value={v === 0 ? "" : v.toLocaleString("en-US")} placeholder="0"
        onChange={(e) => on(parse(e.target.value))} />
    </div>
  );
}
function Pct({ v, on }: { v: number; on: (n: number) => void }) {
  return <div style={S.suffixWrap}><input style={S.input} inputMode="decimal" value={v} onChange={(e) => on(parse(e.target.value))} /><span style={S.suffix}>%</span></div>;
}
function Plain({ v, on }: { v: number; on: (n: number) => void }) {
  return <input style={S.input} inputMode="numeric" value={v} onChange={(e) => on(parse(e.target.value))} />;
}
function Stat({ label, value }: { label: string; value: string }) {
  return <div style={S.stat}><span style={S.statLabel}>{label}</span><span style={S.statValue}>{value}</span></div>;
}
function parse(s: string): number { if (s === "") return 0; return Math.max(0, Number(s.replace(/[^0-9.]/g, "")) || 0); }
function num(x: unknown, d: number): number { const n = Number(x); return Number.isFinite(n) && n !== 0 ? n : (x === 0 || x === "0" ? 0 : d); }

const PRIMARY = "#0E7C66";
const NEGATIVE = "#C0392B";
const S: Record<string, React.CSSProperties> = {
  wrap: { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1A1A1A" },
  head: { marginBottom: 16 },
  heading: { fontSize: "1.2rem", fontWeight: 700 },
  subheading: { fontSize: "0.95rem", color: "#555", marginTop: 2 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 },
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
  bigValue: { fontSize: "1.9rem", fontWeight: 800, color: PRIMARY, letterSpacing: "-0.02em" },
  bigSub: { fontSize: "0.82rem", color: "#777" },
  statRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  stat: { display: "flex", flexDirection: "column", gap: 1 },
  statLabel: { fontSize: "0.78rem", color: "#666" },
  statValue: { fontSize: "1.12rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  goodNote: { fontSize: "0.85rem", color: "#1f5d3f", background: "#E8F6EF", border: "1px solid #C5E6D6", borderRadius: 8, padding: "10px 12px", lineHeight: 1.5 },
  warnNote: { fontSize: "0.85rem", color: "#7a5b1e", background: "#FBF4E4", border: "1px solid #F0DEB4", borderRadius: 8, padding: "10px 12px", lineHeight: 1.5 },
};
