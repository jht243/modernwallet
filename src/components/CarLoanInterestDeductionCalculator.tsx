import { useMemo, useState } from "react";
import { computeCarLoanDeduction, interestOverMonths, DEDUCTION_CAP, PHASE_OUT_START, type CliInput, type CliStatus } from "../lib/car-loan-deduction";
import { fmtUSD } from "../lib/format";
import { Field, MoneyInput, NumInput, PctInput, Stat, S } from "./calc-ui";

// Car loan interest deduction island (X-trends pass 2026-10-27). Qualified passenger vehicle loan interest,
// tax years 2025 through 2028, following Schedule 1-A (Form 1040) Part IV lines 24 to 30.

interface Props {
  initialData?: Partial<CliInput> & { source?: "paid" | "loan"; loanAmount?: number; aprPct?: number; termMonths?: number; monthsInYear?: number };
  heading?: string;
  subheading?: string;
}

const DEFAULTS = { status: "single" as CliStatus, magi: 95000, interestPaid: 4200, marginalRatePct: 22, source: "paid" as "paid" | "loan", loanAmount: 45000, aprPct: 9, termMonths: 72, monthsInYear: 12 };

const STATUS_LABEL: Record<CliStatus, string> = {
  single: "Single",
  mfj: "Married filing jointly",
  hoh: "Head of household",
  mfs: "Married filing separately",
};

export default function CarLoanInterestDeductionCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState({ ...DEFAULTS, ...initialData });
  const set = (p: Partial<typeof DEFAULTS>) => setV((s) => ({ ...s, ...p }));
  const estimated = useMemo(() => interestOverMonths(v.loanAmount, v.aprPct, v.termMonths, v.monthsInYear), [v.loanAmount, v.aprPct, v.termMonths, v.monthsInYear]);
  const interest = v.source === "loan" ? estimated : v.interestPaid;
  const r = useMemo(() => computeCarLoanDeduction({ status: v.status, magi: v.magi, interestPaid: interest, marginalRatePct: v.marginalRatePct }), [v.status, v.magi, interest, v.marginalRatePct]);

  const verdict =
    interest <= 0 ? "Enter the loan interest you paid this tax year."
    : r.deduction >= r.capped && r.capped > 0 ? (interest > DEDUCTION_CAP ? `The ${fmtUSD(DEDUCTION_CAP)} annual cap applies; ${fmtUSD(interest - DEDUCTION_CAP)} of interest earns nothing.` : "Your income is under the phase-out, so all of this interest is deductible.")
    : r.deduction > 0 ? `Your income is ${fmtUSD(r.excess)} over the phase-out start, which cuts the deduction by ${fmtUSD(r.reduction)}.`
    : `At this income the deduction is phased out completely (it reaches $0 at ${fmtUSD(r.zeroAtMagi)}).`;

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
          <Field label="Filing status">
            <select style={S.input} value={v.status} onChange={(e) => set({ status: e.target.value as CliStatus })} aria-label="Filing status">
              {(Object.keys(STATUS_LABEL) as CliStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </select>
          </Field>
          <Field label="Modified adjusted gross income (MAGI)"><MoneyInput value={v.magi} onChange={(x) => set({ magi: x })} /></Field>
          <Field label="How do you want to enter the interest?">
            <select style={S.input} value={v.source} onChange={(e) => set({ source: e.target.value as "paid" | "loan" })} aria-label="How to enter the interest">
              <option value="paid">I know the interest I paid this year</option>
              <option value="loan">Estimate it from my loan</option>
            </select>
          </Field>
          {v.source === "paid" ? (
            <Field label="Qualifying car loan interest paid this tax year"><MoneyInput value={v.interestPaid} onChange={(x) => set({ interestPaid: x })} /></Field>
          ) : (
            <>
              <Field label="Loan balance at the start of the year (or the amount borrowed)"><MoneyInput value={v.loanAmount} onChange={(x) => set({ loanAmount: x })} /></Field>
              <Field label="Annual percentage rate (APR)"><PctInput value={v.aprPct} onChange={(x) => set({ aprPct: x })} /></Field>
              <Field label="Months left on the loan at that point"><NumInput value={v.termMonths} onChange={(x) => set({ termMonths: x })} /></Field>
              <Field label="Payments made during the tax year"><NumInput value={v.monthsInYear} onChange={(x) => set({ monthsInYear: x })} /></Field>
              <p style={S.hint}>Estimated interest for those payments: {fmtUSD(estimated)}. Your lender's year-end statement has the exact figure.</p>
            </>
          )}
          <Field label="Your federal marginal tax rate"><PctInput value={v.marginalRatePct} onChange={(x) => set({ marginalRatePct: x })} /></Field>
          <p style={S.hint}>The figures above are placeholders. The phase-out starts at {fmtUSD(PHASE_OUT_START[v.status])} of MAGI for this filing status.</p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Your car loan interest deduction</span>
            <span style={S.bigValue}>{fmtUSD(r.deduction)}</span>
            <span style={S.bigSub}>{verdict}</span>
          </div>
          <div style={S.statRow}>
            <Stat label="Interest counted (up to the cap)" value={fmtUSD(r.capped)} />
            <Stat label="Cut by the income phase-out" value={fmtUSD(Math.min(r.reduction, r.capped))} />
          </div>
          <div style={S.statRow}>
            <Stat label="Federal tax saved at your rate" value={fmtUSD(r.taxSaved)} />
            <Stat label="Interest that earns no deduction" value={fmtUSD(r.lost)} />
          </div>
          <p style={S.hint}>
            Phase-out steps: {r.steps} (each $1,000 of MAGI over {fmtUSD(r.start)}, or part of $1,000, removes $200). The deduction reaches $0 at {fmtUSD(r.zeroAtMagi)} of MAGI for this interest amount.
          </p>
          <div style={S.disclaimer}>
            Estimate only, for tax years 2025 through 2028. It follows Schedule 1-A (Form 1040), Part IV, lines 24 to 30, and assumes your vehicle and loan qualify (new, personal use, final assembly in the United States, bought after 2024). It does not check that, and it leaves out state tax and any interest you already deducted on Schedule C, E or F. MAGI is defined in the Schedule 1-A instructions; confirm it with your tax software or a preparer.
          </div>
        </div>
      </div>
    </div>
  );
}
