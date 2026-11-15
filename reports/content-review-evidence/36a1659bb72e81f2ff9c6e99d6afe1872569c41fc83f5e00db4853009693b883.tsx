import { useState } from "react";

// Shared controls and styles for the loan-cost calculator islands (401(k) loan, hard money loan, bridge loan).
// Same look as PersonalLoanPayoffCalculator; kept in one file so the three islands do not copy it.

export const PRIMARY = "#0E7C66";

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label style={S.field}>
      <span style={S.label}>{label}</span>
      {children}
      {hint && <span style={S.hint}>{hint}</span>}
    </label>
  );
}
export function Money({ v, on }: { v: number; on: (n: number) => void }) {
  return (
    <div style={S.suffixWrap}>
      <span style={S.prefix}>$</span>
      <input style={{ ...S.input, paddingLeft: 22 }} inputMode="numeric" value={v === 0 ? "" : v.toLocaleString("en-US")} placeholder="0" onChange={(e) => on(parse(e.target.value))} />
    </div>
  );
}
export function Pct({ v, on, step }: { v: number; on: (n: number) => void; step?: number }) {
  return (
    <div style={S.suffixWrap}>
      <input style={S.input} inputMode="decimal" value={v} step={step} onChange={(e) => on(parse(e.target.value))} />
      <span style={S.suffix}>%</span>
    </div>
  );
}
export function Plain({ v, on, max }: { v: number; on: (n: number) => void; max?: number }) {
  return <input style={S.input} inputMode="numeric" value={v} onChange={(e) => on(clamp(parse(e.target.value), max))} />;
}
export function Stat({ label, value }: { label: string; value: string }) {
  return <div style={S.stat}><span style={S.statLabel}>{label}</span><span style={S.statValue}>{value}</span></div>;
}
export function Select<T extends string>({ v, on, options }: { v: T; on: (v: T) => void; options: Array<[T, string]> }) {
  return (
    <select style={S.input} value={v} onChange={(e) => on(e.target.value as T)}>
      {options.map(([val, text]) => <option key={val} value={val}>{text}</option>)}
    </select>
  );
}
export function Notice({ tone, children }: { tone: "warn" | "ok"; children: React.ReactNode }) {
  return <div style={{ ...S.notice, ...(tone === "warn" ? S.noticeWarn : S.noticeOk) }} role="status">{children}</div>;
}

/** Copies the result lines as plain text. Falls back to a selectable text area when the clipboard is blocked. */
export function CopyResults({ lines }: { lines: string[] }) {
  const [state, setState] = useState<"idle" | "copied" | "manual">("idle");
  const text = lines.join("\n");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("manual");
    }
  };
  return (
    <div>
      <button type="button" style={S.copyBtn} onClick={copy}>{state === "copied" ? "Copied" : "Copy results"}</button>
      {state === "manual" && <textarea style={S.manual} readOnly rows={Math.min(lines.length + 1, 12)} value={text} onFocus={(e) => e.currentTarget.select()} aria-label="Results to copy" />}
    </div>
  );
}

export function SimpleTable({ caption, head, rows }: { caption: string; head: string[]; rows: string[][] }) {
  return (
    <div style={S.tableWrap}>
      <table style={S.table}>
        <caption style={S.caption}>{caption}</caption>
        <thead><tr>{head.map((h, i) => <th key={h} style={i === 0 ? { ...S.th, textAlign: "left" } : S.th} scope="col">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} style={j === 0 ? S.tdFirst : S.td}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export function parse(s: string): number { if (s === "") return 0; return Math.max(0, Number(s.replace(/[^0-9.]/g, "")) || 0); }
export function clamp(n: number, max?: number): number { return typeof max === "number" ? Math.min(n, max) : n; }
export function num(x: unknown, d: number): number { const v = Number(x); return Number.isFinite(v) ? v : d; }

export const S: Record<string, React.CSSProperties> = {
  wrap: { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#1A1A1A" },
  head: { marginBottom: 16 },
  heading: { fontSize: "1.2rem", fontWeight: 700 },
  subheading: { fontSize: "0.95rem", color: "#555", marginTop: 2 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 },
  inputs: { display: "flex", flexDirection: "column", gap: 12 },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, alignItems: "end" },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: "0.82rem", fontWeight: 600, color: "#444" },
  hint: { fontSize: "0.74rem", color: "#7a8783", lineHeight: 1.4 },
  input: { width: "100%", padding: "10px 12px", fontSize: "1rem", border: "1px solid #D0DAD6", borderRadius: 8, background: "#fff", boxSizing: "border-box", color: "#1A1A1A" },
  suffixWrap: { position: "relative", display: "flex", alignItems: "center" },
  prefix: { position: "absolute", left: 11, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  suffix: { position: "absolute", right: 12, color: "#888", fontSize: "0.95rem", pointerEvents: "none" },
  group: { fontSize: "0.74rem", fontWeight: 700, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 6 },
  results: { background: "linear-gradient(180deg,#F4FAF8 0%,#FFFFFF 100%)", border: "1px solid #D8EEE6", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12, alignSelf: "start" },
  bigStat: { display: "flex", flexDirection: "column", gap: 2, paddingBottom: 10, borderBottom: "1px solid #E6F0EC" },
  bigLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em" },
  bigValue: { fontSize: "1.9rem", fontWeight: 800, color: PRIMARY, letterSpacing: "-0.02em" },
  bigSub: { fontSize: "0.82rem", color: "#777" },
  statRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  stat: { display: "flex", flexDirection: "column", gap: 1 },
  statLabel: { fontSize: "0.78rem", color: "#666" },
  statValue: { fontSize: "1.12rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" },
  disclaimer: { fontSize: "0.76rem", color: "#7a8783", lineHeight: 1.5, marginTop: 2 },
  link: { color: PRIMARY, fontWeight: 600 },
  notice: { fontSize: "0.84rem", lineHeight: 1.5, padding: "9px 12px", borderRadius: 8 },
  noticeWarn: { background: "#FFF4E5", border: "1px solid #F0C98A", color: "#7A4A00" },
  noticeOk: { background: "#E9F6F1", border: "1px solid #BFE3D6", color: "#1E5B49" },
  copyBtn: { padding: "7px 14px", borderRadius: 999, border: "1px solid #D0DAD6", background: "#fff", color: "#333", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" },
  manual: { width: "100%", marginTop: 8, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.8rem", boxSizing: "border-box" },
  tableWrap: { overflowX: "auto", marginTop: 6 },
  table: { borderCollapse: "collapse", width: "100%", fontSize: "0.82rem", fontVariantNumeric: "tabular-nums" },
  caption: { textAlign: "left", fontSize: "0.78rem", fontWeight: 700, color: "#2A6A58", textTransform: "uppercase", letterSpacing: "0.04em", padding: "0 0 4px" },
  th: { textAlign: "right", padding: "5px 8px", borderBottom: "1px solid #D8EEE6", color: "#555", fontWeight: 600, whiteSpace: "nowrap" },
  td: { textAlign: "right", padding: "5px 8px", borderBottom: "1px solid #EEF2F0" },
  tdFirst: { textAlign: "left", padding: "5px 8px", borderBottom: "1px solid #EEF2F0", whiteSpace: "nowrap" },
};
