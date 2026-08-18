---
description: AUTONOMOUS variant of /keyword-gap-pass. NO human gates. Refreshes the competitor set live via SEMRUSH, builds the keyword chart, auto-approves the Phase 0 manifest gate and the Phase 8 push gate on deterministic rules, then writes/enriches pages, updates the sitemap, pushes to main, 200-verifies every URL and submits to IndexNow. Sends an email via Resend on completion. Designed for scheduled cloud runs.
argument-hint: "[optional path to an existing chart .md — skips the SEMRUSH build step]"
---

# /keyword-gap-pass-auto — fully autonomous SEMRUSH keyword-gap pass (cron-safe)

> **‼️ PIN THE DEPLOY BASE FIRST — before Phase 0 and before ANY commit.** Run this once, now:
> ```
> .claude/scripts/deploy-run-to-main.sh mark
> ```
> It records the branch tip you inherited so that, at deploy time, ONLY the commits THIS run adds are
> replayed onto `main` — even if the branch already carried another routine's commits (a shared/stale
> `worktree-agent-*` branch). The deploy step calls `.claude/scripts/deploy-run-to-main.sh push`, which
> replays `RUN_BASE..HEAD` onto the latest `origin/main` and, on a genuine conflict, aborts (never
> force-pushes `main`) so you fall back to pushing the ephemeral branch + emailing a manual-merge note.
> Skipping `mark` reintroduces the 2026-07-20 comparison-content-auto failure (30+ spurious conflicts).
> If `.claude/scripts/deploy-run-to-main.sh` is absent from this repo, fall back to the plain path
> `git fetch origin main && git rebase origin/main && git push origin HEAD:main` (retry 3x, never
> force-push) and note the fallback in the email — do NOT skip the run over a missing helper.

> **‼️ RUN-WIDE RULE — READ FIRST.** This is the cloud-cron variant of `/keyword-gap-pass`. It is **identical** to that skill except that its **two hard human gates** — the Phase 0 manifest approval and the Phase 8 push approval — are replaced with deterministic auto-decision logic. There is **NO** human checkpoint anywhere. You **MUST NOT** print "Approve the manifest?", "Should I push?", "Want me to proceed?", or any equivalent at any phase boundary. The reviewer gates between phases are automatic adversarial subagents, not human checkpoints — passing one means continue on your own. If a hard blocker fires, you **still finish** by sending an email report and exiting 0.

This is a thin orchestrator. It does **not** duplicate the phase instructions of `/keyword-gap-pass` — it reads and follows the exact phase files at `.claude/commands/keyword-gap-pass/phase-*.md`. Read them when you reach each phase. Do not paraphrase or improvise them.

## Hard pre-flight checks (do these FIRST)

If any check fails, **skip the run** and email a failure report explaining why. Do not commit, do not push.

1. **Working tree clean** — `git status --porcelain` must be empty.
2. **Branch is committable; deploy target is `main`** — cloud routines run on an ephemeral `claude/*` branch; that is expected. Commit there, then deploy to `main` per the Git model below. Only abort on detached HEAD. Never `git checkout main` as a working branch, never create an extra branch, never abort merely because the branch isn't `main`.
3. **`SEMRUSH_API_KEY` is set** (env, or the routine prompt passes it inline). A missing or dry key **must NOT skip the run or email failure** — the demand ladder (`.claude/commands/_keyword-demand-ladder.md`) demotes to Ahrefs, then public-source estimates; run the gap analysis on the next rung and say which rung ran in the email. **Never** hardcode a key into a command file and **never** invent gap data to work around a missing key.
4. **Tracked-keyword document resolves — or gets bootstrapped.** The manual skill STOPs and asks for its path. The auto variant resolves it itself, in this order: (a) the `TARGET_KW_FILE` constant in `scripts/semrush_keyword_gap.py` if that script exists; (b) `reports/seo-research/target-keywords.md`; (c) `target-keyword-inventory.md` at the repo root; (d) any repo-root file matching `*target*keyword*.md`.

   **If none resolves, BOOTSTRAP it — do not skip and do not run with an empty tracked set.** An empty tracked set makes every keyword look like a gap and floods the chart with work already shipped, which is the single worst failure mode of this pass. To bootstrap, build the file at the `TARGET_KW_FILE` path (default `reports/seo-research/target-keywords.md`) from what the site already publishes:
   - Pull the live sitemap (`<BASE_URL>/sitemap.xml`, following any index to its children). If the sitemap is unreachable, fall back to the content store Phase 0 discovered (e.g. `data/guides*.ts`, `src/content/**`, or the DB table this repo uses).
   - Emit one row per indexable content URL in the exact table shape `load_tracked()` parses:
     `| Target URL | Primary Keyword | Supporting Keywords |`
   - Derive the primary keyword from the slug (`/guides/how-to-season-a-humidor` → `how to season a humidor`) and leave Supporting Keywords empty. Slug-derived keywords are an approximation, not a claim about ranking — that is fine; the file's job is dedup, so a slightly-off keyword still correctly stops the pass from re-proposing a page that already exists.
   - Head the file with a comment noting it was bootstrapped, the date, and the row count.
   - Commit it as part of this run so the next run starts from it and Step E can append to it.

   Only skip + email failure if the bootstrap itself cannot produce **any** rows (no sitemap AND no discoverable content store) — that means Phase 0 failed to understand the repo, and a gap analysis would be meaningless.
