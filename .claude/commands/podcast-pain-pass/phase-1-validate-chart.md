# Phase 1 — VALIDATE + BUILD CHART (podcast brief as input) + AUTO-APPROVE

Input: `$RUN/brief.md` from Phase 0. This phase EXPANDS the brief (Autocomplete + SEMRUSH expansion), then NARROWS it (SEMRUSH validation floor + adversarial dedup), and emits the standard chart the execution phase consumes. There is NO human manifest gate — deterministic auto-approval replaces it.

## API key + budget discipline
- `$SEMRUSH_API_KEY` required. Reuse the `semrush_csv()` helper in `scripts/podcast_pain_pass/validate_terms.py` — never reinvent, never hardcode the key, never fabricate volume.
- **Be economical:** one expansion pull per seed (`phrase_related` / `phrase_questions`, `display_limit` ≤ 20), one batched validation of the filtered shortlist (`phrase_these` + `phrase_kdi` accept `;`-joined lists). Prefer the free Autocomplete miner for breadth; spend SEMRUSH credits only where a real metric is needed. Cache all intermediate CSV/JSON under `$RUN/`.

## ► THREE MANDATORY LENSES — ALL RUN ON EVERY PASS

### Lens 1 — Direct intent (what the podcasts literally surfaced)
Run the baseline validator over the mined (vertical, theme) pairs:
```bash
SEMRUSH_API_KEY="$SEMRUSH_API_KEY" python3 scripts/podcast_pain_pass/validate_terms.py --run "$RUN" --floor 70
```
This validates the per-theme money-query seed phrases (volume + KD) → `$RUN/validated_terms.json`. These are the direct-intent candidates.

