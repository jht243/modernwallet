// Compliance Alerts vertical — one entry per "new law/rule imposes an obligation on businesses"
// explainer page at /compliance/<slug>/. The pillar page (/compliance/) renders a grid of every
// non-draft entry, grouped by category — that grid is the anti-orphan guarantee: every alert page
// is always reachable from the pillar, and every alert links back via breadcrumb + relatedSlugs.
//
// Content rules (CONTENT.md): facts researched from primary sources only, every citationUrl and
// source URL must load, title ≤60 / metaDescription ≤160, intro opens with a self-contained
// sentence (AEO). New entries are appended by the /compliance-alert-pass workflow after the
// guided-write + adversarial-audit two-step — never invented inline.

import type { ComplianceAlert } from "./types";

export const COMPLIANCE_ALERTS: ComplianceAlert[] = [
  // ── NY LLC Transparency Act ──────────────────────────────────────────────────────────────────
  {
    slug: "ny-llc-transparency-act",
    title: "NY LLC Transparency Act: Who Must File in 2026",
    metaDescription:
      "The NY LLC Transparency Act took effect January 1, 2026. See which LLCs must file beneficial ownership reports, the December 31, 2026 deadline, and penalties.",
    targetKeyword: "new york llc transparency act",
    h1: "New York LLC Transparency Act: Who Must File, Deadlines, and Penalties",
    intro:
      "The New York LLC Transparency Act (NYLTA) took effect on January 1, 2026, and requires non-exempt LLCs formed outside the United States and authorized to do business in New York to file beneficial ownership information with the New York Department of State. After Governor Hochul's December 2025 veto of a proposed expansion, LLCs formed inside the U.S. are exempt from reporting — but exempt companies may still need to attest to their exemption, and the penalties for companies that must file and don't reach $500 per day.",
    jurisdiction: "New York",
    agency: "New York Department of State",
    citation: "NY LLC Transparency Act (S.995-B / A.3484-A, as amended)",
    citationUrl: "https://www.nysenate.gov/legislation/bills/2023/S995",
    whoMustComply:
      "LLCs formed outside the U.S. that are authorized to do business in New York (non-exempt)",
    actionRequired:
      "File a beneficial ownership disclosure (or attestation of exemption) with the NY Department of State",
    effectiveDate: "2026-01-01",
    deadline: "2026-12-31",
    penalty:
      "\"Past due\" then \"delinquent\" status on public record, fines up to $500/day, and possible AG action to suspend or dissolve the LLC",
    urgency: "high",
    category: "Tax & Finance",
    recommendedProfessionals: ["attorney", "cpa", "tech"],
    whatChanged:
      "New York enacted its own state-level version of the federal Corporate Transparency Act, aimed at ending anonymous LLC ownership in the state. As originally passed, the law would have covered every LLC formed or registered in New York. Two late changes narrowed it: first, FinCEN's March 2025 interim final rule exempted all U.S.-formed companies from federal beneficial ownership reporting, and then Governor Hochul's December 19, 2025 veto of a proposed expansion left New York's law applying only to foreign-formed LLCs authorized to do business in the state.\n\nThe result as of 2026: a foreign-formed LLC doing business in New York must report each beneficial owner — any individual who owns or controls at least 25% of the company or exercises substantial control over it — to the Department of State. LLCs that qualify for one of the law's exemptions (which track the federal CTA's 23 exemption categories) must file an attestation of exemption instead of a full disclosure.",
    whoIsAffected:
      "You are in scope if your LLC was formed under the law of a country outside the United States and is authorized to do business in New York State. Existing foreign LLCs — those authorized before January 1, 2026 — have until December 31, 2026 to file. Foreign LLCs that register on or after January 1, 2026 must file within 30 days of registration.\n\nU.S.-formed LLCs, including those formed in New York itself, are exempt from the reporting requirement following the December 2025 veto. Corporations, LPs, and other non-LLC entities are outside the law entirely — it covers LLCs only. If you are unsure whether one of the exemption categories (banks, insurers, SEC-registered companies, large operating companies, and others) applies to you, that determination is exactly what a business attorney or CPA should confirm before the deadline.",
    complianceSteps: [
      "Determine whether your LLC is foreign-formed and authorized to do business in New York — if it is U.S.-formed, you are exempt from reporting under the law as amended.",
      "Check the exemption list: the NYLTA borrows the federal CTA's exemption categories. Exempt companies file an attestation of exemption rather than a beneficial ownership disclosure.",
      "Identify every beneficial owner: any individual owning or controlling 25% or more of ownership interests, plus anyone exercising substantial control (senior officers, key decision-makers).",
      "Collect required owner details (name, date of birth, address, identifying number) and file the disclosure with the NY Department of State before December 31, 2026 (or within 30 days of a new registration).",
      "Calendar the update obligation: changes to previously reported information must be corrected or updated within 30 days — treat it as an ongoing compliance item, not a one-time filing.",
    ],
    faqs: [
      {
        question: "Does the NY LLC Transparency Act apply to my New York-formed LLC?",
        answer:
          "No — not for reporting. After Governor Hochul's December 19, 2025 veto of the proposed expansion, the reporting obligation applies only to LLCs formed outside the United States that are authorized to do business in New York. A New York-formed (or any U.S.-formed) LLC is exempt from filing beneficial ownership information under the law as it stands in 2026. Watch this space, though: the legislature attempted to broaden the law once and may try again.",
      },
      {
        question: "How is this different from the federal BOI reporting requirement?",
        answer:
          "FinCEN's federal beneficial ownership reporting under the Corporate Transparency Act was narrowed in March 2025 so that U.S.-formed companies no longer report at all; only foreign companies registered to do business in the U.S. still file federally. New York's law is a separate, state-level filing with the NY Department of State — a foreign LLC doing business in New York may need to file both the federal BOI report with FinCEN and the New York disclosure.",
      },
      {
        question: "What happens if a covered LLC misses the December 31, 2026 deadline?",
        answer:
          "The Department of State first marks the company \"past due\" in its public records. After two years of noncompliance it becomes \"delinquent,\" fines can reach $500 per day, and the New York Attorney General can seek to suspend, cancel, or dissolve the LLC. Knowingly filing false beneficial ownership information can also bring civil penalties and criminal exposure.",
      },
      {
        question: "Is the information filed under the NYLTA public?",
        answer:
          "No. Unlike early drafts of the law, which contemplated a public database, beneficial ownership information filed under the NYLTA is maintained confidentially by the Department of State, accessible to law enforcement and certain government agencies. What IS public is the compliance status — a \"past due\" or \"delinquent\" label is visible on the state's public records.",
      },
    ],
    sources: [
      {
        label: "NY Senate — S.995-B (LLC Transparency Act) bill page",
        url: "https://www.nysenate.gov/legislation/bills/2023/S995",
      },
      {
        label: "FinCEN — BOI reporting (federal scope after March 2025 rule)",
        url: "https://www.fincen.gov/boi",
      },
    ],
    relatedSlugs: ["california-climate-disclosure-sb253-sb261", "virginia-paid-sick-leave"],
  },

  // ── California climate disclosure (SB 253 / SB 261) ──────────────────────────────────────────
  {
    slug: "california-climate-disclosure-sb253-sb261",
    title: "California SB 253 & SB 261: 2026 Report Deadlines",
    metaDescription:
      "California's climate disclosure laws hit in 2026: SB 253 emissions reports due November 10, 2026 for $1B+ companies. See who must report, fees, and penalties.",
    targetKeyword: "california climate disclosure sb 253 sb 261",
    h1: "California Climate Disclosure (SB 253 & SB 261): Who Must Report in 2026",
    intro:
      "California's climate disclosure laws require large companies doing business in the state to start reporting in 2026: SB 253 requires companies with over $1 billion in annual revenue to report Scope 1 and 2 greenhouse gas emissions by November 10, 2026, and SB 261 requires companies with over $500 million in revenue to publish climate-related financial risk reports every two years. Enforcement of SB 261's original January 1, 2026 deadline is paused while a Ninth Circuit appeal proceeds, but CARB has made clear the reporting program itself is moving forward — with per-entity fees assessed starting September 2026 and penalties up to $500,000 a year for SB 253 violations.",
    jurisdiction: "California",
    agency: "California Air Resources Board (CARB)",
    citation: "SB 253 (Climate Corporate Data Accountability Act) & SB 261 (Climate-Related Financial Risk Act), as amended by SB 219",
    citationUrl: "https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202320240SB253",
    whoMustComply:
      "U.S. companies \"doing business in California\": revenue over $1B (SB 253) or over $500M (SB 261)",
    actionRequired:
      "Report Scope 1 & 2 GHG emissions (SB 253) and publish a biennial climate-related financial risk report (SB 261)",
    effectiveDate: "2026-01-01",
    deadline: "2026-11-10",
    penalty:
      "Up to $500,000/year for SB 253 violations and $50,000/year for SB 261, plus CARB program fees (~$3,106 SB 253 / ~$1,403 SB 261 per entity)",
    urgency: "high",
    category: "Environment & Energy",
    recommendedProfessionals: ["consultant", "attorney", "tech"],
    whatChanged:
      "California became the first U.S. state to mandate corporate climate disclosure, and 2026 is the year the obligations become real. Under SB 253, companies with more than $1 billion in annual revenue that do business in California must report their Scope 1 (direct) and Scope 2 (purchased energy) greenhouse gas emissions — the first reports, covering fiscal year 2025, are due November 10, 2026, with Scope 3 (supply chain) emissions following in 2027. Under SB 261, companies over $500 million in revenue must publish a climate-related financial risk report aligned with TCFD, IFRS S2, or an equivalent framework, refreshed every two years.\n\nTwo moving pieces matter for 2026 planning. First, litigation: a Ninth Circuit injunction has paused enforcement of SB 261's original January 1, 2026 deadline while the appeal proceeds, and CARB has said it will set an alternate reporting date after the appeal resolves. Second, leniency: for the first SB 253 cycle, CARB's enforcement notice says companies may report with the data they \"have on hand\" — a company that wasn't collecting emissions data when the notice issued in December 2024 can submit a short statement explaining non-collection instead of full figures.",
    whoIsAffected:
      "The thresholds are revenue-based and hinge on \"doing business in California\" — a deliberately broad test that captures companies headquartered anywhere in the U.S. with meaningful California sales, property, or payroll. If your total annual revenue exceeds $1 billion, both SB 253 and SB 261 apply; between $500 million and $1 billion, SB 261 alone applies. Subsidiaries can generally be covered by a parent's consolidated report.\n\nEven paused, SB 261 should stay on your board's calendar: CARB anticipates assessing program fees (roughly $3,106 per entity for SB 253 and $1,403 for SB 261) beginning September 10, 2026, and companies that wait for the appeal to resolve before starting TCFD-style risk work will be racing a compressed timeline when the alternate date lands. Most companies in scope engage a sustainability consultant or carbon-accounting platform well before their first filing.",
    complianceSteps: [
      "Confirm scope: check consolidated revenue against the $500M / $1B thresholds and assess whether the \"doing business in California\" test (sales, property, or payroll in-state) captures your company or a parent/subsidiary.",
      "For SB 253: inventory Scope 1 and Scope 2 emissions for fiscal year 2025 following the GHG Protocol, and prepare for limited-assurance verification — or, if data collection hadn't started by December 2024, prepare the \"data on hand\" statement CARB's enforcement notice allows for the first cycle.",
      "For SB 261: begin a TCFD/IFRS S2-aligned climate-risk assessment now, even though the original January 1, 2026 deadline is unenforced pending appeal — CARB will set an alternate date and the underlying analysis takes quarters, not weeks.",
      "Budget for CARB program fees (estimated at ~$3,106 per entity for SB 253 and ~$1,403 for SB 261), expected to be assessed starting September 10, 2026.",
      "Monitor the Ninth Circuit appeal and CARB's rulemaking updates — deadlines and formats have already shifted more than once, and the reporting portal details are still being finalized.",
    ],
    faqs: [
      {
        question: "Is SB 261 still enforceable given the court injunction?",
        answer:
          "CARB has stated it will not enforce SB 261's original January 1, 2026 deadline while the Ninth Circuit injunction is in place, and it plans to announce an alternate reporting date after the appeal is resolved. The law itself has not been struck down — companies in scope are widely being advised to continue preparing, because the underlying climate-risk analysis takes far longer than whatever runway an alternate deadline will offer.",
      },
      {
        question: "When exactly is the first SB 253 emissions report due?",
        answer:
          "The Scope 1 and 2 report covering fiscal year 2025 is due November 10, 2026, after CARB postponed the original mid-2026 timing. Scope 3 (value-chain) emissions reporting begins in 2027. For this first cycle, CARB's enforcement notice allows companies to report with the data they have on hand — good faith matters more than perfection in year one.",
      },
      {
        question: "My company is headquartered outside California. Can these laws still apply?",
        answer:
          "Yes. The laws apply to companies \"doing business in California,\" not companies based there. If your business exceeds the revenue thresholds and has meaningful California sales, property, or payroll, you are likely in scope regardless of where you are incorporated or headquartered — one of the reasons these two state laws function as de facto national climate-disclosure rules.",
      },
      {
        question: "What does compliance actually cost?",
        answer:
          "Beyond CARB's anticipated program fees (~$3,106 per entity for SB 253 and ~$1,403 for SB 261, expected from September 2026), the real cost is building a GHG inventory and climate-risk reporting process: carbon-accounting software, third-party assurance for emissions data, and consultant or legal time for the TCFD-aligned risk report. Penalties for non-filing run up to $500,000 per reporting year for SB 253 and $50,000 for SB 261.",
      },
    ],
    sources: [
      {
        label: "California Legislature — SB 253 (Climate Corporate Data Accountability Act)",
        url: "https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202320240SB253",
      },
      {
        label: "California Legislature — SB 261 (Climate-Related Financial Risk Act)",
        url: "https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202320240SB261",
      },
    ],
    relatedSlugs: ["ny-llc-transparency-act", "virginia-paid-sick-leave"],
  },

  // ── Virginia paid sick leave ─────────────────────────────────────────────────────────────────
  {
    slug: "virginia-paid-sick-leave",
    title: "Virginia Paid Sick Leave Law: Employer Deadlines",
    metaDescription:
      "Virginia paid sick leave phases in from July 1, 2027: 1 hour per 30 worked, up to 40 hours a year, for every employer by 2029. See deadlines and penalties.",
    targetKeyword: "virginia paid sick leave law",
    h1: "Virginia's Paid Sick Leave Law: What Every Employer Must Do, and By When",
    intro:
      "Virginia has enacted a paid sick leave mandate that will eventually cover every employer in the state: employees accrue one hour of paid sick leave for every 30 hours worked, up to 40 hours per year. The requirement phases in by employer size — employers with 50 or more employees must comply by July 1, 2027, those with 25 or more by January 1, 2028, and all employers by January 1, 2029. Employers who get it wrong face double-damages lawsuits from employees plus enforcement by the Commissioner of Labor and the Attorney General, so payroll and handbook changes need to start well before your tier's deadline.",
    jurisdiction: "Virginia",
    agency: "Virginia Department of Labor and Industry",
    citation: "Code of Virginia, Title 40.1, Chapter 3, Article 2.1 (Paid Sick Leave), as expanded by HB 5 (2026)",
    citationUrl: "https://law.lis.virginia.gov/vacodefull/title40.1/chapter3/article2.1/",
    whoMustComply:
      "Employers with 50+ employees by July 1, 2027; 25+ by Jan 1, 2028; all Virginia employers by Jan 1, 2029",
    actionRequired:
      "Provide accrued paid sick leave (1 hour per 30 worked, up to 40 hours/year) and update payroll, policies, and notices",
    effectiveDate: "2027-07-01",
    penalty:
      "Employee lawsuits for at least double the uncompensated leave plus double actual damages and lost wages; administrative and AG enforcement",
    urgency: "medium",
    category: "Employment & Labor",
    recommendedProfessionals: ["consultant", "attorney", "tech"],
    whatChanged:
      "Virginia previously required paid sick leave only for certain home health workers. The 2026 expansion turns that narrow rule into a universal mandate: employees earn one hour of paid sick leave for every 30 hours worked, capped at 40 hours per year, usable for their own or a family member's health needs, mental health, or matters related to domestic violence, sexual assault, or stalking.\n\nRather than switching on for everyone at once, the law phases in by headcount. Employers with 50 or more employees must comply starting July 1, 2027; employers with 25 or more follow on January 1, 2028; and every remaining employer — down to a single employee — is covered by January 1, 2029. Virginia also passed a separate paid family and medical leave program in the same session, so employers should plan the two together rather than bolting on point solutions twice.",
    whoIsAffected:
      "Ultimately, every private employer with employees in Virginia. The immediate question is which tier you fall in: count your employees now and note whether seasonal or part-time staffing swings could push you across the 25- or 50-employee lines before your date. Part-time employees accrue leave at the same 1-per-30-hours rate, so businesses built on hourly and part-time labor — restaurants, retail, home services, logistics — feel the administrative weight most.\n\nMulti-state employers should note this is accrual-based (not a lump-sum grant), which means payroll systems must track hours worked per employee in Virginia and apply the 40-hour annual cap correctly. If your handbook, PTO policy, or payroll platform doesn't distinguish sick leave from general PTO today, reconciling them — without accidentally promising more than the law requires — is where an HR consultant or employment attorney earns their fee.",
    complianceSteps: [
      "Count your Virginia workforce and identify your compliance date: July 1, 2027 (50+ employees), January 1, 2028 (25+), or January 1, 2029 (all employers).",
      "Audit your current PTO/sick policy against the law's floor: 1 hour accrued per 30 worked, 40-hour annual cap, and qualifying uses that include family care, mental health, and safe-leave reasons.",
      "Configure payroll to track hourly accrual per employee (including part-timers) and enforce the cap — confirm your payroll or HRIS vendor supports Virginia's accrual rules before your tier's date.",
      "Update the employee handbook and required notices, and train managers on lawful responses to sick-leave requests — retaliation and interference are where employer liability typically starts.",
      "Coordinate with Virginia's separate new paid family and medical leave program so policies, systems, and budgets are updated once, not twice.",
    ],
    faqs: [
      {
        question: "When does my business actually have to offer paid sick leave in Virginia?",
        answer:
          "It depends on headcount. Employers with 50 or more employees must comply by July 1, 2027; those with 25 or more by January 1, 2028; and every employer, regardless of size, by January 1, 2029. If you're near a threshold, plan for the earlier date — headcount growth can move your deadline up.",
      },
      {
        question: "How much leave do employees get, and does unused time carry over?",
        answer:
          "Employees accrue one hour of paid sick leave for every 30 hours worked, up to 40 hours per year. The leave covers the employee's own health needs, care for family members, mental health, and reasons related to domestic violence, sexual assault, or stalking. For carryover, frontloading, and documentation rules, check the current text of Title 40.1, Article 2.1 and any Department of Labor and Industry guidance — implementation details are exactly where employers most often get tripped up.",
      },
      {
        question: "What happens if an employer doesn't comply?",
        answer:
          "Virginia gave the law real teeth: employees can sue directly, and a losing employer owes at least twice the value of the uncompensated sick leave, twice any actual damages, and lost wages. Separately, the Commissioner of Labor and Industry and the Attorney General can bring administrative proceedings or civil actions. A payroll misconfiguration that shorts accruals across a workforce can compound into a serious liability.",
      },
      {
        question: "We already offer PTO — do we need a separate sick-leave bank?",
        answer:
          "Not necessarily, but your existing policy must meet or beat the law's floor for accrual rate, cap, qualifying uses, and anti-retaliation protections. Many employers satisfy accrual-based sick-leave laws with a compliant general PTO policy, but the details matter — this is a question worth putting to an employment attorney or HR compliance consultant before your tier's effective date.",
      },
    ],
    sources: [
      {
        label: "Code of Virginia — Title 40.1, Article 2.1 (Paid Sick Leave)",
        url: "https://law.lis.virginia.gov/vacodefull/title40.1/chapter3/article2.1/",
      },
      {
        label: "Virginia LIS — HB 5 (2026 Regular Session)",
        url: "https://lis.virginia.gov/bill-details/20261/HB5",
      },
    ],
    relatedSlugs: ["ny-llc-transparency-act", "california-climate-disclosure-sb253-sb261", "dhs-f1-j1-fixed-admission-period"],
  },

  // ── DHS fixed admission period for F-1/J-1/I nonimmigrants ──────────────────────────────────
  {
    slug: "dhs-f1-j1-fixed-admission-period",
    title: "DHS Ends F-1/J-1 Duration of Status: New 2026 Rule",
    metaDescription:
      "DHS ends duration of status for F-1, J-1, and I visas starting Sept 15, 2026. See the new 4-year fixed admission cap, EOS filing rules, and who must comply.",
    targetKeyword: "f-1 j-1 fixed admission period",
    h1: "DHS's New F-1/J-1 Fixed Admission Period Rule: What Schools and Employers Must Do",
    intro:
      "Starting September 15, 2026, the Department of Homeland Security replaces \"duration of status\" for F-1 students, J-1 exchange visitors, and I-visa foreign media representatives with a fixed admission period — up to four years for F-1/J-1 (plus a 30-day grace period to depart) and 90 or 240 days for I nonimmigrants — after which they must file a timely extension of stay (EOS) or begin accruing unlawful presence. SEVP-certified schools, J-1 program sponsors, and employers of F-1 OPT/CPT or J-1 workers now need to track each nonimmigrant's fixed end date and make sure Form I-539 gets filed before it expires, since a lapse can trigger inadmissibility bars for the individual and compliance headaches for the institution.",
    jurisdiction: "Federal",
    agency: "Department of Homeland Security (DHS / USCIS / ICE-SEVP)",
    citation: "DHS Final Rule 2026-14439, amending 8 CFR 214.1, 214.2, 214.3, 214.4, 248, and 274",
    citationUrl:
      "https://www.federalregister.gov/documents/2026/07/17/2026-14439/establishing-a-fixed-time-period-of-admission-and-an-extension-of-stay-procedure-for-nonimmigrant",
    whoMustComply:
      "SEVP-certified schools and their DSOs, J-1 exchange visitor program sponsors, and employers of F-1 (OPT/CPT) or J-1 nonimmigrant workers",
    actionRequired:
      "Track each F-1/J-1 nonimmigrant's fixed admission end date (Form I-20/DS-2019 program end date, capped at 4 years) or an I nonimmigrant's 90/240-day period, and ensure a timely Form I-539 extension-of-stay (EOS) filing before that period expires",
    effectiveDate: "2026-09-15",
    deadline: "2027-03-18",
    penalty:
      "Nonimmigrants who don't timely file an EOS begin accruing unlawful presence under INA 212(a)(9)(B)/(C) once their fixed period expires — risking 3/10-year reentry bars and removal proceedings; schools and sponsors that fail SEVIS reporting requirements risk losing SEVP certification under 8 CFR 214.4(a)(2)",
    urgency: "high",
    category: "Employment & Labor",
    recommendedProfessionals: ["attorney", "consultant", "tech"],
    whatChanged:
      "For decades, F-1 students, J-1 exchange visitors, and I-visa foreign media representatives were admitted for \"duration of status\" (D/S) — an open-ended period lasting as long as they maintained their program, with no fixed expiration on their Form I-94. DHS's final rule ends that for all three categories: F-1 and J-1 nonimmigrants are now admitted for a fixed period tied to their program end date on Form I-20 or DS-2019, capped at four years, plus a 30-day grace period to depart (or 30 additional days if their program ends early). I nonimmigrants (representatives of foreign information media) are admitted for the time needed to complete their activity, capped at 240 days — or 90 days for holders of a passport from the People's Republic of China, excluding Hong Kong and Macau SAR passports.\n\nOnce that fixed period runs out, the nonimmigrant must either leave the country or have filed a timely application for an extension of stay (EOS) on Form I-539 (or its successor form) with USCIS — filing on time automatically extends their stay while the application is pending. The rule takes effect September 15, 2026, 60 days after publication, and DHS built in one notable transition carve-out: F-1 students already in the U.S. on D/S who timely file Form I-765 for post-completion OPT or a STEM OPT extension on or before March 18, 2027 do not need to separately file an EOS application.",
    whoIsAffected:
      "Any organization that sponsors, employs, or enrolls F-1, J-1, or I nonimmigrants now has a new compliance calendar to manage. SEVP-certified colleges and universities and their Designated School Officials (DSOs) must recalculate each F-1 student's fixed admission end date from the program start date shown on Form I-20, continue their existing SEVIS reporting duties, and help students who need more time file an EOS before their status lapses — a school's own SEVP certification can be affected if its SEVIS reporting falls out of compliance. J-1 exchange visitor program sponsors and their Responsible Officers (ROs) face the identical tracking obligation against the Form DS-2019 program end date, capped at four years from the rule's effective date for those already present under D/S.\n\nEmployers of F-1 workers on Optional Practical Training (OPT) or Curricular Practical Training (CPT), and employers of J-1 workers, should build the fixed end date into their own I-9/work-authorization tracking — an employee whose fixed period lapses without a timely EOS filing stops being authorized to work and starts accruing unlawful presence, which can also complicate that person's ability to travel and reenter. Organizations that host I-visa foreign media representatives face the shortest runway of all: 240 days (90 for most PRC passport holders) before an EOS becomes necessary. This rule does not change employment-based visa categories (H-1B and similar) directly, but any HR or international-student office that has relied on \"duration of status\" as effectively open-ended now needs a hard-date tracking process instead.",
    complianceSteps: [
      "Inventory every F-1, J-1, and I nonimmigrant your institution sponsors, employs, or enrolls, and pull each one's program end date from Form I-20 (F-1) or DS-2019 (J-1), or note the activity end date for I visas.",
      "Calculate the fixed admission end date: program end date plus a 30-day grace period, not to exceed 4 years total for F-1/J-1 (for those already in the U.S. on D/S, no more than 4 years from the September 15, 2026 effective date); 240 days (90 for most PRC passport holders) for I nonimmigrants.",
      "Build a tracking process — SEVIS-integrated if possible — that flags each person's fixed end date well before it arrives, since an EOS application (Form I-539 or successor) must be filed before the period expires to keep the person in status automatically while USCIS adjudicates it.",
      "If any F-1 students are pursuing post-completion OPT or a STEM OPT extension and were on D/S, confirm their Form I-765 is filed on or before March 18, 2027 so they qualify for the transition exemption from filing a separate EOS.",
      "Continue existing DSO/RO SEVIS reporting on the required timelines, since a lapse in reporting — separate from any individual student's status — can put the school's or sponsor's own SEVP certification at risk.",
    ],
    faqs: [
      {
        question: "What is the F-1 J-1 fixed admission period, and when does it start?",
        answer:
          "It's DHS's replacement for \"duration of status\": instead of an open-ended admission tied to maintaining a program, F-1 students and J-1 exchange visitors are now admitted for a fixed period — their program end date on Form I-20 or DS-2019, capped at four years, plus a 30-day grace period to depart. The rule takes effect September 15, 2026.",
      },
      {
        question: "What happens if an F-1 or J-1 nonimmigrant doesn't file for an extension in time?",
        answer:
          "Once their fixed period expires without a timely-filed EOS application, they begin accruing unlawful presence under INA section 212(a)(9)(B) and (C). That accrual can trigger a 3- or 10-year bar to reentry once they depart the U.S., and they become subject to removal proceedings if they don't leave. Filing the EOS application (Form I-539 or its successor) before the fixed period ends automatically extends their stay while it's pending.",
      },
      {
        question: "Does this rule create new penalties for schools or employers?",
        answer:
          "Not new ones. DHS declined commenters' requests to add new institutional financial penalties. What already existed — and still applies — is 8 CFR 214.4(a)(2): a school or program sponsor that fails to meet its SEVIS reporting requirements can lose its SEVP certification. The bigger operational change for schools and employers is the new fixed-date tracking burden, not a new fine.",
      },
      {
        question: "How long can I-visa foreign media representatives stay under the new rule?",
        answer:
          "I nonimmigrants are admitted for the time needed to complete their activity, capped at 240 days, or 90 days for holders of a passport from the People's Republic of China (except Hong Kong SAR and Macau SAR passport holders). Anyone needing more time must file an EOS with USCIS before that period runs out.",
      },
      {
        question: "Is there a grace period for F-1 students already in the U.S. under duration of status?",
        answer:
          "Yes. F-1 and J-1 nonimmigrants already present on D/S when the rule takes effect get a fixed period running from their program end date, capped at no more than four years from the September 15, 2026 effective date, plus 30 days to depart. DHS also carved out an exception: F-1 students who timely file Form I-765 for post-completion OPT or a STEM OPT extension on or before March 18, 2027 don't need to separately file an EOS application.",
      },
    ],
    sources: [
      {
        label: "Federal Register — DHS Final Rule 2026-14439 (Fixed Period of Admission for F, J, I Nonimmigrants)",
        url: "https://www.federalregister.gov/documents/2026/07/17/2026-14439/establishing-a-fixed-time-period-of-admission-and-an-extension-of-stay-procedure-for-nonimmigrant",
      },
      {
        label: "eCFR — 8 CFR 214.4 (SEVP certification requirements)",
        url: "https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-214/subpart-A/section-214.4",
      },
    ],
    relatedSlugs: ["virginia-paid-sick-leave", "ny-llc-transparency-act"],
  },
];

