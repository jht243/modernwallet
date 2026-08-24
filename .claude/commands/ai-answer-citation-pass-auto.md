---
description: AUTONOMOUS AI Answer Citation engine. Pulls the top-traffic pages from Google Search Console, reads each page's own live Google SERP (via scripts/lib/serp.py -> dataforseo.py), and classifies every page by who Google's AI Overview cites: DEFEND (Google cites US -> lock the page so no other routine can alter the cited answer), STEAL (Google cites a COMPETITOR and we rank but aren't cited -> rewrite our answer block to out-answer theirs and take the citation), or ABSENT (an AI Overview exists and we're nowhere -> flag for mindmap/trend to build a new page). Every edit passes the adversarial audit before publish. Maintains a committed defend-ledger every editing routine honors. NO human gates. Designed for scheduled cloud runs.
argument-hint: "(no arguments — fully autonomous)"
---

# /ai-answer-citation-pass-auto — win and defend the pages Google cites in its AI answer

**‼️ UNBREAKABLE INVARIANT — writer output is never final without its audit.** No phase that writes or rewrites reader-facing text may be marked complete, and nothing it produced may be published, served, committed as final, screenshotted, or shown to the user, until the adversarial audit phase has run on that exact output and passed. A rewrite (including one that fixes an audit finding) voids any prior pass and re-triggers the audit. This holds in autonomous runs, manual runs, tests, demos, and single-page one-offs alike. See `.claude/commands/_content-standard.md` (PHASE 4 IS NOT OPTIONAL).


