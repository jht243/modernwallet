import { useMemo, useState } from "react";
import {
  computeTrumpAccount,
  type TrumpAccountInput,
  FAMILY_AGGREGATE_CAP,
  EMPLOYER_SUBCAP,
  SEED_AMOUNT,
} from "../lib/trump-account";
import { useDraft } from "./calc-ui";
import { fmtUSD } from "../lib/format";
import ToolPicks, { book } from "./ToolPicks";

// Trump Account calculator island. Projects the $1,000 federal seed + capped annual contributions
// to the child's 18th birthday, tax-deferred at a chosen return. Enforces the $5,000 aggregate /
// $2,500 employer caps in the engine and surfaces a warning when inputs exceed them. Standalone —
// no host coupling (mirrors InvestmentCalculator).

interface Props {
  initialData?: Record<string, unknown>;
  heading?: string;
  subheading?: string;
}

export default function TrumpAccountCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<TrumpAccountInput>({
    childCurrentAge: n(initialData?.childCurrentAge, 0),
    seedDeposit: n(initialData?.seedDeposit, 1000),
    annualFamilyContribution: n(initialData?.annualFamilyContribution, 2400),
    annualEmployerContribution: n(initialData?.annualEmployerContribution, 0),
    annualReturnPct: n(initialData?.annualReturnPct, 7),
  });
  const [showSchedule, setShowSchedule] = useState(false);
  const r = useMemo(() => computeTrumpAccount(v), [v]);
  const set = (p: Partial<TrumpAccountInput>) => setV((s) => ({ ...s, ...p }));

  const matured = r.yearsToGrow === 0;
  const fv = r.valueAt18 ?? 0;
  const contribShare = fv > 0 ? Math.round(((r.totalContributions ?? 0) / fv) * 100) : 0;
  const growthShare = fv > 0 ? Math.round(((r.totalGrowth ?? 0) / fv) * 100) : 0;

  return (
    <div style={S.wrap}>
      {(heading || subheading) && (
        <div style={S.head}>
          {heading && <div style={S.heading}>{heading}</div>}
          {subheading && <div style={S.subheading}>{subheading}</div>}
        </div>
      )}
      <div style={S.grid} className="mw-stack">
        <div style={S.inputs} className="mw-in">
          <div style={S.row2}>
            <Field label="Child's age now"><Plain v={v.childCurrentAge} max={17} on={(x) => set({ childCurrentAge: x })} /></Field>
            <Field label="Federal seed"><Money v={v.seedDeposit} on={(x) => set({ seedDeposit: x })} /></Field>
          </div>
          {v.childCurrentAge >= 1 && v.seedDeposit > 0 && (
            <div style={S.hint}>
              The {fmtUSD(SEED_AMOUNT)} federal seed goes only to children born 2025 through 2028. If your child was born before 2025, set the federal seed to $0.
            </div>
          )}
          <Field label="Yearly family contribution (parents, relatives, friends)">
            <Money v={v.annualFamilyContribution} on={(x) => set({ annualFamilyContribution: x })} />
          </Field>
          <Field label={`Yearly employer contribution (max $${EMPLOYER_SUBCAP.toLocaleString()}, counts toward the $${FAMILY_AGGREGATE_CAP.toLocaleString()})`}>
            <Money v={v.annualEmployerContribution} on={(x) => set({ annualEmployerContribution: x })} />
          </Field>
          <div style={S.hint}>
            Enter family and employer money once each. Together they are capped at ${FAMILY_AGGREGATE_CAP.toLocaleString()} a year, and the employer part at ${EMPLOYER_SUBCAP.toLocaleString()}.
          </div>
          <Field label="Expected annual return %"><Pct v={v.annualReturnPct} on={(x) => set({ annualReturnPct: x })} /></Field>
          {r.capWarning && <div style={S.warn}>⚠️ {r.capWarning}</div>}
        </div>

        <div style={S.results} className="mw-out">
          {matured ? (
            <div style={S.bigStat}>
              <span style={S.bigLabel}>Already 18</span>
              <span style={S.bigValue}>{fmtUSD(r.valueAt18)}</span>
              <span style={S.bigSub}>The contribution window closes at 18 — enter a younger age to project growth.</span>
            </div>
          ) : (
            <div style={S.bigStat}>
              <span style={S.bigLabel}>Value at age 18</span>
              <span style={S.bigValue}>{fmtUSD(r.valueAt18)}</span>
              <span style={S.bigSub}>in {r.yearsToGrow} years at {v.annualReturnPct}% · {r.growthMultiple}× what you put in</span>
            </div>
          )}
          <div style={S.statRow}>
            <Stat label="You put in" value={fmtUSD(r.totalContributions)} />
            <Stat label="Tax-deferred growth" value={fmtUSD(r.totalGrowth)} />
          </div>
          {!matured && r.valueAt18 != null && r.valueAt18 > 0 && (
            <div style={S.barWrap} aria-hidden="true">
              <div style={S.barTrack}>
                <div style={{ ...S.barA, width: `${contribShare}%` }} />
                <div style={{ ...S.barB, width: `${growthShare}%` }} />
              </div>
              <div style={S.barLegend}>
                <span><span style={{ ...S.dot, background: PRIMARY }} /> Contributions</span>
                <span><span style={{ ...S.dot, background: ACCENT }} /> Growth</span>
              </div>
            </div>
          )}
          {r.schedule.length > 0 && (
            <button style={S.toggle} type="button" onClick={() => setShowSchedule((x) => !x)}>
              {showSchedule ? "Hide" : "Show"} year-by-year growth
            </button>
          )}
          <div style={S.disclaimer}>
            Estimate only. Assumes one fixed return compounded monthly; real S&P 500 returns vary year to year.
            Trump Account funds must be invested in a U.S.-equity index fund and grow tax-deferred until 18.
          </div>
          {!matured && fv > 0 && (
            <ToolPicks
              tool="trump-account"
              heading="Further reading for the parent of a future account holder"
              picks={v.childCurrentAge < 10
                ? [
                    book("kidMoneyGenius", "Age-by-age money lessons, so your child is ready to manage this balance at 18."),
                    book("littleBook", "The index-fund logic behind the U.S.-equity fund this account must hold."),
                    book("moneyForCouples", "Helps two parents agree on how much to put in each year."),
                  ]
                : [
                    book("kidMoneyGenius", "Your child will control this money soon. Its teen chapters cover what to teach now."),
                    book("bogleheads", "A plain guide to the index investing your child inherits with this account."),
                  ]}
            />
          )}
        </div>
      </div>

      {showSchedule && r.schedule.length > 0 && (
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead><tr>
              <th style={S.th}>Age</th>
              <th style={{ ...S.th, ...S.right }}>Balance</th>
              <th style={{ ...S.th, ...S.right }}>Contributed</th>
              <th style={{ ...S.th, ...S.right }}>Growth</th>
            </tr></thead>
            <tbody>
              {r.schedule
                .filter((row) => row.age <= 5 || row.age % 3 === 0 || row.year === r.schedule.length)
                .map((row) => (
                  <tr key={row.year}>
                    <td style={S.td}>{row.age}</td>
                    <td style={{ ...S.td, ...S.right }}>{fmtUSD(row.balance)}</td>
                    <td style={{ ...S.td, ...S.right }}>{fmtUSD(row.contributions)}</td>
                    <td style={{ ...S.td, ...S.right }}>{fmtUSD(row.growth)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label style={S.field}><span style={S.label}>{label}</span>{children}</label>;
}
function Money({ v, on }: { v: number; on: (n: number) => void }) {
  const d = useDraft(v, on, (v) => v.toLocaleString("en-US"));
  return (
    <div style={S.suffixWrap}>
      <span style={S.prefix}>$</span>
      <input style={{ ...S.input, paddingLeft: 22 }} inputMode="numeric" value={d.text} placeholder="0" onChange={(e) => d.onChange(e.target.value)} onBlur={d.onBlur} />
    </div>
  );
}
function Pct({ v, on }: { v: number; on: (n: number) => void }) {
  const d = useDraft(v, on);
  return <div style={S.suffixWrap}><input style={S.input} inputMode="decimal" value={d.text} placeholder="0" onChange={(e) => d.onChange(e.target.value)} onBlur={d.onBlur} /><span style={S.suffix}>%</span></div>;
}
function Plain({ v, on, max }: { v: number; on: (n: number) => void; max?: number }) {
  const d = useDraft(v, (x) => on(clamp(x, max)));
  return <input style={S.input} inputMode="numeric" value={d.text} placeholder="0" onChange={(e) => d.onChange(e.target.value)} onBlur={d.onBlur} />;
}
function Stat({ label, value }: { label: string; value: string }) {
  return <div style={S.stat}><span style={S.statLabel}>{label}</span><span style={S.statValue}>{value}</span></div>;
}
function clamp(n: number, max?: number): number { return typeof max === "number" ? Math.min(n, max) : n; }
function n(x: unknown, d: number): number { const v = Number(x); return Number.isFinite(v) ? v : d; }

const PRIMARY = "#0E7C66";
const ACCENT = "#E0A43B";
const S: Record<string, React.CSSProperties> = {
  wrap: { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1A1A1A" },
  head: { marginBottom: 16 },
  heading: { fontSize: "1.2rem", fontWeight: 700 },
  subheading: { fontSize: "0.95rem", color: "#555", marginTop: 2 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 },
  inputs: { display: "flex", flexDirection: "column", gap: 12 },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, alignItems: "end" },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#444" },
  input: { width: "100%", padding: "10px 12px", fontSize: "1rem", border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A" },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  suffix: { position: "absolute", right: 12, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  hint: { fontSize: "0.82rem", color: "#555", lineHeight: 1.45, margin: "-4px 0 0" },
  warn: { fontSize: "0.82rem", color: "#8a5a00", background: "#FDF6E7", border: "1px solid #F0DFB0", borderRadius: 8, padding: "9px 11px", lineHeight: 1.45 },
  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12, alignSelf: "start" },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 10, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "1.9rem", fontWeight: 800, color: PRIMARY, letterSpacing: "-0.02em" },
  bigSub: { fontSize: "0.82rem", color: "#777" },
  statRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  stat: { display: "flex", flexDirection: "column", gap: 1 },
  statLabel: { fontSize: "0.78rem", color: "#666" },
  statValue: { fontSize: "1.12rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  barWrap: { marginTop: 2 },
  barTrack: { display: "flex", height: 10, borderRadius: 6, overflow: "hidden", background: "#EEF4F2" },
  barA: { background: PRIMARY, height: "100%" },
  barB: { background: ACCENT, height: "100%" },
  barLegend: { display: "flex", gap: 16, fontSize: "0.78rem", color: "#555", marginTop: 6 },
  dot: { display: "inline-block", width: 9, height: 9, borderRadius: 3, marginRight: 5, verticalAlign: "middle" },
  toggle: { marginTop: 2, padding: "9px 12px", border: "1px solid #CFE3DC", background: "#fff", borderRadius: 8, fontSize: "0.88rem", fontWeight: 600, color: PRIMARY, cursor: "pointer" },
  disclaimer: { fontSize: "0.76rem", color: "#7a8783", lineHeight: 1.5, marginTop: 2 },
  tableWrap: { marginTop: 18, overflowX: "auto", border: "1px solid #EAEFED", borderRadius: 10 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" },
  th: { textAlign: "left", padding: "10px 12px", background: "#F4FAF8", fontWeight: 700, color: "#2A6A58", borderBottom: "1px solid #E0EBE7" },
  td: { padding: "8px 12px", borderBottom: "1px solid #F0F4F2", fontVariantNumeric: "tabular-nums" },
  right: { textAlign: "right" },
};
