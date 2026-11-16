# Approved Page Assignment: `/budget/aca-subsidy-calculator/` (`aca-subsidy-calculator`)
- **Action ID:** `A5` (update existing body text)
- **Title:** Add a section to /budget/aca-subsidy-calculator/ (additive only, content_gen section) answering what to do when the premium rose or the subsidy ended: re-run the estimate at realistic 2027 income, check the 400% FPL line, weigh bronze vs silver (deductible and cost-sharing-reduction trade-off, attributed to KFF and dated 2026 vs 2025), catastrophic plans' narrow eligibility (KFF), and HealthCare.gov deadlines with the state-exchange caveat; the section names KFF visibly and states no cheaper plan 'restores' a credit
- **Page Type / Format / Medium:** guide | article section on existing calculator page | text
- **Minimum Visible Depth Floor:** 1800+ words (substantive, zero filler; never leave raw Markdown `| col |` pipe-table rows inside JSON string `paragraphs[]` arrays — use structured `table` fields where supported)

## Mandatory Reader Question & Opening Answer Contract (Cols 10–12)
- **Reader Question (Col 10):** My ACA premium doubled and my subsidy ended: what do I do this open enrollment? [verb-only - autocomplete question sweep run (38 suggestions, seed 'aca premium increase 2027'), 0 on-intent question completions: only year and location variants; PAA unread - no DataForSEO key]
- **Working Answer (Col 11):** Re-run the estimate at your realistic 2027 income first, because the credit is the benchmark silver premium minus an income-based contribution: below 400% of FPL you still get a credit, though smaller than under the expired enhanced credits (KFF), and above 400% there is no credit by law; a cheaper or bronze plan lowers what you pay but trades premium for deductible (KFF: average deductible rose 37% in 2026 vs 2025 as enrollees moved to bronze) and lower-income enrollees can lose cost-sharing reductions by leaving silver; HealthCare.gov says enroll by December 15 for January 1 coverage with a January 15 final deadline on that platform, and state exchanges may differ.
- **Answer Placement (Col 12):** section 1: "What to Do if Your ACA Premium Jumped" (placed ahead of the formula section)

## Demand & Differentiation Context
- **Problem / Gap:** Lens 1 direct intent (ENRICH requested by brief). lookup: /budget/aca-subsidy-calculator exact route exists, title 'ACA Subsidy Calculator for 2027 Marketplace Premiums'; gap: 0 mentions of bronze, enhanced subsidies, deadlines or what to do when a premium jumped; it explains the 400% line and uncapped repayment. KFF reports (2026 vs 2025) average net premium payment +58% ($113 to $178) and average deductible +37%; for 2027, finalized benchmark silver premiums +13% on average. Demand estimate NOT measured (no keyword key); 2026-11-04-aca-snap chart measured 'aca subsidy calculator' 1,900/mo KD54 (SEMRUSH, prior run). Commits: no prior commits touch the enrichment section.
- **Keyword Evidence:** "SERP not read: no DataForSEO credentials available to this worker"
- **Why New Page / Angle:** Add a section to /budget/aca-subsidy-calculator/ (additive only, content_gen section) answering what to do when the premium rose or the subsidy ended: re-run the estimate at realistic 2027 income, check the 400% FPL line, weigh bronze vs silver (deductible and cost-sharing-reduction trade-off, attributed to KFF and dated 2026 vs 2025), catastrophic plans' narrow eligibility (KFF), and HealthCare.gov deadlines with the state-exchange caveat; the section names KFF visibly and states no cheaper plan 'restores' a credit
- **Intent-Based Our Takeaway:** ""


## Task (one line)
Write ONE new section for the existing calculator page: "What to Do if Your ACA Premium Jumped". Output markdown: one `## What to Do if Your ACA Premium Jumped` heading, then the prose. About 350 to 480 words. It goes first on the page, before "How ACA Subsidies Are Calculated". Additive only: do not repeat the formula, the FPL table or the income-definition material already on the page (the current page text is supplied). Do not change or restate any existing section.

## Writer rules specific to this run
- Operator register, plain words, second person ("you"). Do not presuppose that the reader already holds a plan or lost a subsidy: scope it ("If your 2027 premium quote jumped...").
- First sentence is a complete declarative answer. Zero em-dashes. Number ranges use "to". No "honest", no "actually", no "the vendor/the platform/the tool".
- Use a numbered list for the ordered steps (the steps are parallel items of one job). A short lead-in sentence may stay prose.
- Name KFF visibly at its first mention as the source of every figure, linked, and date every KFF figure ("KFF reports ... in 2026 compared with 2025"). Basis is reported, not our testing. No testing claim, no "we tested", no first-person experience claim, no survey claim.
- State plainly that a cheaper plan does not restore a credit: the credit is the benchmark silver premium minus an income-based contribution, capped at the premium of the plan you pick. A cheaper plan lowers what you pay.
- Disclose the state-exchange caveat on deadlines. Do not state any state's dates.
- Do not use the Wisconsin 22% figure, any $1,800 figure, or anything from social posts.
- Link to the calculator on this page as "the calculator below" in plain text (no URL), and to the existing section "When the ACA Subsidy Calculator Does Not Apply" in plain text only if needed. Internal links allowed: none required.

