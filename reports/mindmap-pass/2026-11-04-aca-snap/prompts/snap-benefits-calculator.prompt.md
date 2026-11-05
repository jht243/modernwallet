APPROVED BRIEF
{
  "actionId": "N1",
  "target": "/budget/snap-benefits-calculator/",
  "identity": {
    "title": "SNAP Benefits Calculator for a Monthly Food Budget",
    "h1": "Supplemental Nutrition Assistance Program (SNAP) Benefits Calculator",
    "pageType": "explainer",
    "format": "calculator",
    "medium": "interactive tool",
    "register": "operator",
    "bodyFloor": 1200,
    "metaDescription": "Estimate a full-month SNAP food benefit from household income and allowed deductions. See the federal math, current limits, and state-rule exceptions."
  },
  "readerAndAnswer": {
    "question": "How are SNAP benefits calculated? [PAA 0/0; ac 9/9 on-topic, 4/9 calculation-method]",
    "answer": "figure: For an otherwise eligible household, a full-month federal allotment is the household maximum minus rounded-up 30% of SNAP net income; the estimator will show deductions and conditional minimum rules without deciding eligibility.",
    "placement": "section 1: How SNAP Benefits Are Calculated",
    "audienceAndIntent": "U.S. households planning food expenses; federal arithmetic for 1\u20138 members in the 48 contiguous states and District of Columbia, FY2027 only (Oct1 2026\u2013Sep30 2027)."
  },
  "keywordEvidence": "snap benefits calculator: 2,900/month, KD30; snap benefits income limits: 1,300/month, KD44; snap benefits for seniors: 590/month, KD39. SEMrushUS exact metrics checked2026-11-04, corroborated by live autocomplete. Supporting phrases become sections/FAQs, not duplicate pages.",
  "serpAndQuestions": {
    "findings": "Raw contested; AI Overview observed. SNAP result set includes SNAP Screener/state calculators or official application/program pages; redirect-heavy top10 is not a reliable lock count.",
    "actualCompetingPages": "[Benefits Plus New York calculator](https://bplc.cssny.org/benefit_tools/snap_calculator) and [Illinois DHS calculator](https://fscalc.dhs.illinois.gov/FSCalc/calculateFS.do) are actual calculator results. The New York page explicitly limits geography and says the result is an estimate; the new page will expose its own federal/state boundary instead of pretending to be a national eligibility screener.",
    "questions": [
      "How do they calculate how much food stamps I get?",
      "What is the minimum SNAP benefit?",
      "How much can you get in SNAP benefits?",
      "What are SNAP benefits income limits?",
      "Can seniors get food stamps?"
    ],
    "limits": "PAA noise is explicit in the question tag. Off-topic politics, taxpayer-cost, unrelated nutrition/shopping rumors and unsupported state specifics are excluded. Observed program questions not answered as the opener are assigned to the listed FAQ/section, not invented."
  },
  "whyNewPage": "The strongest lookup matches are /compare/1099-vs-w2/ (pay/tax compensation) and /guides/ssi-and-inheritance/ (inheritance and SSI), neither computes food allotments. Same-run application guide answers submitting an application, and WIC comparison answers program differences. No exact route history at local HEAD or pinned published850b1e4; final /budget/ route lookup separately saved.",
  "outline": [
    {
      "heading": "How SNAP Benefits Are Calculated",
      "purpose": "Tool and immediate max-minus-contribution answer, conditional on eligibility."
    },
    {
      "heading": "Which Income and Deductions to Enter",
      "purpose": "Earned/unearned income, standard deduction, dependent care and state-allowed support; state-approved utility allowance, not an invented national amount."
    },
    {
      "heading": "SNAP Income Limits Are a Federal Reference",
      "purpose": "FY2027 gross/net table; categorical eligibility and state options mean no national approval verdict."
    },
    {
      "heading": "SNAP Benefits for Older or Disabled Members",
      "purpose": "Medical expense deduction and uncapped excess shelter; no stale work-exemption list."
    },
    {
      "heading": "A Full-Month SNAP Worked Example",
      "purpose": "Recomputed four-person case, rounding, then a higher allowed shelter amount; distinguish first-month proration."
    },
    {
      "heading": "What the Estimate Cannot Decide",
      "purpose": "Assets, student/work/noncitizen rules, state supplements, out-of-scope geographies and official agency decision."
    },
    {
      "heading": "Your Next Step",
      "purpose": "Record assumptions and apply through the correct state office; keep SNAP separate from cash-income budgeting."
    },
    {
      "heading": "Frequently Asked Questions",
      "purpose": "How do they calculate how much food stamps I get?; What is the minimum SNAP benefit?; How much can you get in SNAP benefits?; What are SNAP benefits income limits?; Can seniors get food stamps?"
    }
  ],
  "contributionAndEvidence": {
    "findingAndBasis": "Calculated, with explicit hypothetical inputs: for four people and $2,000 earned monthly income, $1,200 allowed shelter, no other deductions, standard deduction $229 gives net $856.50 and conditional full-month benefit $766. Raising allowed shelter to $1,400 gives $826 before shelter cap binds. Use current COLA constants and our own arithmetic, not USDA\u2019s internally inconsistent worked example. Visible wording will identify our calculation and link a nearby method/inputs table.",
    "inspectedPrimarySources": "[snap-cola](https://fns-prod.azureedge.us/snap/allotment/cola); [snap-eligibility](https://fns-prod.azureedge.us/snap/recipient/eligibility); [snap-state](https://fns-prod.azureedge.us/snap/state-directory); [snap-eligible-food](https://fns-prod.azureedge.us/snap/eligible-food-items). All inspected 2026-11-04; exact captured records are bound in evidenceFiles.",
    "provenance": "Calculated results identify our arithmetic, assumptions and nearby method; source-only synthesis names the actual agency. Preparation feasibility arithmetic is recorded, not a Phase3 implementation or Phase4 PASS."
  },
  "tablesToolsVisuals": "Client-side deterministic React island. Inputs: household1\u20138, monthly earned/unearned income, necessary dependent care, state-allowed child support, elderly/disabled flag and medical costs, rent/mortgage plus state-approved utility allowance. Standard deductions [217,217,217,229,268,308,308,308]; 20% earned deduction; medical excess above$35 where eligible; excess shelter above half adjusted income, cap$769 unless elderly/disabled. Max allotments [306,562,808,1023,1217,1463,1616,1841]; subtract ceil(0.3\u00d7net). Show raw formula and conditional eligible1\u20132-member $25 minimum distinctly; suppress an award-like amount above federal net reference unless the user explicitly confirms a state eligibility determination. No estimate for AK/HI/territories or9+; link official tables. Defaults are a disclosed hypothetical four-person case. Copy/download result and inputs; no server submission. Validate all boundaries, mobile390px and keyboard access.",
  "testingAndReview": "Ordinary financial/program information, excluded from product TESTED format. Reuse existing Jonathan Velez byline without invented credentials/professional review. No clinical/personal eligibility claim. Fresh independent Phase4 review must cover exact final whole render, sources and all transformations. Tool-code validation is separate from product testing. The scope1\u20138/contiguous48+DC is visible beside inputs.",
  "takeaway": "Net income and allowed deductions determine a conditional amount up to the household maximum. Use the breakdown and current state allowances to plan, then have the state decide eligibility. Different deductions, state options, first-month dates or a revised COLA change the answer.",
  "inboundLinks": {
    "required": 1,
    "target": 3,
    "reasonBelowTarget": "Two strong existing placements are identified for each page. One is a relevant existing collection/hub. Do not force a third or count an uninspected future sibling as already present.",
    "placements": [
      {
        "source": "/budget/",
        "target": "/budget/snap-benefits-calculator/",
        "section": "Budget calculator spoke grid",
        "anchor": "SNAP benefits calculator",
        "purpose": "Reader moves from the inspected existing section to this exact decision",
        "inspection": {
          "path": "reports/mindmap-pass/2026-11-04-aca-snap/link-inspections.json",
          "sha256": "005ebced6f218c199578c561bdc078537aedc2cb03ef2052dcc50441054b34d9"
        }
      },
      {
        "source": "/budget/household-budget-calculator/",
        "target": "/budget/snap-benefits-calculator/",
        "section": "How it works",
        "anchor": "estimate SNAP food benefits",
        "purpose": "Reader moves from the inspected existing section to this exact decision",
        "inspection": {
          "path": "reports/mindmap-pass/2026-11-04-aca-snap/link-inspections.json",
          "sha256": "005ebced6f218c199578c561bdc078537aedc2cb03ef2052dcc50441054b34d9"
        }
      }
    ]
  },
  "outboundLinks": {
    "placements": [
      {
        "source": "/budget/snap-benefits-calculator/",
        "target": "/budget/household-budget-calculator/",
        "section": "Your Next Step",
        "anchor": "plan the rest of your household budget",
        "purpose": "Existing destination inspected in link-source-records; supports the next budgeting action",
        "inspection": {
          "path": "reports/mindmap-pass/2026-11-04-aca-snap/link-inspections.json",
          "sha256": "005ebced6f218c199578c561bdc078537aedc2cb03ef2052dcc50441054b34d9"
        }
      },
      {
        "source": "/budget/snap-benefits-calculator/",
        "target": "/guides/how-to-make-a-budget/",
        "section": "Your Next Step",
        "anchor": "build a budget from your statements",
        "purpose": "Existing destination inspected in link-source-records; supports the next budgeting action",
        "inspection": {
          "path": "reports/mindmap-pass/2026-11-04-aca-snap/link-inspections.json",
          "sha256": "005ebced6f218c199578c561bdc078537aedc2cb03ef2052dcc50441054b34d9"
        }
      }
    ]
  },
  "technicalAndMeasurement": "Astro static, self-canonical https://www.themodernwallet.com with trailing slash; exact title\u226460 and description\u2264160. Reuse existing byline/source/schema components and honest dates. Astro sitemap and existing search-index builder. New-route baseline not-yet-published, age-matched unchanged cohort comparator; measure incremental Google clicks over first28/second28 complete live days after deployment, with reporting delay and unavailable data explicit. Register a budget spoke with dedicated React island, named-source constants and data-tool equal to the route last segment; mirror the existing /mileage-deduction/mileage-log-checker/ utility island wiring, no new calculator hub/header. Add route-scoped sections/disclaimer/stat suppression only for the two benefit slugs; every other rendered route must remain semantically unchanged."
}

