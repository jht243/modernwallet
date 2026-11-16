# WRITE report, job 2026-11-16-comparison, run d1389d3fc206449abad48c48a5fd46ff (actor mindmap-write)

## Records per new page
| Route | register | page type | medium | basis | body words (intro+verdict+sections+FAQ) | teeup / anchor |
|---|---|---|---|---|---|---|
| /compare/quickbooks-vs-freshbooks | operator | comparison | text + comparison table | calculated (internal cost modeling) | 1975 | teeup-exempt: attribution sentence is paragraph 2; anchor = original 49-cell price grid |
| /compare/annuity-vs-401k | operator | comparison | text + comparison table | reported (IRS, Investor.gov) | 1927 | teeup-exempt; anchor-exempt: source-only, no honest proprietary case or number |
| /compare/chase-freedom-flex-vs-unlimited | operator | comparison | text + comparison table | calculated (internal cost modeling) | 2233 | teeup-exempt: anchor = 12.5% rule and $48,000 ceiling |

## Writer model
content_gen preflight: claude-opus-5-5 unusable (both Anthropic keys: HTTP 400 credit balance too low). All three pages written by FALLBACK gpt-6-sol (meta.guards shows fallback_used). Humanize step skipped (content_gen-generated pages are exempt).

## Guardrails applied
- G-1: new versioned script research/calc/flex_vs_unlimited_v2.py + .out.json (12.5% rule, $48,000 ceiling, $60,000 case), copied/executed as evidence/chase-freedom-flex-vs-unlimited/model.py + output.json before the packet; packet validates PASS.
- G-2: A1 packet/page say 49 combinations; A2 sources include IRS tc558 and IRS 401(k) plans page.
- G-3: A2 has no 401(k) fee, RMD age or catch-up dollar figures; early-withdrawal text follows tc558 for both sides.
- QuickBooks facts limited to list prices/user caps (labelled list price, checked 2026-11-16, linked quickbooks.intuit.com/pricing); no Chase Unlimited foreign transaction fee claim; no TESTED language; "internal cost modeling" attribution.

## Mechanical repairs (Rung 0), no regeneration
- content_gen `--schema comparison` inserted empty placeholder keys (metaTitle, subtitle, optionAName, optionBName, ctaTitle, ctaText, ctaButton, faqItems, relatedLinks) that this repo's ComparisonEntry does not use; removed before splicing.
- A3: three "###" subheadings (not rendered by richBody) split into separate sections; all "**" bold markers removed (A3). A1: one semicolon joining clauses changed to a period. A2: title/h1 set to the approved title "Annuity vs 401(k): They Solve Different Retirement Problems" (59 chars).
- content_gen claim check rewrote the first-"we" attribution sentences (see meta.guards.claim_check).

## Files changed
- src/data/comparisons.ts (3 new entries after ...BENEFIT_COMPARISONS, updated 2026-11-16; link edits in pension-vs-401k, iul-vs-401k, pension-vs-annuity)
- src/data/alternatives.json, src/data/roundups-self-employed.ts (2 entries), src/data/roundups.ts, src/data/guides.ts (2 guides): link-only, `updated` dates NOT bumped
- Evidence/prompts/drafts under reports/mindmap-pass/runs/2026-11-16-comparison/{evidence,prompts,drafts,research/calc,research/inputs,audit}

## Capture
- batch-1 (8 routes): audit/batch-1/preview-snapshot.json, snapshotSha256 d098ac1ee9debdca0df27b595148129ba33485e7d42527a13508db1e0b2c1763, manifest audit/batch-1/capture-manifest.json
- batch-2 (4 routes): audit/batch-2/preview-snapshot.json, snapshotSha256 e6d561d7d8bfd1a69094051f5a2e60ccd5bf6776c6f25a4fa76fd77de7a34e1a, manifest audit/batch-2/capture-manifest.json
- All 12 routes HTTP 200, no capture failures; check-write-scope PASS; node scripts/check_data_files.mjs OK on the 4 edited .ts files; astro build OK.

## Open items for MAIN / AUDIT
1. BLOCKER-LEVEL MECHANICAL: the approved plan edits src/data/alternatives.json (inbound link on /alternatives/quickbooks), but manifest newPageBriefs[0].evidenceFiles[9] hashes that file (543061f2...). validate-chart and validate-analysis now return "Changed artifact: src/data/alternatives.json". Byte-identical pre-edit copy: research/inputs/alternatives.pre-edit.json (same sha256); the A1 packet already points to it. MAIN should run rebind-mechanical (or swap that evidence reference) and re-run validate-chart before AUDIT.
2. Snapshots come from `astro build` capture; the render-time entity linker (QuickBooks, FreshBooks, Chase Freedom Unlimited, Chase Travel via data/entity-links.json) is not applied in them, so first-mention links for those names are absent in the snapshot HTML. Pages hand-link all other sources (IRS, Investor.gov, Chase Freedom Flex).
3. Inherited statement outside scope: /roundup/best-cash-back-credit-cards says Chase Freedom Unlimited "charges a foreign transaction fee"; the Unlimited capture lists "No Foreign Transaction Fee" as a filter. The new A3 page makes no claim about Unlimited's fee. Not edited (outside link-only scope); auditor may judge it.
