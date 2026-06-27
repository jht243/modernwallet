---
description: AUTONOMOUS variant of /indexing-issues-gsc-pass. NO human gates. Auto-approves the Phase 0 manifest and the Phase 8 push gate based on deterministic rules. Sends an email via Resend on completion. Designed for scheduled cloud runs.
argument-hint: "[optional path to an existing report .md — skips the inspection sweep]"
---

# /indexing-pass-auto — fully autonomous GSC indexing pass (cron-safe)

> **‼️ RUN-WIDE RULE — READ FIRST.** This is the cloud-cron variant of `/indexing-issues-gsc-pass`. It is **identical** to that skill except for **two** behavioral changes: the Phase 0 manifest gate and the Phase 8 push gate are replaced with deterministic auto-decision logic. There is **NO** human checkpoint anywhere. You **MUST NOT** print "Approve manifest?", "Should I push?", or any other question at any phase boundary. If a hard blocker fires, you **still finish** by sending an email report and exiting 0.

This is a thin orchestrator. It does **not** duplicate the phase instructions of `/indexing-issues-gsc-pass` — it reads and follows the exact phase files at `.claude/commands/indexing-issues-gsc-pass/phase-*.md`. Read them when you reach each phase. Do not paraphrase.

## Hard pre-flight checks (do these FIRST)

If any check fails, **skip the run** and email a failure report explaining why. Do not commit, do not push.

1. **Working tree clean** — `git status --porcelain` must be empty.
2. **Branch is committable (NOT required to be `main`)** — cloud routines run on an ephemeral `claude/*` branch; that is expected. Commit and push the **current** branch via `git push origin HEAD`. Only abort on detached HEAD. Never `git checkout main` or create a new branch. Never abort merely because the branch isn't `main`.

> **Git model (cloud-safe).** Commit on the **current branch**; push with `git push origin HEAD`. When delegating to `phase-9-commit-deliver.md`, override any push-to-`main` or branch-switch step — stay on and push the current branch. Any `git reset` uses `HEAD`/`HEAD~1`, never `origin/main`. Resend key resolves from `$RESEND_API_KEY` (env) or `.claude/secrets.env`; if absent, skip email but still complete + push the fixes.
>
> **GSC credentials (cloud-safe — NEVER write the SA JSON to a file).** A Google service-account JSON contains a private key; **writing it to disk trips Claude Code's sensitive-file guard and hangs the unattended run — even via Bash, regardless of filename.** So do NOT create any `.json`/`gsc`/`sa` credential file and do NOT pass `--sa-file`. Instead the SA travels as a base64 blob on the `GSC_SA_B64=` line inside `.claude/routines.config`. When you invoke the build-report / URL-inspection tool, decode it **inline into the `GOOGLE_REPORTING_SA_JSON` env var on the SAME command** (the tool reads that env — JSON content — ahead of any file). Exact form:
>
> ```bash
> GOOGLE_REPORTING_SA_JSON="$(grep '^GSC_SA_B64=' .claude/routines.config | cut -d= -f2- | base64 -d)" python3 <the url-inspection tool> <args>
> ```
>
> The private key thus only ever exists in an environment variable, never a file on disk — so nothing is flagged. If `GSC_SA_B64` is absent from `.claude/routines.config` → skip the run and email failure ("GSC service-account not provisioned").
3. **GSC service account has Full/Owner access** — Phase build-report's first API call will tell us. A 403 on the first inspection call means the service account is not authorized → skip, email failure (instruct the user to add it in GSC → Settings → Users and permissions).
4. **Resend secrets present** in `~/.claude/secrets.env`.

## Execution

Run by reading each phase file in order:

1. **STEP 1 / Build report** — `.claude/commands/indexing-issues-gsc-pass/phase-build-report.md`. Either uses the `$ARGUMENTS` path (existing report), reuses today's existing report at `reports/indexing-pass/<TODAY>.md` if present, or runs the URL Inspection sweep.
2. **Gate A** — adversarial duplicate / wrongful-drop reviewer (already automatic in the build-report file).
3. **Phase 0** — `phase-0-discover.md`. Discover project facts + assemble the manifest.

## Auto-decision at the former Phase 0 manifest gate

The original skill stops here for the user to approve the manifest. The auto variant replaces that with these rules (first match wins):

| Manifest state (after Phase 0 builds it) | Decision | Email status |
|---|---|---|
| 0 actionable rows (everything was `working as intended` / `already-fixed`) | skip remaining phases | `no-op` |
| All rows in `ambiguous / needs human` | skip remaining phases | `failure` (lists the rows in details) |
| Otherwise | auto-approve, fix **ALL** actionable rows, continue to Phase 1 | (continue) |

**NO volume cap.** Fix every actionable row the report found — there is no per-run limit on how many URLs are processed. Finding many actionable rows is a success signal (GSC auth worked, real issues found), never a reason to skip or fail. The only failures are the genuine blockers above (zero actionable, or all-ambiguous).

