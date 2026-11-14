import { useMemo, useState } from "react";
import { computeLoan401k, loanLimit, type Loan401kInput, type LoanPurpose } from "../lib/401k-loan";
import { fmtUSD } from "../lib/format";
import { Field, Money, Pct, Plain, Stat, Select, Notice, CopyResults, SimpleTable, S, num } from "./LoanToolKit";

// 401(k) loan limit and payment calculator island. Standalone engine: src/lib/401k-loan.ts
// (26 U.S.C. 72(p)(2): the lesser-of / greater-of cap, 5-year term, level amortization at least quarterly).
// Federal limits only. The plan document decides whether loans are offered and on what terms.

interface Props {
  initialData?: Record<string, unknown>;
  heading?: string;
  subheading?: string;
}

const usd2 = (n: number) => fmtUSD(n, { cents: true });

export default function Loan401kCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<Loan401kInput>({
    vestedBalance: num(initialData?.vestedBalance, 60000),
    outstandingLoans: num(initialData?.outstandingLoans, 0),
    highest12: num(initialData?.highest12, 0),
    loanAmount: num(initialData?.loanAmount, 10000),
    aprPct: num(initialData?.aprPct, 8),
    termYears: num(initialData?.termYears, 5),
    paymentsPerYear: num(initialData?.paymentsPerYear, 12),
    purpose: (initialData?.purpose === "residence" ? "residence" : "general") as LoanPurpose,
  });
  const set = (p: Partial<Loan401kInput>) => setV((s) => ({ ...s, ...p }));
  const lim = useMemo(() => loanLimit(v.vestedBalance, v.outstandingLoans, v.highest12), [v.vestedBalance, v.outstandingLoans, v.highest12]);
  const r = useMemo(() => computeLoan401k(v), [v]);
  const peakBelowToday = v.highest12 > 0 && v.highest12 < v.outstandingLoans;

  const yearRows = r.yearly.map((y) => [`Year ${y.year}`, usd2(y.paid), usd2(y.interest), usd2(y.principal), usd2(y.endBalance)]);
  const first = r.schedule.slice(0, 5);
  const last = r.schedule.length > 10 ? r.schedule.slice(-5) : [];
  const schedRows = [...first, ...last].map((s) => [`#${s.period}`, usd2(s.payment), usd2(s.interest), usd2(s.principal), usd2(s.balance)]);

  const lines = [
    "401(k) loan estimate (federal limits only; your plan document controls)",
    `Largest new loan allowed: ${usd2(lim.maxNewLoan)}`,
    `Limit on all plan loans together: ${usd2(lim.totalLimit)}`,
    `Loan modelled: ${usd2(r.loanAmount)} at ${v.aprPct}% APR over ${v.termYears} years, ${v.paymentsPerYear} payments a year`,
    `Payment per period: ${usd2(r.payment)}`,
    `Total interest: ${usd2(r.totalInterest)}`,
    `Total repaid: ${usd2(r.totalRepaid)}`,
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
          <Field label="Vested account balance" hint="The part of your balance you own today."><Money v={v.vestedBalance} on={(x) => set({ vestedBalance: x })} /></Field>
          <div style={S.row2}>
            <Field label="Plan loans you owe now"><Money v={v.outstandingLoans} on={(x) => set({ outstandingLoans: x })} /></Field>
            <Field label="Highest plan-loan balance, last 12 months"><Money v={v.highest12} on={(x) => set({ highest12: x })} /></Field>
          </div>
          <Field label="Loan amount you want"><Money v={v.loanAmount} on={(x) => set({ loanAmount: x })} /></Field>
          <div style={S.row2}>
            <Field label="Interest rate (APR)" hint="Your plan sets this. 8% is an example, not a market rate."><Pct v={v.aprPct} on={(x) => set({ aprPct: x })} /></Field>
            <Field label="Term (years)"><Plain v={v.termYears} max={30} on={(x) => set({ termYears: x })} /></Field>
          </div>
          <div style={S.row2}>
            <Field label="Payments per year">
              <Select v={String(v.paymentsPerYear)} on={(x) => set({ paymentsPerYear: Number(x) })} options={[["4", "4 (quarterly)"], ["12", "12 (monthly)"], ["24", "24 (twice a month)"], ["26", "26 (every two weeks)"], ["52", "52 (weekly)"]]} />
            </Field>
            <Field label="Loan purpose">
              <Select v={v.purpose} on={(x) => set({ purpose: x })} options={[["general", "General purpose"], ["residence", "Buy a main home"]]} />
            </Field>
          </div>
          {peakBelowToday && <Notice tone="warn">The 12-month peak is lower than what you owe now. A peak cannot be lower than today's balance, so the calculator treats it as equal to today's balance.</Notice>}
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Largest new loan allowed</span>
            <span style={S.bigValue}>{fmtUSD(lim.maxNewLoan)}</span>
            <span style={S.bigSub}>{`all plan loans together are capped at ${fmtUSD(lim.totalLimit)}; you owe ${fmtUSD(v.outstandingLoans)} now`}</span>
          </div>
          <div style={S.statRow}>
            <Stat label="$50,000 prong" value={fmtUSD(lim.prongDollar)} />
            <Stat label="Vested-balance prong" value={fmtUSD(lim.prongVested)} />
          </div>
          {r.valid ? (
            <>
              <div style={S.bigStat}>
                <span style={S.bigLabel}>{`Payment, ${v.paymentsPerYear} a year`}</span>
                <span style={{ ...S.bigValue, fontSize: "1.5rem" }}>{usd2(r.payment)}</span>
                <span style={S.bigSub}>{`on ${fmtUSD(r.loanAmount)} over ${v.termYears} years`}</span>
              </div>
              <div style={S.statRow}>
                <Stat label="Total interest" value={usd2(r.totalInterest)} />
                <Stat label="Total repaid" value={usd2(r.totalRepaid)} />
              </div>
            </>
          ) : (
            <div style={S.bigSub}>Enter a loan amount, term and payments per year to see the payment.</div>
          )}
          {r.overLimit && <Notice tone="warn">{`${fmtUSD(r.loanAmount)} is ${fmtUSD(r.excessOverLimit)} over the federal limit. The part above the limit would be treated as a distribution under 26 U.S.C. 72(p)(1).`}</Notice>}
          {r.termTooLong && <Notice tone="warn">A general-purpose loan must be repayable within 5 years. Choose a shorter term or switch the purpose to a main-home purchase.</Notice>}
          {r.tooInfrequent && <Notice tone="warn">Payments must be at least quarterly (4 a year) with level amortization.</Notice>}
          {r.valid && !r.deemedDistributionRisk && <Notice tone="ok">This loan fits the federal cap, term and payment-frequency rules. Your plan may be stricter.</Notice>}
          {r.valid && <SimpleTable caption="Payments by year" head={["Year", "Paid", "Interest", "Principal", "Balance"]} rows={yearRows} />}
          {r.valid && <SimpleTable caption={r.schedule.length > 10 ? "First 5 and last 5 payments" : "All payments"} head={["Payment", "Amount", "Interest", "Principal", "Balance"]} rows={schedRows} />}
          <CopyResults lines={lines} />
          <div style={S.disclaimer}>
            Estimate only, from our own arithmetic on the numbers you enter. It applies the 26 U.S.C. 72(p)(2) limits and a level payment. It leaves out plan fees, taxes on a loan treated as a distribution, and what the borrowed money would have earned in the market. See the <a href="/guides/401k-loan-rules/" style={S.link}>401(k) loan rules guide</a> for the rules in plain language.
          </div>
        </div>
      </div>
    </div>
  );
}
