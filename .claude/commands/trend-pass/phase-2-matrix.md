# Phase 2 — Coverage-gap matrix (ledger-NEW trends only)

Turn the confirmed trend into concrete missing-page candidates, mechanically.

## 1. Enumerate what exists
```bash
python3 scripts/trend_pass/slug_inventory.py --base-url <BASE_URL> > /tmp/tp-inventory.json
python3 scripts/trend_pass/slug_inventory.py --base-url <BASE_URL> --check <candidate-path-or-slug>
```
Sitemap-based (works on any content system). `--check` exits 1 if TAKEN, 0 if FREE (matches full path OR last segment).

## 2. Build the matrix
Rows = the trend's entities/topics. Columns = the content-formats this site actually uses (from the sitemap sections, e.g. review / roundup / guide / comparison / how-to). Every empty cell whose slug is FREE is a candidate. Follow the site's existing slug conventions exactly (copy the shape from a built sibling; do not invent a new layout).

## 3. Evidence-rank candidates
Rank by sibling evidence from the Phase 0 pull only (a candidate inherits the clicks of its nearest built sibling in the top-10). No-evidence cells rank last but stay in the list; the cap handles volume.

## Output
Ranked candidate list (`slug · cell · sibling evidence · proposed title`) → Phase 3 → Phase 4.
