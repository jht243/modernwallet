import type { CalculatorDef } from "./types";

// Self-employed / 1099 silo hubs (2026-09-05). Three category hubs for the person who earns
// 1099 income — from client work or a gig platform — and has to handle their own tax:
//   /self-employment-tax/  → what you owe and what share of each payment to set aside
//   /mileage-deduction/    → the biggest deduction most gig drivers have, at 2026's split rates
//   /freelance-rate/       → what to charge so the take-home actually lands where you want it
//
// Every statutory figure below is 2026 and comes from an IRS primary source cited on the page.
// Ground-truth numbers in the copy come from the engines in src/lib/ (self-employment-tax.ts,
// mileage-deduction.ts, freelance-rate.ts) run against each hub's own defaultPreset.

const IRS_SE_TAX: { label: string; url: string } = {
  label: "IRS — Topic no. 751, Social Security and Medicare withholding rates",
  url: "https://www.irs.gov/taxtopics/tc751",
};
const IRS_GIG: { label: string; url: string } = {
  label: "IRS — Gig Economy Tax Center",
  url: "https://www.irs.gov/businesses/gig-economy-tax-center",
};
const IRS_MILEAGE: { label: string; url: string } = {
  label: "IRS — Standard mileage rates",
  url: "https://www.irs.gov/tax-professionals/standard-mileage-rates",
};
const IRS_SE_TAX_PAGE: { label: string; url: string } = {
  label: "IRS — Self-employment tax (Social Security and Medicare taxes)",
  url: "https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes",
};
const IRS_PUB463: { label: string; url: string } = {
  label: "IRS — Publication 463, Travel, Gift, and Car Expenses",
  url: "https://www.irs.gov/publications/p463",
};
const IRS_ES: { label: string; url: string } = {
  label: "IRS — Estimated taxes",
  url: "https://www.irs.gov/businesses/small-businesses-self-employed/estimated-taxes",
};

