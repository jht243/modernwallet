---
mindmap_pass_date: 2026-11-25
source: "reports/mindmap-pass/2026-11-25-tool-usage-brief.md"
interpreted_brief: "Caller tool-usage-mindmap-auto for themodernwallet.com (48 days tracked, 5 picked tools). Fix the stale 2027 Medicare Part B premium on the Social Security COLA calculator and the calculator/guide FAQs that repeat it (CMS final: $209.40, deductible $292); restore the missing book picks under the couples retirement calculator; make the IRS mileage rate page lead rate-seekers to its tool with larger phone tap targets; build up to three next-job calculators (SEP IRA/solo 401(k) contribution, Social Security W-4V withholding, capital loss carryover). Investing and portfolio were walked with no friction."
status: ready-for-approval
---

# Content approval plan

## Action chart

| Problem | Solution | Bucket | Target (file or route) | Format | Best medium | Resolved deliverable | SERP verdict | SERP evidence | Reader question | Answer | Answer placement | ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| social-security-cola-calculator (241 people, 271 uses, 595 views; 48 days tracked). Persona walkthrough 2026-11-25 at 1366px + 390px: retiree, benefit $1,850, still told the 2027 Part B premium 'has not been announced' and offered the $209.50 Trustees projection although CMS announced the final standard premium on 2026-11-17: $209.40, up $6.50 from $202.90, deductible $292 (CMS fact sheet, saved research/sources/cms-2027-partb.txt; Federal Register 2026-23601). lookup: /social-security-cola-calculator/ - same reader (net January 2027 deposit), existing tool being corrected, not a new page. Evidence: reports/tool-usage-pass/2026-11-25/personas/social-security-cola-calculator.md | In SocialSecurityColaCalculator.tsx (and the constants in social-security-cola.ts) replace the 'projected $209.50' button and the hint at line 58 with a 'Use the final 2027 standard premium, $209.40' button and a hint that the standard premium is $209.40 (CMS, Nov 17 2026), higher-income IRMAA enrollees pay more and should enter the amount on their notice; keep the 2026 $202.90 default, the zero option and every field/mode; data-tool root unchanged. Worked example for the row: benefit $1,850 x 1.036 = $1,917 gross (rounded per SSA), minus $209.40 = $1,707.60 net deposit. | update existing body text | /social-security-cola-calculator/ | tool fix | interactive tool | interactive tool | unread | tool-fix row backed by real usage; no SERP read needed (volume never vetoes a tool fix) | What will my January 2027 Social Security check be after the Part B premium? [persona walkthrough 2026-11-25 at 1366px + 390px and tracked usage; no GSC access; DataForSEO '2027 medicare part b premium' 5,400/mo, AI Overview cites cms.gov] | Gross raise at 3.6% minus the final $209.40 standard Part B premium (figure; IRMAA payers enter their own). | calculator premium button and hint, next to the Part B field | F1 |
| Same stale fact in the social-security-cola-calculator entry of calculators.ts: howItWorks (line ~2651) says the Part B field defaults to zero 'because the 2027 premium has not been announced' and the FAQ 'Does the calculator include the 2027 Medicare Part B premium?' (line ~2675) answers 'No, because the 2027 Part B premium has not been announced'. lookup: same route as F1. Evidence: CMS fact sheet. | Targeted edit of those two strings (via content_gen.py section, since longer than one sentence) to state that CMS announced $209.40 on 2026-11-17 and the calculator offers it as a one-click value, that the field still defaults to the 2026 $202.90, IRMAA enrollees enter their own, and that the SSA notice in my Social Security shows the exact figure; cite CMS first use; bump page updated date. | update existing body text | /social-security-cola-calculator/ | article section | text | text | unread | tool-fix row backed by real usage; no SERP read needed (volume never vetoes a tool fix) | Does the calculator include the 2027 Medicare Part B premium? [PAA none for this head; question taken from the page's own FAQ] | Yes: one click applies the CMS final $209.40 standard premium; higher-income enrollees enter their own. | FAQ answer and howItWorks paragraph | F2 |
| Stale sentences on four live guides (this row: slug 2027-social-security-cola, ~L4926 'Medicare has not announced', ~L4942 and FAQ ~L4990 'Trustees Report projects $209.50'; sibling rows F5-F7 cover the other three slugs) (verified by grep 2026-11-25): guides.ts slug 2027-ssdi-cola (body ~L4444, FAQ ~L4496: 'has not been announced'), ssi-increase-2027 (~L4554), social-security-changes-2027 (~L4632), 2027-social-security-cola (~L4926 'Medicare has not announced', ~L4942 and FAQ ~L4990 'Trustees Report projects $209.50'). All contradict the CMS Nov 17 2026 announcement ($209.40). lookup: existing guides, factual correction only (no new page). | Replace each stale sentence with the final CMS figure and citation ($209.40 standard premium, +$6.50, deductible $292), recompute the example net gains that used $209.50 (e.g. $2,000 check: +$72 gross raise minus $6.50 premium increase = $65.50), keep every other word, metadata and URL; bump updated dates. The 2026-only $202.90 sentences and the Trustees-report solvency sentences are correct and stay. | update existing body text | /guides/2027-social-security-cola/ | article section | text | text | unread | tool-fix row backed by real usage; no SERP read needed (volume never vetoes a tool fix) | How much will Medicare Part B cost in 2027? [PAA none returned; DataForSEO '2027 medicare part b premium' 5,400/mo KD 0; AI Overview cites cms.gov, unitedmedicareadvisors.com] | $209.40 a month for the standard premium, $6.50 more than 2026, with a $292 deductible (CMS). | FAQ and COLA-net sections of the four guides, existing slots | F3 |
| Stale 2027 Part B sentence on a live guide (verified by grep 2026-11-25): slug 2027-ssdi-cola: body ~L4444 and FAQ ~L4496 say the 2027 Part B premium 'has not been announced'. Contradicts the CMS Nov 17 2026 announcement ($209.40). lookup: existing guide, factual correction only (no new page). | Replace the stale sentence(s) with the final CMS figure and citation ($209.40 standard premium, +$6.50, deductible $292); recompute any example that used a projected premium; keep every other word, metadata and URL; bump the updated date. | update existing body text | /guides/2027-ssdi-cola/ | article section | text | text | unread | tool-fix row backed by real usage; no SERP read needed (volume never vetoes a tool fix) | Will the 2027 Medicare Part B premium change my net raise? [PAA none returned; DataForSEO '2027 medicare part b premium' 5,400/mo; AI Overview cites cms.gov] | The standard Part B premium is $209.40 for 2027, $6.50 more than 2026, so net raise = COLA raise minus the increase (CMS). | FAQ and COLA-net sections of the four guides, existing slots | F5 |
| Stale 2027 Part B sentence on a live guide (verified by grep 2026-11-25): slug ssi-increase-2027: ~L4554 'The 2027 Medicare Part B premium has not been announced'. Contradicts the CMS Nov 17 2026 announcement ($209.40). lookup: existing guide, factual correction only (no new page). | Replace the stale sentence(s) with the final CMS figure and citation ($209.40 standard premium, +$6.50, deductible $292); recompute any example that used a projected premium; keep every other word, metadata and URL; bump the updated date. | update existing body text | /guides/ssi-increase-2027/ | article section | text | text | unread | tool-fix row backed by real usage; no SERP read needed (volume never vetoes a tool fix) | Will the 2027 Medicare Part B premium change my net raise? [PAA none returned; DataForSEO '2027 medicare part b premium' 5,400/mo; AI Overview cites cms.gov] | The standard Part B premium is $209.40 for 2027, $6.50 more than 2026, so net raise = COLA raise minus the increase (CMS). | FAQ and COLA-net sections of the four guides, existing slots | F6 |
| Stale 2027 Part B sentence on a live guide (verified by grep 2026-11-25): slug social-security-changes-2027: ~L4632 'The 2027 Medicare Part B premium has not been announced'. Contradicts the CMS Nov 17 2026 announcement ($209.40). lookup: existing guide, factual correction only (no new page). | Replace the stale sentence(s) with the final CMS figure and citation ($209.40 standard premium, +$6.50, deductible $292); recompute any example that used a projected premium; keep every other word, metadata and URL; bump the updated date. | update existing body text | /guides/social-security-changes-2027/ | article section | text | text | unread | tool-fix row backed by real usage; no SERP read needed (volume never vetoes a tool fix) | Will the 2027 Medicare Part B premium change my net raise? [PAA none returned; DataForSEO '2027 medicare part b premium' 5,400/mo; AI Overview cites cms.gov] | The standard Part B premium is $209.40 for 2027, $6.50 more than 2026, so net raise = COLA raise minus the increase (CMS). | FAQ and COLA-net sections of the four guides, existing slots | F7 |
| retirement (188 people, 228 uses, 495 views). Persona walkthrough 2026-11-25: married couple, phone, got 'On track' and found no next step; no data-tool-picks block renders although the 2026-10-14 ledger says it shipped. Verdict fit, books only (YMYL). Evidence: personas/retirement.md. lookup: existing tool route /retirement/couples-retirement-calculator/. | Render <ToolPicks> (tag soulcircle01-20 via the site helper, rel sponsored nofollow noopener noreferrer, disclosure line, data-tool-picks=retirement) under the result after the answer and any planning caveat. Ranked product types: 1 household retirement-planning book: Retirement Planning Guidebook, Wade Pfau (ASIN 1945640197); 2 withdrawal/decumulation book: How to Make Your Money Last, Jane Bryant Quinn (1982115831); 3 investing-basics book: The Bogleheads' Guide to Investing (1119847672). Tier mapping: 'On track' and 'Behind' both show the three picks in this order, with 'Behind' leading with the Pfau guidebook; ASINs are exactly those returned by amazon_pick.py (research/amazon-picks-retirement.txt); 'Couples and Money' (0553057464, 1990 edition) rejected as not current. No price/rating text stored. | update existing body text | /retirement/couples-retirement-calculator/ | tool monetize | interactive tool | interactive tool | unread | tool-monetize row backed by real usage; no SERP read needed | What should my couple read next now that the calculator says we are on track? [persona walkthrough 2026-11-25; usage data; no GSC access] | Three current books matched to the result, after the answer, never replacing a financial adviser (list). | below the result panel, after the answer | M1 |
| mileage-deduction (77 people, 77 uses, 1,762 views, use_rate 4.4%). Persona 2026-11-25: freelance driver, phone, searched 'IRS mileage rate 2026'; reads the rate in the intro and never scrolls to the tool (~750px down); 6 controls under 36px tall at 390px. SERP read 'mileage rate 2026': winnable, AI Overview cites irs.gov, top10 includes irs.gov x2. lookup: existing route /mileage-deduction/irs-mileage-rate-2026/. | Add one 'Estimate your deduction' jump link (anchor to the [data-tool=mileage-deduction] root) in the intro right after the rate answer, and raise the rate buttons (toggleBtnSm padding) and checkbox row to min-height 40px on phones in MileageDeductionCalculator.tsx; additive only, no change to URL, title, meta description or H1, data-tool root unchanged. | update existing body text | /mileage-deduction/irs-mileage-rate-2026/ | tool fix | interactive tool | interactive tool | unread | tool-fix row backed by real usage; no SERP read needed (volume never vetoes a tool fix) | What is the IRS mileage rate for 2026 and what will it save me? [PAA 3/6 on-topic: how to calculate mileage in 2026, what are the IRS mileage rates for 2026, can I deduct both mileage and gas; ac not run] | The two 2026 business rates (72.5c then 76c per mile), then a one-tap path to your own deduction. | intro, directly after the rate answer | F4 |
| lookup: /compare/sep-ira-vs-solo-401k - reader intent: choose between two plans, not compute own maximum; /guides/401k-contribution-limits-2026 and /guides/ira-contribution-limits-2026 - generic limits for employees. No calculator. Persona next job: freelance delivery driver (mileage-deduction persona, self-employment-tax seed) asking after SE tax how much she can shelter. Demand (DataForSEO 2026-11-25, us, measured): solo 401k contribution calculator 720/mo KD 3; sep ira contribution calculator 480 KD 3; sep ira calculator 720 KD 0; solo 401k contribution limit 4,400 KD 14. | Create /sep-ira-solo-401k-contribution-calculator/ [calculator]: inputs net self-employment profit, tax year (2026 or 2027), age 50+/60-63 flag, optional W-2 deferrals elsewhere; outputs SEP max, solo 401(k) employee + employer max (Pub 560 reduced-rate method: 20% of net earnings after half of SE tax) and which plan allows more at this income, cap warnings. Client-side, deterministic, reuses the existing self-employment-tax lib. | create new content | /sep-ira-solo-401k-contribution-calculator/ | calculator | interactive tool | interactive tool | winnable (AI Overview) | SERP 'sep ira contribution calculator': winnable; AI Overview present, cites fidelity.com, sofi.com, jupid.com, irs.gov; page one is small calculator sites (ezretirementcalculator.com, pensiondeductions.com, gigtaxtools.com), ttlc.intuit.com, youtube.com; not forum-dominated | How much can I put into a SEP IRA or solo 401(k) as a self-employed person? [PAA 1/6 on-topic: 'How much am I allowed to contribute to my SEP IRA?'; ac 4/14 how-is-calculated/limit questions; PAA 5/6 off-topic retirement-saving generics] | Roughly 20% of net earnings after half of SE tax for a SEP, and the same plus the $25,500 (2027) employee deferral for a solo 401(k), capped at $75,000 (figure); on $100,000 profit that is $18,587 for a SEP and $44,087 for a solo 401(k). | section 1: calculator results panel and intro worked example | C1 |
| lookup: no same-intent page; nearest /social-security-taxable-benefits-calculator/ (how much of benefits is taxable, existing tool, no W-4V step; its 2026-11-04 persona flagged 'no withholding next step') and /guides/states-that-tax-social-security (states). Persona next job: retiree 70 finishing the COLA/taxable-benefits calculators. Demand (DataForSEO measured): social security tax withholding calculator 720/mo KD 31; social security withholding calculator 720 KD 28; withhold tax from social security 2,400 KD 22; w-4v 1,600 KD 17. | Create /social-security-withholding-calculator/ [calculator]: inputs monthly benefit, filing status, other income, optional existing withholding; outputs estimated taxable benefits and federal tax (reuses the existing Social Security taxable-benefits lib, Pub 915), then compares the four allowed W-4V rates (7%, 10%, 12%, 22% of each payment) by yearly withholding vs estimated tax and names the rate that comes closest without falling short, with the SSA/IRS filing steps. | create new content | /social-security-withholding-calculator/ | calculator | interactive tool | interactive tool | winnable (AI Overview) | SERP 'social security tax withholding calculator': winnable; AI Overview cites irs.gov, ssa.gov, staffmarket.com; page one is softonic, voxluci.com, calcxml.com, ttlc.intuit.com; not forum-dominated; no W-4V rate comparison seen | How much federal tax should I withhold from my Social Security benefit (Form W-4V)? [PAA 1/6 on-topic: 'How is Social Security withholding calculated?'; ac 14 how/can/does questions on submitting W-4V; 5/6 PAA off-topic] | Estimate your tax on the benefit, then pick the W-4V rate (7, 10, 12 or 22% of each payment) whose yearly total is closest to it without falling short; no other percentage or amount is allowed (IRS Form W-4V). | section 1: calculator results panel plus the four-rate comparison | C2 |
| lookup: no existing page for the intent (coverage_lookup: no possible home); closest /guides/tax-loss-harvesting (how harvesting works, not a multi-year carryforward schedule) and /stock-capital-gains-tax-calculator/ (tax on a sale; its 2026-11-04 persona flagged 'loss result had no numbers'). Persona next job: DIY investor with a big realized loss. Demand (DataForSEO measured): capital loss carryover 2,400/mo KD 9; capital loss carryforward 2,400 KD 10; capital loss carryover calculator 30 KD 2 (thin, flagged); ac: how is capital loss carryover calculated, how much capital loss carryover can i use. | Create /capital-loss-carryover-calculator/ [calculator]: inputs short- and long-term gains/losses this year, filing status (MFS limit), prior carryover, expected future annual gains; outputs net result, the $3,000 ($1,500 MFS) deduction against other income, carryforward with short-term loss absorbed first, and a year-by-year schedule until used. Client-side only; reuse the stock-capital-gains lib patterns. | create new content | /capital-loss-carryover-calculator/ | calculator | interactive tool | interactive tool | winnable (AI Overview) | SERP 'capital loss carryover calculator': winnable; AI Overview present with no cited domains; page one is xltemplates.org, finfriend.work, simms-accounting.com, ttlc.intuit.com, youtube.com; not forum-dominated | How much of my stock losses can I deduct this year and carry forward? [PAA 2/6 on-topic: 'How do I find out if I have capital loss carryover?', 'What are the rules for carry forward of losses?'; ac 14 how/what questions; 4/6 PAA tax-rate off-topic] | Losses first cancel gains; a net loss deducts at most $3,000 ($1,500 married filing separately) against other income and the rest carries forward indefinitely (IRS Topic 409); a $50,000 net loss with no gains takes about 16 years to use. | section 1: calculator results and year-by-year schedule | C3 |
| Inbound links to the SEP/solo 401(k) calculator are missing (new route). | Add 'How much can you shelter in a SEP or solo 401(k)?' to the self-employment-tax and mileage-deduction cross-link lists and to the SEP-IRA vs Solo 401(k) comparison body. | add internal links | /self-employment-tax/ | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | L1 |
| Inbound links to the W-4V withholding calculator are missing (new route). | Add 'Withhold tax from your benefit (W-4V)' to the cross-link lists of social-security-taxable-benefits-calculator and social-security-cola-calculator. | add internal links | /social-security-taxable-benefits-calculator/ | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | L2 |
| Inbound links to the capital loss carryover calculator are missing (new route). | Add 'Have a loss? See what carries forward' to the stock-capital-gains-tax-calculator cross-link list and to the tax-loss-harvesting guide. | add internal links | /stock-capital-gains-tax-calculator/ | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | L3 |

## Original request and acceptance

Turn real tool usage into corrected, monetized and next-step tools: fix what blocked each persona, restore book picks, and ship at most three new client-side calculators with primary-source rates, without removing any tool or page.

- **id:** REQ-1
**description:** Replace the stale 'not announced' 2027 Part B premium with the CMS final $209.40 on the COLA calculator (button + hint), calculators.ts FAQ/howItWorks and the stale guide FAQ/body sentences; keep every field and mode.
**acceptance:** Calculator shows a $209.40 final-premium button with an IRMAA hint; no 'has not been announced' or '$209.50 projection' sentence remains in the 2027 COLA/SSDI/SSI/social-security-changes content; CMS cited.
**actionIds:** - F1
- F2
- F3
- F5
- F6
- F7
- **id:** REQ-2
**description:** Restore the data-tool-picks book block under the couples retirement calculator result with 3+ book types, ASINs only from amazon_pick.py output, tag soulcircle01-20.
**acceptance:** Live result shows 3+ book picks with disclosure after computing; ASINs match research/amazon-picks-retirement.txt.
**actionIds:** - M1
- **id:** REQ-3
**description:** On the IRS mileage rate 2026 page add an 'Estimate your deduction' jump link near the rate answer and raise rate-button/checkbox tap targets to at least 40px on phones; additive only.
**acceptance:** Link anchors to the tool root; all rate buttons and the checkbox measure >=40px at 390px.
**actionIds:** - F4
- **id:** REQ-4
**description:** Build at most 3 new client-side calculators from the spec backlog (SEP IRA/solo 401(k) contribution, Social Security W-4V withholding, capital loss carryover) with every rate/limit cited to IRS/SSA primary sources, and link each from its seed tool.
**acceptance:** Three routes live with data-tool roots, cited limits, worked examples that match the evidence packets, and at least 2 inbound links each.
**actionIds:** - C1
- C2
- C3
- L1
- L2
- L3

### Presentation — F1

**medium:** interactive tool
**placement:** calculator premium button and hint, next to the Part B field
**reason:** A code change inside an existing tool; the persona's blocked step is fixed in place and the static answer stays readable.
**readerInputs:** - Monthly benefit before Medicare
- Part B premium
- COLA mode
**interaction:** **decision:** reuse
**reason:** The existing interactive tool is kept and extended; no new interaction is needed.
**animation:** **decision:** not-useful
**reason:** A corrected number and a link need no motion.

### Presentation — F2

**medium:** text
**placement:** FAQ answer and howItWorks paragraph
**reason:** A code change inside an existing tool; the persona's blocked step is fixed in place and the static answer stays readable.
**readerInputs:** 
**interaction:** **decision:** not-useful
**reason:** A corrected sentence is answered in prose; the page's own calculator already handles the interaction.
**animation:** **decision:** not-useful
**reason:** A corrected number and a link need no motion.

### Presentation — F3

**medium:** text
**placement:** FAQ and COLA-net sections of the four guides, existing slots
**reason:** A code change inside an existing tool; the persona's blocked step is fixed in place and the static answer stays readable.
**readerInputs:** 
**interaction:** **decision:** not-useful
**reason:** A corrected sentence is answered in prose; the page's own calculator already handles the interaction.
**animation:** **decision:** not-useful
**reason:** A corrected number and a link need no motion.

### Presentation — F5

**medium:** text
**placement:** FAQ and COLA-net sections of the four guides, existing slots
**reason:** A code change inside an existing tool; the persona's blocked step is fixed in place and the static answer stays readable.
**readerInputs:** 
**interaction:** **decision:** not-useful
**reason:** A corrected sentence is answered in prose; the page's own calculator already handles the interaction.
**animation:** **decision:** not-useful
**reason:** A corrected number and a link need no motion.

### Presentation — F6

**medium:** text
**placement:** FAQ and COLA-net sections of the four guides, existing slots
**reason:** A code change inside an existing tool; the persona's blocked step is fixed in place and the static answer stays readable.
**readerInputs:** 
**interaction:** **decision:** not-useful
**reason:** A corrected sentence is answered in prose; the page's own calculator already handles the interaction.
**animation:** **decision:** not-useful
**reason:** A corrected number and a link need no motion.

### Presentation — F7

**medium:** text
**placement:** FAQ and COLA-net sections of the four guides, existing slots
**reason:** A code change inside an existing tool; the persona's blocked step is fixed in place and the static answer stays readable.
**readerInputs:** 
**interaction:** **decision:** not-useful
**reason:** A corrected sentence is answered in prose; the page's own calculator already handles the interaction.
**animation:** **decision:** not-useful
**reason:** A corrected number and a link need no motion.

### Presentation — M1

**medium:** interactive tool
**placement:** below the result panel, after the answer
**reason:** Picks follow directly from the computed result and must not delay it.
**readerInputs:** - current savings
- monthly contribution
- return
- retire age
**interaction:** **decision:** reuse
**reason:** The existing calculator drives which pick tier shows; no new interaction.
**animation:** **decision:** not-useful
**reason:** Static list under the result.

### Presentation — F4

**medium:** interactive tool
**placement:** intro, directly after the rate answer
**reason:** A code change inside an existing tool; the persona's blocked step is fixed in place and the static answer stays readable.
**readerInputs:** - Business miles by half-year
- Marginal tax rate
- Self-employed
**interaction:** **decision:** reuse
**reason:** The existing interactive tool is kept and extended; no new interaction is needed.
**animation:** **decision:** not-useful
**reason:** A corrected number and a link need no motion.

### Presentation — C1

**medium:** interactive tool
**placement:** section 1: calculator results panel and intro worked example
**reason:** Her maximum depends on her own profit and age, and the two plans diverge at low income; a table cannot show that.
**readerInputs:** - Net self-employment profit
- Tax year 2026/2027
- Age 50+ or 60-63
- Other 401(k) deferrals this year
**interaction:** **decision:** build
**reason:** The answer depends on the reader's own numbers; a static table cannot show their result.
**animation:** **decision:** not-useful
**reason:** Live-updating numbers are enough; decorative motion adds nothing.

### Presentation — C2

**medium:** interactive tool
**placement:** section 1: calculator results panel plus the four-rate comparison
**reason:** The best W-4V rate depends on the reader's benefit and other income; the four-rate comparison needs their numbers.
**readerInputs:** - Monthly benefit
- Filing status
- Other taxable income
- Existing withholding
**interaction:** **decision:** build
**reason:** The answer depends on the reader's own numbers; a static table cannot show their result.
**animation:** **decision:** not-useful
**reason:** Live-updating numbers are enough; decorative motion adds nothing.

### Presentation — C3

**medium:** interactive tool
**placement:** section 1: calculator results and year-by-year schedule
**reason:** The carryforward and years-to-use depend on the reader's own totals; a schedule needs inputs.
**readerInputs:** - Short-term gains/losses
- Long-term gains/losses
- Filing status
- Prior-year carryover
- Future yearly gains
**interaction:** **decision:** build
**reason:** The answer depends on the reader's own numbers; a static table cannot show their result.
**animation:** **decision:** not-useful
**reason:** Live-updating numbers are enough; decorative motion adds nothing.

## Emerging search patterns (clusters)

- Self-employed retirement contribution cluster: solo 401k contribution calculator 720/mo, sep ira contribution calculator 480, sep ira calculator 720, solo 401k contribution limit 4,400 (DataForSEO measured 2026-11-25) -> create /sep-ira-solo-401k-contribution-calculator/ (C1)
- Social Security withholding cluster: withhold tax from social security 2,400/mo, social security (tax) withholding calculator 720, w-4v 1,600 (DataForSEO measured) -> create /social-security-withholding-calculator/ (C2)
- Capital loss carryforward cluster: capital loss carryover 2,400/mo, capital loss carryforward 2,400, calculator variant 30 (DataForSEO measured) -> create /capital-loss-carryover-calculator/ (C3)
- Medicare Part B 2027 cluster: 2027 medicare part b premium 5,400/mo (DataForSEO measured) -> update existing body text on the COLA tool and four guides (F1-F3); no new page

## Exclusions

- Investing and portfolio tools: Walked, no friction (see chart); no rows.
- Monetization for social-security-cola-calculator, mileage-deduction, investing and portfolio: already shipped books, no change (persona verdicts).
- Depreciation-recapture and 1031-exchange calculators: stay specced (Next in line); 3-new-tools cap reached.
- Couples and Money book (ASIN 0553057464): rejected as a 1990-edition title; not a current edition.
- 2027 Social Security wage base: not retrieved from a primary source in this environment; no 2027 SE-tax base is asserted in any brief.
- No tool, page, redirect or merge is removed or deprioritized (adds-only rule).

## New-page briefs

### C1 — /sep-ira-solo-401k-contribution-calculator/

**Identity**

**title:** SEP IRA and Solo 401(k) Contribution Calculator
**h1:** SEP IRA and Solo 401(k) Contribution Calculator
**metaTitle:** SEP IRA & Solo 401(k) Contribution Calculator (2027)
**metaDescription:** Enter your self-employed profit to see the most you can put into a SEP IRA or solo 401(k) for 2026 or 2027, and which plan lets you save more.
**pageType:** explainer (tool page; mirrors /social-security-taxable-benefits-calculator/)
**format:** calculator
**medium:** interactive tool

**Reader and answer**

**question:** How much can I put into a SEP IRA or solo 401(k) as a self-employed person? [PAA 1/6 on-topic: 'How much am I allowed to contribute to my SEP IRA?'; ac 4/14 how-is-calculated/limit questions; PAA 5/6 off-topic retirement-saving generics]
**answer:** Roughly 20% of net earnings after half of SE tax for a SEP, and the same plus the $25,500 (2027) employee deferral for a solo 401(k), capped at $75,000 (figure); on $100,000 profit that is $18,587 for a SEP and $44,087 for a solo 401(k).
**placement:** section 1: calculator results panel and intro worked example
**audience:** Self-employed filers (sole proprietors, freelancers, gig drivers) weighing a SEP IRA or solo 401(k)
**intent:** figure

**Keyword evidence**

DataForSEO us 2026-11-25 measured (SEMRUSH HTTP 403): solo 401k contribution calculator 720/mo KD 3; sep ira calculator 720 KD 0; sep ira contribution calculator 480 KD 3; solo 401k contribution limit 4,400 KD 14; sep ira contribution limit 1,600 KD 40; sep ira vs solo 401k 1,600 KD 2. Primary: sep ira contribution calculator (research/keyword-volumes*.json).

**SERP and questions**

SERP winnable, AI Overview cites fidelity.com, sofi.com, jupid.com, irs.gov. PAA: 'How much am I allowed to contribute to my SEP IRA?' (top on-intent, answered in section 1); remaining on-topic questions go to the FAQ; retirement-saving generics dropped as off-topic. Autocomplete: how is sep ira contribution calculated; what is sep ira contribution deadline/based on; how do sep ira contributions affect taxes (FAQ). Limit: page one is mostly small calculators plus intuit/fidelity; our edge is showing SEP vs solo side by side with the tax-year toggle.

**Why a new page**

coverage_lookup (research/coverage-lookup.txt): /compare/sep-ira-vs-solo-401k (reader chooses a plan; no calculation of own maximum), /guides/401k-contribution-limits-2026 and /guides/ira-contribution-limits-2026 (employee limits, not self-employed formulas). No redirects, no commits naming the topic, no past chart row; same-run overlap none. Duplicate decision: KEEP (pending independent review). Spec backlog: ledger 2026-11-04 sep-ira-solo-401k-contribution-calculator (seed self-employment-tax).

**Planned outline**

- **heading:** SEP IRA and Solo 401(k) Contribution Calculator
**purpose:** calculator + live results: SEP max, solo 401(k) employee + employer max, which allows more, cap warnings
- **heading:** How the Maximum Is Figured
**purpose:** Pub 560 reduced-rate method (20% of net earnings after half of SE tax), 2026 vs 2027 limits, $75,000/$72,000 cap, compensation limit, catch-up amounts, worked $100,000 example
- **heading:** When a Solo 401(k) Beats a SEP IRA
**purpose:** low-income crossover, Roth/loan features, deadlines, who should skip it (employees, other plan deferrals)
- **heading:** FAQ
**purpose:** how much can I contribute to a SEP IRA; deadline; how is it calculated; how contributions affect taxes; can I have both

**Contribution and evidence**

Calculated (Phase 3 executes the calculator code and saves evidence.json with replay). Formula: net earnings = profit - half SE tax (IRS Pub 560 rate worksheet, saved); SEP = min(20% x net earnings, 415(c) cap); solo = min(employee deferral limit + 20% x net earnings, cap) + catch-up outside the cap. Limits from IRS Notice 2026-66 and IR-2026-136 (saved, retrieved 2026-11-25): 2027 deferral $25,500, catch-up $8,500, 60-63 $11,750, 415(c) $75,000, comp limit $375,000; 2026 $24,500 / $8,000 / $72,000 / $360,000. Example (research/calc-examples.json): $100,000 profit -> SE tax $14,130, SEP $18,587, solo 401(k) $44,087, +$8,500 at 50+. Counterexample: below about $18,000 net earnings a SEP is capped by the 20% rule while the solo deferral is not. 2027 SS wage base not asserted (see exclusions).

**Tables, tools or visuals**

Interactive calculator (React island; calc-ui components; data-tool=sep-ira-solo-401k-contribution-calculator; <=30 KB gz). Inputs: profit, tax year, age band, other deferrals; outputs: two plan maximums, difference, cap flags; export/print result. Sourced constants named in the lib with IRS URLs. Table of limits 2026 vs 2027 below the tool.

**Testing and review**

Testing excluded (financial/tax guidance; _experience.md section G covers products/models, never financial services). Ordinary presentation, operator register with the editorial 'we', existing ModernWallet Research Desk byline and publisher/editorial reviewer note per _experience.md (register-reviewer-note in Phase 3); YMYL disclaimer at the bottom via template; HIGH review profile because consequential tax/retirement claims; no professionalReviewRequired flag, but the page says to confirm with a tax professional for unusual situations. Attribution: 'In our internal calculation, we modeled ...' beside the worked example, never 'we tested'.

**Planned takeaway**

For most sole proprietors a solo 401(k) allows far more than a SEP at the same profit because the $25,500 employee deferral sits on top of the 20% employer share; at high profit both hit the $75,000 cap and a SEP is simpler. The answer changes for anyone with employees (SEP must cover them) or W-2 deferrals elsewhere that use up the employee limit.

**Inbound internal links**

**required:** 2
**placements:** - **source:** /self-employment-tax/
**target:** /sep-ira-solo-401k-contribution-calculator/
**section:** cross-links list self-employment-tax
**anchor:** How much can you shelter in a SEP or solo 401(k)?
**purpose:** next step after your SE tax result
**inspection:** **path:** reports/mindmap-pass/2026-11-25-tool-usage/inspections/cross-links.txt
**sha256:** 6aa1900d2de4e6835bb98e3af3c8c9db01ae117fccb5e4b520763397dfb92a2d
- **source:** /mileage-deduction/
**target:** /sep-ira-solo-401k-contribution-calculator/
**section:** cross-links list mileage-deduction
**anchor:** Self-employed? See your retirement contribution limit
**purpose:** after the deduction, what to shelter
**inspection:** **path:** reports/mindmap-pass/2026-11-25-tool-usage/inspections/cross-links.txt
**sha256:** 6aa1900d2de4e6835bb98e3af3c8c9db01ae117fccb5e4b520763397dfb92a2d
- **source:** /compare/sep-ira-vs-solo-401k
**target:** /sep-ira-solo-401k-contribution-calculator/
**section:** body of the comparison (choosing section)
**anchor:** calculate your own SEP and solo 401(k) maximums
**purpose:** the comparison explains the choice; the tool shows the numbers
**inspection:** **path:** reports/mindmap-pass/2026-11-25-tool-usage/inspections/compare-sep-solo.txt
**sha256:** 3ac808f1a26f44ccda803052a965b168189c61cb23092612bc977e03ae1b418a

**Outbound internal links**

**placements:** - **source:** /sep-ira-solo-401k-contribution-calculator/
**target:** /compare/sep-ira-vs-solo-401k
**section:** When a Solo 401(k) Beats a SEP IRA
**anchor:** SEP-IRA vs Solo 401(k) comparison
**purpose:** fuller plan comparison
**inspection:** **path:** reports/mindmap-pass/2026-11-25-tool-usage/inspections/compare-sep-solo.txt
**sha256:** 3ac808f1a26f44ccda803052a965b168189c61cb23092612bc977e03ae1b418a
- **source:** /sep-ira-solo-401k-contribution-calculator/
**target:** /self-employment-tax/
**section:** How the Maximum Is Figured
**anchor:** self-employment tax calculator
**purpose:** SE tax feeds net earnings
**inspection:** **path:** reports/mindmap-pass/2026-11-25-tool-usage/inspections/cross-links.txt
**sha256:** 6aa1900d2de4e6835bb98e3af3c8c9db01ae117fccb5e4b520763397dfb92a2d

**Technical and measurement scope**

Add to the site registry (LIVE_IDS), calculators.ts entry, CalculatorIsland, sitemap <loc> with today's lastmod, canonical via template, WebApplication/FAQ schema via existing builders, data-tool beacon verified by verify_beacons.cjs. Measurement: new route, not-yet-published, age-matched comparator /self-employment-tax/ cohorts; GSC unavailable in cloud env (recorded unavailable, not zero); no uplift claimed.

### C2 — /social-security-withholding-calculator/

**Identity**

**title:** Social Security Withholding Calculator (Form W-4V)
**h1:** Social Security Withholding Calculator
**metaTitle:** Social Security Withholding Calculator: W-4V Rate
**metaDescription:** Estimate the federal tax on your Social Security benefit and see which W-4V withholding rate (7%, 10%, 12% or 22%) comes closest without falling short.
**pageType:** explainer (tool page; mirrors /social-security-taxable-benefits-calculator/)
**format:** calculator
**medium:** interactive tool

**Reader and answer**

**question:** How much federal tax should I withhold from my Social Security benefit (Form W-4V)? [PAA 1/6 on-topic: 'How is Social Security withholding calculated?'; ac 14 how/can/does questions on submitting W-4V; 5/6 PAA off-topic]
**answer:** Estimate your tax on the benefit, then pick the W-4V rate (7, 10, 12 or 22% of each payment) whose yearly total is closest to it without falling short; no other percentage or amount is allowed (IRS Form W-4V).
**placement:** section 1: calculator results panel plus the four-rate comparison
**audience:** Social Security recipients (retirees, disability) who want tax withheld from their benefit
**intent:** figure

**Keyword evidence**

DataForSEO us 2026-11-25 measured: withhold tax from social security 2,400/mo KD 22; w-4v 1,600 KD 17; social security tax withholding calculator 720 KD 31; social security withholding calculator 720 KD 28; w-4v social security withholding 50-500 (autocomplete estimate, not measured). Primary: social security withholding calculator.

**SERP and questions**

SERP winnable, AI Overview cites irs.gov, ssa.gov, staffmarket.com; page one softonic, voxluci, calcxml, ttlc.intuit.com. PAA: 'How is Social Security withholding calculated?' (opening answer); the rest are off-topic (SSN lookup, brackets, senior deduction) and dropped or limited to one cross-link. Autocomplete: how to submit/send/file w-4v; does social security recalculate withheld benefits; can I complete w-4v online (FAQ). Limit: SSA/IRS pages dominate the AI Overview; the unique angle is the four-rate comparison against an estimated tax.

**Why a new page**

coverage_lookup: no page for W-4V withholding. /social-security-taxable-benefits-calculator/ answers 'how much of my benefit is taxable' (its own 2026-11-04 persona asked for a withholding next step); /guides/senior-deduction-social-security and /guides/states-that-tax-social-security cover other intents. No commits; past chart 2026-11-04-tool-usage lists it as 'Next in line' spec. Duplicate decision: KEEP (pending independent review).

**Planned outline**

- **heading:** Social Security Withholding Calculator
**purpose:** calculator: benefit, filing status, other income -> estimated tax and the four W-4V rates compared
- **heading:** How Form W-4V Withholding Works
**purpose:** only 7, 10, 12 or 22 percent of each payment; how to file with SSA; stopping or changing it; why estimated tax can still be due
- **heading:** Which W-4V Rate Fits Your Income
**purpose:** worked cases showing under- and over-withholding, when quarterly estimates are the alternative
- **heading:** FAQ
**purpose:** how is Social Security withholding calculated; how to submit W-4V; can I file online; does it count as paid tax; can I pick another percentage

**Contribution and evidence**

Calculated, reusing the existing Pub 915 taxable-benefits logic (existing lib) plus 2026 standard deduction and brackets already on site (verified against IRS sources in Phase 3). W-4V options 7/10/12/22 percent from IRS Form W-4V (saved verbatim, retrieved 2026-11-25): 'no other percentage or amount is allowed'. Phase 3 executes the code and saves evidence.json with at least one default and one boundary case (benefit fully tax-free -> recommend no withholding; high other income -> 22 percent still short). Attribution 'In our internal calculation...'.

**Tables, tools or visuals**

Interactive calculator (React island, data-tool=social-security-withholding-calculator, <=30 KB gz) with a four-row comparison table (rate, yearly withheld, vs estimated tax, surplus/shortfall). Inputs sourced and cited; no stored prices.

**Testing and review**

Testing excluded (financial/tax guidance; _experience.md section G covers products/models, never financial services). Ordinary presentation, operator register with the editorial 'we', existing ModernWallet Research Desk byline and publisher/editorial reviewer note per _experience.md (register-reviewer-note in Phase 3); YMYL disclaimer at the bottom via template; HIGH review profile because consequential tax/retirement claims; no professionalReviewRequired flag, but the page says to confirm with a tax professional for unusual situations. Attribution: 'In our internal calculation, we modeled ...' beside the worked example, never 'we tested'.

**Planned takeaway**

If your estimated tax on benefits is below 7 percent of the yearly benefit, W-4V at 7 percent over-withholds and you get a refund; if it exceeds 22 percent, W-4V cannot cover it and you need estimated payments or higher other-income withholding. Verify with a tax professional if your income is unusual.

**Inbound internal links**

**required:** 2
**placements:** - **source:** /social-security-taxable-benefits-calculator/
**target:** /social-security-withholding-calculator/
**section:** cross-links list social-security-taxable-benefits-calculator
**anchor:** Withhold tax from your benefit (Form W-4V)
**purpose:** next step after the taxable-benefits result
**inspection:** **path:** reports/mindmap-pass/2026-11-25-tool-usage/inspections/cross-links.txt
**sha256:** 6aa1900d2de4e6835bb98e3af3c8c9db01ae117fccb5e4b520763397dfb92a2d
- **source:** /social-security-cola-calculator/
**target:** /social-security-withholding-calculator/
**section:** cross-links list social-security-cola-calculator
**anchor:** Ask SSA to withhold tax from your raise
**purpose:** after the new deposit, plan the tax
**inspection:** **path:** reports/mindmap-pass/2026-11-25-tool-usage/inspections/cross-links.txt
**sha256:** 6aa1900d2de4e6835bb98e3af3c8c9db01ae117fccb5e4b520763397dfb92a2d

**Outbound internal links**

**placements:** - **source:** /social-security-withholding-calculator/
**target:** /social-security-taxable-benefits-calculator/
**section:** How Form W-4V Withholding Works
**anchor:** how much of your Social Security is taxable
**purpose:** taxable portion input
**inspection:** **path:** reports/mindmap-pass/2026-11-25-tool-usage/inspections/cross-links.txt
**sha256:** 6aa1900d2de4e6835bb98e3af3c8c9db01ae117fccb5e4b520763397dfb92a2d
- **source:** /social-security-withholding-calculator/
**target:** /social-security-cola-calculator/
**section:** Which W-4V Rate Fits Your Income
**anchor:** 2027 Social Security COLA calculator
**purpose:** new benefit amount
**inspection:** **path:** reports/mindmap-pass/2026-11-25-tool-usage/inspections/cross-links.txt
**sha256:** 6aa1900d2de4e6835bb98e3af3c8c9db01ae117fccb5e4b520763397dfb92a2d

**Technical and measurement scope**

Registry LIVE_IDS, calculators.ts entry, CalculatorIsland, sitemap entry, WebApplication/FAQ schema, data-tool beacon verification. Measurement: new route, not-yet-published; comparator /social-security-taxable-benefits-calculator/ age-matched; GSC unavailable in cloud env (unavailable, not zero); no uplift claim.

### C3 — /capital-loss-carryover-calculator/

**Identity**

**title:** Capital Loss Carryover Calculator
**h1:** Capital Loss Carryover Calculator
**metaTitle:** Capital Loss Carryover Calculator: $3,000 Limit
**metaDescription:** Enter your stock gains and losses to see the $3,000 deduction this year, the loss that carries forward and how many years it takes to use it.
**pageType:** explainer (tool page; mirrors /social-security-taxable-benefits-calculator/)
**format:** calculator
**medium:** interactive tool

**Reader and answer**

**question:** How much of my stock losses can I deduct this year and carry forward? [PAA 2/6 on-topic: 'How do I find out if I have capital loss carryover?', 'What are the rules for carry forward of losses?'; ac 14 how/what questions; 4/6 PAA tax-rate off-topic]
**answer:** Losses first cancel gains; a net loss deducts at most $3,000 ($1,500 married filing separately) against other income and the rest carries forward indefinitely (IRS Topic 409); a $50,000 net loss with no gains takes about 16 years to use.
**placement:** section 1: calculator results and year-by-year schedule
**audience:** DIY investors and taxable-account holders with realized stock losses
**intent:** figure

**Keyword evidence**

DataForSEO us 2026-11-25 measured: capital loss carryover 2,400/mo KD 9; capital loss carryforward 2,400 KD 10; capital loss carryover calculator 30 KD 2 (thin, flagged); capital loss limit 3000 autocomplete estimate 20-200 (not measured). Primary: capital loss carryover calculator.

**SERP and questions**

SERP winnable, AI Overview present with no cited domains; page one xltemplates.org, finfriend.work, simms-accounting.com, ttlc.intuit.com, youtube.com. PAA: 'How do I find out if I have capital loss carryover?' (opening-adjacent), 'What are the rules for carry forward of losses?' (FAQ); tax-rate questions off-topic. Autocomplete: how is capital loss carryover calculated, how much can i use, which is used first (FAQ). Limit: head phrase with calculator suffix has thin measured demand, but the two informational heads total 4,800/mo and the persona next-job signal supports it.

**Why a new page**

coverage_lookup: no possible home. Closest /guides/tax-loss-harvesting (explains harvesting and the $3,000 limit, no carryforward schedule) and /stock-capital-gains-tax-calculator/ (tax on a sale). No commits; past chart 2026-11-04-tool-usage lists it as spec. Duplicate decision: KEEP (pending independent review).

**Planned outline**

- **heading:** Capital Loss Carryover Calculator
**purpose:** calculator: ST/LT gains and losses, prior carryover, filing status, future gains -> this year's deduction, carryforward, year-by-year schedule
- **heading:** How the $3,000 Limit and Carryover Work
**purpose:** net losses against gains first, $3,000 ($1,500 MFS) against other income, indefinite carryforward, character preserved, Schedule D worksheet (IRS Topic 409, Pub 550)
- **heading:** Worked Examples
**purpose:** $50,000 loss with no gains -> $3,000 now, $47,000 carries, about 16 years; same loss with $10,000 future gains per year
- **heading:** FAQ
**purpose:** how do I know my carryover; rules for carry forward; what is used first; does it expire; what happens at death

**Contribution and evidence**

Calculated (rules, not estimates): IRS Topic 409 and Pub 550 (saved verbatim, retrieved 2026-11-25): net capital loss deductible up to $3,000 ($1,500 MFS), excess carried forward using the Capital Loss Carryover Worksheet. Phase 3 executes the code, saves evidence.json with default, boundary (loss below $3,000, MFS, ST vs LT ordering per Worksheet 4-1) and counterexample (large future gains consume carryover faster). Does not model state rules or AMT; says so.

**Tables, tools or visuals**

Interactive calculator (React island, data-tool=capital-loss-carryover-calculator, <=30 KB gz) with a year-by-year schedule table. Sourced constants cited.

**Testing and review**

Testing excluded (financial/tax guidance; _experience.md section G covers products/models, never financial services). Ordinary presentation, operator register with the editorial 'we', existing ModernWallet Research Desk byline and publisher/editorial reviewer note per _experience.md (register-reviewer-note in Phase 3); YMYL disclaimer at the bottom via template; HIGH review profile because consequential tax/retirement claims; no professionalReviewRequired flag, but the page says to confirm with a tax professional for unusual situations. Attribution: 'In our internal calculation, we modeled ...' beside the worked example, never 'we tested'.

**Planned takeaway**

A net loss never disappears: it offsets gains dollar for dollar, then up to $3,000 a year of other income, and the rest carries forward until used; with no gains a large loss can take well over a decade, so realizing gains in a low-income year can use it faster. Confirm with a tax professional for wash-sale or AMT situations.

**Inbound internal links**

**required:** 2
**placements:** - **source:** /stock-capital-gains-tax-calculator/
**target:** /capital-loss-carryover-calculator/
**section:** cross-links list stock-capital-gains-tax-calculator
**anchor:** Have a loss? See what carries forward
**purpose:** its 2026-11-04 persona asked what a loss result means
**inspection:** **path:** reports/mindmap-pass/2026-11-25-tool-usage/inspections/cross-links.txt
**sha256:** 6aa1900d2de4e6835bb98e3af3c8c9db01ae117fccb5e4b520763397dfb92a2d
- **source:** /guides/tax-loss-harvesting/
**target:** /capital-loss-carryover-calculator/
**section:** the $3,000 limit paragraph
**anchor:** capital loss carryover calculator
**purpose:** carryforward schedule for the limit explained there
**inspection:** **path:** reports/mindmap-pass/2026-11-25-tool-usage/inspections/guide-tax-loss-harvesting.txt
**sha256:** 53fe17237e2273be85fe279c792fd83b5274f55a963dc1f882d9413ce93848e8

**Outbound internal links**

**placements:** - **source:** /capital-loss-carryover-calculator/
**target:** /guides/tax-loss-harvesting/
**section:** How the $3,000 Limit and Carryover Work
**anchor:** how tax loss harvesting works
**purpose:** harvesting strategy
**inspection:** **path:** reports/mindmap-pass/2026-11-25-tool-usage/inspections/guide-tax-loss-harvesting.txt
**sha256:** 53fe17237e2273be85fe279c792fd83b5274f55a963dc1f882d9413ce93848e8
- **source:** /capital-loss-carryover-calculator/
**target:** /guides/wash-sale-rule-explained/
**section:** FAQ
**anchor:** wash sale rule
**purpose:** disallowed losses
**inspection:** **path:** reports/mindmap-pass/2026-11-25-tool-usage/inspections/guide-wash-sale-rule-explained.txt
**sha256:** ae994706f78ba9fa18051340d338eb570c84085c65783e57433ee4c89fe03c1d

**Technical and measurement scope**

Registry LIVE_IDS, calculators.ts entry, CalculatorIsland, sitemap entry, WebApplication/FAQ schema, beacon verification. Measurement: new route; comparator /stock-capital-gains-tax-calculator/; GSC unavailable in cloud env (unavailable, not zero); no uplift claim.

## Execution plan

1. Record advisory cannibalization check (no destructive merges).
2. Apply any approved metadata updates (or N/A when none in chart).
3. Generate net-new approved routes with verified evidence packets.
4. Run independent Phase 4 rendered-page audit on all changed routes.
5. Apply any approved existing-page body enrichments (or N/A when none).
6. Add approved inbound and outbound internal links across inspected routes.
7. Update sitemaps and prepare IndexNow URL list without pre-deploy ping.
8. Compile Phase 8 execution and cluster summary.
9. Commit, deploy to main, verify HTTP 200 live renders, and submit IndexNow.

## Reviewer guardrails carried into writing

- CR-1 (substantive): Correct the F1 solution cell and calc-examples closed fact to $1,916.60 gross and $1,707 net (SSA rounds to the dime then down to whole dollars after Part B); do not copy $1,917 or $1,707.60 into any page, test or FAQ.
- CR-2 (substantive): State the schedule exactly in the packet and page (e.g. $3,000 this year and 16 more tax years, final $2,000) and make takeaway, FAQ, table and calculator agree; Phase 4 replay must match.
- CR-3 (substantive): Label the tax year on the page and in results; use 2026 figures labeled as 2026, or cite a retrievable IRS 2027 inflation-adjustment source before using 2027 values. Do not present estimated 2027 brackets as official.
- CR-4 (substantive): Either retrieve and save the SSA 2027 taxable-maximum source and cite it, or compute SE tax for the 2027 option using the labeled 2026 base with a visible 'estimate, 2027 base not used' note (or restrict). Add a boundary case above the wage base to the packet.
- CR-6 (substantive): Add the planned three-book block for the default (non-Social-Security) result path without creating a second data-tool-picks block when showSocialSecurity is true; verify exactly one block renders in both states and that live ASINs match amazon-picks-retirement.txt.
- CR-7 (nit): Keep the explainer short, lead with the comparison table, link the existing guide instead of restating it; keep the 'confirm with a tax professional' line at the bottom, not in section 1.

Publication scope: commit: True, push: True, liveVerification: True, indexNow: True

## Preparation check

| Check | Result | Evidence |
|---|---|---|
| Preparation check | ✅ Passed | [Full readiness report](reports/mindmap-pass/2026-11-25-tool-usage/readiness.md) |

Approve this plan to start the listed content work?