## Continue: Phases 1 → 7

4. **Phase 1** — `phase-1-canonical.md`
5. **Phase 2** — `phase-2-redirect-error.md`
6. **Phase 3** — `phase-3-indexability.md`
7. **Phase 4** — `phase-4-thin-content.md`
8. **Phase 5** — `phase-5-audit.md` (consolidated reviewer)
9. **Phase 6** — `phase-6-internal-linking.md`
10. **Phase 7** — `phase-7-sitemap-resubmit.md` (no external submissions yet)

If Phase 5 (audit) hard-fails after 2 reworks per the original skill's retry rule, **STOP**, leave the staged changes uncommitted (the original skill stages but does not commit until Phase 9), `git reset --hard HEAD` to discard the staging, and email failure.

## Auto-decision at the former Phase 8 push gate

The original skill stops at Phase 8 for the user to approve push + submission. The auto variant replaces that with:

| Condition (after Phase 7 returns) | Decision | Email status |
|---|---|---|
| Phase 5 audit hard-failed earlier | (already exited, can't reach here) | `failure` |
| Any staged file is in a "high blast radius" path (see below) | skip push, leave staged | `failure` (calls out which files) |
| Otherwise | run **Phase 9** — `phase-9-commit-deliver.md` — which commits, pushes, and fires the IndexNow + Google Indexing re-submits | `success` |

**High blast radius paths** (auto-routine refuses to commit edits in these — rule 8a of the original skill forbids them too, but we re-check defensively):
- `next.config.*`, `vercel.json`, `vite.config.*`, `nuxt.config.*`, `gatsby-config.*` (build config)
- `middleware.ts`, `middleware.js` (request rewrite logic)
- `public/robots.txt`, `public/_redirects`, `netlify.toml` (site-wide redirect/robots policy)
- Any file matching `**/sitemap.*` if it's a hand-edited route map (sitemap *generators* under `scripts/` are OK)
- `src/config.*` if it's the canonical/base-URL config

If any of these were touched, abort the push, email failure listing the files, and let the user resolve manually.

## Email report (ALWAYS sent — success, failure, or no-op)

The email must answer, without opening the dashboard: **what ran, on which repo/branch, what was fixed — or what failed and why.**

**Step 1 — write `/tmp/indexing-pass-auto-<YYYY-MM-DD>.md`** with these EXACT headings (write "None this run" if empty):

```markdown
## Fixes applied (N)
- `<url/route>` — <canonical | redirect | indexability | thin-content | sitemap fix, one line each>

## Files changed
- `<path>` (what changed)

## Audit
Phase 5 result: <pass / rejected-then-fixed / hard-fail + why>.

## Re-submitted to search engines
<IndexNow + Google Indexing URLs, or "skipped — failure / no-op">

## Left for human (ambiguous / needs review)
- `<url>` — <why it was not auto-fixed>

## Buckets seen (informational)
<totals: canonical / redirect / indexability / thin / links / sitemap / already-fixed / working-as-intended>

## Blocker (only if the run stopped early)
<what stopped it and the exact reason; omit on success>
```

**Step 2 — call the helper** (`--summary` = the RESULT, or what failed + why):

```bash
REPO="$(git remote get-url origin | sed -E 's#(git@github.com:|https://[^/]*/)##; s#\.git$##')"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"; SHA="$(git rev-parse HEAD)"
.claude/scripts/send-routine-email.py \
  --status <success|failure|no-op> \
  --skill indexing-pass-auto \
  --site "<BASE_URL discovered in Phase 0>" \
  --repo "$REPO" --branch "$BRANCH" \
  --summary "<RESULT e.g. 'Fixed 8 canonicals + 3 redirects, expanded 2 thin pages; 5 left for human; pushed + re-submitted.' — or 'FAILED at Phase 5 audit: <what> because <why>; all changes rolled back.'>" \
  --details-file /tmp/indexing-pass-auto-$(date +%Y-%m-%d).md \
  --commit-sha "$SHA" --commit-url "https://github.com/$REPO/commit/$SHA"
```

For no-op / failure with no commit, pass `--commit-sha ""` and `--commit-url ""`. The email helper is best-effort — if it fails, log to stdout but don't fail the routine.

## What this skill MUST NOT do

- **Never** ask a human anything.
- **Never** modify `/indexing-issues-gsc-pass` or its phase files.
- **Never** edit a file in the high-blast-radius list above.
- **Never** push if Phase 5 audit failed.
- **Never** ship more than 30 URL changes in one commit (the manifest cap above enforces this).

## Reference

Original (manual) skill: [/indexing-issues-gsc-pass](.claude/commands/indexing-issues-gsc-pass.md)
Email helper: `.claude/scripts/send-routine-email.py`
Secrets: `~/.claude/secrets.env`
