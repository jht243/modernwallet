# Breadth framework — capture ALL the angles around an entity (both lanes)

**Shared by the trend lane (Phase 2) and the coverage lane (Phase 1b).** When a trend or an uncovered query centers on a nameable **entity** — a product, company, service, tool, AI model, compound/peptide/supplement, protocol, place, etc. — do NOT ship a single narrow page. Expand the entity into the full **angle cluster** so we capture every distinct traffic intent around it, the way a real topic authority would. One winning query is a signal that the *whole topic* has demand, not just that one phrase.

> This is a target, never a quota. Every angle below is still gated by fit, information sufficiency, dedup, winner-protection, and the 25-new-pages-per-run TOTAL cap that mindmap applies in Phase 4c (one shared budget across all lanes). **A relevant omission always beats a forced page.**

## Step 1 — Is there an entity to expand?
- **Yes, a discrete entity** (a named product/company/service/model/compound/tool) → build the angle cluster below.
- **A broad concept or how-to** (not a discrete product — e.g. "how to reduce inflammation", "ai governance") → there's no vs/pricing to build; instead expand into an **explainer hub + sub-topic spokes + FAQ**, and stop. Don't force commercial angles onto a non-commercial topic.

## Step 2 — The angle cluster (attempt in this priority order)
Rank matters: the cap fills from the top, so the highest-intent angles win the run. Use the site's existing slug shapes for each — copy a built sibling, never invent a new URL pattern.

1. **Deep-dive / explainer** — "what is X", the anchor hub page. Almost always first.
2. **Comparison** — "X vs <top real counterpart>", one per major genuine alternative (not every trivial one).
3. **Alternatives** — "X alternatives" / "best alternatives to X".
4. **Pricing / cost** — "X pricing", "how much does X cost", "X cost".
5. **Is it worth it / review / verdict** — "is X worth it", "X review", "X results".
6. **How to use / getting started** — "how to use X" (software), "how to take / dose X" (health), "X setup".
7. **Use-cases / for-[audience]** — "X for <the site's real verticals/audiences>".
8. **Safety / risk lens** — health: "X side effects", "is X safe", "X risks"; software: "is X secure / compliant", "is X HIPAA compliant". Only where the entity type warrants it.
9. **Evidence / outcomes** — "X benchmarks", "X studies", "X before and after", "does X work".
10. **Roundup membership** — include X in relevant objective "best [category]" roundups (objective — the business is never a ranked option; follow the existing `src/data/roundups*.ts` page shape).

### Entity-type presets (which angles usually fit)
- **Software / AI model / tool / SaaS / company / service** → 1,2,3,4,5,6,7,8(compliance/security),9,10. (A free/open-source tool has no pricing page — skip 4.)
- **Health compound / peptide / supplement / protocol / treatment** → 1,2,3,5,6(how-to-take/dosage),8(side-effects/safety),9(studies/results),10; pricing/where-to-buy only if the site normally covers it and it's compliant. **Follow the site's medical/controlled-substance guardrails** — never give dosing or medical advice the site standard forbids, never fabricate a study or a dose.
- **Concept / topic / how-to** → explainer hub + spokes + FAQ only (Step 1 "broad concept" path).

## Step 3 — The fit gate (HARD — this is what stops thin/forced pages)
Attempt an angle ONLY when ALL of these hold; otherwise SKIP it and record "angle skipped — <reason>" for the digest (never pad a page to hit the framework):
1. **Type fit** — the angle genuinely applies to this entity type (no "vs" for a concept, no "pricing" for a free tool, no "side effects" for a SaaS).
2. **Information sufficiency** — there is enough real, verifiable material to write a substantive page. If you'd have to invent a price, spec, dose, benchmark, or comparison point to fill it, the angle FAILS the gate. Copy real numbers from the vendor's/primary source; if they don't exist, drop the angle.
3. **Not already covered** — passes the Phase 4 local pre-filter (slug inventory / git / ledger). An angle whose page already exists is not a finding.

(Winner protection and keyword validation are mindmap's job in Phase 4c — not applied here.)

## Step 4 — Feed the research pack
Every surviving angle becomes a **finding** tagged with its lane (`trend` or `coverage`) and angle, ordered by the priority order above + sibling evidence. Findings go into the Phase 4 research pack as suggestions; the mindmap engine (Phase 4c) validates demand, applies winner protection and the 25-page-per-run cap, and decides what ships. Lanes A/B use reasoning and local files only — no Autocomplete, SEMrush or other external lookups.

## Anti-patterns (do NOT do)
- Don't fabricate a comparison, price, dose, or benchmark to justify an angle — skip the angle instead.
- Don't build all 10 angles mechanically for an entity that only supports 3 — fit gate first.
- Don't let one entity's cluster crowd out other genuine demand every run; if multiple entities surfaced, interleave by priority/evidence so each gets its anchor page before any gets its long-tail angles.
- Don't rewrite an existing page to "add an angle" — angles are always NEW pages (additive-only guardrail); improving an existing page is `/page-quality-pass` / `/question-gap-pass` work.
