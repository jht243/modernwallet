import { useMemo, useState } from "react";
import { computeTaxableVsDeferred, type TaxableVsDeferredInput } from "../lib/taxable-vs-tax-deferred";
import { fmtUSD, fmtPct } from "../lib/format";

// Taxable vs. tax-deferred growth island. Most "which account wins" content stops at a rule of
// thumb (use the 401k/IRA first); this shows the actual dollar gap for YOUR return, tax rate, and
// how much of a taxable account's annual gain is realized (dividends/interest) vs. unrealized
// (appreciation you haven't sold), since that split is what determines how much annual tax drag a
// taxable account actually carries. Standalone, no host coupling (mirrors InterestPerDayCalculator).

interface Props {
  initialData?: Partial<TaxableVsDeferredInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: TaxableVsDeferredInput = {
  startingBalance: 10000,
  annualContribution: 6000,
  annualReturnPct: 7,
  years: 25,
  taxRatePct: 24,
  taxableSharePct: 30,
};

export default function TaxableVsTaxDeferredCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<TaxableVsDeferredInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => computeTaxableVsDeferred(input), [input]);
  const set = (patch: Partial<TaxableVsDeferredInput>) => setInput((s) => ({ ...s, ...patch }));

  const deferredWins = (result.advantageDollars ?? 0) >= 0;

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
          <Field label="Starting balance">
            <MoneyInput value={input.startingBalance} onChange={(v) => set({ startingBalance: v })} />
          </Field>
          <Field label="Annual contribution">
            <MoneyInput value={input.annualContribution} onChange={(v) => set({ annualContribution: v })} />
          </Field>
          <div style={S.row2}>
            <Field label="Expected annual return">
              <PctInput value={input.annualReturnPct} onChange={(v) => set({ annualReturnPct: v })} />
            </Field>
            <Field label="Years invested">
              <PlainInput value={input.years} onChange={(v) => set({ years: v })} />
            </Field>
          </div>
          <Field label="Your tax rate (today and at withdrawal)">
            <PctInput value={input.taxRatePct} onChange={(v) => set({ taxRatePct: v })} />
          </Field>
          <Field label="% of the taxable account's annual gain that's realized (dividends/interest)">
            <PctInput value={input.taxableSharePct} onChange={(v) => set({ taxableSharePct: v })} />
          </Field>
          <p style={S.hint}>
            A bond or high-dividend fund realizes most of its gain every year (closer to 100%). A
            low-turnover stock index fund realizes very little until you sell (closer to 0-20%).
          </p>
        </div>

        <div style={S.results}>
          <div style={S.statRow}>
            <Stat label="Taxable account, final balance" value={fmtUSD(result.taxableFinalBalance)} />
            <Stat label="Tax-deferred account, after-tax" value={fmtUSD(result.deferredFinalBalanceAfterTax)} />
          </div>

          <div style={{ ...S.advBox, ...(deferredWins ? S.advOk : S.advWarn) }}>
            <span style={S.advLabel}>
              {deferredWins ? "Tax-deferred comes out ahead by" : "Taxable comes out ahead by"}
            </span>
            <span style={S.advValue}>{fmtUSD(Math.abs(result.advantageDollars ?? 0))}</span>
            <span style={S.advNote}>
              {result.advantagePct != null
                ? `${fmtPct(Math.abs(result.advantagePct))} ${deferredWins ? "more" : "less"} than the taxable account's after-tax balance.`
                : ""}
            </span>
          </div>

          <div style={S.statRow}>
            <Stat label="Total contributed" value={fmtUSD(result.totalContributions)} />
            <Stat label="Tax-deferred, pre-tax balance" value={fmtUSD(result.deferredFinalBalancePreTax)} />
          </div>
          <div style={S.statRow}>
            <Stat label="Tax paid along the way (taxable)" value={fmtUSD(result.taxableTotalTaxPaid)} />
            <Stat label="Tax paid at withdrawal (deferred)" value={fmtUSD(result.deferredTotalTaxPaid)} />
          </div>

          <div style={S.disclaimer}>
            Estimate only, using one tax rate for simplicity. The taxable account pays tax each year
            only on the realized share of that year's gain; the unrealized share keeps compounding
            and is not taxed within this projection (selling later would trigger capital gains tax on
            it). The tax-deferred account pays no tax until the full balance is withdrawn at the end,
            at the same rate you entered. Real accounts often see a lower long-term capital gains
            rate than ordinary income — this calculator does not model that difference.
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={S.field}>
      <span style={S.label}>{label}</span>
      {children}
    </label>
  );
}
function MoneyInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={S.suffixWrap}>
      <span style={S.prefix}>$</span>
      <input
        style={{ ...S.input, paddingLeft: 22 }}
        inputMode="numeric"
        value={value === 0 ? "" : value.toLocaleString("en-US")}
        placeholder="0"
        onChange={(e) => onChange(e.target.value === "" ? 0 : Math.max(0, Number(e.target.value.replace(/[^0-9.]/g, ""))))}
      />
    </div>
  );
}
function PctInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={S.suffixWrap}>
      <input
        style={S.input}
        inputMode="decimal"
        value={value === 0 ? "" : value}
        placeholder="0"
        onChange={(e) => onChange(Math.max(0, Number(e.target.value.replace(/[^0-9.]/g, ""))))}
        aria-label="Percent"
      />
      <span style={S.suffix}>%</span>
    </div>
  );
}
function PlainInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      style={S.input}
      inputMode="numeric"
      value={value === 0 ? "" : value}
      placeholder="0"
      onChange={(e) => onChange(Math.max(0, Math.round(Number(e.target.value.replace(/[^0-9]/g, "")) || 0)))}
    />
  );
}
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={S.stat}>
      <span style={S.statLabel}>{label}</span>
      <span style={S.statValue}>{value}</span>
    </div>
  );
}

const PRIMARY = "#0E7C66";
const S: Record<string, React.CSSProperties> = {
  wrap: { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1A1A1A" },
  head: { marginBottom: 16 },
  heading: { fontSize: "1.2rem", fontWeight: 700 },
  subheading: { fontSize: "0.95rem", color: "#555", marginTop: 2 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 },
  inputs: { display: "flex", flexDirection: "column", gap: 12 },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#444" },
  input: { width: "100%", padding: "10px 12px", fontSize: "1rem", border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A" },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  suffix: { position: "absolute", right: 12, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  hint: { fontSize: "0.82rem", color: "#666", lineHeight: 1.5, margin: "2px 0 0" },
  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12, alignSelf: "start" },
  statRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  stat: { display: "flex", flexDirection: "column", gap: 1 },
  statLabel: { fontSize: "0.78rem", color: "#666" },
  statValue: { fontSize: "1.15rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  advBox: { borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 1, border: "1px solid #E0EBE7", background: "#fff" },
  advOk: { background: "#EAF7F1", borderColor: "#BFE6D7" },
  advWarn: { background: "#FBF4E4", borderColor: "#F0DEB4" },
  advLabel: { fontSize: "0.78rem", fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: "0.03em" },
  advValue: { fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums", color: PRIMARY },
  advNote: { fontSize: "0.8rem", color: "#777" },
  disclaimer: { fontSize: "0.76rem", color: "#7a8783", lineHeight: 1.5, marginTop: 2 },
};
