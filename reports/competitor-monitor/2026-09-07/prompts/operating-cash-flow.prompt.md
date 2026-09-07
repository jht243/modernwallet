## ROW DATA — operating-cash-flow

- **route:** /operating-cash-flow/
- **page type:** explainer / tool hub (floor 1,200 body words across introText + howItWorks + faqs)
- **register:** operator
- **medium:** interactive tool → interactive tool (already built; this prompt is only for the hub
  page's `introText`, `howItWorks`, and `faqs` prose)
- **primary keyword:** operating cash flow calculator
- **secondary keywords:** how to calculate operating cash flow, operating cash flow formula
- **intent:** a small-business owner or operator wants to know whether their core operations
  generated or consumed cash this period, separate from financing/investing activity — this is
  the number a lender checks before extending a line of credit or loan.

### COVERAGE FLOOR — a competitor (Omni Calculator) published a tool on this topic
Title: Operating Cash Flow Calculator
Section outline: What is operating cash flow?; How to calculate the operating cash flow?; How to
interpret cash flow from operating activities?; How to find operating cash flow?; What is a good
operating cash flow?; How long until operating cash flow doubles?; What is the operating cash
flow formula?; Why is operating cash flow important for investors?; Is operating cash flow the
same as net income?; How to improve cash flow from operations?; What to do if a company reported
negative operating cash flow?

Cover every topic in this outline and beat its depth and usefulness. Write 100% ORIGINAL prose.
Do NOT copy or paraphrase the competitor's wording. Add information gain: tie this specifically to
the business-financing decision (a lender's cash-flow covenant, whether a business qualifies for
a line of credit) rather than treating it as a pure investor-analysis metric. Never reference or
name the competitor on the page.

### THE CALCULATOR'S OWN FORMULA (the closed source of truth for `howItWorks`)
Indirect method (FASB ASC 230), the same reconciliation a company's own cash flow statement uses:
`operatingCashFlow = netIncome + nonCashAddBacks + workingCapitalChange`
- `nonCashAddBacks = depreciation + amortization` (non-cash expenses that reduced net income but
  did not use any actual cash).
- `workingCapitalChange = -changeInReceivables - changeInInventory + changeInPayables + otherAdjustments`.
  A GROWING asset (receivables, inventory) TIES UP cash, so it is subtracted. A GROWING liability
  (payables) FREES UP cash, so it is added.
- Does not include investing or financing cash flows (those are separate sections of a real cash
  flow statement; this tool isolates operations only).

### Worked example for introText (verify the arithmetic yourself before writing it)
Net income: $120,000. Depreciation: $25,000. Amortization: $5,000. Change in receivables:
+$15,000 (grew). Change in inventory: +$10,000 (grew). Change in payables: +$8,000 (grew). Other
adjustments: $0.
-> nonCashAddBacks = $30,000. workingCapitalChange = -$15,000 - $10,000 + $8,000 = -$17,000.
-> operatingCashFlow = $120,000 + $30,000 - $17,000 = $133,000.
State this as an illustrative example with the calculator's default numbers.

### What the coverage-floor questions should say (no invented facts)
- Operating cash flow is the cash a business's core operations generate or consume, separate from
  buying equipment (investing) or borrowing/repaying debt (financing).
- It differs from net income because net income includes non-cash charges (depreciation,
  amortization) and accrual-based revenue/expenses that have not yet turned into actual cash
  received or paid — that's exactly what the formula's add-backs and working-capital adjustments
  correct for.
- A negative operating cash flow means core operations consumed more cash than they generated;
  say plainly that a lender evaluating a cash-flow-based covenant treats this as a warning sign
  regardless of what net income shows, and that a business with a persistently negative operating
  cash flow should look at its cash conversion cycle (link the sibling tool below) before taking
  on more debt to cover the gap.
- To improve operating cash flow: collect receivables faster, hold less inventory, negotiate
  longer payment terms with suppliers (extends payables) — every one of these levers is exactly
  one of the working-capital terms in the formula above. Do not invent an industry benchmark
  number for "what is a good operating cash flow" — state instead that it depends on the
  business's size and industry, and that comparing your own trend period-over-period matters more
  than a single external benchmark.
- Do NOT state a specific "how long until it doubles" timeline or an industry average — no
  verified figure for either is on the closed fact list. Say plainly there is no reliable general
  benchmark and route the reader to comparing their own trend.

### CLOSED FACT LIST — anything not stated above, you do not know. Never invent a statistic or URL.
- The calculator's own formula and worked example, as stated above.
- General, uncontested definitions of operating cash flow, net income, and the indirect-method
  reconciliation (FASB ASC 230). No specific company, benchmark, or industry-average statistic.

### CLOSED URL LIST — none required. If you name a standard-setter (FASB), do not link it unless
you are certain of its official URL; safer to name it without a link than guess a URL. Prefer
linking this site's own related pages instead.

### Internal links this page may use (real, live routes on this site)
- /cash-conversion-cycle/ (this run's sibling tool — fine to link once it's referenced as "our
  cash conversion cycle calculator")
- /merchant-cash-advance/ (business financing hub)
- /business-line-of-credit/ (business financing hub)

### FAQ spec (answer each, direct-answer-first, at least 4)
1. What is operating cash flow?
2. Is operating cash flow the same as net income?
3. What does negative operating cash flow mean for my business?
4. How can I improve my operating cash flow?
5. What is a good operating cash flow number?

### Other requirements
- introText + howItWorks + faqs combined must clear roughly 1,200 words of real prose.
- Follow `_content-standard.md` in full (already loaded in system-tool.md): direct-answer opener
  in introText, operator register with ONE "At ModernWallet, we…" first-person company claim
  somewhere in introText or howItWorks, show real arithmetic, no fabricated facts.
- No em-dashes. No banned anti-AI phrases.
