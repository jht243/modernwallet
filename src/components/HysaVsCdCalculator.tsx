import { useMemo, useState } from "react";
import { computeHysaVsCd, type HysaVsCdInput } from "../lib/hysa-vs-cd";
import { fmtUSD, fmtPct } from "../lib/format";
import { Field, MoneyInput, NumInput, PctInput, Stat, S } from "./calc-ui";

// HYSA vs CD island (tool-usage pass 2026-10-14). One deposit, one term, two APYs: which earns more, the HYSA
// rate the CD beats if savings rates fall, and what breaking the CD early costs. Rates are the reader's inputs.

interface Props {
  initialData?: Partial<HysaVsCdInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: HysaVsCdInput = {
  deposit: 25000, termMonths: 12, hysaApyPct: 4, cdApyPct: 4.25,
  hysaLaterApyPct: 0, changeAfterMonths: 6, penaltyMonths: 3, withdrawMonth: 0,
};

export default function HysaVsCdCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<HysaVsCdInput>({ ...DEFAULTS, ...initialData });
  const r = useMemo(() => computeHysaVsCd(v), [v]);
  const set = (p: Partial<HysaVsCdInput>) => setV((s) => ({ ...s, ...p }));
  const cdWins = r != null && r.cdAdvantage > 0.5;
  const hysaWins = r != null && r.cdAdvantage < -0.5;

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
          <Field label="Deposit"><MoneyInput value={v.deposit} onChange={(x) => set({ deposit: x })} /></Field>
          <Field label="Term (months)"><NumInput value={v.termMonths} onChange={(x) => set({ termMonths: Math.min(120, x) })} /></Field>
          <div style={S.twoCol}>
            <Field label="HYSA APY"><PctInput value={v.hysaApyPct} onChange={(x) => set({ hysaApyPct: x })} /></Field>
            <Field label="CD APY"><PctInput value={v.cdApyPct} onChange={(x) => set({ cdApyPct: x })} /></Field>
          </div>
          <div style={S.twoCol}>
            <Field label="HYSA APY later (optional)"><PctInput value={v.hysaLaterApyPct} onChange={(x) => set({ hysaLaterApyPct: x })} /></Field>
            <Field label="…starting after month"><NumInput value={v.changeAfterMonths} onChange={(x) => set({ changeAfterMonths: x })} /></Field>
          </div>
          <div style={S.twoCol}>
            <Field label="CD penalty (months of interest)"><NumInput value={v.penaltyMonths} onChange={(x) => set({ penaltyMonths: x })} /></Field>
            <Field label="Break the CD at month (optional)"><NumInput value={v.withdrawMonth} onChange={(x) => set({ withdrawMonth: x })} /></Field>
          </div>
          <p style={S.hint}>
            Use the APYs your banks quote today. The rates above are placeholders. A HYSA rate can change at any time; a CD's rate is fixed for the term. The early-withdrawal penalty is set by each bank, so copy it from the CD's terms.
          </p>
        </div>

        <div style={S.results}>
          {r == null ? (
            <div style={S.bigStat}><span style={S.bigLabel}>Enter a deposit and a term</span></div>
          ) : (
            <>
              <div style={S.bigStat}>
                <span style={S.bigLabel}>{cdWins ? "The CD earns more" : hysaWins ? "The HYSA earns more" : "They earn about the same"}</span>
                <span style={S.bigValue}>{fmtUSD(Math.abs(r.cdAdvantage))}</span>
                <span style={S.bigSub}>more interest over {Math.round(v.termMonths)} months on {fmtUSD(v.deposit)}</span>
              </div>
              <div style={S.statRow}>
                <Stat label="HYSA interest" value={fmtUSD(r.hysaInterest)} />
                <Stat label="CD interest" value={fmtUSD(r.cdInterest)} />
              </div>
              <div style={S.statRow}>
                <Stat label="HYSA balance at the end" value={fmtUSD(r.hysaValue)} />
                <Stat label="CD value at maturity" value={fmtUSD(r.cdValue)} />
              </div>
              {r.breakEvenLaterApyPct != null && (
                <div style={{ ...S.aprBox, ...S.aprOk }}>
                  <span style={S.aprLabel}>The rate that ties them</span>
                  <span style={S.aprValue}>{fmtPct(r.breakEvenLaterApyPct, 2)} APY</span>
                  <span style={S.aprNote}>
                    If the HYSA pays {fmtPct(v.hysaApyPct, 2)} for {Math.round(v.changeAfterMonths)} months, it has to pay at least this for the rest of the term to match the CD. Below it, the CD wins.
                  </span>
                </div>
              )}
              {r.early && (
                <div style={{ ...S.aprBox, ...S.aprWarn }}>
                  <span style={S.aprLabel}>Breaking the CD at month {r.early.month}</span>
                  <span style={S.aprValue}>{fmtUSD(r.early.cdCashOut)} cash out</span>
                  <span style={S.aprNote}>
                    {fmtUSD(r.early.cdValueBeforePenalty)} minus a {fmtUSD(r.early.penalty)} penalty ({v.penaltyMonths} months of interest). The HYSA would hold {fmtUSD(r.early.hysaValueThen)} by then with no penalty.
                    {r.early.cdCashOut < v.deposit ? " The penalty is larger than the interest earned, so it eats into the deposit." : ""}
                  </span>
                </div>
              )}
              <div style={S.disclaimer}>
                Estimate only. APYs are treated as fixed except for the one HYSA change you enter, with no deposits after day one and no fees. Deposits at an FDIC-insured bank are covered up to $250,000 per depositor, per bank, per ownership category (<a href="https://www.fdic.gov/resources/deposit-insurance/understanding-deposit-insurance" target="_blank" rel="noopener noreferrer">FDIC</a>).
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
