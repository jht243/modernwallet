import { useMemo, useState } from "react";
import { computeIul, type IulInput } from "../lib/iul";
import { fmtUSD, fmtPct } from "../lib/format";

// Indexed universal life projection island. Every carrier calculator ranking for "iul calculator"
// illustrates the upside and stops there. This one leads with the two numbers that decide whether
// a policy is worth funding: what the CAP costs over the full horizon (compounded, not a sum of
// annual give-ups), and what the RISING cost of insurance consumes. It also shows the lapse year
// for a policy funded near its minimum, which is the failure mode the category is known for.
//
// Every policy input is user-supplied. No carrier's real cap, COI table, or pricing is hard-coded:
// the defaults below are illustrative assumptions, labelled as such in the UI.
// Standalone, no host coupling (mirrors TaxableVsTaxDeferredCalculator).

interface Props {
  initialData?: Partial<IulInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: IulInput = {
  annualPremium: 12000,
  yearsFunded: 20,
  currentAge: 40,
  projectToAge: 70,
  deathBenefit: 500000,
  capRatePct: 9,
  participationRatePct: 100,
  floorPct: 0,
  assumedIndexReturnPct: 7,
  variableReturns: true,
  coiPerThousand: 2.5,
  coiEscalationPct: 8,
  premiumLoadPct: 6,
  monthlyAdminFee: 10,
  surrenderChargePct: 10,
  surrenderChargeYears: 10,
  baseline: "401k",
  baselineReturnPct: 7,
  baselineExpenseRatioPct: 0.1,
  employerMatchPct: 50,
  taxRatePct: 24,
};

export default function IulCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<IulInput>({ ...DEFAULTS, ...initialData });
  const [showTable, setShowTable] = useState(false);
  const [showAssumptions, setShowAssumptions] = useState(false);
  const result = useMemo(() => computeIul(input), [input]);
  const set = (patch: Partial<IulInput>) => setInput((s) => ({ ...s, ...patch }));

  const rows = result.rows ?? [];
  const years = Math.max(0, input.projectToAge - input.currentAge);
  const baselineLabel = input.baseline === "401k" ? "401(k) with match" : "Taxable brokerage";
  const gap = (result.finalSurrenderValue ?? 0) - (result.finalBaselineBalance ?? 0);
  const iulBehind = gap < 0;

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
          <div style={S.groupLabel}>The policy</div>
          <div style={S.row2}>
            <Field label="Annual premium">
              <MoneyInput value={input.annualPremium} onChange={(v) => set({ annualPremium: v })} />
            </Field>
            <Field label="Years you pay it">
              <PlainInput value={input.yearsFunded} onChange={(v) => set({ yearsFunded: v })} />
            </Field>
          </div>
          <div style={S.row2}>
            <Field label="Your age now">
              <PlainInput value={input.currentAge} onChange={(v) => set({ currentAge: v })} />
            </Field>
            <Field label="Project to age">
              <PlainInput value={input.projectToAge} onChange={(v) => set({ projectToAge: v })} />
            </Field>
          </div>
          <Field label="Death benefit (face amount)">
            <MoneyInput value={input.deathBenefit} onChange={(v) => set({ deathBenefit: v })} />
          </Field>
          <div style={S.row2}>
            <Field label="Index cap rate">
              <PctInput value={input.capRatePct} onChange={(v) => set({ capRatePct: v })} />
            </Field>
            <Field label="Participation rate">
              <PctInput value={input.participationRatePct} onChange={(v) => set({ participationRatePct: v })} />
            </Field>
          </div>
          <div style={S.row2}>
            <Field label="Floor">
              <PctInput value={input.floorPct} onChange={(v) => set({ floorPct: v })} />
            </Field>
            <Field label="Assumed index return">
              <PctInput value={input.assumedIndexReturnPct} onChange={(v) => set({ assumedIndexReturnPct: v })} />
            </Field>
          </div>
          <label style={S.check}>
            <input
              type="checkbox"
              checked={input.variableReturns}
              onChange={(e) => set({ variableReturns: e.target.checked })}
            />
            <span>Vary the index year to year (so the cap can actually bite)</span>
          </label>

          <div style={S.groupLabel}>Compare against</div>
          <Field label="Baseline account">
            <select
              style={S.input}
              value={input.baseline}
              onChange={(e) => set({ baseline: e.target.value as IulInput["baseline"] })}
            >
              <option value="401k">401(k) with employer match</option>
              <option value="brokerage">Taxable brokerage</option>
            </select>
          </Field>
          <div style={S.row2}>
            <Field label="Baseline return">
              <PctInput value={input.baselineReturnPct} onChange={(v) => set({ baselineReturnPct: v })} />
            </Field>
            {input.baseline === "401k" ? (
              <Field label="Employer match">
                <PctInput value={input.employerMatchPct} onChange={(v) => set({ employerMatchPct: v })} />
              </Field>
            ) : (
              <Field label="Your tax rate">
                <PctInput value={input.taxRatePct} onChange={(v) => set({ taxRatePct: v })} />
              </Field>
            )}
          </div>

