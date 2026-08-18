---
description: AUTONOMOUS weekly podcast pain-mining SEO routine for themetabolicjournal.com. Pulls new episodes of transcript-ready hormone / menopause / longevity / lab-testing podcasts, mines the symptoms & unanswered questions listeners are searching help for, SEMRUSH-validates the real search terms, dedups against the site, and ships new informational health pages end-to-end via the site's own content engine. NO human gates. Designed for scheduled cloud runs.
argument-hint: "(no arguments — fully autonomous)"
---

# /podcast-pain-pass-auto — weekly podcast → patient-pain health content

Turns a podcast-mining run into an unattended weekly routine. It mines TRANSCRIPT-READY health podcasts for the symptoms/struggles/questions listeners voice, validates real demand on SEMRUSH, dedups, and ships new informational pages by reusing **this repo's OWN content engine** (`seo-gsc-pass` phase-3 write → phase-4 audit → sitemap → push main → 200-verify → IndexNow), exactly as `trend-pass-auto` does. The human manifest gate is replaced with **deterministic auto-approval**.

> **‼️ RUN-WIDE RULE.** Fully autonomous — NO human gates. Every phase auto-continues. The only stops are the deterministic safety gates (empty week → no-op email; >20 survivors → circuit-breaker hold + email). Never ask the user anything.

## Pre-flight (abort cleanly + email `failure` if any hard dep is missing)
- Keyword demand via `scripts/lib/keyword_data.py` — SEMRUSH → Ahrefs → public-source estimate. **No key is a precondition and the run NEVER aborts for a dry key**; it demotes a rung and labels estimated rows. See `.claude/commands/_keyword-demand-ladder.md`.
- Git tree clean; capture `origin/main` base. Cloud runs on an ephemeral `claude/*` branch.
- Resend keys resolvable by the repo's send-routine-email helper (best-effort; never fail the run on email).
- No pip installs needed: every helper in `scripts/podcast_pain_pass/` is stdlib-only (SEMRUSH via urllib).

## Unattended-run rules (fleet standard)
- **Scheduled + unattended** — no one answers mid-run. The deterministic rules in Phase 1 stand in for approval. On failure: retry, degrade to `no-changes`, or email `failure` — never stop to ask.
- **SECRET HANDLING:** never commit secrets or leave them in the working tree. Keys arrive as inline env vars from the trigger; if a tool needs a credentials file, write it under `/tmp` and delete it when done.
- **Every exit path sends the email** — success, no-changes, circuit-breaker hold, failure alike. A silent run is a bug.
- **Self-contained:** use ONLY files bundled in this repo's `.claude/` (the phase files, the repo's `seo-gsc-pass` phases, the send-routine-email helper). Never reference `~/.claude/` — it does not exist in cloud runs.
- Stranded-branch safety net: if the final push to `main` fails after retries, push the ephemeral `claude/*` branch as-is and email a manual-merge note.

## Flow (each phase = a file in `.claude/commands/podcast-pain-pass/`; read it when you reach it)

```
Phase 0 — EXPAND (mine → brief)   .claude/commands/podcast-pain-pass/phase-0-mine.md
   pull_new_episodes.py (RSS diff vs ledger) → mine_pain.py → compose brief.md
   (themes + pain quotes + seed phrases + entities). NO SEMRUSH here.
        │
        ▼  (NO_NEW_EPISODES or empty clusters → email `no-changes`, STOP)
Phase 1 — MINDMAP PASS (build-brief duplicate)   .../phase-1-validate-chart.md
   the podcast brief runs through the full mindmap-pass flow: 3 lenses
   (direct intent · adjacent-demand via Autocomplete miner + SEMRUSH
   phrase_questions/related · vs/alternatives/pricing per entity) →
   cluster → SEMRUSH-validate (floor 70) → adversarial dedup gate →
   standard chart → deterministic AUTO-APPROVE
        │
        ▼  (0 survivors → email `no-changes`, STOP · >20 survivors → CIRCUIT-BREAKER: email + hold)
Phase 2 — EXECUTE + PUBLISH   .../phase-2-execute-publish.md
   reuse THIS repo's seo-gsc-pass phase-3 (new content) → phase-4 (adversarial
   audit) → sitemap → commit + push main + 200-verify + IndexNow submit.
   Then email `success` with links + update ledger.
```

## Deterministic auto-approval (replaces the human manifest gate)
A candidate term SHIPS this week iff ALL hold:
1. **Demand:** SEMRUSH volume ≥ the floor already applied by `validate_terms.py` (default 70/mo).
2. **Net-new:** the Phase-1 adversarial dedup reviewer (read-only Explore subagent) confirms NO existing page/route already targets it. Already-covered → DROP, record in ledger, never re-litigate. Be conservative on YMYL topics the site already covers.
3. **Format:** informational query → new guide/symptom/condition/labs page (Phase 2 builds it via the repo engine). A rare commercial "best/vs" term → the repo's comparison mechanism.
4. **Under the circuit-breaker:** >20 survivors in one run → do NOT ship; write the chart, email a hold note, STOP.

## Non-negotiables
- **YMYL health is the hard rule.** Ground every medical claim in sourced content or a reputable primary source; NEVER invent dosages, lab ranges, stats, or advice; include the site's medical disclaimer. A podcast sentence anchors search intent ONLY — never present it as fact. Un-groundable claim → drop the page.
- **Update & add, never regenerate/delete** an existing page. New pages are net-new routes only.
- **First-mention company/study links** per the repo's first-mention rule (respect any render-time auto-link registry — registered entities stay plain).
- Match the site's CTA / disclosure / byline standard; byline renders from date metadata, never in body prose.

## Git model (cloud-safe push to main)
Cloud routines run on an ephemeral `claude/*` branch. Commit there, then publish:
```bash
git fetch origin main && git rebase origin/main && git push origin HEAD:main
```
Retry the rebase up to 3×. On an unresolved conflict, push the ephemeral branch and email a manual-merge note — never force-push `main`, never open a PR, never `git checkout main`.

## Email report (best-effort, never fails the run)
On completion (success / no-changes / failure) send via the repo's `send-routine-email` helper with `--skill podcast-pain-pass-auto --site "https://www.themetabolicjournal.com"` and a details file.

**‼️ Every `success` email MUST list all new pages.** The helper's `clean_details` keeps only concrete "what changed" sections and drops analytics/roster/table noise, so the details file's FIRST and guaranteed-surviving section is the full new-page list — see Phase 2 step 6 for the exact `## New pages shipped` format (one `[Title](/route)` bullet per page, all of them, never a count-only line). Anything else (episodes pulled, pain clusters, validated terms, what was deduped, circuit-breaker note) is optional context that may be stripped — the new-page list is the part that must always render. Register `podcast-pain-pass-auto` in the helper's `SKILL_LABELS` + `SKILL_SHORT` dicts if absent.

## Ledger (`reports/podcast-pain-pass/ledger.json`)
- `shows.<name>.processed_guids` — episode GUIDs already mined (written by `pull_new_episodes.py`; prevents re-mining).
- `shipped_slugs` — every slug this routine has shipped; the dedup reviewer treats these as covered. Append after a successful push.
- Never re-mine a processed GUID; never re-ship a shipped slug.