### Lens 2 — Adjacent-demand discovery (CORE TENET — never skip)
The brief is a seed, not a ceiling. For each of the top seeds (highest-volume validated terms + the brief's strongest uncovered seeds; keep the set tight — ≤ 10 seeds):
1. **Autocomplete miner (free, real Google data; bundled in-repo):**
```bash
python3 .claude/tools/autocomplete-paa/autocomplete.py --seed "<seed>" --mode all \
  --csv "$RUN/autocomplete.<seed-slug>.csv"
```
2. **SEMRUSH expansion:** `phrase_questions` (and `phrase_related` for the 2–3 biggest seeds) per seed, `display_limit` ≤ 20.
3. **Cluster the merged pool** by shared intent/entity/modifier — money modifiers ("with bad credit", "for a family of 4", "in retirement", "after taxes"), format signals ("vs", "alternatives", "calculator", "worth it", "how much", "template", "checklist"), question shapes ("how much do I need for X", "should I X or Y", "is X worth it"). A cluster = ≥2 related phrases sharing a theme, or a single phrase with a distinct modifier the site has no dedicated answer for.
4. **Keep emerging/under-served clusters only** — real demand (volume or repeated autocomplete completions) with no existing dedicated page. Batch-validate the cluster representatives on `phrase_these` + `phrase_kdi`. A phrase with no tool volume but repeated live completions may stay, labeled `no tool volume — autocomplete evidence`.

**A pass that returns only the literal Lens-1 terms, with no adjacent clusters, has FAILED this lens.**

### Lens 3 — Comparison / Alternatives / Worth-it (CORE TENET — run on every pass)
For every concrete entity the brief names or implies (a product, institution, account type, or category leader — from the episodes AND from the strongest Lens-2 clusters):
- Mine `{entity} vs`, `{entity} alternatives`, `{entity} worth it`, `{entity} calculator` via the Autocomplete miner first (surfaces the REAL rivals/phrasings — never invent matchups), then validate the survivors on SEMRUSH (`phrase_these` + `phrase_kdi`; `phrase_organic` on the strongest to read who owns the SERP).
- **X-vs-Y intent** → a real `ComparisonEntry` record in `src/data/comparisons.ts` (route `/compare/<slug>/`). **`best {category}` / roundup intent** → a real `RoundupEntry` record in `src/data/roundups.ts` (route `/roundup/<slug>/`). Worth-it / how-much intent → a `Guide` (route `/guides/<slug>/`) or, if the query signals a personalized number and a matching calculator already exists, an internal link to that calculator instead of a new page.
- **Roundup blend (self-contained):** for a `best {category}` term, expand it into angle variants for the term's audience — `best` / `most trusted` / `most affordable` / `easiest` / `best for {segment}` (e.g. "best budgeting apps for beginners"). **Add a variant ONLY if it clears the same demand validation these terms already passed** (re-check volume the same way — never add an unvalidated angle) AND survives the duplicate-suppression gate. All variants still count against the 30-survivor circuit-breaker. Every roundup is written NEUTRALLY (see objectivity rule below).
- **Objectivity (finance is YMYL):** comparison + roundup pages are NEUTRAL. **ModernWallet is NEVER a ranked option** — the business is a calculator/education site, not a product in the field. Every option must be real; never fabricate prices or rates (cite the vendor/regulator or label `pricing not public`). Cite primary sources (CFPB, Fed/FRED, IRS, FTC, SEC, Experian, BLS).

## Decide the lever per row/cluster (first match wins)
1. No existing page is a reasonable home → `create new content` (`/guides/<slug>/` for guides; `/compare/<a>-vs-<b>/` for head-to-head; `/roundup/best-<slug>/` for roundup intent; hub = the term's category route, e.g. `/mortgage/`, `/retirement/`, `/debt/`, `/investing/`).
2. An existing page is the right home but misses the angle → `update existing body text` (additive only).
3. Covered in body AND ranking, but title/meta miss the framing → `update existing metadata`.
4. Two pages partly serve it → flag `consolidate / canonicalize` (advisory only).

For every `create new content` row, pick the BEST FORMAT from the query signals — `guide` (article), `comparison`, `roundup`, or `calculator/tool`. A `calculator/tool` row is NOT built as page prose here — ModernWallet calculators live in `src/lib/*` + `src/components/*`; write a one-page asset spec at `reports/podcast-pain-pass/specs/<slug>-spec.md` (route, inputs→outputs, keywords, dependencies) and let a human build the tool in a follow-up. Only `guide`, `comparison`, and `roundup` are shipped end-to-end by Phase 2.

## Resolve the hub route (do this before the chart is final)
`validate_terms.py` emits a best-guess `hub` (e.g. `/mortgage/`). Confirm the ACTUAL live category route exists (grep `src/pages/[category]`, `src/data/`, and the sitemap-generating config). If the guessed hub route doesn't exist, map to the nearest real category hub, or the site root as a last resort. Record the resolved hub on the row.

## Output — the standard chart
Write `$RUN/chart.md` with frontmatter (`source: podcast transcripts (podcast-pain-pass), SEMRUSH-validated`, `interpreted_brief: <from Phase 0>`, `status: ready-for-execution`), then the main action table — columns: `problem` (lens + cluster evidence: member phrases, volume/KD, why unowned + the podcast pain hook + vertical) | `solution` | `bucket` (canonical wording) | `target` (exact route) | `format` (`guide`/`comparison`/`roundup`/`calculator-spec`) | `resolved_hub` — then a `## Emerging search patterns (clusters)` block (every actionable cluster also appears in the main table; if none: `No emerging clusters detected this run.`), then the exclusions paragraph.

## Duplicate-suppression gate (adversarial reviewer — BEFORE the chart is final)
Spawn ONE read-only Explore subagent that did NOT build the chart. It independently checks every row against: `src/data/guides.ts`, `src/data/guides-business.ts`, `src/data/comparisons.ts`, `src/data/comparisons-business.ts`, `src/data/roundups.ts`, `src/data/roundups-business.ts` (grep the `slug:` values), the built routes under `src/pages/`, the generated sitemap (`@astrojs/sitemap` output in `dist/`, or the route list), recent `git log`, and `reports/podcast-pain-pass/ledger.json` `shipped_slugs`. Verdicts: `KEEP` / `DROP — covered by <route or SHA>` / `RECLASSIFY — <bucket>`. Cluster rows get two extra checks: member phrases must be real (SEMRUSH/autocomplete evidence, not invented) and the lever must be right. Apply verdicts; max 2 rework attempts. DROP → record in the ledger as covered; never re-litigate. This gate is what makes the routine self-limiting: most weeks, the mined pains are already covered and nearly everything drops.

## Deferred backlog — drain it FIRST (prevents stranded approved rows)
Before finalizing this run's approved set, load `reports/podcast-pain-pass/ledger.json` `deferred_rows` (approved-but-unbuilt rows carried over from a prior run that hit the Phase-2 build cap). For each, re-run ONLY the duplicate-suppression check (it may have shipped/been covered since). Surviving deferred rows join this run's approved set with **priority** — Phase 2 builds them BEFORE newly-mined rows. Drop any deferred row now covered (remove from `deferred_rows`).

## Deterministic AUTO-APPROVE (replaces the human manifest gate)
- **0 surviving rows →** send `no-changes` email, STOP.
- **> 30 survivors →** CIRCUIT-BREAKER. Do NOT ship. Save the chart, send a `failure`/hold email ("abnormal candidate volume — manual review"), STOP.
- **1–30 survivors →** auto-approve ALL. Proceed to Phase 2 with `$RUN/chart.md`.
