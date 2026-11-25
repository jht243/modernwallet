# ROW PROMPT (data only) — sep-ira-solo-401k-contribution-calculator

route: /sep-ira-solo-401k-contribution-calculator/   page type: calculator hub entry (JSON keys per the output contract)
medium: interactive tool → interactive tool   register: operator   page type: explainer / spoke (calculator page; introText ~140 words, howItWorks ~500 words, 8 FAQs)
primary keyword: sep ira contribution calculator (also: solo 401k contribution calculator, sep ira calculator, solo 401k contribution limit)
intent: a self-employed reader (sole proprietor, freelancer, gig driver) who just worked out their self-employment tax wants the most they can put into a SEP IRA or a solo 401(k), and which plan allows more.
reader question: "How much can I put into a SEP IRA or solo 401(k) as a self-employed person?" [PAA 1/6 on-topic: 'How much am I allowed to contribute to my SEP IRA?'; ac 4/14 how-is-calculated/limit questions; PAA 5/6 off-topic retirement-saving generics]
answer: Roughly 20% of net earnings after half of self-employment tax for a SEP IRA; the solo 401(k) allows the same 20% plus the employee deferral ($25,500 for 2027), within the annual limit ($75,000 for 2027). On $100,000 of profit that is $18,587 for a SEP IRA and $44,087 for a solo 401(k).
answer placement: section 1 — introText paragraph one gives the rule and the two figures; paragraph two is the $100,000 worked example. Do not open with a definition of either plan.
provenance (calculated): at the first finding say naturally what we did: "In our internal calculation, we ran the SEP IRA and solo 401(k) formulas for ... to see ...", then what we found; the method is shown in howItWorks and the calculator. Never "we tested".

## The calculator (describe only what it does)
Inputs: net self-employment profit for the year (Schedule C); tax year (2026 or 2027); age during the year (Under 50; 50 or older but not 60 to 63; 60, 61, 62 or 63); optional deferrals already made to another 401(k) or 403(b) this year.
Outputs: the solo 401(k) maximum as the big figure, with the employee deferral and employer share, and the catch-up when the age band allows one; the SEP IRA maximum; how much more the solo 401(k) allows; self-employment tax; the earnings the plans use; plain-language flags when the employer share reaches the annual limit, earnings above the compensation limit are ignored, other plans use up the shared deferral limit, the deferral is limited by earnings, profit is under the $400 self-employment-tax floor, or (tax year 2027 above about $199,800 of profit) the 2027 Social Security wage base is not used; a "Copy result" button.
Method the page may state (IRS Publication 560): net earnings = profit minus half of self-employment tax. The employer contribution for a self-employed person uses a reduced rate: a 25% plan rate becomes 20% of net earnings. Earnings above the annual compensation limit are ignored. The employer share is capped by the annual limit. A SEP IRA allows only the employer share. A solo 401(k) adds the employee deferral on top, within the same annual limit, and catch-up contributions sit outside it.
Assumptions the page must state: sole proprietor or single-member LLC with no employees; profit is Schedule C profit; the employee deferral limit is shared with any other 401(k) or 403(b) you defer into; catch-up is limited by earnings; a SEP IRA must cover eligible employees; plan documents can set lower limits; for tax year 2027 the calculator uses the 2026 Social Security wage base of $184,500 for self-employment tax and says so (no 2027 base is asserted), which matters only above about $199,800 of profit; it does not model a Roth catch-up wage test or spouse participation.

