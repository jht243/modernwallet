---
description: AUTONOMOUS variant of /bing-webmaster-pass. NO human gates. Auto-approves the Phase 0 manifest based on deterministic rules. Cloud-branch-safe. Sends an email via Resend on completion. Designed for scheduled cloud runs.
argument-hint: "[optional verified Bing siteUrl — auto-resolves from BASE_URL if omitted]"
---

# /bing-webmaster-pass-auto — fully autonomous Bing Webmaster technical pass (cron-safe)

> **‼️ RUN-WIDE RULE — READ FIRST.** This is the cloud-cron variant of `/bing-webmaster-pass`. It is **identical** to that skill except the **Phase 0 manifest gate** is replaced with deterministic auto-decision logic. There is **NO** human checkpoint. You **MUST NOT** print "Approve manifest?", "Should I push?", or any question. If a hard blocker fires, you **still finish** by sending an email report and exiting 0.

This is a thin orchestrator. The full workflow lives in `.claude/commands/bing-webmaster-pass.md` (it is self-contained — orchestration + phases inline). Read and follow it, applying the overrides below. Do not paraphrase it.

## Hard pre-flight checks (FIRST)

If any fails, **skip the run** and email a failure report. Do not commit, do not push.

1. **Working tree clean** — `git status --porcelain` empty.
2. **Branch is committable (NOT required to be `main`).** Cloud routines run on an ephemeral `claude/*` branch — expected. Commit + push the current branch with `git push origin HEAD`. Never `git checkout main`, never create a new branch, never abort just because the branch isn't `main`. Any `git reset` uses `HEAD`.
3. **Bing helper + key.** `.claude/scripts/bing_webmaster.py` exists and `python3 .claude/scripts/bing_webmaster.py sites` returns a JSON list (key resolves from `$BING_WEBMASTER_API_KEY` env or `.claude/secrets.env`). If the key is missing or returns 401/403 → skip, email failure ("Bing API key missing/invalid — add BING_WEBMASTER_API_KEY").
4. **Resend key** resolves (env or `.claude/secrets.env`). If absent, still do the work; skip only the email.

> **Git + secrets model (cloud-safe).** Commit on the current branch, push with `git push origin HEAD`. All file writes stay INSIDE the workspace. Secrets resolve from env vars or workspace-local `.claude/secrets.env` — never write to `~/.claude` (outside the workspace → permission prompt that hangs the run). The Bing helper reads `BING_WEBMASTER_API_KEY` the same way.

## Execution

Run `.claude/commands/bing-webmaster-pass.md` STEP 0 → STEP 2 (preflight, discover, deep-dive sweep, build the issue report) exactly as written, EXCEPT: wherever it references `.claude/scripts/bing_webmaster.py`, use `.claude/scripts/bing_webmaster.py`.

## Auto-decision at the former Phase 0 manifest gate

The original skill stops at the Phase 0 manifest for human approval. The auto variant replaces it with (first match wins):

| Manifest state | Decision | Email status |
|---|---|---|
| 0 fixable technical rows (site crawl-clean, or all rows are intentional exclusions) | skip remaining phases | `no-changes` |
| All fixable rows are `ambiguous / needs human` | skip remaining phases | `failure` (lists rows) |
| Fixable rows exceed the skill's caps (40 link edits / 15 sitemap changes) | proceed with the top-N per the skill's own sort; queue the rest in the report | (continue, note in details) |
| Otherwise | auto-approve, continue through fixes → audit → build → commit → push → Bing submit | `success` |

The skill's own blast-radius caps (40 link/href edits, 15 sitemap-entry changes) and its per-page-only / no-site-wide-config rules still apply verbatim — do not loosen them.

## Push + submit

Follow the skill's commit → push → Bing-submit steps, but push the **current branch** (`git push origin HEAD`). Submit only the URLs actually changed this run, within Bing's `urlSubmissionQuota`.

## Email report (ALWAYS sent — success, failure, or no-changes)

> When nothing needed changing, report it as **Success Without Changes** (pass `--status no-changes`). Never write the literal "no-op" in the email, commit message, report, or `--summary`.

The email must answer, without opening the dashboard: **what ran, on which repo/branch, what was fixed — or what failed and why.**

**Step 1 — write `/tmp/bing-webmaster-pass-auto-<YYYY-MM-DD>.md`** with these EXACT headings (write "None this run" if empty):

```markdown
## Technical fixes applied (N)
- `<url/route>` — <crawl error / redirect hop / indexability / orphan / sitemap fix, one line>

## Files changed
- `<path>` (what changed)

## Audit
Phase result: <pass / rejected-then-fixed / hard-fail + why>.

## Submitted to Bing
<URLs submitted within quota, or "skipped — failure / no-changes">

## Left for human (ambiguous)
- `<url>` — <why not auto-fixed>

## Crawl health (informational)
<key crawlStats deltas: CrawlErrors / Code4xx / Code5xx / BlockedByRobotsTxt>

## Blocker (only if the run stopped early)
<what stopped it and the exact reason; omit on success>
```

**Step 2 — call the helper** (`--summary` = RESULT, or what failed + why):

```bash
REPO="$(git remote get-url origin | sed -E 's#(git@github.com:|https://[^/]*/)##; s#\.git$##')"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"; SHA="$(git rev-parse HEAD)"
.claude/scripts/send-routine-email.py \
  --status <success|failure|no-changes> \
  --skill bing-webmaster-pass-auto \
  --site "<BASE_URL discovered in STEP 1>" \
  --repo "$REPO" --branch "$BRANCH" \
  --summary "<RESULT e.g. 'Fixed 9 crawl errors + 4 redirect hops, removed 3 dead sitemap URLs; submitted 13 URLs to Bing.' — or 'FAILED: <what> because <why>.'>" \
  --details-file /tmp/bing-webmaster-pass-auto-$(date +%Y-%m-%d).md \
  --commit-sha "$SHA" --commit-url "https://github.com/$REPO/commit/$SHA"
```

For no-changes (clean) / failure with no commit, pass `--commit-sha ""` and `--commit-url ""`. The email helper is best-effort — if it fails, log to stdout but don't fail the routine.

## What this skill MUST NOT do

- **Never** ask a human anything.
- **Never** modify `/bing-webmaster-pass` or the bing helper.
- **Never** touch editorial content / titles / descriptions (this is a TECHNICAL pass — the original skill's scope rule is binding).
- **Never** edit site-wide config / robots / global redirect rules.
- **Never** exceed the skill's caps (40 link edits / 15 sitemap changes).
- **Never** push if the audit failed — revert and email.

## Reference

Original (manual) skill: [/bing-webmaster-pass](.claude/commands/bing-webmaster-pass.md)
Bing helper: `.claude/scripts/bing_webmaster.py`
Email helper: `.claude/scripts/send-routine-email.py`
Secrets: workspace-local `.claude/secrets.env` (or env vars)
