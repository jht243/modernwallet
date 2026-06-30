# Phase 0 — Discover project facts + load roster/ledger

Auto-discover every project fact by inspecting the repo. **Hardcode nothing.** Persist findings to `reports/competitor-monitor/discovery.md` so later phases share state, then auto-continue to Phase 1.

## Reuse the comparison discovery, then add the competitor-monitor extras

Run the discovery in `.claude/commands/comparison-content-creator/phase-0-discover.md` to capture: **BASE_URL**, framework + deploy mode (Next.js / Astro / MDX / etc.), the **content format + where new pages are stored** (the exact data file / `*-new` auto-merge file, or MDX/content dir, that the reused comparison/keyword generator writes to), the **entity universe + full existing-content inventory** (slugs + H1s + target keywords across ALL content — Phase 2 needs all of it), the **business/brand name** (the `{BUSINESS_NAME}` value Phase 3 substitutes), **publish conventions** (sitemap files `public/sitemap*.xml`, IndexNow key `public/<32-hex>.txt` if any, typecheck/build command), and **reusable scripts** (any project publish/generate/audit helper — e.g. one exposing `existing_slugs` / `add_sitemap` / `indexnow` / `git_commit_push` — that Phases 3/5/6 can reuse).

> **Skip the "no SEO data source connected" hard-blocker** from that file. This skill does **not** use Ahrefs/SEMrush/GSC — its trigger is competitor publishing, not search data. Absence of an SEO data source is NOT a blocker here.

## Competitor-monitor-specific discovery

- **Roster** — read `scripts/competitor_monitor/competitors.json`. Count enabled competitors. If the file is missing or empty → **hard blocker** (skip run, email failure: "competitor roster missing").
- **Ledger** — read `reports/competitor-monitor/ledger.json`. Note how many competitors are already tracked and whether this is effectively a first run (empty `competitors`).
- **Previous baseline chart** — find the most recent `reports/competitor-monitor/baseline-*.{md,json}`. This is the reference chart the run measures against. Note its date and per-competitor on-niche counts. If none exists, this is the first run — the baseline gets created at the end (Phase 6). The chart is regenerated and committed **every run**, and each new chart auto-diffs against the previous one (its "Changes since the previous chart" section is the spotted delta).
- **Existing tools/interactives** — find whether the project has interactive tools/calculators and, if so, the pattern they follow (route location, component location, any SoftwareApplication JSON-LD helper) so Phase 3c can mirror it. If the project has NO interactive-tool mechanism, Phase 3c falls back to a guide page.
- **Tools sitemap** — note which sitemap lists tool/interactive routes (if the project has one).

## Hard-blocker checks (STOP only on these)
- No content system found (no guides/comparisons data files).
- Competitor roster missing/empty.
- Working tree not safe (uncommitted unrelated changes) — pre-flight already covers this.

## Output
Print a compact discovery summary (BASE_URL, framework, content data files, # existing guides/comparisons/tools, roster size, ledger state, reusable scripts, IndexNow key present?) and write the full version to `reports/competitor-monitor/discovery.md`. **Auto-continue to Phase 1.**
