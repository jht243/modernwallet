# OUTPUT CONTRACT — roundup page (TypeScript data store `src/data/roundups.ts`, route /roundup/<slug>/)

Return ONE JSON object and nothing else. Exactly these keys, in this order:

- `updated` — string, always `"2026-10-09"`
- `slug` — exactly the slug given in the row prompt
- `title` — ≤ 60 characters, includes the primary keyword
- `metaDescription` — ≤ 160 characters
- `targetKeyword` — exactly the primary keyword given in the row prompt
- `category` — short lowercase category noun phrase given in the row prompt
- `angle` — string given in the row prompt
- `h1` — string
- `introText` — string; first sentence answers the reader question on its own. `\n\n` between paragraphs.
- `rankingCriteria` — string; how options were compared (criteria only from the fact list)
- `options` — array of `{ "name", "bestFor", "description", "strengths": [string], "limitations": [string], "pricing" }`. `pricing` for a work platform = the published pay basis from the fact list, or "Pay not published — check listings" when the fact list has none.
- `comparisonTable` — `{ "headers": [string], "rows": [ { "name": string, "href": string, "values": [string] } ] }`. `href` = the option's official site from the closed URL list. `values` has exactly `headers.length - 1` items (first header is the option name column).
- `verdict` — string; who should pick which, and the condition that decides it
- `sections` — array of `{ "heading": string, "content": string }`
- `faqs` — array of `{ "question": string, "answer": string }`
- `sources` — array of `{ "label": string, "url": string }` from the closed URL list
- `relatedComparisons` — array of slugs from the row prompt only
- `calculatorLinks` — array of `{ "label": string, "href": string }`, internal routes from the row prompt only

## Shape rules
- Same heading, markdown, linking, brand-voice and no-em-dash rules as the guide contract.
- NEUTRALITY: the site is never an option; no option is the automatic winner; every option carries at least one real limitation.
- Never state a pay rate, fee, country list or payout speed that is not on the fact list.
