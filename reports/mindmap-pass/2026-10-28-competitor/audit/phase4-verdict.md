# Phase 4 verdict, 2026-10-28 competitor run (independent reviewer: phase4-reviewer)

Startup: `workflow-start.sh --cloud` exit 0 at origin/main 7617515. Audit bundle: `reports/mindmap-pass/2026-10-28-competitor-run/preflight-audit-reviewer`, 28/28 parts read, `check` = delivery-complete-sources-current.
Audited bytes: dist HTML sha256 equals `rendered-snapshot.json` htmlSha256 for both routes and equals what 127.0.0.1:4331 serves. Draft JSON equals the `src/data/guides.ts` entries.

average-retirement-savings-by-age: FIX-IN-PLACE (10 MUST-FIX)
student-loan-deferment: FIX-IN-PLACE (9 MUST-FIX)

Neither page may be committed, pushed, indexed or recorded as deployed until the fixes are applied and the edited page is re-audited in full and the rendered snapshot is recaptured (a changed fingerprint voids `rendered-review.json`).

## Per-gate summary (P = pass, F = fail)

| Gate | Retirement | Student loan |
|---|---|---|
| Load receipt (ledger 2026-10-28 mindmap-pass, hashes 0e00ec2e / ed445917 / 1969dcd5 match disk) | P | P |
| Mechanical (title, description, Title Case, 0 dashes, markdown only) | P | P |
| Depth (floor 1,200): 1,846 / 1,983 words | P | P |
| Register, page type, medium | P | P |
| Reader question answered in intro + section 1 | P | P |
| Tee-up and opening sentence | F (M6) | P (wording S7) |
| Experience truth, no testing claims (section G excludes financial services) | P | P |
| Visible attribution: calculation, not test, method beside finding | P | P |
| Source traceability and regulatory accuracy | F (M1 inflation, M2 date, M3) | F (S1, S2, S3, S6) |
| Takeaway agrees with answer, tables, FAQ; conditions kept | F (M3, M4) | F (S4) |
| Who this is not for / what would change our answer | F on alternative for 65+ (M9); change-condition P | P |
| Links gate, allowed URL list | P | F (S5) |
| Anti-AI single-instance bans | F (M7, M8) | F (S7, S8) |
| Sentence rhythm (10-run one band, 5 within 3 words) | P | P |
| Evidence packet counterexample | F (M10) | F (S9) |
| Dates and JSON-LD | P | P |
| Disclaimer at bottom, no neutrality claim in body | P | P |
| Layout (structural) | P | P |

## Highest-impact MUST-FIX

1. Retirement M1: the page says three times that the Federal Reserve dollar figures and percent changes carry "no inflation adjustment". The Federal Reserve report states all dollar amounts are restated to 2025 dollars (scf26.pdf p.2 note 4, Appendix A). The reader is told the opposite of the source.
2. Retirement M2: "released on October 9, 2026" is not in the source for the report (it says October 2026); the 9th is the date of companion FEDS Notes. Use "published in October 2026".
3. Retirement M3/M4: by-age "average is above the typical saver" is asserted in four places while the page says by-age medians are unpublished; the closing step claims the calculator compares to age averages, which it does not.
4. Student loan S1/S2/S3: "you owe no principal" (only installments are waived); economic hardship has four qualifying routes, not three (FFEL or Perkins prior deferment omitted); unemployment length cell hides the six-month-per-request limit and the look-back.
5. Student loan S4: the borrower who "cannot make payments right now" is told to "keep paying" with no resolution. 34 CFR 685.205(b)(9) gives up to 60 days of processing forbearance. Needs one added sourced fact.
6. Student loan S5: unlinked "U.S. Department of Education" and "Peace Corps" first mentions (the claim checker removed the link instead of keeping a name link). Needs two URLs added to allowed-urls.txt after confirming they resolve (I could not reach either site).

## Remediation route

All items are Rung 1 (quote plus replacement is in each findings file). Items needing a closed-fact-list addition before `content_gen.py fix`: Retirement M1 (2025-dollars statement, scf26.pdf p.2 and Appendix A), Student S2 (685.204(g)(2)(i)), S3 ((f)(4)), S4 (685.205(b)(9)). Packet-only edits (no re-render): evidence.json counterexamples (M10, S9). Per the ladder, `fix` rounds do not count against the two-rework limit; re-audit the full fixed page each time.

## Rendered audit

`audit/rendered-review.json` is written with reviewer phase4-reviewer (differs from manifest author main-agent), `snapshotSha256` = c4cf8d6c505faff50ae86525745f7982e4ffe75f35d56474d7791434c1e04983 (the canonical digest stored inside `rendered-snapshot.json`, which is what `rendered-audit.py check` compares) and `snapshotFileSha256` = 0c94099a353b5bce52d5da525b309529e9453a2e30de491c14a40a9c555e7726 (raw file sha256). Both routes carry verdict FAIL with fingerprints copied from the snapshot (a4a2627e... and fd524ebd...). `rendered-audit.py check` is expected to reject this review by design. Layout evidence is structural (CSS and markup); no device screenshot was taken.

## Open items outside the two routes (not scored against them)

- `src/data/cross-links.ts` adds inbound links to both new pages (student-loan-wage-garnishment-calculator and the "retirement" cross-link list) and `src/data/calculators.ts` bumps `updated` on the net-worth and student-loan-garnishment calculators to 2026-10-28. Those rendered routes are not in `rendered-manifest.json`. `_rendered-page-audit.md` requires every affected route to be captured and reviewed. The net-worth date bump has no visible content change in the diff and needs a date-churn check.
- Site-wide template footer on every page: "For educational purposes — not financial advice." (em-dash) and "This never affects our rankings or editorial coverage." (self-asserted neutrality). Inherited, not introduced by this run; record for the human.
- Generator `meta.guards.flags` ("missing subtitle/cta/faqItems", "emptied by the claim check") are stale: the Guide record has no such fields and every listed section is populated in the final drafts. The real claim-checker artifacts are the retirement orphan pair (M5) and the removed Department of Education link (S5).
