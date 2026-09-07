Return ONE JSON object, and nothing else, with EXACTLY these keys:

- `metaTitle` (string, 50–60 chars) — includes the primary keyword, ends "Calculator" or names
  the tool plainly. Title Case.
- `metaDescription` (string, ≤160 chars) — includes the primary keyword.
- `h1` (string) — the tool's plain name, Title Case.
- `introText` (string) — one or two short paragraphs joined by `\n\n`. Sentence 1 states what the
  tool does and, where the row prompt gives one, a worked numeric example using the tool's
  default inputs. This text renders ABOVE the live calculator widget.
- `howItWorks` (string) — one to three paragraphs joined by `\n\n` explaining the formula in
  plain language, naming every constant/assumption the calculator uses. This is what makes the
  tool "improved" over a competitor's black-box version — show the math.
- `faqs` (array of `{ "question": string, "answer": string }`) — at least 4, each answering a
  real query variant from the row prompt's FAQ spec, direct-answer-first.
- `sources` (array of `{ "label": string, "url": string }`) — 1 to 3 primary sources, only from
  the row prompt's CLOSED URL LIST.

Do not include markdown code fences. Do not include any key not listed above. Every external
link in `introText`, `howItWorks`, or `faqs[].answer` must be a markdown link `[text](url)` whose
`url` is on the CLOSED URL LIST in the row prompt — never invent a URL. Every number, date,
limit, or formula constant you state must come from the row prompt's CLOSED FACT LIST (which
includes the calculator's own stated formula and assumptions) — never invent a statistic.
