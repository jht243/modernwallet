#!/usr/bin/env node
/**
 * check-bundle-size — fleet build gate. Fails the build ONLY on obvious mistakes:
 *
 *   • any single client JS file over BUNDLE_MAX_FILE_KB   (default 1500 KB raw ≈ 400 KB gz)
 *   • (Next.js) any route whose first-load JS sum is over BUNDLE_MAX_ROUTE_KB (default 3000 KB)
 *
 * A healthy page on any fleet site ships 100–400 KB of JS in total, so a normal
 * spike (a new chart library, a bigger island) stays far below these lines. What
 * trips them is a whole content dataset ending up in a client chunk — the Sept 2026
 * layer3 incident shipped a 19.8 MB chunk on every page and drove Render egress to
 * >100 GB/day for two months before anyone noticed (see memory: render-bandwidth-bill-spike).
 *
 * Runs as `postbuild`, so `npm run build` / `yarn build` on Render triggers it with no
 * dashboard change. Works for Next (.next) and Astro/static (dist | out | build).
 * Override per repo with env: BUNDLE_MAX_FILE_KB, BUNDLE_MAX_ROUTE_KB, BUNDLE_CHECK=0 to skip.
 */
import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

if (process.env.BUNDLE_CHECK === '0') process.exit(0);
const MAX_FILE_KB = Number(process.env.BUNDLE_MAX_FILE_KB || 1500);
const MAX_ROUTE_KB = Number(process.env.BUNDLE_MAX_ROUTE_KB || 3000);
const kb = (b) => Math.round(b / 1024);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) { if (name !== 'node_modules') walk(p, out); }
    else if (/\.(m?js)$/.test(name) && !name.endsWith('.map')) out.push({ path: p, bytes: st.size });
  }
  return out;
}

// Next: scan .next only (out/ is a copy of the same chunks). Astro/static: dist | out | build.
const roots = existsSync('.next/static') ? ['.next/static'] : ['dist', 'out', 'build'].filter(existsSync);
if (!roots.length) { console.log('[bundle-check] no build output found (.next/static, dist, out, build) — skipping'); process.exit(0); }

const files = roots.flatMap((r) => walk(r)).sort((a, b) => b.bytes - a.bytes);
const failures = [];
for (const f of files) if (kb(f.bytes) > MAX_FILE_KB) failures.push(`client JS file ${f.path} is ${kb(f.bytes)} KB (limit ${MAX_FILE_KB} KB)`);

// Next.js: per-route first-load sum from the build manifest.
const manifestPath = '.next/build-manifest.json';
if (existsSync(manifestPath)) {
  const m = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const size = (rel) => { const p = join('.next', rel); return existsSync(p) ? statSync(p).size : 0; };
  const shared = (m.pages['/_app'] || []).filter((x) => x.endsWith('.js'));
  for (const [route, chunks] of Object.entries(m.pages)) {
    const all = new Set([...shared, ...chunks.filter((x) => x.endsWith('.js'))]);
    const total = [...all].reduce((s, c) => s + size(c), 0);
    if (kb(total) > MAX_ROUTE_KB) failures.push(`route ${route} first-load JS is ${kb(total)} KB (limit ${MAX_ROUTE_KB} KB)`);
  }
}

const top = files.slice(0, 3).map((f) => `${kb(f.bytes)} KB ${f.path}`).join(', ');
if (failures.length) {
  console.error(`\n[bundle-check] FAILED — this build would ship an oversized bundle to every visitor:\n  - ${failures.join('\n  - ')}\n`);
  console.error('  Almost always a page-render path (component/util/layout) value-imports a data/* dataset.');
  console.error('  Move the lookup into getStaticProps (Next) or the frontmatter (Astro) and pass only what the page renders.');
  console.error('  Largest files:', top, '\n');
  process.exit(1);
}
console.log(`[bundle-check] ok — ${files.length} JS files, largest: ${top}`);
