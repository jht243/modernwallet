Return ONE JSON object, and nothing else, with EXACTLY these keys:

- `slug` (string) — the exact slug given in the row prompt.
- `metaTitle` (string, 50–60 chars) — includes the primary keyword. Title Case per the standard.
- `metaDescription` (string, ≤160 chars) — includes the primary keyword.
- `h1` (string) — Title Case, states the page's subject plainly, no headline tells.
- `subtitle` (string, one sentence) — a card-index blurb describing the guide. Never repeats the
  tee-up or the intro's first sentence.
- `introText` (string) — the opening body paragraph(s), joined by `\n\n` for a paragraph break.
  Sentence 1 is the direct answer to the page (VOICE). This is the ONLY field a later
  INTRO-HUMANIZE step would ever touch, so it must stand alone as a complete opening.
- `sections` (array of `{ "heading": string, "content": string }`) — noun-phrase Title Case
  headings, at most one opens with the primary keyword. `content` is one or more paragraphs
  joined by `\n\n`. Cover every topic the row prompt's coverage floor lists, in a sensible
  step order when the page is a how-to/checklist.
- `ctaTitle` (string) — a short line inviting the reader to a next action on this site.
- `ctaText` (string, ≤2 sentences) — names this page's actual subject; never generic.
- `ctaButton` (string, 2–4 words) — button label, e.g. "Try the Retirement Calculator".
- `faqItems` (array of `{ "question": string, "answer": string }`) — at least 4, each answering a
  real query variant from the row prompt's FAQ spec, direct-answer-first.

Do not include markdown code fences. Do not include any key not listed above. Every external
link in `introText`, `sections[].content`, or `faqItems[].answer` must be a markdown link
`[text](url)` whose `url` is on the CLOSED URL LIST in the row prompt — never invent a URL.
Every number, date, limit, or price you state must come from the row prompt's CLOSED FACT LIST.
