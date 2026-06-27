# Phase 0 — Discover project facts

Auto-discover every project fact by inspecting the repo. **Hardcode nothing**; print what you find. Persist the findings to `reports/comparison-content-creator/discovery.md` so later phases share state.

## What to discover

- **BASE_URL** — from sitemap `<loc>`, canonical logic, or JsonLd builders.
- **Framework + deploy mode** — e.g. Next.js static export vs server, Astro, Hugo, MDX, a CMS. Note static-export (no server-side redirects).
- **Comparison content format — the most important fact.** Find how "X vs Y" pages are stored and rendered. Capture the EXACT shape to emit:
  - A typed data-object array (e.g. `data/comparisons.ts` with an exported `ComparisonPage[]` and a `[slug].tsx` route + `getStaticPaths`/`getBySlug` helpers) — record the interface field-by-field, and where new entries get appended (e.g. a `*-new.ts` file that auto-merges).
  - OR MDX/Markdown files in a content dir — record the frontmatter schema + directory.
  - OR a CMS — record how entries are created.
  - Read 1–2 existing comparison pages in full so Phase 3 can mirror structure, schema builders, voice, table/FAQ/verdict conventions, and CTA style.
- **Entity universe** — parse existing content for the things this project writes about, grouped by type. Look across comparison data, guides, verticals/industry pages, landing pages, tags/taxonomies, and any machine-readable entity lists (JSON/YAML/TS arrays). Group into:
  - **Products / tools / platforms** (e.g. CRMs, automation tools, vendors)
  - **Models** (e.g. AI models, if relevant)
  - **Categories / approaches** (conceptual: agent vs chatbot, build vs buy, consulting vs agency)
  - **Audience segments / verticals** (e.g. legal, accounting, medical) — used for `X vs Y for [segment]` long-tail
  Print the grouped entity list. This is the raw material for Phase 1.
- **Existing comparisons (dedup set)** — the slugs + the entity pairs already covered head-to-head. Also note the FULL set of content URLs/H1s/target keywords (guides, verticals, landing pages) — Phase 1b needs all of it, not just comparison slugs.
- **Service / lead mapping** — what does this business actually sell, and to whom? (services pages, CTAs, verticals.) Phase 2 up-weights pairs that map to a real service/segment because the user's priority is leads, not just traffic.
- **Business / brand name** — the site's own brand name (from the `<title>` branding suffix, logo alt text, footer, `package.json`, schema.org `Organization`/`publisher`, or the About page). This is the `{BUSINESS_NAME}` value Phase 3 substitutes into the verbatim content-writing prompt wherever `{BUSINESS_NAME}` appears (see rule 3a in the launcher). If genuinely undiscoverable, fall back to the bare domain. Record it in `discovery.md`.
- **Publish conventions** —
  - Sitemap file(s): list `public/sitemap*.xml`; infer route→file routing + the `<url><loc>…</loc><lastmod>…</lastmod></url>` format.
  - IndexNow key: find `public/<32-hex>.txt`. If absent, IndexNow will be skipped + flagged.
  - Git push flow: default branch, commit message convention (note any `Co-Authored-By` footer pattern).
  - **Reusable scripts:** check for project generator/audit/publish helpers (e.g. `scripts/model_radar/{generate,audit,publish}.py` with `existing_slugs`, `insert_comparisons`, `add_inbound_link`, `add_sitemap`, `tsc_check`, `git_commit_push`, `indexnow`). If present, Phases 3/5 reuse them.
  - Typecheck/build sanity command (e.g. `npx tsc --noEmit`, `npm run build`).
- **Connected SEO data sources** — detect which are available and record exactly what's present so later phases use what exists and skip the rest:
  - **Ahrefs MCP** (keywords-explorer-overview, serp-overview, keywords-explorer-related-terms, gsc-* if routed through it).
  - **GSC MCP** (gsc-keywords, gsc-pages).
  - **SEMrush export** — look for a keyword-gap CSV at `reports/comparison-content-creator/semrush-gap.csv` (or ask the user for a path). SEMrush is a manual export, not an MCP.
  - **Brand Radar** (brand-radar-* tools) for the LLM-citation angle.

## Hard-blocker checks (STOP only on these)
- **No comparison/content system found** → STOP; report what you searched (data dirs, content dirs, sitemaps) and ask where comparison content should live.
- **No SEO data source connected** AND the user did not pass `--heuristic` → STOP; tell them to connect Ahrefs/GSC or drop a SEMrush export, or re-run with `--heuristic` to score on internal signals only.
- **Working tree not safe to publish onto** (`git status` shows unrelated uncommitted changes) → STOP; ask the user to stash/commit first.

## Output
Print a compact discovery summary (BASE_URL, framework, business/brand name, comparison format + interface, entity counts by type, # existing comparisons, available data sources, reusable scripts found, publish path) and write the full version to `reports/comparison-content-creator/discovery.md`. Then **auto-continue to Phase 1** — do not ask.
