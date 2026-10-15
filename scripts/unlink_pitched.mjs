// Post-build: no link to a vendor we are pitching (owner rule 2026-10-15, fleet-wide).
//
// A vendor with an address our outreach will email (or has emailed) gets NO link anywhere on the
// site: the link is something it can buy. Unpitched vendors keep their links. growth-sites-api
// refuses to send a note while the vendor's page still links to it, so a rebuild is what lets a
// newly found vendor get its note.
//
//   node scripts/unlink_pitched.mjs [dist]           unwrap <a> tags to pitched domains (text stays)
//   node scripts/unlink_pitched.mjs [dist] --check   audit only; exit 1 if any link to a pitched domain remains
//
// List: GET https://growth-sites-api.onrender.com/api/placement-pitched?site=<site>. If it can't be
// read, EVERY vendor in a comparison table (data-vendor-domain) is treated as pitched (fail closed).
// Kept: links to paid vendors (data/paid-placements.json) and any rel="sponsored" link (affiliate /
// referral / client links are revenue, not vendor links).
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const args = process.argv.slice(2);
const OUT = args[0] && !args[0].startsWith('--') ? args[0] : 'dist';
const CHECK = args.includes('--check');
const API = 'https://growth-sites-api.onrender.com/api/placement-pitched';

const norm = (d) => String(d || '').toLowerCase().replace(/^www\./, '');
const site = JSON.parse(readFileSync('data/placement-verticals.json', 'utf8')).site;
const paid = new Set((JSON.parse(readFileSync('data/paid-placements.json', 'utf8')).placements || []).map((p) => norm(p.domain)));

function walk(d) {
  const out = [];
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (e.endsWith('.html')) out.push(p);
  }
  return out;
}
const files = walk(OUT);

async function pitchedList() {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(`${API}?site=${encodeURIComponent(site)}`, { signal: AbortSignal.timeout(20000) });
      const j = await r.json();
      if (r.ok && j.ok && Array.isArray(j.domains)) return { domains: j.domains.map(norm), source: 'api' };
    } catch { /* retry */ }
    await new Promise((res) => setTimeout(res, 2000 * (i + 1)));
  }
  // Fail closed: every vendor row on the site counts as pitched.
  const all = new Set();
  for (const f of files) for (const m of readFileSync(f, 'utf8').matchAll(/data-vendor-domain="([^"]+)"/g)) all.add(norm(m[1]));
  return { domains: [...all], source: 'FALLBACK (api unreachable): every table vendor' };
}

const { domains, source } = await pitchedList();
const pitched = new Set(domains.filter((d) => !paid.has(d)));
function pitchedHost(href) {
  let h;
  try { h = norm(new URL(href).hostname); } catch { return null; }
  if (pitched.has(h)) return h;
  for (const d of pitched) if (h.endsWith(`.${d}`)) return d;
  return null;
}

let pages = 0, links = 0;
const left = [];
for (const f of files) {
  const html = readFileSync(f, 'utf8');
  const next = html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (tag, attrs, inner) => {
    const href = /\shref="(https?:\/\/[^"]+)"/i.exec(attrs)?.[1];
    if (!href || !pitchedHost(href)) return tag;
    if (/\srel="[^"]*\bsponsored\b/i.test(attrs)) return tag;
    if (CHECK) { left.push(`${relative(OUT, f)}: ${href}`); return tag; }
    links++;
    return inner;
  });
  if (!CHECK && next !== html) { writeFileSync(f, next); pages++; }
}

if (CHECK) {
  if (left.length) {
    console.error(`[unlink-pitched] ${left.length} link(s) to pitched vendors remain:\n  ` + left.slice(0, 40).join('\n  '));
    process.exit(1);
  }
  console.log(`[unlink-pitched] OK — no links to ${pitched.size} pitched vendors (${source})`);
} else {
  console.log(`[unlink-pitched] ${links} link(s) to ${pitched.size} pitched vendors removed on ${pages} page(s) (${source})`);
}
