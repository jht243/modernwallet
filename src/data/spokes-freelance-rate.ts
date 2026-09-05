import type { SpokeEntry } from "./types";
import { IRS_SE_TAX, IRS_ES, IRS_SCHED_C } from "./spokes-self-employed";

// Freelance-rate spokes (2026-09-05). Powered by src/lib/freelance-rate.ts, which solves backwards
// from a target take-home through real 2026 self-employment and income tax rather than applying a
// markup to a salary.
//
// The finding that shapes the 1099-vs-W-2 page, and that contradicts the usual "add 30% for taxes"
// advice: at $100,000, a contractor needs only about 2% more revenue than the salary to match an
// employee's take-home, because the QBI deduction very nearly offsets the extra self-employment
// tax. The real premium a contractor needs is for BENEFITS — insurance, retirement match, paid
// leave — not for tax. Saying so is more useful than repeating the folk multiplier.

export const FREELANCE_RATE_SPOKES: SpokeEntry[] = [
  {
    calculator: "freelance-rate",
    slug: "billable-hours-calculator",
    updated: "2026-09-05",
    title: "Billable Hours Calculator: Rate From Real Hours",
    metaDescription:
      "Billable hours calculator for freelancers. See how many hours you can really bill, your utilization rate, and the hourly rate those hours have to carry.",
    targetKeyword: "billable hours calculator",
    estimatedVolume: 390,
    estimatedKD: 15,
    h1: "Billable Hours Calculator: What Your Hours Must Earn",
    introText:
      "Billable hours are the hours a client actually pays for, and they are always fewer than the hours you work. The gap — proposals, invoicing, admin, unpaid revisions — is the single biggest reason freelance rates come out too low.\n\nBilling 20 of a 40-hour week is 50% utilization. To take home $60,000 across 48 working weeks with $4,000 of overhead, those 960 billable hours have to carry a rate of $82.96.",
    howItWorks:
      "Utilization is the ratio of billable hours to hours worked, and it is the number that turns a salary into a freelance rate. Most solo freelancers land between 50% and 70%. Anything above 70% sustained usually means either unusually low admin or hours quietly going unrecorded.\n\nThe arithmetic runs in one direction only if you want a rate you can live on: start from take-home, not from an hourly figure you hope sounds reasonable. Take the annual take-home you want, add your business overhead, add the federal self-employment and income tax that profit attracts, and divide by billable hours — your billable hours per week multiplied by the weeks you actually work.\n\nThat last term matters more than people expect. A salaried employee is paid for holidays, vacation, and sick days. A freelancer is not, so 52 weeks is never the right figure. Planning on 48 rather than 52 raises the rate you need by about 8%, and planning on 46 raises it by 13%.\n\nWork the example through. Twenty billable hours a week for 48 weeks is 960 billable hours. To clear $60,000 of take-home with $4,000 of overhead requires $79,643 of revenue once federal tax is covered, which divided across 960 hours is $82.96 an hour, or about $664 a day.\n\nCompare that to the salary it replaces and the effect of utilization becomes obvious. An employee taking home the same $60,000 earns about $72,736, which is $34.97 an hour across a standard 2,080-hour year. The freelance rate needed to match it is 2.4 times that. Nothing about the work changed — the multiplier is almost entirely the 50% utilization, plus both FICA halves and unpaid leave.\n\nThis is why raising utilization is usually more valuable than raising your rate. Moving from 20 to 25 billable hours a week, without changing your price or your working hours, increases annual revenue by 25%. It is also usually harder than it sounds, because the unbillable time is real work that still has to happen — which is the honest argument for either raising the rate or automating the admin, rather than pretending the hours are not there.\n\nOne caveat about tracking. Utilization is only meaningful if you record all your hours, not just the billable ones. A freelancer who logs client work and ignores everything else will calculate a utilization near 100% and set a rate that quietly underpays them for every hour of the rest.",
    commonMistakes: [
      "Dividing a target salary by 2,080 hours. That prices a full year of work as though every hour were billable, and it is the most common way a freelance rate ends up 40% too low.",
      "Assuming utilization above 70%. Proposals, invoicing, bookkeeping, and unpaid revisions come out of the same week; 50% to 70% is the realistic band for a solo freelancer.",
      "Planning on 52 working weeks. Nobody pays you for holidays or sick days any more, and each week of unplanned time off is a direct pay cut unless the rate accounts for it.",
      "Tracking only billable hours. Without recording the unbillable ones you cannot compute utilization at all, and you will overestimate it every time.",
      "Treating the calculated rate as a price. It is a floor — the point below which the work costs you money. What a client will pay depends on the value of the outcome.",
    ],
    workedExample:
      "A freelancer works 40 hours a week but can bill only 20 of them, giving 50% utilization, and plans to work 48 weeks — 960 billable hours for the year. They want $60,000 of take-home and have $4,000 of overhead in software, insurance, and accounting. Covering that take-home plus overhead plus federal self-employment and income tax requires $79,643 of revenue, so the rate is $82.96 an hour or $663.69 a day. An employee taking home the same $60,000 would earn a salary of about $72,736, or $34.97 an hour across 2,080 hours. The freelancer's rate is 2.4× the employee's — and the largest single reason is the 480 hours a year they work but cannot bill.",
    faqs: [
      {
        question: "How do I calculate billable hours?",
        answer:
          "Multiply the hours you can realistically bill in a week by the number of weeks you will actually work. Billable hours exclude proposals, invoicing, bookkeeping, marketing, and unpaid revisions — all real work that no client pays for. Twenty billable hours a week across 48 working weeks is 960 billable hours a year, and that is the figure your entire annual revenue has to be divided across.",
      },
      {
        question: "What is a good utilization rate for a freelancer?",
        answer:
          "Between 50% and 70% for most solo freelancers. Below 50% suggests too much time on unpaid business development relative to delivery; sustained above 70% usually means either exceptionally low admin overhead or unbillable hours going unrecorded. If you are new, plan at 50% until you have a few months of tracked hours to test the assumption against.",
      },
      {
        question: "Why is my freelance rate more than double an employee's hourly pay?",
        answer:
          "Mostly utilization. An employee is paid for all 2,080 hours of the year; a freelancer is paid only for the billable ones, so at 50% utilization the rate must be roughly double before anything else is counted. Then add both halves of Social Security and Medicare, unpaid holidays and sick days, and overhead the employer used to cover. The multiplier is not a markup — it is the arithmetic of being paid for half your working hours.",
      },
      {
        question: "Should I raise my rate or bill more hours?",
        answer:
          "Raising utilization is usually the larger lever and the harder one. Going from 20 to 25 billable hours a week raises revenue 25% without changing your price or your working hours — but the unbillable time is real work that still has to happen, so it only works if you automate or delegate the admin. Raising the rate is easier to execute and does not require finding hours that may not exist.",
      },
      {
        question: "Do billable hours include revisions and client calls?",
        answer:
          "Only if you bill for them. Many freelancers include client calls in their rate and absorb revisions, which pushes both into unbillable time and lowers utilization. The cleanest approach is to decide explicitly: either bill them, or count them honestly as unbillable so the rate covers them. What does not work is treating them as free while assuming a high utilization rate.",
      },
    ],
    sources: [IRS_SE_TAX, IRS_SCHED_C],
    toolHeading: "Billable hours and rate",
    toolSubheading: "Set billable and total hours to see your utilization",
    preset: {
      targetTakeHome: 60000,
      billableHoursPerWeek: 20,
      weeksWorkedPerYear: 48,
      annualOverhead: 4000,
      filingStatus: "single",
      hoursPerDay: 8,
      totalHoursPerWeek: 40,
    },
    relatedSlugs: ["day-rate-calculator", "1099-vs-w2-calculator"],
  },

  {
    calculator: "freelance-rate",
    slug: "day-rate-calculator",
    updated: "2026-09-05",
    title: "Day Rate Calculator for Freelancers and Contractors",
    metaDescription:
      "Day rate calculator for freelancers. Work backwards from the take-home you want to a defensible daily rate, after self-employment tax and overhead.",
    targetKeyword: "day rate calculator",
    estimatedVolume: 210,
    estimatedKD: 22,
    h1: "Day Rate Calculator: What to Charge Per Day",
    introText:
      "A day rate is the cleanest way to price contract work, because it stops the clock-watching and prices a unit the client understands. It is also easy to set too low, since a day rate hides the unbillable days an hourly rate at least makes visible.\n\nTo take home $85,000 while billing three days a week for 44 weeks with $9,000 of overhead, the day rate is $906.",
    howItWorks:
      "A day rate is your hourly rate multiplied by the hours in your working day, but working it out that way misses the point. Start where every rate calculation should start: with the take-home you want, and the days you can genuinely sell.\n\nThe days you can sell are fewer than the days you work. A contractor billing three days a week is at 60% utilization on a five-day week — the other two days go to pitching, admin, invoicing, and the work that keeps the pipeline full. Then subtract the weeks you will not work: holidays, illness, and the gaps between contracts. Forty-four working weeks is realistic for a contractor whose engagements do not run back to back.\n\nSo: 3 days a week for 44 weeks is 132 billable days. To take home $85,000 after $9,000 of overhead, and after federal self-employment and income tax on the profit, you need $119,594 of revenue. Divided across 132 days, that is $906 a day, or $113.25 an hour on an eight-hour day.\n\nDay rates carry two specific risks that hourly billing does not, and both are worth pricing in explicitly.\n\nThe first is scope. A day is a unit of time, not a unit of work, so a client who asks for \"one more small thing\" at 5pm is asking for part of tomorrow. Define what a day means — hours, availability, whether it includes calls — in the contract rather than discovering the definition mid-engagement.\n\nThe second is the half day. Clients frequently want them, and a half day rarely costs you half a day: the context switching means the remaining hours are worth less than a clean block. Either price half days above half the rate, or decline them and offer a full day instead.\n\nOne structural advantage is worth using. A day rate makes multi-day and retainer bookings easy to quote, and a retainer of a fixed number of days a month converts your worst problem — irregular income — into something closer to a salary. It is also the natural place to offer a discount you can defend: a small reduction for a committed block of days costs you less than the pitching time it saves.\n\nAs with any rate calculation, the number this produces is a floor rather than a price. It tells you where the work starts costing you money. What a client will pay depends on the value of the outcome, and for well-defined deliverables a fixed project fee often pays better than either day rate or hourly.",
    commonMistakes: [
      "Dividing an annual salary by 260 working days. That assumes every working day is billable and that you are paid for holidays — neither is true for a contractor.",
      "Forgetting the gaps between contracts. A contractor working 44 weeks a year is common; pricing as though it were 52 makes every unbooked week an unfunded pay cut.",
      "Leaving a day undefined in the contract. A day is a unit of time, not of work, so state the hours it covers and whether calls and revisions are included.",
      "Charging exactly half for a half day. Context switching means the rest of that day is worth less than a clean block, so half days should carry a premium or be declined.",
      "Treating the calculated rate as your price rather than your floor. It is the point below which the work loses money, not a measure of what the outcome is worth.",
    ],
    workedExample:
      "A contractor bills three days a week — 60% utilization against a five-day week — for 44 weeks a year, which is 132 billable days. They want $85,000 of take-home and carry $9,000 of overhead in insurance, software, accounting, and equipment. Covering the take-home, the overhead, and the federal self-employment and income tax on the resulting profit requires $119,594 of revenue. Across 132 days that is $906.02 a day, or $113.25 an hour on an eight-hour day. Pricing the same target across an imagined 260 billable days would have produced a day rate near $460 — barely half of what the work actually needs to earn.",
    faqs: [
      {
        question: "How do I calculate a freelance day rate?",
        answer:
          "Work backwards from take-home. Add the take-home you want, your business overhead, and the federal self-employment and income tax on that profit, then divide by the days you can genuinely bill — days per week times the weeks you will actually work. Three days a week for 44 weeks is 132 billable days, and $85,000 of take-home with $9,000 of overhead needs $119,594 of revenue, which is $906 a day.",
      },
      {
        question: "How many billable days a year should I plan for?",
        answer:
          "Between 130 and 190 for most contractors, depending on utilization. Three billable days a week across 44 working weeks is 132; four days across 46 weeks is 184. The two things that pull the number down are unbillable time — pitching, admin, invoicing — and the gaps between engagements. Assuming 260 billable days prices your work at roughly half what it needs to earn.",
      },
      {
        question: "Should I charge half of my day rate for a half day?",
        answer:
          "Usually more than half. A half day fragments the rest of the day: the context switching means the remaining hours rarely produce a full half day of useful work elsewhere. Many contractors price a half day at 60% to 70% of the full rate, and some decline them entirely and offer a full day instead. What does not work is pricing them at exactly half and absorbing the lost productivity.",
      },
      {
        question: "Is a day rate better than an hourly rate?",
        answer:
          "For contract work with a predictable shape, generally yes — it is easier to quote, easier for a client to budget, and it removes the incentive to watch the clock. Hourly is better where the scope is genuinely unpredictable, because it prices changes automatically. For well-defined deliverables, a fixed project fee often beats both, since it decouples your income from the hours and rewards you for getting faster.",
      },
      {
        question: "Should I discount for a long booking?",
        answer:
          "A small discount for a committed block of days is usually defensible, because it removes pitching time and idle gaps you would otherwise carry. Keep it modest — a booked month is worth more than an unbooked one, but not so much more that it justifies a steep cut. The comparison to make is against your realistic utilization: if the alternative to a discounted month is two billed weeks and two idle ones, the discount pays for itself.",
      },
    ],
    sources: [IRS_SE_TAX, IRS_ES],
    toolHeading: "Day rate calculator",
    toolSubheading: "Enter billable days as hours per week",
    preset: {
      targetTakeHome: 85000,
      billableHoursPerWeek: 24,
      weeksWorkedPerYear: 44,
      annualOverhead: 9000,
      filingStatus: "single",
      hoursPerDay: 8,
      totalHoursPerWeek: 40,
    },
    relatedSlugs: ["billable-hours-calculator", "1099-vs-w2-calculator"],
  },

  {
    calculator: "freelance-rate",
    slug: "1099-vs-w2-calculator",
    updated: "2026-09-05",
    title: "1099 vs W-2 Calculator: What Rate Matches a Salary",
    metaDescription:
      "1099 vs W-2 calculator. See what contractor revenue matches a salary's take-home in 2026 — and why the real premium you need is for benefits, not tax.",
    targetKeyword: "1099 vs W-2 calculator",
    estimatedVolume: 480,
    estimatedKD: 7,
    h1: "1099 vs W-2: What Contract Rate Matches a Salary?",
    introText:
      "The usual advice is to add 30% to a salary before accepting the same work as a contractor. On federal tax alone that is far too high: at $100,000, a contractor needs about $102,222 of revenue to match an employee's take-home — a premium of roughly 2%.\n\nThe reason is that the 20% qualified business income deduction almost exactly offsets the extra self-employment tax. The premium a contractor genuinely needs is for benefits, not for tax.",
    howItWorks:
      "Compare the two positions honestly and the tax difference is much smaller than folklore suggests.\n\nAn employee on a $100,000 salary pays 7.65% in Social Security and Medicare — $7,650 — and $13,170 of federal income tax, taking home $79,180. Their employer pays the matching $7,650 the employee never sees.\n\nA contractor billing $102,222 for the same work pays the full 15.3% self-employment tax on 92.35% of profit, which is $14,443.50 — nearly double the employee's FICA. But the contractor's income tax is far lower: after the deduction for half of self-employment tax and the 20% QBI deduction, taxable income falls to $63,120 and the income tax is $8,598.43. Total federal tax is $23,041.93, and the take-home is $79,180 — identical.\n\nSo the extra self-employment tax is real, and the QBI deduction very nearly cancels it. That is the finding, and it is why \"add 30% for taxes\" misprices contract work at this income level.\n\nWhat that comparison leaves out is everything that is not tax, and this is where the actual premium lives. An employer typically provides health insurance at a heavily subsidised premium, a retirement plan with a matching contribution, paid holiday and sick leave, unemployment insurance, workers' compensation, and often equipment and training. A contractor buys all of it, or does without.\n\nQuantify those rather than guessing at a percentage. Health insurance for a family bought individually can exceed $20,000 a year where an employer plan cost the employee a fraction of that. A 4% retirement match on $100,000 is $4,000. Four weeks of paid leave plus holidays is roughly 10% of the year. Add them up and the premium a contractor needs is frequently 25% to 40% — but it is a benefits premium, and it varies enormously by person. Someone covered by a spouse's health plan needs far less than someone insuring a family alone.\n\nThree caveats on the tax side. The QBI deduction is what makes the comparison so close, and it phases out above the §199A threshold — $201,775 single for 2026 — so the picture changes for high earners and for some service businesses. State tax is not modelled here and can move the comparison either way. And a contractor carries the risk an employee does not: gaps between contracts, unpaid invoices, and no unemployment insurance if the work stops.\n\nThe practical way to use the tool above is to enter the take-home you want and let it solve for the revenue needed, then add the annual cost of the benefits you would be replacing directly into the overhead field. That produces a rate grounded in your own circumstances rather than a rule of thumb. Our comparison of [1099 vs W-2 status](/compare/1099-vs-w2/) covers the classification rules and the non-financial differences.",
    commonMistakes: [
      "Adding a flat 30% for tax. At $100,000 the federal tax difference is closer to 2%, because the QBI deduction offsets most of the extra self-employment tax.",
      "Ignoring benefits entirely. Health insurance, a retirement match, and paid leave are where the real gap sits, and they are worth far more than the tax difference.",
      "Assuming the QBI deduction always applies. It phases out above $201,775 for single filers in 2026 and is restricted for some service businesses, which changes the comparison for high earners.",
      "Forgetting that gaps between contracts are unpaid. An employee's salary continues between projects; a contractor's revenue does not, and no unemployment insurance backs it.",
      "Comparing a contract rate to a salary without converting for utilization. If the contract is not full-time and continuous, the annual figures are not comparable at all.",
    ],
    workedExample:
      "An employee earning $100,000 pays $7,650 of Social Security and Medicare and $13,170 of federal income tax, taking home $79,180. A contractor doing the same work bills $102,221.93. Their self-employment tax is $14,443.50 — $6,793 more than the employee's FICA — but half of it is deductible above the line, and the 20% QBI deduction removes a further $15,780, cutting taxable income to $63,120.14 and federal income tax to $8,598.43. Total federal tax is $23,041.93, and take-home is $79,180: exactly the same. The contractor needed a 2.2% premium to match on tax. To match on benefits — insurance, a 4% retirement match, and four weeks of paid leave — they would need roughly $25,000 to $30,000 more.",
    faqs: [
      {
        question: "How much more should a 1099 contractor charge than a W-2 salary?",
        answer:
          "On federal tax alone, only about 2% at the $100,000 level, because the QBI deduction offsets most of the extra self-employment tax. The premium that actually matters is for benefits: health insurance, a retirement match, paid leave, and unemployment protection commonly add 25% to 40%. Price those specifically rather than applying a blanket markup — the figure depends heavily on whether you have coverage elsewhere.",
      },
      {
        question: "Do 1099 contractors really pay more tax than employees?",
        answer:
          "They pay much more self-employment tax and much less income tax, and at moderate incomes the two roughly cancel. A contractor pays the full 15.3% on 92.35% of profit rather than the employee's 7.65%, but gets an above-the-line deduction for half of it plus the 20% QBI deduction. At $100,000 the total federal tax works out close to identical for the same take-home.",
      },
      {
        question: "What is the QBI deduction worth to a contractor?",
        answer:
          "Up to 20% of qualified business income, capped at 20% of taxable income before the deduction. At $102,222 of contractor revenue it removes $15,780 of taxable income — worth roughly $3,500 in tax at that level, which is most of what makes the contractor and employee comparison come out even. It phases out above $201,775 for single filers in 2026 and is limited for certain service businesses.",
      },
      {
        question: "What benefits do I lose going from W-2 to 1099?",
        answer:
          "Employer-subsidised health insurance, any retirement plan matching contribution, paid holiday and sick leave, unemployment insurance, workers' compensation, and often equipment, software, and training budgets. You also lose the employer's half of Social Security and Medicare — that is the 7.65% that becomes yours. Cost each of these out for your own situation and add the total to your overhead before setting a rate.",
      },
      {
        question: "Is it better to be a 1099 contractor or a W-2 employee?",
        answer:
          "Financially it depends almost entirely on benefits and on the continuity of the work, not on tax. A contractor with coverage through a spouse and a steady pipeline can come out well ahead at a modest premium. Someone insuring a family alone, with gaps between contracts, needs a large premium to break even. The tax difference — the thing most people focus on — is the smallest term in the comparison at typical incomes.",
      },
    ],
    sources: [IRS_SE_TAX, IRS_SCHED_C, IRS_ES],
    toolHeading: "1099 vs W-2 rate",
    toolSubheading: "Add benefit costs to overhead for a true comparison",
    preset: {
      targetTakeHome: 79180,
      billableHoursPerWeek: 40,
      weeksWorkedPerYear: 52,
      annualOverhead: 0,
      filingStatus: "single",
      hoursPerDay: 8,
      totalHoursPerWeek: 40,
    },
    relatedSlugs: ["billable-hours-calculator", "day-rate-calculator"],
  },
];
