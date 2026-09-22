# ROW PROMPT — am-i-saving-too-much-for-retirement (guide page, ModernWallet / themodernwallet.com)

## PAGE
- route: /guides/am-i-saving-too-much-for-retirement/
- slug: am-i-saving-too-much-for-retirement
- page type: explainer (JSON object for `src/data/guides.ts`)
- depth floor: 1200 words minimum across introText + sections + faqs
- register: operator
- medium: text -> text
- updated date to use where the schema needs one: 2026-09-22

## KEYWORDS + INTENT
- primary keyword: am i saving too much for retirement
- secondary keywords (DataForSEO volume, US, measured 2026-09-22): am i saving too much for retirement (210/mo); how much is too much to save for retirement (30/mo); can you over save for retirement
- intent: Reassurance/decision intent — this week's Catching Up to FI episode ("The Biggest Retirement Mistake: Over Saving and Under Living") anchors this directly. The reader is already saving a lot and wants to know if there's such a thing as too much, and what signs would tell them.
- reader question: "is it possible to save too much for retirement, and how would I know?"

## FAQ SPEC — use these REAL autocomplete-mined questions, verbatim as `faqs[].question`
  1. Can you save too much for retirement?
  2. How do I know if I'm saving too much for retirement?
  3. Why do people save so much for retirement?
  4. What is the downside of over-saving for retirement?
  5. Am I saving enough for retirement?
Answer each in 2-4 sentences, concretely, from the fact list only.

## SECTION COVERAGE (each becomes one `sections[]` entry; noun-phrase Title Case headings; at most ONE heading may open with the primary keyword)
1. The direct answer up front (sentence 1 of introText, operator register): yes, it is possible to save so aggressively for retirement that you meaningfully under-live today — the tradeoff is real spending, time, and experiences now, traded for a balance you may not spend down as planned.
2. What "too much" usually looks like in practice: maxing out every available account well beyond what a realistic retirement budget requires, delaying things you can clearly afford (a needed home repair, seeing family, health care you're putting off) to hit a savings number, or having no plan at all for what you're saving toward.
3. The 2026 numbers that anchor a "how much am I actually putting away" gut check: the 401(k)/403(b)/governmental 457/TSP employee deferral limit is $24,500 for 2026; the age-50+ catch-up is $8,000 (so $32,500 total); the special age 60-63 catch-up is $11,250 (so $35,750 total); the combined employee-plus-employer 401(k) limit is $72,000 ($80,000 with the 50+ catch-up, $83,250 with the 60-63 catch-up); the IRA limit is $7,500. Cite IRS directly. Frame this as context for what "maxing out" costs per year, not as a target everyone should hit.
4. A framework for checking your own number, described generally and NOT as personalized advice: Fidelity's widely-used age-based savings guideline (aim for roughly 1x salary saved by 30, 3x by 40, 6x by 50, 8x by 60, 10x by 67), paired with its 15%-of-income annual savings-rate guideline. Present this as one commonly used yardstick, not the only correct one, and note it assumes retiring around 67. Tell the reader that if they're already well past these markers and still maximizing every available account while skipping current-life spending, that combination is the actual signal worth examining with an advisor — not a specific dollar figure this page can hand them.
5. The under-living tradeoff: money saved today is spending, time, and experience given up today; delaying necessary or enjoyable spending in your 30s, 40s, and 50s to hit a number doesn't get refunded if it turns out you saved more than you needed. State this as a general tradeoff, not a claim about any specific reader.
6. What actually changes the math (what would change this framing): a much higher or lower expected retirement age, a pension or other guaranteed income reducing what you need saved, health or longevity in your family history, and how you actually plan to spend down savings (the withdrawal side) — Fidelity's own general guidance suggests limiting withdrawals to roughly 4% to 5% of the initial balance, adjusted for inflation, as one commonly used starting point, again not a personalized number.
7. What this is NOT saying: this page is not telling any specific reader to save less — someone with no pension, poor health-cost visibility, or a shorter work history may reasonably want a bigger cushion. Who this is not for: readers who are behind on retirement savings, carry high-interest debt, or have no emergency fund yet — for them, "saving too much" is not the live risk. State plainly what they should do instead: prioritize the emergency fund and high-interest debt first.
8. Close on the concrete next action: naming that the honest way to know if your own number is right is running your actual expected spending against your actual savings trajectory with a fee-only financial planner or CFP, since this page can describe the tradeoff but not calculate a personal answer. Link to the site's retirement income and FIRE calculators as the tools to start that math.

## INTERNAL LINKS YOU MAY USE (exact paths — no others, never invent one)
- /retirement/ — retirement hub
- /retirement/retirement-income-calculator/ — retirement income calculator
- /retirement/retirement-savings-calculator/ — retirement savings calculator
- /retirement/fire-calculator/ — FIRE calculator
- /guides/how-much-do-i-need-to-retire-by-age/ — the site's existing "how much do I need to retire" guide (answers the OPPOSITE question — am I saving enough — link it as the companion piece)
- /guides/how-much-emergency-fund/ — emergency fund guide (for the "who this is not for" section)
(No siblings shipping in this same run for this page.)

## `tools` FIELD (guide pages only)
Pick 2-3 from: /retirement/retirement-income-calculator/, /retirement/retirement-savings-calculator/, /retirement/fire-calculator/.

## SOURCES
Populate `sources` with 2-4 entries drawn ONLY from the closed URL list below.

# CLOSED FACT LIST

**Anything not on this list, you do not know. Never invent a rate, limit, or return. Say it is unpublished and defer to a professional.**

## 2026 IRS retirement contribution limits (source: IRS newsroom, "401(k) limit increases to $24,500 for 2026, IRA limit increases to $7,500," irs.gov; and IRS "Retirement topics - 401(k) and profit-sharing plan contribution limits," irs.gov)
- 401(k)/403(b)/governmental 457/Thrift Savings Plan **employee deferral limit for 2026: $24,500**.
- **Age 50+ catch-up contribution for 2026: $8,000** (total $32,500 for those 50+, except the special 60-63 bracket below).
- **Special age 60, 61, 62, 63 catch-up for 2026: $11,250** (total $35,750 for that age bracket), under a provision from SECURE 2.0.
- **Combined employee-plus-employer annual additions limit (IRC §415(c)) for 2026: $72,000** base; **$80,000 including the standard 50+ catch-up**; **$83,250 for the age 60-63 bracket**.
- **IRA contribution limit (traditional, Roth, or combined) for 2026: $7,500**, up from $7,000.

## Fidelity's age-based retirement savings guideline (source: Fidelity, "Retirement guidelines," fidelity.com)
- Fidelity's published savings-factor guideline: aim to have saved roughly **1x your salary by age 30, 3x by 40, 6x by 50, 8x by 60, and 10x by age 67**.
- Fidelity recommends saving **at least 15% of pre-tax income per year, including any employer match**.
- Fidelity's withdrawal guidance: **limit withdrawals to roughly 4% to 5% of the initial retirement balance**, then adjust that dollar amount for inflation in later years.
- These guidelines assume a retirement age of 67 and are Fidelity's own published planning assumptions, not a guarantee or personalized recommendation — always attribute them to Fidelity and frame them as one commonly used yardstick.

## Hard prohibitions
- No invented statistic, survey figure, or percentage not on this list.
- No individualized investment, tax, or retirement advice. Describe the general tradeoff and the general yardsticks; tell the reader to work with a fee-only financial planner or CFP for their own number.
- Never state or imply a guaranteed investment return.
- Never tell a specific category of reader (e.g., "someone with $2 million") what to do — only describe the general framework and who it is not for.
