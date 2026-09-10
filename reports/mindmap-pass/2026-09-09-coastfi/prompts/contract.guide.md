# OUTPUT CONTRACT — guide page (TypeScript data store `src/data/guides.ts`)

Return ONE JSON object and nothing else. Exactly these keys, in this order:

- `updated` — string, ISO date, always `"2026-09-09"`
- `slug` — string, exactly the slug given in the row prompt
- `title` — string, ≤ 60 characters
- `metaDescription` — string, ≤ 160 characters
- `h1` — string
- `cardBlurb` — string, one sentence for the guide-index card
- `introText` — string. The AEO answer block: the FIRST sentence must answer the page's primary
  question completely on its own, so it can be lifted into an AI Overview or featured snippet
  without the rest of the page.
- `sections` — array of `{ "heading": string, "body": string }`
- `tools` — array of `{ "href": string, "label": string }` — internal calculator routes only,
  drawn from the internal-link list in the row prompt
- `faqs` — array of `{ "question": string, "answer": string }`
- `sources` — array of `{ "label": string, "url": string }` — external primary sources only,
  every url drawn from the CLOSED URL LIST

## Shape rules
- Headings are NOUN PHRASES ("How the coast number moves with age"), never questions and never
  imperative sentences. AT MOST ONE heading may open with the page's primary keyword.
- `body` and `answer` are plain strings. Paragraph breaks are `\n\n`. Markdown is allowed inside
  them and IS rendered: `**bold**`, `[anchor text](/route/)` inline links, and GitHub-style
  pipe tables. Do NOT use markdown headings (`#`) inside a body — the `heading` field is the
  heading.
- A pipe table inside a `body` must be preceded by a blank line, use a `|---|---|` separator row,
  and every row must have the same number of cells.
- Internal links are written INTO the prose as natural sentences, never as a list of links at the
  end. Use the real routes from the row prompt only; never invent a route.
- Every external link must be a primary source (a government agency, a regulator, a named
  vendor's own page) and must appear in the CLOSED URL LIST. No external link may be a
  competitor's affiliate link.
- The brand's first person plural is introduced once, as "At ModernWallet, we…", and only where
  `_experience.md` licenses it.
- No em dashes. Use commas, or the word "to" for a range.
