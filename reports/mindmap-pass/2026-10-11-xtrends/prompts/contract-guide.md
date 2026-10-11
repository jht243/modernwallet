Return ONE JSON object with exactly these keys, nothing else:
slug, title, metaDescription, h1, cardBlurb, introText, sections, tools, faqs, sources.
- title: 60 characters or fewer, contains the primary keyword. metaDescription: 160 characters or fewer.
- cardBlurb: one sentence, under 160 characters.
- introText: one paragraph. Its first sentence is a complete, self-contained answer to the reader question.
- sections: array of {"heading": string, "body": string}. Headings are noun phrases (not questions, no more than one that opens with the primary keyword). Bodies are plain text with "\n\n" between paragraphs; "- " bullet lines allowed; internal links as markdown [text](/path/) using ONLY routes on the internal list.
- tools: array of {"href": "/route/", "label": string} using only listed routes.
- faqs: array of {"question": string, "answer": string}; each answer leads with the direct answer.
- sources: array of {"label": string, "url": string} using only URLs from the closed URL list.
Brand: the site is ModernWallet. First-person plural only as "At ModernWallet, we...", and only where _experience.md allows. Author voice is the site's byline author; do not invent credentials.
