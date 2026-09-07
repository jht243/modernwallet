## ROW DATA — life-insurance-needs

- **route:** /life-insurance-needs/
- **page type:** explainer / tool hub (floor 1,200 body words across introText + howItWorks + faqs)
- **register:** operator
- **medium:** interactive tool → interactive tool (a real React calculator, already built; this
  prompt is only for the hub page's `introText`, `howItWorks`, and `faqs` prose)
- **primary keyword:** life insurance needs calculator
- **secondary keywords:** how much life insurance do I need, life insurance calculator
- **intent:** a reader deciding how much term life insurance coverage to buy wants a real number,
  not a flat "10x your income" rule of thumb.

### COVERAGE FLOOR — a competitor (Financial Mentor) published a tool on this topic
Title: Life Insurance Calculator: How Much Life Insurance Do I Need?
Section outline: Figure Out How Much Life Insurance You Need; How Much Life Insurance Do You
Need?; What Is Life Insurance?; Who Needs Life Insurance?; Benefits of Life Insurance; Using The
Life Insurance Calculator To Make The Math Simple; Where Do You Buy?; Term vs. Permanent; Life
Insurance Shopping Tips; Life Insurance Calculator: Terms & Definitions.

Cover every topic in this outline and beat its depth and usefulness — but do so through the
lens of THIS calculator's own formula (present-value income replacement, not the competitor's
inputs). Write 100% ORIGINAL prose. Do NOT copy or paraphrase the competitor's wording. Add
information gain: this calculator present-values the income-replacement years at a stated real
discount rate instead of using a flat income multiple, which the competitor's tool does not do.
Never reference or name the competitor on the page.

### THE CALCULATOR'S OWN FORMULA (the closed source of truth for `howItWorks`)
The tool computes: `recommendedCoverage = incomeReplacementPV + obligationsTotal - resourcesTotal`
- `incomeReplacementPV` = the present value of an n-year annuity of the user's annual income to
  replace, discounted at a REAL (inflation-adjusted) annual rate of 3%. Formula:
  `annualIncome * ((1 - (1 + 0.03)^-yearsToReplace) / 0.03)`. State plainly why a present-value
  calculation is more defensible than a flat "multiply income by a number of years" approach: a
  lump sum invested today, earning a real 3% return, can pay out that same annual income for the
  stated number of years without needing the full undiscounted sum, because the remaining
  balance keeps earning a return between payouts.
- `obligationsTotal` = other debt (cards, auto, student loans) + remaining mortgage balance +
  final expenses (funeral/estate settlement costs) + an education fund for any children.
- `resourcesTotal` = existing life insurance coverage already in force + liquid savings and
  investments the family could draw on immediately.
- `recommendedCoverage` = incomeReplacementPV + obligationsTotal − resourcesTotal, floored at $0.

### Worked example for introText (use these exact numbers, they are internally consistent —
verify the arithmetic yourself before writing it)
Annual income to replace: $70,000. Years of replacement needed: 15. Other debt: $10,000.
Mortgage balance: $250,000. Final expenses: $15,000. Education fund: $60,000. Existing coverage:
$50,000. Liquid savings: $30,000.
-> incomeReplacementPV ≈ $835,655 (a 15-year, $70,000/year annuity at a 3% real discount rate).
-> obligationsTotal = $335,000. resourcesTotal = $80,000.
-> recommendedCoverage ≈ $1,090,655.
State this as an illustrative example with the calculator's default numbers, not a universal
answer — every household's real number depends on its own inputs.

### What "term vs. permanent" and "who needs life insurance" should say (no invented facts)
- Term life insurance covers a fixed number of years (commonly 10, 20, or 30) at a level premium
  and pays a death benefit only if the insured dies during that term. Permanent life insurance
  (whole or universal) lasts for life and builds cash value, at a much higher premium. This
  calculator estimates a COVERAGE AMOUNT, which applies to either type — the term-vs-permanent
  decision is a separate question. Link this site's existing [term life vs. universal life
  insurance comparison](/compare/term-life-vs-universal-life-insurance/) for that decision rather
  than re-explaining it here.