5. **Resend secrets present** (`$RESEND_API_KEY` env or `.claude/secrets.env`). If absent, still do the work and push; only the email is skipped.

> **Git model (authorized deploy path = `main`).** This repo auto-deploys from `main`, so publishing this run's commit to `main` is intended behavior and needs **no human approval**. Commit on the current ephemeral `claude/*` branch, then deploy with `.claude/scripts/deploy-run-to-main.sh push` (retry the rebase up to 3×; on an unresolved conflict push the ephemeral branch and email a manual-merge note instead of force-pushing `main`). When delegating to `phase-9-commit-deliver.md` ("push per the discovered push target"), that target is `main` — do NOT stay on / push only the ephemeral branch, and do NOT open a PR. Any `git reset` uses `HEAD`/`HEAD~1`, never `origin/main`.

## Execution

Run by reading each phase file in order.

1. **STEP 1 / Build the chart** — `.claude/commands/keyword-gap-pass/phase-build-keywords.md`.
   - If `$ARGUMENTS` names an existing chart `.md`, load it and skip the SEMRUSH build.
   - Else if a chart already exists at `reports/keyword-pass/<TODAY>.md`, reuse it (idempotent re-runs).
   - Else build it: **refresh the competitor set live** per Step A of that file (`SemrushClient.domain_competitors(OUR_DOMAIN)`), run both lenses (competitor gap + whitespace/live-market exploration), diff against the tracked-keyword document, and save the chart. Keep the sets tight — ~6–12 competitors, a handful of seeds, one pull per domain/seed — SEMRUSH credits are metered.
   - **Persist the refreshed competitor set** into the chart's `## Competitors this run` section and sync the `COMPETITORS` constant in `scripts/semrush_keyword_gap.py` so the project's tooling keeps evolving. This is the whole point of running it live rather than off a frozen list.
   - **Gate A — duplicate suppression** is already an automatic adversarial reviewer inside that file. If rows still fail after its 2 rework attempts, the manual skill STOPs; the auto variant instead **drops the unresolved rows**, records them in the email details under "Left for human", and continues with the clean remainder. If that leaves **zero** rows, exit as `no-changes`.
2. **Phase 0** — `phase-0-discover.md`. Load the chart, discover project facts, assemble the manifest.

## Auto-decision at the former Phase 0 manifest gate

The original skill stops here for the user to approve the manifest. The auto variant replaces that with these rules (first match wins):

| Manifest state (after Phase 0 builds it) | Decision | Email status |
|---|---|---|
| 0 actionable rows (all duplicate / already-shipped / off-mission) | skip remaining phases | `no-changes` |
| SEMRUSH returned no data for **every** row (quota exhausted or API error) and no Ahrefs MCP fallback is available | skip remaining phases | `failure` (names the API error) |
| All surviving rows are `ambiguous / needs human` | skip remaining phases | `failure` (lists the rows) |
| Otherwise | auto-approve and act on **ALL** actionable rows — no cap | (continue) |

**No volume cap.** Act on every actionable row the chart produced. A large chart is a success signal (the gap analysis worked), never a reason to skip. **Adjacent-tier rows are NOT auto-deprioritized** — rule 6d of the manual skill applies verbatim: a low-difficulty, on-intent `adjacent` term can beat a crowded `core` term, so weigh them on equal footing rather than dropping them because the human isn't there to judge.

