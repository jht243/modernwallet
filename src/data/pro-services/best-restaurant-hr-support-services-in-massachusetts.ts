import type { RoundupEntry } from "../roundups";

// Paid placement (eseospace, 2026-10-18). #1 is the client (Back of House Ops, backhousehr.com).
// Every provider fact comes from that provider's own website. Every rule comes from mass.gov or dol.gov.
// All checked 2026-10-18. register: operator. page type: roundup (review floor 1,500).
// medium: text -> text. reader question: "Which HR support service should a Massachusetts restaurant use,
// and what does it cost?" [verb-only, no PAA, no completions]. No review page exists for the client.

export const BEST_MA_RESTAURANT_HR: RoundupEntry = {
  slug: "best-restaurant-hr-support-services-in-massachusetts",
  updated: "2026-10-18",
  noAds: true,
  title: "Best Restaurant HR Support Services in Massachusetts (2026)",
  metaDescription:
    "Seven restaurant HR support options for Massachusetts compared on price, who runs payroll, and tip-law handling, from $1,335 a year to $79 per employee a month.",
  targetKeyword: "restaurant HR support services in Massachusetts",
  category: "restaurant HR support services",
  angle: "best",
  segment: "small business owners",
  h1: "Best Restaurant HR Support Services in Massachusetts",
  introText:
    "Back of House Ops is our top pick among restaurant human resources (HR) support services in Massachusetts for groups of one to three locations. At ModernWallet, we publish free calculators and plain-language money guides for owners who need an accurate number before they sign anything.\n\nBack of House Ops prepares payroll and hiring paperwork each week, and your restaurant stays the employer and approves every run. We compared it with six other options, from restaurant payroll software to a professional employer organization (PEO). Published prices run from $1,335 a year for an HR hotline membership to $79 per employee per month for a PEO.",
  rankingCriteria:
    "We ranked each option on what it publishes about its own service. We did not hire any of them.\n\n- Massachusetts tip and wage rules. Errors on the service rate, tip pools, and sick pay for tipped staff cost the most, because the state Wage Act triples unpaid wages.\n- Who does the weekly work. Software gives you a place to run payroll. A service or a PEO puts a person on the inputs.\n- Who the employer is. A PEO becomes a co-employer. Every other option leaves your restaurant as the only employer.\n- A price you can see before a sales call. A published price lets you work out the monthly cost for your own headcount and a summer hiring wave.\n\nPrices are each provider's own published figures as of October 2026. Two providers publish none, and we say so rather than guess.",
  options: [
    {
      name: "Back of House Ops",
      bestFor:
        "Owner-led restaurants with 1 to 3 locations and roughly 15 to 75 staff that want payroll prepared for them while they stay the employer",
      description:
        "Back of House Ops is a Massachusetts service that runs the recurring payroll and people paperwork for independent restaurants and small groups.\n\nEach pay cycle, Back of House Ops assembles hours, tips, rate changes, new hires, and terminations, then checks them against your timekeeping and point-of-sale (POS) records. A named approver at your restaurant reviews the run and its flagged exceptions. Nothing goes out through your payroll platform until that person signs off, and Back of House Ops says that step cannot be waived.\n\nThe retainer also covers onboarding, I-9 tracking, state new-hire reporting, personnel and discipline records, the employee handbook, and Work Opportunity Tax Credit (WOTC) screening. Back of House Ops is not a PEO or a law firm, so legal and tax questions go to your own advisers.",
      strengths: [
        "Flat monthly retainer with no per-employee fee, so a summer hiring wave inside your tier does not raise the bill",
        "A named approver signs off on every run, so a rushed Friday cutoff cannot send out a payroll nobody checked",
        "A public service-scope page splits every task between Back of House Ops and your restaurant, so you see the exclusions before you sign",
        "The written proposal names any third-party or platform cost before you commit",
      ],
      limitations: [
        "The retainer does not include your payroll platform. Gusto, Toast, or another system is a separate bill",
        "Massachusetts only. Other New England states and New York City are listed as expansion plans that Back of House Ops does not serve yet",
        "No benefits, workers' compensation, or co-employment. Justworks PEO below fits better if you want those",
        "The site describes a Massachusetts launch and publishes no client list or reviews, so ask for references from restaurants your size",
        "Going from 25 to 26 employees moves you from $495 to $895 a month. Ask how a summer crossing of that line is billed",
      ],
      pricing:
        "Essentials $495/month (one location, up to 25 employees). Growth $895/month (1 to 2 locations, 26 to 75 employees). Group from $1,795/month (3 to 10 locations, up to 300 employees). Payroll platform costs are separate.",
    },
    {
      name: "Toast Payroll",
      bestFor: "Restaurants already on the Toast POS that want hours and tips to flow into payroll without retyping",
      description:
        "Toast Payroll is payroll software from Toast, the restaurant POS company. It pulls hours and tips from the Toast POS and pools tips by rules you set. It also calculates overtime across locations and pay rates, plus tip makeup when tips fall short of the minimum wage.\n\nToast pairs the software with human support: a setup specialist, a live first payroll, and chat or phone help seven days a week. Toast says it will cover fines up to $4,000 if your first quarterly tax filing is not accepted, with terms attached.",
      strengths: [
        "Hours and tips come straight from the Toast POS, so nobody retypes timecards",
        "Overtime across locations and job codes, for staff who work two roles at two rates",
        "Seven-day support, so a weekend payroll question gets an answer before Monday",
      ],
      limitations: [
        "No published payroll price. Toast's pricing page sends quotes through its sales team",
        "Toast Payroll is software only. Your manager still collects inputs and keeps every HR document",
        "Massachusetts bars kitchen staff from tip pools, so check how your pool rules are set up in any payroll software before the first run",
      ],
      pricing: "Not published. Quote through Toast sales.",
    },
    {
      name: "Restaurant HR Group",
      bestFor:
        "Restaurant groups that want a dedicated outside HR manager for payroll entry, benefits administration, and employee relations",
      description:
        "Restaurant HR Group is an outsourced HR firm in Mount Prospect, Illinois, founded by Carrie Luxem, that serves restaurants nationwide. A dedicated HR manager handles handbooks, compliance, employee relations, and manager training. On payroll, Restaurant HR Group enters data in your existing payroll system and processes W-2s and 1099s.\n\nIt also lists benefits administration among its services. Pricing comes in a written proposal, so ask for the monthly fee, the contract term and exactly which benefits tasks are included.",
      strengths: [
        "Benefits administration, which Back of House Ops excludes",
        "Hands-on help with corrective action, complaints, and terminations",
      ],
      limitations: [
        "No published prices, so you can compare only after a proposal",
        "Based in Illinois. Ask how it tracks the Massachusetts tip pool and service-rate rules",
        "Payroll still runs in a separate system you pay for",
      ],
      pricing: "Quote-based monthly fee set in a written proposal.",
    },
    {
      name: "Justworks PEO",
      bestFor: "Restaurants that want health benefits for staff and a co-employer handling payroll taxes and HR consulting",
      description:
        "Justworks PEO makes Justworks a co-employer of your staff. Justworks runs payroll, files employer payroll taxes and W-2s, and lists tips processing among its payroll features. PEO Basic adds HR consulting, compliance alerts, 401(k) access, and 24/7 support.\n\nPEO Plus adds medical, dental, and vision administration, so health insurance sits on the same bill as payroll. Justworks lists workers' compensation as required on its PEO plans.",
      strengths: [
        "Published per-employee price with no base fee on the PEO plans",
        "Medical, dental, and vision administration on PEO Plus",
        "24/7 support on the PEO plans",
      ],
      limitations: [
        "Per-employee pricing climbs with seasonal hiring, so a busy summer costs more",
        "Co-employment changes who the employer is on paper. Read the client service agreement for who handles a wage claim",
        "Not built for restaurants, so the Massachusetts tip pool setup is still your decision",
      ],
      pricing: "PEO Basic $79/employee/month. PEO Plus $124/employee/month. No base fee.",
    },
    {
      name: "Gusto",
      bestFor: "Single-location restaurants that want low-cost payroll software and will run each payroll themselves",
      description:
        "Gusto is payroll software with tax filings included on every plan. Its help center explains how to enter cash tips and paycheck tips separately and how to record tip credits for staff on the $6.75 service rate. Premium adds HR guidance and a named advisor, and Gusto sells pay-as-you-go workers' compensation from $14 a month.",
      strengths: [
        "Simple costs $49 a month plus $6 per person with unlimited payrolls and tax filings",
        "Separate cash-tip and paycheck-tip entry, so card tips are taxed through payroll and cash tips are still reported",
        "Gusto says you can cancel any time, so you can change plans as the restaurant grows",
      ],
      limitations: [
        "We found no tip pool calculator on Gusto's pricing page, so plan to calculate pools in your POS",
        "You or a manager run each payroll and keep the HR files",
      ],
      pricing: "Simple $49/month + $6/person. Plus $80/month + $12/person. Premium $180/month + $22/person.",
    },
    {
      name: "Homebase",
      bestFor: "Restaurants that need scheduling, time clocks, and tip pooling first, with payroll added on",
      description:
        "Homebase is a scheduling and time-clock app for hourly teams. Its Tip Manager add-on pulls tips from your POS, calculates the tip pool, and adds it to timesheets. Payroll costs $49 a month plus $6 per employee paid, and the All-in-One plan adds onboarding and HR and compliance tools.",
      strengths: [
        "Scheduling and payroll in one app, so timecards feed payroll directly",
        "Tip Manager calculates pools from POS data for $25 per location a month",
        "A free Basic plan for one location with up to 10 employees",
      ],
      limitations: [
        "Plan fees are per location, so a second address doubles the plan cost",
        "Massachusetts limits tip pools to service staff, so check the rules you set in Tip Manager",
      ],
      pricing:
        "Basic free (1 location, up to 10 employees). Essentials $30, Plus $70, All-in-One $120 per location/month. Payroll $49/month + $6/employee paid. Tip Manager $25/location/month.",
    },
    {
      name: "Employers Association of the NorthEast (EANE)",
      bestFor: "Owners who run payroll themselves and want a Massachusetts HR hotline for hard calls on leave, discipline, and pay",
      description:
        "The Employers Association of the NorthEast (EANE) is a New England employer membership association. Members get an HR hotline, compliance alerts, and New England pay survey data. Its consulting practice, RightFit HR, sells fractional HR, handbook reviews, and workplace investigations at member pricing.",
      strengths: [
        "Lowest published cost here at $1,335 a year for up to 50 employees",
        "An HR hotline for questions on leave, discipline, policies, and pay",
        "Sells no PEO, payroll, or insurance products, so it works next to any payroll system",
      ],
      limitations: [
        "No payroll processing or onboarding paperwork. You still need software or a service",
        "Not restaurant-specific. Manufacturing, healthcare, and nonprofits lead its list of industries served",
      ],
      pricing: "Annual dues $1,335 for 1 to 50 employees ($111.25/month). Consulting billed separately.",
    },
  ],
  comparisonTable: {
    headers: ["Model", "Published price", "Who runs payroll", "Employer"],
    rows: [
      { name: "Back of House Ops", values: ["Payroll and HR admin service", "$495 to $1,795+/mo flat", "It prepares, you approve", "You"] },
      { name: "Toast Payroll", values: ["Restaurant payroll software", "Quote-based", "You", "You"] },
      { name: "Restaurant HR Group", values: ["Outsourced restaurant HR", "Quote-based", "It enters, in your system", "You"] },
      { name: "Justworks PEO", values: ["PEO", "$79/employee/mo", "Justworks", "Co-employer"] },
      { name: "Gusto", values: ["Payroll software", "$49/mo + $6/person", "You", "You"] },
      { name: "Homebase", values: ["Scheduling + payroll app", "$0 to $120/location/mo + payroll", "You", "You"] },
      { name: "Employers Association of the NorthEast (EANE)", values: ["Employer association", "$1,335/year", "Not offered", "You"] },
    ],
  },
  verdict:
    "Choose Back of House Ops if you run one to three Massachusetts locations and want to stay the only employer. It fits best when your general manager (GM) does payroll and paperwork between shifts. Its flat fee holds through a hiring wave inside your tier, and no payroll goes out without your approval. Budget for your payroll platform on top.\n\nIf you run Toast POS and your GM already handles payroll well, Toast Payroll removes the most retyping. If health benefits matter more than cost, Justworks PEO administers them alongside pay. A small single room can start on Homebase or Gusto and add an EANE membership for the hard HR calls.",
  sections: [
    {
      heading: "Which Restaurant HR Support Model Fits a Massachusetts Restaurant",
      content:
        "The right restaurant HR support model depends on who does the weekly payroll work and whether you want to share the employer role. Most independent Massachusetts restaurants with 15 to 75 staff fit one of four setups.\n\n| Model | Who does the weekly work | Employer | Published cost at 30 staff |\n|---|---|---|---|\n| Payroll software (Gusto, Homebase, Toast Payroll) | You or a manager | You | $229 to $440/month (Toast is quote-based) |\n| Administration service (Back of House Ops) | The service prepares, you approve | You | $895/month plus your platform |\n| Outsourced HR firm (Restaurant HR Group) | A dedicated HR manager | You | Quote-based |\n| PEO (Justworks PEO) | The PEO runs payroll and benefits | Co-employer | $2,370/month on PEO Basic |\n\nPick software if your GM already runs payroll cleanly. Pick an administration service if paperwork keeps slipping between shifts but you want to stay the sole employer. Pick a PEO if staff health benefits matter more to you than the per-employee cost. An employer association such as EANE works next to any setup and answers hotline questions on a firing or a leave request.",
    },
    {
      heading: "Massachusetts Tip Rules That Trip Up Restaurant Payroll",
      content:
        "Massachusetts lets you pay tipped staff a $6.75 service rate only if tips bring each shift up to the $15.00 minimum wage. Both rates took effect on January 1, 2023, and the [Trial Court Law Libraries](https://www.mass.gov/info-details/massachusetts-law-about-minimum-wage) note that no further increase is scheduled. Under the Attorney General's [pay and recordkeeping guide](https://www.mass.gov/guides/pay-and-recordkeeping), you must tell the worker in writing first, and the worker must make more than $20 a month in tips.\n\nThe minimum wage check runs shift by shift. In the Attorney General's example, a server works a slow 5-hour Tuesday for $33.75 in service-rate wages plus $30.00 in tips. That is $63.75 against the $75.00 owed, so $11.25 goes on the next paycheck even if Saturday's tips were large.\n\nTip pools are narrower in Massachusetts than under federal law. The state [Tips Act](https://www.mass.gov/info-details/mass-general-laws-c149-ss-152a) lets only wait staff, service bartenders, and other service employees share a pool, and nobody with managerial duties that day can join. Federal rules in [Department of Labor Fact Sheet #15](https://www.dol.gov/agencies/whd/fact-sheets/15-tipped-employees-flsa) let cooks and dishwashers share tips when everyone earns the full federal minimum wage. Payroll software sold in every state may let you build a pool that Massachusetts forbids.\n\n- Service charges on a bill go only to the service staff, in proportion to the service each gave.\n- House or kitchen fees can go to the kitchen or stay with the restaurant, but only if the bill or menu says the fee is not a tip.\n- Tips paid to the restaurant, such as card tips, must reach staff by the end of that business day.\n- Federal no-tax-on-tips rules leave all of these Massachusetts rules unchanged, according to the Attorney General.\n\nIn June 2025 the Attorney General [cited Zuma, a Boston restaurant,](https://www.mass.gov/news/ag-campbell-cites-high-end-boston-restaurant-over-18-million-for-tip-pool-violations) about $1.8 million in restitution and penalties. Staff called captains, who had managerial duties, had been sharing the service staff's tip pool.",
    },
    {
      heading: "Pay, Leave, and Scheduling Rules Massachusetts Restaurant Payroll Must Handle",
      content:
        "Massachusetts adds leave, break, and pay-timing rules on top of the tip rules, and each one has to be built into payroll settings. The rules below touch a restaurant every pay period.\n\n- Earned sick time. Staff earn 1 hour per 30 worked, up to 40 hours a year, and employers with 11 or more employees must pay it, per the [Attorney General](https://www.mass.gov/info-details/earned-sick-time). Tipped staff must get at least the full $15.00 minimum wage for sick hours, according to the Attorney General's [earned sick time FAQ](https://www.mass.gov/doc/earned-sick-time-faqs/download).\n- Paid Family and Medical Leave (PFML). For 2026, employers with 25 or more covered individuals send 0.88% of eligible wages, at least 0.42% of it their own money, per the [Department of Family and Medical Leave](https://www.mass.gov/info-details/paid-family-and-medical-leave-employer-contribution-rates-and-calculator). Under 25, the rate is 0.46% and all of it can be withheld. The split between the family and medical shares changes on January 1, 2027, so withholding settings need an update that month.\n- Meal breaks. Anyone working more than six hours in a calendar day gets at least 30 minutes, unpaid only if the worker is free of all duties, per the [breaks guide](https://www.mass.gov/guides/breaks-and-time-off).\n- Reporting pay. A worker scheduled for 3 or more hours who arrives on time and is sent home early gets at least 3 hours at minimum wage. We found no statewide predictive scheduling law in the Attorney General's guidance, so this is the scheduling rule that reaches payroll.\n- Overtime. Most employees who work past 40 hours a week get 1.5 times the regular rate. For some service-rate workers, the Attorney General figures overtime on the $15.00 minimum wage instead of the $6.75 service rate.\n- Pay timing. Hourly staff are paid weekly or every two weeks, within six or seven days of the period's end. A fired worker must be paid in full on the last day of work.\n- New hires. Report each one to the [Department of Revenue](https://www.mass.gov/how-to/report-new-hires) within 14 days of the first day of work.\n\nThe [Wage Act](https://www.mass.gov/info-details/massachusetts-law-about-wages) makes triple damages mandatory, plus court costs and attorneys' fees. Take 12 servers whose 40 sick hours were paid at $6.75 instead of $15.00. That is $330 short per server, $3,960 in all, and $11,880 once tripled.",
    },
    {
      heading: "Every Model Leaves Some HR Work with You",
      content:
        "No restaurant HR support option takes over every task, so compare what stays on your desk.\n\n- Payroll software. The software calculates pay, files taxes, and deposits wages. You collect inputs, set tip pool rules, chase I-9s, and keep personnel files.\n- Back of House Ops. It prepares the run, runs onboarding, keeps files, and maintains the handbook. You approve each run, examine I-9 documents in person, fund payroll, and make every hiring and firing decision.\n- Outsourced HR firm. Restaurant HR Group adds employee relations and benefits administration. You still pay for the payroll system and the broker.\n- PEO. Justworks runs payroll, tax filings, and benefits as a co-employer. You still run the floor, the schedule, and the tip pool rules.\n\nNone of these keeps your books, so compare the [best bookkeeping services for small businesses](/roundup/best-bookkeeping-services-for-small-businesses/) too. For a retirement plan without a PEO, see [401(k) providers for small businesses](/roundup/best-401k-providers-for-small-business/).\n\nThe [Department of Labor](https://www.dol.gov/agencies/eta/wotc) lists WOTC as authorized only through December 31, 2025. Back of House Ops keeps filing the screening forms in case Congress renews it, so for a 2026 hire the screening keeps a possible credit open without promising one.",
    },
    {
      heading: "What Restaurant HR Support Costs at 30 Employees",
      content:
        "For a single Massachusetts restaurant with 30 employees, published restaurant HR support prices run from $111 to $2,370 a month. The table uses list prices and a summer crew of 45 to show how per-employee fees move.\n\n| Setup | 30 staff | 45 staff in summer |\n|---|---|---|\n| EANE membership (HR hotline only) | $111.25 | $111.25 |\n| Gusto Simple | $229 | $319 |\n| Homebase All-in-One + payroll + Tip Manager | $374 | $464 |\n| Gusto Plus | $440 | $620 |\n| Back of House Ops Growth + Gusto Simple | $1,124 | $1,214 |\n| Justworks PEO Basic | $2,370 | $3,555 |\n\nSoftware is cheapest because the labor is yours. If your GM spends four hours a week on payroll and paperwork at $30 an hour, that time costs about $520 a month. Back of House Ops costs $895 more than Gusto Simple alone, about 30 hours of that manager's time a month.\n\nWatch the tier lines too. Back of House Ops jumps from $495 to $895 at 26 employees. Check any fee against your [operating cash flow](/operating-cash-flow/) for the slow months before you sign.",
    },
    {
      heading: "Questions to Ask a Restaurant HR Support Service Before You Sign",
      content:
        "Ask every provider the same questions in writing, so the answers line up when you compare them.\n\n1. Who is the employer of record, and who responds if the Attorney General opens a wage claim?\n2. Can you show a sample shift calculation for the service rate and tip makeup?\n3. Who is in our tip pool in your setup, and who signs off on that list?\n4. Are sick hours for tipped staff paid at $15.00?\n5. Which costs sit outside the monthly fee: the payroll platform, workers' compensation, or year-end forms?\n6. How does a seasonal swing in headcount change the price?\n7. Who runs the final check on the same day when we fire someone?\n8. Can we speak with two Massachusetts restaurants our size that use you now?",
    },
    {
      heading: "Red Flags in a Restaurant HR Proposal",
      content:
        "A proposal that gets a Massachusetts tip rule wrong is the clearest sign to walk away. Watch for these.\n\n- A tip pool that includes cooks, dishwashers, or a manager who also works the floor.\n- Sick pay for servers set at the $6.75 service rate.\n- A per-employee price quoted without asking about your summer headcount.\n- No written scope, or exclusions you hear about only on a call.\n- A service that can submit payroll without your approval.\n\nAny one of these can turn into a Wage Act claim with triple damages. Ask the provider to fix it in writing before you sign.",
    },
    {
      heading: "Who Should Skip Back of House Ops",
      content:
        "Back of House Ops is a poor fit for four kinds of restaurant, and each has a better option on this list.\n\n- Restaurants outside Massachusetts. Back of House Ops serves Massachusetts only. Restaurant HR Group serves restaurants nationwide.\n- Owners who want to share the employer role or offer health insurance. Justworks PEO administers benefits as a co-employer.\n- Rooms under about 10 employees with an owner who likes running payroll. Homebase's free Basic plan with payroll, plus an EANE membership, costs far less.\n- Owners who need legal advice or a workplace investigation. Hire employment counsel, or use EANE's RightFit HR.",
    },
    {
      heading: "What Would Change Our Ranking",
      content:
        "Our ranking rests on published prices and published scope, so new facts would move it.\n\n- If Back of House Ops published client references from its first Massachusetts restaurants, it would close its biggest gap.\n- If Toast published payroll prices, Toast Payroll could rank higher for restaurants already on its POS.\n- If a payroll platform bundled prepared runs and an approval step for less than $895 a month all-in, Back of House Ops would lose its price case.\n- If Massachusetts changed the $6.75 service rate or the tip pool rules, every provider's setup would need a fresh check.\n\nStart with a fit call to Back of House Ops and one PEO quote, then put both against the cost table above.",
    },
  ],
  faqs: [
    {
      question: "How much does restaurant HR support cost in Massachusetts?",
      answer:
        "Published prices for a 30-employee restaurant run from about $111 a month for an EANE membership to $2,370 a month for Justworks PEO Basic. Payroll software such as Gusto or Homebase costs roughly $229 to $440 a month, and you do the work. Back of House Ops charges a flat $495 to $1,795 or more a month by size, plus your payroll platform.",
    },
    {
      question: "Is a PEO or an HR service better for a small Massachusetts restaurant?",
      answer:
        "An HR service usually fits better if you want to stay the only employer and need payroll and paperwork prepared. A PEO such as Justworks becomes a co-employer and administers health benefits. The PEO costs more as headcount rises, because it charges per employee.",
    },
    {
      question: "Can kitchen staff share in a tip pool in Massachusetts?",
      answer:
        "No. The Massachusetts Tips Act limits tip pools to wait staff, service bartenders, and other service employees, and it bars anyone with managerial duties that day. You can pay kitchen staff from a house or kitchen fee if the bill or menu says the fee is not a tip.",
    },
    {
      question: "What is the tipped minimum wage in Massachusetts in 2026?",
      answer:
        "The service rate is $6.75 an hour, and the regular minimum wage is $15.00, both unchanged since January 1, 2023. To pay the service rate, tell the worker in writing first. The worker must also earn more than $20 a month in tips, and tips plus wages must reach $15.00 for every shift.",
    },
    {
      question: "Do tipped employees get paid sick time at the service rate?",
      answer:
        "No. The Attorney General's earned sick time guidance says tipped workers must get at least the full $15.00 minimum wage for sick hours. Paying sick hours at $6.75 underpays each hour by $8.25, and the Wage Act triples unpaid wages.",
    },
    {
      question: "Does Back of House Ops run payroll itself?",
      answer:
        "Back of House Ops prepares each payroll run and submits it through your own payroll platform after a named approver at your restaurant signs off. The platform, such as Gusto or Toast, is a separate cost. Your restaurant funds payroll and stays the employer of record.",
    },
    {
      question: "Does Massachusetts have a predictive scheduling law for restaurants?",
      answer:
        "We found no statewide predictive scheduling law in the Attorney General's guidance. The closest rule is reporting pay: a worker scheduled for 3 or more hours who is sent home early must get at least 3 hours at minimum wage.",
    },
  ],
  sources: [
    { label: "Back of House Ops: Pricing", url: "https://backhousehr.com/pricing/" },
    { label: "Back of House Ops: Service Scope", url: "https://backhousehr.com/service-scope/" },
    { label: "Massachusetts Attorney General: Pay and Recordkeeping", url: "https://www.mass.gov/guides/pay-and-recordkeeping" },
    {
      label: "Mass. General Laws c.149 § 152A: Service Charges and Tips",
      url: "https://www.mass.gov/info-details/mass-general-laws-c149-ss-152a",
    },
    { label: "Massachusetts Attorney General: Earned Sick Time", url: "https://www.mass.gov/info-details/earned-sick-time" },
    {
      label: "Massachusetts Department of Family and Medical Leave: PFML Contribution Rates",
      url: "https://www.mass.gov/info-details/paid-family-and-medical-leave-employer-contribution-rates-and-calculator",
    },
    { label: "Massachusetts Attorney General: Breaks and Time Off", url: "https://www.mass.gov/guides/breaks-and-time-off" },
    {
      label: "U.S. Department of Labor: Fact Sheet #15, Tipped Employees Under the Fair Labor Standards Act",
      url: "https://www.dol.gov/agencies/whd/fact-sheets/15-tipped-employees-flsa",
    },
  ],
  calculatorLinks: [
    { label: "Operating Cash Flow Calculator", href: "/operating-cash-flow/" },
    { label: "Cash Conversion Cycle Calculator", href: "/cash-conversion-cycle/" },
  ],
};
