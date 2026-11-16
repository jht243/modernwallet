# Output contract (guide page, JSON)

Return ONE JSON object and nothing else (no code fence, no commentary), with exactly these keys:

- `slug` (string): the exact slug given in the row prompt.
- `title` (string): the SEO title, 50 to 60 characters, carrying the primary keyword. Use the working title in the row prompt unless it breaks a rule.
- `metaDescription` (string): 120 to 160 characters, states the answer and its main condition. Never opens "We tested". No testing claim.
- `h1` (string): Title Case, one clause that states the finding.
- `cardBlurb` (string): one sentence for the guide index card.
- `introText` (string): the opening paragraphs, joined with a blank line (\n\n). Sentence 1 is the direct answer. The brand first-"we" rule applies: the first company claim reads "At ModernWallet, we ...". The brand name is ModernWallet.
- `sections` (array of `{ "heading": string, "body": string }`): one object per section in the approved outline, in that order, with the approved headings (Title Case). `body` is markdown prose: paragraphs separated by \n\n, lists as markdown lists, tables as GFM pipe tables written inside `body` (header row, separator row, data rows each on its own line). The first sentence of each section is a complete declarative answer. Use markdown links `[label](url)` only. Never raw HTML. No em-dashes.
- `tools` (array of `{ "href": string, "label": string }`): the calculators this page points to, taken from the row prompt's approved internal links (real routes with trailing slash, e.g. `/retirement/401k-calculator/`).
- `faqs` (array of `{ "question": string, "answer": string }`): 4 to 6 items. Questions in sentence case. Each answer leads with the direct answer, then the condition.
- `sources` (array of `{ "label": string, "url": string }`): primary sources only, taken from the CLOSED URL LIST.

Rules that apply to every string:
- Internal links use real routes only, with a trailing slash (for example `/guides/401k-contribution-limits-2026/`), taken from the approved internal links in the row prompt. Anchor text is descriptive.
- The first mention of every external organization or source is a markdown link to its official page from the CLOSED URL LIST.
- No `Conclusion`, `Summary` or `Final Thoughts` heading. No testing claims, no "we tested", no "How We Tested" section. No claim of neutrality, independence or no paid placement.
- Disclaimers go in no body field; the template renders the disclaimer at the bottom.
- The last body sentence of the last section before the FAQ is a concrete next action that carries the primary keyword.
