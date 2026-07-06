---
description: AUTONOMOUS nightly GA4 top-pages growth engine. Pulls the top-10 most-VISITED pages (last 24h, ALL traffic — direct/AI/referral/organic) from Google Analytics 4, then audits EACH page individually and asks "what does this winning page need next?" — new spoke/sibling pages, comparison/alternatives/worth-it coverage, body+FAQ enrichment, metadata fixes (GSC-evidence-gated), or an on-page tool/quiz/calculator. Decisions are driven by SEO traffic data (GA4 + per-page GSC) and Google Autocomplete. Per-page cooldown ledger stops it re-auditing the same sticky top-10 every night. NO human gates. Designed for scheduled cloud runs (4 AM, after the 2 AM GSC trend pass).
argument-hint: "(no arguments — fully autonomous)"
---

# /ga4-top-pages-pass-auto — nightly per-page growth audit of the top-10 visited pages

> **‼️ RUN-WIDE RULE — READ FIRST.** Fully autonomous, NO human checkpoint anywhere. Never print "Want me to proceed?" or any question at any phase boundary. If a hard blocker fires, you **still finish** by sending an email report and exiting 0. The cloud routine has no human watching; any blocking question silently kills it.

> **‼️ NEVER WRITE UNDER `.claude/` AT RUNTIME.** Creating or editing ANY path under `.claude/` (tools, commands, scripts, settings) triggers the harness's sensitive-file permission prompt, which PAUSES the unattended run and kills the automation — this is exactly how a prior run died (`mkdir .claude/tools/autocomplete-paa`). `.claude/` is read-only during a run. If a helper/tool this skill references is missing in this repo, do NOT create it under `.claude/` — use the repo's `scripts/` equivalents, inline stdlib Python in `/tmp`, or the lane's documented inline fallback. The same applies to every other permission-prompting action (installing to system paths, editing files outside the repo): if an action would require approval, SKIP it, use the fallback, and note it in the digest.

**The one question this engine asks:** *"For each page real visitors chose in the last 24 hours — across ALL channels, including the AI/direct traffic GSC can't see — what should we build or improve NEXT around it?"* This is NOT the trend pass. It never looks for a shared theme across the ten pages; it audits each page on its own merits. Its levers, per page:

1. **Spoke / sibling pages** — is the winning page missing obvious siblings in whatever archetypes THIS site uses (discovered from its existing slugs — e.g. vertical/industry spokes, explainer/hub, roundup, and any site-specific families)?
2. **Comparison / alternatives / worth-it coverage** — does the page's topic have its `X-vs-Y`, `X-alternatives`, and "is X worth it"/pricing coverage where demand exists? (dedup against the site's comparison engine + pricing archetypes if it has them)
3. **Body / FAQ enrichment** — which autocomplete sub-intents around the page's head term are not answered on the page?
4. **Metadata** — ONLY when per-page GSC data proves the page underperforms its impressions (evidence-gated, see caps).
5. **On-page tools / quizzes / calculators** — when autocomplete shows tool-intent (calculator / checker / template / quiz / generator) for the page's topic.

This is a thin orchestrator. ALL phases are this pass's own, at `.claude/commands/ga4-top-pages-pass/phase-*.md` — read each file when you reach it. Do not paraphrase any phase file from memory, and do NOT read the trend-pass phase files — this engine is fully self-contained and its semantics differ (per-page, DEFERRED supported, tools/metadata/enrichments are first-class actions).

## Hard pre-flight checks (FIRST, before Phase 0)
If any check fails → skip the run, email a failure report (see Email section), exit 0. No commit, no push.

1. **Working tree must be clean.** `git status --porcelain` non-empty → skip, email failure.
2. **Branch is committable.** Cloud routines run on an ephemeral `claude/*` branch — expected. Commit your changes there, then deploy to `main` per the Git model below. Only abort on detached HEAD with no branch name.
3. **Credentials.** `python3 -c "import google.oauth2.service_account"` must succeed (else `pip install google-auth requests`), and one of `$GOOGLE_REPORTING_SA_JSON` / `$GOOGLE_REPORTING_SA_FILE` / `~/.claude/secrets/gsc-service-account.json` must exist. The SAME service account serves both APIs this pass uses: GA4 (pull auto-re-scopes to `analytics.readonly`) and GSC (`webmasters.readonly`, for the per-page metadata evidence). Missing → email failure, exit 0. **Do NOT fall back to Ahrefs/any MCP in cron runs.**
4. **Candidate ledger (self-bootstrapping):** `reports/trend-pass/ledger.md` (SHARED with the trend passes where they exist — slug-level dedup across all nightly engines). **If missing, CREATE it** with a header row (`# Candidate ledger` + a `| slug | status | source | reason | date |` table header) — a fresh repo with no prior nightly pass simply starts an empty ledger. Absence is NOT a blocker. Same for the page-audit ledger `reports/trend-pass/ga4-page-audits.md` — auto-created on first run.
5. **Resend secrets (best-effort, NOT a gate).** Absent → do the work, print the report to stdout, skip only the email.

