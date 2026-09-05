import type { SpokeEntry } from "./types";
import {
  UNIVERSAL_MISTAKES,
  IRS_GIG,
  IRS_SE_TAX,
  IRS_1099K,
  IRS_1099NEC,
  IRS_MILEAGE,
  IRS_ES,
  IRS_SCHED_C,
} from "./spokes-self-employed";

// Gig-DRIVER platform spokes (2026-09-05). Delivery and rideshare, where mileage is the deduction
// that decides the tax bill — usually the difference between a four-figure bill and a three-figure
// one. All share the "self-employment-tax" island with a platform-specific preset.
//
// The finding that shapes every page here, and that the "set aside 30%" advice gets badly wrong:
// once the 2026 standard mileage rates are applied, a typical part-time driver's net profit lands
// below the $16,100 standard deduction, so their federal INCOME tax is zero and the entire bill is
// self-employment tax at 14.1% of profit. That stops being true the moment there is a W-2 job in
// the household, which is why each page says so explicitly rather than quoting one flat number.

const UBER_GROSS_TRAP =
  "Uber's own driver tax guidance is explicit that the 1099-K reports gross on-trip earnings — \"the total amount paid by riders and Uber Eats users\" — and warns that \"the amount on your 1099 form won't match what was deposited in your bank account.\" The gap is Uber's service fee, booking fees, and other deductions. You deduct those fees as a business expense on Schedule C. Skip that step and you pay self-employment tax on money that was never yours.";

