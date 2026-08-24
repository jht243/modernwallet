# Phase 3/4 content records — 2026-08-24 run

standard-loaded: cs=bb0024c6 aa=d1166759 exp=31d70e56 domain="The Modern Wallet (themodernwallet.com) is a"

(Hashes recomputed directly against the files on disk at audit time via
`shasum -a 256 .claude/commands/_content-standard.md|_anti-ai-language.md|_experience.md | cut -c1-8`
— confirmed to match. This receipt covers all 6 pages below; each was written against
the same three canonical files in the same run.)

| Slug | File | medium | register | page type | body words (post-fix) | floor |
|---|---|---|---|---|---|---|
| ordinary-income-vs-capital-gains-tax | comparisons.ts | text → text | operator | comparison | ~2,265 | 1,500 |
| w-4-withholding-allowances | guides.ts | text → text | operator | explainer | ~2,025 | 1,200 |
| what-is-a-ctfa | guides.ts | text → text | operator | explainer | ~2,140 | 1,200 |
| average-hsa-balance-by-age | guides.ts | text → text | operator | explainer | ~1,745 | 1,200 |
| college-savings-by-age | guides.ts | text → text | operator | explainer | ~1,790 | 1,200 |
| how-much-should-i-spend-on-rent | guides.ts | text → text | operator | explainer | ~1,740 | 1,200 |

All 6 pages cleared their depth floor with substantial margin (+45% to +79%) both
before and after the Phase 4 rework below.

## Phase 4 audit — findings and fixes (rework round 1)

A read-only Explore-agent audit (Agent tool, `subagent_type: Explore`) ran against all 6
pages per `.claude/commands/competitor-monitor/phase-4-audit.md` +
`comparison-content-creator/phase-4-audit.md` + `_content-standard.md` `## AUDITOR` +
`_anti-ai-language.md` `## AUDITOR`. Findings and fixes, by page:

- **ordinary-income-vs-capital-gains-tax**: unlinked first mention of "Internal Revenue
  Service (IRS)" → linked at first occurrence (Publication 525), second mention
  de-linked. Monotone 10-sentence run in the 2026-rates section → split two long
  sentences into shorter ones. SEO title lengthened from 43 to 53 chars.
- **w-4-withholding-allowances**: metaDescription tricolon → cut to one clause.
  "significant" (banned filler adjective) → "a large amount of", 2 occurrences.
- **what-is-a-ctfa**: **factual self-contradiction** — title/H1/metaDescription said
  "Certified Trust and *Financial* Advisor" (the pre-2020 name) while the body and FAQ
  correctly explain ABA renamed it to "Certified Trust and *Fiduciary* Advisor" in 2020.
  Fixed title/H1/metaDescription/cardBlurb to the current post-2020 name so the page no
  longer contradicts itself. metaDescription and cardBlurb tricolons cut to one clause each.
- **average-hsa-balance-by-age**: metaDescription and cardBlurb tricolons → cut to one
  clause each.
- **college-savings-by-age**: cardBlurb tricolon → cut to one clause. "unlock" (banned
  hype verb) → "find".
- **how-much-should-i-spend-on-rent**: two "X, not Y" compressed-antithesis sentences →
  rewritten as plain declaratives. metaDescription tricolon → cut to one clause.

Arithmetic in all 5 worked numeric examples (W-4 paycheck math, capital-gains bracket
stacking, HSA compound-growth example, college-savings 20/50/80/100 milestones, rent
28/36 math) was independently hand-verified by the auditor and found fully correct — no
numeric errors, no fabricated statistics. All internal links/routes verified to resolve
to real, existing site content. No competitor named on any page; no competitor HTML
committed to the repo.

Rework round 1 addressed every hard-fail gate the auditor raised. No page required a
second rework round or `draft: true` escalation.
