import { useEffect, useMemo, useState } from "react";
import {
  calculateSelfEmploymentTax,
  type SelfEmploymentTaxInput,
  type FilingStatus,
  SS_WAGE_BASE_2026,
} from "../lib/self-employment-tax";
import { fmtUSD, fmtPct } from "../lib/format";
import ToolPicks, { book } from "./ToolPicks";

// Form 1040-ES (2026) payment due dates, from the IRS form's "Payment Due Dates" section
// (https://www.irs.gov/pub/irs-pdf/f1040es.pdf, read 2026-10-28). The 4th payment can be skipped if the 2026
// return is filed by February 1, 2027 with the full balance paid. Tool-usage pass 2026-10-28.
const ES_DUE_DATES: { label: string; iso: string }[] = [
  { label: "April 15, 2026", iso: "2026-04-15" },
  { label: "June 15, 2026", iso: "2026-06-15" },
  { label: "Sept. 15, 2026", iso: "2026-09-15" },
  { label: "Jan. 15, 2027", iso: "2027-01-15" },
];
const QUARTERLY_ROUTE = "/self-employment-tax/quarterly-estimated-tax-calculator/";

// Self-employment / 1099 tax island. The headline answer is deliberately the SET-ASIDE SHARE, not
// a total tax bill: the question people actually arrive with is "how much of this invoice isn't
// mine?" It is also the number vendor calculators get wrong for anyone with a day job, because
// they divide household tax by 1099 profit. This one divides the tax the self-employment income
// ACTUALLY CAUSES (household total minus the no-Schedule-C baseline) by net profit.
//
// Serves the /self-employment-tax/ hub and every spoke under it (1099, per-platform gig pages)
// through `initialData` presets. Standalone, no host coupling.

/**
 * A spoke's `preset` is handed straight to `initialData`, so the per-platform copy overrides ride
 * in there alongside the numeric inputs rather than needing route changes.
 */
export type SelfEmploymentTaxPreset = Partial<SelfEmploymentTaxInput> & {
  /** Per-platform note rendered under the results (used by the gig-platform spokes). */
  platformNote?: string;
  /** Label for the income field — gig spokes rename it ("DoorDash earnings", etc.). */
  incomeLabel?: string;
};

interface Props {
  initialData?: SelfEmploymentTaxPreset;
  heading?: string;
  subheading?: string;
  platformNote?: string;
  incomeLabel?: string;
}

const DEFAULTS: SelfEmploymentTaxInput = {
  netProfit: 60000,
  filingStatus: "single",
  w2Wages: 0,
  otherIncome: 0,
  includeIncomeTax: true,
  applyQbi: true,
};

const STATUS_LABEL: Record<FilingStatus, string> = {
  single: "Single",
  mfj: "Married filing jointly",
  hoh: "Head of household",
};

