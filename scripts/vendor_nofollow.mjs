// Post-build: every link to a PAID vendor's domain is "sponsored nofollow" — site-wide.
//
// The roundup comparison tables already render every vendor link nofollow (src/lib/vendorTable.ts).
// This pass catches a vendor that has PAID (data/paid-placements.json) named and linked anywhere
// else (prose, FAQ answers, first-mention entity links). Unpaid vendors' prose links are left
// as they are, so pages outside the tables stay byte-identical (same choice as The Metabolic Journal).
//
//   node scripts/vendor_nofollow.mjs [dist]           rewrite rel on paid vendor links
//   node scripts/vendor_nofollow.mjs [dist] --check   audit only; exit 1 on any paid link missing it
//
// Only the rel attribute of matching <a> tags is touched; nothing else in the page changes.
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const args = process.argv.slice(2);
const OUT = args[0] && !args[0].startsWith('--') ? args[0] : 'dist';
const CHECK = args.includes('--check');

const norm = (d) => String(d).toLowerCase().replace(/^www\./, '');
const vendors = new Set();
const paid = new Set((JSON.parse(readFileSync('data/paid-placements.json', 'utf8')).placements || []).map((p) => norm(p.domain)));

function matchDomain(href) {
  let host;
  try { host = norm(new URL(href).hostname); } catch { return null; }
  for (const set of [paid, vendors]) {
    if (set.has(host)) return host;
    for (const d of set) if (host.endsWith(`.${d}`)) return d;
  }
  return null;
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

let changed = 0, links = 0;
const bad = [];
for (const f of walk(OUT)) {
  const html = readFileSync(f, 'utf8');
  const next = html.replace(/<a\s[^>]*>/gi, (tag) => {
    const href = /\shref="(https?:\/\/[^"]+)"/i.exec(tag)?.[1];
    const domain = href && matchDomain(href);
    if (!domain) return tag;
    links++;
    const relM = /\srel="([^"]*)"/i.exec(tag);
    const rel = new Set((relM?.[1] || '').split(/\s+/).filter(Boolean));
    const want = paid.has(domain) ? ['sponsored', 'nofollow'] : ['nofollow'];
    if (want.every((w) => rel.has(w))) return tag;
    if (CHECK) { bad.push(`${relative(OUT, f)}: ${href}`); return tag; }
    want.forEach((w) => rel.add(w));
    const value = [...rel].join(' ');
    return relM ? tag.replace(relM[0], ` rel="${value}"`) : tag.replace(/^<a\s/i, `<a rel="${value}" `);
  });
  if (!CHECK && next !== html) { writeFileSync(f, next); changed++; }
}

if (CHECK) {
  if (bad.length) {
    console.error(`[vendor-nofollow] ${bad.length} dofollow vendor link(s):\n  ` + bad.slice(0, 50).join('\n  '));
    process.exit(1);
  }
  console.log(`[vendor-nofollow] OK — ${links} vendor links, all nofollow (${vendors.size} vendor domains, ${paid.size} paid)`);
} else {
  console.log(`[vendor-nofollow] ${links} vendor links checked, ${changed} page(s) rewritten (${vendors.size} vendor domains, ${paid.size} paid)`);
}
