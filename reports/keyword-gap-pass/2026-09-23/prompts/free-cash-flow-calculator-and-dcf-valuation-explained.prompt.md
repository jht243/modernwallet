# Row prompt — Free Cash Flow Calculator and DCF Valuation Explained

route: /guides/free-cash-flow-calculator-and-dcf-valuation-explained/
slug: free-cash-flow-calculator-and-dcf-valuation-explained
page type: explainer (floor: 1,200 body words)
register: operator
medium: text → text
primary keyword: free cash flow calculator (210/mo, DataForSEO, KD 18)
secondary keywords: free cash flow calculation formula, free cash flow growth rate, free cash
flow yield, free cash flow conversion rate, levered vs unlevered free cash flow, discounted free
cash flow model, free cash flow terminal value, NOPAT, free cash flow margin, operating cash
flow ratio

## reader question
"How do I calculate free cash flow, and how is it different from the operating cash flow this
site's calculator already measures?"
[evidence: ~50 raw Autocomplete completions this run under the "operating cash flow calculator"
seed were actually about "free cash flow" — a distinct, uncovered metric — spanning the basic
formula through DCF-valuation sub-concepts (growth rate, terminal value, yield, NOPAT); ac ~50/97]

## answer placement
Section 1 must open with the formula itself (FCF = Operating Cash Flow − Capital Expenditures)
and state explicitly, in the first section, that this is a DIFFERENT number from the operating
cash flow this site's `/operating-cash-flow/` calculator computes — do not spend section 1 on
company history or general "why cash flow matters" background.

## CLOSED FACT LIST — anything not on this list, you do not know. Never invent a specific
company's FCF figure or a specific growth-rate/discount-rate number; every example number below
is a FORMULA STRUCTURE example, not a real company's actual reported figure — say so.

1. Free cash flow (FCF) = net cash provided by operating activities − capital expenditures. This
   is the standard definition companies use when they voluntarily disclose FCF as a non-GAAP
   measure in SEC filings. [Source: SEC, Non-GAAP Financial Measures staff guidance —
   https://www.sec.gov/rules-regulations/staff-guidance/corporation-finance-interpretations/non-gaap-financial-measures]
2. The SEC's own guidance explicitly cautions that FCF should not be presented as if it were cash
   fully available for discretionary spending, because a company still has non-discretionary
   obligations — mandatory debt service and other required payments — that FCF does not
   subtract. [Same SEC source as fact 1.]
3. Unlevered free cash flow (also called Free Cash Flow to Firm, FCFF) represents cash available
   to ALL capital providers (both debt and equity holders) before financing decisions. Formula:
   FCFF = EBIT × (1 − tax rate) + depreciation & amortization − capital expenditures − increase
   in net working capital. EBIT × (1 − tax rate) is also called NOPAT (Net Operating Profit
   After Tax), so FCFF = NOPAT + D&A − CapEx − change in net working capital. [Source: Wall
   Street Prep, "Unlevered Free Cash Flow (UFCF)" — https://www.wallstreetprep.com/knowledge/unlevered-free-cash-flow/]
4. Levered free cash flow (also called Free Cash Flow to Equity, FCFE) represents cash available
   specifically to EQUITY holders, after debt obligations are paid. Formula: FCFE = unlevered
   FCF (FCFF) − after-tax interest expense + net new borrowing. Because FCFE reflects cash left
   for equity holders only, the correct discount rate to value it is the cost of equity, not the
   overall cost of capital used for FCFF. [Same Wall Street Prep source as fact 3.]
5. Free cash flow yield = free cash flow per share ÷ market price per share, expressed as a
   percentage — it measures how much free cash flow a company generates relative to what
   investors are paying for the stock, the FCF equivalent of an earnings yield. [Source: Wall
   Street Prep, "Free Cash Flow Yield (FCFY)" — https://www.wallstreetprep.com/knowledge/free-cash-flow-yield/]
6. In a discounted cash flow (DCF) valuation model, a company's projected free cash flows are
   forecast for a set number of years, then a "terminal value" estimates everything beyond that
   forecast window using the Gordon Growth formula: Terminal Value = (final year's FCF × (1 +
   perpetuity growth rate)) ÷ (discount rate − perpetuity growth rate). The terminal value
   commonly represents the majority (roughly 60% to 75%) of a DCF's total estimated value, so a
   small change in the assumed perpetuity growth rate or discount rate moves the whole valuation
   substantially. [Same Wall Street Prep source as fact 3, Gordon Growth Model page cross-
   referenced in that same knowledge base.]
7. Free cash flow margin = free cash flow ÷ revenue, expressed as a percentage — it shows what
   share of every revenue dollar a company converts into free cash, and is a useful complement to
   the "free cash flow conversion rate" concept (how efficiently a company turns its accounting
   profit, e.g. EBITDA, into actual free cash).
8. This site's own `/operating-cash-flow/` calculator computes operating cash flow using the
   FASB ASC 230 indirect method (net income + non-cash add-backs +/− working capital changes) —
   it does NOT subtract capital expenditures, which is the one additional step that turns
   operating cash flow into free cash flow.
9. `/cash-conversion-cycle/` on this site measures a related but distinct concept: how many days
   cash stays tied up in inventory and receivables before collection, not a dollar amount of
   cash generated.

## CLOSED URL LIST (only these external links, on first mention of the named entity)
- https://www.sec.gov/rules-regulations/staff-guidance/corporation-finance-interpretations/non-gaap-financial-measures
  → "the SEC" / "SEC guidance on non-GAAP financial measures" (first mention of the FCF formula
  and the discretionary-spending caution)
- https://www.wallstreetprep.com/knowledge/unlevered-free-cash-flow/ → "Wall Street Prep" (first
  mention of unlevered FCF / FCFF / NOPAT / the Gordon Growth terminal value formula)
- https://www.wallstreetprep.com/knowledge/free-cash-flow-yield/ → (first mention of FCF yield
  specifically, if the unlevered-FCF page mention has already used the "Wall Street Prep" name
  once — keep this as a bare link on "free cash flow yield" without re-naming Wall Street Prep a
  second time, per the anti-AI synonym-cycling rule; use judgment to avoid naming the same
  source twice in a row)

