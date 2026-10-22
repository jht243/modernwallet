# Phase 3 — Generate the selected comparison pages

Create a brand-new comparison page for **each selected pair** from Phase 2, in the project's discovered content format. `git add` your work but do NOT commit — Phase 5 publishes. Phase 4 is the gate for this phase.

> **NET-NEW ONLY.** This phase creates brand-new routes. It must NEVER overwrite, regenerate, or replace an existing page, and never run a generator that rebuilds existing content. If a selected pair actually points at a route that already exists (Phase 1b should have caught it), do not recreate it — STOP and flag it as an "enrich existing page" item for Phase 6.

> **Reuse project scripts if present.** If Phase 0 found a project generator for comparisons (e.g. `scripts/model_radar/generate.py:gen_comparison`), you may use it — but the content must still meet the standard below and pass Phase 4.

---

## Content-generation prompt — REUSED VERBATIM from `.claude/commands/seo-gsc-pass/phase-3-new-content.md`

> **‼️ HARD RULE — PASS THIS PROMPT VERBATIM.** Whether you write the page yourself or dispatch a generation subagent, the writing instruction MUST be the **exact, full text below, copied character-for-character**. Do NOT paraphrase, summarize, condense, or "capture the substance" of it — a paraphrase is a spec violation. If you spawn a subagent per pair, paste the entire block (from "## Content standard

> **HOW TO LOAD (MANDATORY — this is the only sanctioned way).** Run:
> `bash .claude/tools/load-standards.sh "<routine-name>" "<this-phase>"`
> and treat its ENTIRE output as the standard. The script prints `_content-standard.md`, `_anti-ai-language.md`, and `_experience.md` in full and appends the load receipt to `reports/standards-ledger.jsonl` in the same action — reading and proving-you-read are one step, so never open the files another way. `git add reports/standards-ledger.jsonl` with the run. If the script or any file is missing, STOP and report it.

**Load `.claude/commands/_content-standard.md` and apply it IN FULL.** It is the single source of truth for the medium gate, SEO and required page elements, depth floors, quality and sourcing, readability, voice and register, comparison, linking, the proprietary anchor, and neutrality. Start with its `## PREFLIGHT` section. There is no cherry-picking and no substituting your own standard.

**Also load `.claude/commands/_experience.md`** — it defines who "we" are on this site and is the ONLY source a first-person experience claim may draw on. If it is missing or its `## DOMAIN` is empty, STOP.

**Also load `.claude/commands/_anti-ai-language.md`** and apply its WRITER section; it outranks the content standard on any conflict.

Anything inline below this block is superseded by the canonical files above.

## TESTED format — decide per page FIRST (added 2026-10-22, owner rule; ported from layer3)

Only some pages get the tested format (content standard `## TESTED`). On this site the ONE switch is `src/lib/testedPage.ts`, and only the roundup route calls it (`src/pages/roundup/[slug].astro`, entries in `src/data/roundups*.ts`): a `best-*`/`top-*`/`*-alternatives`/`*-vs-*`/`*-review` roundup whose items are personal-finance apps or software. Anything that is itself a financial product, account, card, loan, fund, ETF, insurance, tax or legal service, investment, calculator, company, service, gig platform or person never qualifies. **`/compare/` pages (`src/data/comparisons.ts`, what this routine normally writes) never call the switch, so every one of them is a NOT-TESTED page.** Every page this phase writes is either a TESTED page or a NOT-TESTED page — never something in between.

1. **Classify each selected candidate before writing.** Decide what the page ranks or compares: `products` (personal-finance apps, software) or something else (`accounts`, `cards`, `loans`, `funds`, `services`, `concepts`, `people`, `firms`). Then run the same switch the live template uses:
   ```
   echo '[{"section":"<compare|roundup>","slug":"<planned-slug>","title":"<planned title>","h1":"<planned H1>","category":"<roundup category, roundups only>","metaDescription":"<planned description>","items":"<products|accounts|…>"}]' \
     | npx -y tsx scripts/tested/check.mts
   ```
   (`section: compare` always returns `tested: false`.) Record `tested: true|false` and the reason in the run log.
2. **`items` is not `products` but the switch says `tested: true` → add the slug to `EXCLUDED_SLUGS` in `src/lib/testedPage.ts`** (append only, one line) so the template also stays off. Without this the page would render a "Tested and reviewed by" byline and a "(Tested YYYY)" title it has not earned.
3. **TESTED page (`tested: true`, a `/roundup/` entry only)** — pass `--tested yes` to `content_gen.py write`, and put this in the output contract:
   - `metaTitle` has NO year and is 36–46 characters: the template (`buildTestedTitle`) drops any ModernWallet brand suffix and appends ` (Tested 2026)`, so the title Google shows lands at 50–60 characters (e.g. `Best Budgeting Apps for Couples Who Share` → `Best Budgeting Apps for Couples Who Share (Tested 2026)`). A year left in the title, or a result over 60 characters, makes the template keep the plain title.
   - `metaDescription` opens `We tested N <items>` (N = the number of items the page ranks or compares), <=160 chars, keeps the primary keyword.
   - `introText[0]`: direct answer first, then the tee-up as sentence 2: `We tested every <item> on this list <for the job the reader buys it for>.`
   - `howWeTested`: exactly 3 strings, copied VERBATIM from the matching category in `data/tested-methods.json` (match on `covers`). No category fits → write 3 new category-method bullets (no numbers, durations or tool names; true for EVERY item on the page) and append the category to that file.
   - Every option (pick) gets `whyPicked` (1–2 first-person sentences from testing, tied to a fact already in that option, not a repeat of its description), `whoFor` (one sentence naming the buyer) and `downside` (one sentence from one of its stated limitations).
   - Use only facts on the fact list: first-person testing claims are licensed by `_experience.md` section G, invented specifics (numbers, setups, dates, scores) are not. No first-person use of a feature the page says has not shipped or is discontinued.
   - **Mapping into the store.** `RoundupEntry` (`src/data/roundups.ts`) carries the format as FIELDS: `metaTitle` → `title`, `metaDescription` → `metaDescription`, `introText` → `introText` (one string; the tee-up stays sentence 2), `howWeTested` → `howWeTested` (the template renders it as a "How We Tested" H2 between the intro and the picks), and each option's `whyPicked` / `whoFor` / `downside` → the same-named fields on that `RoundupOption` (the template renders the bold labels under "Best for"). Never write the labels as prose inside `description`: data fields here are escaped text, so they would print as plain words or literal asterisks.
4. **NOT-TESTED page (`tested: false`, every `/compare/` page)** — pass `--tested no`. No "We tested" anywhere (title, description, intro, body), no `howWeTested`, no pick fields or labels. Write it the normal way, with the site's normal title rule.
5. **Re-check on the real fields after writing.** Run `check.mts` again with the entry's real `section`, `slug`, `title`, `h1`, `category` and `metaDescription`. If the answer flipped, the second answer wins: rewrite the page to that side (strip the format, or add it) before Phase 4.
6. **Roundup and versus specs:** on a TESTED page, the per-option "best for + 2–4 sentences + strengths/limitations" stays as the option text; the three pick fields go on top of it. On a NOT-TESTED page nothing changes.

## Successor vs predecessor pages (MANDATORY when the pair is same-line, added 2026-07-28)

For every `versus` page whose two options are the **same product line at different generations** (`Claude Opus 5 vs Claude Opus 4.8`, `Grok 4.5 vs Grok 4.3`, or any new-version-vs-prior-version pair — see the matching lane in `phase-1-candidates.md`):

1. **Lead with what actually changed.** A "what changed" / "what's new" section is mandatory: capability, speed, context window, reliability, availability. Ground every claim in the vendor's own announcement or the site's existing data — never in training memory.
2. **Price the upgrade explicitly.** State both versions' prices side by side and name the relationship in plain words: unchanged (a same-price capability bump is the strongest upgrade case), higher, lower, or an introductory window with its end date. A same-price successor MUST say so — it is the whole decision.
3. **Never assume newer = better.** If the successor is worse on any axis a buyer cares about (higher price, smaller context, narrower availability, unproven stability), that trade-off goes in the comparison table AND the verdict. A successor page that reads as pure marketing for the new version is a failed page.
4. **Verdict = upgrade / wait / run both.** Say who should move now, who should stay on the prior version (validated pipelines, budget, long-context needs), and how to route across both during migration. Recommend re-running the reader's own evals before a full cutover.
5. **Own the alias cluster:** both versions' query forms in headings/body/FAQ, including ≥1 FAQ in the REVERSED order (`{prior} vs {new}`), plus the `is {new} worth it` phrasing. Never a thin duplicate page for an alias.


