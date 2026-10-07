import { useState } from "react";

// Shared input widgets and styles for the standalone calculator islands added from 2026-10-07.

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={S.field}>
      <span style={S.label}>{label}</span>
      {children}
    </label>
  );
}
export function MoneyInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={S.suffixWrap}>
      <span style={S.prefix}>$</span>
      <input
        style={{ ...S.input, paddingLeft: 22 }}
        inputMode="numeric"
        value={value === 0 ? "" : value.toLocaleString("en-US")}
        placeholder="0"
        onChange={(e) => { const n = parseFloat(e.target.value.replace(/[^0-9.]/g, "")); onChange(Number.isFinite(n) ? Math.max(0, n) : 0); }}
      />
    </div>
  );
}
function useDraft(value: number, onChange: (v: number) => void) {
  const [draft, setDraft] = useState<string | null>(null);
  return {
    text: draft ?? (value === 0 ? "" : String(value)),
    onChange: (raw: string) => {
      const cleaned = raw.replace(/[^0-9.]/g, "");
      setDraft(cleaned);
      const n = parseFloat(cleaned);
      onChange(Number.isFinite(n) ? Math.max(0, n) : 0);
    },
    onBlur: () => setDraft(null),
  };
}
export function NumInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const d = useDraft(value, onChange);
  return <input style={S.input} inputMode="decimal" value={d.text} placeholder="0" onChange={(e) => d.onChange(e.target.value)} onBlur={d.onBlur} />;
}
export function PctInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const d = useDraft(value, onChange);
  return (
    <div style={S.suffixWrap}>
      <input style={S.input} inputMode="decimal" value={d.text} placeholder="0" onChange={(e) => d.onChange(e.target.value)} onBlur={d.onBlur} aria-label="Percent" />
      <span style={S.suffix}>%</span>
    </div>
  );
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={S.stat}>
      <span style={S.statLabel}>{label}</span>
      <span style={S.statValue}>{value}</span>
    </div>
  );
}

export const PRIMARY = "#0E7C66";
export const S: Record<string, React.CSSProperties> = {
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
  suffix: { position: "absolute", right: 12, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  hint: { fontSize: "0.82rem", color: "#666", lineHeight: 1.5, margin: "2px 0 0" },
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
  aprValue: { fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" },
  aprNote: { fontSize: "0.8rem", color: "#777" },
  disclaimer: { fontSize: "0.76rem", color: "#7a8783", lineHeight: 1.5, marginTop: 2 },
};
