# OUTPUT CONTRACT
Return ONE JSON object with exactly these keys: updated, slug, title, metaDescription, h1, cardBlurb, introText, sections, tools, faqs, sources — the same shape as the imitate-this page.
- introText: one string; paragraphs separated by \n\n. sections: array of {heading, body}; body is markdown (links as [label](url), GFM pipe tables, "- " bullets). No HTML.
- Headings: Title Case noun phrases; at most one heading opens with the primary keyword. FAQ questions use sentence case.
- tools: [{"href":"/tax-bracket-calculator/","label":"Tax Bracket Calculator"}] only.
- sources: [{label,url}] drawn only from the CLOSED URL LIST.
- Brand first-"we" rule: this page is REPORTER register (see row prompt), so no "we" appears anywhere except where the row prompt permits it. Brand: The Modern Wallet.
- Disclaimers never appear in the intro or first section.