## internal links this page may use (real routes only)
- /operating-cash-flow/ — "the operating cash flow calculator" (link on first mention; this is
  the primary cross-link, since this new guide explicitly distinguishes itself from that page)
- /cash-conversion-cycle/ — "the cash conversion cycle calculator"
- /investing/sp500-calculator/ — if discussing growth-rate assumptions in a valuation context
- /investing/ — the general investing hub

## sections to cover (noun-phrase Title Case headings, 2-4 paragraphs each)
1. Direct answer: the FCF formula, and how it differs from this site's OCF calculator (facts 1, 2, 8)
2. Unlevered free cash flow (FCFF) and NOPAT — the formula, in full (fact 3)
3. Levered free cash flow (FCFE) — how it differs from unlevered, and why the discount rate must
   match (fact 4)
4. Free cash flow yield and free cash flow margin — two different ratios, two different questions
   (facts 5, 7)
5. How free cash flow feeds a DCF valuation: the terminal value / Gordon Growth formula, and why
   it dominates the total estimate (fact 6)
6. ANCHOR section: weave in ONE licensed DOMAIN framing — e.g. "In the guides we publish here, we
   keep operating cash flow, free cash flow, and the cash conversion cycle as three separate
   tools rather than one blended number, because each answers a different question about where a
   business's cash actually goes" — tied to facts 8-9. No invented client or number.

## FAQ questions
- What is the formula for free cash flow?
- What is the difference between free cash flow and operating cash flow?
- What is the difference between levered and unlevered free cash flow?
- What is free cash flow yield?
- How does free cash flow feed into a DCF valuation's terminal value?

## Note on this repo's page shape
This repo's `Guide` interface has no `inlineCta` field — do not add one. Use the `tools` array to
link `/operating-cash-flow/` and `/cash-conversion-cycle/`.
