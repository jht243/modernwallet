"""Assemble the 9 DATA-ONLY row prompts for mindmap-pass 2026-10-10 (bankruptcy).

Each prompt = row data (from the chart, cols 10-12 verbatim) + internal links + the closed
fact list(s) + closed URL list. Run from the repo root after the facts files exist.
"""
import os, re

RUN = "reports/mindmap-pass/2026-10-10"
F = RUN + "/facts/"
FACTS = {
    "ch13": F + "facts-ch13-exits-and-ch7-filing.md",
    "cost": F + "facts-bankruptcy-cost.md",
    "credit": F + "facts-credit-after-bankruptcy.md",
    "housecar": F + "facts-house-car-after-bankruptcy.md",
    "alt": F + "facts-alternatives-and-settlement.md",
}

CLOSED = (
    "CLOSED FACT LIST (researched 2026-10-10). Anything not on this list, you do not know. "
    "Never invent a price, fee, dollar threshold, waiting period, deadline, statute section, "
    "percentage, score, date, count or URL; if something is unpublished or not on the list, say "
    "it varies or is unpublished and tell the reader where to check (the court, the trustee, the "
    "lender, the agency page).\n\n"
    "Bullets marked 'secondary — unverified' are context only: never state them as fact in page "
    "copy. Bullets marked [S] were confirmed only from a search snippet — state them attributed "
    "to their source, never as stronger than that. Bullets marked 'NOT FOUND — do not state' "
    "must not appear in any form. Where the list records that sources conflict, present the "
    "point as varying, not as one number.\n"
)

LEGAL = (
    "YMYL guardrail: explain the rules and the decision; never tell this reader to file or not "
    "to file, and never promise an outcome. Say once, where it fits, that courts, trustees and "
    "local rules vary and that a bankruptcy attorney, a legal-aid office (lsc.gov finder if on "
    "the URL list) or a nonprofit credit counselor can apply this to their case. No first-person "
    "experience claims beyond `_experience.md`; no invented case studies or quotes. Formatting: no code fences, no blockquotes (a line starting with `>`); tables and lists are fine."
)

INTERNAL_COMMON = [
    "/compare/chapter-7-vs-chapter-13-bankruptcy/ (Chapter 7 vs Chapter 13 Bankruptcy)",
    "/guides/how-to-pay-off-debt/ (How to Pay Off Debt)",
    "/guides/how-to-deal-with-debt-collectors/ (How to Deal With Debt Collectors)",
    "/guides/how-to-deal-with-medical-debt/ (How to Deal With Medical Debt)",
    "/guides/what-is-a-good-credit-score/ (What Is a Good Credit Score)",
    "/guides/how-to-build-credit-fast/ (How to Build Credit Fast)",
    "/budget/ (Budget Calculator)",
    "/emergency-fund-calculator/ (Emergency Fund Calculator)",
    "/debt-consolidation-calculator/ (Debt Consolidation Calculator)",
    "/credit-card-payoff/ (Credit Card Payoff Calculator)",
]
SIBLINGS = {
    "how-to-get-out-of-chapter-13-early": "/guides/how-to-get-out-of-chapter-13-early/ (How to Get Out of Chapter 13 Early)",
    "how-to-rebuild-credit-after-bankruptcy": "/guides/how-to-rebuild-credit-after-bankruptcy/ (How to Rebuild Credit After Bankruptcy)",
    "how-long-does-bankruptcy-stay-on-credit-report": "/guides/how-long-does-bankruptcy-stay-on-credit-report/ (How Long Bankruptcy Stays on Your Credit Report)",
    "how-much-does-it-cost-to-file-bankruptcy": "/guides/how-much-does-it-cost-to-file-bankruptcy/ (Cost to File Bankruptcy)",
    "how-to-file-chapter-7-bankruptcy": "/guides/how-to-file-chapter-7-bankruptcy/ (How to File Chapter 7)",
    "bankruptcy-alternatives": "/guides/bankruptcy-alternatives/ (Bankruptcy Alternatives)",
    "debt-settlement-vs-bankruptcy": "/compare/debt-settlement-vs-bankruptcy/ (Debt Settlement vs Bankruptcy)",
    "buying-a-house-after-bankruptcy": "/guides/buying-a-house-after-bankruptcy/ (Buying a House After Bankruptcy)",
    "buying-a-car-after-bankruptcy": "/guides/buying-a-car-after-bankruptcy/ (Buying a Car After Bankruptcy)",
}

