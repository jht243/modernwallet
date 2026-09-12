# question-gap-pass — Phase 0 Discovery

Repo: `/home/user/modernwallet` (themodernwallet.com). Generated 2026-09-12. Read-only pass — no edits made to the repo.

## 1. BASE_URL

Confirmed: **`https://www.themodernwallet.com`**

- `astro.config.mjs` line 10: `site: "https://www.themodernwallet.com"`.
- `src/data/site.ts` `SITE.url` mirrors it: `"https://www.themodernwallet.com"`.
- `public/robots.txt` points to `Sitemap: https://www.themodernwallet.com/sitemap-index.xml` — same host.

A comment in `astro.config.mjs` notes `src/data/site.ts` (`SITE.url`) is the intended single source of truth; the `site:` config value must be kept in sync manually.

## 2. Framework + deploy mode

- **Astro 4** (`astro@^4.16.18`) static-output site (no adapter configured → default `output: "static"`). React islands via `@astrojs/react` for interactive calculators (`client:only="react"`).
- **Build command:** `npm run build` → `astro build && node scripts/check-bundle-size.mjs` (package.json `scripts.build`). There's also a `prebuild` script (`node scripts/build_search_index.mjs`) that npm runs automatically before `build`.
- **Sitemap:** generated at build time by `@astrojs/sitemap` (v3.2.1), configured in `astro.config.mjs`:
  ```js
  integrations: [react(), sitemap({ filter: (page) => !isNoindexedPath(new URL(page).pathname) })]
  ```
  This writes `sitemap-index.xml` + `sitemap-0.xml` into `dist/` at build time. **There is no static `public/sitemap*.xml` file in the repo** (confirmed — `public/` only has `ads.txt`, `apple-touch-icon.png`, the IndexNow key file, favicons, `llms.txt`, `robots.txt`). `dist/` is git-ignored (`.gitignore` line 1: `dist/`), so no sitemap file is ever committed.
  - The integration's `filter` callback imports `isNoindexedPath` from `src/data/noindex.ts` to drop noindexed pillar sub-pages from the sitemap (see §8).
- **`<lastmod>` control — IMPORTANT for Phase 6:** `@astrojs/sitemap` by default stamps `<lastmod>` with **the build timestamp** (the moment `astro build` runs), not per-page dates, unless a page explicitly sets `Astro.response.headers.set('Last-Modified', ...)` (Astro passes that through to the sitemap generator) — **this repo does none of that**. No page component reads/writes a `Last-Modified` header, and the sitemap integration config here has no `serialize()` callback or per-entry override. So:
  - **"Bump sitemap lastmod for an enriched page" is a NO-OP as a manual repo edit** — there is no file to hand-edit. The very next `npm run build` will already regenerate the sitemap with a fresh build-time `<lastmod>` for every URL (enriched or not), since the whole sitemap is regenerated wholesale each build.
  - The per-page date signal that *does* need manual bumping is content-level: `updated` field on the `Guide` / `ComparisonEntry` / `RoundupEntry` / `SpokeEntry` objects (see §3) — this feeds the visible "Last updated" byline AND `dateModified` in the `Article` JSON-LD (`datePublished`/`dateModified` both fall back to the sitewide `LAST_UPDATED` constant in `src/data/site.ts` if `entry.updated` is unset). **Phase 6 should set `updated: "<today's ISO date>"` on each edited data object**, not touch any sitemap file.

## 3. Content storage + URL→file mapping (most critical)

The site is a **hub-and-spoke data-array architecture**: every page type is a plain TypeScript array of typed objects in `src/data/*.ts`, consumed by a small number of dynamic Astro routes via `getStaticPaths()`. There is **no CMS, no MDX/Markdown content files, and no single "registry" file that aggregates everything** — despite the name, `src/data/registry.ts` only exports `LIVE_IDS` (the `Set` of calculator IDs that have a working React island and therefore get built pages — see below). Each content type instead aggregates through its own top-level data file, which imports and spreads sibling "silo" files.

### Types (`src/data/types.ts`)
Shared interfaces: `FAQ { question, answer }`, `Source { label, url }`, `Reviewer { name, credentials, url? }`, `StateContext`, `StateOverride`, `CalculatorDef`, `SpokeEntry`. Per-content-type interfaces (`Guide`, `ComparisonEntry`, `RoundupEntry`) are actually declared in their own top-level file (`guides.ts`, `comparisons.ts`, `roundups.ts`), not in `types.ts`.

