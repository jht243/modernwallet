# Phase 2 — Coverage-gap matrix (ledger-NEW trends only)

Turn the confirmed trend into concrete missing-page candidates, mechanically.

## 1. Enumerate what exists
```bash
python3 scripts/trend_pass/slug_inventory.py --base-url <BASE_URL> > /tmp/tp-inventory.json
python3 scripts/trend_pass/slug_inventory.py --base-url <BASE_URL> --check <candidate-path-or-slug>
```
Sitemap-based (works on any content system). `--check` exits 1 if TAKEN, 0 if FREE (matches full path OR last segment).

## 2. Build the matrix — capture ALL the angles (breadth framework)
Rows = the trend's entities/topics. Columns = the **breadth framework angle cluster** (`_breadth-framework.md`) expressed in the content-formats this site actually uses (from the sitemap sections). When the trend centers on a discrete entity (product, brand, service, tool, compound…), don't ship one narrow page — capture every traffic angle around it: `deep-dive / explainer` · `comparison (vs)` · `alternatives` · `pricing / cost` · `is-it-worth-it / review` · `how-to-use / guide` · `use-cases / for-<audience>` · `safety / risk lens (per entity type)` · `evidence / results` · `roundup membership` — mapped onto the site's real page types.

Apply the framework's entity-type presets and its **HARD fit gate** (`_breadth-framework.md` Step 3): keep a cell only if the angle genuinely fits the entity type AND there's enough real, groundable information to write a substantive page — a free product gets no `pricing` cell, a concept gets no `vs` cell, and any angle you'd have to invent a fact to fill is dropped, never padded. A broad concept (not a discrete product) expands into an explainer hub + spokes + FAQ only.

Every surviving cell whose slug is FREE is a candidate. Follow the site's existing slug conventions exactly (copy the shape from a built sibling; do not invent a new layout).

## 3. Evidence-rank candidates
Rank by sibling evidence from the Phase 0 pull only (a candidate inherits the clicks of its nearest built sibling in the top-10). No-evidence cells rank last but stay in the list; the cap handles volume.

## Output
Ranked candidate list (`slug · cell · sibling evidence · proposed title`) → Phase 3 → Phase 4.
