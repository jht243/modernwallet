# Output contract — ModernWallet COMPARISON page

Return ONE JSON object, nothing else (no markdown fence, no commentary), with EXACTLY these keys
and no others — this project's real `ComparisonEntry` TypeScript interface (src/data/comparisons.ts):

```
{
  "slug": "<the exact slug given in the row prompt>",
  "title": "<<=60 char title, BOTH entity names present>",
  "metaDescription": "<<=160 char meta description>",
  "targetKeyword": "<the primary keyword phrase, lowercase, e.g. \"simple ira vs sep ira\">",
  "optionA": "<display name of entity A>",
  "optionB": "<display name of entity B>",
  "segment": "<short audience/category label, e.g. \"Self-employed retirement\">",
  "h1": "<Title Case H1, one clause, states the finding, both entities or the decision named>",
  "introText": "<the FULL intro as ONE string, paragraphs separated by \n\n — sentence 1 is a self-contained, direct answer/verdict-in-brief>",
  "comparisonTable": { "rows": [ { "dimension": "<real buyer-relevant dimension>", "a": "<value for optionA>", "b": "<value for optionB>" } ] },
  "verdict": "<one string: who should pick A, who should pick B, who this recommendation is NOT for, and what would change the answer>",
  "sections": [ { "heading": "<Title Case noun-phrase H2>", "content": "<the section's full prose as ONE string, paragraphs separated by \n\n>" } ],
  "faqs": [ { "question": "<verbatim/near-verbatim from the row prompt's FAQ list>", "answer": "<direct answer first>" } ],
  "sources": [ { "label": "<publisher — page title>", "url": "<only a URL from the row prompt's CLOSED URL LIST>" } ],
  "relatedComparisons": ["<real existing comparison slugs from the row prompt's internal-links list>"],
  "calculatorLinks": [ { "label": "<short label>", "href": "<real internal calculator route>" } ]
}
```

Rules specific to this shape:
- There is NO `inlineCta` field in this project's schema. Do not emit one.
- There is NO `subtitle`, `ctaTitle`, `ctaText`, `ctaButton`, `metaTitle`, `faqItems`, or
  `relatedLinks` field. Use `title`/`faqs`/`relatedComparisons` exactly as shown above. Section
  prose lives in `sections[].content`, NOT `sections[].body`.
- The comparison table needs >= 5 real dimension rows, each with a real value for both sides —
  never "Confirm on site" / "check provider" in a cell; state the real figure or "Not published".
- The `verdict` string must name who should pick A, who should pick B, at least one audience the
  recommendation is NOT for, and the condition that would change the verdict.
- At most one H2/H3 heading opens with the primary keyword.
- The brand first-"we" rule: the FIRST time the page makes a first-person company claim, write
  "At ModernWallet, we…" — once only, never in `title` or `metaDescription`.
- `sections` must cover every item the row prompt's "section-by-section coverage" list and
  "COVERAGE FLOOR" block require.
- Every number, date, limit, or rate must come from the row prompt's CLOSED FACT LIST.
- Every external link must be a URL from the row prompt's CLOSED URL LIST, as a markdown link
  `[label](url)` on first mention in body prose.