reader question: How are SNAP benefits calculated? [PAA 0/0; ac 9/9 on-topic, 4/9 calculation-method]
answer: figure: For an otherwise eligible household, a full-month federal allotment is the household maximum minus rounded-up 30% of SNAP net income; the estimator will show deductions and conditional minimum rules without deciding eligibility.
answer placement: section 1: How SNAP Benefits Are Calculated

CLOSED FACT LIST
Anything not on this list, you do not know. Never invent a price, limit, benchmark, or URL; say it is unpublished and tell the reader to verify at the vendor page.
FY2027 contiguous48/DC net income reference for household1-8: 1330,1804,2277,2750,3224,3697,4170,4644 dollars/month. Gross130% reference:1729,2345,2960,3575,4191,4806,5421,6037. Verify these against captured official source before writing table. If not supported omit table numeric values and explain reference. Minimum25 for otherwise eligible1-2 people is conditional and cannot create an award after a failed eligibility screen. Hypothetical default household4 earned2000 unearned0, care0 support0 medical0 elderlydisabled=false shelter1200 utility0. State eligibility unknown. Conditional arithmetic766. Tool copy/download assumptions clientside, no application submission. Medical deduction above35 for elderly/disabled; sheltercap769 exceptelderly/disabled. No fabricated national utility allowance. USDA example inconsistent, do not copy. Sources control exact current reference amounts.

