TASK: Write the answer for ONE new FAQ on the page /guides/what-is-an-ipo. FAQ answer only, no heading.
READER QUESTION: "What is the difference between an IPO and a stock?"
WHY: autocomplete shows repeated demand ("what is an ipo vs stock", "ipo vs regular stock", "ipo vs shares which is better"); the page explains IPOs but never says how an IPO relates to a share of stock.
Answer in the first sentence: an IPO is an event, the first sale of a company's shares to the public, while a stock is the ownership share itself; after the IPO those same shares are ordinary stock that trades on the exchange. Then say what is different about buying at the IPO versus later. Do not repeat the lockup explanation in full. Link nothing internal. You may cite the SEC investor bulletin once, using the allowed URL as a markdown link.

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
- An IPO (initial public offering) is the first time a private company sells shares to the public and lists on a stock exchange.
- A stock is a share of ownership in a company. After the IPO, the company's shares trade on the exchange like any other public stock.
- The IPO price is set the night before trading begins, after a roadshow to large institutional investors gauges demand.
- Underwriters distribute most IPO shares to institutional and high-net-worth clients first, so most retail investors can only buy once the stock starts trading on the open market, often at a price already above the IPO price.
- Insiders and early investors typically sign a lockup agreement, most commonly 180 days.
- A newly public stock has little public trading history; the prospectus (filed with the SEC) discloses its finances and risks.

ALLOWED EXTERNAL URLS:
https://www.sec.gov/files/ipo-investorbulletin.pdf

REVISION NOTES (a first draft was rejected): Do not cite or name the SEC or any outside source; no links at all. Do not say underwriters allocate "the offering price". Say instead that the IPO price is set the night before trading begins, and that underwriters hand most of the shares to institutional and high-net-worth clients first, so most retail investors buy once trading opens, often above the IPO price. Keep to 70 to 120 words.
