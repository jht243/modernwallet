---
description: AUTONOMOUS compliance-alert engine — the /compliance/ vertical's cron. Discovers new laws/rules that impose real obligations on businesses (Federal Register final rules + OpenStates enacted state laws), precision-verifies each against the primary source, dedups, auto-approves with deterministic rules (cap 5), writes /compliance/ explainer pages via guided-write + adversarial audit, publishes + IndexNow, emails a Resend digest. NO human gates. Same flow as the lawfareclaims tracker cron. Designed for scheduled cloud runs.
argument-hint: "(no arguments — fully autonomous)"
---

# /compliance-alert-pass-auto — scheduled new-law → compliance-page → lead engine

> **‼️ RUN-WIDE RULE.** Fully autonomous, NO human checkpoint anywhere. Never ask a question at any phase boundary. On any hard blocker, still finish by sending an email report and exiting 0.

**The question this engine asks:** *"What new law now forces businesses to file, register, disclose, pay, or change something — and is there a page explaining it that captures the business's request for professional help?"* Sibling of the lawfareclaims tracker cron (`lfc-tracker-fetch` → analyze → pages → leads), rebuilt on this repo's static data-driven architecture.

## Architecture facts (this repo)
- **Vertical:** `/compliance/` — pillar at `src/pages/compliance/index.astro`, spokes from `src/pages/compliance/[slug].astro`, data in `src/data/compliance-alerts.ts` (typed `ComplianceAlert` in `src/data/types.ts`).
- **Anti-orphan invariants (hard):** every entry has non-empty `relatedSlugs`; the pillar grid renders every non-draft entry; header/footer link `/compliance/` sitewide. An entry with empty `relatedSlugs` is a build-blocking defect.
- **Lead capture:** `ComplianceLeadForm.astro` → `PUBLIC_COMPLIANCE_LEAD_ENDPOINT` (Supabase Edge Function `compliance-lead`, project `weaponization-fund`) → `compliance_leads` table. Do not touch.
- **Ingestion:** `scripts/compliance_pass/fetch.py` (Federal Register keyless + OpenStates via `OPENSTATES_API_KEY`) and `scripts/compliance_pass/classify.py` (deterministic, metadata-driven scored gate: federal = CFR title + agency tier + action sub-type + significance; state = OpenStates subject tags; plus keyword evidence. HIGH-RECALL — NOT the final judgment; ~90% of raw items are dropped here for free so Phase 1 only spends tokens on the survivors).
- **Idea database (dedup source of truth):** Supabase table `compliance_ideas` (project weaponization-fund), reached via `scripts/compliance_pass/ideas_db.py` (publishable key only — no secret needed). Every candidate ever processed (shipped/rejected/flagged) is recorded there; new candidates are deduped against it by exact citation AND pg_trgm title similarity, so the same-or-very-similar law is never produced twice. `reports/compliance-pass/ledger.md` is now just an optional human-readable mirror — the DB is authoritative.
- **Enacted-only:** federal lane pulls `type=RULE` (final rules only, never proposed); state lane keeps a bill only if its OpenStates action timeline shows enactment (executive-signature/became-law) AND no veto/failure/withdrawal. Pending or dead laws never reach the pipeline.

## Cloud pre-flight (FIRST) — any failure → email failure, exit 0, no commit
1. Working tree clean for this engine's pathspecs; never touch other engines' dirty files.
2. Branch committable (cloud `claude/*` branch expected); "push" = `git fetch origin main && git rebase origin/main && git push origin HEAD:main` (deploys straight to main — intended, no approval needed).
3. `OPENSTATES_API_KEY` best-effort: absent → run the federal lane only and note it in the digest (NOT a failure).
4. Resend secrets best-effort: absent → do the work, print the report, skip email only.

## Execution — phases in order

### Phase 0 — Fetch + gate (deterministic, cheap)
```bash
D=$(date +%F)
python3 scripts/compliance_pass/fetch.py --days 7 --out reports/compliance-pass/$D.raw.json
python3 scripts/compliance_pass/classify.py reports/compliance-pass/$D.raw.json --out reports/compliance-pass/$D.candidates.json
```
Zero candidates → digest (`No candidates this window`), exit 0 (SUCCESS).

### Phase 1 — Precision verification (the make-or-break)
For each candidate (descending `score`), fetch its `url` (WebFetch) and decide **KEEP / KILL** on the strict test: *does this create an affirmative duty on private businesses?* KILL anything that is: government-internal admin, a repeal/deregulation with no new duty, single-company/site-specific (variances, individual approvals), procedural (comment-period extensions, corrections, delays), or so narrow no one will search for it. For each KEEP, extract from the primary source: `whoMustComply` (with thresholds), `actionRequired`, `effectiveDate` / `deadline`, `penalty`, `agency`, `citation` + `citationUrl` (must load), category (controlled vocab in `types.ts`), and `recommendedProfessionals` (attorney/cpa/consultant/tech — who a business would actually hire). Every KILL gets a ledger row with a one-line reason.

