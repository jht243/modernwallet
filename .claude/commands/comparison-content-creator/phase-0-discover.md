
<!-- fleet-evidence-contract-v2 -->
**Shared evidence and takeaway rules:** Read the active project's `.claude/commands/_decision-evidence.md` and `_testing-labels.md` before planning, writing, enriching, auditing or publishing substantive content. These contracts govern original analysis, honest visible attribution, intent-based takeaways and tested-label decisions, including work handed to mindmap by another routine. Apply them inside the existing Phase 3 / independent Phase 4 process; no separate workflow or extra human gate. Preserve site permissions, medical/psychedelic and all other exclusions, required professional review, existing sufficient verdicts and the no-addition branch. Local eligibility or an old TESTED template never proves a test happened. If this is a global routine, resolve its sibling shared contracts and install them in the active project before use while preserving local rules. These requirements supersede older blanket testing licenses, copied methods and automatic year/label instructions.
<!-- /fleet-evidence-contract-v2 -->


<!-- workflow-source-freshness-v1 -->
**WORKFLOW SOURCE FRESHNESS — required before every routine.** Before reading routine instructions, editing files or publishing, run `bash .claude/tools/workflow-start.sh` from each active repository. In cloud runs use `bash .claude/tools/workflow-start.sh --cloud`. Local isolated checkouts must include current uncommitted/unpushed source instructions, code, configuration and dependencies; cloud checkouts must match the live published default branch, not a cached remote reference. Cloud cannot see unpublished laptop files: ship reviewed workflow changes before expecting cloud to use them. Missing helpers, failed verification or stale inputs block the affected repository; resolve/integrate the listed dependencies while preserving unrelated work, then recheck. Never bulk-copy dirty files, bypass the check, invent a passing receipt or publish inherited changes without their required review. The check permits this run's own edits after a verified start. Preserve all existing scope, exclusions, schedules, approvals and publication rules. Non-repository tasks have no checkout to check. No new human approval gate.
Run startup as a standalone command and inspect its actual exit code; never pipe it through head/tail/tee or continue after failure.
<!-- /workflow-source-freshness-v1 -->

# Phase 0 — Discover project facts

<!-- workflow-checkpoints-v1 -->
**Complete instructions and rule application:** Before substantive content planning, writing, audit or publication, follow `.claude/commands/_workflow-checkpoints.md`. Use `.claude/tools/workflow-preflight.py` to deliver the current phase and required contracts in complete bounded chunks, then pass its completeness/freshness check. The existing chart reviewer and independent Phase 4 reviewer must audit application with artifact evidence, including source provenance, local exclusions, visible attribution, intent-based takeaways and consistent tested labels. Follow the sibling `_rendered-page-audit.md`: finish central source research before the preparation PASS; audit the complete rendered pages after all template/affiliate/link changes, block inherited contradictions affecting the answer, and verify exact reviewed output live with `rendered-audit.py` before closing deployment and measurement records. Install that contract and helper with the checkpoint dependencies. A read-only reviewer may write internal evidence receipts without editing content. Delivery receipts are not proof of understanding or an audit PASS. Keep existing phases and the sole Phase 0 human gate. Global routines resolve/install the sibling shared checkpoint contract and helper into the active project while preserving local rules.
<!-- /workflow-checkpoints-v1 -->


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
- **Audience / business relevance** — who does this site serve, what topics does it cover, and what does the business sell? (existing content, services pages, CTAs, verticals.) Use this to keep candidates relevant. Phase 2 defaults to realistic organic-click growth; a service/segment match does not automatically increase priority. Record a lead-generation objective only if the user explicitly requests it.
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
  - **Keyword demand ladder (ALWAYS available -- treat as a connected source):** `scripts/lib/keyword_data.py` resolves the best usable provider per field from environment keys (`DATAFORSEO_B64` / `SEMRUSH_API_KEY` / `AHREFS_API_KEY`) and always adds live Google Autocomplete. Record `keyword_data.provider_status()` here. See `.claude/commands/_keyword-demand-ladder.md`.

## Hard-blocker checks (STOP only on these)
- **No comparison/content system found** → STOP; report what you searched (data dirs, content dirs, sitemaps) and ask where comparison content should live.
- **No SEO data source connected** -> this is NOT a blocker on its own. The keyword demand ladder is always available, so continue and let Phase 2 score through it. STOP only if `keyword_data.provider_status()` shows every rung unusable AND the user did not pass `--heuristic`; then say which rungs failed and why.
- **Working tree not safe to publish onto** (`git status` shows unrelated uncommitted changes) → STOP; ask the user to stash/commit first.

## Output
Print a compact discovery summary (BASE_URL, framework, business/brand name, comparison format + interface, entity counts by type, # existing comparisons, available data sources, reusable scripts found, publish path) and write the full version to `reports/comparison-content-creator/discovery.md`. Then **auto-continue to Phase 1** — do not ask.