### The 5 content types and their URL→file mapping

| Type | Route file | URL pattern | Aggregator array | Real body field(s) | Own count (this file) | Imported silo files (own counts) | **Total** |
|---|---|---|---|---|---|---|---|
| **Guide** | `src/pages/guides/[slug].astro` | `/guides/{slug}/` | `GUIDES` (`src/data/guides.ts`) | `sections: {heading, body}[]` (body = markdown-ish string w/ `[text](/url)` links, rendered via `richBody()`), `introText`, `faqs: FAQ[]` | 176 | `guides-business.ts` (`BUSINESS_GUIDES`, 8), `guides-self-employed.ts` (`SELF_EMPLOYED_GUIDES`, 4) | **188** |
| **Spoke (calculator page)** | `src/pages/[category]/[slug].astro` | `/{calculator}/{slug}/` | `SPOKES` (`src/data/spokes.ts`) | `howItWorks` (string, split on `\n\n`), `workedExample?`, `commonMistakes: string[]`, `faqs: FAQ[]` | 0 (pure aggregator) | 20 `spokes-*.ts` files, ~117 entries total (see §4 table) | **~117** (only those whose `calculator` is in `LIVE_IDS`; see below) |
| **Calculator hub** | `src/pages/[category]/index.astro` (confirmed on disk; distinct from `[category]/[slug].astro` which handles spokes) | `/{id}/` | `CALCULATORS` (`src/data/calculators.ts`) | `howItWorks`, `faqs: FAQ[]`, `introText` | 26 (own `id:` entries) | `bf-mca-hub.ts`, `bf-factoring-hub.ts`, `bf-loc-hub.ts`, `se-hubs.ts` (`SELF_EMPLOYMENT_TAX_HUB`, `MILEAGE_DEDUCTION_HUB`, `FREELANCE_RATE_HUB`, `S_CORP_TAX_HUB`) — 7 more, all spread into `CALCULATORS` | **33** |
| **Comparison** | `src/pages/compare/[slug].astro` | `/compare/{slug}/` | `COMPARISONS` (`src/data/comparisons.ts`) | `sections: {heading, content}[]` (rendered via `richBody()`), `verdict`, `comparisonTable.rows`, `faqs: FAQ[]` | 135 | `comparisons-business.ts` (`BUSINESS_COMPARISONS`, 7), `comparisons-business-structure.ts` (`BUSINESS_STRUCTURE_COMPARISONS`, 2) | **144** |
| **Roundup** | `src/pages/roundup/[slug].astro` | `/roundup/{slug}/` | `ROUNDUPS` (`src/data/roundups.ts`) | `sections: {heading, content}[]`, `rankingCriteria?`, `verdict`, `options[].description`, `faqs: FAQ[]` | 38 | `roundups-business.ts` (`BUSINESS_ROUNDUPS`, 4), `roundups-self-employed.ts` (`SELF_EMPLOYED_ROUNDUPS`, 3) | **45** |
| **Template** | `src/pages/templates/[slug].astro` | `/templates/{slug}/` | `TEMPLATES` (`src/data/templates.ts`) | not read in full this pass — `templates.ts` has its own `TemplateEntry`/`TemplateSection`/`TemplateFile` interfaces | 7 | none | **7** |
| **State subpage** | `src/pages/[category]/[slug]/[state].astro` (confirmed on disk) | `/{category}/{slug}/{state}/` | `STATE_OVERRIDES` (`src/data/state-overrides.ts`) merged with `STATES` (`src/data/states.ts`, 50 entries) per spoke's `stateVariants` | `StateOverride.lawContext`, `.introText`, `.extraFaqs` | — | — | generated per spoke×state combo where `SpokeEntry.stateVariants` is set |

