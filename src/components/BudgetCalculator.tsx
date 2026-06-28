import { useMemo, useState } from "react";
import { computeBudget, BUDGET_LINES, BUCKET_LABEL, type Bucket, type BudgetMode } from "../lib/budget";
import { fmtUSD, fmtPct } from "../lib/format";

// Budget island: the 50/30/20 rule with a zero-based ("every dollar a job") toggle. Enter take-home
// income and spending by line; see bucket targets vs. actuals, leftover-to-assign, and savings rate.
// Standalone — no host coupling. Mirrors NetWorthCalculator's layout + styling conventions.

interface Props {
  initialData?: {
    monthlyIncome?: number;
    mode?: BudgetMode;
    amounts?: Record<string, number>;
  };
  heading?: string;
  subheading?: string;
}

const DEFAULT_INCOME = 5000;
const DEFAULT_AMOUNTS: Record<string, number> = {
  housing: 1500, utilities: 220, groceries: 500, transportation: 300, insurance: 180, minimumDebt: 150,
  dining: 300, entertainment: 130, shopping: 220, funMisc: 150,
  emergencyFund: 250, retirement: 600, extraDebt: 300,
};

const PRIMARY = "#0E7C66";
const NEGATIVE = "#C0392B";
const BUCKETS: Bucket[] = ["needs", "wants", "savings"];

