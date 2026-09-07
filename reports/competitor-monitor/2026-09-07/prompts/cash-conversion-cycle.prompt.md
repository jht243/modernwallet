## ROW DATA — cash-conversion-cycle

- **route:** /cash-conversion-cycle/
- **page type:** explainer / tool hub (floor 1,200 body words across introText + howItWorks + faqs)
- **register:** operator
- **medium:** interactive tool → interactive tool (already built; this prompt is only for the hub
  page's `introText`, `howItWorks`, and `faqs` prose)
- **primary keyword:** cash conversion cycle calculator
- **secondary keywords:** cash conversion cycle formula, CCC calculator, how to calculate cash conversion cycle
- **intent:** a small-business owner wants to know how many days their cash is tied up in
  inventory and unpaid invoices before it comes back — directly relevant to whether they need a
  line of credit or invoice factoring to bridge that gap.

### COVERAGE FLOOR — a competitor (Omni Calculator) published a tool on this topic
Title: Cash Conversion Cycle Calculator | CCC
Section outline: What is the cash conversion cycle?; Cash conversion cycle formula; How to
calculate the cash conversion cycle?; What does the cash conversion cycle tell?; Exceptional
cases: Negative cash conversion cycle; Real example of how to reduce the cash conversion cycle.

Cover every topic in this outline and beat its depth and usefulness. Write 100% ORIGINAL prose.
Do NOT copy or paraphrase the competitor's wording. Add information gain: tie the metric directly
to the business-financing decision (a long CCC is exactly the gap a merchant cash advance,
invoice factoring, or line of credit is priced to bridge) rather than treating it as pure
academic ratio analysis. Never reference or name the competitor on the page.

### THE CALCULATOR'S OWN FORMULA (the closed source of truth for `howItWorks`)
`CCC = Days Inventory Outstanding (DIO) + Days Sales Outstanding (DSO) - Days Payable Outstanding (DPO)`
- `DIO = (Average Inventory / COGS) x Period Days` — how many days, on average, inventory sits
  before it sells.
- `DSO = (Average Accounts Receivable / Revenue) x Period Days` — how many days, on average, it
  takes to collect cash after a sale.
- `DPO = (Average Accounts Payable / COGS) x Period Days` — how many days, on average, the
  business takes to pay its own suppliers.
- Use 365 for a full-year period or 90 for a quarter; all inputs must cover the same period.

### Worked example for introText (verify the arithmetic yourself before writing it)
COGS: $600,000/year. Average inventory: $90,000. Revenue: $1,000,000/year. Average receivables:
$110,000. Average payables: $70,000. Period: 365 days.
-> DIO = (90,000 / 600,000) x 365 = 54.8 days.
-> DSO = (110,000 / 1,000,000) x 365 = 40.2 days.
-> DPO = (70,000 / 600,000) x 365 = 42.6 days.
-> CCC = 54.8 + 40.2 - 42.6 = 52.4 days.
State this as an illustrative example with the calculator's default numbers.

### What the coverage-floor questions should say (no invented facts)
- The cash conversion cycle measures how many days pass between spending cash on inventory and
  collecting cash from the resulting sale, net of how long the business itself takes to pay its
  own suppliers.
- A NEGATIVE cash conversion cycle happens when DPO exceeds DIO + DSO — the business collects
  from customers and sells through inventory faster than it has to pay its own suppliers, so it
  is effectively financed by supplier credit rather than needing outside financing for its
  operating cycle. This is common in businesses with fast inventory turnover and short payment
  terms to customers (e.g., a grocery retailer that sells inventory in days but pays suppliers on
  30- to 60-day terms). Do not name a specific real company; describe the business type generally.
- To reduce the cash conversion cycle: collect receivables faster (lower DSO), turn over
  inventory faster or hold less of it (lower DIO), or negotiate longer payment terms with
  suppliers (raise DPO) — each lever maps to exactly one term in the formula above.
- Tie this explicitly to financing: a long cash conversion cycle is the specific gap that a line
  of credit, invoice factoring, or a merchant cash advance is priced to bridge, and knowing your
  own CCC number tells you how large a facility you actually need, rather than guessing.
- Do NOT invent an industry-average CCC number or benchmark. Say plainly that a "good" CCC varies
  enormously by industry (retail vs. manufacturing vs. services) and that comparing your own
  trend period-over-period is more useful than an external benchmark.

### CLOSED FACT LIST — anything not stated above, you do not know. Never invent a statistic or URL.
- The calculator's own formula and worked example, as stated above.
- General, uncontested definition of the cash conversion cycle and its three components (DIO,
  DSO, DPO). No specific real company name, no industry-average benchmark statistic.

### CLOSED URL LIST — none required. Prefer linking this site's own related pages.

### Internal links this page may use (real, live routes on this site)
- /operating-cash-flow/ (this run's sibling tool — fine to link)
- /merchant-cash-advance/ (business financing hub)
- /invoice-factoring/ (business financing hub)
- /business-line-of-credit/ (business financing hub)

### FAQ spec (answer each, direct-answer-first, at least 4)
1. What is the cash conversion cycle?
2. What is a negative cash conversion cycle and is it good?
3. How do I lower my cash conversion cycle?
4. What is a good cash conversion cycle number?
5. How does the cash conversion cycle relate to needing a business loan or line of credit?

### Other requirements
- introText + howItWorks + faqs combined must clear roughly 1,200 words of real prose.
- Follow `_content-standard.md` in full (already loaded in system-tool.md): direct-answer opener
  in introText, operator register with ONE "At ModernWallet, we…" first-person company claim
  somewhere in introText or howItWorks, show real arithmetic, no fabricated facts.
- No em-dashes. No banned anti-AI phrases.

---
# CORRECTIONS FROM THE PHASE 4 AUDIT (regeneration — apply all of these)

1. **Math error, now fixed above.** The worked example above was corrected: DSO = 40.2 days
   (not 40.1) and CCC = 52.4 days (not 52.3). Use ONLY the corrected figures above throughout
   introText, howItWorks, and any FAQ that repeats the worked example (e.g., the "shorten
   collection by 10 days" example: DSO drops from 40.2 to 30.2, cycle drops from 52.4 to 42.4).
2. **Overloaded sentence, hard fail.** Rewrite any single sentence over ~30 words into two
   sentences. Read every sentence once at reading speed before finalizing; if it needs a second
   read, split it.
3. **Sentence-rhythm hard fail (this is the main defect to fix).** The previous draft ran long
   monotone stretches: many consecutive sentences all sitting in the 15+ word band, several runs
   of 5+ consecutive sentences within 3 words of each other. Deliberately vary sentence length
   throughout: mix in genuine short sentences (1-8 words) to carry emphasis, medium sentences
   (9-14 words), and long sentences (15-28 words, never a 30+ word run-on). No run of 10
   consecutive sentences may sit in only one length band. Do not achieve this by chopping every
   long sentence into fragments — some real long sentences are fine, just not back-to-back with
   no variation. Reread the whole draft once for rhythm alone before returning it.
