route: /guides/how-much-emergency-fund/
slug: how-much-emergency-fund--faq-household
page type: guide
medium: text -> text
reader question: "how much emergency fund should a couple or a family of 4 have?" [autocomplete-confirmed sub-intents for this page's head term: "how much emergency fund for a couple", "how much emergency fund should a family of 4 have", "how much emergency fund for family of 4", "how much of an emergency fund should a couple have", "how much emergency fund should a person have", "how much emergency fund for single person". The page covers one-income and two-income households only in passing and never answers the household-size question.]

TASK: Write ONE new FAQ entry (question + answer only, no heading) to append to this page's `faqs` array. The question is: "How much emergency fund should a couple or a family have?"

Answer directly: there is no separate number by household size; the same 3 to 6 months of essential expenses applies, but essential expenses and income risk both change with the household. Then use ONLY facts on this page: a two-income household with both paychecks steady can sit near 3 months because one paycheck still covers part of the bills if the other is lost; a sole earner supporting a family should lean toward 6 months or more because more people depend on one income; essential expenses should be added up for the whole household (rent or mortgage, utilities, groceries, insurance, transportation, minimum debt payments) and multiplied by the months chosen. Mention the $3,000-a-month worked example only as the page states it ($9,000 at 3 months, $18,000 at 6 months) to show the method, not as a household benchmark. End with a pointer to /budget/monthly-budget-calculator/ to total household essentials.

CLOSED FACT LIST — the only claims this answer may state:
- The guide's target is 3 to 6 months of essential monthly expenses, not income.
- A stable two-income household can aim near the low end; if one partner loses a job the other paycheck still covers part of the bills.
- A single earner, and especially a sole earner for a family, should lean toward 6 months or more because more people depend on one income.
- Essentials are rent or mortgage, utilities, groceries, insurance, transportation and minimum debt payments.
- Worked example on the page: $3,000 a month of essentials gives $9,000 at 3 months and $18,000 at 6 months.
Anything not on this list, you do not know. Do NOT state a dollar figure for a household size, a national average, or any statistic. Do NOT give a number of months for a couple or family other than the 3 to 6 range and the lean-toward-6-or-more guidance above.

CLOSED URL LIST: none — no external links.
Internal links allowed (markdown, real routes only): [monthly budget calculator](/budget/monthly-budget-calculator/). At most once.

Output: a single FAQ answer, 3-4 sentences, in the page's existing FAQ-answer voice (direct answer first, then mechanism, then next step). Do not repeat the wording of the existing FAQs.
```json
{
  "question": "...",
  "answer": "..."
}
```

# CORRECTIONS FROM THE PHASE 4 AUDIT (regeneration 1)
- Defect 1: "one paycheck continues if work is lost" overstated the fact. Use exactly: the other paycheck still covers part of the bills.
- Defect 2: one 50-word sentence with a semicolon. Split: (a) add up household essentials (list them) and multiply by your months; (b) "For example, if your household's essentials total $3,000 a month, 3 months is $9,000 and 6 months is $18,000." (example framing only, never a household benchmark); (c) the link sentence. No semicolons, every sentence under 30 words.
