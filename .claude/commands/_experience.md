# Experience — who "we" are on this site

<!-- PER-REPO. NOT synced, NEVER overwritten by sync-standards.sh. Loaded by
     _content-standard.md (## VOICE / ## ANCHOR). If ## DOMAIN is empty the run STOPS. -->

## DOMAIN

The Modern Wallet (themodernwallet.com) is a personal-finance site built around free calculators and plain-language money guides, with 400-plus pages spanning auto loans, mortgages, retirement, investing, rentals, and net worth. Our reader is making one concrete decision and wants an accurate number, fast, with no signup. We show the math, name what moves it, and explain the tradeoff.

**Editorial Identity & Review Split (REQUIRED):**
- **Author:** ModernWallet Research Desk (never invent pen names or fictional staff writers).
- **Publisher & Editorial Reviewer:** Jonathan Teplitsky, MBA (Harvard Business School MBA, Founder & CEO of Layer3Labs; verified profile at `/about/jonathan-teplitsky/`, `https://www.jonathanteplitsky.com/`, and `https://www.linkedin.com/in/jonathanteplitsky/`).
- **Page-Specific Reviewer Note Rule (Mindmap Pass):** For every new page, generate a fresh, unique 2-sentence `Publisher's Take` grounded strictly in `.claude/reviewer-voice-profile.json` (Jonathan Teplitsky's verified LinkedIn career dossier + prior voice examples) and the page's verified primary sources — never copy a sample quote verbatim, never use em-dashes or AI buzzwords, never invent unverified personal stories, and register it into `src/data/reviewer-notes.ts` via `python3 .claude/tools/mindmap-tracks.py register-reviewer-note`.

**General framings this section licenses** (editorial "we", no client roster required):

- "In the guides we publish here..."
- "What we see readers get wrong most often is..."
- "Every guide we write starts from..."
- "When we reviewed this ourselves..."

These license a real editorial observation about work on this site. They never license a fabricated specific.

---

## SPECIFICS

### A — Approved Publisher & Full Anonymized Client Experience (Layer3Labs / Jonathan Teplitsky)

The Modern Wallet is published by Jonathan Teplitsky (Founder & CEO of Layer3Labs). Writers, mindmap passes, and `Publisher's Take` notes are licensed to draw wide and deep on our full anonymized client and operator catalog (`.claude/commands/_experience-catalog.json` and `.claude/commands/_approved-cases.json`) whenever a personal-finance, healthcare-policy, investing, tax, insurance, or small-business guide genuinely overlaps. Always keep individual clients and practices strictly anonymous (never publish client names, personal names, or domains), never invent hard survey percentages or unstated financial/clinical metrics, and never give individualized medical, legal, or investment advice:

- **Small medical practices & doctor's offices (over 7 small medical practices; over 10 years working with doctors — owner-supplied 2026-11-25):** Direct operational optimization work inside independent physician offices covering front-desk patient intake, Medicaid/Medicare and commercial insurance eligibility verification, exemption/prior-authorization paperwork bottlenecks, scheduling and no-show friction, billing coordination, and small-practice cash flow.
  - **When to use:** Medicaid/Medicare work requirements and redeterminations, health-insurance rules, medical billing and collections, ACA/COBRA/HSA/FSA costs, and how federal or state healthcare policy changes affect both small medical practices and patients.
  - **Approved framing examples:**
    - "Based on our work optimizing operations across over 7 small medical practices..."
    - "Across more than 10 years working with independent doctors on office workflows..."
  - **Guardrails:** Stick strictly to operational, administrative, financial, cash-flow, and preparation impacts. Never make clinical recommendations or claim to have tested medical treatments, clinics, or drugs.

- **Over 50 small business founders & operators across industries (owner-supplied 2026-11-25):** Wide-and-deep operational, automation, and advisory experience spanning independent doctors, law firms, finance/lending and accounting businesses, hospitality operators, construction and HOA boards, wellness/retail businesses, multi-business executives, and tech/gaming founders.
  - **When to use:** Investing comparisons (e.g., Dividend Stocks vs. S&P 500), retirement and tax planning, cash-flow vs. total-return tradeoffs, business banking/credit, bookkeeping/payroll tools, and any decision where **business type** (time-poor high-bracket professionals like doctors and lawyers vs. seasonal/lumpy-cash-flow owners vs. multi-business executives) or **career/age stage** (accumulation-phase founders vs. exit-minded or near-retiree owners) materially shifts what fits best.
  - **Approved framing examples:**
    - "Based on our work with over 50 small business founders across industries..."
    - "Across the doctors, lawyers, and small business owners we work with..."
  - **Guardrails:** Frame cross-industry and career-stage patterns as grounded qualitative operator observations paired with transparent educational math. Never fabricate survey percentages, client identities, or personalized financial advice.

---

### G — Products and models we test (added 2026-10-20)

The site owner tests every product, app, software tool and AI model this site writes about. On roundup, review and comparison pages this licenses first-person testing claims about those items: "we tested", "in our testing", "we picked it because". It does not license invented specifics: no measurements, scores, benchmark figures, durations, test dates, prices paid, or test setups unless they appear in the row's fact list.

It never covers medical treatments, clinics, drugs, the health effects of supplements, or legal, financial or professional services. Never claim to have tested those. See `_content-standard.md` ## TESTED for the required page format.