export const SELF_EMPLOYMENT_TAX_HUB: CalculatorDef = {
  id: "self-employment-tax",
  islandId: "self-employment-tax",
  label: "Self-Employment Tax",
  navOrder: 35,
  updated: "2026-09-05",

  metaTitle: "Self-Employment Tax Calculator (2026)",
  metaDescription:
    "Free self-employment tax calculator using 2026 IRS rates. See your SE tax, your federal income tax, and the share of every payment to set aside for taxes.",
  targetKeyword: "self employment tax calculator",
  h1: "Self-Employment Tax Calculator: What to Set Aside in 2026",
  introText:
    "Self-employment tax is 15.3% — 12.4% for Social Security and 2.9% for Medicare — charged on 92.35% of your net business profit, which works out to an effective 14.13% of profit. The calculator above applies the 2026 figures (a $184,500 Social Security wage base and the current federal brackets) and answers the question people actually have: what share of each payment isn't yours to spend.\n\nOn $60,000 of net profit, a single filer owes $8,477.73 in self-employment tax and about $12,037 in total federal tax — roughly 20.1% of profit, or $3,009 per quarter.",

  howItWorks:
    "Self-employment tax replaces the Social Security and Medicare taxes an employer would otherwise split with you. A W-2 employee pays 7.65% and the employer pays the matching 7.65%. When you work for yourself you are both parties, so you pay the full 15.3%.\n\nThe rate is not applied to your full profit. Schedule SE first multiplies net profit by 92.35%, which approximates the employer half an employee would never have been taxed on. That step is why the effective rate on profit is 14.13%, not 15.3% — and why a calculator that skips it overstates your bill by about 8%.\n\nThe two halves behave differently above a threshold. The 12.4% Social Security portion stops once your combined wages and net earnings reach the wage base, which is $184,500 for 2026. The 2.9% Medicare portion never stops, and an extra 0.9% Additional Medicare Tax applies above $200,000 ($250,000 for joint filers). If you also hold a W-2 job, those wages consume the Social Security wage base first, so a moonlighter with a high salary can owe far less Social Security tax on their side income than the raw 15.3% suggests.\n\nOne deduction comes back to you automatically: half of your self-employment tax is an above-the-line deduction against income tax. The calculator applies it, and it excludes the 0.9% Additional Medicare Tax, which is not deductible.\n\nThe set-aside share shown above is deliberately not your household tax bill divided by your profit. If you have a day job, your W-2 withholding already covers the tax on that salary. What you have to fund yourself is the extra tax your self-employment income causes on top of it. That number is often higher than freelancers expect: a side hustle stacks on top of your salary, so it is taxed at your top marginal rate from the first dollar. Someone earning $80,000 at a job plus $20,000 on the side sets aside about 30.5% of the side income, while a full-time freelancer earning $45,000 sets aside about 19.1%.\n\nYou pay this as you go, not in April. The IRS expects quarterly estimated payments via Form 1040-ES, and there is a penalty for underpaying even if you settle up in full at filing. Our [guide to budgeting with irregular income](/guides/how-to-budget-with-irregular-income/) covers the four due dates and the safe-harbor rules that make the penalty go away.",

  faqs: [
    {
      question: "How much is self-employment tax in 2026?",
      answer:
        "Self-employment tax is 15.3% of net earnings: 12.4% for Social Security and 2.9% for Medicare. Because it applies to 92.35% of your net profit rather than all of it, the effective rate on profit is 14.13%. The Social Security portion stops at $184,500 of combined wages and net earnings in 2026; the Medicare portion has no ceiling, and an extra 0.9% applies above $200,000 ($250,000 married filing jointly).",
    },
    {
      question: "How much should I set aside for taxes as a 1099 contractor?",
      answer:
        "For a full-time freelancer with no other income, 20% to 25% of net profit covers federal self-employment and income tax at typical earnings — $60,000 of profit produces about 20.1%. Set aside more if you have a W-2 job, because side income stacks on top of your salary and is taxed at your highest marginal rate: someone earning $80,000 at a job plus $20,000 freelancing needs about 30.5% of the freelance income. Add your state income tax rate on top of any of these figures.",
    },
    {
      question: "Why is self-employment tax calculated on 92.35% of my profit?",
      answer:
        "Because a W-2 employee is never taxed on the employer's half of FICA, and Schedule SE approximates that treatment for the self-employed. Multiplying net profit by 92.35% removes roughly the employer-share equivalent before the 15.3% rate is applied. It is the reason your real rate is 14.13% of profit, and it happens automatically on Schedule SE — you do not have to elect it.",
    },
    {
      question: "Do I pay self-employment tax if I already pay Social Security at my job?",
      answer:
        "You still pay the 2.9% Medicare portion, but your W-2 wages consume the Social Security wage base first. If your wages already reach $184,500 in 2026, no Social Security tax applies to your self-employment income at all — only Medicare. Below that, the 12.4% applies just to the remaining room under the wage base. Enter your W-2 wages in the calculator above and the breakdown shows exactly how much Social Security tax is left to pay.",
    },
    {
      question: "Do I owe self-employment tax if I made less than $2,000?",
      answer:
        "Self-employment tax applies once your net earnings from self-employment reach $400 for the year — that threshold is unrelated to whether anyone sends you a tax form. For 2026 a payer only has to issue a Form 1099-NEC at $2,000 (raised from $600), and payment apps only issue a 1099-K above $20,000 and 200 transactions. The IRS is explicit that you report gig income \"even if the income is... not reported on an information return form.\" No form does not mean no tax.",
    },
    {
      question: "Can I lower my self-employment tax?",
      answer:
        "Only by lowering net profit, since the tax is charged on profit rather than revenue. Every legitimate business deduction — mileage, home office, software, equipment, supplies — cuts self-employment tax and income tax at the same time, which is why a deduction is worth far more to a 1099 earner than to an employee. Retirement contributions to a SEP-IRA or solo 401(k) reduce income tax but not self-employment tax. At higher profit levels, electing S-corporation treatment can reduce the base the 15.3% applies to, at the cost of running payroll.",
    },
  ],

  sources: [IRS_SE_TAX, IRS_SE_TAX_PAGE, IRS_GIG, IRS_ES],

  defaultPreset: {
    netProfit: 60000,
    filingStatus: "single",
    w2Wages: 0,
    otherIncome: 0,
    includeIncomeTax: true,
    applyQbi: true,
  },
};

