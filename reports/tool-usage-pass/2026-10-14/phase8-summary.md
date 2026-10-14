# Phase 8 — Summary (tool-usage pass 2026-10-14, themodernwallet.com)

## Duplicate check
passed — 3 new-page rows checked, 3 matched an existing page (none with the same reader goal; adversarial reviewer GATE: PASS after 1 wording correction).

| Phase | Rows | Outcome |
|---|---|---|
| 1 — Cannibalization detection (advisory) | 3 | 3 pairs flagged (new calculator vs existing article/FAQ on the same topic), all "differentiate + link both ways"; 0 edits, no canonical or 301 written |
| 2 — Metadata | 0 | skipped — no rows (tool-fix guardrail: no title/meta/H1 changes) |
| 3 — New content | 3 | Built /hysa-vs-cd-calculator/ (984 words), /trump-account-vs-529-calculator/ (1,132), /mortgage-recast-calculator/ (896); prose via content_gen.py, model claude-opus-5-5 on the second Anthropic key in the pool (first key out of credit), no model fallback |
| 4 — Audit | 3 pages + 13 code rows | Round 1 FAIL on rows 5, 10, 13, 14, 15 (one YMYL factual error on the Trump vs 529 page, a missed hub date bump, sentence-level tells); all fixed via content_gen.py fix + mechanical edits; round 2 verdict in audit.md. depth: n/a for calculator entries (sibling-calculator depth; 3/3 above the 600-word generator floor, median 984) |
| 5 — Body text | 13 | 7 `tool fix` rows (mortgage APR decimal + existing-loan mode; retirement today's-dollars total; HYSA after-tax interest; mileage employee/Topic 511 note; 60/40 over/under line; decimal-safe inputs on 15 more calculators) and 6 `tool monetize` rows (book picks in mortgage, retirement, HYSA, mileage, 60/40, Trump Account) |
| 6 — Internal linking | 3 new + inbound | Cross-link lists for the 3 new tools; next-step links from /investing/high-yield-savings-calculator/ (and /cd-calculator/ list), /trump-account/ (new list), /mortgage/payoff-calculator/ + /mortgage/early-payoff-calculator/ (one sentence each); homepage header untouched |
| 7 — Sitemap + IndexNow prep | — | 3 routes in the @astrojs/sitemap output (the site's sitemap carries no lastmod for any page); IndexNow list of 12 URLs prepared for post-deploy submission |

## Question coverage
- /hysa-vs-cd-calculator/ — asked "Is it better to put my money in a CD or a high-yield savings account?" [PAA 3/6 which-earns-more; ac 1/1] → answered in section 1 (intro above the tool)
- /trump-account-vs-529-calculator/ — asked "Can you have both a Trump Account and a 529, and which should get this year's money?" [PAA 1/6 both-accounts; 2/6 529-amount; 3/6 off-topic] → answered in section 1
- /mortgage-recast-calculator/ — asked "How much will my payment drop if I recast my mortgage?" [PAA 2/6; ac 1/1] → answered in section 1
- Tool-fix rows 1–6 and 16: usage-backed (persona walkthroughs), not search-backed.
- Counts: 3 of 3 new pages PAA-backed; 1 row (Trump vs 529) flagged with half off-topic PAA; row 16 verb-only (bug fix).

## Emerging search patterns actioned
- cluster "HYSA vs CD (personal answer)" → create new content → [calculator] → /hysa-vs-cd-calculator/ (built)
- cluster "Trump Account vs 529" → create new content → [calculator] → /trump-account-vs-529-calculator/ (built)
- cluster "Mortgage recast" → create new content → [calculator] → /mortgage-recast-calculator/ (built)
- cluster "Existing-loan payoff" → update existing body text → AutoLoanCalculator.tsx on /mortgage/payoff-calculator/ (done)

## Next in line (specs, 3-new-tools cap)
- /biweekly-mortgage-calculator/ (1,900/mo) — reports/mindmap-pass/specs/biweekly-mortgage-calculator-spec.md
- /pay-off-mortgage-or-invest-calculator/ (260/mo) — reports/mindmap-pass/specs/pay-off-mortgage-or-invest-calculator-spec.md

## Noteworthy
- Site-wide bug: 16 calculators turned a typed decimal rate into a whole number (6.875% → 6875%; 6.5% → 65%). All fixed; a sweep of every top-level calculator on the build now passes. One dollar field on /tax-resolution/ still drops cents (not a rate field) — left for next run.
- Row 16 was added mid-run after the sweep; chart gate re-run, audited in round 2.
- Keyword data: volume=dataforseo, kd=dataforseo (ahrefs/semrush: no keys); estimate (autocomplete) rows labelled.
- No GSC access in this cloud run (personas built from page H1/title + live walkthroughs).
- Branch state: all work staged on claude/affectionate-gates-5utu03; deploy to main via deploy-run-to-main.sh.
