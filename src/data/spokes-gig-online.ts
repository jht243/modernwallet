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

// Non-driver platform spokes (2026-09-05): in-home services, streaming, freelance marketplaces,
// and physical goods. Same island, but a genuinely different deduction profile from the driver
// pages — here the dominant expense is the platform's own commission, cost of goods, or equipment
// rather than mileage, and the hobby-versus-business test decides whether losses are usable at all.

const IRS_HOBBY = {
  label: "IRS — Hobby or business: here's what to know about that side hustle",
  url: "https://www.irs.gov/newsroom/hobby-or-business-heres-what-to-know-about-that-side-hustle",
};
const IRS_HOME_OFFICE = {
  label: "IRS — Home office deduction",
  url: "https://www.irs.gov/businesses/small-businesses-self-employed/home-office-deduction",
};

export const GIG_ONLINE_SPOKES: SpokeEntry[] = [
  {
    calculator: "self-employment-tax",
    slug: "rover-taxes",
    updated: "2026-09-05",
    title: "Rover Taxes: Pet Sitter and Dog Walker Guide",
    metaDescription:
      "Rover taxes in 2026. Deduct Rover's service fee, supplies, mileage, and the space you board in — then see the self-employment tax you actually owe.",
    targetKeyword: "Rover taxes",
    estimatedVolume: 260,
    estimatedKD: 16,
    h1: "Rover Taxes: What Sitters and Walkers Owe",
    introText:
      "Rover sitters and walkers are independent contractors, so nothing is withheld and you owe self-employment tax on your profit. The deductions look nothing like a delivery driver's: the biggest ones are Rover's own service fee, the supplies you buy, and — for boarders — the part of your home the animals occupy.\n\nA sitter earning $12,000 with $2,000 of deductible costs has $10,000 of profit and owes $1,412.96, all of it self-employment tax.",
    howItWorks:
      "Rover takes a service fee out of every booking, and the amount you are paid is net of it. Whether the figure reported to the IRS is gross or net depends on how the payment was processed, so start from your Rover earnings summary and reconcile it against your bank deposits before you file. If the reported figure is the gross booking value, the service fee is a deductible business expense and you must claim it — otherwise you pay self-employment tax on money Rover kept.\n\nWhich form arrives varies. Payments processed through a third-party settlement organisation are reported on a 1099-K, which for 2026 requires over $20,000 and more than 200 transactions. Direct nonemployee compensation goes on a 1099-NEC, whose threshold rose from $600 to $2,000 this year. Many sitters clear neither and receive nothing, and the tax is owed all the same: self-employment tax starts at $400 of net earnings, and the IRS requires gig income to be reported with or without a form.\n\nThe deductions divide by service type. Drop-in visits and dog walking generate mileage — deductible at 72.5 cents a mile through June 30, 2026 and 76 cents from July 1 — for the driving between clients. Driving from home to your first client and back at the end is commuting and does not count.\n\nBoarding in your own home is the more valuable and more misunderstood case. Space used regularly and exclusively for the business can support a home office deduction, and for boarding that means a room genuinely dedicated to the animals, not the living room where the dogs also sleep when you have no bookings. \"Regularly and exclusively\" is a strict test, and a shared family space fails it. Where a room does qualify, the deduction is based on its share of your home's square footage; the simplified method allows a set rate per square foot up to a cap.\n\nSupplies are usually the steadiest deduction: leashes, crates, bedding, toys, cleaning products, waste bags, and the replacement of things pets destroy. Business insurance and any pet first-aid training are deductible too. Food you buy for boarded animals is deductible; food for your own pets is not, and buying both on one receipt makes the whole claim harder to defend.\n\nAt these income levels the standard deduction of $16,100 usually eliminates federal income tax entirely, so the bill is self-employment tax at 14.13% of profit. Sitting alongside a salaried job changes that completely — the income stacks at your top marginal rate. Enter your W-2 wages in the calculator above to see which applies.",
    commonMistakes: [
      ...UNIVERSAL_MISTAKES,
      "Not deducting Rover's service fee when the reported figure is gross. Reconcile your earnings summary against your deposits — if the IRS was told the gross booking value, the fee is a deduction you must claim.",
      "Claiming a home office for a shared living space. The regular-and-exclusive test means a room dedicated to boarding, not the lounge the dogs use when you happen to have a booking.",
      "Deducting food and supplies for your own pets. Only what you buy for client animals is a business expense, and mixing both on one receipt undermines the whole claim.",
    ],
    workedExample:
      "A sitter earns $12,000 across boarding stays and drop-in visits. Rover's service fee, deducted from her bookings, comes to $800. She drives 900 miles between drop-in clients, worth about $670 at the 2026 rates, and spends $530 on crates, bedding, waste bags, and cleaning supplies. Total deductions are $2,000, leaving $10,000 of profit. Self-employment tax is $1,412.96 and federal income tax is zero, because $10,000 is well below the $16,100 standard deduction — a total of roughly $353 a quarter, or 14.1% of profit.",
    faqs: [
      {
        question: "Does Rover take out taxes?",
        answer:
          "No. Rover treats sitters and walkers as independent contractors, so no income tax, Social Security, or Medicare is withheld from your bookings. You owe self-employment tax of 15.3% on 92.35% of your profit and pay it in quarterly estimated instalments. Rover's service fee reduces what you receive, but it is not tax — it is a business expense you deduct.",
      },
      {
        question: "Will Rover send me a 1099?",
        answer:
          "It depends on how much you earned and how the payments were processed. A 1099-K requires over $20,000 and more than 200 transactions for 2026; a 1099-NEC is issued at $2,000 or more, up from $600 this year. Plenty of part-time sitters clear neither threshold and receive no form, which does not affect what they owe — self-employment tax begins at $400 of net earnings.",
      },
      {
        question: "Can I deduct part of my home for Rover boarding?",
        answer:
          "Only space used regularly and exclusively for the business. A spare room set up for boarding and not used for anything else can qualify; the living room where boarded dogs sleep alongside your family does not, because it fails the exclusivity test. Where a room qualifies, the deduction is based on its share of your home's square footage, and the simplified method offers a set rate per square foot up to a cap.",
      },
      {
        question: "What can Rover sitters write off?",
        answer:
          "Rover's service fee, mileage between clients for walks and drop-ins at the 2026 rates, supplies such as leashes, crates, bedding, toys, waste bags and cleaning products, food bought for client animals, business insurance, pet first-aid training, and a qualifying home office if you board. Food and supplies for your own pets are not deductible, and the commute to your first client of the day is not business mileage.",
      },
      {
        question: "How much should I set aside for Rover taxes?",
        answer:
          "Around 15% of profit if pet care is your only income, because the standard deduction generally removes federal income tax and leaves only the 14.13% self-employment tax. Set aside 30% to 35% of profit if you sit alongside a salaried job, since that income is taxed at your top marginal rate. Both percentages apply to profit after Rover's fee and your supplies, not to gross bookings.",
      },
    ],
    sources: [IRS_GIG, IRS_SE_TAX, IRS_HOME_OFFICE, IRS_MILEAGE, IRS_1099K],
    toolHeading: "Rover tax calculator",
    toolSubheading: "Enter profit after Rover's fee, supplies, and mileage",
    preset: {
      netProfit: 10000,
      filingStatus: "single",
      applyQbi: true,
      incomeLabel: "Rover profit (bookings minus fees, supplies, mileage)",
      platformNote:
        "Reconcile your Rover earnings summary against your deposits before entering a figure. If the amount reported to the IRS is the gross booking value, Rover's service fee is a deduction you need to claim.",
    },
    relatedSlugs: ["1099-tax-calculator", "how-much-to-set-aside-for-taxes"],
  },

  {
    calculator: "self-employment-tax",
    slug: "twitch-taxes",
    updated: "2026-10-09",
    title: "Twitch Taxes for Streamers (2026 Guide)",
    metaDescription:
      "Twitch taxes in 2026: royalties versus service income, the hobby-loss trap, and which streaming equipment you can deduct. See what you owe.",
    targetKeyword: "Twitch taxes",
    estimatedVolume: 110,
    estimatedKD: 15,
    h1: "Twitch Taxes: What Streamers Owe on Their Income",
    introText:
      "Twitch income is taxable from the first dollar, and the platform withholds nothing for a US streamer. The two questions that decide your bill are whether the IRS treats your channel as a business or a hobby, and how each stream of revenue is classified.\n\nA streamer earning $8,000 with $2,500 of deductible equipment and software has $5,500 of profit and owes $777.13 — all of it self-employment tax.",
    howItWorks:
      "Start with the hobby-versus-business test, because nothing else matters until it is settled. If your channel is a business, you file Schedule C, deduct your expenses against your income, and pay self-employment tax on the profit. If it is a hobby, you still report the income — but you cannot deduct expenses against it, and a loss cannot offset your other income. The IRS looks at whether you run the activity in a businesslike way, whether you depend on the income, whether you have expertise, and whether you have made a profit in some years. A channel run seriously with the intent to earn is a business; one that costs more than it earns indefinitely with no attempt to change that looks like a hobby.\n\nThat distinction is the reason streaming tax advice is so often wrong. A new streamer who spends $4,000 on a PC and earns $500 does not automatically get a $3,500 deductible loss. If the activity is a hobby, that loss is unusable.\n\nRevenue classification is the second wrinkle, and Twitch is unusual here. Payments can be reported as royalties or as nonemployee compensation depending on the type of revenue and how Twitch characterises it, and the two are taxed differently: royalties reported on a 1099-MISC are not automatically subject to self-employment tax, while nonemployee compensation is. In practice, if streaming is your trade or business, income from it is generally self-employment income regardless of which box it arrives in. Check your own tax documents in the Twitch dashboard and, if you receive a royalties form for a channel you run as a business, take that specific question to a preparer rather than assuming either treatment.\n\nThe deductions, once you are a business, are equipment-led: cameras, microphones, lighting, capture cards, and the computer itself, either depreciated or expensed depending on cost and the elections available. Streaming software subscriptions, editing tools, music licensing, graphics and emote commissions, and the business-use share of your internet connection are all deductible. So is a home office, if a space is used regularly and exclusively for the channel.\n\nGames are the contested one. A game you play on stream as the content is defensible as a business expense; your entire Steam library is not, and treating personal entertainment as inventory is exactly the pattern that draws scrutiny. Deduct what you actually stream, keep the record, and be prepared to explain the split.\n\nAt $5,500 of profit the standard deduction removes federal income tax entirely and the whole bill is self-employment tax at 14.13%. Most streamers also have a job, though, in which case the streaming profit stacks at their top marginal rate — enter your W-2 wages above to see that figure.",
    commonMistakes: [
      ...UNIVERSAL_MISTAKES,
      "Assuming an early-years loss is deductible. If the IRS treats the channel as a hobby, expenses cannot offset the income and the loss cannot offset your salary.",
      "Deducting an entire game library. Games you actually stream are defensible content costs; buying personal entertainment and calling it inventory is not.",
      "Ignoring how the income was classified. Royalties and nonemployee compensation arrive on different forms and are not automatically taxed the same way — check your Twitch tax documents rather than assuming.",
    ],
    workedExample:
      "A streamer earns $8,000 from subscriptions, bits, and ads. They deduct $1,400 for a camera, microphone, and lighting, $600 for streaming and editing software plus music licensing, and $500 for the business-use share of their internet connection, alongside $1,500 of the cost of the PC claimed this year — but only $2,500 of deductions apply after allocating the computer and connection between personal and business use honestly. Net profit is $5,500. Self-employment tax is $777.13 and federal income tax is zero, since profit is far below the $16,100 standard deduction. If the same streamer also earns $60,000 at a day job, the streaming profit instead stacks in the 22% bracket and the tax on it more than doubles.",
    faqs: [
      {
        question: "Do I have to pay taxes on Twitch income?",
        answer:
          "Yes, from the first dollar. Twitch withholds nothing for US streamers, and the IRS requires income to be reported whether or not any form is issued. If streaming is a business you file Schedule C and owe self-employment tax once net earnings reach $400. If it is a hobby you still report the income, but you cannot deduct expenses against it.",
      },
      {
        question: "Is my Twitch channel a hobby or a business?",
        answer:
          "The IRS weighs whether you run it in a businesslike manner, whether you depend on the income, your expertise, the time and effort you put in, and whether the activity has ever been profitable. A channel run with genuine profit intent — tracked finances, a real attempt to grow revenue — is a business and its expenses are deductible. One that loses money indefinitely with no attempt to change that is likely a hobby, and its expenses are not.",
      },
      {
        question: "What can Twitch streamers deduct?",
        answer:
          "Cameras, microphones, lighting, capture cards, and computers used for streaming, streaming and editing software, music licensing, commissioned graphics and emotes, the business-use share of your internet connection, and a home office if the space is used regularly and exclusively for the channel. Games you actually stream are defensible; a general games library bought for personal use is not.",
      },
      {
        question: "Why did Twitch report my income as royalties?",
        answer:
          "Some streaming revenue is characterised as royalties and reported on a Form 1099-MISC rather than as nonemployee compensation on a 1099-NEC. The distinction matters because royalty income is not automatically subject to self-employment tax, while business income is. If you run the channel as a trade or business, income from it is generally self-employment income regardless. Check your Twitch tax documents and raise this specific point with a preparer rather than guessing.",
      },
      {
        question: "Do I owe tax on Twitch income under $2,000?",
        answer:
          "If your net self-employment earnings reach $400 for the year, yes — that is the threshold that triggers self-employment tax and the filing requirement. The $2,000 figure is the 2026 Form 1099-NEC filing threshold, raised from $600, and it only determines whether a payer sends you a form. The IRS states that gig income is reportable even when no information return is issued.",
      },
    ],
    sources: [IRS_GIG, IRS_HOBBY, IRS_SE_TAX, IRS_1099NEC, IRS_SCHED_C],
    toolHeading: "Twitch streamer tax calculator",
    toolSubheading: "Enter profit after equipment and software",
    preset: {
      netProfit: 5500,
      filingStatus: "single",
      applyQbi: true,
      incomeLabel: "Twitch profit (revenue minus equipment and software)",
      platformNote:
        "This assumes the IRS would treat your channel as a business. If it is a hobby, you report the income but cannot deduct expenses against it — and the profit figure to enter here is your full revenue.",
    },
    relatedSlugs: ["1099-tax-calculator", "youtube-taxes", "fiverr-taxes", "how-much-to-set-aside-for-taxes"],
  },

  {
    calculator: "self-employment-tax",
    slug: "upwork-taxes",
    updated: "2026-10-09",
    title: "Upwork Taxes: What Freelancers Owe in 2026",
    metaDescription:
      "Upwork taxes for 2026. Your 1099-K reports gross contract value before Upwork's fee — deduct it, and see the self-employment tax on what is left.",
    targetKeyword: "Upwork taxes",
    estimatedVolume: 210,
    estimatedKD: 35,
    h1: "Upwork Taxes: Fees, Forms, and What You Owe",
    introText:
      "Upwork is a payment platform, not an employer. Nothing is withheld, you are self-employed, and the service fee it deducts from every contract is a business expense you claim rather than money that simply disappeared.\n\nA freelancer billing $55,000 on Upwork, paying $5,500 in platform fees and $4,500 in other business costs, has $45,000 of profit and owes $8,579.50 in federal tax — about 19.1%.",
    howItWorks:
      "Upwork processes client payments, which makes it a third-party settlement organisation, so US freelancers who clear the threshold receive a Form 1099-K. For 2026 that threshold is over $20,000 in payments and more than 200 transactions. Plenty of successful freelancers work on a handful of large contracts and never reach 200 transactions, so no form arrives — and the income is fully reportable regardless.\n\nThe important mechanical point is that a 1099-K reports gross payments. It reflects what clients paid into the platform, before Upwork's service fee came out. Your withdrawals are net. Report the gross figure as income on Schedule C and deduct the fees as a business expense: you land on the same profit, and your return reconciles with what Upwork told the IRS. Silently reporting only your withdrawals leaves a mismatch that is easy to query and hard to explain later.\n\nUpwork's fee is only the first deduction. Freelancers on the platform typically have several more that gig drivers do not: software subscriptions, professional insurance, a home office if a space is used regularly and exclusively for work, hardware, courses and books relevant to the work, accounting fees, and the business-use share of phone and internet. Connects — the credits Upwork charges to submit proposals — are a business cost too, and the ones spent on proposals that went nowhere are just as deductible as the ones that won work.\n\nAt this income level the picture is different from a part-time gig driver's. With $45,000 of profit, the standard deduction no longer absorbs everything: self-employment tax is $6,358.30 and federal income tax adds $2,221.20, for $8,579.50 and an effective 19.1% of profit. That is well above the 14.1% a low-earning driver pays, and it is why the same set-aside advice cannot serve both.\n\nUpwork income also has no withholding at any point in the chain, so the whole amount is paid through quarterly estimates on Form 1040-ES. Freelancers with lumpy contract income should set aside the percentage from each withdrawal as it arrives rather than reserving a quarterly lump sum — our [guide to budgeting with irregular income](/guides/how-to-budget-with-irregular-income/) covers the due dates and the safe-harbour rule, and the [freelance rate calculator](/freelance-rate/) shows what to charge so the take-home survives all of it.",
    commonMistakes: [
      ...UNIVERSAL_MISTAKES,
      "Reporting only your Upwork withdrawals as income. The 1099-K reports gross client payments before fees; report the gross and deduct the fee, or your return will not reconcile with what Upwork filed.",
      "Forgetting to deduct Connects and unsuccessful proposal costs. They are business expenses whether or not the proposal won the contract.",
      "Assuming no 1099-K means no reporting. Large-contract freelancers often clear the dollar threshold but never reach 200 transactions, so no form arrives — the income is still fully taxable.",
    ],
    workedExample:
      "A freelance developer bills $55,000 through Upwork across the year. Upwork's service fee takes $5,500, and another $4,500 covers software subscriptions, a laptop, professional insurance, accounting fees, and Connects spent on proposals. Net profit is $45,000. Self-employment tax applies to 92.35% of that: $6,358.30. Half of it is deducted above the line, then the $16,100 standard deduction and the QBI deduction come off, leaving $2,221.20 of federal income tax. The total federal bill is $8,579.50 — 19.1% of profit, or $2,144.87 due each quarter.",
    faqs: [
      {
        question: "Does Upwork take out taxes?",
        answer:
          "No. Upwork processes client payments but withholds nothing for US freelancers — no income tax, no Social Security, no Medicare. Its service fee is a platform charge, not tax. You owe self-employment tax of 15.3% on 92.35% of your profit plus federal income tax, and you pay both yourself through quarterly estimated payments.",
      },
      {
        question: "Does Upwork send a 1099?",
        answer:
          "US freelancers who exceed the 1099-K threshold receive one — over $20,000 in payments and more than 200 transactions for 2026. Because both conditions apply, freelancers with a few large contracts often clear the dollar figure without hitting 200 transactions and receive nothing. The income remains fully reportable: the IRS requires it whether or not a form is issued.",
      },
      {
        question: "Can I deduct Upwork's service fee?",
        answer:
          "Yes, and you should. If a 1099-K was issued it reports gross client payments before the fee, so deducting it is what brings your reported income down to what you actually received. Report the gross as income on Schedule C and the fee as a business expense. Connects spent on proposals are deductible too, including on proposals that did not win the work.",
      },
      {
        question: "What else can Upwork freelancers write off?",
        answer:
          "Software and subscriptions, hardware, professional and liability insurance, a home office used regularly and exclusively for work, the business-use share of phone and internet, accounting and legal fees, courses and books relevant to your services, and business travel. Each deduction reduces self-employment tax and income tax together, which for a freelancer in the 12% bracket makes a deductible dollar worth about 26 cents.",
      },
      {
        question: "How much should Upwork freelancers set aside for taxes?",
        answer:
          "Around 20% of profit at $45,000, rising as income does — the effective federal rate at that level is 19.1%, not the 30% commonly quoted. Add your state's income tax on top, and set aside more if you also have W-2 wages, since freelance profit stacks on your salary at your top marginal rate. Move the percentage out of each withdrawal as it clears rather than saving in quarterly lumps.",
      },
    ],
    sources: [IRS_GIG, IRS_1099K, IRS_SE_TAX, IRS_SCHED_C, IRS_ES],
    toolHeading: "Upwork tax calculator",
    toolSubheading: "Enter profit after Upwork's fee and expenses",
    preset: {
      netProfit: 45000,
      filingStatus: "single",
      applyQbi: true,
      incomeLabel: "Upwork profit (billings minus fees and expenses)",
      platformNote:
        "Your 1099-K, if you get one, reports gross client payments before Upwork's service fee. Report the gross on Schedule C and deduct the fee — do not simply report your withdrawals.",
    },
    relatedSlugs: ["fiverr-taxes", "dataannotation-taxes", "1099-tax-calculator", "how-much-to-set-aside-for-taxes"],
  },

  {
    calculator: "self-employment-tax",
    slug: "fiverr-taxes",
    updated: "2026-09-05",
    title: "Fiverr Taxes: A Seller's Guide for 2026",
    metaDescription:
      "Fiverr taxes in 2026. Fiverr's 20% commission is deductible, the 1099-K threshold is $20,000 and 200 transactions, and tax starts at $400 of profit.",
    targetKeyword: "Fiverr taxes",
    estimatedVolume: 40,
    estimatedKD: 21,
    h1: "Fiverr Taxes: What Sellers Owe on Their Earnings",
    introText:
      "Fiverr sellers are self-employed, and Fiverr withholds nothing. The commission it takes from every order is a deductible business expense rather than a cost you simply absorb — which matters, because that commission is a fifth of your gross revenue.\n\nA seller with $26,000 of gross orders paying $5,200 in Fiverr commission and $1,800 of other costs has $19,000 of profit and owes $2,809.23 in federal tax.",
    howItWorks:
      "Fiverr processes buyer payments, so US sellers who cross the threshold receive a Form 1099-K. For 2026 that means over $20,000 in payments across more than 200 transactions. Fiverr's model — many small orders — makes the 200-transaction test easier to hit than it is on a large-contract platform, so sellers here are more likely than most freelancers to receive a form.\n\nWhat that form reports is gross. It reflects what buyers paid, before Fiverr's commission was deducted, so it will exceed what you withdrew. The commission is a legitimate business expense: report the gross figure as income on Schedule C and deduct the commission, arriving at the correct profit while matching what Fiverr reported to the IRS. On a platform taking a fifth of each order, failing to deduct it inflates taxable profit enormously — on $26,000 of orders it would add $5,200 of phantom income and roughly $730 of unnecessary self-employment tax.\n\nBeyond commission, the deductions are the usual freelance set: software and subscriptions used to deliver the work, stock assets, fonts and licensed music, hardware, a home office used regularly and exclusively for the business, the business-use share of phone and internet, and any courses that maintain or improve the skills you sell. Fees for withdrawing your balance are deductible too, and easy to forget because they never appear as a charge you paid.\n\nSellers who buy work from other freelancers to fulfil their own orders have an extra step: what you pay a subcontractor is deductible, and if you pay any US contractor $2,000 or more in 2026 you may have your own Form 1099-NEC filing obligation. That threshold rose from $600 this year.\n\nAt $19,000 of profit the standard deduction absorbs nearly all income tax — $124.62 of it remains — so the bill is dominated by self-employment tax at $2,684.61, for an effective 14.8% of profit. Add a day job and that changes completely, since the Fiverr profit then stacks at your top marginal rate. Enter your W-2 wages above to see the difference.",
    commonMistakes: [
      ...UNIVERSAL_MISTAKES,
      "Not deducting Fiverr's commission. It is roughly a fifth of gross revenue, and the 1099-K reports the gross — omitting the deduction adds thousands of dollars of income you never received.",
      "Forgetting withdrawal and payment-processing fees. They never arrive as a bill you pay, so they are easy to miss, and they are deductible.",
      "Overlooking your own 1099 obligation. Pay a US subcontractor $2,000 or more in 2026 and you may need to file a Form 1099-NEC yourself.",
    ],
    workedExample:
      "A seller completes $26,000 of gross orders. Fiverr's commission takes $5,200 — a fifth of the total — and another $1,800 covers design software, stock assets and fonts, and the business share of their internet. Net profit is $19,000. Self-employment tax is $2,684.61. After the deduction for half of it, the $16,100 standard deduction, and the QBI deduction, only $124.62 of federal income tax remains, for a total of $2,809.23 — about 14.8% of profit, or $702 a quarter. A seller who reported the $26,000 gross without deducting the commission would have paid roughly $730 more in self-employment tax alone.",
    faqs: [
      {
        question: "Does Fiverr take out taxes?",
        answer:
          "No. Fiverr withholds nothing for US sellers — its commission is a platform fee, not tax. You are self-employed, so you owe self-employment tax of 15.3% on 92.35% of your profit plus federal income tax on what remains, and you pay both yourself through quarterly estimated payments rather than at filing.",
      },
      {
        question: "Does Fiverr send a 1099-K?",
        answer:
          "To US sellers who exceed both thresholds: over $20,000 in payments and more than 200 transactions for 2026. Fiverr's many-small-orders model makes the transaction test easier to clear than on platforms built around large contracts, so sellers here receive forms more often. If no form arrives, the income is still fully reportable — the IRS is explicit on that point.",
      },
      {
        question: "Can I deduct Fiverr's commission?",
        answer:
          "Yes, and it is the single most valuable deduction most sellers have. Fiverr's commission is roughly a fifth of gross revenue, and the 1099-K reports gross buyer payments before it was taken. Report the gross as income and the commission as a business expense on Schedule C. Withdrawal and payment-processing fees are deductible as well.",
      },
      {
        question: "What can Fiverr sellers write off?",
        answer:
          "Fiverr's commission and withdrawal fees, software and subscriptions used to deliver orders, stock assets, fonts and licensed music, hardware, a home office used regularly and exclusively for the business, the business-use share of phone and internet, and training that maintains or improves the skills you sell. Payments to subcontractors who help fulfil orders are deductible too.",
      },
      {
        question: "Do I owe taxes on small Fiverr earnings?",
        answer:
          "Once your net self-employment earnings reach $400 for the year, yes. That threshold is what triggers self-employment tax and the filing requirement, and it is unrelated to whether Fiverr issues a 1099-K. The reporting thresholds — $20,000 and 200 transactions for a 1099-K, $2,000 for a 1099-NEC in 2026 — are the payer's filing rules, not the point at which your tax begins.",
      },
    ],
    sources: [IRS_GIG, IRS_1099K, IRS_1099NEC, IRS_SE_TAX, IRS_SCHED_C],
    toolHeading: "Fiverr tax calculator",
    toolSubheading: "Enter profit after commission and expenses",
    preset: {
      netProfit: 19000,
      filingStatus: "single",
      applyQbi: true,
      incomeLabel: "Fiverr profit (gross orders minus commission and expenses)",
      platformNote:
        "Fiverr's commission is about a fifth of every order and your 1099-K reports the gross. Deduct the commission before entering a profit figure, or you will be taxed on money Fiverr kept.",
    },
    relatedSlugs: ["upwork-taxes", "etsy-taxes", "1099-tax-calculator"],
  },

  {
    calculator: "self-employment-tax",
    slug: "etsy-taxes",
    updated: "2026-09-05",
    title: "Etsy Taxes for Sellers: 1099-K and Deductions",
    metaDescription:
      "Etsy seller taxes in 2026. Deduct cost of goods, fees, and shipping; understand the $20,000 1099-K threshold and the hobby rule that can disallow losses.",
    targetKeyword: "Etsy seller taxes",
    estimatedVolume: 30,
    estimatedKD: 38,
    h1: "Etsy Taxes: What Sellers Owe After Fees and Goods",
    introText:
      "Selling on Etsy makes you self-employed once the shop is run as a business, and Etsy withholds nothing. Your tax is calculated on profit — sales minus cost of goods, fees, shipping, and materials — which for a maker is usually a small fraction of gross sales.\n\nA seller with $30,000 of sales, $12,000 of materials, $3,000 of Etsy fees, and $4,000 of shipping has $11,000 of profit and owes $1,554.25, all of it self-employment tax.",
    howItWorks:
      "Etsy processes payments, so it issues a Form 1099-K to sellers who exceed the 2026 threshold of over $20,000 in payments and more than 200 transactions. A shop selling many low-value items can clear 200 transactions easily while staying well under $20,000 — both conditions must be met, so no form arrives, and the income remains fully reportable.\n\nThe 1099-K figure is gross. It includes the sale price, the shipping your buyers paid, and sales tax Etsy collected and remitted on your behalf as a marketplace facilitator. None of that is profit. Report the gross as income and deduct the components: Etsy's listing, transaction, and payment processing fees, the shipping you actually paid, and any sales tax included in the gross that Etsy remitted. Sellers who take the 1099-K figure as income and stop are the most consistently over-taxed group on any platform.\n\nCost of goods sold is what makes Etsy different from every other page in this silo. You deduct the cost of materials in the year the item sells, not the year you bought the supplies. A maker who spends $4,000 on materials in December for items that sell the following spring does not get a $4,000 deduction this year. This is inventory accounting, and it is the main reason a shop's cash position and its taxable profit diverge.\n\nBeyond materials and fees, deduct packaging and shipping supplies, postage, a home studio or workspace used regularly and exclusively for the business, equipment and tools, photography props, and the business-use share of phone and internet. Mileage to the post office and to supply runs counts too, at 72.5 cents through June 2026 and 76 cents after.\n\nThe hobby rule matters here as much as it does for streamers. A shop run with genuine profit intent is a business, and its expenses are deductible against its income. A craft habit that reliably loses money is a hobby: the income is still reportable, but the expenses cannot be deducted against it and the loss cannot offset your salary. If your shop has never turned a profit and you have not changed anything to try to, that is the test you would struggle against.\n\nAt $11,000 of profit the standard deduction eliminates federal income tax and the bill is self-employment tax at 14.13% of profit. Most Etsy sellers also have a job, in which case the shop's profit stacks at their top marginal rate — enter your W-2 wages in the calculator above to see the real number.",
    commonMistakes: [
      ...UNIVERSAL_MISTAKES,
      "Reporting the 1099-K total as income. It includes buyer-paid shipping and sales tax Etsy collected and remitted, none of which is your profit.",
      "Deducting materials in the year you bought them. Cost of goods sold is deducted when the item sells, which is why a shop's cash flow and its taxable profit rarely match.",
      "Assuming a loss-making shop generates a deductible loss. If the IRS treats it as a hobby, expenses cannot offset the income and the loss cannot offset your other earnings.",
    ],
    workedExample:
      "A maker sells $30,000 on Etsy, a figure that includes buyer-paid shipping. Materials for the items that actually sold cost $12,000, Etsy's listing, transaction, and processing fees came to $3,000, and postage and packaging cost $4,000. Net profit is $11,000. Self-employment tax is $1,554.25, and federal income tax is zero because profit falls below the $16,100 standard deduction — roughly $389 a quarter. A seller who reported the $30,000 as income without deducting cost of goods, fees, and shipping would have shown $19,000 of phantom profit and paid about $2,700 in extra self-employment tax.",
    faqs: [
      {
        question: "Do I have to pay taxes on Etsy sales?",
        answer:
          "Yes, if the shop is run as a business and your net earnings reach $400 for the year. Etsy withholds nothing, so you owe self-employment tax of 15.3% on 92.35% of profit plus income tax on what remains, paid through quarterly estimates. If the shop is genuinely a hobby, you still report the income but cannot deduct expenses against it.",
      },
      {
        question: "Will Etsy send me a 1099-K?",
        answer:
          "Only if you exceed both 2026 thresholds: over $20,000 in payments and more than 200 transactions. A shop with many low-value sales can pass 200 transactions and stay under $20,000, so no form is issued. That does not make the income tax-free — the IRS requires it to be reported whether or not an information return arrives.",
      },
      {
        question: "Why is my Etsy 1099-K higher than my sales?",
        answer:
          "Because it reports gross payments, which include the shipping your buyers paid and the sales tax Etsy collected and remitted for you as a marketplace facilitator, on top of the item price. None of that is profit. Report the gross as income, then deduct the shipping you paid, Etsy's fees, and the sales tax Etsy remitted, so the profit you are taxed on reflects what you actually kept.",
      },
      {
        question: "When do I deduct the cost of my materials?",
        answer:
          "In the year the item made from them sells, not the year you bought them. That is cost of goods sold, and it is why buying $4,000 of supplies in December does not produce a $4,000 deduction that year if the finished items sell in spring. Track materials against the items they become, and expect your taxable profit to differ from your bank balance because of it.",
      },
      {
        question: "What can Etsy sellers deduct?",
        answer:
          "Cost of goods sold when items sell, Etsy's listing, transaction, and processing fees, postage and packaging, shipping supplies, equipment and tools, photography props, a workspace used regularly and exclusively for the business, the business-use share of phone and internet, and mileage to the post office and supply runs at the 2026 rates. Materials for personal projects are not deductible.",
      },
    ],
    sources: [IRS_GIG, IRS_1099K, IRS_HOBBY, IRS_SE_TAX, IRS_SCHED_C],
    toolHeading: "Etsy seller tax calculator",
    toolSubheading: "Enter profit after goods, fees, and shipping",
    preset: {
      netProfit: 11000,
      filingStatus: "single",
      applyQbi: true,
      incomeLabel: "Etsy profit (sales minus goods, fees, shipping)",
      platformNote:
        "Your 1099-K includes buyer-paid shipping and the sales tax Etsy remitted for you. Deduct those, plus fees and cost of goods sold, before entering a profit figure here.",
    },
    relatedSlugs: ["fiverr-taxes", "1099-tax-calculator", "how-much-to-set-aside-for-taxes"],
  },
  // ── mindmap-pass 2026-10-09 (ai-money): dataannotation-taxes ──
  {
    "calculator": "self-employment-tax",
    "slug": "dataannotation-taxes",
    "updated": "2026-10-09",
    "title": "DataAnnotation Taxes (2026 Calculator & Guide)",
    "metaDescription": "DataAnnotation taxes in 2026: contractor rules, PayPal 1099-K thresholds, deductions, and quarterly payments. Calculate what you owe.",
    "targetKeyword": "DataAnnotation taxes",
    "estimatedVolume": 70,
    "estimatedKD": 21,
    "h1": "DataAnnotation Taxes: What AI Trainers Owe on Their Earnings",
    "introText": "Yes, you owe tax on [DataAnnotation](https://www.dataannotation.tech/faqs) income. DataAnnotation pays through [PayPal](https://www.paypal.com/us/cshelp/article/current-form-1099-k-reporting-thresholds-2025-update-help1131) and publishes no tax-form policy. PayPal sends a Form 1099-K only above $20,000 and 200 transactions a year, with lower thresholds in a few states. The [Internal Revenue Service (IRS)](https://www.irs.gov/instructions/i1040sc) requires you to report all taxable gig earnings even if no payer sends you an information return.\n\nA contractor earning $6,000 from AI-training tasks, with $600 of deductible costs for the business share of a computer and internet, has $5,400 of profit and owes $763.00 of self-employment tax ($5,400 × 92.35% × 15.3%). With no other income, federal income tax is zero because the profit is below the $16,100 standard deduction.",
    "howItWorks": "The DataAnnotation FAQ calls workers contractors and provides no tax-form policy. [Outlier](https://outlier.ai/faq) states contributors work as independent contractors or freelancers, rather than employees. [Mercor help documentation](https://talent.docs.mercor.com/policies/us-taxes) says Mercor does not deduct taxes and asks United States persons for a Form W-9. Mercor sends a Form 1099-NEC through Stripe to W-9 filers who earn over $600. [Handshake AI support documentation](https://support.joinhandshake.com/hc/en-us/articles/32264709473303) says fellows are hired as 1099 independent contractors. [Its payments page](https://support.joinhandshake.com/hc/en-us/articles/32263614087575-Handshake-AI-payments-processing) says tax setup uses a W-8 or W-9 through Stripe and that you are responsible for taxes on your own income. Similarly, [Mindrift](https://mindrift.ai/blog/how-mindrift-pays) states contributors must declare earnings and meet tax obligations in their country of residence. Non-US contractors who submit a Form W-8BEN do not receive a Form 1099 through Mercor.\n\nWhich year-end tax forms you receive depends on the platform and payout processor. For directly contracted work, businesses issue Form 1099-NEC for nonemployee compensation. Under the [IRS Form 1099-NEC instructions](https://www.irs.gov/instructions/i1099mec), the national reporting threshold for payers rose to $2,000 for tax years beginning after 2025, although individual platforms may still distribute forms at lower historical amounts. When a platform deposits payments through a third-party processor like PayPal, different reporting rules apply. Under [IRS Form 1099-K guidance](https://www.irs.gov/newsroom/irs-issues-faqs-on-form-1099-k-threshold-under-the-one-big-beautiful-bill-dollar-limit-reverts-to-20000) and PayPal's published thresholds, PayPal issues Form 1099-K only when gross payments exceed $20,000 and 200 transactions. However, PayPal enforces a $600 threshold in Vermont, Massachusetts, Virginia, and Maryland, and more than $1,000 with four or more transactions in Illinois. PayPal also applies 24% backup withholding if your taxpayer identification details are missing.\n\nEvery dollar of net business profit is reported to the IRS on Schedule C of Form 1040, regardless of whether a Form 1099 arrives. Under [IRS self-employment tax guidelines](https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes), you must file Schedule SE whenever your net self-employment earnings reach $400 or more. The self-employment tax rate is 15.3%, consisting of 12.4% for Social Security and 2.9% for Medicare. As outlined in [IRS Topic 554](https://www.irs.gov/taxtopics/tc554), self-employment tax applies to 92.35% of your net Schedule C earnings, and you can deduct one-half of the resulting self-employment tax when calculating your adjusted gross income on Form 1040.\n\nYou can reduce your taxable earnings by claiming business deductions. According to the [IRS business expense guide](https://www.irs.gov/faqs/small-business-self-employed-other-business/income-expenses), deductible expenses must be ordinary, meaning common and accepted in your trade, and necessary, meaning helpful and appropriate. Personal and living expenses cannot be deducted. For a dedicated workspace, the [IRS home office deduction rules](https://www.irs.gov/businesses/small-businesses-self-employed/home-office-deduction) require regular and exclusive use as your principal place of business. Under the [simplified home office option](https://www.irs.gov/businesses/small-businesses-self-employed/simplified-option-for-home-office-deduction), you can deduct $5 per square foot up to 300 square feet, for a maximum deduction of $1,500. You can also deduct the tracked business-use share of your computer and home internet connection.\n\nIndependent contractors must also manage their own payments throughout the year. Under [IRS Form 1040-ES](https://www.irs.gov/forms-pubs/about-form-1040-es), you generally must make estimated quarterly tax payments if you expect to owe at least $1,000 in federal tax after subtracting withholding and refundable tax credits. [IRS estimated tax rules](https://www.irs.gov/faqs/estimated-tax) establish quarterly due dates on April 15, June 15, September 15, and January 15 of the following year, which shift to the next business day if a deadline lands on a weekend or legal holiday. To avoid underpayment penalties, you can satisfy safe harbor rules by paying the smaller of 90% of your current-year tax obligation or 100% of your prior-year tax, which rises to 110% if your prior-year adjusted gross income exceeded $150,000.\n\nIf you have not started yet, read [whether DataAnnotation is legit and what it pays](/guides/is-dataannotation-legit/) and our overview of [AI training jobs](/guides/ai-training-jobs/).",
    "commonMistakes": [
      ...UNIVERSAL_MISTAKES,
      "Assuming no tax is due because DataAnnotation deposited earnings through PayPal without issuing a Form 1099-K or Form 1099-NEC.",
      "Treating the hours spent on the Starter Assessment, skill screenings or ID verification as a deduction. You can deduct money you spend on the work, never the value of your own time.",
      "Forgetting that income from DataAnnotation, Outlier and Mercor adds up on one Schedule C, so several small balances can together pass the $400 self-employment tax threshold.",
    ],
    "workedExample": "A contractor earns $6,000 from AI-training tasks and has $600 of deductible costs (the business share of a computer and internet), leaving $5,400 of profit. That profit carries $763.00 of self-employment tax ($5,400 × 92.35% × 15.3%). With no other income, federal income tax is zero because the profit is below the $16,100 standard deduction (2026). With a day job, the profit is taxed at your top marginal rate. Enter your W-2 wages in the calculator above to see that figure.",
    "faqs": [
      {
        "question": "Do I have to pay taxes on DataAnnotation?",
        "answer": "Yes, you must pay taxes on your DataAnnotation earnings. You must report all net business profit on Schedule C and pay self-employment tax once your net earnings reach $400 or more."
      },
      {
        "question": "Do you get a 1099 from DataAnnotation?",
        "answer": "DataAnnotation publishes no tax-form policy on its website and delivers payouts through PayPal. PayPal only issues Form 1099-K if your gross payments exceed $20,000 and 200 transactions, except in Vermont, Massachusetts, Virginia and Maryland ($600) and Illinois (more than $1,000 and 4 or more transactions). You are legally required to report your income even if neither platform sends you a Form 1099."
      },
      {
        "question": "Do you pay taxes on Outlier AI income?",
        "answer": "Yes, you must pay taxes on Outlier earnings. Outlier states that contributors work as independent contractors and freelancers rather than employees. Because independent contractors have no tax withheld, you must report the earnings on Schedule C and pay self-employment tax on net earnings of $400 or more."
      },
      {
        "question": "Does Mercor send a 1099?",
        "answer": "Yes, Mercor states in its tax policy that United States contributors who submit a Form W-9 and earn more than $600 in a year receive a Form 1099-NEC through Stripe by February. Non-US contributors who provide a Form W-8BEN do not receive a Form 1099."
      },
      {
        "question": "How much should I set aside for taxes from AI training work?",
        "answer": "You should set aside enough to cover both self-employment tax and income tax. Self-employment tax takes 15.3% on 92.35% of your net earnings, while federal income tax depends on your overall tax bracket. You can work out how much to save using our guide on [how much to set aside for taxes](/self-employment-tax/how-much-to-set-aside-for-taxes/)."
      }
    ],
    "sources": [IRS_GIG, IRS_SE_TAX, IRS_1099NEC, IRS_1099K, IRS_ES, IRS_SCHED_C],
    "toolHeading": "DataAnnotation tax calculator",
    "toolSubheading": "Estimate your self-employment and income tax liability",
    "preset": {
      "netProfit": 5400,
      "filingStatus": "single",
      "applyQbi": true,
      "incomeLabel": "DataAnnotation profit (gross earnings minus business deductions)",
      "platformNote": "This tool assumes your AI training tasks are carried out as an independent trade or business. Enter your net profit after deducting ordinary business expenses like computer equipment and internet service."
    },
    "relatedSlugs": [
      "upwork-taxes",
      "1099-tax-calculator",
      "how-much-to-set-aside-for-taxes"
    ],
  },
  // ── end dataannotation-taxes ──
  // ── mindmap-pass 2026-10-09 (ai-money): youtube-taxes ──
  {
    "calculator": "self-employment-tax",
    "slug": "youtube-taxes",
    "updated": "2026-10-09",
    "title": "YouTube Taxes: What Creators Owe in 2026",
    "metaDescription": "Calculate your YouTube taxes for 2026. Learn self-employment tax rates, AdSense W-9 withholding rules, 1099 thresholds, and valid deductions.",
    "targetKeyword": "YouTube taxes",
    "estimatedVolume": 210,
    "estimatedKD": 26,
    "h1": "YouTube Taxes: What Creators Owe on Channel Earnings",
    "introText": "[YouTube](https://blog.youtube/creator-and-artist-stories/youtube-partner-program-explained/) earnings count as taxable income starting from the first dollar. If you run your channel regularly to make a profit, it counts as a business. You then owe self-employment tax once net earnings reach $400 for the year, [according to the Internal Revenue Service (IRS)](https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes). You also owe federal income tax on the profit, and ordinary and necessary costs such as equipment, editing software and subscriptions reduce it.\n\nA creator with $9,000 of YouTube revenue and $2,000 of deductible gear, editing software and AI tool subscriptions has $7,000 of profit and owes $989.07 of self-employment tax ($7,000 × 92.35% × 15.3%). At $7,000 of profit and no other income, federal income tax is zero because the profit is below the $16,100 standard deduction.",
    "howItWorks": "Tax reporting starts with the IRS hobby-versus-business evaluation. Under [IRS guidance](https://www.irs.gov/newsroom/heres-how-to-tell-the-difference-between-a-hobby-and-a-business-for-tax-purposes), the IRS lists factors that help decide whether an activity is a business. These factors include keeping businesslike books, the time and effort invested, reliance on the income, changes made to improve profits, creator expertise, past business history, and whether the activity makes a profit in some years. According to [Schedule C instructions](https://www.irs.gov/instructions/i1040sc), an activity qualifies as a trade or business when its primary purpose is income or profit and you carry it on with continuity and regularity. Sporadic activities do not qualify. If your channel is treated as a hobby, you must still report all payments on Schedule 1 (Form 1040), line 8.\n\nWhen your channel operates as a business, you calculate net profit on Schedule C and pay self-employment tax using Schedule SE once net earnings reach $400 or more. The self-employment tax rate is 15.3%, consisting of 12.4% for Social Security and 2.9% for Medicare. As outlined in [IRS Topic 554](https://www.irs.gov/taxtopics/tc554), self-employment tax applies to 92.35% of your net business earnings rather than your total gross revenue. You also deduct one-half of the calculated self-employment tax from your gross income when figuring your adjusted gross income. For the 2025 tax year, the Social Security portion applies up to the $176,100 wage base limit according to [Schedule SE instructions](https://www.irs.gov/instructions/i1040sse). An Additional Medicare Tax of 0.9% applies to earnings above $200,000 for single filers or $250,000 for married couples filing jointly.\n\n[Google](https://support.google.com/youtube/answer/10391362?hl=en) must collect tax information from creators in the YouTube Partner Program. Google does not withhold federal taxes from US creators who provide a valid Form W-9, though creators must resubmit this form if their legal address changes. If you do not supply tax information, individual and business accounts in the United States face backup withholding at a mandatory 24% rate applied to total worldwide earnings. Non-US creators who submit a Form W-8 face withholding of 0% to 30% on earnings from US viewers, depending on tax-treaty status. Non-US business accounts without tax info default to 30% of US earnings. Google sets a submission deadline of December 10 each year, and submitted tax profiles expire after the third full calendar year following the signature date.\n\nAt tax time, [Google's YouTube help](https://support.google.com/youtube/answer/10390801?hl=en) lists Form 1099-MISC, Form 1099-K and Form 1042-S as year-end forms, but it does not say which form applies to which creator. You must check the form you actually receive rather than assuming a single form type. Under [IRS 1099 instructions](https://www.irs.gov/instructions/i1099mec), the threshold for Form 1099-NEC nonemployee compensation and Form 1099-MISC rents and other income rises to $2,000 for tax years beginning after 2025, though Form 1099-MISC box 2 for royalties stays at $10. Payment processors like [PayPal report transactions](https://www.paypal.com/us/cshelp/article/current-form-1099-k-reporting-thresholds-2025-update-help1131) on Form 1099-K only when gross payments exceed $20,000 and 200 transactions, matching [IRS 1099-K guidance](https://www.irs.gov/newsroom/irs-issues-faqs-on-form-1099-k-threshold-under-the-one-big-beautiful-bill-dollar-limit-reverts-to-20000). None of these information thresholds alter your legal obligation to report and pay tax on every dollar earned.\n\nTo lower net profit on Schedule C, claim all [deductible business expenses](https://www.irs.gov/faqs/small-business-self-employed-other-business/income-expenses). The IRS requires business write-offs to be ordinary, meaning common and accepted in your line of work, and necessary, meaning helpful and appropriate for the business. Personal and family expenses remain non-deductible. According to [IRS rules for deducting expenses](https://www.irs.gov/businesses/small-businesses-self-employed/deducting-business-expenses), equipment depreciation is handled following Publication 946 and reported on Form 4562. Monthly subscriptions for video editing tools and software used to manage channel content qualify as current operational deductions. If you produce videos for a [faceless YouTube channel with AI](/guides/faceless-youtube-channel-ai/), AI tool subscriptions used for the channel count as deductible business expenses.\n\nA dedicated production workspace may also qualify for the [home office deduction](https://www.irs.gov/businesses/small-businesses-self-employed/home-office-deduction). To claim this write-off, you must use a specific area of your home exclusively and regularly as your principal place of business. Under the [simplified home office option](https://www.irs.gov/businesses/small-businesses-self-employed/simplified-option-for-home-office-deduction), you can deduct $5 per square foot for up to 300 square feet of dedicated working space, providing a standard maximum deduction of $1,500. Creators using the regular method instead calculate their deduction on Form 8829.\n\nBecause YouTube does not withhold taxes from US creators who file a W-9, you must make [quarterly estimated tax payments](https://www.irs.gov/forms-pubs/about-form-1040-es) throughout the year. As noted in [IRS estimated tax rules](https://www.irs.gov/faqs/estimated-tax), you must generally make quarterly payments using Form 1040-ES if you expect to owe at least $1,000 in federal tax after subtracting withholding and credits. To avoid underpayment penalties, you can satisfy safe harbor rules by paying the smaller of 90% of your current-year tax or 100% of your prior-year tax, which increases to 110% if your prior-year adjusted gross income exceeded $150,000. Quarterly payments are due April 15, June 15, September 15, and January 15 of the following year, shifting to the next business day if a date falls on a weekend or legal holiday. Creators balancing multiple platforms can review our [Twitch taxes guide](/self-employment-tax/twitch-taxes/) to compare income reporting across live video streaming.\n\nMoney you earn from Whop clipping campaigns goes on the same Schedule C as your YouTube income. Our guide to [Whop clipping pay](/guides/whop-clipping/) explains how those campaigns pay per 1,000 views.",
    "commonMistakes": [
      ...UNIVERSAL_MISTAKES,
      "Ignoring the Google tax profile submission until backup withholding deducts 24% from your worldwide earnings automatically.",
      "Deducting gear used mostly for personal life without splitting the business share.",
      "Assuming sponsorships or brand deals received outside Google AdSense are not reportable income on your tax return.",
    ],
    "workedExample": "A creator earns $9,000 of gross YouTube revenue and claims $2,000 of deductible gear, editing software and AI tool subscriptions, leaving $7,000 of net profit. Self-employment tax applies to 92.35% of that profit ($6,464.50) at the 15.3% rate, resulting in $989.07 of self-employment tax. Because the $7,000 profit remains below the $16,100 standard deduction, federal income tax is zero if the creator has no other income. If that creator also earns a $60,000 salary, the YouTube profit is added on top of the wages and taxed at the creator's top marginal rate. Enter the wages in the calculator above to see that figure.",
    "faqs": [
      {
        "question": "Do you pay taxes on income from YouTube?",
        "answer": "Yes, every dollar of income earned from YouTube is taxable. If your channel runs as a business and you reach $400 or more in net profit, you must file Schedule SE to pay self-employment tax alongside standard income tax."
      },
      {
        "question": "Do I have to file taxes if I only made $5,000 on YouTube?",
        "answer": "Yes, if the $5,000 is profit from a channel you run as a business. The IRS threshold requiring self-employed individuals to file and pay self-employment tax is $400 in net earnings, meaning $5,000 of YouTube profit requires filing Schedule C and Schedule SE."
      },
      {
        "question": "Does Google withhold taxes from YouTube payments?",
        "answer": "Google does not withhold federal tax on earnings for US creators who submit a valid Form W-9. If a US creator fails to provide valid tax documentation, Google must apply 24% backup withholding to their worldwide earnings."
      },
      {
        "question": "What tax form does YouTube send?",
        "answer": "Google lists Form 1099-MISC, Form 1099-K, and Form 1042-S as year-end forms. Google's documentation does not specify which form each creator receives, so check the form you actually receive."
      },
      {
        "question": "What can YouTubers deduct?",
        "answer": "Creators operating as a business can deduct ordinary and necessary expenses, including video editing tools, software subscriptions, and equipment depreciated under IRS rules. You can also claim a qualifying home office used regularly and exclusively for channel production."
      }
    ],
    "sources": [IRS_GIG, IRS_SE_TAX, IRS_1099NEC, IRS_1099K, IRS_ES, IRS_SCHED_C],
    "toolHeading": "YouTube tax calculator",
    "toolSubheading": "Estimate self-employment tax on channel profit",
    "preset": {
      "netProfit": 7000,
      "filingStatus": "single",
      "applyQbi": true,
      "incomeLabel": "YouTube profit (revenue minus business expenses)",
      "platformNote": "This calculation assumes your YouTube channel operates as a business. If the IRS treats your channel as a hobby, you report the income on Schedule 1 (Form 1040), line 8."
    },
    "relatedSlugs": [
      "twitch-taxes",
      "1099-tax-calculator",
      "how-much-to-set-aside-for-taxes"
    ],
  },
  // ── end youtube-taxes ──
];
