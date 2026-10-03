TASK: Write the answer for ONE new FAQ on the page /guides/how-to-invest-100k-to-1-million. FAQ answer only, no heading.
READER QUESTION: "What is the best way to invest $100k for monthly income?"
WHY: autocomplete shows a repeated cluster ("best way to invest 100k for monthly income", "best way to invest 100k to generate income", "how best to invest 100k for income"). The page is about growing $100k to $1 million, not about drawing income from it, and does not answer this.
Answer in the first sentence: there is no single best way; monthly income comes from the yield on the money, so the monthly figure is just the yield times $100,000 divided by 12. Then give the arithmetic from the fact list for the three yields, then say the trade-off: income-focused holdings versus growth, and that payouts and (for stock and bond funds) principal are not guaranteed, so verify current rates. Use the three internal links given at most two of them. Do not name specific funds or quote current rates.

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
- Monthly income from a lump sum equals the annual yield times the amount, divided by 12.
- Arithmetic on $100,000: a 3% yield is $3,000 a year, or $250 a month. A 4% yield is $4,000 a year, or about $333 a month. A 5% yield is $5,000 a year, or about $417 a month.
- Yields on savings accounts, CDs, bonds and dividend funds change over time and are not guaranteed; the reader should check current rates before relying on any figure. You do not know any current rate.
- Stock and bond funds can lose principal value even while they keep paying income; money in a savings account or CD is not exposed to that market risk.
- Interest from savings accounts, CDs and most bonds is taxed as ordinary income in a taxable account.
- Spending the income instead of reinvesting it stops the compounding the page's $1 million timeline depends on.

ALLOWED INTERNAL LINKS (real routes only):
/guides/passive-income-ideas/
/roundup/best-monthly-dividend-etfs/
/investing/dividend-calculator/
ALLOWED EXTERNAL URLS: none