export const GIG_DRIVER_SPOKES: SpokeEntry[] = [
  {
    calculator: "self-employment-tax",
    slug: "doordash-taxes",
    updated: "2026-09-05",
    title: "DoorDash Taxes: What Dashers Owe in 2026",
    metaDescription:
      "How DoorDash taxes work in 2026: the 1099-NEC threshold rose to $2,000, mileage is your biggest deduction, and most part-time Dashers owe self-employment tax only.",
    targetKeyword: "DoorDash taxes",
    estimatedVolume: 2400,
    estimatedKD: 37,
    h1: "DoorDash Taxes: What Dashers Actually Owe",
    introText:
      "DoorDash does not withhold tax from your earnings, so as a Dasher you are self-employed and settle up yourself. Your bill is calculated on profit — what DoorDash paid you minus your mileage and other business expenses — not on the deposits that hit your bank account.\n\nMileage usually decides the outcome. A Dasher with $22,000 of earnings and 18,000 business miles deducts $13,400 in mileage alone, leaving about $8,000 of profit and a federal tax bill of $1,130.36 — all of it self-employment tax, with no income tax at all.",
    howItWorks:
      "DoorDash reports Dasher earnings on Form 1099-NEC, delivered through Stripe. For 2026 the IRS raised the filing threshold for that form from $600 to $2,000, so a light year of dashing may produce no form at all.\n\nThat change has caused a lot of confusion, and the important part is that it changes nothing about what you owe. The threshold is DoorDash's filing obligation, not your tax liability. The IRS is direct about this: you report gig income \"even if the income is... not reported on an information return form.\" Your own trigger is $400 of net self-employment earnings, and it has not moved.\n\nWhat you are taxed on is profit. Start with everything DoorDash paid you, including tips, then subtract business expenses. For nearly every Dasher the largest by far is mileage, and 2026 has two rates: 72.5 cents a mile through June 30 and 76 cents from July 1. Eighteen thousand miles split 8,000 and 10,000 across those periods is a $13,400 deduction. That single line is usually worth more than everything else combined.\n\nWhich miles count is the part worth getting right. Miles driven with the app on — heading to a pickup, waiting between orders while available, driving to the drop-off — are business miles. Driving from home to your first dash and home again at the end is commuting, and commuting is never deductible. DoorDash's own mileage estimate in the app typically only captures a portion of this, so a tracking app that logs from the moment you go online generally produces a larger and better-documented figure.\n\nBeyond mileage, the usual deductions are the business-use share of your phone plan, hot bags and other equipment, and any parking or tolls incurred on deliveries. Traffic tickets are never deductible.\n\nAfter that arithmetic, most part-time Dashers land under the $16,100 standard deduction, so their federal income tax is zero and the entire bill is self-employment tax — 14.13% of profit. This is why the standard advice to set aside 30% of gross earnings is so far off: applied to the example above, it would have you save $6,600 against a real bill of $1,130.\n\nThe advice flips completely if you also have a job. Dashing on top of a salary is taxed at your top marginal rate from the first dollar, because your W-2 withholding already covers the salary. Enter your W-2 wages in the calculator above and it computes the tax the dashing itself causes. Either way there is no withholding, so this is paid quarterly through Form 1040-ES — see our [guide to budgeting with irregular income](/guides/how-to-budget-with-irregular-income/) for the due dates, and the [mileage deduction calculator](/mileage-deduction/) to price your miles.",
    commonMistakes: [
      ...UNIVERSAL_MISTAKES,
      "Deducting only the miles DoorDash shows in the app. The in-app figure typically misses waiting and repositioning miles. A tracking app that runs from the moment you go online captures more, and documents it properly.",
      "Deducting the commute. Driving from home to the zone where you start, and home at the end of the night, is commuting rather than business mileage.",
      "Claiming both mileage and gas. The standard mileage rate already includes fuel, insurance, repairs, and depreciation. Deducting gas on top of it is double-counting.",
    ],
    workedExample:
      "A Dasher earns $22,000 including tips and drives 18,000 business miles — 8,000 before July and 10,000 after. The mileage deduction is 8,000 × 72.5¢ plus 10,000 × 76¢, or $13,400. Another $600 covers the business share of their phone plan and a replacement hot bag. Net profit is $8,000. Self-employment tax is 15.3% of 92.35% of that, or $1,130.36. Because $8,000 of profit is well under the $16,100 standard deduction, federal income tax is zero. Total federal bill: $1,130.36, or about $283 a quarter — 14.1% of profit, not the 30% of gross that generic advice would have set aside.",
    faqs: [
      {
        question: "Does DoorDash take out taxes?",
        answer:
          "No. DoorDash pays Dashers as independent contractors with no withholding of any kind — no income tax, no Social Security, no Medicare. Everything you are paid arrives gross, and you are responsible for the tax on your profit. Because there is no withholding, the IRS expects estimated payments through the year rather than a single settlement in April.",
      },
      {
        question: "Will I get a 1099 from DoorDash in 2026?",
        answer:
          "Only if DoorDash paid you $2,000 or more. The IRS raised the Form 1099-NEC filing threshold from $600 to $2,000 for 2026, and DoorDash issues the form through Stripe. Below that you may receive nothing — which does not reduce what you owe. Your obligation to report starts at $400 of net self-employment earnings, and the IRS says to report gig income whether or not a form arrives.",
      },
      {
        question: "How much should I set aside for DoorDash taxes?",
        answer:
          "Set aside a share of profit, not of gross earnings, and mileage is what turns one into the other. For a part-time Dasher with no other job, 15% of profit usually covers it, because the standard deduction often eliminates income tax entirely and only the 14.13% self-employment tax remains. If you dash alongside a salaried job, 30% to 35% of profit is the right target, since the income stacks at your top marginal rate.",
      },
      {
        question: "What can Dashers deduct?",
        answer:
          "Business mileage at the 2026 rates (72.5¢ through June, 76¢ after), the business-use percentage of your phone bill and plan, hot bags and delivery equipment, parking and tolls paid during deliveries, and any commissions or fees DoorDash deducted from your pay. You cannot deduct traffic tickets, your commute, or — if you take the standard mileage rate — gas, insurance, and repairs, because that rate already includes them.",
      },
      {
        question: "Do I still owe tax if I made under $600 dashing?",
        answer:
          "If your net earnings from all self-employment reach $400 for the year, you owe self-employment tax and must file, regardless of what any platform reported. The $600 figure people remember was the old 1099-NEC threshold and it rose to $2,000 for 2026 — but neither number was ever the point at which tax started. They only determine whether the payer files a form.",
      },
      {
        question: "Can I deduct mileage if I use my personal car for DoorDash?",
        answer:
          "Yes — that is the normal case, and it is why the business-use share matters. You deduct the miles driven for deliveries, not the cost of owning the car. Keep a contemporaneous log with dates, miles, and purpose; an automatic tracking app satisfies this. If you want the option of using the standard mileage rate for that vehicle in future years, you must use it in the first year you put the car into business service.",
      },
    ],
    sources: [IRS_GIG, IRS_MILEAGE, IRS_1099NEC, IRS_SE_TAX, IRS_SCHED_C],
    toolHeading: "DoorDash tax calculator",
    toolSubheading: "Enter earnings after mileage and expenses",
    preset: {
      netProfit: 8000,
      filingStatus: "single",
      applyQbi: true,
      incomeLabel: "DoorDash profit (earnings minus mileage and expenses)",
      platformNote:
        "DoorDash withholds nothing and reports on Form 1099-NEC through Stripe — and only at $2,000 or more for 2026. Subtract your mileage before entering a figure here: 18,000 business miles is a $13,400 deduction at the 2026 rates.",
    },
    relatedSlugs: ["uber-eats-taxes", "instacart-taxes", "1099-tax-calculator"],
  },

  {
    calculator: "self-employment-tax",
    slug: "uber-driver-taxes",
    updated: "2026-09-05",
    title: "Uber Driver Taxes: 1099-K, Fees, and Mileage",
    metaDescription:
      "Uber driver taxes in 2026: your 1099-K shows gross fares before Uber's fees, so deduct them. See what you owe after mileage at the 2026 IRS rates.",
    targetKeyword: "Uber driver taxes",
    estimatedVolume: 260,
    estimatedKD: 24,
    h1: "Uber Driver Taxes: Why Your 1099-K Looks Too Big",
    introText:
      "The number on an Uber driver's 1099-K is almost always far larger than what reached their bank account, and misreading that gap is the most expensive mistake in rideshare tax. The form reports gross fares — everything riders paid — before Uber's service fee comes out.\n\nDeduct those fees and your mileage and the picture changes completely. A driver with $48,000 of gross fares, $14,000 of Uber fees, and 26,000 business miles has about $13,760 of profit and owes $1,944.23 — all self-employment tax.",
    howItWorks:
      "Uber issues two different forms and they cover different money. The 1099-K reports your on-trip gross earnings, which Uber defines as the total amount paid by riders and Uber Eats users. The 1099-NEC covers non-trip money: promotions, referrals, and other incentives.\n\n" +
      UBER_GROSS_TRAP +
      "\n\nUber also provides an annual tax summary, which is not an official IRS form but is the most useful document you will get. It breaks out the fees Uber deducted and reports your online miles — the starting point for the deduction that matters most.\n\nMileage does the heavy lifting. For 2026 the business standard rate is 72.5 cents a mile through June 30 and 76 cents from July 1, so 26,000 business miles split 12,000 and 14,000 is a $19,340 deduction. Uber's tax summary reports your online miles, but online miles are typically a floor rather than a ceiling: miles driven to your first passenger of the shift and between fares while available are also business miles, and a mileage tracking app captures them where the platform's figure may not.\n\nBecause the app records when you were online, rideshare is one of the easier gig jobs to substantiate. The IRS wants a contemporaneous log with dates, mileage, and business purpose, and an automatic tracker plus your Uber summary together make a strong record.\n\nBeyond fees and mileage, deduct the business share of your phone plan, and the passenger-comfort items you buy — water, chargers, cleaning supplies. If you rent a vehicle through a rideshare rental program, that rental cost is deductible instead of mileage, because you are not bearing the ownership costs the standard rate is meant to cover.\n\nAfter fees and mileage, many part-time drivers land under the $16,100 standard deduction and owe no federal income tax at all, leaving only self-employment tax at 14.13% of profit. Drivers who also hold a salaried job are in a completely different position: their driving profit stacks at their top marginal rate. Enter your W-2 wages above to see which case you are in, then use the [mileage deduction calculator](/mileage-deduction/) to price your miles precisely.",
    commonMistakes: [
      ...UNIVERSAL_MISTAKES,
      "Reporting the 1099-K figure as your income and stopping there. That number includes Uber's service and booking fees. Deduct them on Schedule C or you pay self-employment tax on money Uber kept.",
      "Using only the online miles from Uber's summary. Miles to your first pickup and between fares while available also count, and they are frequently a large share of the total.",
      "Deducting gas and repairs on top of the standard mileage rate. The rate already covers fuel, insurance, maintenance, and depreciation — take one method or the other, not both.",
    ],
    workedExample:
      "A driver's 1099-K shows $48,000 of gross fares, but Uber's service and booking fees accounted for $14,000 of it, so only $34,000 ever reached them. They drove 26,000 business miles — 12,000 through June and 14,000 after — which deducts $19,340 at the 2026 rates. Another $900 covers the business share of their phone plan, water and chargers for passengers, and car washes. Net profit is $13,760. Self-employment tax is $1,944.23, and because profit is below the $16,100 standard deduction, federal income tax is zero. A driver who reported the $48,000 gross figure without deducting Uber's fees would have paid tax on $14,000 they never received.",
    faqs: [
      {
        question: "Why is my Uber 1099-K higher than what I was paid?",
        answer:
          "Because the 1099-K reports gross on-trip earnings — everything riders paid — while your deposits are net of Uber's service fee, booking fees, and other deductions. Uber's own tax guidance warns that the form will not match your bank deposits. The fees are a legitimate business expense: report the gross figure as income on Schedule C and deduct the fees, which nets to the same profit and keeps your return consistent with what Uber reported to the IRS.",
      },
      {
        question: "Does Uber take taxes out of driver pay?",
        answer:
          "No. Uber pays drivers as independent contractors with no withholding, so nothing is set aside for income tax, Social Security, or Medicare. You owe self-employment tax of 15.3% on 92.35% of your profit, plus income tax on whatever remains after deductions, and you pay it in quarterly estimated instalments rather than at filing.",
      },
      {
        question: "How many miles can Uber drivers deduct?",
        answer:
          "All miles driven for the business, which is more than the trip miles Uber pays you for. That includes driving to your first passenger, repositioning between fares while available, and driving to the drop-off point. It excludes your commute from home to the area where you start. At 2026 rates that is 72.5¢ a mile through June 30 and 76¢ from July 1, so 26,000 business miles is worth $19,340.",
      },
      {
        question: "What is the Uber annual tax summary?",
        answer:
          "A document Uber provides that breaks down your yearly earnings, the fees Uber deducted, and your online miles. It is not an official IRS form and you do not file it, but it is the practical starting point for your Schedule C: it tells you the fee figure to deduct against your gross 1099-K amount, and gives a baseline mileage number to compare against your own tracking.",
      },
      {
        question: "Do I get a 1099 if I drove for Uber part-time?",
        answer:
          "It depends on which form. Uber issues a 1099-K to drivers with $20,000 or more in gross trip earnings, matching the IRS threshold of over $20,000 and more than 200 transactions. Non-trip payments like promotions and referrals go on a 1099-NEC. Below either threshold you may receive nothing, and you still report the income — the IRS requires it whether or not a form is issued.",
      },
    ],
    sources: [
      IRS_GIG,
      IRS_MILEAGE,
      IRS_1099K,
      IRS_SE_TAX,
      { label: "Uber — Tax documents for drivers", url: "https://www.uber.com/us/en/drive/tax-information/tax-documents/" },
    ],
    toolHeading: "Uber driver tax calculator",
    toolSubheading: "Enter profit after Uber's fees and your mileage",
    preset: {
      netProfit: 13760,
      filingStatus: "single",
      applyQbi: true,
      incomeLabel: "Uber profit (gross fares minus fees, mileage, expenses)",
      platformNote:
        "Start from your 1099-K gross figure, then subtract Uber's service and booking fees and your mileage. The 1099-K reports what riders paid, not what you received.",
    },
    relatedSlugs: ["lyft-driver-taxes", "uber-eats-taxes", "1099-tax-calculator"],
  },

  {
    calculator: "self-employment-tax",
    slug: "uber-eats-taxes",
    updated: "2026-09-05",
    title: "Uber Eats Taxes: What Couriers Owe in 2026",
    metaDescription:
      "Uber Eats taxes for couriers in 2026. Deduct Uber's fees and your mileage at the new split IRS rates, then see the self-employment tax you actually owe.",
    targetKeyword: "Uber Eats taxes",
    estimatedVolume: 260,
    estimatedKD: 33,
    h1: "Uber Eats Taxes: A Courier's Guide for 2026",
    introText:
      "Delivering for Uber Eats makes you self-employed, with no tax withheld from anything you earn. What you owe is based on profit — earnings minus mileage and expenses — which for most couriers is a fraction of what the platform paid.\n\nA courier earning $16,000 who drove 13,000 business miles deducts $9,670 in mileage, leaving $5,830 of profit and a federal bill of $823.75, all of it self-employment tax.",
    howItWorks:
      "Uber reports courier earnings the same way it reports rideshare: a 1099-K for on-trip gross earnings, and a 1099-NEC for promotions and referrals. As with rideshare, the 1099-K shows what customers paid before Uber's fees came out, so it will exceed your deposits. Those fees are deductible, and Uber's annual tax summary breaks them out.\n\nBicycle and scooter couriers are a genuinely different case, and most guides ignore it. The standard mileage rate applies to a car, not a bike. If you deliver by bicycle you deduct actual costs instead: repairs, parts, a share of the purchase price through depreciation, and equipment like locks and lights. Those numbers are usually far smaller than a driver's mileage deduction, which means a bike courier's taxable profit is a much larger share of their earnings — an unwelcome surprise if nobody mentions it before April.\n\nFor car couriers, mileage dominates as it does in every delivery job. The 2026 rate is 72.5 cents through June 30 and 76 cents after, so 13,000 business miles split 6,000 and 7,000 deducts $9,670. Miles count from when you go online, including driving to the restaurant, waiting while available, and heading to the customer. Home to your starting zone is commuting and does not count.\n\nThe other deductions are modest but real: the business share of your phone plan and data, insulated delivery bags, phone mounts and chargers, and parking or tolls paid during deliveries.\n\nCouriers work part-time more often than rideshare drivers, so a large share end up with profit below the $16,100 standard deduction. Federal income tax is then zero and the whole bill is self-employment tax at 14.13% of profit. If Uber Eats is a second job on top of a salary, the reverse holds and the delivery income is taxed at your top marginal rate — enter your wages above to see which applies. Either way, nothing is withheld, so it is paid quarterly.",
    commonMistakes: [
      ...UNIVERSAL_MISTAKES,
      "Treating the 1099-K total as your income without deducting Uber's fees. It reports what customers paid, not what you received.",
      "Assuming a bike or scooter courier can claim the standard mileage rate. That rate is for vehicles; bike couriers deduct actual equipment and repair costs, which are usually much smaller.",
      "Counting only the paid delivery distance. Miles driven to the restaurant and while waiting online are business miles too.",
    ],
    workedExample:
      "A courier earns $16,000 delivering by car and drives 13,000 business miles across the year — 6,000 before July and 7,000 after. Mileage deducts $9,670 at the 2026 rates. A further $500 covers insulated bags, a phone mount, and the business share of their data plan. Net profit is $5,830. Self-employment tax is $823.75 and, with profit far below the $16,100 standard deduction, income tax is zero — a total federal bill of about $206 a quarter. A bike courier earning the same $16,000 with only $1,200 of deductible equipment costs would have $14,800 of profit and owe $2,091 in self-employment tax, more than double, for identical earnings.",
    faqs: [
      {
        question: "Does Uber Eats withhold taxes?",
        answer:
          "No. Uber Eats couriers are independent contractors, so nothing is withheld for income tax, Social Security, or Medicare. You owe self-employment tax on your profit and pay it yourself in quarterly estimated instalments. Because there is no withholding at all, the full 15.3% self-employment tax is yours rather than being split with an employer.",
      },
      {
        question: "How much can Uber Eats drivers deduct for mileage?",
        answer:
          "72.5 cents per business mile for miles driven January 1 through June 30, 2026, and 76 cents for miles from July 1 onward. Business miles run from when you go online — driving to the restaurant, waiting while available, and delivering to the customer — but exclude commuting from home to your starting area. Thirteen thousand business miles split across the two periods is a $9,670 deduction.",
      },
      {
        question: "Can I deduct mileage if I deliver by bike?",
        answer:
          "No. The standard mileage rate applies to vehicles, so a bicycle or scooter courier deducts actual costs instead: repairs, parts, lights and locks, and depreciation on the bike itself. These are usually far smaller than a car courier's mileage deduction, so bike couriers keep a much larger share of earnings as taxable profit and should set aside a higher percentage.",
      },
      {
        question: "Will Uber Eats send me a 1099?",
        answer:
          "A 1099-K if your gross on-trip earnings reach $20,000 across more than 200 transactions, and a 1099-NEC for promotions and referrals. Many part-time couriers fall under both thresholds and receive neither form, which does not change what they owe: the IRS requires gig income to be reported even when no information return is issued, and self-employment tax starts at $400 of net earnings.",
      },
      {
        question: "How much should an Uber Eats courier save for taxes?",
        answer:
          "About 15% of profit if delivering is your only income, since the standard deduction commonly eliminates income tax and leaves just the 14.13% self-employment tax. Save 30% to 35% of profit if you deliver alongside a salaried job, because that income is taxed at your top marginal rate. In both cases the percentage applies to profit after mileage, not to what Uber paid you.",
      },
    ],
    sources: [IRS_GIG, IRS_MILEAGE, IRS_1099K, IRS_SE_TAX],
    toolHeading: "Uber Eats tax calculator",
    toolSubheading: "Enter profit after fees, mileage, and expenses",
    preset: {
      netProfit: 5830,
      filingStatus: "single",
      applyQbi: true,
      incomeLabel: "Uber Eats profit (earnings minus fees, mileage, expenses)",
      platformNote:
        "Delivering by bike or scooter? The standard mileage rate does not apply — you deduct actual equipment and repair costs instead, which usually leaves a much larger taxable profit.",
    },
    relatedSlugs: ["doordash-taxes", "uber-driver-taxes", "instacart-taxes"],
  },

  {
    calculator: "self-employment-tax",
    slug: "lyft-driver-taxes",
    updated: "2026-09-05",
    title: "Lyft Driver Taxes: Fees, Mileage, and 1099s",
    metaDescription:
      "Lyft driver taxes for 2026. Your 1099-K reports gross fares before Lyft's commission — deduct it, deduct your mileage, and see what you really owe.",
    targetKeyword: "Lyft driver taxes",
    estimatedVolume: 50,
    estimatedKD: 28,
    h1: "Lyft Driver Taxes: What You Owe After Fees and Mileage",
    introText:
      "Lyft drivers are independent contractors, so nothing is withheld and the tax is calculated on profit rather than on the fares riders paid. The two numbers are far apart: Lyft's commission and fees come out of the gross figure your 1099-K reports.\n\nA driver with $40,000 of gross fares, $11,000 of Lyft fees, and 22,000 business miles has around $11,830 of profit and owes $1,671.53 — entirely self-employment tax.",
    howItWorks:
      "Lyft, like Uber, splits your earnings across two forms. Ride payments processed through the platform are reported on a 1099-K; bonuses, referrals, and other non-ride payments go on a 1099-NEC. The IRS thresholds for 2026 are over $20,000 and more than 200 transactions for the 1099-K, and $2,000 for the 1099-NEC — the latter raised from $600 this year.\n\nThe 1099-K figure is gross. It reflects what riders were charged, before Lyft's commission, service fees, and any other deductions. Your bank deposits are net of all of that. Both numbers are correct; they measure different things. Report the gross amount as income on Schedule C and deduct the fees as a business expense, which arrives at the right profit while matching what Lyft reported to the IRS. Lyft's annual summary breaks the fees out so you can find the figure.\n\nThen mileage, which for most drivers is larger than every other deduction combined. Twenty-two thousand business miles split 10,000 before July and 12,000 after deducts $16,370 at the 2026 rates of 72.5 and 76 cents. Business miles include driving to a pickup and repositioning between rides while the app is on, not just the paid ride distance, and exclude the commute from home to wherever you start driving.\n\nDrivers renting a car through Lyft's Express Drive programme are in a different position: the rental payments are the deductible cost, and the standard mileage rate does not apply to a vehicle you neither own nor lease long-term. That trade rarely favours the driver on tax, because a mileage deduction on an owned car is often worth more than the rental deduction.\n\nOther deductions are small individually and worth claiming together: the business share of your phone and data plan, car washes and cleaning supplies, water and mints for passengers, and any tolls or parking during rides.\n\nWith fees and mileage removed, a part-time driver's profit frequently lands under the $16,100 standard deduction, leaving self-employment tax at 14.13% of profit as the entire federal bill. Drivers with a day job are taxed on this income at their top marginal rate instead. The calculator above handles both — enter your W-2 wages to see which case applies to you.",
    commonMistakes: [
      ...UNIVERSAL_MISTAKES,
      "Entering the 1099-K gross figure as your income without deducting Lyft's commission and fees. That single omission can add thousands to taxable profit.",
      "Counting only paid ride miles. Driving to the pickup and repositioning while online are business miles as well.",
      "Claiming the standard mileage rate on an Express Drive rental. You deduct the rental cost instead, because the mileage rate covers ownership costs you are not bearing.",
    ],
    workedExample:
      "A driver's 1099-K reports $40,000 of gross fares. Lyft's commission and service fees took $11,000 of that, so $29,000 reached their account. They drove 22,000 business miles — 10,000 through June, 12,000 after — deducting $16,370 at the 2026 rates. Another $800 covers phone, car washes, and passenger supplies. Net profit is $11,830. Self-employment tax is $1,671.53; income tax is zero because profit sits below the $16,100 standard deduction. Total federal tax works out at roughly $418 a quarter. Reporting the $40,000 gross without deducting fees would have inflated profit by $11,000 and added over $1,500 of unnecessary self-employment tax.",
    faqs: [
      {
        question: "Does Lyft take out taxes for drivers?",
        answer:
          "No. Lyft classifies drivers as independent contractors, so no income tax, Social Security, or Medicare is withheld from your earnings. You pay self-employment tax of 15.3% on 92.35% of profit, plus income tax on anything left after deductions, and the IRS expects it in quarterly estimated payments rather than a lump sum at filing.",
      },
      {
        question: "Why is my Lyft 1099-K more than I earned?",
        answer:
          "Because it reports gross fares — what riders were charged — while your deposits are net of Lyft's commission and service fees. The difference is not an error and not lost money for tax purposes: deduct the fees as a business expense on Schedule C. Reporting the gross as income and the fees as an expense produces the correct profit while matching the figure Lyft filed with the IRS.",
      },
      {
        question: "What can Lyft drivers write off?",
        answer:
          "Lyft's commission and service fees, business mileage at the 2026 rates, the business share of your phone plan, car washes and interior cleaning, passenger amenities like water and phone chargers, and tolls or parking incurred while driving. If you rent through Express Drive, the rental cost replaces the mileage deduction. Commuting from home to your starting area and traffic tickets are never deductible.",
      },
      {
        question: "Do Lyft drivers get a 1099-NEC or a 1099-K?",
        answer:
          "Potentially both, covering different money. Ride payments go on the 1099-K, issued when gross earnings exceed $20,000 across more than 200 transactions. Bonuses, referrals, and other non-ride payments go on the 1099-NEC, which for 2026 is issued at $2,000 or more — up from $600. Receiving neither form does not remove your obligation to report the income.",
      },
      {
        question: "Is driving for Lyft worth it after taxes?",
        answer:
          "That depends almost entirely on your mileage and your vehicle, not on the tax rules. The mileage deduction is generous relative to what an efficient, paid-off car actually costs to run, which is why many drivers owe less tax than they expect. But the deduction is not a subsidy — it is meant to cover real depreciation and maintenance you will eventually pay. Track your actual vehicle costs for a year and compare them to the mileage deduction before concluding the work pays what it seems to.",
      },
    ],
    sources: [IRS_GIG, IRS_MILEAGE, IRS_1099K, IRS_1099NEC, IRS_SE_TAX],
    toolHeading: "Lyft driver tax calculator",
    toolSubheading: "Enter profit after Lyft's fees and your mileage",
    preset: {
      netProfit: 11830,
      filingStatus: "single",
      applyQbi: true,
      incomeLabel: "Lyft profit (gross fares minus fees, mileage, expenses)",
      platformNote:
        "Your 1099-K reports gross fares before Lyft's commission. Deduct the fees from Lyft's annual summary before entering a profit figure here.",
    },
    relatedSlugs: ["uber-driver-taxes", "doordash-taxes", "1099-tax-calculator"],
  },

  {
    calculator: "self-employment-tax",
    slug: "instacart-taxes",
    updated: "2026-09-05",
    title: "Instacart Taxes for Shoppers (2026 Guide)",
    metaDescription:
      "Instacart taxes in 2026: full-service shoppers are self-employed, mileage is the biggest deduction, and the 1099-NEC threshold rose to $2,000.",
    targetKeyword: "Instacart taxes",
    estimatedVolume: 320,
    estimatedKD: 24,
    h1: "Instacart Taxes: What Full-Service Shoppers Owe",
    introText:
      "Full-service Instacart shoppers are independent contractors with no tax withheld, so the bill is yours to calculate and pay. It is based on profit after mileage and expenses, which is usually far less than what Instacart deposited.\n\nA shopper earning $20,000 who drove 15,000 business miles deducts $11,155 in mileage, leaving $8,345 of profit and $1,179.11 of federal tax — all self-employment tax.",
    howItWorks:
      "Instacart has historically had two kinds of worker, and which one you are changes everything. Full-service shoppers, who both shop and deliver, are independent contractors: no withholding, self-employment tax, Schedule C, quarterly payments. In-store shoppers have been treated as part-time employees with a W-2, tax withheld, and no self-employment tax at all. If a W-2 arrives rather than a 1099, none of the self-employment rules on this page apply to that income.\n\nFor full-service shoppers, Instacart reports earnings on Form 1099-NEC. For 2026 the IRS raised the filing threshold for that form from $600 to $2,000, so a light year may produce no form — which changes nothing about what you owe. Self-employment tax starts at $400 of net earnings, and the IRS requires gig income to be reported whether or not a form is issued.\n\nMileage is the deduction that decides the bill. Fifteen thousand business miles, split 7,000 before July and 8,000 after, deducts $11,155 at the 2026 rates of 72.5 and 76 cents. Instacart shopping produces a mileage pattern worth understanding: miles to the store, between stores on a multi-store batch, and from store to customer are all business miles. Only the drive from home to your first store and back home at the end is commuting.\n\nThe deduction that shoppers most often miss is time spent in the store. It is not a mileage deduction — there are no miles — but it is why a batch that pays well per mile can still pay poorly per hour, and it is worth tracking separately when you decide which batches to accept.\n\nOther deductions: the business share of your phone plan and data, since the app runs constantly; insulated bags and coolers for cold items; a phone mount and car charger; and parking or tolls. Bags you buy specifically for deliveries are deductible; groceries you buy for yourself on the same trip obviously are not, and mixing them on one receipt makes both harder to defend.\n\nAfter mileage, most part-time shoppers land below the $16,100 standard deduction, so federal income tax is zero and the entire bill is self-employment tax at 14.13% of profit. Shoppers with another job face the opposite: the income stacks at their top marginal rate. Enter your W-2 wages in the calculator to see the real figure for your situation.",
    commonMistakes: [
      ...UNIVERSAL_MISTAKES,
      "Applying self-employment rules to in-store shopper W-2 income. If Instacart issued you a W-2, that income already had tax withheld and no self-employment tax applies to it.",
      "Missing multi-store batch miles. Driving between stores on one batch is business mileage, and on large batches it adds up faster than the store-to-customer leg.",
      "Mixing personal groceries with deductible supplies on the same receipt. Bags and coolers bought for deliveries are deductible; keeping them on separate receipts is what makes that defensible.",
    ],
    workedExample:
      "A full-service shopper earns $20,000 including tips and drives 15,000 business miles — 7,000 before July, 8,000 after. Mileage deducts $11,155 at 2026 rates. Another $500 covers insulated bags, a phone mount, and the business share of their data plan. Net profit is $8,345. Self-employment tax is $1,179.11, and because profit is far below the $16,100 standard deduction, federal income tax is zero — about $295 a quarter in total. Generic advice to set aside 30% of the $20,000 Instacart deposited would have parked $6,000 against a real bill of $1,179.",
    faqs: [
      {
        question: "Does Instacart take out taxes?",
        answer:
          "Not for full-service shoppers, who are independent contractors paid with no withholding of any kind. In-store shoppers have historically been treated as employees and do have tax withheld, receiving a W-2 instead of a 1099. Check which form you receive: a 1099-NEC means you owe self-employment tax and should be paying quarterly estimates, while a W-2 means it has already been handled.",
      },
      {
        question: "Will Instacart send me a 1099 for 2026?",
        answer:
          "Only if it paid you $2,000 or more, the new Form 1099-NEC filing threshold for 2026 — raised from $600. Below that you may receive no form at all. That does not make the income tax-free: your obligation begins at $400 of net self-employment earnings, and the IRS says to report gig income even when it is not reported on an information return.",
      },
      {
        question: "What mileage can Instacart shoppers deduct?",
        answer:
          "Miles driven to the store, between stores on a multi-store batch, and from the store to each customer. Only the drive from home to your first store and home again at the end is commuting and non-deductible. At the 2026 rates — 72.5¢ through June 30 and 76¢ from July 1 — 15,000 business miles is an $11,155 deduction, usually the largest single line on a shopper's return.",
      },
      {
        question: "What else can Instacart shoppers write off?",
        answer:
          "The business-use share of your phone bill and data plan, insulated bags and coolers, a phone mount and car charger, and parking or tolls paid during batches. If you take the standard mileage rate you cannot also deduct gas, insurance, or repairs, because the rate already includes them. Personal groceries bought on the same trip are never deductible.",
      },
      {
        question: "How much should I set aside for Instacart taxes?",
        answer:
          "Roughly 15% of profit after mileage if shopping is your only income, because the standard deduction usually removes income tax entirely and leaves just the 14.13% self-employment tax. If you shop alongside a salaried job, set aside 30% to 35% of profit instead, since the income is taxed on top of your salary at your highest marginal rate.",
      },
    ],
    sources: [IRS_GIG, IRS_MILEAGE, IRS_1099NEC, IRS_SE_TAX, IRS_ES],
    toolHeading: "Instacart tax calculator",
    toolSubheading: "Enter profit after mileage and expenses",
    preset: {
      netProfit: 8345,
      filingStatus: "single",
      applyQbi: true,
      incomeLabel: "Instacart profit (earnings minus mileage and expenses)",
      platformNote:
        "This applies to full-service shoppers paid on a 1099-NEC. If Instacart sent you a W-2 as an in-store shopper, tax was already withheld and no self-employment tax applies.",
    },
    relatedSlugs: ["doordash-taxes", "shipt-taxes", "1099-tax-calculator"],
  },

  {
    calculator: "self-employment-tax",
    slug: "amazon-flex-taxes",
    updated: "2026-09-05",
    title: "Amazon Flex Taxes: A Driver's Guide (2026)",
    metaDescription:
      "Amazon Flex taxes in 2026. Block pay is gross with nothing withheld — deduct mileage at the new split IRS rates and see the self-employment tax you owe.",
    targetKeyword: "Amazon Flex taxes",
    estimatedVolume: 590,
    estimatedKD: 38,
    h1: "Amazon Flex Taxes: What Delivery Partners Owe",
    introText:
      "Amazon Flex pays by the block with nothing withheld, which makes the hourly rate look better than it is. You are an independent contractor, and self-employment tax plus income tax come out of that block pay afterwards.\n\nA driver earning $24,000 across the year who drove 20,000 business miles deducts $14,885 in mileage, leaving about $8,515 of profit and a $1,203.13 federal bill — all self-employment tax.",
    howItWorks:
      "Amazon Flex reports delivery partner earnings on Form 1099-NEC. For 2026 the IRS raised the filing threshold from $600 to $2,000, so occasional drivers may get no form. As always, the form is the payer's obligation and not the trigger for your tax: yours starts at $400 of net self-employment earnings.\n\nBlock pay is the thing to think clearly about. A three-hour block advertised at $60 is $20 an hour before anything. Once self-employment tax and vehicle costs come out, the real figure is materially lower — and the mileage deduction is precisely the mechanism that recognises this, because it estimates what driving the route actually costs you in fuel, wear, and depreciation.\n\nMileage is therefore the deduction that matters most, and Flex routes generate a lot of it. Twenty thousand business miles, split 9,000 before July and 11,000 after, deducts $14,885 at the 2026 rates of 72.5 and 76 cents. Business miles include driving to the delivery station at the start of a block, the entire route, and driving between stops. The one leg that does not count is arguably arguable and worth being careful about: the IRS treats travel from home to a regular workplace as commuting, and if you consistently pick up from the same station, that first leg looks a lot like a commute. Drivers who work multiple stations or whose station varies have a stronger case for counting it. When in doubt, log it separately so you can decide with a preparer rather than losing the whole record.\n\nFlex delivery is hard on a vehicle — constant stop-start driving, frequent short trips, heavy loads — so the actual expense method is worth comparing more often here than in rideshare, particularly for a newer vehicle where depreciation is large. Enter both in the [mileage deduction calculator](/mileage-deduction/) before choosing. Remember that if you want the option of the standard mileage rate later, you must use it in the first year the vehicle goes into business service.\n\nOther deductions: the business share of your phone plan, a phone mount and charger, a hand truck or dolly, and parking or tolls on route. With mileage removed, most part-time Flex drivers fall under the $16,100 standard deduction and owe only self-employment tax at 14.13% of profit.",
    commonMistakes: [
      ...UNIVERSAL_MISTAKES,
      "Judging a block by its advertised hourly rate. Block pay is gross, before self-employment tax and before the real cost of the miles the route puts on your car.",
      "Not comparing actual expenses against the mileage rate. Flex driving is stop-start and hard on a vehicle, so a newer car with heavy depreciation can beat the standard rate.",
      "Assuming the drive to the delivery station always counts. If you use the same station consistently, that leg resembles a commute — log it separately rather than folding it into your route miles.",
    ],
    workedExample:
      "A Flex driver completes blocks worth $24,000 across the year and drives 20,000 business miles, 9,000 through June and 11,000 after. The mileage deduction is $14,885 at the 2026 split rates. Another $600 covers a dolly, a phone mount, and the business share of their phone plan. Net profit is $8,515. Self-employment tax is $1,203.13, income tax is zero because profit is below the $16,100 standard deduction, and the total works out at about $301 a quarter. Judged on block pay alone, the year looked like $24,000 of income; after mileage it is $8,515 of profit — which is also the honest measure of what the work paid.",
    faqs: [
      {
        question: "Does Amazon Flex take out taxes?",
        answer:
          "No. Amazon Flex pays delivery partners as independent contractors, so block pay arrives gross with no income tax, Social Security, or Medicare withheld. You owe self-employment tax of 15.3% on 92.35% of your profit and pay it in quarterly estimated instalments. This is also why an advertised block rate overstates what the work actually pays.",
      },
      {
        question: "Will I get a 1099 from Amazon Flex?",
        answer:
          "Only if Amazon paid you $2,000 or more in 2026 — the Form 1099-NEC filing threshold rose from $600 this year. Drivers who take occasional blocks may receive nothing. That has no effect on your liability: you owe self-employment tax once net earnings reach $400, and the IRS requires gig income to be reported regardless of whether a form was issued.",
      },
      {
        question: "How many miles can Amazon Flex drivers deduct?",
        answer:
          "All the miles driven on the route and between stops, at 72.5 cents through June 30, 2026 and 76 cents from July 1. Twenty thousand business miles split across the two periods deducts $14,885. The drive from home to the delivery station is less clear-cut — if you use the same station every time it resembles a commute, which is not deductible. Log that leg separately so you can decide it with a preparer.",
      },
      {
        question: "Should Flex drivers use mileage or actual expenses?",
        answer:
          "Compare them, because Flex is one of the cases where actual expenses can win. Constant stop-start driving with heavy loads is unusually hard on a vehicle, and if your car is newer, depreciation and insurance may exceed the mileage deduction. Be careful with the order, though: to keep the standard mileage rate available for a vehicle in future years, you must use it in the first year you put that car into business service.",
      },
      {
        question: "Is Amazon Flex worth it after taxes and mileage?",
        answer:
          "The block rate is not the answer to that question. Subtract the real cost of the miles — the IRS rate of roughly 74 cents blended for 2026 is a reasonable proxy for fuel, wear, and depreciation — then subtract 14.13% self-employment tax on what remains. A $24,000 year with 20,000 miles nets around $8,515 of profit before tax. Whether that is worth it depends on your hours, but it is the number to judge, not the block rate.",
      },
    ],
    sources: [IRS_GIG, IRS_MILEAGE, IRS_1099NEC, IRS_SE_TAX, IRS_SCHED_C],
    toolHeading: "Amazon Flex tax calculator",
    toolSubheading: "Enter block pay after mileage and expenses",
    preset: {
      netProfit: 8515,
      filingStatus: "single",
      applyQbi: true,
      incomeLabel: "Amazon Flex profit (block pay minus mileage and expenses)",
      platformNote:
        "Block pay is gross. Subtract your route mileage first — 20,000 business miles is a $14,885 deduction at the 2026 rates — and what is left is what you are actually taxed on.",
    },
    relatedSlugs: ["doordash-taxes", "instacart-taxes", "1099-tax-calculator"],
  },

  {
    calculator: "self-employment-tax",
    slug: "shipt-taxes",
    updated: "2026-09-05",
    title: "Shipt Taxes for Shoppers (2026)",
    metaDescription:
      "Shipt shopper taxes in 2026. No withholding, a $2,000 1099-NEC threshold, and mileage as your largest deduction — see what you actually owe.",
    targetKeyword: "Shipt taxes",
    estimatedVolume: 90,
    estimatedKD: 18,
    h1: "Shipt Taxes: What Shoppers Owe in 2026",
    introText:
      "Shipt shoppers are independent contractors, so nothing is withheld and the tax is calculated on profit rather than on what Shipt deposited. Mileage and expenses usually take most of the earnings out of the taxable figure.\n\nA shopper earning $18,000 who drove 14,000 business miles deducts $10,412.50 in mileage, leaving about $7,087.50 of profit and $1,001.43 of federal tax — all self-employment tax.",
    howItWorks:
      "Shipt reports shopper earnings on Form 1099-NEC, and for 2026 that form is only filed at $2,000 or more, up from $600. Below the threshold you may receive nothing while still owing tax — self-employment tax applies from $400 of net earnings, and the IRS is explicit that gig income is reportable with or without a form.\n\nTips are the piece shoppers most often mishandle. Shipt tips are a large share of total earnings and they are fully taxable income, whether they arrive through the app or in cash. Cash tips that never pass through the platform are still reportable, and they will not appear on any 1099 — which makes your own records the only source. Undercounting them is not a tax saving; it is an understated return.\n\nMileage is the deduction that does the work. Fourteen thousand business miles split 6,500 before July and 7,500 after deducts $10,412.50 at the 2026 rates. Shipt's shop-and-deliver model produces the same mileage pattern as Instacart: miles to the store, between stores where a run requires it, and from store to member all count. Home to your first store and back at the end is commuting.\n\nWhat distinguishes Shipt from pure delivery work is the shopping time, and the preferred-shopper relationships that come with it. Time spent selecting produce, handling substitutions, and messaging members is unpaid by the mile and invisible in a mileage calculation, so a route that looks efficient on miles can be poor on hours. It is worth tracking hours separately from miles when deciding which offers to accept — the tax deduction rewards driving, not shopping.\n\nOther deductions are modest: the business share of your phone plan and data, insulated bags and coolers, a phone mount and charger, and parking or tolls. As with every gig platform, if you take the standard mileage rate you cannot also deduct fuel, insurance, or repairs.\n\nWith mileage removed, most part-time Shipt shoppers have profit below the $16,100 standard deduction, so federal income tax is zero and the whole bill is self-employment tax at 14.13% of profit. If you shop alongside a salaried job, the income instead stacks at your top marginal rate — enter your W-2 wages above to see that figure.",
    commonMistakes: [
      ...UNIVERSAL_MISTAKES,
      "Leaving cash tips off the return. Tips are taxable income whether they come through the app or in cash, and cash tips appear on no 1099 — your own log is the only record.",
      "Judging offers on miles alone. Shopping time is unpaid by the mile and invisible to the mileage deduction, so a high-mileage offer can pay better per hour than a short one that takes an hour in the store.",
      "Deducting the drive from home to your first store. That leg is commuting; the miles start when you begin the first business errand.",
    ],
    workedExample:
      "A Shipt shopper earns $18,000 including tips and drives 14,000 business miles — 6,500 through June, 7,500 after. Mileage deducts $10,412.50 at the 2026 split rates. A further $500 covers insulated bags, a phone mount, and the business share of their data plan. Net profit is $7,087.50. Self-employment tax is $1,001.43, and income tax is zero because profit falls well under the $16,100 standard deduction — around $250 a quarter in total. The 14.1% effective rate on profit is roughly a quarter of what setting aside 30% of the $18,000 in gross earnings would have reserved.",
    faqs: [
      {
        question: "Does Shipt take taxes out of shopper pay?",
        answer:
          "No. Shipt shoppers are independent contractors, so no income tax, Social Security, or Medicare is withheld. You owe self-employment tax of 15.3% on 92.35% of your profit plus income tax on anything remaining after deductions, and you pay it yourself in quarterly estimated instalments rather than at filing.",
      },
      {
        question: "Does Shipt send a 1099?",
        answer:
          "A Form 1099-NEC, and only if it paid you $2,000 or more in 2026 — the threshold rose from $600 this year. Shoppers who work occasionally may receive no form at all. That does not change what you owe: self-employment tax starts at $400 of net earnings, and the IRS requires gig income to be reported whether or not an information return was issued.",
      },
      {
        question: "Are Shipt tips taxable?",
        answer:
          "Yes, all of them, whether paid through the app or in cash. In-app tips flow through Shipt and are included in what it reports; cash tips do not appear on any form, so your own record is the only source. They are still taxable income and still part of the profit self-employment tax is calculated on. Log cash tips daily — reconstructing them at filing time is guesswork.",
      },
      {
        question: "What can Shipt shoppers deduct?",
        answer:
          "Business mileage at the 2026 rates of 72.5¢ through June and 76¢ after, the business share of your phone bill and data plan, insulated bags and coolers, phone mounts and chargers, and parking or tolls incurred on runs. Taking the standard mileage rate rules out separately deducting fuel, insurance, and repairs, because the rate already covers them.",
      },
      {
        question: "How much should Shipt shoppers save for taxes?",
        answer:
          "About 15% of profit after mileage if Shipt is your only income, since the standard deduction typically removes income tax and leaves the 14.13% self-employment tax. Save 30% to 35% of profit if you shop alongside a salaried job, because that income is taxed at your top marginal rate. The percentage applies to profit, not to the amount Shipt deposited.",
      },
    ],
    sources: [IRS_GIG, IRS_MILEAGE, IRS_1099NEC, IRS_SE_TAX],
    toolHeading: "Shipt tax calculator",
    toolSubheading: "Enter profit after mileage and expenses",
    preset: {
      netProfit: 7087.5,
      filingStatus: "single",
      applyQbi: true,
      incomeLabel: "Shipt profit (earnings and tips minus mileage and expenses)",
      platformNote:
        "Include cash tips in your earnings before subtracting mileage. They are taxable, they appear on no 1099, and your own log is the only record of them.",
    },
    relatedSlugs: ["instacart-taxes", "doordash-taxes", "1099-tax-calculator"],
  },
];