          <button style={S.toggle} onClick={() => setShowAssumptions((v) => !v)} type="button">
            {showAssumptions ? "Hide" : "Edit"} charge assumptions
          </button>
          {showAssumptions && (
            <div style={S.assumptions}>
              <div style={S.row2}>
                <Field label="Cost of insurance per $1,000">
                  <MoneyInput value={input.coiPerThousand} onChange={(v) => set({ coiPerThousand: v })} />
                </Field>
                <Field label="COI rises per year">
                  <PctInput value={input.coiEscalationPct} onChange={(v) => set({ coiEscalationPct: v })} />
                </Field>
              </div>
              <div style={S.row2}>
                <Field label="Premium load">
                  <PctInput value={input.premiumLoadPct} onChange={(v) => set({ premiumLoadPct: v })} />
                </Field>
                <Field label="Monthly admin fee">
                  <MoneyInput value={input.monthlyAdminFee} onChange={(v) => set({ monthlyAdminFee: v })} />
                </Field>
              </div>
              <div style={S.row2}>
                <Field label="Surrender charge, year 1">
                  <PctInput value={input.surrenderChargePct} onChange={(v) => set({ surrenderChargePct: v })} />
                </Field>
                <Field label="Grades to zero over">
                  <PlainInput value={input.surrenderChargeYears} onChange={(v) => set({ surrenderChargeYears: v })} />
                </Field>
              </div>
              <p style={S.hint}>
                These are your assumptions, not any carrier's published rates. Ask for an in-force
                illustration run at the guaranteed maximum charges and enter those numbers here.
              </p>
            </div>
          )}
        </div>

        <div style={S.results}>
          <div style={S.headlineBox}>
            <span style={S.headlineLabel}>Over {years} years, on these assumptions</span>
            <span style={S.headlineText}>
              the cap gave up <b style={S.hl}>{fmtUSD(result.capCostCompounded)}</b> of growth and the
              cost of insurance consumed <b style={S.hl}>{fmtUSD(result.totalCostOfInsurance)}</b>,
              leaving the surrender value{" "}
              <b style={S.hl}>{fmtUSD(Math.abs(gap))}</b> {iulBehind ? "below" : "above"} the{" "}
              {baselineLabel.toLowerCase()}.
            </span>
          </div>

