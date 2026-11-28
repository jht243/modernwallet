# Approved Page Assignment: `/guides/surprise-anesthesia-bill-no-surprises-act` (`surprise-anesthesia-bill-no-surprises-act`)
- **Action ID:** `A1` (create new content)
- **Active Mindmap Track:** `guide`
- **Title:** Surprise Anesthesia Bill: What the No Surprises Act Covers
- **Page Type / Format / Medium:** guide | article - the reader needs a method plus a finite protected-vs-not table; no input changes the answer | text + comparison table
- **Minimum Visible Depth Floor:** 1800+ words (substantive, zero filler; never leave raw Markdown `| col |` pipe-table rows inside JSON string `paragraphs[]` arrays — use structured `table` fields where supported)

## Mandatory Reader Question & Opening Answer Contract (Cols 10–12)
- **Reader Question (Col 10):** Can an out-of-network anesthesiologist at my in-network hospital bill me more than my in-network cost-sharing, and what can I actually refuse under the No Surprises Act? [PAA unavailable (DataForSEO off, 0 reads); ac 5/40 "what if my anesthesiologist is out of network" + "can anesthesiologist out of network bill patients"; intake bullet is the demand signal]
- **Working Answer (Col 11):** Mechanism with a boundary: for most private plans, an out-of-network anesthesiologist, radiologist, pathologist or lab working at an in-network hospital, hospital outpatient department or surgery center generally can charge you only your in-network cost-sharing and cannot ask you to sign away that protection; you can refuse the balance above in-network cost-sharing, not a bill your plan correctly assigned to you. Check the EOB, call the plan, then file with the CMS No Surprises Help Desk (1-800-985-3059). The good faith estimate dispute ($400+ over estimate) is for uninsured or self-pay patients only, and ground ambulances are not covered federally.
- **Answer Placement (Col 12):** section 1: "Can You Be Billed More Than In-Network Rates?"

## Demand & Differentiation Context
- **Problem / Gap:** Direct intent plus news-driven demand (intake bullet, viral thread). Existing coverage: lookup /guides/how-to-deal-with-medical-debt (one paragraph on the Act inside a medical-debt payment-plan guide; reader goal: reduce an unaffordable balance, different from "is this bill even legal to charge me"); coverage_lookup otherwise: no match. Demand estimates (autocomplete, NOT measured): "no surprises act" 500-5000, "surprise anesthesia bill" 150-1500, "anesthesiologist out of network bill" 75-750/mo. Gap: no page answers the surprise-bill rights question or corrects the viral script.
- **Keyword Evidence:** "Primary \"surprise anesthesia bill\" (est. 150-1500/mo, autocomplete estimate, NOT measured, source=estimate, low confidence); supporting \"no surprises act anesthesia\" (50-500), \"anesthesiologist out of network bill\" (75-750), \"no surprises act\" (500-5000, head term), \"surprise medical bill\" (100-1000). Provider status: SEMRUSH no key, DataForSEO off, checked 2026-11-28, US. No measured volume or KD available. Fresh-trend rule applied: low measured volume does not veto. Files: kw-volumes.json, kw-status.json."
- **Why New Page / Angle:** coverage_lookup.py (research/coverage-lookup.txt): no existing home for the candidate. Strongest related page: /guides/how-to-deal-with-medical-debt (src/data/guides.ts line 8683, last updated 2026-10-02): one paragraph on the Act inside section "What to Do First When a Medical Bill Arrives"; its reader is trying to pay or reduce a balance they cannot afford; it says nothing on notice-and-consent, the specialist exemptions, EOB checking against the Act, ground ambulances or the uninsured/insured split. Different reader goal on the same topic, so enrichment would bury the answer in a 10-section debt guide; checked commits: git log -- src/data/guides.ts shows no commit adding surprise-billing content (grep for "balance bill|surprise medical" finds only the one paragraph and unrelated emergency-fund uses). Independent duplicate review: required of CHART-REVIEW.
- **Intent-Based Our Takeaway:** "If you have private insurance and an out-of-network anesthesiologist, radiologist, pathologist or lab billed you after care at an in-network hospital, outpatient department or surgery center, the federal rule generally limits you to in-network cost-sharing and those specialties cannot ask you to waive it, so compare the bill to the EOB Patient Balance, call the plan, then file with the CMS Help Desk if the bill is higher. Based on CMS pages read 2026-11-28. Applies to most private plans only; does not apply to uninsured/self-pay readers (use a good faith estimate and the 120-day, $400-over dispute), ground ambulances (check state law), doctor's offices that are not hospital outpatient departments, out-of-network facilities, short-term, sharing-ministry or fixed-indemnity plans. Would change if: CMS revises the rules, the reader signed a valid notice-and-consent for a non-exempt service, or the plan's EOB shows the amount is in-network cost-sharing."

## Eligible Internal & Testing Evidence Pool for Page Type `regulated-medical-or-psychedelic` (Unranked — Choose Best Option or Combine Multiple)
All options below are on equal footing with NO rigid priority. Choose whichever option — or combination of multiple options — makes this specific page strongest. Only omit internal proof if there is a genuine, specific reason (such as a medical/legal domain exclusion or zero applicable records/numbers), and state that reason explicitly.
- **`client_and_operator_experience` (Client / Operator / Fleet Implementation Experience):** Think wide and deep across our full anonymized client and founder catalog (over 50 small business founders across medical practices, law firms, finance, hospitality, construction, HOA, retail, and tech; plus over 7 small medical practices / 10+ years working with doctors). Surface real operational, cash-flow, bandwidth, or career/age-stage tradeoffs across business types (always anonymous, never inventing survey percentages or clinical/investment advice, and staying within stated `limits`).