EVIDENCE
{
  "gateSchemaVersion": 1,
  "author": "benefits_content",
  "route": "/budget/snap-benefits-calculator/",
  "readerQuestion": "How are SNAP benefits calculated? [PAA 0/0; ac 9/9 on-topic, 4/9 calculation-method]",
  "decisionGap": "The strongest lookup matches are /compare/1099-vs-w2/ (pay/tax compensation) and /guides/ssi-and-inheritance/ (inheritance and SSI), neither computes food allotments. Same-run application guide answers submitting an application, and WIC comparison answers program differences. No exact route history at local HEAD or pinned published850b1e4; final /budget/ route lookup separately saved.",
  "finding": "Calculated, with explicit hypothetical inputs: for four people and $2,000 earned monthly income, $1,200 allowed shelter, no other deductions, standard deduction $229 gives net $856.50 and conditional full-month benefit $766. Raising allowed shelter to $1,400 gives $826 before shelter cap binds. Use current COLA constants and our own arithmetic, not USDA\u2019s internally inconsistent worked example. Visible wording will identify our calculation and link a nearby method/inputs table.",
  "conditions": "Client-side deterministic React island. Inputs: household1\u20138, monthly earned/unearned income, necessary dependent care, state-allowed child support, elderly/disabled flag and medical costs, rent/mortgage plus state-approved utility allowance. Standard deductions [217,217,217,229,268,308,308,308]; 20% earned deduction; medical excess above$35 where eligible; excess shelter above half adjusted income, cap$769 unless elderly/disabled. Max allotments [306,562,808,1023,1217,1463,1616,1841]; subtract ceil(0.3\u00d7net). Show raw formula and conditional eligible1\u20132-member $25 minimum distinctly; suppress an award-like amount above federal net reference unless the user explicitly confirms a state eligibility determination. No estimate for AK/HI/territories or9+; link official tables. Defaults are a disclosed hypothetical four-person case. Copy/download result and inputs; no server submission. Validate all boundaries, mobile390px and keyboard access.",
  "whatWouldChange": "Net income and allowed deductions determine a conditional amount up to the household maximum. Use the breakdown and current state allowances to plan, then have the state decide eligibility. Different deductions, state options, first-month dates or a revised COLA change the answer.",
  "basis": "calculated",
  "sourceArtifacts": [
    {
      "path": "reports/mindmap-pass/2026-11-04-aca-snap/sources/snap-cola.txt",
      "sha256": "f8ebb22951e90e78e6d37cd30fe07c357e76b4c36479b98010459c689c1753c5"
    },
    {
      "path": "reports/mindmap-pass/2026-11-04-aca-snap/sources/snap-eligibility.txt",
      "sha256": "13160ffc3ba82531a517e7e6f13d4b3df9a75f4a6afb4491a6701880c391c911"
    },
    {
      "path": "reports/mindmap-pass/2026-11-04-aca-snap/sources/snap-state.txt",
      "sha256": "8bf6530c65b122cc7b36c4c0ceca308bb97610fb6fe203fbf6cd8d245335b33b"
    },
    {
      "path": "reports/mindmap-pass/2026-11-04-aca-snap/sources/snap-eligible-food.txt",
      "sha256": "8fc837e4e8b3a2bc286843548fead789eba6a39d34c8317340f40cf932487a8d"
    }
  ],
  "sources": [
    {
      "id": "snap-cola",
      "url": "https://fns-prod.azureedge.us/snap/allotment/cola",
      "resolvedUrl": "https://fns-prod.azureedge.us/snap/allotment/cola",
      "checked": "2026-11-04",
      "status": "captured",
      "textPath": "reports/mindmap-pass/2026-11-04-aca-snap/sources/snap-cola.txt",
      "sha256": "f8ebb22951e90e78e6d37cd30fe07c357e76b4c36479b98010459c689c1753c5"
    },
    {
      "id": "snap-eligibility",
      "url": "https://fns-prod.azureedge.us/snap/recipient/eligibility",
      "resolvedUrl": "https://fns-prod.azureedge.us/snap/recipient/eligibility",
      "checked": "2026-11-04",
      "status": "captured",
      "textPath": "reports/mindmap-pass/2026-11-04-aca-snap/sources/snap-eligibility.txt",
      "sha256": "13160ffc3ba82531a517e7e6f13d4b3df9a75f4a6afb4491a6701880c391c911"
    },
    {
      "id": "snap-state",
      "url": "https://fns-prod.azureedge.us/snap/state-directory",
      "resolvedUrl": "https://fns-prod.azureedge.us/snap/state-directory",
      "checked": "2026-11-04",
      "status": "captured",
      "textPath": "reports/mindmap-pass/2026-11-04-aca-snap/sources/snap-state.txt",
      "sha256": "8bf6530c65b122cc7b36c4c0ceca308bb97610fb6fe203fbf6cd8d245335b33b"
    },
    {
      "id": "snap-eligible-food",
      "url": "https://fns-prod.azureedge.us/snap/eligible-food-items",
      "resolvedUrl": "https://fns-prod.azureedge.us/snap/eligible-food-items",
      "checked": "2026-11-04",
      "status": "captured",
      "textPath": "reports/mindmap-pass/2026-11-04-aca-snap/sources/snap-eligible-food.txt",
      "sha256": "8fc837e4e8b3a2bc286843548fead789eba6a39d34c8317340f40cf932487a8d"
    }
  ],
  "caseSelection": {
    "path": "reports/mindmap-pass/2026-11-04-aca-snap/evidence/snap-benefits-calculator/cases.json",
    "sha256": "acfb40cf4a84375d9bed9e86b84c11e4ef37b6e679d85a1dc9209802ccbdf9a7"
  },
  "caseDecisions": [
    {
      "selection": "rejected",
      "reason": "No approved topical benefits-client experience exists for ModernWallet; use agency sources and real calculations only."
    }
  ],
  "provenance": {
    "basis": "calculated",
    "supportingRecordIds": [
      "snap-cola",
      "snap-eligibility",
      "snap-state",
      "snap-eligible-food"
    ],
    "scopeAndLimits": "Ordinary financial/program information, excluded from product TESTED format. Reuse existing Jonathan Velez byline without invented credentials/professional review. No clinical/personal eligibility claim. Fresh independent Phase4 review must cover exact final whole render, sources and all transformations. Tool-code validation is separate from product testing. The scope1\u20138/contiguous48+DC is visible beside inputs.",
    "publicMethod": "On-page formula and worked-input table",
    "placement": "Worked example and closing takeaway"
  },
  "plannedTakeaway": "Net income and allowed deductions determine a conditional amount up to the household maximum. Use the breakdown and current state allowances to plan, then have the state decide eligibility. Different deductions, state options, first-month dates or a revised COLA change the answer.",
  "selectedMedium": "interactive tool",
  "mediumReason": "Client-side deterministic React island. Inputs: household1\u20138, monthly earned/unearned income, necessary dependent care, state-allowed child support, elderly/disabled flag and medical costs, rent/mortgage plus state-approved utility allowance. Standard deductions [217,217,217,229,268,308,308,308]; 20% earned deduction; medical excess above$35 where eligible; excess shelter above half adjusted income, cap$769 unless elderly/disabled. Max allotments [306,562,808,1023,1217,1463,1616,1841]; subtract ceil(0.3\u00d7net). Show raw formula and conditional eligible1\u20132-member $25 minimum distinctly; suppress an award-like amount above federal net reference unless the user explicitly confirms a state eligibility determination. No estimate for AK/HI/territories or9+; link official tables. Defaults are a disclosed hypothetical four-person case. Copy/download result and inputs; no server submission. Validate all boundaries, mobile390px and keyboard access.",
  "method": "Deterministic published federal formulas applied to explicit hypothetical scenarios.",
  "units": "USD monthly benefit/premium, annual ACA income and FPL percent",
  "limitations": "Client-side deterministic React island. Inputs: household1\u20138, monthly earned/unearned income, necessary dependent care, state-allowed child support, elderly/disabled flag and medical costs, rent/mortgage plus state-approved utility allowance. Standard deductions [217,217,217,229,268,308,308,308]; 20% earned deduction; medical excess above$35 where eligible; excess shelter above half adjusted income, cap$769 unless elderly/disabled. Max allotments [306,562,808,1023,1217,1463,1616,1841]; subtract ceil(0.3\u00d7net). Show raw formula and conditional eligible1\u20132-member $25 minimum distinctly; suppress an award-like amount above federal net reference unless the user explicitly confirms a state eligibility determination. No estimate for AK/HI/territories or9+; link official tables. Defaults are a disclosed hypothetical four-person case. Copy/download result and inputs; no server submission. Validate all boundaries, mobile390px and keyboard access.",
  "counterexample": {
    "ordinary": {
      "adjustedIncome": 1371.0,
      "shelterDeduction": 514.5,
      "netIncome": 856.5,
      "contribution": 257,
      "formulaBenefit": 766,
      "eligibility": "not determined"
    },
    "higherShelter": {
      "adjustedIncome": 1371.0,
      "shelterDeduction": 714.5,
      "netIncome": 656.5,
      "contribution": 197,
      "formulaBenefit": 826,
      "eligibility": "not determined"
    },
    "zeroIncome": {
      "adjustedIncome": 0,
      "shelterDeduction": 0,
      "netIncome": 0,
      "contribution": 0,
      "formulaBenefit": 306,
      "eligibility": "not determined"
    },
    "highIncome": {
      "adjustedIncome": 7783.0,
      "shelterDeduction": 0,
      "netIncome": 7783.0,
      "contribution": 2335,
      "formulaBenefit": 0,
      "eligibility": "not determined"
    }
  },
  "execution": {
    "command": [
      "/opt/homebrew/opt/python@3.12/bin/python3.12",
      "reports/mindmap-pass/2026-11-04-aca-snap/evidence/calculate.py",
      "reports/mindmap-pass/2026-11-04-aca-snap/evidence/inputs.json",
      "reports/mindmap-pass/2026-11-04-aca-snap/evidence/calculation-output.json"
    ],
    "code": {
      "path": "reports/mindmap-pass/2026-11-04-aca-snap/evidence/calculate.py",
      "sha256": "1758462c892c7a2c31b54585f7adf4d8d6d26b94f98ac4c68a6cdc78d31e2e66"
    },
    "inputs": [
      {
        "path": "reports/mindmap-pass/2026-11-04-aca-snap/evidence/inputs.json",
        "sha256": "218ad3c360a0eb5aedb3a45565ecd7eec8eb354c69e9b229c2cf44a2f8b4899b"
      }
    ],
    "output": {
      "path": "reports/mindmap-pass/2026-11-04-aca-snap/evidence/calculation-output.json",
      "sha256": "7fe82f3f5591062973fc449e53c961ae2b7f40b2efe96f483bfe3080c8705966"
    }
  }
}
{
  "ordinary": {
    "adjustedIncome": 1371.0,
    "shelterDeduction": 514.5,
    "netIncome": 856.5,
    "contribution": 257,
    "formulaBenefit": 766,
    "eligibility": "not determined"
  },
  "higherShelter": {
    "adjustedIncome": 1371.0,
    "shelterDeduction": 714.5,
    "netIncome": 656.5,
    "contribution": 197,
    "formulaBenefit": 826,
    "eligibility": "not determined"
  },
  "zeroIncome": {
    "adjustedIncome": 0,
    "shelterDeduction": 0,
    "netIncome": 0,
    "contribution": 0,
    "formulaBenefit": 306,
    "eligibility": "not determined"
  },
  "highIncome": {
    "adjustedIncome": 7783.0,
    "shelterDeduction": 0,
    "netIncome": 7783.0,
    "contribution": 2335,
    "formulaBenefit": 0,
    "eligibility": "not determined"
  }
}

