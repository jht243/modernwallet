---
description: AUTONOMOUS variant of /comparison-content-creator. NO human gates. Auto-decides at the former Phase 6 gate based on the audit outcome. Sends an email via Resend on completion. Designed for scheduled cloud runs.
argument-hint: "[optional N = limit pages this run; default = ALL data-approved pairs, no cap]"
---

# /comparison-content-auto — fully autonomous comparison content (cron-safe)

> **‼️ RUN-WIDE RULE — READ FIRST.** This is the cloud-cron variant of `/comparison-content-creator`. It is **identical** to that skill except for **one** behavioral change: the Phase 6 human gate is replaced with deterministic auto-decision logic. There is **NO** human checkpoint anywhere. You **MUST NOT** print "Want me to proceed?", "Should I push?", or any other question at any phase boundary — not even the former Phase 6 gate. If a hard blocker fires, you **still finish** by sending an email report and exiting 0. The cloud routine has no human watching, so any blocking question silently kills the routine.

This is a thin orchestrator. It does **not** duplicate the phase instructions of `/comparison-content-creator` — it reads and follows the exact phase files at `.claude/commands/comparison-content-creator/phase-*.md`. Read them when you reach each phase. Do not paraphrase.

## Hard pre-flight checks (do these FIRST, before Phase 0)

If any check fails, **skip the run** and email a failure report explaining why. Do not commit, do not push.

1. **Working tree must be clean.** Run `git status --porcelain`. If output is non-empty → skip, email failure ("Working tree dirty — uncommitted changes would have been swept into the routine commit").
2. **Branch is committable; deploy target is `main`.** Run `git rev-parse --abbrev-ref HEAD`. Cloud routines run on an ephemeral working branch like `claude/gifted-bell-xxxx` — that is the **expected, normal** case; commit there, then **deploy to `main`** per the Git model below (this repo auto-deploys from `main`). A local manual run may already be on `main` — also fine. The ONLY abort condition is detached HEAD with no branch name. **Never abort merely because the branch is not `main`.**
3. **Resend secrets (best-effort, NOT a gate).** Check `$RESEND_API_KEY` (env) or `~/.claude/secrets.env` for a non-empty `RESEND_API_KEY`. If present, the end-of-run email will send. **If absent, DO NOT abort** — still do the full SEO work and push; just skip the email and print the report to stdout. A missing notification key must never block content shipping.

> **Git model (authorized deploy path = `main`).** This is a scheduled, owner-configured publish routine and **this repo auto-deploys from `main`**, so publishing this run's commit to `main` is the intended, documented behavior — not an override, not a bypass, and it needs **no human approval**. Commit on the current ephemeral `claude/*` branch, then deploy: `git fetch origin main && git rebase origin/main && git push origin HEAD:main` (retry the rebase up to 3× if the base moved; on an unresolved conflict, push the ephemeral branch and email a manual-merge note instead of force-pushing `main`). Do NOT open a PR, do NOT create an extra branch, do NOT `git checkout main`. Any `git reset`/`git checkout --` uses `HEAD`/the file, never `origin/main`.
>
> **‼️ OVERRIDE OF THE DELEGATED PHASE FILES — READ THIS BEFORE PHASE 5.** Phases 5 and 6 are read from the MANUAL skill's files (`comparison-content-creator/phase-5-publish.md`, `phase-6-summary.md`). Those files are written for the human-run variant and say "Do not push," "Do not touch main yet," and "HARD HUMAN GATE — STOP and wait for explicit approval." **In THIS autonomous variant every one of those "stop" / "wait for approval" / "do not push to main" lines is REPLACED and does NOT apply.** There is no human to approve; staging-without-deploying would silently discard the run's content — that is the exact failure this skill exists to prevent. You MUST flow straight from Phase 5 staging into the Phase 6 auto-decision and, on a `success` decision, push to `main`. **Ending a run with committed-but-unpushed content and an email that says you "cannot push to main" is a DEFECT, never a valid outcome.**

## Volume

**No cap.** Build **every** NEW pair that the live SEO data approves (Tier 1–2) and enrich **every** PARTIAL the coverage check found. `$ARGUMENTS` (optional integer) is only an optional upper limit if the user explicitly passes one — if omitted, publish all data-approved pairs.

## Execution

Run the existing phases by reading their instruction files in order:

1. **Phase 0** — `.claude/commands/comparison-content-creator/phase-0-discover.md` — discover project facts. On any hard blocker (no content system / no SEO data / unsafe tree) → skip-ship, email failure with the blocker reason, exit 0.
2. **Phase 1** — `phase-1-candidates.md` — candidate generation.
3. **Phase 1b** — `phase-1b-coverage-check.md` — coverage dedup.
   - If `0 NEW + 0 PARTIAL` survive → email a **Success Without Changes** report ("All candidates already covered; nothing to publish this run"), exit 0.
