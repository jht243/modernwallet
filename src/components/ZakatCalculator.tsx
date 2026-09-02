import { useMemo, useState } from "react";
import { computeZakat, type ZakatInput, type NisabStandard } from "../lib/zakat";
import { fmtUSD } from "../lib/format";

// Zakat calculator island. Unlike most zakat tools, which hardcode a fixed dollar nisab that goes
// stale the moment gold/silver prices move, this one derives the threshold live from a metal price
// the user enters (gold or silver standard) — the nisab is defined as a weight of metal, not a
// dollar figure. Standalone, no host coupling (mirrors InterestPerDayCalculator).

interface Props {
  initialData?: Partial<ZakatInput>;
  heading?: string;
  subheading?: string;
}

const DEFAULTS: ZakatInput = {
  cashAndBank: 8000,
  investmentsAndStock: 5000,
  goldValue: 0,
  silverValue: 0,
  receivables: 0,
  debtsDueNow: 1500,
  nisabStandard: "silver",
  metalPricePerGram: 2.11,
};

const GOLD_DEFAULT_PRICE = 139;
const SILVER_DEFAULT_PRICE = 2.11;

export default function ZakatCalculator({ initialData, heading, subheading }: Props) {
  const [input, setInput] = useState<ZakatInput>({ ...DEFAULTS, ...initialData });
  const result = useMemo(() => computeZakat(input), [input]);
  const set = (patch: Partial<ZakatInput>) => setInput((s) => ({ ...s, ...patch }));

  const setStandard = (standard: NisabStandard) => {
    setInput((s) => ({
      ...s,
      nisabStandard: standard,
      metalPricePerGram: standard === "gold" ? GOLD_DEFAULT_PRICE : SILVER_DEFAULT_PRICE,
    }));
  };

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
          <Field label="Cash and bank balances">
            <MoneyInput value={input.cashAndBank} onChange={(v) => set({ cashAndBank: v })} />
          </Field>
          <Field label="Investments and stock value">
            <MoneyInput value={input.investmentsAndStock} onChange={(v) => set({ investmentsAndStock: v })} />
          </Field>
          <Field label="Gold value (resale value, not sentimental)">
            <MoneyInput value={input.goldValue} onChange={(v) => set({ goldValue: v })} />
          </Field>
          <Field label="Silver value (resale value)">
            <MoneyInput value={input.silverValue} onChange={(v) => set({ silverValue: v })} />
          </Field>
          <Field label="Money owed to you (that you expect to collect)">
            <MoneyInput value={input.receivables} onChange={(v) => set({ receivables: v })} />
          </Field>
          <Field label="Debts and bills due now">
            <MoneyInput value={input.debtsDueNow} onChange={(v) => set({ debtsDueNow: v })} />
          </Field>

          <div style={S.divider} />

          <Field label="Nisab standard">
            <div style={S.toggleRow}>
              <button
                type="button"
                style={{ ...S.toggleBtn, ...(input.nisabStandard === "silver" ? S.toggleBtnActive : {}) }}
                onClick={() => setStandard("silver")}
              >
                Silver (lower, more inclusive)
              </button>
              <button
                type="button"
                style={{ ...S.toggleBtn, ...(input.nisabStandard === "gold" ? S.toggleBtnActive : {}) }}
                onClick={() => setStandard("gold")}
              >
                Gold
              </button>
            </div>
          </Field>
          <Field label={`Today's ${input.nisabStandard} price per gram`}>
            <MoneyInput value={input.metalPricePerGram} onChange={(v) => set({ metalPricePerGram: v })} cents />
          </Field>
          <p style={S.hint}>
            Prices move daily. Update this field with today's price before you rely on the result.
          </p>
        </div>

        <div style={S.results}>
          <div style={S.bigStat}>
            <span style={S.bigLabel}>Zakat due</span>
            <span style={S.bigValue}>{fmtUSD(result.zakatDue, { cents: true })}</span>
            <span style={S.bigSub}>2.5% of {fmtUSD(result.zakatableWealth)} in zakatable wealth</span>
          </div>

          <div style={S.statRow}>
            <Stat label="Zakatable wealth" value={fmtUSD(result.zakatableWealth)} />
            <Stat
              label={`Nisab threshold (${result.nisabGramsUsed}g ${input.nisabStandard})`}
              value={fmtUSD(result.nisabThreshold)}
            />
          </div>

          <div style={{ ...S.aprBox, ...(result.meetsNisab ? S.aprWarn : S.aprOk) }}>
            <span style={S.aprLabel}>{result.meetsNisab ? "Above nisab: zakat is due" : "Below nisab: no zakat due"}</span>
            <span style={S.aprNote}>
              {result.meetsNisab
                ? "This applies once this wealth (or more) has been held for one full lunar year (the hawl). If you only crossed nisab partway through the year, most scholars still count from the date you first met or exceeded it."
                : "Your zakatable wealth is below the nisab threshold, so no zakat is owed this year on these figures."}
            </span>
          </div>

          <div style={S.disclaimer}>
            Estimate only, using the standard 2.5% rate on net zakatable assets held for one lunar year.
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
function MoneyInput({ value, onChange, cents }: { value: number; onChange: (v: number) => void; cents?: boolean }) {
  return (
    <div style={S.suffixWrap}>
      <span style={S.prefix}>$</span>
      <input
        style={{ ...S.input, paddingLeft: 22 }}
        inputMode="decimal"
        value={value === 0 ? "" : cents ? value : value.toLocaleString("en-US")}
        placeholder="0"
        onChange={(e) => onChange(e.target.value === "" ? 0 : Math.max(0, Number(e.target.value.replace(/[^0-9.]/g, ""))))}
      />
    </div>
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
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#444" },
  input: { width: "100%", padding: "10px 12px", fontSize: "1rem", border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A" },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  hint: { fontSize: "0.82rem", color: "#666", lineHeight: 1.5, margin: "2px 0 0" },
  divider: { borderTop: "1px solid #E6EEEA", margin: "6px 0" },
  toggleRow: { display: "flex", gap: 8 },
  toggleBtn: { flex: 1, padding: "9px 10px", fontSize: "0.85rem", fontWeight: 600, border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", color: "#444", cursor: "pointer" },
  toggleBtnActive: { background: PRIMARY, borderColor: PRIMARY, color: "#fff" },
  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12, alignSelf: "start" },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 8, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "2rem", fontWeight: 800, color: PRIMARY, letterSpacing: "-0.02em" },
  bigSub: { fontSize: "0.8rem", color: "#777", marginTop: 2 },
  statRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  stat: { display: "flex", flexDirection: "column", gap: 1 },
  statLabel: { fontSize: "0.78rem", color: "#666" },
  statValue: { fontSize: "1.15rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  aprBox: { borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 1, border: "1px solid #E0EBE7", background: "#fff" },
  aprOk: { background: "#EAF7F1", borderColor: "#BFE6D7" },
  aprWarn: { background: "#FBF4E4", borderColor: "#F0DEB4" },
  aprLabel: { fontSize: "0.78rem", fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: "0.03em" },
  aprNote: { fontSize: "0.8rem", color: "#777" },
  disclaimer: { fontSize: "0.76rem", color: "#7a8783", lineHeight: 1.5, marginTop: 2 },
};