- Anyone whose death would create a financial gap for a dependent — a spouse, a child, an aging
  parent they support — has a real case for coverage. A household with no dependents and no debt
  a survivor would inherit has a much smaller (or no) need; say this plainly rather than implying
  everyone needs a large policy.
- Do NOT state a specific average premium dollar figure — no verified premium data is on the
  closed fact list below. Tell the reader that premiums depend on age, health, coverage amount,
  and term length, and that getting quotes from a licensed insurer or independent agent is the
  only way to see a real price.

### CLOSED FACT LIST — anything not stated above or here, you do not know. Never invent a price,
statistic, or URL.
- The calculator's own formula and the 3% real discount rate assumption, as stated above.
- Term life insurance: fixed-length coverage (commonly 10/20/30 years), level premium, pays only
  on death within the term. Permanent life insurance: lifetime coverage, builds cash value,
  higher premium. (General, uncontested definitions — no specific carrier or price.)
- No average premium, no specific carrier name, no underwriting statistic is on this list.

### CLOSED URL LIST — the only external hrefs allowed (also in allowed-urls.txt)
(none required for this page — if you cite an outside fact, it must trace to the list above,
which has no URL; prefer linking this site's own related pages instead)

### Internal links this page may use (real, live routes on this site)
- /compare/term-life-vs-universal-life-insurance/
- /compare/final-expense-insurance-vs-whole-life-insurance/
- /retirement/ (for readers whose real need is retirement income, not life insurance)

### FAQ spec (answer each, direct-answer-first, at least 4)
1. How much life insurance do I actually need?
2. Is a flat "10x your income" rule good enough?
3. What is the difference between term and permanent life insurance for this calculator's purpose?
4. Do I need life insurance if I have no kids or debt?
5. Why does this calculator use a discount rate instead of just multiplying my income by the years?

### Other requirements
- introText + howItWorks + faqs combined must clear roughly 1,200 words of real prose (this is a
  tool hub, not a full article, but must still answer the intent completely on-page).
- Follow `_content-standard.md` in full (already loaded in system-tool.md): direct-answer opener
  in introText, operator register with ONE "At ModernWallet, we…" first-person company claim
  somewhere in introText or howItWorks, show real arithmetic (QUALITY/DEPTH), no fabricated facts.
- No em-dashes. No banned anti-AI phrases.

---
# CORRECTIONS FROM THE PHASE 4 AUDIT (regeneration — apply all of these)

1. **Overloaded sentence, hard fail.** The previous draft's introText opened its worked example
   as one 54-word sentence ("For example, if you earn $70,000 a year and need 15 years of income
   replacement, carry $10,000 in other debt, owe $250,000 on a mortgage, budget $15,000 for final
   expenses, and allocate $60,000 for a child's education fund, your total obligations reach
   $1,170,655 when your income stream is discounted at a 3% real rate."). Split any sentence like
   this into two: state the inputs in one sentence, the result in the next. Read every sentence
   once at reading speed before finalizing; if it needs a second read, split it.
2. **Sentence-rhythm hard fail (this is the main defect to fix).** The previous draft ran long
   monotone stretches: long runs of consecutive sentences all in the 15+ word band with almost no
   short sentences anywhere (0 short sentences out of 56 total). Deliberately vary sentence
   length throughout: mix in genuine short sentences (1-8 words) to carry emphasis, medium
   sentences (9-14 words), and long sentences (15-28 words, never a 30+ word run-on). No run of
   10 consecutive sentences may sit in only one length band. Do not achieve this by chopping
   every long sentence into fragments — some real long sentences are fine, just not back-to-back
   with no variation. Reread the whole draft once for rhythm alone before returning it.
