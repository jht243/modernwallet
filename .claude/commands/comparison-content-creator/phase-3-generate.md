# Phase 3 — Generate the selected comparison pages

Create a brand-new comparison page for **each selected pair** from Phase 2, in the project's discovered content format. `git add` your work but do NOT commit — Phase 5 publishes. Phase 4 is the gate for this phase.

> **NET-NEW ONLY.** This phase creates brand-new routes. It must NEVER overwrite, regenerate, or replace an existing page, and never run a generator that rebuilds existing content. If a selected pair actually points at a route that already exists (Phase 1b should have caught it), do not recreate it — STOP and flag it as an "enrich existing page" item for Phase 6.

> **Reuse project scripts if present.** If Phase 0 found a project generator for comparisons (e.g. `scripts/model_radar/generate.py:gen_comparison`), you may use it — but the content must still meet the standard below and pass Phase 4.

---

## Content-generation prompt — REUSED VERBATIM from `.claude/commands/seo-gsc-pass/phase-3-new-content.md`

> **‼️ HARD RULE — PASS THIS PROMPT VERBATIM.** Whether you write the page yourself or dispatch a generation subagent, the writing instruction MUST be the **exact, full text below, copied character-for-character**. Do NOT paraphrase, summarize, condense, or "capture the substance" of it — a paraphrase is a spec violation. If you spawn a subagent per pair, paste the entire block (from "You are an expert SEO content writer…" through the "Before finalizing" checklist) into that subagent's prompt unchanged, then append only: (a) the per-pair facts (primary keyword, optionA/optionB, slug), (b) the exact internal-link targets, and (c) the output-format/schema instructions. The only permitted edit to the block itself is swapping the literal token "{BUSINESS_NAME}" for the business name discovered in Phase 0.

Use this exact prompt as the instruction for writing each page:

You are an expert SEO content writer creating high-ranking, helpful articles.

Before writing, research the topic using search tools. Gather current statistics, recent trends, competitor insights, expert quotes, authoritative citations, and real-world examples. Prioritize industry reports, government data, academic research, reputable publications, official company sources, and recent case studies.

