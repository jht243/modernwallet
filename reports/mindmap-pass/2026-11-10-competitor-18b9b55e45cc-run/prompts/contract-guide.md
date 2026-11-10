# OUTPUT CONTRACT
Return ONE JSON object with exactly these keys: updated, slug, title, metaDescription, h1, cardBlurb, introText, sections, tools, faqs, sources — the same shape as the imitate-this page.
- introText: one string; paragraphs separated by \n\n. sections: array of {heading, body}; body is markdown (links as [label](url), GFM pipe tables, "- " bullets). No HTML.
- Headings: Title Case noun phrases; at most one heading opens with the primary keyword. FAQ questions use sentence case.
- tools: [{"href":"/investing/","label":"Investing"}] style only; use only the hrefs the row prompt lists.
- sources: [{label,url}] drawn only from the CLOSED URL LIST in the row prompt.
- Brand first-"we" rule: this page is OPERATOR register. The first company claim says "At ModernWallet, we ..." (once per page; later "we" stays bare). Brand: ModernWallet.
- Disclaimers never appear in the intro or first section. The template renders the site disclaimer at the bottom; do not write one.
- Never write a byline, reviewer line or "last updated" sentence in prose. Never claim we tested a product, spoke with clients, or have a professional reviewer.