**Body field key summary** (the fields Phase 4 must target when enriching a page):
- Guides & Comparisons/Roundups: **`sections[].body`** (Guide) or **`sections[].content`** (Comparison/Roundup) — both are strings passed through `richBody()` (supports markdown pipe-tables and lists) and rendered with `Fragment set:html={richBody(...)}`.
- All types: **`faqs: FAQ[]`** (`{question, answer}`) is the FAQ block — this is also what feeds `FAQPage` JSON-LD (see below), so adding a new follow-up-question section usually means pushing a new `{question, answer}` object into an entry's `faqs` array (cheapest, safest enrichment) or appending a new `{heading, body|content}` object to `sections[]` for a longer treatment.
- Spokes/Calculator hubs: `howItWorks` (single string), `commonMistakes: string[]`, optional `workedExample`, plus `faqs`.

### How a slug resolves (read `guides/[slug].astro`, `[category]/[slug].astro`, `compare/[slug].astro`, `roundup/[slug].astro` in full)
Every route follows the same pattern: `getStaticPaths()` maps the aggregator array 1:1 to `{params, props}` (with `COMPARISONS`/`ROUNDUPS` filtering out `entry.draft`, and `[category]/[slug].astro` filtering `SPOKES` down to only calculators present in `LIVE_IDS` — i.e. **a spoke with `calculator` not in `LIVE_IDS` gets no built page at all**, even though it exists in the data file). Each `*_BY_SLUG` lookup object (`GUIDE_BY_SLUG`, `COMPARISON_BY_SLUG`, `ROUNDUP_BY_SLUG`) is also exported for O(1) lookup by slug — useful for Phase 1/3 when resolving a GSC URL back to its data object without scanning the array.

### FAQPage JSON-LD — confirmed, emitted inline per route
Every one of the 4 route files read (`guides/[slug].astro`, `[category]/[slug].astro`, `compare/[slug].astro`, `roundup/[slug].astro`) builds its own `FAQPage` JSON-LD **inline in frontmatter**, gated on the entry having a non-empty `faqs` array:
```js
const jsonLdFaq = entry.faqs.length ? {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: entry.faqs.map((f) => ({
    "@type": "Question", name: f.question,
    acceptedAnswer: { "@type": "Answer", text: plain(f.answer) },
  })),
} : null;
```
then emitted as `{jsonLdFaq && <script type="application/ld+json" set:html={JSON.stringify(jsonLdFaq)} />}`. There is **no shared component** for this — it's copy-pasted per route (small drift risk, but functionally identical across all 4). **Consequence for Phase 4: when a follow-up question is added to `faqs[]`, the FAQPage JSON-LD updates automatically at build time — no separate JSON-LD edit needed.** `plain()` (from `src/lib/richtext.ts`) strips `[text](url)` markdown-link syntax down to plain text for the JSON-LD `text` field (JSON-LD must not contain HTML).

Other JSON-LD present on every page: `BreadcrumbList`, `Person` (author, `personSchema()`), `Article` (`articleSchema()`, includes `datePublished`/`dateModified`/`sources`); `[category]/[slug].astro` additionally emits `WebApplication` (for the live calculator) and, on legal pillars, a second `Person` node for the attorney reviewer. All JSON-LD builder functions live in `src/lib/jsonld.ts`.

## 4. The full content URL set (enumeration method + counts)

Enumerate ALL live URLs by reading every data file's aggregator array (no CMS, so this is exhaustive and exact):

