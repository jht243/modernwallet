# Phase 6 — Internal linking

Execute the internal-linking rows from the chart, AND add inbound internal links to every page created in Phase 3 (**target ~3 links each** from relevant existing pages).

**The ~3 is a target, not a quota — relevance wins over the count.** Only add a link where it is genuinely contextually relevant and reads naturally. If a new page has fewer than 3 *logical* placements, add the ones that fit and STOP — do not manufacture a forced, marginal, or over-optimized exact-match link just to hit the number, and never repeat the same anchor across unrelated pages. A page with 1–2 strong, relevant inbound links is better than 3 where one is a stretch. When you land below the target, note in the phase report which page and why (no more relevant placements exist) — that is an accepted outcome, not a failure.

Guidance:
- Use the framework `<Link>` with descriptive anchor text — never "click here".
- **If linking from the homepage, do NOT update the header/nav.** Add links in the footer or within the body of the homepage instead.
- Any update must maintain the existing UX/UI — do not break the page, clutter it, or make it look ugly. Match the surrounding design, spacing, and styling.
- Only add links that are genuinely relevant in context; don't force them.
- `git add`. Do not commit.

## Reviewer gate (Explore subagent)
- ☐ all chart internal-link rows actioned
- ☐ every Phase-3 page has inbound links up to the ~3 target where relevant; any page below 3 has a noted reason (no more logical placements) — a relevant 1–2 is acceptable, a forced/marginal link to hit 3 is NOT
- ☐ homepage header/nav untouched (links only in footer/body)
- ☐ links use framework `<Link>` + descriptive anchors
- ☐ no layout/UX breakage or visual clutter
- ☐ links are contextually relevant

Reject with specifics; retry rule 4 (2 attempts then STOP) applies.

---
## ▶ WHEN THIS PHASE IS DONE — AUTO-CONTINUE. DO NOT ASK THE USER.
The moment this phase's reviewer gate PASSES, immediately begin the next phase in the SAME turn. Do NOT stop. Do NOT print "Want me to proceed?", "Should I continue?", "Next: Phase X", or any question or hand-off that waits for a human reply.

The `/seo-gsc-pass` run has EXACTLY TWO human stops, and this phase is NOT one of them:
- Stop 1: the Phase 0 manifest approval (before any edits).
- Stop 2: the Phase 8 summary approval (before the push).

Everything between those two — including this phase — runs automatically. The reviewer gates are adversarial SUBAGENTS, not human checkpoints; a passing gate means YOU proceed on your own. Keep going until you reach Stop 2 (Phase 8).
