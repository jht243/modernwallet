# OUTPUT CONTRACT (Guide record for The Modern Wallet, themodernwallet.com)

Return ONE JSON object with exactly these keys and no others:

- `slug` (string): the expected slug from the row prompt.
- `title` (string): SEO title, 50 to 60 characters, carries the primary keyword, no site-name suffix.
- `metaDescription` (string): 150 to 160 characters, plain text, no markdown, opens with the answer.
- `h1` (string): one clause that states the finding, Title Case, plain text.
- `cardBlurb` (string): one sentence, plain text, for the guide index card.
- `introText` (string): two short paragraphs separated by a blank line (`\n\n`). Sentence 1 is the direct answer to the reader question. Define every acronym on first use.
- `sections` (array of `{ "heading": string, "body": string }`): `body` is markdown. Separate paragraphs with `\n\n`. A table is a GFM pipe table inside the `body` string (header row, `| --- |` separator row, data rows, each on its own line) exactly like the voice sample. Lists use `- ` bullets or `1. ` numbers on their own lines. No raw HTML. Link with markdown `[text](url)` only. Internal links are `[anchor](/path/)` with a trailing slash and only to routes the row prompt allows. External links use only URLs on the allowed list.
- `tools` (array of `{ "href": string, "label": string }`): only internal calculator routes the row prompt allows. Use `[]` when none is allowed.
- `faqs` (array of `{ "question": string, "answer": string }`): 5 to 7 entries. Questions use sentence case. Each answer leads with the direct answer, then the condition.
- `sources` (array of `{ "label": string, "url": string }`): primary sources only, every url on the allowed list, each used on the page.

Do NOT emit `updated`, `published`, `noAds` or `disclaimerText`. The template adds dates.

Structure rules:
- Section headings (H2) are Title Case noun phrases. Use the approved outline headings from the row prompt as the section order, with the corrected wording where the row prompt says a heading is corrected. A section titled `Our Takeaway` comes after the evidence sections and before the FAQs, and it holds the intent-based takeaway as one short paragraph. The `faqs` field renders the FAQ section, so do not add a FAQ section to `sections`.
- No `Conclusion`, `Summary` or `Final Thoughts` heading. No disclaimer, byline, review-date or "last updated" sentence in any prose field.
- The final sentence of the last body section is a concrete next action the reader can take.
- Register: operator (you, second person singular). Treat the row as `teeup-exempt:` because the page is source-reported only and no site experience fits, so sentence 1 is the answer and no tee-up follows. Do not write a company-claim "we". Do not write "we tested", "in our testing", "internal testing", "internal analysis" or "internal modeling" anywhere: the evidence basis is `reported`. Attribute every fact inline to its named source, with a markdown link on the first mention of each organization.
- First mention of every organization or law (Chase, NBC News, Fortune, Zelle, the CFPB, Treasury, the IRS, the Minnesota Department of Revenue, CBS Minnesota, Minn. Stat. 275.065, 26 U.S.C. 414A) is a markdown link to its allowed URL.
- Never use the words "the vendor", "the platform", "the company" or "the tool" for a named subject. Use the name.
- Page type, medium and register records for the auditor go in the row prompt, not the page.
- Respect the CLOSED FACT LIST: anything not on it, you do not know. A fact marked NOT VERIFIED or DO NOT STATE must not appear in any form.