export const MILEAGE_DEDUCTION_HUB: CalculatorDef = {
  id: "mileage-deduction",
  islandId: "mileage-deduction",
  label: "Mileage Deduction",
  navOrder: 36,
  updated: "2026-09-05",

  metaTitle: "Mileage Deduction Calculator (2026 IRS Rates)",
  metaDescription:
    "Free mileage deduction calculator using both 2026 IRS rates — 72.5¢ through June and 76¢ from July. See your deduction and the income and SE tax it saves.",
  targetKeyword: "mileage deduction calculator",
  h1: "Mileage Deduction Calculator: 2026 IRS Rates",
  introText:
    "The business standard mileage rate for 2026 is 72.5 cents per mile from January 1 through June 30 and 76 cents per mile from July 1 through December 31 — the IRS raised it mid-year. Any calculator that multiplies your annual miles by a single rate gives the wrong answer, so the tool above takes each half of the year separately.\n\nA driver with 5,000 business miles in the first half and 7,000 in the second deducts $8,945, at a blended 74.54 cents per mile. In the 12% bracket that deduction is worth $2,337 — because it cuts self-employment tax as well as income tax.",

  howItWorks:
    "You can deduct business driving two ways, and you pick one per vehicle. The standard mileage rate multiplies business miles by a per-mile figure the IRS sets, and that figure is meant to cover everything: gas, insurance, repairs, tires, registration, and depreciation. The actual expense method adds up what the car really cost you for the year and deducts the business-use share.\n\nFor 2026 the standard rate changed partway through the year. Miles driven January 1 through June 30 are deducted at 72.5 cents; miles driven July 1 through December 31 are deducted at 76 cents. Keeping the two totals separate is not optional bookkeeping — it is how the deduction is computed, and the gap is real money. Twelve thousand miles split evenly across the year deducts $8,910 rather than the $8,700 a flat 72.5-cent calculation would show — $210 left on the table — and a driver whose miles skew to the back half gains more.\n\nThe deduction is worth roughly double what most people assume, and this is the part competing calculators leave out. A business mileage deduction reduces your Schedule C net profit, and net profit is the base for both income tax and self-employment tax. So a dollar of mileage deduction saves your marginal income-tax rate plus the 14.13% effective self-employment rate. For a driver in the 12% bracket that is 26.13%, not 12%. In the 22% bracket it is 36.13%.\n\nWhich method wins depends on the car. Standard mileage usually wins for a high-mileage, low-cost vehicle — the classic delivery or rideshare case, where you put 20,000 miles on a paid-off economy car. Actual expenses usually wins for an expensive vehicle driven fewer miles, where depreciation and insurance dominate.\n\nOne rule catches people permanently: if you want the option to use the standard mileage rate for a car, you have to use it in the first year you put that car into business service. Take actual expenses first and you are locked out of the standard rate for the life of that vehicle. The reverse is not true — start with standard mileage and you may switch to actual expenses later.\n\nNone of it survives an audit without records. The IRS wants a contemporaneous log: date, miles, destination, and business purpose for each trip. A mileage-tracking app that logs automatically is the practical answer, and a reconstruction built in April from memory is what gets disallowed. Commuting between home and a regular workplace is never deductible, no matter which method you use.",

  faqs: [
    {
      question: "What is the IRS mileage rate for 2026?",
      answer:
        "The business standard mileage rate for 2026 is 72.5 cents per mile for miles driven January 1 through June 30, and 76 cents per mile for miles driven July 1 through December 31. The IRS raised the rate mid-year. Medical and moving mileage is 20.5 cents in the first half and 23.5 cents in the second; the charitable rate stays at 14 cents, because it is fixed by statute rather than adjusted for inflation.",
    },
    {
      question: "How much is the mileage deduction actually worth?",
      answer:
        "For a self-employed filer, roughly your marginal income-tax rate plus 14.13%. The deduction lowers Schedule C net profit, which is the base for both income tax and self-employment tax, so it saves both. A $8,945 deduction saves $2,337 for someone in the 12% bracket — $1,073 of income tax plus $1,264 of self-employment tax. Calculators that quote only the income-tax saving understate the benefit by more than half.",
    },
    {
      question: "Should I use the standard mileage rate or actual expenses?",
      answer:
        "Standard mileage usually wins for high-mileage driving in an inexpensive, paid-off car, which describes most delivery and rideshare work. Actual expenses usually wins for an expensive or newer vehicle driven relatively few business miles, where depreciation, insurance, and financing costs are large relative to mileage. Enter both in the calculator above to see the gap for your own numbers — and note that you can only compare honestly if you tracked both miles and receipts.",
    },
    {
      question: "Can I switch between the mileage rate and actual expenses?",
      answer:
        "You can switch from the standard mileage rate to actual expenses in a later year, but not the other way around. To use the standard mileage rate for a vehicle at all, you must choose it in the first year that vehicle is used for business. Taking actual expenses in year one permanently forfeits the standard rate for that car. If you lease rather than own, whichever method you choose in the first year applies for the entire lease.",
    },
    {
      question: "Does driving to my first delivery count as business miles?",
      answer:
        "For a gig driver with no fixed workplace, miles driven while the app is on and you are available for or completing work are generally business miles, including driving between deliveries. Commuting from home to a regular, fixed place of work is never deductible. The practical dividing line most gig drivers use is the app: log the trip when you go online and stop when you go offline, and keep the record contemporaneously rather than reconstructing it later.",
    },
    {
      question: "What records do I need for a mileage deduction?",
      answer:
        "A contemporaneous log showing the date, the number of business miles, the destination, and the business purpose of each trip, plus your total annual mileage for the vehicle. \"Contemporaneous\" means recorded at or near the time of the trip — an estimate assembled at filing time is what gets disallowed on audit. Automatic mileage-tracking apps satisfy this, and keeping the odometer reading at January 1 and December 31 supports the business-use percentage.",
    },
  ],

  sources: [IRS_MILEAGE, IRS_PUB463, IRS_GIG],

  defaultPreset: {
    milesFirstHalf: 5000,
    milesSecondHalf: 7000,
    actualExpensesTotal: 0,
    businessUsePercent: 100,
    marginalRate: 0.12,
    subjectToSeTax: true,
    firstYearForVehicle: false,
  },
};

