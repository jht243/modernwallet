# Row — voo-vs-spy-vs-qqq

route: /compare/voo-vs-spy-vs-qqq/
slug: voo-vs-spy-vs-qqq
page type: comparison
medium: text -> text
register: operator
depth floor: 1,500 body words
primary keyword: VOO vs SPY vs QQQ
secondary keywords: voo spy qqq comparison, voo vs spy vs qqq expense ratio, voo vs spy vs qqq performance
intent: a reader who already knows VOO and SPY are both S&P 500 trackers, deciding whether to add
or swap in QQQ (Nasdaq-100) for a more growth/tech-tilted allocation — this is a "how is the third
option genuinely different" comparison, not a rehash of the existing VOO-vs-SPY expense-ratio angle.

reader question: "How is QQQ actually different from VOO and SPY, not just cheaper or more
expensive?"
[grounded in repeated Google Autocomplete demand around this site's existing /compare/voo-vs-spy/
winner: "voo vs spy vs qqq", "voo spy or qqq", "voo spy or qqq reddit", "voo vs spy vs qqq expense
ratio", "voo vs spy vs qqq performance", "voo vs spy vs qqq vs schd", "voo vs spy vs qqq vs vti" —
a repeated, multi-phrasing cluster distinct from the two-way voo-vs-spy queries the sibling page
already serves]
answer: State plainly that QQQ tracks a different index (Nasdaq-100, not the S&P 500), which makes
it far more concentrated in mega-cap technology names than either VOO or SPY, then give the actual
concentration numbers side by side.
answer placement: section 1 ("Same S&P 500, different index — what QQQ actually tracks") + the
comparison table above it — this is a "how is X different" question, so the real index-composition
answer comes first, not after generic ETF-mechanics scene-setting.

optionAName: VOO / SPY (S&P 500 ETFs)
optionBName: QQQ (Nasdaq-100 ETF)

Note on framing: this page compares THREE tickers (VOO, SPY, QQQ), but VOO and SPY track the
IDENTICAL index (the sibling /compare/voo-vs-spy/ page already covers their expense-ratio/structure
differences in full) — do not re-litigate VOO vs SPY here beyond a brief one-sentence pointer to
that sibling page. The real comparison this page exists to make is EITHER S&P 500 fund vs QQQ.
Use "optionA" = "VOO/SPY" (grouped, since they track the same index) and "optionB" = "QQQ" in the
JSON output's optionA/optionB fields — the comparisonTable's "a" column may state VOO's and SPY's
numbers together (e.g. "0.03% (VOO) / 0.0945% (SPY)") where they differ from each other.

## THE CLOSED FACT LIST — the only numbers this page may state

Anything not on this list, you do not know. Never invent a price, limit, benchmark, or URL; say
it is unpublished and tell the reader to verify at the vendor page.

**VOO (already published on this site's own `/compare/voo-vs-spy/` page — reuse verbatim, do not
recompute):**
- Expense ratio: 0.03%
- Structure: open-end fund (ETF share class of the Vanguard 500 Index Fund)
- Inception: September 2010
- AUM: about $979 billion (ETF share class, as of June 30, 2026)
- Tracks the S&P 500 Index

**SPY (already published on this site's own `/compare/voo-vs-spy/` page — reuse verbatim):**
- Expense ratio: 0.0945%
- Structure: unit investment trust (UIT)
- Inception: January 1993 — the first U.S.-listed ETF
- AUM: about $805 billion (as of August 2026)
- Tracks the S&P 500 Index

**QQQ (independently verified for this page via Invesco's own site and SEC EDGAR filings —
sources below):**
- Trading liquidity: per Invesco's own QQQ fund page, QQQ is the "2nd-most traded ETF in the U.S.,
  based on average daily volume" and carries a deep, heavily used options market.
- Expense ratio: 0.18%
- Structure: unit investment trust (UIT) — the same legal structure as SPY, not the open-end
  structure VOO uses
- Inception: March 10, 1999
- AUM: approximately $485.8 billion (net assets per Invesco QQQ Trust, Series 1's SEC Form
  NPORT-P filing, as of June 30, 2026)
- Tracks the Nasdaq-100 Index — the 100 largest non-financial companies listed on the Nasdaq
  stock exchange, weighted by modified market capitalization (NOT the S&P 500's ~500 companies
  across all sectors including financials)
- Holds 102 total positions
- Top 10 holdings: approximately 47.3% of total fund assets
- Information Technology sector weight: approximately 57.8% of total fund assets

**S&P 500 (VOO/SPY) concentration, for direct comparison to QQQ's numbers above (per Pensions &
Investments' S&P 500 concentration reporting and index-provider sector data cited in the URL list
below, as of 2026):**
- Top 10 holdings: just over 37% of total index weight (some 2026 readings put it closer to 39%
  — state it as "just over 37%, and by some measures closer to 39%" rather than picking one exact
  figure, since sources vary slightly)
- Information Technology sector weight: roughly a third of the index (do not state a more precise
  decimal than "roughly a third" / "about 30%" — sources vary)

**The actual concentration gap this page exists to explain:**
- QQQ's top-10 concentration (~47.3%) is meaningfully higher than the S&P 500's (~37-39%) —
  roughly 8 to 10 percentage points more concentrated in its ten largest names.