PRIMARY SOURCE snap-cola https://fns-prod.azureedge.us/snap/allotment/cola checked2026-11-04
SNAP Cost-of-Living Adjustment (COLA) Information | Food and Nutrition Administration
Skip to main content
An official website of the United States government
Here's how you know
Here's how you know
Official websites use .gov
A .gov website belongs to an official government organization in the United States.
Secure .gov websites use HTTPS
A lock (
Lock
Locked padlock
) or https:// means you’ve safely connected to the .gov website. Share sensitive information only on official, secure websites.
You are now leaving the USDA Food and Nutrition Administration website and entering a non-government or non-military external link or a third-party site.
We provide links to other websites with additional information that may be useful or interesting and is consistent with the intended purpose of the content you are viewing on our website. We are providing these links for your reference. We are not responsible for the content, copyright, and licensing restrictions of the new site.
Food and Nutrition Administration
U.S. Department of Agriculture
Menu
Home
Programs
Programs
SNAP
WIC
Meals for Schools and Childcare
Summer Nutrition Programs for Kids
Assistance for Older Adults
Food Distribution & Emergency Assistance
Farmers Market Programs
Nutrition Education & Food Safety
NAP Block Grants for Territories
Data & Research
Data & Research
Data Visualizations
Research & Analysis
Peer Review
Program Data
Funding
Funding
Grant Opportunities
Grants Management
Doing Business with FNA
Newsroom
Newsroom
Press Releases
Federal Register Notices
Newsletters
USDA Press Releases
USDA Blogs
Contact FNA Press Office
Resources
Resources
Fact sheets
Federal Register
Infographics
Guidance documents
Media gallery
Policy memos
Technical assistance
Videos/Webinars
About FNA
About FNA
Administrator
Contact Us
FNA Careers
Reorganization
Program Integrity
Civil Rights
Freedom of Information Act
State Systems Office
USDA National Hunger Hotline
Search
Contact Us
Report Fraud
USDA.gov
SNAP Cost-of-Living Adjustment (COLA) Information
Breadcrumb
Home
Supplemental Nutrition Assistance Program (SNAP)
Resource Type
Policy
Resource Materials
Related Content
SNAP FY 2027 Cost-of-Living Adjustments
USDA Food Plans
We adjust SNAP maximum allotments, deductions, and income eligibility standards at the beginning of each federal fiscal year. The fiscal year begins on Oct. 1st. The changes are based on changes in the cost of living. Cost of living is the amount of money needed to support a basic standard of living.
The Thrifty Food Plan (TFP) calculates the cost of a market basket for a family of four. TFP is an estimate by the U.S. Department of Agriculture of how much it costs to provide nutritious, low-cost meals for a household. Maximum allotments are calculated from this cost every June. The calculation takes economies of scale into account. Smaller households get slightly more per person than the four-person household. Households larger than four people get slightly less per person.
Income eligibility standards are set by law. Gross income means a household's total, non-excluded income, before any deductions have been made. Gross monthly income limits are set at 130% of the poverty level for the household size. Net income means gross income minus allowable deductions. Net monthly income limits are set at 100% of poverty.
Fiscal Year 2027 Standards, Allotments, and DeductionsIncome Eligibility Standards
The following tables provide the monthly income eligibility standards for FY 2027 (effective Oct. 1, 2026, through Sept. 30, 2027). Download the print version (.pdf).Table 1. Net Monthly Income Limit (100% of Federal Poverty Level)
Household Size
48 States, District of Columbia, Guam, Virgin Islands
Alaska
Hawaii
1
$1,330
$1,663
$1,530
2
$1,804
$2,255
$2,075
3
$2,277
$2,846
$2,619
4
$2,750
$3,438
$3,163
5
$3,224
$4,030
$3,707
6
$3,697
$4,621
$4,251
7
$4,170
$5,213
$4,795
8
$4,644
$5,805
$5,340
Each Additional Member
$474
$592
$545Table 2. Gross Monthly Income Limit (130% of Federal Poverty Level)
Household Size
48 States, District of Columbia, Guam, Virgin Islands
Alaska
Hawaii
1
$1,729
$2,162
$1,989
2
$2,345
$2,931
$2,697
3
$2,960
$3,700
$3,404
4
$3,575
$4,469
$4,112
5
$4,191
$5,238
$4,819
6
$4,806
$6,008
$5,527
7
$5,421
$6,777
$6,234
8
$6,037
$7,546
$6,941
Each Additional Member
$616
$770
$708Table 3. Gross Monthly Income Limit Where Elderly/Disabled Members Are a Separate Household (165% of Federal Poverty Level)
Household Size
48 States, District of Columbia, Guam, Virgin Islands
Alaska
Hawaii
1
$2,195
$2,744
$2,525
2
$2,976
$3,720
$3,423
3
$3,757
$4,696
$4,321
4
$4,538
$5,672
$5,219
5
$5,319
$6,649
$6,116
6
$6,100
$7,625
$7,014
7
$6,881
$8,601
$7,912
8
$7,662
$9,577
$8,810
Each Additional Member
$781
$977
$898Maximum Allotments and Deductions
The following tables provide the monthly maximum allotment and allowable deductions for FY 2027 (effective Oct. 1, 2026, through Sept. 30, 2027). Download the print version (.pdf).
Maximum AllotmentsTable 1. Maximum Monthly Allotment
Household Size
48 States and District of Columbia
Alaska
(Urban)
Alaska
(Rural 1)
Alaska
(Rural 2)
Guam
Hawaii
Virgin Islands
1
$306
$392
$499
$608
$452
$496
$394
2
$562
$718
$916
$1,115
$829
$910
$723
3
$808
$1,032
$1,316
$1,602
$1,191
$1,307
$1,039
4
$1,023
$1,306
$1,666
$2,027
$1,507
$1,655
$1,315
5
$1,217
$1,555
$1,982
$2,413
$1,794
$1,969
$1,565
6
$1,463
$1,868
$2,382
$2,900
$2,156
$2,367
$1,880
7
$1,616
$2,064
$2,632
$3,204
$2,382
$2,615
$2,078
8
$1,841
$2,352
$2,999
$3,650
$2,714
$2,979
$2,367
9-17
$225 per
additional
person
$287 per
additional
person
$366 per
additional
person
$446 per
additional
person
$331 per
additional
person
$364 per
additional
person
$289 per
additional
person
18+
$3,887
$4,965
$6,331
$7,705
$5,729
$6,289
$4,997
DeductionsTable 2. Standard Deductions
Household Size
48 States and District of Columbia
Alaska
Guam
Hawaii
Virgin Islands
1
$217
$371
$435
$306
$191
2
$217
$371
$435
$306
$191
3
$217
$371
$435
$306
$191
4
$229
$371
$457
$306
$229
5
$268
$371
$536
$309
$268
6+
$308
$385
$614
$354
$308Table 3. Maximum Excess Shelter Deductions
48 States and District of Columbia
Alaska
Guam
Hawaii
Virgin Islands
$769
$1,229
$903
$1,306
$606Table 4. Homeless Shelter Deduction
48 States and District of Columbia
Alaska
Guam
Hawaii
Virgin Islands
$205.66
$205.66
$205.66
$205.66
$205.66Table 5. Maximum Asset Limits
Household with at least one member age 60+ or disabled
All other households
$4,750
$3,000Maximum Allotments for Alaska, Hawaii, Guam and the U.S. Virgin Islands
These tables give maximum allotments for various household sizes for FY 2027 (effective Oct. 1, 2026, through Sept. 30, 2027). Download the print version (.pdf).Table 1. Alaska
Household Size
Urban
Rural 1
Rural 2
1
$392
$499
$608
2
$718
$916
$1,115
3
$1,032
$1,316
$1,602
4
$1,306
$1,666
$2,027
5
$1,555
$1,982
$2,413
6
$1,868
$2,382
$2,900
7
$2,064
$2,632
$3,204
8
$2,352
$2,999
$3,650
9-17
$287 per additional
person
$366 per additional
person
$446 per additional
person
18+
$4,965
$6,331
$7,705
Table 2. Hawaii
Household Size
Maximum Allotment
1
$496
2
$910
3
$1,307
4
$1,655
5
$1,969
6
$2,367
7
$2,615
8
$2,979
9-17
$364 per additional person
18+
$6,289
Table 3. Guam
Household Size
Maximum Allotment
1
$452
2
$829
3
$1,191
4
$1,507
5
$1,794
6
$2,156
7
$2,382
8
$2,714
9-17
$331 per additional person
18+
$5,729
Table 4. Virgin Islands
Household Size
Maximum Allotment
1
$394
2
$723
3
$1,039
4
$1,315
5
$1,565
6
$1,880
7
$2,078
8
$2,367
9-17
$289 per additional person
18+
$4,997Minimum SNAP Allotment
The following table provides the monthly minimum allotment for FY 2027 (effective Oct. 1, 2026, through Sept. 30, 2027). Download the print version (.pdf).Table 1. Minimum Monthly Allotment
Household Size
48 States and District of Columbia
Alaska
(Urban)
Alaska
(Rural 1)
Alaska
(Rural 2)
Guam
Hawaii
Virgin Islands
1-2
$25
$31
$40
$49
$36
$40
$32
Prior Year Standards, Allotments, and DeductionsIncome Eligibility Standards
2026
2025
2024
2023
2022
2021
2020
2019
2018
2017
2016
2015
2014
2013
2012
2011
2010
2009
2008
2007
2006
2005Maximum Allotments and Deductions
2026
2025
2024
2023
2022
2021-3
2021-2
2021-1
2020
2019
2018
2017
2016
2015
2014-2*
2014-1*
2013
2012
2011
2010
2009-2
2009-1
2008
2007
2006
* pre ARRA (American Recovery & Reinvestment Act of 2009)Maximum Allotments for Alaska, Hawaii, Guam and the U.S. Virgin Islands
2026
2025
2024
2023
2022
2021-3
2021-2
2021-1
2020
2019
2018
2017
2016
2015
2014-2*
2014-1*
2013
2012
2011
2010
2009-2
2009-1
2008
2007
2006
* pre ARRA (American Recovery & Reinvestment Act of 2009)Minimum SNAP Allotment
2026
2025
2024
2023
2022
2021-3
2021-2
2021-1
2020
2019
2018
2017
2016
2015
2014
2013
2012
2011
Page updated: November 04, 2026
Return to top
Home
Programs
Data & Research
Funding
Newsroom
Resources
About FNA
USDA.gov
WhiteHouse.gov
USA.gov
Privacy Policy
Vulnerability Disclosure Policy
Non-Discrimination Statements
Accessibility Statement
FOIA
Plain Writing
Information Quality
Small Business Rights
Sign up for Updates
Your Email Address:
Food and Nutrition Administration
U.S. Department of Agriculture
Menu
Stay Connected X Facebook Gov Delivery Instagram Flickr YouTube LinkedinRSS Feeds

