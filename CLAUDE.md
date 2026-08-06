# Project conventions — modernwallet

## Routine publishing doctrine — LIVE-AND-VERIFIED is the definition of done

Applies to EVERY scheduled routine run in this repo (content passes, audits, and the
fleet watchdog alike). This overrides any softer wording in a routine's own prompt.

**A run is not done until its intended content is LIVE on production and you have
verified it yourself.** These are NOT done:
- "committed to main" · "branch landed" · "deploy triggered" · "IndexNow submitted"

Done = the real URL returns **HTTP 200 serving the new content** (or, for DB-backed
sites, the row is present in the **prod** store AND the page renders it).

### What "live" means depends on this repo's architecture — determine it, don't assume
- **Static / SSG (Next.js export, etc.)** — live = merged to the deploy branch AND the
  host finished deploying AND the changed URL 200s with the new content. A push only
  *starts* this; confirm the deploy landed, then 200-check.
- **DB-backed app (Flask/Postgres/Supabase — e.g. lawfareclaims.org, rankandpay.org)** —
  live = content UPSERTED into the **prod** database AND the page 200s with it. A git
  push publishes NOTHING here; the publish is a database write.
- **No reachable publish path** (no prod DATABASE_URL / no DB egress / secret-gated /
  deploy hook unavailable) — you CANNOT get it live. Record **status=error** with the
  exact blocker. Never label unpublished work "posted", "rescued", or "shipped".

### Stalled runs must be FINISHED, not checkpointed
If a run died mid-way (e.g. stopped after a Phase 0 data pull), **run the remaining
phases** — diagnose → fix → publish → verify — and get the intended content live.
Landing the checkpoint commit and moving on is NOT a rescue; it leaves the job undone.

### Verify, don't trust the log
A routine claiming "live-verified" in its own commit message proves nothing. **200-check
a sample of the changed URLs.** A 404/500/stale body is an **error to fix**, not a green row.

### Reporting rules
- Headline metric is **LIVE-VERIFIED** (confirmed by you this run), never "posted to main".
- Anything on main you could NOT 200-verify is **error**, not posted.
- Never guess-fix content: if getting live needs secrets, external APIs, or an editorial
  judgment call you cannot safely make, stop and record status=error with the exact cause.
- Never force-push, never delete branches, never rewrite another routine's history.
