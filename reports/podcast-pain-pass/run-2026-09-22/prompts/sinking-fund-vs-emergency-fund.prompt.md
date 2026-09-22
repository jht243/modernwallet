# ROW PROMPT — sinking-fund-vs-emergency-fund (comparison page, ModernWallet / themodernwallet.com)

## PAGE
- route: /compare/sinking-fund-vs-emergency-fund/
- slug: sinking-fund-vs-emergency-fund
- page type: comparison (JSON object for `src/data/comparisons.ts`)
- depth floor: 1500 words minimum across introText + comparisonTable framing + sections + verdict + faqs
- register: operator
- medium: text -> text
- optionA: Sinking Fund
- optionB: Emergency Fund
- updated: 2026-09-22

## KEYWORDS + INTENT
- primary keyword: sinking fund vs emergency fund
- secondary keywords (autocomplete-corroborated, DataForSEO 110/mo measured for the head phrase): sinking fund or emergency fund; sinking fund vs savings; how much should you have in a sinking fund
- intent: Decision intent — the reader has heard both terms and wants to know if they're the same thing, whether they need both, and how much to put in each.
- reader question: "is a sinking fund the same as an emergency fund, and do I need both?"

## FAQ SPEC — use these REAL autocomplete-mined questions, verbatim as `faqs[].question`
  1. Is a sinking fund the same as an emergency fund?
  2. Can I use my emergency fund as a sinking fund?
  3. How much should you have in a sinking fund?
  4. Should I build an emergency fund or a sinking fund first?
  5. Can you have more than one sinking fund at a time?
Answer each in 2-4 sentences, concretely, from the fact list only.

## SECTION COVERAGE (`sections[]`, noun-phrase Title Case headings)
1. What makes them different in practice, beyond the definition already stated in introText — a sinking fund targets a KNOWN expense with a KNOWN or estimated date (a car repair you can see coming, an annual premium, a vacation); an emergency fund covers an UNKNOWN, unplanned expense (job loss, a medical bill, an urgent car breakdown) and has no target date because you don't know when you'll need it.
2. Why mixing them in one account causes problems: if a planned expense and true emergencies share one pool, a big true emergency can wipe out money you already earmarked for a bill you know is coming (and vice versa) — separate, clearly labeled accounts avoid this.
3. Sizing each one: for the emergency fund, cite the Federal Reserve's Economic Well-Being of U.S. Households report on families' ability to cover an emergency expense, and CFPB emergency-savings research; for the sinking fund, there is no fixed target — the size is simply the goal's cost divided across the months until it's due (cite the CFPB's own worked method).
4. Order of operations — general, non-individualized framing: many people build a starter emergency fund first (covering at least one unplanned expense), then layer in sinking funds for known upcoming costs, then grow the emergency fund further. State this as a common approach, not a rule that applies to everyone, and point the reader to a financial advisor for their specific situation.
5. Where each lives: both work well in a separate, FDIC-insured savings account (cite FDIC), often literally in named sub-accounts at the same bank, kept apart from everyday checking so the money isn't spent by accident.

## OBJECTIVITY TABLE — comparisonTable rows (3-5 dimensions, at least one favoring each option)
- dimension: "What it's for" — a: "One specific known future expense" — b: "Any unplanned, unpredictable expense"
- dimension: "How you size it" — a: "Goal cost ÷ months until needed" — b: "A cushion of months of expenses, no fixed date"
- dimension: "When you can predict the need" — a: "Favors sinking fund — you already know the bill is coming" — b: "n/a — the whole point is you can't predict it"
- dimension: "Best for one-time irregular bills" — a: "Favors sinking fund — an annual premium, holiday spending" — b: "Not designed for a bill you can already see coming"
- dimension: "Best for a true unplanned crisis" — a: "Not designed for this — money may already be earmarked" — b: "Favors emergency fund — built for exactly this"
The verdict: most households benefit from BOTH, not a choice between them — name the condition (a reader with no cushion at all starts with a starter emergency fund first; a reader who already has that cushion but keeps getting surprised by predictable annual bills should add sinking funds next).

## INTERNAL LINKS YOU MAY USE (exact paths — no others)
- /budget/ — budget hub
- /budget/monthly-budget-calculator/ — monthly budget calculator
- /guides/how-much-emergency-fund/ — the site's existing emergency fund guide (3-6 months rule)
SIBLING PAGE SHIPPING IN THIS SAME RUN (safe to link):
- /guides/what-is-a-sinking-fund/ — the sinking fund explainer guide
(Do NOT link the page to itself.)

## `calculatorLinks` FIELD
- { label: "Monthly Budget Calculator", href: "/budget/monthly-budget-calculator/" }
- { label: "How Much Emergency Fund Do I Need?", href: "/guides/how-much-emergency-fund/" }

## `relatedComparisons`
- [] (no existing comparison page on this exact topic pair to relate to; leave empty)

## SOURCES
Populate `sources` with 2-4 entries drawn ONLY from the closed URL list below.

# CLOSED FACT LIST

**Anything not on this list, you do not know. Never invent a price, limit, benchmark, or URL.**

## CFPB guidance on saving toward a specific goal (source: CFPB, "You've got goals for your life—and some of them take money to achieve," consumerfinance.gov blog)
- The CFPB recommends breaking a savings goal into small regular increments and automating the transfer from checking to savings.
- Its own worked example: to save $1,000 for a vacation, save it as roughly $20 a week for 50 weeks, or find the equivalent through a recurring cost cut (its example: skipping a $5/day bought lunch).

## Emergency fund research (source: CFPB, "An Essential Guide to Building an Emergency Fund," consumerfinance.gov; and Federal Reserve, "Economic Well-Being of U.S. Households in 2024," federalreserve.gov)
- The CFPB frames an emergency fund as money set aside specifically to cover unplanned, unpredictable expenses.
- The Federal Reserve's annual Economic Well-Being of U.S. Households survey tracks how many adults say they could cover a hypothetical emergency expense using cash or its equivalent; cite this survey generally as the source for how common a savings shortfall is, without inventing a specific percentage not confirmed in your own research pass — if you cannot state an exact figure from this source with confidence, describe the finding qualitatively ("a meaningful share of U.S. adults report they could not easily cover an unexpected expense") rather than inventing a number.

## FDIC deposit insurance (source: FDIC, "Your Insured Deposits," fdic.gov)
- Deposits at an FDIC-insured bank are insured up to $250,000 per depositor, per insured bank, per account ownership category.

## Hard prohibitions
- No fabricated statistics or percentages not present in this fact list.
- No individualized financial advice on how much any specific reader should save; describe the general approach and defer to a licensed financial advisor for the reader's own situation.
- Neither option may be declared an unconditional winner — the verdict must state a condition.
