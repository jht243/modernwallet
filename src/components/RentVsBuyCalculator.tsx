import { useMemo, useState } from "react";
import { computeRentVsBuy, RVB_DEFAULTS, MAX_YEARS, type RvbInput } from "../lib/rent-vs-buy";
import { fmtUSD } from "../lib/format";
import { Field, MoneyInput, NumInput, PctInput, Stat, S } from "./calc-ui";

// Rent vs buy island (Autocomplete pass 2026-10-28). Modeled, not measured: see src/lib/rent-vs-buy.ts.

interface Props {
  initialData?: Partial<RvbInput>;
  heading?: string;
  subheading?: string;
}

export default function RentVsBuyCalculator({ initialData, heading, subheading }: Props) {
  const [v, setV] = useState<RvbInput>({ ...RVB_DEFAULTS, ...initialData });
  const set = (p: Partial<RvbInput>) => setV((s) => ({ ...s, ...p }));
  const r = useMemo(() => computeRentVsBuy(v), [v]);
  const years = Math.min(Math.max(Math.round(v.years) || 1, 1), MAX_YEARS);

  let verdict = "Enter a home price, a monthly rent, a down payment from 0 to 100 and a loan term.";
  let better = "";
  if (r) {
    const h = r.atHorizon;
    better = h.diff >= 0 ? "Buying" : "Renting";
    verdict = `${better} ends ${fmtUSD(Math.abs(h.diff))} ahead after ${years} ${years === 1 ? "year" : "years"}. ` +
      (r.breakEven == null ? `With these inputs buying never catches up within ${MAX_YEARS} years.` : r.breakEven <= years ? `Buying passed renting in year ${r.breakEven}.` : `Buying only passes renting in year ${r.breakEven}.`);
  }
  const rows = r ? [1, 3, 5, 7, 10, 15, 20, 30].map((y) => r.years[y - 1]) : [];

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
          <Field label="Home price"><MoneyInput value={v.price} onChange={(x) => set({ price: x })} /></Field>
          <div style={S.twoCol}>
            <Field label="Down payment"><PctInput value={v.downPct} onChange={(x) => set({ downPct: x })} label="Down payment percent" /></Field>
            <Field label="Mortgage rate"><PctInput value={v.ratePct} onChange={(x) => set({ ratePct: x })} label="Mortgage rate percent" /></Field>
          </div>
          <div style={S.twoCol}>
            <Field label="Loan term (years)"><NumInput value={v.termYears} onChange={(x) => set({ termYears: x })} /></Field>
            <Field label="How long you will stay (years)"><NumInput value={v.years} onChange={(x) => set({ years: x })} /></Field>
          </div>
          <Field label="Monthly rent for a similar home"><MoneyInput value={v.rent} onChange={(x) => set({ rent: x })} /></Field>
          <div style={S.twoCol}>
            <Field label="Property tax (% of value a year)"><PctInput value={v.propTaxPct} onChange={(x) => set({ propTaxPct: x })} label="Property tax percent" /></Field>
            <Field label="Home insurance (% a year)"><PctInput value={v.insurancePct} onChange={(x) => set({ insurancePct: x })} label="Home insurance percent" /></Field>
          </div>
          <div style={S.twoCol}>
            <Field label="Maintenance (% a year)"><PctInput value={v.maintPct} onChange={(x) => set({ maintPct: x })} label="Maintenance percent" /></Field>
            <Field label="HOA dues a month"><MoneyInput value={v.hoaMonth} onChange={(x) => set({ hoaMonth: x })} /></Field>
          </div>
          <div style={S.twoCol}>
            <Field label="Closing costs when buying (%)"><PctInput value={v.closingPct} onChange={(x) => set({ closingPct: x })} label="Closing cost percent" /></Field>
            <Field label="Selling costs (%)"><PctInput value={v.sellPct} onChange={(x) => set({ sellPct: x })} label="Selling cost percent" /></Field>
          </div>
          <div style={S.twoCol}>
            <Field label="Home price growth a year"><PctInput value={v.apprPct} onChange={(x) => set({ apprPct: x })} label="Home price growth percent" /></Field>
            <Field label="Rent growth a year"><PctInput value={v.rentGrowthPct} onChange={(x) => set({ rentGrowthPct: x })} label="Rent growth percent" /></Field>
          </div>
          <div style={S.twoCol}>
            <Field label="Investment return a year"><PctInput value={v.returnPct} onChange={(x) => set({ returnPct: x })} label="Investment return percent" /></Field>
            <Field label="Renter's insurance a month"><MoneyInput value={v.renterInsMonth} onChange={(x) => set({ renterInsMonth: x })} /></Field>
          </div>
          <p style={S.hint}>The mortgage rate is the <a href="https://www.freddiemac.com/pmms" rel="noopener">Freddie Mac 30-year average</a> for the week of October 22, 2026. Everything else is a planning assumption you can change. Property tax and insurance vary a lot by state.</p>
        </div>

        <div style={S.results}>
          {r ? (
            <>
              <div style={S.bigStat}>
                <span style={S.bigLabel}>After {years} {years === 1 ? "year" : "years"}, {better.toLowerCase()} is ahead by</span>
                <span style={S.bigValue}>{fmtUSD(Math.abs(r.atHorizon.diff))}</span>
                <span style={S.bigSub}>{verdict}</span>
              </div>
              <div style={S.statRow}>
                <Stat label="Net worth if you buy" value={fmtUSD(r.atHorizon.buy)} />
                <Stat label="Net worth if you rent and invest" value={fmtUSD(r.atHorizon.rent)} />
              </div>
              <div style={S.statRow}>
                <Stat label="Break-even year" value={r.breakEven == null ? "Not within 30 years" : `Year ${r.breakEven}`} />
                <Stat label="Mortgage payment (principal and interest)" value={fmtUSD(r.payment)} />
              </div>
              <div style={S.statRow}>
                <Stat label="First-month cost of owning" value={fmtUSD(r.ownerMonth1)} />
                <Stat label="First-month cost of renting" value={fmtUSD(r.renterMonth1)} />
              </div>
              <div style={S.statRow}>
                <Stat label="Cash needed to buy" value={fmtUSD(r.cashUpfront)} />
                <Stat label="Price-to-rent ratio" value={r.priceToRent.toFixed(1)} />
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", fontVariantNumeric: "tabular-nums" }} aria-label="Net worth by year">
                <thead>
                  <tr style={{ textAlign: "right", color: "#555" }}>
                    <th style={{ textAlign: "left", padding: "4px 0" }}>Year</th><th>Buy</th><th>Rent and invest</th><th>Buy minus rent</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((y) => (
                    <tr key={y.year} style={{ textAlign: "right", borderTop: "1px solid #E6F0EC" }}>
                      <td style={{ textAlign: "left", padding: "4px 0" }}>{y.year}</td>
                      <td>{fmtUSD(y.buy)}</td><td>{fmtUSD(y.rent)}</td><td style={{ color: y.diff >= 0 ? "#0E7C66" : "#9a4a1a" }}>{fmtUSD(y.diff)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p style={S.hint}>{verdict}</p>
          )}
          <div style={S.disclaimer}>
            Estimate only. Modeled results, not a forecast of home prices, rents or investment returns. Net worth counts the home's value after selling costs minus the loan, plus whatever each path invests. It leaves out income-tax effects of owning (mortgage interest and property tax only help if you itemize), moving costs, and special assessments.
          </div>
        </div>
      </div>
    </div>
  );
}