## Continue: Phases 1 → 7

3. **Phase 1** — `phase-1-consolidation.md` (cannibalization; **advisory only — edits nothing**)
4. **Phase 2** — `phase-2-metadata.md`
5. **Phase 3** — `phase-3-new-content.md` (net-new routes only)
6. **Phase 4** — `phase-4-audit.md` (this IS the gate for Phase 3)
7. **Phase 5** — `phase-5-body.md`
8. **Phase 6** — `phase-6-internal-linking.md`
9. **Phase 7** — `phase-7-sitemap-indexnow.md` — adds every new route to the correct sitemap with today's `<lastmod>` and **writes** the IndexNow URL list to `reports/keyword-pass/<date>.indexnow.txt`. It does **not** submit; submission is deferred to Phase 9 post-deploy so we never ping crawlers with a URL that isn't live yet.

Respect the manual skill's ordering rules: never start a phase until every phase it depends on has passed its gate, and never run two existing-page-editing phases (2, 5, 6) concurrently.

**Rule 6c is absolute and survives automation: update & add — NEVER regenerate or delete.** Existing pages are improved by targeted in-place `Edit` operations that change only what a chart row calls for. Never rewrite or "rebuild" a whole existing page, and never run a generator that regenerates page content wholesale — that is how good pages get flattened into thin templated content and how a site earns a sitewide quality demotion. If acting on a row would require regenerating or deleting a page, drop the row and record it under "Left for human".

If Phase 4 (audit) hard-fails after 2 reworks per the manual skill's retry rule, **STOP**, `git reset --hard HEAD` to discard the staged work, and email failure. Do not push a run whose audit failed.

## Auto-decision at the former Phase 8 push gate

The original skill stops at Phase 8 for the user to approve the push. The auto variant replaces that with:

| Condition (after Phase 7 returns) | Decision | Email status |
|---|---|---|
| Phase 4 audit hard-failed earlier | (already exited above) | `failure` |
| Any staged file is in a high-blast-radius path (below) | skip push, roll back the staging | `failure` (names the files) |
| Nothing staged (every row turned out to be a no-op) | skip push | `no-changes` |
| Otherwise | run **Phase 9** — `phase-9-commit-deliver.md` | `success` |

**High blast radius paths** (this routine refuses to commit edits in these):
- `next.config.*`, `vercel.json`, `vite.config.*`, `nuxt.config.*`, `gatsby-config.*`, `astro.config.*` (build config)
- `middleware.ts`, `middleware.js` (request rewrite logic)
- `public/robots.txt`, `public/_redirects`, `netlify.toml`, `render.yaml` (site-wide redirect/robots/deploy policy)
- any hand-edited route map matching `**/sitemap.*` (sitemap *generators* under `scripts/` are fine)
- `src/config.*` if it holds the canonical / base-URL config

## Phase 9 — commit, push, verify live, then IndexNow

Phase 9 already encodes the required order; do not reorder it:

1. Commit on the ephemeral branch, then deploy to `main` via `.claude/scripts/deploy-run-to-main.sh push`.
2. Confirm the commit actually reached the remote (`git fetch origin && git rev-parse origin/main` matches).
3. **Live 200 check — REQUIRED before any submission.** Wait for the host to deploy (allow ~3 min; Render/Vercel/Netlify cold builds routinely take 2–5, so do not shortcut it), then for EACH new or changed URL run `curl -s -o /dev/null -w '%{http_code}' <url>`. A page counts as shipped **only** on 200. On a non-200: diagnose, fix, push, wait, re-verify — **max 2 attempts per URL**. If a newly created page still isn't 200 after 2 attempts, **revert that page** (commit + push the revert) so a broken 404/500 is never left live, and mark it FAILED.
4. **IndexNow fires only now, and only for URLs that returned 200.** Read `reports/keyword-pass/<date>.indexnow.txt`, submit one POST to `https://api.indexnow.org/indexnow` with `{host, key, keyLocation, urlList}` containing only the verified-live URLs, and capture the HTTP status. Never submit a URL that did not return 200.

The run's `--status` is **`failure`** if any created/changed page is left non-200; `success` only when all of them return 200. **Never report a page as shipped unless it returned 200 live.**

