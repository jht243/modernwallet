Return ONE JSON object with exactly these keys, no others:

- `slug` (string, kebab-case, matches the row's slug exactly)
- `metaTitle` (string, ≤60 chars, includes the primary keyword naturally)
- `metaDescription` (string, ≤160 chars, states the direct answer/value, not a teaser)
- `h1` (string, noun-phrase or direct-question form, includes the primary keyword)
- `subtitle` (string, one sentence, a card-index blurb — do NOT restate the intro's first sentence)
- `introText` (string, may contain `\n\n` paragraph breaks; first sentence is the direct answer to the reader's core question — no throat-clearing tee-up before it)
- `sections` (array of `{heading, body}` — `heading` is Title Case, noun-phrase, at most ONE heading in the whole page may open with the primary keyword; `body` may contain `\n\n` paragraph breaks and inline markdown links `[text](url)` using ONLY URLs from the closed URL list)
- `ctaTitle` (string, short)
- `ctaText` (string, ≤2 sentences, must name this page's actual subject — never a generic line that would fit any page)
- `ctaButton` (string, 2–4 words, e.g. "Book a Consultation")
- `faqItems` (array of `{question, answer}` — answer the exact FAQ questions given in the row prompt, in the same order, each answer self-contained)

Rules:
- Brand first-person rule: any "we" claim must draw only from the DOMAIN section below (who "we" are). Use "At ModernWallet, we…" for the one standard self-introduction sentence if the voice sample uses that pattern; do not repeat it more than once on the page.
- Headings are noun-phrases in Title Case (e.g. "How Statutory Conversion Works", not "How does statutory conversion work?").
- Every factual claim (a number, a form name, a statutory citation, an IRS rule, a deadline, a percentage) must come from the CLOSED FACT LIST in the row prompt. If something is not on that list, do not state it — say the reader should verify it at the linked primary source instead.
- Every external link must be one of the URLs in the CLOSED URL LIST. Never link to a URL not on that list. Internal links must be one of the internal routes given in the row prompt.
- Follow the voice sample's register, sentence rhythm, and paragraph shape — but never reuse its numbers, facts, or sentences verbatim. This is a different page about a different topic.
- Do not pad. Hit the depth floor stated in the row prompt by answering more of the reader's real sub-questions, not by restating sentences in longer form.
