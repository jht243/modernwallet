---
description: TECHNICAL-ONLY deep-dive of any project's site via the Bing Webmaster API (crawl errors, redirect hops, indexability, orphan pages, sitemap/feed health), build an issue report, then fix the in-code technical issues through ordered, reviewer-gated phases, push, and submit changed URLs to Bing. Does NOT touch editorial content, titles, descriptions, or new-content opportunities. Self-contained and portable; auto-discovers project facts.
argument-hint: "[optional verified Bing siteUrl — auto-resolves from BASE_URL if omitted]"
---

# /bing-webmaster-pass — Bing Webmaster technical deep-dive → issue report → gated fixes → push → submit

> **‼️ RUN-WIDE RULE — READ FIRST.** This command runs autonomously end-to-end. There is **EXACTLY ONE** point where you stop and wait for the human: the **Phase 0 manifest approval**. Once the manifest is approved, the run continues all the way through fixes → audit → build → commit → push → Bing submission **without stopping again**. At EVERY phase boundary after Phase 0 you **auto-continue in the same turn without asking**. The reviewer gates between phases are automatic adversarial subagents — NOT human checkpoints. Never print "Want me to proceed?", "Should I continue?", or "Next: Phase X" as a question anywhere except the Phase 0 manifest gate.
>
> **‼️ SCOPE — READ SECOND. This is a TECHNICAL pass, not a content pass.** It fixes crawlability, indexability, redirect hygiene, orphan pages, and sitemap/feed health — the things that stop Bing from crawling and indexing the site. It does **NOT** rewrite titles/descriptions for CTR, does NOT improve copy, and does NOT propose or write new content. Editorial/keyword work belongs to `/seo-gsc-pass` and `/keyword-gap-pass`; if the deep-dive surfaces a content opportunity, ignore it here (don't even flag it) — those passes own it.
>
> **‼️ BLAST-RADIUS CAP — READ THIRD.** This pass caps each run at **40 link/href edits** and **15 sitemap-entry changes**. If the report contains more fixable rows than that, sort by severity (crawl errors > indexability > orphans > sitemap) then by Bing impressions, take the top N, and queue the rest in the report for next run. An unattended pass that touches 200 pages in one commit is a permanent regret if one classification is wrong.

This file is the **single source of truth** for the whole workflow — orchestration *and* phase instructions are inline below. It is fully portable: it discovers every project fact at runtime and hardcodes nothing about any one repo. All Bing API access goes through the stdlib-only helper `.claude/scripts/bing_webmaster.py` (no pip installs), which reads `BING_WEBMASTER_API_KEY` from `~/.claude/secrets.env`.

The user does NOT inspect intermediate output. Every worker phase is gated by an **adversarial reviewer subagent** (Agent tool, `subagent_type: Explore`, read-only) that did NOT do the work and must pass the phase's checklist before the next phase begins.

---

## ► STEP 0 (preflight — do this first, silently)

1. **Helper present** — confirm `.claude/scripts/bing_webmaster.py` exists and `BING_WEBMASTER_API_KEY` resolves (`python3 .claude/scripts/bing_webmaster.py sites` returns a JSON list). If the key is missing → STOP and tell the user to add `BING_WEBMASTER_API_KEY=...` to `~/.claude/secrets.env`. If it returns HTTP 401/403 → the key is invalid or its account is not an Admin/owner of the property → STOP.
2. **Git** — note the default branch and the remote URL (for the commit link). Do not require a clean tree, but record any pre-existing dirty files so you never stage them.

---

## ► STEP 1 (ALWAYS FIRST): Discover project facts + resolve the Bing property

Auto-discover every project fact by inspecting the repo. Hardcode nothing; print a short summary of what you find. (This is the same discovery the `/seo-gsc-pass` and `/indexing-issues-gsc-pass` passes use.)

- **BASE_URL** — the canonical host, from sitemap `<loc>`, the canonical-link logic, or JSON-LD builders (e.g. `www.example.com`).
- **Framework + deploy mode** — e.g. Next.js static export vs server, Astro, Flask, plain HTML. Static export = **no server-side 301s** (link fixes must edit hrefs, never add a `redirects()` rule).
- **URL → source-file mapping** — how a live URL maps to the file that renders it (route dir, content-collection, DB row, or template). Every fix needs this; if a URL can't be mapped to a file, the row is `Ambiguous / needs human`.
- **Sitemap(s)** — list `public/sitemap*.xml` (or the generator that emits them). Note the `<url><loc>…</loc><lastmod>…</lastmod></url>` format and how routes get added/removed.
- **Canonical / robots mechanism** — where `<link rel="canonical">` and any `noindex`/robots directives are emitted. You will READ these to tell intentional exclusions apart from defects — you will NOT edit shared/site-wide canonical or robots logic in this pass.
- **Build / typecheck command** — the project's pre-publish check (`npm run build`, `tsc --noEmit`, `pnpm typecheck`, `astro check`, etc.). Used as the Phase 5 gate.
- **Push target** — the repo's default branch unless conventions say otherwise.

**Resolve the verified Bing property:**
- If `$ARGUMENTS` is a siteUrl, use it.
- Else run `python3 .claude/scripts/bing_webmaster.py resolve-site --base <BASE_URL>`. It prints the exact verified `siteUrl` whose host matches (www-insensitive).
- If it errors "No verified Bing property matches" → STOP and tell the user to add + verify the site in Bing Webmaster Tools, then re-run. **Never fabricate Bing data for an unverified site.**

Call the resolved value `SITE` for the rest of the run. (Note: Bing's stored `SITE` host may differ from the page-level `BASE_URL` — e.g. `https://example.com/` vs `https://www.example.com/...`. Always pass `SITE` to the API; use `BASE_URL` for the URLs you write into pages/sitemaps.)

---

## ► STEP 2 (ALWAYS NEXT): Deep-dive sweep → build the issue report

**Pull every diagnostic surface in one call** (`--drill 0` — this pass does not need the per-page query breakdown that CTR analysis would use):

```bash
mkdir -p reports/bing-webmaster-pass
python3 .claude/scripts/bing_webmaster.py deep-dive --site "$SITE" --drill 0 \
  -o reports/bing-webmaster-pass/$(date +%Y-%m-%d).bing-raw.json
```

Skip Step 2 only if today's report already exists at `reports/bing-webmaster-pass/<TODAY>.md` (use it; don't overwrite) or the user passed a report path.

The raw JSON has these sections — **use these REAL field names** (verified against the live API; invent nothing):

| Section | What it tells you | Key fields |
|---|---|---|
| `crawlStats` | daily crawl health (≈23 days) — **the core technical signal** | `CrawledPages, InIndex, InLinks, CrawlErrors, Code2xx, Code301, Code302, Code4xx, Code5xx, BlockedByRobotsTxt, ConnectionTimeout, DnsFailures, ContainsMalware, AllOtherCodes, Date` |
| `crawlIssues` | per-URL crawl problems — **the core technical signal** | `Url`, an issue/category flag, HTTP code (empty list = clean) |
| `linkCounts` | inbound-link distribution (find orphans) | `{ Links: [...], TotalPages }` |
| `blockedUrls` | URLs blocked in Bing WMT | list (empty = none) |
| `queryParameters` | URL-normalization params | list |
| `feeds` | submitted sitemaps + status | `Url, Status, LastCrawled, Submitted, UrlCount, FileSize` |
| `urlSubmissionQuota` | how many URLs you may submit | `DailyQuota, MonthlyQuota` |
| `rankAndTraffic` / `queryStats` / `pageStats` | site/query/page traffic — **PRIORITIZATION CONTEXT ONLY** | used to rank technical fixes by traffic (fix the broken link on a high-impression page first). **Never** an input to a content/metadata change — this pass makes none. |

If you need a specific URL's index detail, run `bing_webmaster.py url-info --site "$SITE" --url "<page>"` → `HttpStatus, LastCrawledDate, DiscoveryDate, AnchorCount, DocumentSize, IsPage`. For a page's inbound links: `url-links --site "$SITE" --url "<page>"`.

**Now classify every TECHNICAL finding into ONE bucket** (by intent, not literal string). This is the fixability matrix — it is the heart of "find and fix." **It contains technical issues only.** A content/CTR/keyword opportunity is out of scope: do not add it to the matrix or the report.

| # | Bing finding (traceable to a raw-JSON field) | Bucket | Fix (per-page / per-link ONLY) | Auto-fix? |
|---|---|---|---|---|
| 1 | `crawlIssues` URL returning **Code4xx / Code5xx** that is linked internally | Crawl error | grep the repo for links to that URL → repoint to the correct URL, or remove the link if no target exists | ✅ |
| 2 | `crawlIssues` internal link → **Code301 / Code302** (redirect hop) | Crawl error | update the internal link to point straight at the final destination | ✅ |
| 3 | `crawlIssues` / `crawlStats` **BlockedByRobotsTxt** on a page that should index | Robots | **FLAG human** — robots.txt is site-wide blast radius; never auto-edit | ❌ flag |
| 4 | `crawlIssues` **ContainsMalware / DnsFailures / ConnectionTimeout** | Security/infra | **FLAG human** | ❌ flag |
| 5 | `blockedUrls` entry that is clearly an accidental block of an indexable page | Block | **FLAG human** (do not auto-call RemoveBlockedUrl) | ❌ flag |
| 6 | `queryParameters` mis-set normalization | Normalization | **FLAG human** — site-wide blast radius | ❌ flag |
| 7 | Page in the sitemap but **not crawled/indexed** (`url-info` `HttpStatus`/`LastCrawledDate` stale or `crawlStats InIndex` lag) AND it 200s and is legit | Indexability | ensure it's in the sitemap with a fresh `lastmod`; **queue for SubmitUrlBatch** (fire in Phase 7 after push) | ✅ (submit) |
| 8 | Indexable page with **0 inbound internal links** (orphan — absent from `linkCounts.Links`, low `AnchorCount` via `url-info`) | Orphan / internal links | add ≤3 contextual internal links FROM related existing pages (links only — no copy rewrites) | ✅ |
| 9 | `feeds` sitemap with `Status` error, stale `LastCrawled`, or `UrlCount` 0 while the site has URLs | Sitemap hygiene | fix the sitemap so it validates / lists URLs; re-submit via `SubmitFeed` in Phase 7 | ✅ |
| — | Anything you can't confidently map | — | `Ambiguous / needs human` — never guess, never silently drop | ❌ flag |

**Separate real errors from intentional exclusions.** A deliberate `noindex` on `/admin`, an intentional redirect, or a robots block of `/api/` is **working as intended** — record it in the report's exclusions note; do NOT "fix" it. Only act on genuine defects.

**Don't re-ship a landed fix.** Scan the last ~30 commits and the working tree; any row whose fix already shipped is bucketed `already-fixed — awaiting recrawl` (informational only — excluded from the edit phases and from re-submission, since the page didn't change this run).

