# OUTPUT CONTRACT
Return ONE JSON object with exactly these keys, and nothing else:
- "title": string, 60 characters or fewer, contains the primary keyword. Written for the reader question in the prompt.
- "metaDescription": string, 160 characters or fewer. Says what the tool does (customized, printable).
- "h1": string. Contains the primary keyword.
- "introText": string. Two paragraphs separated by "\n\n". Paragraph one opens with a complete, self-contained sentence that ANSWERS the reader question in the prompt (the answer sentence given there, in your own words). Paragraph two tells the reader how to use the tool above (what it asks, what it drops, the Print or save as PDF button).
- "toolHeading": string, 3 to 7 words.
- "toolSubheading": string, one sentence naming what the reader answers.
- "howItWorks": string. Five or six paragraphs separated by "\n\n". Rendered under the heading "How the checklist is built". Cover, in order, what the prompt's Coverage list says. The LAST paragraph is the takeaway described in the prompt. Markdown links allowed to the internal routes listed in the prompt and to URLs on the CLOSED URL LIST.
- "workedExample": string. One or two paragraphs. Uses ONLY the scenario counts in the fact list, and introduces them as our own internal comparison (what we did, then what we found).
- "commonMistakes": array of 5 to 6 strings, each one or two sentences.
- "faqs": array of 8 objects {"question": string, "answer": string}. Use the questions given in the prompt, verbatim, in order. Each answer is two to four short sentences.
Headings are not used inside fields. The brand is "The Modern Wallet"; if the brand is named, write "At The Modern Wallet, we ...". Never claim a personal experience outside _experience.md; never claim we tested a product.
No sentence may hold more than three figures (a figure = any $ amount, %, count, year or ratio).
Never state a state-specific deposit limit, return deadline, disclosure form, notice period or fee; say it is set by state law and point to the HUD tenant-rights page or the reader's state.
