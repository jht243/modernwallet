// Build-time generator for public/search-index.json — the index the NavSearch
// widget fetches. Ported from the Layer3Labs fleet template.
//
// Runs in `prebuild` (plain Node, BEFORE `astro build`) so the file ships in the
// static output. A static export has NO API routes at read time, so a baked
// index file is the only thing that works there — the search is 100%
// client-side over this JSON.
//
// Source: the SAME data registries every getStaticPaths() renders from —
// calculators (live only), spokes + state variants, guides, comparisons,
// roundups, templates — with the sitemap's noindex filter applied
// (src/data/noindex.ts), so the index lists exactly the pages the sitemap
// lists. The sources are TypeScript, so they are bundled to a temp ESM file
// with esbuild (already present as a Vite dependency) and imported.
//
// Record shape per page: {t,u,c,k,w}
//   t = title, u = url path, c = category (the calculator section, or
//   Guides / Comparisons / Roundups / Templates / Pages), k = keyword haystack,
//   w = weight bonus (calculator hubs surface above long-tail spokes)

import fs from 'fs'
import os from 'os'
import path from 'path'
import { pathToFileURL } from 'url'
import { build } from 'esbuild'

const ROOT = process.cwd()
const PUBLIC = path.join(ROOT, 'public')

async function loadSources() {
  const outfile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'tmw-search-')), 'registry.mjs')
  await build({
    stdin: {
      contents: `
        export { CALCULATORS, CALC_BY_ID, isLive } from './src/data/calculators';
        export { SPOKES } from './src/data/spokes';
        export { GUIDES } from './src/data/guides';
        export { COMPARISONS } from './src/data/comparisons';
        export { ROUNDUPS } from './src/data/roundups';
        export { TEMPLATES } from './src/data/templates';
        export { STATE_BY_SLUG } from './src/data/states';
        export { isNoindexedPath } from './src/data/noindex';
      `,
      resolveDir: ROOT,
      loader: 'ts',
    },
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node20',
    logLevel: 'silent',
    outfile,
  })
  return import(pathToFileURL(outfile).href)
}

const clean = (s) => String(s || '').replace(/\s+/g, ' ').trim()

async function buildIndex() {
  const src = await loadSources()
  const byPath = new Map()
  const add = (u, t, c, k, w = 0) => {
    if (!u || !t) return
    if (src.isNoindexedPath(u + '/')) return
    if (byPath.has(u)) return
    byPath.set(u, { t: clean(t), u, c, k: clean(k).toLowerCase(), w })
  }

  // Static section/utility pages (homepage skipped).
  add('/calculators', 'All Calculators', 'Pages', 'calculators tools', 5)
  add('/guides', 'Guides', 'Pages', 'guides articles', 5)
  add('/compare', 'Comparisons', 'Pages', 'compare comparisons vs', 5)
  add('/roundup', 'Roundups', 'Pages', 'roundup best of lists', 5)
  add('/templates', 'Templates', 'Pages', 'templates downloads spreadsheets', 5)
  add('/about', 'About', 'Pages', 'about us')
  add('/methodology', 'Methodology', 'Pages', 'methodology how we calculate')
  add('/editorial-policy', 'Editorial Policy', 'Pages', 'editorial policy')
  add('/contact', 'Contact', 'Pages', 'contact')

  // Calculator hubs + their spokes + state variants, grouped under the calculator's section.
  const liveCalcs = src.CALCULATORS.filter(src.isLive)
  for (const calc of liveCalcs) {
    add(`/${calc.id}`, calc.h1 || calc.label, calc.label, `${calc.label} ${calc.targetKeyword || ''} ${calc.h1 || ''} calculator`, 8)
  }
  for (const s of src.SPOKES) {
    const calc = src.CALC_BY_ID[s.calculator]
    if (!calc || !src.isLive(calc)) continue
    const base = `/${s.calculator}/${s.slug}`
    add(base, s.h1 || s.title, calc.label, `${s.title} ${s.targetKeyword || ''} ${calc.label} ${s.slug.replace(/-/g, ' ')}`)
    for (const stateSlug of s.stateVariants || []) {
      const st = src.STATE_BY_SLUG[stateSlug]
      if (!st) continue
      add(`${base}/${st.slug}`, `${s.h1 || s.title} — ${st.name}`, calc.label, `${s.title} ${s.targetKeyword || ''} ${st.name} ${st.usps}`)
    }
  }
  for (const g of src.GUIDES) add(`/guides/${g.slug}`, g.h1 || g.title, 'Guides', `${g.title} ${g.targetKeyword || ''} ${g.slug.replace(/-/g, ' ')}`)
  for (const c of src.COMPARISONS.filter((e) => !e.draft)) add(`/compare/${c.slug}`, c.h1 || c.title, 'Comparisons', `${c.title} ${c.optionA || ''} ${c.optionB || ''} ${c.targetKeyword || ''} vs`)
  for (const r of src.ROUNDUPS.filter((e) => !e.draft)) add(`/roundup/${r.slug}`, r.h1 || r.title, 'Roundups', `${r.title} ${r.targetKeyword || ''} ${r.category || ''} best`)
  for (const t of src.TEMPLATES) add(`/templates/${t.slug}`, t.h1 || t.title, 'Templates', `${t.title} ${t.targetKeyword || ''} template download`)

  return [...byPath.values()]
}

const index = await buildIndex()
if (!index.length) {
  console.error('[build_search_index] REFUSING TO BUILD: empty search index')
  process.exit(1)
}
fs.mkdirSync(PUBLIC, { recursive: true })
fs.writeFileSync(path.join(PUBLIC, 'search-index.json'), JSON.stringify(index))
console.log(`[build_search_index] wrote public/search-index.json — ${index.length} entries`)

// Copy the search-rescue alias map into the static export so the client-side
// NavSearch can fetch it (the live host has no API routes). The map is the
// source of truth for the "did you mean" rescue and is grown by the
// search-gap-content-auto routine. Missing/malformed source => empty map (no-op).
try {
  const raw = fs.readFileSync(path.join(ROOT, 'data', 'search-aliases.json'), 'utf8')
  const parsed = JSON.parse(raw)
  const aliases = {}
  for (const [k, v] of Object.entries(parsed)) {
    const key = String(k).toLowerCase().trim()
    if (!key || key.startsWith('_')) continue
    const list = Array.isArray(v) ? v : [v]
    const targets = list.map((x) => String(x).toLowerCase().trim()).filter(Boolean)
    if (targets.length) aliases[key] = targets
  }
  fs.writeFileSync(path.join(PUBLIC, 'search-aliases.json'), JSON.stringify(aliases))
  console.log(`[build_search_index] wrote public/search-aliases.json — ${Object.keys(aliases).length} aliases`)
} catch {
  fs.writeFileSync(path.join(PUBLIC, 'search-aliases.json'), '{}')
  console.log('[build_search_index] no data/search-aliases.json source — wrote empty map')
}
