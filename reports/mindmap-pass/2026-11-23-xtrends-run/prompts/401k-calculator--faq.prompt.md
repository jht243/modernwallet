# TASK: write answers for TWO new FAQ entries on /retirement/401k-calculator/
Output format: markdown with exactly one `## Frequently Asked Questions` heading, then each entry as `### <question>` followed by its answer (2 to 3 sentences, answer first). Use these exact questions:
1. Should I sell my 401(k) when the market drops?
2. How much does my 401(k) need to gain to recover from a 20% drop?
Each answer leads with the direct answer. Answer 1 must be conditional on time horizon and goals, must say this page cannot judge your situation, may cite FINRA's goals, diversification, avoid-impulsive-moves and dollar-cost-averaging points (link FINRA once, and define Financial Industry Regulatory Authority (FINRA)), and must not say selling locks in losses. Answer 2 uses: a 20% drop from a hypothetical $100,000 leaves $80,000 and needs a 25.00% gain, about 3.3 years at a constant 7% return with no contributions, and says real returns vary. These must agree with the section "What a Market Drop Does to Your 401(k) Balance" (10% drop needs 11.11%, 20% needs 25.00%, 30% needs 42.86%).
# CLOSED FACT LIST
Same as the section: $100,000 hypothetical; 10% drop -> $90,000, 11.11% needed, about 1.6 years at 7%; 20% -> $80,000, 25.00%, about 3.3 years; 30% -> $70,000, 42.86%, about 5.3 years; return and years assume constant 7%, no contributions, fees, taxes or inflation. FINRA page Investor Tips for Turbulent Markets: clarify goals tied to a long-term plan, diversify across and within asset classes, avoid impulsive moves in volatile markets, dollar-cost averaging can reduce emotional decision-making. FINRA does not say selling locks in losses.
# CLOSED URL LIST
https://www.finra.org/investors/insights/tips-turbulent-market
# INTERNAL ROUTES you may link
/portfolio-rebalancing-calculator/

# OUTPUT CONTRACT (enrichment of an EXISTING page; this is NOT a new page)
- Output markdown only. One `## ` heading and `### ` question lines as specified. No H1. No front matter. No code fences.
- Any table is a GitHub-style pipe table (header row, separator row, body rows) on its own lines.
- Write at a 7th to 8th grade reading level, in the site's editorial "we" voice (operator register). Address the reader as "you" only as a reader, never assume what they own.
- Zero em-dashes. No semicolons joining clauses. No "honest". No "not X, but Y" flourish. Never write "the vendor/the platform/the tool/the company" for a named subject. Link the first mention of every named organization with a markdown link using ONLY URLs from the CLOSED URL LIST or the INTERNAL ROUTES list. Do not invent URLs.
- Use ONLY facts and numbers from the CLOSED FACT LIST. Anything not on it, you do not know. Do not add statistics, dates, quotes, sponsor names, or news.
- Paragraphs are at most 3 sentences. Vary sentence length. Three or more parallel items go in a list.
- Do not mention this page, this article, or the reader's search. Do not use a Conclusion or Summary heading.
- Do NOT claim we tested anything. The only first-party basis is our internal modeling (calculation). Never write "we tested", "in our testing", or "tested".

