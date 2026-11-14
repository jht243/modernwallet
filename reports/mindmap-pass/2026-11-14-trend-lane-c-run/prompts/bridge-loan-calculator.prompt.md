# ROW PROMPT (data only) — bridge-loan-calculator

route: /real-estate/bridge-loan-calculator/   chart row: MW-TL-03
medium: interactive tool → interactive tool   register: operator   page type: cost-pricing / spoke tool (depth floor 1,000 body words; write at least 1,150 words across introText, section bodies, commonMistakes items and FAQ answers)
primary keyword: bridge loan calculator. Also: how much bridge loan cost, bridge loan cost, bridge loan net proceeds.
page name (h1): Bridge Loan Calculator
title (50 to 60 chars, one clause, contains the primary keyword): suggested "Bridge Loan Calculator for Total Cost and Net Proceeds"
intent: a homeowner buying a new home before the old one sells wants the bridge loan's cost until the old home sells, the monthly outlay of carrying both homes, and the proceeds they keep.
reader question: "How much will a bridge loan cost me until my old home sells? [PAA 2/6 adjacent (does a bridge loan cost more; how do you calculate loan to cost), 4/6 off-topic: construction loan payment, 20% down payment, mortgage qualification; ac 3/16 question completions incl. how much bridge loan can i get, how much bridge loan cost]"
answer: The cost is the bridge loan's fees plus its interest for every month until the old home sells, on top of carrying both homes; the calculator returns the bridge cost, the monthly overlap outlay and the net proceeds you keep after the old mortgage, the bridge loan and selling costs (figure).
answer placement: section 1 "Calculate Your Bridge Loan Cost". The calculator is section 1 and sits directly under introText, so introText carries the answer first. Sentence 1 of introText must be short and easy: a bridge loan costs its fees plus a month of interest for every month until your old home sells. Sentence 2 says what the calculator returns. teeup-exempt: the attribution sentence sits beside the first finding in paragraph two.

## The calculator (describe only what it does; labels exactly as built)
Section heading above the tool: "Calculate Your Bridge Loan Cost".
Inputs: Expected sale price; Old mortgage payoff; Months until the old home sells; Selling costs (% of sale price); Bridge loan amount; Interest rate (APR); Origination (% of loan); Other fees; New mortgage payment, per month; Old home carrying costs, per month; optional Alternative cost, per month; optional Lender's max combined loan-to-value.
Outputs: Bridge loan cost; fees plus interest; Monthly overlap outlay; Overlap total; Bridge interest per month; Selling costs; Net proceeds from the old home; a warning when the sale does not cover the old mortgage, the bridge loan, its cost and selling costs; the most you could borrow at an entered combined limit; the break-even months against an entered alternative; an "If the old home sells in" table for 3, 6, 9 months and the months entered; a Copy results button.
Starting figures in the tool are examples, not lender data: $400,000 sale price, $200,000 payoff, $100,000 bridge loan at 10% APR, 2% origination, 6 months, 6% selling costs, $2,500 new mortgage payment and $1,800 old home carrying costs. Say plainly that they are example inputs and that the reader should enter the terms from their own lender quote.

## Evidence and attribution (evidence/bridge-loan-calculator/evidence.json, basis: calculated)
We ran the loan arithmetic on one example sale. Ask for ONE natural attribution beside the first worked-example finding in paragraph two of introText, e.g. "In our internal modeling, we ran one example sale through the calculator...", then what we found, then that readers can check it by entering their own terms. Do not say "tested". No other first-person claim. State no lender rate, fee, term or loan-to-value limit as typical, and do not restate any figure from the bridge loan vs HELOC comparison.

## CLOSED FACT LIST — every number the page may state. Anything not on this list, you do not know. Never invent a rate, fee, term, loan-to-value limit, statistic or URL; never say what lenders typically charge, require or allow.
- Conventions (state them on the page): bridge interest = loan x APR / 12 x months until the old home sells, simple, repaid from the sale proceeds at payoff. Fees = loan x origination % + other fees, charged once. Bridge cost = fees + interest. Selling costs = sale price x selling-cost %. Net proceeds = sale price - old mortgage payoff - bridge loan - bridge cost - selling costs. Monthly overlap outlay = new mortgage payment + old home monthly carrying costs (the reader enters the old mortgage payment, taxes, insurance and utilities inside the carrying figure). Break-even months against an alternative = bridge fees / (alternative monthly cost - bridge monthly interest), only when the alternative costs more each month than the bridge interest.
- Example sale (illustrative inputs, not lender data): sale price $400,000, old mortgage payoff $200,000, bridge loan $100,000 at 10% APR, 2% origination, 6 months, 6% selling costs.
  - Bridge interest $833.33 a month, $5,000 over 6 months. Fees $2,000. Bridge cost $7,000. Selling costs $24,000. Net proceeds $69,000 ($400,000 - $200,000 - $100,000 - $7,000 - $24,000).
