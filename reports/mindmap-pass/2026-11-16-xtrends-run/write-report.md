# Write report: job 2026-11-16-xtrends (actor writer-xtrends, run 63cda5674f544cc781bfe44cf94b8032)

## Result
All 9 approved routes written/edited in one pass. check-write-scope PASS (0 violations). Build OK. Rendered capture of 9 routes OK.
Snapshot: reports/mindmap-pass/2026-11-16-xtrends-run/audit/preview-snapshot.json (sha256 8068bb6351697305d5a1504c38a0aad6b033a1ccf4743eda5d720af7aa1f0ab8)
Capture manifest: reports/mindmap-pass/2026-11-16-xtrends-run/audit/capture-manifest.json

## Models actually used (content_gen.py)
Configured primary claude-opus-5-5 was unusable (both Anthropic keys rejected: credit balance too low). Every call fell back to gpt-6-sol (fallback_used: true in each .meta.json). gemini-3.8-flash was not needed.
- A1 /guides/retirement-contribution-limits-2027: gpt-6-sol (write; 2,404 words; claim check ran on gpt-6-sol)
- A6 /guides/google-wallet-gemini-bank-connection: gpt-6-sol (write; 2,958 words)
- A5 /budget/aca-subsidy-calculator/: gpt-6-sol (section; 758 words incl. generator extras, one section spliced)
INTRO HUMANIZE skipped: pages came end-to-end from content_gen.py (exempt per _content-standard.md).

## Files touched
- src/data/guides.ts: A1 and A6 new entries at top of GUIDES; A2 (401k 2026 guide) and A3 (IRA 2026 guide) one link paragraph each. Link-only dates preserved.
- src/data/benefits-spokes.ts: A5 new first section "What to Do if Your ACA Premium Jumped", 3 sources added (KFF x2, HealthCare.gov dates), updated 2026-11-04 to 2026-11-16.
- src/data/comparisons.ts: A4 link sentence in the TSP FAQ answer.
- src/data/roundups.ts: A7 link paragraph in best-budgeting-apps intro.
- src/data/spokes-retirement.ts: A8 link sentence in 401k-calculator FAQ.
- src/data/spokes-budget.ts: A9 link sentence in monthly-budget-calculator FAQ.
- reports/mindmap-pass/2026-11-16-xtrends-run/{evidence,prompts,drafts,audit}/ (packets, prompts, drafts, .meta.json beside each draft, calc script and output for A1).
- reports/standards-ledger.jsonl (load receipt), reports/content-gen-usage.jsonl and workflow-generation-budgets (generator bookkeeping). Nothing committed.

## Evidence packets
All three validate PASS (validate-analysis, structural). A1 basis calculated (calc.py, inputs.json, calc-output.json; $37,250 and per-paycheck figures labeled "our calculation"; 27-paycheck counterexample). A5 and A6 basis reported. No testing claims, no TESTED labels, no case or client claims (cases.json had only unrelated Layer3Labs records).

## Deviations and in-context edits (disclosed for the auditor)
1. The runbook's `--system-file/--prompt-file` flag spellings are not accepted by content_gen.py; the contract's `--system/--prompt/--allowed-urls` were used, with the manifest, review and packet flags and `--facts`.
2. prepare-write-packets output had no closed fact list or output contract and carried unrelated x-trends excerpts (including forbidden social-post figures). Prompts were rebuilt data-only with a closed fact list, closed URL list, reviewer guardrails (A6 and A5 and A1 verbatim constraints), provenance and takeaway plan. Originals kept in prompts/orig/. System prompt built with `content_gen.py system` (voice sample = latest published x-trends guide, plus guide JSON contract) plus decision-evidence/testing rules.
3. `content_gen.py fix` refused ("A paid repair needs the actual failed independent review"). Two in-context mechanical edits were applied instead, both non-prose: (a) A1 table row "Roth catch-up wage threshold" was wrongly rewritten by the generator's claim-check to "Not published | $155,000 | Not published"; restored to the generator's own pre-claim-check row ($150,000 | $155,000 | Up $5,000), matching Notice 2026-66 (number correction); (b) deleted two meta-commentary sentences ("deserve attention", "is intentional") in the A1 IRA section.
4. The generator's "Common Questions" section was dropped from A1 and A6 at splice because the guide template renders `faqs` separately; A1 ends its body on the "Our Takeaway for 2027 Elections" next-action sentence. A6 body ends with the Privacy Trade-Offs next-action/verify sentence (does not contain the phrase "Google Wallet in Gemini"; auditor to judge).
5. A5: only the generated section heading and body were spliced (additive). Generator also produced intro, FAQ and metadata JSON for A5; those were NOT applied (not in approved scope).
6. Generator placeholders (empty metaTitle, subtitle, cta fields, faqItems) were not spliced; the repo Guide shape has no such fields.

## Items for the independent auditor (not edited by writer)
- Semicolons: A1 5, A6 7, A5 2 in generated prose (anti-AI punctuation tell check).
- A1 section 1 intro and body both open with the answer (intro and section 1 overlap).
- A1 Roth catch-up block quote uses straight apostrophe (Notice text has a typographic one).
- A6 guardrails honored: no Plaid-deletes-after-unlink claim, read-only limits actions not storage, unanswered retention/Plaid/Connected Apps page disclosed in Privacy Trade-Offs. A6 FAQ "Is it free" says "Plaid says the app pays a fee" (from Plaid page).
- A5: KFF figures dated 2026 vs 2025 and 2027 benchmark; state-exchange caveat present; says cheaper plan does not restore a credit.
- Date bump: A5 only (updated 2026-11-16). New pages updated 2026-11-16. Link-only routes unchanged.
