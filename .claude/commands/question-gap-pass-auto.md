---
description: AUTONOMOUS variant of /question-gap-pass. NO human gates. For the top GSC-traffic pages, generates follow-up questions → scores coverage → dedups vs the site → enriches pages in place with high-value missing sections. Auto-approves the former Phase 3 Gap Chart gate by deterministic rules. Sends an email via Resend on completion. Designed for scheduled cloud runs.
argument-hint: "[optional N = how many top pages to analyze; default 20]"
---

# /question-gap-pass-auto — fully autonomous follow-up-question coverage gaps (cron-safe)


> **‼️ PIN THE DEPLOY BASE FIRST — before Phase 0 and before ANY commit.** Run this once, now:
> ```
> .claude/scripts/deploy-run-to-main.sh mark
> ```
> It records the branch tip you inherited so that, at deploy time, ONLY the commits THIS run adds are
> replayed onto `main` — even if the branch already carried another routine's commits (a shared/stale
> `worktree-agent-*` branch). The deploy step below calls `.claude/scripts/deploy-run-to-main.sh push`,
> which replays `RUN_BASE..HEAD` onto the latest `origin/main` and, on a genuine conflict, aborts (never
> force-pushes `main`) so you fall back to pushing the ephemeral branch + emailing a manual-merge note.
> Skipping `mark` reintroduces the 2026-07-20 comparison-content-auto failure (30+ spurious conflicts).
> **‼️ RUN-WIDE RULE — READ FIRST.** This is the cloud-cron variant of `/question-gap-pass`. It is **identical** to that skill except for **one** behavioral change: the Phase 3 human gate (approve the Gap Chart) is replaced with deterministic auto-approval logic. There is **NO** human checkpoint anywhere. You **MUST NOT** print "Want me to proceed?", "Approve the chart?", or any question at any phase boundary. If a hard blocker fires, you **still finish** by sending an email report and exiting 0. The cloud routine has no human watching, so any blocking question silently kills it.

This is a thin orchestrator. It does **not** duplicate the phase instructions of `/question-gap-pass` — it reads and follows the exact phase files at `.claude/commands/question-gap-pass/phase-*.md`. Read them when you reach each phase. Do not paraphrase.

## Hard pre-flight checks (do these FIRST, before Phase 0)
If any check fails, **skip the run** and email a failure report explaining why. Do not commit, do not push.

1. **Working tree must be clean.** `git status --porcelain` non-empty → skip, email failure ("Working tree dirty — uncommitted changes would have been swept into the routine commit").
2. **Branch is committable; deploy target is `main`.** `git rev-parse --abbrev-ref HEAD`. Cloud routines run on an ephemeral `claude/*` branch — that is the expected case; commit there, then **deploy to `main`** per the Git model below. A local run on `main` is also fine. The ONLY abort is detached HEAD with no branch name. **Never abort merely because the branch isn't `main`.**
3. **Resend secrets (best-effort, NOT a gate).** Check `$RESEND_API_KEY` (env) or `.claude/routines.config` / `~/.claude/secrets.env`. If present, the end-of-run email sends. If absent, **DO NOT abort** — do the full work, push, print the report to stdout, skip the email only.

> **Git model (authorized deploy path = `main`).** This repo auto-deploys from `main`, so publishing this run's commit to `main` is the intended behavior and needs **no human approval**. Commit on the current ephemeral `claude/*` branch, then deploy: `.claude/scripts/deploy-run-to-main.sh push` (retry the rebase up to 3×; on an unresolved conflict, push the ephemeral branch and email a manual-merge note instead of force-pushing `main`). Do NOT open a PR, do NOT create an extra branch, do NOT `git checkout main`. Any `git reset`/`git checkout --` uses `HEAD`/the file, never `origin/main`. The delegated `phase-6-publish.md` says "if on a working branch, push that branch" — in this autonomous variant the push target is `main` per this model, not the ephemeral branch.

## Volume
**No cap on pages selection** beyond N (default 20, or `$ARGUMENTS`). But still **add only high-value missing sections** — the autonomy is in skipping the human approval, NOT in lowering the quality bar. Med/Low-value gaps are still skipped exactly as in the manual skill.

