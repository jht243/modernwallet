TASK: Write the answer for ONE new FAQ on the page /roundup/best-index-funds. FAQ answer only, no heading.
READER QUESTION: "What are the best index funds for a Roth IRA?"
WHY: autocomplete shows repeated demand ("best index funds for roth ira", "best index funds for roth ira fidelity"); the page never mentions a Roth IRA.
Answer in the first sentence: a Roth IRA is an account, not an investment, so the same low-cost funds on this list work inside it; the account changes how the growth is taxed, not which fund is best. Then say which of the listed funds are the stock-focused ones that benefit most from tax-free growth, name the Fidelity-account constraint on FZROX and FXAIX, and point to the two internal links. Use only the funds and expense ratios in the fact list.

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
- A Roth IRA is a type of account that holds investments; it is not an investment itself. Growth inside a Roth IRA is not taxed again when qualified withdrawals are taken.
- Funds on the page: VOO (Vanguard S&P 500 ETF, 0.03% expense ratio); FZROX (Fidelity ZERO Total Market Index Fund, 0.00%, available only in Fidelity accounts); VTI (Vanguard Total Stock Market ETF, 0.03%, about 3,700 U.S. stocks); FXAIX (Fidelity 500 Index Fund, 0.015%, no minimum at Fidelity); IVV (iShares Core S&P 500 ETF, 0.03%); SCHB (Schwab U.S. Broad Market ETF, 0.03%); VXUS (Vanguard Total International Stock ETF); BND (Vanguard Total Bond Market ETF, 0.03%).
- FZROX is exclusive to Fidelity accounts and cannot be moved to another brokerage as-is.
- The 2026 Roth IRA contribution limit and income limits: you do not know them; tell the reader to check the IRS page rather than quoting them.
- In a taxable account, index funds are taxed along the way (dividends each year, capital gains when sold); inside a Roth IRA that tax drag does not apply.

ALLOWED INTERNAL LINKS (real routes only):
/compare/roth-ira-vs-index-fund/
/investing/roth-ira-calculator/
ALLOWED EXTERNAL URLS:
https://www.irs.gov/retirement-plans/roth-iras
