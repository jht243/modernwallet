import { useMemo, useState } from "react";
import { computeHardMoney, hardMoneySensitivity, type DrawMode, type HardMoneyInput } from "../lib/hard-money-loan";
import { fmtUSD, fmtPct } from "../lib/format";
import { Field, Money, Pct, Plain, Stat, Select, Notice, CopyResults, SimpleTable, S, num } from "./LoanToolKit";

// Hard money (short-term, interest-only) loan cost island. Standalone engine: src/lib/hard-money-loan.ts.
// Every figure comes from the terms the reader enters. The starting values are labelled examples, not lender data.

interface Props {
  initialData?: Record<string, unknown>;
  heading?: string;
  subheading?: string;
}

const usd = (n: number) => fmtUSD(n);

export default function HardMoneyLoanCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<HardMoneyInput>({
    purchasePrice: num(initialData?.purchasePrice, 200000),
    rehabBudget: num(initialData?.rehabBudget, 50000),
    purchaseAdvancePct: num(initialData?.purchaseAdvancePct, 90),
    rehabAdvancePct: num(initialData?.rehabAdvancePct, 100),
    aprPct: num(initialData?.aprPct, 12),
    pointsPct: num(initialData?.pointsPct, 2),
    months: num(initialData?.months, 6),
    otherFees: num(initialData?.otherFees, 2500),
    extensionMonths: num(initialData?.extensionMonths, 0),
    extensionFeePct: num(initialData?.extensionFeePct, 0),
    drawMode: (initialData?.drawMode === "even" ? "even" : "closing") as DrawMode,
    arv: num(initialData?.arv, 0),
    sellingCostPct: num(initialData?.sellingCostPct, 0),
    monthlyHoldingCost: num(initialData?.monthlyHoldingCost, 0),
  });
  const set = (p: Partial<HardMoneyInput>) => setV((s) => ({ ...s, ...p }));
  const r = useMemo(() => computeHardMoney(v), [v]);
  const sens = useMemo(() => (r.valid ? hardMoneySensitivity(v) : []), [v, r.valid]);

  const monthRows = r.months.map((m) => [`Month ${m.month}`, usd(m.balance), usd(m.interest), usd(m.cumulativeInterest)]);
  const sensRows = sens.map((s) => [s.label, usd(s.totalFinancingCost), `${s.change >= 0 ? "+" : "-"}${usd(Math.abs(s.change))}`]);
  const lines = [
    "Short-term loan cost estimate (from the terms entered; not a loan offer)",
    `Loan amount: ${usd(r.loan)} (${fmtPct(r.ltcPct, 1)} of purchase plus rehab)`,
    `Cash to close: ${usd(r.cashToClose)}`,
    `Points: ${usd(r.points)}; other fees: ${usd(r.otherFees)}`,
    `Monthly interest-only payment: ${usd(r.monthlyInterestFull)}`,
    `Interest over ${r.totalMonths} months: ${usd(r.interest + r.extensionInterest)}`,
    `Total financing cost: ${usd(r.totalFinancingCost)}`,
    `Balloon payoff at exit: ${usd(r.balloon)}`,
    r.profit != null ? `Profit before tax: ${usd(r.profit)}` : "",
  ].filter(Boolean);

  return (
    <div style={S.wrap}>
      {(heading || subheading) && (
        <div style={S.head}>
          {heading && <div style={S.heading}>{heading}</div>}
          {subheading && <div style={S.subheading}>{subheading}</div>}
        </div>
      )}
      <div style={S.grid}>
        <div style={S.inputs} className="mw-pin">
          <div style={S.group}>The deal</div>
          <div style={S.row2}>
            <Field label="Purchase price"><Money v={v.purchasePrice} on={(x) => set({ purchasePrice: x })} /></Field>
            <Field label="Rehab budget"><Money v={v.rehabBudget} on={(x) => set({ rehabBudget: x })} /></Field>
          </div>
          <div style={S.group}>Terms from your lender's quote</div>
          <div style={S.row2}>
            <Field label="Lender advances, % of purchase"><Pct v={v.purchaseAdvancePct} on={(x) => set({ purchaseAdvancePct: Math.min(x, 100) })} /></Field>
            <Field label="Lender advances, % of rehab"><Pct v={v.rehabAdvancePct} on={(x) => set({ rehabAdvancePct: Math.min(x, 100) })} /></Field>
          </div>
          <div style={S.row2}>
            <Field label="Interest rate (APR)" hint="Enter your quote. 12% is an example."><Pct v={v.aprPct} on={(x) => set({ aprPct: x })} /></Field>
            <Field label="Points (% of loan)" hint="Paid at closing."><Pct v={v.pointsPct} on={(x) => set({ pointsPct: x })} /></Field>
          </div>
          <div style={S.row2}>
            <Field label="Months until payoff"><Plain v={v.months} max={60} on={(x) => set({ months: x })} /></Field>
            <Field label="Lender, document and other fees"><Money v={v.otherFees} on={(x) => set({ otherFees: x })} /></Field>
          </div>
          <div style={S.row2}>
            <Field label="Extension months"><Plain v={v.extensionMonths} max={24} on={(x) => set({ extensionMonths: x })} /></Field>
            <Field label="Extension fee (% of balance)"><Pct v={v.extensionFeePct} on={(x) => set({ extensionFeePct: x })} /></Field>
          </div>
          <Field label="Rehab money is" hint="Changes the balance interest is charged on.">
            <Select v={v.drawMode} on={(x) => set({ drawMode: x })} options={[["closing", "Funded at closing"], ["even", "Drawn evenly each month"]]} />
          </Field>
          <div style={S.group}>Optional: resale profit</div>
          <div style={S.row2}>
            <Field label="After-repair value (ARV)"><Money v={v.arv} on={(x) => set({ arv: x })} /></Field>
            <Field label="Selling costs (% of ARV)"><Pct v={v.sellingCostPct} on={(x) => set({ sellingCostPct: x })} /></Field>
          </div>
          <Field label="Other holding costs per month" hint="Taxes, insurance, utilities. Not loan interest."><Money v={v.monthlyHoldingCost} on={(x) => set({ monthlyHoldingCost: x })} /></Field>
        </div>

        <div style={S.results}>
          {r.valid ? (
            <>
              <div style={S.bigStat}>
                <span style={S.bigLabel}>Total financing cost</span>
                <span style={S.bigValue}>{usd(r.totalFinancingCost)}</span>
                <span style={S.bigSub}>{`points + fees + ${r.totalMonths} months of interest${r.extensionFee > 0 ? " + extension fee" : ""}`}</span>
              </div>
              <div style={S.statRow}>
                <Stat label="Loan amount" value={usd(r.loan)} />
                <Stat label="Cash to close" value={usd(r.cashToClose)} />
              </div>
              <div style={S.statRow}>
                <Stat label="Monthly interest-only payment" value={usd(r.monthlyInterestFull)} />
                <Stat label="Balloon payoff at exit" value={usd(r.balloon)} />
              </div>
              <div style={S.statRow}>
                <Stat label="Points" value={usd(r.points)} />
                <Stat label="Interest" value={usd(r.interest + r.extensionInterest)} />
              </div>
              <div style={S.statRow}>
                <Stat label="Loan to cost" value={fmtPct(r.ltcPct, 1)} />
                <Stat label="Loan to ARV" value={r.ltarvPct == null ? "Enter an ARV" : fmtPct(r.ltarvPct, 1)} />
              </div>
              <div style={S.statRow}>
                <Stat label="Simple annualized cost" value={fmtPct(r.annualizedCostPct, 1)} />
                <Stat label="Profit before tax" value={r.profit == null ? "Enter an ARV" : usd(r.profit)} />
              </div>
              {r.rehabOutOfPocket > 0 && <Notice tone="ok">{`You also fund ${usd(r.rehabOutOfPocket)} of the rehab yourself. It is not in the cash to close.`}</Notice>}
              {r.ltarvPct != null && r.ltarvPct > 100 && <Notice tone="warn">The loan is larger than the after-repair value.</Notice>}
              <SimpleTable caption="Interest by month" head={["Month", "Balance", "Interest", "Total interest"]} rows={monthRows} />
              <SimpleTable caption="What moves the total" head={["Change", "Total cost", "vs. now"]} rows={sensRows} />
              <CopyResults lines={lines} />
            </>
          ) : (
            <div style={S.bigSub}>Enter a purchase price (or rehab budget), a lender advance above 0%, and months until payoff to see the cost.</div>
          )}
          <div style={S.disclaimer}>
            Estimate only, from our own arithmetic on the terms you enter. The starting figures are examples, not lender data, and this is not a loan offer. Simple annualized cost is total financing cost divided by the loan and the years held; it is not an IRR. Profit is before tax and leaves out draw inspection fees, default interest and prepayment minimums unless you enter them in the fees. See <a href="/guides/real-estate-investment-options/" style={S.link}>flipping houses and its tax trap</a> and <a href="/compare/bridge-loan-vs-heloc/" style={S.link}>bridge loan vs HELOC</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