## Execution
Run the existing phases by reading their instruction files in order:

1. **Phase 0** — `.claude/commands/question-gap-pass/phase-0-discover.md`. On any hard blocker (no content system / no GSC source and no `--pages` / unsafe tree) → email failure with the blocker reason, exit 0.
2. **Phase 1** — `phase-1-select-pages.md` — select top N by GSC clicks, map URL→file.
3. **Phase 2** — `phase-2-questions.md` — generate follow-up questions (FREE, local).
4. **Phase 3** — `phase-3-coverage.md` — coverage scoring + cross-page dedup + Gap Chart. **Do NOT stop at the gate** — apply the auto-approval rule below instead.
   - If, across all pages, the chart yields **0 `Add` + 0 `Strengthen` + 0 `Link`** actions → email a **Success Without Changes** report ("All top pages already answer their high-value follow-ups; nothing to enrich"), exit 0.
5. **Phase 4** — `phase-4-enrich.md` — enrich in place, acting on every auto-approved action.
6. **Phase 5** — `phase-5-audit.md` — adversarial audit. Pages failing after 2 retries are **reverted** (per the manual rule); this is normal and does NOT block the run.
7. **Phase 6** — `phase-6-publish.md` — sitemap lastmod + typecheck + commit. **Override the push step with the auto-decision below.**
   - If typecheck fails and can't be mechanically fixed → revert offending pages; if that empties the batch → `git reset --hard HEAD~1`, email failure, exit 0.

## New AI model launch — Tier 0 completeness check (MANDATORY)

Run this on the Phase 2 question sets, **before** Phase 3 decides what gets added where.

This pass sees a launch through its follow-ups: a recent `{model}-explained` page draws questions its own body can never satisfy — "what does it cost", "what's the context window", "is it better than the last one". Those are missing *pages*, not missing sections. When a page's questions cluster that way, slug the model and check its launch core:

```bash
M=<slugged-model>
for s in explained pricing limits review benchmarks alternatives; do
  grep -qE "[\"']slug[\"']: [\"']$M-$s[\"']" data/guides-new.ts data/guides.ts \
       data/comparisons-new.ts data/comparisons.ts || echo "MISSING: $M-$s"
done
```

Every `MISSING:` row outranks this run's normal `Add`/`Strengthen`/`Link` output: create the page (this is the one case where this enrich-only pass ships a net-new page), then `Link` to it from the launch page instead of answering in place. Full family + exact slug patterns: [docs/model-launch-page-family.md](../../docs/model-launch-page-family.md). **Never fabricate a price, rate limit, context window, or benchmark score** — copy from the vendor's published page or omit it.

## Auto-approval of the former Phase 3 gate + auto-decision at push
The manual skill stops at Phase 3 for human approval, then pushes after Phase 6. In the auto variant, **every `Add`/`Strengthen`/`Link` action the Gap Chart produces is auto-approved** (subject to the same high-value/not-elsewhere filters Phase 3 already applies — autonomy does not relax those). Then apply these deterministic rules at the end; first matching row decides:

| Condition (after Phase 6 stages) | Decision | Email status |
|---|---|---|
| Phase 6 typecheck failed and revert emptied the batch | skip push, no commit | `failure` |
| Phase 5 **reverted every** enriched page | skip push, leave nothing to ship | `failure` |
| Phase 3 produced 0 actions (handled above) | (already exited) | `no-changes` |
| Otherwise (≥1 page enriched + passed audit) | **deploy to `main`:** `.claude/scripts/deploy-run-to-main.sh push` + IndexNow ping for enriched URLs | `success` |

**Never block on a revert.** A reverted page is how the skill handles audit/typecheck failures — the rest of the batch still ships. That's a successful run.

## Email report (ALWAYS sent — success, failure, or no-changes)

> When nothing needed changing, report it as **Success Without Changes** (`--status no-changes`). Never write the literal "no-op" anywhere.

The email must let a human understand the run **without opening a dashboard**: what ran, on which repo/branch, and what changed — or, on failure, exactly what failed and why.