> **Git model (authorized deploy path = `main`).** Publishing to **`main`** is the authorized, intended deploy path for this scheduled routine — the same path **every other nightly routine in this repo uses to ship** (that is how the repo deploys; there is no separate staging branch or PR flow for these passes). The routine message that invokes this skill states the same. Steps: commit your changes on the current ephemeral `claude/*` branch, then `git fetch origin main && git rebase origin/main && git push origin HEAD:main`. Do NOT open a PR or create extra branches. **Deploy only AFTER** the Phase 4 adversarial audit passes and the Phase 6 200-verify succeeds — a failed audit/verify reverts the offending change before the push. If the `main` push still conflicts after 3 rebased retries, push the ephemeral branch instead and email a manual-merge note (never force-push `main`).

## Site facts (portable — nothing site-specific is hardcoded)
This skill is repo-agnostic. The **routine message supplies this site's GA4 property id, base URL, and inline `GOOGLE_REPORTING_SA_JSON`** as literal values. Pass them as flags on each command that needs them, prefixing the SA inline — env vars do NOT persist across separate Bash calls, so never rely on an `export`. Never hardcode a property id or domain in these files.
- **GA4 property id** — the value the routine states; pass via `--property-id` (Phase 0).
- **BASE_URL** — the value the routine states; pass via `--base-url` / `--page` (Phase 1 GSC evidence) and `--site` (email). If the routine omits it, auto-discover from the repo (existing `reports/*/*.md` front-matter `site:`/`base_url:`, or the canonical helper in `src/`).
- **GSC property** — derived from BASE_URL automatically by the evidence tool.

## Execution — phases in order

| Phase | File | Purpose |
|---|---|---|
| 0 | `ga4-top-pages-pass/phase-0-pull.md` | Top-10 most-visited pages (24h) from GA4 + channel split |
| 1 | `ga4-top-pages-pass/phase-1-page-audit.md` | Per-page: classify → cooldown filter → per-page GSC evidence |
| 2 | `ga4-top-pages-pass/phase-2-opportunity-mine.md` | Per audited page: the 5 lanes → unified candidate list |
| 3 | `ga4-top-pages-pass/phase-3-dedup.md` | 4-layer dedup (incl. comparison-engine history) + route-based winner protection |
| 4 | `ga4-top-pages-pass/phase-4-execute-publish.md` | Write pages + enrichments + metadata + tools → audit → ledgers → push → 200s → IndexNow |

**Early exits (SUCCESS, not failure):**
- All 10 pages on cooldown and no deferred drain available → digest "All top-10 pages on cooldown; nothing to do", `--status no-changes`, exit 0. Expected often — sticky sites surface the same winners nightly; the cooldown ledger is what keeps this pass cheap.
- Audited pages produced zero surviving candidates after dedup → digest with the per-page verdict table, `--status no-changes`, exit 0.

