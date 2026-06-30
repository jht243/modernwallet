---
description: AUTONOMOUS competitor publishing monitor. Scrapes a roster of competitors 3×/week, detects their NEW + materially-updated content (and new tools/calculators), then auto-generates an ORIGINAL, improved version of each and publishes it live. Reuses the project's keyword-gap / comparison content-generation guide + adversarial audit. NO human gates. Emails a digest with live links. Designed for scheduled cloud runs.
argument-hint: "[optional N = max items to act on this run; default 10 (blast-radius cap)]"
---

# /competitor-monitor-auto — autonomous scrape-and-improve content engine (cron-safe)

> **‼️ RUN-WIDE RULE — READ FIRST.** This is a cloud-cron skill. There is **NO** human checkpoint anywhere. NEVER print "Want me to proceed?", "Should I push?", or any question at a phase boundary. If a hard blocker fires, you **still finish** by sending an email report and exiting 0. The cloud routine has no human watching, so any blocking question silently kills the run.

This is a thin orchestrator. It does **not** duplicate the reused phase instructions — it reads the exact phase files when it reaches each phase. The net-new phases live under `.claude/commands/competitor-monitor/`; the reused content/audit/stage phases live under `.claude/commands/comparison-content-creator/` and `.claude/commands/keyword-gap-pass/`. Do not paraphrase any of them.

## What this skill does

1. **Scrape** a dedicated roster of competitor agency sites (`scripts/competitor_monitor/competitors.json`) and diff against a git-committed ledger to find their **new + materially-updated pages, comparisons, and tools**.
2. **Relevance gate** — keep only competitor pages inside this project's niche (defined by the include/exclude terms in `competitors.json`). Off-niche pages are recorded + reported but **never generated**. (Handled inside the scraper.)
3. **Dedup FIRST** — drop anything this project already covers **before** spending any AI credits on generation.
4. **Generate** an **original, improved** improved version of each surviving competitor page, using the competitor's coverage + structure as the **minimum floor** (never copied), via the **same** content-generation guide + adversarial audit as the keyword-gap pass.
5. **Auto-build** an improved version of any competitor **tool/calculator** as a real interactive tool.
6. **Audit → publish live** (commit + `git push origin HEAD` + IndexNow) and **email a digest with clickable live links** to every published page/tool.

## Hard pre-flight checks (do these FIRST, before Phase 0)

If any check fails, **skip the run** and email a failure report explaining why. Do not commit, do not push.

1. **Working tree clean.** `git status --porcelain` must be empty → else skip + email failure ("Working tree dirty").
2. **Branch committable (NOT required to be `main`).** `git rev-parse --abbrev-ref HEAD`. Cloud routines run on an ephemeral `claude/*` branch — that is the **expected** case; commit + push THAT branch. The ONLY abort is detached HEAD. Never abort merely because the branch is not `main`. Throughout, "push" means `git push origin HEAD`.
3. **Python available.** `python3 --version` must succeed (the scraper needs it) → else skip + email failure.
4. **Resend secrets (best-effort, NOT a gate).** Check `$RESEND_API_KEY` (env) or `.claude/routines.config` / `.claude/secrets.env`. If absent, do the full run and push anyway; just skip the email and print the report to stdout.

> **Git model (cloud-safe).** Commit on the **current branch**, push with `git push origin HEAD`. MUST NOT create a new branch and MUST NOT `git checkout main`. When delegating to `comparison-content-creator/phase-5-publish.md`, override its "create/switch to a working branch" step: stay on the current branch and commit there.

## Volume

**Per-run blast-radius cap.** `$ARGUMENTS` (optional integer) caps the items acted on this run; **default 10**. A competitor relaunch can dump dozens of new URLs at once — acting on all unbounded is the risk. If candidates exceed the cap, act on the **most recent** N (by `lastmod`/first-seen) and list the overflow in the email; the rest re-surface next run (they stay `pending` in the ledger).

## Execution

Run these phases in order by reading their instruction files:

1. **Phase 0** — `.claude/commands/competitor-monitor/phase-0-discover.md` — discover project facts + load roster/ledger. On any hard blocker → skip, email failure, exit 0.
2. **Phase 1** — `.claude/commands/competitor-monitor/phase-1-scrape.md` — run the scraper, read candidates.
   - **First-run / 0 candidates** → email **Success Without Changes** ("No new competitor content detected this run"), commit the seeded ledger, exit 0.
3. **Phase 2** — `.claude/commands/competitor-monitor/phase-2-dedup.md` — coverage/dedup check **before any generation**. DUPLICATE candidates are dropped here (recorded as `skipped-duplicate`), never sent to generation.
   - If **0 NEW + 0 PARTIAL** survive → email **Success Without Changes**, record dispositions, commit ledger, exit 0.
4. **Phase 3** — `.claude/commands/competitor-monitor/phase-3-generate.md` — generate improved prose pages (NEW) and enrich (PARTIAL).
5. **Phase 3c** — `.claude/commands/competitor-monitor/phase-3c-tool-build.md` — study + auto-build improved tools for `tool` candidates.
6. **Phase 4** — `.claude/commands/competitor-monitor/phase-4-audit.md` — adversarial audit + no-plagiarism + tool-logic checks. Pages/tools failing after 2 reworks → `draft: true` (does NOT block the run).
7. **Phase 5** — `.claude/commands/competitor-monitor/phase-5-publish.md` — stage commit + typecheck on the current branch.
   - If typecheck/build fails → `git reset --hard HEAD~1`, email failure, exit 0.
8. **Phase 6** — `.claude/commands/competitor-monitor/phase-6-push-record.md` — auto-decision push + IndexNow + record ledger dispositions + **refresh the baseline chart (diffs vs the previous chart)** + commit ledger + chart.
9. **Phase 7** — `.claude/commands/competitor-monitor/phase-7-email.md` — email the digest **with live links**.

## Auto-decision (replaces every human gate)

Apply top to bottom; first match wins.

| Condition | Decision | Email status |
|---|---|---|
| Pre-flight failed (dirty tree / detached HEAD / no python) | skip, no commit | `failure` |
| First run, or 0 new/updated candidates | commit seeded/updated ledger, no content | `no-changes` |
| All candidates DUPLICATE after Phase 2 | record dispositions, commit ledger, no content | `no-changes` |
| Phase 5 typecheck/build failed | `git reset --hard HEAD~1`, no push | `failure` |
| Phase 4 marked **every** generated page/tool `draft: true` | leave draft commit unpushed | `failure` |
| ≥1 page/tool shipped non-draft | `git push origin HEAD` + IndexNow live URLs (skip drafts) + commit ledger | `success` |

**Never block on the draft outcome.** Drafts ship as `noindex`, excluded from sitemap/IndexNow — a successful run, not a failure.

## What this skill MUST NOT do

- **Never** ask a human anything.
- **Never** copy competitor text verbatim. The competitor outline is a **minimum coverage floor**; every published page is 100% original (Phase 4 enforces this).
- **Never** modify the reused phase files (`comparison-content-creator/*`, `keyword-gap-pass/*`) — they are shared with other skills.
- **Never** push without a successful Phase 5 typecheck, or if every item is `draft: true`.
- **Never** commit secrets / `.env` files, or store competitor HTML in the repo (only the hash + outline live in the ledger).

## Reference

- Scraper: `scripts/competitor_monitor/scraper.py` (`detect` / `record` / `show` / `baseline`)
- Roster: `scripts/competitor_monitor/competitors.json` · Ledger: `reports/competitor-monitor/ledger.json`
- Baseline charts (dated history, regenerated + committed each run, each diffs vs the prior): `reports/competitor-monitor/baseline-*.{md,json}`
- Email helper: `.claude/scripts/send-routine-email.py` · Secrets: `.claude/routines.config` or `~/.claude/secrets.env`
- Reused content guide: `keyword-gap-pass/phase-3-new-content.md` · Reused audit: `comparison-content-creator/phase-4-audit.md`