## Email report (ALWAYS sent — success, failure, or no-changes)

> When nothing needed changing, report it as **Success Without Changes** (`--status no-changes`). Never write the literal "no-op" in the email, commit message, report, or `--summary`.

The email must answer, without opening a dashboard: **what ran, on which repo/branch, what shipped — or what failed and why.**

**Step 1 — write `/tmp/keyword-gap-pass-auto-<YYYY-MM-DD>.md`** with these EXACT headings (write "None this run" if empty):

```markdown
## Competitors this run
- `<domain>` — added/kept/dropped, one-line reason

## Chart
<rows total; core vs adjacent; how many from competitor-gap (Lens 1) vs exploration (Lens 2); how many excluded and why>

## Pages created (N)
- `<url>` — <primary keyword, volume/KD, which lens surfaced it>

## Pages enriched (N)
- `<url>` — <what changed: metadata / body / internal links>

## Audit
Phase 4 result: <pass / rejected-then-fixed / hard-fail + why>.

## Live verification
<one line per created/changed URL → `200 OK` or `FAILED <code>`; every URL must appear>

## IndexNow
<URLs submitted + HTTP status, or "skipped — no key / failure / no-changes">

## Left for human
- `<keyword or url>` — <why it was dropped: unresolved duplicate, would require regenerating a page, ambiguous>

## Blocker (only if the run stopped early)
<what stopped it and the exact reason; omit on success>
```

**Step 2 — call the helper** (`--summary` = the RESULT, or what failed + why):

```bash
REPO="$(git remote get-url origin | sed -E 's#(git@github.com:|https://[^/]*/)##; s#\.git$##')"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"; SHA="$(git rev-parse HEAD)"
.claude/scripts/send-routine-email.py \
  --status <success|failure|no-changes> \
  --skill keyword-gap-pass-auto \
  --site "<BASE_URL discovered in Phase 0>" \
  --repo "$REPO" --branch "$BRANCH" \
  --summary "<RESULT e.g. 'Refreshed 9 competitors; 14 gap rows; shipped 6 new pages + enriched 4; all 200; IndexNow 200.' — or 'FAILED at Phase 4 audit: <what> because <why>; all changes rolled back.'>" \
  --details-file /tmp/keyword-gap-pass-auto-$(date +%Y-%m-%d).md \
  --commit-sha "$SHA" --commit-url "https://github.com/$REPO/commit/$SHA"
```

For no-changes / failure with no commit, pass `--commit-sha ""` and `--commit-url ""`. The email helper is best-effort — if it fails, log to stdout but don't fail the routine.

## What this skill MUST NOT do

- **Never** ask a human anything, at any phase boundary.
- **Never** modify `/keyword-gap-pass` or its phase files.
- **Never** edit a file in the high-blast-radius list.
- **Never** push if the Phase 4 audit failed.
- **Never** regenerate, rewrite wholesale, or delete an existing page (rule 6c).
- **Never** submit a URL to IndexNow that did not return 200.
- **Never** hardcode `SEMRUSH_API_KEY` into a file, or fabricate gap/volume/KD figures when the API is unavailable.

## Reference

Original (manual) skill: [/keyword-gap-pass](.claude/commands/keyword-gap-pass.md)
Phase files: `.claude/commands/keyword-gap-pass/phase-*.md`
Gap script: `scripts/semrush_keyword_gap.py`
Email helper: `.claude/scripts/send-routine-email.py`

## IndexNow Fallback Key (workflow-wide)

If any phase hits an IndexNow error — the site's `public/<32-hex>.txt` challenge file is missing, the key can't be discovered, or the API returns a key-verification error (403/422) — **fall back to this project-wide key**:

- **env var name:** `INDEXNOW_KEY`
- **key value (default):** `dc557f6bfced447aa1a71771d8a0d24a`

When falling back:
1. Create `public/dc557f6bfced447aa1a71771d8a0d24a.txt` containing `dc557f6bfced447aa1a71771d8a0d24a` (filename = key = content) so search engines can verify.
2. Commit + push it as part of the run, before the IndexNow POST fires, so the challenge file is live.
3. After the deploy is verified, retry the POST using this key.
4. If the retry still fails, note the HTTP status in the report but do NOT block the rest of the run.

Prefer the env var if set; otherwise use the hard-coded default above.
