# ROW DATA — /guides/coast-fire-number-by-age

route: /guides/coast-fire-number-by-age/
slug: coast-fire-number-by-age
page type: explainer / spoke
register: operator
medium: text → text
depth floor: 1,200 body words (intro + section bodies + FAQ answers). Table cells do NOT count
  toward the floor, so the prose must carry the page on its own.
primary keyword: coast fire number by age
secondary keywords: coast fire by age, coast fire chart, coast fire at 40, coast fire number at 30,
  coast fire number at 35, coast fire targets by age, coast fire amount by age, coast fi number by age
intent: A reader wants a BENCHMARK — "what should my number be at my age?" — not a personalised
  calculation. They want to look up their row, see the figure, and understand what it means and
  where it breaks. The two tables below are the reason this page exists.

## THE CLOSED FACT LIST

Anything not on this list, you do not know. Never invent a price, limit, benchmark, statistic,
or URL; say it is unpublished and tell the reader to verify at the source.

### The formula (this page's spine)
- Coast number today = FIRE number / (1 + r)^t, where r is the expected annual return and t is
  the number of years until the target retirement age.
- FIRE number = desired annual retirement spending / safe withdrawal rate. At a 4% withdrawal
  rate this is the same as 25 times annual spending.
- Worked example already published on this site and consistent with the tables below: a 35-year-old
  who wants $60,000 a year, retiring at 65, at a 7% return, needs $197,051 invested today.
  ($60,000 / 0.04 = $1,500,000; 1.07^30 = 7.6123; $1,500,000 / 7.6123 = $197,051.)

### TABLE 1 — the main benchmark grid. Reproduce EXACTLY. Do not recompute, round, or extend it.
Stated assumptions that MUST appear immediately above the table: retirement at age 65, a 7%
expected annual return, a 4% safe withdrawal rate, figures in today's dollars, contributions
assumed to stop entirely.

| Current age | $40k/yr spending | $60k/yr spending | $80k/yr spending | $100k/yr spending |
|---|---|---|---|---|
| 25 | $66,780 | $100,171 | $133,561 | $166,951 |
| 30 | $93,663 | $140,494 | $187,326 | $234,157 |
| 35 | $131,367 | $197,051 | $262,734 | $328,418 |
| 40 | $184,249 | $276,374 | $368,498 | $460,623 |
| 45 | $258,419 | $387,629 | $516,838 | $646,048 |
| 50 | $362,446 | $543,669 | $724,892 | $906,115 |
| 55 | $508,349 | $762,524 | $1,016,699 | $1,270,873 |

The FIRE numbers those columns discount back from: $40k/yr = $1,000,000; $60k/yr = $1,500,000;
$80k/yr = $2,000,000; $100k/yr = $2,500,000.

### TABLE 2 — the return-assumption sensitivity grid. Reproduce EXACTLY.
Stated assumptions: $60,000 a year of spending (a $1,500,000 FIRE number), retirement at 65,
a 4% withdrawal rate.

| Current age | 5% return | 6% return | 7% return | 8% return |
|---|---|---|---|---|
| 25 | $213,069 | $145,833 | $100,171 | $69,046 |
| 30 | $271,935 | $195,158 | $140,494 | $101,452 |
| 35 | $347,066 | $261,165 | $197,051 | $149,066 |
| 40 | $442,954 | $349,498 | $276,374 | $219,027 |
| 45 | $565,334 | $467,707 | $387,629 | $321,822 |
| 50 | $721,526 | $625,898 | $543,669 | $472,863 |
| 55 | $920,870 | $837,592 | $762,524 | $694,790 |

### Derived facts you MAY state (each is arithmetic on the tables above, and only these)
- At $60k/yr, the number roughly doubles every ten years of delay: $100,171 at 25 becomes
  $197,051 at 35 and $387,629 at 45.
- A 25-year-old's $60k/yr coast number ($100,171) is about one fifteenth of the $1,500,000
  FIRE number it grows into. A 55-year-old's ($762,524) is about half of it.