/** Non-draft alerts — the only ones that build pages and appear on the pillar grid. */
export function liveAlerts(): ComplianceAlert[] {
  return COMPLIANCE_ALERTS.filter((a) => !a.draft);
}

export const ALERT_BY_SLUG: Record<string, ComplianceAlert> = Object.fromEntries(
  COMPLIANCE_ALERTS.map((a) => [a.slug, a]),
);

/** Resolve an alert's relatedSlugs to live sibling entries (max `limit`). */
export function relatedAlerts(alert: ComplianceAlert, limit = 3): ComplianceAlert[] {
  return alert.relatedSlugs
    .map((slug) => ALERT_BY_SLUG[slug])
    .filter((a): a is ComplianceAlert => Boolean(a) && !a?.draft)
    .slice(0, limit);
}

/** Live alerts grouped by category, categories ordered by (max urgency, count). */
export function alertsByCategory(): [string, ComplianceAlert[]][] {
  const urgencyRank = { high: 0, medium: 1, low: 2 } as const;
  const groups = new Map<string, ComplianceAlert[]>();
  for (const a of liveAlerts()) {
    const list = groups.get(a.category) ?? [];
    list.push(a);
    groups.set(a.category, list);
  }
  for (const list of groups.values()) {
    list.sort((x, y) => urgencyRank[x.urgency] - urgencyRank[y.urgency]);
  }
  return [...groups.entries()].sort((a, b) => {
    const best = (list: ComplianceAlert[]) => Math.min(...list.map((x) => urgencyRank[x.urgency]));
    return best(a[1]) - best(b[1]) || b[1].length - a[1].length;
  });
}
