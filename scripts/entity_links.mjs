// Post-build: the FIRST time a company is named on a page, link it to that company's
// own site (or to our referral link for it, marked sponsored). Runs on the built HTML,
// so ALL content inherits it: hand-written pages, routine-generated pages, FAQ answers,
// current and future.
//
// Fleet copy, ported from chalkbox scripts/entity_links.mjs (2026-09-28). Keep the
// logic identical across repos; only data/entity-links.json differs per site.
//
// Usage: node scripts/entity_links.mjs [outDir=dist]
//        node scripts/entity_links.mjs <outDir> --verify <baselineDir>
//          --verify strips every link this script added (data-entity-link) and requires
//          each page to be byte-identical to the baseline build: proof the ONLY change
//          is the inserted links.
//
// Registry: data/entity-links.json. Keys starting with "_" are comments.
//   "Brand Name": "https://official-site.com"                       plain link
//   "Brand Name": { "url": "https://ref-link", "sponsored": true }  referral link
// Never add an ordinary English word as a key ("Wing", "Apple" on a fruit site, ...).
//
// Safety: a text-node linker, not a regex-over-HTML linker. It never touches:
//   - <head>, <script>, <style>, <template>, <svg>, <code>, <pre> (incl. JSON-LD)
//   - anything already inside an <a> (never nests or double-links)
//   - headings h1-h6, form controls, and site chrome (nav/header/footer)
//   - tag interiors, so an attribute value can never be corrupted
// A company the page already links (by href domain or anchor text) is left alone.
import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const args = process.argv.slice(2);
const OUT = args[0] && !args[0].startsWith('--') ? args[0] : 'dist';
const vi = args.indexOf('--verify');
const BASELINE = vi !== -1 ? args[vi + 1] : null;

const MARK = 'data-entity-link';

function walk(d) {
  const out = [];
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (e.endsWith('.html')) out.push(p);
  }
  return out;
}

if (BASELINE) {
  const strip = (h) => h.replace(new RegExp(`<a ${MARK}="1"[^>]*>([^<]*)</a>`, 'g'), '$1');
  let bad = 0, linked = 0, pages = 0;
  for (const f of walk(OUT)) {
    const rel = relative(OUT, f);
    const b = join(BASELINE, rel);
    if (!existsSync(b)) { console.error(`[entity-links] verify: not in baseline: ${rel}`); bad++; continue; }
    const after = readFileSync(f, 'utf8');
    const n = (after.match(new RegExp(`<a ${MARK}="1"`, 'g')) || []).length;
    if (n) { linked += n; pages++; }
    if (strip(after) !== readFileSync(b, 'utf8')) { console.error(`[entity-links] verify: DIFF beyond links: ${rel}`); bad++; }
  }
  console.log(`[entity-links] verify: ${linked} link(s) on ${pages} page(s); ${bad} problem file(s)`);
  process.exit(bad ? 1 : 0);
}

if (!existsSync('data/entity-links.json')) { console.log('[entity-links] no registry, skipped'); process.exit(0); }
if (!existsSync(OUT)) { console.error(`[entity-links] build output not found: ${OUT}`); process.exit(1); }
const REGISTRY = JSON.parse(readFileSync('data/entity-links.json', 'utf8'));

// The rule is per COMPANY: "Google Docs", "Google Workspace" and "Google" share one link
// per page. Group = registrable domain (+ aliases for brands on a parent's other domain).
const DOMAIN_ALIAS = REGISTRY._domainAlias || {};
function companyOf(url) {
  const host = new URL(url).hostname.replace(/^www\./, '');
  const parts = host.split('.');
  const base = parts.length > 2 ? parts.slice(-2).join('.') : host;
  return DOMAIN_ALIAS[base] || base;
}

const ENTITIES = Object.entries(REGISTRY)
  .filter(([k]) => !k.startsWith('_'))
  .map(([name, v]) => {
    const url = typeof v === 'string' ? v : v.url;
    const sponsored = typeof v === 'object' && v.sponsored === true;
    // A referral link's domain is the redirector's; group by the brand's own domain when given.
    const company = typeof v === 'object' && v.company ? v.company : companyOf(url);
    return [name, url, company, sponsored];
  })
  .sort((a, b) => b[0].length - a[0].length); // longest first: "Google Docs" beats "Google"

