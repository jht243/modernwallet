# Phase 3 — Dedup gate (automatic, adversarial — the daily-run safety net)

Nightly runs compound duplicate risk. Every candidate from Phase 2 (all five lanes, all audited pages) must clear **ALL FOUR layers** plus winner protection. Deferred-drain rows from Phase 1 also pass back through here (they may have become duplicates since being deferred).

> **The ONLY drop reasons are content-existence (Layers 1–4) and winner-protection.** "Another engine owns that surface" is NEVER a drop reason — if this pass found a real opportunity and the page does not already exist, BUILD it; cross-engine overlap is mutual and self-resolving (whoever writes first wins, the other engine's dedup skips it next run).

## Layer 1 — Slug inventory
`python3 scripts/trend_pass/slug_inventory.py --check <slug>` per new-page candidate. TAKEN → DROPPED ("exists: <where>"). (Enrichment/metadata/tool candidates target EXISTING routes — for those, "exists" is expected; this layer only gates NEW pages.)

## Layer 2 — Git history
Per new-page candidate: `git log -S "<slug>" --oneline` (catches pages added then REMOVED — a deliberately deleted page must not silently return). Plus ONE `git log -20 --stat` topic scan for same-topic pages under different slugs. Hit → DROPPED with the commit reference.

## Layer 3 — Candidate ledgers (shared + comparison-engine history)
- `reports/trend-pass/ledger.md`: a **DROPPED** candidate is never re-litigated; a **KEPT** candidate is never re-emitted — regardless of which pass (`source:` tag) created the row.
- For `vs` / `alternatives` / worth-it candidates ONLY: also check the comparison engine's own history — `reports/comparison-content-creator/` outputs + its ledger. A comparison that engine shipped, PARTIAL-matched, or DROPPED is a duplicate here. (Method: `.claude/commands/comparison-content-creator/phase-1b-coverage-check.md`.)

## Layer 4 — Adversarial reviewer (subagent)
Spawn ONE subagent that did NOT build the candidate list. It re-verifies Layers 1–3 per survivor AND applies **near-dup semantics**: a candidate whose target intent is already the dedicated purpose of an existing page/section is a duplicate even under a different slug (e.g. `is-claude-fable-5-hipaa-compliant` vs an existing Fable section in `is-claude-hipaa-compliant`). For **enrichment** candidates it also confirms the sub-intent isn't already answered on the page (a heading that name-drops the topic without answering ≠ covered). Reviewer verdicts are final for this run; kills → DROPPED with reason.

## Winner protection (every survivor) — GA4 substitution
GA4 has no per-page query list. Deterministic test: does the candidate's target intent match the **head intent + entity/archetype of any top-10 page's ROUTE**? Overlap → NEVER auto-built (it would cannibalize a page that is already winning). Move to the digest's "Flagged for the human" section; append to `ledger.md` as DROPPED, reason `winner-protection: overlaps <route>`. **Spokes/siblings must target ADJACENT intents** (a different vertical, a different counterpart, a sub-question) — never the winner's own head term. Enrichment/metadata/tool candidates that IMPROVE the winning page itself are NOT winner-protected (they strengthen it, not cannibalize it).

## Output
- Survivors, grouped by lane and evidence rank → Phase 4.
- Every non-survivor recorded (DROPPED + reason) for the Phase 4 ledger append.
- A night where dedup kills everything is a SUCCESS ("audited pages already fully covered") — say so in the digest.