export const FREELANCE_RATE_HUB: CalculatorDef = {
  id: "freelance-rate",
  islandId: "freelance-rate",
  label: "Freelance Rate",
  navOrder: 37,
  updated: "2026-09-05",

  metaTitle: "Freelance Rate Calculator: What to Charge",
  metaDescription:
    "Free freelance rate calculator. Enter the take-home pay you want and see the hourly rate, day rate, and revenue you need after self-employment tax and overhead.",
  targetKeyword: "freelance rate calculator",
  h1: "Freelance Rate Calculator: The Hourly Rate That Pays You",
  introText:
    "A freelance rate has to cover more than a salary does: both halves of Social Security and Medicare, every hour you work but cannot bill, your own unpaid time off, and your overhead. The calculator above works backwards from the take-home pay you want to the hourly rate that produces it, using real 2026 tax figures instead of a rule-of-thumb markup.\n\nTo take home $70,000 while billing 25 hours a week for 46 weeks with $6,000 of overhead, you need $95,016 of revenue — an hourly rate of $82.62, or $661 a day.",

  howItWorks:
    "Most freelancers price their work by taking a salary they would accept and dividing by 2,080 hours. That produces a rate that quietly loses money, for two separate reasons.\n\nThe first is utilization. Nobody bills every hour they work. Proposals, invoicing, bookkeeping, client calls that never convert, and unpaid revisions are all real work that no client pays for. A solo freelancer typically bills between 50% and 70% of their working hours. Billing 25 of a 40-hour week is 62.5% utilization, which means your billable rate has to carry the other 37.5% of your time.\n\nThe second is that a 1099 earner is their own employer. You pay the full 15.3% self-employment tax rather than the 7.65% an employee sees, you buy your own time off, and you fund your own equipment, software, and insurance. Those are not overheads you can decline; they are the cost of the arrangement.\n\nSo the calculator does not apply a markup. It solves for the gross revenue at which take-home — after your overhead, your actual self-employment tax, and your actual federal income tax — equals your target, then divides that revenue by the hours you can genuinely bill.\n\nThe result reproduces the folk wisdom about doubling your rate, but from arithmetic rather than superstition. At the example above, an employee taking home the same $70,000 earns about $86,951, which is $41.80 an hour across a standard 2,080-hour year. The freelance rate that matches it is $82.62 — 2.0 times the employee's hourly figure. The multiple is not greed. It is unbillable time, both FICA halves, unpaid leave, and overhead, priced honestly.\n\nTwo things the calculator deliberately leaves out, both of which push your real number higher: state and local income tax, and health insurance. An employee's premium is usually subsidised by their employer and paid with pre-tax dollars; a freelancer buys the whole thing. Add both to your overhead before you quote.\n\nOne last framing note. This gives you a floor, not a price. The rate that covers your costs is the rate below which work is not worth taking. What clients will actually pay depends on the value of the outcome, and pricing by project rather than by hour is often the better move once you can estimate your own delivery time reliably.",

  faqs: [
    {
      question: "How do I calculate my freelance hourly rate?",
      answer:
        "Work backwards from take-home pay, not forwards from a salary. Start with the annual take-home you want, add your business overhead, add the federal self-employment and income tax on that profit, and divide the total by the hours you can genuinely bill — which is your working hours times your utilization rate, not 2,080. The calculator above does this with 2026 tax figures: $70,000 of take-home at 25 billable hours a week for 46 weeks needs $95,016 of revenue and an $82.62 hourly rate.",
    },
    {
      question: "Should a freelancer charge double what an employee earns hourly?",
      answer:
        "Roughly, yes, and it is arithmetic rather than a rule of thumb. In the example above, an employee taking home the same $70,000 earns about $41.80 an hour across a full 2,080-hour year, while the freelance rate needed to match it is $82.62 — very close to 2×. The doubling comes from three places: hours you work but cannot bill, the employer half of Social Security and Medicare, and unpaid time off plus overhead. Your own multiple depends mostly on your utilization rate.",
    },
    {
      question: "What is a realistic billable utilization rate?",
      answer:
        "Between 50% and 70% for most solo freelancers. Everything that is not client work — pitching, invoicing, admin, bookkeeping, marketing, unpaid revisions — comes out of the same week. Assuming higher than 70% is the most common way a rate calculation goes wrong, because it silently prices your admin time at zero. If you are new, model 50% until you have a few months of tracked hours to check it against.",
    },
    {
      question: "How many weeks a year should I plan to work?",
      answer:
        "Between 45 and 48 for most freelancers. A salaried employee gets paid for holidays, vacation, and sick days; you do not. Subtract the weeks you actually intend to take off, and subtract time for illness you cannot predict. Planning on 52 weeks makes every rate you quote about 12% too low, and it turns any time off into an unfunded pay cut.",
    },
    {
      question: "Should I charge hourly or by project?",
      answer:
        "Hourly is the safer way to start, because it prices scope changes automatically and needs no estimating skill. Project pricing pays better once you can predict your own delivery time, since it decouples your income from your hours and rewards getting faster. Either way the hourly figure matters: it is the floor you check any project quote against. Divide the fee by your realistic hours and, if the result is under your rate, the project is priced below cost.",
    },
    {
      question: "Does this include state taxes and health insurance?",
      answer:
        "No — and both push the rate you need higher. The calculator models federal self-employment and income tax only. State and local income tax adds anywhere from nothing to over 10% depending on where you live. Health insurance is the larger gap for most people: an employee's premium is typically subsidised by their employer, while a freelancer pays the entire cost. Add your annual premium to the overhead field to see the real number.",
    },
  ],

  sources: [IRS_SE_TAX, IRS_SE_TAX_PAGE, IRS_ES],

  defaultPreset: {
    targetTakeHome: 70000,
    billableHoursPerWeek: 25,
    weeksWorkedPerYear: 46,
    annualOverhead: 6000,
    filingStatus: "single",
    otherIncome: 0,
    hoursPerDay: 8,
    totalHoursPerWeek: 40,
  },
};

