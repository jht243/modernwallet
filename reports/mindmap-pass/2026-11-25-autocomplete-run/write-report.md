# WRITE report: autocomplete-2026-11-25 (run 2b5434147b1b47e3ae3ff2c06513e30f)

Actor: mindmap-write. Preflight: 29 parts read, check PASS, standards ledger receipt recorded.
Writer model: gemini-3.8-flash via content_gen.py for ALL prose (fallback_used=true on every .meta.json). Claude (claude-opus-5-5) was unusable: both CONTENT_ANTHROPIC_KEY and _KEY_2 returned "credit balance is too low".

## Routes
New: /debt-payoff-calculator/ (A1, tool + prose), /guides/compound-interest-formula-excel-google-sheets/ (A3), /guides/property-tax-by-state-mortgage-payment/ (A4).
Enriched: /retirement/401k-calculator/ (A5: new section 2 "What Happens If You Stop Contributing" + 2 FAQs, updated bumped to 2026-11-25).
Link edits (updated dates preserved): /credit-card-payoff/, /compare/debt-snowball-vs-avalanche/, /investing/compound-interest-calculator/, /guides/retirement-calculator-spreadsheet-template/, /mortgage/affordability-calculator/.
/mortgage/piti-calculator/: link edit plus factual correction of the inherited "over 2.1% in New Jersey" (now "about 1.9% in New Jersey and Illinois", Tax Foundation 1.88%) in howItWorks and the "Does PITI vary by state?" FAQ; updated bumped to 2026-11-25.
Pruned A2 /retirement/401k-paycheck-calculator/ not touched.

## Code
src/lib/debt-payoff.ts (engine), src/components/DebtPayoffCalculator.tsx (island, data-tool via hub template), CalculatorIsland.tsx + registry.ts wiring, cross-links.ts entry, scripts/test-debt-payoff.mjs (57 checks replaying the Python model fixtures).

## Guardrails
CR2: every state cell = effective rate x $400,000 / 12 from the saved Tax Foundation table, range about $97 to $627, no "over $700", DC separate, county range 0.93% to 2.47% stated, PITI NJ wording fixed.
CR3: A1 links /debt-consolidation-calculator/ with a distinguishing sentence; page leads with the three-strategy result.
CR5: no claim that the covered completions are answered; no drawdown section, no catch-up/increasing contributions in A5.
CR7: Google Sheets FV help page saved verbatim (research/sources/google-sheets-fv-function.txt) and linked at first mention; same-frequency condition stated in the opening answer and takeaway; every formula output verified in evidence/<slug>/model.py + output.json.
A3 note: the Google page does not state the sign convention, so the sign rule is attributed to Microsoft only.

## Evidence
evidence/<slug>/{evidence.json,model.py,output.json,growth.json,cases.json} for debt-payoff-calculator, compound-interest-formula-excel-google-sheets, property-tax-by-state-mortgage-payment, 401k-calculator. validate-analysis PASS on all four. No client cases applied (cases.json matched only on stopwords).

## Mechanical gates
precheck-drafts PASS, check-write-scope PASS (10 routes, 0 violations), scripts/check_data_files.mjs exit 0, npm build (via capture-local --build) passes incl. bundle-size gate, SSR smoke render of the island OK on default, single-debt and empty inputs.

## Known notes for AUDIT
- Drafts were hand-corrected only by deletion or one-sentence replacement of unsupported/incorrect sentences (details: removed unsourced general claims, fixed ACS "5-year" wording, Tax Foundation attribution, Google source URL/link, "exact" overclaim). Raw drafts kept beside the .meta.json files in drafts/ (*.precheck = pre-claim-check).
- Markdown `**` and backticks were stripped and list/table blocks normalised because this site's richBody renderer does not support them.
- content_gen numbers flagged as not in fact list (A1: 1460.6 = 4783.63-3323.03, 715 = 515+200; A3: 0.004167, 197.7, 24000, 5.0945; A4: 300000 only in the claim-check removed example) are arithmetic derivations of listed facts.
- mindmap-gates.py prepare-write-packets needs Python 3.12+ (mindmap-tracks.py f-string); ran with python3.13.
- Snapshot v1 (preview-snapshot.json) is superseded by v2 after a list-rendering fix; use v2.
