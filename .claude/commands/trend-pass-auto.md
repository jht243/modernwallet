---
description: AUTONOMOUS WEEKLY content engine with TWO lanes. Pulls the top-10 GSC queries + top-10 pages (7 days) plus the top-20 queries. Lane A (trend) detects a shared theme top-down and, only for a ledger-NEW trend, mines missing content around it (autocomplete + SEMrush). Lane B (coverage) runs EVERY run and finds top-20 queries with no dedicated page. Both lanes dedup (ownership is never a skip reason), are capped at 5 additive pages PER LANE (up to 10), auto-publish via the repo's own content approach, and email a Resend digest. NO human gates. Designed for scheduled cloud runs.
argument-hint: "(no arguments — fully autonomous)"
---

# /trend-pass-auto — WEEKLY top-down trend detection → capped auto-publish (portable)

> **‼️ RUN-WIDE RULE.** Fully autonomous, NO human checkpoint anywhere. Never ask a question at any phase boundary. On any hard blocker, still finish by sending an email report and exiting 0.

**The two questions this engine asks:** (1) *Trend lane* — "What did the last 7 days' winning pages have in common, and what good page is missing from that theme?" (fires only on a genuinely NEW trend); (2) *Coverage lane* — "Are any of our top-20 queries missing a dedicated page?" (runs EVERY run, trend or not). Portable weekly sibling of the Layer3 nightly engine; it auto-discovers this repo's structure rather than hardcoding one.

## Hard pre-flight (FIRST) — any failure → email failure, exit 0, no commit
1. **Working tree clean** for your files (`git status --porcelain`); if the tree has unrelated dirty files from other crons, DO NOT touch them — stage only your own trend-pass files by pathspec.
2. **Branch committable** (cloud `claude/*` branch expected). "push" = `git fetch origin main && git rebase origin/main && git push origin HEAD:main` (this deploys straight to `main` — intended, no approval needed).
3. **GSC credentials** present (`$GOOGLE_REPORTING_SA_JSON` / SA file). Missing → email failure.
4. **Ledgers exist** (`reports/trend-pass/trends.md` + `ledger.md`). Missing → email failure.
5. **Resend secrets** best-effort: present → email; absent → do the work, print report, skip email only.
6. **SEMrush key** best-effort (NOT a gate): `$SEMRUSH_API_KEY` (from `~/.claude/secrets.env`). Absent/dry → Phase 3 demotes a rung on the demand ladder (SEMRUSH → Ahrefs → public-source estimate) rather than skipping; autocomplete runs regardless. Note the rung in the digest (`Keyword data: ahrefs (SEMRUSH units exhausted)`). Never block the run on this. See `.claude/commands/_keyword-demand-ladder.md`.

## Site facts (discover in this repo)
- BASE_URL / GSC property: use the `--base-url` given in the trigger; property is `sc-domain:<host>`.
- **Auto-build surface (discover):** find how THIS repo adds a page — an additive data file (e.g. `data/*.ts`, a Python data tuple, a content/markdown dir) or a bundled generator. Prefer the additive data/markdown surface. Content is written via `.claude/commands/seo-gsc-pass/phase-3-new-content.md` (verbatim) + audited via `phase-4-audit.md`. If no clean additive surface exists, build via the repo's existing seo-gsc-pass / comparison-content approach. NEVER rewrite an existing page.

## Execution — phases in order
| Phase | File | Purpose |
|---|---|---|
| 0 | `trend-pass/phase-0-pull.md` | Top-10 queries + top-10 pages + top-20 queries, **7 days** |
| 1 | `trend-pass/phase-1-trend-detect.md` | **Trend lane:** classify → clear-trend rule → trend-ledger match |
| 1b | `trend-pass/phase-1b-coverage.md` | **Coverage lane (EVERY run):** find top-20 queries with no dedicated page |
| 2 | `trend-pass/phase-2-matrix.md` | Entity × angle coverage gaps via the breadth framework (NEW trends only) |
| 3 | `trend-pass/phase-3-autocomplete.md` | Autocomplete **+ SEMrush** expansion (seeds = trend entities ∪ uncovered coverage queries) |
| 4 | `trend-pass/phase-4-dedup.md` | Content-existence dedup + winner protection, both lanes (ownership is NEVER a skip reason) |
| 5 | `trend-pass/phase-5-execute-publish.md` | Build ≤5 additive pages PER LANE (up to 10) → audit → ledgers → push → 200s → IndexNow |

**Two-lane control flow.** Phase 1 decides ONLY the trend lane; Phase 1b (coverage) runs **every run regardless**. Phase 1's old "exit / ALL WORK STOPS" outcomes now mean only "the trend lane contributes no candidates" — the run always continues to Phase 1b:
- Phase 1 finds **no clear trend** → trend lane empty; **still run Phase 1b**, then Phases 3–5 on whatever coverage found.
- Phase 1 finds a trend that **matches a `trends.md` row** → trend lane stops (no trend mining/building, no backlog); **still run Phase 1b**. An already-caught trend ships zero *trend* pages — coverage may still ship.
- Phase 1 finds a **ledger-NEW trend** → trend lane runs Phases 2–5 **and** Phase 1b also runs; candidates merge at Phase 4.

**The ONLY full early-exit (SUCCESS, `--status no-changes`, exit 0):** BOTH lanes produce zero build candidates after dedup — no new trend AND every top-20 query already covered/winner-protected. A run that ships even one coverage page is `--status success`.

