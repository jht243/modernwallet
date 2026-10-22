// Does a page get the tested format? (content standard ## TESTED)
//
// The SAME switch the live template uses (src/lib/testedPage.ts), so a routine never
// decides differently from what the page will render. Only /roundup/<slug>/
// (src/pages/roundup/[slug].astro) calls it; /compare/ pages and every other route
// never do, so they are always NOT-TESTED here. Reads a JSON array of candidates on
// stdin (or a file path as argv[2]) and prints one result per line.
//
//   echo '[{"section":"roundup","slug":"best-budgeting-apps","title":"…","h1":"…",
//           "category":"budgeting apps","metaDescription":"…","items":"products"}]' \
//     | npx -y tsx scripts/tested/check.mts
//   → {"slug":"best-budgeting-apps","tested":true,"reason":null}
//
// section: roundup (/roundup/, src/data/roundups.ts) or compare (/compare/,
// src/data/comparisons.ts; always tested:false). Fields map to the roundup template's
// call: text = [title, h1, category], context = [metaDescription]. metaTitle is
// accepted as an alias of title. Before writing, pass the PLANNED fields; after
// writing, run it again on the real entry. If the two answers differ, the second wins.
import { readFileSync } from 'fs'
import { testedExclusionReason } from '../../src/lib/testedPage'

interface Row {
  section?: string; slug: string
  title?: string; metaTitle?: string; h1?: string; category?: string
  metaDescription?: string; description?: string
  /** What the page ranks or compares, as the writer classified it. Anything but
   *  "products" (accounts, cards, loans, funds, insurance, tax or legal services,
   *  companies, people) never qualifies. Before publishing such a roundup, add its
   *  slug to EXCLUDED_SLUGS in src/lib/testedPage.ts so the template agrees. */
  items?: string
}
const raw = process.argv[2] ? readFileSync(process.argv[2], 'utf8') : readFileSync(0, 'utf8')
const rows: Row[] = [].concat(JSON.parse(raw))
for (const r of rows) {
  const section = r.section || 'roundup'
  const title = r.title || r.metaTitle || r.h1 || ''
  const description = r.metaDescription || r.description || ''
  const offRoute = section !== 'roundup'
    ? `type: /${section}/ pages never use the tested template (roundups only)` : null
  const declared = r.items && r.items.toLowerCase() !== 'products'
    ? `items: ${r.items} (declared; add slug to EXCLUDED_SLUGS)` : null
  const reason = offRoute || declared || testedExclusionReason({
    slug: r.slug, text: [title, r.h1 || title, r.category || ''],
    context: description ? [description] : [],
  })
  console.log(JSON.stringify({ slug: r.slug, tested: reason === null, reason }))
}
