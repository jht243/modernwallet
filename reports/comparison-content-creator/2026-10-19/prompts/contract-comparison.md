return ONE JSON object with EXACTLY these keys

```
{
  "slug": string,                 // must equal the slug given in the row prompt, exactly
  "metaTitle": string,             // <= 60 chars, both entity names present, primary keyword present
  "metaDescription": string,       // <= 160 chars, primary keyword present
  "h1": string,                    // both entity names present
  "subtitle": string,              // one sentence describing the page (NOT a tee-up; see VOICE)
  "optionAName": string,           // display name of entity A, exactly as given in the row prompt
  "optionBName": string,           // display name of entity B, exactly as given in the row prompt
  "introText": string,             // the opening paragraph(s). Sentence 1 = the direct answer.
  "comparisonTable": { "rows": [ { "dimension": string, "a": string, "b": string }, ... ] }, // >= 4 rows
  "sections": [ { "heading": string, "content": string }, ... ],   // section bodies; \n\n between paragraphs
  "verdict": string,               // who should pick A, who should pick B, framed as a real recommendation
  "faqItems": [ { "question": string, "answer": string }, ... ],
  "relatedLinks": [ string, ... ]  // leave as [] — the calling agent fills this in from real routes
}
```

Rules for the shape:
- Noun-phrase headings in Title Case (see the content standard's SEO section for the exact casing rule).
- At most ONE heading (across h1 + all section headings) may open with the primary keyword. Do not
  start every heading with it.
- `comparisonTable.rows` needs at least 4 real, distinct dimensions with a genuine value on both sides —
  never a row where both columns say the same generic thing.
- The verdict commits to an actual recommendation and states who should NOT take it (the content
  standard's "who this is not for" and "what would change our answer" requirements — weave both into
  the verdict or the closing section, not as their own labeled subsections).
- Internal links: use ONLY the internal routes the row prompt hands you, as markdown links
  `[anchor text](/path/)`, placed naturally in section prose. Do not invent a route.
- External links: use ONLY the URLs on the row prompt's closed URL list, as markdown links on the
  first mention of that organization. Never link an entity not on the list; never invent a URL.
- The brand: "At ModernWallet, we..." exactly once, at the first first-person COMPANY claim on the
  page (what ModernWallet does/publishes/reviews) — never in metaTitle/metaDescription. Every other
  first-person plural stays bare ("we compared", "we found").
- CTA fields (ctaTitle/ctaText/ctaButton) are NOT part of this site's schema — omit them entirely.
- Do not emit a `sources` field; the calling agent adds `sources` separately from the closed URL list.

---