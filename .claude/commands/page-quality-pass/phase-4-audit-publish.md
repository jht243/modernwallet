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
- `reports/page-quality-pass/page-quality-audits.md` — one row per treated page WITH its pre-edit metrics (the feedback loop's baseline):
  `| route | treated | window | sessions | avg_eng_s | eng_rate | bounce | scrolled_pct | diagnosis | actions | audit |`
- `reports/trend-pass/ledger.md` (SHARED) — one row per action: KEPT / DROPPED (+reason), tagged `source: page-quality`.
- Run report `reports/page-quality-pass/<YYYY-MM-DD>.md` — engagement table, diagnosis roster, prescriptions with dispositions, improvement report.

## 4. Stale-base check → commit → deploy (concurrent-cron clobber hazard)
Radar crons commit to main mid-session. Stage by explicit path only, then:
```bash
git fetch origin && git status
git diff --cached HEAD --numstat   # NO deletions you didn't make
```
Any staged deletion of an untouched file = stale base — fix before committing. Single commit:
`page-quality-pass <date>: R section rewrites, A appends, L link-adds, T tools, M metadata across P treated pages`
Deploy per the launcher's Git model: `git fetch origin main && git rebase origin/main && git push origin HEAD:main` (main is the authorized nightly deploy path; 3 rebased retries, then push the ephemeral branch + email a manual-merge note; never force-push).

## 5. Verify 200s + IndexNow
After the deploy settles, `curl -s -o /dev/null -w "%{http_code}"` every treated URL — an edited page that no longer 200s is a **rollback** (revert that page, re-push), not a skip. Then submit changed URLs to IndexNow (fallback-key block in the launcher). Non-200 on something this run didn't touch → digest + skip from IndexNow, don't roll back the run.

## 6. Digest
Assemble `/tmp/page-quality-pass-<YYYY-MM-DD>.md` per the launcher's exact headings (diagnoses & treatments, per-type sections, improvement report, skipped, ledger deltas, audit, IndexNow) and send via `.claude/scripts/send-routine-email.py --skill page-quality-pass-auto`. Voice standard applies. Always send — success, no-changes, or failure.

## Content standard — audit gates

**Load `.claude/commands/_content-standard.md` and apply its `## AUDITOR` section in full.** It is the single source of truth for the content gates: register and voice, tee-up, experience truth, required page elements, byline-in-body, the proprietary anchor, neutrality, disclaimer placement, depth floors, first-mention links, and the row records.

**Also load `.claude/commands/_experience.md`** — every first-person experience claim on a page must be traceable to it; anything it does not license is an invented claim and fails.

**Also load `.claude/commands/_anti-ai-language.md`** and apply its **AUDITOR** section in full, including the meaning bar. It outranks the content standard on any conflict.

If any of those files is missing, FAIL the run and report it — never substitute your own gates.

---

## Remediation — how a finding gets fixed (MANDATORY)

**Load `.claude/commands/_remediation-ladder.md` and apply it IN FULL.** It is the single source of truth for what happens AFTER a gate fails: Rung 0 mechanical lint (never a rework attempt), Rung 1 FIX-IN-PLACE with the reviewer supplying the exact replacement text, Rung 2 REWORK by the writer for that page only — max 2 attempts **per page**, then drop that page and continue the run. It also defines per-page pass state: a page that passed is never re-audited because a sibling was fixed. It changes only the COST of fixing a finding, never the bar for passing one — every gate above applies exactly as written. If the file is missing, FAIL the run and report it; never improvise a remediation policy.

**This section supersedes any other retry, rework, or escalation wording in this file.** Where this file already reverts or drops a single page rather than stopping the run, that behaviour is correct and the ladder keeps it; what the ladder adds is the two cheaper rungs BEFORE a rework — the mechanical lint, and the reviewer-supplied fix applied without a writer round-trip.