- **`/guides/{slug}/`** — every object in `GUIDES` (`guides.ts` 176 + `guides-business.ts` 8 + `guides-self-employed.ts` 4) = **188 URLs**.
- **`/compare/{slug}/`** — every non-`draft` object in `COMPARISONS` (`comparisons.ts` 135 + `comparisons-business.ts` 7 + `comparisons-business-structure.ts` 2) = **144 URLs** (minus any `draft: true` entries).
- **`/roundup/{slug}/`** — every non-`draft` object in `ROUNDUPS` (`roundups.ts` 38 + `roundups-business.ts` 4 + `roundups-self-employed.ts` 3) = **45 URLs** (minus drafts).
- **`/templates/{slug}/`** — every object in `TEMPLATES` (`templates.ts`) = **7 URLs**.
- **`/{id}/`** (calculator hub) — every object in `CALCULATORS` (`calculators.ts` 26 own + `bf-*-hub.ts` ×3 + `se-hubs.ts` ×4 = 33), **filtered to `isLive(c)`** (i.e. `LIVE_IDS.has(c.id)` — currently all 30 IDs listed in `registry.ts`'s `LIVE_IDS` set are live; a few defined-but-not-yet-live hub ids may exist and would show as "upcoming" on `/calculators/` without a built page).
- **`/{calculator}/{slug}/`** (spoke) — every object across the 20 `spokes-*.ts` files aggregated into `SPOKES` (~117 entries total: auto 7, budget 5, business-financing 4, elder-care 3, estate-planning 5, freelance-rate 3, gig-drivers 7, gig-online 5, investing 14, mileage 3, mortgage 13, net-worth 7, personal-loan 1, portfolio 7, probate 3, real-estate 9, retirement 12, s-corp 3, self-employed 2, tax-resolution 4), **filtered to spokes whose `calculator` is a live id**. Note: spokes under `NOINDEX_PILLARS` (see §8) still get a built page but are `noindex,nofollow` and excluded from the sitemap — they still count as live, crawlable-by-URL content for the anti-duplication check, just not GSC/Google-indexed.
- **`/{calculator}/{slug}/{state}/`** — one page per `(spoke, state)` pair where `SpokeEntry.stateVariants` is set, cross-referenced against `STATES` (`states.ts`, 50 entries) and optional per-combo overrides in `STATE_OVERRIDES` (`state-overrides.ts`). Not fully enumerated in this pass; treat as "many" and pull the exact count by summing `stateVariants?.length` across `SPOKES` if a future phase needs the precise figure.
- **Static pages**: `/`, `/about/`, `/contact/`, `/editorial-policy/`, `/methodology/`, `/calculators/` (index) — 6 fixed routes under `src/pages/*.astro` (not data-driven).

**Grand total of data-driven article/tool pages ≈ 188 + 144 + 45 + 7 + 33 + 117 = ~534**, plus the state sub-pages and 6 static pages. This is the full set Phase 3's anti-duplication / cross-page dedup check should scan (H1 + slug + topic, pulled straight from each data array — no crawling needed since it's all local TypeScript).

## 5. GSC data source

Tool: `.claude/tools/gsc-search-analytics/gsc_search_analytics.py` (392 lines).

**Important discrepancy found:** `.claude/commands/question-gap-pass/phase-1-select-pages.md` (and this phase-0 spec) describe the tool as supporting a `--top-pages <N>` flag ("ranks pages by clicks then impressions, returns JSON `{top_pages: [...]}`"). **The actual script on disk does not have this flag.** Its real `argparse` surface (confirmed by reading the file in full) is:

```
gsc_search_analytics.py --base-url <url> (--page <url> | --stdin) [--site-url <url>]
                         [--sa-file <path>] [--days N] [--trend] [--json <path>]
```
- `--base-url` (required): derives the `sc-domain:<host>` GSC property.
- `--page`: a single full page URL to inspect, OR `--stdin`: batch mode, one page URL per line — **the script requires you already know the candidate page URLs**; it does not itself list/rank the top pages of a property.
- `--days` (default 30): summary window.
- `--trend`: adds 90-day week-by-week impression trend.
- `--json <path>`: write to file instead of stdout.
- Auth: service account via (in order) `--sa-file`, `GOOGLE_REPORTING_SA_JSON` (inline JSON, for cloud), `GOOGLE_REPORTING_SA_FILE` (path), `GSC_SA_FILE`, or `~/.claude/secrets/gsc-service-account.json`. **None of these are present in this environment** (checked: no env vars set, no local secrets file) — confirmed per the user's instruction not to invoke it with real credentials; the user will run it themselves.
- Output per page: `{page, site_url, window_days, totals:{impressions,clicks,ctr,position}, top_queries:[...], trend, verdict:{label, reason, rewrite_recommended, ...}}`.
- Exit codes: `0` success, `2` no credentials, `3` 403/no property permission, `4` bad args.

**Flag for Phase 1:** since there is no built-in "list top pages" mode, Phase 1 will need to either (a) get the top-N page list from elsewhere (e.g. Ahrefs MCP `gsc-pages`, which the phase-0 spec allows as fallback, or a GSC UI/Search Console export the user supplies), then feed those URLs into this script via `--stdin` for per-page click/impression confirmation, or (b) the user/Phase-1 author updates this script to add a real `--top-pages` mode before relying on the documented interface. This should be flagged back to the user/Phase 1 rather than silently assumed to work as documented.

