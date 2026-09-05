import type { SpokeEntry } from "./types";
import { IRS_GIG, IRS_SE_TAX, IRS_MILEAGE, IRS_SCHED_C } from "./spokes-self-employed";

// Mileage-deduction spokes (2026-09-05). Powered by src/lib/mileage-deduction.ts.
//
// The 2026 mid-year rate change is the reason this vertical exists as its own category rather than
// a section on the self-employment tax hub: the IRS set the business rate at 72.5¢ from January 1
// and raised it to 76¢ from July 1, so every annual mileage figure has to be split before it can be
// deducted. Most competing calculators still multiply by a single rate.

const IRS_PUB463 = {
  label: "IRS — Publication 463, Travel, Gift, and Car Expenses",
  url: "https://www.irs.gov/publications/p463",
};

export const MILEAGE_SPOKES: SpokeEntry[] = [
  {
    calculator: "mileage-deduction",
    slug: "irs-mileage-rate-2026",
    updated: "2026-09-05",
    title: "IRS Mileage Rate 2026: 72.5¢ and 76¢ Explained",
    metaDescription:
      "The 2026 IRS mileage rate is 72.5 cents through June 30 and 76 cents from July 1. See both rates, why they changed mid-year, and how to split your miles.",
    targetKeyword: "IRS mileage rate 2026",
    estimatedVolume: 18100,
    estimatedKD: 36,
    h1: "IRS Mileage Rate 2026: Two Rates, One Year",
    introText:
      "The 2026 business standard mileage rate is 72.5 cents per mile for January 1 through June 30, and 76 cents per mile for July 1 through December 31. The IRS raised it mid-year, so 2026 has two business rates rather than one.\n\nThat split is not a rounding detail. Twelve thousand miles spread evenly across the year deducts $8,910 rather than the $8,700 a single-rate calculation produces — $210 that a flat annual multiplication silently loses.",
    howItWorks:
      "The standard mileage rate is the IRS's per-mile stand-in for what driving actually costs. It is built to cover fuel, insurance, maintenance, tyres, registration, and depreciation in one figure, so you can deduct business driving without tracking every receipt.\n\nFor 2026 there are three rates, and each has a first-half and second-half figure except the charitable rate:\n\nBusiness driving is 72.5 cents a mile from January 1 through June 30, and 76 cents from July 1 through December 31. Medical and qualified military moving mileage is 20.5 cents in the first half and 23.5 cents in the second. The charitable rate stays at 14 cents all year, because it is fixed in statute rather than adjusted for costs — which is why it has not moved in decades while the business rate has climbed.\n\nMid-year changes are unusual but not unprecedented; the IRS makes them when fuel costs move sharply enough that a single annual figure would misstate the real cost of driving. The practical consequence is that your mileage log needs dates, not just a total. A year-end odometer difference cannot be split across the two periods, and \"about half in each\" is not a record.\n\nThe way to apply it is to total your business miles for each period separately and multiply each by its own rate. Eight thousand miles before July and ten thousand after is 8,000 × 72.5¢ plus 10,000 × 76¢, or $13,400 — a blended 74.4 cents. The calculator above does exactly this, and it also shows the tax the deduction saves, which for a self-employed filer is considerably more than the income-tax figure alone.\n\nThat last point is the one most often missed. A business mileage deduction reduces Schedule C net profit, and net profit is the base for both income tax and self-employment tax. So the deduction saves your marginal income-tax rate plus the 14.13% effective self-employment rate — 26.13% for someone in the 12% bracket, not 12%. Employees, by contrast, generally cannot deduct unreimbursed business mileage at all under current law, which is why this matters far more to a contractor than to a salaried worker.\n\nWhichever rate applies, the substantiation requirement does not change: a contemporaneous log of dates, miles, destinations, and business purpose, and commuting between home and a regular workplace never counts.",
    commonMistakes: [
      "Multiplying total annual miles by one rate. 2026 has two business rates, and a single multiplication is wrong for anyone who drove in both halves of the year.",
      "Keeping only a year-end odometer total. Without dated entries there is no way to split miles between the 72.5¢ and 76¢ periods, and no way to substantiate the deduction on audit.",
      "Using the business rate for charitable driving. Volunteer mileage is 14 cents per mile, fixed by statute — roughly a fifth of the business rate.",
      "Deducting gas and repairs on top of the standard rate. The rate already includes fuel, insurance, maintenance, and depreciation; claiming them separately is double-counting.",
      "Assuming employees can deduct mileage. Unreimbursed employee business expenses are generally not deductible under current law — this deduction is for the self-employed.",
    ],
    workedExample:
      "A contractor drives 12,000 business miles evenly across 2026 — 6,000 in each half. The first 6,000 deducts at 72.5 cents for $4,350; the second 6,000 deducts at 76 cents for $4,560. The total is $8,910, a blended 74.25 cents per mile. Multiplying all 12,000 miles by the January rate would have produced $8,700, understating the deduction by $210. In the 12% bracket, that $8,910 deduction saves $1,069 of income tax and $1,259 of self-employment tax — $2,328 in total, a combined 26.13% return on a figure most drivers treat as a bookkeeping chore.",
    faqs: [
      {
        question: "What is the IRS mileage rate for 2026?",
        answer:
          "72.5 cents per business mile for miles driven January 1 through June 30, 2026, and 76 cents per business mile from July 1 through December 31. Medical and qualified military moving mileage is 20.5 cents in the first half and 23.5 cents in the second. The charitable rate is 14 cents throughout, because Congress sets it by statute rather than adjusting it for costs.",
      },
      {
        question: "Why did the IRS change the mileage rate mid-year?",
        answer:
          "Because vehicle operating costs, fuel in particular, moved enough during the year that the January figure no longer reflected what driving actually cost. The IRS occasionally makes mid-year adjustments for exactly this reason. The practical effect for filers is that a single annual mileage total is no longer enough — you need dated records so miles can be assigned to the right period.",
      },
      {
        question: "How do I split my miles between the two 2026 rates?",
        answer:
          "Total the business miles you drove January 1 through June 30 and multiply by 72.5 cents, then total the miles from July 1 through December 31 and multiply by 76 cents, and add the two. This requires a dated log rather than a year-end odometer reading. If you use a mileage-tracking app, export the year and filter by date; the split is straightforward from trip-level records and impossible without them.",
      },
      {
        question: "How much is the 2026 mileage deduction worth in tax?",
        answer:
          "For a self-employed filer, roughly your marginal income-tax rate plus 14.13%, because the deduction reduces the profit both income tax and self-employment tax are calculated on. Someone in the 12% bracket saves 26.13% of the deduction; someone in the 22% bracket saves 36.13%. An $8,910 deduction is therefore worth about $2,328 in the 12% bracket — roughly double what an income-tax-only estimate suggests.",
      },
      {
        question: "Can employees deduct mileage in 2026?",
        answer:
          "Generally no. Unreimbursed employee business expenses, including mileage, are not deductible for most employees under current law. The standard mileage rate matters mainly to self-employed filers reporting on Schedule C, and to employers reimbursing employees — a reimbursement at or below the standard rate under an accountable plan is generally not taxable to the employee.",
      },
    ],
    sources: [IRS_MILEAGE, IRS_PUB463, IRS_SE_TAX],
    toolHeading: "2026 mileage deduction",
    toolSubheading: "Enter miles for each half of the year",
    preset: {
      milesFirstHalf: 6000,
      milesSecondHalf: 6000,
      marginalRate: 0.12,
      subjectToSeTax: true,
    },
    relatedSlugs: ["standard-mileage-vs-actual-expenses", "doordash-mileage-deduction"],
  },

  {
    calculator: "mileage-deduction",
    slug: "standard-mileage-vs-actual-expenses",
    updated: "2026-09-05",
    title: "Standard Mileage vs Actual Expenses: Which Wins?",
    metaDescription:
      "Standard mileage or actual expenses? Compare both methods with 2026 IRS rates, and see the first-year rule that can lock you out of the mileage rate for good.",
    targetKeyword: "standard mileage vs actual expenses",
    estimatedVolume: 140,
    estimatedKD: 17,
    h1: "Standard Mileage vs Actual Expenses: How to Choose",
    introText:
      "The standard mileage rate usually wins for high-mileage driving in an inexpensive car; actual expenses usually wins for an expensive vehicle driven relatively few business miles. The gap between them is often thousands of dollars, and the choice is not entirely reversible.\n\nA driver with 12,000 business miles deducts $8,945 under the standard rate. To beat it with actual expenses at 70% business use, that car would have to cost more than $12,779 a year to run.",
    howItWorks:
      "Both methods deduct the same thing — the cost of driving for business — by different routes.\n\nThe standard mileage rate multiplies business miles by the IRS figure, which for 2026 is 72.5 cents through June 30 and 76 cents from July 1. That rate is designed to cover fuel, insurance, repairs, tyres, registration, and depreciation in one number, so you deduct it and nothing else.\n\nThe actual expense method adds up what the vehicle genuinely cost for the year — fuel, insurance, repairs, maintenance, registration, and depreciation or lease payments — and deducts the business-use share. If 70% of your driving was for business, you deduct 70% of the total.\n\nThe arithmetic that decides it is simple once you frame it correctly. Divide your standard mileage deduction by your business-use percentage, and that is the annual running cost your vehicle must exceed for actual expenses to win. At 12,000 business miles the standard deduction is $8,945; at 70% business use, actual expenses only beat it if the car costs more than $12,779 a year all-in. An economy car with the loan paid off rarely comes close. A three-year-old luxury vehicle losing $6,000 a year in depreciation, with high insurance, often clears it comfortably.\n\nThat is why the answer splits so cleanly by work type. Delivery and rideshare drivers, who put 15,000 to 30,000 miles a year on a cheap, reliable car, are almost always better off with the standard rate. A consultant driving 4,000 business miles a year in a new SUV frequently is not.\n\nThe rule that catches people is about order, not amount. To use the standard mileage rate for a vehicle at all, you must choose it in the first year that vehicle is used for business. Take actual expenses in year one and you are locked out of the standard rate for that car permanently. The reverse is allowed: start with the standard rate and you may switch to actual expenses in a later year. Given that asymmetry, starting with the standard rate keeps both options open, which is usually the better default in year one even when actual expenses would win by a little.\n\nA few more constraints worth knowing. If you lease, whichever method you choose in the first year applies for the whole lease term. If you claimed certain accelerated depreciation on the vehicle, the standard rate is unavailable. And switching to actual expenses after years of standard mileage requires adjusting your depreciation basis, because the standard rate included a depreciation component all along.\n\nWhichever method you use, the record-keeping requirement is the same: a contemporaneous log of business miles with dates, destinations, and purpose. Actual expenses additionally requires every receipt. That practical difference is why many drivers who would win slightly on actual expenses still choose the standard rate.",
    commonMistakes: [
      "Taking actual expenses in the first year without realising it is permanent for that vehicle. You can move from standard mileage to actual expenses later, but never the other way round.",
      "Comparing the two methods without dividing by business-use percentage. Actual expenses are deducted only at the business share, so the raw total is not comparable to the standard deduction.",
      "Forgetting depreciation in the actual-expense total. For a newer vehicle it is usually the largest single component, and leaving it out makes actual expenses look far weaker than it is.",
      "Claiming both. The standard rate already includes fuel, insurance, maintenance, and depreciation — you cannot add them on top.",
      "Choosing actual expenses without keeping receipts. The method requires substantiating every cost, not estimating them at filing time.",
    ],
    workedExample:
      "A contractor drives 12,000 business miles in 2026 — 5,000 before July and 7,000 after — for a standard deduction of $8,945. Their car cost $6,800 to run for the year in fuel, insurance, and repairs, and 70% of its use was business, so the actual-expense deduction is $4,760. Standard mileage wins by $4,185. For actual expenses to have won, the car would have needed to cost more than $12,779 for the year at that same 70% business use. If they had claimed actual expenses in the car's first business year, they would have locked in the weaker method for as long as they own it.",
    faqs: [
      {
        question: "Is standard mileage or actual expenses better?",
        answer:
          "Standard mileage usually wins for high-mileage driving in an inexpensive or paid-off car, which covers most delivery and rideshare work. Actual expenses usually wins for an expensive or newer vehicle driven relatively few business miles, where depreciation and insurance dominate. The test: divide your standard mileage deduction by your business-use percentage — that is the annual running cost your vehicle must exceed for actual expenses to win.",
      },
      {
        question: "Can I switch from actual expenses to the standard mileage rate?",
        answer:
          "No, not for the same vehicle. You must use the standard mileage rate in the first year a vehicle is used for business if you want it available at all. Claiming actual expenses in that first year permanently forfeits the standard rate for that car. Switching the other way — standard mileage first, actual expenses later — is allowed, which is why starting with the standard rate keeps your options open.",
      },
      {
        question: "What counts as an actual vehicle expense?",
        answer:
          "Fuel, insurance, repairs and maintenance, tyres, registration and licence fees, and either depreciation on a vehicle you own or the payments on one you lease. Interest on a car loan is deductible for the business-use share as well. You deduct the business-use percentage of the total, so a car used 70% for business yields 70% of these costs — and every one of them needs a receipt.",
      },
      {
        question: "Which method should a delivery or rideshare driver use?",
        answer:
          "Almost always the standard mileage rate. Gig driving generates very high mileage in vehicles chosen for low running costs, and at 20,000-plus business miles the standard deduction is difficult for actual costs to beat. The exception worth checking is a newer vehicle where first-year depreciation is large — run both in the calculator above before deciding, and remember the first-year choice is one-way.",
      },
      {
        question: "Do I need receipts for the standard mileage rate?",
        answer:
          "Not for vehicle costs, but you do need a mileage log: dates, business miles, destinations, and purpose, recorded contemporaneously. That lighter record-keeping is a real advantage of the method. Actual expenses requires the mileage log as well — to establish your business-use percentage — plus a receipt for every cost you deduct.",
      },
    ],
    sources: [IRS_MILEAGE, IRS_PUB463, IRS_SCHED_C],
    toolHeading: "Compare both methods",
    toolSubheading: "Add your actual vehicle costs to see which wins",
    preset: {
      milesFirstHalf: 5000,
      milesSecondHalf: 7000,
      actualExpensesTotal: 6800,
      businessUsePercent: 70,
      marginalRate: 0.12,
      subjectToSeTax: true,
      firstYearForVehicle: false,
    },
    relatedSlugs: ["irs-mileage-rate-2026", "doordash-mileage-deduction"],
  },

  {
    calculator: "mileage-deduction",
    slug: "doordash-mileage-deduction",
    updated: "2026-09-05",
    title: "DoorDash Mileage Deduction: What Dashers Can Claim",
    metaDescription:
      "The DoorDash mileage deduction at 2026 rates. Which miles count, why the in-app estimate is low, and what the deduction is really worth in tax.",
    targetKeyword: "DoorDash mileage deduction",
    estimatedVolume: 90,
    estimatedKD: 13,
    h1: "DoorDash Mileage Deduction: Claiming Every Mile",
    introText:
      "Mileage is the deduction that decides a Dasher's tax bill, and the figure DoorDash shows in the app is usually not the figure you should claim. Miles driven while online and available count, not just the paid delivery distance.\n\nEighteen thousand business miles across 2026 — 8,000 before July, 10,000 after — deducts $13,400. For a Dasher in the 12% bracket that is worth $3,501 in tax, because it cuts self-employment tax as well as income tax.",
    howItWorks:
      "Start with which miles qualify, because this is where most of the money is won or lost. Business miles for a Dasher run from the moment you go online: driving to the restaurant, waiting in the area while available for offers, driving to the customer, and repositioning between deliveries. The one leg that does not count is commuting — driving from home to the zone where you start dashing, and home again at the end.\n\nDoorDash's in-app mileage figure typically reflects a narrower measure than this, closer to the delivery legs themselves. It is a reasonable floor and a useful cross-check, but it is generally not the maximum you are entitled to. A tracking app that records from the moment you go online captures the waiting and repositioning miles the platform's estimate tends to omit, and it produces the dated, trip-level record the IRS actually wants.\n\nThen apply the 2026 rates, which changed mid-year. Miles driven January 1 through June 30 deduct at 72.5 cents; miles from July 1 deduct at 76 cents. This means your log needs dates, not just a total — an annual odometer difference cannot be allocated between the two periods. Eighteen thousand miles split 8,000 and 10,000 deducts $13,400, a blended 74.4 cents.\n\nWhat that deduction is worth is the part usually understated. Because it reduces Schedule C net profit, it lowers self-employment tax and income tax together. For a Dasher in the 12% bracket the combined saving is 26.13% of the deduction — $3,501 on $13,400, against the $1,608 an income-tax-only calculation would suggest.\n\nFor many part-time Dashers the deduction does more than reduce the bill; it removes the income tax entirely. Earnings of $22,000 less a $13,400 mileage deduction and $600 of other expenses leaves $8,000 of profit, which is well under the $16,100 standard deduction. The federal bill is then self-employment tax alone.\n\nTwo constraints to respect. If you take the standard mileage rate you cannot also deduct fuel, insurance, or repairs — the rate already includes them. And if you want the standard rate available for a vehicle in future years, you have to use it in the first year that car goes into business service; claiming actual expenses first locks you out permanently. See [standard mileage vs actual expenses](/mileage-deduction/standard-mileage-vs-actual-expenses/) before making that call, and [DoorDash taxes](/self-employment-tax/doordash-taxes/) for the full picture of what a Dasher owes.",
    commonMistakes: [
      "Claiming only the mileage DoorDash reports in the app. It generally reflects delivery legs rather than all the miles driven while online and available.",
      "Deducting the drive from home to your starting zone. That is commuting and is never deductible, however far it is.",
      "Keeping a total instead of a dated log. 2026 has two rates, so miles must be assigned to the right half of the year — and the IRS requires a contemporaneous record regardless.",
      "Adding gas and maintenance on top of the mileage rate. The standard rate already covers fuel, insurance, repairs, and depreciation.",
      "Treating the deduction as worth only your income-tax bracket. It also reduces self-employment tax, which for most Dashers is the larger of the two savings.",
    ],
    workedExample:
      "A Dasher logs 18,000 business miles in 2026 using a tracking app that runs from the moment they go online: 8,000 miles through June and 10,000 from July. The deduction is 8,000 × 72.5¢ plus 10,000 × 76¢, or $13,400. Their income-tax bracket is 12%, so the deduction saves $1,608 of income tax — and, because it also reduces the profit self-employment tax is charged on, a further $1,893 of self-employment tax. The real value is $3,501. Had they claimed only the narrower in-app figure of, say, 13,000 miles, the deduction would have been $9,670 and the tax saving about $2,527 — nearly a thousand dollars of avoidable tax.",
    faqs: [
      {
        question: "How many miles can I deduct for DoorDash?",
        answer:
          "All miles driven for the business: to the restaurant, while online and available between offers, to the customer, and repositioning during a dash. Commuting from home to your starting zone and home at the end does not count. At 2026 rates that is 72.5 cents per mile through June 30 and 76 cents from July 1, so 18,000 business miles is a $13,400 deduction.",
      },
      {
        question: "Is DoorDash's mileage estimate enough for taxes?",
        answer:
          "It is a floor rather than the full figure. DoorDash's in-app number generally reflects delivery legs and tends to omit the waiting and repositioning miles you are also entitled to claim. It is useful as a cross-check, but a tracking app that logs from the moment you go online usually produces a larger deduction and a better record — dated, trip-level, and contemporaneous, which is what the IRS asks for.",
      },
      {
        question: "How much is the DoorDash mileage deduction worth?",
        answer:
          "Roughly 26% of the deduction for a Dasher in the 12% bracket, because it reduces self-employment tax as well as income tax. A $13,400 deduction saves about $1,608 of income tax plus $1,893 of self-employment tax — $3,501 in total. For many part-time Dashers it also pushes profit below the standard deduction, which eliminates federal income tax on the dashing income altogether.",
      },
      {
        question: "Do I need a mileage app for DoorDash taxes?",
        answer:
          "You need a contemporaneous log with dates, miles, destination, and business purpose, and an app is the practical way to produce one. A reconstruction assembled at filing time from memory is the record most likely to be disallowed on audit. In 2026 the log also has to be dated well enough to split miles between the 72.5-cent and 76-cent periods, which a year-end odometer reading cannot do.",
      },
      {
        question: "Can I deduct gas as well as mileage for DoorDash?",
        answer:
          "No. The standard mileage rate is built to cover fuel, insurance, maintenance, tyres, registration, and depreciation in one figure, so deducting gas separately is double-counting. You choose one method: the standard rate, or actual expenses where you deduct the business-use share of every real cost including gas. For most Dashers, driving high mileage in an economical car, the standard rate wins comfortably.",
      },
    ],
    sources: [IRS_MILEAGE, IRS_PUB463, IRS_GIG, IRS_SE_TAX],
    toolHeading: "DoorDash mileage deduction",
    toolSubheading: "Split your dashing miles across the two 2026 rates",
    preset: {
      milesFirstHalf: 8000,
      milesSecondHalf: 10000,
      marginalRate: 0.12,
      subjectToSeTax: true,
    },
    relatedSlugs: ["irs-mileage-rate-2026", "standard-mileage-vs-actual-expenses"],
  },
];
