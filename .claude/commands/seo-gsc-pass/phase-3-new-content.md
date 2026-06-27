# Phase 3 — New content creation

Act on every **new-content** row in the chart. For each, check the row's `format` column first — it determines what this phase produces:

- **`article` (or no format column / `n/a`)** → write the full article following the content guidance below. This is the only format Phase 3 builds end-to-end.
- **`interactive tool`, `calculator`, `quiz/assessment`, `template`, `comparison table/database`, `glossary/reference`, `data report`** → this phase does **NOT** build the asset. Instead, write a **one-page asset spec** at the route (e.g. `reports/seo-pass/specs/<slug>-spec.md`) containing: (1) the target route/URL, (2) recommended format + rationale from the chart, (3) what the asset does (inputs → outputs for tools/calculators; question flow for quizzes; column schema for databases; data sources for reports), (4) the primary and secondary keywords it targets, (5) word count / scope estimate, and (6) any technical dependencies (e.g. "requires a React component at /components/Calculator.tsx"). `git add` the spec. Phase 4 reviews the spec for completeness; the spec is what ships in this commit so the human can build the asset in a follow-up session. Never write stub/placeholder page content for non-article formats — the spec IS the deliverable.

Wire the route for all rows — article pages get full page files; non-article rows get the spec file at `reports/seo-pass/specs/<slug>-spec.md` plus a `// TODO: implement <format> asset — see spec` placeholder at the target route if a route file is expected by the framework. `git add` your work but do NOT commit — inbound links FROM existing pages are added in Phase 5, and Phase 4 is the gate for this phase.

> **NET-NEW ONLY.** This phase creates brand-new routes. It must NEVER overwrite, regenerate, or replace an existing page, and never run a generator that rebuilds existing content. If a "new-content" row actually points at a route that already exists, do not recreate it — STOP and flag it (it likely belongs in body/metadata, or it was already shipped). Each page here is written by hand to the content standard, not stamped out by a script.

---

**For `article` format rows:** create the full page using the following guidance:

> **Project-agnostic placeholder.** The guidance below contains the token `{BUSINESS_NAME}`. Before writing (or before handing the prompt to a subagent), substitute it with the business/brand name discovered in Phase 0. **Never emit the literal `{BUSINESS_NAME}` into any page.**

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
- Include trusted external links where appropriate.
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
- Authorship (mandatory on YMYL — compliance, finance, medical, legal): every page carries a named, credentialed human author with a visible byline and a Person entry in JSON-LD. Add a short "how we research / reviewed by [name] on [date]" line. Organization-only author is not acceptable on YMYL.
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

**Comparison angle (NET ADD — do not remove or shrink any existing section):**
- After the page structure is fully planned, ask: does this topic have a natural "X vs Y," "X vs alternatives," or "which approach/tool is better for [use case]" question a reader would also want answered?
- If yes, add a comparison table (3–5 criteria rows, one column per option, a verdict row) and a brief "when to choose X" paragraph as an EXTRA section on top of the already-planned outline. This is additive only — it must not replace, shorten, or merge with any section that was already planned.
- Applicable on: tool/platform pages, methodology pages, regulatory/compliance option pages, any page where two or more approaches, products, or frameworks are meaningfully in scope. Skip if the page is definitional or reference content with no real comparison axis.
- Do NOT force a comparison where none exists — one well-executed table beats a hollow one.

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

Then: match the discovered page template + schema builders (so the new page carries the same JsonLd/SEO scaffolding as existing pages), `git add`, and do not commit.

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The moment this phase's reviewer gate PASSES, immediately begin the next phase in the SAME turn. Do NOT stop. Do NOT print "Want me to proceed?", "Should I continue?", "Next: Phase X", or any question or hand-off that waits for a human reply.

The `/seo-gsc-pass` run has EXACTLY TWO human stops, and this phase is NOT one of them:
- Stop 1: the Phase 0 manifest approval (before any edits).
- Stop 2: the Phase 8 summary approval (before the push).

Everything between those two — including this phase — runs automatically. The reviewer gates are adversarial SUBAGENTS, not human checkpoints; a passing gate means YOU proceed on your own. Keep going until you reach Stop 2 (Phase 8).
