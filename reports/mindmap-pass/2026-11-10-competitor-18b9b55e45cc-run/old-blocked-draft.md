# Mindmap pass - competitor intake 18b9b55e45cc (2026-11-10) - BLOCKED DRAFT, NOT READY FOR APPROVAL

jobId: competitor-18b9b55e45cc | workflow runId (startup-issued): 2a3988ce248947ed8a48deb954ac99f7 | caller-supplied runId: a53f77c00582475388bfa8e6ac92ad6f | branch claude/blissful-franklin-tp5rhw | review profile: HIGH (max 3 audits)

evidenceFiles:
- reports/competitor-monitor/intakes/18b9b55e45ccb60c43b868b5825bc0008f192b06daa118dfb508fd17b0b2f9a1.json (sha256 18b9b55e45ccb60c43b868b5825bc0008f192b06daa118dfb508fd17b0b2f9a1)

Status: this is an UNREVIEWED coverage-scan draft. No preparation PASS, no independent chart review, no content generated, nothing published. Blockers: (1) `python3 scripts/lib/content_gen.py preflight` fails, no model key (CONTENT_ANTHROPIC_KEY, GEMINI_API_KEY, OPENAI_API_KEY) in this cloud environment, and the contract forbids the agent from writing the pages itself; (2) this worker has no tool to spawn the distinct independent reviewer required for chart review and Phase 4.

Existing related pages (from src/data scan): /guides/how-to-choose-a-financial-advisor/, /guides/financial-advisor-worth-it/, /compare/financial-advisor-vs-financial-planner/, /compare/financial-advisor-vs-wealth-manager/, /compare/financial-advisor-vs-cpa/, /compare/flat-fee-vs-aum-based-financial-advisors/, /compare/betterment-vs-wealthfront/, /best-robo-advisors (roundups.ts). Nothing exists on: switching advisors, Form ADV walkthrough, RIA explainer, first advisor meeting, financial therapist, LGBTQ-supportive advisor.

## Proposed candidate dispositions (proposals only, pending independent review)

| # | Candidate URL | Proposed decision | Existing home / proposed target | Reason |
|---|---|---|---|---|
| 1 | nerdwallet .../what-is-investment-management | skipped-duplicate | /compare/financial-advisor-vs-wealth-manager/ | Reader intent largely served; low added value |
| 2 | nerdwallet .../fee-only-vs-fee-based-planners | enrich (or skipped-duplicate) | /guides/how-to-choose-a-financial-advisor/ and /compare/flat-fee-vs-aum-based-financial-advisors/ | Fee-only vs fee-based already explained in the flat-fee/AUM comparison; check for a dedicated-intent gap |
| 3 | nerdwallet .../financial-advisor-vs-robo-advisor | create (/compare/financial-advisor-vs-robo-advisor) | adjacent: /guides/financial-advisor-worth-it/ (17 robo mentions), /best-robo-advisors | Dedicated head-to-head decision page absent; reviewer must confirm vs worth-it |
| 4 | nerdwallet .../change-financial-advisors | create (/guides/when-to-switch-financial-advisors) | none | No coverage |
| 5 | nerdwallet .../form-adv | create (/guides/how-to-read-form-adv) | /guides/how-to-choose-a-financial-advisor/ mentions it twice | Primary-source (SEC IAPD) walkthrough absent |
| 6 | nerdwallet .../how-financial-therapist-shift-your-money-mindset | skipped-low-value (candidate; therapy-adjacent, YMYL health overlap) | none | Needs exclusion decision |
| 7 | nerdwallet .../how-to-find-lgbtq-financial-advisor | skipped-low-value (candidate) | /guides/how-to-choose-a-financial-advisor/ | Narrow audience, no primary-source angle without sponsor/sourcing |
| 8 | nerdwallet .../registered-investment-advisor | create or skipped-duplicate | /compare/financial-advisor-vs-wealth-manager/, /guides/how-to-choose-a-financial-advisor/ | RIA covered inside other pages; dedicated explainer is a possible gap |
| 9 | nerdwallet .../what-i-learned-from-my-first-meeting-with-a-financial-advisor | skipped-low-value | none | First-person NerdWallet experience; not reproducible by us |
| 10 | nerdwallet .../aum-assets-under-management | skipped-duplicate | /compare/flat-fee-vs-aum-based-financial-advisors/ | AUM fee mechanics covered in depth |

candidateDispositions (JSON, proposals only; not a ready-for-approval chart):

```json
[
 {"candidate":"https://www.nerdwallet.com/financial-advisors/learn/what-is-investment-management","decision":"skipped-duplicate","reason":"intent served by wealth-manager comparison","target":"/compare/financial-advisor-vs-wealth-manager/"},
 {"candidate":"https://www.nerdwallet.com/financial-advisors/learn/fee-only-vs-fee-based-planners","decision":"skipped-duplicate","reason":"fee-only vs fee-based covered in flat-fee vs AUM comparison","target":"/compare/flat-fee-vs-aum-based-financial-advisors/"},
 {"candidate":"https://www.nerdwallet.com/financial-advisors/learn/financial-advisor-vs-robo-advisor","decision":"create","reason":"no dedicated human-vs-robo decision page","target":"/compare/financial-advisor-vs-robo-advisor"},
 {"candidate":"https://www.nerdwallet.com/financial-advisors/learn/change-financial-advisors","decision":"create","reason":"no switching-advisor coverage","target":"/guides/when-to-switch-financial-advisors"},
 {"candidate":"https://www.nerdwallet.com/financial-advisors/learn/form-adv","decision":"create","reason":"no Form ADV walkthrough","target":"/guides/how-to-read-form-adv"},
 {"candidate":"https://www.nerdwallet.com/financial-advisors/learn/how-financial-therapist-shift-your-money-mindset","decision":"skipped-low-value","reason":"therapy-adjacent, no primary-source angle"},
 {"candidate":"https://www.nerdwallet.com/financial-advisors/learn/how-to-find-lgbtq-financial-advisor","decision":"skipped-low-value","reason":"narrow audience, no sourced angle"},
 {"candidate":"https://www.nerdwallet.com/financial-advisors/learn/registered-investment-advisor","decision":"skipped-duplicate","reason":"RIA fiduciary duty covered in existing advisor guides","target":"/guides/how-to-choose-a-financial-advisor/"},
 {"candidate":"https://www.nerdwallet.com/financial-advisors/learn/what-i-learned-from-my-first-meeting-with-a-financial-advisor","decision":"skipped-low-value","reason":"first-person experience piece"},
 {"candidate":"https://www.nerdwallet.com/financial-advisors/learn/aum-assets-under-management","decision":"skipped-duplicate","reason":"AUM fees covered in depth","target":"/compare/flat-fee-vs-aum-based-financial-advisors/"}
]
```
