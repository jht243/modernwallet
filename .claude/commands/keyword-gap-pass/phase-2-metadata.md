# Phase 2 — Metadata fixes

Act on every **metadata** row in the chart.

Please go ahead and update the metadata per your suggestions.

Change ONLY head-level fields (title, meta description, H1, OG/schema strings) — no body edits (that's Phase 5). Make these as **targeted, in-place `Edit` operations** on the existing file — never regenerate or rewrite the whole page/file, and never run a script that does. Everything outside the specific head fields stays byte-for-byte unchanged.

Honor the discovered title/description length limits (char limit before any auto brand-suffix; description truncation point).

## Metadata-rewrite decision policy (universal — applies to any project)

The blanket "≥2 prior rewrites → skip forever" rule is REPLACED by a date-bounded + performance-aware policy. For each candidate metadata change, run the three gates below in order. The first gate that fires decides the outcome. Record the decision in the run summary so the policy is auditable.

### Gate 1 — Cooldown (rewrite-history dates)

Find the date of the most recent commit that changed this page's metaTitle / metaDescription / H1, and count metadata-changing commits in the last 90 days:

```bash
# Last change date
git log -1 --format=%ad --date=short -G "metaTitle|metaDescription|<h1|pageTitle|pageDesc" -- <file>
# Recent churn count
git log --since="90 days ago" --format=%H -G "metaTitle|metaDescription|<h1|pageTitle|pageDesc" -- <file> | wc -l
```

**Per-slug refinement for shared data files** (e.g. `data/guides.ts`, `data/verticals.ts`): the raw `git log` above counts ANY metadata change in the file, even for OTHER slugs. For a file with ≥2 page entries, also run a per-slug check (`git log` per commit, then `grep -B20 -A20 "slug:.*<this-slug>" | grep metaTitle/metaDescription/h1`). Use the per-slug count as authoritative.

**Decision rules (date-aware, severity-aware):**
- **If `days_since_last_change < 7`** → **HARD DEFER**. You (or someone) just changed this within the last week; let it land. Record `deferred — hard cooldown, last change N days ago`.
- **If `7 ≤ days_since_last_change < 21`** → **SOFT DEFER**. Defer ONLY IF Gate 2 says the page is `performing` well. If Gate 2 says `underperforming` / `no-data` / `mixed`, the current title isn't working anyway — APPROVE the rewrite even though we're inside the 21-day window. Record either `deferred — soft cooldown + page performing` or `approved (despite N-day cooldown — GSC says current title underperforming)`.
- **If `rewrites_in_last_90_days >= 3` (per-slug for shared files)** → **AI auto-decides via severity, no human flag**:
  - Pull GSC impressions for last 30 days (Gate 2 will do this anyway).
  - If `impressions_30d >= 1000` → **AUTO-APPROVE churn override**. Page has real traffic exposure; prior rewrites missed the issue, but the cost of NOT fixing a high-traffic underperformer outweighs the risk of another rewrite. Use the GSC top-impression query (Gate 3) — this attempt is data-driven, not a guess. Record `approved (churn override, M imp on N prior rewrites)`.
  - If `impressions_30d < 1000` → **AUTO-DEFER, route to body**. Page isn't big enough to justify another swing; the keyword goes into body work on the same page. Record `deferred (churn, M imp too low to warrant another rewrite — routed to body)`.
  - Rationale: 1000 imp/30d ≈ 33 imp/day = enough scale that even a 1% CTR delta returns ≥10 extra clicks/month; below that, signal isn't strong enough to be confident the next rewrite will outperform the last 3.
- **Otherwise** → continue to Gate 2.

The crude "≥2 lifetime rewrites" rule is NO LONGER USED. A page rewritten 6 times across 18 months but untouched for 5 months is perfectly fair game.

### Gate 2 — GSC performance check (mandatory)

Pull live GSC performance for the page before deciding. Two compatible sources — use whichever is available:

**Primary (project-agnostic, uses the existing service account):**
```bash
.claude/tools/indexing-issues-gsc-pass/.venv/bin/python \
  .claude/tools/gsc-search-analytics/gsc_search_analytics.py \
  --base-url <project base URL> \
  --page <full page URL> \
  --trend
```
Returns JSON including a `verdict` object with `rewrite_recommended: true|false` and reason. Auth uses `~/.claude/secrets/gsc-service-account.json` (same SA as the URL Inspection tool) — no per-project setup beyond the SA having GSC property access.

**Alternative (Ahrefs MCP):** if the project has the Ahrefs MCP connected and is registered as an Ahrefs project, call `gsc-page-history` and `gsc-keyword-history` for the same data. Either source is acceptable as long as the verdict logic below is applied.

Apply the verdict:
- **`performing`** (CTR ≥ 5% AND impressions trending up over 30 days) → **DEFER**. Current title is working; don't risk it. Record `deferred — performing well (CTR X%, trend up)`.
- **`underperforming`** (any of: CTR < 3% at avg pos < 10 / impressions trending down / 0 CTR on ≥50 impressions) → **APPROVE**. Continue to Gate 3.
- **`no-data`** (0 GSC impressions in window) → **APPROVE — no risk**. Continue.
- **`mixed`** → **APPROVE with caution**. Continue.

### Gate 3 — Top-impression keyword selection (Steve Toth #8–12)

For pages that cleared Gates 1 + 2, choose WHICH keyword to use. Prefer the keyword generating the highest impressions in the GSC data for this page over the more generic head term, even if tool-reported search volume is lower or zero. Specificity + real impression data beats generic + assumed volume.

### Recording the decision

For every metadata row, the run summary lists exactly one disposition: `approved (reason)`, `deferred — cooldown (N days)`, `deferred — churn (N rewrites in 90d)`, or `deferred — performing (CTR X%, trend up)`. This makes the policy auditable across runs.

`git add`. Do not commit.

## Reviewer gate (Explore subagent)
- ☐ only head/meta diffs — zero body lines changed
- ☐ each change matches its chart row
- ☐ titles/descriptions within the discovered length limits
- ☐ no new title duplicates a prior historical title for that file

Reject with specifics; retry rule 4 (2 attempts then STOP) applies.

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The moment this phase's reviewer gate PASSES, immediately begin the next phase in the SAME turn. Do NOT stop. Do NOT print "Want me to proceed?", "Should I continue?", "Next: Phase X", or any question or hand-off that waits for a human reply.

The `/keyword-gap-pass` run has EXACTLY TWO human stops, and this phase is NOT one of them:
- Stop 1: the Phase 0 manifest approval (before any edits).
- Stop 2: the Phase 8 summary approval (before the push).

Everything between those two — including this phase — runs automatically. The reviewer gates are adversarial SUBAGENTS, not human checkpoints; a passing gate means YOU proceed on your own. Keep going until you reach Stop 2 (Phase 8).
