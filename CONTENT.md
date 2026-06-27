# Content System — MoneyCalcs

**This system is MANDATORY for ALL page text on this site — every calculator hub, every spoke, and any future page, for all 7 calculators and beyond.** It mirrors the `keyword-gap-pass` global workflow (guided research+write prompt → dedicated adversarial audit per page). It does **NOT** use any external LLM API key — only our own web research tools and Claude subagents.

> Scope note: "content" = the human-readable text (titles, descriptions, intros, how-it-works, common mistakes, worked examples, FAQs, sources). The interactive calculator tool itself is separate and lives in `src/lib/*` + `src/components/*`.

## The two-step workflow (per page)

### Step 1 — Guided research + write (one subagent per page)
A content-writer subagent (general-purpose, with WebSearch/WebFetch) writes the page to this standard:

1. **Research first.** Pull CURRENT (this-year) facts from PRIMARY sources — CFPB, Federal Reserve / FRED, IRS, FTC, SEC, Experian, BLS. Verify every cited URL actually loads. Never cite aggregators or SEO blogs.
2. **Ground-truth math.** Any numeric figure on the page MUST come from the calculator's real engine output, computed ahead of time and handed to the writer. Writers must NOT invent or recompute payments/interest. (Compute with the `src/lib/*` engine — Node 25 can run the `.ts` directly: `node script.mjs` importing the lib by absolute path.)
3. **SEO.** Primary keyword in the title, H1, first sentence of the intro, ≥1 FAQ, and naturally in how-it-works. Title ≤ 60 chars. Meta description ≤ 160 chars.
4. **AEO.** The first sentence of the intro and of how-it-works must each be a complete, self-contained declarative answer (an AI assistant could quote it alone). Each FAQ answer leads with the direct answer, then nuance.
5. **Information gain.** Include ≥1 non-obvious, genuinely useful insight competitor pages omit (a specific tradeoff, failure mode, or decision rule).
6. **E-E-A-T / YMYL (finance is YMYL).** Named author byline ([[Jonathan Velez]]) + Person JSON-LD + "reviewed against primary sources · updated [date]" line — handled by the page template (`Byline.astro` + `jsonld.ts`). Cite 1–3 verified primary sources via the `sources` field.
7. **Readability.** ~7th–8th grade. Sentences < 20 words. Active voice. Short paragraphs. Plain words.
8. **Internal links.** Link up to the hub, down to / across sibling spokes, with descriptive anchor text = the target keyword. Use markdown `[text](/path/)` inside content strings — `linkify()` renders them.

### Step 2 — Adversarial audit (a DIFFERENT subagent per page)
An Explore subagent that did **NOT** write the page audits the BUILT HTML (`dist/<path>/index.html`) against:

**HARD checks (any failure → fix & re-run, max 2 reworks):**
- Title ≤ 60 chars + contains the primary keyword; meta description ≤ 160.
- JSON-LD valid for: `BreadcrumbList`, `WebApplication`, `FAQPage` (questions match visible `<h3>`s), `Person`, `Article` (named author).
- Visible author byline present (YMYL).
- All internal links resolve to real built pages (no orphans / typos).
- **Number accuracy:** every figure matches the engine ground truth exactly.

**Advisory notes (recorded, non-blocking):** low information gain, AEO gaps, missed long-tail, authorship gaps, task-completeness / aggregator sourcing.

## Where content lives
- Calculator hub copy → `src/data/calculators.ts` (per-calculator object: `metaTitle`, `metaDescription`, `intro`, `howItWorks`, `faqs`, `sources`).
- Spoke copy → `src/data/spokes-<calc>.ts` (`title`, `metaDescription`, `h1`, `intro`, `howItWorks`, `commonMistakes`, `workedExample`, `faqs`, `sources`).
- Author config → `src/data/site.ts` (`AUTHOR`, `LAST_UPDATED`). Rendering → `Byline.astro`, `Sources.astro`, `src/lib/jsonld.ts`, `src/lib/richtext.ts`.

## Done = green build + every page passes the adversarial audit
Run `npm run build`, then run the per-page auditors against `dist/`. A page ships only when its hard checks pass.

---
_First applied: 2026-06-25, to the 5 AutoIQ spokes + the auto-loan hub. Reviewed by Jonathan Velez._
