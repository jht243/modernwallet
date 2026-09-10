# OUTPUT CONTRACT — roundup page (TypeScript data store `src/data/roundups.ts`)

Return ONE JSON object and nothing else. Exactly these keys, in this order:

- `updated` — string, always `"2026-09-09"`
- `slug` — string, exactly the slug given in the row prompt
- `title` — string, ≤ 60 characters
- `metaDescription` — string, ≤ 160 characters
- `targetKeyword` — string, exactly the primary keyword given in the row prompt
- `category` — string
- `angle` — string, the one-line editorial angle
- `h1` — string
- `introText` — string. AEO: the first sentence must name the top pick and the condition it wins
  under, completely on its own.
- `rankingCriteria` — string. The stated, checkable basis for the ranking.
- `options` — array of `{ "name": string, "description": string, "bestFor": string, "strengths": string[], "limitations": string[], "pricing": string }`
- `comparisonTable` — `{ "headers": string[], "rows": [ { "name": string, "values": string[] } ] }`
  — every row's `values` array must have exactly `headers.length - 1` entries (the name is the first column)
- `verdict` — string
- `sections` — array of `{ "heading": string, "content": string }`
- `faqs` — array of `{ "question": string, "answer": string }`
- `sources` — array of `{ "label": string, "url": string }`
- `relatedComparisons` — array of slugs, from the row prompt only
- `calculatorLinks` — array of `{ "label": string, "href": string }`, internal routes from the row prompt only

## Shape rules
- Same heading, markdown, table, linking, brand-voice and no-em-dash rules as the guide contract.
- NEUTRALITY IS ABSOLUTE. ModernWallet's own tool is one option among the others, judged on the
  same criteria, and it MUST carry real `limitations` drawn from the fact list. It is not the
  top pick unless the stated ranking criteria genuinely put it there. Every option needs at
  least one real strength and at least one real limitation.
- `pricing` is copied from the CLOSED FACT LIST verbatim, or reads exactly
  `"Free; no pricing published"` / `"Pricing not published, verify on the vendor site"`.
  NEVER invent, estimate, or round a price.
