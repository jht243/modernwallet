# Output contract — Guide page (ModernWallet, guides.ts)

Return ONE JSON object with EXACTLY these keys — no extra keys, no markdown fences:

```
{
  "slug": string,                 // kebab-case, matches the requested slug exactly
  "title": string,                // <=60 chars, includes the primary keyword
  "metaDescription": string,      // <=160 chars
  "h1": string,                   // Title Case, states the page's subject plainly
  "cardBlurb": string,            // one sentence, for the guide-index card
  "introText": string,            // the page's lead paragraph(s), plain text with \n\n between paragraphs
  "sections": [ { "heading": string, "body": string } ],   // Title Case headings; body uses \n\n between paragraphs; markdown links [text](url) allowed
  "tools": [ { "href": string, "label": string } ],        // internal calculator links only, from the allowed internal-links list
  "faqs": [ { "question": string, "answer": string } ],
  "sources": [ { "label": string, "url": string } ]        // primary sources only, from the closed URL list
}
```

Formatting rules:
- Noun-phrase headings. At most ONE heading may open with the primary keyword.
- Title Case every heading (see the content standard's SEO section for the capitalization rule).
- Markdown links `[text](url)` for every external company/source/regulator named — first mention only, official/primary source only, from the closed URL list. Internal links use the exact paths given in the prompt's internal-links list.
- The brand first-"we" rule: the first time the page speaks as the business making a claim about itself, write "At ModernWallet, we…". Once per page only.
- No inlineCta field — this project's Guide schema does not carry one.
- No `draft` field — omit it entirely.