export default function SelfEmploymentTaxCalculator({
  initialData,
  heading,
  subheading,
  platformNote,
  incomeLabel,
}: Props) {
  // Copy overrides travel inside the spoke preset; strip them before they reach the engine.
  const {
    platformNote: presetNote,
    incomeLabel: presetIncomeLabel,
    ...presetNumbers
  } = initialData ?? {};
  const note = platformNote ?? presetNote;
  const moneyLabel = incomeLabel ?? presetIncomeLabel;

  const [input, setInput] = useState<SelfEmploymentTaxInput>({ ...DEFAULTS, ...presetNumbers });
  const result = useMemo(() => calculateSelfEmploymentTax(input), [input]);
  const set = (patch: Partial<SelfEmploymentTaxInput>) => setInput((s) => ({ ...s, ...patch }));
  // Today's date and route are read after hydration so the static HTML stays the same for every visitor.
  const [today, setToday] = useState<string | null>(null);
  const [onQuarterlyPage, setOnQuarterlyPage] = useState(false);
  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10));
    setOnQuarterlyPage(window.location.pathname.replace(/\/?$/, "/") === QUARTERLY_ROUTE);
  }, []);
  const nextDue = today ? ES_DUE_DATES.find((d) => d.iso >= today) ?? null : null;

  // Further reading (YMYL tax → books). No self-employment tax under $400 of net earnings, so no picks there.
  const picks =
    input.netProfit >= 400
      ? [
          book("piperContractorTaxes", "Self-employment tax, quarterly payments and deductions in one short read."),
          book("workingForYourself", "The law and tax rules that come with working for yourself."),
          book("deductIt", "Deductions that lower the profit this percentage applies to."),
          book("lasser2027", "A full guide for filing this year's return."),
        ]
      : [];

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
          <Field label={moneyLabel ?? "Net profit (business income minus expenses)"}>
            <MoneyInput value={input.netProfit} onChange={(v) => set({ netProfit: v })} />
          </Field>

          <Field label="Filing status">
            <div style={S.toggleRow}>
              {(Object.keys(STATUS_LABEL) as FilingStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  style={{ ...S.toggleBtn, ...(input.filingStatus === s ? S.toggleBtnActive : {}) }}
                  onClick={() => set({ filingStatus: s })}
                >
                  {s === "mfj" ? "Married" : s === "hoh" ? "Head of hh" : "Single"}
                </button>
              ))}
            </div>
          </Field>

          <Field label="W-2 wages from a job (if any)">
            <MoneyInput value={input.w2Wages ?? 0} onChange={(v) => set({ w2Wages: v })} />
          </Field>
          <p style={S.hint}>
            Wages use up the Social Security wage base first, so a day job lowers the Social
            Security part of your self-employment tax — but raises the income-tax rate your
            1099 profit stacks on top of.
          </p>

          <Field label="Other household income">
            <MoneyInput value={input.otherIncome ?? 0} onChange={(v) => set({ otherIncome: v })} />
          </Field>

          <div style={S.divider} />

          <label style={S.checkRow}>
            <input
              type="checkbox"
              checked={input.applyQbi !== false}
              onChange={(e) => set({ applyQbi: e.target.checked })}
            />
            <span style={S.checkLabel}>Apply the 20% qualified business income (QBI) deduction</span>
          </label>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Set aside from every payment</span>
            <span style={S.bigValue}>{fmtPct(result.setAsideRate * 100, 1)}</span>
            <span style={S.bigSub}>
              {fmtUSD(result.incrementalFederalTax)} of federal tax on {fmtUSD(input.netProfit)} of
              net profit
            </span>
          </div>

          <div style={S.statRow}>
            <Stat label="Self-employment tax" value={fmtUSD(result.totalSelfEmploymentTax)} />
            <Stat
              label="Federal income tax (on this income)"
              value={fmtUSD(Math.max(0, result.incrementalFederalTax - result.totalSelfEmploymentTax))}
            />
          </div>
          <div style={S.statRow}>
            <Stat label="Quarterly payment (1040-ES)" value={fmtUSD(result.quarterlyPayment)} />
            <Stat
              label="Effective SE rate on profit"
              value={fmtPct(result.effectiveSeRateOnProfit * 100, 2)}
            />
          </div>
          <div style={S.dueBox}>
            <span style={S.dueLabel}>2026 estimated tax due dates (Form 1040-ES)</span>
            <ul style={S.dueList}>
              {ES_DUE_DATES.map((d) => (
                <li key={d.iso} style={nextDue?.iso === d.iso ? S.dueNext : undefined}>
                  {d.label}
                  {nextDue?.iso === d.iso ? " (next)" : ""}
                </li>
              ))}
            </ul>
            <span style={S.dueNote}>
              A date on a weekend or holiday moves to the next business day. You can skip the January payment if you file by February 1, 2027 and pay the full balance.
              {!onQuarterlyPage && (
                <>
                  {" "}For the safe-harbor amount that avoids the underpayment penalty, use the{" "}
                  <a href={QUARTERLY_ROUTE} style={{ color: PRIMARY }}>quarterly estimated tax calculator</a>.
                </>
              )}
            </span>
          </div>

          <div style={S.breakdown}>
            <Row
              label={`Net earnings (${fmtUSD(input.netProfit)} × 92.35%)`}
              value={fmtUSD(result.netEarnings)}
            />
            <Row
              label={`Social Security 12.4% on ${fmtUSD(result.socialSecurityTaxable)}`}
              value={fmtUSD(result.socialSecurityTax)}
            />
            <Row label="Medicare 2.9% (no ceiling)" value={fmtUSD(result.medicareTax)} />
            {result.additionalMedicareTax > 0 && (
              <Row
                label="Additional Medicare 0.9%"
                value={fmtUSD(result.additionalMedicareTax)}
              />
            )}
            <Row
              label="Deduction for half of SE tax"
              value={`− ${fmtUSD(result.halfSeTaxDeduction)}`}
            />
            {result.qbiDeduction !== null && result.qbiDeduction > 0 && (
              <Row label="QBI deduction (20%)" value={`− ${fmtUSD(result.qbiDeduction)}`} />
            )}
          </div>

          {result.wageBaseFullyUsedByW2 && (
            <div style={{ ...S.noteBox, ...S.noteOk }}>
              <span style={S.noteLabel}>No Social Security tax on this income</span>
              <span style={S.noteText}>
                Your W-2 wages already met the {fmtUSD(SS_WAGE_BASE_2026)} Social Security wage base
                for 2026, so only the 2.9% Medicare portion applies to your self-employment income.
              </span>
            </div>
          )}

          {result.qbiAboveThreshold && (
            <div style={{ ...S.noteBox, ...S.noteWarn }}>
              <span style={S.noteLabel}>Income above the QBI phase-in threshold</span>
              <span style={S.noteText}>
                Above the §199A threshold the deduction starts phasing out and depends on your
                business type, W-2 wages paid, and property held. Treat the QBI figure here as an
                upper bound and check with a preparer.
              </span>
            </div>
          )}

          {note && (
            <div style={{ ...S.noteBox, ...S.noteOk }}>
              <span style={S.noteText}>{note}</span>
            </div>
          )}

          <div style={S.disclaimer}>
            Estimate only, using 2026 federal figures: a {fmtUSD(SS_WAGE_BASE_2026)} Social Security
            wage base and the Rev. Proc. 2025-32 brackets and standard deduction. It does not
            include state or local income tax, a self-employed health insurance or retirement
            deduction, or tax credits.
          </div>
          <ToolPicks tool="self-employment-tax" heading="Further reading on taxes when you work for yourself" picks={picks} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={S.field}>
      <span style={S.label}>{label}</span>
      {children}
    </label>
  );
}
function MoneyInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={S.suffixWrap}>
      <span style={S.prefix}>$</span>
      <input
        style={{ ...S.input, paddingLeft: 22 }}
        inputMode="decimal"
        value={value === 0 ? "" : value.toLocaleString("en-US")}
        placeholder="0"
        onChange={(e) =>
          onChange(e.target.value === "" ? 0 : Math.max(0, Number(e.target.value.replace(/[^0-9.]/g, ""))))
        }
      />
    </div>
  );
}
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={S.stat}>
      <span style={S.statLabel}>{label}</span>
      <span style={S.statValue}>{value}</span>
    </div>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={S.row}>
      <span style={S.rowLabel}>{label}</span>
      <span style={S.rowValue}>{value}</span>
    </div>
  );
}