PRIMARY SOURCE snap-eligibility https://fns-prod.azureedge.us/snap/recipient/eligibility checked2026-11-04
SNAP Eligibility | Food and Nutrition Administration
Skip to main content
An official website of the United States government
Here's how you know
Here's how you know
Official websites use .gov
A .gov website belongs to an official government organization in the United States.
Secure .gov websites use HTTPS
A lock (
Lock
Locked padlock
) or https:// means you’ve safely connected to the .gov website. Share sensitive information only on official, secure websites.
You are now leaving the USDA Food and Nutrition Administration website and entering a non-government or non-military external link or a third-party site.
We provide links to other websites with additional information that may be useful or interesting and is consistent with the intended purpose of the content you are viewing on our website. We are providing these links for your reference. We are not responsible for the content, copyright, and licensing restrictions of the new site.
Food and Nutrition Administration
U.S. Department of Agriculture
Menu
Home
Programs
Programs
SNAP
WIC
Meals for Schools and Childcare
Summer Nutrition Programs for Kids
Assistance for Older Adults
Food Distribution & Emergency Assistance
Farmers Market Programs
Nutrition Education & Food Safety
NAP Block Grants for Territories
Data & Research
Data & Research
Data Visualizations
Research & Analysis
Peer Review
Program Data
Funding
Funding
Grant Opportunities
Grants Management
Doing Business with FNA
Newsroom
Newsroom
Press Releases
Federal Register Notices
Newsletters
USDA Press Releases
USDA Blogs
Contact FNA Press Office
Resources
Resources
Fact sheets
Federal Register
Infographics
Guidance documents
Media gallery
Policy memos
Technical assistance
Videos/Webinars
About FNA
About FNA
Administrator
Contact Us
FNA Careers
Reorganization
Program Integrity
Civil Rights
Freedom of Information Act
State Systems Office
USDA National Hunger Hotline
Search
Contact Us
Report Fraud
USDA.gov
SNAP Eligibility
Breadcrumb
Home
Programs
SNAP
Applicant/Recipient
Am I Eligible for SNAP?
Applicant/Recipient
Am I Eligible for SNAP?
How Do I Apply for SNAP?
How can I use SNAP benefits?
Locate Retailers
Work Requirements
Navigating SNAP Quality Control: A Guide for SNAP Recipients
Eating Healthy with SNAP
The Working Families Tax Cuts changes certain eligibility factors for SNAP. This includes changes to the SNAP work requirements and non-citizen eligibility. We are in the process of updating this page with the changes made by the Working Families Tax Cut Act.
To get SNAP benefits, you must apply in the state in which you currently live and you must meet certain requirements, including resource and income limits, which are described on this page. SNAP income and resource limits are updated annually.
The information on this page is for Oct. 1, 2026, through Sept. 30, 2027.
There are special SNAP rules for households with elderly or disabled members.
Frequently Asked QuestionsAm I eligible for SNAP?
Your household must meet certain requirements to be eligible for SNAP and receive benefits. If your state agency determines that you are eligible to receive SNAP benefits, you will receive benefits back to the date you submitted your application.How do I apply for SNAP?
You must apply for SNAP in the state where you currently live. Because each state has a different application form and process, a member of your household must contact your state agency directly to apply.
You can contact your state agency by visiting your local SNAP office, visiting your state agency’s website, or calling your state’s toll-free SNAP Information hotline. Some states have online applications that can be completed from the state agency website.Where can I get my state information?
If you are unable to go to or call your local SNAP office or do not have access to the internet, you may have another person act as an authorized representative by applying and being interviewed on your behalf. You must designate the authorized representative in writing.
Note: Please contact your SNAP state agency directly to apply and to request information about the status of your application. FNA does not process applications or have access to case information.What happens when I apply for SNAP?
In most cases, once you submit your application, your state agency or local SNAP office will process it and send you a notice telling you whether or not you are eligible for benefits within 30 days.
During the 30 days, you will need to complete an eligibility interview and give proof (verification) of the information you provided. The interview is typically completed over the telephone or in-person. If you are found eligible, you will receive benefits based on the date you submitted your application.
You may be eligible to receive SNAP benefits within 7 days of your application date if you meet additional requirements. For example, if your household has less than $100 in liquid resources and $150 in monthly gross income, or if your household’s combined monthly gross income and liquid resources are less than what you pay each month for rent or mortgage and utilities expenses. Contact your state agency for additional details.How do I receive SNAP benefits?
If you are found eligible, you will receive SNAP benefits on an Electronic Benefit Transfer (EBT) card, which works like a debit card. Benefits are automatically loaded into your account each month. You can use your EBT card to buy groceries at authorized food stores and retailers.
When Are SNAP Benefits Available?
(A benefit issuance schedule can be found for each state.)
What Can SNAP Buy?
What is Electronic Benefits Transfer (EBT)?
Where Can I Use SNAP?How long will I receive SNAP?
If you are found eligible, you will receive a notice that tells you how long you will receive SNAP benefits for; this is called your certification period. Before your certification period ends, you will receive another notice that says you must recertify to continue receiving benefits. Your local SNAP office will provide you with information about how to recertify.Who is in a SNAP household?
Everyone who lives together and purchases and prepares meals together is grouped together as one SNAP household.
Some people who live together, such as spouses and most children under age 22, are included in the same SNAP household, even if they purchase and prepare meals separately.
If a person is 60 years of age or older and unable to purchase and prepare meals separately because of a permanent disability, the person and the person's spouse may be a separate SNAP household if the others they live with do not have very much income (no more than 165% of the poverty level).
Normally you are not eligible for SNAP benefits if an institution gives you most of your meals. There are exceptions for elderly persons and disabled persons.What resources can I have and still get SNAP benefits?
Currently, households may have $3,000 in countable resources (such as cash or money in a bank account) or $4,750 in countable resources if at least one member of the household is age 60 or older, or is disabled. These amounts are updated annually.
However, certain resources are NOT counted when determining eligibility for SNAP:
A home and lot;
Resources of people who receive Supplemental Security Income (SSI);
Resources of people who receive Temporary Assistance for Needy Families (TANF; also known as welfare); and
Most retirement and pension plans (withdrawals from these accounts may count as either income or resources depending on how often they occur).
Depending on which state you live in, you may be able to have more resources than the above limits and still be eligible for SNAP. Most state agencies have adopted broad-based categorical eligibility (BBCE), which allows state agencies to align income and resource limits with their TANF-funded programs. Under BBCE, households are categorically eligible for SNAP if they are eligible to receive a TANF or maintenance of effort (MOE) state-funded non-cash benefit. Even if you meet the BBCE income and resource limit in your state, you will still need to meet non-financial eligibility rules and have an income low enough to receive SNAP benefits.Do vehicles count as resources?
Vehicles count as a resource for SNAP purposes. States determine how vehicles may count toward household resources.
Licensed vehicles are NOT counted if they are:
Used for income-producing purposes (e.g., taxi, truck or delivery vehicle);
Annually producing income consistent with their fair market value;
Needed for long distance travel for work (other than daily commute);
Used as the home;
Needed to transport a physically disabled household member;
Needed to carry most of the household's fuel or water; or
If the sale of the vehicle would result in less than $1,500.
For non-excluded licensed vehicles, the fair market value over $4,650 counts as a resource.
Licensed vehicles are also subject to an equity test, which is the fair market value less any amount owed on the vehicle. The following vehicles are excluded from the equity test:
One vehicle per adult household member; and
Any other vehicle used by a household member under 18 to drive to work, school, job training, or to look for work.
For vehicles with both a fair market value over $4,650 and an equity value, the greater of the two amounts is counted as a resource.
Additionally, the equity value of unlicensed vehicles generally counts as a resource, with some exceptions.What are the SNAP income limits?
In most cases, your household must meet both the gross and net income limits described below or you are not eligible for SNAP and cannot receive benefits.
Gross income means a household's total, non-excluded income, before any deductions have been made.
Net income means gross income minus allowable deductions.
A household with an elderly or disabled person only has to meet the net income limit, as described on the elderly and disabled page.
If all members of your household receive Temporary Assistance for Needy Families (TANF), Supplemental Security Income (SSI), or in some places other general assistance, your household may be deemed “categorically eligible” for SNAP because you have already been determined eligible for another means-tested program.
Most state agencies have adopted broad-based categorical eligibility (BBCE), which allows state agencies to align income and resource limits with their TANF-funded programs. Under BBCE, households are categorically eligible for SNAP if they are eligible to receive a TANF or maintenance of effort (MOE) state-funded non-cash benefit. Even if you meet the BBCE income and resource limit in your state, you will still need to meet non-financial eligibility rules and have an income low enough to receive SNAP benefits.
The information provided in the table below applies to households in the 48 contiguous states, the District of Columbia, Guam, and U.S. Virgin Islands that apply for SNAP between Oct. 1, 2026, through Sept. 30, 2027.Table 1: SNAP Income Eligibility Limits - Oct. 1, 2026, through Sept. 30, 2027
Household Size
Gross monthly income
(130% of poverty)
Net monthly income
(100% of poverty)
1
$1,729
$1,330
2
$2,345
$1,804
3
$2,960
$2,277
4
$3,575
$2,750
5
$4,191
$3,224
6
$4,806
$3,697
7
$5,421
$4,170
8
$6,037
$4,644
Each additional member
+$616
+$474
* SNAP gross and net income limits are higher in Alaska and Hawaii.What deductions are allowed in SNAP?
The following deductions are allowed for SNAP:
A 20% deduction from earned income.
A standard deduction of $217 for household sizes of 1 to 3 people (higher for some larger households and different for households in Alaska, Hawaii, the U.S. Virgin Islands, and Guam).
A dependent care deduction when needed for work, training, or education.
Medical expenses for elderly or disabled members that are more than $35 for the month if they are not paid by insurance or someone else. This is described on the elderly and disabled page.
In some states, legally owed child support payments.
A standard shelter deduction for homeless households of $205.66.
Excess shelter costs as described below.
SNAP Excess Shelter Costs Deduction
The excess shelter deduction is for shelter costs that are more than half of the household's income after other deductions.
Allowable shelter costs include:
Fuel to heat and cook with.
Electricity.
Water.
The basic fee for one telephone.
Rent or mortgage payments and interest.
Taxes on the home.
Some states allow a set amount for utility costs instead of actual costs.
The amount of the shelter deduction is capped at (or limited to) $769 unless one person in the household is elderly or disabled. The limit is different in Alaska, Hawaii, Guam, and the U.S. Virgin Islands. For a household with an elderly or disabled member, all shelter costs over half of the household's income may be deducted.Table 2. How to Calculate SNAP Gross Income
Gross Income Calculation
Example
Determine household size . . .
4 people with no elderly or disabled members.
Add gross monthly income . . .
$1,500 earned income + $550 social security = $2,050 gross income.
If gross monthly income is less than the limit for household size, determine net income.
$2,050 is less than the $3,575 allowed for a 4-person household, so determine net income.
Note: This example is based on a 4-person household living in the 48 contiguous states or the District of Columbia.Table 3: How to Calculate SNAP Net Income
Net Income Calculation
Example
Subtract 20% earned income deduction...
$2,050 gross income
$1,500 earned income x 20% = $300.
$2,050 - $300 = $1,750
Subtract standard deduction...
$1,750 - $217 standard deduction for a 4-person household = $1,533
Subtract dependent care deduction...
$1,533 - $362 dependent care = $1,171
Subtract child support deduction...
$0
Subtract medical costs over $35 for elderly and disabled...
$0
Excess shelter deduction...
See below
Determine half of adjusted income...
$1,171 adjusted income ÷ 2 = $585.50
Determine if shelter costs are more than half of adjusted income...
$700 total shelter expenses - $585.50 (half of income) = $114.50 excess shelter cost
Subtract excess amount, but not more than the limit, from adjusted income...
$1,165 - $114.50 = $1,056.50 net monthly income
Apply the net income test...
Since $1,056.50 is less than the $2,750 allowed for a 4-person household, this household has met the income test.
Note: This example is based on a 4-person household living in the 48 contiguous states or the District of Columbia.How much could I receive in SNAP benefits?
The total amount of SNAP benefits your household gets each month is called an allotment.
Because SNAP households are expected to spend about 30 percent of their own resources on food, your allotment is calculated by multiplying your household’s net monthly income by 0.3, and subtracting the result from the maximum monthly allotment for your household size.Table 4: SNAP Maximum Monthly Allotment Based on Household Size
People in Household
Maximum Monthly Allotment
1
$306
2
$562
3
$808
4
$1,023
5
$1,217
6
$1,463
7
$1,616
8
$1,841
9-17
$225 per additional person
18+
$3,887
Note: The allotments described here are for households in the 48 contiguous states and the District of Columbia. The allotments are different in Alaska, Hawaii, Guam, and the U.S. Virgin Islands.Table 5: Example of SNAP Benefit Calculation
Benefit Computation
Example
Multiply net income by 30%... (round up)
$1,056.50 net monthly income from above calculation x 0.3 = $317
Subtract 30% of net income from the maximum allotment for the household size...
$1,023 maximum allotment for 4-person household - $317 (30% of net income) = $706, SNAP Allotment for a full month
Note: This example is based on a 4-person household living in the 48 contiguous states or the District of Columbia.What are the SNAP work requirements?
In general, people must meet work requirements to be eligible for SNAP. These work requirements include:
Registering for work;
Not voluntarily quitting a job or reducing hours;
Taking a job if offered; and
Participating in employment and training programs, if assigned by the state.
Failure to comply with these requirements can result in disqualification from the program.
In addition, able bodied adults without dependents are required to work or participate in a work program for at least 20 hours per week in order to receive SNAP benefits for more than 3 months in a 36-month period.
Some special groups may not be subject to these requirements including:
Children;
Seniors;
Veterans;
Individuals experiencing homelessness;
Individuals age 24 or younger and in foster care on their 18th birthday;
Pregnant women; and
People who are exempt for physical or mental health reasons.Are students eligible for SNAP?
Generally, students ages 18 through 49 who are enrolled in college at least half time are not eligible for SNAP unless they meet certain specific exemptions.Are non-citizens eligible for SNAP?
SNAP eligibility has never been extended to undocumented non-citizens. Specific requirements for who may be eligible have changed substantially over the years and become more complicated in certain areas. The Food and Nutrition Act of 2008 limits eligibility for SNAP benefits to U.S. citizens and certain lawfully present non-citizens.
Generally, to qualify for SNAP, non-citizens must meet one of the following criteria:
Have lived in the United States for at least 5 years.
Be receiving disability-related assistance or benefits.
Be children under 18.
Additionally, these individuals must also satisfy other SNAP eligibility requirements such as income and resource limits in order to qualify for benefits.
If certain members of a household are ineligible for SNAP, state agencies must still determine eligibility for SNAP for any remaining household members who are seeking assistance.
For additional information see: SNAP Policy on Non-Citizen Eligibility and SNAP Guidance on Non-Citizen Eligibility.What if I disagree with a decision made on my SNAP case?
If you disagree with a decision in your case, you may request a fair hearing with an official who is required by law to review the facts of your case in a fair and objective manner.
You must request a fair hearing within 90 days of the day your local SNAP office made the decision in your case that you disagree with.
You can request a fair hearing over the phone, in writing, or in person at the local SNAP office.
Although a fair hearing cannot change the laws or regulations governing SNAP, it can ensure that decisions on your case have been made correctly.Nondiscrimination in SNAP
In accordance with Federal civil rights law and U.S. Department of Agriculture (USDA) civil rights regulations and policies, the USDA, its agencies, offices, employees, and institutions participating in or administering USDA programs are prohibited from discriminating based on race, color, national origin, religion, sex, disability, age, marital status, family/parental status, income derived from a public assistance program, political beliefs, or reprisal or retaliation for prior civil rights activity, in any program or activity conducted or funded by USDA (not all bases apply to all programs). Remedies and complaint filing deadlines vary by program or incident.
Persons with disabilities who require alternative means of communication for program information (e.g., Braille, large print, audiotape, American Sign Language, etc.) should contact the State or local Agency that administers the program or contact USDA through the Telecommunications Relay Service at 711 (voice and TTY). Additionally, program information may be made available in languages other than English.
To file a program discrimination complaint, complete the USDA Program Discrimination Complaint Form, AD-3027, found online at How to File a Program Discrimination Complaint and at any USDA office or write a letter addressed to USDA and provide in the letter all of the information requested in the form. To request a copy of the complaint form, call (866) 632-9992. Submit your completed form or letter to USDA by:
Mail: USDA Food and Nutrition Administration, George Washington Carver Center, 5601 Sunnyside Ave., Beltsville, MD 20740; or
Email: FNACIVILRIGHTSCOMPLAINTS@usda.gov.
For additional information about SNAP in your state, to file an application for SNAP benefits, or to get information about your SNAP case, you must contact your local SNAP office.
Page updated: November 03, 2026
Return to top
Home
Programs
Data & Research
Funding
Newsroom
Resources
About FNA
USDA.gov
WhiteHouse.gov
USA.gov
Privacy Policy
Vulnerability Disclosure Policy
Non-Discrimination Statements
Accessibility Statement
FOIA
Plain Writing
Information Quality
Small Business Rights
Sign up for Updates
Your Email Address:
Food and Nutrition Administration
U.S. Department of Agriculture
Menu
Stay Connected X Facebook Gov Delivery Instagram Flickr YouTube LinkedinRSS Feeds

