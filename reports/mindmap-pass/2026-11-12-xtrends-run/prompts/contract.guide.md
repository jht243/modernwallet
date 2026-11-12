return ONE JSON object with EXACTLY these keys

```
{
  "slug": string,            // must equal the slug given in the row prompt, exactly
  "title": string,           // SEO title, 50 to 60 chars, primary keyword present
  "metaDescription": string, // <= 155 chars, primary keyword present
  "h1": string,
  "cardBlurb": string,       // one sentence for the guide index card
  "introText": string,       // opening paragraph(s). Sentence 1 = the direct answer to the reader question.
  "sections": [ { "heading": string, "body": string }, ... ],  // body paragraphs separated by \n\n
  "faqs": [ { "question": string, "answer": string }, ... ]
}
```
Rules for the shape:
- Register is REPORTER: third person, sourced, straight facts. No "we", no "our", no "At ModernWallet, we", no tee-up, no first-person experience claim, no testing, modeling or client claim. Where the page does date arithmetic, write "by arithmetic" or "by simple arithmetic on the Federal Register dates". Sentence 1 of introText is the news and the answer.
- Noun-phrase headings in Title Case. Use the section headings the row prompt lists, exactly as given. At most ONE heading (h1 + sections) may open with the primary keyword.
- The answering section named in the row prompt is section 1; definition/background never leads.
- Internal links: ONLY the routes the row prompt gives, as markdown `[anchor](/path/)` in prose, with the anchor text the row prompt gives.
- External links: ONLY URLs on the closed URL list, as markdown links on the first mention of each organisation, document or study. Never invent a URL. Link the Federal Register at first use of the rule.
- Tables are GitHub pipe tables inside a body string, preceded by a blank line, with a `|---|---|` separator row and the same cell count on every row. No raw HTML.
- Do not emit `sources`, `tools`, `updated`, byline text, review claims or a disclaimer: the calling agent and the template add them. Never write "Reviewed by", "Last updated" or a date-of-review sentence.
- No em dashes. Use commas, or the word "to" for a range. No semicolons joining clauses.
- Define each acronym on first use (Department of Labor (DOL), pharmacy benefit manager (PBM), Employee Retirement Income Security Act of 1974 (ERISA), Employee Benefits Security Administration (EBSA), Congressional Budget Office (CBO)).
- The last body sentence of the last section before the FAQ is a concrete next action the reader can take. Do not add a Conclusion or Summary heading.
