# OUTPUT CONTRACT — comparison page (TypeScript data store `src/data/comparisons.ts`)

Return ONE JSON object and nothing else. Exactly these keys, in this order:

- `updated` — string, always `"2026-09-09"`
- `slug` — string, exactly the slug given in the row prompt
- `title` — string, ≤ 60 characters, BOTH entities named
- `metaDescription` — string, ≤ 160 characters
- `targetKeyword` — string, exactly the primary keyword given in the row prompt
- `optionA` — string, display name of entity A
- `optionB` — string, display name of entity B
- `h1` — string
- `introText` — string. AEO: the first sentence must state the actual difference between A and B
  completely on its own.
- `comparisonTable` — `{ "rows": [ { "dimension": string, "a": string, "b": string } ] }`
- `verdict` — string. Who should pick A, who should pick B, and the condition that decides it.
- `sections` — array of `{ "heading": string, "content": string }`
- `faqs` — array of `{ "question": string, "answer": string }`
- `sources` — array of `{ "label": string, "url": string }`
- `relatedComparisons` — array of slugs, from the row prompt only
- `calculatorLinks` — array of `{ "label": string, "href": string }`, internal routes from the row prompt only

## Shape rules
- Same heading, markdown, table, linking, brand-voice and no-em-dash rules as the guide contract.
- OBJECTIVITY: neither option is the automatic winner. Every `dimension` row must state a real
  trade-off, and at least one row must favour each option. The verdict names the condition that
  decides it, not a blanket recommendation.
- `a` and `b` cells are short phrases, not sentences with periods.
