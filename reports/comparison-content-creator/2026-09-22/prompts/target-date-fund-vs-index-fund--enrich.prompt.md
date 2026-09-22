# ENRICHMENT — target-date-fund-vs-index-fund

Target page: src/data/guides.ts, slug "what-target-date-fund-should-i-choose"
route: /guides/what-target-date-fund-should-i-choose/
Task: add ONE new section to the existing `sections` array — a focused head-to-head
"Target-Date Fund vs Index Fund" sub-section with a comparison table and a short verdict.
The page already has a single FAQ sentence touching this pair ("Target date fund or index
fund: which should I pick?") but no dedicated section or table — add the missing head-to-head
treatment. Do not repeat or contradict the existing FAQ answer; this section may go into more
practical detail than that one FAQ sentence does.

register: operator
page type: explainer / spoke (this is an ADDITION to an existing explainer page, not a new page)

## THE CLOSED FACT LIST — every number/claim this addition may state

- A target-date fund (TDF) is a single, pre-built portfolio that automatically shifts from
  stocks toward bonds as the target year approaches (the "glide path"), already explained
  earlier on this page.
- A plain index fund tracks one single market benchmark (e.g. the S&P 500, total U.S. stock
  market) and never shifts its own stock/bond mix on its own — the investor has to do any
  rebalancing manually.
- Many target-date funds are themselves built out of several underlying index funds — the two
  are not mutually exclusive, a TDF can literally contain index funds inside it.
- A TDF charges one all-in expense ratio for the whole moving mix; building the equivalent mix
  yourself out of separate index funds (e.g. a total stock market fund plus a bond fund)
  usually costs less in aggregate fees, but requires the investor to manually rebalance the
  stock/bond split over time, which a TDF does automatically.
- This site's own guide on [best index funds](/roundup/best-index-funds/) and its
  [index fund vs ETF](/compare/index-fund-vs-etf/) comparison are already linked earlier on
  this page for readers who want to build the DIY version themselves.
- Do NOT invent specific expense-ratio numbers for either approach beyond what the page
  already states elsewhere (it already gives one Labor Department fee example: a $25,000
  401(k) balance at 7% growth ends near $227,000 after 35 years at a 0.5% fee, versus about
  $163,000 at a 1.5% fee — you may reference that existing example instead of inventing a new
  number, but do not invent a new specific fee figure).

## THE CLOSED URL LIST — no new external links needed for this addition (internal links only)

## Internal links to use (real routes only)

- [best index funds](/roundup/best-index-funds/) (already used earlier on the page; fine to reuse)
- [index fund vs ETF](/compare/index-fund-vs-etf/) (already used earlier on the page; fine to reuse)
- [401(k) calculator](/retirement/401k-calculator/) (already used earlier on the page; fine to reuse)

## The page's CURRENT text (for voice-matching and to avoid repeating what's already said)

See attached --page file: the full "what-target-date-fund-should-i-choose" guide entry.

## Output

ONE new section: a `## ` heading "Target-Date Fund vs Index Fund: Which Should You Pick" (Title
Case, no colon-drama), followed by 2-3 short paragraphs that:
1. State the core structural difference plainly (one manages the mix for you, one does not).
2. Add a comparison table (markdown GFM pipe table) with at least 4 rows: what it is, who
   rebalances it, what it costs to run, who it fits.
3. Close with a one- or two-sentence verdict: pick a target-date fund if you want one holding
   that rebalances itself with no ongoing effort; pick separate index funds yourself if you
   want the lowest possible aggregate fee and are willing to rebalance the stock/bond split on
   your own on a schedule (e.g. once a year).
Do not restate the existing FAQ answer's exact wording. Do not add a new FAQ entry.
