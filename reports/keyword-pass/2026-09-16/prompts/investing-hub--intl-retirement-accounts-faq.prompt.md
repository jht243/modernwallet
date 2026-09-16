# Section: investing hub (calculators.ts) — international retirement-account FAQ

Task: write ONE new FAQ answer (no heading) for the investing calculator hub (/investing/). The
question is already fixed (given below); write only the answer. This is a DIFFERENT angle from
the hub's existing "Does this calculator work outside the United States?" FAQ (which already
covers currency/compounding-formula portability) — do not repeat that FAQ's content. This new one
covers the account-type guidance specifically.

Question (verbatim, use exactly): "Do the 401(k), IRA, and TSP references on this page apply if I'm not in the United States?"

Why this FAQ is needed: Autocomplete shows "investment calculator australia", "netherlands",
"ontario", and "uk s&p 500" as real search demand. The hub's own howItWorks text already
recommends a specific US account-funding order (401(k) match, then Roth/traditional IRA, then
more 401(k), then taxable brokerage) and links a TSP calculator for federal employees — all of
which are US-specific wrappers with no direct equivalent abroad.

## CLOSED FACT LIST — anything not on this list, you do not know.
1. This investing calculator's own growth math (starting balance, monthly contribution, annual
   return, compounding) is currency-agnostic — it works the same in any currency if you enter
   your own numbers. This is our own already-published page content.
2. The account-funding order and account types the hub's howItWorks text names — 401(k), Roth
   IRA, traditional IRA, TSP — are all US retirement-account structures with no direct 1:1
   equivalent in another country's tax system. This is our own already-published page content
   (the hub currently frames its account guidance around these US wrappers).
3. This site's S&P 500 calculator spoke (/investing/sp500-calculator/) projects growth at the
   historical S&P 500 average return, which is a percentage rate — the rate itself is not
   currency-specific, but the calculator's dollar inputs and outputs are denominated in USD, so a
   UK or other international investor comparing it against a foreign-currency brokerage balance
   needs to convert their own contributions and balance into USD (or convert the USD output back
   into their own currency) before the numbers are comparable.
4. Do not name a specific non-US retirement account (e.g., a UK ISA, an Australian
   superannuation fund, a Canadian RRSP/TFSA) or any of their rules — none of those are on this
   fact list, and naming one without verified rules would be a fabrication.

## CLOSED URL LIST
No new external URLs. Internal link only: /investing/sp500-calculator/

## Output
Plain prose, 3-4 sentences, one paragraph, no heading. Lead with the direct answer (no, those are
US-specific account types), state that the growth math itself is currency-agnostic (fact 1), then
note the USD-conversion nuance for the S&P 500 calculator specifically (fact 3) with a markdown
link on its first mention, and tell the reader to substitute their own country's tax-advantaged
account rules rather than the US ones named on this page.
