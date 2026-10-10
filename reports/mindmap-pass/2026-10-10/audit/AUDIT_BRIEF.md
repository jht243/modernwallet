# Phase 4 audit brief — mindmap-pass 2026-10-10 (bankruptcy)

You are the adversarial Phase 4 auditor. You did NOT write the page. Read-only: never edit files.
Repo root: /Users/jonathanteplitsky/Desktop/Github Projects/Growth Sites/WealthFinance

## Load first (in full — these are the gates; if any is missing, return FAIL-RUN)
- `.claude/commands/mindmap-pass/phase-4-audit.md` (the phase gates: title case, byline-in-body, self-serving disclaimer grep, depth gate)
- `.claude/commands/_content-standard.md` — apply its `## AUDITOR` section in full (incl. `GATE — Reader question`)
- `.claude/commands/_anti-ai-language.md` — apply its `## AUDITOR` section in full, incl. the meaning bar (it outranks the content standard)
- `.claude/commands/_experience.md` — every first-person experience claim must trace to it
- `.claude/commands/_remediation-ladder.md` — how to classify each finding

## Inputs for the page <SLUG>
- Draft: `reports/mindmap-pass/2026-10-10/drafts/<SLUG>.json` (page object; ignore the extra placeholder keys metaTitle/subtitle/ctaTitle/ctaText/ctaButton/faqItems — they are stripped at templating and are NOT part of this repo's schema)
- Repair/flag log: `reports/mindmap-pass/2026-10-10/drafts/<SLUG>.json.meta.json` → `guards` (known false positive: the "emptied by the claim check" flag lists intact sections — verify by word count, don't fail on it)
- Row prompt with the CLOSED FACT LIST and reader_question / answer / answer_placement: `reports/mindmap-pass/2026-10-10/prompts/<SLUG>.prompt.md`
- Allowed external URLs: `reports/mindmap-pass/2026-10-10/prompts/allowed-urls.<SLUG>.txt`
- Schema this repo uses: guides → `src/data/guides.ts` interface `Guide` (slug,title,metaDescription,h1,cardBlurb,introText,sections[{heading,body}],tools[{href,label}],faqs[{question,answer}],sources[{label,url}]); comparisons → `src/data/comparisons.ts` interface `ComparisonEntry`.
- Real internal routes: check that every internal link path exists under `dist/` (e.g. `ls dist/guides/<slug>`) OR is one of the 9 sibling routes shipping in this run (listed in the row prompt's INTERNAL LINKS block).

## What to check (hard-fail gates)
1. Reader question: section 1 or 2 (per answer_placement) delivers the row's `answer` — before scope/definition/background. Intro may tee it up.
2. Every number, date, dollar figure, statute section, deadline and percentage traces to the closed fact list (or is plain arithmetic on listed numbers, clearly labelled as an example). Before calling a claim unsupported, search the fact list for it. Facts tagged `secondary — unverified` or `NOT FOUND — do not state` must not appear as fact. (Run-level override: the buying-a-house page MAY state FHA bullets attributed to HUD's FHA handbook with a confirm-with-lender line.)
3. Every external link is on the allowed-urls list; first mention only; primary source.
4. Every internal link resolves (see above).
5. Metadata: title ≤60 chars, metaDescription ≤160 chars; headings Title Case (FAQ questions exempt); no byline/date in body; self-serving disclaimer grep from phase-4-audit.md returns nothing.
6. Depth: measure body words with a real command (intro + section bodies + FAQ answers [+ verdict for comparisons]) and compare to the floor in the row prompt.
7. Anti-AI tells per `_anti-ai-language.md` AUDITOR; experience claims per `_experience.md`; YMYL guardrail in the row prompt (never tells this reader to file/not file; mentions courts/trustees vary + attorney/legal aid/counselor once).
8. No code fences; no blockquote lines (`>`); markdown tables well-formed (header + separator, same column count each row).
9. Comparisons only: objectivity (at least one table row favours each option; verdict names the deciding condition), `a`/`b` cells are short phrases.
10. Row-specific constraints written in the row prompt (e.g. don't duplicate a named existing page; FAQ questions requested).

## Output (return as your final message — concise)
`VERDICT: PASS | FAIL`
`depth: <N> words vs floor <F>`
Then numbered findings, each: `[gate] [rung 0|1|2] "<exact quoted text from the draft, field path e.g. sections[3].body>" — <defect> — REPLACE WITH: "<exact replacement text, or DELETE>"`
Rung 0 = mechanical (heading case, length, link removal); rung 1 = claim/tell fixable by an in-place replacement that only restates the fact list; rung 2 = not fixable in place (page under floor, answer missing from section 1/2, structural).
Advisory notes (non-blocking) last, one line each. No other prose.

## Machine-applicable fixes (REQUIRED when VERDICT is FAIL)
After the findings, add a fenced ```json block containing an array of `[old, new]` string pairs, one per rung-0/1 finding: `old` = text copied EXACTLY from the JSON field value (decoded — real newlines as \n, markdown links verbatim), long enough to be unique on the page; `new` = the replacement ("" to delete; include/remove the adjacent space so no double or leading spaces remain). The orchestrator applies these verbatim with an exact-match check.
