import { useMemo, useState } from "react";
import { computeCardInterest, type CardInterestInput } from "../lib/credit-card-interest";
import { fmtUSD, fmtPct, fmtNum } from "../lib/format";
import { Field, MoneyInput, NumInput, PctInput, Stat, S } from "./calc-ui";

// Credit card interest island. Applies the daily periodic rate to the average daily balance across one billing
// cycle, with an optional payment on a chosen day. APR, cycle length and year basis come from the reader's statement.

interface Props {
  initialData?: Partial<CardInterestInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: CardInterestInput = { balance: 5000, aprPct: 24, cycleDays: 30, yearDays: 365, payment: 0, paymentDay: 15 };

export default function CreditCardInterestCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<CardInterestInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => computeCardInterest(input), [input]);
  const set = (patch: Partial<CardInterestInput>) => setInput((s) => ({ ...s, ...patch }));
  const paid = input.payment > 0;

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
          <Field label="Balance at the start of the cycle">
            <MoneyInput value={input.balance} onChange={(v) => set({ balance: v })} />
          </Field>
          <Field label="Purchase APR">
            <PctInput value={input.aprPct} onChange={(v) => set({ aprPct: v })} />
          </Field>
          <div style={S.twoCol}>
            <Field label="Days in billing cycle">
              <NumInput value={input.cycleDays} onChange={(v) => set({ cycleDays: v })} />
            </Field>
            <Field label="Days in year for the daily rate">
              <select style={S.input} value={input.yearDays} onChange={(e) => set({ yearDays: Number(e.target.value) })} aria-label="Days in year">
                <option value={365}>365</option>
                <option value={360}>360</option>
              </select>
            </Field>
          </div>
          <div style={S.twoCol}>
            <Field label="Payment during the cycle (0 = none)">
              <MoneyInput value={input.payment} onChange={(v) => set({ payment: v })} />
            </Field>
            <Field label="Day the payment posts">
              <NumInput value={input.paymentDay} onChange={(v) => set({ paymentDay: v })} />
            </Field>
          </div>
          <p style={S.hint}>
            Take the APR, cycle length and day-count basis from your statement. The figures above are placeholders. This models purchase interest only, with no grace period, fees, cash advances or new purchases.
          </p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Interest charged this cycle</span>
            <span style={S.bigValue}>{fmtUSD(result.interestThisCycle, { cents: true })}</span>
            <span style={S.bigSub}>
              {fmtPct(input.aprPct)} APR on an average daily balance of {fmtUSD(result.averageDailyBalance, { cents: true })} for {fmtNum(input.cycleDays)} days
            </span>
          </div>
          <div style={S.statRow}>
            <Stat label="Daily periodic rate" value={`${result.dailyRatePct.toFixed(4)}%`} />
            <Stat label="Average daily balance" value={fmtUSD(result.averageDailyBalance, { cents: true })} />
          </div>
          <div style={S.statRow}>
            <Stat label="Yearly cost if balance stays flat" value={fmtUSD(result.interestPerYearFlat, { cents: true })} />
            <Stat label="Effective annual rate (daily compounding)" value={fmtPct(result.effectiveAnnualPct)} />
          </div>
          {paid && (
            <div style={S.aprBox}>
              <span style={S.aprLabel}>Effect of the payment</span>
              <span style={S.aprValue}>{fmtUSD(result.interestNoPayment - result.interestThisCycle, { cents: true })} saved</span>
              <span style={S.aprNote}>
                Without the payment the cycle would cost {fmtUSD(result.interestNoPayment, { cents: true })}. Paying earlier in the cycle lowers the average daily balance.
              </span>
            </div>
          )}
          <div style={S.disclaimer}>
            Estimate only. Issuers differ in how they compound within a cycle, whether a grace period applies, and how they round, so your statement may differ by a few cents or dollars. Check your cardholder agreement.
          </div>
        </div>
      </div>
    </div>
  );
}
