# Content records - 2026-10-07 run

standard-loaded: receipt in `reports/standards-ledger.jsonl` (routine=competitor-monitor-auto, phase=phase-3).

Three guides in `guides.ts`, text->text, operator register, explainer (floor 1,200 words), generated with `scripts/lib/content_gen.py write` on the PRIMARY model `gemini-3.8-flash`, no fallback fired. `.meta.json` beside each draft (first drafts kept in `drafts/v1/`).

| Slug | Body words |
|---|---|
| pay-for-delete-letters-explained | ~1,600 |
| how-to-build-credit-fast | ~1,900 |
| installment-loans-vs-revolving-credit | ~1,500 |

Audit: first drafts were rejected for invented first-person claims, scoring-model versions and contract/deadline claims not on the closed fact list, banned words and prose step sequences; regenerated once with a corrections block. Mechanical lint clean. One in-place number fix ("30 to 60 days" -> "one to two billing cycles") in the credit-fast FAQ. No separate reviewer agent was run. Tools: none built (guides only). Intro humanize skipped (pages generated end-to-end via content_gen).
