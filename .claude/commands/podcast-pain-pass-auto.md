---
description: AUTONOMOUS weekly podcast pain-mining SEO routine for ModernWallet. Pulls new episodes of transcript-ready personal-finance podcasts, mines the money decisions/calculations listeners are stuck on, SEMRUSH-validates the real search terms, dedups against the site, and ships new guides / comparisons / roundups end-to-end (Astro). NO human gates. Designed for scheduled cloud runs.
argument-hint: "(no arguments — fully autonomous)"
---

# /podcast-pain-pass-auto — weekly podcast → personal-finance content (ModernWallet)

Turns podcast mining into an unattended weekly routine. The flow is EXPAND → VALIDATE → EXECUTE: Phase 0 expands the week's episodes into a free-form brief; Phase 1 validates it (3 lenses — direct intent via `validate_terms.py`, adjacent demand via the bundled Autocomplete miner + SEMRUSH, vs/alternatives/worth-it + roundup blend per entity), dedups against the whole site, and emits the standard chart; Phase 2 reuses ModernWallet's own content engine (guided-write per `CONTENT.md` → adversarial audit → build → deploy to `main` → 200-verify → IndexNow). The human manifest gate is replaced with **deterministic auto-approval**.

> **‼️ RUN-WIDE RULE.** Fully autonomous — there are NO human gates. Every phase auto-continues. You **MUST NOT** print "Want me to proceed?", "Should I push?", or any question at any phase boundary. The only stops are the deterministic safety gates below (empty week → no-op email; circuit-breaker → hold + email). A blocking question silently kills a cloud run. If a hard blocker fires, you **still finish** by sending an email and exiting 0.

## Pre-flight (abort cleanly + email `failure` if any hard dep is missing)
- `SEMRUSH_API_KEY` set (else abort — never fabricate volume).
- `npm run build` works (Astro). Node available in the cloud runner.
- **Working tree clean** (`git status --porcelain` empty). If dirty → skip, email `failure` ("uncommitted changes would be swept into the routine commit"). Capture `origin/main` base. Cloud runs on an ephemeral `claude/*` branch — that is the normal case; the only abort is detached HEAD with no branch name. Never abort merely because the branch is not `main`.
- Resend keys resolvable by `.claude/scripts/send-routine-email.py` (best-effort; a missing email key NEVER blocks content shipping — do the full run, print the report to stdout).
- IndexNow key file `public/dc557f6bfced447aa1a71771d8a0d24a.txt` present (it is; else create it, commit, and retry the ping).
- No pip installs needed: every helper in `scripts/podcast_pain_pass/` is stdlib-only (SEMRUSH via urllib).

## Unattended-run rules (fleet standard)
- **This run is scheduled and unattended** — no one can answer questions mid-run. The deterministic rules in Phase 1 stand in for approval gates. On a step failure, handle it per these instructions (retry, degrade to `no-changes`, or email `failure`) rather than stopping to ask.
- **SECRET HANDLING:** never commit secrets or leave them in the working tree. Keys arrive as inline env vars (`SEMRUSH_API_KEY`, `RESEND_*`); if a tool needs a credentials file, write it under `/tmp` (outside the repo) and delete it when done.
- **Every exit path sends the email** — success, no-changes, circuit-breaker hold, and failure alike. A run that ends silently is a bug.
- **Self-contained:** use ONLY files bundled in THIS repo's `.claude/` and `scripts/` (the phase files, the `podcast_pain_pass/*` scripts, `.claude/tools/autocomplete-paa/`, `.claude/scripts/send-routine-email.py`, `CONTENT.md`). Never reference `~/.claude/` — it does not exist in cloud runs.
- Stranded-branch safety net: if the final push to `main` fails after retries, push the ephemeral `claude/*` branch as-is and email a manual-merge note.

## Flow (each phase = a file in `.claude/commands/podcast-pain-pass/`; read it when you reach it)

```
Phase 0 — EXPAND (mine → brief)   .claude/commands/podcast-pain-pass/phase-0-mine.md
   pull_new_episodes.py (RSS transcript-tag diff vs ledger) → mine_pain.py → compose brief.md
   (per-vertical finance themes + pain quotes + seed phrases + entities). NO SEMRUSH here.
        │
        ▼  (NO_NEW_EPISODES or empty clusters → email `no-changes`, STOP)
Phase 1 — VALIDATE + CHART   .../phase-1-validate-chart.md
   3 lenses (direct intent via validate_terms.py · adjacent demand via the Autocomplete
   miner + SEMRUSH · vs/alternatives/worth-it + roundup blend per entity) → cluster →
   SEMRUSH-validate (floor 70) → adversarial duplicate-suppression gate → chart → AUTO-APPROVE
        │
        ▼  (0 survivors → email `no-changes`, STOP · >30 survivors → CIRCUIT-BREAKER: email + hold)
Phase 2 — EXECUTE + PUBLISH   .../phase-2-execute-publish.md
   ModernWallet content engine: write records into src/data/{guides,comparisons,roundups}.ts
   (guided-write per CONTENT.md) → adversarial audit vs dist/ → npm run build →
   deploy to main → 200-verify → IndexNow. Then email `success` with links + update ledger.
```