PRIMARY SOURCE snap-state https://fns-prod.azureedge.us/snap/state-directory checked2026-11-04
SNAP State Directory of Resources | Food and Nutrition Administration
Skip to main content
An official website of the United States government
Here's how you know
Here's how you know
Official websites use .gov
A .gov website belongs to an official government organization in the United States.
Secure .gov websites use HTTPS
A lock (
Lock
Locked padlock
) or https:// means you’ve safely connected to the .gov website. Share sensitive information only on official, secure websites.
You are now leaving the USDA Food and Nutrition Administration website and entering a non-government or non-military external link or a third-party site.
We provide links to other websites with additional information that may be useful or interesting and is consistent with the intended purpose of the content you are viewing on our website. We are providing these links for your reference. We are not responsible for the content, copyright, and licensing restrictions of the new site.
Food and Nutrition Administration
U.S. Department of Agriculture
Menu
Home
Programs
Programs
SNAP
WIC
Meals for Schools and Childcare
Summer Nutrition Programs for Kids
Assistance for Older Adults
Food Distribution & Emergency Assistance
Farmers Market Programs
Nutrition Education & Food Safety
NAP Block Grants for Territories
Data & Research
Data & Research
Data Visualizations
Research & Analysis
Peer Review
Program Data
Funding
Funding
Grant Opportunities
Grants Management
Doing Business with FNA
Newsroom
Newsroom
Press Releases
Federal Register Notices
Newsletters
USDA Press Releases
USDA Blogs
Contact FNA Press Office
Resources
Resources
Fact sheets
Federal Register
Infographics
Guidance documents
Media gallery
Policy memos
Technical assistance
Videos/Webinars
About FNA
About FNA
Administrator
Contact Us
FNA Careers
Reorganization
Program Integrity
Civil Rights
Freedom of Information Act
State Systems Office
USDA National Hunger Hotline
Search
Contact Us
Report Fraud
USDA.gov
SNAP State Directory of Resources
Breadcrumb
Home
Programs
SNAP
Applicant/Recipient
How Do I Apply for SNAP?
SNAP State Directory of Resources
To apply for benefits or get information about SNAP, you must contact your local SNAP office.
FNA does not have information on individual applications.
Click your state (or NYC) on the map below for contact and application information. Each state has its own application form. If your state’s form is not on the web, you'll need to contact your local SNAP office to request one.
SNAP State Directory of Resources
Skip Map
AL
AK
AZ
AR
CA
CO
CT
DE
District of Columbia>
DC
FL
GA
HI
ID
IL
IN
IA
KS
KY
LA
ME
MD
MA
MI
MN
MS
MO
MT
NE
NV
NH
NJ
NM
NY
NYC
NC
ND
OH
OK
OR
PA
RI
SC
SD
TN
TX
UT
VT
VA
WA
WV
WI
WY
GU
PR
VI
Alabama
Alaska
Arizona
Arkansas
California
Colorado
Connecticut
Delaware
District of Columbia
Florida
Georgia
Guam
Hawaii
Idaho
Illinois
Indiana
Iowa
Kansas
Kentucky
Louisiana
Maine
Maryland
Massachusetts
Michigan
Minnesota
Mississippi
Missouri
Montana
Nebraska
Nevada
New Hampshire
New Jersey
New Mexico
New York
New York City
North Carolina
North Dakota
Ohio
Oklahoma
Oregon
Pennsylvania
Puerto Rico
Rhode Island
South Carolina
South Dakota
Tennessee
Texas
Utah
Vermont
Virgin Islands
Virginia
Washington
West Virginia
Wisconsin
Wyoming
SNAP State Directory of Resources
View the SNAP Monthly Benefit Issuance Schedule for all states including the District of Columbia, Guam, Hawaii, Puerto Rico and the U.S. Virgin Islands:
Monthly SNAP Issuance Schedule for All States and Territories
If you have additional questions please contact us.
Page updated: January 30, 2025
Return to top
Home
Programs
Data & Research
Funding
Newsroom
Resources
About FNA
USDA.gov
WhiteHouse.gov
USA.gov
Privacy Policy
Vulnerability Disclosure Policy
Non-Discrimination Statements
Accessibility Statement
FOIA
Plain Writing
Information Quality
Small Business Rights
Sign up for Updates
Your Email Address:
Food and Nutrition Administration
U.S. Department of Agriculture
Menu
Stay Connected X Facebook Gov Delivery Instagram Flickr YouTube LinkedinRSS Feeds

