import { useMemo, useState } from "react";
import { Field, MoneyInput, PctInput, NumInput, Stat, S as UI } from "./calc-ui";
import { computeSaleTax, estimateDepreciation, LTCG_TOPS_2026, NIIT_THRESHOLD, type SaleFilingStatus } from "../lib/rental-sale-tax";
import { fmtUSD } from "../lib/format";
import ToolPicks, { book } from "./ToolPicks";

// "Selling? Estimate the federal tax on the sale" — shown under the rental calculator on the capital-gains
// page only (tool-usage pass 2026-10-21). The purchase price and closing costs start from the calculator's
// own purchase inputs; everything else is the seller's.

interface Props {
  purchasePrice: number;
  closingCostsPct: number;
}

export default function RentalSaleTaxPanel({ purchasePrice, closingCostsPct }: Props) {
  const [v, setV] = useState({
    salePrice: 0,
    sellingCostsPct: 6, // editable starting value, not a standard commission
    improvements: 0,
    depreciation: 0,
    status: "mfj" as SaleFilingStatus,
    otherTaxableIncome: 0,
    // Override the purchase inputs when the reader types their own (null = follow the calculator above).
    price: null as number | null,
    closing: null as number | null,
  });
  const [est, setEst] = useState({ landPct: 20, years: 0 }); // land % is an editable starting value; use your county assessment
  const set = (p: Partial<typeof v>) => setV((s) => ({ ...s, ...p }));

  const price = v.price ?? purchasePrice;
  const closing = v.closing ?? Math.round((purchasePrice * closingCostsPct) / 100);
  const r = useMemo(
    () => computeSaleTax({ ...v, purchasePrice: price, purchaseClosingCosts: closing }),
    [v, price, closing],
  );
  const estimate = estimateDepreciation(price, closing, est.landPct, est.years);
  const hasSale = v.salePrice > 0;
  const [top0, top15] = LTCG_TOPS_2026[v.status];
  const statusWord = v.status === "mfj" ? "married filing jointly" : "single";

  return (
    <div style={P.wrap}>
      <div style={P.title}>Selling? Estimate the federal tax on the sale</div>
      <p style={UI.hint}>For a rental you've owned more than a year. Use the figures from your closing statements and the depreciation on your past Schedule E / Form 4562.</p>
      <div style={UI.grid}>
        <div style={UI.inputs}>
          <div style={UI.twoCol}>
            <Field label="Sale price"><MoneyInput value={v.salePrice} onChange={(x) => set({ salePrice: x })} /></Field>
            <Field label="Selling costs % (commission, closing)"><PctInput value={v.sellingCostsPct} onChange={(x) => set({ sellingCostsPct: x })} /></Field>
          </div>
          <div style={UI.twoCol}>
            <Field label="Original purchase price"><MoneyInput value={price} onChange={(x) => set({ price: x })} /></Field>
            <Field label="Purchase closing costs"><MoneyInput value={closing} onChange={(x) => set({ closing: x })} /></Field>
          </div>
          <Field label="Capital improvements (roof, additions…)"><MoneyInput value={v.improvements} onChange={(x) => set({ improvements: x })} /></Field>
          <Field label="Depreciation claimed (or allowable)"><MoneyInput value={v.depreciation} onChange={(x) => set({ depreciation: x })} /></Field>
          <div style={P.estBox}>
            <div style={P.estTitle}>Don't have the total? Estimate the building's depreciation</div>
            <div style={UI.twoCol}>
              <Field label="Land share of the price %"><PctInput value={est.landPct} onChange={(x) => setEst((s) => ({ ...s, landPct: x }))} /></Field>
              <Field label="Full years rented"><NumInput value={est.years} onChange={(x) => setEst((s) => ({ ...s, years: x }))} /></Field>
            </div>
            <button type="button" style={P.btn} disabled={estimate <= 0} onClick={() => set({ depreciation: estimate })}>
              Use {fmtUSD(estimate)}
            </button>
            <span style={P.estNote}>(price + closing) × (1 − land %) ÷ 27.5 × years (IRS Pub 527). Add depreciation taken on improvements from your returns.</span>
          </div>
          <div style={UI.twoCol}>
            <Field label="Filing status">
              <select style={UI.input} value={v.status} onChange={(e) => set({ status: e.target.value as SaleFilingStatus })} aria-label="Filing status">
                <option value="single">Single</option>
                <option value="mfj">Married filing jointly</option>
              </select>
            </Field>
            <Field label="Other taxable income this year"><MoneyInput value={v.otherTaxableIncome} onChange={(x) => set({ otherTaxableIncome: x })} /></Field>
          </div>
        </div>

        <div style={UI.results}>
          {!hasSale ? (
            <div style={UI.bigStat}>
              <span style={UI.bigLabel}>Estimated federal tax on the sale</span>
              <span style={UI.bigSub}>Enter a sale price to see your gain, the depreciation recapture and the tax.</span>
            </div>
          ) : r.gain <= 0 ? (
            <div style={UI.bigStat}>
              <span style={UI.bigLabel}>No taxable gain</span>
              <span style={UI.bigValue}>{fmtUSD(r.gain)}</span>
              <span style={UI.bigSub}>The amount you'd net ({fmtUSD(r.amountRealized)}) is at or below your adjusted basis ({fmtUSD(r.adjustedBasis)}). A loss on a rental has its own rules — ask a tax professional how to report it.</span>
            </div>
          ) : (
            <>
              <div style={UI.bigStat}>
                <span style={UI.bigLabel}>Estimated federal tax on the sale</span>
                <span style={UI.bigValue}>up to {fmtUSD(r.totalTaxMax)}</span>
                <span style={UI.bigSub}>on a {fmtUSD(r.gain)} gain, {statusWord}</span>
              </div>
              <div style={UI.statRow}>
                <Stat label="Amount realized" value={fmtUSD(r.amountRealized)} />
                <Stat label="Adjusted basis" value={fmtUSD(r.adjustedBasis)} />
              </div>
              <div style={UI.statRow}>
                <Stat label="Depreciation part (recapture)" value={fmtUSD(r.recaptureGain)} />
                <Stat label="Its tax, at up to 25%" value={fmtUSD(r.recaptureTaxMax)} />
              </div>
              <div style={UI.statRow}>
                <Stat label="Remaining long-term gain" value={fmtUSD(r.remainingGain)} />
                <Stat label="Its tax (0/15/20%)" value={fmtUSD(r.remainingTax)} />
              </div>
              <div style={P.bands}>
                {r.bands.filter((b) => b.amount > 0).map((b) => (
                  <div key={b.rate}>{fmtUSD(b.amount)} taxed at {Math.round(b.rate * 100)}%</div>
                ))}
                <div style={P.bandNote}>2026 bands, {statusWord}: 0% up to {fmtUSD(top0)} of taxable income, 15% up to {fmtUSD(top15)}, 20% above (IRS). The gain sits on top of your other taxable income.</div>
              </div>
              {r.niitMayApply && (
                <div style={{ ...UI.aprBox, ...UI.aprWarn }}>
                  <span style={UI.aprNote}>Your income plus the gain is above {fmtUSD(NIIT_THRESHOLD[v.status])}, so the 3.8% net investment income tax may also apply (IRS Topic 559). It is not included above.</span>
                </div>
              )}
            </>
          )}
          <div style={UI.disclaimer}>
            Estimate only. The depreciation part is shown at its 25% maximum rate; it is taxed lower if your ordinary bracket is under 25%. Not included: state tax, the 3.8% NIIT, a 1031 exchange or installment sale. Have a tax professional confirm the numbers before you sign.
          </div>
          {hasSale && r.gain > 0 && (
            <ToolPicks
              tool="real-estate"
              heading="Further reading on taxes when you sell a rental"
              picks={r.recaptureGain > 0
                ? [
                    book("hanTaxStrategies", "How depreciation recapture and 1031 deferral work, from two real-estate CPAs."),
                    book("hanAdvancedTax", "Planning moves for a large gain: exchanges, cost segregation, timing."),
                    book("lasser2027", "How the sale is reported on Form 4797 and Schedule D."),
                  ]
                : [
                    book("hanTaxStrategies", "The deductions and depreciation that shape the tax when you sell."),
                    book("lasser2027", "How a rental sale is reported on your return."),
                  ]}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const P: Record<string, React.CSSProperties> = {
  wrap: { marginTop: 22, paddingTop: 18, borderTop: "1px solid #E2EDE9" },
  title: { fontSize: "1.1rem", fontWeight: 700, marginBottom: 4 },
  estBox: { border: "1px dashed #CFE3DC", borderRadius: 10, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 },
  estTitle: { fontSize: "0.8rem", fontWeight: 700, color: "#2A6A58" },
  estNote: { fontSize: "0.76rem", color: "#777" },
  btn: { alignSelf: "flex-start", padding: "8px 12px", minHeight: 36, border: "1px solid #0E7C66", background: "#fff", color: "#0E7C66", borderRadius: 8, fontWeight: 600, cursor: "pointer" },
  bands: { fontSize: "0.82rem", color: "#444", background: "#F1F8F5", border: "1px solid #DCECE6", borderRadius: 8, padding: "8px 10px", display: "flex", flexDirection: "column", gap: 2 },
  bandNote: { fontSize: "0.76rem", color: "#666", marginTop: 4 },
};
