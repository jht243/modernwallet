---
description: AUTONOMOUS Ahrefs Site Audit fixer. Pulls site-audit issues via the Ahrefs MCP, auto-fixes every fixable finding (no human gating, per user instruction), commits, pushes, sends an email via Resend. Designed for scheduled cloud runs.
argument-hint: "[optional Ahrefs site-audit project ID — auto-discovers by BASE_URL match if omitted]"
---

# /ahrefs-site-audit-auto — Ahrefs Site Audit issues → auto-fix → push (cron-safe)

> **‼️ RUN-WIDE RULE — READ FIRST.** This skill runs autonomously. There is **NO** human checkpoint. The user has explicitly opted into auto-fixing ALL findable issues without gating. You **MUST NOT** print "Should I fix X?" or any question at any boundary. If a hard blocker fires, you **still finish** by sending an email report and exiting 0.
>
> **‼️ NO CAP — READ SECOND.** Fix **every** issue Ahrefs returns that is safely auto-fixable (per the table below). There is no per-run limit on the number of pages edited. Process them sorted by severity (Errors > Warnings > Notices) then traffic potential, but do not stop at any count. The only things NOT fixed are issues routed to "flag for human" (canonical→redirect, server redirects, i18n, thin content) — those are correctness calls, not a volume limit.

## Hard pre-flight checks (FIRST)

1. **Working tree clean** — `git status --porcelain` empty.
2. **Branch is committable; deploy target is `main`.** Cloud routines run on an ephemeral `claude/*` branch — expected. Commit on the current branch, then deploy to `main` with `git fetch origin main && git rebase origin/main && git push origin HEAD:main`. Never `git checkout main`, never create a new branch, never abort just because the branch isn't `main`. Resend key resolves from `$RESEND_API_KEY` (env) or `~/.claude/secrets.env`; if absent, skip email but still complete + push.
3. **An auditor is reachable** -- verify the `mcp__*__site-audit-issues` tool is callable. If it is not, or the workspace is out of units, that is **NOT a reason to skip**: fall to the DataForSEO rung per "Data source" below. Only skip + email failure if **both** rungs are unavailable, naming which failed and why.
4. **Resend secrets present** in `~/.claude/secrets.env`.

## ‼️ Data source: Ahrefs Site Audit preferred, DataForSEO OnPage fallback

**A dry vendor must never end this run.** Ahrefs' workspace units are a metered
monthly allowance that hits a cliff (99,981/100,000 used as of 2026-08-23), and
this routine used to email failure and skip when it did. Resolve the source
once, at the start of STEP 2, then never re-resolve mid-run:

1. **Ahrefs Site Audit (preferred).** Its crawler sees things we cannot compute
   from a page alone -- backlink-driven issues, crawl depth, orphan pages -- and
   Rank-Tracker-adjacent context. Use it whenever the MCP answers.
   - MCP callable **and** a project matches `BASE_URL` -> use it, proceed normally.
   - MCP missing, erroring, or out of units (`API units limit reached`, HTTP
     401/402/403) -> **fall through, do not fail the run.**
   - MCP fine but **0 site-audit projects match** `BASE_URL` -> fall through too.
     A missing Ahrefs project is a setup gap, not a reason to audit nothing.
2. **DataForSEO OnPage (fallback -- always available, pay-as-you-go).**
   ```
   python3 scripts/lib/site_audit.py audit \
     --base-url <BASE_URL> --sitemap <BASE_URL>/sitemap.xml \
     --cap 300 --out reports/site-audit/<TODAY>.dataforseo.json
   ```
   Reads the sitemap (index-aware), audits each URL, and emits issues **already
   translated into the Ahrefs slugs the fix table below keys on**. ~$0.00015 per
   URL, so a 300-page site is ~$0.05. Key resolves like every other fleet key;
   the cloud trigger passes `DATAFORSEO_B64` inline.

**No field-mapping work is needed downstream** -- unlike the winner/loser pass's
two sources, `site_audit.py` does the translation itself, so STEP 4's fix table,
severity ordering, gates, commit and email are **identical** on either rung.