A sibling script exists for a different purpose: `.claude/tools/indexing-issues-gsc-pass/gsc_url_inspection.py` (and an identical copy under `.claude/tools/indexing-pass/`) — per-URL **index status** inspection (URL Inspection API), not search-analytics/top-pages. Not a substitute for ranking pages by clicks.

## 6. Business / brand name

**Display name: `ModernWallet`** (no space, single word, capital M and W) — confirmed consistently across:
- `src/data/site.ts`: `SITE.name = "ModernWallet"`; `SITE.tagline = "Free Financial Calculators"`.
- `src/pages/about.astro`: heading "About {SITE.name}", body copy referring to "ModernWallet" throughout.
- `src/lib/jsonld.ts`: `Organization` node (`worksFor`/`publisher`) uses `SITE.name` = "ModernWallet".
- Live domain: `www.themodernwallet.com` (lowercase, three words concatenated) — the site comment in `site.ts` explicitly notes the brand name (ModernWallet) and the domain (TheModernWallet.com) intentionally differ, with a goal to eventually acquire the exact-match `ModernWallet.com`.
- **Site operator** (distinct from the on-site brand): `OPERATOR.name = "Layer3Labs"`, `OPERATOR.url = "https://www.layer3labs.io"` — surfaced on the About page ("ModernWallet is operated by Layer3Labs").
- **Named author/E-E-A-T byline**: `AUTHOR.name = "Jonathan Velez"`, role "Personal Finance Writer & Editor" — used in the `Person` JSON-LD and the visible byline component (`Byline.astro`) on every article page.
- **`{BUSINESS_NAME}` token for Phase 4** should resolve to **`ModernWallet`**.

## 7. Service / lead mapping

ModernWallet is a **personal- and business-finance content + free-calculator site**, not an e-commerce or SaaS product. Per `SITE.description`, `about.astro`, and the category structure:
- **Core product**: free, no-signup interactive financial calculators (auto loan, mortgage, retirement, investing, portfolio, real estate/rental, net worth, budget, plus newer pillars: tax resolution, estate planning, probate, elder care, business financing (MCA/factoring/line-of-credit), self-employment tax/mileage/freelance-rate/S-corp, and several competitor-monitor-driven single calculators).
- **Content layers around each calculator pillar**: long-form Guides (journey/persona content threading several calculators), Comparisons (`X vs Y`), Roundups (`best X companies/tools`), Templates (downloadable files), and Spokes (long-tail intent pages pre-configuring the calculator).
- **Monetization / "lead" surface**: `LeadForm.astro` is shown on business-financing guides/comparisons/roundups/calculator pages (gated by `BUSINESS_GUIDE_SLUGS` / `BUSINESS_COMPARISON_SLUGS` / `BUSINESS_ROUNDUP_SLUGS` / `BUSINESS_CALC_IDS` in `src/data/business-financing.ts`) — this is the actual "gates a purchase/lead" surface Phase 3 should weight highly: a follow-up question on an MCA/factoring/line-of-credit page that a visitor would ask right before filling out that lead form is high value. There's also an affiliate partner (Robinhood, via `src/data/partners.ts` + auto-linking in `richtext.ts`) — a follow-up question that would plausibly precede a Robinhood signup click on an investing page is similarly high value.
- Everything else (personal-finance/self-employed guides, comparisons, roundups with no lead form/affiliate link) is purely informational/programmatic-SEO traffic — still valuable for a follow-up question that reduces bounce/improves dwell, but doesn't gate a monetizable action.

## 8. Publish conventions

