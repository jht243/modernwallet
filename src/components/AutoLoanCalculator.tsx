import { useMemo, useState } from "react";
import { computeAutoLoan, type AutoLoanInput } from "../lib/auto-loan";
import { fmtUSD, fmtMonths } from "../lib/format";
import { useDraft } from "./calc-ui";
import ToolPicks, { book } from "./ToolPicks";

// AutoIQ calculator island. Reads its initial inputs from the `initialData` prop (the page's
// preset) instead of any injected global — fully standalone, no external host coupling.

interface Props {
  // Mortgage mode adds optional escrow inputs (property tax, insurance, HOA) for a true PITI total.
  initialData?: Partial<AutoLoanInput> & { propertyTaxAnnual?: number; homeInsuranceAnnual?: number; hoaMonthly?: number; existingLoanOption?: boolean };
  heading?: string;
  subheading?: string;
  /** When true, this calculator is being used for a mortgage (relabels "vehicle price" → "home price"). */
  mortgageMode?: boolean;
}

const DEFAULTS: AutoLoanInput = {
  vehiclePrice: 35000,
  downPayment: 5000,
  tradeInValue: 0,
  tradeInOwed: 0,
  cashIncentives: 0,
  salesTaxPct: 0,
  titleFees: 0,
  includeTaxesFees: false,
  interestRatePct: 7.5,
  loanTermMonths: 60,
  extraMonthlyPayment: 0,
};

const TERM_OPTIONS = [24, 36, 48, 60, 72, 84];
const MORTGAGE_TERMS = [120, 180, 240, 360];

