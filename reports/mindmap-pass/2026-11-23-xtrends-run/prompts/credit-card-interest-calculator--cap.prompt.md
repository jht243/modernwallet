# TASK: add ONE new section to the existing credit card interest calculator page /credit-card-interest-calculator/
Add the section `## 10% APR Cap Scenario`. On this page it renders directly after the existing "How it works" section (the second section after the calculator), so it must open with the answer.
reader question: "What would a 10% credit card interest cap save me, and is it law?"
answer: It is not law. S.381 and H.R.1944 are proposals that would cap credit card annual percentage rates (APRs) at 10% until January 2031; on this page's $5,000 example, one 30-day cycle drops from $98.63 at 24% to $41.10 at 10%, a $57.53 difference, if the card stayed available at that rate with no new fees.
answer placement: section 1 or 2 (this section).

Required shape, in this order, about 350 to 450 words in total:
1. Sentence 1: it is not law, and the cap is a proposal. Sentence 2: what the proposals would do (10% APR cap until January 2031), with the as-of statement: per the Congressional Research Service (CRS) report updated March 10, 2026 and the text of S.381 as introduced, these are proposals in the 119th Congress; S.381 was introduced February 4, 2025 and referred to the Senate Banking Committee. Say current committee status after those records is not confirmed here. Link CRS and govinfo (first mentions).
2. A sentence of attribution: "In our internal modeling, we compared one billing cycle at 24% and at 10% on the $5,000 example used above." Natural wording is fine, it is calculation, never testing.
3. The pipe table with columns: APR | One 30-Day Cycle | One Year, Flat Balance (rows 24% and 10%, plus a third row "Difference" with $57.53 and $700.00). Directly after, one sentence with the conditions: simple interest on a flat $5,000 balance, 30-day cycle on a 365-day year, no payment during the cycle, no new fees, and the card staying available at 10%.
4. The tradeoffs from CRS in a short bulleted list (access to credit from traditional sources could be affected; banks may limit credit products or add auxiliary fees; borrowers may shift to higher-APR sources outside banking; some economists say reduced availability could benefit some consumers). Say what each does for the reader, using only the facts below. Include the counterexample: a new fee of $57.53 or more per cycle would erase the one-cycle saving on this example, and losing the card could cost more.
5. A paragraph opening "Based on our internal modeling," with the conditional takeaway: if a cap becomes law and your card stays available at 10% with no new fees, a $5,000 balance would cost about $57.53 less per 30-day cycle; if issuers respond with fees or less access, the saving can disappear. Say the cap would apply generally to consumer cards, not business credit (per CRS).
6. One sentence on who this is not for (someone who pays the full statement balance each month pays no interest and sees no change) and what would change the answer (a bill becoming law with different terms).
7. The LAST sentence is a concrete next step: enter your own balance and APR in the calculator above.
Do NOT name any bill sponsor, do NOT mention any politician's remarks, do NOT imply the cap will pass. Do not name H.R.1944's sponsors.

# CLOSED FACT LIST
- Calculated (our internal modeling), balance $5,000, 30-day cycle, 365-day year, simple interest, no payment, no fees: 24% APR gives $98.63 per cycle and $1,200.00 for a flat year; 10% APR gives $41.10 per cycle and $500.00 for a flat year; difference $57.53 per cycle and $700.00 per flat year; a new fee of $57.53 or more per cycle would offset the one-cycle saving. The $98.63 matches the existing page.
- CRS (Congressional Research Service) In Focus IF12861, current version dated March 10, 2026: S. 381 and H.R. 1944 would cap credit card annual percentage rates at 10% until January 2031; they apply generally to consumer cards, generally not business credit. Tradeoffs it describes: "imposing a cap could affect access to credit from traditional sources"; banks may also choose to limit credit products or add auxiliary fees; borrowers may shift to higher-APR sources outside banking; some economists say reduced availability could benefit some consumers.
- govinfo, S.381 "10 Percent Credit Card Interest Rate Cap Act" as introduced: introduced February 4, 2025 in the 119th Congress; referred to the Senate Committee on Banking, Housing, and Urban Affairs; adds a 10 percent cap on credit card APR that includes finance charges; the cap provision ends January 1, 2031.
- Not primary-verified, do not state: current committee status after the CRS date, H.R.1944 sponsors, any vote or passage.

# CLOSED URL LIST (external)
https://www.everycrsreport.com/reports/IF12861.html
https://www.govinfo.gov/content/pkg/BILLS-119s381is/html/BILLS-119s381is.htm

# INTERNAL ROUTES you may link
/credit-card-payoff/ (credit card payoff calculator), /guides/good-apr-for-credit-card/ (what counts as a good APR for a credit card)

# OUTPUT CONTRACT (enrichment of an EXISTING page; this is NOT a new page)
- Output markdown only. Exactly one `## ` heading (Title Case) followed by the prose. No H1. No front matter. No code fences.
- Any table is a GitHub-style pipe table (header row, separator row, body rows) on its own lines.
- Write at a 7th to 8th grade reading level, in the site's editorial "we" voice (operator register). Address the reader as "you" only as a reader, never assume what they own.
- Zero em-dashes. No semicolons joining clauses. No "honest". No "not X, but Y" flourish. Never write "the vendor/the platform/the tool/the company" for a named subject. Link the first mention of every named organization with a markdown link using ONLY URLs from the CLOSED URL LIST or the INTERNAL ROUTES list. Do not invent URLs.
- Use ONLY facts and numbers from the CLOSED FACT LIST. Anything not on it, you do not know. Do not add statistics, dates, quotes, sponsor names, or news.
- Paragraphs are at most 3 sentences. Vary sentence length. Three or more parallel items go in a list.
- Do not mention this page, this article, or the reader's search. Do not use a Conclusion or Summary heading.
- Do NOT claim we tested anything. The only first-party basis is our internal modeling (calculation). Never write "we tested", "in our testing", or "tested".

# REVIEWER GUARDRAILS (must respect)
- Hedge bill status: proposals, 119th Congress, referred to committee, as-of date, link CRS and govinfo.
- No sponsor names for H.R.1944, no political remarks, no implication of passage.
- Conditions beside every number. No TESTED claims; label the work "our internal modeling".
