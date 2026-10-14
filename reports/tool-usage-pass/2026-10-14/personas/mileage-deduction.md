# mileage-deduction — /mileage-deduction/irs-mileage-rate-2026/

## Evidence
- GSC queries: no GSC access in this cloud run. Intent from the H1 "IRS Mileage Rate 2026: Two Rates, One Year" — a rate lookup first, a deduction estimate second.
- STEP 1 numbers (data_days = 6, early): people 22, uses 24, views 324, use_rate 0.074, people_7d 22 (ledger: 4 → more than doubled, re-picked). Highest-view tool on the site with the lowest use rate — the intro paragraph answers the rate question (72.5¢ / 76¢) before the tool, so most visitors leave satisfied; that is expected, not a defect.

## Persona
- Who/where: a self-employed real-estate agent on a phone between showings, mid-October; 7,200 business miles logged Jan–Jun and 4,100 so far since July; 22% bracket.
- Job: "What's the 2026 rate, and what's my mileage worth on my taxes?"
- Done = the rate plus a dollar figure of tax saved to plan their estimated payment.
- Secondary visitor seen in the same search: a W-2 employee who drives for work and wants to know what they can deduct.

## Walkthrough
Desktop 1366px (`screenshots/mileage-deduction-desktop.png`):
1. Page 200 (~3.6s); rate answered in the first paragraph; `data-tool="mileage-deduction"` root 440px down.
2. Typed 7200 (Jan–Jun) and 4100 (Jul–Dec), clicked 22%.
3. Result: "Tax this deduction saves you $3,012 on a $8,336 deduction — a combined 36.13% … Income tax saved $1,834 · Self-employment tax saved $1,178 · 7,200 mi × 72.5¢ $5,220 · 4,100 mi × 76¢ $3,116".
4. As the W-2 employee: same inputs give the same "$1,178 self-employment tax saved" — nothing says this only applies to self-employed (Schedule C) driving.
Phone 390px (`screenshots/mileage-deduction-mobile.png`):
1. No horizontal scroll, root 729px down; the "first year I used this vehicle" checkbox is 20px tall (flagged <32px; its label row is tappable). Same result. No console errors.

## Friction
- (W-2 employee) "It says I save $1,178 in self-employment tax — I'm not self-employed. Can I even deduct this?" — the result assumes Schedule C. Most employees cannot deduct unreimbursed mileage on a federal return (IRS Topic 511 lists the exceptions); if the employer reimburses, the mileage reimbursement calculator is their tool. → tool fix: one line under the result naming who this applies to, linking /mileage-reimbursement-calculator/ and citing IRS Topic 511.
- 20px checkbox on phone — minor; the label is the tap target, so not worked this week.
- Low use rate: the rate is answered above the tool, which is the right order for a lookup query. No change.

## Monetization
Verdict: fit
YMYL (tax) → books only. With a deduction number in hand, the agent's next job is filing it correctly and finding the other deductions they're missing. Ranked list:
1. Book — small-business deductions guide (Nolo)
2. Book — annual income-tax guide for the 2026 return
3. Book — law & taxes for independent contractors / gig workers

| Result tier | Picks (priority order) | Why, for this result |
|---|---|---|
| Deduction under $5,000 (side gig / part-time driving) | 141333217X *Working for Yourself* (Fishman, Nolo); 1413333052 *Deduct It!* (Fishman, Nolo); 1394461577 *J.K. Lasser's Your Income Tax 2027 — for 2026 returns* (Wiley) | Covers the Schedule C basics a part-time driver needs |
| Deduction $5,000 and up (driving is core to the business) | 1413333052 *Deduct It!* (Nolo); 1413332315 *Tax Savvy for Small Business* (Nolo); 1394461577 *J.K. Lasser's Your Income Tax 2027* | Vehicle method choice, records and the rest of the deductions |
