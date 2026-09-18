Return ONE JSON object, and nothing else, with exactly these keys:

- `slug` (string, exactly as given in the row prompt)
- `metaTitle` (string, <= 60 characters, includes the primary keyword once)
- `metaDescription` (string, 140-160 characters, states the direct answer)
- `h1` (string, a question or direct statement — the on-page H1)
- `subtitle` (string, one sentence, a card-index blurb summarizing the verdict)
- `introText` (string, 2-3 short paragraphs separated by `\n\n`. Paragraph 1 gives the direct
  verdict/answer in the first sentence. State "At ModernWallet, we…" once, in this intro, to
  establish first-person editorial voice for the page — do not repeat "At ModernWallet" anywhere
  else on the page.)
- `sections` (array of 4-6 objects, each `{ "heading": string, "body": string }`. Headings are
  noun phrases or direct questions, never generic labels. At most ONE heading across the whole
  page may open with the primary keyword. Body is 2-3 paragraphs of plain prose, no bullet lists
  inside a section body unless the row prompt explicitly asks for one.)
- `ctaTitle` (string, short — a natural next-step prompt)
- `ctaText` (string, one sentence)
- `ctaButton` (string, 2-4 words, button label)
- `faqItems` (array of objects `{ "question": string, "answer": string }`, one entry per question
  listed in the row prompt, answered directly in 2-4 sentences each, no headings, no bullet lists)

Rules:
- Noun-phrase or direct-question headings only — never a generic label like "Overview" or
  "Conclusion".
- At most one heading (counting the H1) may open with the exact primary keyword phrase.
- Every dollar figure, percentage, date, or named claim must trace to the CLOSED FACT LIST in the
  row prompt. If a detail is not on that list, say it is unpublished/unconfirmed and tell the
  reader to verify it at the vendor's own page — do not invent it.
- Every external link must be one of the CLOSED URL LIST entries in the row prompt, in Markdown
  link form `[text](url)`. Internal links use only the routes listed in the row prompt's internal
  links section.
- First-person plural ("we") claims may draw ONLY on `_experience.md` (below) — never invent a
  proprietary test, review process, or methodology beyond what that file states.
- No CTA button text should imply a purchase, signup, or account action on a third-party site —
  keep it pointed at the site's own related tool/guide.