**SEO Requirements:**
- Use the primary keyword in the SEO title, H1, first paragraph, conclusion, and 2–3 H2/H3 headings.
- Use secondary and semantic keywords naturally throughout the article. Avoid keyword stuffing.
- Create an SEO title of 50–60 characters that is compelling and includes the primary keyword.
- Improve the provided title if needed while keeping the core meaning.
- Use a clear structure: H1, H2, and H3.
- Add a table of contents for articles over 2,000 words.
- Use bullet points, numbered lists, FAQs, concise definitions, and comparison tables where useful.
- Optimize for featured snippets.
- Include relevant internal links to related {BUSINESS_NAME} hub, spoke, cluster, and blog pages.
- **External linking (first mention → official source).** The FIRST time you name any external product, model, tool, company, benchmark, standard, law/regulation, dataset, or study a reader might click to act on your advice, link it to its OFFICIAL primary source (the vendor's/lab's/regulator's own page, or the benchmark's own repo — never an aggregator). Link only the first mention of each. **Exception — projects that auto-link at render time:** if THIS project turns common entities into links automatically (e.g. a render-time registry like layer3's `ENTITY_LINKS` in `sectionContent.tsx`), write those common names (major AI models, coding IDEs, AI labs, well-known benchmarks) in plain text so the page isn't double-linked, and never hand-write a referral URL. If the project has no such auto-linker, hand-link those too. When unsure, hand-link — one correct link on first mention is the goal.
- Make sure all new pages are properly linked within the correct hub/spoke structure.
- Don't dismiss a keyword just because tools show zero monthly searches — real demand often appears in GSC impressions weeks before search-volume tools register it. When a question-format zero-volume variant is genuinely the best fit for a heading or FAQ — i.e. no stronger, more-relevant keyword belongs in that slot — use it as the H2/H3 or FAQ question to capture long-tail demand. Sources: Google Autocomplete, People Also Ask, and the natural language customers use (e.g. "Can [tool] handle HIPAA compliance for small clinics?"). This is an OPTION to widen long-tail coverage, NOT a quota: never force a zero-volume keyword into a slot a better-targeted keyword belongs in. The 2–3 primary-keyword heading slots above remain non-negotiable.

**Content Quality:**
- Match search intent fully.
- Write accurate, original, useful content with practical advice.
- Include current-year references, recent data, statistics, trends, and examples.
- Demonstrate E-E-A-T with citations, expert sources, detailed explanations, and credibility indicators where relevant.
- Add specific examples, use cases, tips, and actionable takeaways.
- End with a clear conclusion and call-to-action.
- Information gain: raise the bar on the "specific examples" rule above — at least one example must contribute information NOT already present on the top-ranking pages for this topic (first-hand operational detail, an industry-specific failure mode, a non-obvious tradeoff, or a decision criterion competitors don't surface). Weave it INTO the relevant existing section as a supporting sentence or bullet — never split it into a standalone self-promotional section. Reframing the same ideas as competitors in different words does NOT satisfy this rule.
- Answer-engine optimization (AEO): the FIRST sentence of each major section's content must be a complete, self-contained declarative statement that answers the section's question directly, without requiring context from surrounding paragraphs. AI assistants (ChatGPT, Perplexity, Gemini) extract passages, not full articles — each passage must stand alone. This applies ONLY to section openers; the "use transition words naturally" rule above continues to apply within and between paragraphs. Each FAQ answer also leads with the direct answer; nuance and caveats follow.
- Authorship (mandatory on YMYL — compliance, finance, medical, legal): a named, credentialed human reviewer in a visible byline + a Person entry in JSON-LD. **Reviewer name and review date belong in the page's header/byline area and in structured schema (`reviewer` / `lastReviewed`), NOT in body prose — do NOT write any "Reviewed by [name] on [date]", "Last updated…", author, or research-method sentence into the body/intro/sections/verdict/FAQ or any prose field.** If this project's template renders the byline from the record's date fields (e.g. layer3), just set the structured `publishedDate` / `updatedDate` field and let the template render it; if the template has no byline slot yet, put the byline in the header/metadata + JSON-LD — still never as a body paragraph. Organization-only author is not acceptable on YMYL.
- First-party sourcing: cite primary sources directly — the vendor's own page, the regulator's own page, the official trust center — never aggregators. The link is for verification; the article still carries the substantive answer on-page.
- Task completion: the article must answer the reader's intent on-page. No thin wrappers around an external link, no empty templates. If the page points to a primary source, the on-page version still leads with the substantive answer.

**Writing Style:**
- Use simple, everyday language at a 7th–8th grade reading level.
- Keep sentences under 20 words.
- Use active voice.
- Write one main idea per sentence.
- Keep paragraphs to 3 sentences max.
- Add subheadings every 200–300 words.
- Use common words: "help" instead of "facilitate," "use" instead of "utilize," and "show" instead of "demonstrate."
- Avoid jargon unless necessary.
- Use transition words naturally.
- Keep the tone helpful, clear, and professional.

**Before finalizing, confirm the article:**
- Addresses search intent.
- Uses the primary and secondary keywords correctly.
- Includes current research, data, and sources.
- Provides actionable value.
- Uses clear examples and use cases.
- Follows the required structure and readability rules.
- Includes proper internal links to related hubs, clusters, and pages.
- Ends with a strong CTA.

---

## Comparison specifics (layer these on top of the prompt above)
Because this is a head-to-head page, also ensure each page has:
- **Both entity names in the SEO title** (e.g. "X vs Y for [Segment]: …").
- A **comparison table of ≥5 rows** — the snippet/answer-engine-extractable core. Each row = a dimension buyers care about (price, setup time, integrations, compliance, support, accuracy, etc.) with a value for each side.
- A **concise verdict** ("which to pick when") — directly cite-able by LLMs.
- **≥4 FAQs** covering "is X better than Y", "X vs Y pricing", "can X do [job] like Y", and the segment angle.
- **≥3 internal related links** resolved to real existing pages (hubs/guides/verticals), plus a CTA mapped to the business's actual service.

Then: **match the discovered page template + schema builders** (so the new page carries the same JsonLd/SEO scaffolding — comparison/FAQ/breadcrumb schema — as existing pages), emit it in the project's exact format (e.g. append a `ComparisonPage` object to the project's `*-new.ts` data file, or write the MDX file), `git add`, and do not commit. Auto-continue to Phase 4.

## Schema-fidelity guardrails (learned pitfalls — check before handing to Phase 4)
- **Use the project's EXACT field keys.** A generation subagent that does not see the interface will invent plausible-but-wrong keys (e.g. emitting `body:` for a section when the schema field is `content:`). In a loosely-typed store (`any[]`) `tsc` will NOT catch this and the section renders empty. After generation, grep the new objects for the real field names and fix any drift before Phase 4. When dispatching a subagent, give it the exact field list.
- **Re-read existing slugs LIVE here, not from an earlier list.** A page may have been added since Phase 0/1b ran (e.g. by another tool or a recent commit). Before inserting, re-scan the live content files + sitemaps for each selected slug AND its model-version/reverse variants (`grok` vs `grok-4`, `a-vs-b` vs `b-vs-a`); if a match now exists, drop that pair to "enrich existing" rather than ship a near-duplicate.
- **Run `tsc`/build after insertion** (Phase 5 does this too, but catch breakage early).


## First-mention company link rule (MANDATORY — workflow-wide, added 2026-07-07)

**Writers (new content, body/enrich edits, tools):** the FIRST time a page names ANY external company, product, tool, model, standard, or cited study, that mention MUST link to its official primary source (the vendor's/regulator's own site — never an aggregator). Link only the first mention of each entity. **Exception — render-time auto-linking:** if THIS project auto-links entities at render time (an ENTITY_LINKS-style registry — check `src/utils/` or the templates before writing), those registered entities must stay PLAIN TEXT to avoid double-linking; **check the registry — never assume an entity is in it.** If the project has no auto-linker, or the entity is not registered, hand-link it inline. If an entity will recur across many pages and the project HAS a registry, extend the registry instead (preferred) and keep the name plain. Never hand-write a referral URL.

**Auditors (adversarial review):** an unlinked first mention of a company/product that is NOT covered by a render-time auto-link registry is a **HARD FAIL** — the page does not pass audit until fixed. This UPGRADES any earlier "missing external link" advisory note in this file from advisory to hard fail. The fix is additive: link the first occurrence (or register the entity) — never rewrite the page.

## Successor vs predecessor pages (MANDATORY when the pair is same-line, added 2026-07-28)

For every `versus` page whose two options are the **same product line at different generations** (`Claude Opus 5 vs Claude Opus 4.8`, `Grok 4.5 vs Grok 4.3`, or any new-version-vs-prior-version pair — see the matching lane in `phase-1-candidates.md`):

1. **Lead with what actually changed.** A "what changed" / "what's new" section is mandatory: capability, speed, context window, reliability, availability. Ground every claim in the vendor's own announcement or the site's existing data — never in training memory.
2. **Price the upgrade explicitly.** State both versions' prices side by side and name the relationship in plain words: unchanged (a same-price capability bump is the strongest upgrade case), higher, lower, or an introductory window with its end date. A same-price successor MUST say so — it is the whole decision.
3. **Never assume newer = better.** If the successor is worse on any axis a buyer cares about (higher price, smaller context, narrower availability, unproven stability), that trade-off goes in the comparison table AND the verdict. A successor page that reads as pure marketing for the new version is a failed page.
4. **Verdict = upgrade / wait / run both.** Say who should move now, who should stay on the prior version (validated pipelines, budget, long-context needs), and how to route across both during migration. Recommend re-running the reader's own evals before a full cutover.
5. **Own the alias cluster:** both versions' query forms in headings/body/FAQ, including ≥1 FAQ in the REVERSED order (`{prior} vs {new}`), plus the `is {new} worth it` phrasing. Never a thin duplicate page for an alias.
