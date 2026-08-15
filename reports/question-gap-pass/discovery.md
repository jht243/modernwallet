# Question-Gap-Pass Discovery — ModernWallet (2026-08-15, auto run)

## BASE_URL
`https://www.themodernwallet.com` (from `astro.config.mjs` `site:` and `src/data/site.ts` `SITE.url`).
GSC property: `sc-domain:themodernwallet.com`.

## Framework + deploy mode
Astro 4 (static, `@astrojs/react` islands for calculators), deployed from `main` (see PUBLISHING rule
in the routine prompt: `git fetch origin main && git rebase origin/main && git push origin HEAD:main`).
No CMS — all content lives in typed TypeScript data-object arrays under `src/data/`.

## Content storage + URL → file mapping
Data-object array pattern. Route files read a slug param and look up the matching object:

| Route pattern | Route file | Data file(s) | Body field(s) |
|---|---|---|---|
| `/guides/[slug]/` | `src/pages/guides/[slug].astro` | `src/data/guides.ts` (+ `guides-business.ts`) | `intro`, `sections[].body` (string, supports inline `[label](href)` markdown links), `faqs[]` |
| `/compare/[slug]/` | `src/pages/compare/[slug].astro` | `src/data/comparisons.ts` (+ `comparisons-business.ts`) | `intro`, `comparisonTable`, `sections[].content`, `verdict`, `faqs[]` |
| `/roundup/[slug]/` | `src/pages/roundup/*.astro` | `src/data/roundups.ts` (+ `roundups-business.ts`) | list content + `faqs[]` (need to confirm exact shape when a roundup page is selected) |
| `/[category]/` (hub, e.g. `/auto-loan/`) | `src/pages/[category]/index.astro` (or similar) | per-category `CalculatorDef` in the relevant `src/data/*.ts` | `intro`, `howItWorks`, `faqs[]` |
| `/[category]/[calculator-slug]/` (spoke) | under `src/pages/[category]/` | `src/data/spokes*.ts` | spoke-specific FAQ/body fields |
| `/[category]/[calculator-slug]/[state]/` | state subpage | `src/data/state-overrides.ts` + `states.ts` | `StateOverride` fields (`intro`, `lawContext`, `extraFaqs`) — **noindexed**, see below |
| `/estate-planning/`, `/elder-care/`, `/tax-resolution/`, `/probate/` pillar hubs | `src/pages/[category]/index.astro` | hub `CalculatorDef`-style entries | `intro`, `howItWorks`, `faqs[]` |

All FAQ arrays share `interface FAQ { question: string; answer: string }` from `src/data/types.ts`.
Guide `GuideSection` = `{ heading: string; body: string }`. Comparison `sections[]` = `{ heading, content }`.

Each page type renders an FAQ block from its `faqs[]` array — need to confirm per-route whether
FAQPage JsonLd is emitted (check the `.astro` layout/route file for the selected pages before editing).

**Noindex:** `src/data/noindex.ts` marks the `/{pillar}/{slug}/{state}/` state-subpage variant as
`noindex,nofollow`. State subpages should generally be skipped for enrichment (they're intentionally
excluded from the sitemap and from search-visible ranking) — Phase 1 will flag and skip them, since
enriching a noindexed page produces no SEO benefit and the GSC clicks measured against `sc-domain:`
may reflect direct/other-channel traffic rather than organic reach.

## Full content URL set (anti-duplication reference for Phase 3)
- Calculator hubs (`LIVE_IDS` in `src/data/registry.ts`): auto-loan, mortgage, real-estate, retirement,
  investing, portfolio, net-worth, budget, tax-resolution, estate-planning, probate, elder-care,
  trump-account, 529-savings-calculator, coast-fire, business-loan-payoff, personal-loan,
  merchant-cash-advance, invoice-factoring, business-line-of-credit, interest-per-day,
  taxable-vs-tax-deferred, credit-card-payoff.
- Guides: `src/data/guides.ts` + `guides-business.ts` (`GUIDES` array).
- Comparisons: `src/data/comparisons.ts` + `comparisons-business.ts` (`COMPARISONS` array).
- Roundups: `src/data/roundups.ts` + `roundups-business.ts`.
- Spokes: `src/data/spokes*.ts` (per-category long-tail calculator variants).
- `CROSS_LINKS` in `src/data/cross-links.ts` — existing curated cross-calculator link map; Phase 4's
  `Link` actions should prefer routes already represented here as a sanity check on relevance.

## GSC data source
Direct GSC API via `.claude/tools/gsc-search-analytics/gsc_search_analytics.py`, using the inline
`GOOGLE_REPORTING_SA_JSON` service account (fleet-standard, read-only `webmasters.readonly`) passed by
the routine. **Note:** the shipped script only supports single-page/`--stdin` lookups (no `--top-pages`
flag despite the phase-1 doc referencing one) — top-pages-by-clicks was pulled with a small ad-hoc
script (`/tmp/.../gsc_top_pages.py`, not committed) that reuses the same `derive_site_url` /
`load_credentials` / `query_search_analytics` helpers with `dimensions: ["page"]`, sorted by
clicks-then-impressions, 90-day window. Result saved to `reports/question-gap-pass/gsc-top-pages.json`.
Confirmed: 40 pages returned, several with clicks ≥1 and many more with triple/quadruple-digit
impressions — clears the ~5-page no-data gate easily.

## Business / brand name
`SITE.name = "ModernWallet"` (`src/data/site.ts`). Operator: Layer3Labs. Author byline: Jonathan Velez
(Personal Finance Writer & Editor). Legal/tax pillar reviewer: `REVIEWER` placeholder (unfilled name).

## Service / lead mapping
Free financial calculators (auto loan, mortgage, retirement, investing, net worth, etc.) plus
professional-services pillars monetized via referral/lead paths: tax-resolution, estate-planning,
probate, elder-care. High-value follow-up questions are ones that gate a purchase/engagement decision
(e.g. "how much does X cost", "do I need a lawyer for X", "am I eligible for X").

## Publish conventions
- Sitemap: auto-generated by `@astrojs/sitemap` integration at build time (no manual `<url>` list to
  edit) — filtered by `isNoindexedPath`. No manual lastmod file to bump.
- IndexNow key file: `public/dc557f6bfced447aa1a71771d8a0d24a.txt` already present (fleet-standard
  fallback key, `INDEXNOW_KEY=dc557f6bfced447aa1a71771d8a0d24a`).
- Git: deploy target is `main`, via `.claude/scripts/deploy-run-to-main.sh push` (rebases
  `RUN_BASE..HEAD` onto latest `origin/main`, aborts — never force-pushes — on real conflict).
- Typecheck: `npx tsc --noEmit` (TypeScript devDependency + `tsconfig.json` present; no dedicated
  package.json script, so invoke `tsc` directly). Build: `npm run build` (`astro build`) — must pass
  before any push per the routine's PUBLISH MODEL rule.
- No `scripts/model_radar/` style reusable helpers found for this repo; operate on data files directly.

## Verbatim content-standard files
- `.claude/commands/seo-gsc-pass/phase-3-new-content.md` — present, will reuse for the FAQ/section
  writing standard.
- `.claude/commands/seo-gsc-pass/phase-4-audit.md` — present, will reuse for the audit standard.
