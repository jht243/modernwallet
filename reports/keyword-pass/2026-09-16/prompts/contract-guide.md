Return ONE JSON object with EXACTLY these keys (no extras, no markdown fences):

- `slug` — string, must equal the slug given in the prompt, exactly.
- `title` — string, 50-60 characters, includes the primary keyword, no site name suffix.
- `metaDescription` — string, <=160 characters, includes the primary keyword.
- `h1` — string, Title Case, noun-phrase, includes the primary keyword.
- `cardBlurb` — string, 1-2 sentences, used as the card teaser on the /guides/ index. Not
  identical to metaDescription — different wording, same core claim.
- `introText` — string. This is the page's lead prose, rendered as the hero paragraphs above the
  first heading. Use `\n\n` to separate paragraphs (2-3 paragraphs). Sentence 1 of the first
  paragraph is the direct answer to the page's question. Register is operator — a tee-up
  sentence (our relationship to the topic) may follow as sentence 2 of the first paragraph,
  drawing ONLY on the DOMAIN section of _experience.md; if it would read as bolted-on for this
  topic, skip it and note `teeup-exempt:` in your own working notes (not in the output).
- `sections` — array of objects, each `{ "heading": string, "body": string }`. 5-8 sections.
  `heading` is Title Case, a noun phrase, no "X, and Y" formula, at most one heading opens with
  the primary keyword. `body` is 2-5 paragraphs of prose separated by `\n\n` (NOT an array) —
  markdown links `[text](url)` are allowed and expected for the first mention of any named
  company/source and for internal links given in the prompt. The FIRST sentence of each
  section's body must be a complete, self-contained declarative claim (AEO — no "In this
  section" framing).
- `faqItems` — array of objects, each `{ "question": string, "answer": string }`. Use the exact
  FAQ questions given in the prompt, in the given order. `answer` is plain prose (a string, not
  an array), 2-4 sentences, leads with the direct answer.
- `sources` — array of objects, each `{ "label": string, "url": string }`, restricted to the
  CLOSED URL LIST in the prompt. Use the exact label/url pairs given; do not invent new ones and
  do not omit any given source.

Do NOT include `ctaTitle`, `ctaText`, `ctaButton`, `subtitle`, `optionAName`, `optionBName`,
`comparisonTable`, `verdict`, or `relatedLinks` — this page type does not use them.

Style notes specific to this repo (ModernWallet, themodernwallet.com):
- Brand: "ModernWallet". First-"we" rule: "At ModernWallet, we..." exactly once on the page, in
  the tee-up sentence if used, never in metaTitle/metaDescription.
- Close the LAST section's body on a concrete next action the reader can take (may carry the
  primary keyword). No "Conclusion" or "Summary" heading.
- If the topic requires a light, honest caveat that this is general information and not
  individualized tax/legal/financial advice, fold ONE sentence of that into the closing section's
  body prose (not a separate heading, not the intro) — never invent a formal disclaimer block.
