# Output contract — guide page (src/data/guides.ts)

Return ONE JSON object with exactly these keys, matching the `Guide` interface in
`src/data/guides.ts`:

```
{
  "updated": "2026-09-24",
  "slug": "are-annuities-taxable",
  "title": "...",
  "metaDescription": "...",
  "h1": "...",
  "cardBlurb": "...",
  "introText": "...",
  "sections": [ { "heading": "...", "body": "..." }, ... ],
  "tools": [ { "href": "...", "label": "..." }, ... ],
  "faqs": [ { "question": "...", "answer": "..." }, ... ],
  "sources": [ { "label": "...", "url": "..." }, ... ]
}
```

Rules:
- `metaDescription` ≤ 160 characters, contains the primary keyword.
- `title` ≤ 60 characters.
- Noun-phrase section headings (no gerund/verb-first headings). At most ONE heading may open
  with the exact primary keyword phrase — vary the rest.
- `introText` and the first sentence of the first section body must each be a complete,
  self-contained declarative answer (an AI assistant could quote either alone as the answer).
- CTA / internal-link sentences use markdown `[anchor text](/path/)` — this repo's `linkify()`
  renders it. Anchor text should read naturally as the target page's topic.
- The brand first-"we" rule: any first-person claim uses "At The Modern Wallet, we…" and must be
  the kind of general editorial-process claim `_experience.md` allows — never a fabricated
  personal anecdote.
- `tools` links to real existing routes only (see the internal-link list in the row prompt).
- FAQ answers lead with the direct answer in the first sentence, then nuance.
- Every number, date, or rule cited must come from the CLOSED FACT LIST in the row prompt.
  Anything not on that list is unknown — say so, or omit it. Never invent a dollar figure,
  percentage, or IRS form number not on the list.