export default function AutoLoanCalculator({ initialData, heading, subheading, mortgageMode = false }: Props) {
  const [input, setInput] = useState<AutoLoanInput>({ ...DEFAULTS, ...initialData });
  const [showSchedule, setShowSchedule] = useState(false);
  // Mortgage mode: "I already have this mortgage" models a loan in progress. The price field becomes the
  // current balance (no down payment) and the term becomes the time left on the statement.
  const [existing, setExisting] = useState(false);
  const [left, setLeft] = useState({ years: 26, months: 0 });
  const monthsLeft = Math.max(1, Math.round(left.years) * 12 + Math.round(left.months));
  // Offered on the payoff page only (preset flag), where readers already have a loan.
  const existingLoanOption = mortgageMode && Boolean(initialData?.existingLoanOption);
  const isExisting = existingLoanOption && existing;
  const calcInput = useMemo<AutoLoanInput>(
    () => (isExisting ? { ...input, downPayment: 0, loanTermMonths: monthsLeft } : input),
    [input, isExisting, monthsLeft],
  );

  const result = useMemo(() => computeAutoLoan(calcInput), [calcInput]);
  // Keeps a typed "6." while the reader is still entering "6.875" (shared calc-ui draft helper).
  const rateDraft = useDraft(input.interestRatePct, (v) => set({ interestRatePct: v }));

  const set = (patch: Partial<AutoLoanInput>) => setInput((s) => ({ ...s, ...patch }));
  // The first tax or fee entered turns "roll into the loan" on (most buyers finance them); after that the
  // checkbox is the reader's.
  const setTaxFees = (patch: Partial<AutoLoanInput>) =>
    setInput((s) => ({ ...s, ...patch, includeTaxesFees: !(s.salesTaxPct || s.titleFees) ? true : s.includeTaxesFees }));
  const num = (v: string) => (v === "" ? 0 : Math.max(0, Number(v.replace(/[^0-9.]/g, ""))));

  const downloadScheduleCSV = () => {
    const rows = [
      ["Month", "Payment", "Principal", "Interest", "Balance"],
      ...result.schedule.map((r) => [r.month, r.payment.toFixed(2), r.principal.toFixed(2), r.interest.toFixed(2), r.balance.toFixed(2)]),
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = mortgageMode ? "mortgage-amortization-schedule.csv" : "auto-loan-amortization-schedule.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const priceLabel = isExisting ? "Current loan balance" : mortgageMode ? "Home price" : "Vehicle price";
  const terms = mortgageMode ? MORTGAGE_TERMS : TERM_OPTIONS;
  const hasExtra = (input.extraMonthlyPayment ?? 0) > 0;

  // Escrow (mortgage only) → true PITI total payment.
  const [escrow, setEscrow] = useState({
    propertyTaxAnnual: Number(initialData?.propertyTaxAnnual) || 0,
    homeInsuranceAnnual: Number(initialData?.homeInsuranceAnnual) || 0,
    hoaMonthly: Number(initialData?.hoaMonthly) || 0,
  });
  // No PMI estimate for an existing loan: we don't know the home's value, so the loan-to-value is unknown.
  const pmiMonthly = mortgageMode && !isExisting && input.vehiclePrice > 0 && (result.loanAmount ?? 0) > 0 &&
    (input.downPayment ?? 0) / input.vehiclePrice < 0.2
    ? ((result.loanAmount ?? 0) * 0.006) / 12 : 0;
  const escrowMonthly = escrow.propertyTaxAnnual / 12 + escrow.homeInsuranceAnnual / 12 + escrow.hoaMonthly + pmiMonthly;
  const showPITI = mortgageMode && escrowMonthly > 0.5 && result.monthlyPaymentPI != null;
  const totalMonthly = (result.monthlyPaymentPI ?? 0) + escrowMonthly;

  const principalPct = result.loanAmount && result.totalCost
    ? Math.round((result.loanAmount / result.totalCost) * 100)
    : 0;

  return (
    <div style={S.wrap}>
      {(heading || subheading) && (
        <div style={S.head}>
          {heading && <div style={S.heading}>{heading}</div>}
          {subheading && <div style={S.subheading}>{subheading}</div>}
        </div>
      )}

      <div style={S.grid}>
        {/* ---- Inputs ---- */}
        <div style={S.inputs}>
          {existingLoanOption && (
            <label style={S.check}>
              <input type="checkbox" style={S.checkBox} checked={existing} onChange={(e) => setExisting(e.target.checked)} />
              <span>I already have this mortgage (use my current balance and time left)</span>
            </label>
          )}
          <Field label={priceLabel}>
            <MoneyInput value={input.vehiclePrice} onChange={(v) => set({ vehiclePrice: v })} />
          </Field>
          {!isExisting && (
            <Field label="Down payment">
              <MoneyInput value={input.downPayment ?? 0} onChange={(v) => set({ downPayment: v })} />
            </Field>
          )}

          {!mortgageMode && (
            <div style={S.row2}>
              <Field label="Trade-in value">
                <MoneyInput value={input.tradeInValue ?? 0} onChange={(v) => set({ tradeInValue: v })} />
              </Field>
              <Field label="Still owed on trade-in">
                <MoneyInput value={input.tradeInOwed ?? 0} onChange={(v) => set({ tradeInOwed: v })} />
              </Field>
            </div>
          )}

          <div style={S.row2}>
            <Field label="Interest rate (APR)">
              <div style={S.suffixWrap}>
                <input
                  style={S.input}
                  inputMode="decimal"
                  value={rateDraft.text}
                  placeholder="0"
                  onChange={(e) => rateDraft.onChange(e.target.value)}
                  onBlur={rateDraft.onBlur}
                  aria-label="Interest rate percent"
                />
                <span style={S.suffix}>%</span>
              </div>
            </Field>
            {isExisting ? (
              <div style={S.row2}>
                <Field label="Years left">
                  <input style={S.input} inputMode="numeric" value={left.years || ""} placeholder="0" aria-label="Years left on the loan"
                    onChange={(e) => setLeft((l) => ({ ...l, years: Math.min(40, num(e.target.value)) }))} />
                </Field>
                <Field label="Months left">
                  <input style={S.input} inputMode="numeric" value={left.months || ""} placeholder="0" aria-label="Extra months left on the loan"
                    onChange={(e) => setLeft((l) => ({ ...l, months: Math.min(11, num(e.target.value)) }))} />
                </Field>
              </div>
            ) : (
            <Field label="Loan term">
              <select
                style={S.input}
                value={input.loanTermMonths}
                onChange={(e) => set({ loanTermMonths: Number(e.target.value) })}
                aria-label="Loan term in months"
              >
                {terms.map((t) => (
                  <option key={t} value={t}>
                    {mortgageMode ? `${t / 12} years` : `${t} months`}
                  </option>
                ))}
              </select>
            </Field>
            )}
          </div>

          {!mortgageMode && (
            <>
              <div style={S.row2}>
                <Field label="Sales tax %">
                  <PctField value={input.salesTaxPct ?? 0} onChange={(v) => setTaxFees({ salesTaxPct: v })} />
                </Field>
                <Field label="Title, registration & dealer fees">
                  <MoneyInput value={input.titleFees ?? 0} onChange={(v) => setTaxFees({ titleFees: v })} />
                </Field>
              </div>
              {((input.salesTaxPct ?? 0) > 0 || (input.titleFees ?? 0) > 0) && (
                <label style={S.check}>
                  <input type="checkbox" style={S.checkBox} checked={Boolean(input.includeTaxesFees)} onChange={(e) => set({ includeTaxesFees: e.target.checked })} />
                  <span>Roll tax and fees into the loan (uncheck if you're paying them up front)</span>
                </label>
              )}
              <p style={S.hint}>Tax is figured on the price after your trade-in, the way most states do it. Some states tax the full price — check your state's rule.</p>
            </>
          )}

          <Field label="Extra payment per month (optional)">
            <MoneyInput value={input.extraMonthlyPayment ?? 0} onChange={(v) => set({ extraMonthlyPayment: v })} />
          </Field>

          {mortgageMode && (
            <>
              <div style={S.row2}>
                <Field label="Property tax / year">
                  <MoneyInput value={escrow.propertyTaxAnnual} onChange={(v) => setEscrow((s) => ({ ...s, propertyTaxAnnual: v }))} />
                </Field>
                <Field label="Home insurance / year">
                  <MoneyInput value={escrow.homeInsuranceAnnual} onChange={(v) => setEscrow((s) => ({ ...s, homeInsuranceAnnual: v }))} />
                </Field>
              </div>
              <Field label="HOA / month (optional)">
                <MoneyInput value={escrow.hoaMonthly} onChange={(v) => setEscrow((s) => ({ ...s, hoaMonthly: v }))} />
              </Field>
            </>
          )}
        </div>

        {/* ---- Results ---- */}
        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>{showPITI ? "Total monthly payment" : "Monthly payment"}</span>
            <span style={S.bigValue}>
              {fmtUSD(showPITI ? totalMonthly : result.monthlyPaymentPI)}
              {hasExtra && <span style={S.plusExtra}> + {fmtUSD(input.extraMonthlyPayment)} extra</span>}
            </span>
            {showPITI && <span style={S.bigSub}>principal, interest, taxes & insurance (PITI)</span>}
          </div>

          {showPITI && (
            <div style={S.statRow}>
              <Stat label="Principal & interest" value={fmtUSD(result.monthlyPaymentPI)} />
              <Stat label={`Taxes, insurance${pmiMonthly > 0 ? " + PMI" : ""}`} value={fmtUSD(escrowMonthly)} />
            </div>
          )}

          {!mortgageMode && (result.taxes ?? 0) > 0 && (
            <div style={S.statRow}>
              <Stat label="Sales tax" value={fmtUSD(result.taxes, { cents: true })} />
              <Stat label={input.includeTaxesFees ? "Tax + fees in the loan" : "Tax + fees paid up front"} value={fmtUSD((result.taxes ?? 0) + (input.titleFees ?? 0), { cents: true })} />
            </div>
          )}
          <div style={S.statRow}>
            <Stat label="Loan amount" value={fmtUSD(result.loanAmount)} />
            <Stat label="Total interest" value={fmtUSD(result.lifetimeInterest)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Payoff time" value={fmtMonths(result.monthsToPayoff)} />
            <Stat label="Total of payments" value={fmtUSD(result.totalCost)} />
          </div>

          {result.totalCost != null && result.loanAmount != null && (
            <div style={S.barWrap} aria-hidden="true">
              <div style={S.barTrack}>
                <div style={{ ...S.barPrincipal, width: `${principalPct}%` }} />
                <div style={{ ...S.barInterest, width: `${100 - principalPct}%` }} />
              </div>
              <div style={S.barLegend}>
                <span><span style={{ ...S.dot, background: PRIMARY }} /> Principal</span>
                <span><span style={{ ...S.dot, background: ACCENT }} /> Interest</span>
              </div>
            </div>
          )}

          {hasExtra && result.interestSaved != null && (result.interestSaved > 0 || (result.monthsSaved ?? 0) > 0) && (
            <div style={S.savings}>
              <strong>With your extra payment:</strong> save{" "}
              <strong>{fmtUSD(result.interestSaved)}</strong> in interest and pay off{" "}
              <strong>{fmtMonths(result.monthsSaved)}</strong> sooner
              {result.baselineMonths != null && (
                <span style={S.savingsSub}> (vs. {fmtMonths(result.baselineMonths)} on {isExisting ? "your current" : "the original"} schedule)</span>
              )}
            </div>
          )}

          {result.schedule.length > 0 && (
            <div style={S.toggleRow}>
              <button style={S.toggle} onClick={() => setShowSchedule((v) => !v)} type="button">
                {showSchedule ? "Hide" : "Show"} amortization schedule ({result.schedule.length} payments)
              </button>
              <button style={S.toggle} onClick={downloadScheduleCSV} type="button">
                Download full schedule (CSV)
              </button>
            </div>
          )}

          {!mortgageMode && result.monthlyPaymentPI != null && (
            <ToolPicks
              tool="auto-loan"
              heading="Further reading on paying for a car"
              picks={hasExtra
                ? [
                    book("totalMoneyMakeover", "A plan for putting the extra payment toward the loan until it's gone."),
                    book("iwtytbr", "The system around it: automatic savings so the next car is bought with less debt."),
                  ]
                : [
                    book("iwtytbr", "Has a chapter on buying a car: negotiating and deciding how much car to buy."),
                    book("ymoyl", "Weighs a payment against the hours of work it costs."),
                  ]}
            />
          )}

          {existingLoanOption && result.monthlyPaymentPI != null && (
            <ToolPicks
              tool="mortgage"
              heading={hasExtra || isExisting ? "Further reading on paying off a mortgage early" : "Further reading on buying a home"}
              picks={hasExtra || isExisting
                ? [
                    book("totalMoneyMakeover", "A step-by-step plan for putting extra money toward the house."),
                    book("bogleheads", "The investing side of the choice, if the extra might earn more elsewhere."),
                  ]
                : [
                    book("noloFirstHome", "Covers the buying steps around the payment you just priced."),
                    book("totalMoneyMakeover", "A plan for the debts to clear before you take on a mortgage."),
                  ]}
            />
          )}
        </div>
      </div>

      {showSchedule && result.schedule.length > 0 && (
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Month</th>
                <th style={{ ...S.th, ...S.right }}>Payment</th>
                <th style={{ ...S.th, ...S.right }}>Principal</th>
                <th style={{ ...S.th, ...S.right }}>Interest</th>
                <th style={{ ...S.th, ...S.right }}>Balance</th>
              </tr>
            </thead>
            <tbody>
              {scheduleRows(result.schedule).map((r) => (
                <tr key={r.month}>
                  <td style={S.td}>{r.month}</td>
                  <td style={{ ...S.td, ...S.right }}>{fmtUSD(r.payment, { cents: true })}</td>
                  <td style={{ ...S.td, ...S.right }}>{fmtUSD(r.principal, { cents: true })}</td>
                  <td style={{ ...S.td, ...S.right }}>{fmtUSD(r.interest, { cents: true })}</td>
                  <td style={{ ...S.td, ...S.right }}>{fmtUSD(r.balance, { cents: true })}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={S.tableNote}>Showing every payment in the first year, then one row per year.</p>
        </div>
      )}
    </div>
  );
}

// Show first 12 months in full, then one row per 12 months thereafter (keeps long schedules readable).
function scheduleRows(schedule: { month: number; payment: number; principal: number; interest: number; balance: number }[]) {
  return schedule.filter((r) => r.month <= 12 || r.month % 12 === 0 || r.month === schedule.length);
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
        inputMode="numeric"
        value={value === 0 ? "" : value.toLocaleString("en-US")}
        placeholder="0"
        onChange={(e) => onChange(e.target.value === "" ? 0 : Math.max(0, Number(e.target.value.replace(/[^0-9.]/g, ""))))}
      />
    </div>
  );
}

function PctField({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  // Shared draft helper keeps a typed "7." while the reader enters "7.25".
  const d = useDraft(value, onChange);
  return (
    <div style={S.suffixWrap}>
      <input style={S.input} inputMode="decimal" value={d.text} placeholder="0" onChange={(e) => d.onChange(e.target.value)} onBlur={d.onBlur} aria-label="Sales tax percent" />
      <span style={S.suffix}>%</span>
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
  input: {
    width: "100%", padding: "10px 12px", fontSize: "1rem", border: "1px solid #D0DAD6",
    borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A",
  },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  suffix: { position: "absolute", right: 12, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  results: {
    background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)",
    border: "1px solid #D8EEE6", borderRadius: 14, padding: 18,
    display: "flex", flexDirection: "column", gap: 12,
  },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 8, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "2rem", fontWeight: 800, color: PRIMARY, letterSpacing: "-0.02em" },
  bigSub: { fontSize: "0.8rem", color: "#777", marginTop: 2 },
  plusExtra: { fontSize: "0.9rem", fontWeight: 600, color: "#777" },
  statRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  stat: { display: "flex", flexDirection: "column", gap: 1 },
  statLabel: { fontSize: "0.78rem", color: "#666" },
  statValue: { fontSize: "1.15rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  barWrap: { marginTop: 4 },
  hint: { fontSize: "0.8rem", color: "#666", lineHeight: 1.5, margin: 0 },
  check: { display: "flex", alignItems: "center", gap: 10, fontSize: "0.88rem", color: "#333", cursor: "pointer", minHeight: 32 },
  checkBox: { width: 20, height: 20, margin: 0, flexShrink: 0 },
  barTrack: { display: "flex", height: 10, borderRadius: 6, overflow: "hidden", background: "#EEF4F2" },
  barPrincipal: { background: PRIMARY, height: "100%" },
  barInterest: { background: ACCENT, height: "100%" },
  barLegend: { display: "flex", gap: 16, fontSize: "0.78rem", color: "#555", marginTop: 6 },
  dot: { display: "inline-block", width: 9, height: 9, borderRadius: 3, marginRight: 5, verticalAlign: "middle" },
  savings: {
    background: "#FBF4E4", border: "1px solid #F0DEB4", borderRadius: 10,
    padding: "12px 14px", fontSize: "0.92rem", lineHeight: 1.5, color: "#5A4420",
  },
  savingsSub: { color: "#8A7340" },
  toggleRow: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 4 },
  toggle: {
    padding: "9px 12px", border: "1px solid #CFE3DC", background: "#fff",
    borderRadius: 8, fontSize: "0.88rem", fontWeight: 600, color: PRIMARY, cursor: "pointer",
  },
  tableWrap: { marginTop: 18, overflowX: "auto", border: "1px solid #EAEFED", borderRadius: 10 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" },
  th: { textAlign: "left", padding: "10px 12px", background: "#F4FAF8", fontWeight: 700, color: "#2A6A58", borderBottom: "1px solid #E0EBE7" },
  td: { padding: "8px 12px", borderBottom: "1px solid #F0F4F2", fontVariantNumeric: "tabular-nums" },
  right: { textAlign: "right" },
  tableNote: { fontSize: "0.78rem", color: "#888", padding: "8px 12px", margin: 0 },
};
