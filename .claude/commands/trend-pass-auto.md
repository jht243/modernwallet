---
description: AUTONOMOUS WEEKLY trend-detection content engine. Pulls ONLY the top-10 GSC queries + top-10 pages over the last 7 days, detects a shared theme top-down, hard-stops if the trend is already in the ledger, and — only for a genuinely NEW trend — mines missing content around it, dedups (ownership is never a skip reason), auto-publishes up to 5 additive pages via the repo's own content approach, and emails a Resend digest. NO human gates. Designed for scheduled cloud runs.
argument-hint: "(no arguments — fully autonomous)"
---

# /trend-pass-auto — WEEKLY top-down trend detection → capped auto-publish (portable)

> **‼️ RUN-WIDE RULE.** Fully autonomous, NO human checkpoint anywhere. Never ask a question at any phase boundary. On any hard blocker, still finish by sending an email report and exiting 0.

**The question this engine asks:** *"What did the last 7 days' winning pages have in common — and what good page is missing from that theme?"* Portable weekly sibling of the Layer3 nightly engine; it auto-discovers this repo's structure rather than hardcoding one.

## Hard pre-flight (FIRST) — any failure → email failure, exit 0, no commit
1. **Working tree clean** for your files (`git status --porcelain`); if the tree has unrelated dirty files from other crons, DO NOT touch them — stage only your own trend-pass files by pathspec.
2. **Branch committable** (cloud `claude/*` branch expected). "push" = `git push origin HEAD` (the trigger may override to publish to main).
3. **GSC credentials** present (`$GOOGLE_REPORTING_SA_JSON` / SA file). Missing → email failure.
4. **Ledgers exist** (`reports/trend-pass/trends.md` + `ledger.md`). Missing → email failure.
5. **Resend secrets** best-effort: present → email; absent → do the work, print report, skip email only.

## Site facts (discover in this repo)
- BASE_URL / GSC property: use the `--base-url` given in the trigger; property is `sc-domain:<host>`.
- **Auto-build surface (discover):** find how THIS repo adds a page — an additive data file (e.g. `data/*.ts`, a Python data tuple, a content/markdown dir) or a bundled generator. Prefer the additive data/markdown surface. Content is written via `.claude/commands/seo-gsc-pass/phase-3-new-content.md` (verbatim) + audited via `phase-4-audit.md`. If no clean additive surface exists, build via the repo's existing seo-gsc-pass / comparison-content approach. NEVER rewrite an existing page.

## Execution — phases in order
| Phase | File | Purpose |
|---|---|---|
| 0 | `trend-pass/phase-0-pull.md` | Top-10 queries + top-10 pages, **7 days**, nothing more |
| 1 | `trend-pass/phase-1-trend-detect.md` | Classify → clear-trend rule → **hard-stop on ledger match** |
| 2 | `trend-pass/phase-2-matrix.md` | Entity × content-format coverage gaps (NEW trends only) |
| 3 | `trend-pass/phase-3-autocomplete.md` | Trend-scoped autocomplete expansion |
| 4 | `trend-pass/phase-4-dedup.md` | Content-existence dedup + winner protection (ownership is NEVER a skip reason) |
| 5 | `trend-pass/phase-5-execute-publish.md` | Build ≤5 additive pages → audit → ledgers → push → 200s → IndexNow |

**Early exits (both SUCCESS):**
- Phase 1 finds **no clear trend** → digest (`--status no-changes`, "No clear trend in the 7d top-10s"), exit 0.
- Phase 1 finds a trend that **matches a `trends.md` row** → **ALL WORK STOPS**: no mining, no building, no backlog/queue. Digest ("Trend already caught on <date>: <theme> — no work"), exit 0. There is no deferred queue.

## Hard guardrails
1. **Additive only** — never rewrite/regenerate an existing page.
2. **"Owned by another engine" is NEVER a stop/drop reason.** Build any good, non-existent opportunity; overlap is resolved solely by content-existence dedup (mutual — whoever writes it first wins).
3. **Cap: 5 new pages/run.** Overflow flagged in the digest + dropped, never queued.
4. **Winner protection** — a candidate overlapping a top-10 page's clicking queries is flagged, never auto-built.
5. **YMYL caution** — for finance/legal/health/medical claims, ground facts in the repo's own sourced content; never invent figures, statutes, or advice. If facts can't be grounded, flag instead of building.
6. **Digest email passes the site voice standard** like every Resend report.

## Email digest (ALWAYS sent) — write `/tmp/trend-pass-auto-<YYYY-MM-DD>.md` with EXACT headings (each present, "None this run" if empty):
`## Trend verdict` · `## Pages shipped (N)` (title → live URL) · `## Flagged for the human (N)` (winner-protection / over-cap / non-groundable) · `## Ledger deltas` · `## Audit` · `## IndexNow` · `## Blocker`.

```bash
REPO="$(git remote get-url origin | sed -E 's#(git@github.com:|https://[^/]*/)##; s#\.git$##')"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"; SHA="$(git rev-parse HEAD)"
.claude/scripts/send-routine-email.py --status <success|failure|no-changes> \
  --skill trend-pass-auto --site "<BASE_URL>" --repo "$REPO" --branch "$BRANCH" \
  --summary "<RESULT: e.g. 'NEW trend <theme>: shipped 3 pages; pushed + IndexNow.' or 'Trend already caught <date> — no work.' or 'No clear trend in 7d top-10s.'>" \
  --details-file /tmp/trend-pass-auto-$(date +%Y-%m-%d).md \
  --commit-sha "$SHA" --commit-url "https://github.com/$REPO/commit/$SHA"
```
No-changes/failure with nothing committed → `--commit-sha "" --commit-url ""`. Helper is best-effort; log to stdout on failure, never error the routine.

## What this skill MUST NOT do
- Never ask a human anything.
- Never do ANY work on a trend that matches a `trends.md` row — STOP immediately, no queue/backlog.
- Never drop a candidate because another engine covers that surface (only existence + winner-protection).
- Never rewrite an existing page, exceed 5 new pages/run, or invent YMYL facts.
- Never widen the Phase 0 pull beyond the two top-10 lists. Never commit secrets/.env.

## Reference
Pull: `scripts/trend_pass/gsc_pull_7d.py` · Inventory: `scripts/trend_pass/slug_inventory.py` · Miner: `scripts/trend_pass/mine_trend_autocomplete.py` · Ledgers: `reports/trend-pass/{trends,ledger}.md` · Content: `.claude/commands/seo-gsc-pass/phase-3-new-content.md` + `phase-4-audit.md` · Email: `.claude/scripts/send-routine-email.py`

## IndexNow Fallback Key (workflow-wide)
On any IndexNow error (missing `public/<32-hex>.txt`, key not discoverable, 403/422), fall back to env `INDEXNOW_KEY` (default `dc557f6bfced447aa1a71771d8a0d24a`): create `public/<key>.txt` containing the key, commit+push before the POST, retry; if still failing, note the status in the digest and continue.