**Save the report** to `reports/bing-webmaster-pass/<TODAY>.md` with frontmatter `status: ready-for-execution` and a row per finding: `finding | source-field | bucket | target URL→file | proposed fix | auto/flag`. The report is the contract for the rest of the run — every later phase acts only on its rows. **No invented data:** every row must trace to a value present in `<TODAY>.bing-raw.json`.

---

## Execution graph (ordering)

```
STEP 0  preflight (key + git)
STEP 1  discover project facts + resolve verified Bing SITE
STEP 2  deep-dive sweep  →  reports/bing-webmaster-pass/<TODAY>.{md,bing-raw.json}
        │   GATE A — adversarial reviewer: 0 invented rows, 0 dupes, 0 wrongful "already-fixed" drops,
        │            0 content/CTR rows leaked in, intentional exclusions correctly classified
        ▼
Phase 0  load report, present MANIFEST  →  ‼️ HUMAN STOP 1 (user approves)
        ├───────────────────────────────┬───────────────────────────────
        ▼                               ▼
  TRACK A — crawl / sitemap            TRACK B — crawlability
  Phase 1 (crawl-error link fixes)     Phase 3 (orphan internal links)
  Phase 2 (sitemap/feed hygiene)
        └───────────────┬───────────────┘
                        ▼
              Phase 4 — Audit (consolidated adversarial review of ALL fixes 1–3)
                        ▼
              Phase 5 — Build / typecheck gate (revert on failure)
                        ▼
              Phase 6 — SUMMARY (printed, then auto-continues — no stop)
                        ▼
              Phase 7 — commit + push + SubmitUrlBatch (live URLs) + SubmitFeed
```

