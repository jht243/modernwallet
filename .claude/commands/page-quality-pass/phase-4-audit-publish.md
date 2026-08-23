# Phase 4 — Audit, then publish (nothing ships unaudited)

Two review stages on EVERY change, then ledgers → commit → deploy → verify → IndexNow → email. A change that fails review is reverted and logged DROPPED; a partial batch still ships.

## 1. Adversarial audit (Stage 4)
Run `.claude/commands/seo-gsc-pass/phase-4-audit.md` **if present** (else an equivalent inline adversarial review: a reviewer that did not write the content tries to find thin/wrong/duplicate/AI-sounding prose and rejects on any hit) against every rewritten section, appended section, tool's on-page copy, and metadata rewrite. Remember the hard fails: unlinked first mention of an entity not covered by the auto-link registry; byline in body; filler openers.

## 2. Regression check (specific to REWRITES — this pass's extra duty)
The adversarial audit catches bad new prose; this check catches **good prose that lost something**. Per rewritten section, diff old vs new and verify:
- **No information regression:** every verifiable fact in the OLD section either survives, is corrected (brief-verified), or was itself unverifiable (dropping it is then correct — note it).
- **The section now delivers its heading's promise** (would score 2 on the Phase 2 rubric).
- **No collateral damage:** page-level diff shows NO change outside the prescribed sections/links/tool/metadata — heading set, section order, CTA placement, FAQ block all intact.
- **Internal links that lived in the old prose survive** (or moved to a better anchor in the same section).

Tools additionally pass a logic check (`downloadable-asset-pass/phase-4-audit.md` if present, else verify correct outputs on 3+ sample inputs, edge cases included, no console errors).

**Fail → one retry** (rewrite the rewrite against the auditor's objections). Fail again → `git checkout` that page's files (revert ONLY that page), log DROPPED ("failed audit"/"regression"), continue.

## 3. Ledger writes (before the commit, so they ship in it)
- `reports/page-quality-pass/page-quality-audits.md` — one row per treated page WITH its pre-edit metrics (the feedback loop's baseline):
  `| route | treated | window | sessions | avg_eng_s | eng_rate | bounce | scrolled_pct | diagnosis | actions | audit |`
- `reports/trend-pass/ledger.md` (SHARED) — one row per action: KEPT / DROPPED (+reason), tagged `source: page-quality`.
- Run report `reports/page-quality-pass/<YYYY-MM-DD>.md` — engagement table, diagnosis roster, prescriptions with dispositions, improvement report.

## 4. Stale-base check → commit → deploy (concurrent-cron clobber hazard)
Radar crons commit to main mid-session. Stage by explicit path only, then:
```bash
git fetch origin && git status
git diff --cached HEAD --numstat   # NO deletions you didn't make
```
Any staged deletion of an untouched file = stale base — fix before committing. Single commit:
`page-quality-pass <date>: R section rewrites, A appends, L link-adds, T tools, M metadata across P treated pages`
Deploy per the launcher's Git model: `git fetch origin main && git rebase origin/main && git push origin HEAD:main` (main is the authorized nightly deploy path; 3 rebased retries, then push the ephemeral branch + email a manual-merge note; never force-push).

## 5. Verify 200s + IndexNow
After the deploy settles, `curl -s -o /dev/null -w "%{http_code}"` every treated URL — an edited page that no longer 200s is a **rollback** (revert that page, re-push), not a skip. Then submit changed URLs to IndexNow (fallback-key block in the launcher). Non-200 on something this run didn't touch → digest + skip from IndexNow, don't roll back the run.

## 6. Digest
Assemble `/tmp/page-quality-pass-<YYYY-MM-DD>.md` per the launcher's exact headings (diagnoses & treatments, per-type sections, improvement report, skipped, ledger deltas, audit, IndexNow) and send via `.claude/scripts/send-routine-email.py --skill page-quality-pass-auto`. Voice standard applies. Always send — success, no-changes, or failure.


## Feb 2026 Core Update — originality + anti-AI-filler gate (MANDATORY — workflow-wide, added 2026-07-31)

Google's February 2026 core update (Discover-focused) demoted sites mass-producing unedited ChatGPT content and rewarded pages carrying **proprietary data** — first-hand numbers, real client cases, and a defensible point of view. This gate enforces that on every net-new or materially-rewritten **article/prose** page. (Spec-only rows, pure technical/indexability fixes, and non-prose asset specs are exempt — this applies to reader-facing prose.)

**GATE 1 — Reads like unedited ChatGPT → HARD FAIL (objective, no exemption).** Load `.claude/commands/_anti-ai-language.md` and apply its **AUDITOR** section in full — that file is the single source of truth for the tell list and the fail line. Set fail with note `chatgpt-tells: [list which]`; the fix is a targeted rewrite of the offending sentences, never a full-page rewrite. If the file is missing, FAIL the run and report it; never substitute your own list.

**GATE 2 — No proprietary anchor → FAIL unless the reviewer earns an exemption (high bar).**
Default assumption: **this page needs at least one proprietary anchor.** An anchor is something a generic LLM could not have produced:
- A real **client observation** from the roster (see the writer standard / `seo-content-guidelines` roster), phrased with explicit grounded attribution (e.g. "In our engagement with [Client], we observed…", "From the [Client] rollout, the failure mode was…").
- A real **routine-work observation** from our own automation portfolio (e.g. "When we run our GA4 top-pages routine across dozens of sites in our portfolio, the pattern is…").
- Another genuine first-hand element: an original number/benchmark we actually produced, an original artifact/screenshot, a non-obvious operational tradeoff we've hit, or a defensible contrarian POV with reasoning.

Procedure:
1. Read the page topic. Ask: does any client on the roster, or any routine in our portfolio, have **honest topical overlap** with this page?
2. If yes and the page carries no such anchor → **HARD FAIL**, note `no-proprietary-anchor: [which client/routine fit was available and skipped]`. Hand back to the writer to weave one in (using the grounded attribution templates, max 2 client references, never invented).
3. If a client/routine anchor genuinely does not fit, check for any other first-hand anchor (own number, artifact, tradeoff, defensible POV). If one is present → PASS.
4. Only if **none** of the above honestly applies may the page ship without an anchor — and the reviewer MUST record a one-sentence justification: `anchor-exempt: [why no client, no routine, and no first-hand angle honestly fit this topic]`. A boilerplate or generic exemption sentence is itself a fail — the exemption must be specific to this page's topic. Silent absence of an anchor (no anchor and no exemption sentence) is always a fail.

**Never fabricate to satisfy Gate 2.** A forced, off-topic client mention (e.g. an HOA reference shoehorned into an AI-model launch page) is an EQUAL defect to having no anchor — fail it as `forced-anchor: [detail]`. The bar is "honest topical fit," not "mention a client somewhere."

**This UPGRADES the "Low Information Gain" advisory note elsewhere in this file from advisory to HARD FAIL** for article/prose rows: a section that reads like conventional wisdom with no original example, case-specific insight, or non-obvious implication now blocks publication rather than merely being recorded.
