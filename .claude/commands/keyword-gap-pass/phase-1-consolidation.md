# Phase 1 — Cannibalization detection (ADVISORY ONLY — writes no page edits)

> ⚠️ **This phase no longer executes consolidation.** A backwards 301/canonical is the single most destructive action in SEO — a bot acting on partial data can redirect the page Google actually ranks into a weaker one and crater a whole cluster. The *detection* (knowing two pages compete) is valuable; the *automated execution* is not. So this phase **only detects and flags** cannibalization for the human. It writes **no canonical, no 301, no body change, no link re-point, no sitemap removal.** If a real consolidation is warranted, the human does it deliberately, by hand, later. (A `/keyword-gap-pass` chart almost never emits a consolidation row anyway — this phase is usually a no-op.)

For each consolidation/cannibalization row in the chart (or competing pair you detect):
1. **Confirm it's real:** both routes resolve AND they genuinely target the same query cluster (not merely adjacent topics). If they don't actually compete, drop it.
2. **Record an advisory entry** — do not act on it. Capture, per pair:
   - both routes with their impressions/clicks (or the metrics available),
   - the shared query cluster,
   - a one-line recommendation based on dominance:
     - **winner ≥3× the other AND holds the clicks** → "clear dominance — a *manual* canonical loser→winner may be worth it; human decision."
     - **within ~3× (near-tie)** → "DO NOT consolidate — differentiate the two pages' angles or add internal links instead."
3. **Write the advisory** to `reports/keyword-pass/<date>.cannibalization.md`, and surface every pair in the Phase 8 summary so the user sees it before approving.
4. **Touch no source files.** No canonical, no 301, no body thinning, no link re-pointing, no sitemap edit. (Softer, safe fixes — differentiating angles or adding internal links — only happen if the chart author classified them as **body** (Phase 5) or **internal-links** (Phase 6) rows; this phase never edits pages itself.)

## Reviewer gate (Explore subagent — did not do the work)
- ☐ **NO source file changed** — no canonical/301 written, no body edited, no internal link re-pointed, no sitemap entry removed
- ☐ each detected pair lists both routes' impressions/clicks and the shared query cluster
- ☐ each pair has a clear advisory recommendation (manual-consolidate vs differentiate vs leave alone)
- ☐ the advisory is recorded in `reports/keyword-pass/<date>.cannibalization.md` and will appear in the Phase 8 summary
- ☐ no near-tie (within ~3×) is recommended for consolidation

Reject with specifics; retry rule 4 (2 attempts then STOP) applies.

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The moment this phase's reviewer gate PASSES, immediately begin the next phase in the SAME turn. Do NOT stop. Do NOT print "Want me to proceed?", "Should I continue?", "Next: Phase X", or any question or hand-off that waits for a human reply.

The `/keyword-gap-pass` run has EXACTLY TWO human stops, and this phase is NOT one of them:
- Stop 1: the Phase 0 manifest approval (before any edits).
- Stop 2: the Phase 8 summary approval (before the push).

Everything between those two — including this phase — runs automatically. The reviewer gates are adversarial SUBAGENTS, not human checkpoints; a passing gate means YOU proceed on your own. Keep going until you reach Stop 2 (Phase 8).
