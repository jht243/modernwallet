# Page 1-2 no-clicks auditor task — a BATCH of commits, read-only

**Two scopes, never mixed up:**

| what | scope |
|---|---|
| Writing quality — anti-AI tells, style, voice, structure, lint, link rules | **ONLY the text this run added or changed** (the commits' `data/` diff). Text that was on the page before the run is never graded and never "improved" — it is what Google already shows. |
| **Facts — anything wrong or outdated** | **The WHOLE page.** Every factual error or outdated figure you find anywhere on the page (old sections, FAQ, tables, intro) is corrected with a sentence-level old → new pair and a source. |

**Which standard:** commits whose kind is `SNIPPET`/`RANK`/`REWORK` with an added section are new
content — audit the added text with **`.claude/commands/mindmap-pass/phase-4-audit.md`**, handed the
page's `reader_question` / `answer` / `answer_placement` (plan.json), its closed fact list
(section.prompt.md) and `allowed-urls.txt`. `FACT FIX`, meta-only and `INBOUND LINKS` commits use the
checks below.

You did NOT write these changes. You audit each commit in your batch and edit nothing.

Your batch is a brief file `<P>/audit-batch-<n>.md` (pages, commits, standard, RUNG 0 lint items the
run introduced). Each RUNG 0 item MUST come back as a `mechanical` old→new pair (metaTitle ≤ 60,
metaDescription ≤ 160 — keep the main search's wording). Never fix lint the brief does not list.

Read ONCE for the batch: `<P>/auditor-rules.md`. Per page you also have `<P>/<slug>/packet.json`,
`diagnosis.json`, `serp.json`, `fact-edits.json` (if any), `section.prompt.md` (if any) and `page.md`.

For each commit, check in order (stop at the first hard fail):
1. **Scope:** `git show --stat <sha>` touches only `data/` content files + that page's packet dir; no
   slug change, no deleted section, no removed sentence other than a fact fix, `publishedDate`
   untouched, no secrets (`AQ.`, `re_`, `am9u`, `-----BEGIN`, `sk-`). The page's pre-existing intro
   and sections are byte-identical except listed fact fixes.
2. **Facts in the new text:** every number is on the CLOSED FACT LIST (or, for a FACT FIX, matches the
   `source` + `quote` in fact-edits.json — open the source URL to confirm when the quote looks thin).
   Model prices match data/pricing.ts; derived figures recomputed; "current" model = newest row.
3. **Facts on the WHOLE page (always):** read `page.md` as it now reads. Any outdated or wrong
   statement — a superseded plan name or price, a retired model presented as current, a date that
   has passed ("launching in August 2026"), a contradiction with the new answer block — goes in
   `fixes` as an exact old→new pair with `"why"` and `"source"` (vendor page or data/pricing.ts). If you
   cannot verify the correct value from an official source, list it under `out_of_scope` as
   `fact-unverified: …` — never guess.
4. **Links:** internal links are on `routes.txt`; external links on the CLOSED URL LIST; INBOUND LINKS
   cards point at the target page and repeat its own title/description.
5. **Language (new text only):** `auditor-rules.md` (anti-AI tells, byline-in-body, brand antecedent,
   copied competitor text, the answer block's first sentence answers the main search).
6. **Meta edits:** one sentence each, the main search's wording, no claim the page doesn't support,
   any price in them verified.

**Remediation ladder (`.claude/commands/_remediation-ladder.md`) decides the rung.** Wherever you can
quote the offending text AND write the replacement, hand over the replacement. Only new text that
needs new substance (an invented fact, a missing required element) goes to `rework`. **Never `rework`
for pre-existing text** — fix its facts with a pair, list anything else under `out_of_scope`.

Write `<P>/<slug>/audit.json` for each commit:
```json
{"slug": "...", "sha": "...", "round": 1, "verdict": "PASS" | "FAIL",
 "mechanical": [{"old": "<exact text>", "new": "<replacement>"}],
 "fixes":      [{"old": "<exact text>", "new": "<replacement>", "why": "<rule or outdated fact>", "source": "<url, for facts>"}],
 "rework":     ["<finding in the NEW text that needs new substance>"],
 "out_of_scope": ["<pre-existing non-fact issue, or fact-unverified: …>"]}
```
`old` must be copied exactly from the page text and appear once. A page with only fact `fixes` on
pre-existing text still PASSes once those pairs are applied (they are corrections, not run failures).

## Re-check (rounds 2+) — when the orchestrator sends you `recheck.json`
`apply_fixes.py` applied your pairs verbatim and wrote `<P>/recheck.json` → `{batch: [{slug, sha,
next_round}]}`. For your batch's entries only: `git show <sha> -- data/`, confirm each replacement
reads correctly in its paragraph and adds no new finding. Rewrite `<slug>/audit.json` with
`"round": next_round`: PASS, or FAIL with new exact pairs. `corrected_pair_needed` means your `old`
text did not match: send a corrected pair. After a `REWORK` regeneration audit that page FULLY again.

Return one JSON line per commit and nothing else:
`{"slug": "...", "sha": "...", "verdict": "PASS" | "FAIL", "fixes": N, "rework": N}`