- **Track A and Track B run in parallel** — keep their file sets disjoint. If a fix would touch a file the other track owns, serialize it.
- **Within a track, edits are sequential** (never two phases editing the same file at once → lost edits).
- **Phase 4 waits for both tracks**; **Phase 5 waits for 4**; **Phases 6–7 are last**.

## Non-negotiable global rules
1. **TECHNICAL ONLY — no content edits.** Never rewrite a `<title>`, meta description, heading, or body copy for relevance/CTR/keywords, and never create a new page. The only page-body edits allowed are **adding internal links** to orphan pages (Phase 3). Everything else is crawl/redirect/sitemap plumbing. A content opportunity is out of scope — don't act on it, don't flag it.
2. **PER-PAGE / PER-LINK ONLY — no site-wide changes.** Never edit `robots.txt`, base-URL/site config, shared canonical/redirect helpers, global rewrite rules, or the sitemap generator's global filters. A single such edit has site-wide blast radius. A defect spanning N pages → N discrete per-page edits, never one shared change. If the genuine root cause is site-wide, FLAG it `needs human`.
3. **Conservative on destructive fixes.** Never add `noindex`, never change a canonical, never auto-remove a Bing block, never auto-edit robots. Those are all `FLAG human`. When unsure, flag — no fix beats a wrong fix.
4. **Update & add — NEVER regenerate or delete.** Make only the targeted in-place `Edit` a row calls for (fix a link, add a link, edit a sitemap entry). Never rewrite/rebuild a whole page or run a generator that regenerates content wholesale. Preserve all body copy, sections, schema, and links a row doesn't name.
5. **Stage, don't commit, until Phase 7.** Each phase `git add`s its work; only Phase 7 commits/pushes. The pass stays atomic.
6. **Reviewer authority + retry limit.** On rejection, re-do using the reviewer's notes. **Max 2 rework attempts per gate.** If the 2nd retry still fails, STOP the whole command, report the failing phase + outstanding notes, and wait.
7. **No invented data** — every action traces to a real field in `<TODAY>.bing-raw.json`. Never fabricate a crawl issue, index status, or HTTP code.
8. **Verify targets exist** before acting; otherwise `Ambiguous / needs human`.
9. **Submit only live URLs, only after push, only within quota.** `SubmitUrlBatch` runs in Phase 7 *after* the push, with URLs that are actually deployed, and respects `GetUrlSubmissionQuota` (the helper trims to `DailyQuota` automatically). Never re-submit an unchanged URL.
10. **Report after every phase, then AUTO-CONTINUE.** One human stop only: the Phase 0 manifest. Everywhere else — including the Phase 6 summary, which prints and continues — begin the next phase in the same turn.