PRIMARY SOURCE snap-eligible-food https://fns-prod.azureedge.us/snap/eligible-food-items checked2026-11-04
What Can SNAP Buy? | Food and Nutrition Administration
Skip to main content
An official website of the United States government
Here's how you know
Here's how you know
Official websites use .gov
A .gov website belongs to an official government organization in the United States.
Secure .gov websites use HTTPS
A lock (
Lock
Locked padlock
) or https:// means you’ve safely connected to the .gov website. Share sensitive information only on official, secure websites.
You are now leaving the USDA Food and Nutrition Administration website and entering a non-government or non-military external link or a third-party site.
We provide links to other websites with additional information that may be useful or interesting and is consistent with the intended purpose of the content you are viewing on our website. We are providing these links for your reference. We are not responsible for the content, copyright, and licensing restrictions of the new site.
Food and Nutrition Administration
U.S. Department of Agriculture
Menu
Home
Programs
Programs
SNAP
WIC
Meals for Schools and Childcare
Summer Nutrition Programs for Kids
Assistance for Older Adults
Food Distribution & Emergency Assistance
Farmers Market Programs
Nutrition Education & Food Safety
NAP Block Grants for Territories
Data & Research
Data & Research
Data Visualizations
Research & Analysis
Peer Review
Program Data
Funding
Funding
Grant Opportunities
Grants Management
Doing Business with FNA
Newsroom
Newsroom
Press Releases
Federal Register Notices
Newsletters
USDA Press Releases
USDA Blogs
Contact FNA Press Office
Resources
Resources
Fact sheets
Federal Register
Infographics
Guidance documents
Media gallery
Policy memos
Technical assistance
Videos/Webinars
About FNA
About FNA
Administrator
Contact Us
FNA Careers
Reorganization
Program Integrity
Civil Rights
Freedom of Information Act
State Systems Office
USDA National Hunger Hotline
Search
Contact Us
Report Fraud
USDA.gov
What Can SNAP Buy?
Breadcrumb
Home
Programs
SNAP
Applicant/Recipient
How can I use SNAP benefits?
Applicant/Recipient
Am I Eligible for SNAP?
How Do I Apply for SNAP?
How can I use SNAP benefits?
Locate Retailers
Work Requirements
Navigating SNAP Quality Control: A Guide for SNAP Recipients
Eating Healthy with SNAP
Any food for the household, such as:
Fruits and vegetables;
Meat, poultry, and fish;
Dairy products;
Breads and cereals;
Other foods such as snack foods and non-alcoholic beverages; and
Seeds and plants, which produce food for the household to eat.
Households CANNOT use SNAP benefits to buy:
Beer, wine, and liquor.
Cigarettes and tobacco.
Food and drinks containing controlled substances such as cannabis/marijuana and CBD.
Vitamins, medicines, and supplements. If an item has a Supplement Facts label, it is considered a supplement and is not eligible for SNAP purchase.
Live animals (except shellfish, fish removed from water, and animals slaughtered prior to pick-up from the store).
Foods that are hot at the point of sale.
Any nonfood items such as:
Pet foods
Cleaning supplies, paper products, and other household supplies.
Hygiene items and cosmetics
Retailer Eligibility Resources
What are Staple Foods?
Accessory Foods
Contact Us
Email your question to: RPMDHQ-WEB@usda.gov
Page updated: November 04, 2026
Return to top
Home
Programs
Data & Research
Funding
Newsroom
Resources
About FNA
USDA.gov
WhiteHouse.gov
USA.gov
Privacy Policy
Vulnerability Disclosure Policy
Non-Discrimination Statements
Accessibility Statement
FOIA
Plain Writing
Information Quality
Small Business Rights
Sign up for Updates
Your Email Address:
Food and Nutrition Administration
U.S. Department of Agriculture
Menu
Stay Connected X Facebook Gov Delivery Instagram Flickr YouTube LinkedinRSS Feeds