## Deterministic auto-approval (replaces the human manifest gate)
A candidate term SHIPS this week iff ALL hold:
1. **Demand:** SEMRUSH volume ≥ the 70/mo floor (Lens-1 via `validate_terms.py`; Lens-2/3 expansions via batched `phrase_these`/`phrase_kdi`). An expansion phrase with no tool volume survives only with explicit repeated-autocomplete evidence, labeled as such.
2. **Net-new:** the adversarial duplicate-suppression reviewer (Phase 1, read-only Explore subagent) confirms NO existing page/route already targets it. Already-shipped → DROP, record in ledger as covered, never re-litigate.
3. **Format:** `guide` / `comparison` / `roundup` → build end-to-end (real records). `calculator-spec` → spec file only (a human builds the tool later).
4. **Circuit-breaker:** surviving count > 30 in one run → do NOT ship; write the chart, email a `failure`/hold note ("abnormal volume — review"), STOP. (Runaway backstop; the volume floor + dedup are the real limiter — most weeks yield a handful or zero.)

## Non-negotiables (ModernWallet content system)
- **Update & add, never regenerate/delete** an existing record. New records are net-new routes only. **Never touch the `*-business.ts` files** (the separate B2B compliance vertical).
- **TS-safety / static export:** a single malformed record breaks the whole Astro build. No `: undefined` fields — omit optional keys. Single-quoted or properly escaped strings, no smart quotes, escape apostrophes. `npm run build` MUST pass before push.
- **Objectivity (YMYL finance):** comparison/roundup pages are neutral — **ModernWallet is never a ranked option**. Every option real; never fabricate prices/rates. Cite primary sources (CFPB/Fed/IRS/FTC/SEC/Experian/BLS).
- **Number accuracy:** every figure on a page must come from the real calculator engine (`src/lib/*`) ground truth — never invented.
- **Byline:** `[[Jonathan Velez]]` + review date render from the record/site date fields via `Byline.astro` — **never** written into body prose.
- **Sitemap is auto-generated** by `@astrojs/sitemap` at build — never hand-edit sitemap XML.

## Git model (cloud-safe deploy to main)
Cloud routines run on an ephemeral `claude/*` branch. Commit there, then publish to `main` (this repo auto-deploys from `main`):
```bash
git fetch origin main && git rebase origin/main && git push origin HEAD:main
```
Retry the rebase up to 3×. On an unresolved conflict, push the ephemeral branch and email a manual-merge note — never force-push `main`, never open a PR, never `git checkout main`. Any `git reset`/`git checkout --` uses `HEAD`/the file, never `origin/main`.

## Email report (best-effort, never fails the run)
On completion (success / no-changes / failure) send via:
```bash
.claude/scripts/send-routine-email.py --status <success|no-changes|failure> \
  --skill podcast-pain-pass-auto --site "https://www.themodernwallet.com" \
  --repo "$(git remote get-url origin | sed -E 's#(git@github.com:|https://[^/]*/)##; s#\.git$##')" \
  --branch "$(git rev-parse --abbrev-ref HEAD)" \
  --summary "<result or failure reason>" --details-file /tmp/podcast-pain-pass-auto-$(date +%Y-%m-%d).md \
  --commit-sha "$(git rev-parse HEAD)" --commit-url "https://github.com/<repo>/commit/<sha>"
```
**‼️ Every `success` email MUST list all new pages.** The helper's `clean_details` keeps only concrete "what changed" sections and drops analytics/roster/table noise, so the details file's FIRST and guaranteed-surviving section is the full new-page list — see Phase 2 "After push + verify" step 2 for the exact `## New pages shipped` format (one `[Title](full-URL)` bullet per page, all of them, never a count-only line). Everything else (episodes pulled, pain clusters, validated terms, what was deduped, backlog/circuit-breaker note) is optional context that may be stripped — the new-page list is the part that must always render. `podcast-pain-pass-auto` is registered in the helper's `SKILL_LABELS` + `SKILL_SHORT` dicts.

## Ledger (`reports/podcast-pain-pass/ledger.json`)
- `shows.<name>.processed_guids` — episode GUIDs already mined (written by `pull_new_episodes.py`; prevents re-mining).
- `shipped_slugs` — every slug this routine has shipped; the dedup reviewer treats these as covered. Append after a successful push.
- `deferred_rows` — approved-but-unbuilt rows carried to the next run (Phase 1 drains them first).
- Never re-mine a processed GUID; never re-ship a shipped slug.
