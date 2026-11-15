## OUTPUT CONTRACT

# OUTPUT CONTRACT
Return ONE JSON object with exactly these keys, and nothing else:
- "metaTitle": string, 60 characters or fewer, contains the primary keyword.
- "metaDescription": string, 160 characters or fewer.
- "introText": string. Two paragraphs separated by "\n\n". Paragraph one opens with a short, complete sentence that directly answers the row's reader question. Paragraph two is a worked example using ONLY figures from the fact list. A one-sentence tee-up ("At ModernWallet, we ...") may follow the answer sentence only if it fits; otherwise skip it.
- "howItWorks": string. Three to four paragraphs separated by "\n\n". Explains how the calculator works, using ONLY figures from the fact list. Markdown links allowed only to the internal routes and external URLs listed in the prompt.
- "sections": array of objects {"heading": string, "body": string}, exactly the headings given in the prompt, in order, each heading used verbatim. Each body is blocks separated by "\n\n". A block is a paragraph, a GitHub pipe table (header row, |---| separator, rows, one block, no blank lines inside) or a list. Use ONLY figures from the fact list. When the prompt supplies a table, include it exactly with those values.
- "faqs": array of 8 objects {"question": string, "answer": string}. Each answer is two to four short sentences and leads with the direct answer. Use the questions given in the prompt, verbatim, in order.
Headings inside bodies are not used. The brand is "ModernWallet"; if the brand is named, write "At ModernWallet, we ...". Never claim a personal experience outside _experience.md. Never write "we tested", "in our testing", or any tested-format claim: this page is calculated and modeled. Visible attribution for original work uses the exact kind the prompt gives ("In our internal modeling, we ...").
No sentence may hold more than three figures (a figure = any $ amount, %, year or month count, or ratio): split long worked-example sentences, stating the terms in one sentence and the results in the next. Table cells are exempt.
Plain text only in every string: no HTML, no em-dashes, no emoji.
