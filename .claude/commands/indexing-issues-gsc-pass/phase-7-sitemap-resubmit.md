# Phase 7 — Sitemap hygiene + prepare re-submit list (NO submission yet)

Make the sitemap reflect reality (advertise only indexable URLs) and **prepare** the list of URLs to re-submit — but **do NOT fire any IndexNow / Google Indexing call here.** The live submissions are external actions; they must wait until after the Phase 8 approval, so they run in Phase 9 (after the push). This phase only stages file edits and writes the pending submit list.

## Worker
1. **Sitemap hygiene** (in the sitemap generator/file discovered in Phase 0 — a dynamic generator or a static URL list):
   - **Remove** every URL that this run made non-indexable or confirmed dead: the `404`/`410`/redirect targets in `reports/indexing-pass/<date>.status-changes.txt`, plus any URL the inspection flagged as a permanent redirect/duplicate-loser that should no longer be advertised. Never advertise a URL that doesn't return `200`.
   - **Add** any canonical, indexable URL that was missing from the sitemap (e.g. `URL is unknown to Google` pages that should be discoverable).
   - **Refresh `<lastmod>`** to today **ONLY for pages whose content actually changed in THIS run** (real edits in Phases 1–4 and 6) that remain in a sitemap. **Never** stamp `lastmod` on a page that didn't change this run — including every `already-fixed — awaiting recrawl` URL (its fix shipped in an earlier run; it did NOT change now). A false "changed today" stamp teaches Google to distrust your `lastmod` signal site-wide.
2. **Prepare (do NOT send) the re-submit list.** Compute the set = **only URLs actually changed in THIS run** (fixed in Phases 1–4 + pages re-linked in Phase 6) **+ URLs newly added to the sitemap this run**; **exclude** removed/410'd losers **and `already-fixed — awaiting recrawl` URLs** (they didn't change this run — re-pinging an unchanged URL doesn't help and edges toward spam; they were already submitted when the fix originally shipped, so just let Google recrawl).
   - **Then apply the submission-ledger suppression (submit-once, then wait ~30 days).** Load the **persistent** ledger `reports/indexing-pass/submission-ledger.json` (a rolling, NOT-dated state file mapping `url → { last_submitted: <YYYY-MM-DD>, channels: [...] }`, written by Phase 9). For each candidate URL, **drop it from the list if it was submitted within the last 30 days AND did not change in THIS run** — it already got its ping; nagging Google again won't help and looks spammy. A URL that genuinely changed this run is always kept (re-submitting changed content is legitimate); a URL never in the ledger or last submitted >30 days ago is kept. If today's date isn't reliably available, compare dates conservatively and when unsure, suppress (err toward not re-pinging). Note in the Phase 8 summary how many candidates were suppressed by the ledger.
   - Write the surviving set to `reports/indexing-pass/<date>.resubmit.txt`, one URL per line. Note which channels are available (IndexNow key present? Google Indexing client present?) so Phase 8 can state what *will* be submitted. **No API calls in this phase.**
3. `git add` the sitemap/code edits. Do not commit. Nothing external has happened — only staged edits + a pending list.

## Reviewer checklist
- ☐ every status-change loser (`404`/`410`/redirect) removed from the sitemap; nothing non-`200` advertised
- ☐ every missing indexable URL added; `<lastmod>` = today **only for pages whose content actually changed this run** — auto-REJECT any `lastmod` bump on an unchanged page, including `already-fixed — awaiting recrawl` URLs
- ☐ `reports/indexing-pass/<date>.resubmit.txt` = **only URLs changed this run + newly-added URLs** (no removed losers, and NO `already-fixed — awaiting recrawl` / otherwise-unchanged URLs — re-pinging unchanged URLs is excluded by design)
- ☐ **submission-ledger suppression applied** — any candidate submitted within the last 30 days that did NOT change this run was dropped from `resubmit.txt`; URLs that genuinely changed this run were kept; suppressed count noted for the Phase 8 summary
- ☐ **NO IndexNow / Google Indexing call was made in this phase** (submission is deferred to Phase 9, post-approval)
- ☐ available re-submit channels noted for the Phase 8 summary

Reject with specifics; max 2 rework attempts, then STOP and escalate.

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE TO PHASE 8 (which IS a human stop).
The moment this phase's reviewer gate PASSES, immediately begin Phase 8 in the SAME turn — print the summary and then WAIT for approval. Phase 8 is Stop 2. Do not push or commit before it.
