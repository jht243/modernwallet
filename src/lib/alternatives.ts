// Rendering + outbound-link guard for "<Product> Alternatives" pages.
//
// Owner rule (2026-11-13): the ONLY external link on an alternatives page is the subject
// product's official site. This renderer is deliberately separate from richtext.ts: it never
// adds referral links (no Robinhood autolink) and it turns any external link whose host is not
// in the page's registry `officialHosts` into plain text. scripts/alternatives_daily/check_built.py
// re-checks the built HTML after the post-build link passes.

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/g;

function hostOf(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

/** Inline text → safe HTML. Internal "/path" links stay; external links survive only when their
 *  host is in `allowedHosts`, otherwise the anchor text is kept as plain text. */
export function altInline(input: string, allowedHosts: string[]): string {
  const allowed = new Set(allowedHosts.map((h) => h.toLowerCase()));
  return escapeHtml(input || "").replace(LINK_RE, (_m, text: string, url: string) => {
    if (url.startsWith("/") && !url.startsWith("//")) return `<a href="${url}">${text}</a>`;
    const host = /^https:\/\//i.test(url) ? hostOf(url.replace(/&amp;/g, "&")) : null;
    if (host && allowed.has(host)) return `<a href="${url}" target="_blank" rel="noopener">${text}</a>`;
    return text;
  });
}

/** Block text → HTML: blank-line-separated paragraphs; a block whose lines all start "- " is a list. */
export function altBlocks(input: string, allowedHosts: string[]): string {
  return (input || "")
    .trim()
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length && lines.every((l) => l.startsWith("- "))) {
        return `<ul>${lines.map((l) => `<li>${altInline(l.slice(2), allowedHosts)}</li>`).join("")}</ul>`;
      }
      return `<p>${altInline(lines.join(" "), allowedHosts)}</p>`;
    })
    .join("");
}

/** Plain text for meta tags and JSON-LD. */
export function altPlain(input: string): string {
  return (input || "").replace(LINK_RE, (_m, text: string) => text).replace(/\s+/g, " ").trim();
}
