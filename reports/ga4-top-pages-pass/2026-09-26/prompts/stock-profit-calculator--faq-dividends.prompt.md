route: /investing/stock-profit-calculator/
slug: stock-profit-calculator--faq-dividends
page type: spoke/calculator
register: operator
medium: text -> text
reader question: "how do dividends affect my stock profit calculation?" [autocomplete-confirmed
sub-intent, distinct from any existing FAQ on this page: "stock profit calculator with dividends",
"stock gain calculator with dividends" — neither dividends nor dividend income appear anywhere on
this page's existing intro, howItWorks, commonMistakes, workedExample, or 6 FAQs, which all scope
strictly to buy/sell-price realized capital gain/loss plus commissions and holding-period tax
treatment]

TASK: Write ONE new FAQ entry (question + answer only, no heading) to append to this page's
existing `faqs` array. The question is: "Does this calculator include dividends I received while
holding the stock?"

Answer this directly: no, this calculator only measures the realized capital gain or loss between
your purchase price and sale price (plus commissions) — it does not add in any dividend income you
collected while holding the shares. State the mechanism plainly: dividends are a separate stream of
investment return from capital appreciation, so a reader who received dividends during the holding
period should add that cash total on top of this calculator's profit figure to see their true total
return. Mention, without inventing a new rate schedule, that ordinary (non-qualified) dividends are
taxed as ordinary income while qualified dividends receive the same preferential rates as long-term
capital gains — this is a well-established, generally known IRS distinction, not a page-specific
number, so state it as a general rule without citing a specific percentage.

CLOSED FACT LIST — the only claims this answer may state:
- This calculator's four inputs are: purchase price, sale price, share count, and commissions
  (buy-side and sell-side). It does not have a dividend input field. (Already established by the
  page's own tool inputs — see the .page.md file.)
- Realized capital gain/loss = net sale proceeds minus net purchase cost, per this page's existing
  `howItWorks` text — dividends are not part of that formula anywhere on this page.
- Dividends and capital gains are two separate components of total investment return.
- Qualified dividends are taxed at the same preferential rates as long-term capital gains;
  non-qualified (ordinary) dividends are taxed as ordinary income. State this as a general,
  well-established IRS rule — do NOT invent a specific bracket, percentage, or dollar threshold,
  since none is already published on this exact page.
Anything not on this list, you do not know. Never invent a number, rate, or threshold.

CLOSED URL LIST: none — do not add any link in this answer (it is a single FAQ answer field on an
existing page; do not introduce a new external citation not already on the page).

Internal links allowed: none (FAQ answer field is short plain text; do not add markdown links
inside it).

Output: a single FAQ answer, 2-4 sentences, in the page's existing FAQ-answer voice (see the voice
sample) — direct "no" answer first, then the mechanism (dividends are separate from this
calculator's capital-gain math), then the general qualified-vs-ordinary tax distinction. Do not
repeat the exact wording of the existing "Do I pay taxes on stock trading profit?" FAQ; this answer
is about dividends specifically, not the capital-gains holding-period rule already covered there.
