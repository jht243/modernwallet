---
description: AUTONOMOUS daily "Page 1-2 No Clicks Pass". Finds pages Google already SHOWS on page 1-2 for real searches that almost nobody clicks (Search Console + GA4 only, hard fail otherwise), reads what the other results on that search show, and fixes each page the way its lane needs — SNIPPET (#1-10: title, description, an answer block above the intro, wrong facts) or RANK (#11-20: answer-first block, the People-also-ask questions, internal links), plus automatic internal-proof upgrades (180–240w 3-scenario breakdown, break-even counterexample, matching site calculator link, and Publisher's Take / Editor's Note on non-medical sites) whenever an eligible commercial/product page lacks internal proof. Never fake-bumps dates on metadata-only edits. Measures every fix at 28 days and reverts losers. NO human gates. Site-generic via scripts/rank_drop/site.json.
argument-hint: "(no arguments — fully autonomous)"
---

<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
Startup returns a fresh `runId` after verification; pass it via `--run-id` to this run's later startup checks and every `workflow-preflight.py prepare`. Never reuse an old run ID for a new routine, including in the same chat. A runner may instead supply a fresh per-invocation `WORKFLOW_RUN_ID` consistently.
<!-- /workflow-source-freshness-v1 -->

<!-- turn1-telemetry-opt-v1 -->
> **⚡ AUTO-DEPS & 3-PART RANGE PREFLIGHT DELIVERY (2026-11-16):** `scripts/page12/detect.py` (`scripts/rank_drop/detect.py`) auto-installs `google-auth` + `requests` silently — never run `pip install` manually. Whenever `workflow-preflight.py prepare` runs, deliver preflight parts using 6–8 parallel 3-part range calls in ONE turn (`python3 .claude/tools/workflow-delivery-serial.local.py --run-dir <dir> --part 1 --through 3`, `--part 4 --through 6`, etc. = 18–24 parts/turn) rather than 1 part per turn.
<!-- /turn1-telemetry-opt-v1 -->


> **‼️ PIN THE DEPLOY BASE FIRST — before Phase 0 and before ANY commit.**
> ```
> .claude/scripts/deploy-run-to-main.sh mark
> ```
> At deploy time `.claude/scripts/deploy-run-to-main.sh push` replays ONLY this run's commits onto the latest `origin/main`; on a real conflict it aborts (never force-pushes `main`) and you push the run branch + email a manual-merge note.

> **‼️ RUN-WIDE RULE.** Fully autonomous, NO human checkpoint. Never ask a question. **Never end your turn while
> any command, monitor or subagent is still running** — a cloud run whose turn ends goes idle and never finishes. If a hard fail fires, you **still finish** by sending the failure email, then exit.

> **‼️ NEVER TOUCH `.claude/` AT RUNTIME** (no create/edit/delete/mkdir). Stage ONLY the exact files you changed, by explicit path — never `git add -A` / `git add .`. Leave `__pycache__`/`*.pyc` alone.

> **‼️ PROSE RULE.** Any new body text longer than ONE sentence is generated by the API writer — `python3 scripts/lib/content_gen.py section …` per `.claude/commands/_content-generation.md` — with its `.meta.json` committed beside it. One-sentence metadata/fact edits and the 1–2 sentence `reviewer_note` (`Publisher's Take` / `Editor's Note` in `plan.json`, registered by `apply_sections.py`) are the only in-context text. Never require concrete numbers inside `Publisher's Take` / `Editor's Note`, never generate notes on the 4 physician-reviewed medical sites, never write `$` prices on Amazon `/gear/` pages, and never mention `"Dapper Labs"`.

> **‼️ UNBREAKABLE INVARIANT — writer output is never final without its audit.** Nothing ships until Phase 5's adversarial audit passed on that exact text. A rewrite (including one fixing an audit finding) re-triggers the audit.

> **‼️ ENGINE.** This routine reuses rank-drop-recovery's pipeline scripts (`scripts/rank_drop/*`). Prefix EVERY `scripts/rank_drop/…` call with `RD_ENGINE=page-1-2-no-clicks-pass` — it sets the commit prefix, ledger and reports dir. (`scripts/page12/*` set it themselves.)

---

## Why this routine exists (2026-10-07 analysis, `reports/zero-click-analysis/2026-10-07.md`)

Pages on page 1–2 with hundreds or thousands of impressions and almost no clicks fail for different reasons, so one rewrite doesn't fit all:
- **SNIPPET (#1–10):** searchers see us and pick another result. Fix what they see: outdated facts, the title and description, and an opening block that answers the search.
- **RANK (#11–20):** page 2 gets almost no clicks whatever the title says. Fix why Google ranks it on page 2: answer faster than the page-1 results, answer Google's People-also-ask questions, and add internal links.
- **Commercial / Product Internal-Proof Refresh (both SNIPPET and RANK, non-YMYL sites):** whenever a picked commercial, comparison, alternatives, pricing, or hardware review page lacks internal proof (`evidence.internal_proof_gap` in `diagnosis.json`), upgrade it in the same pass with a **180–240 word three-scenario cost/workload/spec breakdown**, an explicit **break-even counterexample**, a contextual link to a **matching site calculator/tool**, and a route-specific **Publisher's Take / Editor's Note** (when `.claude/reviewer-voice-profile.json` exists; numbers optional in the note).
- **Never fixable:** AI-agent/operator queries and navigational searches — `detect.py` drops them.

## ‼️ THE DATA RULE — Google first-party only, hard fail otherwise

Every number about **our site** (which pages qualify, impressions, clicks, CTR, positions, the 28-day verdict) comes from Search Console, GA4 and the Google Search Status Dashboard via `scripts/page12/detect.py` and `scripts/page12/measure.py`. FORBIDDEN for any measurement of our site: Ahrefs, SEMrush, DataForSEO, any estimate or cached report. No fallback rung.

**The one third-party exception:** DataForSEO may be called ONLY through `scripts/page12/serp_read.py`, ONLY in Phase 1, to read what the OTHER results show for each page's main search (titles, snippets, People also ask, AI Overview). Its file is stamped `third_party: dataforseo, purpose: serp_snippets_only`; nothing in it is ever a number about our site.

**Hard fail:** `detect.py` non-zero (10 credentials · 11 auth · 12 API · 13 stale · 14 empty · 15 truncated), `verify_provenance.py` non-zero (exit 20) at the start of any later phase, or `measure.py` non-zero → edit nothing, commit nothing except the FAIL report, send the email with `--status failure`, headline `Page 1-2 No Clicks: HARD FAIL — Google data unavailable`, exit.

## ‼️ THE TWO AUDIT SCOPES (owner rule, 2026-10-07)

| what | scope |
|---|---|
| Writing quality — anti-AI tells, style, voice, lint, link rules | **only the text this run added or changed.** Text already on the page is what Google shows today; it is never graded or "improved". `lint_new_text.py` enforces this in code. |
| **Facts — anything wrong or outdated** | **the whole page.** Every outdated or wrong fact anywhere on the page is corrected with a sentence-level old→new pair and an official source. |

Nothing already on the page is rewritten or removed except: the title and description, and sentences that state an outdated/wrong fact. The answer / scenario block is ADDED above the existing first section.

## Site config & rules

`scripts/rank_drop/site.json` (base URL, GSC + GA4 property, backend, price ledger, IndexNow key) — the same file rank-drop uses; never type site values into commands.

| rule | value |
|---|---|
| Pages fixed per run | **8** (`PAGE12_PICK`), highest expected click gain first |
| Eligible | 500+ impressions/90d (or site 90th-percentile floor ≥150), main real search at #1–20, page CTR < 40% of this site's median CTR for that position band, page 45+ days old, ≤50% synthetic impressions |
| Per-page cooldown | **35 days** (ledger) |
| Shared lock | skip any page ANY routine edited in the last 14 days (`detect.py` checks git) |
| AI-cited pages | marked (`ai_cited`), fixed additively, never removed |
| **Top pages** | GA4 top 30 (90d sessions) or 100+ Google clicks/month → **FACTS lane**: outdated facts corrected, NO title/description/section/link/note change. Up to 3 per run, on top of the 8 |
| **Visible "updated" date** | bumped ONLY by a real substantive content change (new section, verified fact fix) — NEVER by a title/description edit or ReviewerNote-only addition (strictly no fake freshness / no backdating) |
| Ledger | `reports/page-1-2-no-clicks/ledger.jsonl` |
| Reports | `reports/page-1-2-no-clicks/<D>.{json,md}` + `.measure.{json,md}` + `<D>/packets/` |

### Postgres sites (`"backend": "pg_rows"` in `site.json`) — PG LOAD + PG PUBLISH

The cloud runner cannot reach the database directly; every row read/write goes through the Supabase MCP connector's `execute_sql` (`project_id` in `site.json` `"pg.supabase_project_id"`), scripted by `scripts/rank_drop/pg_mcp.py`. Never hand-write SQL, never retype a row by hand.

**PG LOAD** (once, right after Phase 0, BEFORE `prepare.py`):
```bash
python3 scripts/rank_drop/pg_mcp.py select --detect $OUT.json > /tmp/select.sql
```
→ run `/tmp/select.sql` with `execute_sql` → write the returned JSON rows to `/tmp/rows.json` → `python3 scripts/rank_drop/pg_mcp.py save --rows /tmp/rows.json`.

**PG PUBLISH** (once, Phase 6 step 0 — after the audit and every fix/rework/revert is applied):
1. `python3 scripts/rank_drop/pg_mcp.py publish` → prints `<page_key> <file>`. Pass each file's whole contents to `execute_sql` in order, then `python3 scripts/rank_drop/pg_mcp.py done --page '<page_key>' --result '<json>'`.
2. `python3 scripts/rank_drop/pg_mcp.py confirm > /tmp/confirm.sql` → run it → save rows to `/tmp/rows.json` → `python3 scripts/rank_drop/pg_mcp.py save --rows /tmp/rows.json`.
3. If `execute_sql` asks for confirmation or times out: STOP publishing, leave the rest pending, and report it in the email as the blocker.

**Shell:** never `rm` through an unguarded variable (`rm $P/x` is blocked by the runner's safety check); write `rm -f "${P:?}"/"${s:?}"/x`.

## Phase 0 — Detect + measure FIRST (Google only; zero contract/preflight reads if `pages` is empty)

> **Fast-Exit Order:** Run Phase 0 **before** reading `_decision-evidence.md`, `_testing-labels.md`, `load-standards.sh`, or `workflow-preflight.py`. If `detect.py` picks `0` pages, `handoff` is empty, and `measure.py` has `0` `WORSE` reverts, commit + deploy the detect/measure report (so `claude/*` never stays ahead of `main`), send `--status no-changes`, and exit 0 with zero Phase 1–5 standards loaded.

**Run every Phase 0 command in the FOREGROUND with the Bash `timeout` set to 600000 (10 min).**

```bash
python3 -c 'import google.oauth2.service_account, google.auth.transport.requests, requests' 2>/dev/null || \
  python3 -m pip install -q google-auth requests || \
  python3 -m pip install -q --ignore-installed cryptography cffi google-auth requests
python3 -c 'import json;[print(c) for c in json.load(open("scripts/rank_drop/site.json")).get("setup",[])]' | sh
D=$(date -u +%F)
OUT=reports/page-1-2-no-clicks/$D; [ -f $OUT.json ] && OUT=$OUT-$(date -u +%H%M)
python3 scripts/page12/detect.py --out $OUT || HARD_FAIL
python3 scripts/rank_drop/verify_provenance.py $OUT.json || HARD_FAIL
python3 scripts/page12/measure.py --out reports/page-1-2-no-clicks/$D.measure || HARD_FAIL
# Prefix trigger inline RESEND_API_KEY / ROUTINE_INGEST_SECRET / ROUTINE_DIGEST_MODE on page12-noop when not already exported
python3 .claude/tools/routine-fast-exit.py page12-noop --detect $OUT.json --measure reports/page-1-2-no-clicks/$D.measure.json --send-email
```
Read `$OUT.md` and `$D.measure.md`. Use `$OUT` (not `$D`) for every detect-report path below.

**Measurement follow-through (before any new fix):** for every `WORSE` row in `$D.measure.json` with `final: true`, run `RD_ENGINE=page-1-2-no-clicks-pass python3 scripts/rank_drop/revert_page.py --path <path> --sha <first_sha> --date $D` and mark that ledger row `status: reverted` in `reports/page-1-2-no-clicks/ledger.jsonl`.

**No pages picked** (`pages` empty) → commit the reports, send the email (Email section), then run Phase 7 if `handoff` is non-empty; otherwise exit. Success, not failure.

## Phase 1 — Packets, SERP read, diagnosis (code, ~2 min)

```bash
P=$OUT/packets
# Postgres sites: run PG LOAD (Site config § Postgres) before this line

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Follow the sibling `_rendered-page-audit.md`: finish central source research before the preparation PASS; audit the complete rendered pages after all template/affiliate/link changes, block inherited contradictions affecting the answer, and verify exact reviewed output live with `rendered-audit.py` before closing deployment and measurement records. Install that contract and helper with the checkpoint dependencies. A read-only reviewer may write internal evidence receipts without editing content. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->

python3 scripts/page12/prepare.py --detect $OUT.json --out $P
DATAFORSEO_B64=… python3 scripts/page12/serp_read.py --packets $P
python3 scripts/page12/diagnose.py --packets $P
RD_ENGINE=page-1-2-no-clicks-pass python3 scripts/rank_drop/apply_data_refresh.py --packets $P --date $D
```

## Phase 2 — Plan (parallel planner subagents, ONE message)

Once for the run: `bash .claude/tools/load-standards.sh "page-1-2-no-clicks-pass" "phase-2"` (`git add` the standards ledger) and `python3 scripts/lib/content_gen.py preflight` (a failing preflight stops all L4 work — never write body prose by hand instead).

Split the queue into batches of ~4 and launch the planners as several `Agent` calls in ONE message (`run_in_background: false`). Each gets `scripts/page12/PLANNER_TASK.md`, its slug list and `$P`. Planners verify facts against official vendor pages (`WebFetch`), write `fact-edits.json` for outdated sentences on the whole page, and write `plan.json` (including `"reviewer_note"` when `missing_publishers_take` is true, plus `section.prompt.md` and `allowed-urls.txt` for L4 sections, including the 3-scenario breakdown + break-even counterexample + calculator link whenever `internal_proof_gap` is flagged).

## Phase 3 — Generate (parallel API calls)

```bash
GEMINI_API_KEY=… scripts/rank_drop/generate_all.sh $P 6
```
Re-running retries only pages without output; a page that fails twice goes to `## Carried to next run`.

## Phase 4 — Splice + ReviewerNote registration + internal links + commit (code, ~1 min)

```bash
RD_ENGINE=page-1-2-no-clicks-pass python3 scripts/rank_drop/apply_sections.py --packets $P --date $D
python3 scripts/page12/inbound.py --packets $P --date $D
```
If `$P/applied.json` has any `REWORK:` error, fix it NOW: `rework.py` → `generate_all.sh` → `apply_sections.py --rework`.

## Phase 5 — Audit + fix on the remediation ladder (parallel auditors)

**Load and apply `.claude/commands/_remediation-ladder.md` IN FULL.** Every step is a script; do nothing by hand.

1. **Rung 0 — scoped lint:** `RD_ENGINE=page-1-2-no-clicks-pass python3 scripts/rank_drop/lint_new_text.py --packets $P`
2. **Batches:** `RD_ENGINE=page-1-2-no-clicks-pass python3 scripts/rank_drop/audit_batches.py --packets $P`
3. **Audit (parallel, ONE message):** one auditor per brief, prompt exactly `Follow scripts/page12/AUDITOR_TASK.md for <brief path>. Date dir <date dir>.`
4. **Rung 1 — FIX-IN-PLACE:** `RD_ENGINE=page-1-2-no-clicks-pass python3 scripts/rank_drop/apply_fixes.py --packets $P --date $D` → launch fresh re-check auditors until `recheck.json` is empty or only `rework` remains.
5. **Rung 2 — REWORK (new text only):** `RD_ENGINE=page-1-2-no-clicks-pass python3 scripts/rank_drop/rework.py --packets $P --date $D` → `scripts/rank_drop/generate_all.sh $P` → `RD_ENGINE=page-1-2-no-clicks-pass python3 scripts/rank_drop/apply_sections.py --packets $P --date $D --rework` → back to step 1 for those pages. A page past its 2nd rework is restored to the run base (`REVERT`).

## Phase 6 — Deploy once, verify, ledger, email

0. Postgres sites: PG PUBLISH (Site config § Postgres), then commit the snapshots + `applied.jsonl`.
1. `.claude/scripts/deploy-run-to-main.sh push`
2. `RD_ENGINE=page-1-2-no-clicks-pass python3 scripts/rank_drop/finish_run.py --packets $P --date $D`
3. `.claude/scripts/deploy-run-to-main.sh push` again, then email.

## Phase 7 — Engine-unsupported pages → /mindmap-pass (after the email)

`$OUT.json` → `handoff` lists qualifying Page 1–2 pages whose storage format this backend cannot splice directly (e.g. standalone `.astro`/`.tsx` routes or non-landing DB tables). Non-empty `handoff` → mandatory; arm the completion guard first:
```bash
.claude/tools/require-routine-completion.sh arm page-1-2-no-clicks-pass-auto "reports/mindmap-pass/$D-page12-handoff.md" "run /mindmap-pass on the Page 1-2 handoff pages through Phase 9"
```
Then run `/mindmap-pass` with this brief, verbatim, followed by every `handoff` row (path, lane, main search + position, impressions/clicks/CTR vs site median, its top queries):

> Source: Page 1-2 No Clicks pass for <BASE_URL>. Each row is an existing page Google already shows on page 1-2 for real searches (Search Console, 90 days) whose click-through is below this site's median for that position; the pass's own engine can't edit this page type. Improve each EXISTING page in place — no new URLs. SNIPPET lane (#1-10): title, meta description, and a direct answer block above the intro that answers the main search. RANK lane (#11-20): the sections the ranking results cover that this page lacks. On non-YMYL commercial, comparison, alternatives, pricing, or hardware pages missing internal proof, also add a 180–250 word three-scenario cost/workload/spec breakdown, an explicit break-even counterexample, a contextual link to a matching site calculator/tool if one exists, and a route-specific Publisher's Take / Editor's Note when `.claude/reviewer-voice-profile.json` exists (numbers inside the note are optional; skip notes on the 4 physician-reviewed medical sites; zero `$` prices on Amazon `/gear/` pages; never mention `"Dapper Labs"`). Never bump visible updated dates unless substantive body sections or verified fact corrections ship. Facts come from official/primary sources; every existing YMYL, legal and professional-review rule applies.
> Unattended run: save the chart to `reports/mindmap-pass/<YYYY-MM-DD>-page12-handoff.md` (this exact name), treat the Phase 0 manifest as approved, and continue to Phase 9 without stopping.

Run `/mindmap-pass` in this main session (never wrap it in a subagent).

## Email (ALWAYS — success, no-changes, or failure)

Built by code; never write the body by hand.
```bash
SUMMARY=$(RD_ENGINE=page-1-2-no-clicks-pass python3 scripts/rank_drop/email_report.py --packets $P --date $D --detect $OUT.json)
python3 .claude/scripts/send-routine-email.py --status <success|no-changes|failure> --skill page-1-2-no-clicks-pass-auto \
  --site "$(python3 -c 'import json;print(json.load(open("scripts/rank_drop/site.json"))["site"])')" \
  --repo "$(python3 -c 'import json;print(json.load(open("scripts/rank_drop/site.json"))["repo"])')" --summary "$SUMMARY" \
  --details-file /tmp/page-1-2-no-clicks-pass-$D.md --commit-sha <sha or ""> --commit-url <url or "">
```
Append `$D.measure.md` to the details file under `## Results of earlier fixes` before sending.

## MUST NOT
- Use any non-Google source for any measurement of our site, or continue after a hard fail.
- Call DataForSEO anywhere except `serp_read.py`, or use its output as a number about our site.
- Grade or rewrite pre-existing text for style; change any pre-existing sentence except an outdated/wrong fact (with an official source).
- Fake-bump or backdate visible `updated` / `updatedDate` timestamps on metadata-only or ReviewerNote-only edits.
- Touch `.claude/` at runtime, write `$` prices on Amazon `/gear/` pages, generate ReviewerNotes on the 4 physician-reviewed medical sites, require numbers inside `Publisher's Take` / `Editor's Note`, or mention `"Dapper Labs"`.
- Delete, noindex, redirect, consolidate, change slugs or remove sections.
- Touch a page inside its 35-day cooldown or edited by any routine in the last 14 days.
- Ship anything that has not passed the Phase 5 audit.
