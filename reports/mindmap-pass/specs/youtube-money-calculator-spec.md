# Spec — YouTube Money Calculator (`/youtube-money-calculator/`)

Source: mindmap-pass chart `reports/mindmap-pass/2026-10-08-ai-money.md` (row "YouTube earnings calculator"). Spec only — not built in this run. A human builds it in a follow-up.

## Route
`/youtube-money-calculator/` — a new pillar calculator rendered by `src/pages/[category]/index.astro` (same pattern as `heloc-calculator`, `cd-calculator`, `529-savings-calculator`).

## Format + rationale
**calculator / interactive tool.** The head term literally contains "calculator" (`youtube money calculator`, 9,900/mo, KD 48), and the SERP's PAA is personalised-number questions: "How many views do you need per month on YouTube to make $5000?", "How much money is 1000 views on a YouTube video?", "How many YouTube views do I need to make $2000 a month?". A text article cannot answer a reader-specific number; a calculator can. Page one is calculator tools (auxmode, tubebuddy, ytcalcglobal, lenostube, 1of10) and the AI Overview cites socialblade, mediacube, omnicalculator, noxinfluencer — the SERP shape is "tool".

## Keywords
- Primary: `youtube money calculator` (9,900, KD 48, DataForSEO/SEMRUSH)
- Secondary: `how much does youtube pay` (5,400, KD 63), `youtube rpm` (1,000, KD 36), `youtube shorts rpm` (170, KD 27), `youtube earnings calculator`, `how many views to make money on youtube`

## What it does

### Inputs
| Input | Type | Default | Notes |
|---|---|---|---|
| Monthly long-form views | number | 50,000 | all views; RPM already reflects unmonetized views |
| Monthly Shorts views | number | 0 | |
| Long-form RPM ($ per 1,000 views) | number | **user must enter** | No niche presets: YouTube publishes no RPM-by-niche data and vendor ranges conflict (fact list `facts-youtube-tax.md` §3). Helper text: "Find your RPM in YouTube Analytics → Revenue." |
| Shorts RPM ($ per 1,000 views) | number | user must enter | same note |
| Target monthly income (optional) | $ | blank | drives the "views needed" output |

### Outputs
1. **Estimated monthly revenue** = (long-form views ÷ 1,000 × long-form RPM) + (Shorts views ÷ 1,000 × Shorts RPM).
2. **Estimated annual revenue** = monthly × 12.
3. **Views needed for target** = target ÷ RPM × 1,000 (shown for long-form and for Shorts separately).
4. **YPP eligibility reminder (static)**: ad revenue requires 1,000 subscribers + 4,000 public long-form watch hours (12 months) or 10M Shorts views (90 days); fan-funding tier at 500 subscribers (support.google.com/youtube/answer/72851 and /13429240).
5. **Self-employment tax set-aside** on the annual figure: annual × 92.35% × 15.3%, labelled an upper estimate that ignores business expenses; show $0 below $400 of net earnings and cap the 12.4% Social Security part at the wage base ($176,100 for 2025) by reusing the `/self-employment-tax/` compute (SE tax only; link to `/self-employment-tax/youtube-taxes/` for income tax).

Explain RPM vs CPM on-page using YouTube's own definitions (support.google.com/youtube/answer/9314357) and the 55% long-form / 45% Shorts revenue share (blog.youtube, 2025-02-03) — the share is already inside RPM, so the calculator never applies it a second time.

## Data sources
- YouTube Help: YPP thresholds (72851, 13429240), RPM/CPM definitions (9314357), Shorts revenue sharing (12504220).
- YouTube Official Blog: 55% / 45% share.
- IRS: SE tax 15.3% on 92.35% (tc554; SE tax page).
- **No RPM benchmark data** — deliberately user-supplied. Do not ship niche presets without a primary source.

## Scope
- In scope: ad revenue estimate, views-for-target, SE-tax set-aside, policy reminders.
- Out of scope: sponsorships, memberships, Super Chat (no reliable inputs), non-US withholding.

## Technical dependencies
- New `CalculatorDef` entry in `src/data/calculators.ts` (id `youtube-money-calculator`, islandId `youtube-money`), SEO copy generated through the content pipeline + Phase 4 audit.
- Add the id to `LIVE_IDS` in `src/data/registry.ts` (line 22) only when built.
- New island component `src/components/YouTubeMoneyCalculator.tsx` + registration in `CalculatorIsland.tsx`.
- Reuse the SE-tax computation used by `/self-employment-tax/`.
- Cross-links once live: `/guides/faceless-youtube-channel-ai/`, `/self-employment-tax/youtube-taxes/`, `/guides/how-to-make-money-with-ai/`.

## Placeholder
No placeholder route is created: the `[category]` route only builds ids in `LIVE_IDS`, so an unbuilt calculator renders nothing (and no sitemap entry) until it is registered. Pages shipping this run do NOT link to `/youtube-money-calculator/`.
