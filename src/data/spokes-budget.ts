import type { SpokeEntry } from "./types";

// Budget spokes. Powered by src/lib/budget.ts (50/30/20 + zero-based). CONTENT: guided research+write
// (CFPB / Warren "All Your Worth" / Ramsey EveryDollar as primary frameworks; engine ground-truth
// targets) + adversarial audit per page. See CONTENT.md. The 50/30/20 split is after-tax income.

export const BUDGET_SPOKES: SpokeEntry[] = [
  {
    calculator: "budget",
    slug: "50-30-20-budget-calculator",
    title: "50/30/20 Budget Calculator: Split Your Paycheck",
    metaDescription:
      "Free 50/30/20 budget calculator. Enter your take-home pay to split it into 50% needs, 30% wants, and 20% savings — with targets and over/under flags.",
    targetKeyword: "50 30 20 budget calculator",
    estimatedVolume: 4200,
    estimatedKD: 36,
    h1: "50/30/20 Budget Calculator",
    intro:
      "The 50/30/20 budget calculator splits your after-tax income into three buckets: 50% for needs, 30% for wants, and 20% for savings and debt payoff. Enter your monthly take-home pay and spending in the calculator above to see your target for each bucket and where you're running over. On a $6,000 monthly take-home income, the rule sets $3,000 for needs, $1,800 for wants, and $1,200 for savings.",
    howItWorks:
      "The 50/30/20 rule comes from Senator Elizabeth Warren and Amelia Warren Tyagi's book All Your Worth. It works off your after-tax income — the money that actually hits your account — and divides it three ways.\n\nNeeds (50%) are the costs you can't skip: housing, utilities, groceries, transportation, insurance, and minimum debt payments. Wants (30%) are lifestyle spending: dining out, streaming, hobbies, and travel. Savings (20%) covers your emergency fund, retirement and investing, and any extra debt payoff above the minimum. The most common mistake is putting all debt payments in the 20% bucket — only the extra above your minimums belongs there; the minimums are needs. If your needs run above 50%, which is common in high-cost cities, the rule still helps by showing exactly how much that squeezes your wants and savings.",
    commonMistakes: [
      "Budgeting off gross (pre-tax) income instead of take-home pay — the rule is built on after-tax dollars.",
      "Putting full debt payments in the 20% savings bucket. Only extra payoff above the minimum counts there; minimum payments are needs.",
      "Misclassifying wants as needs. A phone plan is a need; the premium unlimited tier is partly a want.",
      "Treating 50/30/20 as rigid. In expensive areas needs often exceed 50% — the fix is a smaller wants bucket, not abandoning the plan.",
      "Forgetting irregular costs like annual insurance or car repairs. Divide them by 12 and budget a monthly slice.",
    ],
    workedExample:
      "Take a household with $6,000 in monthly take-home pay. The 50/30/20 rule sets three targets: $3,000 for needs (housing, utilities, groceries, transportation, insurance, minimum debt payments), $1,800 for wants (dining, subscriptions, shopping, travel), and $1,200 for savings and debt payoff (emergency fund, retirement, extra payments). If their actual needs come to $3,400, they're $400 over the needs target — a signal to trim a fixed cost or accept a smaller wants budget to keep the 20% savings intact.",
    faqs: [
      { question: "How does the 50/30/20 rule work?", answer: "The 50/30/20 rule divides your after-tax income into 50% needs, 30% wants, and 20% savings and debt payoff. You enter your take-home pay, and the calculator above multiplies it by each percentage to give you a dollar target for every bucket." },
      { question: "Is the 50/30/20 rule realistic?", answer: "It's a starting point, not a law. In low-cost areas many people save more than 20%; in expensive cities, needs often exceed 50%, leaving less for wants. The value is in seeing the trade-offs clearly so you can adjust on purpose rather than by accident." },
      { question: "What counts as a need versus a want?", answer: "Needs are essentials you can't avoid: housing, utilities, groceries, transportation, insurance, and minimum debt payments. Wants are choices that improve life but aren't required: dining out, streaming services, hobbies, and vacations. When unsure, ask whether skipping it would cause real harm." },
      { question: "Does the 20% include my 401(k)?", answer: "Yes. Retirement contributions — including payroll-deducted 401(k) savings — count in the 20% savings bucket, alongside your emergency fund and any extra debt payoff. If you save through payroll, add that amount back to your take-home income first." },
      { question: "What if my needs are more than 50%?", answer: "That's common with high rent or a car payment. The rule still works as a diagnostic: a 60% needs share means wants and savings must absorb the difference. Use it to spot the biggest fixed cost to attack, or switch to the zero-based mode for tighter control." },
    ],
    sources: [
      { label: "Consumer Financial Protection Bureau — Making a budget", url: "https://www.consumerfinance.gov/consumer-tools/educator-tools/youth-financial-education/teach/activities/creating-budget/" },
      { label: "Warren & Tyagi — All Your Worth: The Ultimate Lifetime Money Plan", url: "https://www.elizabethwarren.com/" },
    ],
    toolHeading: "Calculate your 50/30/20 budget",
    toolSubheading: "Enter your take-home pay and spending to see your needs, wants, and savings targets.",
    preset: {
      monthlyIncome: 6000,
      mode: "50-30-20",
      amounts: { housing: 1800, utilities: 250, groceries: 600, transportation: 350, insurance: 200, minimumDebt: 200, dining: 350, entertainment: 150, shopping: 250, funMisc: 200, emergencyFund: 300, retirement: 800, extraDebt: 350 },
    },
    relatedSlugs: ["monthly-budget-calculator", "zero-based-budget-calculator", "household-budget-calculator"],
  },

  {
    calculator: "budget",
    slug: "monthly-budget-calculator",
    title: "Monthly Budget Calculator: Plan Every Dollar",
    metaDescription:
      "Free monthly budget calculator. Enter your income and expenses to see what's left, your savings rate, and how spending compares to the 50/30/20 rule.",
    targetKeyword: "monthly budget calculator",
    estimatedVolume: 2800,
    estimatedKD: 28,
    h1: "Monthly Budget Calculator",
    intro:
      "A monthly budget calculator shows what's left after your income meets your expenses, and whether your spending lines up with proven targets. Enter your take-home pay and monthly costs in the calculator above to see your surplus or shortfall, your savings rate, and how each category compares to the 50/30/20 rule. On $4,500 a month, that rule points to $2,250 for needs, $1,350 for wants, and $900 for savings.",
    howItWorks:
      "A monthly budget compares one month of take-home income to one month of planned spending. The calculator adds up your needs, wants, and savings, subtracts the total from your income, and shows the leftover — money you can still assign to a goal.\n\nIt also computes your savings rate: the share of take-home pay going to your emergency fund, retirement, and extra debt payoff. A higher savings rate is the single strongest predictor of long-term financial progress. To make the targets meaningful, the tool benchmarks your buckets against the 50/30/20 rule (50% needs, 30% wants, 20% savings), so an over-budget category stands out immediately. Build the surplus, then put it to work — see how to [grow it through investing](/investing/) or [track your net worth](/net-worth/) over time.",
    commonMistakes: [
      "Leaving out irregular bills. Annual or quarterly costs — insurance, car registration, holidays — should be divided by 12 and budgeted monthly.",
      "Budgeting from gross pay. Use take-home income so the plan matches what actually arrives.",
      "Forgetting buffer for variable costs like groceries and gas, which swing month to month.",
      "Setting it once and never revisiting. Incomes and bills change; a budget is a monthly check-in, not a one-time setup.",
      "Counting a bonus or side income you don't reliably receive. Budget the income you can count on.",
    ],
    workedExample:
      "Suppose you bring home $4,500 a month. Your needs — rent, utilities, groceries, transportation, insurance, and minimum debt payments — add up to $2,250, exactly the 50% target. Your wants total $900, and you direct $900 to savings and extra debt payoff. That's $4,050 planned, leaving $450 unassigned. Against the 50/30/20 benchmark ($2,250 / $1,350 / $900), your needs land right on target and your wants run well under, so the smartest move is to send that $450 to savings — lifting your savings rate from 20% to 30%.",
    faqs: [
      { question: "What is a monthly budget calculator?", answer: "A monthly budget calculator totals one month of income and expenses to show your surplus or shortfall and your savings rate. The calculator above also compares your spending to the 50/30/20 rule so you can see which categories are over or under target." },
      { question: "How do I make a monthly budget?", answer: "Start with your take-home pay, list every monthly expense (dividing annual bills by 12), group them into needs, wants, and savings, then subtract the total from income. If money is left over, assign it to savings or debt. The calculator above does the math as you type." },
      { question: "What is a good savings rate?", answer: "Aim for at least 20% of take-home pay across your emergency fund, retirement, and extra debt payoff — the savings target in the 50/30/20 rule. Saving more accelerates every financial goal, so treat 20% as a floor rather than a ceiling when your budget allows." },
      { question: "How is a monthly budget different from the 50/30/20 rule?", answer: "The 50/30/20 rule is one method for setting category targets; a monthly budget is the broader practice of matching income to expenses each month. This calculator combines both — it tracks your actual monthly plan and benchmarks it against the 50/30/20 targets." },
      { question: "How often should I update my budget?", answer: "Review it monthly. Checking in once a month catches changes in income, bills, and spending habits without becoming a chore, and keeps your savings rate trending in the right direction." },
    ],
    sources: [
      { label: "Consumer Financial Protection Bureau — Making a budget", url: "https://www.consumerfinance.gov/consumer-tools/educator-tools/youth-financial-education/teach/activities/creating-budget/" },
      { label: "U.S. Bureau of Labor Statistics — Consumer Expenditure Surveys", url: "https://www.bls.gov/cex/" },
    ],
    toolHeading: "Build your monthly budget",
    toolSubheading: "Enter income and expenses to see what's left and your savings rate.",
    preset: {
      monthlyIncome: 4500,
      mode: "50-30-20",
      amounts: { housing: 1300, utilities: 180, groceries: 400, transportation: 200, insurance: 120, minimumDebt: 50, dining: 350, entertainment: 150, shopping: 250, funMisc: 150, emergencyFund: 200, retirement: 500, extraDebt: 200 },
    },
    relatedSlugs: ["50-30-20-budget-calculator", "zero-based-budget-calculator", "household-budget-calculator"],
  },

  {
    calculator: "budget",
    slug: "zero-based-budget-calculator",
    title: "Zero-Based Budget Calculator: Every Dollar a Job",
    metaDescription:
      "Free zero-based budget calculator. Assign every dollar of income until income minus expenses equals zero — the method behind EveryDollar.",
    targetKeyword: "zero based budget calculator",
    estimatedVolume: 1300,
    estimatedKD: 42,
    h1: "Zero-Based Budget Calculator",
    intro:
      "A zero-based budget calculator helps you assign every dollar of income a job until income minus expenses equals zero. Switch the calculator above to zero-based mode, enter your take-home pay, and allocate it across needs, wants, savings, and debt until nothing is left unassigned. Reaching $0 doesn't mean spending everything — money sent to savings or debt payoff counts as a job done.",
    howItWorks:
      "Zero-based budgeting, the method behind Dave Ramsey's EveryDollar app, starts every month from zero and gives each dollar a purpose before the month begins. The formula is simple: income minus all allocations equals zero.\n\nYou begin with your monthly take-home income, then assign amounts to each category — housing, food, utilities, transportation, savings, debt payoff, and so on — until the leftover hits exactly zero. If you have money still unassigned, the budget isn't finished: send it to an emergency fund, retirement, or extra debt payoff. If you've assigned more than you earn, you have to cut somewhere. The discipline is what makes it powerful: no dollar drifts away unaccounted for. It pairs naturally with Ramsey's approach of funding the Four Walls first — food, utilities, shelter, and transportation — before anything else. Once your plan balances, direct the savings toward [investing](/investing/) or [retirement](/retirement/).",
    commonMistakes: [
      "Thinking zero-based means spending every dollar. Savings and debt payoff are jobs too — the goal is zero unassigned, not zero saved.",
      "Forgetting irregular expenses. Break annual costs into monthly slices so they don't blow up the budget when they hit.",
      "Not budgeting a category for fun. A plan with no wants is hard to stick to; give yourself a realistic line.",
      "Starting from last month's leftovers instead of from zero. Each month begins fresh with the income you expect.",
      "Leaving a buffer category out. A small miscellaneous line absorbs the surprises that every month brings.",
    ],
    workedExample:
      "Imagine $4,000 in monthly take-home pay. You assign $2,320 to needs (housing, utilities, groceries, transportation, insurance, minimum debt payments), $560 to wants (dining, entertainment, shopping, fun), and $1,120 to savings and debt payoff (emergency fund, retirement, extra payments). That's $2,320 + $560 + $1,120 = $4,000 — exactly your income, leaving $0 unassigned. Every dollar has a job, which is the definition of a balanced zero-based budget.",
    faqs: [
      { question: "What is zero-based budgeting?", answer: "Zero-based budgeting assigns every dollar of monthly income a specific job — spending, saving, or debt payoff — until income minus expenses equals zero. It's the method behind the EveryDollar app and is designed so no money is left unaccounted for." },
      { question: "Does a zero-based budget mean spending all my money?", answer: "No. Reaching zero means every dollar is assigned, not spent. Dollars sent to your emergency fund, retirement, or extra debt payoff count as jobs. A balanced zero-based budget can still save 20% or more of your income." },
      { question: "How is zero-based budgeting different from 50/30/20?", answer: "The 50/30/20 rule sets broad percentage targets (50% needs, 30% wants, 20% savings). Zero-based budgeting is more granular — you assign every dollar to a specific category until the leftover is zero. Use the toggle in the calculator above to compare both on your own numbers." },
      { question: "What if I assign more than I earn?", answer: "Then your budget is over by that amount, and you'll see a negative leftover. Trim a category — usually a want or a flexible need — until the plan balances to zero. You can't finalize a zero-based budget while it's in the red." },
      { question: "What are the Four Walls in budgeting?", answer: "The Four Walls, a Dave Ramsey concept, are the essentials to fund first in a tight month: food, utilities, shelter, and transportation. In a zero-based budget you assign dollars to these before discretionary categories like dining out or subscriptions." },
    ],
    sources: [
      { label: "Consumer Financial Protection Bureau — Making a budget", url: "https://www.consumerfinance.gov/consumer-tools/educator-tools/youth-financial-education/teach/activities/creating-budget/" },
      { label: "Ramsey Solutions — How to make a zero-based budget", url: "https://www.ramseysolutions.com/budgeting/how-to-make-a-zero-based-budget" },
    ],
    toolHeading: "Build a zero-based budget",
    toolSubheading: "Assign every dollar until your leftover reaches $0.",
    preset: {
      monthlyIncome: 4000,
      mode: "zero-based",
      amounts: { housing: 1200, utilities: 180, groceries: 420, transportation: 250, insurance: 150, minimumDebt: 120, dining: 220, entertainment: 100, shopping: 150, funMisc: 90, emergencyFund: 200, retirement: 520, extraDebt: 400 },
    },
    relatedSlugs: ["50-30-20-budget-calculator", "monthly-budget-calculator", "household-budget-calculator"],
  },

  {
    calculator: "budget",
    slug: "household-budget-calculator",
    title: "Household Budget Calculator: Plan Family Spending",
    metaDescription:
      "Free household budget calculator. Combine your family's income and expenses to see needs, wants, and savings targets using the 50/30/20 rule.",
    targetKeyword: "household budget calculator",
    estimatedVolume: 1900,
    estimatedKD: 34,
    h1: "Household Budget Calculator",
    intro:
      "A household budget calculator combines your family's total take-home income and expenses to show where the money goes and how much you can save. Enter your household's monthly net pay and shared costs in the calculator above to see needs, wants, and savings targets based on the 50/30/20 rule. On a combined $7,500 take-home income, that means $3,750 for needs, $2,250 for wants, and $1,500 for savings.",
    howItWorks:
      "A household budget works like an individual one, scaled to everyone under the roof. Add up all reliable take-home income — both partners' paychecks plus any steady side income — then list shared and personal expenses across needs, wants, and savings.\n\nThe calculator applies the 50/30/20 rule to your combined income: 50% for needs like housing, utilities, groceries, transportation, insurance, and minimum debt payments; 30% for wants; and 20% for savings and debt payoff. For families, the savings bucket often carries extra weight — an emergency fund sized to household expenses, retirement for two, and goals like a 529 college account. Because households have more moving parts, the most useful habit is a monthly review where both partners see the same numbers. Once you know your savings target, plan the bigger picture: [check your net worth](/net-worth/) and [stay on track for retirement](/retirement/).",
    commonMistakes: [
      "Counting income you don't reliably receive. Budget steady take-home pay; treat bonuses and variable side income as extra.",
      "Tracking only one partner's spending. A household budget needs every account and card in the picture.",
      "Underbudgeting kid-related costs — childcare, activities, and growing grocery bills add up fast.",
      "Skipping a shared emergency fund. Size it to household monthly expenses, not a single income.",
      "Not giving each partner a personal-spending line. A little autonomy makes the shared budget easier to keep.",
    ],
    workedExample:
      "Consider a two-income household bringing home $7,500 a month. The 50/30/20 rule sets targets of $3,750 for needs, $2,250 for wants, and $1,500 for savings. This family's actual needs — mortgage, utilities, groceries, two commutes, insurance, and minimum debts — come to $4,350, about $600 over the needs target and 58% of income. Their wants run light at $1,300, and they put $1,800 toward savings, a 24% savings rate. Because the wants bucket has room, the household still saves above 20% and ends the month with $50 left to assign — a healthy plan even though needs run high, which is typical for families in higher-cost areas.",
    faqs: [
      { question: "What is a household budget calculator?", answer: "A household budget calculator combines all of a family's take-home income and expenses to show needs, wants, and savings targets. The calculator above applies the 50/30/20 rule to your combined income and flags any category running over its target." },
      { question: "How do you budget for a household with two incomes?", answer: "Add both partners' reliable take-home pay into one total, list all shared and personal expenses, and apply the same needs/wants/savings split. Treating income as one pool — while keeping a personal-spending line for each partner — keeps the plan fair and easy to follow." },
      { question: "What percentage of household income should go to housing?", answer: "Housing is the largest need for most families. A common guideline keeps total housing costs at or below about 28% of income, and within the 50/30/20 rule it should fit inside the 50% needs bucket alongside utilities, food, transportation, and insurance." },
      { question: "How much should a family save each month?", answer: "Target at least 20% of combined take-home pay across your emergency fund, retirement, and other goals — the savings share of the 50/30/20 rule. Families with childcare or high housing costs may start lower and raise the rate as those costs ease." },
      { question: "How do we stick to a household budget?", answer: "Hold a short monthly money meeting where both partners review the same numbers, give each person a personal-spending allowance, and automate savings transfers so the 20% leaves before it can be spent. Shared visibility is what makes a household budget last." },
    ],
    sources: [
      { label: "Consumer Financial Protection Bureau — Making a budget", url: "https://www.consumerfinance.gov/consumer-tools/educator-tools/youth-financial-education/teach/activities/creating-budget/" },
      { label: "U.S. Bureau of Labor Statistics — Consumer Expenditure Surveys", url: "https://www.bls.gov/cex/" },
    ],
    toolHeading: "Build your household budget",
    toolSubheading: "Combine your family's income and expenses to see your targets.",
    preset: {
      monthlyIncome: 7500,
      mode: "50-30-20",
      amounts: { housing: 2200, utilities: 320, groceries: 850, transportation: 450, insurance: 280, minimumDebt: 250, dining: 450, entertainment: 200, shopping: 350, funMisc: 300, emergencyFund: 400, retirement: 1000, extraDebt: 400 },
    },
    relatedSlugs: ["monthly-budget-calculator", "50-30-20-budget-calculator", "zero-based-budget-calculator"],
  },
];
