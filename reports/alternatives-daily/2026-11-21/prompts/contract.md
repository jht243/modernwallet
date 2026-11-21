# Output contract (ModernWallet alternatives page)

Return ONE JSON object with exactly these keys and no others:
slug, product, officialUrl, title, h1, metaDescription, published, updated, intro, tableTitle, tableNote, tableColumns, rows, chooseSection, alternatives, stillBetterFit, verdict, faqs, related.

- title and h1 start with "<Product> Alternatives"; title is 50 to 60 characters, plain text, no markdown. metaDescription 120 to 160 characters, contains "<Product> alternatives".
- intro: 2 to 4 paragraphs separated by a blank line (\n\n). Sentence 1 answers "what should I use instead of <Product>?" in plain words. Contains exactly ONE external link, `[<Product>](<officialUrl>)`, on first mention. All other companies in plain text, never linked. Internal links as `[text](/path/)`.
- tableColumns: ["Product","Fees and pricing","Best fit"]. rows: {product, pricing, bestFit}; subject row first with "subject": true, then 5 to 8 alternatives. Cells state facts, never "see vendor site".
- chooseSection {heading, body}: "How to Choose a <Product> Alternative", decision criteria as a "- " list plus cost arithmetic.
- alternatives: one {heading, body} per alternative (what it is, tiers and prices from the fact list, who it fits, where it falls short versus the subject, a worked cost example where pricing allows). Title Case headings.
- stillBetterFit {heading: "When <Product> Is Still the Better Fit", body}; body also covers Who This Is Not For and What Would Change Our Answer as plain paragraphs.
- verdict: short, ends on a concrete next action containing the primary keyword.
- faqs: 4 to 6 {question, answer}, sentence-case questions, direct answers first.
- related: 3+ {label, href} internal only.
- Body text: paragraphs split by blank line, "- " list lines, no raw HTML, no tables inside bodies, no em dashes, no "tested"/"we tried" wording, no advice ("fits people who", never "you should").
- Heading style: Title Case. Never use "Conclusion" or "Summary".
- Total reader-facing body at least 1,500 words.