**Step 1 — write the details file** at `/tmp/question-gap-pass-auto-<YYYY-MM-DD>.md` using these EXACT headings (include each even if empty — write "None this run"):

```markdown
## Pages analyzed (N)
- **<Title>** → `<route>` (<clicks> clicks)        ← one bullet per top page, or "None this run"

## Sections added (N)
- **<route>** — "<follow-up question>" (FAQ/section)   ← each high-value answer added, or "None this run"

## Strengthened (N)
- **<route>** — "<question>" (tightened existing answer)   ← or "None this run"

## Internal links added (N)
- **<route>** → `<target route>` ("<question>" already answered there)   ← or "None this run"

## Files changed
- `<path>` (what changed)              ← every file touched, or "None this run"

## Audit
Phase 5 result: <X/Y pages passed>; <N reverted and why>.

## Gap chart
<the full Gap Chart from Phase 3 — every page block, including skipped rows>

## IndexNow
<enriched URLs submitted, or "skipped — failure / no-changes / no key">

## Blocker (only if the run stopped early)
<what stopped it and the exact reason; omit on success>
```

**Step 2 — compute the facts, then call the helper.** The `--summary` is the single most important line: the RESULT on success, or what failed and why on failure. Specific and self-contained.

```bash
REPO="$(git remote get-url origin | sed -E 's#(git@github.com:|https://[^/]*/)##; s#\.git$##')"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
SHA="$(git rev-parse HEAD)"
.claude/scripts/send-routine-email.py \
  --status <success|failure|no-changes> \
  --skill question-gap-pass-auto \
  --site "<BASE_URL discovered in Phase 0>" \
  --repo "$REPO" \
  --branch "$BRANCH" \
  --summary "<RESULT on success, e.g. 'Analyzed top 20 pages; added 11 follow-up answers, strengthened 4, linked 6 across 9 pages; pushed + IndexNow pinged.' — or on failure, 'FAILED at <phase>: <what> because <why>; <what was rolled back / shipped>.'>" \
  --details-file /tmp/question-gap-pass-auto-$(date +%Y-%m-%d).md \
  --commit-sha "$SHA" \
  --commit-url "https://github.com/$REPO/commit/$SHA"
```

For a **no-changes** or **failure** where nothing was committed, pass `--commit-sha ""` and `--commit-url ""` so the email shows "none (no changes pushed)".

The email helper is best-effort — if it fails (network, Resend outage), **log to stdout but do not error the routine**. A missed email never rolls back committed work.

## What this skill MUST NOT do
- **Never** ask a human anything.
- **Never** modify `/question-gap-pass` or its phase files. Those are the manual variant and stay untouched.
- **Never** lower the high-value/not-elsewhere bar from Phase 3 just because it's autonomous.
- **Never** push without a successful Phase 6 typecheck.
- **Never** push if every enriched page was reverted.
- **Never** commit secrets or `.env` files.

## Reference
Original (manual) skill: [/question-gap-pass](.claude/commands/question-gap-pass.md)
Email helper: `.claude/scripts/send-routine-email.py`
Secrets: `.claude/routines.config` / `~/.claude/secrets.env`

## IndexNow Fallback Key (workflow-wide)

If any phase in this workflow hits an IndexNow error — the site's `public/<32-hex>.txt` challenge file is missing, the key can't be discovered, or the IndexNow API returns a key-verification error (403/422) — **fall back to this project-wide key**:

- **env var name:** `INDEXNOW_KEY`
- **key value (default):** `dc557f6bfced447aa1a71771d8a0d24a`

When falling back:
1. Create `public/dc557f6bfced447aa1a71771d8a0d24a.txt` with the content `dc557f6bfced447aa1a71771d8a0d24a` (filename = key = content) so search engines can verify.
2. Commit + push it as part of the run (before the IndexNow POST fires) so the challenge file is live.
3. After the deploy is verified, retry the IndexNow POST using this key.
4. If retry still fails, note the HTTP status in the final report but do NOT block the rest of the run.

This applies to **every phase that discovers or submits to IndexNow** in this workflow — Phase 0 (discovery), any prep phase that stages the IndexNow URL list, and the final submission phase. Prefer the env var if set; otherwise use the hard-coded default above.
