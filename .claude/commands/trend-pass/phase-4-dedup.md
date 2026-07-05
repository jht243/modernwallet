# Phase 4 — Dedup gate (automatic, adversarial)

Every candidate (matrix + autocomplete) must clear ALL layers. There is no deferred/backlog queue feeding in.

> **‼️ The ONLY drop reasons are content-existence and winner-protection.** Drop a candidate if the page already EXISTS (slug inventory / git / candidate ledger / near-dup) or if it would cannibalize a top-10 page. **"Another engine covers this surface" is NEVER a drop reason** — if the page doesn't exist and it's a good opportunity, BUILD it; overlap is mutual and self-resolving via existence dedup.

## Layer 1 — Slug inventory
`python3 scripts/trend_pass/slug_inventory.py --base-url <BASE_URL> --check <slug>` per candidate. TAKEN → DROPPED.

## Layer 2 — Git history
`git log -S "<slug>" --oneline` per candidate (catches added-then-removed pages) + one `git log -20 --stat` topic scan. Hit → DROPPED with the ref.

## Layer 3 — Candidate ledger
`reports/trend-pass/ledger.md`: a DROPPED candidate is never re-litigated; a KEPT candidate is never re-emitted.

## Layer 4 — Adversarial reviewer (subagent)
A subagent that did NOT build the list re-verifies layers 1–3 and applies near-dup semantics (a candidate whose intent is already a page's dedicated job is a duplicate even under a different slug). Verdicts final.

## Winner protection
Does the candidate's target query set overlap a top-10 page's clicking queries (Phase 0 pull)? Overlap → NEVER auto-built; move to the digest "Flagged for the human", append to `ledger.md` as DROPPED (`winner-protection`).

## Output
Survivors (by Phase 2 evidence rank) → Phase 5. Non-survivors recorded for the ledger append (DROPPED + reason).
