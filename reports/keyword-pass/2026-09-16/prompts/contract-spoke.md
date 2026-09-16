Return ONE JSON object with EXACTLY these keys (no extras, no markdown fences):

- `slug` — string, must equal the slug given in the prompt, exactly.
- `title` — string, <=60 characters, includes the primary keyword, no site name suffix.
- `metaDescription` — string, <=160 characters, includes the primary keyword.
- `h1` — string, Title Case, noun-phrase, includes the primary keyword.
- `introText` — string, 2 paragraphs separated by `\n\n`. Sentence 1 of paragraph 1 is the
  direct numeric/conceptual answer to the page's question. A worked-number sentence (like the
  voice sample's "To take home $X... you need $Y") belongs in paragraph 2, built ONLY from the
  numbers in the CLOSED FACT LIST.
- `howItWorks` — string, 4-6 paragraphs separated by `\n\n`. This is the page's main explainer
  body. The FIRST sentence of this field must be a complete, self-contained declarative claim
  (AEO). Markdown links `[text](url)` for the first mention of any named company/association/
  source, restricted to the CLOSED URL LIST.
- `commonMistakes` — array of 4-5 strings. Each is 1-2 sentences: name the mistake, then the
  concrete consequence.
- `workedExample` — string, one paragraph, a single worked scenario built ONLY from the numbers
  in the CLOSED FACT LIST.
- `faqItems` — array of objects, each `{ "question": string, "answer": string }`. Use the exact
  FAQ questions given in the prompt, in the given order. `answer` is 2-4 sentences, leads with
  the direct answer.

Do NOT include `sections`, `sources`, `ctaTitle`, `ctaText`, `ctaButton`, `subtitle`,
`comparisonTable`, `verdict`, `toolHeading`, `toolSubheading`, `preset`, or `relatedLinks` — the
routine adds those fields itself; they are not prose the writer produces.

Style notes specific to this repo (ModernWallet, themodernwallet.com):
- Brand: "ModernWallet". First-"we" rule: "At ModernWallet, we..." exactly once on the page if a
  tee-up is used, never in metaTitle/metaDescription. This is a tool-adjacent spoke page (short,
  practical, numbers-forward) like the voice sample — do not force a tee-up if it reads bolted-on;
  sentence 1 is still the direct answer either way.
- This page benchmarks freelance rates for creative disciplines (design, graphic design,
  illustration/art, writing) against the CLOSED FACT LIST's real rate-survey figures — never
  invent a rate not on that list.
- The last paragraph of `howItWorks` closes on a concrete next action the reader can take.