**What the fallback cannot see.** DataForSEO's OnPage payload has no verdict for
`canonical_to_redirect`, `canonical_to_4xx`, `redirect_loop`, `hreflang_*`,
`lang_missing`, `noindex_in_sitemap`. The report lists these under
`unavailable_on_this_source`. **Never report them as clean** -- a check that did
not run is not a pass. Say so in the email's source line.

**Pages that failed to audit are not clean either.** `pages_failed` carries a
reason per URL; surface the count in the email rather than quietly auditing fewer
pages than the sitemap holds.

**Record which rung ran** in the email's first line and in the report frontmatter:
`source: ahrefs` or `source: dataforseo (Ahrefs <reason>)`, plus the DataForSEO
cost when it ran. Cost stays visible, exactly like the winner/loser pass.

## STEP 1 — Discover project facts

Reuse Phase 0 from `/keyword-gap-pass`. We need:
- `BASE_URL` (canonical host, e.g. `www.layer3labs.io`)
- Framework / publish layout (where pages live)
- Default branch
- Git remote (for the commit URL in the email)

Do NOT call any Ahrefs tools yet.

## STEP 2 — Find the Ahrefs Site Audit project ID

If `$ARGUMENTS` is a project ID, use it. Otherwise:
1. Call `mcp__*__site-audit-projects` to list available site-audit projects.
2. Find the one whose target domain matches `BASE_URL` (strip `www.`, compare case-insensitive).
3. If 0 match -> **do not skip.** Fall to the DataForSEO rung (see "Data source" above) and note in the email that no Ahrefs project exists for `<BASE_URL>`.
4. If >1 match → take the most recently crawled one, note the ambiguity in the email details.

## STEP 3 — Pull the issues

Call `mcp__*__site-audit-issues` with the project ID. Read the docs first via the `doc` tool if you haven't used `site-audit-issues` in this session.

Group every returned issue by **kind** (the Ahrefs issue slug, e.g. `meta_desc_too_long`, `broken_internal_link`, `img_missing_alt`).

## STEP 4 — Decide what's fixable in-code

