# ROW PROMPT — what-is-a-sinking-fund (guide page, ModernWallet / themodernwallet.com)

## PAGE
- route: /guides/what-is-a-sinking-fund/
- slug: what-is-a-sinking-fund
- page type: explainer (JSON object for `src/data/guides.ts`)
- depth floor: 1200 words minimum across introText + sections + faqs
- register: operator
- medium: text -> text
- updated date to use where the schema needs one: 2026-09-22

## KEYWORDS + INTENT
- primary keyword: sinking fund
- secondary keywords (DataForSEO volume, US, measured 2026-09-22): what is a sinking fund (5,400/mo); how does a sinking fund work (30/mo, autocomplete-corroborated); sinking fund meaning; what can a sinking fund be used for
- intent: Definitional + practical — the reader heard the term (this week's Better Budgeting Podcast episode "Discussing Sinking Funds With Connor Tyson") and wants to know what it is, how it differs from a regular savings account or emergency fund, and how to actually set one up and size it.
- reader question: "what is a sinking fund and how do I use one?"

## FAQ SPEC — use these REAL autocomplete-mined questions, verbatim as the `faqs[].question` values
  1. How does a sinking fund work?
  2. How is a sinking fund calculated?
  3. What can a sinking fund be used for?
  4. Can a sinking fund be invested?
  5. Is a sinking fund taxable?
  6. What is a healthy amount to have in a sinking fund?
Answer each in 2-4 sentences, concretely, from the fact list only. Do not invent additional FAQ questions.

## SECTION COVERAGE (each becomes one `sections[]` entry; noun-phrase Title Case headings; at most ONE heading may open with the primary keyword)
1. The direct answer up front (this is also sentence 1 of introText, operator register, tee-up allowed as sentence 2 per VOICE): a sinking fund is money set aside a little at a time, on purpose, for one specific known future expense — car repair, holiday spending, an annual insurance premium, a big purchase — so the full cost never hits as a surprise.
2. How a sinking fund actually works, mechanically: pick the specific goal and its total cost, pick the date you need the money by, divide to get a monthly (or weekly) amount, and move that amount automatically into a separate account each pay period. Cite the CFPB's guidance on breaking a savings goal into small regular amounts and automating transfers.
3. Sinking fund vs a general savings account vs an emergency fund, in one short paragraph (NOT the full comparison — that lives on the dedicated /compare/sinking-fund-vs-emergency-fund/ page, which you must link here) — the short version: a sinking fund is earmarked for ONE known expense with a deadline; a general savings account has no target; an emergency fund is for the UNKNOWN.
4. Where to actually keep a sinking fund: a separate account (many banks let you open multiple named savings accounts, or use sub-accounts/"buckets") so the money is out of sight from everyday checking, ideally an FDIC-insured deposit account. Cite the FDIC on deposit insurance coverage.
5. How to calculate the monthly amount, worked example: a reader wants $1,200 for a known annual insurance premium due in 10 months. $1,200 / 10 = $120/month. Show the CFPB's own worked pattern (breaking a goal into daily/weekly/monthly increments) as the model, using the CFPB's own vacation example numbers as illustration of the METHOD, and then apply the SAME method to the insurance-premium example.
6. What people commonly fund with a sinking fund: car maintenance/repair, holiday and gift spending, annual or semi-annual insurance premiums, property tax bills, a planned home repair, an annual subscription paid yearly to save money, a wedding or vacation with a known date.
7. Common mistakes: treating the sinking fund like free spending money, mixing multiple goals into one account without labels, not automating the transfer (relying on willpower), or building a sinking fund before an emergency fund exists (address the order of operations without giving individualized advice — describe general priority, mention that a licensed financial advisor can help sequence goals for a specific situation).
8. Is a sinking fund taxable? Only the interest earned, if any, in the same way interest on any bank deposit account is generally taxable income; the principal you set aside was already-taxed money you're relocating, not new income. State this generally and tell the reader to confirm their own situation with a tax professional.
9. Close on the concrete next action: naming a specific first sinking fund to start (the reader's next known bill) and linking to the site's budget calculators to find the room in a monthly budget.

## INTERNAL LINKS YOU MAY USE (exact paths — no others, never invent one)
- /budget/ — the budget hub
- /budget/monthly-budget-calculator/ — monthly budget calculator
- /budget/50-30-20-budget-calculator/ — 50/30/20 budget calculator
- /budget/zero-based-budget-calculator/ — zero-based budget calculator
- /guides/how-much-emergency-fund/ — the site's existing emergency fund guide
- /compare/debt-snowball-vs-avalanche/ — debt payoff strategy comparison
SIBLING PAGE SHIPPING IN THIS SAME RUN (safe to link):
- /compare/sinking-fund-vs-emergency-fund/ — the dedicated sinking fund vs emergency fund comparison
(Do NOT link the page to itself.)

## `tools` FIELD (guide pages only)
Pick 2-3 from: /budget/monthly-budget-calculator/, /budget/50-30-20-budget-calculator/, /budget/zero-based-budget-calculator/. Use the exact href and a short human label.

## SOURCES
Populate `sources` with 2-4 entries drawn ONLY from the closed URL list below.

# CLOSED FACT LIST

**Anything not on this list, you do not know. Never invent a price, limit, benchmark, or URL; say it is unpublished and tell the reader to verify at the primary source.**

## CFPB guidance on saving toward a specific goal (source: CFPB, "You've got goals for your life—and some of them take money to achieve," consumerfinance.gov blog)
- The CFPB recommends breaking a savings goal into small, regular increments rather than trying to save the full amount at once.
- Its own worked example: to save $1,000 for a vacation, you could save it as roughly $20 a week for 50 weeks, or roughly $2.74 a day, or by cutting a recurring cost (its example: bringing lunch from home instead of buying it for about $5 a day).
- The CFPB recommends setting up automatic transfers from checking to savings so the saving does not depend on remembering to do it manually each period.
- The CFPB also recommends accountability mechanisms — phone reminders, or telling another person about the goal — to keep the habit going.
- **Use this as the MODEL for the METHOD (goal amount / time until needed = periodic savings amount), not as a claim that this site advises a $1,000 vacation fund specifically.**

## FDIC deposit insurance (source: FDIC, "Your Insured Deposits," fdic.gov)
- Deposits at an FDIC-insured bank are insured up to **$250,000 per depositor, per insured bank, for each account ownership category**.
- FDIC insurance is automatic at an FDIC-insured bank and covers principal plus accrued interest through the date of a bank's closing, up to the limit.
- A depositor can qualify for coverage above $250,000 by holding accounts in different ownership categories (e.g., individual vs. joint) at the same bank, or by spreading deposits across separately chartered banks.

## Tax treatment (general, non-advice)
- Interest earned on a bank savings deposit is generally taxable income in the year it is earned or credited; the account holder does not owe tax on the principal amount they set aside, since that money was already earned/taxed income being relocated, not new income.
- **Do not give the reader a specific tax rate or a specific IRS form number for interest income; this fact list does not carry one. State the general principle only and direct the reader to a tax professional (CPA or enrolled agent) for their own filing.**

## Hard prohibitions
- No fabricated statistics (no invented "X% of Americans have a sinking fund" claim — that figure is not on this list).
- No individualized financial, investment, or tax advice. Describe the mechanics and let the reader apply them; direct them to a licensed financial advisor or CPA for advice specific to their situation.
- No claim that a sinking fund guarantees anything, or that skipping an emergency fund in favor of sinking funds is safe for everyone.