## Generate Fresh Page-Specific Reviewer Note (Required — Jonathan Teplitsky)
- **Label:** `Publisher's Take` · **Angle:** Harvard Business School MBA, Amazon/Uber Operating Leader & Licensed Florida Real Estate Agent (#3440355)
- **Verified Career Lines (use ONLY these facts; never invent anecdotes, never cite Dapper Labs, and never restate vendor sticker prices—name a post-month-1 friction point and who should walk away; numbers are optional):**
  - Harvard Business School MBA (2014-2016); B.A. Defense Language Institute Foreign Language Center (2013-2014)
  - Founder & CEO, Layer3Labs (2020-2025): led 15 developers building AI/Web3 tools, marketplaces, and 17 games; grew B2C platform to 1.5M+ users with $0 marketing spend; advised Bowlero, NBCU, Jane Goodall Institute
  - Director of Community Growth, Horizen Labs (2018-2024): grew 1M+ users through referral/retention loops and analytics
  - Former U.S. Army Captain (Military Intelligence, 35D, 2009-2020): Horn of Africa political/economic/threat intelligence; trained 50+ Ugandan and 20+ Tanzanian military officers for Somalia and DRC deployments
- **Voice Rules (enforced by automated lint; concrete numbers NOT required):**
  - Write exactly 2 crisp sentences (roughly 30-55 words total) tailored specifically to THIS new page's topic, rules, pricing thresholds, or operational tradeoffs.
  - Use Jonathan's blunt, practical practitioner voice with natural contractions (don't, it's, you're, that's) and concrete specifics from this page's verified SOURCE facts.
  - NEVER use em-dashes, en-dashes, spaced hyphens, 'not X, but Y' closers, or banned AI words (leverage, robust, seamless, crucial, pivotal, landscape, game-changer, unlock, delve, comprehensive, streamline, holistic).
  - NEVER copy a sample quote verbatim. Sample quotes are style and tone references only.
- **Style Reference Only (NEVER copy verbatim):**
  - "Once your self-employed profit grows past side-hustle territory, picking between a Solo 401(k) and a SEP IRA can swing your annual tax-advantaged contribution room by tens of thousands of dollars. Run both numbers against your actual net business income before year-end deadlines lock you out."
  - "Parents hesitate to fund 529 plans because they worry about locking money up if their kid skips college or gets a scholarship. With the newer Roth IRA rollover rules and beneficiary-transfer options, unused balances have far more flexibility than most families realize, so check the holding-period rules before paying a penalty."
- **Publish Registration:** Include `"reviewerNote": {"label": "Publisher's Take", "note": "<fresh 2-sentence plain-English quote; numbers optional>"}` AND run `python3 .claude/tools/mindmap-tracks.py register-reviewer-note --route "/guides/surprise-anesthesia-bill-no-surprises-act" --note "<fresh 2-sentence quote>"`.

## Matched First-Party Client, Owned-App & Operator Experience Records (Use Naturally Within Stated `limits`)
When one of these real engagements illustrates the exact problem or workflow on this page, weave it naturally into your analysis or takeaway (follow `suggestedFraming` below; keep client identities anonymous and never invent metrics or product tests):
```json
[
  {
    "id": "group-medical-practices",
    "publicDescription": "Over 7 small medical practices (independent doctor's offices, with over 10 years of experience working with doctors)",
    "relationship": "Unnamed client groups",
    "topic": "Medical practice operations, office optimization, patient intake, billing & healthcare policy impact",
    "workSummary": "Owner-supplied experience (2026-11-25): over 10 years working with doctors and over 7 small medical practices on internal office optimizations, front-desk and patient-intake workflows, eligibility and documentation bottlenecks, scheduling, billing coordination, and small-practice operations.",
    "possibleUses": "Operational, financial, and administrative commentary on how Medicaid/Medicare rules, work requirements, insurance verification, prior authorization, coverage churn, patient intake, and healthcare-finance policy changes affect small doctor's offices, staff workload, cash flow, and patients, plus practical preparation steps for both practices and patients.",
    "limits": "Keep all medical practices and doctors strictly anonymous (never invent clinic names, patient outcomes, or unstated dollar or percentage figures). Restrict commentary to operational, administrative, financial, and workflow impacts; never give clinical or medical advice or claim to have tested medical treatments, clinics, or drugs.",
    "suggestedFraming": "Natural compliant framing (keep anonymous, no invented metrics): \"Working with over 7 small medical practices (independent doctor's offices, with over 10 years of experience working with doctors), we saw this exact workflow bottleneck around medical practice operations, office optimization, patient intake, billing & healthcare policy impact...\" or \"As we saw working with over 7 small medical practices (independent doctor's offices, with over 10 years of experience working with doctors), a tool like this fits best when...\"",
    "outcomeLeads": []
  },
  {
    "id": "example-049",
    "publicDescription": "An investor-rights law firm producing legal alerts",
    "relationship": "Client projects",
    "topic": "Legal publishing",
    "workSummary": "An investor-alert writing prototype using the firm’s existing articles, a style guide and a saved example draft.",
    "possibleUses": "News-to-alert drafting in a lawyer’s own voice and grounding new writing in an existing corpus.",
    "limits": "The records describe the build. Claims about time saved, revenue, adoption or deployment need their own supporting record.",
    "suggestedFraming": "Natural compliant framing (keep anonymous, no invented metrics): \"Working with an investor-rights law firm producing legal alerts, we saw this exact workflow bottleneck around legal publishing...\" or \"As we saw working with an investor-rights law firm producing legal alerts, a tool like this fits best when...\"",
    "outcomeLeads": []
  },
  {
    "id": "group-smb-founders",
    "publicDescription": "Over 50 small business founders and operators across medical, legal, finance, hospitality, real estate, retail, and tech",
    "relationship": "Unnamed client groups",
    "topic": "Small business founder finance, investing, cash-flow tradeoffs, bandwidth & career-stage patterns",
    "workSummary": "Owner-supplied experience (2026-11-25): direct operational, automation, and advisory work with over 50 small business founders and operators across independent doctor's offices, law firms, finance and lending firms, hospitality, construction/HOA boards, wellness/retail, multi-business executives, and tech/gaming companies.",
    "possibleUses": "Wide-and-deep personal-finance, investing, dividend stocks vs S&P 500 index fund, ETF, tax-drag, retirement, cash-flow, and tool-selection commentary comparing how different business types (such as time-poor high-bracket doctors and lawyers vs. seasonal/lumpy-cash-flow owners vs. multi-business executives) and career/age stages (accumulation-phase founders vs. exit-minded or near-retiree owners) weigh simplicity, cash yield, concentration risk, and total return.",
    "limits": "Keep all clients and founders strictly anonymous (never invent client names, fake survey percentages, or unstated portfolio returns). Frame patterns as qualitative operator observations paired with transparent educational math, never individualized investment, tax, or legal advice.",
    "suggestedFraming": "Natural compliant framing (keep anonymous, no invented metrics): \"Working with over 50 small business founders and operators across medical, legal, finance, hospitality, real estate, retail, and tech, we saw this exact workflow bottleneck around small business founder finance, investing, cash-flow tradeoffs, bandwidth & career-stage patterns...\" or \"As we saw working with over 50 small business founders and operators across medical, legal, finance, hospitality, real estate, retail, and tech, a tool like this fits best when...\"",
    "outcomeLeads": []
  }
]
```

## Approved Section Outline
1. **Can You Be Billed More Than In-Network Rates?** — Opening answer (placement section 1): who is protected, the in-network cost-sharing limit, anesthesiologists/radiologists/pathologists/labs at in-network hospitals, outpatient departments and surgery centers, plus emergency care and air ambulance; one sentence that a bill can still be correct.
2. **What the No Surprises Act Covers and Does Not** — Finite comparison table (situation, protected?, CMS source): ER and post-stabilization, non-emergency care at in-network hospital/HOPD/ASC, air ambulance, ground ambulance, doctor's office that is not a hospital outpatient department, out-of-network facility, vision/dental-only, short-term limited duration, sharing ministry, fixed indemnity, Medicare/Medicaid/VA/TRICARE/IHS.
3. **When Signing a Consent Form Gives Up Your Protection** — Counterexample: notice-and-consent can waive protection for some scheduled out-of-network care, but anesthesiology, radiology, pathology, diagnostic/lab services, emergency medicine, neonatology, assistant surgeons, hospitalists and intensivists cannot be asked; if no in-network provider is available no form; CMS says do not sign to stay in-network.
4. **What the Viral Scripts Get Wrong** — Correct the claim: good faith estimate dispute is for uninsured or self-pay patients ($400 or more over a provider's estimate, start within 120 days, estimate per provider); insured patients use EOB/plan/complaint route; nothing in CMS pages says to ignore or tear up a bill; ground ambulance not federally covered.
5. **How to Check a Surprise Bill Step by Step** — Numbered steps from CMS: ask for itemized bill; compare to EOB (Provider Charges, Allowed Charges, Paid by Insurer, Patient Balance; bill should not exceed Patient Balance); call plan; ask plan to review the claim as protected (stated as a practical step, not a CMS-prescribed procedure); gather documents; complaint to No Surprises Help Desk 1-800-985-3059, 60-day follow-up.
6. **Ground Ambulance Bills and State Rules** — CMS ground ambulance action plan: no federal protection, 10 states listed as of 2021-11-15 with caveat to check current state law, ask for lower bill or payment plan.
7. **Our Takeaway** — Intent-answering conclusion (see takeaway field), placed after evidence, before FAQ.
8. **Frequently Asked Questions** — Sentence-case questions from autocomplete: what if my anesthesiologist is out of network; can I be billed more at an in-network hospital; does the good faith estimate apply with insurance; are ground ambulances covered; who do I call; what if I signed a consent form; disclaimer as last element.

## Approved Internal Outbound Links
- {"source": "/guides/surprise-anesthesia-bill-no-surprises-act", "target": "/guides/how-to-deal-with-medical-debt", "section": "How to Check a Surprise Bill Step by Step", "anchor": "payment plans and hospital financial assistance", "purpose": "If the bill is correct, reader needs the payment-plan and financial-assistance steps.", "inspection": {"path": "reports/x-trends/runs/2026-11-28-surprise-billing/research/inspect-how-to-deal-with-medical-debt.txt", "sha256": "0840c089897061cf0b20d1261de9f38069c7bde8dac64be455ca0a94f3d738e7"}}
- {"source": "/guides/surprise-anesthesia-bill-no-surprises-act", "target": "/guides/hsa-fsa-reimbursement-checklist", "section": "How to Check a Surprise Bill Step by Step", "anchor": "HSA and FSA reimbursement checklist", "purpose": "Reader whose in-network cost-sharing is legitimately owed can pay it with HSA/FSA funds and needs the records checklist.", "inspection": {"path": "reports/x-trends/runs/2026-11-28-surprise-billing/research/inspect-hsa-fsa-reimbursement-checklist.txt", "sha256": "1b8507064cbd727198e9b755a5a8bc7392e532a6edfb5649400014dcacc6e9fa"}}

## Reviewer Guardrails (Must Respect)
- CR-1 (high): WRITE must use CMS's own wording for non-emergency care ('protected from unexpected out-of-network bills/charges' and 'balance billing protections' at in-network hospital, hospital outpatient department, ambulatory surgical center) and attribute the explicit 'no more than the in-network cost-sharing rate' sentence to emergency care only (hospital, providers, air ambulance provider when taken to the ER). Do not state a dollar or cost-sharing formula for planned care, or deductible crediting, unless a verbatim federal primary source is first saved to research/sources and added to the closed fact list. Keep 'in most cases'/'generally' qualifiers.
- CR-2 (medium): Word the 60 days exactly as 'if the Help Desk needs more information it will contact you within 60 days'; call 1-800-985-3059 with the confirmation number for status. Say specialists listed by CMS are not allowed to ask for a notice and consent form, and that an in-network provider shortage also bars the form.
- CR-3 (medium): Present the 10 states 'as of November 15, 2021' with a check-current-state-law caveat; Medicare/Medicaid/VA/TRICARE/IHS row says only CMS's 'already protect you from some unexpected out-of-network bills'; FAQ on collections states CMS pages do not address it and points to the Help Desk; no instruction to ignore, refuse to pay or tear up a bill; no individualized advice; 'reprocess' labeled a practical step, CMS says only to contact the plan, which 'might be able to fix billing errors'.
- CR-4 (low): Phase 6 link-only sentence beside that paragraph, dates preserved; keep $400, 3 business days and 1-800-985-3059 wording identical in substance; cite the same CMS URL family.
- CR-5 (low): Keep visible attribution 'Based on CMS pages read in full on 2026-11-28'; table is labeled our synthesis of CMS text; no TESTED label, howWeTested, byline claim of review by a clinician or attorney; disclaimer as last element only.
- CR-1
- CR-2
- CR-3
- CR-4
- CR-5

## Verified Same-Run Analysis & First-Party Evidence Packet (`evidence.json`)
Basis is `"reported"` (no executed multi-vendor benchmark script in `evidence.json`): NEVER claim hands-on product execution (`"In our internal testing"`, `"we tested"`, or `(Tested YYYY)`). You SHOULD still incorporate any genuinely relevant anonymized client/operator records (`Matched First-Party Client, Owned-App & Operator Experience Records` above) and any `Pre-Computed Practical Workload & Human-Unit Translations` above (stating their reference assumptions transparently, e.g. "Translating the published 1.5x Free cap against a 20-PDF monthly reading load at 150 words per minute...").
```json
{
  "gateSchemaVersion": 1,
  "author": "mindmap-writer",
  "route": "/guides/surprise-anesthesia-bill-no-surprises-act",
  "readerQuestion": "Can an out-of-network anesthesiologist at my in-network hospital bill me more than my in-network cost-sharing, and what can I actually refuse under the No Surprises Act? [PAA unavailable (DataForSEO off, 0 reads); ac 5/40 \"what if my anesthesiologist is out of network\" + \"can anesthesiologist out of network bill patients\"; intake bullet is the demand signal]",
  "approvedPlan": {
    "manifest": {
      "path": "reports/x-trends/runs/2026-11-28-surprise-billing/approval-manifest.json",
      "sha256": "e546eed1bc46de5436dc00b89781c55c4a3787b500b191c9f2a2fcd4be1e8a7b"
    },
    "review": {
      "path": "reports/x-trends/runs/2026-11-28-surprise-billing/chart-review.json",
      "sha256": "c2c06e326d14a18680754309137d7c89882a4d7f451d205148fe3322f8d7a5fc"
    },
    "actionId": "A1"
  },
  "presentation": {
    "medium": "text + comparison table",
    "placement": "Opening answer in section 1, protected-vs-not table in section 2, steps after it",
    "reason": "The answer is a finite set of situations (covered, not covered, covered unless consent) and a fixed order of steps; a table answers it without inputs.",
    "readerInputs": [],
    "interaction": {
      "decision": "not-useful",
      "reason": "No reader-adjustable input changes the federal rule; the dollar owed depends on the plan's cost-sharing, which only the EOB shows. A calculator would invent numbers."
    },
    "animation": {
      "decision": "not-useful",
      "reason": "Static scannable table and numbered steps answer faster."
    }
  },
  "basis": "reported",
  "decisionGap": "Readers who got a bill from an out-of-network anesthesiologist, radiologist, pathologist or lab after care at an in-network facility hear opposite advice online (tear up the bill vs just pay it). CMS pages answer each piece separately; no page on this site lays out what the federal law bars, what it does not (ground ambulance, doctor's offices that are not hospital outpatient departments, uninsured good faith estimate disputes), and the ordered checking steps.",
  "finding": "Per CMS, the No Surprises Act protects most privately insured people from unexpected out-of-network bills for emergency care, air ambulance, and non-emergency care related to a visit to an in-network hospital, hospital outpatient department or ambulatory surgical center. CMS says anesthesiology, radiology, pathology, diagnostic/laboratory services, emergency medicine, neonatology, assistant surgeons, hospitalists and intensivists are not allowed to ask for a notice and consent form. The good faith estimate dispute ($400 or more over a provider's estimate, start within 120 days) is for people who do not have or do not use insurance. Ground ambulances are generally not covered federally. CMS says your bill should not be higher than the EOB Patient Balance; if it is, talk to your provider. Contact your plan, then the No Surprises Help Desk at 1-800-985-3059. CMS publishes no instruction to ignore or tear up a bill.",
  "conditions": "Applies to people using most private health insurance (employer plans incl. FEHB, Marketplace, other individual coverage). Planned-care protection covers care related to a visit to an in-network hospital, hospital outpatient department or ambulatory surgical center, and can be waived by a valid notice and consent form except for the specialties CMS lists as not allowed to ask. Excludes ground ambulance (unless state law differs), doctor's offices that are not hospital outpatient departments, out-of-network facilities, vision-only and dental-only plans, short-term limited duration, health care sharing ministry and fixed indemnity plans. Medicare, Medicaid, IHS, VA and TRICARE: CMS says they already protect against some unexpected out-of-network bills. Ground ambulance state list is as of 2021-11-15. CMS pages retrieved 2026-11-28 (page modified dates 2026-10-01 to 2026-11-02). The explicit 'no more than in-network cost-sharing' sentence is CMS wording for emergency care only; no cost-sharing formula or deductible crediting is claimed for planned care.",
  "whatWouldChange": "A CMS or statutory change to covered settings or notice-and-consent exceptions; a signed valid notice and consent form for a non-exempt service; an EOB showing the billed amount is the plan's in-network Patient Balance; a state ground ambulance law covering the bill; or the reader being uninsured/self-pay (then the good faith estimate route applies).",
  "caseSelection": {
    "path": "reports/x-trends/runs/2026-11-28-surprise-billing/evidence/surprise-anesthesia-bill-no-surprises-act/cases.json",
    "sha256": "f7ee042a60a7cc497ff0f593788c1804fa3ec6f89831172c281a883a4ecc6b28"
  },
  "caseDecisions": "Reviewed cases.json candidates (example-037, example-038, fleet-*). None is an honest topical match for a federal surprise-billing rights guide; client lists do not establish outcomes. _experience.md section A (small medical practices) was considered and not used because the page makes no operational claim; no client reference forced. anchor-exempt: page anchor is our protected-vs-not table synthesized from CMS text, labeled as reported synthesis, not testing.",
  "sourceArtifacts": [
    {
      "path": "reports/x-trends/runs/2026-11-28-surprise-billing/brief.txt",
      "sha256": "0a50bc3f0baf52ae1aded34d6a261a56064b5592257a5e555acf4e8ab8702e17"
    },
    {
      "path": "reports/x-trends/runs/2026-11-28-surprise-billing/research/coverage-lookup.txt",
      "sha256": "360d28a9cb25935fec35f137e1b89edb29cd6f7dd6ba9983118ac8e743d90808"
    },
    {
      "path": "reports/x-trends/runs/2026-11-28-surprise-billing/research/intake-2026-11-28.md",
      "sha256": "0a50bc3f0baf52ae1aded34d6a261a56064b5592257a5e555acf4e8ab8702e17"
    },
    {
      "path": "reports/x-trends/runs/2026-11-28-surprise-billing/research/kw-volumes.json",
      "sha256": "591fdcf4e8f3af6170baf83e590cbffda3b3461db1dddd364e78da823c86aa7d"
    },
    {
      "path": "reports/x-trends/runs/2026-11-28-surprise-billing/research/kw-expand-nsa.json",
      "sha256": "161cae02a66cedea94656e5352d69d4d07bc59293bc925fe092a7e6092bf87df"
    },
    {
      "path": "reports/x-trends/runs/2026-11-28-surprise-billing/research/kw-expand-smb.json",
      "sha256": "69f57808e09b00ac4d639087b052e61e42b09c550a086de49b23177d5cefd556"
    },
    {
      "path": "reports/x-trends/runs/2026-11-28-surprise-billing/research/kw-status.json",
      "sha256": "7b73af897b58c772ce1b31d02a108406e1fd92a5ecf3445a883aa961357e9e5f"
    },
    {
      "path": "reports/x-trends/runs/2026-11-28-surprise-billing/research/autocomplete-note.txt",
      "sha256": "dd8f2a118786305ea0c55c24e9bd1db7a2be2302019acebf40128ec69bd80d8a"
    },
    {
      "path": "reports/x-trends/runs/2026-11-28-surprise-billing/research/autocomplete-anesthesiologist.csv",
      "sha256": "b0715d0343db866b6cf807a084d16a82ab974bcb449356f71dcc9dd25a5d1ed3"
    },
    {
      "path": "reports/x-trends/runs/2026-11-28-surprise-billing/research/autocomplete-surprise-medical-bill.csv",
      "sha256": "29324dae6d100da0d080a33496d9cd4059588131306c061e9abd385605a1b0f0"
    },
    {
      "path": "reports/x-trends/runs/2026-11-28-surprise-billing/research/serp-surprise-anesthesia.json",
      "sha256": "cb4feb17eb22572a3867f8a3ffc71e90e701ee83f7c8b769a24920c22ebb9977"
    },
    {
      "path": "reports/x-trends/runs/2026-11-28-surprise-billing/research/sources/cms-check-bill-errors.txt",
      "sha256": "6ee56ce9a31c4beecccd753053afcbb1b9d555103d1e3016c9b5a17ea27cfd4f"
    },
    {
      "path": "reports/x-trends/runs/2026-11-28-surprise-billing/research/sources/cms-find-action-plan.txt",
      "sha256": "4a9b11229cee9332073e691bf911d4ac40f678088e632111c937349af1177915"
    },
    {
      "path": "reports/x-trends/runs/2026-11-28-surprise-billing/research/sources/cms-ground-ambulance-bill.txt",
      "sha256": "ad7e30a0a9b2a70f24ce90387797585f7f3974f121fc90fb0c165b817c075844"
    },
    {
      "path": "reports/x-trends/runs/2026-11-28-surprise-billing/research/sources/cms-know-your-rights-insurance.txt",
      "sha256": "3fd944d949f02b5a92d4af63f4a32ed326cd2c11f94dfb725233bfd7438cf471"
    },
    {
      "path": "reports/x-trends/runs/2026-11-28-surprise-billing/research/sources/cms-know-your-rights-without-insurance.txt",
      "sha256": "85a061efd61d37c6271c3c9cb59a67c53312bbdea1c94e94a5dce896ed60d3e6"
    },
    {
      "path": "reports/x-trends/runs/2026-11-28-surprise-billing/research/sources/cms-know-your-rights.txt",
      "sha256": "f4b4d554c5b0be433dd3608d2d0bc84b88493b06fa5e837e813b69796e04d095"
    },
    {
      "path": "reports/x-trends/runs/2026-11-28-surprise-billing/research/sources/cms-medical-bill-rights.txt",
      "sha256": "d3604c9ddad60c9e67fe65778c24b42269ae7870b0813507e8fd0277e8b80c7d"
    },
    {
      "path": "reports/x-trends/runs/2026-11-28-surprise-billing/research/sources/cms-nosurprises-consumers.txt",
      "sha256": "b98eaf3e042c4e2848e85bdb4dde158843ed67164fe3d5023d93f2d6d063e6f9"
    },
    {
      "path": "reports/x-trends/runs/2026-11-28-surprise-billing/research/sources/cms-nosurprises.txt",
      "sha256": "bc86c6d14cb047136d65b8910cd56b4f7ccfcba5a12b10688f9716efca292e3c"
    },
    {
      "path": "reports/x-trends/runs/2026-11-28-surprise-billing/research/sources/cms-overview-rules-fact-sheets.txt",
      "sha256": "f529d77864bc10ff884aa3bb214e6d2e3b5440852b635b558d1555ccc9088f0b"
    },
    {
      "path": "reports/x-trends/runs/2026-11-28-surprise-billing/research/sources/cms-read-eob.txt",
      "sha256": "f2cb8a7ce90e62f6023325976e6d470a59db35118ccaabe902abb55eaed81f99"
    },
    {
      "path": "reports/x-trends/runs/2026-11-28-surprise-billing/research/sources/cms-submit-complaint.txt",
      "sha256": "b6b940c32854811e8a570e4c92ce3b1ed78d5e0899d9fcb5579adb2e3bd6ff94"
    }
  ],
  "whyNoQuantitativeAnalysis": "The answer is a rule boundary (which settings, specialties and plans are covered, and which steps to take). The only numbers are CMS-stated ($400, 120 days, 3 business days, 60 days, 90 days, 1-800-985-3059). The dollar owed depends on the plan's cost-sharing shown only on the reader's EOB, so a model would invent inputs.",
  "reasoning": "CMS know-your-rights (insurance) lists covered settings and the specialist notice-and-consent exclusions; the EOB page says the bill should not exceed the Patient Balance; check-your-bill-errors says the plan might be able to fix billing errors; submit-complaint gives the Help Desk number, documents and 60-day contact window; the without-insurance page limits the $400 / 120-day good faith estimate dispute to people not using insurance; the ground ambulance action plan lists 10 states as of 2021-11-15. Together these answer the reader question and the viral claim without individualized advice.",
  "provenance": {
    "basis": "reported",
    "supportingRecordIds": [],
    "scopeAndLimits": "CMS pages read in full on 2026-11-28; synthesis of CMS text, not testing, not legal advice; no individualized advice",
    "publicMethod": "Visible first-party attribution: 'Based on CMS pages read in full on 2026-11-28' with CMS URLs in sources",
    "placement": "Opening answer attribution line and Our Takeaway"
  },
  "sourceUrls": [
    {
      "url": "https://www.cms.gov/medical-bill-rights",
      "checkedAt": "2026-11-28"
    },
    {
      "url": "https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/know-your-rights/insurance",
      "checkedAt": "2026-11-28"
    },
    {
      "url": "https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/know-your-rights/without-insurance",
      "checkedAt": "2026-11-28"
    },
    {
      "url": "https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/read-explanation-benefits",
      "checkedAt": "2026-11-28"
    },
    {
      "url": "https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/check-your-bill-errors",
      "checkedAt": "2026-11-28"
    },
    {
      "url": "https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/submit-complaint",
      "checkedAt": "2026-11-28"
    },
    {
      "url": "https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/find-action-plan/ground-ambulance-bill",
      "checkedAt": "2026-11-28"
    }
  ]
}
```

## Captured Primary-Source Evidence Excerpts (Disk Cache)
### `reports/x-trends/runs/2026-11-28-surprise-billing/brief.txt`
```
- [FRUSTRATION] Got a surprise anesthesia bill after surgery at an in-network hospital? What the No Surprises Act really lets you refuse, and what viral "scripts" get wrong. Viral threads tell patients to rip up these bills. Correct: out-of-network anesthesiologists, radiologists and labs at in-network hospitals and surgery centers generally can't balance-bill you beyond in-network cost-sharing, and the same applies to emergency care and air ambulances. Wrong: the "good faith estimate" rule is for people who don't have or don't use insurance (who can dispute a bill that's $400+ over the estimate), not insured patients, and ground ambulances aren't covered. Explain how to check your EOB, ask the plan to reprocess the claim, and use CMS's help line (1-800-985-3059). No surprise-billing page exists. Why now: a post claiming this tactic got 4,100+ likes on Nov 28, and copycat "step-by-step" threads are spreading. No Surprises Act posts are steady at about 45-66 a day. Sources: https://x.com/Jasoncoderx/status/2126482656422736097, https://x.com/Kevincreates77/status/2126696332052361494, https://x.com/BillHelpers/status/2126052528681029640, https://www.cms.gov/medical-bill-rights, https://www.cms.gov/medical-bill-rights/know-your-rights

```
### `reports/x-trends/runs/2026-11-28-surprise-billing/research/coverage-lookup.txt`
```
coverage_lookup: 1 candidate(s) vs 898 repo pages / 919 sitemap routes (https://www.themodernwallet.com) / 0 redirects / 1345 past-chart lines

### /guides/no-surprises-act-surprise-medical-bills  — row - · create new content
keyword: surprise medical bill no surprises act anesthesiologist out-of-network
reader question (new page intent): What does the No Surprises Act let me refuse on a surprise anesthesia bill from an in-network hospital?
lookup terms: no surprise act medical bill anesthesiologist out network   format cues: -

Possible existing homes: none found in the repo page data, the search index or the sitemaps.

Redirects (topic deliberately merged elsewhere): none
Past mindmap charts mentioning these terms:
- 2026-11-16-xtrends.md [table] | Lens 1 direct intent plus release news (Google blog Nov 13 2026). lookup: no match in repo, sitemap or past charts; /roundup/best-budgeting-apps is an app ranking (different reader goal). Autocomplete question sweep ru
- 2026-11-23-xtrends.md [table] | Lens 1 direct intent + news-driven (brief bullet 2). Autocomplete (estimate, NOT measured): 'credit card interest cap trump', 'credit card interest cap when does it start' (31 completions). lookup: EXACT SLUG /credit-c
- 2026-11-25-search-gap.md [table] | Direct intent (6 search events from /investing/, one visitor refining one question). Cluster: dividend stock vs S&P 500 index stock; members 'dividend stocks vs s&p 500', 'dividend stock vs index fund', 'are dividend s
- 2026-11-25-tool-usage.md [table] | lookup: no existing page for the intent (coverage_lookup: no possible home); closest /guides/tax-loss-harvesting (how harvesting works, not a multi-year carryforward schedule) and /stock-capital-gains-tax-calculator/ (
- 2026-11-26-xtrends.md [exclusions] - Allstate stock, lawsuits, data breach, switching-insurer rate comparisons and premium figures: no sourced inputs; out of scope.
- 2026-11-27-xtrends.md [exclusions] - Candidate 2 Ofgem price cap +26%: dropped, UK energy regulation with GBP figures a US reader cannot act on; Ofgem figures verified (research/sources/ofgem.txt) but no site home or US intent.
Commits naming the topic: none
Same run overlap: none


```
### `reports/x-trends/runs/2026-11-28-surprise-billing/research/intake-2026-11-28.md`
```
- [FRUSTRATION] Got a surprise anesthesia bill after surgery at an in-network hospital? What the No Surprises Act really lets you refuse, and what viral "scripts" get wrong. Viral threads tell patients to rip up these bills. Correct: out-of-network anesthesiologists, radiologists and labs at in-network hospitals and surgery centers generally can't balance-bill you beyond in-network cost-sharing, and the same applies to emergency care and air ambulances. Wrong: the "good faith estimate" rule is for people who don't have or don't use insurance (who can dispute a bill that's $400+ over the estimate), not insured patients, and ground ambulances aren't covered. Explain how to check your EOB, ask the plan to reprocess the claim, and use CMS's help line (1-800-985-3059). No surprise-billing page exists. Why now: a post claiming this tactic got 4,100+ likes on Nov 28, and copycat "step-by-step" threads are spreading. No Surprises Act posts are steady at about 45-66 a day. Sources: https://x.com/Jasoncoderx/status/2126482656422736097, https://x.com/Kevincreates77/status/2126696332052361494, https://x.com/BillHelpers/status/2126052528681029640, https://www.cms.gov/medical-bill-rights, https://www.cms.gov/medical-bill-rights/know-your-rights

```
### `reports/x-trends/runs/2026-11-28-surprise-billing/research/kw-volumes.json`
```
{
 "rows": [
  {
   "keyword": "no surprises act",
   "volume": 500,
   "volume_low": 500,
   "volume_high": 5000,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 exact autocomplete match from its own prefix + broad completion set (est. 500-5000/mo, NOT measured)",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "surprise medical bill",
   "volume": 100,
   "volume_low": 100,
   "volume_high": 1000,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 partial prefix match + broad completion set (est. 100-1000/mo, NOT measured)",
   "autocomplete": {
    "completions": 9,
    "corroborates": true
   }
  },
  {
   "keyword": "surprise anesthesia bill",
   "volume": 150,
   "volume_low": 150,
   "volume_high": 1500,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 exact autocomplete match from its own prefix (est. 150-1500/mo, NOT measured)",
   "autocomplete": {
    "completions": 4,
    "corroborates": true
   }
  },
  {
   "keyword": "anesthesiologist out of network bill",
   "volume": 75,
   "volume_low": 75,
   "volume_high": 750,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 exact autocomplete match from its own prefix (est. 75-750/mo, NOT measured)",
   "autocomplete": {
    "completions": 3,
    "corroborates": true
   }
  },
  {
   "keyword": "out of network anesthesiologist in network hospital",
   "volume": 10,
   "volume_low": 10,
   "volume_high": 100,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 3 live autocomplete completions (est. 10-100/mo, NOT measured)",
   "autocomplete": {
    "completions": 3,
    "corroborates": false
   }
  },
  {
   "keyword": "surprise billing",
   "volume": 50,
   "volume_low": 50,
   "volume_high": 500,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 10 live autocomplete completions (est. 50-500/mo, NOT measured)",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  },
  {
   "keyword": "no surprises act anesthesia",
   "volume": 50,
   "volume_low": 50,
   "volume_high": 500,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 9 live autocomplete completions (est. 50-500/mo, NOT measured)",
   "autocomplete": {
    "completions": 9,
    "corroborates": true
   }
  },
  {
   "keyword": "balance billing",
   "volume": 50,
   "volume_low": 50,
   "volume_high": 500,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 10 live autocomplete completions (est. 50-500/mo, NOT measured)",
   "autocomplete": {
    "completions": 10,
    "corroborates": true
   }
  }
 ],
 "notes": [
  "semrush unusable (no SEMRUSH_API_KEY)",
  "volume: no provider usable \u2014 autocomplete estimate only",
  "No tool volume for 8 phrases \u2014 autocomplete band (source=estimate, NOT measured)",
  "Autocomplete: 7/8 rows corroborated live"
 ]
}

```
### `reports/x-trends/runs/2026-11-28-surprise-billing/research/kw-expand-nsa.json`
```
{
 "rows": [
  {
   "keyword": "no surprises act",
   "volume": 500,
   "volume_low": 500,
   "volume_high": 5000,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 exact autocomplete match from its own prefix + broad completion set (est. 500-5000/mo, NOT measured)",
   "seed": "no surprises act"
  },
  {
   "keyword": "no surprises act summary",
   "volume": 150,
   "volume_low": 150,
   "volume_high": 1500,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 exact autocomplete match from its own prefix (est. 150-1500/mo, NOT measured)",
   "seed": "no surprises act"
  },
  {
   "keyword": "no surprises act florida",
   "volume": 500,
   "volume_low": 500,
   "volume_high": 5000,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 exact autocomplete match from its own prefix + broad completion set (est. 500-5000/mo, NOT measured)",
   "seed": "no surprises act"
  },
  {
   "keyword": "no surprises act good faith estimate",
   "volume": 250,
   "volume_low": 250,
   "volume_high": 2500,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 exact autocomplete match from its own prefix + broad completion set (est. 250-2500/mo, NOT measured)",
   "seed": "no surprises act"
  },
  {
   "keyword": "no surprises act california",
   "volume": 500,
   "volume_low": 500,
   "volume_high": 5000,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 exact autocomplete match from its own prefix + broad completion set (est. 500-5000/mo, NOT measured)",
   "seed": "no surprises act"
  },
  {
   "keyword": "no surprises act idr",
   "volume": 500,
   "volume_low": 500,
   "volume_high": 5000,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 exact autocomplete match from its own prefix + broad completion set (est. 500-5000/mo, NOT measured)",
   "seed": "no surprises act"
  },
  {
   "keyword": "no surprises act 2022",
   "volume": 500,
   "volume_low": 500,
   "volume_high": 5000,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 exact autocomplete match from its own prefix + broad completion set (est. 500-5000/mo, NOT measured)",
   "seed": "no surprises act"
  },
  {
   "keyword": "no surprises act enforcement act",
   "volume": 75,
   "volume_low": 75,
   "volume_high": 750,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 exact autocomplete match from its own prefix (est. 75-750/mo, NOT measured)",
   "seed": "no surprises act"
  },
  {
   "keyword": "no surprises act texas",
   "volume": 150,
   "volume_low": 150,
   "volume_high": 1500,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 exact autocomplete match from its own prefix (est. 150-1500/mo, NOT measured)",
   "seed": "no surprises act"
  },
  {
   "keyword": "no surprises act out-of-network providers",
   "volume": 75,
   "volume_low": 75,
   "volume_high": 750,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 exact aut
```
### `reports/x-trends/runs/2026-11-28-surprise-billing/research/kw-expand-smb.json`
```
{
 "rows": [
  {
   "keyword": "surprise medical bills",
   "volume": 500,
   "volume_low": 500,
   "volume_high": 5000,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 exact autocomplete match from its own prefix + broad completion set (est. 500-5000/mo, NOT measured)",
   "seed": "surprise medical bill"
  },
  {
   "keyword": "surprise medical bill law",
   "volume": 500,
   "volume_low": 500,
   "volume_high": 5000,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 exact autocomplete match from its own prefix + broad completion set (est. 500-5000/mo, NOT measured)",
   "seed": "surprise medical bill"
  },
  {
   "keyword": "surprise medical bill act",
   "volume": 500,
   "volume_low": 500,
   "volume_high": 5000,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 exact autocomplete match from its own prefix + broad completion set (est. 500-5000/mo, NOT measured)",
   "seed": "surprise medical bill"
  },
  {
   "keyword": "surprise medical bills ny",
   "volume": 150,
   "volume_low": 150,
   "volume_high": 1500,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 exact autocomplete match from its own prefix (est. 150-1500/mo, NOT measured)",
   "seed": "surprise medical bill"
  },
  {
   "keyword": "surprise medical bill certification form",
   "volume": 75,
   "volume_low": 75,
   "volume_high": 750,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 exact autocomplete match from its own prefix (est. 75-750/mo, NOT measured)",
   "seed": "surprise medical bill"
  },
  {
   "keyword": "surprise medical bill california",
   "volume": 150,
   "volume_low": 150,
   "volume_high": 1500,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 exact autocomplete match from its own prefix (est. 150-1500/mo, NOT measured)",
   "seed": "surprise medical bill"
  },
  {
   "keyword": "surprise medical bill law california",
   "volume": 75,
   "volume_low": 75,
   "volume_high": 750,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 exact autocomplete match from its own prefix (est. 75-750/mo, NOT measured)",
   "seed": "surprise medical bill"
  },
  {
   "keyword": "what to do about surprise medical bills",
   "volume": 75,
   "volume_low": 75,
   "volume_high": 750,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 exact autocomplete match from its own prefix (est. 75-750/mo, NOT measured)",
   "seed": "surprise medical bill"
  },
  {
   "keyword": "surprise billing meaning",
   "volume": 50,
   "volume_low": 50,
   "volume_high": 500,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 8 live autocomplete completions (est. 50-500/mo, NOT measured)",
   "seed": "surprise medical bill"
  },
  {
   "keyword": "surprise medical bill attorney",
   "volume": 20,
   "volume_low": 20,
   "volume_high": 200,
   "kd": "",
   "cpc": "",
   "source": "estimate",
   "confidence": "low",
   "evidence": "Google Autocomplete \u2014 3 live autocomplete comple
```
### `reports/x-trends/runs/2026-11-28-surprise-billing/research/kw-status.json`
```
{
 "dataforseo": "off: DFS_ENABLED=0 or no credentials",
 "semrush": "unavailable: no SEMRUSH_API_KEY",
 "ahrefs": "off: reserved for technical site audits and weekly winner/loser only",
 "autocomplete": "ok",
 "selected": {
  "volume": null,
  "kd": null,
  "expand": null
 }
}

```
### `reports/x-trends/runs/2026-11-28-surprise-billing/research/autocomplete-note.txt`
```
Keyword/SERP provider status (checked 2026-11-28): SEMRUSH unavailable (no SEMRUSH_API_KEY); DataForSEO off (no credentials); Ahrefs reserved. Volumes below are Google Autocomplete estimates (source=estimate, NOT measured). SERP/PAA unread (no provider).
Estimate bands (kw-volumes.json): "no surprises act" 500-5000; "surprise medical bill" 100-1000; "surprise anesthesia bill" 150-1500; "anesthesiologist out of network bill" 75-750; "no surprises act anesthesia" 50-500; "surprise billing" 50-500; "balance billing" 50-500.
Live autocomplete question sweeps: autocomplete-anesthesiologist.csv (what happens if / what if my anesthesiologist is out of network; can anesthesiologist out of network bill patients), autocomplete-surprise-medical-bill.csv (how to dispute / report surprise medical bills; can surprise medical bills go to collections).

```
### `reports/x-trends/runs/2026-11-28-surprise-billing/research/autocomplete-anesthesiologist.csv`
```
seed,suggestion,via
anesthesiologist out of network,what anesthesiologist out of network insurance,question:what
anesthesiologist out of network,anesthesiologist out of network reddit,question:what
anesthesiologist out of network,anesthesiologist out of network bill,question:what
anesthesiologist out of network,anesthesia out of network,question:what
anesthesiologist out of network,anesthesia out of network billing,question:what
anesthesiologist out of network,anesthesia out of network reddit,question:what
anesthesiologist out of network,what happens if anesthesiologist is out of network,question:what
anesthesiologist out of network,what if my anesthesiologist is out of network,question:what
anesthesiologist out of network,what to do when anesthesiologist is out of network,question:what
anesthesiologist out of network,how anesthesiologist out of network work,question:how
anesthesiologist out of network,how anesthesiologist out of network insurance,question:how
anesthesiologist out of network,how anesthesiologist out of network billing work,question:how
anesthesiologist out of network,how anesthesiologist out of network claim form,question:how
anesthesiologist out of network,why anesthesiologist out of network insurance,question:why
anesthesiologist out of network,why anesthesiologist out of network reddit,question:why
anesthesiologist out of network,why anesthesiologist out of network in california,question:why
anesthesiologist out of network,why are anesthesiologists out of network,question:why
anesthesiologist out of network,why anesthesiologist out of network claim form,question:why
anesthesiologist out of network,why anesthesiologist out of network coverage,question:why
anesthesiologist out of network,is anesthesia out of network,question:is
anesthesiologist out of network,anesthesiologist is out of network,question:is
anesthesiologist out of network,are all anesthesiologists out of network,question:is
anesthesiologist out of network,my anesthesiologist was out of network,question:is
anesthesiologist out of network,why is anesthesia always out of network,question:is
anesthesiologist out of network,does anesthesiologist out of network need a referral,question:does
anesthesiologist out of network,does anesthesiologist out of network insurance,question:does
anesthesiologist out of network,does anesthesiologist out of network,question:does
anesthesiologist out of network,does anesthesiologist out of network claim form,question:does
anesthesiologist out of network,can anesthesiologist out of network bill,question:can
anesthesiologist out of network,can anesthesiologist out of network see patients,question:can
anesthesiologist out of network,can anesthesiologist out of network bill patients,question:can
anesthesiologist out of network,can anesthesiologist out of network,question:can
anesthesiologist out of network,should anesthesiologist out of network bill,question:should
anesthesiologist out of network,should anesthesiologist out of network see patients,question:should
anesthesiologist out of network,should anesthesiologist out of network,question:should
anesthesiologist out of network,should anesthesiologist out of network claim form,question:should
anesthesiologist out of network,when anesthesiologist out of network what happens,question:when
anesthesiologist out of network,when anesthesiologist out of network does insurance cover,question:when
anesthesiologist out of network,when anesthesiologist out of network claim form,question:wh
```
### `reports/x-trends/runs/2026-11-28-surprise-billing/research/autocomplete-surprise-medical-bill.csv`
```
seed,suggestion,via
surprise medical bill,what is surprise medical billing,question:what
surprise medical bill,what is surprise medical billing legislation,question:what
surprise medical bill,what is considered surprise medical billing,question:what
surprise medical bill,what is the surprise medical bill law,question:what
surprise medical bill,what constitutes a surprise medical bill,question:what
surprise medical bill,what to do about surprise medical bills,question:what
surprise medical bill,how surprise medical bills work,question:how
surprise medical bill,how surprise medical bills affect your credit,question:how
surprise medical bill,how to report surprise medical bills,question:how
surprise medical bill,how to dispute surprise medical bills,question:how
surprise medical bill,how to fight surprise medical bills,question:how
surprise medical bill,how to avoid surprise medical bills,question:how
surprise medical bill,how to handle surprise medical bills,question:how
surprise medical bill,why surprise medical bills,question:why
surprise medical bill,why surprise medical bills are bad,question:why
surprise medical bill,why surprise medical bills are so expensive,question:why
surprise medical bill,why surprise medical bills are a problem,question:why
surprise medical bill,why surprise medical bill law,question:why
surprise medical bill,is surprise medical billing illegal,question:is
surprise medical bill,is surprise medical bills a good idea,question:is
surprise medical bill,is surprise medical bills a scam,question:is
surprise medical bill,are surprise medical bills legal,question:is
surprise medical bill,is surprise medical bill law,question:is
surprise medical bill,does surprise medical bills affect credit score,question:does
surprise medical bill,does surprise medical bills affect your credit,question:does
surprise medical bill,what does surprise medical bills protection offer consumers,question:does
surprise medical bill,does nj have a surprise medical bill law,question:does
surprise medical bill,does florida have a surprise medical bill law,question:does
surprise medical bill,does surprise medical bills,question:does
surprise medical bill,can surprise medical bills affect your credit score,question:can
surprise medical bill,can surprise medical bills affect your credit,question:can
surprise medical bill,can surprise medical bills go to collections,question:can
surprise medical bill,can surprise medical bills,question:can
surprise medical bill,can surprise medical bill law,question:can
surprise medical bill,should surprise medical bills be reported to credit bureaus,question:should
surprise medical bill,should surprise medical bills be reported,question:should
surprise medical bill,should surprise medical bills be paid,question:should
surprise medical bill,should surprise medical bills,question:should
surprise medical bill,should surprise medical bills be reported to medicare,question:should
surprise medical bill,should surprise medical bill law,question:should
surprise medical bill,when surprise medical bills,question:when
surprise medical bill,when surprise medical bills go to collections,question:when
surprise medical bill,when surprise medical bills are paid,question:when
surprise medical bill,when surprise medical bill law,question:when
surprise medical bill,where surprise medical bills go,question:where
surprise medical bill,where surprise medical bills come from,question:where
surprise medical bill,where surprise medical bil
```
### `reports/x-trends/runs/2026-11-28-surprise-billing/research/serp-surprise-anesthesia.json`
```
{
 "error": "DataForSEO unavailable \u2014 no SERP read possible"
}

```
### `reports/x-trends/runs/2026-11-28-surprise-billing/research/sources/cms-check-bill-errors.txt`
```
URL: https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/check-your-bill-errors
Retrieved: 2026-11-28T16:51:00.161502Z


 Check your medical bill for errors | CMS
 Check your medical bill for errors
Bills can be complex and confusing, but it’s important to review your bill for accuracy. This may help you save money. Here’s what you can do.
On this page:
Ask your provider’s billing department for a detailed bill
Contact your health insurance company
Ask your provider for a copy of your medical records
Make sure you weren’t billed twice for the same service
Look up medical billing codes online
Get help from a Consumer Assistance Program or patient advocate in your state
We’re here to help
Contact the No Surprises Help Desk for help in over 350 languages and for information in a format that’s accessible to you. You can also ask a question online using our complaints form.
Get help in Español, Français, عربي, русский, नेपाली, and 350 other languages:  1-800-985-3059
 Get help
How to check your bill for errors
Ask your provider’s billing department for a detailed bill.
Request a list of the costs for each medical item or service you’re being billed for.
Learn how to read a medical bill
Contact your health insurance company (if you used insurance when you got care).
The company might be able to fix billing errors with your health care provider.
You can also ask the company for a copy of your explanation of benefits. Make sure the “your share” amount is the same as what’s on your bill.
Ask your provider for a copy of your medical records. Compare them to your bill.
You shouldn’t get a bill for anything that isn’t documented in your records.
If you’ve been billed for something that’s not documented in your records, talk to your provider’s billing department.
Note: Some providers charge a fee to access records. Ask the billing department if there’s a records fee.
Make sure you weren’t billed twice for the same service.
Double billing is especially common if you got care from more than one provider.
Contact the billing department of each provider if you think you were double billed for a service.
Look up medical billing codes online. Compare the results to your bill.
Use a search engine to look up the medical billing code for each item on your bill. Type the code number with the term “medical billing code” and read the descriptions.
Compare the descriptions to your bill. Do the billing codes match the care you got? Contact your provider’s billing department if they don’t.
Note: Medical billing can be complicated. You may want to reach out to a patient advocate for assistance.
Get help from a Consumer Assistance Program or patient advocate in your state.
Consumer Assistance Programs may be able to help with billing issues. Reach out to a Program in the state you got care.
Patient advocates can handle medical billing issues on your behalf.
Find a Consumer Assistance Program in your state on CMS.gov
Learn how patient advocates can help
Still have questions? Find the answers you need in a way that works for you.
Call the No Surprises Help Desk
Get answers about the No Surprises Act. Call our Help Desk at 1-800-985-3059. We can help you in English, Spanish and over 350 other languages.
Get help
Find a patient advocate near you
Patient advocates can help you navigate the healthcare system. Work with an advocate to get the care and resources you need.
Find a patient advocate
Page Last Modified:
10/06/2026 05
```
### `reports/x-trends/runs/2026-11-28-surprise-billing/research/sources/cms-find-action-plan.txt`
```
URL: https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/find-action-plan
Retrieved: 2026-11-28T16:51:00.182349Z


 Find an action plan for your medical bill | CMS
 Find an action plan for your medical bill
Medical billing can be confusing and frustrating
Take 5 minutes to answer a few general questions about your medical billing issue.
Whether you already have a bill or are planning for care, we’ll give you ways to navigate your situation.
Get started Comenzar
Page Last Modified:
10/02/2026 12:20 AM

```
### `reports/x-trends/runs/2026-11-28-surprise-billing/research/sources/cms-ground-ambulance-bill.txt`
```
URL: https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/find-action-plan/ground-ambulance-bill
Retrieved: 2026-11-28T16:51:00.140275Z


 Action plan: Ground ambulance bill | CMS
 Action plan: Ground ambulance bill
Your situation: You got a ground ambulance bill
This action plan applies to you if:
You got an unexpected medical bill
You used health insurance
You were taken to the hospital in a ground ambulance and you’re being charged for that service
Not your situation?
Answer a few questions, and we’ll get you to the right place.
Get a different action plan for your bill
We’re here to help
Contact the No Surprises Help Desk for help in over 350 languages and for information in a format that’s accessible to you. You can also ask a question online using our complaints form.
Get help in Español, Français, عربي, русский, नेपाली, and 350 other languages:  1-800-985-3059
 Get help
Action Plan
Your ground ambulance provider may be able to lower the cost of your bill or set up a payment plan.
Learn about your rights.
As of November 15, 2021, 10 states have ground ambulance billing protections:
Colorado
Delaware
Florida
Illinois
Maine
Maryland
New York
Ohio
Vermont
West Virginia
Call the ground ambulance provider if they billed you for service in one of those states.
Tell them that you're aware of “surprise billing rules” (protections from unexpected out-of-network bills) for ground ambulance services. They may be able to reduce your bill.
Ask for a lower bill.
Providers (or their billing departments) can sometimes lower the price. They may also offer payment plans. Talk to your provider to learn about your options.
Get tips for talking to your provider
Get help from outside resources.
Here are other resources to help you resolve your issue:
Consumer Assistance Programs
Consumer Assistance Programs may be able to give you advice for your specific case in the state you got care.
Find a Consumer Assistance Program in your state on CMS.gov
Patient advocates
Patient advocates can handle medical billing issues on your behalf.
Find out how patient advocates can help you
Friends and family
Consider asking a loved one for help. They can advocate on your behalf if you're feeling sick or overwhelmed.
Call the No Surprises Help Desk
Get answers about the No Surprises Act. We can help you in English, Spanish, and over 350 other languages.
1-800-985-3059
Still have questions? Find the answers you need in a way that works for you.
Call the No Surprises Help Desk
Get answers about the No Surprises Act. Call our Help Desk at 1-800-985-3059. We can help you in English, Spanish and over 350 other languages.
Get help
Find a patient advocate near you
Patient advocates can help you navigate the healthcare system. Work with an advocate to get the care and resources you need.
Find a patient advocate
Page Last Modified:
10/05/2026 06:54 PM

```
### `reports/x-trends/runs/2026-11-28-surprise-billing/research/sources/cms-know-your-rights-insurance.txt`
```
URL: https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/know-your-rights/insurance
Retrieved: 2026-11-28T16:50:48.734342Z


 Know your medical bill rights when using insurance | CMS
 Know your medical bill rights when using insurance
This page applies to all people in the United States who use most types of private health insurance.
On this page
The No Surprises Act
Emergency room care
Planned, non-emergency room care
Exceptions
Signing a notice and consent form may increase your costs
When your provider leaves your health plan’s network
If your provider isn’t following these rules
Understanding your bill
Other rights and protections
The No Surprises Act
The No Surprises Act is a federal law that went into effect on January 1, 2022.
The Act protects you from unexpected out-of-network bills from:
Emergency room visits
Non-emergency care related to a visit to an in-network:
Hospital
Hospital outpatient department
Ambulatory surgical center
Air ambulance services
These protections apply to you if you have health insurance through an employer (including a Federal Employees Health Benefits plan), the federal Health Insurance Marketplace, a State-based Marketplace, or other individual market coverage.
↑ Back to contents
Emergency room care
During an emergency room visit
What is considered an "emergency room" visit?
On this website, emergency room refers to:
Emergency rooms at a hospital
Independent, freestanding emergency departments
Any department of a hospital where you might get post-stabilization services
When you go to the emergency room, you’re protected from unexpected out-of-network charges (“surprise bills”) for emergency medical services in most cases.
If your health insurance covers emergency care, you can't be charged any more for emergency medical services than the in-network “cost-sharing” rate by:
The hospital
The providers giving you care at the hospital
Your air ambulance provider (if you were taken to the hospital in an air ambulance)
Note: Some health plans don’t cover emergency care. If you’re unsure about what your plan covers, contact your insurance company or health plan.
What is “cost-sharing?”
Cost-sharing is when you're responsible for some of the cost of a medical item or service when using insurance to pay. Cost-sharing can take the form of a copayment, deductible, or coinsurance.
Health insurance terms you should know
Currently, ground ambulance services aren't covered by billing protections in the No Surprises Act. They're still allowed to charge out-of-network rates and cost-sharing (unless they're not allowed to under state law). Learn what you can do if you get an out-of-network ground ambulance bill.
After an emergency room visit
Post-stabilization care
After an emergency room visit, you’re protected from unexpected out-of-network bills for post-stabilization services in most cases.
Sometimes, an out-of-network provider may ask you to sign a notice and consent form. By doing this, you give up your billing protections. Read about notice and consent forms for post-stabilization services.
What are “post-stabilization services?”
After an emergency room visit, you may need more services to stabilize your condition.
You may get these in:
The emergency room
Another department in the hospital
↑ Back to contents
Planned, non-emergency room care
You may be seen by an out-of-network provider while getting care at an in-network facility. For example, your local hospital may be in-network, but an atte
```
### `reports/x-trends/runs/2026-11-28-surprise-billing/research/sources/cms-know-your-rights-without-insurance.txt`
```
URL: https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/know-your-rights/without-insurance
Retrieved: 2026-11-28T16:51:00.129526Z


 Know your medical bill rights when not using insurance | CMS
 Know your medical bill rights when not using insurance
This page applies to all people in the United States who:
Don’t use health insurance
Don’t have health insurance
On this page
The No Surprises Act
Get a good faith estimate
What is a good faith estimate?
When can you get a good faith estimate?
What's included on a good faith estimate?
Get a good faith estimate in writing from your provider
Save your good faith estimate to compare it to your final bill
Dispute a bill
Other resources
The No Surprises Act
The No Surprises Act is a federal law that went into effect on January 1, 2022.
Usually, if you don't have or use health insurance to pay for your care, providers must give you a good faith estimate of how much it will cost. You get the estimate when you schedule care at least 3 business days in advance or if you ask for one. You may be able to dispute your bill if it’s at least $400 more than the estimate.
Note: You won’t get an estimate during emergency care.
↑ Back to contents
Get a good faith estimate
If you aren’t using insurance to pay for your care, let your health care provider know in advance. Usually, the provider must give you a good faith estimate of expected charges.
This applies when you don’t have insurance, or are choosing not to use it. You may choose not to use insurance if the service you need isn’t covered, or it’s less expensive if you pay out of pocket.
In most cases, providers and facilities must give you an estimate when you schedule care at least 3 business days in advance, or if you ask for one.
If a bill from one of your providers is at least $400 more than the good faith estimate from that provider, you can dispute your bill.
Dispute a bill
What is a good faith estimate?
A good faith estimate is a list of expected charges before you get health care items or services (procedures, supporting care) from a provider or facility.
The good faith estimate isn't a bill. You're only given one if you don't have insurance or aren’t using insurance to pay for your care.
View an example of a good faith estimate (PDF). (Note: This example is blank. The estimate you get will list details of your care.)
When can you get a good faith estimate?
You’re eligible to get a good faith estimate if you schedule care at least 3 business days (Monday through Friday) in advance. You can ask your provider directly for an estimate if they don’t give one to you.
Note: You won’t get an estimate during emergency care.
What’s included on a good faith estimate?
A good faith estimate should include expected charges for the health care items and services, including facilities fees and hospital fees.
Currently, good faith estimates only list expected charges for a single provider or facility, even if multiple providers will be involved in your care. You should request an estimate from each of your providers and the facility involved in your care.
Note: Your provider should include everything they can on the estimate. But you may need care that they didn’t anticipate. That care won’t be included on the estimate.
Example
You’re scheduled for surgery. You should request 2 good faith estimates: one from the surgeon, and one from the hospital.
The 2 estimates could include services like:
The cost of the surgery
Hospital fees
You may need 
```
### `reports/x-trends/runs/2026-11-28-surprise-billing/research/sources/cms-know-your-rights.txt`
```
URL: https://www.cms.gov/medical-bill-rights/know-your-rights
Retrieved: 2026-11-28T16:50:32.799513Z


 Know your medical bill rights | CMS
 Know your medical bill rights
The No Surprises Act protects people who use private insurance or don't have or use insurance
The No Surprises Act is a federal law that went into effect on January 1, 2022.
It protects people in the United States who:
Use most types of private health insurance
Don't use health insurance
Don’t have health insurance
Read about your rights
There are different rights when you use health insurance and when you don't
Using insurance
Your rights when you use most types of health insurance
In most cases, the No Surprises Act protects you from unexpected out-of-network bills from: emergency room visits; non-emergency care related to visits at in-network hospitals, hospital outpatient departments, and ambulatory surgical centers; and air ambulance services.
Not using insurance
Your rights when you don’t have or don't use health insurance
Usually, providers must give you a good faith estimate of how much your care will cost. You may be able to dispute your bill if it’s at least $400 more than the estimate.
Exceptions
Ground ambulance services
Generally, ground ambulance services aren't covered by billing protections in the No Surprises Act (unless a state law has different rules). They're still allowed to charge out-of-network rates.
Learn what you can do if you get an out-of-network ground ambulance bill.
Vision-only and dental-only insurance
These balance billing protections generally don’t apply to vision-only and dental-only insurance plans, but they may apply if vision or dental benefits are included in your health plan.
Short-term limited duration and health care sharing ministry plans
Services covered by these plans aren't subject to the billing protections of the No Surprises Act.
Fixed indemnity excepted benefits plans, like hospital indemnity insurance
Services covered by these plans aren't part of the billing protections of the No Surprises Act.
Do you use Medicare, Medicaid, Indian Health Services, Veterans Affairs Health Care, or TRICARE?
These plans already protect you from some unexpected out-of-network bills.
But if you have a billing issue, we can help. Answer a few questions, and we’ll find an action plan that works for you.
Find an action plan
Talk to someone
Call us with your questions or to submit a complaint.
Phone support 7 days a week
Accessibility support
Language support
Help resources
Get help in Español, Français, عربي, русский, नेपाली, and 350 other languages: 1-800-985-3059
Page Last Modified:
10/01/2026 11:09 PM

```
### `reports/x-trends/runs/2026-11-28-surprise-billing/research/sources/cms-medical-bill-rights.txt`
```
URL: https://www.cms.gov/medical-bill-rights
Retrieved: 2026-11-28T16:50:32.782718Z


 Medical bill rights | CMS
 Medical bill rights
Cambiar a Español
You have new rights
The No Surprises Act protects people from unexpected medical bills
Learn more about the protections that apply to you
If you use health insurance
The No Surprises Act protects you from unexpected out-of-network medical bills for emergency room visits.
 Know your rights when using insurance
If you don’t use health insurance
Usually, providers must give you a good faith estimate of how much your health care will cost if you request one or schedule services at least 3 business days in advance.
 Know your rights when not using insurance
Find an action plan
Do you have a medical billing issue? Answer a few questions, and we’ll find an action plan that works for you.
 Find an action plan
What is the No Surprises Act?
The No Surprises Act is a federal law that went into effect on January 1, 2022.
It applies to most types of health insurance, and protects you from unexpected out-of-network medical bills from:
Emergency room visits
Non-emergency care related to a visit to an in-network hospital, hospital outpatient department, or ambulatory surgical center
Air ambulance services
Usually, if you don't have or use health insurance, providers must give you a good faith estimate of what your care will cost. You get the estimate when you schedule care in advance or if you ask for one. You may be able to dispute your bill if it’s at least $400 more than the estimate.
You can submit a complaint if you believe that your facility, provider, or insurer isn't following these rules.
Talk to someone
Call us with your questions or to submit a complaint.
Phone support 7 days a week
Accessibility support
Language support
Help resources
Get help in Español, Français, عربي, русский, नेपाली, and 350 other languages: 1-800-985-3059
No Surprises Act resources for providers and insurers
Providers
Learn more about provider requirements and resources.
 Resources for providers
Insurance plans and issuers
Read requirements and resources for health insurance plans and issuers.
 Resources for insurers
Page Last Modified:
10/05/2026 05:05 PM

```
### `reports/x-trends/runs/2026-11-28-surprise-billing/research/sources/cms-nosurprises-consumers.txt`
```
URL: https://www.cms.gov/nosurprises/consumers
Retrieved: 2026-11-28T16:50:32.826197Z


 Medical bill rights | CMS
 Medical bill rights
Cambiar a Español
You have new rights
The No Surprises Act protects people from unexpected medical bills
Learn more about the protections that apply to you
If you use health insurance
The No Surprises Act protects you from unexpected out-of-network medical bills for emergency room visits.
 Know your rights when using insurance
If you don’t use health insurance
Usually, providers must give you a good faith estimate of how much your health care will cost if you request one or schedule services at least 3 business days in advance.
 Know your rights when not using insurance
Find an action plan
Do you have a medical billing issue? Answer a few questions, and we’ll find an action plan that works for you.
 Find an action plan
What is the No Surprises Act?
The No Surprises Act is a federal law that went into effect on January 1, 2022.
It applies to most types of health insurance, and protects you from unexpected out-of-network medical bills from:
Emergency room visits
Non-emergency care related to a visit to an in-network hospital, hospital outpatient department, or ambulatory surgical center
Air ambulance services
Usually, if you don't have or use health insurance, providers must give you a good faith estimate of what your care will cost. You get the estimate when you schedule care in advance or if you ask for one. You may be able to dispute your bill if it’s at least $400 more than the estimate.
You can submit a complaint if you believe that your facility, provider, or insurer isn't following these rules.
Talk to someone
Call us with your questions or to submit a complaint.
Phone support 7 days a week
Accessibility support
Language support
Help resources
Get help in Español, Français, عربي, русский, नेपाली, and 350 other languages: 1-800-985-3059
No Surprises Act resources for providers and insurers
Providers
Learn more about provider requirements and resources.
 Resources for providers
Insurance plans and issuers
Read requirements and resources for health insurance plans and issuers.
 Resources for insurers
Page Last Modified:
10/05/2026 05:05 PM

```
### `reports/x-trends/runs/2026-11-28-surprise-billing/research/sources/cms-nosurprises.txt`
```
URL: https://www.cms.gov/nosurprises
Retrieved: 2026-11-28T16:50:32.815466Z


 No Surprise Billing | CMS
Ending Surprise Medical Bills
Learn how providers, facilities, plans and issuers can comply with surprise billing protections and resolve out-of-network payment disputes.
Learn More
Policies & resources
Review rules and fact sheets on what No Surprises rules cover, and get additional resources with more information.
Overview of rules & fact sheets 
Provider resources 
Providers: submit a billing complaint 
Providers: payment resolution with patients
Plans and Issuers resources
Independent dispute resolution reports 
Privacy policies & notices for this website
Resolving out-of-network payment disputes
Learn about the independent dispute resolution (IDR) process and access the IDR Gateway for submitting and processing disputes.
Learn about or start a payment dispute
Tips for disputing parties
Become a dispute resolution organization
List of certified organizations
Submit petition to deny IDRE certification
Submit petition to revoke IDRE certification
IDR Gateway
Consumers and consumer advocates
Learn about rights and protections for consumers to end surprise bills and remove consumers from payment disagreements between their providers, health care facilities and health plans.
You have new rights The No Surprises Act protects people from unexpected medical bills 
No Surprises Act Consumer Advocate Toolkit 
Page Last Modified:
09/10/2026 11:57 AM

```
### `reports/x-trends/runs/2026-11-28-surprise-billing/research/sources/cms-overview-rules-fact-sheets.txt`
```
URL: https://www.cms.gov/initiatives/no-surprise-billing/overview/policies-resources/overview-rules-fact-sheets
Retrieved: 2026-11-28T16:50:48.722052Z


 Overview of rules & fact sheets | CMS
 Overview of rules & fact sheets 
Rules focused on specific protections and provisions
In July, 2021, the U.S. Departments of Health and Human Services, Labor, and the Treasury (the Departments) released the “Requirements Related to Surprise Billing; Part I,” to restrict surprise billing for patients in job-based and individual health plans who get emergency care, non-emergency care from out-of-network providers at in-network facilities, and air ambulance services from out-of-network providers.
In October, 2021, the Departments released the “Requirements Related to Surprise Billing; Part II,” which provides additional protections against surprise medical bills, including:
Establishing an independent dispute resolution (IDR) process to determine out-of-network payment amounts between providers (including air ambulance providers) or facilities and health plans.
Requiring good-faith estimates of medical items or services for uninsured (or self-paying) individuals.
Establishing a patient-provider dispute resolution process for uninsured (or self-paying) individuals to determine payment amounts due to a provider or facility under certain circumstances.
Providing a way to appeal certain health plan decisions.
On August 19, 2022, the Departments issued final rules titled “Requirements Related to Surprise Billing: Final Rules.” The rules finalize requirements under the July 2021 interim final rules relating to information that group health plans and health insurance issuers offering group or individual health insurance coverage must share about the qualifying payment amount (QPA). On February 23, 2022, in Texas Medical Association, et al. v. United States Department of Health and Human Services, and July 26, 2022, in LifeNet, Inc. v. United States Department of Health and Human Services, the United States District Court for the Eastern District of Texas (District Court) vacated portions of the October 2021 interim final rules related to payment determinations under the Federal IDR process. In light of the Court’s rulings and comments received, these rules also finalize select requirements under the October 2021 interim final rules related to consideration of information when a certified IDR entity makes a payment determination. Learn more about the status of the IDR system implementation (PDF).
On December 21, 2023, the Departments issued a final rule titled Federal Independent Dispute Resolution (IDR) Process Administrative Fee and Certified IDR Entity Fee Ranges. This rule outlines the fees established in the No Surprises Act for the Federal IDR process. The rule amends existing regulations to provide that the administrative fee amount charged by the Departments to participate in the Federal IDR process, and the ranges for certified IDR entity fees for single and batched determinations, will be established by the Departments in notice and comment rulemaking, rather than in guidance published annually. This rule also sets the amount of the administrative fee and the certified IDR entity fee ranges for disputes initiated on or after January 22, 2024. Read the Federal IDR Process Administrative Fee and Certified IDR Entity Fee Ranges Rule to learn more. The updated certified IDR entity fees will be posted to the List of certified IDR entities page when fina
```
### `reports/x-trends/runs/2026-11-28-surprise-billing/research/sources/cms-read-eob.txt`
```
URL: https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/read-explanation-benefits
Retrieved: 2026-11-28T16:51:00.150902Z


 How to read a health insurance explanation of benefits | CMS
 How to read a health insurance explanation of benefits
Reading an explanation of benefits can be confusing. On this page, you’ll learn what an explanation of benefits is for, and how to read one.
See what an explanation of benefits looks like (PDF)
On this page:
What’s an explanation of benefits?
What’s on an explanation of benefits?
We’re here to help
Contact the No Surprises Help Desk for help in over 350 languages and for information in a format that’s accessible to you. You can also ask a question online using our complaints form.
Get help in Español, Français, عربي, русский, नेपाली, and 350 other languages:  1-800-985-3059
 Get help
How to read an explanation of benefits (EOB)
What’s an explanation of benefits?
An explanation of benefits (EOB) shows you the total charges for your visit.
An explanation of benefits isn’t a bill.
It helps you understand how much your health plan covers, and what you’ll pay when you get a bill from your provider.
What’s on an explanation of benefits?
General information about you and your health plan
The explanation of benefits includes information about:
You (the patient)
Your health plan
Who provided your care, and when it was provided
A reference number called the claim number
The person who gets reimbursed for any overpayments, called the payee
It will also list your health plan’s phone number. Call your health plan if you have questions about finding a provider or what services they cover.
Details about your claim(s)
The explanation of benefits gives you details about your care, like:
The date of service
A service description. This explains what service you had, like a medical visit, lab test, or screening.
Information about your bill
The explanation of benefits lists the cost of your care, and how much your health insurance company will pay.
“Provider Charges” is the amount your provider bills for your visit.
“Allowed Charges” is the amount your provider will be paid. This may not be the same as the Provider Charges.
“Paid by Insurer” is the amount your health plan will pay to your provider.
What you owe
What You Owe, or Patient Balance, is the amount you owe after your insurer has paid everything else.
You may have already paid for part of the Patient Balance. The Explanation of Benefits only shows what you owe, not if you’ve already paid for it.
Your bill should not be higher than the Patient Balance. If it is, talk to your provider.
Remark code
A remark code is a note from the health plan that explains more about the costs, charges, and paid amounts for your visit.
The code is usually 2 or 3 letters and numbers. Check the bottom of the explanation of benefits for a description of each code.
Still have questions? Find the answers you need in a way that works for you.
Call the No Surprises Help Desk
Get answers about the No Surprises Act. Call our Help Desk at 1-800-985-3059. We can help you in English, Spanish and over 350 other languages.
Get help
Find a patient advocate near you
Patient advocates can help you navigate the healthcare system. Work with an advocate to get the care and resources you need.
Find a patient advocate
Page Last Modified:
10/05/2026 05:55 PM

```
### `reports/x-trends/runs/2026-11-28-surprise-billing/research/sources/cms-submit-complaint.txt`
```
URL: https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/submit-complaint
Retrieved: 2026-11-28T16:51:00.172272Z


 Submit a provider or insurer complaint | CMS
 Submit a provider or insurer complaint
When your provider or insurer might not be following the rules.
Health insurance companies and health care providers and facilities must follow rules that protect you from unexpected, or “surprise,” out-of-network bills.
If you have a question about these rules or believe the rules aren’t being followed, you can submit your question or complaint to the No Surprises Help Desk.
On this page:
You can submit a complaint with us
What to expect
What you need
What happens next
Submit a complaint
You can submit a complaint with us
What to expect
Your complaint will go to the No Surprises Help Desk. The Help Desk can:
Review your complaint to make sure your health insurance company, health care provider, or health care facility followed surprise billing rules.
Investigate compliance with federal laws and policies under our jurisdiction.
Refer your complaint to another applicable federal or state enforcement authority, if necessary.
Call the Help Desk at 1-800-985-3059 to get help submitting your complaint or to find out your next steps. We can help you in English, Spanish and over 350 other languages.
Read our privacy policy (PDF) to learn how we use and protect your information.
What you need
Before you submit your complaint, gather any supporting documentation you have. The more information we have, the faster we’ll be able to process your complaint.
You don’t need to provide every document on this list. Include the documents that you have easy access to. If we need something else, we’ll let you know. Call us at 1-800- 985-3059 if you have any questions.
You can return to your submission and add additional documents later, if needed.
Make a digital copy or take a photo of any of the following documents that apply to your situation:
Provide these documents if possible:
Your medical bill
A photo of your health insurance card, if you used insurance
An explanation of benefits (if you got one)
You might also include, if available and relevant:
Your good faith estimate (if you got one)
A notice and consent form, signed and dated (if you got one)
Any correspondence you had with your provider
A notice of appeal decision(s)
Any evidence of coverage (like a summary plan or membership booklet)
You’ll be prompted to upload your documents when you fill out the complaint form online.
Before beginning, you can review the list of questions that will be asked.
Note: We reset this form after 15 minutes of inactivity to protect your data. Your answers will be deleted if the form closes.
What happens next
Write down your confirmation number.
If you provided your email address, you’ll get an email from noreply_nosurpriseshelpdesk@cms.hhs.gov. 
Keep this email for your records.
We’ll review your complaint or question and any documents you submitted. If we need more information, we’ll get in touch within 60 days using your preferred contact method.
Call the No Surprises Help Desk at 1-800-985-3059 to check on the status of your complaint or if you have any questions. Be sure to reference your confirmation number.
You can return to your submission to add additional documents. To do this, go to your existing complaint and enter your confirmation number.
Submit a complaint
You can submit a complaint online
If your insurance company or provider
```


## WRITER OVERRIDES FOR THIS RUN (binding, from the chart reviewer and this run's evidence decision)
- Evidence basis is `reported` (CMS pages read in full on 2026-11-28). No client, fleet or operator record was selected; do NOT cite any client, practice, fleet site, survey or "our testing". No TESTED label, no howWeTested, no claim of review by a clinician or attorney.
- Register: operator, with `teeup-exempt:` (regulatory guide; sentence 1 is the direct answer). Visible attribution once near the opening answer and again in Our Takeaway: "Based on CMS pages we read in full on November 28, 2026". The table is our synthesis of CMS text.
- CR-1: for planned non-emergency care use CMS wording ("protected from unexpected out-of-network bills" / "balance billing protections" at an in-network hospital, hospital outpatient department or ambulatory surgical center). Attribute "can't be charged any more than the in-network cost-sharing rate" to emergency care (hospital, providers, air ambulance provider) only. No dollar or cost-sharing formula for planned care, no deductible crediting, no claim collections must pause. Keep "in most cases" / "generally".
- CR-2: Help Desk "will get in touch within 60 days" only if it needs more information; call 1-800-985-3059 with the confirmation number for status. Specialists CMS lists are not allowed to ask for a notice and consent form; an in-network provider shortage also bars the form.
- CR-3: 10 states "as of November 15, 2021" with a check-current-state-law caveat; Medicare/Medicaid/VA/TRICARE/IHS row says only CMS's "already protect you from some unexpected out-of-network bills"; the collections FAQ says CMS pages do not address it and points to the Help Desk; never tell the reader to ignore, refuse to pay or tear up a bill; no individualized advice; asking the plan to review/fix the claim is a practical step, CMS says only the plan "might be able to fix billing errors".
- CR-5: disclaimer as the very last element only. Do not link the x.com posts or name their authors.
- Internal links: only the two approved outbound links above (/guides/how-to-deal-with-medical-debt, /guides/hsa-fsa-reimbursement-checklist) with the approved anchors, plus relatedLinks to real siblings.
