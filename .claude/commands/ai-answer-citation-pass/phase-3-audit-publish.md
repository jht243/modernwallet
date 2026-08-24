# Phase 4 — Audit, then publish (nothing ships unaudited)

Two review stages on EVERY change, then ledgers → commit → deploy → verify → IndexNow → email. A change that fails review is reverted and logged DROPPED; a partial batch still ships.

## 1. Adversarial audit (Stage 4)
Run `.claude/commands/seo-gsc-pass/phase-4-audit.md` **if present** (else an equivalent inline adversarial review: a reviewer that did not write the content tries to find thin/wrong/duplicate/AI-sounding prose and rejects on any hit) against every rewritten section, appended section, tool's on-page copy, and metadata rewrite. Remember the hard fails: unlinked first mention of an entity not covered by the auto-link registry; byline in body; filler openers.

## 2. Regression check (specific to REWRITES — this pass's extra duty)
The adversarial audit catches bad new prose; this check catches **good prose that lost something**. Per rewritten section, diff old vs new and verify:
- **No information regression:** every verifiable fact in the OLD section either survives, is corrected (brief-verified), or was itself unverifiable (dropping it is then correct — note it).
- **The section now delivers its heading's promise** (would score 2 on the Phase 2 rubric).
- **No collateral damage:** page-level diff shows NO change outside the prescribed sections/links/tool/metadata — heading set, section order, CTA placement, FAQ block all intact.
- **Internal links that lived in the old prose survive** (or moved to a better anchor in the same section).

Tools additionally pass a logic check (`downloadable-asset-pass/phase-4-audit.md` if present, else verify correct outputs on 3+ sample inputs, edge cases included, no console errors).

**Fail → one retry** (rewrite the rewrite against the auditor's objections). Fail again → `git checkout` that page's files (revert ONLY that page), log DROPPED ("failed audit"/"regression"), continue.

## 3. Ledger writes (before the commit, so they ship in it)
- `reports/ai-answer-citation-pass/ai-answer-citation-audits.md` — one row per page seen this run (drives cooldown + citation share):
  `| route | seen | top_query | bucket | we_cited | competitor_cited | action | audit |`
- `reports/ai-answer-citation-pass/defended-pages.json` — already rewritten + staged in Phase 1; confirm it is staged so it ships in this commit.
- `reports/trend-pass/ledger.md` (SHARED) — one row per answer-block rewrite: KEPT / DROPPED (+reason), tagged `source: ai-overview`.
- Run report `reports/ai-answer-citation-pass/<YYYY-MM-DD>.md` — the bucket roster, citation share, rewrites with dispositions.

## 4. Stale-base check → commit → deploy (concurrent-cron clobber hazard)
Radar crons commit to main mid-session. Stage by explicit path only, then:
```bash
git fetch origin && git status
git diff --cached HEAD --numstat   # NO deletions you didn't make
```
Any staged deletion of an untouched file = stale base — fix before committing. Single commit:
`ai-answer-citation-pass <date>: S answer-block rewrites across P STEAL pages, defend-ledger refreshed (D defended)`
Deploy: **if** `.claude/scripts/deploy-run-to-main.sh` exists, `.claude/scripts/deploy-run-to-main.sh push`; **otherwise** `git fetch origin main && git rebase origin/main && git push origin HEAD:main`. Main is the authorized deploy path; 3 rebased retries, then push the ephemeral branch + email a manual-merge note; never force-push.

## 5. Verify 200s + IndexNow
After the deploy settles, `curl -s -o /dev/null -w "%{http_code}"` every treated URL — an edited page that no longer 200s is a **rollback** (revert that page, re-push), not a skip. Then submit changed URLs to IndexNow (fallback-key block in the launcher). Non-200 on something this run didn't touch → digest + skip from IndexNow, don't roll back the run.

## 6. Digest
Assemble `/tmp/ai-answer-citation-pass-<YYYY-MM-DD>.md` per the launcher's exact headings (citation scoreboard, defended, stolen-back, absent, citations lost, defend-ledger deltas, skipped, audit, IndexNow) and send via `.claude/scripts/send-routine-email.py --skill ai-answer-citation-pass-auto`. Voice standard applies. Always send — success, no-changes, or failure.


## Content standard — audit gates

**Load `.claude/commands/_content-standard.md` and apply its `## AUDITOR` section in full.** It is the single source of truth for the content gates: register and voice, tee-up, experience truth, required page elements, the proprietary anchor, neutrality, depth floors, first-mention links, and the medium record.

**Also load `.claude/commands/_experience.md`** — every first-person experience claim on the page must be traceable to it. Anything it does not license is an invented claim and fails.

**Also load `.claude/commands/_anti-ai-language.md`** and apply its **AUDITOR** section in full. It outranks the content standard on any conflict.

If any of those three files is missing, **FAIL the run and report it** — never substitute your own gates. If `.claude/commands/_content-standard.local.md` exists in this repo, its sections override the same-named sections of the standard.