export default function BudgetCalculator({ initialData, heading, subheading }: Props) {
  const [income, setIncome] = useState<number>(initialData?.monthlyIncome ?? DEFAULT_INCOME);
  const [mode, setMode] = useState<BudgetMode>(initialData?.mode ?? "50-30-20");
  const [amounts, setAmounts] = useState<Record<string, number>>({ ...DEFAULT_AMOUNTS, ...(initialData?.amounts ?? {}) });

  const r = useMemo(() => computeBudget({ monthlyIncome: income, amounts }), [income, amounts]);
  const setAmt = (key: string, val: number) => setAmounts((s) => ({ ...s, [key]: val }));

  const zero = mode === "zero-based";
  const over = r.leftover < -5;
  const surplus = r.leftover > 5;

  return (
    <div style={S.wrap}>
      {(heading || subheading) && (
        <div style={S.head}>
          {heading && <div style={S.heading}>{heading}</div>}
          {subheading && <div style={S.subheading}>{subheading}</div>}
        </div>
      )}

      <div style={S.modeRow}>
        <button type="button" style={{ ...S.modeBtn, ...(!zero ? S.modeOn : {}) }} onClick={() => setMode("50-30-20")}>50/30/20 rule</button>
        <button type="button" style={{ ...S.modeBtn, ...(zero ? S.modeOn : {}) }} onClick={() => setMode("zero-based")}>Zero-based</button>
      </div>

      <div style={S.grid}>
        <div style={S.inputs}>
          <Field label="Monthly take-home income">
            <Money v={income} on={setIncome} />
          </Field>
          {BUCKETS.map((b) => (
            <div key={b}>
              <div style={S.groupTitle}>
                {BUCKET_LABEL[b]}
                {!zero && <span style={S.groupTarget}> · target {fmtPct(targetPct(b), 0)}</span>}
              </div>
              <div style={S.gridFields}>
                {BUDGET_LINES.filter((l) => l.bucket === b).map((l) => (
                  <Field key={l.key} label={l.label}>
                    <Money v={amounts[l.key] ?? 0} on={(x) => setAmt(l.key, x)} />
                  </Field>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>{zero ? "Left to assign" : "Left to budget"}</span>
            <span style={{ ...S.bigValue, color: over ? NEGATIVE : PRIMARY }}>{fmtUSD(r.leftover)}</span>
            <span style={S.bigSub}>{fmtUSD(income)} income − {fmtUSD(r.totalSpending)} planned</span>
          </div>

          <div style={over ? S.warnNote : surplus ? S.goodNote : S.goodNote}>
            {zero
              ? over
                ? <span>You've assigned <strong>{fmtUSD(Math.abs(r.leftover))}</strong> more than you earn. Trim a category so every dollar has a job and the plan balances to $0.</span>
                : surplus
                  ? <span><strong>{fmtUSD(r.leftover)}</strong> still needs a job. In a zero-based budget, give it one — add to savings or extra debt payoff until this hits $0.</span>
                  : <span><strong>Every dollar has a job.</strong> Your plan balances to $0 — the goal of a zero-based budget.</span>
              : over
                ? <span>You're planning to spend <strong>{fmtUSD(Math.abs(r.leftover))}</strong> more than you earn. Cut from the buckets running over their target below.</span>
                : <span>You have <strong>{fmtUSD(r.leftover)}</strong> left. Put it toward the 20% savings &amp; debt bucket to stay on track.</span>}
          </div>

          <div style={S.statRow}>
            <Stat label="Total planned" value={fmtUSD(r.totalSpending)} />
            <Stat label="Savings rate" value={fmtPct(r.savingsRate, 0)} />
          </div>

          <div>
            <div style={S.bdTitle}>{zero ? "By category" : "Target vs. plan"}</div>
            {r.buckets.map((bk) => {
              const overBucket = !zero && bk.variance > 0;
              return (
                <div key={bk.bucket} style={S.bucketRow}>
                  <div style={S.bucketTop}>
                    <span style={S.bucketName}>{BUCKET_LABEL[bk.bucket]}</span>
                    <span style={S.bucketAmt}>
                      {fmtUSD(bk.actual)} <span style={S.bdPct}>({fmtPct(bk.actualPct, 0)})</span>
                    </span>
                  </div>
                  <div style={S.barTrack}>
                    <div style={{ ...S.barFill, width: `${barWidth(bk.actual, income)}%`, background: overBucket ? NEGATIVE : PRIMARY }} />
                    {!zero && <div style={{ ...S.barTarget, left: `${barWidth(bk.target, income)}%` }} title="target" />}
                  </div>
                  {!zero && (
                    <div style={{ ...S.bucketNote, color: overBucket ? NEGATIVE : "#1f5d3f" }}>
                      target {fmtUSD(bk.target)} ·{" "}
                      {bk.variance > 0 ? `${fmtUSD(bk.variance)} over` : bk.variance < 0 ? `${fmtUSD(Math.abs(bk.variance))} under` : "on target"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function targetPct(b: Bucket): number {
  return b === "needs" ? 50 : b === "wants" ? 30 : 20;
}
function barWidth(part: number, income: number): number {
  if (!(income > 0)) return 0;
  return Math.max(0, Math.min(100, (part / income) * 100));
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
        onChange={(e) => on(parse(e.target.value))} />
    </div>
  );
}
function Stat({ label, value }: { label: string; value: string }) {
  return <div style={S.stat}><span style={S.statLabel}>{label}</span><span style={S.statValue}>{value}</span></div>;
}
function parse(s: string): number { if (s === "") return 0; return Math.max(0, Number(s.replace(/[^0-9.]/g, "")) || 0); }

const S: Record<string, React.CSSProperties> = {
  wrap: { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1A1A1A" },
  head: { marginBottom: 16 },
  heading: { fontSize: "1.2rem", fontWeight: 700 },
  subheading: { fontSize: "0.95rem", color: "#555", marginTop: 2 },
  modeRow: { display: "flex", gap: 8, marginBottom: 16 },
  modeBtn: { flex: 1, padding: "9px 0", border: "1px solid #D0DAD6", background: "#fff", borderRadius: 8, fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", color: "#444" },
  modeOn: { borderColor: PRIMARY, background: "#E4F4EF", color: PRIMARY },
  grid: { display: "grid", gridTemplateColumns: "minmax(280px, 1.1fr) minmax(260px, 0.9fr)", gap: 24 },
  inputs: { display: "flex", flexDirection: "column", gap: 10 },
  groupTitle: { fontSize: "0.78rem", fontWeight: 700, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8, marginTop: 4 },
  groupTarget: { color: "#9aa6a2", fontWeight: 600 },
  gridFields: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: "0.8rem", fontWeight: 600, color: "#444" },
  input: { width: "100%", padding: "9px 12px", fontSize: "0.98rem", border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A" },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12, alignSelf: "start" },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 10, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" },
  bigSub: { fontSize: "0.82rem", color: "#777" },
  statRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  stat: { display: "flex", flexDirection: "column", gap: 1 },
  statLabel: { fontSize: "0.78rem", color: "#666" },
  statValue: { fontSize: "1.12rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  goodNote: { fontSize: "0.86rem", color: "#1f5d3f", background: "#E8F6EF", border: "1px solid #C5E6D6", borderRadius: 8, padding: "10px 12px", lineHeight: 1.5 },
  warnNote: { fontSize: "0.86rem", color: "#7a5b1e", background: "#FBF4E4", border: "1px solid #F0DEB4", borderRadius: 8, padding: "10px 12px", lineHeight: 1.5 },
  bdTitle: { fontSize: "0.78rem", fontWeight: 700, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 },
  bucketRow: { marginBottom: 12 },
  bucketTop: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 },
  bucketName: { fontSize: "0.9rem", fontWeight: 600 },
  bucketAmt: { fontSize: "0.9rem", fontVariantNumeric: "tabular-nums", fontWeight: 700 },
  bdPct: { color: "#888", fontWeight: 400 },
  barTrack: { position: "relative", height: 8, background: "#E6F0EC", borderRadius: 999 },
  barFill: { position: "absolute", top: 0, left: 0, height: 8, borderRadius: 999 },
  barTarget: { position: "absolute", top: -2, width: 2, height: 12, background: "#1A1A1A", opacity: 0.55 },
  bucketNote: { fontSize: "0.76rem", marginTop: 4 },
};