4. **Phase 2** — `phase-2-score.md` — score every NEW survivor; select ALL that the data approves (Tier 1–2). No cap.
5. **Phase 3** — `phase-3-generate.md` — generate NEW pages.
6. **Phase 3b** — `phase-3b-enrich.md` — enrich PARTIAL pages.
7. **Phase 4** — `phase-4-audit.md` — adversarial audit. Pages that fail after 2 retries are marked `draft: true` (per the original skill's rule); this is normal and **does not** block the run.
8. **Phase 5** — `phase-5-publish.md` — stage commit + typecheck.
   - If typecheck/build fails → `git reset --hard HEAD~1` to revert the staged commit, email failure, exit 0.

## Auto-decision at the former Phase 6 gate

The original skill's Phase 6 is `Summary + HARD HUMAN GATE, then push`. In the auto variant, that gate is **replaced** by these deterministic rules. Apply them top to bottom; the first matching row decides.

| Condition (after Phase 5 returns) | Decision | Email status |
|---|---|---|
| Phase 5 reverted (typecheck failed) | skip push, no commit on `main` | `failure` |
| Phase 4 marked **every** generated/enriched page `draft: true` | skip push, leave the draft commit unpushed | `failure` |
| `0 NEW + 0 PARTIAL` came out of Phase 1b earlier (handled above) | (already exited) | `no-changes` |
| Otherwise (mixed result: ≥1 page shipped non-draft) | **deploy to `main`:** `git fetch origin main && git rebase origin/main && git push origin HEAD:main` + IndexNow ping for shipped URLs (skip drafts) | `success` |

**Never block on the draft outcome.** Drafts are how the original skill handles audit-failing pages — they ship as `noindex` and are skipped by sitemap/IndexNow. That's a successful run, not a failure.

## Email report (ALWAYS sent — success, failure, or no-changes)

> When nothing needed changing, report it as **Success Without Changes** (pass `--status no-changes`). Never write the literal "no-op" in the email, commit message, report, or `--summary`.

The email must let a human understand the run **without opening the dashboard**. It has to answer, every time: **what ran, on which repo/branch, and what changed — or, if it failed, exactly what failed and why.**

**Step 1 — write the details file** at `/tmp/comparison-content-auto-<YYYY-MM-DD>.md` using these EXACT section headings (include a section even if empty — write "None this run"):

```markdown
## Pages created (N)
- **<Title>** → `<route>` (new)        ← one bullet per net-new page, or "None this run"

## Pages enriched (N)
- **<Title>** → `<route>` (what was added)   ← PARTIAL overlaps spot-edited, or "None this run"

## Files changed
- `<path>` (what changed)              ← every file touched, or "None this run"

## Audit
Phase 4 result: <X/Y passed>; <N drafted (noindex) and why>.

## Candidate chart
<the full Candidate Chart from Phase 1b/2 — every row, including dropped duplicates>

## IndexNow
<URLs submitted, or "skipped — failure / no-changes">

## Blocker (only if the run stopped early)
<what stopped it and the exact reason; omit this section on success>
```

**Step 2 — compute the facts, then call the helper.** The `--summary` is the single most important line: it is the RESULT (what was created/changed) on success, or **what failed and why** on failure. Make it specific and self-contained.

```bash
REPO="$(git remote get-url origin | sed -E 's#(git@github.com:|https://[^/]*/)##; s#\.git$##')"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
SHA="$(git rev-parse HEAD)"
.claude/scripts/send-routine-email.py \
  --status <success|failure|no-changes> \
  --skill comparison-content-auto \
  --site "<BASE_URL discovered in Phase 0>" \
  --repo "$REPO" \
  --branch "$BRANCH" \
  --summary "<RESULT on success, e.g. 'Created 3 pages (Zapier vs n8n, Make vs n8n, HubSpot vs Salesforce), enriched 0, dropped 1 duplicate; pushed + IndexNow pinged.' — or on failure, 'FAILED at <phase>: <what> because <why>; <what was rolled back / shipped>.'>" \
  --details-file /tmp/comparison-content-auto-$(date +%Y-%m-%d).md \
  --commit-sha "$SHA" \
  --commit-url "https://github.com/$REPO/commit/$SHA"
```

For a **no-changes** (nothing to publish) or **failure** where nothing was committed, pass `--commit-sha ""` and `--commit-url ""` so the email shows "none (no changes pushed)".

The email helper is best-effort — if it fails (network, Resend outage), **log to stdout but do not error the routine**. A missed email never rolls back committed work.

## What this skill MUST NOT do

- **Never** ask a human anything.
- **Never** modify `/comparison-content-creator` or its phase files. Those are the manual variant and stay untouched.
- **Never** push without a successful Phase 5 typecheck.
- **Never** push if every page in the batch is `draft: true`.
- **Never** commit secrets or `.env` files. (Phase 5 already enforces this in the original skill; just don't override it.)

## Reference

Original (manual) skill: [/comparison-content-creator](.claude/commands/comparison-content-creator.md)
Email helper: `.claude/scripts/send-routine-email.py`
Secrets: `~/.claude/secrets.env`