## CLOSED FACT LIST — every number the page may state. Anything not on this list, you do not know. Never invent a limit, rate, deadline, statistic or URL.
- Limits for 2027 (IRS Notice 2026-66 and the IRS news release "401(k) limit increases to $25,500 for 2027"): employee elective deferral $25,500 (2026: $24,500); defined contribution annual limit under section 415(c) $75,000 (2026: $72,000); catch-up for age 50 or older $8,500 (2026: $8,000); catch-up for ages 60 to 63 $11,750 (2026: $11,250); annual compensation limit $375,000 (2026: $360,000). Catch-up contributions sit outside the $75,000 limit.
- IRS Publication 560 (2025): self-employed reduced contribution rate; the employer contribution is computed on net earnings after the deduction for half of self-employment tax; "A sole proprietor with no employees can adopt a section 401(k) plan after the end of the tax year, provided the plan is adopted by the tax filing deadline (without regard to extensions)" (2023 and later); a SEP can be set up as late as the due date (including extensions) of the income tax return for that year, and contributions are deducted for a year if made by that due date; a solo 401(k) employee deferrals are elected by the end of the tax year and can then be made by the filing deadline; the SEP agreement must provide benefits to all eligible employees; "A SEP IRA must be set up by or for each eligible employee."
- Self-employment tax: 92.35% of profit is the earnings base; 12.4% Social Security up to the wage base ($184,500 for 2026) and 2.9% Medicare; half of Social Security and Medicare self-employment tax is deductible; no self-employment tax under $400 of net earnings.
- Worked examples (computed by the calculator, whole dollars, tax year 2027 unless stated):
  - $100,000 profit, under 50: self-employment tax $14,130; net earnings $92,935; SEP IRA maximum $18,587; solo 401(k) maximum $44,087 ($25,500 employee deferral plus $18,587 employer share); solo 401(k) allows $25,500 more than the SEP IRA.
  - Same profit, age 50 or older: catch-up $8,500 adds to $52,587 for the solo 401(k). Ages 60 to 63: catch-up $11,750 gives $55,837.
  - Same profit, tax year 2026: employer share $18,587; solo 401(k) $43,087 ($24,500 deferral plus $18,587).
  - $20,000 profit: self-employment tax $2,826; net earnings $18,587; SEP IRA maximum $3,717; solo 401(k) maximum $18,587, which is all of the net earnings, because the deferral is limited by earnings.
  - $500,000 profit: SEP IRA and solo 401(k) both reach $75,000 for 2027 ($72,000 for 2026); earnings above $375,000 are ignored for 2027.
  - $100,000 profit with $25,500 already deferred at another job: employee deferral $0, so the solo 401(k) equals the SEP IRA at $18,587.
- The solo 401(k) maximum is never below the SEP IRA maximum for the same profit and tax year; they are equal only when the annual limit is reached or other plans use up the deferral.
No other figures. Do not state any 2027 Social Security wage base.

## CLOSED URL LIST — only external hrefs allowed
https://www.irs.gov/publications/p560 (IRS Publication 560); https://www.irs.gov/pub/irs-drop/n-26-66.pdf (IRS Notice 2026-66); https://www.irs.gov/newsroom/401k-limit-increases-to-25500-for-2027-ira-limit-remains-7500 (IRS 2027 limits news release); https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500 (IRS 2026 limits news release). Nothing else.

## Internal routes it may link (real routes only)
/compare/sep-ira-vs-solo-401k/ (SEP-IRA vs Solo 401(k) comparison), /self-employment-tax/ (self-employment tax calculator), /roundup/best-retirement-accounts-for-self-employed/ (best retirement accounts for the self-employed), /guides/401k-contribution-limits-2026/ (401(k) limits guide), /guides/ira-contribution-limits-2026/ (IRA limits guide), /calculators/ (all calculators). No other internal route.

## Coverage
introText: as above. howItWorks: (1) net earnings and the half-SE-tax deduction (link /self-employment-tax/ as the self-employment tax calculator); (2) the 20% employer share and why a 25% plan rate becomes 20%; (3) the 2026 versus 2027 limits side by side as a short sentence set, not a table; (4) the SEP IRA versus solo 401(k) difference with the $100,000 and $20,000 examples, linking /compare/sep-ira-vs-solo-401k/ for the fuller comparison; (5) deadlines (SEP by the filing deadline including extensions; solo 401(k) deferral elected by year end; the sole-proprietor adoption rule) and the assumptions and limits; (6) last paragraph is the takeaway.
Takeaway (planned): for most sole proprietors a solo 401(k) allows far more than a SEP IRA at the same profit because the employee deferral sits on top of the same 20% employer share; at high profit both reach the annual limit and a SEP IRA is simpler. Who it is not for: anyone with employees, since a SEP IRA must cover eligible employees and a solo 401(k) is for owners and spouses only; anyone whose other job's 401(k) already used the $25,500 deferral. What would change it: deferrals made at another job, employees, and a change in the IRS limits. Closing sentence: a next action, such as entering your own net profit above and comparing the two maximums before choosing a plan.

## FAQ questions (verbatim, in this order)
1. How much am I allowed to contribute to my SEP IRA?
2. How is SEP IRA contribution calculated for the self-employed?
3. What is the solo 401(k) contribution limit for 2027?
4. What is the SEP IRA contribution deadline?
5. How do SEP IRA contributions affect taxes?
6. Can I have a SEP IRA and a solo 401(k) at the same time?
7. Does a SEP IRA or solo 401(k) allow more at low income?
8. Can I contribute if I also have a 401(k) at my day job?
For question 4 use only the Publication 560 deadline facts above. For question 5 say the contribution is deducted by the filing deadline for the year it is made for, and do not state a tax rate or tax saved. For question 6 say the facts above do not include a rule on holding both and tell the reader to confirm with a tax professional or the plan provider; give no number. Use no figure outside the fact list.