CLOSED URL LIST
https://fns-prod.azureedge.us/snap/allotment/cola
https://fns-prod.azureedge.us/snap/recipient/eligibility
https://fns-prod.azureedge.us/snap/state-directory
https://fns-prod.azureedge.us/snap/eligible-food-items
INTERNAL LINKS
{
  "placements": [
    {
      "source": "/budget/snap-benefits-calculator/",
      "target": "/budget/household-budget-calculator/",
      "section": "Your Next Step",
      "anchor": "plan the rest of your household budget",
      "purpose": "Existing destination inspected in link-source-records; supports the next budgeting action",
      "inspection": {
        "path": "reports/mindmap-pass/2026-11-04-aca-snap/link-inspections.json",
        "sha256": "005ebced6f218c199578c561bdc078537aedc2cb03ef2052dcc50441054b34d9"
      }
    },
    {
      "source": "/budget/snap-benefits-calculator/",
      "target": "/guides/how-to-make-a-budget/",
      "section": "Your Next Step",
      "anchor": "build a budget from your statements",
      "purpose": "Existing destination inspected in link-source-records; supports the next budgeting action",
      "inspection": {
        "path": "reports/mindmap-pass/2026-11-04-aca-snap/link-inspections.json",
        "sha256": "005ebced6f218c199578c561bdc078537aedc2cb03ef2052dcc50441054b34d9"
      }
    }
  ]
}
OUTPUT DATA
slug: snap-benefits-calculator
body floor: 1200
Generate about 1550 substantive body words to retain the floor after unsupported claims are removed. No padding.
Use exact metadata from identity, all approved FAQ questions.
