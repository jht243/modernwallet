# Run notes — tool-usage-mindmap-auto 2026-11-04 (runId 46b88ec9126142f294163c78dfd74e8c)

Authorization: scheduled /tool-usage-mindmap-auto routine (owner-authorized unattended end-to-end publishing); Phase 0 manifest treated as approved per STEP 5.

## Page records (C1/C2)
- /biweekly-mortgage-calculator/ — medium: interactive tool → interactive tool; register: operator; page type: calculator page (explainer row label; depth compared with /mortgage-recast-calculator/ by the Phase 4 auditor).
  teeup-exempt: calculator page; paragraph one answers and then says what the tool returns, and the operator voice is carried by the "At ModernWallet, we ran that loan three ways in an internal calculation" attribution in paragraph two (same layout as /mortgage-recast-calculator/). No forced tee-up sentence added.
- /pay-off-mortgage-or-invest-calculator/ — medium: interactive tool → interactive tool; register: operator; page type: calculator page.
  teeup-exempt: calculator page; paragraph one gives the rule and says what the tool returns, and the operator voice is carried by the "In our internal calculation, we followed the same $300 a month both ways" attribution in paragraph two.
- anchor: our internal calculation (evidence/<slug>/evidence.json, basis calculated) on both pages.

## Phase 4 round 1 → fixes applied
- New pages: content_gen fix round 1 on both drafts (30-year condition in sentence 1; servicer condition stated with its result; two FAQ dead ends routed).
- Tool copy: three semicolons replaced (biweekly hint, inflation hint, stock 0% sub-line); probate unlinked "Check your state's limit" directive removed; "this page's estimate" reworded; unsourced Texas "Many family executors waive it" removed; "Head of hh" aria-label now contains the visible text.
- Dates: dataannotation-taxes and youtube-taxes spokes bumped to 2026-11-04 (they render the changed self-employment component).
- Inherited contradictions on affected pages: /mortgage/extra-payment-calculator/ FAQ "four to five years" replaced with the calculated 70 months at 6.5% (fewer at lower rates); its dead CFPB Ask citation replaced with the live CFPB mortgage key-terms page (bi-weekly payment entry, checked 2026-11-04); /self-employment-tax/how-much-to-set-aside-for-taxes/ "applies from the very first dollar of profit" corrected to the Schedule SE $400 threshold; /elder-care/long-term-care-cost-calculator/ worked-example shortfall $360,000 corrected to its own arithmetic (about $338,000 at year-one prices; about $374,000 with rising costs).
- Noindex routes (site policy NOINDEX_PILLARS: elder-care and probate spokes): reviewed from hydrated DOM; excluded from rendered-audit.py capture (helper refuses noindex) and from IndexNow.

## Content generation
Model: claude-opus-5-5 for both pages and fix rounds (no fallback). CONTENT_ANTHROPIC_KEY (key 1) returned "credit balance too low"; the pool's second key served every call.