### Phase 2 — Dedup against the idea database (before any writing spend)
Run `python3 scripts/compliance_pass/ideas_db.py check reports/compliance-pass/$D.candidates.json --out reports/compliance-pass/$D.deduped.json`. This drops candidates that exact-citation-match OR trigram-title-match a previously processed idea (and de-dupes within the batch). ONLY the `candidates` in the deduped output proceed — this happens BEFORE the expensive Phase-1 verification so no tokens are spent re-judging a law already produced. Also sanity-grep `src/data/compliance-alerts.ts` for the law's name as a backstop. A factual UPDATE to a shipped alert (deadline moved, court ruling) is allowed — edit that entry in place instead of creating a sibling.

### Phase 3 — Auto-approval (deterministic — replaces any human gate)
A candidate is auto-APPROVED iff **all** hold; otherwise dropped with a ledger row and listed in the digest under "Flagged for the human":
1. Phase-1 KEPT it **and** every obligation fact (who/action/deadline/penalty) was grounded in the primary source — no gaps, no guesses.
2. `citationUrl` and every `sources` URL return HTTP 200 (browser UA; a WebFetch success also counts — some state sites 403 curl).
3. Dedup-clean per Phase 2.
4. The obligation plausibly affects **a broad class of businesses** (not one named company/site). When unsure → flag, don't build.
5. Cap: max **5** approvals/run, highest `score` first; overflow flagged, never queued.

### Phase 4 — Write (guided-write, per approved candidate)
Append one `ComplianceAlert` entry per approval to `src/data/compliance-alerts.ts`, following `CONTENT.md` Step 1: facts from primary sources only (re-verify against `citationUrl` — never write from the candidate JSON alone); title ≤60, meta ≤160; intro opens self-contained (AEO); ≥1 information-gain insight; ~8th-grade readability; 3–5 FAQs; `sources` = primary sources that load. **Set `relatedSlugs` to the nearest live siblings (category, then jurisdiction) — never empty — and add the new slug into 1–2 siblings' `relatedSlugs` (links mutual-ish, not one-way).**

### Phase 5 — Adversarial audit (different judgment, built HTML)
`npm run build`, then audit `dist/compliance/<slug>/index.html` per `CONTENT.md` Step 2. HARD checks (block ship): title/meta lengths + keyword present; every JSON-LD block parses; visible byline; all internal links resolve in `dist/`; every fact (deadline, penalty, threshold) matches the primary source; **no-orphan grep** — pillar links the new slug ≥1×, new page links `/compliance/` ≥1×. Max 2 reworks, then drop the page (ledger: `REJECTED (failed audit)`).

### Phase 6 — Publish + record every processed idea
Commit **by pathspec only** (`src/data/compliance-alerts.ts`, `reports/compliance-pass/*`): `compliance-alert-pass <date>: <n> new alerts (<slugs>)`. Push per pre-flight rule. Post-deploy: curl each new URL + `/compliance/` for HTTP 200 (retry ~2 min for deploy lag), then IndexNow (key file `public/dc557f6bfced447aa1a71771d8a0d24a.txt`) with the pillar + every new URL, per `keyword-gap-pass/phase-7-sitemap-indexnow.md`.
**Record to the idea DB (critical for dedup):** build a JSON of EVERY idea this run touched — `shipped` (with slug + target_keyword), `rejected` (Phase-1 kills + failed audits, with reason), `flagged` (auto-approval misses) — and run `python3 scripts/compliance_pass/ideas_db.py record <ideas.json>`. If it isn't recorded, the next run will re-judge it and waste tokens.

### Phase 7 — Email digest (ALWAYS produced)
Write `/tmp/compliance-alert-pass-auto-<YYYY-MM-DD>.md` with EXACT headings (each present, "None this run" if empty), then send via Resend like every fleet digest:
`## Candidates (fetched → gated → verified)` · `## Pages shipped (N)` (title → live URL) · `## Flagged for the human (N)` (failed auto-approval, with the rule number) · `## Rejected (N)` (kill reasons) · `## Audit` · `## IndexNow` · `## Blocker`.

## Hard guardrails
1. **Additive only** — never rewrite an existing alert except a factual UPDATE (Phase 2).
2. **YMYL** — legal content: never invent deadlines, penalties, thresholds, or citations; a fact that can't be grounded in the primary source kills the candidate. Every page renders the attorney byline + `LegalDisclaimer` (the template does this — don't remove).
3. **Cap 5/run**; killed/duplicate/overflow candidates always get a ledger row so they're never re-judged.
4. **No-orphan invariants** are build-blocking.
5. **No external LLM APIs** — all judgment happens in this session/subagents.
