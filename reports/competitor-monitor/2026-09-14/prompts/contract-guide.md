# Output contract — guide page (ModernWallet)

Return ONE JSON object with exactly these keys:

- `slug` — the exact slug given in the row prompt, unchanged.
- `metaTitle` — 50 to 60 characters, includes the primary keyword, compelling. This becomes the
  page's `title` field in ModernWallet's store.
- `metaDescription` — 140 to 160 characters, includes the primary keyword.
- `h1` — the on-page H1. Title Case. At most one heading on the whole page may open with the
  exact primary keyword.
- `subtitle` — one sentence, at most 220 characters: a short label + blurb for the guide index
  card. This becomes `cardBlurb`.
- `introText` — 3 to 5 sentences, the page's lead prose before any heading. Sentence 1 is the
  direct answer to the page's question (VOICE / operator register). This is the field the
  orchestrator will run through INTRO HUMANIZE afterward — write it in full voice, do not hedge it.
- `sections` — an array of `{ "heading": "...", "body": "..." }` objects. Each `heading` is a
  Title Case noun phrase (no "X, and Y" formula). Each `body` is 1 to 3 paragraphs of plain prose,
  paragraphs separated by a literal `\n\n` inside the string (matching this site's existing
  guides). Weave a markdown link `[label](/route/)` to a real internal route from the CLOSED
  LINKS list into the body text wherever it is the natural next step for the reader — this is how
  ModernWallet's guides connect a step to a free calculator or a sibling guide. At least 4 to 6
  sections for a guide at the 1,200-word depth floor.
- `ctaTitle`, `ctaText`, `ctaButton` — ModernWallet's Guide page type carries no per-page CTA
  block. Fill these with short placeholder strings (they are discarded when templated); do not
  spend effort on them.
- `faqItems` — an array of `{ "question": "...", "answer": "..." }`, 4 to 7 items, each answering
  a real distinct query variant a searcher on this topic would ask (verbatim PAA style where
  given in the row prompt). Each answer leads with the direct answer, then nuance.

## Voice sample

The attached JSON (labelled "imitate this") is a real, currently-published ModernWallet guide
of the exact same page type. Match its voice, sentence rhythm, link style, and how it cites a
primary source inline (e.g. "IRS Publication 590-B states that…", "The CFPB notes that…"). Do
not reuse its numbers, examples, or sentences — this is a voice sample only, never a content
source, and its topic (Roth conversion ladders) is unrelated to the page you are writing.

## The first "we"

The first time the page speaks as the business (what ModernWallet does, builds, or provides),
write "At ModernWallet, we…". Never invent a claim `_experience.md` does not license.

## Sources

Do not include a `sources` field — the orchestrator adds ModernWallet's own curated
`{ label, url }` source list from the row's CLOSED URL LIST after generation. Cite those same
primary sources BY NAME inline in the body prose (e.g. "the IRS", "the CFPB", "the SSA") so the
page reads as sourced; do not invent a citation not on the row's closed URL list.
