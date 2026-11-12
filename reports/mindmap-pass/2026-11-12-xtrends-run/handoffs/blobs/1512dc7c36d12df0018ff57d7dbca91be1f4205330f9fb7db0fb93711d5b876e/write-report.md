# Write report, job xtrends-2026-11-12 (actor mindmap-write, runId 0761ec0aa2274b288aa32b3041c09138)

Not an audit. No PASS is claimed. Nothing committed or pushed.

## Preflight
- `workflow-preflight.py prepare --phase write` (phase-2, phase-3, phase-5, phase-6 instructions), 32/32 parts delivered, `check` returned `delivery-complete-sources-current`. Context id `mindmap-write-xtrends`, epoch 1.
- `load-standards.sh ... --ledger-only` appended the receipt to `reports/standards-ledger.jsonl` (cs=944c2d85 aa=ed96c1f4 exp=1969dcd5).
- `mindmap-gates.py validate-chart` and `validate-analysis` both returned PASS (structural).

## Writer model (actual)
- Configured chain: claude-opus-5-5 -> gemini-3.8-flash -> gpt-6-sol. Both Claude keys failed with HTTP 400 "credit balance is too low" (preflight and write).
- Actual writer: **gemini-3.8-flash (FALLBACK, `fallback_used: true` in meta)**. Claim-check passes also ran on gemini-3.8-flash. One full generation, no regeneration. Cost about $0.135 total.
- Draft: `drafts/dol-pbm-fee-disclosure-rule.json` plus `.meta.json` (commit the meta). 3074 words, floor 1200.

## Findings resolved (binding)
- CR-A1: Section "What the Research Says About Costs" and the Takeaway state both directions: the Department's expectation of lower plan and participant out-of-pocket costs, its sentence that the rule "could have a bigger impact than CBO's estimates", CBO 0.1 to 1.0 percent, S. 1339 labelled a different bill, Scanlon 2024 (plan costs +3.5 percent, participant out-of-pocket -1 percent; 9.4 percent decline in monopoly markets), and the Fiore 2025 no-reduction result. Facts 11 to 15a in the closed fact list came from the saved FR text (lines 8795-8985, 9250-9265, 9448-9465 of `fr-2026-22306-text.txt`).
- CR-A2: Section "Which Employer Plans the Rule Covers" states paragraph (b), both exclusions, (m)(6) and (m)(7), and the table rows carry the qualifier. The generator also wrote "applies only to large self-insured group health plans" in one FAQ answer, with the exclusions listed after it.
- CR-A3: Not a content change. The shared `Byline.astro` prints "Reviewed against primary sources" on this page (confirmed in the capture manifest `requiredText`). TESTED format is off, no testing claim, no howWeTested. The audit must verify that line against the saved FR text and record `testingAndAttribution` as a real PASS, not NA.

## Candidate defects I noticed for the auditor (not fixed, no audit budget used)
1. "mid-2027 or 2028" first-disclosure timing in the intro and Takeaway is an inference not on the fact list (disclosure is due before a contract is entered, extended or renewed, which can precede July 1, 2027).
2. "an employee paying 20 percent coinsurance" in "How Disclosure Could Reach Copays Indirectly" is an illustrative number not on the fact list.
3. FAQ "What is spread pricing?" says "The rule does not explicitly define spread pricing"; check against the FR text.
4. "smaller self-insured plans sponsored by businesses with fewer than 100 employees" simplifies the (m)(6)/(m)(7) tests.
5. Generator flags: `numbers_not_in_facts: ['1974']` (the ERISA name's year); a flag "emptied by the claim check" listing five section headings although the rendered sections carry text; four claim-check fixes applied in pass 1 and four deletions in pass 2 (see meta.guards.claim_check).

## Mechanical edits made at templating (Rung 0, not prose generation)
- Running-prose casing "dol pbm fee disclosure rule" to "DOL PBM fee disclosure rule" (intro sentence 1, Takeaway).
- `title` set to the approved brief's planned title "What the DOL PBM Fee Disclosure Rule Means for Workers" (54 characters; the generator's title was 48 characters).
- Added `updated: "2026-11-12"`, `tools: []`, and five `sources` (all on the closed URL list).

## Files modified or created
- `src/data/guides.ts`: new entry at the top of `GUIDES` (route `/guides/dol-pbm-fee-disclosure-rule/`), plus one link-only paragraph at the end of the Part D guide section "How to Compare and Switch Before December 7" (no `updated` bump, Part D `updated` stays 2026-11-02).
- `reports/mindmap-pass/2026-11-12-xtrends-run/prompts/` (system.md, contract.guide.md, voice.guide.json, dol-pbm-fee-disclosure-rule.prompt.md, allowed-urls.txt)
- `reports/mindmap-pass/2026-11-12-xtrends-run/drafts/dol-pbm-fee-disclosure-rule.json`, `.json.meta.json`, `.json.precheck`, `.templated.json`
- `reports/mindmap-pass/2026-11-12-xtrends-run/evidence/dol-pbm-fee-disclosure-rule/evidence.json` and `growth.json`
- `reports/mindmap-pass/2026-11-12-xtrends-run/audit/capture-manifest.json`, `preview-snapshot-v2.json` (+ `preview-snapshot-v2/` HTML)
- `reports/standards-ledger.jsonl`, `reports/content-gen-usage.jsonl`, `reports/workflow-generation-budgets/*` (tool-written)

## Rendered capture
- `npm ci` was run once (no `node_modules`); Node v22.23.4. `capture-local --build` captured 2 routes: the new guide and the Part D guide (link-only touch).
- First attempt used a bad `forbiddenText` entry of mine ("dol pbm fee", case-insensitive match against the correct "DOL PBM fee"); it wrote `audit/preview-snapshot.json` (sha256 a4612499...b3fe) with a mechanical failure and, because outputs are immutable, the corrected capture went to **`audit/preview-snapshot-v2.json`**. Use v2; ignore `preview-snapshot.json`.
- v2: `snapshotSha256` = `1ec1fd2ac561180e1a7f42a719cac094057e2df167843d2de8d72b730dc0a299`, no mechanical failures on either route, `expectedUpdatedDate` 2026-11-12 (new) and 2026-11-02 (Part D) both met.
- No `content_lint` script exists in this repo; I ran a manual scan (no em dashes, no "we/our", no "honest", no raw HTML, no semicolons, no "Reviewed by"/"Last updated" in body).
