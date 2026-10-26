
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
<!-- /workflow-source-freshness-v1 -->

# Phase 7 — Email digest (with live links)

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


Send one email so a human understands the run **without opening the dashboard** — and can **click straight to every page/tool that was published to test it**. Always sent (success / failure / no-changes). Best-effort: if the helper fails, log to stdout but never roll back committed work.

> Report a no-publish run as **Success Without Changes** (`--status no-changes`). Never write the literal "no-op".

## Step 1 — write the details file at `/tmp/competitor-monitor-auto-<YYYY-MM-DD>.md`

Use these EXACT headings (include a section even if empty — "None this run"). **Every published item MUST carry its full clickable live URL** so it can be opened and tested.

```markdown
## Published pages (N)
- **<Title>** → [{BASE_URL}/guides/<slug>]({BASE_URL}/guides/<slug>)
  ↳ triggered by <Competitor Name>: <competitor source URL>

## Published comparisons (N)
- **<Title>** → [{BASE_URL}/comparisons/<slug>]({BASE_URL}/comparisons/<slug>)
  ↳ triggered by <Competitor Name>: <competitor source URL>

## Published tools (N)
- **<Name>** → [{BASE_URL}/tools/<slug>]({BASE_URL}/tools/<slug>)
  ↳ triggered by <Competitor Name>: <competitor source URL>

## Enriched pages (N)
- **<Title>** → [<live URL>](<live URL>) (what was added vs the competitor)

## Held as draft (N)
- **<Title>** (<page|tool>) — reason it failed audit (noindex; not in sitemap/IndexNow)

## Skipped — duplicate (N)
- <competitor URL> — duplicate of [our existing page](<our URL>)

## Skipped — off-niche (N)
<from the candidates file `skipped_off_niche` — competitor pages outside this project's niche (crypto, mobile dev, enterprise cloud, …). Listed so you can override any call.>
- <competitor URL> — "<title>" (<kind>)

## Overflow (left for next run, N)
- <competitor URL> (<kind>) — exceeded the per-run cap; still pending in the ledger

## Competitors scanned
<count> competitors · <new> new · <updated> updated · <fetch_failures> fetch failures

## Changes vs previous chart
<from the refreshed baseline-<today>.json `total_new_since_prev` + per-competitor `delta`/`new_since_prev`. This is the diff against the prior chart, e.g.>
- <total_new_since_prev> new on-niche page(s) across the roster since the last chart (<previous_baseline> → <today>).
- <Competitor>: Δ <delta> on-niche (<n> new) — e.g. "Markovate: +2 (2 new)"
- Chart refreshed → `reports/competitor-monitor/baseline-<today>.md`

## IndexNow
<URLs submitted, or "skipped — failure / no-changes">
```

## Step 2 — compute facts, call the helper

```bash
TODAY="$(date +%Y-%m-%d)"
REPO="$(git remote get-url origin | sed -E 's#(git@github.com:|https://[^/]*/)##; s#\.git$##')"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
SHA="$(git rev-parse HEAD)"
.claude/scripts/send-routine-email.py \
  --status <success|failure|no-changes> \
  --skill competitor-monitor-auto \
  --site "{BASE_URL}" \
  --repo "$REPO" \
  --branch "$BRANCH" \
  --summary "<RESULT: e.g. 'Published 3 pages + 1 tool from competitor moves (LeewayHertz ai-for-logistics, Markovate rag-guide, …), enriched 1, dropped 2 duplicates; pushed + IndexNow.' — or on failure, what failed and why>" \
  --details-file /tmp/competitor-monitor-auto-$TODAY.md \
  --commit-sha "$SHA" \
  --commit-url "https://github.com/$REPO/commit/$SHA"
```

For `no-changes` / `failure` where nothing was pushed beyond the ledger, pass the ledger commit SHA if there is one, else `--commit-sha ""`.

The `--summary` is the single most important line — make it a specific, self-contained result. **End the run after the email (exit 0).**
