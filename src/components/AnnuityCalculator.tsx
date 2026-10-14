import { useMemo, useState } from "react";
import { computeAnnuity, type AnnuityInput, type AnnuityMode } from "../lib/annuity";
import { fmtUSD, fmtNum } from "../lib/format";
import { Field, MoneyInput, NumInput, PctInput, Stat, S } from "./calc-ui";

// Annuity island. One tool, three questions: what a lump sum pays out, what level deposits grow to, and what a
// stream of payments is worth today. Rate, term and timing are the reader's inputs, not an insurer's quote.

interface Props {
  initialData?: Partial<AnnuityInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: AnnuityInput = { mode: "payout", lumpSum: 100000, payment: 1000, ratePct: 5, years: 20, perYear: 12, atStart: false };

const MODES: { key: AnnuityMode; label: string }[] = [
  { key: "payout", label: "What will a lump sum pay me?" },
  { key: "future", label: "What will my deposits grow to?" },
  { key: "present", label: "What is a payment stream worth today?" },
];

const FREQ: { value: number; label: string }[] = [
  { value: 12, label: "Monthly" },
  { value: 4, label: "Quarterly" },
  { value: 2, label: "Semiannual" },
  { value: 1, label: "Annual" },
];

export default function AnnuityCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<AnnuityInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => computeAnnuity(input), [input]);
  const set = (patch: Partial<AnnuityInput>) => setInput((s) => ({ ...s, ...patch }));
  const freqLabel = (FREQ.find((f) => f.value === input.perYear)?.label ?? "Monthly").toLowerCase();

  const big =
    input.mode === "payout"
      ? { label: `Level ${freqLabel} payment`, value: fmtUSD(result.headline, { cents: true }), sub: `${fmtUSD(input.lumpSum)} paid out over ${fmtNum(input.years, 1)} years at ${input.ratePct}%` }
      : input.mode === "future"
      ? { label: "Balance at the end", value: fmtUSD(result.headline, { cents: true }), sub: `${fmtUSD(input.payment)} ${freqLabel} for ${fmtNum(input.years, 1)} years at ${input.ratePct}%` }
      : { label: "Worth today (lump sum)", value: fmtUSD(result.headline, { cents: true }), sub: `${fmtUSD(input.payment)} ${freqLabel} for ${fmtNum(input.years, 1)} years, discounted at ${input.ratePct}%` };

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
          <Field label="What do you want to find?">
            <select style={S.input} value={input.mode} onChange={(e) => set({ mode: e.target.value as AnnuityMode })} aria-label="Annuity question">
              {MODES.map((m) => (
                <option key={m.key} value={m.key}>{m.label}</option>
              ))}
            </select>
          </Field>
          {input.mode === "payout" ? (
            <Field label="Lump sum paid in">
              <MoneyInput value={input.lumpSum} onChange={(v) => set({ lumpSum: v })} />
            </Field>
          ) : (
            <Field label={input.mode === "future" ? "Deposit each period" : "Payment each period"}>
              <MoneyInput value={input.payment} onChange={(v) => set({ payment: v })} />
            </Field>
          )}
          <Field label={input.mode === "present" ? "Discount rate (annual)" : "Interest rate (annual)"}>
            <PctInput value={input.ratePct} onChange={(v) => set({ ratePct: v })} />
          </Field>
          <div style={S.twoCol}>
            <Field label="Term (years)">
              <NumInput value={input.years} onChange={(v) => set({ years: v })} />
            </Field>
            <Field label="Payment frequency">
              <select style={S.input} value={input.perYear} onChange={(e) => set({ perYear: Number(e.target.value) })} aria-label="Payment frequency">
                {FREQ.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="When is each payment made?">
            <select style={S.input} value={input.atStart ? "start" : "end"} onChange={(e) => set({ atStart: e.target.value === "start" })} aria-label="Payment timing">
              <option value="end">End of each period (ordinary annuity)</option>
              <option value="start">Start of each period (annuity due)</option>
            </select>
          </Field>
          <p style={S.hint}>
            The 5% rate and the amounts are placeholders. Use the rate on your contract or the return you expect, and the payment from your own plan. An insurer's real payout also depends on age, fees and its own pricing.
          </p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>{big.label}</span>
            <span style={S.bigValue}>{big.value}</span>
            <span style={S.bigSub}>{big.sub}</span>
          </div>
          <div style={S.statRow}>
            <Stat label={input.mode === "future" ? "Total deposited" : "Total of all payments"} value={fmtUSD(result.totalPayments, { cents: true })} />
            <Stat label={input.mode === "present" ? "Discount (interest) in the stream" : "Interest earned"} value={fmtUSD(result.interest, { cents: true })} />
          </div>
          <div style={S.statRow}>
            <Stat label="Number of payments" value={fmtNum(result.periods)} />
          </div>
          <div style={S.disclaimer}>
            Estimate only. Uses level payments, a fixed rate for the whole term, and no fees, taxes or inflation adjustment. It is not an insurer's quote, and a real annuity contract prices in life expectancy and the insurer's margin.
          </div>
        </div>
      </div>
    </div>
  );
}
