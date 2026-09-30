route: /guides/how-much-emergency-fund/
slug: how-much-emergency-fund--faq-too-much
page type: guide
medium: text -> text
reader question: "how much is too much for an emergency fund?" [autocomplete-confirmed sub-intent: "how much emergency fund is too much", "how much is too much emergency fund", "how much emergency fund is enough" all appear for this page's head term. The page explains how to size the fund and when to hold more or less, but never says when a fund has grown past what it needs to be.]

TASK: Write ONE new FAQ entry (question + answer only, no heading) to append to this page's `faqs` array. The question is: "How much emergency fund is too much?"

Answer directly: a fund is too large once it holds well past the top of the reader's own range, which this guide sets at 6 months of essential expenses for most people and 6 to 12 months for variable or self-employed income. Then give the mechanism using ONLY facts already on this page: the target is built on essential expenses, not income; cash kept in a savings account earns interest but is meant for safety and access, not growth; the guide warns against holding emergency money in stocks because they can fall when it is needed. So the practical test is to recompute the target from current essential expenses and compare it with the balance; anything above the personal target is money that can go toward other goals such as the sequence in the pay-off-debt-or-invest guide. End with the pointer to /guides/pay-off-debt-or-invest/.

CLOSED FACT LIST — the only claims this answer may state:
- The guide's target is 3 to 6 months of essential monthly expenses; 6 to 12 months for variable or self-employed income.
- Essentials are rent or mortgage, utilities, groceries, insurance, transportation and minimum debt payments; wants like dining out, travel and subscriptions are paused in a real emergency.
- Sizing the fund on gross income can nearly double the target for no reason.
- The fund belongs in an FDIC-insured high-yield savings account; stocks can drop right when an emergency hits, so they do not belong in it.
- A fund that is over-sized relative to the reader's own target is cash that could serve other goals; the order for sequencing those goals is covered in the pay-off-debt-or-invest guide.
Anything not on this list, you do not know. Do NOT state inflation rates, interest rates, yields, dollar thresholds beyond what is on this list, or any statistic.

CLOSED URL LIST: none — no external links.
Internal links allowed (markdown, real routes only): [whether to pay off debt or invest](/guides/pay-off-debt-or-invest/). At most once.

Output: a single FAQ answer, 3-4 sentences, in the page's existing FAQ-answer voice (direct answer first, then mechanism, then next step). Do not repeat the wording of the existing FAQs.
```json
{
  "question": "...",
  "answer": "..."
}
```

# CORRECTIONS FROM THE PHASE 4 AUDIT (regeneration 1)
- Defect: the answer was circular ("too much once it exceeds your target ceiling") and restated existing FAQs (gross-income sizing; FDIC/stocks placement). Rule: do NOT mention gross income, FDIC, high-yield savings placement or stocks. Structure in this order, one idea per sentence, each under 30 words: (1) the fund is too large once the balance is well past the top of your own range: 6 months of essential expenses for most households, 6 to 12 for variable or self-employed income; (2) the check: add up current essential expenses, multiply by your months, compare with the balance; (3) cash above that figure can go to other goals; (4) the link sentence to the pay-off-debt-or-invest guide. No semicolons.
