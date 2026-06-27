---
description: AUTONOMOUS variant of /autocomplete-pass. NO human gates. Auto-approves the Phase 0 manifest gate and the Phase 8 push gate based on deterministic rules. Sends an email via Resend on completion. Designed for scheduled cloud runs.
argument-hint: "[optional: comma-separated seed phrases to mine | or path to existing chart .md]"
---

# /autocomplete-pass-auto — fully autonomous Google Autocomplete mining → keyword pass (cron-safe)

> **‼️ RUN-WIDE RULE — READ FIRST.** This is the cloud-cron variant of `/autocomplete-pass`. It is **identical** to that skill except for **two** behavioral changes: the Phase 0 chart-approval gate and the Phase 8 push gate are replaced with deterministic auto-decision logic. There is **NO** human checkpoint anywhere. You **MUST NOT** print "Approve chart?", "Should I push?", or any other question at any phase boundary. If a hard blocker fires, you **still finish** by sending an email report and exiting 0.

This is a thin orchestrator. The mining + execution work lives in:
- `.claude/commands/autocomplete-pass.md` (STEPs 1–3: discover + seeds + miner)
- `.claude/commands/keyword-gap-pass/phase-*.md` (Phases 0–9: execution — autocomplete-pass and keyword-gap-pass share these execution phases)
- `.claude/tools/autocomplete-paa/autocomplete.py` (the Autocomplete miner)

Read these files when you reach each step. Do not paraphrase.

## Hard pre-flight checks (do these FIRST)

If any check fails, **skip the run** and email a failure report. Do not commit, do not push.

1. **Working tree clean** — `git status --porcelain` empty.
2. **Branch is committable (NOT required to be `main`).** Cloud routines run on an ephemeral `claude/*` branch — expected. Commit + push the current branch with `git push origin HEAD`. Never `git checkout main`, never create a new branch, never abort just because the branch isn't `main`. Any `git reset` uses `HEAD`, never `origin/main`. Resend key resolves from `$RESEND_API_KEY` (env) or `~/.claude/secrets.env`; if absent, skip email but still complete + push.
3. **Miner script present** — `.claude/tools/autocomplete-paa/autocomplete.py` exists and is executable.
4. **Resend secrets present** in `~/.claude/secrets.env`.

## STEPs 1–3: discover + seeds + mine

Run them exactly as `.claude/commands/autocomplete-pass.md` describes (STEPs 1, 2, 3). If the user passed a chart path as `$ARGUMENTS`, skip mining and go straight to STEP 4 with that chart.

For unattended seed selection (no `$ARGUMENTS` passed), the original skill's rules apply — derive 3–6 seeds from the target-keyword inventory, skipping any seed mined in the last 14 days. **If 0 fresh seeds remain → email no-op and exit 0** ("All seeds were mined within the last 14 days; nothing new to discover").

## STEP 4: load the resulting chart → run Phase 0 (`keyword-gap-pass/phase-0-discover.md`)

The chart is the file the miner saved (or the `$ARGUMENTS` path). Load it and run the rest of Phase 0 verbatim from `.claude/commands/keyword-gap-pass/phase-0-discover.md`.

## Auto-decision at the former Phase 0 chart gate

The original skill stops at Phase 0 for the user to approve the chart. The auto variant replaces that with:

| Chart state | Decision | Email status |
|---|---|---|
| 0 actionable rows (everything was duplicate / already-covered) | skip remaining phases | `no-op` |
| many actionable rows | process **ALL** of them — no cap | (continue) |
| All rows have `no data` from SEMrush (heuristic-only mode) AND the project has Ahrefs MCP available | re-score the survivors against Ahrefs MCP `keywords-explorer-overview` instead of skipping | (continue, note in details) |
| Otherwise | auto-approve, continue to Phase 1 | (continue) |

**No volume cap** — act on every actionable row the chart produced.

## Continue: Phases 1 → 7

