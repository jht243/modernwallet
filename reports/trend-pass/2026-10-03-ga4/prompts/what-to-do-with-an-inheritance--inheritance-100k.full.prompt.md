TASK: Write the answer for ONE new FAQ on the page /guides/what-to-do-with-an-inheritance. FAQ answer only, no heading.
READER QUESTION: "What should I do with a $100,000 inheritance?"
WHY: autocomplete shows repeated demand ("what to do with 100k inheritance", "what to do with an inheritance of $100 000", "best way to invest 100k inheritance"); the page gives the seven-step order but never works it through for a concrete sum.
Answer in the first sentence: follow the same order, sized to the sum. Then walk the hypothetical example from the fact list, labelled clearly as a hypothetical, using exactly the dollar figures given. End by pointing to the $100k investing guide for the part that goes to investing. Use the two internal links given.

Output contract for this task: return plain markdown only. This is a single FAQ ANSWER for an existing page. No heading, no question text, no bullet lists, no JSON. Two to four sentences, one paragraph (or two short ones at most), 70 to 140 words. Answer the reader's question in the first sentence. Use only facts in the closed fact list. Internal links: markdown links to the listed internal routes only, at most two. Brand rule: if "we" is used it follows "At The Modern Wallet, we". Match the voice of the page excerpt provided.

VOICE SAMPLE (FAQ answers from a sibling page; imitate the register, not the content):
faqs: [
      {
        question: "Do you pay more taxes as a sole proprietor than an LLC?",
        answer:
          "No — by default they are taxed identically. A single-member LLC is a disregarded entity, so its profit goes on Schedule C and pays self-employment tax exactly as a sole proprietor's does, with the same QBI deduction available. A difference only appears if the LLC later elects S-corporation treatment, which is a separate decision with its own costs.",
      },
      {
        question: "At what income is an LLC worth it?",
        answer:
          "For liability, there is no income threshold — the question is whether the work could generate a claim, and that is true from the first client. For tax, the relevant trigger is that an S-corp election requires an entity, so once profit approaches roughly $35,000 to $52,000, depending on the salary you could defend, you need an LLC or corporation in place to benefit.",
      },
      {
        question: "Does an LLC protect my personal assets?",
        answer:
          "Generally yes, provided you maintain the separation. That means a dedicated business bank account, not paying personal costs from business funds, signing contracts in the LLC's name, and keeping up your state filings. Fail those and a court can disregard the entity. It also will not shield you from your own professional negligence, and lenders often require a personal guarantee that contractually restores your exposure.",
      },
      {
        question: "Can I deduct more expenses with an LLC?",
        answer:
          "No. Business expenses are deductible because they are ordinary and necessary for a trade or business, and a sole proprietor has one. An LLC changes the legal wrapper, not the deduction rules. Advice suggesting otherwise usually describes deducting personal expenses, which is not a benefit of any structure.",
      },
      {
        question: "How much does an LLC cost to maintain?",
        answer:
          "The state filing fee to form it, commonly $50 to $500, plus an annual report or franchise fee in many states. A handful of states charge considerably more, so check yours specifically rather than relying on a national average. Beyond that, the running cost is the discipline of keeping business and personal finances separate — which costs nothing but has to actually happen.",
      },
      {
        question: "Should I form an LLC before I have clients?",
        answer:
          "If the work carries meaningful liability, forming early is cheaper than forming after a problem. If you are testing whether the business works at all, starting as a sole proprietor and forming later is a reasonable sequence — you can move the activity into an LLC once it has revenue. What is not sensible is delaying because you expect a tax benefit, since there is not one by default.",
      },
    ],
    sources: [IRS_LLC, IRS_SOLE_PROP, IRS_SE_TAX, IRS_2553],
    relatedComparisons: ["llc-vs-s-corp", "1099-vs-w2", "partnership-vs-llc"],
    calculatorLinks: [
      { label: "Self-Employment Tax Calculator", href: "/self-employment-tax/" },
      { label: "S Corp Tax Calculator", href: "/s-corp-tax/" },
    ],
CLOSED FACT LIST (anything not here, you do not know):
- The page's order: pause 30 to 90 days in a high-yield savings account; learn the tax rules; pay off high-interest debt; build an emergency fund of three to six months of expenses; catch up on retirement savings; invest the rest in a taxable brokerage account (a broad, low-cost index fund).
- Credit card debt commonly carries a 20%+ interest rate.
- HYPOTHETICAL EXAMPLE (label it as hypothetical): a $100,000 inheritance, $12,000 of credit card debt, and $2,500 a month of expenses. Paying off the card leaves $88,000. A three-to-six-month emergency fund at $2,500 a month is $7,500 to $15,000, which leaves between $73,000 and $80,500 to invest.
- Most inherited stocks, real estate and other property get a step-up in basis to fair market value on the date of death, so selling soon may mean little or no capital gains tax.
- An inheritance typically cannot be deposited directly into most retirement accounts; the page suggests using part of it to live on so more of your own paycheck goes into 401(k) or IRA contributions.

ALLOWED INTERNAL LINKS (real routes only):
/guides/how-to-invest-100k-to-1-million/
/guides/how-much-emergency-fund/
ALLOWED EXTERNAL URLS: none

REVISION NOTES (a first draft was rejected): State the emergency-fund arithmetic as our own worked example, never "according to" any guideline. Link the emergency fund guide only as the words "emergency fund guide" at the end of a sentence about how big a reserve to hold. Link the $100k guide with the words "investing $100,000" in the closing sentence. Say the savings-account parking step comes first, then debt, then the reserve, then investing, and keep the hypothetical clearly labelled. 80 to 120 words.
