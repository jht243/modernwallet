// Tiny rich-text helper for content strings authored with inline markdown links: [text](/path/).
// `linkify` → safe HTML (escapes everything, then turns links into <a>). Use with set:html.
// `plain`   → strips link syntax to just the anchor text (for <meta>, JSON-LD, anywhere HTML is wrong).

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

/** Escape HTML, then render [text](url) as anchors. Internal links (starting "/") stay normal;
 *  external (http) get rel="noopener". Content is first-party/trusted (we generate it). */
export function linkify(input: string): string {
  const escaped = escapeHtml(input);
  return escaped.replace(LINK_RE, (_m, text: string, url: string) => {
    const isExternal = /^https?:\/\//i.test(url);
    const rel = isExternal ? ' rel="noopener"' : "";
    const target = isExternal ? ' target="_blank"' : "";
    return `<a href="${url}"${target}${rel}>${text}</a>`;
  });
}

/** Strip [text](url) down to text. For meta descriptions and JSON-LD answer text. */
export function plain(input: string): string {
  return input.replace(LINK_RE, (_m, text: string) => text).replace(/\s+/g, " ").trim();
}

/** Break a long content string into readable paragraphs so it never renders as one wall of text.
 *  Honors explicit blank-line breaks if the author added them; otherwise groups ~2 sentences per
 *  paragraph. Returns raw (still-markdown) paragraphs — linkify each one when rendering. */
export function paragraphs(input: string): string[] {
  const t = (input || "").trim();
  if (!t) return [];
  if (/\n\s*\n/.test(t)) return t.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
  // Split ONLY at a real sentence boundary: a terminator (+ optional closing quote/paren), then
  // whitespace, then a capital/number/quote/$ starting the next sentence. Slicing at the matched
  // indices is lossless (never drops text) and leaves decimals ("1.1%") and "U.S." intact, because
  // the "." there isn't followed by whitespace + a sentence-start.
  const boundary = /[.!?]["')\]]*\s+(?=[A-Z0-9"'($])/g;
  const sentences: string[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = boundary.exec(t)) !== null) {
    const end = m.index + m[0].length;
    sentences.push(t.slice(last, end).trim());
    last = end;
  }
  if (last < t.length) sentences.push(t.slice(last).trim());
  if (sentences.length <= 2) return [t];

  const out: string[] = [];
  let buf = "";
  let count = 0;
  for (const s of sentences) {
    buf = buf ? `${buf} ${s}` : s;
    count++;
    if (count >= 2 || buf.length >= 240) {
      out.push(buf);
      buf = "";
      count = 0;
    }
  }
  if (buf) out.push(buf);
  return out;
}
