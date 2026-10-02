# Output contract — ModernWallet GUIDE page

Return ONE JSON object, nothing else (no markdown fence, no commentary), with EXACTLY these keys
and no others — this project's real `Guide` TypeScript interface (src/data/guides.ts):

```
{
  "slug": "<the exact slug given in the row prompt>",
  "title": "<50-60 char SEO title, includes the primary keyword>",
  "metaDescription": "<<=160 char meta description, includes the primary keyword>",
  "h1": "<Title Case H1, one clause, states the finding>",
  "cardBlurb": "<1-2 sentence summary for the guide index card, distinct wording from metaDescription>",
  "introText": "<the FULL intro as ONE string, paragraphs separated by \n\n — sentence 1 is the direct answer to the page, no tee-up as sentence 1>",
  "sections": [
    { "heading": "<Title Case noun-phrase H2, no colon-drama, no two-clause formula>", "body": "<the section's full prose as ONE string, paragraphs separated by \n\n>" }
  ],
  "tools": [ { "href": "<real internal calculator route from the row prompt's internal-links list>", "label": "<short label>" } ],
  "faqs": [ { "question": "<verbatim/near-verbatim from the row prompt's FAQ list>", "answer": "<direct answer first, then nuance>" } ],
  "sources": [ { "label": "<publisher — page title>", "url": "<only a URL from the row prompt's CLOSED URL LIST>" } ]
}
```

Rules specific to this shape:
- There is NO `inlineCta` field in this project's schema. Do not emit one.
- There is NO `subtitle`, `ctaTitle`, `ctaText`, `ctaButton`, `metaTitle`, or `faqItems` field.
  Use `title` (not `metaTitle`) and `faqs` (not `faqItems`) exactly as shown above.
- At most one H2/H3 heading opens with the primary keyword.
- The brand first-"we" rule: the FIRST time the page makes a first-person company claim, write
  "At ModernWallet, we…" — once only, never in `title` or `metaDescription`.
- `sections` must cover every item the row prompt's "section-by-section coverage" list and
  "COVERAGE FLOOR" block require — do not omit or merge any of them away.
- `tools` links only to real routes given in the row prompt. 3-4 entries is typical.
- Every number, date, limit, or rate must come from the row prompt's CLOSED FACT LIST. Anything
  not on that list, you do not know — never invent a figure.
- Every external link (in `introText`, `sections[].body`, or `sources`) must be a URL from the
  row prompt's CLOSED URL LIST, used as a markdown link `[label](url)` on first mention in body
  prose (sources array entries are plain `url` strings, not markdown).
