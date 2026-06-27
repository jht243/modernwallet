# Phase 2 — Redirect / error-page fixes

Act on every report row in the `fix redirect / error page` bucket: URLs the inspection returned as `Soft 404`, `Not found (404)`, `Server error (5xx)`, `Redirect error`, or a `Page with redirect` that is *not* intentional. This is server-side code work — restoring routes, correcting HTTP status, or fixing redirect chains/loops — using whatever routing/status mechanism Phase 0 discovered for this project (e.g. Flask `@app.route` handlers, Express routes, framework redirect rules). On a static-export project, use build-time redirect/status rules instead of server handlers.

## Worker
For each URL, apply the fix that matches its `coverage_state` (cite the route/file):

- **Soft 404** (200 OK but thin/empty/"not found" content): either give the page real, unique content (if it should exist — coordinate with Phase 4) **or** make the route return a proper `404`/`410` and drop it from the sitemap (queue for Phase 7). A soft 404 must not stay a 200.
- **Not found (404)** for a URL we advertise: decide per case — restore the route/content if it should exist; `301` to the best replacement if it moved; or remove it from the sitemap and internal links if it's genuinely gone (queue removal for Phase 7). Prefer `301`/`410` over leaving a dangling 404 we link to.
- **Server error (5xx)**: a real code bug. Find the failing `@app.route` (or the DB/template path it hits), reproduce, and fix it so the URL returns `200`. If you cannot reproduce/fix confidently, flag `ambiguous — needs human` rather than guessing.
- **Redirect error / chain / loop**: collapse multi-hop redirects to a single `301` to the final canonical target; break any loop. Confirm the final target returns `200` and matches the canonical from Phase 1.
- **Page with redirect that should be a live page**: remove the redirect and serve the page (only if it genuinely should be indexed).

Rules:
- **HARD STOP — never 301 a live, indexed page into another** unless the report explicitly shows it's a duplicate/moved URL. A wrong 301 de-indexes a working page. When unsure, flag for the human.
- **HARD STOP — per-route only, NO site-wide rules (global rule 8a).** Scope every redirect/status fix to the exact reported route(s). Do NOT add or edit catch-all / wildcard / global redirect or rewrite rules, middleware, or any config that changes behavior for routes not in the report — one bad global rule can redirect or break the whole site in a single commit. If the root cause is genuinely site-wide, flag `ambiguous — needs human` instead of fixing it here.
- Use the framework's normal status/redirect mechanisms; match existing route patterns in `server.py`.
- Record every redirect/status change (from → to, old status → new status) for the Phase 8 summary and for Phase 7's sitemap removals. Save the list to `reports/indexing-pass/<date>.status-changes.txt`.
- `git add`. Do not commit.

## Reviewer checklist
- ☐ **per-route only — no catch-all/wildcard/global redirect or rewrite rule, no middleware/config affecting routes not in the report** (auto-REJECT; site-wide root causes go to `ambiguous — needs human`)
- ☐ each change traces to a real `Soft 404` / `404` / `5xx` / `Redirect error` row
- ☐ soft 404s are now either real `200` content or a proper `404`/`410` (never a thin `200`)
- ☐ redirect chains collapsed to a single hop; no loops; final target returns `200`
- ☐ no live/indexed page was 301'd or 410'd without explicit report evidence it should be (else auto-REJECT)
- ☐ 5xx fixes actually resolve the error (or were correctly flagged as needs-human)
- ☐ every status/redirect change recorded in `<date>.status-changes.txt` for Phases 7 & 8

Reject with specifics; max 2 rework attempts, then STOP and escalate.

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The moment this phase's reviewer gate PASSES, immediately begin Phase 3 in the SAME turn. Do NOT stop or ask. The only human stops are Stop 1 (Phase 0 manifest) and Stop 2 (Phase 8 summary); this is neither.
