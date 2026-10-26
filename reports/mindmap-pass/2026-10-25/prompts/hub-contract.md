# OUTPUT CONTRACT
Return ONE JSON object with exactly these keys, and nothing else:
- "metaTitle": string, 60 characters or fewer, contains "checklist".
- "metaDescription": string, 160 characters or fewer.
- "h1": string.
- "introText": string. Two paragraphs separated by "\n\n". Paragraph one opens with a complete, self-contained sentence answering the reader question in the prompt. Paragraph two says how to use the picker tool above and the Print or save as PDF button.
- "howItWorks": string. Four paragraphs separated by "\n\n". Rendered under the heading "How it works". Markdown links allowed only to the internal routes listed in the prompt.
- "faqs": array of 6 objects {"question": string, "answer": string}. Use the questions given in the prompt, verbatim, in order. Each answer two to three short sentences.
The brand is "The Modern Wallet"; if named, write "At The Modern Wallet, we ...". Never claim a personal experience or a product test. No sentence may hold more than three figures.
