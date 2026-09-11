ROUTE / SLUG: /investing/annualized-return-calculator/  slug: "annualized-return-calculator"
PAGE TYPE: explainer/spoke (1200-word body floor) — tool page (intro + howItWorks + FAQ around a live calculator widget)
REGISTER: operator
MEDIUM: interactive tool → interactive tool (the widget already exists; this prose frames it)
PRIMARY KEYWORD: annualized return calculator
SECONDARY KEYWORDS: CAGR calculator, compound annual growth rate, annualized rate of return, CAGR vs average annual return, what is a good annual return
SEARCH INTENT: an investor who knows what they started with and what they ended up with (a brokerage balance, a single stock, a piece of real estate, a business) wants to know the single annual growth rate that move actually represents, and how that differs from just averaging their yearly returns.

## CLOSED FACT LIST — the ONLY facts this page may state. Anything not on this list, you do not know. Never invent a statistic, a historical average return, or a URL.

1. The compound annual growth rate (CAGR) formula is: CAGR = (Ending Value ÷ Beginning Value)^(1/n) − 1, where n is the number of years in the holding period, expressed as a percent. This is the exact formula the calculator on this page runs. [This is the calculator's own stated formula — no external citation needed.]
2. Total return over the period is (Ending Value − Beginning Value) ÷ Beginning Value, expressed as a percent. This is also the calculator's own formula.
3. The simple (arithmetic) average annual return is the total return divided evenly by the number of years (total return ÷ n). It is NOT the same calculation as CAGR.
4. CAGR and the simple average annual return are only equal when the investment gains (or loses) the exact same percentage every single year of the holding period. Whenever the year-to-year return varies, CAGR is lower than the simple average — a mathematical effect sometimes called "volatility drag" or "variance drag": compounding a sequence of uneven returns produces a smaller ending value than compounding the arithmetic average of those same returns would. [This is a standard, provable mathematical property of geometric vs. arithmetic means — no external citation needed; it follows directly from facts 1-3.]
5. CAGR is a "smoothed," single constant rate — it tells you what steady annual growth rate would have produced the same ending value, not the actual return in any specific year along the way. A CAGR of 8% over 5 years does not mean the investment returned exactly 8% each year; it could have gained 30% one year and lost 10% another and still land on an 8% CAGR.
6. The CAGR formula assumes a single lump sum that grows (or shrinks) with no additional deposits or withdrawals during the holding period. If money was added or withdrawn along the way, CAGR does not accurately describe the investor's actual return; a money-weighted calculation (internal rate of return, or IRR) is needed instead, which accounts for the timing and size of each cash flow.
7. FINRA (the Financial Industry Regulatory Authority) publishes free investor-education tools and calculators, including return-related calculators, at its own site. [FINRA — Tools and Calculators](https://www.finra.org/investors/tools-and-calculators)
8. The SEC's Investor.gov site publishes general investing-basics education, including guidance on matching an investment's expected return and risk to an investor's own time horizon and risk tolerance. [SEC Investor.gov — Asset Allocation](https://www.investor.gov/introduction-investing/getting-started/asset-allocation)

Do not state any specific historical average return for the stock market, the S&P 500, or any named index or asset class — those change and are outside this closed fact list. Frame "what is a good annual return" by telling the reader to compare their result against a benchmark index's own actual, current published return rather than stating one.

## CLOSED URL LIST — the only external hrefs this page may use, each on the first mention of that source
- https://www.finra.org/investors/tools-and-calculators (FINRA — Tools and Calculators)
- https://www.investor.gov/introduction-investing/getting-started/asset-allocation (SEC Investor.gov — Asset Allocation)

## INTERNAL LINKS ALLOWED (real routes on this site)
- /investing/compound-interest-calculator/ — "compound interest calculator" (for a reader projecting FORWARD instead of measuring a past return)
- /investing/high-yield-savings-calculator/ — "high-yield savings calculator"
- /portfolio/ — "portfolio calculator"

## COVERAGE (cover every item; add more if it serves the reader)
1. `introText` — direct answer: what the calculator does (solves for CAGR from a starting value, ending value, and holding period) and who it's for.
2. `howItWorks` — the CAGR formula (fact 1), the total return and simple average formulas (facts 2-3), and the lump-sum/no-interim-cash-flow assumption (fact 6) stated plainly with the constants named.
3. `commonMistakes` — include at minimum: confusing CAGR with the simple average (facts 3-4), assuming CAGR describes what happened in any single year (fact 5), using CAGR when money was added or withdrawn mid-period (fact 6), and forgetting to compare the result against a real benchmark's own current published number rather than a memorized figure.
4. `workedExample` — one concrete worked example using the tool's default inputs ($10,000 growing to $16,000 over 5 years): compute the total return, the simple average annual return, and the CAGR, and show the actual gap between the two (facts 1-4). This is the page's highest-information-gain content: make the compounding-vs-averaging distinction concrete with real numbers, not just asserted.
5. `faqs` — cover at minimum: what CAGR/annualized return means; is CAGR the same as annualized return (yes, this calculator's "annualized return" IS the CAGR calculation — say so directly, since the competitor's own outline treats these as two separate questions when they are the same figure); CAGR vs. average annual return (the gap, fact 4); what is a good annual return (redirect to comparing against a benchmark's own current number, per the constraint above — never state one); does this work if I added money along the way (fact 6, redirect to IRR).

## COVERAGE FLOOR — a competitor (Omni Calculator) published a page on this topic:
  Title: Annualized Return Calculator
  Section outline (H2/H3): How to calculate annualized return; CAGR vs. average annual return; How the annualized return calculator works; What is the annualized rate of return?; How do I calculate annualized return?; Is CAGR the same as annualized return?; What is a good annual return on investment?
Your page MUST cover every topic in this outline and beat its depth and usefulness.
Treat this outline only as a checklist of topics to exceed.
‼️ Write 100% ORIGINAL prose. Do NOT copy, paraphrase sentence-by-sentence, or mirror the competitor's wording. Add information gain they do not have (the concrete worked-example gap between CAGR and the simple average with real numbers, and the explicit "these are the same question" answer on the CAGR-vs-annualized-return FAQ).
Never reference or name the competitor on the page.

## OBJECTIVITY
Do not claim ModernWallet is neutral, independent, or takes no referral fee. Show objectivity instead: state the calculator's one real limitation plainly (lump-sum only, no interim cash flows) rather than presenting it as universally applicable.

# CORRECTIONS FROM THE PHASE 4 AUDIT (rework attempt 1/2 — fix ALL of these in the regenerated page)

1. **DEPTH — the draft measured 1054 words against a 1200-word floor.** Reach the floor by answering MORE of the query, not by padding existing sentences. Specifically:
   - In `howItWorks`, add one short paragraph covering the edge case where the ending value is zero (a total loss): note that CAGR cannot be computed in that case (there is no meaningful fractional-power root of zero) and the honest answer is a -100% total return, not an annualized rate. This is a real, defensible mathematical fact that follows directly from fact 1 in the fact list (do not invent a new number).
   - Add a SECOND worked example to `workedExample` (it may run 2 short paragraphs instead of 1) showing the reverse case: a shorter holding period widens or shrinks the CAGR-vs-simple-average gap. For example, use the SAME $10,000 -> $16,000 move but over 2 years instead of 5, and show the new CAGR = (1.6)^(1/2) - 1 = 26.49%, versus the same-total-return-different-period simple average of 30% (60% / 2 years), a 3.51-point gap — smaller in absolute points than the 5-year case's 2.14 despite the shorter period, illustrating that the gap's size depends on the interplay of total return and period length, not on period length alone. Verify this arithmetic yourself before writing it.
   - Add 2 more FAQs: one on whether a longer holding period always makes CAGR more accurate (answer: no — CAGR is exact math for the lump-sum case regardless of period length; period length changes how much the CAGR and simple-average numbers diverge, not which one is "more correct" for a lump sum with cash flows) and one on what CAGR does NOT tell you (it does not tell you how bumpy the ride was — two investments can share the same CAGR with very different year-to-year volatility, so CAGR alone does not measure risk).

Everything else in the prior draft (fact accuracy, formula correctness, LINKS, coverage floor, no-plagiarism, required content, neutrality, register, schema fit) passed and must stay intact in substance. The numbers flagged as not traceable to the fact list (12, 2.14, 60, 6000, 9.86) are the self-contained worked-example arithmetic from the tool's own default inputs — keep them, they need no external source, just verify them again when you add the second example.

# CORRECTIONS FROM THE PHASE 4 AUDIT (rework attempt 2/2 — fix ALL of these in the regenerated page)

DEPTH now passes (1616 words) — keep the two worked examples and the added FAQs/mistake intact in substance.

1. **SENTENCE RHYTHM — the entire page runs almost exclusively long-band (15+ word) sentences (measured mechanically: multiple runs of 10+ consecutive long sentences in `introText`/`howItWorks`, and again across the FAQ answers, plus a run of five consecutive sentences all within 3 words of each other in the FAQs).** This is a technical, formula-heavy page, which tends to produce uniformly long sentences — counter that deliberately:
   - Break up dense formula sentences into a short declarative + the formula, e.g. instead of one long sentence stating what CAGR is AND giving the formula AND naming every variable, split it: a short sentence naming what CAGR is, then a separate short/medium sentence giving the formula.
   - In at least 4 of the 8 FAQ answers, open with a short (1-8 word) direct-answer sentence ("Yes, they're the same." / "No, it does not." / "It does not measure risk.") before the explanation, rather than a long compound first sentence.
   - Re-read the whole page once at reading speed after rewriting — if any run of 10 consecutive sentences still sits in one length band, keep splitting.

Do not shorten the page's substance or remove either worked example, any FAQ, or any fact to fix this — vary sentence LENGTH, not content.
