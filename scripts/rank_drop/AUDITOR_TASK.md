# Rank-drop auditor task — a BATCH of commits, read-only

**Which standard:** commits whose message says `SECTION`/`RECOVER`/`REFRESH`/`DIFFERENTIATE` with an
added section, or `REWRITE`, are new content — audit them with **`.claude/commands/mindmap-pass/phase-4-audit.md`**
exactly as mindmap-pass audits its pages, handed the page's `reader_question` / `answer` /
`answer_placement` (plan.json), its closed fact list (the prompt file) and `allowed-urls.txt`. Commits
that are only exempt edits (`DATA REFRESH`, `FACT FIX`, meta-only) use the checks below.

You did NOT write these changes. You audit each commit in your batch and edit nothing.

**Your batch is a brief file** `<P>/audit-batch-<n>.md` written by `audit_batches.py`: the pages,
their commits (sha + kind), the standard, and every **RUNG 0** lint item the run introduced. Each
RUNG 0 item MUST come back as a `mechanical` old→new pair (meta lengths counted exactly: metaTitle
≤ 60, metaDescription ≤ 160; keep the lost-search wording). Never fix lint that the brief does not
list: findings on text that was already on the page before the run are out of scope.

Read ONCE for the batch: `reports/rank-drop/<date>/packets/auditor-rules.md` (the extracted AUDITOR
sections — do not open the full standards files). Per commit you also have
`reports/rank-drop/<date>/packets/<slug>/packet.json` and `.../section.prompt.md` (its CLOSED FACT
LIST and CLOSED URL LIST).

For each commit, check in order (stop at the first hard fail):
1. **Scope:** `git show --stat <sha>` touches only `packet.data_file` + that page's packet dir; no
   slug change, no deleted section, `publishedDate` untouched, no secrets (`AQ.`, `re_`, `am9u`,
   `-----BEGIN`, `sk-`).
2. **Facts:** every number in the added text is on the page's CLOSED FACT LIST. Any other number = FAIL.
   **Prices:** every price matches data/pricing.ts for the model it is attached to; derived figures
   (ratios, "X times", totals, %) recomputed from the ledger; comparatives ("cheaper", "unchanged",
   "still") true under current prices. **Current model = newest row of its family:** a model
   presented as the current pick or "most capable" when pricing.ts has a newer row in its family
   (Opus 4.8 when Opus 5.5 exists) is a finding **in the text the run added**; an older model named
   as history is fine. On exempt price pages also scan the WHOLE entry for any remaining stale
   price SENTENCE (give the old→new).

**Scope — never `rework` for text the run did not write.** A problem in sections that were on the
page before this run (stale models across old sections, old em-dashes, an outdated plan table) is
NOT a reason to fail the run's commit: a section regeneration cannot fix it, so it would only burn
the rework cap and revert good work (claude-pricing, 2026-10-05). If you can fix it with a
sentence-level old→new pair (a stale price or model name in one sentence), put it in `fixes`;
otherwise list it under `"out_of_scope": ["<finding>"]` — it goes to the email's Flagged section
and the next run's planner, and does not affect your verdict.
3. **Links:** internal links are on `packets/routes.txt`; external links are on the CLOSED URL LIST;
   no link to a competitor page.
4. **Language:** `auditor-rules.md` (anti-AI tells, byline-in-body, brand antecedent, copied competitor
   text, the section's first sentence answers the reader's question).
5. **Meta edits** (if any): one sentence each, contains the lost searches' wording, no new claims.

(Syntax was already checked by `apply_sections.py`.)

**Remediation ladder (`.claude/commands/_remediation-ladder.md`) — your report decides the rung.**
For every finding where you can quote the offending text AND write the replacement, you MUST hand
over the replacement (a finding without one, where one was possible, is an incomplete report). Only
findings that need new substance — an invented or contradicted fact, depth under the floor, a missing
required element, a section that must be rewritten — go to `rework`.

Write `reports/rank-drop/<date>/packets/<slug>/audit.json` for each commit:
```json
{"slug": "...", "sha": "...", "round": 1, "verdict": "PASS" | "FAIL",
 "mechanical": [{"old": "<exact text>", "new": "<replacement>"}],
 "fixes":      [{"old": "<exact text>", "new": "<replacement>", "why": "<rule>"}],
 "rework":     ["<finding that needs new substance, with the rule>"],
 "out_of_scope": ["<problem in pre-existing text; never affects the verdict>"]}
```
`old` must be copied exactly from the page text (apostrophes as the reader sees them) and appear once.
Scope = the commit's `data/` diff only; never fail a page for packet/report files the run wrote.

## Re-check (rounds 2+) — when the orchestrator sends you `recheck.json`
`apply_fixes.py` applied your pairs verbatim and wrote `<P>/recheck.json` → `{batch: [{slug, sha,
next_round}]}`. For your batch's entries only: `git show <sha> -- data/`, confirm each replacement
reads correctly in its paragraph and adds no new finding (facts, prices, links, tells, meta length).
No full re-audit, no standards reload. Rewrite `<slug>/audit.json` with `"round": next_round`: PASS,
or FAIL with new exact pairs. An entry with `corrected_pair_needed` means your `old` text did not
match: send a corrected pair (still Rung 1). After a Rung 2 regeneration (`REWORK` commit) audit
that page FULLY again, including its new lint items.

Return one JSON line per commit and nothing else:
`{"slug": "...", "sha": "...", "verdict": "PASS" | "FAIL", "fixes": N, "rework": N}`