const COMPANY_COUNT = new Set(ENTITIES.map(([, , c]) => c)).size;

const SKIP_TREE = new Set(['head', 'script', 'style', 'template', 'svg', 'code', 'pre',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button', 'select', 'option', 'textarea', 'label', 'a',
  'nav', 'header', 'footer']);

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const boundaried = (name) => new RegExp(`(^|[^A-Za-z0-9.])(${esc(name)})(?![A-Za-z0-9.])`);
const attrEsc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

function anchor(url, text, sponsored) {
  const rel = sponsored ? 'sponsored nofollow noopener noreferrer' : 'noopener noreferrer';
  return `<a ${MARK}="1" href="${attrEsc(url)}" target="_blank" rel="${rel}">${text}</a>`;
}

function linkPage(html) {
  // A tag starts with "<" + letter, "/" or "!". A bare "<" (CSS `@media (width<=700px)`,
  // inline JS `i<n`) is text: splitting on it swallowed `</style>` and left the rest of
  // the page on the skip stack, so nothing after an Astro scoped <style> was ever linked.
  const parts = html.split(/(<[a-zA-Z\/!][^>]*>)/);
  const skipStack = [];
  const linked = new Set();

  // A company already linked anywhere on the page (by href) is done.
  for (const href of html.matchAll(/<a\b[^>]*href="(https?:\/\/[^"]+)"/gi)) {
    try { linked.add(companyOf(href[1])); } catch { /* malformed URL */ }
  }
  // ...or by anchor text (links routed through a redirector).
  for (const [name, , company] of ENTITIES) {
    if (new RegExp(`<a\\b[^>]*>[^<]*${esc(name)}`).test(html)) linked.add(company);
  }

  let changed = 0;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (!p) continue;
    if (p[0] === '<') {
      const m = /^<\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9-]*)/.exec(p);
      if (m) {
        const [, closing, rawTag] = m;
        const tag = rawTag.toLowerCase();
        if (SKIP_TREE.has(tag)) {
          if (closing) {
            const at = skipStack.lastIndexOf(tag);
            if (at !== -1) skipStack.splice(at, 1);
          } else if (!/\/>$/.test(p)) skipStack.push(tag);
        }
      }
      continue;
    }
    if (skipStack.length) continue;
    if (linked.size >= COMPANY_COUNT) break;

    // Claim spans against the ORIGINAL text so a shorter brand can't match inside an
    // anchor this loop just inserted (which would nest <a> in <a>).
    const claims = [];
    const overlaps = (s, e) => claims.some((c) => s < c.end && e > c.start);
    for (const [name, url, company, sponsored] of ENTITIES) {
      if (linked.has(company)) continue;
      const hit = boundaried(name).exec(p);
      if (!hit) continue;
      const start = hit.index + hit[1].length;
      const end = start + hit[2].length;
      if (overlaps(start, end)) continue;
      claims.push({ start, end, url, text: hit[2], sponsored });
      linked.add(company);
      changed++;
    }
    if (claims.length) {
      claims.sort((a, b) => a.start - b.start);
      let out = '', cursor = 0;
      for (const c of claims) {
        out += p.slice(cursor, c.start) + anchor(c.url, c.text, c.sponsored);
        cursor = c.end;
      }
      parts[i] = out + p.slice(cursor);
    }
  }
  return { html: parts.join(''), changed };
}

let files = 0, total = 0;
for (const f of walk(OUT)) {
  const src = readFileSync(f, 'utf8');
  if (src.includes(`${MARK}="1"`)) continue; // already processed (idempotent re-runs)
  const { html, changed } = linkPage(src);
  if (changed) { writeFileSync(f, html); files++; total += changed; }
}
console.log(`[entity-links] linked ${total} first-mention(s) across ${files} file(s)`);