> **‼️ PIN THE DEPLOY BASE FIRST — before Phase 0 and before ANY commit.** Only if this repo HAS the helper:
> ```
> [ -f .claude/scripts/deploy-run-to-main.sh ] && .claude/scripts/deploy-run-to-main.sh mark
> ```
> Where the helper exists it records the branch tip you inherited so that, at deploy time, ONLY the commits
> THIS run adds are replayed onto `main` (the deploy step below calls `.claude/scripts/deploy-run-to-main.sh
> push`, which replays `RUN_BASE..HEAD` onto latest `origin/main` and aborts on a genuine conflict — never
> force-pushes). **If this repo has NO `deploy-run-to-main.sh`** (some Astro/Render auto-deploy sites don't),
> SKIP this pin — at deploy time you publish with a plain `git fetch origin main && git rebase origin/main &&
> git push origin HEAD:main` instead (retry 3x, never force-push, else push the ephemeral branch + a
> manual-merge note). Either way, never force-push `main`.
> **‼️ RUN-WIDE RULE — READ FIRST.** Fully autonomous, NO human checkpoint anywhere. Never print "Want me to proceed?" or any question at any phase boundary. If a hard blocker fires, you **still finish** by sending an email report and exiting 0. The cloud routine has no human watching; any blocking question silently kills it.

> **‼️ NEVER TOUCH `.claude/` AT RUNTIME — not create, edit, delete, `mkdir`, `rm`, `git checkout`, or `mv`.** ANY write/delete under `.claude/` (tools, commands, scripts, settings, or a `__pycache__` inside them) triggers the harness's sensitive-file permission prompt, which PAUSES the unattended run and kills the automation. Rules:
> - `.claude/` is **strictly read-only** for the whole run. If a helper the skill references is missing, do NOT create it under `.claude/` — use the repo's `scripts/` equivalents, inline stdlib Python in `/tmp`, or the lane's documented fallback.
> - **Do NOT clean up build artifacts.** Leave `__pycache__/`, `*.pyc`, and `*.tsbuildinfo` where they are — they are gitignored and will not enter your commit.
> - **Stage ONLY the exact content files you created/edited, by explicit path** (`git add <path> <path> …`). NEVER `git add -A` or `git add .`.
> - Any action that would require approval (writing outside the repo, installing to system paths, cleaning `.claude/`) → SKIP it, use the fallback, note it in the digest. NEVER pause for a prompt.

**The one question this engine asks:** *"On the queries our top pages already rank for, who does Google's AI Overview cite as the source — and where a competitor holds that citation instead of us, how do we rewrite OUR answer so Google quotes us instead?"*

This is a sibling of `/page-quality-pass-auto`. That pass selects on **weak GA4 engagement** and fixes under-serving pages. THIS pass selects on **AI-Overview citation ownership** — a page can have perfectly healthy engagement while silently losing the answer-box click to a competitor Google cites, and no engagement metric can see that. It reads the live SERP, buckets each page DEFEND / STEAL / ABSENT, rewrites only the answer block on STEAL pages, and — the part unique to this pass — **writes a committed defend-ledger that every other editing routine reads and honors**, so a page whose answer Google is quoting is frozen from edits until we lose the citation. The two engines share ledgers so they never churn the same page in the same cycle (see Cross-engine rules).

**Why the SERP, not engagement:** an AI Overview appears on a query and often takes the click even when you rank #1 organically. Whether Google cites YOU or a competitor is invisible in GSC clicks and GA4 engagement alike — it looks like normal ranking. The live SERP read is the only signal that surfaces it. Citation share (how many of your top queries cite you) is the KPI this pass moves, and nothing else in the fleet measures it.

This is a thin orchestrator. ALL phases live at `.claude/commands/ai-answer-citation-pass/phase-*.md` — read each file when you reach it. Do not paraphrase any phase file from memory, and do NOT substitute another pass's phase files — the semantics here (SERP-citation selection, defend/steal/absent buckets, answer-block rewrites, the defend-ledger) exist only in this pass.

## Hard pre-flight checks (FIRST, before Phase 0)
If any check fails → skip the run, email a failure report (see Email section), exit 0. No commit, no push.

1. **Working tree must be clean.** `git status --porcelain` non-empty → skip, email failure.
2. **Branch is committable.** Cloud routines run on an ephemeral `claude/*` branch — expected. Commit there, then deploy to `main` per the Git model below. Only abort on detached HEAD with no branch name.
3. **Credentials.** `python3 -c "import google.oauth2.service_account"` must succeed (else `pip install google-auth requests`), and one of `$GOOGLE_REPORTING_SA_JSON` / `$GOOGLE_REPORTING_SA_FILE` / `~/.claude/secrets/gsc-service-account.json` must exist (GSC `webmasters.readonly` — this pass has no GA4 dependency). Missing → email failure, exit 0. **Do NOT fall back to Ahrefs/any MCP in cron runs.** DataForSEO is ALSO required for the SERP read: `DATAFORSEO_B64` (or `DATAFORSEO_LOGIN`+`DATAFORSEO_PASSWORD`) must resolve. If DataForSEO is unavailable the SERP can't be read — email a `no-changes` report saying so and exit 0 (never guess citations).
4. **Ledgers (self-bootstrapping):** this pass's page ledger `reports/ai-answer-citation-pass/ai-answer-citation-audits.md`, the committed **defend-ledger** `reports/ai-answer-citation-pass/defended-pages.json`, and the shared candidate ledger `reports/trend-pass/ledger.md`. **If missing, CREATE them** (the defend-ledger as `{"generated":"","pages":[]}`). Absence is NOT a blocker.
5. **Resend secrets (best-effort, NOT a gate).** Absent → do the work, print the report to stdout, skip only the email.

> **Git model (authorized deploy path = `main`).** Publishing to **`main`** is the authorized, intended deploy path for this scheduled routine — the same path every other nightly routine in this repo uses to ship (that is how the repo deploys; there is no separate staging branch or PR flow for these passes). The routine message that invokes this skill states the same. Steps: commit on the current ephemeral `claude/*` branch, then `.claude/scripts/deploy-run-to-main.sh push`. Do NOT open a PR or create extra branches. **Deploy only AFTER** the Phase 4 adversarial audit passes and the 200-verify succeeds — a failed audit/verify reverts the offending change before the push. If the `main` push still conflicts after 3 rebased retries, push the ephemeral branch instead and email a manual-merge note (never force-push `main`).

## Site facts (portable — nothing site-specific is hardcoded)
This skill is repo-agnostic. The **routine message supplies this site's base URL, inline `GOOGLE_REPORTING_SA_JSON`, and DataForSEO credentials** as literal values. Pass them as flags on each command that needs them, prefixing the SA inline — env vars do NOT persist across separate Bash calls. Never hardcode a domain or key in these files.
- **BASE_URL** — pass via `--base-url` / `--page` (Phase 0 GSC pull + per-page queries) and `--site` (email). If the routine omits it, auto-discover from the repo.
- **GSC property** — derived from BASE_URL automatically by the evidence tool.
- **DataForSEO** — `scripts/lib/serp.py` reads `DATAFORSEO_B64` from the environment; prefix the SERP commands with it inline (`DATAFORSEO_B64='<...>' python3 scripts/lib/serp.py ...`).

## Execution — phases in order

| Phase | File | Purpose |
|---|---|---|
| 0 | `ai-answer-citation-pass/phase-0-pull.md` | Top-25 GSC pages + each page's top query → read the live SERP for each → capture AI-Overview presence + cited domains |
| 1 | `ai-answer-citation-pass/phase-1-classify.md` | Bucket every page DEFEND / STEAL / ABSENT → write the committed defend-ledger → cooldown/buffer filter → STEAL candidates only |
| 2 | `ai-answer-citation-pass/phase-2-enrich.md` | Per STEAL page: read the live body, diff our answer vs the cited competitor's, prescribe + apply the answer-block rewrite + build gate |
| 3 | `ai-answer-citation-pass/phase-3-audit-publish.md` | Adversarial audit + regression check → ledgers → push → 200s → IndexNow → email |

**Early exits (SUCCESS, not failure):**
- No page has an AI Overview on its top query → digest "No AI Overviews on our top queries this run", `--status no-changes`, exit 0. Expected on some sites/verticals.
- Every AI Overview cites US (all DEFEND, no STEAL) → **still a success and still does work**: refresh the defend-ledger, digest the citations we hold, `--status no-changes` for edits, exit 0. Holding every citation is the best outcome, not a no-op.
- All STEAL candidates on cooldown/buffer → digest with the per-page table and next-eligible dates, `--status no-changes`, exit 0. This pass treats a page at most once per week.

## Caps
**None.** Every page that clears Phase 1 gets diagnosed; every prescription that clears Phase 4's audit ships. What bounds this pass is evidence (the flagging bar), cooldowns, and the audit — not numeric ceilings.

## Monetization check — MANDATORY on EVERY top page (only if the affiliate engine is installed)

**Run this on every page in your top-25 pull — not just the pages you rewrite for engagement.** For each of the 25 pages, before you finish with it, do the two-step check below and CREATE monetization when it is missing. This is a required part of the pass: a fit page that reaches the end of the run un-monetized is a defect. Record the outcome for every page (already-monetized / created-now / no-fit) in the digest so the coverage is auditable.

**Step 1 — Is the page already monetized?** It counts as monetized if the live page renders an affiliate section or a `sponsored` link, OR its slug is already in `AFFILIATE_INJECTIONS`, OR it is an auto-covered vertical (`/{model}-for-{industry}`) or model-vs-model comparison. Already monetized → nothing to do, move on.

**Step 2 — If it is NOT monetized, create it** by classifying the page (details in the fit gate below):
- open-weights model with a stated size → **hardware** entry `{ modelName, profileKey }`
- closed model / model comparison / coding roundup → **how-to-use** entry
- a page that prominently uses a tool already in the `ENTITY_LINKS` registry which has a referral program → make sure that tool's link is the **referral URL** (this is how non-model pages monetize)
- a genuine non-fit — a pure conversion / nav / pricing page with no product or tool to recommend → log **"no monetization fit"** and move on
When unsure whether a model/tool page fits, it fits — add the how-to-use section. The section, its rels, the disclosure, and the date-bump are all automatic; your only action is the one-line map entry (or confirming a referral URL).

**Precondition — skip this whole check unless BOTH `src/utils/affiliateInject.ts` and `data/affiliate/catalog.ts` exist in this repo.** They exist only where the inline-affiliate engine is installed (layer3labs). Absent → this check does nothing; never create them.

**What it does:** place a "What you need to run {model} yourself" section — an honest API/rent/buy tier table with monetized links. The section, its `sponsored nofollow` rels, the bottom-of-page FTC disclosure, and the "Last updated" date-bump are ALL automatic. This lane's ONLY action is to add ONE line to the `AFFILIATE_INJECTIONS` map in `src/utils/affiliateInject.ts` (a normal repo file — editing it is allowed; it is NOT under `.claude/`). It is an APPEND (adds a section); it never rewrites body prose, so it is compatible with the section-level-only data-safety rule.

**Fit gate — add an entry ONLY when ALL are true:**
1. The page is about ONE specific model (NOT a comparison, use-case "X for law firms", pricing, or compliance page).
2. That model is **open-weights / self-hostable** — weights publicly downloadable. Closed models (GPT, Claude, Gemini, Grok) are NEVER eligible; you cannot self-host them.
3. The page **states the model's size** (parameter count / MoE). No stated size → skip; you cannot advise honestly.
4. The page does NOT already carry an affiliate link and its slug is not already in `AFFILIATE_INJECTIONS` (dedup — never double-monetize).

**Pick the profileKey from the size the PAGE states (never guess):** `small-local` (≤~14B), `mid-large` (~15–150B), `frontier-moe` (>~150B / very large MoE), or `general-spectrum` for a multi-model "best/how-to-run open-weights" page (set `modelName` to the category) — but SKIP general-spectrum if the page already has a hardware / "what runs where" section (redundant). No profile fits (image/video model, robotics) → skip. NEVER invent a profile or product; the catalog is the only source.

**Closed/hosted models + comparisons (the `how-to-use` kind):** where hardware can't be sold — a single closed model (GPT/Claude/Gemini/Grok) explainer or coding roundup, or a model-vs-model comparison — add a how-to-use section instead of skipping. Guide entry: `{ kind: 'how-to-use', subject: '<model or "these models">', models: [{ name, vendor }] }`. Comparison entry (in the same map, keyed by comparison slug): just `{ kind: 'how-to-use' }` — the two models auto-derive from `optionAName`/`optionBName`. It leads with Cursor (affiliate) + each maker's own tool (Claude Code / Codex / Antigravity). **Fit:** the reader must plausibly use the model through an AI IDE/tool (dev / coding / general-model audience).

**Vertical pages are AUTO-covered — do nothing:** `/{model}-for-{industry}` pages (e.g. `claude-fable-5-for-accounting`) get a "setup" section automatically at build (the injection layer detects them from the H1 and adds a cloud-first / on-prem-for-compliance section with Cursor + hardware links). Do NOT add them to the map — they are already monetized. If one shows up in your top pages, treat it as done.

**The edit:** one line, e.g. `'deepseek-v3-explained': { modelName: 'DeepSeek V3', profileKey: 'frontier-moe' },`. `git add src/utils/affiliateInject.ts` explicitly. The Phase-3 build gate + Phase-4 200-verify confirm it renders.

**Phase-4 audit additions (per entry you added):** confirm the model is genuinely open-weights, the profileKey matches the page's stated size, the live page shows the section + the bottom disclosure, affiliate links carry `rel="sponsored nofollow"`. Any miss → remove the entry before push. Log each under **## Affiliate sections added (N)**.

## Data-safety rules (NOT caps — these keep an unattended run from damaging live pages)
- **Section-level rewrites only — NEVER regenerate a whole page.** A rewrite replaces the prose *inside* one diagnosed-weak section at a time. Page slug, route, section count, and heading order are preserved; new sections may be APPENDED for missing high-value sub-intents. Never delete a section.
- **Facts are preserved or improved, never invented.** Research-first: every claim in a rewritten section must be as-verifiable or more-verifiable than what it replaces. If the old section's facts can't be verified, the rewrite states what IS verifiable rather than keeping unverified claims.
- **Only content-archetype pages get body edits** (guides, comparisons, explainers, roundups, vertical spokes, briefings). Conversion/nav/hub pages (home, service, audit/booking, resource hubs, about) are NEVER body-edited by this pass — weak engagement there is a design/UX question; flag it in the digest for the human instead.
- **No consolidation, no redirects, no deletions — ever.**
- **Metadata rewrites require that page's GSC verdict `underperforming` + `rewrite_recommended`**, AND no metadata rewrite for that page already KEPT in the shared ledger within 28 days (the other engine may have just done it).
- ‼️ **`canonicalOverride` must NEVER be set to `undefined`** anywhere in a data record — it breaks the entire static export and tsc cannot catch it. Escape or double-quote every apostrophe in single-quoted generated strings.
- **Render-time rules stay intact:** byline never in body prose; first mention of any external company links to its official site UNLESS the project's auto-link registry covers it (in layer3: `ENTITY_LINKS` in `src/utils/sectionContent.tsx` — CHECK it, never assume); the site's inline CTA component stays below the first body section.
- **Digest email passes the site voice standard** (standing email-voice mandate).

## Cross-engine rules (this pass ↔ ga4-top-pages-pass and the nightly builders)
1. **Own cooldown — HARD 7 days:** a page this pass treated in the prior 7 days is never re-treated (ledger `reports/ai-answer-citation-pass/ai-answer-citation-audits.md`).
2. **48h buffer vs the GA4 pass:** a page audited by ga4-top-pages-pass in the last **48 hours** (per `reports/trend-pass/ga4-page-audits.md`) is skipped tonight — avoids two engines editing the same file in the same cycle. Older than 48h → eligible: that pass builds satellites and appends; it does NOT fix weak bodies, so deferring longer would leave sick pages sick. (The GLM case that motivated this engine was GA4-audited 3 days before it was still at 6s dwell.)
3. **Action-level dedup via the shared ledger** `reports/trend-pass/ledger.md`: never redo an answer-block rewrite that ANY pass already shipped (KEPT) or rejected (DROPPED). This pass tags its rows `source: ai-overview`.
4. **The defend-ledger is authoritative for ALL editing routines.** Before any pass edits a page, it checks `reports/ai-answer-citation-pass/defended-pages.json`; a listed route is frozen (see the DEFEND-LEDGER section below). This pass is the ONLY writer of that file — it refreshes it every run, so a page drops out of DEFEND automatically the moment we lose the citation.

## ‼️ THE DEFEND-LEDGER (the flag every editing routine honors)

This is the mechanism that stops any routine from rewriting away a citation we already hold.

- **File:** `reports/ai-answer-citation-pass/defended-pages.json` — committed to the repo, rewritten IN FULL by Phase 1 every run.
- **What goes in it:** every route whose top-query AI Overview cites US this run (the DEFEND bucket).
- **Who reads it:** EVERY editing routine, via the shared `_content-standard.md` PREFLIGHT rule. Before a routine edits a page, it checks this file; if the route is listed, the page is **frozen** — the routine skips it and logs `skipped — AIO-defended` in its digest. Editing routines: page-quality-pass, question-gap-pass, ga4-top-pages-pass, keyword-gap-pass, seo-gsc-pass, mindmap-pass, trend-pass, comparison, downloadable, competitor-monitor.
- **The lock is self-releasing.** Because Phase 1 REBUILDS the file from the live SERP every run, a page stays frozen only as long as Google still cites us. The run we lose the citation, that route drops out of the file → the page is editable again the same day. No manual unlock, ever.
- **The one exception — a factual error.** A DEFEND page may be edited ONLY to correct a genuine factual mistake (e.g. a YMYL fact went stale). Any such edit re-triggers the Phase 4 audit AND forces a fresh SERP read on the next run to confirm the citation survived. A hard freeze on stale medical/legal facts would be dangerous — protect the passage, don't ossify it.
- **THIS pass is the ONLY writer** of the file. No other routine adds, removes, or edits it.

## The feedback loop (what no other pass has)
This pass's ledger stores every page's **bucket per run** (DEFEND / STEAL / ABSENT) and whether we were cited. On every run, Phase 1 computes **citation share** — how many of our top queries cite us this run vs last run — and the digest's Citation scoreboard reports the delta. That number trending up is the KPI; a page that flips STEAL→DEFEND after a rewrite is this engine proving it earned its keep. No automated action is taken from the trend in v1 — it is the measurement.

## Ledgers
- `reports/ai-answer-citation-pass/ai-answer-citation-audits.md` (THIS pass's own) — one row per page seen: `route | seen | top_query | bucket (DEFEND/STEAL/ABSENT) | we_cited | competitor_cited | action | audit`. Drives the 7-day cooldown AND the citation-share feedback loop.
- `reports/ai-answer-citation-pass/defended-pages.json` (COMMITTED — read by every editing routine) — the live DEFEND set. Shape: `{"generated":"<date>","pages":[{"route":"/x","cited_domains":["ourdomain.com"],"cited_since":"<date>","top_query":"..."}]}`. Rewritten in full every run.
- `reports/trend-pass/ledger.md` (SHARED) — one row per shipped/killed answer-block rewrite, tagged `source: ai-overview`.

## Email digest (ALWAYS sent — success, failure, or no-changes)

Write `/tmp/ai-answer-citation-pass-<YYYY-MM-DD>.md` with these EXACT headings (write "None this run" where empty):

```markdown
## Citation scoreboard
- Citation share this run: <X of N top queries cite us> (last run: <Y of M>)

## 🟢 Defended (Google cites us) (N)
| page | top query | our cited domain | cited since |

## 🔴 Stolen-back this run (rewrote our answer to take the citation) (N)
- **<route>** — query "<q>" | competitor we out-answered: <domain> | § "<heading>" before→after word count | Stage 4: passed

## ⚫ Absent (AI Overview exists, we're nowhere) — flagged for mindmap/trend (N)
| page | query | who Google cites |

## Citations lost since last run (dropped out of DEFEND) (N)
| page | query | who has it now |

## Monetization coverage (all pages checked)
| page | status (already-monetized / created-now / no-fit) | how (hardware / how-to-use / referral-link / —) |
## Affiliate sections added (N)
- **<route>** — model: <name> | profile: <small-local / mid-large / frontier-moe / general-spectrum>

## Skipped (cooldown / buffer / no-AI-Overview) (N)
## Defend-ledger deltas (added / removed routes)
## Ledger deltas
## Audit
## IndexNow
## Blocker (only if the run stopped early)
```

Send exactly as the sibling passes do (`.claude/scripts/send-routine-email.py`), `--skill ai-answer-citation-pass-auto`, `--site <BASE_URL>`. For no-changes/failure with nothing committed: `--commit-sha "" --commit-url ""`.

## What this skill MUST NOT do
- **Never** ask a human anything.
- **Never** regenerate a full page body, delete a section, consolidate, or redirect.
- **Never** body-edit a conversion/nav/hub page — flag-only.
- **Never** treat a page inside its own 7-day cooldown or the 48h page-quality-pass buffer.
- **Never** rewrite anything on a DEFEND page except to correct a genuine factual error — Google is quoting it; leave the winning answer alone.
- **Never** edit an answer block on any site without first confirming, from the live SERP THIS run, that a competitor (not us) currently holds the citation. No stale citation data.
- **Never** fabricate a citation, a competitor, or an AI-Overview presence — every bucket decision traces to the SERP JSON this run produced.
- **Never** ship ANY edit that has not passed the Phase 4 adversarial audit + regression check.
- **Never** emit an action whose slug/intent appears in `ledger.md` as KEPT or DROPPED (any source).
- **Never** commit secrets or `.env` files.

## Reference
Top GSC pages + per-page queries: `.claude/tools/gsc-search-analytics/gsc_search_analytics.py --top-pages 25` then `--page <url>` per page · Live SERP + AI-Overview citations: `scripts/lib/serp.py` (`paa` for route→query pairs, or `read`/`batch`) · Slug inventory: `scripts/trend_pass/slug_inventory.py` · Write standard: `.claude/commands/_content-standard.md` · Adversarial audit: `.claude/commands/seo-gsc-pass/phase-4-audit.md` · Email: `.claude/scripts/send-routine-email.py`

## IndexNow Fallback Key (workflow-wide)

If any phase hits an IndexNow error — the site's `public/<32-hex>.txt` challenge file is missing, the key can't be discovered, or the API returns a key-verification error (403/422) — **fall back to this project-wide key**:

- **env var name:** `INDEXNOW_KEY`
- **key value (default):** `dc557f6bfced447aa1a71771d8a0d24a`

When falling back:
1. Create `public/dc557f6bfced447aa1a71771d8a0d24a.txt` with content `dc557f6bfced447aa1a71771d8a0d24a` (filename = key = content).
2. Commit + push it as part of the run (before the IndexNow POST) so the challenge file is live.
3. After the deploy is verified, retry the IndexNow POST with this key.
4. If retry still fails, note the HTTP status in the digest but do NOT block the rest of the run.

Prefer the env var if set; otherwise use the hard-coded default above.

## Affiliate engine reference (layer3labs only)
Catalog + profiles: `data/affiliate/catalog.ts` (run profiles keyed by size class). Section builder: `src/utils/affiliateSection.ts`. Injection map + guardrails: `src/utils/affiliateInject.ts`. Detector: `pageHasAffiliateLinks` in `src/utils/affiliate.ts`. Full design + TODO: memory `inline-affiliate-section-engine`.
