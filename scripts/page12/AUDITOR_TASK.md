# Page 1-2 no-clicks auditor task — a BATCH of commits, read-only

**Two scopes, never mixed up:**

| what | scope |
|---|---|
| Writing quality — anti-AI tells, style, voice, structure, lint, link rules | **ONLY the text this run added or changed** (the commits' content diff + any newly registered `ReviewerNote`). Text that was on the page before the run is never graded and never "improved". |
| **Facts — anything wrong or outdated** | **The WHOLE page.** Every factual error or outdated figure anywhere on the page (old sections, FAQ, tables, intro) is corrected with a sentence-level old → new pair and an official source. |

**Which standard:** commits whose kind is `SNIPPET`/`RANK`/`REWORK` with an added section are new
content — audit the added text with **`.claude/commands/mindmap-pass/phase-4-audit.md`**, handed the
page's `reader_question` / `answer` / `answer_placement` (`plan.json`), its closed fact list
(`section.prompt.md`) and `allowed-urls.txt`. `FACT FIX`, meta-only and `INBOUND LINKS` commits use the
checks below.

You did NOT write these changes. You audit each commit in your batch and edit nothing.

Your batch is a brief file `<P>/audit-batch-<n>.md`. Each RUNG 0 item MUST come back as a `mechanical`
old→new pair (`metaTitle` ≤ 60, `metaDescription` ≤ 160 — keep the main search's wording). Never fix
lint the brief does not list.

Read ONCE for the batch: `<P>/auditor-rules.md`. Per page you also have `<P>/<slug>/packet.json`,
`diagnosis.json`, `serp.json`, `fact-edits.json` (if any), `section.prompt.md` (if any) and `page.md`.

For each commit, check in order (stop at the first hard fail):
1. **Scope & Date Honesty:** `git show --stat <sha>` touches only content files + optional ReviewerNote
   store + that page's packet dir; no `.claude/` files touched, no slug change, no deleted section, no
   removed sentence other than a fact fix, `publishedDate` untouched, no secrets (`AQ.`, `re_`, `am9u`,
   `-----BEGIN`, `sk-`). On `METADATA` (`meta_only`) commits, verify the page's visible `updatedDate` /
   `updated` was NOT fake-bumped.
2. **Facts & Internal Proof in the new text:**
   - Every number is on the CLOSED FACT LIST (or matches `source` + `quote` in `fact-edits.json`).
   - Model prices match `data/pricing.ts`; derived scenario figures recompute cleanly.
   - When `diagnosis.json` had `internal_proof_gap` on an `add_section` commit, verify the added section
     delivers a genuine 3-scenario breakdown and an explicit break-even counterexample (plus a valid
     calculator link when one was planned).
   - **Amazon `/gear/` rule:** when `internal_proof_gap.amazon_no_price` is true, zero `$` dollar prices
     may appear in newly added text (`rework` if violated).
   - **Publisher's Take / Editor's Note (`reviewer_note`):** if a ReviewerNote was registered, confirm it
     is 1–3 crisp natural sentences with zero em-dashes (`—`), zero AI clichés, and zero `"Dapper Labs"`
     mentions. **Do NOT require concrete numbers inside `reviewer_note`** (numbers in the note are optional).
3. **Facts on the WHOLE page (always):** read `page.md` as it now reads. Any outdated or wrong statement
   goes in `fixes` as an exact old→new pair with `"why"` and `"source"`. If you cannot verify the correct
   value from an official source, list it under `out_of_scope` as `fact-unverified: …` — never guess.
4. **Links:** internal links are on `routes.txt`; external links on the CLOSED URL LIST; INBOUND LINKS
   cards point at the target page and repeat its own title/description.
5. **Language (new text only):** `auditor-rules.md` (anti-AI tells, no `"Dapper Labs"`, byline-in-body,
   brand antecedent, no copied competitor text, the answer block's first sentence answers the main search).
6. **Meta edits:** one sentence each, the main search's wording, no claim the page doesn't support,
   any price in them verified.

**Remediation ladder (`.claude/commands/_remediation-ladder.md`) decides the rung.** Wherever you can
quote the offending text AND write the replacement, hand over the replacement. Only new text that needs
new substance (an invented fact, a missing 3-scenario breakdown or counterexample) goes to `rework`.
**Never `rework` for pre-existing text** — fix its facts with a pair, list anything else under `out_of_scope`.

Write `<P>/<slug>/audit.json` for each commit:
```json
{"slug": "...", "sha": "...", "round": 1, "verdict": "PASS" | "FAIL",
 "mechanical": [{"old": "<exact text>", "new": "<replacement>"}],
 "fixes":      [{"old": "<exact text>", "new": "<replacement>", "why": "<rule or outdated fact>", "source": "<url, for facts>"}],
 "rework":     ["<finding in the NEW text that needs new substance>"],
 "out_of_scope": ["<pre-existing non-fact issue, or fact-unverified: …>"]}
```

## Re-check (rounds 2+) — when the orchestrator sends you `recheck.json`
`apply_fixes.py` applied your pairs verbatim and wrote `<P>/recheck.json` → `{batch: [{slug, sha,
next_round}]}`. For your batch's entries only: confirm each replacement reads cleanly and adds no new
finding. Rewrite `<slug>/audit.json` with `"round": next_round`: `PASS`, or `FAIL` with new exact pairs.

Return one JSON line per commit and nothing else:
`{"slug": "...", "sha": "...", "verdict": "PASS" | "FAIL", "fixes": N, "rework": N}`
