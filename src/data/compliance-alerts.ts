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
    relatedSlugs: ["ny-llc-transparency-act", "california-climate-disclosure-sb253-sb261"],
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
