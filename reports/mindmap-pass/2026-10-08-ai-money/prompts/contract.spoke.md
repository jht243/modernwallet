# OUTPUT CONTRACT — calculator spoke page (TypeScript data store `src/data/spokes-gig-online.ts`, route /self-employment-tax/<slug>/)

The page renders the site's existing self-employment-tax calculator under your copy. Return ONE JSON object and nothing else, exactly these keys:

- `slug` — exactly the slug given
- `title` — ≤ 60 characters, includes the primary keyword
- `metaDescription` — ≤ 160 characters
- `targetKeyword` — exactly the primary keyword given
- `h1` — string
- `introText` — 2 short paragraphs (`\n\n`); paragraph 1 answers the reader question directly; paragraph 2 gives the worked headline figure EXACTLY as supplied in the row prompt.
- `howItWorks` — the methodology in plain language, 5–8 paragraphs (`\n\n`), covering every point in the row prompt's coverage list. Markdown links allowed (closed URL list, first mention only; internal links from the allowed list).
- `commonMistakes` — array of 3 strings specific to this platform (the site prepends its universal mistakes automatically — do NOT repeat: "no 1099 means no tax", "paying nothing until April", "not tracking expenses").
- `workedExample` — one paragraph using ONLY the worked-example numbers supplied in the row prompt.
- `faqs` — array of 5 `{ "question": string, "answer": string }`
- `toolHeading` — short string, e.g. "<Platform> tax calculator"
- `toolSubheading` — short string
- `incomeLabel` — label for the profit input
- `platformNote` — one or two sentences shown beside the calculator

## Shape rules
- No first-person beyond the single "At ModernWallet, we…" sentence (optional on spokes).
- Every number must be on the fact list or supplied in the row prompt; never compute a new tax figure yourself.
- No em dashes.
