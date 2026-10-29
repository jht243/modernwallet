# OUTPUT CONTRACT
Return ONE JSON object with exactly these keys, and nothing else:
- "metaTitle": string, 60 characters or fewer, contains the primary keyword.
- "metaDescription": string, 160 characters or fewer.
- "introText": string. Two paragraphs separated by "\n\n". Paragraph one opens with a short, complete sentence that directly answers the row's reader question. Paragraph two is a worked example using ONLY figures from the fact list.
- "howItWorks": string. Six to eight paragraphs separated by "\n\n". Explains how the calculator works, using ONLY figures from the fact list. No headings, no tables, no bullet lists, no markdown other than links. Markdown links allowed only to the internal routes listed in the prompt and the external URLs on the closed URL list.
- "faqs": array of 8 objects {"question": string, "answer": string}. Each answer is two to four short sentences. Use the questions given in the prompt, verbatim, in order.
Headings are not used. The brand is "ModernWallet"; if the brand is named, write "At ModernWallet, we ...". Never claim a personal experience outside _experience.md.
No sentence may hold more than three figures (a figure = any $ amount, %, year or month count, or ratio): split long worked-example sentences, stating the terms in one sentence and the results in the next.