// -------------------------------------------------------------------------------------------------
// Business-structure pillar (2026-09-05). Created to host the LLC / S-corp entity cluster, which
// does not belong under self-employment tax: it is a structure decision, not a tax calculation.
// Head term "s corp tax calculator" (1,300/mo, KD 12); the spokes under it run KD 3–7.
// -------------------------------------------------------------------------------------------------

const IRS_SCORP_COMP: { label: string; url: string } = {
  label: "IRS — S corporation compensation and medical insurance issues",
  url: "https://www.irs.gov/businesses/small-businesses-self-employed/s-corporation-compensation-and-medical-insurance-issues",
};
const IRS_2553: { label: string; url: string } = {
  label: "IRS — Instructions for Form 2553",
  url: "https://www.irs.gov/instructions/i2553",
};
const IRS_SCORP: { label: string; url: string } = {
  label: "IRS — S corporations",
  url: "https://www.irs.gov/businesses/small-businesses-self-employed/s-corporations",
};

export const S_CORP_TAX_HUB: CalculatorDef = {
  id: "s-corp-tax",
  islandId: "s-corp-tax",
  label: "S-Corp Tax",
  navOrder: 38,
  updated: "2026-09-05",

  metaTitle: "S Corp Tax Calculator: Is an Election Worth It?",
  metaDescription:
    "Free S corp tax calculator. See the net saving after payroll costs and the QBI deduction you give up — the two offsets most S-corp calculators leave out.",
  targetKeyword: "s corp tax calculator",
  h1: "S Corp Tax Calculator: What an Election Actually Saves",
  introText:
    "An S corporation election lets you split business profit into a salary, which pays payroll tax, and a distribution, which does not. The saving is real, but it is smaller than the usual pitch suggests, because two costs come off it: running payroll, and the qualified business income deduction you give up on every dollar moved into salary.\n\nOn $120,000 of profit with a $60,000 salary, the election avoids $7,775 of payroll tax — but forfeits an $8,242 QBI deduction and costs $1,200 in payroll. The honest net saving is $4,171.",

  howItWorks:
    "By default, a sole proprietor or single-member LLC pays self-employment tax on all of their net profit: 15.3% on 92.35% of it. An S corporation election changes the shape of the income rather than the amount. You become an employee of your own business, take part of the profit as a W-2 salary, and take the rest as a distribution. Payroll tax applies to the salary and not to the distribution.\n\nThat is where most explanations stop, and it is why the saving is routinely overstated. Three things push the real number down.\n\nThe first is the QBI deduction. Wages are not qualified business income, so every dollar you move from pass-through profit into salary is a dollar removed from the §199A base. You give up a 20% deduction on that dollar to avoid 15.3% of payroll tax on it. At $120,000 of profit the forfeited QBI deduction is larger than the payroll tax avoided — the election still wins overall, but by far less than the gross figure implies.\n\nThe second is that payroll is not free. An S-corp has to run genuine payroll, withhold and remit, file employment tax returns, and file a separate Form 1120-S for the business. A payroll service plus the extra return commonly runs several hundred to a couple of thousand dollars a year, and it recurs annually.\n\nThe third is that the employer half of FICA is a business expense, so it comes out of the profit passed through on your K-1. The distribution is smaller than profit minus salary.\n\nPut together, the threshold where an election starts to pay is higher than the internet suggests and depends heavily on the salary you can defend. Holding salary at half of profit, the election clears $1,000 a year of net saving at around $35,000 of profit. Hold salary at 60% of profit — a more conservative and more defensible position for a one-person service business — and the threshold rises to about $52,000. At $90,000 of profit with a $70,000 salary, the election actually costs $1,530 a year.\n\nThat salary is the whole ballgame, and it is not yours to set freely. The IRS requires reasonable compensation for services before non-wage distributions are made, and it is explicit that there is no safe harbor and no formula. The 60/40 split and the 2% rule that circulate online are not IRS positions. What the IRS actually examines is where the corporation's gross receipts come from: if they come from your own services, that value belongs in wages.\n\nIf the numbers work, the election is made on Form 2553, and the timing is unforgiving: no more than two months and 15 days after the beginning of the tax year it takes effect, or any time in the preceding year. Miss it and late-election relief under Rev. Proc. 2013-30 is available with reasonable cause, but it is a filing you would rather not need.",

  faqs: [
    {
      question: "How much does an S corp election actually save?",
      answer:
        "Less than the gross payroll tax figure suggests. On $120,000 of profit with a $60,000 salary, the election avoids $7,775 of payroll tax but forfeits an $8,242 QBI deduction and costs $1,200 to run payroll — a net saving of $4,171. The saving grows with profit: about $2,283 at $60,000 and $5,131 at $150,000, holding salary at half of profit.",
    },
    {
      question: "At what income is an S corp worth it?",
      answer:
        "It depends on the salary you can defend, not on income alone. Holding salary at 50% of profit, the election clears $1,000 a year of net saving at roughly $35,000 of profit. At a more conservative 60% salary the threshold rises to about $52,000. Below those points the payroll cost and the forfeited QBI deduction outweigh the payroll tax avoided — and state franchise taxes, which this calculator excludes, push the real threshold higher still.",
    },
    {
      question: "What is a reasonable salary for an S corp owner?",
      answer:
        "There is no safe harbor and no percentage formula — the IRS says so directly. It weighs your training and experience, duties and responsibilities, time and effort, what comparable businesses pay for similar services, and dividend history. The controlling question is where the corporation's gross receipts come from: receipts generated by your own services should be paid as wages. The 60/40 and 2% \"rules\" found online are folklore, not IRS guidance.",
    },
    {
      question: "Does an S corp election reduce my QBI deduction?",
      answer:
        "Yes, and it is the offset most calculators omit. The qualified business income deduction applies to pass-through business profit, and W-2 wages are not qualified business income. Every dollar you take as salary instead of distribution removes a dollar from the §199A base, so you trade a 20% deduction for avoiding 15.3% of payroll tax on that dollar. It is why the net saving is much smaller than the gross, and why an election can cost money at modest profit.",
    },
    {
      question: "When do I have to file Form 2553?",
      answer:
        "No more than two months and 15 days after the beginning of the tax year the election is to take effect, or at any time during the preceding tax year. If you miss it, late-election relief under Rev. Proc. 2013-30 is available where there was reasonable cause, the corporation intended S status from the effective date, and Form 2553 is filed within three years and 75 days of that date — with \"FILED PURSUANT TO REV. PROC. 2013-30\" written at the top.",
    },
    {
      question: "Do I need an LLC before electing S corp status?",
      answer:
        "You need an eligible entity — commonly an LLC or a corporation. S-corp is a tax election, not an entity type, so an LLC can elect to be taxed as an S corporation while remaining an LLC legally. That is the usual route for a one-person business, because it keeps the simpler LLC formalities while changing how profit is taxed. See our [LLC vs S corp comparison](/compare/llc-vs-s-corp/) for what changes and what does not.",
    },
  ],

  sources: [IRS_SCORP, IRS_SCORP_COMP, IRS_2553, IRS_SE_TAX],

  defaultPreset: {
    netProfit: 120000,
    reasonableSalary: 60000,
    filingStatus: "single",
    otherIncome: 0,
    payrollCost: 1200,
    applyQbi: true,
  },
};