## The only cap (yours)
- **≤10 new pieces of content per audited source page** (new pages + tools spawned from that page's audit, combined). Overflow → `ledger.md` as DEFERRED against that page. There is NO run-wide page cap, NO enrichment cap, NO metadata cap, NO tool cap, and NO limit on how many pages are audited per night — every eligible page is audited and every candidate that clears Phase 3 ships.

## Data-safety rules (NOT caps — these prevent the routine from destroying existing content; kept unless you remove them)
- **Never rewrite/regenerate an existing page's body.** Enrichment = append sections only. (Removing this lets the unattended routine overwrite live pages.)
- **No consolidation/redirects — ever.**
- **A metadata rewrite only fires when that page's GSC verdict is `underperforming` + `rewrite_recommended`** — this is Lane D's trigger condition, not a numeric ceiling (it stops the routine rewriting titles on pages that are already working).
- **Digest email passes the site voice standard** (your standing email-voice mandate).

## Ledgers
- `reports/trend-pass/ledger.md` (SHARED) — candidate-level KEPT/DROPPED/DEFERRED. Every candidate this pass ships or kills is appended here, tagged `source: ga4-top-pages`. Any slug/intent already KEPT or DROPPED here (by ANY pass) is never re-emitted.
- `reports/trend-pass/ga4-page-audits.md` (THIS PASS's own) — one row per audited page: `route | audit date | views at audit | actions taken (counts per lane) | deferred remaining`. This drives the Phase 1 cooldown. Create with a header row if missing.

## Email digest (ALWAYS sent — success, failure, or no-changes)

Write `/tmp/ga4-top-pages-pass-<YYYY-MM-DD>.md` with these EXACT headings (write "None this run" where empty):

```markdown
## Per-page verdict table
| page | views | non-organic % | audited or skipped (why) | actions |
(all 10 rows — cooldown-skipped pages included with their next-eligible date)

## Pages shipped (N)
- **<Title>** → <live URL> (for winner <route>, lane: spoke / comparison / worth-it)

## Body & FAQ enrichments (N)
- **<route>** — <section added> (autocomplete sub-intent: "<query>")

## Metadata rewrites (N)
- **<route>** — old→new title | GSC evidence: <impressions, CTR vs threshold> | Stage 4: passed

## Tools built (N)
- **<route>** — <tool> (autocomplete tool-intent: "<query>") | Stage 4: passed

## Deferred (N)
## Flagged for the human (winner protection) (N)
## Ledger deltas
## Audit
## IndexNow
## Blocker (only if the run stopped early)
```

Send exactly as the trend pass does (`.claude/scripts/send-routine-email.py`), `--skill ga4-top-pages-pass-auto`, `--site "$GA4_BASE_URL"`. For no-changes/failure with nothing committed: `--commit-sha "" --commit-url ""`.

## What this skill MUST NOT do
- **Never** ask a human anything.
- **Never** look for a cross-page "trend" — that is the other pass's job. Per-page only.
- **Never** audit a page inside its cooldown window (Phase 1 rules) except to drain its own DEFERRED rows.
- **Never** emit a candidate whose slug/intent appears in `ledger.md` as KEPT or DROPPED (any source), or that duplicates comparison-engine history.
- **Never** touch metadata without the GSC `underperforming` + `rewrite_recommended` evidence, and never more than 3/night.
- **Never** exceed any nightly cap, under any reasoning.
- **Never** widen the Phase 0 pull beyond the top-10 pages list (+ channel split).
- **Never** commit secrets or `.env` files.

## Reference
GA4 pull: `scripts/trend_pass/ga4_pull_24h.py` · Per-page GSC evidence: `.claude/tools/gsc-search-analytics/gsc_search_analytics.py` · Slug inventory: `scripts/trend_pass/slug_inventory.py` · Autocomplete miner: `scripts/trend_pass/mine_trend_autocomplete.py` · Comparison conventions: `.claude/commands/comparison-content-creator/phase-1b-coverage-check.md` + `phase-3-generate.md` · Worth-it archetypes: `docs/pricing-engine.md` · FAQ-gap method: `.claude/commands/question-gap-pass/phase-2-questions.md` + `phase-3-coverage.md` · Tool builds: `.claude/commands/downloadable-asset-pass/phase-3c-tool-build.md` · Content standard: `.claude/commands/seo-gsc-pass/phase-3-new-content.md` + `phase-4-audit.md` · Email: `.claude/scripts/send-routine-email.py`

## IndexNow Fallback Key (workflow-wide)

If any phase hits an IndexNow error — the site's `public/<32-hex>.txt` challenge file is missing, the key can't be discovered, or the API returns a key-verification error (403/422) — **fall back to this project-wide key**:

- **env var name:** `INDEXNOW_KEY`
- **key value (default):** `dc557f6bfced447aa1a71771d8a0d24a`

When falling back:
1. Create `public/dc557f6bfced447aa1a71771d8a0d24a.txt` with content `dc557f6bfced447aa1a71771d8a0d24a` (filename = key = content).
2. Commit + push it as part of the run (before the IndexNow POST) so the challenge file is live.
3. After the deploy is verified, retry the IndexNow POST with this key.
4. If retry still fails, note the HTTP status in the digest but do NOT block the rest of the run.

Prefer the env var if set; otherwise use the hard-coded default above.