ROWS = [
  dict(
    slug="how-to-get-out-of-chapter-13-early", route="/guides/how-to-get-out-of-chapter-13-early/",
    ptype="guide (guides.ts) — explainer, exits table + numbered steps", floor=1200, facts=["ch13"],
    kw="how to get out of Chapter 13 early",
    kw2="how to get out of chapter 13, chapter 13 hardship discharge, chapter 13 dismissed, convert chapter 13 to chapter 7, voluntary dismissal chapter 13, how to cancel chapter 13, how long does it take to get out of bankruptcy",
    intent="a person in an active Chapter 13 plan wants to know the legal ways to end it before the plan term and what each one costs them.",
    rq='"Can I get out of Chapter 13 early, and how?" [PAA 5/6 on-topic how/can: end early / get out faster / hardship discharge / recover / credit after; 1/6 "fresh start"; ac 16/16 question completions: end / pay off / get discharge early]',
    ans="Mechanism: there are four exits — pay the plan off early (it goes through the court, and courts split on whether less than 100% to unsecured creditors is allowed), ask for a hardship discharge if circumstances beyond your control stop payments, convert to Chapter 7 if you now pass the means test, or voluntarily dismiss (fastest, but every debt and the creditors' collection rights come back); which one fits depends on whether you can pay, qualify for 7, or need the discharge. Shape: mechanism",
    place='section 1 "The Four Ways Out of a Chapter 13 Plan" — 2–3 sentence answer, then a markdown table: exit | who can use it | what happens to your debts | what happens to collection protection | the catch. Only state requirements the fact list supports; where the fact list records that early payoff rules vary by trustee/court, say so in the table.',
    serp="uscourts.gov, reddit.com, nolo.com, abi.org + law-firm blogs own page one; AI Overview cites leinlawoffices.com, abi.org, attorneyfortampabay.com (law-firm explainers). Win by being the clearest side-by-side of all four exits with statute citations.",
    task="""2. Paying the plan off early: what a payoff requires (trustee payoff figure, the applicable commitment period and whether unsecured creditors must be paid in full — present as varying if the fact list says so), where the money can come from (refinance, sale, windfall — and that a windfall may have to go into the plan if the fact list supports it), plan modification under §1329 as the alternative to a lump sum.
3. Hardship discharge: the three statutory conditions, what it does NOT wipe out (§1328(c)), how you ask for it (motion to the court; say "through your attorney or the court" without inventing a form).
4. Converting to Chapter 7: the right to convert, the means-test hurdle, what happens to property acquired after filing on a good-faith conversion (§348(f)), the conversion fee only if the fact list carries it, and the 6-year §727(a)(9) issue only if relevant per the fact list.
5. Voluntary vs involuntary dismissal: what dismissal does (§349), that debts and interest come back, the automatic stay ends, refiling limits (§109(g) 180-day bar, §362(c)(3) 30-day stay rule).
6. How long until you're out: plan length (3 or 5 years), discharge timing after the last payment, and what an early exit means for your credit report — link /guides/how-long-does-bankruptcy-stay-on-credit-report/.
7. Choosing an exit: a short decision guide by situation (can pay in full / income dropped for reasons outside your control / income dropped and you now qualify for Chapter 7 / you need out regardless).
FAQ 5–6, verbatim PAA where on-topic: "Can you end a Chapter 13 early?", "How can I get out of Chapter 13 faster?", "How to qualify for Chapter 13 hardship discharge?", "How hard is it to recover from Chapter 13?", "How long is credit ruined after Chapter 13?", plus "What happens if my Chapter 13 is dismissed?".""",
    links=["how-to-file-chapter-7-bankruptcy", "how-long-does-bankruptcy-stay-on-credit-report", "how-to-rebuild-credit-after-bankruptcy", "how-much-does-it-cost-to-file-bankruptcy"],
  ),
  dict(
    slug="how-to-rebuild-credit-after-bankruptcy", route="/guides/how-to-rebuild-credit-after-bankruptcy/",
    ptype="guide (guides.ts) — explainer, numbered rebuild timeline", floor=1200, facts=["credit"],
    kw="how to rebuild credit after bankruptcy",
    kw2="rebuild credit after bankruptcy, how to rebuild credit after chapter 7, how long does it take to rebuild credit after bankruptcy, how to rebuild credit after chapter 13, fastest way to rebuild credit after bankruptcy, life after chapter 7, credit cards after bankruptcy",
    intent="someone recently discharged (or in Chapter 13) wants the concrete sequence of steps to rebuild credit and an honest sense of how long it takes.",
    rq='"How do I rebuild my credit after bankruptcy, and how long does it take?" [PAA 4/6 on-topic: 700 after Ch 7 / 800 after Ch 7 / 500→700 how long / raise by 100 points; 2/6 off-topic: 550 fix, $400k house score; ac 48/50 on-topic how/how-long completions, 2 off-topic: credit without bankruptcy, Canada]',
    ans="Mechanism: start the day the discharge order arrives — fix the reports so discharged debts show $0, open one or two small secured or credit-builder accounts, pay every bill on time and keep balances low; the bankruptcy stays on the report, but its weight fades as it ages while new on-time history builds (no bureau or FICO publishes a fixed recovery timeline), and the sequence is the same for Chapter 7 and 13 except a Chapter 13 filer can start rebuilding during the plan. Shape: mechanism",
    place='section 1 "The Rebuild Sequence, Starting the Day You\'re Discharged" — a numbered sequence (step → what to do → why it moves the score, per the fact list). Do NOT state a timeline in months/years or a score number unless the fact list carries it; if the fact list has no sourced timeline, say plainly that no bureau or FICO publishes a fixed recovery timeline and that the impact of the bankruptcy fades as it ages and new history accrues.',
    serp="Forum-owned page one (reddit.com, ficoforums.myfico.com, youtube.com) plus vicinitycreditunion.com, regions.com, equifax.com; no AI Overview. Win with an operator-voice, concrete sequence with the FICO factor weights and real product types — not a generic list of tips.",
    task="""2. Fixing your credit reports first: getting all three reports free (annualcreditreport.com per the fact list), what a discharged account should show, how to dispute one that still shows a balance (§1681i timing per the fact list), the discharge injunction.
3. The accounts that rebuild credit: secured card, credit-builder loan, authorized user — how each one reports, what to watch for (fees). Link /roundup/best-secured-credit-cards/ and /compare/secured-credit-card-vs-unsecured-credit-card/.
4. What actually moves the score: the FICO factor weights from the fact list, applied to someone with a fresh bankruptcy (payment history, utilization).
5. How long it takes: what the fact list supports about how the bankruptcy's impact fades with time and when the entry leaves the report (Chapter 7 vs 13) — link /guides/how-long-does-bankruptcy-stay-on-credit-report/. Address the "can I get a 700 / 800 after Chapter 7" questions only with what the fact list supports.
6. Rebuilding during Chapter 13: whether new credit needs trustee/court permission (per the fact list), what you can do meanwhile.
7. Mistakes and traps after bankruptcy: reaffirmed debts still count, high-cost offers aimed at recent filers, credit repair companies that promise to remove accurate items (CROA).
Do NOT re-explain general credit-building tactics in depth — /guides/how-to-build-credit-fast/ already covers utilization timing, credit-limit increases and rent reporting; link it once and keep this page on what is specific to a bankruptcy (discharged-account reporting, the discharge injunction, reaffirmed debts, Chapter 13 permission, the bankruptcy timeline).
8. Milestones you're rebuilding toward: car loan and mortgage — link /guides/buying-a-car-after-bankruptcy/ and /guides/buying-a-house-after-bankruptcy/.
FAQ 5–6, verbatim PAA where on-topic: "Can you get a 700 credit score after Chapter 7?", "Is it possible to get an 800 credit score after Chapter 7 bankruptcy?", "How long does it take to build a credit score from 500 to 700?", "How do I raise my credit score by 100 points?", plus "Should I get a credit card right after bankruptcy?" and "Does a Chapter 13 filer have to wait until discharge to rebuild?".""",
    links=["how-long-does-bankruptcy-stay-on-credit-report", "buying-a-car-after-bankruptcy", "buying-a-house-after-bankruptcy", "how-to-get-out-of-chapter-13-early"],
    extra_internal=["/guides/how-to-build-credit-fast/ (How to Build Credit Fast)", "/roundup/best-secured-credit-cards/ (Best Secured Credit Cards)", "/compare/secured-credit-card-vs-unsecured-credit-card/ (Secured vs Unsecured Credit Card)"],
  ),
  dict(
    slug="how-long-does-bankruptcy-stay-on-credit-report", route="/guides/how-long-does-bankruptcy-stay-on-credit-report/",
    ptype="guide (guides.ts) — explainer, reporting-period table + dispute steps", floor=1200, facts=["credit"],
    kw="how long does bankruptcy stay on credit report",
    kw2="how to remove bankruptcy from credit report, how to get bankruptcy off credit report, how long does chapter 7 stay on credit report, does bankruptcy stay on credit report forever, why is bankruptcy still on my credit report, how to dispute bankruptcy on credit report",
    intent="the reader wants the exact reporting period for their chapter and whether any legitimate way exists to get it removed sooner.",
    rq='"How long does bankruptcy stay on my credit report, and can I get it removed sooner?" [PAA 5/12 on-topic across both heads: remove Ch 7 before 10 years (x2) / how long Ch 7 stays (x2) / is credit clear after 7 years; 7/12 off-topic: credit repair companies, bureau differences, which bureaus to freeze, biggest score killer, Ch 7 vs 13, worst debt, 550 score; ac 38/38]',
    ans="Figure: a Chapter 7 can stay up to 10 years from the filing date and a completed Chapter 13 drops off at 7; it can only come off early if it's reported inaccurately, which you challenge with a dispute to each bureau — paying a company to \"remove\" an accurate bankruptcy doesn't work. Shape: figure",
    place='section 1 "How Long Each Type of Bankruptcy Stays on Your Report" — 2 sentence answer, then a markdown table: item | how long it can be reported | measured from | source. Rows: Chapter 7 case, Chapter 13 case, individual accounts included in the bankruptcy, (and the FCRA $-threshold exceptions only if on the fact list). Use only periods and "measured from" dates the fact list supports.',
    serp="Forum-owned page one (reddit.com, ficoforums.myfico.com, youtube.com) plus experian.com and law-firm blogs; no AI Overview. Win with the exact statute + bureau-stated periods in one table and a clear legitimate-vs-scam removal section.",
    task="""2. Why Chapter 7 and Chapter 13 differ: the FCRA ceiling vs the bureaus' stated practice (per the fact list).
3. The accounts inside the bankruptcy: how they should be reported and when they drop off, and why they can disappear before the bankruptcy entry itself.
4. When early removal is legitimate: inaccurate or unverifiable entries; how to dispute with each bureau (steps, timing per §1681i on the fact list), what to include.
5. Why paid "removal" doesn't work: what the FTC/CFPB say about credit repair companies and accurate negative information; CROA rules on fees.
6. What to do if it doesn't drop off on time: check the dates, dispute, complaint to the CFPB (only if the fact list carries the complaint route).
7. When it can still show up after it's gone from the report: the FCRA exceptions for large loans/insurance/high-salary jobs (only if on the fact list), and that court records stay public (only if on the fact list).
8. Living with it while it's there: how its weight fades as it ages (per the fact list) — link /guides/how-to-rebuild-credit-after-bankruptcy/.
FAQ 5–6, verbatim PAA where on-topic: "Can you remove Chapter 7 from a credit report before 10 years?", "Is it true that after 7 years your credit is clear?", "Does bankruptcy stay on your credit report forever?", "Why is bankruptcy still on my credit report?", "Does a dismissed bankruptcy show on your credit report?" (only if the fact list supports an answer; otherwise drop it).""",
    links=["how-to-rebuild-credit-after-bankruptcy", "how-to-get-out-of-chapter-13-early", "buying-a-house-after-bankruptcy"],
    extra_internal=["/guides/pay-for-delete-letters-explained/ (Pay for Delete Letters Explained — for collection accounts, a different entry)"],
  ),
  dict(
    slug="how-much-does-it-cost-to-file-bankruptcy", route="/guides/how-much-does-it-cost-to-file-bankruptcy/",
    ptype="guide (guides.ts) — cost / pricing, cost-breakdown table", floor=1000, facts=["cost"],
    kw="how much does it cost to file bankruptcy",
    kw2="how much does it cost to file chapter 7, cost to file bankruptcy, bankruptcy attorney cost, what does chapter 13 bankruptcy cost, bankruptcy filing fee, bankruptcy fee waiver",
    intent="the reader wants the actual dollar costs of filing Chapter 7 or 13 — court fee, required courses, lawyer — and whether they can file if they can't afford it.",
    rq='"How much does it cost to file bankruptcy?" [PAA 0/4 on-topic: 2 Chapter 7 eligibility, 1 bank freeze, 1 800 score after Ch 7 — keyword-intent flag; ac 25/25 cost completions: what does bankruptcy cost / chapter 7 cost / chapter 13 cost / by state]',
    ans="Figure: the court fee is a fixed federal amount (Chapter 7 is higher than Chapter 13 — exact current figures from the uscourts.gov schedule), the two required courses add a small amount each, and attorney fees are the real cost — usually paid up front for Chapter 7 and mostly through the plan for Chapter 13; a Chapter 7 filer under 150% of the poverty line can ask the court to waive the fee. Shape: figure",
    place='section 1 "What Filing Bankruptcy Costs, Fee by Fee" — 2–3 sentence answer with the current court fee totals from the fact list, then a markdown table: cost | Chapter 7 | Chapter 13 | notes/source. Rows: court filing fee (with its components if on the list), credit counseling course, debtor education course, attorney fee (published data or "varies by district" exactly as the fact list allows), Chapter 13 trustee fee on plan payments (cap from the list). Never state a number the fact list does not carry.',
    serp="experian.com, legalshield.com, casb.uscourts.gov, reddit.com, freedomdebtrelief.com, debt.org own page one; no AI Overview. Win with the current federal fee schedule broken into components plus the waiver/installment rules — most results give stale or rounded totals.",
    task="""2. The court filing fee: components and total for each chapter, effective date of the current schedule, conversion fee if on the list.
3. If you can't pay the fee: the Chapter 7 fee waiver (who qualifies, Official Form 103B), paying in installments (Rule 1006, Official Form 103A).
4. The two required courses: what they cost and the rule that approved providers must help people who can't pay (per the fact list).
5. Attorney fees: what published data says (label studies with their year), why Chapter 13 fees are often paid through the plan, district "presumptively reasonable" fee examples only if on the list. State that fees vary by district and the reader should get quotes.
6. Filing without a lawyer: what uscourts.gov says about filing on your own, nonprofit/free options on the list (legal aid, Upsolve as the organization describes itself), bankruptcy petition preparers and their limits (§110).
7. The cost of not filing vs filing: keep this short and factual — interest, collection, garnishment limits only if on the list; link /guides/bankruptcy-alternatives/ and /compare/debt-settlement-vs-bankruptcy/.
FAQ 5–6 (cost questions from Autocomplete): "How much does Chapter 7 cost?", "How much does Chapter 13 cost?", "Can I file bankruptcy for free?", "Can I pay the bankruptcy filing fee in installments?", "Do bankruptcy lawyers take payment plans?" (only what the list supports), "Why does bankruptcy cost money?".""",
    links=["how-to-file-chapter-7-bankruptcy", "bankruptcy-alternatives", "debt-settlement-vs-bankruptcy", "how-to-get-out-of-chapter-13-early"],
  ),
  dict(
    slug="how-to-file-chapter-7-bankruptcy", route="/guides/how-to-file-chapter-7-bankruptcy/",
    ptype="guide (guides.ts) — explainer, numbered filing steps", floor=1200, facts=["ch13", "cost"],
    kw="how to file Chapter 7",
    kw2="how to file bankruptcy, how to file chapter 7 bankruptcy, can I file chapter 7 myself, chapter 7 means test, 341 meeting of creditors, chapter 7 90 day rule",
    intent="a person considering Chapter 7 wants the filing process step by step, what happens when, and the traps before filing.",
    rq='"How do I file Chapter 7 bankruptcy, step by step?" [PAA 5/6 on-topic: file it myself / bank balance / 90-day rule / wipes all debt / bank freeze; 1/6 taxes after; ac 10 completions on head (volumes.json corroboration)]',
    ans="Mechanism: take an approved credit-counseling course, check eligibility with the means test, file the petition, schedules and fee in your district's bankruptcy court, attend the 341 meeting 21 to 40 days after filing, finish the debtor-education course, and the discharge generally follows 60 to 90 days after the date first set for that meeting. Shape: mechanism",
    place='section 1 "How to File Chapter 7, Step by Step" — numbered steps 1–7 (counseling → means test → gather documents → file petition/schedules/fee → automatic stay → 341 meeting → debtor education → discharge), each with its deadline/timing exactly as the fact list states it. If the fact list words the timing differently from the answer sentence above, follow the fact list.',
    serp="hokelawfirm.com, debtclinic.com, nolo.com, incharge.org, upsolve.org, badcredit.org, youtube.com own page one; AI Overview present. SERP recommends a step structure — lead with the numbered steps.",
    task="""2. Who qualifies: the means test in plain terms (link the U.S. Trustee means-testing page if on the URL list; never state a median income figure), the 8-year bar on a repeat Chapter 7 discharge.
3. The documents and forms you'll need: the schedules/statement list from uscourts.gov per the fact list, Official Form 101.
4. What happens the day you file: the automatic stay — what it stops.
5. The 341 meeting and the trustee: what happens, timing per the fact list.
6. Traps before you file: the 90-day preference rule (1 year for insiders), luxury purchases and cash advances presumption (current dollar thresholds and windows only as on the fact list), moving assets.
7. What Chapter 7 doesn't erase: the main §523(a) categories.
8. Filing on your own vs with an attorney: what uscourts.gov says, costs — link /guides/how-much-does-it-cost-to-file-bankruptcy/.
FAQ 5–6, verbatim PAA where on-topic: "Can I file Chapter 7 myself?", "How much money can I have in the bank for Chapter 7?" (answer with what the fact list supports: exemptions vary; bank balance on the filing date is part of the estate — only if the list supports it), "What is the 90 day rule for Chapter 7?", "Does Chapter 7 wipe out all debt?", "Do they freeze your bank account when you file Chapter 7?" (only if the list supports an answer; else drop), "How long does Chapter 7 take?".""",
    links=["how-much-does-it-cost-to-file-bankruptcy", "how-to-rebuild-credit-after-bankruptcy", "bankruptcy-alternatives", "how-long-does-bankruptcy-stay-on-credit-report"],
  ),
  dict(
    slug="bankruptcy-alternatives", route="/guides/bankruptcy-alternatives/",
    ptype="guide (guides.ts) — explainer with options comparison table (list shape)", floor=1200, facts=["alt"],
    kw="bankruptcy alternatives",
    kw2="alternatives to bankruptcy, how to get out of debt without bankruptcy, how to get out of debt without filing bankruptcy, debt management plan vs bankruptcy, what bankruptcy options are there, alternatives to chapter 13",
    intent="someone weighing bankruptcy wants every realistic non-bankruptcy route compared on cost, credit damage, taxes, time and legal protection.",
    rq='"What are my alternatives to filing bankruptcy?" [PAA 1/6 on-topic: alternatives to Chapter 13; 5/6 off-topic: bank freeze, 11 words to stop a collector, worst debt, debt that dies with you, age out of debt — keyword-intent flag; ac 4/5 on-topic: what bankruptcy options are there / what bankruptcy options do i have / what are bankruptcy alternatives / alternatives to chapter 13; 1 UK]',
    ans="List: a nonprofit debt management plan, debt settlement, a consolidation loan or balance transfer, negotiating hardship terms directly, or doing nothing if you're judgment-proof — each trades a smaller credit hit or no court record for a longer timeline, a tax bill on forgiven debt, or no legal protection from collection. Shape: list",
    place='section 1 "The Alternatives to Bankruptcy, Side by Side" — 2 sentence answer, then a markdown table: option | how it works | cost | credit-report effect | tax on forgiven debt | protection from lawsuits | best fit. Rows: debt management plan, debt settlement, consolidation loan, balance-transfer card, hardship plan with the creditor, waiting it out (judgment-proof / time-barred debt), and Chapter 13 as the in-bankruptcy alternative to Chapter 7. Objective: no option is the default winner.',
    serp="ohiolegalclinic.com, reddit.com, unitedway.org, debt.org, moneylion.com, thebankruptcysite.org + law firms own page one; no AI Overview. Win with the single most complete side-by-side including the tax and lawsuit-protection columns nobody else carries.",
    task="""2. Debt management plan: how it works and who runs it (CFPB/FTC wording), what it does and doesn't do (principal usually not reduced unless the list says otherwise), how to pick a reputable agency.
3. Debt settlement: how it works, risks (CFPB/FTC), the FTC advance-fee ban, taxes on forgiven debt and the insolvency exclusion — link /compare/debt-settlement-vs-bankruptcy/ for the full head-to-head.
4. Consolidation loan or balance transfer: when it helps, the risks (fees, running balances back up) — link /debt-consolidation-calculator/ and /guides/how-to-choose-a-balance-transfer-credit-card/.
5. Negotiating directly: hardship programs.
6. Waiting it out: protected income (federal benefits rule, wage-garnishment limits), time-barred debt and Regulation F, the restart-the-clock risk — present only what the list supports.
7. When bankruptcy is still the better tool: automatic stay, discharge, tax treatment of discharged debt — link /compare/chapter-7-vs-chapter-13-bankruptcy/ and /guides/how-much-does-it-cost-to-file-bankruptcy/.
Do NOT duplicate /guides/how-to-pay-off-debt/ (it already covers snowball/avalanche payoff methods); link to it once for payoff methods.
FAQ 5–6: "What are the alternatives to Chapter 13 bankruptcy?" (verbatim PAA), "Is a debt management plan better than bankruptcy?", "Will debt settlement hurt my credit less than bankruptcy?", "Do I pay taxes on settled debt?", "Can creditors take my Social Security if I don't file bankruptcy?" (only if the list supports), "What happens if I just stop paying my debts?".""",
    links=["debt-settlement-vs-bankruptcy", "how-much-does-it-cost-to-file-bankruptcy", "how-to-file-chapter-7-bankruptcy"],
    extra_internal=["/guides/how-to-choose-a-balance-transfer-credit-card/ (How to Choose a Balance Transfer Credit Card)"],
  ),
  dict(
    slug="debt-settlement-vs-bankruptcy", route="/compare/debt-settlement-vs-bankruptcy/", schema="comparison",
    ptype="comparison (comparisons.ts) — X vs Y", floor=1500, facts=["alt"],
    kw="debt settlement vs bankruptcy",
    kw2="debt settlement or bankruptcy, is debt settlement better than bankruptcy, debt settlement vs chapter 7, debt settlement vs chapter 13",
    intent="someone with unaffordable unsecured debt is choosing between a debt-settlement program and filing bankruptcy.",
    rq='"Is debt settlement or bankruptcy better for getting out of debt?" [PAA 1/6 on-topic (adjacent: consolidation vs settlement); 5/6 off-topic: bank freeze, which debt not to pay, debt relief order, what not to say to a collector, clear debt without paying — keyword-intent flag; ac 5 head completions, 0 question-mode]',
    ans="Pick: bankruptcy usually wins when the debt is more than you could repay in about five years or a creditor is already suing, because the automatic stay stops collection and discharged debt isn't taxed; settlement fits when you have cash for lump sums, a few large unsecured debts, and assets bankruptcy would put at risk. Shape: pick",
    place='section 1 "Debt Settlement vs Bankruptcy: Which One Gets You Out" — the first section must state the pick and its boundary (the conditions above) before any background. introText must open with the actual difference in one self-contained sentence.',
    serp="berkencloyes.com, jgwentworth.com, reddit.com, youtube.com + 6 law-firm blogs own page one; no AI Overview. Law-firm pages are biased toward bankruptcy and settlement-company pages toward settlement — win by being visibly neutral with the FTC/CFPB/IRS rules in one table.",
    task="""optionA: "Debt Settlement"; optionB: "Bankruptcy".
comparisonTable dimensions (8–10 rows, each a real trade-off, at least one favouring each side): How it works; Who negotiates / decides; Upfront and ongoing cost (FTC advance-fee rule; court fees — link the cost guide for numbers); Effect on lawsuits and collection (automatic stay vs none); Tax on forgiven debt (taxable unless an exclusion applies vs excluded in a Title 11 case); Credit-report entry and how long (settled accounts vs bankruptcy, per FCRA on the list); Which debts it can handle (unsecured only vs §523 exceptions); Certainty of outcome (creditors may refuse vs court discharge); Time to finish; Public record.
sections (6–8): the pick and its boundary (section 1, see placement); how debt settlement works and its risks; how bankruptcy resolves the same debts (Chapter 7 vs 13 — link /compare/chapter-7-vs-chapter-13-bankruptcy/); the cost comparison (link /guides/how-much-does-it-cost-to-file-bankruptcy/); taxes; credit-report effect; when settlement makes sense; when bankruptcy makes sense; "What Would Change Our Answer" (the voice sample has this section — mirror it).
verdict: who should pick each, and the condition that decides it — no blanket recommendation.
relatedComparisons: ["chapter-7-vs-chapter-13-bankruptcy", "debt-snowball-vs-avalanche"].
calculatorLinks: Debt Consolidation Calculator /debt-consolidation-calculator/, Credit Card Payoff Calculator /credit-card-payoff/, Budget Calculator /budget/.
FAQ 5–6: "Is debt settlement better than bankruptcy?", "Does debt settlement hurt your credit as much as bankruptcy?", "Can a creditor sue me during debt settlement?", "Do I have to pay taxes on settled debt?", "What's the difference between debt consolidation and debt settlement?" (verbatim PAA), "Can I settle some debts and file bankruptcy on the rest?" (only if the list supports).""",
    links=["bankruptcy-alternatives", "how-much-does-it-cost-to-file-bankruptcy", "how-to-file-chapter-7-bankruptcy"],
  ),
  dict(
    slug="buying-a-house-after-bankruptcy", route="/guides/buying-a-house-after-bankruptcy/",
    ptype="guide (guides.ts) — explainer, waiting-period table", floor=1200, facts=["housecar", "credit"],
    kw="how long after bankruptcy can I buy a house",
    kw2="buying a house after bankruptcy, how long do you have to wait to buy a house after chapter 7, FHA loan after chapter 7, mortgage after chapter 13, can you buy a house after chapter 7",
    intent="someone with a Chapter 7 or 13 in their past wants the exact waiting period for each mortgage type and what else lenders check.",
    rq='"How long after bankruptcy can I buy a house?" [PAA 5/6 on-topic figure: wait after Ch 7 / FHA after Ch 7 / loan after Ch 7 / mortgage after Ch 13 / lenders; 1/6 off-topic: 800 score; ac 6/6 how-long]',
    ans="Figure: it depends on the loan — conventional loans (Fannie Mae, Freddie Mac) generally wait four years after a Chapter 7 discharge, FHA and VA two, and USDA treats a discharge within the last 36 months as a significant derogatory item that needs extra review; during a Chapter 13 plan, FHA, VA and USDA loans can be possible after 12 months of on-time plan payments with court or trustee approval (exact rules from each agency's guide). Shape: figure",
    place='section 1 "Waiting Periods by Loan Type" — 2 sentence answer, then a markdown table: loan type | after Chapter 7 | during/after Chapter 13 | with extenuating circumstances | source. Rows: FHA, VA, USDA, conventional (Fannie Mae), conventional (Freddie Mac). Every cell exactly as the fact list states it; a cell the list doesn\'t support says "not published in our sources — ask the lender". FHA EXCEPTION (decided by the run, overrides the unverified tag for FHA bullets only): the FHA bullets come from HUD\'s own Handbook 4000.1 text (a HUD redline PDF reposted by a trade group, because hud.gov blocked access). You MAY state them, attributed to "HUD\'s FHA handbook", and must add once that HUD updates the handbook and the reader should confirm the current rule with an FHA lender. Do not link the reposted PDF. USDA: describe its rule exactly as the regulation words it (a "significant derogatory credit" indicator), not as a fixed waiting period.',
    serp="lower.com, findlaw.com, reddit.com, rocketmortgage.com, zillow.com + law firms own page one; no AI Overview. Win with all five agency rules in one sourced table.",
    task="""2. When the clock starts: discharge date vs dismissal date, and why it matters (per the fact list).
3. Buying during a Chapter 13 plan: the 12-month rule and trustee/court permission (FHA/VA/USDA per the list), how the request works.
4. Extenuating circumstances: how Fannie Mae defines them and what documentation looks like (per the list).
5. What else underwriters check after a bankruptcy: re-established credit, letter of explanation (only what the list supports), credit score — link /guides/how-to-rebuild-credit-after-bankruptcy/ and /guides/how-long-does-bankruptcy-stay-on-credit-report/.
6. Choosing the loan: FHA vs VA vs conventional for a post-bankruptcy buyer — link /compare/fha-vs-conventional-loan/, /compare/fha-loan-vs-va-loan/, /compare/usda-loan-vs-fha-loan/.
7. Getting ready: preapproval, comparing Loan Estimates (CFPB per the list), budgeting the payment — link /mortgage/ and /guides/first-time-home-buyer-guide/.
FAQ 5–6, verbatim PAA where on-topic: "How long do you have to wait to buy a house after Chapter 7?", "How long after Chapter 7 can I get an FHA loan?", "Can I still get a house loan after Chapter 7 bankruptcy?", "How long after Chapter 13 bankruptcy can I get a mortgage?", "Which mortgage lenders accept bankrupts?" (answer with loan programs, not named lenders), "Can I buy a house while in Chapter 13?".""",
    links=["how-to-rebuild-credit-after-bankruptcy", "how-long-does-bankruptcy-stay-on-credit-report", "buying-a-car-after-bankruptcy"],
    extra_internal=["/compare/fha-vs-conventional-loan/ (FHA vs Conventional Loan)", "/compare/fha-loan-vs-va-loan/ (FHA Loan vs VA Loan)", "/compare/usda-loan-vs-fha-loan/ (USDA Loan vs FHA Loan)", "/mortgage/ (Mortgage Calculator)", "/guides/first-time-home-buyer-guide/ (First-Time Home Buyer Guide)"],
  ),
  dict(
    slug="buying-a-car-after-bankruptcy", route="/guides/buying-a-car-after-bankruptcy/",
    ptype="guide (guides.ts) — explainer, operator-voice steps", floor=1200, facts=["housecar", "credit"],
    kw="buying a car after Chapter 7",
    kw2="car loan after bankruptcy, buying a car after bankruptcy, buying a car during chapter 13, what happens to my car after chapter 7, reaffirm car loan chapter 7",
    intent="someone who just went through (or is in) bankruptcy needs a car and wants to know when they can finance one and how to avoid a bad deal — and what happens to the car they already have.",
    rq='"Can I buy a car after Chapter 7, and how do I get approved?" [PAA 2/6 on-topic: $3,000 car rule / CarMax with Ch 13; 4/6 off-topic: Ch 7 bank/eligibility questions — keyword-intent flag; ac 10 head completions + "what happens to my car after chapter 7"; question-mode sweep 0]',
    ans="Mechanism: you can usually finance a car soon after a Chapter 7 discharge (during Chapter 13 you need the trustee's permission first) — expect a higher rate, so bring a larger down payment, get pre-approved by a credit union or a lender that publishes post-bankruptcy programs before visiting a dealer, and refinance after a year of on-time payments. Shape: mechanism",
    place='section 1 "How to Buy a Car After Bankruptcy" — numbered steps (timing → pre-approval → down payment → shop the car → read the contract → refinance later). State no interest rate, no "X months" timeline and no lender name the fact list does not carry; where the list has nothing, say rates depend on the lender and your new credit history.',
    serp="tiktok.com, reddit.com, nolo.com, abi.org, findlaw.com, avvo.com own page one; AI Overview cites reddit.com, creditacceptance.com, chase.com, lendingtree.com. Forum-owned → operator-voice, concrete steps; never recommend a named subprime lender.",
    task="""2. The car you already have: reaffirm, redeem, or surrender in Chapter 7 (statute and deadlines exactly per the fact list), what each means for your payment and your credit.
3. Buying during Chapter 13: trustee/court permission to incur new debt (per the list), the 910-day rule for existing car loans (per the list).
4. Where to get financed: credit unions, preapproval, why dealer financing and buy-here-pay-here deserve caution (CFPB per the list) — link /compare/credit-union-vs-bank/ and /roundup/best-auto-loan-calculators-by-bank-and-credit-union/.
5. Keeping the deal affordable: down payment, loan term, add-ons (GAP etc. per the list) — link /auto-loan/ and /guides/how-long-should-a-car-loan-be/ and /guides/car-loan-mistakes/.
6. Refinancing later as the bankruptcy ages: link /guides/how-to-rebuild-credit-after-bankruptcy/.
FAQ 5–6: "Can I buy a car right after Chapter 7?", "Does CarMax work with Chapter 13?" (verbatim PAA — answer generally: any lender must get trustee/court approval for financing during Chapter 13 per the list; do not state CarMax's policy unless on the list), "What is the $3,000 rule for buying cars?" (verbatim PAA — only if the fact list explains it; otherwise drop it), "Should I reaffirm my car loan?", "Will I get a high interest rate after bankruptcy?", "Can I keep my car in Chapter 7?".""",
    links=["how-to-rebuild-credit-after-bankruptcy", "buying-a-house-after-bankruptcy", "how-to-get-out-of-chapter-13-early"],
    extra_internal=["/auto-loan/ (Auto Loan Calculator)", "/guides/how-long-should-a-car-loan-be/ (How Long Should a Car Loan Be)", "/guides/car-loan-mistakes/ (Car Loan Mistakes)", "/compare/credit-union-vs-bank/ (Credit Union vs Bank)", "/roundup/best-auto-loan-calculators-by-bank-and-credit-union/ (Auto Loan Calculators by Bank and Credit Union)", "/guides/how-to-buy-a-car/ (How to Buy a Car)"],
  ),
]