          <div style={S.statRow}>
            <Stat label="IUL surrender value" value={fmtUSD(result.finalSurrenderValue)} />
            <Stat label={baselineLabel} value={fmtUSD(result.finalBaselineBalance)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Total premium paid" value={fmtUSD(result.totalPremium)} />
            <Stat label="Same policy with no cap" value={fmtUSD(result.uncappedFinalCashValue)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Cost of insurance charged" value={fmtUSD(result.totalCostOfInsurance)} />
            <Stat label="Policy expenses charged" value={fmtUSD(result.totalExpenses)} />
          </div>

          {result.lapseYear != null && (
            <div style={S.warnBox}>
              <b>This policy lapses in year {result.lapseYear}</b>, at age{" "}
              {input.currentAge + result.lapseYear - 1}. Charges outgrow the cash value, the account
              hits zero, and the coverage ends. If the policy has gain at that point, a tax bill can
              follow. Fund it above the minimum or lower the death benefit.
            </div>
          )}

          <div style={S.noteBox}>
            {result.crossoverYear != null ? (
              <>The IUL surrender value passes the {baselineLabel.toLowerCase()} in year{" "}
              {result.crossoverYear}.</>
            ) : (
              <>The IUL surrender value never passes the {baselineLabel.toLowerCase()} inside these{" "}
              {years} years.</>
            )}
          </div>

          <button style={S.toggle} onClick={() => setShowTable((v) => !v)} type="button">
            {showTable ? "Hide" : "Show"} the year-by-year numbers
          </button>
        </div>
      </div>

      {showTable && (
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr>
                {["Yr", "Age", "Index", "Credited", "Cap cost", "COI", "Cash value", "Surrender", baselineLabel].map((h) => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.year} style={r.cashValue === 0 ? S.trDead : undefined}>
                  <td style={S.td}>{r.year}</td>
                  <td style={S.td}>{r.age}</td>
                  <td style={S.td}>{fmtPct(r.uncappedRatePct, 1)}</td>
                  <td style={S.td}>{fmtPct(r.creditedRatePct, 1)}</td>
                  <td style={S.td}>{r.capGivenUp > 0 ? fmtUSD(r.capGivenUp) : "—"}</td>
                  <td style={S.td}>{fmtUSD(r.costOfInsurance)}</td>
                  <td style={S.td}>{fmtUSD(r.cashValue)}</td>
                  <td style={S.td}>{fmtUSD(r.surrenderValue)}</td>
                  <td style={S.td}>{fmtUSD(r.baselineBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={S.hint}>
            Watch the years where the index column beats the credited column. That difference is
            growth the cap kept out. Watch the cost-of-insurance column climb as you age, and note
            that in a 0% credited year the cash value still falls, because the charges are still
            deducted.
          </p>
        </div>
      )}

      <div style={S.disclaimer}>
        This is an illustration of the assumptions you entered, not a prediction and not a quote. A
        real policy's credited rate depends on the carrier's cap and participation rate, which most
        carriers can change on an in-force policy. Only the guaranteed minimum floor and the
        guaranteed maximum charges are contractual. Cost of insurance here is a simplified rate per
        $1,000 of net amount at risk that rises each year. A real carrier uses an age-banded table,
        and it charges against a death benefit that must stay above the cash value under IRC section
        7702, which this model approximates. Tax treatment, modified endowment contract status, and
        policy-loan taxation are not modelled. Ask for an in-force illustration at guaranteed
        maximum charges before you sign anything.
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
        onChange={(e) => onChange(e.target.value === "" ? 0 : Math.max(0, Number(e.target.value.replace(/[^0-9.]/g, ""))))}
      />
    </div>
  );
}
function PctInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={S.suffixWrap}>
      <input
        style={S.input}
        inputMode="decimal"
        value={value === 0 ? "" : value}
        placeholder="0"
        onChange={(e) => onChange(Math.max(0, Number(e.target.value.replace(/[^0-9.]/g, ""))))}
        aria-label="Percent"
      />
      <span style={S.suffix}>%</span>
    </div>
  );
}
function PlainInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      style={S.input}
      inputMode="numeric"
      value={value === 0 ? "" : value}
      placeholder="0"
      onChange={(e) => onChange(Math.max(0, Math.round(Number(e.target.value.replace(/[^0-9]/g, "")) || 0)))}
    />
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

const PRIMARY = "#0E7C66";
const S: Record<string, React.CSSProperties> = {
  wrap: { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1A1A1A" },
  head: { marginBottom: 16 },
  heading: { fontSize: "1.2rem", fontWeight: 700 },
  subheading: { fontSize: "0.95rem", color: "#555", marginTop: 2 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 },
  inputs: { display: "flex", flexDirection: "column", gap: 12 },
  groupLabel: { fontSize: "0.72rem", fontWeight: 700, color: PRIMARY, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4 },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#444" },
  input: { width: "100%", padding: "10px 12px", fontSize: "1rem", border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A" },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  suffix: { position: "absolute", right: 12, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  check: { display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", color: "#444", cursor: "pointer" },
  hint: { fontSize: "0.82rem", color: "#666", lineHeight: 1.5, margin: "6px 0 0" },
  assumptions: { display: "flex", flexDirection: "column", gap: 12, padding: 12, border: "1px dashed #D0DAD6", borderRadius: 10, background: "#FAFCFB" },
  toggle: { alignSelf: "flex-start", background: "none", border: "none", color: PRIMARY, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", padding: "4px 0", textDecoration: "underline" },
  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12, alignSelf: "start" },
  headlineBox: { borderRadius: 10, padding: "14px 16px", background: "#fff", border: "1px solid #BFE6D7", display: "flex", flexDirection: "column", gap: 6 },
  headlineLabel: { fontSize: "0.72rem", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: "0.04em" },
  headlineText: { fontSize: "0.98rem", lineHeight: 1.6, color: "#1A1A1A" },
  hl: { color: PRIMARY, fontVariantNumeric: "tabular-nums" },
  statRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  stat: { display: "flex", flexDirection: "column", gap: 1 },
  statLabel: { fontSize: "0.78rem", color: "#666" },
  statValue: { fontSize: "1.12rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  warnBox: { borderRadius: 10, padding: "12px 14px", background: "#FBF4E4", border: "1px solid #F0DEB4", fontSize: "0.85rem", lineHeight: 1.55, color: "#5c4a1f" },
  noteBox: { fontSize: "0.85rem", color: "#555", lineHeight: 1.5 },
  tableWrap: { marginTop: 20, overflowX: "auto", WebkitOverflowScrolling: "touch" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", minWidth: 720 },
  th: { textAlign: "right", padding: "8px 10px", borderBottom: "2px solid #D8EEE6", color: "#555", fontWeight: 700, whiteSpace: "nowrap" },
  td: { textAlign: "right", padding: "7px 10px", borderBottom: "1px solid #EFF4F2", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" },
  trDead: { background: "#FDF6F6", color: "#9a6a6a" },
  disclaimer: { fontSize: "0.76rem", color: "#7a8783", lineHeight: 1.5, marginTop: 16 },
};