## PROVENANCE
- Basis: reported (KFF research and HealthCare.gov). No original analysis, test or client record is claimed. KFF is a research nonprofit: say "KFF, a health policy research nonprofit" at most once, only if natural, or just name KFF.

## CLOSED FACT LIST
Anything not on this list, you do not know.

KFF, "What We Know So Far About 2026 ACA Marketplace Enrollment, Premiums, and Deductibles" (May 19, 2026). All figures are 2026 compared with 2025:
- The enhanced premium tax credits expired at the end of 2025.
- The average monthly premium payment among consumers, net of tax credits, rose 58% from $113 in 2025 to $178 in 2026 (includes consumers who received no tax credit).
- The average Marketplace deductible rose 37% (about $1,027 per person), from $2,759 in 2025 to $3,786 in 2026, the steepest increase since the markets launched in 2014. KFF says this largely reflects a shift from silver plans with reduced deductibles for lower-income enrollees to bronze plans with very high deductibles.
- Bronze plan share of selections rose from 30% in 2025 to 40% in 2026; silver fell from 57% to 43%, the first time fewer than half selected silver.
- Bronze plans have lower premiums and higher deductibles.
- Enrollees with incomes of 100% to 250% of the federal poverty level (FPL) also qualify for cost-sharing reductions (CSRs), which lower deductibles, copayments and coinsurance if they enroll in silver plans. KFF's example: the average silver deductible available to a person making up to 150% of FPL is $80, compared with $5,304 for the standard silver plan. Share of eligible consumers in HealthCare.gov states who chose a CSR plan fell from 66% in 2025 to 45% in 2026.

KFF, "9 Things to Watch for the 2027 ACA Open Enrollment Period" (Nov. 6, 2026):
- The average increase in finalized 2027 benchmark silver premiums is 13% (HealthCare.gov states 11%, states running their own platforms 16%).
- Most enrollees get a subsidy that cushions the increase. People with incomes above 400% of FPL no longer qualify for premium tax credits and must pay the full cost of coverage.
- Beginning with tax year 2026, limits that capped how much some enrollees had to repay in excess premium tax credits were eliminated. Because the first filings under the new rules come in early 2027, enrollees choose 2027 plans without having seen uncapped repayment in practice. Accurately estimating income, and updating it when circumstances change, matters most near the income thresholds for tax credits or CSRs.
- Some enrollees may lower their modified adjusted gross income (MAGI) through contributions to health savings accounts (HSAs) or traditional IRAs, which could raise premium tax credits or help people near 250% of FPL qualify for CSRs. HSA contributions are available only to people in HSA-eligible plans, and not everyone has the funds to contribute.
- Catastrophic plans: during open enrollment only a narrow group can enroll, including people under age 30, people whose Marketplace or employer coverage would cost more than 8.5% of their income, and people who qualify for a hardship exemption. (KFF says the broader eligibility announced in 2025 is temporarily paused after a court decision.)
- Some state-run exchanges use state funds to offset the lost enhanced credits, and amounts vary by state and income.

HealthCare.gov, "When can you get health insurance?" (checked Nov. 16, 2026):
- Open Enrollment starts November 1. Enroll by December 15 for coverage that starts January 1. Open Enrollment ends January 15; after that you can enroll or change plans only with a Special Enrollment Period. Coverage starts February 1 for those who enroll or change plans December 16 through January 15 and pay their first premium. These dates are for HealthCare.gov. State-run exchanges can set different dates.

Facts already on the page (you may rely on them, do not restate at length): the credit equals the benchmark silver premium minus an income-based contribution and is capped at the premium of the plan you enroll in; the ordinary credit range is 100% to 400% of the poverty level; the calculator needs expected 2027 household MAGI; with advance payments you must file Form 8962 and there is no repayment cap for tax years after 2025.

## Required content
1. Direct answer in the first sentence: re-run the estimate at your realistic 2027 income first.
2. Ordered steps (numbered list): re-run the estimate in the calculator below at a low and a high income; check where your income sits against the 400% FPL line (above it, no credit by law; below it, a smaller credit than under the expired enhanced credits, per KFF); weigh bronze against silver (lower premium, higher deductible; KFF's 2026 vs 2025 deductible figure; lower-income enrollees can lose CSRs by leaving silver); note catastrophic plans are open to a narrow group; enroll by the deadline with the state-exchange caveat.
3. A short statement that a cheaper plan lowers what you pay but does not restore a credit.
4. The final sentence is a concrete next action (open the calculator below and enter your expected 2027 income).

## CLOSED URL LIST
- https://www.kff.org/affordable-care-act/what-we-know-so-far-about-2026-aca-marketplace-enrollment-premiums-and-deductibles/  (KFF May 19, 2026; link first mention of KFF)
- https://www.kff.org/affordable-care-act/9-things-to-watch-for-the-2027-aca-open-enrollment-period/  (KFF Nov. 6, 2026)
- https://www.healthcare.gov/quick-guide/dates-and-deadlines/  (HealthCare.gov dates; link first mention of HealthCare.gov)
