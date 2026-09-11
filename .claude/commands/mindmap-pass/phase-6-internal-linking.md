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

The `/mindmap-pass` run has EXACTLY ONE human stop (the Phase 0 manifest approval), and this phase is NOT it:
- Stop 1: the Phase 0 manifest approval (before any edits).
- (Phase 8 is an informational summary that auto-continues to the Phase 9 push — NOT a stop.)

Everything between those two — including this phase — runs automatically. The reviewer gates are adversarial SUBAGENTS, not human checkpoints; a passing gate means YOU proceed on your own. Keep going through Phase 8 and the Phase 9 push without stopping.


## Updated-page date-bump rule (MANDATORY — workflow-wide, added 2026-07-12)

**Editors (any step that changes what an EXISTING page renders — metadata/title, body or enrich sections, FAQs, internal links, embedded tools, thin-content rework, link fixes):** every existing page you update MUST have its "last updated" date bumped to the run date **in the SAME change** — the content edit and the date bump ship together, never separately. Discover how THIS project surfaces the date (record it as a Phase 0 project fact) and bump the field the template ACTUALLY renders:
- **DB-backed pages** (e.g. ban_the_bots: `landing_pages.last_generated_at` renders both the visible "Last updated" byline and JSON-LD `dateModified`; `blog_posts.updated_at` for posts): any script/SQL that edits content columns MUST also set the date column to now (e.g. `page.last_generated_at = datetime.utcnow()`). Never ship an enrichment/edit script that touches content but not the date column.
- **File-backed pages**: bump the frontmatter/date field the template renders (`last_updated`, `updated`, `dateModified`, …) and re-render if the project pre-renders static HTML.

Also refresh every surface derived from that date: JSON-LD `dateModified`, and the sitemap `<lastmod>` when the generator does not derive it from the same field. **New pages created this run are exempt** (their date fields already default to now). **Purely non-rendering technical fixes are exempt** (robots.txt, redirects, canonical tags, sitemap-only hygiene) — do NOT bump dates for those.

**Auditors / reviewer gates (adversarial review):** for EVERY existing page this run edited, verify the rendered "Last updated" date (and JSON-LD `dateModified`) now equals the run date. A stale date on an updated page is a **HARD FAIL** — the page does not pass until the date is bumped. The fix is a one-field update; never rewrite the page. Conversely, a bumped date on a page whose rendered content did NOT change is also a fail (date churn fakes freshness) — revert it.
