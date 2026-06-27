import type { SpokeEntry } from "./types";

// AutoIQ (auto-loan) spokes — the Wave-1, highest-winnability cluster.
// CONTENT PROVENANCE: written via the keyword-gap content system — a guided research+write pass
// (web-researched against CFPB / Experian primary sources, using the calculator's real engine
// output as ground-truth figures) followed by a dedicated adversarial audit subagent per page.
// See CONTENT.md. All five are powered by the same pure engine (src/lib/auto-loan.ts).
//
// NOTE: "lease vs loan" from the plan is deferred to Phase 2 — it needs lease math the engine lacks.

export const AUTO_SPOKES: SpokeEntry[] = [
  {
    calculator: "auto-loan",
    slug: "payoff-calculator",
    title: "Auto Loan Payoff Calculator: See Your Payoff Date Fast",
    metaDescription:
      "Use our free auto loan payoff calculator to find your payoff date and see how much extra payments save in interest. Get instant, accurate results.",
    targetKeyword: "auto loan payoff calculator",
    estimatedVolume: 8100,
    estimatedKD: 48,
    h1: "Auto Loan Payoff Calculator",
    intro:
      "This auto loan payoff calculator shows exactly when your car loan will be paid off and how much faster extra payments get you there. Enter your balance, rate, term, and any extra monthly amount in the calculator above. It then maps your payoff date and the interest you save. Use it to test a plan before you commit a dollar.",
    howItWorks:
      "An auto loan payoff calculator works by recreating your loan's monthly schedule, called an amortization schedule. Each month, interest is charged on your remaining balance first. Whatever is left from your payment then reduces the principal you owe. Because the balance shrinks over time, more of each payment goes to principal as the loan ages.\n\nExtra money you add is applied straight to the principal balance, which is the key to paying off sooner. A smaller balance means less interest charged next month. That compounding effect is why even a modest extra payment can erase months from your term. Want a deeper breakdown? Open the full [auto loan amortization schedule](/auto-loan/amortization-schedule/).",
    commonMistakes: [
      "Assuming your extra payment automatically reduces principal. The CFPB notes lenders apply payments to fees and interest first. Some servicers hold the extra and apply it to your next scheduled payment unless you tell them in writing to apply it to principal.",
      "Forgetting to check for a prepayment penalty. Auto loans can carry one, especially on terms under five years. Review your contract and Truth in Lending disclosures before making a large lump-sum payment.",
      "Overlooking precomputed interest. On these less common loans, interest is set upfront, so paying early saves far less. You may only get a partial refund of unearned interest.",
      "Confusing the payoff amount with your statement balance. The true payoff quote includes interest accrued to the exact payoff date and any fees, so it can differ from the number on your bill.",
      "Draining your emergency savings to pay off the car. Keep a cash cushion before sending every spare dollar to a low-rate loan.",
    ],
    workedExample:
      "Say you owe $30,000 at 7.5% APR on a 60-month loan. Your scheduled payment is $601.14, and you would pay $6,068 in interest over the full term. Now add $100 a month toward principal. In month one, $187.50 covers interest and $513.64 cuts your balance. With that extra applied every month, you pay only $5,019 in interest and clear the loan in 50 months. That is $1,050 saved and 10 months gone. Test your own numbers with the [extra payment calculator](/auto-loan/extra-payment-calculator/).",
    faqs: [
      {
        question: "How does an auto loan payoff calculator work?",
        answer:
          "An auto loan payoff calculator builds your loan's month-by-month schedule to show your payoff date and total interest. It charges interest on your balance first, then applies the rest of your payment to principal. Adding an extra amount lowers the balance faster, which shortens the term. See the live results in the calculator above.",
      },
      {
        question: "Does paying off a car loan early save money?",
        answer:
          "Yes, on a simple-interest loan, paying early saves real money because interest is charged only on your remaining balance. A smaller balance means less interest every month. On a rare precomputed-interest loan, the savings are limited because interest was set at the start. Check your loan documents to confirm which type you have.",
      },
      {
        question: "Do auto loans have prepayment penalties?",
        answer:
          "Some do, so check before you pay extra. The CFPB confirms auto loans can carry prepayment penalties, more often on terms under five years. Read your contract and Truth in Lending disclosures, or ask your lender directly. If your loan has no penalty, paying ahead is free and only saves you interest.",
      },
      {
        question: "How do I make sure extra payments go to principal?",
        answer:
          "Tell your lender in writing to apply any extra amount to principal. The CFPB explains that payments cover fees and interest first by default. Without instructions, some servicers credit the extra toward your next scheduled payment instead. Then check your statement to confirm the payment was applied correctly.",
      },
      {
        question: "Does paying off a car loan early hurt my credit?",
        answer:
          "Paying off a car loan early rarely hurts your credit in any lasting way. You may see a small, temporary dip because an active installment account closes. Your payment history stays on your report and continues to help. The benefit of being debt-free almost always outweighs a minor short-term change.",
      },
    ],
    sources: [
      { label: "CFPB — Is it better to pay off interest or principal on my auto loan?", url: "https://www.consumerfinance.gov/ask-cfpb/is-it-better-to-pay-off-the-interest-or-principal-on-my-auto-loan-en-845/" },
      { label: "CFPB — Can I prepay my loan at any time without penalty?", url: "https://www.consumerfinance.gov/ask-cfpb/can-i-prepay-my-loan-at-any-time-without-penalty-en-843/" },
      { label: "CFPB — Simple interest vs. precomputed interest on an auto loan", url: "https://www.consumerfinance.gov/ask-cfpb/whats-the-difference-between-a-simple-interest-rate-and-precomputed-interest-on-an-auto-loan-en-841/" },
    ],
    toolHeading: "Calculate your auto loan payoff",
    toolSubheading: "Add an extra monthly payment to see your new payoff date and interest saved.",
    preset: { vehiclePrice: 30000, downPayment: 0, interestRatePct: 7.5, loanTermMonths: 60, extraMonthlyPayment: 100 },
    relatedSlugs: ["extra-payment-calculator", "early-payoff-calculator", "amortization-schedule", "interest-calculator"],
  },

  {
    calculator: "auto-loan",
    slug: "extra-payment-calculator",
    title: "Auto Loan Extra Payment Calculator: Interest Savings",
    metaDescription:
      "Use this auto loan extra payment calculator to see how much extra monthly payments save you in interest and how many months they cut from your car loan.",
    targetKeyword: "auto loan extra payment calculator",
    estimatedVolume: 1300,
    estimatedKD: 40,
    h1: "Auto Loan Extra Payment Calculator",
    intro:
      "This auto loan extra payment calculator shows how much adding extra to your monthly car payment saves in interest and time. Enter your balance, rate, term, and a recurring extra amount in the calculator above. It instantly compares your original payoff to a faster one. You see your total interest saved and the months you shave off your loan.",
    howItWorks:
      "Extra payments work by reducing your loan principal, which is the amount you still owe. On a simple-interest auto loan, interest is charged on your outstanding balance each day or month. So a smaller balance means less interest going forward. The calculator above takes your scheduled payment and adds your extra amount, applying the full extra to principal. It then rebuilds your payoff schedule month by month.\n\nThe savings compound over time. Each extra dollar cuts the balance, so the next month's interest is a little lower. That frees up even more of your normal payment to attack principal, speeding up the loan with every cycle. To compare a one-time lump sum instead, try the [auto loan payoff calculator](/auto-loan/payoff-calculator/).",
    commonMistakes: [
      "Not telling your lender to apply the extra money to principal. The CFPB notes lenders may instead treat it as your next payment, so request principal in writing and check your statement.",
      "Skipping the prepayment penalty check. Some auto contracts charge a fee for paying early, so review your loan documents and state law first.",
      "Assuming a precomputed-interest loan rewards extra payments. With precomputed interest, extra payments do not reduce the interest owed, so confirm you have a simple-interest loan.",
      "Waiting until late in the term to pay extra. Early principal payments save the most interest because more of your balance is still accruing.",
      "Spreading small amounts thin instead of a single lump sum. One lump sum applied early beats the same total dribbled in late.",
    ],
    workedExample:
      "Say you owe $25,000 at 8% APR on a 72-month auto loan. Your scheduled payment is $438.33. In the first month, $166.67 goes to interest and $346.66 goes to principal once your $75 extra is applied. By keeping up that extra $75 every month, you pay only $5,328 in total interest. You also clear the loan in 60 months instead of 72. That is $1,232 saved in interest and 12 months off your term.",
    faqs: [
      {
        question: "How much do extra payments save on a car loan?",
        answer:
          "Extra payments save both interest and time on a car loan. On a $25,000 loan at 8% APR over 72 months, adding $75 a month cuts total interest to $5,328. That saves $1,232 in interest and pays the loan off 12 months early. Use the auto loan extra payment calculator above to run your own numbers.",
      },
      {
        question: "Do I have to tell my lender to apply extra payments to principal?",
        answer:
          "Yes, in most cases you should. The CFPB says you may need to request that your lender apply extra money to principal rather than your next payment. Make the request in writing and check your next statement to confirm the principal dropped.",
      },
      {
        question: "Will I pay a penalty for paying my auto loan off early?",
        answer:
          "It depends on your contract and state law. The CFPB explains that some auto loans carry a prepayment penalty to offset lost interest, while some states ban them. Review your loan documents before making large extra payments.",
      },
      {
        question: "Are biweekly payments better than monthly extra payments?",
        answer:
          "Biweekly payments can help in a quiet way. Paying half your payment every two weeks adds up to 26 half-payments, which equals 13 full monthly payments a year instead of 12. That extra payment goes straight to principal and shortens your loan.",
      },
      {
        question: "Does extra payment timing matter on a simple-interest loan?",
        answer:
          "Yes. On a simple-interest auto loan, interest is charged on your balance each day or month, so paying extra earlier reduces interest more. A lump sum applied early in the term saves more than the same amount spread out near the end.",
      },
    ],
    sources: [
      { label: "CFPB — Is it better to pay off interest or principal on my auto loan?", url: "https://www.consumerfinance.gov/ask-cfpb/is-it-better-to-pay-off-the-interest-or-principal-on-my-auto-loan-en-845/" },
      { label: "CFPB — Simple interest vs. precomputed interest on an auto loan", url: "https://www.consumerfinance.gov/ask-cfpb/whats-the-difference-between-a-simple-interest-rate-and-precomputed-interest-on-an-auto-loan-en-841/" },
      { label: "CFPB — Can I prepay my loan at any time without penalty?", url: "https://www.consumerfinance.gov/ask-cfpb/can-i-prepay-my-loan-at-any-time-without-penalty-en-843/" },
    ],
    toolHeading: "How much will extra payments save?",
    toolSubheading: "Enter your loan, then add an extra monthly amount to see the savings.",
    preset: { vehiclePrice: 25000, downPayment: 0, interestRatePct: 8, loanTermMonths: 72, extraMonthlyPayment: 75 },
    relatedSlugs: ["payoff-calculator", "early-payoff-calculator", "amortization-schedule", "interest-calculator"],
  },

  {
    calculator: "auto-loan",
    slug: "early-payoff-calculator",
    title: "Pay Off Car Loan Early Calculator: Interest & Time Saved",
    metaDescription:
      "Use our pay off car loan early calculator to see how extra payments cut your interest and shorten your loan. Free, instant results with a real example.",
    targetKeyword: "pay off car loan early calculator",
    estimatedVolume: 1000,
    estimatedKD: 38,
    h1: "Pay Off Car Loan Early Calculator",
    intro:
      "This pay off car loan early calculator shows how much interest and time you save by adding extra to each car payment. Enter your balance, APR, term, and a monthly extra amount in the calculator above. It instantly returns your new payoff date and total interest savings. Use it to decide whether paying your car loan off early is worth it for you.",
    howItWorks:
      "The calculator estimates your savings by applying your extra payment straight to the loan principal each month. A smaller principal means less interest accrues, so the loan ends sooner. It compares your original schedule against the faster one and reports the gap in dollars and months. Because most of each early payment goes to interest, attacking the principal early has the biggest effect.",
    commonMistakes: [
      "Draining your emergency fund to pay the loan off early. Experian lists this as a reason to wait, since you may need cash for surprises.",
      "Paying off a low-rate car loan while carrying high-rate credit card debt. Pay the highest-rate balance first, where average card APRs far exceed auto rates.",
      "Skipping the prepayment penalty check. The CFPB notes some contracts charge a fee for early payoff, which can erase your savings.",
      "Assuming extra cash always lowers the principal. Tell your lender to apply extra money to principal, not toward your next scheduled payment.",
      "Ignoring a precomputed-interest loan. With these, interest is set upfront, so early payoff may save less than a simple-interest loan.",
    ],
    workedExample:
      "Say you owe $18,000 at 6.5% APR with 36 months left. Your scheduled payment is $551.68 a month. Add $200 extra and your first month puts $654.18 toward principal and just $97.50 toward interest. Keep it up and you pay the loan off in 26 months, about 2 years and 2 months. Total interest drops to $1,332. That saves you $529 in interest and 10 months of payments.",
    faqs: [
      {
        question: "Is using a pay off car loan early calculator worth it?",
        answer:
          "Yes. It shows your exact interest and time savings before you commit extra cash. In our example, $200 extra each month saves $529 in interest and clears the loan 10 months sooner. Seeing real numbers helps you weigh early payoff against other goals.",
      },
      {
        question: "Does paying off a car loan early hurt your credit?",
        answer:
          "It may cause a small, temporary dip. Experian says paying off a car loan early can drop your score for a few months because it reduces your open accounts and credit mix. The dip usually fades, and reducing debt helps you long term.",
      },
      {
        question: "Should I pay off my car loan early or invest instead?",
        answer:
          "Compare your loan APR to what a safe investment earns. If your car loan rate is higher than a guaranteed return like a high-yield savings account, paying it off often wins. If the rate is very low, investing may grow your money faster.",
      },
      {
        question: "Will I be charged a fee for paying my car loan off early?",
        answer:
          "Sometimes. The CFPB says some auto loan contracts include a prepayment penalty to discourage early payoff. Check your loan agreement or ask your lender before making large extra payments, since a fee can reduce your savings.",
      },
      {
        question: "Where should I make extra payments go on my loan?",
        answer:
          "Direct extra money to your principal. The CFPB explains that paying down principal faster lowers the interest you owe. Tell your lender or servicer to apply the extra amount to principal, not toward your next scheduled payment.",
      },
    ],
    sources: [
      { label: "CFPB — Can I prepay my loan at any time without penalty?", url: "https://www.consumerfinance.gov/ask-cfpb/can-i-prepay-my-loan-at-any-time-without-penalty-en-843/" },
      { label: "CFPB — Is it better to pay off interest or principal on my auto loan?", url: "https://www.consumerfinance.gov/ask-cfpb/is-it-better-to-pay-off-the-interest-or-principal-on-my-auto-loan-en-845/" },
      { label: "Experian — Does paying off a car loan early hurt your credit?", url: "https://www.experian.com/blogs/ask-experian/does-paying-off-a-car-loan-early-hurt-your-credit/" },
    ],
    toolHeading: "Should you pay off your car early?",
    toolSubheading: "Enter your remaining balance as the price, set down payment to $0, and add an extra payment.",
    preset: { vehiclePrice: 18000, downPayment: 0, interestRatePct: 6.5, loanTermMonths: 36, extraMonthlyPayment: 200 },
    relatedSlugs: ["payoff-calculator", "extra-payment-calculator", "amortization-schedule", "interest-calculator"],
  },

  {
    calculator: "auto-loan",
    slug: "amortization-schedule",
    title: "Auto Loan Amortization Calculator & Schedule",
    metaDescription:
      "Use this free auto loan amortization calculator to see a month-by-month schedule of principal, interest, and balance. Know exactly where each payment goes.",
    targetKeyword: "auto loan amortization calculator",
    estimatedVolume: 1600,
    estimatedKD: 44,
    h1: "Auto Loan Amortization Calculator",
    intro:
      "This auto loan amortization calculator shows exactly how each car payment splits between principal and interest. Enter your loan amount, rate, and term, and the calculator above builds a full month-by-month schedule. You will see your balance drop, payment by payment, until it reaches zero. The early rows reveal a fact most drivers miss: at first, most of your money pays interest, not the car.",
    howItWorks:
      "Amortization means paying off a loan with fixed payments that slowly shrink what you owe. Each month, the lender first charges interest on your current balance. Your monthly rate is simply the APR divided by 12. Whatever is left of your payment then reduces the principal. Because your balance is highest at the start, early payments are mostly interest. As the balance falls, less interest accrues, so more of each fixed payment attacks the principal. By the final year, nearly every dollar goes to principal. The calculator above runs this math for all 60 months and lists each line for you.",
    commonMistakes: [
      "Assuming each payment splits principal and interest evenly. Early payments are interest-heavy; the balance barely moves at first.",
      "Confusing APR with your monthly rate. The monthly periodic rate is the APR divided by 12, not the full APR.",
      "Selling or refinancing early and expecting big equity. Since early payments are mostly interest, you owe more than you think.",
      "Ignoring how extra payments reshape the schedule. A single extra payment cuts principal now and erases interest from the back-end months.",
      "Watching only the monthly payment, not the total of payments. A low payment can still hide thousands in total interest.",
    ],
    workedExample:
      "Take a $35,000 car loan at 7.5% APR over 60 months. The calculator above sets your monthly payment at $701.33. In month 1, $218.75 of that goes to interest and only $482.58 goes to principal. As the loan ages, that mix flips: each payment shifts more toward principal, and by the final year nearly all of it pays down the car. Over the full term you pay $7,080 in interest, making the total of payments $42,080.",
    faqs: [
      {
        question: "What is an auto loan amortization calculator?",
        answer:
          "An auto loan amortization calculator builds a month-by-month schedule showing how each car payment splits between principal and interest, plus your remaining balance. The calculator above generates the full table once you enter your loan amount, rate, and term.",
      },
      {
        question: "Why is most of my early car payment interest?",
        answer:
          "Interest is charged on your current balance, which is highest at the start. So early payments cover mostly interest. As the CFPB explains, more of your payment goes to principal over time as the balance falls. On a $35,000 loan at 7.5%, month 1 is $218.75 interest and $482.58 principal.",
      },
      {
        question: "How is the monthly interest rate calculated?",
        answer:
          "Your monthly periodic rate equals the APR divided by 12. At a 7.5% APR, that is about 0.625% charged on your balance each month. The lender applies this rate before splitting your fixed payment into interest and principal.",
      },
      {
        question: "How does an extra payment change my amortization schedule?",
        answer:
          "An extra payment goes straight to principal, lowering your balance immediately. That reduces the interest charged on every future month and erases payments from the back of the schedule. Try our [extra payment calculator](/auto-loan/extra-payment-calculator/) to see the savings.",
      },
      {
        question: "Why do I owe so much if I sell my car early?",
        answer:
          "Because early payments are mostly interest, your principal drops slowly at first. After a year or two, your remaining balance is higher than you might expect. Check the schedule above before you sell or refinance early.",
      },
    ],
    sources: [
      { label: "CFPB — What is amortization and how could it affect my auto loan?", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-amortization-and-how-could-it-affect-my-auto-loan-en-771/" },
      { label: "CFPB — What is negative amortization?", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-negative-amortization-en-103/" },
    ],
    toolHeading: "Generate your amortization schedule",
    toolSubheading: "Enter your loan to see the full month-by-month principal and interest breakdown.",
    preset: { vehiclePrice: 35000, downPayment: 0, interestRatePct: 7.5, loanTermMonths: 60, extraMonthlyPayment: 0 },
    relatedSlugs: ["payoff-calculator", "extra-payment-calculator", "early-payoff-calculator", "interest-calculator"],
  },

  {
    calculator: "auto-loan",
    slug: "interest-calculator",
    title: "Auto Loan Interest Calculator: Total Interest in 2026",
    metaDescription:
      "Use our auto loan interest calculator to see total interest by rate, term, and down payment. See how a longer loan quietly costs you more.",
    targetKeyword: "auto loan interest calculator",
    estimatedVolume: 880,
    estimatedKD: 36,
    h1: "Auto Loan Interest Calculator: See What Your Car Loan Really Costs",
    intro:
      "An auto loan interest calculator shows the total interest you will pay on a car loan over its full term. Enter your loan amount, APR, and term in the calculator above to see your monthly payment and lifetime interest in seconds. For example, a $30,000 loan at 7.5% APR over 60 months costs $6,068 in total interest. That brings the total of all payments to $36,068.",
    howItWorks:
      "The calculator multiplies your loan balance by your APR each month, then splits every payment into interest and principal. Early on, more of each payment goes to interest, and less to paying down the loan. With a $30,000 loan at 7.5% APR, the very first payment of $601.14 includes $187.50 in interest and $413.64 in principal. The term you pick changes the math more than most buyers expect. That same $30,000 loan at 7.5% costs $6,068 in interest over 60 months, but $7,347 over 72 months. The 72-month loan lowers your payment to $518.70, yet it costs $1,278 more in interest. A lower monthly payment can hide a higher total cost.",
    commonMistakes: [
      "Shopping only by monthly payment. A smaller payment often means a longer term and more total interest, as the 60-vs-72-month gap of $1,278 shows.",
      "Confusing interest rate with APR. The CFPB notes APR includes the interest rate plus lender fees, so always compare APR to APR.",
      "Ignoring how the down payment shrinks interest. A larger down payment lowers the financed amount, so you pay interest on a smaller balance.",
      "Assuming the dealer's first quote is your best rate. The CFPB suggests getting preapproved and comparing offers from several lenders.",
      "Stretching the term just to afford a pricier car, which can leave you owing more than the vehicle is worth.",
    ],
    workedExample:
      "Say you buy a $35,000 vehicle and put $5,000 down. You finance $30,000 at 7.5% APR over 60 months. The calculator shows a monthly payment of $601.14. Your first payment splits into $187.50 of interest and $413.64 of principal. Over the full 60 months, you pay $6,068 in interest, for a total of $36,068. Stretch that same loan to 72 months and the payment drops to $518.70, but total interest climbs to $7,347. The longer term costs you $1,278 more.",
    faqs: [
      {
        question: "What does an auto loan interest calculator tell me?",
        answer:
          "An auto loan interest calculator tells you the total interest you will pay over the life of your loan. It also shows your monthly payment and how each payment splits between interest and principal. For a $30,000 loan at 7.5% APR over 60 months, total interest is $6,068.",
      },
      {
        question: "How does the loan term change my total interest?",
        answer:
          "A longer term lowers your monthly payment but raises your total interest. A $30,000 loan at 7.5% costs $6,068 in interest over 60 months, but $7,347 over 72 months. That longer term saves about $82 per month yet costs $1,278 more overall.",
      },
      {
        question: "What is the difference between APR and interest rate?",
        answer:
          "The interest rate is the cost of borrowing the principal. APR is the interest rate plus lender fees, such as origination charges, per the CFPB. APR is always equal to or higher than the interest rate, so compare APR to APR when shopping.",
      },
      {
        question: "What is the average auto loan rate in 2026?",
        answer:
          "Rates change often, but Experian's mid-2025 data showed about 6.8% APR for new cars and 11.5% for used cars. Your own rate depends mostly on your credit score. Use the calculator above with a quote that fits your credit.",
      },
      {
        question: "How can I pay less interest on my car loan?",
        answer:
          "Put more money down, choose the shortest term you can afford, and shop multiple lenders for a lower APR. You can also pay the loan off faster. Try our [extra payment calculator](/auto-loan/extra-payment-calculator/) or [early payoff calculator](/auto-loan/early-payoff-calculator/) to see the savings.",
      },
    ],
    sources: [
      { label: "CFPB — What is the difference between a loan interest rate and the APR?", url: "https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-loan-interest-rate-and-the-apr-en-733/" },
      { label: "CFPB — How do I compare auto loan offers?", url: "https://www.consumerfinance.gov/ask-cfpb/how-do-i-compare-auto-loan-offers-what-should-i-look-at-besides-the-monthly-payment-en-753/" },
      { label: "Experian — Auto Loan Rates and Financing", url: "https://www.experian.com/blogs/ask-experian/auto-loan-rates-financing/" },
    ],
    toolHeading: "How much interest will you pay?",
    toolSubheading: "Enter your loan to see total interest, then try different rates and terms.",
    preset: { vehiclePrice: 35000, downPayment: 5000, interestRatePct: 7.5, loanTermMonths: 60, extraMonthlyPayment: 0 },
    relatedSlugs: ["payoff-calculator", "amortization-schedule", "extra-payment-calculator", "early-payoff-calculator"],
  },

  {
    calculator: "auto-loan",
    slug: "car-affordability-calculator",
    title: "Car Affordability Calculator: How Much Car Can I Afford?",
    metaDescription:
      "Use our car affordability calculator to turn a monthly budget into a real price. See how much car you can afford, plus the 20/4/10 rule explained.",
    targetKeyword: "car affordability calculator",
    estimatedVolume: 6600,
    estimatedKD: 39,
    h1: "Car Affordability Calculator: How Much Car Can I Afford?",
    islandId: "affordability",
    intro:
      "This car affordability calculator works backward from your monthly budget to the car price you can actually buy. Enter your target payment, down payment, APR, and loan term, and the calculator above estimates your max price and loan amount. It answers the real question: how much car can I afford without straining my budget? Remember, the sticker price you can finance is not your true cost.",
    howItWorks:
      "The calculator above starts with the monthly payment you choose, not a car price. It adds your down payment and uses your APR and loan term to find the largest loan that fits that payment. Then it shows the top car price within reach.\n\nA popular rule of thumb is the 20/4/10 rule: put 20% down, finance for no more than 4 years, and keep total vehicle costs at or below 10% of your gross income. Treat it as a guideline, not a hard limit. The CFPB also stresses adding insurance, taxes, registration, fuel, and maintenance on top of your loan payment. Once you settle on a price, see the [auto loan interest calculator](/auto-loan/interest-calculator/) for the true cost of borrowing, or the [auto loan payoff calculator](/auto-loan/payoff-calculator/) to plan an early payoff.",
    commonMistakes: [
      "Budgeting only for the loan payment. Insurance, fuel, registration, taxes, and maintenance stack on top and can rival the payment itself.",
      "Stretching the loan term to 72 or 84 months to lower the payment. A longer term lets you afford a pricier car but costs far more interest.",
      "Confusing the financed sticker price with your true budget. The price the calculator shows does not include ongoing ownership costs.",
      "Skipping a down payment. A small or zero down payment raises the loan amount and the risk of owing more than the car is worth.",
      "Using an optimistic APR. Your real rate depends on your credit, so confirm offers before trusting the affordability estimate.",
    ],
    workedExample:
      "Say your monthly payment budget is $450, you have $3,000 to put down, no trade-in, a 7.5% APR, and a 60-month loan. The calculator above estimates a max car price of about $25,457, made up of your $3,000 down payment plus a loan of about $22,457. Over the full 60 months you would pay about $4,543 in interest, and your total of payments would be $27,000. That interest is the real cost of borrowing, and a longer term would push it higher.",
    faqs: [
      { question: "How much car can I afford on my budget?", answer: "Start with the monthly payment you can comfortably handle, then use the car affordability calculator above to convert it into a price. For example, a $450 payment, $3,000 down, 7.5% APR, and a 60-month term supports a car price of about $25,457. Always leave room for insurance, fuel, and maintenance." },
      { question: "What is the 20/4/10 rule for buying a car?", answer: "The 20/4/10 rule is a budgeting rule of thumb: put 20% down, finance for no more than 4 years, and keep total vehicle expenses at or below 10% of your gross monthly income. The 10% covers your payment, insurance, fuel, and maintenance combined. It is a guideline, not a strict requirement." },
      { question: "Does the financed price include all the costs of owning a car?", answer: "No. The car price you can finance is only part of the picture. The CFPB notes that taxes, registration, insurance, fuel, and maintenance add to your true cost of ownership. Budget for these on top of your loan payment so the car stays affordable." },
      { question: "Does a longer loan term let me afford more car?", answer: "Yes, but it costs you. A longer term lowers the monthly payment, so you can finance a pricier car for the same budget. However, you pay far more interest over time, and the CFPB warns that long loans raise the risk of owing more than the car is worth. Compare terms with our [auto loan calculator](/auto-loan/)." },
      { question: "How big a down payment should I make?", answer: "A larger down payment lowers your loan amount, your monthly payment, and your total interest. The CFPB lists a down payment and a trade-in as factors that reduce how much you need to borrow. The 20/4/10 rule of thumb suggests aiming for about 20% down." },
    ],
    sources: [
      { label: "CFPB — How much can I afford to borrow for a car or auto loan?", url: "https://www.consumerfinance.gov/ask-cfpb/how-much-can-i-afford-to-borrow-for-a-car-or-auto-loan-en-751/" },
      { label: "CFPB — How do I compare auto loan offers?", url: "https://www.consumerfinance.gov/ask-cfpb/how-do-i-compare-auto-loan-offers-what-should-i-look-at-besides-the-monthly-payment-en-753/" },
    ],
    toolHeading: "How much car can you afford?",
    toolSubheading: "Enter your monthly budget — the tool works backward to a car price.",
    preset: { kind: "car", monthlyBudget: 450, downPayment: 3000, tradeInValue: 0, interestRatePct: 7.5, loanTermMonths: 60 },
    relatedSlugs: ["payoff-calculator", "interest-calculator", "extra-payment-calculator", "amortization-schedule"],
  },
];
