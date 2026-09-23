# Output contract — ModernWallet `Guide` page object

Return ONE JSON object with EXACTLY these keys, nothing more, nothing less:

```
{
  "slug": string (kebab-case, matches the row's slug exactly),
  "title": string (SEO title, 50-60 characters, includes the primary keyword),
  "metaDescription": string (150-160 characters, includes the primary keyword),
  "h1": string (Title Case, includes the primary keyword, distinct from title),
  "cardBlurb": string (1-2 sentences, for the guides-index card),
  "introText": string (2-3 paragraphs separated by \n\n; sentence 1 is the direct answer to the page's question),
  "sections": [ { "heading": string (Title Case, noun-phrase, no "X and Y" formula), "body": string (2-4 paragraphs, \n\n-separated) }, ... at least 5 sections ],
  "tools": [ { "href": string (a real internal route from the CLOSED URL LIST), "label": string }, ... 2-4 entries ],
  "faqs": [ { "question": string, "answer": string (2-4 sentences) }, ... at least 5 entries ],
  "sources": [ { "label": string, "url": string (from the CLOSED URL LIST) }, ... at least 3 entries ]
}
```

Rules specific to this shape:
- `sections[].body` and `faqs[].answer` use **markdown**: `[link text](url)` for the first mention
  of any named company/organization/regulator (never raw HTML), `**bold**` sparingly, GFM pipe
  tables only where a table genuinely carries data prose does not.
- Every external link (in `introText`, `sections[].body`, `faqs[].answer`, `sources[].url`) MUST
  come from the CLOSED URL LIST in the row prompt. No other domain, ever.
- Every internal link (in `introText`, `sections[].body`) MUST be one of the real routes listed
  in the row prompt's "internal links this page may use" section.
- Do NOT include a `subtitle`, `ctaTitle`, `ctaText`, `ctaButton`, `faqItems`, `metaTitle`, or
  `relatedLinks` key — those are NOT part of this repo's `Guide` interface. Use exactly the keys
  listed above.
- This repo has no lead-generation `inlineCta` field on this page type — do not invent one.
- Heading rule: Title Case, capitalize first letter of each major word, keep minor words
  (a, an, the, and, or, for, to, of, in, on, at, by, with, from, vs, via, per, as) lowercase
  unless first/last word. Never lowercase an acronym (FDIC, APY, IRS, CFPB, 529, HYSA, DCF).
- `register: operator`. Name the business at the FIRST first-person company claim only:
  "At ModernWallet, we…" — once per page, never in `metaTitle`/`metaDescription`.
  Every other first-person reference is bare "we"/"our".
- `page type: explainer` — floor 1,200 body words (introText + sections[].body + faqs[].answer,
  excluding title/meta/h1/cardBlurb).
- Sentence 1 of `introText` is the direct, short answer to the page's core question. If a
  tee-up belongs, it is the NEXT sentence, drawing only on the DOMAIN framings supplied in the
  row prompt (e.g. "At ModernWallet, we build financial tools and guides centered on verifiable
  math…" or "When we reviewed this ourselves…") — never a fabricated client name or number.
- Anchor: this is a content property with no named-client roster. Use one of the licensed
  DOMAIN framings ("What we see readers get wrong most often about X is…", "In the guides we
  publish here, we…") woven into ONE relevant section as the proprietary-anchor observation.
  Never invent a specific test result, client, or number that is not in the CLOSED FACT LIST.
- Every acronym defined on first use (full term, then the acronym in parentheses, then the
  acronym alone thereafter): APY, FDIC, IRS, CFPB, DCF, NOPAT, IRR, NPV, HYSA, 529.
- Disclaimers: this page type carries no per-page legal disclaimer field; do not invent one.
- No em-dashes, no "honest/honestly", no coy abstractions ("the vendor", "the platform") —
  name the actual company/product/plan every time.
