Return ONE JSON object with EXACTLY these keys (no others, no markdown fences, no commentary):

```
{
  "slug": string,
  "title": string,               // page <title>, keep close to the SEO title given in the row prompt
  "metaDescription": string,      // 140-160 chars, includes the primary keyword
  "targetKeyword": string,
  "category": string,             // short noun phrase for the product category, e.g. "business bank accounts"
  "angle": "best",
  "segment": string,              // audience segment given in the row prompt, e.g. "small business owners"
  "h1": string,                   // Title Case, one clause, states the finding, no "X and Y" formula
  "introText": string,            // 2 paragraphs separated by \n\n. Sentence 1 = the direct answer (who wins / the short list), sentence 2 (operator tee-up, optional) = our relationship to this work. Second paragraph: methodology/independence framing WITHOUT asserting neutrality (never "no company paid us" as a claim of objectivity — state only "No [product] issuer paid for placement in this roundup" as a factual disclosure, not an objectivity claim) and a link to 1-2 relevant on-site calculators if named in the row prompt.
  "rankingCriteria": string,      // one paragraph: the 3-5 factors used to rank, with rough weights, and WHY those factors (not welcome-offer size / rate alone)
  "options": [
    {
      "name": string,             // the real, exact product/company name from the CLOSED FACT LIST only
      "bestFor": string,          // one clause: who this specific option is the best pick for
      "description": string,      // 2-3 sentences: what it is, how it works, its defining structural trait
      "strengths": [string, ...], // 3-4 items, each a distinct concrete fact, not restatements
      "limitations": [string, ...], // 2-3 items, each a real tradeoff from the closed fact list
      "pricing": string           // the exact fee/rate/eligibility figure from the closed fact list, or "Quote-based" / "Not published" if the fact list marks it undisclosed. NEVER invent a number.
    }
  ],                              // 5-7 options, ranked
  "comparisonTable": {
    "headers": [string, ...],     // 4-6 columns, the dimensions that actually distinguish the options
    "rows": [ { "name": string, "values": [string, ...] } ]
  },
  "verdict": string,              // 1 paragraph: names the single best default pick and why, names who each other pick fits, ends on the most decision-relevant fact. This paragraph also carries "who this is not for" and "what would change our answer" (per the content standard's Required page elements) as sentences within it.
  "sections": [
    { "heading": string, "content": string }   // 2-4 sections. One MUST be "How We Ranked" (methodology). At least one other must answer the reader's underlying question (the mechanism most competitor content skips) per the row's "reader question".
  ],
  "faqs": [ { "question": string, "answer": string } ],  // 5-6 FAQs, verbatim PAA where the row prompt supplies it
  "sources": [ { "label": string, "url": string } ],     // 2-4 first-party sources (regulator, official issuer/vendor pages) from the CLOSED URL LIST only
  "calculatorLinks": [ { "label": string, "href": string } ]  // only routes given in the row prompt's internal-links list
}
```

Field-shape notes:
- This store has NO `ctaTitle`/`ctaText`/`ctaButton`/`inlineCta` fields and NO `optionAName`/`optionBName` (this is a multi-option roundup, not a two-option comparison). Do not emit those keys.
- `draft` and `updated` fields are added by the orchestrator after generation, not by you.
- Disclaimer text is NOT part of this object; the template renders it. Never write a disclaimer sentence into `introText`, `sections`, `verdict`, or `faqs`.
- Every dollar figure, fee, APR, credit-score threshold, or funding-speed claim in `options[].pricing`, `options[].description`, `options[].strengths`, `options[].limitations`, and `comparisonTable` MUST come from the CLOSED FACT LIST in the row prompt. If a fact is not on that list, write "not published — confirm on [issuer]'s own page" rather than a number.