5. **Phase 1** — `.claude/commands/keyword-gap-pass/phase-1-consolidation.md` (cannibalization — advisory only, writes no edits)
6. **Phase 2** — `phase-2-metadata.md` (title/description edits)
7. **Phase 3** — `phase-3-new-content.md` (new pages, gated by Phase 4)
8. **Phase 4** — `phase-4-audit.md` (adversarial review of Phase 3 only)
9. **Phase 5** — `phase-5-body.md` (in-place body updates)
10. **Phase 6** — `phase-6-internal-linking.md`
11. **Phase 7** — `phase-7-sitemap-indexnow.md` (sitemap hygiene + prepare IndexNow list; **no external submission yet**)

If Phase 4 audit hard-fails after 2 reworks per the original retry rule, **mark the failing new pages `draft: true`** (do not stop the whole pass — the same fallback the original audit uses for comparison-content). Continue to Phase 5+.

## Auto-decision at the former Phase 8 push gate

| Condition (after Phase 7 returns) | Decision | Email status |
|---|---|---|
| Every new page was drafted by Phase 4 AND every metadata/body edit was reverted by an audit | skip push, `git reset --hard HEAD` | `failure` |
| Any staged edit touches a high-blast-radius path (same list as indexing-pass-auto) | skip push, leave staged | `failure` |
| Otherwise | run **Phase 9** — `.claude/commands/keyword-gap-pass/phase-9-commit-deliver.md` — which commits, pushes, and fires IndexNow | `success` |

## Email report (always sent)

The email must answer, without opening the dashboard: **what ran, on which repo/branch, what was created/changed — or what failed and why.**

**Step 1 — write `/tmp/autocomplete-pass-auto-<YYYY-MM-DD>.md`** with these EXACT headings (write "None this run" if empty):

```markdown
## Seeds mined (N)
- <seed phrase> → <CSV path>

## Pages created (N)
- **<Title>** → `<route>` (new)        ← or any drafted by audit, noted

## Metadata / body edits (N)
- `<route>` — <title/description/body change>

## Keyword chart
<the keyword chart with Coverage + Verdict columns>

## IndexNow
<URLs submitted, or "skipped — failure / no-op">

## Blocker (only if the run stopped early)
<what stopped it and the exact reason; omit on success>
```

**Step 2 — call the helper** (`--summary` = RESULT, or what failed + why):

```bash
REPO="$(git remote get-url origin | sed -E 's#(git@github.com:|https://[^/]*/)##; s#\.git$##')"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"; SHA="$(git rev-parse HEAD)"
.claude/scripts/send-routine-email.py \
  --status <success|failure|no-op> \
  --skill autocomplete-pass-auto \
  --site "<BASE_URL discovered in STEP 1>" \
  --repo "$REPO" --branch "$BRANCH" \
  --summary "<RESULT e.g. 'Mined 5 seeds → 12 keywords, created 4 pages, 7 metadata edits; pushed + IndexNow pinged.' — or 'FAILED: <what> because <why>.'>" \
  --details-file /tmp/autocomplete-pass-auto-$(date +%Y-%m-%d).md \
  --commit-sha "$SHA" --commit-url "https://github.com/$REPO/commit/$SHA"
```

For no-op / failure with no commit, pass `--commit-sha ""` and `--commit-url ""`.

## What this skill MUST NOT do

- **Never** ask a human anything.
- **Never** modify `/autocomplete-pass`, `/keyword-gap-pass`, or their phase files.
- **Never** touch a high-blast-radius path (build config / middleware / robots.txt / global redirects).
- **Never** push if every Phase 3 page drafted AND every Phase 2/5 edit reverted.
- Seed count follows the original skill's quality guidance; no artificial hard cap on output rows.

## Reference

Original (manual) skill: [/autocomplete-pass](.claude/commands/autocomplete-pass.md)
Shared execution phases: `.claude/commands/keyword-gap-pass/`
Miner: `.claude/tools/autocomplete-paa/autocomplete.py`
Email helper: `.claude/scripts/send-routine-email.py`
Secrets: `~/.claude/secrets.env`