def urls_from(path):
    s = open(path).read()
    m = re.search(r"## URLs used\s*\n(.*)", s, re.S)
    block = m.group(1) if m else s
    return [u.rstrip(").,;>") for u in re.findall(r"https?://[^\s\]\)>`]+", block)]

all_urls = set()
for r in ROWS:
    if not all(os.path.exists(FACTS[k]) for k in r["facts"]):
        print("SKIP (facts pending)", r["slug"]); continue
    facts_txt, urls = [], []
    for k in r["facts"]:
        facts_txt.append(open(FACTS[k]).read())
        urls += urls_from(FACTS[k])
    urls = sorted(u for u in set(urls) if 'nrmlaonline' not in u); all_urls.update(urls)
    internal = INTERNAL_COMMON + [SIBLINGS[s] for s in r["links"]] + r.get("extra_internal", [])
    out = f"""route: {r['route']}
slug: {r['slug']}
page type: {r['ptype']}
register: operator
medium: text → text
depth floor: {r['floor']} words (aim ~{int(r['floor']*1.5)})
primary keyword: {r['kw']}
secondary keywords: {r['kw2']}
intent: {r['intent']}
reader question: {r['rq']}
answer: {r['ans']}
answer placement: {r['place']}
The answering section goes in that slot, before any scope, definition or background material.
SERP evidence: {r['serp']}

{LEGAL}

TASK — sections after section 1:
{r['task']}

INTERNAL LINKS you may use (exact paths; link each at most once; sibling pages shipping in this run are real):
""" + "\n".join("- " + i for i in internal) + f"""

CLOSED URL LIST — the only external hrefs allowed (official/primary sources; first mention only):
""" + "\n".join("- " + u for u in urls) + "\n\n" + CLOSED + "\n" + "\n\n".join(facts_txt) + "\n"
    open(f"{RUN}/prompts/{r['slug']}.prompt.md", "w").write(out)
    open(f"{RUN}/prompts/allowed-urls.{r['slug']}.txt", "w").write("\n".join(urls) + "\n")
    print(r["slug"], len(out.split()), "words,", len(urls), "urls")
open(f"{RUN}/prompts/allowed-urls.all.txt", "w").write("\n".join(sorted(all_urls)) + "\n")
