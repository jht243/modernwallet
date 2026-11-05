import type { SpokeEntry } from "./types";

export const BENEFIT_SPOKES: SpokeEntry[] = [
  {
    "calculator": "budget",
    "slug": "snap-benefits-calculator",
    "title": "SNAP Benefits Calculator for a Monthly Food Budget",
    "metaDescription": "Estimate a full-month SNAP food benefit from household income and allowed deductions. See the federal math, current limits, and state-rule exceptions.",
    "targetKeyword": "SNAP benefits calculator",
    "h1": "Supplemental Nutrition Assistance Program (SNAP) Benefits Calculator",
    "introText": "The base SNAP formula subtracts 30% of net income, rounded up, from the household maximum. At ModernWallet, we calculated these hypothetical full-month cases for the SNAP benefits calculator using federal fiscal year (FY) 2027 amounts. FY2027 runs from October 1, 2026, through September 30, 2027.\n\nThe worked-example table below shows each step. The calculator opens on a hypothetical four-person household earning $2,000 a month with $1,200 in rent, and our arithmetic gives that household $766 a month if the state finds it eligible.",
    "howItWorks": "",
    "sections": [
      {
        "heading": "How SNAP Benefits Are Calculated",
        "body": "The base SNAP benefit before any eligible minimum equals the maximum monthly allotment for your household size minus 30% of your household's net income, with that 30% rounded up to the next whole dollar. The [U.S. Department of Agriculture (USDA) Food and Nutrition Administration (FNA)](https://fns-prod.azureedge.us/snap/recipient/eligibility) bases the 30% share on the expectation that SNAP households spend about 30% of their own resources on food. For FY2027 in the 48 contiguous states and the District of Columbia, the maximum allotment runs from $306 for one person to $1,841 for eight.\n\nThe calculator above works through six steps in this order:\n\n1. Add earned income and unearned income, such as Social Security, to get gross monthly income.\n2. Subtract 20% of earned income.\n3. Subtract the standard deduction for your household size.\n4. Subtract dependent care, child support where your state allows it, and medical costs over $35 for an elderly or disabled member.\n5. Subtract the part of shelter costs above half of that adjusted income, up to $769 unless a member is elderly or disabled.\n6. Multiply net income by 0.3, round up, and subtract the result from the maximum allotment.\n\nThe calculator labels its result as conditional because the formula only pays out once a state agency finds the household eligible. When net income lands above the federal net income limit for your household size, the calculator holds back a benefit amount unless you confirm that a state agency has already found the household eligible.\n\nFY2027 sets a $25 minimum for eligible one- or two-person households. The calculator shows that $25 floor on its own line, and it never turns a failed income screen into an award.\n\nThe calculator covers households of 1 to 8 people in the 48 contiguous states and the District of Columbia. Households in Alaska, Hawaii, Guam, or the U.S. Virgin Islands, and households of nine or more, get no estimate here and should use the [FY2027 allotment and deduction tables](https://fns-prod.azureedge.us/snap/allotment/cola) instead. You can copy or download the result with your inputs, and nothing you type is sent to a server."
      },
      {
        "heading": "Income and Deductions for the SNAP Benefits Calculator",
        "body": "Enter your household's monthly gross income in two parts, earned and unearned, because the 20% deduction applies to earned income. Wages go in the earned field. Social Security goes in the unearned field.\n\nThen enter the deductions SNAP allows. FNA lists these for FY2027:\n\n- A standard deduction of $217 for 1 to 3 people, $229 for 4, $268 for 5, and $308 for 6 or more, which the calculator applies from your household size.\n- Dependent care costs when the care is needed for work, training, or education.\n- Legally owed child support payments, in states that allow this deduction.\n- Medical costs for an elderly or disabled member above $35 a month, when insurance or someone else does not pay them.\n- Excess shelter costs, explained below.\n\nShelter costs include rent or mortgage payments, mortgage interest, and taxes on the home, so put property taxes in the housing field if you pay them. Allowable utility costs are heating and cooking fuel, electricity, water, and the basic fee for one telephone.\n\nSome states allow a set amount for utilities in place of actual bills. FNA does not publish one national figure for that set amount, so the utility field starts at $0. Enter only the utility amount your [state SNAP agency](https://fns-prod.azureedge.us/snap/state-directory) approves, and do not add actual bills on top of it.\n\nHouseholds experiencing homelessness can get a standard $205.66 homeless shelter deduction. The calculator has no field for it, so ask your agency through the [SNAP state directory](https://fns-prod.azureedge.us/snap/state-directory) how it applies to your case."
      },
      {
        "heading": "SNAP Income Limits Are a Federal Reference",
        "body": "SNAP income limits for FY2027 set gross monthly income at 130% of the federal poverty level and net monthly income at 100%, and most households must meet both limits. FNA publishes these limits for the 48 contiguous states, the District of Columbia, Guam, and the U.S. Virgin Islands. Alaska and Hawaii have higher limits.\n\n| Household size | Gross monthly limit (130%) | Net monthly limit (100%) |\n|---|---|---|\n| 1 | $1,729 | $1,330 |\n| 2 | $2,345 | $1,804 |\n| 3 | $2,960 | $2,277 |\n| 4 | $3,575 | $2,750 |\n| 5 | $4,191 | $3,224 |\n| 6 | $4,806 | $3,697 |\n| 7 | $5,421 | $4,170 |\n| 8 | $6,037 | $4,644 |\n| Each additional member | +$616 | +$474 |\n\nGross income is the household's total non-excluded income before any deductions. Net income is gross income minus the allowed deductions from the six calculator steps.\n\nThe table works as a reference line because state rules can change the result. A household where every member receives Temporary Assistance for Needy Families (TANF), Supplemental Security Income (SSI), or in some places general assistance may be categorically eligible. Most states also use broad-based categorical eligibility (BBCE), which lets a state align SNAP income and resource limits with its TANF-funded programs.\n\nUnder BBCE, household income still must be low enough to produce a SNAP benefit. Non-financial rules also apply. That is why the calculator lets you confirm a state eligibility determination when your net income sits above the federal figure."
      },
      {
        "heading": "SNAP Benefits for Older or Disabled Members",
        "body": "SNAP changes the benefit math in three ways when a household includes a member who is elderly or disabled:\n\n- The gross income test does not apply. The net income limit still applies.\n- Medical costs above $35 a month that insurance or someone else does not pay count as a deduction.\n- The excess shelter deduction has no $769 cap, so all shelter costs above half of adjusted income come off.\n\nTurn on the elderly or disabled setting in the calculator to apply the medical deduction and the uncapped shelter deduction. \n\n \n\nHouseholds with a member age 60 or older or disabled can also hold up to $4,750 in countable resources, compared with $3,000 for other households. A person 60 or older who cannot buy and prepare meals separately because of a permanent disability may form a separate SNAP household with a spouse. That applies only when the others they live with have income no higher than 165% of the poverty level, according to [FNA](https://fns-prod.azureedge.us/snap/recipient/eligibility)."
      },
      {
        "heading": "A Full-Month SNAP Worked Example",
        "body": "Our worked example gives a four-person household with $2,000 in monthly earnings and $1,200 in allowed shelter costs a full-month SNAP benefit of $766. The household has no unearned income, dependent care, child support, medical costs, or elderly or disabled member. The second column raises shelter costs to $1,400, and both columns are our own arithmetic on the FY2027 figures.\n\n| Step | $1,200 shelter | $1,400 shelter |\n|---|---|---|\n| Gross earned income | $2,000.00 | $2,000.00 |\n| 20% earned income deduction | $400.00 | $400.00 |\n| Standard deduction (4 people) | $229.00 | $229.00 |\n| Adjusted income | $1,371.00 | $1,371.00 |\n| Half of adjusted income | $685.50 | $685.50 |\n| Excess shelter deduction | $514.50 | $714.50 |\n| Net income | $856.50 | $656.50 |\n| 30% of net income, rounded up | $257 | $197 |\n| Maximum allotment (4 people) | $1,023 | $1,023 |\n| Full-month benefit | $766 | $826 |\n\nRaising allowed shelter costs by $200 raised the benefit by $60. Each added dollar of excess shelter lowers net income by a dollar and the household's 30% share by about 30 cents. Without an elderly or disabled member, the excess shelter deduction is capped at $769, so shelter costs beyond that cap no longer raise the benefit.\n\nThe household also clears both federal income references. Its $2,000 gross is under the $3,575 limit for four people, and its $856.50 net is under $2,750.\n\n \n\nThese are full-month amounts. If a state finds the household eligible, benefits count from the date the application was submitted, so the first month's payment can differ from the full-month figure."
      },
      {
        "heading": "What the SNAP Benefits Calculator Cannot Decide",
        "body": "The calculator runs the federal benefit formula and cannot decide whether your household is eligible for SNAP. Only the state agency where you live makes that decision, after an interview and proof of the information you give. The formula does not check these rules:\n\n- Countable resources, capped at $3,000, or $4,750 with a member age 60 or older or disabled. A home and lot, most retirement and pension plans, and resources of people receiving SSI or TANF do not count. Vehicles count, and each state decides how.\n- Student eligibility, which the [FNA eligibility page](https://fns-prod.azureedge.us/snap/recipient/eligibility) covers.\n- Work requirements and non-citizen eligibility, which the [Working Families Tax Cuts Act](https://fns-prod.azureedge.us/snap/recipient/eligibility) changed. The [FNA eligibility page](https://fns-prod.azureedge.us/snap/recipient/eligibility) says it is being updated with those changes.\n- Household membership. People who live together and buy and prepare meals together form one household, and spouses and most children under 22 count in the same household even if they shop and cook separately.\n\nA state set utility amount, the child support deduction, or BBCE limits can change your estimate. It also changes on October 1, 2027, when FNA adjusts maximum allotments, deductions, and income standards for the next fiscal year.\n\nIf the state denies your application or sets a benefit you disagree with, you can request a fair hearing within 90 days of the decision. You can make that request by phone, in writing, or in person at the local SNAP office."
      },
      {
        "heading": "Your Next Step",
        "body": "Save your inputs with the calculator's download. Apply through the SNAP agency in the state where you live. Each state has its own application form, and FNA does not process applications or see case information, so use the [SNAP state directory](https://fns-prod.azureedge.us/snap/state-directory) to find your state's office, website, or hotline. In most cases, the state agency sends an eligibility notice within 30 days, and a household with less than $100 in liquid resources and $150 in monthly gross income may get benefits within 7 days.\n\nApproved benefits load each month onto an Electronic Benefit Transfer (EBT) card that works like a debit card. SNAP [can buy food for the household](https://fns-prod.azureedge.us/snap/eligible-food-items), including produce, meat, dairy, bread, snack foods, and seeds that grow food. It cannot buy alcohol, tobacco, vitamins, supplements, hot foods, pet food, cleaning supplies, paper products, or hygiene items.\n\nTreat the SNAP amount as a grocery fund and keep it out of your cash take-home pay when you [plan the rest of your household budget](/budget/household-budget-calculator/). If you have never tracked spending, [build a budget from your statements](/guides/how-to-make-a-budget/) first so the grocery line reflects what you buy. Allowed deductions and net income set a conditional amount. Only your state agency decides eligibility. A different state allowance, first-month date, or cost-of-living update changes the result. Run your numbers in the SNAP benefits calculator and take the downloaded result to your state application."
      }
    ],
    "commonMistakes": [],
    "faqs": [
      {
        "question": "How do they calculate how much food stamps I get?",
        "answer": "Your state SNAP agency subtracts allowed deductions from your gross income to get net income, multiplies net income by 0.3, rounds up, and subtracts that amount from the maximum allotment for your household size. For a four-person household with $856.50 in net income, that is $1,023 minus $257, or $766 for a full month."
      },
      {
        "question": "What is the minimum SNAP benefit?",
        "answer": "The FY2027 minimum SNAP benefit is $25 a month for eligible one- and two-person households in the 48 contiguous states and the District of Columbia. Other areas use the amounts in the [FY2027 cost-of-living adjustment (COLA) tables](https://fns-prod.azureedge.us/snap/allotment/cola). The minimum applies only after a household is found eligible."
      },
      {
        "question": "How much can you get in SNAP benefits?",
        "answer": "For FY2027 in the 48 contiguous states and the District of Columbia, the most a household can get is $306 for one person, $562 for two, $808 for three, $1,023 for four, $1,217 for five, $1,463 for six, $1,616 for seven, and $1,841 for eight. Households of nine or more can check the [FY2027 cost-of-living adjustment (COLA) tables](https://fns-prod.azureedge.us/snap/allotment/cola). Subtract 30% of net income, rounded up to the next whole dollar, from the maximum allotment. An otherwise eligible household with $0 net income receives the full maximum."
      },
      {
        "question": "What are SNAP benefits income limits?",
        "answer": "For FY2027, most households in the 48 contiguous states and the District of Columbia need to meet both the gross limit of 130% of the poverty level and the net limit of 100%. For four people, that is $3,575 gross and $2,750 net. Households with an elderly or disabled member only need to meet the net limit, and states using broad-based categorical eligibility can align limits with their TANF-funded programs."
      },
      {
        "question": "Can seniors get food stamps?",
        "answer": "Yes, people age 60 or older can get SNAP when their household meets the program rules, and special rules apply to them. A household with a member who is 60 or older or disabled only has to meet the net income limit, can deduct medical costs over $35 a month, and has no cap on the excess shelter deduction. It can also hold $4,750 in countable resources, compared with $3,000 for other households."
      }
    ],
    "sources": [
      {
        "label": "USDA Food and Nutrition Administration: SNAP Cost-of-Living Adjustment (COLA) Information",
        "url": "https://fns-prod.azureedge.us/snap/allotment/cola"
      },
      {
        "label": "USDA Food and Nutrition Administration: SNAP Eligibility",
        "url": "https://fns-prod.azureedge.us/snap/recipient/eligibility"
      },
      {
        "label": "USDA Food and Nutrition Administration: SNAP State Directory of Resources",
        "url": "https://fns-prod.azureedge.us/snap/state-directory"
      },
      {
        "label": "USDA Food and Nutrition Administration: What Can SNAP Buy?",
        "url": "https://fns-prod.azureedge.us/snap/eligible-food-items"
      }
    ],
    "toolHeading": "Estimate Your SNAP Food Benefit",
    "toolSubheading": "Federal fiscal year 2027 math for households of 1 to 8 people in the 48 contiguous states and the District of Columbia.",
    "islandId": "snap-benefits",
    "preset": {},
    "suppressRelatedFallback": true,
    "disclaimerText": "This calculator gives an educational estimate from federal fiscal year 2027 SNAP figures, and only your state SNAP agency can decide eligibility and the benefit amount.",
    "updated": "2026-11-04"
  },
  {
    "calculator": "budget",
    "slug": "aca-subsidy-calculator",
    "title": "ACA Subsidy Calculator for 2027 Marketplace Premiums",
    "metaDescription": "Use the ACA subsidy calculator to estimate a 2027 federal premium credit from household income and plan premiums, with limits and the calculation shown.",
    "targetKeyword": "ACA subsidy calculator",
    "h1": "Affordable Care Act (ACA) Subsidy Calculator for 2027",
    "introText": "An Affordable Care Act (ACA) subsidy estimate subtracts an income-based contribution from the benchmark Silver premium, capped at the eligible plan premium. At ModernWallet, we calculated hypothetical cases for the ACA subsidy calculator to show how income and premiums affect the estimate. \n\nThe default case is hypothetical: two people with $50,000 of yearly modified adjusted gross income (MAGI), a $600 benchmark, and a $550 plan. If every other eligibility condition is met, that case produces a $268.85 monthly credit and a $281.15 monthly premium.",
    "howItWorks": "",
    "sections": [
      {
        "heading": "How ACA Subsidies Are Calculated",
        "body": "The federal premium tax credit equals the non-tobacco benchmark Silver premium minus an income-based contribution, and it can never be larger than the premium of the eligible plan you enroll in. The [Internal Revenue Service (IRS)](https://www.irs.gov/affordable-care-act/individuals-and-families/questions-and-answers-on-the-premium-tax-credit) describes the credit this way. [Revenue Procedure 2026-26](https://www.irs.gov/irb/2026-31_irb) sets the 2027 percentages used for the contribution.\n\nThe calculator runs five steps:\n\n1. Divide expected 2027 household MAGI by the 2026 federal poverty level (FPL) for your household size.\n2. Find that percentage of FPL in the 2027 table below, and interpolate in a straight line inside its band.\n3. Multiply MAGI by the applicable percentage, then divide by 12 for the monthly contribution.\n4. Subtract the monthly contribution from the monthly benchmark premium. A negative result counts as zero.\n5. Cap the result at the monthly premium of the plan you choose.\n\nWritten as one line, the credit is the smaller of two numbers: your plan premium, or the benchmark minus your contribution (never below zero).\n\n| Household income as % of FPL | Starting percentage | Ending percentage |\n|---|---|---|\n| Under 133% | 2.15% | 2.15% |\n| 133% to under 150% | 3.23% | 4.30% |\n| 150% to under 200% | 4.30% | 6.78% |\n| 200% to under 250% | 6.78% | 8.66% |\n| 250% to under 300% | 8.66% | 10.22% |\n| 300% to 400% | 10.22% | 10.22% |\n\nInterpolation turns a band into an exact rate. At 231.05% of FPL, income sits 31.05 points into the 50-point band from 200% to 250%. The rate climbs the same share of the way from 6.78% to 8.66%, which lands at about 7.95%.\n\nThe calculator keeps the dollar result hidden until you confirm the nonfinancial conditions listed under When the ACA Subsidy Calculator Does Not Apply. Below 100% or above 400% of FPL, it shows an explanation in place of a credit. It estimates the federal credit only, with no state subsidy and no estimate of discounts on your share of costs for covered services."
      },
      {
        "heading": "Income for the 2027 ACA Subsidy Calculator",
        "body": "Enter your household's expected MAGI for 2027, the full year you want coverage. [HealthCare.gov](https://www.healthcare.gov/income-and-household-information/income/) states that Marketplace savings are based on expected household income for the coverage year. Last year's income is only a starting point: the [HealthCare.gov glossary](https://www.healthcare.gov/glossary/federal-poverty-level-fpl/) says to begin with your most recent adjusted gross income (AGI) and adjust it for expected changes.\n\nMAGI does not appear as a line on your tax return. Build it in two steps:\n\n- Start with AGI, which is line 11 of [IRS Form 1040](https://www.healthcare.gov/income-and-household-information/income/).\n- Add untaxed foreign income, non-taxable Social Security benefits, and tax-exempt interest. Leave out Supplemental Security Income (SSI).\n\nFor many people, MAGI equals AGI or comes close. Take-home pay alone is the wrong input for this calculator.\n\nIf your pay stub lists federal taxable wages, use that number. If it does not, HealthCare.gov says to start from gross income and subtract what your employer takes out for child care, health coverage, and retirement plans. Self-employment income goes in after business expenses.\n\nSome money stays out of the estimate entirely:\n\n- child support\n- gifts\n- loan proceeds, such as student loans or home equity loans\n- SSI\n- veterans' disability payments\n- workers' compensation\n\nHousehold size and household income follow tax rules. Your family for the credit is you, your spouse if you file jointly, and everyone you claim as a dependent, including dependents who do not need coverage. Household income adds the MAGI of each family member who is required to file a federal return, so a teenager's summer-job pay counts only if that teen must file.\n\nThe coverage family is a smaller group. The IRS defines it as the family members enrolled through the Marketplace who cannot get [Medicaid](https://www.healthcare.gov/medicaid-chip/getting-medicaid-chip/), Medicare, or affordable employer coverage. Enter the full tax household size and income, and use a benchmark premium that applies to the coverage family."
      },
      {
        "heading": "ACA Subsidy Income Limits for 2027",
        "body": "For 2027 coverage, the ordinary federal premium tax credit range is household income from 100% to 400% of the 2026 federal poverty level for your household size. The IRS bases each year's credit on the poverty guidelines most recently published when open enrollment begins, so the 2025 credit used 2024 figures and the 2027 credit uses 2026 figures. The rule that allowed credits above 400% applied to tax years 2021 through 2025 only.\n\n| Household size | 100% of FPL | 400% of FPL |\n|---|---|---|\n| 1 | $15,960 | $63,840 |\n| 2 | $21,640 | $86,560 |\n| 3 | $27,320 | $109,280 |\n| 4 | $33,000 | $132,000 |\n| 5 | $38,680 | $154,720 |\n| 6 | $44,360 | $177,440 |\n| 7 | $50,040 | $200,160 |\n| 8 | $55,720 | $222,880 |\n\nThe top boundary is inclusive. The 2027 table runs to \"not more than 400%,\" so a two-person household at exactly $86,560 stays inside the range. In our calculation, that household's contribution is 10.22% of income, or $737.20 a month, and an illustrative $1,000 benchmark with a $1,000 plan premium leaves a $262.80 monthly credit.\n\nAdd $1 of income and the same household reaches 400.0046% of FPL, which removes the credit in the ordinary federal model. If your income sits near the line, run the calculator at both your low and high estimates before you count on the credit.\n\nThe table shows an income window. It does not establish eligibility by itself. HealthCare.gov says income below 100% of FPL probably will not qualify for Marketplace savings but may qualify for Medicaid, and income below 138% may qualify for Medicaid in states that expanded it.\n\nThe calculator covers households of 1 to 8 people in the 48 contiguous states and the District of Columbia (DC). Poverty guidelines are higher in Alaska and Hawaii, and the 2026 table adds $5,680 for each person past eight. Households in either group should rely on the [Marketplace application](https://www.healthcare.gov/medicaid-chip/getting-medicaid-chip/) for their figure."
      },
      {
        "heading": "The Benchmark and Your Chosen Plan",
        "body": "The benchmark is the monthly premium for the second-lowest-cost Silver plan that applies to your coverage family, and it sets the size of the credit. Your chosen plan's premium, which the IRS calls the enrollment premium, acts only as a ceiling. The calculator asks for both numbers because they do different jobs in the formula.\n\nThe IRS settles two edge cases for the benchmark. If only one Silver plan is available where you live, that plan counts as the second-lowest-cost Silver plan. If the two cheapest Silver plans cost the same, that shared premium is the benchmark.\n\nTobacco use changes only one of the two inputs. The benchmark leaves out tobacco surcharges, so enter the non-tobacco price. The enrollment premium is the amount you are charged, so a tobacco user enters the higher plan price.\n\nThe IRS gives an example of both rules. A $900 non-smoker benchmark is used even though smokers are quoted $1,200 for that plan. A tobacco user charged $650 for the chosen plan uses $650 as the enrollment premium, even though the non-tobacco price is $500.\n\nThe ceiling comes into play when you pick a cheaper plan. If the benchmark minus your contribution is more than your plan's premium, the credit stops at that premium. \n\nThe calculator has no ZIP code database and no built-in prices. Its $600 benchmark and $550 plan defaults are hypothetical numbers for the arithmetic. When you apply, the Marketplace estimates your credit from your family size, projected income, and other coverage, and the plan prices it shows are the figures to enter here."
      },
      {
        "heading": "A Worked Federal Premium-Credit Calculation",
        "body": "In our calculation, a two-person household with $50,000 of expected 2027 MAGI, a $600 benchmark, and a $550 chosen plan gets a $268.85 monthly federal credit and pays $281.15 a month. Both premiums are illustrative and come from no ZIP code quote. The arithmetic assumes every other eligibility condition is met.\n\n| Step | Figure |\n|---|---|\n| 2026 FPL for 2 people | $21,640 |\n| Income as % of FPL | 231.05% |\n| Applicable percentage | about 7.95% |\n| Yearly contribution | $3,973.81 |\n| Monthly contribution | $331.15 |\n| Benchmark minus contribution | $600 minus $331.15 = $268.85 |\n| Cap check against the $550 plan | $268.85 is under the cap |\n| Monthly credit | $268.85 |\n| Net monthly premium | $550 minus $268.85 = $281.15 |\n\nA second case shows the premium cap. Use two people with $30,000 of MAGI, a $900 benchmark, and a $100 monthly plan premium. Assume every other eligibility condition is met, including that no one is eligible for Medicaid. Income is 138.63% of FPL, the applicable percentage is about 3.58%, and the monthly contribution is $89.61.\n\nThe benchmark minus that contribution is far more than the $100 plan premium. The credit cannot exceed the $100 plan premium, so the credit is $100 and the net premium is $0.\n\nRead together, the two cases show how each input works. Income sets the contribution."
      },
      {
        "heading": "When the ACA Subsidy Calculator Does Not Apply",
        "body": "The calculator's figure does not apply to anyone eligible for government coverage that counts as qualifying health coverage, anyone with affordable employer coverage, or a household that fails the IRS filing rules. The calculator asks you to confirm these conditions before it shows a credit.\n\n- Government coverage: a person eligible for Medicaid, the [Children's Health Insurance Program (CHIP)](https://www.healthcare.gov/medicaid-chip/getting-medicaid-chip/), Medicare, or another government program that counts as qualifying health coverage cannot get the credit for that person's Marketplace coverage. Limited-benefit Medicaid that does not count is an exception.\n- Employer offers: an offer for 2027 plan years is generally affordable if the employee's self-only premium share is no more than 10.22% of household income. The test uses the lowest-cost plan that covers at least 60% of expected costs, and family members' offers apply the same percentage to the family premium.\n- Employer enrollment: enrolling in an employer plan, including retiree coverage, blocks the credit even if that plan is unaffordable. Coverage from a former employer, including retiree coverage, can be declined, and the credit may still be available.\n- Filing rules: married couples who file separately generally cannot claim the credit, with an exception for certain victims of domestic abuse or spousal abandonment. A person who can be claimed as a dependent by someone else cannot claim it.\n\nA new Medicaid rule starts January 1, 2027. HealthCare.gov says states that cover adults based on income alone may require a monthly work requirement for Medicaid. A person who lost or was denied Medicaid for not meeting that requirement may get Marketplace coverage but will not qualify for savings. Leave eligibility unconfirmed in the calculator to show an explanation instead of a credit.\n\nLimited Medicaid works differently. Some programs pay only for family planning, emergency treatment, or tuberculosis services. If your state's program does not count as [qualifying health coverage](https://www.healthcare.gov/medicaid-limited-benefits/), you may still get the premium tax credit when you meet the income and other rules.\n\nThe calculator does not evaluate immigration status or state programs. Three facts can reverse an estimate: an affordable employer offer, eligibility for Medicaid or another government program that counts as qualifying coverage, and changes in law or plan prices.\n\nThe official next step is a [Marketplace application](https://www.healthcare.gov/medicaid-chip/getting-medicaid-chip/). HealthCare.gov says the application sends your information to your state if anyone in the household may qualify for Medicaid or CHIP. It also tells you whether you qualify for savings on a Marketplace plan."
      },
      {
        "heading": "Updating Income Before Tax Reconciliation",
        "body": "Advance payments of the premium tax credit are an estimate, and your final 2027 credit is figured on your tax return from actual household income and family size. If the advance payments were larger than the final credit, the IRS sets no repayment cap for tax years after 2025. The full difference reduces your refund or raises your balance due, and if the final credit is larger, the difference goes to you.\n\n[Reporting changes to the Marketplace](https://www.healthcare.gov/income-and-household-information/income/) as soon as they happen lets it adjust your advance payments. The IRS lists these events among those that can change the credit:\n\n- a lump-sum Social Security or Social Security Disability Insurance payment\n- a taxable lump-sum distribution from an individual retirement account or other retirement arrangement\n- capital gains from selling stocks, bonds, or cryptocurrency\n- canceled debt, such as forgiven credit card debt\n- marriage, divorce, a birth or adoption, or a move\n- gaining or losing eligibility for employer or government coverage\n\nFiling a return is required. Anyone with advance payments must file a federal return with [Form 8962](https://www.irs.gov/affordable-care-act/individuals-and-families/questions-and-answers-on-the-premium-tax-credit), and skipping that return ends advance payments in future years.\n\nPlan the premium around a range of incomes. Run the calculator at a low and a high 2027 income estimate, compare the two net premiums, and set aside the difference if your income can swing. Our guide on how to [budget with irregular income](/guides/how-to-budget-with-irregular-income/) covers health insurance costs without an employer plan, and you can [put the premium in a household budget](/budget/household-budget-calculator/).\n\nThe estimate requires a correct benchmark premium and annual MAGI. Take-home pay alone cannot establish annual MAGI. An affordable employer offer, qualifying government coverage, or changed law or plan prices can reverse it. Compare income scenarios in the ACA subsidy calculator, then [update your Marketplace application](https://www.healthcare.gov/income-and-household-information/income/) whenever your income changes."
      }
    ],
    "commonMistakes": [],
    "faqs": [
      {
        "question": "What is ACA subsidy based on?",
        "answer": "The ACA premium tax credit is based on expected household modified adjusted gross income (MAGI) compared with the federal poverty level for your household size, plus the benchmark Silver premium for your coverage family. The income sets your contribution, the benchmark minus that contribution sets the credit, and the premium of the plan you enroll in caps it."
      },
      {
        "question": "How to qualify for ACA subsidy?",
        "answer": "You must meet every IRS eligibility condition. Income alone cannot establish eligibility. Household income must fall in the allowed range. Married filing separately generally prevents the credit, with a limited abuse or abandonment exception. No one else can claim you as a dependent. The covered person must enroll in a non-catastrophic Marketplace plan and lack affordable employer coverage. Eligibility for qualifying government coverage, such as most Medicaid or Medicare, prevents the credit. Limited-benefit Medicaid that does not count as qualifying coverage is an exception. The covered person must pay the share of premiums the credit does not cover."
      },
      {
        "question": "What is the maximum ACA subsidy?",
        "answer": "The ACA subsidy can be as large as the full premium of the plan you enroll in, because the IRS caps the credit at enrollment premiums. Below that cap, the size depends on how far the benchmark premium exceeds your income-based contribution. In our lower-income example, two people with $30,000 of MAGI, a $900 benchmark, and a $100 plan get a $100 credit and pay $0, assuming every other eligibility condition is met."
      },
      {
        "question": "What are the ACA subsidy income limits?",
        "answer": "For 2027 coverage, the ordinary range is 100% to 400% of the 2026 federal poverty level in the 48 contiguous states and DC. That is $15,960 to $63,840 for one person, $21,640 to $86,560 for two, and $33,000 to $132,000 for four. Alaska and Hawaii use higher poverty guidelines, and income inside the range does not establish eligibility on its own."
      },
      {
        "question": "Is ACA subsidy based on adjusted gross income?",
        "answer": "The ACA subsidy is based on modified adjusted gross income, which starts with adjusted gross income from line 11 of Form 1040. You add untaxed foreign income, non-taxable Social Security benefits, and tax-exempt interest, and you leave out Supplemental Security Income. For many people the two figures are the same or very close."
      }
    ],
    "sources": [
      {
        "label": "IRS: Revenue Procedure 2026-26, 2027 applicable percentage table",
        "url": "https://www.irs.gov/irb/2026-31_irb"
      },
      {
        "label": "IRS: Questions and answers on the Premium Tax Credit",
        "url": "https://www.irs.gov/affordable-care-act/individuals-and-families/questions-and-answers-on-the-premium-tax-credit"
      },
      {
        "label": "HealthCare.gov: What to include as income",
        "url": "https://www.healthcare.gov/income-and-household-information/income/"
      },
      {
        "label": "HealthCare.gov: Federal poverty level (FPL)",
        "url": "https://www.healthcare.gov/glossary/federal-poverty-level-fpl/"
      },
      {
        "label": "HealthCare.gov: Medicaid and CHIP coverage",
        "url": "https://www.healthcare.gov/medicaid-chip/getting-medicaid-chip/"
      },
      {
        "label": "HealthCare.gov: Medicaid programs and qualifying health coverage",
        "url": "https://www.healthcare.gov/medicaid-limited-benefits/"
      }
    ],
    "toolHeading": "2027 Federal Premium Tax Credit Estimate",
    "toolSubheading": "For households of 1 to 8 in the 48 contiguous states and DC. Enter yearly MAGI and two monthly premiums.",
    "islandId": "aca-subsidy",
    "preset": {},
    "suppressRelatedFallback": true,
    "disclaimerText": "This page and calculator provide educational estimates of the federal premium tax credit and do not determine eligibility or the credit amount for any household.",
    "updated": "2026-11-04"
  }
];
