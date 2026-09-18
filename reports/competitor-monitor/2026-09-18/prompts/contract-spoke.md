# Output contract — spoke/tool page (ModernWallet, src/data/spokes-investing.ts)

Return ONE JSON object with exactly these keys:

- `slug` — the exact slug given in the row prompt, unchanged.
- `metaTitle` — 50 to 60 characters, includes the primary keyword. Becomes the page's `title`.
- `metaDescription` — 140 to 160 characters, includes the primary keyword.
- `h1` — the on-page H1. Title Case. At most one heading on the whole page may open with the
  exact primary keyword.
- `introText` — 3 to 5 sentences, the page's lead prose before the tool. Sentence 1 is the direct
  answer to what the tool does (VOICE / operator register). Paragraphs separated by a literal
  `\n\n`. Weave a markdown link `[label](/route/)` to one real internal route from the CLOSED
  LINKS list where natural.
- `howItWorks` — 2 to 4 paragraphs (separated by `\n\n`) explaining the exact formula/mechanism in
  plain language — this is the page's main body content and where most of the depth floor lives.
- `commonMistakes` — an array of 4 to 6 strings, each one distinct, concrete mistake a reader makes
  around this exact calculation (not generic investing advice).
- `workedExample` — 2 to 3 paragraphs (separated by `\n\n`) walking through one full concrete
  numeric example of the calculation end to end, using round illustrative numbers (label them as
  an example, e.g. "Consider an investor who...").
- `faqItems` — an array of `{ "question": "...", "answer": "..." }`, 4 to 6 items, each answering a
  real distinct query variant a searcher on this topic would ask, direct answer first.
- `toolHeading` — a short (4-8 word) heading for the tool widget itself.
- `toolSubheading` — one sentence describing what to enter.

Rules:
- Every dollar figure, percentage, date, or named claim in `howItWorks`, `commonMistakes`, and the
  FAQ must trace to the CLOSED FACT LIST in the row prompt, EXCEPT for illustrative numbers
  explicitly inside `workedExample`, which may use clearly-labeled hypothetical round numbers.
- Every external link must be one of the CLOSED URL LIST entries, in Markdown link form.
- Internal links use only the routes listed in the row prompt.
- "At ModernWallet, we..." exactly once, at the first first-person COMPANY claim, in `introText`.
- Name the business at that first "we" only — never repeat "At ModernWallet" elsewhere on the page.
- No CTA fields — this site's spoke schema has none; do not emit `ctaTitle`/`ctaText`/`ctaButton`.
