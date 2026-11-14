import { useMemo, useState } from "react";
import { computeBridge, type BridgeInput } from "../lib/bridge-loan";
import { fmtUSD, fmtNum } from "../lib/format";
import { Field, Money, Pct, Plain, Stat, Notice, CopyResults, SimpleTable, S, num } from "./LoanToolKit";

// Bridge loan cost island: bridge fees plus interest until the old home sells, the monthly overlap outlay and
// the net proceeds. Standalone engine: src/lib/bridge-loan.ts. Every figure comes from the reader's own terms.

interface Props {
  initialData?: Record<string, unknown>;
  heading?: string;
  subheading?: string;
}

const usd = (n: number) => fmtUSD(n);

export default function BridgeLoanCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<BridgeInput>({
    salePrice: num(initialData?.salePrice, 400000),
    oldMortgagePayoff: num(initialData?.oldMortgagePayoff, 200000),
    bridgeLoan: num(initialData?.bridgeLoan, 100000),
    aprPct: num(initialData?.aprPct, 10),
    originationPct: num(initialData?.originationPct, 2),
    otherFees: num(initialData?.otherFees, 0),
    months: num(initialData?.months, 6),
    newMortgagePayment: num(initialData?.newMortgagePayment, 0),
    oldMonthlyCarrying: num(initialData?.oldMonthlyCarrying, 0),
    sellingCostPct: num(initialData?.sellingCostPct, 6),
    alternativeMonthlyCost: num(initialData?.alternativeMonthlyCost, 0),
    maxCombinedLtvPct: num(initialData?.maxCombinedLtvPct, 0),
  });
  const set = (p: Partial<BridgeInput>) => setV((s) => ({ ...s, ...p }));
  const r = useMemo(() => computeBridge(v), [v]);

  const monthRows = r.byMonth.map((m) => [`${m.months} months`, usd(m.interest), usd(m.bridgeCost), usd(m.overlapOutlay), usd(m.netProceeds)]);
  const lines = [
    "Bridge loan estimate (from the terms entered; not a loan offer)",
    `Bridge cost (fees plus interest): ${usd(r.bridgeCost)}`,
    `Fees: ${usd(r.fees)}; interest over ${v.months} months: ${usd(r.interest)}`,
    `Monthly overlap outlay: ${usd(r.monthlyOverlapOutlay)}`,
    `Net proceeds from the old home: ${usd(r.netProceeds)}`,
  ];

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
          <div style={S.group}>Your old home</div>
          <div style={S.row2}>
            <Field label="Expected sale price"><Money v={v.salePrice} on={(x) => set({ salePrice: x })} /></Field>
            <Field label="Old mortgage payoff"><Money v={v.oldMortgagePayoff} on={(x) => set({ oldMortgagePayoff: x })} /></Field>
          </div>
          <Field label="Months until the old home sells" hint="The biggest swing factor. Try a late sale."><Plain v={v.months} max={36} on={(x) => set({ months: x })} /></Field>
          <Field label="Selling costs (% of sale price)"><Pct v={v.sellingCostPct} on={(x) => set({ sellingCostPct: x })} /></Field>
          <div style={S.group}>Terms from your lender's quote</div>
          <Field label="Bridge loan amount"><Money v={v.bridgeLoan} on={(x) => set({ bridgeLoan: x })} /></Field>
          <div style={S.row2}>
            <Field label="Interest rate (APR)" hint="Enter your quote. 10% is an example."><Pct v={v.aprPct} on={(x) => set({ aprPct: x })} /></Field>
            <Field label="Origination (% of loan)"><Pct v={v.originationPct} on={(x) => set({ originationPct: x })} /></Field>
          </div>
          <Field label="Other fees"><Money v={v.otherFees} on={(x) => set({ otherFees: x })} /></Field>
          <div style={S.group}>Carrying both homes</div>
          <div style={S.row2}>
            <Field label="New mortgage payment, per month"><Money v={v.newMortgagePayment} on={(x) => set({ newMortgagePayment: x })} /></Field>
            <Field label="Old home carrying costs, per month" hint="Mortgage, taxes, insurance, utilities."><Money v={v.oldMonthlyCarrying} on={(x) => set({ oldMonthlyCarrying: x })} /></Field>
          </div>
          <div style={S.group}>Optional</div>
          <div style={S.row2}>
            <Field label="Alternative cost, per month" hint="A different option with no up-front fee."><Money v={v.alternativeMonthlyCost} on={(x) => set({ alternativeMonthlyCost: x })} /></Field>
            <Field label="Lender's max combined loan-to-value" hint="Your lender sets it. Leave blank if unknown."><Pct v={v.maxCombinedLtvPct} on={(x) => set({ maxCombinedLtvPct: Math.min(x, 100) })} /></Field>
          </div>
        </div>

        <div style={S.results}>
          {r.valid ? (
            <>
              <div style={S.bigStat}>
                <span style={S.bigLabel}>Bridge loan cost</span>
                <span style={S.bigValue}>{usd(r.bridgeCost)}</span>
                <span style={S.bigSub}>{`${usd(r.fees)} in fees + ${usd(r.interest)} of interest over ${fmtNum(v.months)} months`}</span>
              </div>
              <div style={S.statRow}>
                <Stat label="Monthly overlap outlay" value={usd(r.monthlyOverlapOutlay)} />
                <Stat label="Overlap total" value={usd(r.totalOverlapOutlay)} />
              </div>
              <div style={S.statRow}>
                <Stat label="Bridge interest per month" value={usd(r.monthlyInterest)} />
                <Stat label="Selling costs" value={usd(r.sellingCosts)} />
              </div>
              <div style={S.bigStat}>
                <span style={S.bigLabel}>Net proceeds from the old home</span>
                <span style={{ ...S.bigValue, fontSize: "1.5rem" }}>{usd(r.netProceeds)}</span>
                <span style={S.bigSub}>sale price - old mortgage - bridge loan - bridge cost - selling costs</span>
              </div>
              {r.negativeProceeds && <Notice tone="warn">The sale does not cover the old mortgage, the bridge loan, its cost and selling costs. You would bring cash to closing.</Notice>}
              {r.maxBridgeFromLtv != null && <Notice tone="ok">{`At a ${v.maxCombinedLtvPct}% combined limit, the most you could borrow is ${usd(r.maxBridgeFromLtv)} (sale price x limit - old mortgage).`}</Notice>}
              {v.alternativeMonthlyCost > 0 && (
                <Notice tone="ok">
                  {r.breakEvenMonths == null
                    ? "The alternative costs no more per month than the bridge interest, so the bridge never costs less."
                    : `The bridge costs less than the alternative once the old home takes more than ${r.breakEvenMonths.toFixed(1)} months to sell.`}
                </Notice>
              )}
              <SimpleTable caption="If the old home sells in" head={["Months", "Interest", "Bridge cost", "Overlap total", "Net proceeds"]} rows={monthRows} />
              <CopyResults lines={lines} />
            </>
          ) : (
            <div style={S.bigSub}>Enter a bridge loan amount to see the cost.</div>
          )}
          <div style={S.disclaimer}>
            Estimate only, from our own arithmetic on the terms you enter. Starting figures are examples, not lender data, and this is not a loan offer. Interest is simple and repaid from the sale proceeds. It leaves out closing costs on the new home, taxes on the sale and prepayment terms. Short-term loan on an investment purchase? Try the <a href="/real-estate/hard-money-loan-calculator/" style={S.link}>hard money loan calculator</a>, or see <a href="/compare/bridge-loan-vs-heloc/" style={S.link}>bridge loan vs HELOC</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