## Breadth framework (BOTH lanes — capture all the angles, don't ship a sliver)
Whenever a trend or an uncovered query centers on a discrete entity (product, brand, service, tool, compound…), expand it into the full angle cluster — deep-dive, comparison, alternatives, pricing, is-it-worth-it, how-to-use, safety, evidence, roundup — not a single narrow page. One winning query means the whole topic has demand. Framework + entity-type presets + the HARD fit gate: [`.claude/commands/trend-pass/_breadth-framework.md`](trend-pass/_breadth-framework.md); Phase 2 (trend) and Phase 1b (coverage) both apply it. **The fit gate is load-bearing: only build an angle that genuinely fits AND has enough groundable information — never fabricate a fact to complete a cluster, never force an angle that doesn't fit. A relevant omission beats a forced page.** Clusters obey the per-lane cap; on the coverage lane a large cluster completes over several runs.

## Hard guardrails
1. **Additive only** — never rewrite/regenerate an existing page.
2. **"Owned by another engine" is NEVER a stop/drop reason.** Build any good, non-existent opportunity; overlap is resolved solely by content-existence dedup (mutual — whoever writes it first wins).
3. **Cap: 5 new pages/run PER LANE (not 5 total) — up to 10/run.** Each lane caps its own survivors independently; neither eats the other's budget. Trend-lane overflow is flagged + dropped (no backlog); coverage-lane overflow is flagged but left un-ledgered so it re-competes next run.
4. **Winner protection (BOTH lanes)** — a candidate overlapping a top-10 page's clicking queries is flagged, never auto-built.
5. **YMYL caution** — for finance/legal/health/medical claims, ground facts in the repo's own sourced content; never invent figures, statutes, doses, or advice. If facts can't be grounded, flag instead of building.
6. **Digest email passes the site voice standard** like every Resend report.

## Email digest (ALWAYS sent) — write `/tmp/trend-pass-auto-<YYYY-MM-DD>.md` with EXACT headings, split into two top-level sections that mirror the two lanes (each heading present, "None this run" if empty; nothing pooled across lanes):
**`# Trends` (Lane A):** `## Trend verdict` · `## Trend pages shipped (N)` (title → live URL) · `## Trend — flagged for the human (N)` (winner-protection / over-cap-dropped / non-groundable).
**`# Query check` (Lane B — the top-20 uncovered-query check):** `## Coverage verdict (top-20 queries)` (covered / winner-protected / uncovered counts + the uncovered queries built) · `## Query-check pages shipped (N)` (title → live URL, coverage query "<query>") · `## Query-check — flagged for the human (N)` (winner-protection / over-cap-not-ledgered).
**`# Run details` (shared):** `## SEMrush expansion` (status + keyword count, or "skipped — no key") · `## Ledger deltas` · `## Audit` · `## IndexNow` · `## Blocker`.

**Email SUBJECT is fixed for this routine.** It is always `Trend (yes|no) / Query (yes|no)` and nothing else — pass it verbatim as `--headline`, substituting each lane's own verdict: `yes` = that lane shipped at least one page this run, `no` = it shipped none. The `--summary` stays the longer one-liner (it becomes the inbox preview).

```bash
REPO="$(git remote get-url origin | sed -E 's#(git@github.com:|https://[^/]*/)##; s#\.git$##')"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"; SHA="$(git rev-parse HEAD)"
.claude/scripts/send-routine-email.py --status <success|failure|no-changes> \
  --skill trend-pass-auto --site "<BASE_URL>" --repo "$REPO" --branch "$BRANCH" \
  --headline "Trend (<yes|no>) / Query (<yes|no>)" \
  --summary "Trend: <NO — no clear trend / YES — <theme>>. Query check: <NO — all top-20 already covered / YES — N page(s): <titles>>.<deploy/verify note if anything shipped>" \
  --details-file /tmp/trend-pass-auto-$(date +%Y-%m-%d).md \
  --commit-sha "$SHA" --commit-url "https://github.com/$REPO/commit/$SHA"
```
No-changes/failure with nothing committed → `--commit-sha "" --commit-url ""`. Helper is best-effort; log to stdout on failure, never error the routine.

## What this skill MUST NOT do
- Never ask a human anything.
- Never do any *trend-lane* work on a trend that matches a `trends.md` row — stop the trend lane, no queue/backlog. (This does NOT stop the run — the coverage lane still runs.)
- Never drop a candidate because another engine covers that surface (only existence + winner-protection).
- Never rewrite an existing page, exceed **5 new pages per lane** (≤10 total: ≤5 trend + ≤5 coverage — capped separately, never pooled), or invent YMYL facts.
- Never widen the *trend* input beyond the two top-10 lists (`coverage_queries[20]` feeds only the coverage lane, not trend detection).
- Never hardcode the SEMrush key into a committed file — it comes from `$SEMRUSH_API_KEY` only. Never commit secrets/.env.

## Reference
Breadth framework: `.claude/commands/trend-pass/_breadth-framework.md` · Pull: `scripts/trend_pass/gsc_pull_7d.py` (adds `coverage_queries[20]`) · Inventory: `scripts/trend_pass/slug_inventory.py` · Autocomplete: `scripts/trend_pass/mine_trend_autocomplete.py` · SEMrush expansion: `scripts/trend_pass/semrush_trend_expand.py` (best-effort, `$SEMRUSH_API_KEY`) · Ledgers: `reports/trend-pass/{trends,ledger}.md` · Content: `.claude/commands/seo-gsc-pass/phase-3-new-content.md` + `phase-4-audit.md` · Email: `.claude/scripts/send-routine-email.py`

## IndexNow Fallback Key (workflow-wide)
On any IndexNow error (missing `public/<32-hex>.txt`, key not discoverable, 403/422), fall back to env `INDEXNOW_KEY` (default `dc557f6bfced447aa1a71771d8a0d24a`): create `public/<key>.txt` containing the key, commit+push before the POST, retry; if still failing, note the status in the digest and continue.