- QQQ's technology-sector weight (~57.8%) is roughly DOUBLE the S&P 500's (~a third) — this is
  the single most important practical difference for a reader deciding whether to add QQQ.
- Do NOT state that QQQ is "riskier" or "better" as a blanket claim — state the concentration
  fact and let the reader's own risk tolerance and existing sector exposure (e.g., a reader who
  already holds individual tech stocks outside a fund) decide what it means for them.

**Do NOT invent:**
- A specific historical or projected total-return performance figure for QQQ vs VOO/SPY (no
  verified total-return number is on this fact list — if the reader question of "performance"
  needs addressing, describe the MECHANISM — a more concentrated, single-index fund like QQQ will
  swing further in both directions than a broader S&P 500 fund — without citing a specific % return).
- A specific dividend yield number for QQQ (not on this fact list).
- Any claim that QQQ was reclassified from a UIT to an open-end fund — this was NOT confirmed by
  the direct SEC filing check and must not appear on this page.

## THE CLOSED URL LIST — the only external hrefs this page may use

- https://www.invesco.com/qqq-etf/en/home.html — Invesco, QQQ ETF fund page (expense ratio,
  inception date, structure)
- https://www.sec.gov/Archives/edgar/data/0001067839/000106783926000030/edgar.htm — SEC EDGAR,
  Invesco QQQ Trust Series 1 Form NPORT-P (net assets, holdings count)
- https://www.pionline.com/data-rankings/chart-of-the-day/pi-sp500-index-concentration/ —
  Pensions & Investments, S&P 500 top-10 concentration reporting
- https://fund-docs.vanguard.com/F0968.pdf — Vanguard, VOO fund fact sheet (already used on the
  sibling voo-vs-spy page)
- https://www.ssga.com/library-content/products/factsheets/etfs/us/factsheet-us-en-spy.pdf —
  State Street, SPY fund fact sheet (already used on the sibling voo-vs-spy page)

## Internal links this page may use (real routes only, all already live on this site)

- /compare/voo-vs-spy/ — the sibling 2-way comparison (mention once for the VOO-vs-SPY
  expense-ratio/structure detail; do not restate its figures beyond what's on this fact list)
- /investing/sp500-calculator/ — S&P 500 calculator
- /investing/compound-interest-calculator/ — compound interest calculator
- /investing/dollar-cost-averaging-calculator/ — dollar-cost averaging calculator
- /guides/what-is-a-good-expense-ratio/ — expense ratio guide

## What to cover, section by section

1. **Same S&P 500, different index — what QQQ actually tracks** — lead with the real answer:
   QQQ tracks the Nasdaq-100, not the S&P 500 that both VOO and SPY track. State the concentration
   numbers (top-10 %, tech sector %) side by side immediately.
2. **VOO vs SPY, briefly** — one short paragraph pointing to the sibling `/compare/voo-vs-spy/`
   page for the expense-ratio/structure detail between the two S&P 500 funds; do not re-derive it
   here.
3. **What QQQ's concentration actually means for a portfolio** — the practical implication: a
   reader who already holds individual tech names, or who wants only ONE fund for their whole
   equity allocation, should understand QQQ is not a substitute diversifier the way a broad S&P
   500 fund is. Frame as "who this fits" / "who this doesn't fit," not a blanket recommendation.
4. **Deciding between them** — time horizon and existing sector exposure are the two real levers;
   no specific dollar amount or age recommendation beyond what the fact list supports.

## FAQ questions (write real answers grounded only in the closed fact list above)

- "Is QQQ just a more expensive version of VOO or SPY?"
- "How much more concentrated is QQQ than the S&P 500?"
- "Can I hold VOO or SPY and QQQ together, or does that overlap too much?"
- "Which is riskier, QQQ or an S&P 500 fund?"

## Objectivity requirement (per the output contract)

No fund is the automatic winner. At least one comparisonTable row must favor the S&P 500 funds
(their broader diversification / lower concentration) and at least one row must clearly favor QQQ
— use the trading-liquidity/options-market fact above (QQQ is the 2nd-most-traded U.S. ETF by
average daily volume with a deep options market) as that pro-QQQ row; do not rely only on
expense-ratio or concentration framing for QQQ, since those already favor the S&P 500 side. The
verdict names the concentration-tolerance / existing-exposure condition that decides it — never a
blanket "QQQ is better because tech has done well."

## CORRECTIONS FROM THE PHASE 4 AUDIT (this is a regeneration — apply both fixes)

1. **Objectivity violation**: the first draft's comparisonTable had every row favor the S&P 500
   side (lower expense ratio, lower concentration, open-end structure, no cash drag) with no row
   favoring QQQ. Fix: add a "Trading liquidity / options market" (or similarly named) dimension
   row where QQQ wins — cite the new trading-liquidity fact above (2nd-most-traded U.S. ETF by
   average daily volume, deep options market). Every other row may keep its existing framing.
2. **Banned filler word**: the first draft used "significant" ("creates significant portfolio
   overlap" in the Portfolio Overlap section) — a single-instance hype-word ban under this site's
   anti-AI-language standard. Do not use "significant," "substantial," "robust," "seamless," or
   any other hype-word-list filler anywhere on this page. State the plain fact instead (e.g., "a
   lot of portfolio overlap" or name the actual overlap mechanism) — re-check the whole draft, not
   just that one sentence.
