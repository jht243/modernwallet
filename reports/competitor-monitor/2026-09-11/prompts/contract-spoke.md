# Output contract — Calculator spoke page (ModernWallet, spokes-investing.ts SpokeEntry)

Return ONE JSON object with EXACTLY these keys — no extra keys, no markdown fences:

```
{
  "title": string,            // <=60 chars, includes the primary keyword, ends naming the tool plainly
  "metaDescription": string,  // <=160 chars, includes the primary keyword
  "h1": string,                // Title Case, the tool's plain name
  "introText": string,        // 1-2 short paragraphs, \n\n between. Sentence 1 states what the tool does.
                                // Renders ABOVE the live calculator widget.
  "howItWorks": string,       // 1-3 paragraphs, \n\n between. Explains the formula in plain language,
                                // naming every constant/assumption. This is what makes the tool
                                // "improved" over a competitor's black-box version — show the math.
  "commonMistakes": [string], // 4-6 short items, each a mistake + why it matters
  "workedExample": string,    // ONE paragraph, a concrete numeric example using the tool's default inputs
  "faqs": [ { "question": string, "answer": string } ],  // at least 6
  "sources": [ { "label": string, "url": string } ]       // 1-3 primary sources, from the closed URL list
}
```

Formatting rules:
- Noun-phrase headings are not needed here (no `sections` field on this schema — this is a single
  intro + howItWorks + FAQ shape, not a multi-section guide).
- Markdown links `[text](url)` for every external company/source/regulator named — first mention
  only, official/primary source only, from the closed URL list.
- The brand first-"we" rule: the first time the page speaks as the business making a claim about
  itself, write "At ModernWallet, we…". Once per page only. This page type is short, so it is fine
  to skip the tee-up entirely if it would read as bolted-on (note `teeup-exempt:` if so) — the
  page's job is showing the calculator, not a first-person story.
- No `inlineCta`, `draft`, `cardBlurb`, `tools`, or `sections` field — this project's SpokeEntry
  schema for a tool page does not carry them.
- `commonMistakes` items are short (one to two sentences), NOT full paragraphs — they render as a
  bulleted list on the page.