| Issue kind | Fixable? | How (high level) |
|---|---|---|
| `broken_internal_link` (4xx/5xx href) | YES | grep for the URL → fix href to the new path, or remove the link if no target exists |
| `broken_external_link` | YES if internal-controlled, else skip-with-note | only fix if we control the destination domain (rare); otherwise note in email |
| `img_missing_alt` / `img_empty_alt` | YES | read the page, write a contextual alt based on surrounding text (5–10 words, descriptive not keyword-stuffed) |
| `meta_desc_missing` / `meta_desc_too_short` / `meta_desc_too_long` | YES | rewrite the meta description to 140–155 chars, summarizing the page's H1 + intro |
| `title_too_long` / `title_too_short` / `title_duplicate` / `title_missing` | YES | rewrite to 50–60 chars unique per page |
| `h1_missing` / `h1_multiple` | YES | ensure exactly one H1 per page (promote/demote heading levels) |
| `canonical_missing` | YES | add `<link rel="canonical" href="<self URL>">` |
| `canonical_to_redirect` / `canonical_to_4xx` | **NO — flag for human** | canonical changes are too destructive to auto-fix on indexed pages |
| `redirect_chain` / `redirect_loop` | **NO — flag for human** | server-level redirect changes have site-wide blast radius |
| `noindex_in_sitemap` / `sitemap_url_4xx` | YES | remove the URL from the sitemap (if generator-driven, fix the generator's filter; if hand-edited, edit the sitemap.xml) |
| `mixed_content_*` | YES | rewrite `http://` to `https://` where the destination supports HTTPS (verify first) |
| `lang_missing` / `hreflang_*` | NO — flag for human | i18n setup is project-specific |
| `schema_*` (structured-data issues) | YES if simple (missing required field, wrong type) | add the field with a sensible default sourced from the page |
| `multiple_canonical` | YES | keep the first canonical that points to a 200 URL, remove the rest |
| `low_word_count` / `low_text_html_ratio` | NO — flag for human | thin content is /indexing-pass-auto's job, not this skill's |
| Anything else | **flag for human** in the email details |

**Rule:** if you're not confident in the auto-fix for a specific issue, route it to the "flagged for human" list in the email. The user accepted auto-fix-everything in principle but no fix is better than a wrong fix.

## STEP 5 — Apply the fixes (ALL of them — no cap)

For each fixable issue:
1. Read the affected page file (the URL → file mapping comes from the project facts).
2. Apply the fix via `Edit` (targeted spot-edit, never a regeneration).
3. Track which file was touched and what kind of fix was applied.

Periodically (roughly every 5–10 fixes), run a quick incremental typecheck (`npm run typecheck` or `tsc --noEmit` or `pnpm typecheck`, whichever the project uses) so a broken state is caught early. If typecheck fails:
- `git stash` the in-progress fixes
- email failure with the typecheck output
- exit 0

## STEP 6 — Final audit pass

After all 25 (or fewer) fixes are applied:
1. Run the project's full build / typecheck (whatever its pre-publish step is — discovered in STEP 1).
2. If it fails → `git reset --hard HEAD`, email failure.
3. If it passes → stage, commit with message `chore(ahrefs-audit): auto-fix N issues across M pages`, push.

## STEP 7 — Email report (ALWAYS sent — success, failure, or no-changes)

> When nothing needed changing, report it as **Success Without Changes** (pass `--status no-changes`). Never write the literal "no-op" in the email, commit message, report, or `--summary`.

The email must answer, without opening the dashboard: **what ran, on which repo/branch, which issues were fixed — or what failed and why.**

**Step 1 — write `/tmp/ahrefs-site-audit-auto-<YYYY-MM-DD>.md`** with these EXACT headings (write "None this run" if empty):

```markdown
## Issues fixed (N)
- `<url/route>` — <issue kind, e.g. meta_desc_too_long → rewritten to 148 chars>

## Files changed
- `<path>` (what changed)

## Flagged for human (not auto-fixed)
- `<url>` — <issue kind> — <why it needs a person, + Ahrefs issue URL>

## Flagged-for-human count (not auto-fixed — correctness calls, not a cap)
- <count by kind>

## Build / typecheck
<passed / failed + output>

## Ahrefs issue counts (informational)
<by severity: Errors / Warnings / Notices>

## Blocker (only if the run stopped early)
<what stopped it and the exact reason; omit on success>
```

**Step 2 — call the helper** (`--summary` = RESULT, or what failed + why):

```bash
REPO="$(git remote get-url origin | sed -E 's#(git@github.com:|https://[^/]*/)##; s#\.git$##')"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"; SHA="$(git rev-parse HEAD)"
.claude/scripts/send-routine-email.py \
  --status <success|failure|no-changes> \
  --skill ahrefs-site-audit-auto \
  --site "$BASE_URL" \
  --repo "$REPO" --branch "$BRANCH" \
  --summary "<RESULT e.g. 'Fixed 14 issues across 11 pages; 3 flagged for human; 8 queued; pushed.' — or 'FAILED: build broke after fixing <X>; reverted.'>" \
  --details-file /tmp/ahrefs-site-audit-auto-$(date +%Y-%m-%d).md \
  --commit-sha "$SHA" --commit-url "https://github.com/$REPO/commit/$SHA"
```

For no-changes (clean audit) / failure with no commit, pass `--commit-sha ""` and `--commit-url ""`.

If Ahrefs returned 0 fixable issues → status `no-changes` ("Ahrefs audit clean — no fixable issues this week").

## What this skill MUST NOT do

- **Never** ask a human anything.
- **Never** edit a canonical that points to a redirect or 4xx — flag instead.
- **Never** change server-level redirect rules / robots.txt / build config.
- **Never** rewrite body content for "low word count" — that's `/indexing-pass-auto`'s job (thin-content phase).
- **Never** push if build / typecheck fails — revert and email.
- No per-run edit cap — fix every safely-fixable issue Ahrefs returns.

## Reference

Ahrefs MCP tools used: `site-audit-projects`, `site-audit-issues`, `site-audit-page-content`, `site-audit-page-explorer`, `doc`
Discover-facts subroutine reused from: [/keyword-gap-pass](.claude/commands/keyword-gap-pass/phase-0-discover.md)
Email helper: `.claude/scripts/send-routine-email.py`
Secrets: `~/.claude/secrets.env`