- At age 25 and $60k/yr spending, moving the return assumption from 8% to 5% raises the number
  from $69,046 to $213,069, roughly a threefold increase. At age 55 the same swing moves it
  from $694,790 to $920,870, about a third more. The younger you are, the more the return
  assumption decides the answer.

### Facts about the safe-withdrawal-rate basis
- The 4% figure comes from the 1998 Trinity Study, which tested withdrawal rates across
  historical 30-year market periods. This site's FIRE calculator page already states this.
- Lean FIRE is commonly modelled at 20x annual expenses (about a 5% withdrawal rate), standard
  FIRE at 25x (4%), and fat FIRE at 33x or more. This site's FIRE calculator page already states this.
- A retirement longer than 30 years is beyond what the standard 4% research modelled; a 3% to
  3.5% rate is more appropriate for a 35-year-plus horizon. This site's early-retirement
  calculator page already states this.

### What you must NOT do
- Do NOT state any age/spending combination that is not a cell in the tables above.
- Do NOT state an average or median savings balance for any age group. You do not have one.
- Do NOT state a historical stock-market return figure. You do not have one.
- Do NOT state an inflation rate. You do not have one.
- Do NOT claim how many people have reached Coast FIRE, or cite any survey.

## THE CLOSED URL LIST (the only external hrefs allowed)
- https://www.ssa.gov/benefits/retirement/planner/agereduction.html — label "Social Security Administration"
- https://www.healthcare.gov/ — label "Health Insurance Marketplace"
No other external URL. If you want to cite something else, leave it out.

## INTERNAL LINKS (real routes — use these, invent none)
- /coast-fire/ — the Coast FIRE calculator, for the personalised run. THIS IS THE PRIMARY CTA.
- /guides/coast-fire-guide/ — Coast FIRE explained
- /guides/coast-fire-for-couples/ — running the number as a household
- /compare/coast-fire-vs-fire/ — Coast FIRE vs full FIRE (shipping in this same run)
- /compare/coast-fire-vs-barista-fire/ — Coast FIRE vs Barista FIRE
- /retirement/fire-calculator/ — the FIRE calculator
- /retirement/retirement-savings-calculator/ — general retirement projection
- /roundup/best-coast-fire-calculators/ — calculator comparison (shipping in this same run)

`tools` array: /coast-fire/, /retirement/fire-calculator/, /retirement/retirement-savings-calculator/

## SECTION COVERAGE (in this order)
1. `introText` — AEO block. First sentence answers "what is my Coast FIRE number at my age"
   in one self-contained sentence naming the formula and the fact that it depends on the
   spending target, not age alone. Then say what the tables assume.
2. The benchmark grid. Assumptions stated FIRST, then TABLE 1, then two or three paragraphs
   reading the table: how to find your row, what the number means, and what it does not mean.
3. Why the number rises so fast with age — the compounding-years explanation, using the
   derived facts above.
4. The return assumption is the biggest lever. TABLE 2 plus the derived reading of it. This is
   where you say a benchmark table is a starting point, not a plan, and send the reader to
   /coast-fire/ for their real inputs.
5. What the benchmark deliberately leaves out: Social Security and pensions (subtract expected
   income from the spending goal before reading the table), a mortgage that will or will not be
   paid off, and health insurance before Medicare if coasting means leaving employer coverage.
6. How to use the number once you have it, including checking it again after a big market move,
   a raise, or a change in the target retirement age.

## FAQ SPEC (use these questions verbatim where given — they are real People Also Ask questions)
- "What should my coast FIRE number be?"
- "What is my Coast FIRE number at 50 years old?"  (answer from the table: at $60k/yr the 50-year-old
  row is $543,669; you may interpolate NOTHING, so answer with the 50 row across the spending columns)
- "How do you get your Coast FIRE number?"
- "Is a Coast FIRE benchmark table accurate for me?"
- "What is a good Coast FIRE number?"
