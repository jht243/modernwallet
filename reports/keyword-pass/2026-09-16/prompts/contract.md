# Output contract — guide-type page (this repo's `Guide` shape, `src/data/guides.ts`)

Return ONE JSON object with EXACTLY these keys and nothing else:

```
{
  "slug": "<the exact slug given in the prompt, unchanged>",
  "title": "<SEO title, 50-60 chars, includes the primary keyword>",
  "metaDescription": "<150-160 chars, includes the primary keyword, plain text no markdown links>",
  "h1": "<Title Case, noun-phrase, includes the primary keyword, no colon-drama, no two-clause formula>",
  "cardBlurb": "<1 sentence, plain text, no markdown links, for an index-page card>",
  "introText": "<2-3 paragraphs separated by \\n\\n. First sentence = the direct answer to the page's question, short and easy. Then a one-sentence operator tee-up (our relationship to this domain, drawn only from _experience.md) if it belongs. Markdown [text](url) links allowed, using ONLY urls from the closed URL list or the internal routes given.>",
  "sections": [
    { "heading": "<Title Case noun-phrase H2, at most one section heading opens with the primary keyword>", "body": "<2-4 paragraphs separated by \\n\\n. Markdown [text](url) links allowed from the closed URL list / internal routes only. AEO: first sentence of the section is a self-contained declarative answer.>" }
  ],
  "faqs": [
    { "question": "<verbatim from the FAQ spec in the prompt, or a natural long-tail question covering the keyword variants>", "answer": "<2-4 sentences, direct answer first, markdown links allowed from the closed list>" }
  ]
}
```

Rules specific to this contract:
- `sections`: 5 to 8 entries. Each `body` is 2 to 4 paragraphs of prose (no bullet lists unless the prompt's coverage plan calls for 3+ parallel items — then use a markdown `- ` list inside the string).
- `faqs`: exactly the count given in the prompt's FAQ spec, each answer self-contained (an extractor will quote it alone).
- Do NOT include `tools`, `sources`, `updated`, `targetKeyword`, `ctaTitle`, `ctaText`, `ctaButton`, or `relatedLinks` — this repo's template supplies those separately; adding them is a contract violation.
- Every external link must come from the CLOSED URL LIST in the prompt. Every internal link must be one of the routes listed as "internal links it may use." Never invent a URL.
- Brand voice: "At ModernWallet, we..." exactly once, at the first first-person company claim (see VOICE in the content standard). Never in `metaDescription`.
- No Conclusion/Summary heading. The last section's last sentence is the concrete next action.
