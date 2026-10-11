import { useMemo, useState } from "react";
import {
  computeMileageReimbursement,
  type MileageReimbursementInput,
  BUSINESS_RATE_2026_H1,
  BUSINESS_RATE_2026_H2,
} from "../lib/mileage-reimbursement";
import { fmtUSD } from "../lib/format";
import { Field, MoneyInput, NumInput, Stat, S } from "./calc-ui";

// Mileage reimbursement island. Business miles by half of 2026 (the IRS rate changed on July 1) times the
// employer's rate, or the IRS rate when the employer rate is left blank. Shows the part of a payment above
// the IRS rate that counts as wages under an accountable plan.

interface Props {
  initialData?: Partial<MileageReimbursementInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: MileageReimbursementInput = { milesFirstHalf: 1200, milesSecondHalf: 1000, employerRateCents: 0, tollsAndParking: 0 };
const cents = (rate: number) => `${+(rate * 100).toFixed(1)}¢`;

export default function MileageReimbursementCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<MileageReimbursementInput>({ ...DEFAULTS, ...initialData });
  const r = useMemo(() => computeMileageReimbursement(input), [input]);
  const set = (patch: Partial<MileageReimbursementInput>) => setInput((s) => ({ ...s, ...patch }));
  const usesIrs = input.employerRateCents <= 0;

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
          <Field label={`Business miles, Jan 1 – Jun 30, 2026 (IRS ${cents(BUSINESS_RATE_2026_H1)}/mi)`}>
            <NumInput value={input.milesFirstHalf} onChange={(v) => set({ milesFirstHalf: v })} />
          </Field>
          <Field label={`Business miles, Jul 1 – Dec 31, 2026 (IRS ${cents(BUSINESS_RATE_2026_H2)}/mi)`}>
            <NumInput value={input.milesSecondHalf} onChange={(v) => set({ milesSecondHalf: v })} />
          </Field>
          <Field label="Your employer's rate, cents per mile (leave blank for the IRS rate)">
            <NumInput value={input.employerRateCents} onChange={(v) => set({ employerRateCents: v })} />
          </Field>
          <Field label="Business tolls and parking (optional)">
            <MoneyInput value={input.tollsAndParking} onChange={(v) => set({ tollsAndParking: v })} />
          </Field>
          <p style={S.hint}>Count only business driving. Your regular commute from home to your usual workplace is not business mileage.</p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Reimbursement owed</span>
            <span style={S.bigValue}>{fmtUSD(r.reimbursement, { cents: true })}</span>
            <span style={S.bigSub}>
              {r.totalMiles.toLocaleString("en-US")} miles at {usesIrs ? "the 2026 IRS rates" : `${cents(r.rateFirstHalf)} a mile`}
              {input.tollsAndParking > 0 ? `, plus ${fmtUSD(input.tollsAndParking, { cents: true })} tolls and parking` : ""}
            </span>
          </div>
          <div style={S.statRow}>
            <Stat label="Mileage portion" value={fmtUSD(r.mileageAmount, { cents: true })} />
            <Stat label="Same miles at the IRS rate" value={fmtUSD(r.irsRateAmount, { cents: true })} />
          </div>
          <div style={S.statRow}>
            <Stat label="Above the IRS rate (taxable wages)" value={fmtUSD(r.taxableExcess, { cents: true })} />
            <Stat label="Blended rate" value={r.blendedRateCents == null ? "—" : `${r.blendedRateCents.toFixed(2)}¢/mi`} />
          </div>
          {r.taxableExcess > 0 && (
            <div style={{ ...S.aprBox, ...S.aprWarn }}>
              <span style={S.aprNote}>Your employer's rate is above the IRS rate. Under an accountable plan, the {fmtUSD(r.taxableExcess, { cents: true })} paid above the IRS rate is reported as wages.</span>
            </div>
          )}
          {r.belowIrs > 0 && (
            <div style={{ ...S.aprBox, ...S.aprWarn }}>
              <span style={S.aprNote}>You get {fmtUSD(r.belowIrs, { cents: true })} less than the same miles at the IRS rate. Federal law does not require employers to pay the IRS rate, though some states set their own reimbursement rules.</span>
            </div>
          )}
          <div style={S.disclaimer}>
            Estimate only. Uses the 2026 IRS business standard mileage rates (72.5¢ Jan–Jun, 76¢ Jul–Dec). Reimbursement at or below the IRS rate under an accountable plan is not taxable wages. Your employer's written policy decides what it pays.
          </div>
        </div>
      </div>
    </div>
  );
}
