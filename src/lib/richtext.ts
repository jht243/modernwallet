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

import { ROBINHOOD_URL, PARTNER_REL } from "../data/partners";

const _rhAnchor = `<a href="${ROBINHOOD_URL}" target="_blank" rel="${PARTNER_REL}">Robinhood</a>`;

/** Point Robinhood at our referral link everywhere it's mentioned in body prose:
 *  (1) rewrite any existing robinhood.com anchor to the referral URL + sponsored rel,
 *  (2) auto-link bare "Robinhood" mentions that aren't already inside an anchor. */
function rewriteRobinhoodAnchors(html: string): string {
  return html.replace(
    /<a href="https?:\/\/(?:www\.)?robinhood\.com[^"]*"[^>]*>/gi,
    `<a href="${ROBINHOOD_URL}" target="_blank" rel="${PARTNER_REL}">`,
  );
}

function robinhoodize(html: string): string {
  html = rewriteRobinhoodAnchors(html);
  // Split on existing anchors so we never link text that's already a link.
  return html
    .split(/(<a\b[^>]*>.*?<\/a>)/gis)
    .map((seg, i) => (i % 2 === 1 ? seg : seg.replace(/\bRobinhood\b/g, _rhAnchor)))
    .join("");
}

function anchor(url: string, text: string): string {
  const isExternal = /^https?:\/\//i.test(url);
  const rel = isExternal ? ' rel="noopener"' : "";
  const target = isExternal ? ' target="_blank"' : "";
  return `<a href="${url}"${target}${rel}>${text}</a>`;
}

// A plain `<a href="…">text</a>` authored in our own data files, AFTER escapeHtml. Only this exact
// shape (href only, no nested tags) is restored — anything else stays escaped text.
const ESCAPED_ANCHOR_RE = /&lt;a href=&quot;((?:\/|https?:\/\/)[^&\s]*)&quot;&gt;((?:(?!&lt;).)+?)&lt;\/a&gt;/g;

/** Escape HTML, then render inline links as anchors: markdown [text](url) and plain
 *  `<a href="url">text</a>` from our own data. Internal links (starting "/") stay normal;
 *  external (http) get target=_blank rel="noopener". Content is first-party/trusted (we generate it). */
function renderLinks(input: string): string {
  return escapeHtml(input)
    .replace(ESCAPED_ANCHOR_RE, (_m, url: string, text: string) => anchor(url, text))
    .replace(LINK_RE, (_m, text: string, url: string) => anchor(url, text));
}

/** Body prose: inline links + Robinhood referral handling (anchor rewrite + bare-mention autolink). */
export function linkify(input: string): string {
  return robinhoodize(renderLinks(input));
}

/** Short data fields (pricing, pros/cons, table cells, card intros): inline links only. Explicit
 *  robinhood.com links still go to the referral URL, but bare "Robinhood" mentions are NOT
 *  auto-linked here. */
export function linkifyInline(input: string): string {
  return rewriteRobinhoodAnchors(renderLinks(input));
}

/** Strip [text](url) down to text. For meta descriptions and JSON-LD answer text. */
export function plain(input: string): string {
  return input
    .replace(/<a href="[^"]*">([^<]+)<\/a>/g, "$1")
    .replace(LINK_RE, (_m, text: string) => text).replace(/\s+/g, " ").trim();
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
  const linkSpans = [...t.matchAll(LINK_RE)].map((l) => [l.index!, l.index! + l[0].length]);
  const sentences: string[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = boundary.exec(t)) !== null) {
    // Never split inside a markdown link's [anchor text] (e.g. "[U.S. Mint](…)").
    if (linkSpans.some(([s, e]) => m!.index >= s && m!.index < e)) continue;
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

/** True when a block is a GitHub-style pipe table: a header row, a |---|---| separator, then rows. */
function isPipeTable(block: string): boolean {
  const lines = block.trim().split("\n");
  if (lines.length < 3) return false;
  if (!lines.every((l) => l.trim().startsWith("|") && l.trim().endsWith("|"))) return false;
  return /^\|[\s:-]*\|[\s:|-]*$/.test(lines[1].trim());
}

function cells(row: string): string[] {
  return row.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
}

/** Render a pipe table to real HTML. Cell text still goes through linkify, so inline links work. */
function pipeTable(block: string): string {
  const lines = block.trim().split("\n");
  const head = cells(lines[0]);
  const body = lines.slice(2).map(cells);
  const th = head.map((c) => `<th scope="col">${linkify(c)}</th>`).join("");
  const trs = body
    .map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${linkify(c)}</th>` : `<td>${linkify(c)}</td>`)).join("")}</tr>`)
    .join("");
  return `<div class="table-wrap"><table class="prose-table"><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table></div>`;
}

const LIST_LINE = /^\s*(-|\d+\.)\s+/;

/** Every line of the block is a list item (may be a single item). */
function isListBlock(block: string): boolean {
  return block.trim().split("\n").every((l) => LIST_LINE.test(l));
}

/** True when a block is a markdown list: more than one item, all list lines. */
function isList(block: string): boolean {
  const lines = block.trim().split("\n");
  return lines.length > 1 && lines.every((l) => LIST_LINE.test(l));
}

function list(block: string): string {
  const lines = block.trim().split("\n");
  const ordered = /^\s*\d+\.\s+/.test(lines[0]);
  const items = lines.map((l) => `<li>${linkify(l.replace(LIST_LINE, ""))}</li>`).join("");
  return ordered ? `<ol class="prose-list">${items}</ol>` : `<ul class="prose-list">${items}</ul>`;
}

/** Render a section body: blank-line-separated blocks, each a paragraph, a pipe table or a list.
 *  Use with a single <Fragment set:html={richBody(...)} />. */
export function richBody(input: string): string {
  const blocks = (input || "").split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  // A list written with a blank line between items arrives as several one-line blocks.
  // Merge adjacent all-list-line blocks so it renders as ONE list, not N paragraphs.
  const merged: string[] = [];
  for (const b of blocks) {
    const prev = merged[merged.length - 1];
    if (prev && isListBlock(b) && isListBlock(prev)) merged[merged.length - 1] = `${prev}\n${b}`;
    else merged.push(b);
  }
  return merged
    .map((b) => (isPipeTable(b) ? pipeTable(b) : isList(b) ? list(b) : `<p>${linkify(b)}</p>`))
    .join("");
}
