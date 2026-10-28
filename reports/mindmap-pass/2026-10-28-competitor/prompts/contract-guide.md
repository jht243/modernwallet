return ONE JSON object with EXACTLY these keys

```
{
  "slug": string,            // must equal the slug given in the row prompt, exactly
  "metaTitle": string,       // <= 60 chars, primary keyword present
  "metaDescription": string, // <= 160 chars, primary keyword present
  "h1": string,
  "cardBlurb": string,       // one sentence for the guide index card
  "introText": string,       // opening paragraph(s). Sentence 1 = the direct answer to the reader question.
  "sections": [ { "heading": string, "body": string }, ... ],  // body paragraphs separated by \n\n
  "faqs": [ { "question": string, "answer": string }, ... ],
  "relatedLinks": []         // leave as []
}
```
Rules for the shape:
- Noun-phrase headings in Title Case. At most ONE heading (h1 + sections) may open with the primary keyword.
- The answering section named in the row prompt is section 1 or 2; definition/background never leads unless the row says so.
- Internal links: ONLY the routes the row prompt gives, as markdown `[anchor](/path/)` in prose.
- External links: ONLY URLs on the closed URL list, as markdown links on first mention. Never invent a URL.
- The brand: "At ModernWallet, we..." at most once, only for a licensed company claim; otherwise bare "we".
- Do not emit a `sources` field; the calling agent adds it. Omit CTA fields.
