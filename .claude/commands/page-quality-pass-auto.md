---
description: AUTONOMOUS page-quality engine. Pulls the top-visited pages (28-day window, ALL traffic) from GA4 WITH engagement metrics (avg engagement time, engagement rate, bounce rate, 90%-scroll), finds the pages real visitors chose but that are UNDER-SERVING them (low dwell + high bounce + low engagement vs their archetype's norm), diagnoses WHY each one fails (thin body / dead-end / tool-intent / intent-mismatch), and fixes THE PAGE ITSELF — section-level rewrites, next-step internal links, embedded tools, GSC-gated metadata. Every edit passes the adversarial audit before publish. Complements ga4-top-pages-pass (which builds AROUND winners); this pass improves the winners themselves. NO human gates. Designed for scheduled cloud runs.
argument-hint: "(no arguments — fully autonomous)"
---

# /page-quality-pass-auto — fix the visited pages that fail their readers

> **‼️ RUN-WIDE RULE — READ FIRST.** Fully autonomous, NO human checkpoint anywhere. Never print "Want me to proceed?" or any question at any phase boundary. If a hard blocker fires, you **still finish** by sending an email report and exiting 0. The cloud routine has no human watching; any blocking question silently kills it.

> **‼️ NEVER TOUCH `.claude/` AT RUNTIME — not create, edit, delete, `mkdir`, `rm`, `git checkout`, or `mv`.** ANY write/delete under `.claude/` (tools, commands, scripts, settings, or a `__pycache__` inside them) triggers the harness's sensitive-file permission prompt, which PAUSES the unattended run and kills the automation. Rules:
> - `.claude/` is **strictly read-only** for the whole run. If a helper the skill references is missing, do NOT create it under `.claude/` — use the repo's `scripts/` equivalents, inline stdlib Python in `/tmp`, or the lane's documented fallback.
> - **Do NOT clean up build artifacts.** Leave `__pycache__/`, `*.pyc`, and `*.tsbuildinfo` where they are — they are gitignored and will not enter your commit.
> - **Stage ONLY the exact content files you created/edited, by explicit path** (`git add <path> <path> …`). NEVER `git add -A` or `git add .`.
> - Any action that would require approval (writing outside the repo, installing to system paths, cleaning `.claude/`) → SKIP it, use the fallback, note it in the digest. NEVER pause for a prompt.

**The one question this engine asks:** *"Of the pages real visitors actually chose, which ones are failing to serve them — and how do we fix THE PAGE so the next visitor gets what they came for?"*

This is the inverse of `/ga4-top-pages-pass-auto`. That pass audits winners and builds NEW things around them (spokes, comparisons, satellites) and is APPEND-ONLY on existing bodies. THIS pass selects on **weak engagement among visited pages** and is allowed to **rewrite the under-serving sections themselves** — under a mandatory adversarial audit. The two engines share ledgers so they never churn the same page in the same cycle (see Cross-engine rules).

**Why a 28-day window (not 24h):** engagement rates on a day of traffic (~a handful of sessions per page) are pure noise. Quality diagnosis needs a stable sample; 28 days matches the GA4 UI default and smooths weekday/weekend swings. This also means the pass is naturally slower-moving than the nightly builders — most nights it will find its targets already treated and on cooldown. That is correct behavior, not a failure.

This is a thin orchestrator. ALL phases live at `.claude/commands/page-quality-pass/phase-*.md` — read each file when you reach it. Do not paraphrase any phase file from memory, and do NOT substitute another pass's phase files — the semantics here (engagement selection, diagnosis before action, section REWRITES) exist only in this pass.

## Hard pre-flight checks (FIRST, before Phase 0)
If any check fails → skip the run, email a failure report (see Email section), exit 0. No commit, no push.

1. **Working tree must be clean.** `git status --porcelain` non-empty → skip, email failure.
2. **Branch is committable.** Cloud routines run on an ephemeral `claude/*` branch — expected. Commit there, then deploy to `main` per the Git model below. Only abort on detached HEAD with no branch name.
3. **Credentials.** `python3 -c "import google.oauth2.service_account"` must succeed (else `pip install google-auth requests`), and one of `$GOOGLE_REPORTING_SA_JSON` / `$GOOGLE_REPORTING_SA_FILE` / `~/.claude/secrets/gsc-service-account.json` must exist. The SAME service account serves GA4 (auto re-scoped to `analytics.readonly`) and GSC (`webmasters.readonly`). Missing → email failure, exit 0. **Do NOT fall back to Ahrefs/any MCP in cron runs.**
4. **Ledgers (self-bootstrapping):** this pass's page ledger `reports/page-quality-pass/page-quality-audits.md` and the shared candidate ledger `reports/trend-pass/ledger.md`. **If missing, CREATE them** with a header row. Absence is NOT a blocker.
5. **Resend secrets (best-effort, NOT a gate).** Absent → do the work, print the report to stdout, skip only the email.

> **Git model (authorized deploy path = `main`).** Publishing to **`main`** is the authorized, intended deploy path for this scheduled routine — the same path every other nightly routine in this repo uses to ship (that is how the repo deploys; there is no separate staging branch or PR flow for these passes). The routine message that invokes this skill states the same. Steps: commit on the current ephemeral `claude/*` branch, then `git fetch origin main && git rebase origin/main && git push origin HEAD:main`. Do NOT open a PR or create extra branches. **Deploy only AFTER** the Phase 4 adversarial audit passes and the 200-verify succeeds — a failed audit/verify reverts the offending change before the push. If the `main` push still conflicts after 3 rebased retries, push the ephemeral branch instead and email a manual-merge note (never force-push `main`).

## Site facts (portable — nothing site-specific is hardcoded)
This skill is repo-agnostic. The **routine message supplies this site's GA4 property id, base URL, and inline `GOOGLE_REPORTING_SA_JSON`** as literal values. Pass them as flags on each command that needs them, prefixing the SA inline — env vars do NOT persist across separate Bash calls. Never hardcode a property id or domain in these files.
- **GA4 property id** — pass via `--property-id` (Phase 0).
- **BASE_URL** — pass via `--base-url` / `--page` (Phase 1 GSC evidence) and `--site` (email). If the routine omits it, auto-discover from the repo.
- **GSC property** — derived from BASE_URL automatically by the evidence tool.

## Execution — phases in order

| Phase | File | Purpose |
|---|---|---|
| 0 | `page-quality-pass/phase-0-pull.md` | Top-25 visited pages (28d) from GA4 WITH engagement metrics + channel split |
| 1 | `page-quality-pass/phase-1-diagnose.md` | Archetype-relative weak-signal flagging → cooldown/buffer filter → GSC evidence → per-page DIAGNOSIS |
| 2 | `page-quality-pass/phase-2-prescribe.md` | Per diagnosed page: read the live body, score each section, emit the prescription list |
| 3 | `page-quality-pass/phase-3-execute.md` | Apply prescriptions (section rewrites / links / tools / metadata) + build gate |
| 4 | `page-quality-pass/phase-4-audit-publish.md` | Adversarial audit + regression check → ledgers → push → 200s → IndexNow → email |

**Early exits (SUCCESS, not failure):**
- No page clears the flagging bar (traffic floor + ≥2 weak signals) → digest "No under-engaging pages this window", `--status no-changes`, exit 0. Expected on a healthy site.
- All flagged pages on cooldown/buffer → digest with the per-page table and next-eligible dates, `--status no-changes`, exit 0. Expected often — this pass treats a page at most once per week and defers to the GA4 pass's fresh audits.
- Diagnosis says every flagged page is `QUICK_ANSWER_OK` → digest the verdicts, no edits, exit 0. **A page that answers fast and loses the visitor satisfied is a SUCCESS, not a defect.**

## Caps
**None.** Every page that clears Phase 1 gets diagnosed; every prescription that clears Phase 4's audit ships. What bounds this pass is evidence (the flagging bar), cooldowns, and the audit — not numeric ceilings.

## Data-safety rules (NOT caps — these keep an unattended run from damaging live pages)
- **Section-level rewrites only — NEVER regenerate a whole page.** A rewrite replaces the prose *inside* one diagnosed-weak section at a time. Page slug, route, section count, and heading order are preserved; new sections may be APPENDED for missing high-value sub-intents. Never delete a section.
- **Facts are preserved or improved, never invented.** Research-first: every claim in a rewritten section must be as-verifiable or more-verifiable than what it replaces. If the old section's facts can't be verified, the rewrite states what IS verifiable rather than keeping unverified claims.
- **Only content-archetype pages get body edits** (guides, comparisons, explainers, roundups, vertical spokes, briefings). Conversion/nav/hub pages (home, service, audit/booking, resource hubs, about) are NEVER body-edited by this pass — weak engagement there is a design/UX question; flag it in the digest for the human instead.
- **No consolidation, no redirects, no deletions — ever.**
- **Metadata rewrites require that page's GSC verdict `underperforming` + `rewrite_recommended`**, AND no metadata rewrite for that page already KEPT in the shared ledger within 28 days (the other engine may have just done it).
- ‼️ **`canonicalOverride` must NEVER be set to `undefined`** anywhere in a data record — it breaks the entire static export and tsc cannot catch it. Escape or double-quote every apostrophe in single-quoted generated strings.
- **Render-time rules stay intact:** byline never in body prose; first mention of any external company links to its official site UNLESS the project's auto-link registry covers it (in layer3: `ENTITY_LINKS` in `src/utils/sectionContent.tsx` — CHECK it, never assume); the site's inline CTA component stays below the first body section.
- **Digest email passes the site voice standard** (standing email-voice mandate).

## Cross-engine rules (this pass ↔ ga4-top-pages-pass and the nightly builders)
1. **Own cooldown — HARD 7 days:** a page this pass treated in the prior 7 days is never re-treated (ledger `reports/page-quality-pass/page-quality-audits.md`).
2. **48h buffer vs the GA4 pass:** a page audited by ga4-top-pages-pass in the last **48 hours** (per `reports/trend-pass/ga4-page-audits.md`) is skipped tonight — avoids two engines editing the same file in the same cycle. Older than 48h → eligible: that pass builds satellites and appends; it does NOT fix weak bodies, so deferring longer would leave sick pages sick. (The GLM case that motivated this engine was GA4-audited 3 days before it was still at 6s dwell.)
3. **Action-level dedup via the shared ledger** `reports/trend-pass/ledger.md`: never rebuild a tool, re-emit a slug, or redo a metadata rewrite that ANY pass already shipped (KEPT) or rejected (DROPPED). This pass tags its rows `source: page-quality`.

## The feedback loop (what no other pass has)
Every treatment row in this pass's ledger stores the page's **pre-edit metrics** (sessions, avg_eng_s, engagement_rate, bounce_rate, scrolled_pct, window). On every run, Phase 1 computes an **Improvement Report**: for each page treated **≥14 days ago**, compare current-window metrics to pre-edit metrics and report the deltas in the digest. No automated action is taken from it in v1 — it is the measurement that tells the human whether this engine earns its keep.

## Ledgers
- `reports/page-quality-pass/page-quality-audits.md` (THIS pass's own) — one row per treated page: `route | treated | window | sessions | avg_eng_s | eng_rate | bounce | scrolled_pct | diagnosis | actions | audit`. Drives the 7-day cooldown AND the feedback loop.
- `reports/trend-pass/ledger.md` (SHARED) — one row per shipped/killed candidate action, tagged `source: page-quality`.

## Email digest (ALWAYS sent — success, failure, or no-changes)

Write `/tmp/page-quality-pass-<YYYY-MM-DD>.md` with these EXACT headings (write "None this run" where empty):

```markdown
## Diagnoses & treatments (N)
- **<route>** — <diagnosis> (evidence: <the signals>) → <actions taken>

## Section rewrites (N)
- **<route>** § "<heading>" — why it failed the reader | before→after word count | Stage 4: passed

## Next-step links added (N)
## Tools embedded (N)
## Metadata rewrites (N)
## Flagged for the human (conversion/nav pages with weak engagement) (N)
## Improvement report (pages treated ≥14 days ago)
| page | treated | avg eng before→now | bounce before→now | eng rate before→now |

## Skipped (cooldown / buffer / floor) (N)
## Ledger deltas
## Audit
## IndexNow
## Blocker (only if the run stopped early)
```

Send exactly as the sibling passes do (`.claude/scripts/send-routine-email.py`), `--skill page-quality-pass-auto`, `--site <BASE_URL>`. For no-changes/failure with nothing committed: `--commit-sha "" --commit-url ""`.

## What this skill MUST NOT do
- **Never** ask a human anything.
- **Never** regenerate a full page body, delete a section, consolidate, or redirect.
- **Never** body-edit a conversion/nav/hub page — flag-only.
- **Never** treat a page inside its own 7-day cooldown or the 48h GA4-pass buffer.
- **Never** "fix" a `QUICK_ANSWER_OK` page — low dwell with low bounce/healthy scroll is a satisfied reader.
- **Never** touch metadata without the GSC `underperforming` + `rewrite_recommended` evidence AND the 28-day shared-ledger check.
- **Never** ship ANY edit that has not passed the Phase 4 adversarial audit + regression check.
- **Never** emit an action whose slug/intent appears in `ledger.md` as KEPT or DROPPED (any source).
- **Never** commit secrets or `.env` files.

## Reference
GA4 engagement pull: `scripts/trend_pass/ga4_pull_24h.py --with-engagement --days 28 --top 25` · Per-page GSC evidence: `.claude/tools/gsc-search-analytics/gsc_search_analytics.py` · Slug inventory: `scripts/trend_pass/slug_inventory.py` · Autocomplete miner: `scripts/trend_pass/mine_trend_autocomplete.py` · Write standard: `.claude/commands/seo-gsc-pass/phase-3-new-content.md` · Adversarial audit: `.claude/commands/seo-gsc-pass/phase-4-audit.md` · Tool builds: `.claude/commands/downloadable-asset-pass/phase-3c-tool-build.md` · FAQ-gap method: `.claude/commands/question-gap-pass/phase-2-questions.md` + `phase-3-coverage.md` · Email: `.claude/scripts/send-routine-email.py`

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