const PRIMARY = "#0E7C66";
const S: Record<string, React.CSSProperties> = {
  wrap: { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1A1A1A" },
  head: { marginBottom: 16 },
  heading: { fontSize: "1.2rem", fontWeight: 700 },
  subheading: { fontSize: "0.95rem", color: "#555", marginTop: 2 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 },
  inputs: { display: "flex", flexDirection: "column", gap: 12 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#444" },
  input: { width: "100%", padding: "10px 12px", fontSize: "1rem", border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A" },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  hint: { fontSize: "0.82rem", color: "#666", lineHeight: 1.5, margin: "2px 0 0" },
  divider: { borderTop: "1px solid #E6EEEA", margin: "6px 0" },
  toggleRow: { display: "flex", gap: 8 },
  toggleBtn: { flex: 1, padding: "9px 10px", fontSize: "0.85rem", fontWeight: 600, border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", color: "#444", cursor: "pointer" },
  toggleBtnActive: { background: PRIMARY, borderColor: PRIMARY, color: "#fff" },
  checkRow: { display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" },
  checkLabel: { fontSize: "0.85rem", color: "#444", lineHeight: 1.4 },
  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12, alignSelf: "start" },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 8, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "2rem", fontWeight: 800, color: PRIMARY, letterSpacing: "-0.02em" },
  bigSub: { fontSize: "0.8rem", color: "#777", marginTop: 2 },
  statRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  stat: { display: "flex", flexDirection: "column", gap: 1 },
  statLabel: { fontSize: "0.78rem", color: "#666" },
  statValue: { fontSize: "1.15rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  dueBox: { display: "flex", flexDirection: "column", gap: 4, border: "1px solid #E0EBE7", borderRadius: 10, padding: "10px 12px", background: "#fff" },
  dueLabel: { fontSize: "0.78rem", fontWeight: 600, color: "#2A6A58" },
  dueList: { margin: 0, paddingLeft: 18, fontSize: "0.85rem", lineHeight: 1.6, color: "#333" },
  dueNext: { fontWeight: 700, color: PRIMARY },
  dueNote: { fontSize: "0.76rem", color: "#666", lineHeight: 1.5 },
  breakdown: { display: "flex", flexDirection: "column", gap: 6, borderTop: "1px solid #E6F0EC", paddingTop: 10 },
  row: { display: "flex", justifyContent: "space-between", gap: 12, fontSize: "0.83rem" },
  rowLabel: { color: "#666" },
  rowValue: { fontWeight: 600, fontVariantNumeric: "tabular-nums" },
  noteBox: { borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 2, border: "1px solid #E0EBE7", background: "#fff" },
  noteOk: { background: "#EAF7F1", borderColor: "#BFE6D7" },
  noteWarn: { background: "#FBF4E4", borderColor: "#F0DEB4" },
  noteLabel: { fontSize: "0.78rem", fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: "0.03em" },
  noteText: { fontSize: "0.8rem", color: "#777", lineHeight: 1.5 },
  disclaimer: { fontSize: "0.76rem", color: "#7a8783", lineHeight: 1.5, marginTop: 2 },
};
