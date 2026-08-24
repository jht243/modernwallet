# Phase 5 — Adversarial audit of the enriched pages

An automatic quality gate, NOT a human checkpoint. A fresh **Explore subagent that did NOT write the sections** reviews every Phase 4 edit against the verbatim audit standard. This gate covers all enriched pages.

## How to run it
For each page touched in Phase 4, hand the reviewer subagent:
1. The **exact, full text** of `.claude/commands/seo-gsc-pass/phase-4-audit.md` as the audit standard — character-for-character, never paraphrased.
2. The page's diff (what was added/changed) plus the follow-up question + action each edit was meant to satisfy.

The reviewer returns the standard JSON contract: `{"ok": true|false, "issues": ["..."]}`.

## What the reviewer checks (in addition to the verbatim standard)
- **The added section actually answers the question** it was for — completely, not a vague gesture. A reader's follow-up is resolved.
- **AEO opener** — the section/FAQ answer leads with a complete, self-contained declarative statement, not a rhetorical restatement of the question.
- **No duplication** — the new answer doesn't repeat content already on this page or merely restate what another page says (the `Link` rows must be links, not re-answers).
- **In-place only** — the edit is a targeted insertion; the rest of the page is unchanged. Flag any wholesale rewrite or regeneration.
- **No fabricated facts** — any price/duration/stat/claim is sourced or hedged, never invented.
- **Hard-fail (set `ok:false`):** sales/marketing/hype language, hallucinated claims, the question still isn't answered, broken structure, or a wrong body-field key that renders the section empty.

## Rework loop + retry limit
- On `ok:false`, rework using the reviewer's notes, then re-audit. **Max 2 rework attempts per page.**
- If the 2nd retry still fails, **REVERT that page's edit** — restore the file byte-for-byte to its pre–Phase 4 state (`git checkout -- <file>` for that file, or undo the targeted Edits). Record it in the summary as "reverted — failed audit." One bad enrichment never ships and never blocks the rest of the batch.

Print the Phase Summary (X/Y pages passed; N reverted and why) and **auto-continue to Phase 6** with the surviving enriched pages.

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
This is the automatic reviewer gate, not the human one. The human already approved at Phase 3. Continue to Phase 6 in the same turn.


