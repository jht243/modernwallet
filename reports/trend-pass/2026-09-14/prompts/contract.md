# Output contract — Guide page (JSON, TS data store)

Return ONE JSON object with EXACTLY these keys (no extras, no comments, no trailing commas):

```
{
  "slug": string,
  "title": string,
  "metaDescription": string,
  "h1": string,
  "cardBlurb": string,
  "introText": string,
  "sections": [ { "heading": string, "body": string }, ... ],
  "tools": [ { "href": string, "label": string }, ... ],
  "faqs": [ { "question": string, "answer": string }, ... ],
  "sources": [ { "label": string, "url": string } ... ]
}
```

- `slug` must be exactly the slug given in the prompt.
- `title` is the SEO title, 50-60 characters, includes the primary keyword.
- `metaDescription` is 140-160 characters, includes the primary keyword, states the direct answer.
- `h1` is a Title-Case clause that states the finding (no "X and what Y" construction).
- `cardBlurb` is one Title-Case-free sentence (normal sentence casing) summarizing the finding for an index card, under 200 characters.
- `introText` is the lead prose (this is the page's `introText` field): 2-4 short paragraphs separated by `\n\n`. Sentence 1 of the first paragraph is the direct answer to the page's question. This page is REPORTER register (see system prompt) — no "we", no first-person experience claim, no tee-up. Markdown links `[text](url)` are allowed and expected on first mention of a cited source, per the CLOSED URL LIST.
- `sections` is an array of 5-6 objects. Each `heading` is Title Case, a noun-phrase or direct question, no more than one heading opens with the primary keyword. Each `body` is 2-4 paragraphs of plain prose (markdown links allowed), self-contained (AEO: the first sentence of each section is a complete declarative answer to the heading).
- `tools` links to this site's real internal calculator/tool routes given in the prompt's ALLOWED INTERNAL LINKS list — 1 to 3 entries, `label` is a short human label.
- `faqs` is an array of 4-6 objects answering the FAQ questions given in the prompt verbatim (or the closest natural phrasing), each `answer` leads with the direct answer, 2-4 sentences.
- `sources` lists every source cited in the page, `label` is a short human-readable name, `url` must be exactly one of the CLOSED URL LIST entries.

No `updated` field (the routine sets it when templating). No `tools` entry may invent a route not given. No external link outside the CLOSED URL LIST. No fabricated numbers, dates, or figures outside the CLOSED FACT LIST.
