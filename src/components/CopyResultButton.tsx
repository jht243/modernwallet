import { useState } from "react";

// Keep-the-result button for the tool-usage calculators (2026-11-25). Copies a plain-text summary of the result.
// navigator.clipboard can be refused (older app views, some iframes), so a rejection shows a manual fallback message.
export default function CopyResultButton({ text, label = "Copy result" }: { text: string; label?: string }) {
  const [status, setStatus] = useState("");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied.");
    } catch {
      setStatus("Copy was blocked here. Select the figures above to copy them.");
    }
    setTimeout(() => setStatus(""), 4000);
  };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
      <button
        type="button"
        onClick={copy}
        style={{ padding: "8px 12px", minHeight: 40, border: "1px solid #0E7C66", background: "#fff", color: "#0E7C66", borderRadius: 8, fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}
      >
        {label}
      </button>
      <span role="status" aria-live="polite" style={{ fontSize: "0.8rem", color: "#666" }}>{status}</span>
    </div>
  );
}
