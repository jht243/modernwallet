// Post-build: ONE general sponsorship line just above the footer on every page that
// promotes a company that pays us (owner rule 2026-10-21; ported from layer3
// src/components/SponsorshipDisclosure). It never names the company and is never tied
// to a specific listing.
//
//   node scripts/sponsorship_line.mjs [dist]
//
// Who counts as paying: every domain in data/paid-placements.json. A page qualifies when
// its <main> content links that domain (or a subdomain), names the domain in text, or
// names the brand derived from it ("buildium.com" -> "Buildium", "pay-hoa.com" ->
// "pay hoa" / "pay-hoa" / "payhoa"), case-insensitive whole words. Names are matched in
// reader-facing PROSE only (tag text, never attributes, slugs or ids). Navigation is not
// promotion, so <nav> blocks (breadcrumbs, TOC) and the "More in …" related-guides list
// are skipped; the site header and footer sit outside <main>.
// Ported from thehoaguide 4819e9a (modernwallet: page body is <main class="page">, footer
// is <footer class="site-footer"> right after it; related cards are internal links).
// No placements = no line anywhere, and no page changes.
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const OUT = args[0] && !args[0].startsWith('--') ? args[0] : 'dist';
const LINE =
  '<p class="sponsorship-line" style="max-width:760px;margin:0 auto;padding:20px 16px 28px;' +
  'font-size:13px;line-height:1.5;color:var(--muted);text-align:center">' +
  'Layer3 Labs sometimes earns sponsorship revenue when we promote certain companies.</p>';

const norm = (d) => String(d).toLowerCase().trim().replace(/^www\./, '');
const domains = [...new Set((JSON.parse(readFileSync('data/paid-placements.json', 'utf8')).placements || [])
  .map((p) => norm(p.domain || '')).filter(Boolean))];
if (!domains.length) {
  console.log('[sponsorship-line] 0 paid domains — no line on any page');
  process.exit(0);
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function namesFromDomain(domain) {
  const parts = domain.split('.')[0].split('-').filter(Boolean);
  return [...new Set([parts.join(' '), parts.join('-'), parts.join('')])].filter((n) => n.length >= 3);
}
const names = [...new Set(domains.flatMap(namesFromDomain))];
const NAME_RE = new RegExp(`(^|[^A-Za-z0-9])(${names.map(esc).join('|')})(?![A-Za-z0-9])`, 'i');

const decode = (s) => s
  .replace(/&nbsp;/g, ' ').replace(/&#39;|&#x27;|&apos;/g, "'").replace(/&quot;/g, '"')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
  .replace(/&amp;/g, '&');

function linksPaid(href) {
  let host;
  try { host = norm(new URL(href).hostname); } catch { return false; }
  return domains.some((d) => host === d || host.endsWith(`.${d}`));
}

function promotes(html) {
  const m = /<main\b[^>]*>([\s\S]*?)<\/main>/i.exec(html);
  if (!m) return false;
  const region = m[1]
    .replace(/<(script|style|svg|nav)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<section\b[^>]*class="[^"]*\bguide-related\b[^"]*"[\s\S]*?<\/section>/gi, ' ');
  for (const [, href] of region.matchAll(/<a\s[^>]*href="(https?:\/\/[^"]+)"/gi)) if (linksPaid(href)) return true;
  const text = decode(region.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
  const lower = text.toLowerCase();
  if (domains.some((d) => lower.includes(d))) return true;
  return NAME_RE.test(text);
}

function walk(d) {
  const out = [];
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (e.endsWith('.html')) out.push(p);
  }
  return out;
}

let n = 0;
for (const f of walk(OUT)) {
  const html = readFileSync(f, 'utf8');
  if (html.includes('class="sponsorship-line"') || !promotes(html)) continue;
  const next = html.replace(/<\/main>(\s*)(<footer\b)/i, `</main>$1${LINE}$1$2`);
  if (next !== html) { writeFileSync(f, next); n++; }
}
console.log(`[sponsorship-line] ${n} page(s) carry the sponsorship line (${domains.length} paid domain(s))`);
