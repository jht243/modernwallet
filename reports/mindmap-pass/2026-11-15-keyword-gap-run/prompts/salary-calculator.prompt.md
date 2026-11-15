# ROW PROMPT (data only) — salary-calculator

route: /salary-calculator/   page type: calculator hub entry (JSON keys per the output contract)
medium: interactive tool → interactive tool   register: operator   page type: explainer / calculator page (floor 1,200 body words: intro + howItWorks + sections + 8 FAQs, tables count as data not prose)
primary keyword: salary calculator (also: annual salary calculator, hourly to salary calculator, salary to hourly calculator, yearly salary calculator, monthly salary calculator)
intent: a US wage earner comparing pay offers or checking a paycheck who wants one pay figure converted into every other pay period.
reader question: "How do I convert my annual salary to an hourly wage, and my hourly wage to an annual salary?" [PAA unread - DataForSEO unavailable; ac 3/14 how-pattern: how to salary calculator hourly, how pay calculator, how wage calculator]
answer: Annual pay divided by (hours per week x weeks per year) gives the hourly rate. At 40 hours and 52 weeks, a $52,000 salary is $25.00 an hour. Do not open with a definition.
answer placement: section 1 — introText paragraph one is the answer sentence (sentence 1 = the formula plus the $52,000 to $25.00 example); paragraph two is the worked example.

## The calculator (describe only what it does)
Inputs: pay amount (default $52,000); the period that amount is paid per (hour, day, week, two weeks, half month, month, year; default year); hours per week (default 40); weeks per year (default 52); days worked per week (default 5).
Outputs: hourly rate as the headline, plus annual, monthly, twice-a-month, every-two-weeks, weekly and daily pay.
Method the page may state: annual pay = hourly rate x hours per week x weeks per year (or the entered amount times its periods). Weekly, every-two-weeks, daily and hourly amounts are pay for time worked, so they follow hours and weeks. Monthly = annual / 12 and twice-a-month = annual / 24. Biweekly = annual / (weeks per year / 2); at 52 weeks that is 26 checks. Hourly = annual / (hours per week x weeks per year). Daily = annual / (days per week x weeks per year).
Assumptions the page must state: pay is gross, before tax and deductions; overtime, bonuses, unpaid leave and benefits are not modeled; a 40-hour, 52-week year is 2,080 hours only because 40 x 52 = 2,080.

## CLOSED FACT LIST — every number or rule the page may state. Anything not on this list, you do not know. Never invent a price, limit, benchmark or URL.
Source: arithmetic by the calculator on the reader's own inputs (no external figures). Executed reference model: calculated, not tested, not measured.
Worked cases (computed):
- $52,000 a year at 40 hours and 52 weeks (2,080 hours): $25.00 an hour; $1,000.00 a week; $2,000.00 every two weeks; $4,333.33 a month; $2,166.67 twice a month; $200.00 a day (5 days).
- $25 an hour at 40 hours and 52 weeks: $52,000 a year.
- $5,000 a month: $60,000 a year; $28.85 an hour at 40 hours and 52 weeks; $1,153.85 a week.
- $2,000 every two weeks: $52,000 a year at 52 weeks; $25.00 an hour.
- $30 an hour at 37.5 hours and 52 weeks: $58,500 a year; $4,875.00 a month.
- $60,000 a year at 40 hours: $28.85 an hour over 52 weeks (2,080 hours); $30.00 an hour over 50 weeks (2,000 hours).
Hours table, the same $60,000 salary at 52 weeks (INCLUDE THIS TABLE EXACTLY in the "Salary Versus Hourly Pay by Hours and Weeks Worked" section):
| Hours per week | Hours per year | Hourly rate |
|---|---|---|
| 35 | 1,820 | $32.97 |
| 37.5 | 1,950 | $30.77 |
| 40 | 2,080 | $28.85 |
| 45 | 2,340 | $25.64 |
Provenance (calculated, not tested): "In our internal modeling, we converted the same $60,000 salary across 35 to 45 hour weeks to see how the hourly rate moves." State this once, beside the table, as plain arithmetic and an illustration, not research. The assumptions (52 paid weeks, gross pay) sit beside the table. Never say "testing" or "tested".
Takeaway (intent: informational conversion): salary / (hours x weeks) = hourly. It applies to any pay offer. The answer changes if hours, unpaid weeks or overtime differ. Gross pay is not take-home pay.
No other figures.

## CLOSED URL LIST — only external hrefs allowed
(none — no external links on this page)

## Internal routes it may link (real routes only)
/paycheck-calculator/ (take-home pay after federal income tax and payroll tax; anchor "paycheck calculator"), /budget/ (anchor "budget calculator"), /tax-bracket-calculator/ (federal bracket), /freelance-rate/1099-vs-w2-calculator/ (contractor hourly rate against a W-2 salary), /calculators/ (all calculators). No other internal route.

## Sections (use these headings verbatim, in this order)
1. "Salary Versus Hourly Pay by Hours and Weeks Worked": a short lead paragraph naming the internal-modeling attribution, then the table above, then one paragraph saying what the table shows (more hours per week lowers the hourly rate on the same salary) and that 50 paid weeks instead of 52 moves $28.85 to $30.00.
2. "What Gross Pay Leaves Out": gross is before tax and deductions; overtime, bonuses and unpaid weeks are not modeled; link "paycheck calculator" for take-home and "budget calculator" for using monthly income; one sentence naming who this page is not for (anyone who needs after-tax pay should use the paycheck calculator, anyone paid overtime or commission should enter their average pay and hours) and one sentence saying what would change the answer (more hours, fewer paid weeks, overtime).
Also: howItWorks heading is "How the Salary Conversion Works" (do not put it inside the howItWorks string; it is a separate field). Add key "howItWorksHeading": "How the Salary Conversion Works" to the JSON in addition to the contract keys.

## Coverage
introText: as in the contract. howItWorks: (1) the formula and the $52,000 example; (2) how each period is derived and which are pay for time worked; (3) why 2,080 hours is only 40 x 52 and how weeks and hours change it; (4) the monthly, $5,000, $2,000 biweekly and $30 an hour examples.
The last body sentence of the last section is the concrete next action (use the paycheck calculator for take-home).
Neutrality: explain; no claims about legal minimum wage, taxes or labor law.

## FAQ questions (verbatim, in this order)
1. How do I convert my annual salary to an hourly wage?
2. How do I convert hourly pay to an annual salary?
3. How many hours are in a work year?
4. Is a salary calculator accurate for monthly or biweekly pay?
5. How do I turn a monthly salary into an hourly rate?
6. Does this salary calculator include overtime?
7. Does this salary calculator show pay after taxes?
8. What if I work fewer than 52 weeks a year?
