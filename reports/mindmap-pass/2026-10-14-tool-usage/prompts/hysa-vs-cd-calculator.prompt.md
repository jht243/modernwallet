# ROW PROMPT (data only) — hysa-vs-cd-calculator

route: /hysa-vs-cd-calculator/   page type: calculator hub entry (JSON keys per the output contract)
medium: interactive tool → interactive tool   register: operator   page type: explainer / spoke (calculator page; depth matches sibling calculator pages: intro ~140 words, howItWorks ~420 words, 8 FAQs)
primary keyword: hysa vs cd calculator (also: cd vs high yield savings calculator, CD or high-yield savings, which earns more)
intent: a saver with a lump sum (often an emergency fund) wants to know whether a certificate of deposit (CD) or a high-yield savings account (HYSA) earns more on their deposit for their term, and what happens if savings rates fall or they need the money early.
reader question: "Is it better to put my money in a CD or a high-yield savings account?" [PAA 3/6 which-earns-more; ac 1/1]
answer: A pick by figure: whichever earns more on your deposit for your term at today's two APYs, plus the HYSA rate drop that flips it. $25,000 for 12 months: CD at 4.25% APY earns $1,062.50, HYSA at 4.00% APY earns $1,000.00, so the CD earns $62.50 more if both rates hold.
answer placement: section 1 — introText paragraph one says which earns more is decided by the two APYs, the term and whether the HYSA rate holds; paragraph two is the $25,000 worked example. Do not open with definitions of a CD or a HYSA.

## The calculator (describe only what it does)
Inputs: deposit; term in months; HYSA APY; CD APY; optional HYSA APY later and the month it starts; CD early-withdrawal penalty in months of interest; optional month the CD is broken.
Outputs: which earns more and by how much; HYSA interest and CD interest; HYSA balance at the end and CD value at maturity; when a later HYSA rate is set, "the rate that ties them" (the HYSA APY needed for the rest of the term to match the CD); when a break month is set, the CD cash-out after the penalty and what the HYSA holds by then.
Method the page may state: APY already includes compounding, so the deposit grows by (1 + APY) each year; the tool applies that monthly as (1 + APY)^(1/12). The penalty is N months of interest at the CD rate on the deposit. No deposits after day one, no fees.
Assumptions the page must state: the APYs shown are placeholders, not today's market rates; a HYSA rate is variable and can change at any time, a CD rate is fixed for the term; each bank sets its own early-withdrawal penalty, so the reader copies it from the CD's terms.

## CLOSED FACT LIST — every number the page may state. Anything not on this list, you do not know. Never state a market-average rate, a bank's current APY, a typical penalty, a statute, or a statistic.
Worked examples (computed by the calculator):
- $25,000 for 12 months, HYSA 4.00% APY, CD 4.25% APY: HYSA interest $1,000.00; CD interest $1,062.50; the CD earns $62.50 more.
- Same, but the HYSA drops to 3.50% APY after month 6: HYSA interest $937.42; the CD earns $125.08 more. The rate that ties them: the HYSA would need about 4.50% APY for months 7 to 12 to match the CD.
- Breaking that CD at month 6 with a 3-month interest penalty: $25,525.72 before the penalty, a $260.59 penalty, $25,265.14 cash out. The HYSA would hold $25,495.10 by month 6 with no penalty.
- $10,000 for one year at 4.25% APY earns $425; at 4.00% APY it earns $400 (APY = one year's interest on the deposit).
- FDIC insurance covers deposits up to $250,000 per depositor, per insured bank, per ownership category (FDIC). Both CDs and savings accounts at FDIC-insured banks are covered.
No other figures.

## CLOSED URL LIST — only external hrefs allowed
None. Do not write any external link.

## Internal routes it may link (real routes only)
/investing/high-yield-savings-calculator/ (high-yield savings calculator), /cd-calculator/ (CD calculator), /compare/hysa-vs-cd/ (HYSA vs CD comparison), /emergency-fund-calculator/ (emergency fund calculator), /roundup/best-high-yield-savings-accounts/ (best high-yield savings accounts), /calculators/ (all calculators). No other internal route.

## Coverage
introText: as in the contract. howItWorks: (1) how the tool grows each deposit from its APY and compares the interest, with the $25,000 example; (2) savings rates move and CD rates do not: the 3.50% drop case and the tie rate of about 4.50%; (3) breaking a CD early: the month-6 example where the penalty leaves less than the HYSA; (4) who should keep the money in a HYSA instead (money they may need before the term ends, such as an emergency fund) and when the CD fits (money with a fixed date they will not touch); (5) what the tool leaves out (taxes on interest, new deposits, fees) and the FDIC $250,000 limit. Link /investing/high-yield-savings-calculator/ and /cd-calculator/ once each, and /compare/hysa-vs-cd/ for the general comparison.
Who this is not for: someone who will add money every month (use the high-yield savings calculator) — say so.
What would change the answer: the HYSA rate falling below the tie rate, or needing the money before the CD matures.

## FAQ questions (verbatim, in this order)
1. Is it better to put my money in a CD or a high-yield savings account?
2. How much will a $10,000 CD make in one year?
3. How much will $10,000 make in a high-yield savings account?
4. What happens if my HYSA rate drops?
5. What does breaking a CD early cost?
6. Is it smart to put $100,000 in a CD?
7. Are CDs and high-yield savings accounts FDIC insured?
8. Which is better for an emergency fund?
For question 2 and 3 use the 4.25% and 4.00% one-year figures and say they change with the APY. For question 6 do not give a yes/no rule; say it depends on whether the money can stay put for the full term, and mention the $250,000 FDIC limit. For question 8 link /emergency-fund-calculator/.