---

## Phase 0 — Load report + MANIFEST GATE (‼️ HUMAN STOP 1)

Load today's report (or the arg/newest by **filename date**, not mtime). Require frontmatter `status: ready-for-execution`. Parse each row → bucket + target. Then **print the manifest and STOP for explicit approval.** Never auto-proceed.

```
### Bing Webmaster pass — manifest for <SITE>  (report: reports/bing-webmaster-pass/<TODAY>.md)
| Phase | Bucket | Rows | Plan (per-row targets + action) |
|---|---|---|---|
| 1 | Crawl-error link fixes | N | "Repoint/remove internal links to <url1> (404), <url2> (301)…" |
| 2 | Sitemap / feed hygiene | N | "Fix <sitemap>; refresh lastmod on …; re-submit feed" (or "skipped — no rows") |
| 3 | Orphan internal links  | N | "Add ≤3 inbound links to <orphan1>, <orphan2>…" |
| 4 | Audit                  | — | "Adversarial review of all fixes 1–3" |
| 5 | Build / typecheck      | — | "<discovered build cmd>; revert on failure" |
| 6 | Summary                | — | "Print run summary, then auto-continue (no stop)" |
| 7 | Commit + push + submit | — | "Push to <branch>; SubmitUrlBatch <K> live URLs (quota <DailyQuota>); SubmitFeed if sitemap changed" |
| — | FLAGGED — needs human  | N | robots / malware / blocks / normalization rows — informational, NOT fixed this run |
| — | Working as intended     | N | intentional noindex/redirects/blocks — NOT touched |
```

If any row is `Ambiguous / needs human` with count > 0, the gate cannot be approved until the user resolves them. Then ask: **"Manifest above (N actionable technical rows; K flagged for human). Approve to start fixes, or pause to revise?"** Only on explicit approval, begin Phases 1–3.

---

## Phase 1 — Crawl-error link fixes (Track A)
For each `Crawl error` row: grep the repo for internal links to the bad URL. For a **4xx/5xx target**, repoint the href to the correct live URL, or remove the link if no valid target exists (never leave a dangling link). For a **301/302 target**, update the internal link to point straight at the final destination so Bingbot stops wasting crawl budget on hops. `git add` each file. Reviewer (Explore): every edited link now points to a 200 URL; no unrelated link changed; no copy edited; no site-wide redirect rule added.

