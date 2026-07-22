# Asset Spec: High-Yield Savings Account (en Español)

**Prepared:** 2026-07-22 · Google-Autocomplete keyword-gap pass · Phase-3 non-article asset spec (do not build — spec only)

## 1. Target route/URL

**Recommended for this pass: `/guides/high-yield-savings-account-en-espanol/`** — a single Spanish-language guide page inside the existing `src/data/guides.ts` `GUIDES` array (flat English URL structure, no route changes).

**Not recommended for this pass:** `/es/...`-style i18n routing. Confirmed by searching `src/pages/**` for any `[lang]` dynamic-segment pattern: **none exists**. There is no i18n routing infrastructure anywhere in this project today — no locale-prefixed routes, no hreflang tags, no language-switcher component, no translated string tables. Building real i18n routing is a separate, much larger infrastructure project (see Section 6) and should not be bundled into shipping one Spanish-language page.

## 2. Recommended format + why

**Format: a single Spanish-language guide page, added to the existing `GUIDES` array — Path (a) below — because it fits the current architecture with zero new infrastructure.**

Why this signal, why a guide and not a calculator: the query signals — **"high yield savings account que es"**, **"que significa"**, **"en español"** — are pure definitional/informational intent ("what is," "what does it mean"), in Spanish, for the *same* U.S. financial product and *same* U.S. market the site already covers in English (not a different country's product, not a different regulatory regime). This is a language-localization gap, not a content gap: ModernWallet almost certainly already has English HYSA content the demand is mirroring. The right asset is a translated/adapted explainer guide, not a new calculator (the intent is "explain this to me," not "calculate something for me") and not a new hub/spoke calculator page.

### Two implementation paths for the human engineer to choose between

**(a) Single Spanish-language guide page as a one-off — RECOMMENDED for this pass.**
- Simplest, fits the current architecture exactly as-is: one more entry in the `GUIDES: Guide[]` array (`src/data/guides.ts`), written entirely in Spanish, rendered by the existing guide-page template with zero code changes.
- Ships fast, captures the query demand immediately, and is a safe, reversible bet on whether Spanish-language demand is worth building on further.
- Downside: no hreflang signaling to search engines that this is a Spanish variant of an English topic, no language switcher, and if Spanish demand grows, this one-off page won't scale into a coherent Spanish section of the site.

**(b) Proper i18n routing — the "right" long-term architecture, bigger lift, NOT recommended for this pass.**
- Would require: a new route pattern (e.g. `/es/[category]/[slug]/` or `/[lang]/...` mirroring the existing `[category]/[slug]` structure), `hreflang` alternate tags wired into `BaseLayout.astro`'s `<head>`, a decision on scope (translate the whole site's calculators/guides, or just a curated Spanish subsection), and likely a content-management decision about whether Spanish content lives in parallel data files (e.g. `guides-es.ts`) or an inline translation layer.
- This is real infrastructure work — new route logic, SEO tag plumbing, and an ongoing translation-maintenance commitment — not a single-page task.
- **Recommendation:** flag (b) explicitly as the correct long-term direction *if* Spanish-language query volume in Google Autocomplete / GSC continues to show up across multiple financial topics (not just HYSA) in future passes. Until that pattern is confirmed, (a) is the pragmatic, low-risk first step.

## 3. What the asset does — content/schema needed

This is a guide, not a calculator, so "inputs → outputs" doesn't apply — instead, the concrete content scope:

Using the existing `Guide` interface (`src/data/guides.ts`):
```ts
export interface Guide {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  cardBlurb: string;
  intro: string;
  sections: GuideSection[]; // { heading, body }
  tools: GuideTool[];       // { href, label } — link out to the (English) HYSA calculator/hub if one exists
  faqs: FAQ[];
  sources?: Source[];
}
```

Content to cover, entirely in Spanish:
- **Qué es una cuenta de ahorros de alto rendimiento** (what a HYSA is) — a plain-language definition as the opening section, mirroring the AEO self-contained-sentence pattern already used across the site's English intros
- **APY frente a tasa de interés** (APY vs. interest rate) — this distinction is a frequent point of confusion in English content too (per the "que significa" signal, suggesting readers are specifically confused about terminology), so it deserves its own section
- **El seguro de la FDIC** (FDIC insurance) — what it covers, the $250,000 limit, why it matters for choosing a bank
- A short comparison/decision section: cómo elegir una cuenta de ahorros de alto rendimiento (how to choose one) — bank vs. online bank, minimum balance, fees
- `tools`: link to the site's existing English-language HYSA/savings calculator or hub page if one exists on the site (verify against `src/data/calculators.ts` / the live-calculator registry before publishing) — even though the guide is in Spanish, the linked tool can remain the existing English calculator; do not build a Spanish calculator UI in this pass
- `sources`: FDIC.gov (has official Spanish-language pages — cite the Spanish FDIC deposit-insurance page directly, e.g. fdic.gov/es or the Spanish-language FDIC consumer resources, to keep E-E-A-T sourcing native-language-appropriate rather than citing an English page in a Spanish guide)

## 4. Primary + secondary keywords

- **Primary:** "cuenta de ahorros de alto rendimiento" / "high yield savings account que es"
- **Secondary:** "que es una cuenta de ahorros de alto rendimiento", "que significa apy", "cuenta de ahorro alto rendimiento en español", "seguro fdic que es"

## 5. Word-count/scope estimate

Matching the density of existing guides in `src/data/guides.ts` (e.g. `am-i-ready-to-retire`, ~5 sections):
- `intro`: ~100–130 words
- `sections`: 4 sections × ~150–200 words each = ~600–800 words
- `faqs`: 5 Q&A pairs × ~40–60 words = ~200–300 words
- **Total copy: ~900–1,150 words**, entirely in Spanish, matching the scope of a standard single-topic guide on this site (smaller than the multi-step `am-i-ready-to-retire` guide since this is a single-concept explainer, not a multi-stage journey).

## 6. Technical dependencies

- **Data:** add one new entry to `GUIDES: Guide[]` in `src/data/guides.ts` (or, if the guides file is organized by vertical like `guides-business.ts`, consider whether a `guides-es.ts` companion file is worth starting now even for path (a), purely as a forward-compatible organizational choice — not required, but flagged as a cheap hedge if more Spanish content follows).
- **Template/rendering:** no changes needed — the existing guide-page route/template renders any `Guide` entry regardless of language; Spanish text flows through the same `linkify`/`paragraphs` rendering helpers used elsewhere (`src/lib/richtext.ts`), which are language-agnostic.
- **No i18n infra exists to build on or extend** — confirmed via `find src/pages -iname "*lang*"` (no results) and no `hreflang`/`i18n` references anywhere in `src/` or `astro.config.*`. If path (b) is ever pursued, that infra work starts from zero and should be scoped as its own project, not appended to this spec.
- **SEO note for path (a):** since there's no hreflang plumbing, this page's discoverability will rely entirely on organic Spanish-language keyword relevance (title/meta/body in Spanish) rather than explicit language-targeting signals to Google — acceptable for a single test page, a real limitation if Spanish content scales.
- **Cross-links:** link from this guide's `tools` array to the relevant English HYSA calculator/hub (whichever is live per `src/data/registry.ts`); no reverse link needed from the English page in this pass (avoid signaling a formal language-parity relationship without proper hreflang support, which could confuse search engines about which page is canonical for what audience).