- **Sitemap**: no static file to hand-edit — confirmed (§2). `@astrojs/sitemap` regenerates `dist/sitemap-index.xml` + `dist/sitemap-0.xml` wholesale on every `astro build`, filtered by `isNoindexedPath()` from `src/data/noindex.ts`. `NOINDEX_PILLARS` = `{tax-resolution, estate-planning, probate, elder-care, merchant-cash-advance, invoice-factoring, business-line-of-credit}` — every spoke/state sub-page under these 7 pillars is `noindex,nofollow` and dropped from the sitemap; the pillar hub itself stays indexed. Phase 6 should not attempt to touch a sitemap file — just bump the content `updated` field (§2) and let the next build regenerate the sitemap naturally.
- **IndexNow key**: found — `public/dc557f6bfced447aa1a71771d8a0d24a.txt` (32 lowercase hex chars, matches the expected `public/<32-hex>.txt` convention). A submission helper exists: `scripts/submit_indexnow.py`.
- **Git flow**: default branch `main` (confirmed via working-tree state; no branch switch needed). Working tree is currently clean (`git status --short` empty) — safe to stage onto. Commit style, from `git log --oneline -15`: one commit per routine run, message format `<routine-name> YYYY-MM-DD: <short outcome summary>` (e.g. `ga4-top-pages-pass 2026-09-12: 2 new comparisons across 2 audited winners`, `trend-pass-auto 2026-09-11: no-changes run — both lanes already covered`), including explicit "no-changes run" commits when a scheduled pass found nothing to do. Every commit ends with:
  ```
  Co-Authored-By: Claude <model> <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_...
  ```
  (model name varies by session — recent history shows both "Claude Sonnet 5" and "Claude Fable 5.1"; this session's own required attribution block, per the system reminder, is "Claude Sonnet 5" + this session's URL — use that exact block for any commit `question-gap-pass` makes).
- **Reusable helpers** under `scripts/` (top level + one level into subdirs), relevant to publishing/typecheck/indexnow:
  - `scripts/submit_indexnow.py` — IndexNow submission.
  - `scripts/check-bundle-size.mjs` — runs as part of `npm run build`, post-`astro build`.
  - `scripts/build_search_index.mjs` — runs as `prebuild` (site-search index).
  - No dedicated `tsc_check` / `add_sitemap` / `git_commit_push` helper scripts exist in this repo (unlike the pattern the phase-0 spec anticipated) — routines appear to run `astro build`/git commands directly. Other pass-specific script dirs present: `scripts/competitor_monitor/`, `scripts/compliance_pass/`, `scripts/podcast_pain_pass/`, `scripts/trend_pass/`, `scripts/lib/` (shared `content_gen.py`, `dataforseo.py`, `keyword_data.py`, `serp.py`, `site_audit.py`), plus standalone `scripts/humanize_intro.py`, `scripts/keyword_pass_classify.py`, `scripts/keyword_pass_inventory_append.py`, `scripts/semrush_keyword_gap.py`, `scripts/search_gap_worker.mjs`, `scripts/build_templates.py`. None of these are question-gap-pass-specific; operate on data files directly.
- **Typecheck/build command**:
  - `tsconfig.json` exists (`extends: "astro/tsconfigs/strict"`, includes `.astro/types.d.ts` + `**/*`, excludes `dist`, path alias `@/* -> src/*`) — so a standalone typecheck is possible.
  - `node_modules/.bin` has **neither `astro` nor `tsc`** symlinked directly at top level in this check (likely hoisted differently or not yet `npm install`ed in this environment) — use `npx astro check` (Astro's own typechecker, aware of `.astro` files — `tsc --noEmit` alone will not type-check `.astro` component files, only `.ts`/`.tsx`) or `npx tsc --noEmit` for a pure-TS check of the `src/data/*.ts` files being edited. Given this pass only edits `.ts` data files (not `.astro` templates), **`npx tsc --noEmit`** is sufficient and is the right pre-publish gate; the full `npm run build` (`astro build && node scripts/check-bundle-size.mjs`) remains the authoritative end-to-end build/publish check before pushing.

## 9. Verbatim content-standard files — existence confirmed

Both exist (contents not summarized here per instructions — read them directly):
- `/home/user/modernwallet/.claude/commands/seo-gsc-pass/phase-3-new-content.md` — **EXISTS** (8,166 bytes).
- `/home/user/modernwallet/.claude/commands/seo-gsc-pass/phase-4-audit.md` — **EXISTS** (9,693 bytes).

## Hard-blocker check

None triggered:
- Content system + URL→file mapping: found and fully mapped (§3–4).
- GSC source: script exists and its real interface is documented (§5); no credentials present locally, but the user has stated they will run it themselves — not a blocker for Phase 0/this discovery pass.
- Working tree: clean, safe to stage onto.

---
**Phase 0 complete.** Auto-continuing to Phase 1 per instructions (this doc's Phase-0-completion is not the workflow's human gate — that's Phase 3's Gap Chart).
