# Phase 1 — Classify by citation → write the defend-ledger → STEAL candidates

The heart of this pass. For every page read in Phase 0, decide who Google's AI Overview cites, and put the page in exactly one bucket. Then write the committed defend-ledger and hand only the STEAL pages to Phase 2. Nothing is edited here.

## 1. Determine OUR domain
The site's own registrable domain, from `BASE_URL` (e.g. `https://www.layer3labs.io` → `layer3labs.io`). Matching is root-domain, case-insensitive, `www.` stripped — the same normalization `serp.py` uses on the cited list.

## 2. Bucket every page (exactly one primary bucket)
Read each route's Phase-0 SERP entry:

| bucket | condition | meaning |
|---|---|---|
| **DEFEND** | `ai_overview_present` AND our domain ∈ `ai_overview_cited_domains` | Google quotes US. Protect it. |
| **STEAL** | `ai_overview_present` AND our domain ∉ cited AND our domain ∈ `top10_domains` | Google quotes a competitor while we rank on page one — the winnable target. |
| **ABSENT** | `ai_overview_present` AND our domain ∉ cited AND ∉ `top10_domains` | An AI Overview exists and we're nowhere. Not an edit — a new-page job. |
| *(none)* | no `ai_overview_present`, or `verdict: unread` | Nothing to do. Log; do not action. |

No AI Overview on a query is the common case and is NOT a finding — never invent one.

## 3. Write the defend-ledger (ALWAYS — this is the pass's core deliverable)
Rewrite `reports/ai-answer-citation-pass/defended-pages.json` IN FULL from the DEFEND set:
```json
{"generated":"<YYYY-MM-DD>","pages":[
  {"route":"/ai-model-pricing","cited_domains":["layer3labs.io"],"cited_since":"<carried from prior file if present, else today>","top_query":"ai model pricing"}
]}
```
- A route already in the prior file that is STILL DEFEND → keep its original `cited_since`.
- A route in the prior file that is NO LONGER DEFEND (we lost the citation) → drop it (record under "Citations lost since last run"). Dropping it is what releases the edit-lock for other routines.
- `git add reports/ai-answer-citation-pass/defended-pages.json` explicitly — it ships in this run's commit even when no page was rewritten.

## 4. Citation share (the KPI)
Count DEFEND vs (DEFEND+STEAL+ABSENT) this run; read last run's counts from the ledger's prior rows. Emit "X of N top queries cite us (last run: Y of M)" for the digest scoreboard.

## 5. Cooldown + buffer filter — STEAL pages only
In order, per STEAL page:
1. **Own cooldown (HARD 7 days):** row in `reports/ai-answer-citation-pass/ai-answer-citation-audits.md` with `seen` date < 7 days ago AND action was a rewrite → SKIP (`cooldown until <date>`).
2. **page-quality-pass buffer (48h):** a page that pass treated < 48h ago (per `reports/page-quality-pass/page-quality-audits.md`) → SKIP (`PQ-buffer`) — never two engines on one file in one cycle.
3. Survivors are this run's STEAL candidates → Phase 2. No survivors → early exit per the orchestrator (a first-class success; the defend-ledger was still refreshed).

## 6. ABSENT handling (no edit — hand off)
List every ABSENT page with its query + the domains Google cites, under the digest's "Absent" heading, for a human to route into `/mindmap-pass` or `/trend-pass`. This pass never creates a new page.

## Output
- The rewritten `defended-pages.json` (staged).
- The STEAL candidate list: per page → route, top query, `ai_overview_cited_domains` (the competitor answer to beat), the cited competitor's page (top-ranked cited domain's URL from `top10_domains` if present), our current ranking position. → `phase-2-enrich.md`.
- The DEFEND / ABSENT / lost-citation / skipped lists + citation-share numbers for the digest.