## Phase 2 — Sitemap / feed hygiene (Track A)
For each `Sitemap hygiene` / `Indexability` row: ensure legit, indexable pages are present in the sitemap with a correct `<loc>` and fresh `lastmod`; remove entries that 404 or are intentionally noindexed. Edit the sitemap (or its generator's per-URL data) — **never** a global generator filter with wider blast radius. Record which feed URL needs a `SubmitFeed` in Phase 7. `git add`. Reviewer: sitemap still valid XML; only the rows' URLs changed; no indexable page dropped.

## Phase 3 — Orphan internal links (Track B)
For each `Orphan / internal links` row: add **≤3** contextual internal links FROM related existing pages TO the orphan, placed in genuinely relevant body context (never a link dump, never in shared nav/footer = site-wide). This is the ONLY phase that touches page bodies, and it adds links only — **never rewrite the surrounding copy.** `git add`. Reviewer: ≤3 inbound added per orphan, anchors descriptive, links contextually relevant, surrounding copy unchanged, no shared component edited.

## Phase 4 — Audit (consolidated gate for Phases 1–3)
Spawn ONE adversarial reviewer (Explore, read-only) over the full diff. PASS criteria: every change traces to a report row; **no content/title/description/copy change of any kind** (only link fixes, added orphan links, and sitemap entries); no site-wide/shared file touched; no page regenerated/deleted; no `noindex`/canonical/robots change; link fixes resolve to 200s; ≤40 link/href edits + ≤15 sitemap-entry changes. Any violation → REJECT with notes → rework (max 2 attempts).

## Phase 5 — Build / typecheck gate
Run the discovered build/typecheck command. **Fail → `git reset` the staged changes (restore pre-run state), report the failure, STOP.** Never push a broken build.

## Phase 6 — SUMMARY (printed, then auto-continue)
Print the run summary: rows actioned per bucket, files touched, the exact list of URLs to be submitted to Bing (count vs `DailyQuota`), whether a `SubmitFeed` will fire, flagged-for-human rows, and build status. This is informational only — **do NOT stop or ask for approval.** Immediately continue to Phase 7 in the same turn. (The only human gate in the run was the Phase 0 manifest; the Phase 4 audit + Phase 5 build gate are the automatic safety nets before push.)

## Phase 7 — Commit + push + submit (LAST; runs automatically after Phase 6)
1. Single commit, e.g. `chore(bing-webmaster): fix N crawl/index issues across M pages`, push to the default branch.
2. After push succeeds, write the changed + newly-indexable **live** URLs to `/tmp/bing-submit-<TODAY>.txt` (one per line, using `BASE_URL`) and submit:
   ```bash
   python3 .claude/scripts/bing_webmaster.py submit-batch --site "$SITE" \
     --urls-file /tmp/bing-submit-$(date +%Y-%m-%d).txt
   ```
   The helper checks quota and trims to `DailyQuota` (≤500/call hard cap). If a sitemap changed, also `submit-feed --site "$SITE" --feed "<sitemap URL>"`.
3. **Final report:** totals by bucket, files modified, every link/sitemap change, URLs submitted to Bing + quota used, the commit SHA / GitHub URL, and every `FLAGGED — needs human` + `Working as intended` row. Remind the user that Bing recrawl is on Bing's schedule (days), and a future `/bing-webmaster-pass` run will show flagged URLs moving to crawled/indexed in `crawlStats`/`url-info`.

---

## Phase Summary template (print after every phase, then immediately continue)
```
### Phase <n> — <name> — <PASS | FAIL | ESCALATED>
- Rows actioned: <n>   Files touched: <list>
- Reviewer verdict: <pass / rejected-then-fixed / hard-fail>
- Ambiguous / flagged: <rows + why, or "none">
- Continuing to Phase <n+1>...   ← then DO it; the only stop in the run is the Phase 0 manifest
```

## Reference
- **Scope:** technical SEO only (crawl/redirect/index/sitemap/orphan). Editorial, CTR, and new-content work is intentionally out of scope — use `/seo-gsc-pass` or `/keyword-gap-pass` for that.
- Helper: `.claude/scripts/bing_webmaster.py` (subcommands: `sites`, `resolve-site`, `deep-dive`, `crawl-stats`, `crawl-issues`, `url-info`, `url-links`, `link-counts-page`, `blocked-urls`, `query-params`, `feeds`, `quota`, `submit-url`, `submit-batch`, `submit-feed`; plus `query-stats`/`page-stats` for prioritization context)
- Secrets: `BING_WEBMASTER_API_KEY` in `~/.claude/secrets.env`
- Bing JSON API: `https://ssl.bing.com/webmaster/api.svc/json/<Method>?apikey=KEY` (responses wrapped in `{"d": …}`, dates as `/Date(ms)/` — the helper unwraps + decodes both)
- Sibling passes: `/seo-gsc-pass` (Google query data + content), `/indexing-issues-gsc-pass` (Google index status), `/ahrefs-site-audit-auto` (Ahrefs crawl) — this pass is the **Bing technical** equivalent.