- By months until the old home sells, same inputs: 3 months: interest $2,500, bridge cost $4,500, net proceeds $71,500. 6 months: $5,000, $7,000, $69,000. 9 months: $7,500, $9,500, $66,500. 12 months: $10,000, $12,000, $64,000. Each extra month adds $833.33 of interest and lowers net proceeds by $833.33.
- Overlap with a $2,500 new mortgage payment and $1,800 of old home carrying costs: $4,300 a month. Over 3, 6, 9 and 12 months that is $12,900, $25,800, $38,700 and $51,600.
- Against an example alternative costing $1,500 a month with no up-front fee, the bridge costs less once the old home takes more than 3.0 months to sell; if it sells sooner than that, the bridge costs more than that alternative. If the alternative costs no more per month than the bridge interest of $833.33, the bridge never costs less.
- Example lender limit: if a lender's maximum combined loan-to-value were 80%, the most to borrow on the example sale would be $120,000 ($400,000 x 80% - $200,000 payoff). The 80% is an example input the reader replaces with their lender's figure; no limit is standard.
- Boundary cases: with a payoff of $300,000 instead of $200,000 the example sale leaves negative $31,000 and the calculator warns that you would bring cash to closing. With no origination fee the 6-month bridge cost is $5,000 and net proceeds $71,000. With 0 months the cost is the $2,000 fee alone.
- Not modelled: closing costs on the new home, taxes on the sale, prepayment terms, interest paid monthly instead of at payoff, and lender-specific rules. The tool is not a loan offer. The term, rate, fees and limit come from the reader's own lender quote; the page states no standard term.
No other figures.

## CLOSED URL LIST — only external hrefs allowed
None. No external link on this page.

## Internal routes it may link (real routes only)
/compare/bridge-loan-vs-heloc/ (bridge loan vs HELOC), /real-estate/hard-money-loan-calculator/ (hard money loan calculator, shipping in this run), /guides/how-to-buy-and-sell-a-house-at-the-same-time/ (guide to buying and selling a house at the same time). No other internal route. No paragraph may be shared with the hard money page.

## Sections (exactly these headings, this order; the tool sits above them; "What the Calculator Does Not Include" is the commonMistakes list, FAQs follow)
1. "What a Bridge Loan Costs Month by Month": the conventions in two or three plain sentences, then ONE pipe table by months (columns: Months to sell, Interest, Bridge cost, Overlap outlay, Net proceeds) for 3, 6, 9 and 12 months, then one paragraph on the overlap outlay.
2. "How Much You Can Borrow": the reader enters their lender's maximum combined loan-to-value; the example 80% limit gives $120,000; no limit is standard; the lender sets it.
3. "When the Old Home Sells Late": each extra month adds $833.33 of interest and the overlap outlay; the break-even against an entered alternative; the negative-proceeds boundary; link [bridge loan vs HELOC](/compare/bridge-loan-vs-heloc/); then a short takeaway paragraph: bridge cost scales with months to sell, so price your own timeline before committing; who this is not for (a reader who needs a lender's quote: the calculator cannot supply one); what would change the answer (a longer sale, different fees, interest paid monthly). End the "sections" array on a concrete next action: enter your own months to sell and lender quote in the calculator above and read the Bridge loan cost line.
commonMistakes (heading shown on the page: "What the Calculator Does Not Include"): exactly 4 items: (a) closing costs on the new home; (b) taxes on the sale; (c) prepayment terms and lender-specific rules; (d) an investment purchase financed with a different short-term loan: link [hard money loan calculator](/real-estate/hard-money-loan-calculator/).

## FAQ questions (verbatim, in this order)
1. Does a bridge loan cost more?
2. How much bridge loan can I get?
3. How long does a bridge loan last?
FAQ 1 answer: only as a computed, input-labelled comparison: it depends on what you compare with; the calculator compares against an alternative monthly cost you enter; use the $1,500 example and the 3.0 months break-even; no universal claim; link [bridge loan vs HELOC](/compare/bridge-loan-vs-heloc/). FAQ 2 and 3: no standard loan-to-value or term; the lender's quote sets them; say how the calculator uses them.
