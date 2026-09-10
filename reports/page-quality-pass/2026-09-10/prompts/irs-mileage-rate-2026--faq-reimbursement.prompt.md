# Section task — irs-mileage-rate-2026 (page-quality-pass enrichment)

**Route:** /mileage-deduction/irs-mileage-rate-2026/
**Page type:** vertical-spoke (calculator-powered guide)
**Diagnosis:** THIN_UNDERDELIVERY (28-day GA4: avg engagement 35.3s, bounce 67.6% — both weak
vs this page's archetype). Existing sections already score well (specific numbers, formula,
worked example); the gap is a documented missing sub-intent, not a rewrite of what's there.

**Evidence for this sub-intent:** Google Autocomplete around "irs mileage rate 2026" /
"2026 mileage rate" surfaces real, repeated queries about mileage REIMBURSEMENT (e.g. "2026
mileage rate for employees", "mileage reimbursement 2026"). The page's existing FAQ "Can
employees deduct mileage in 2026?" only says employees generally can't deduct UNREIMBURSED
mileage — it never explains how REIMBURSED mileage is actually taxed, which is the real
question behind those queries.

**Task:** Add ONE new FAQ entry (question + answer, NO `##` heading — this is a single FAQ
item, not a section) that answers: "Is my mileage reimbursement from my employer taxable?" /
how accountable-plan reimbursement works for W-2 employees in 2026. Cover: reimbursement at or
below the IRS rate under an accountable plan is not taxable wages; the three accountable-plan
conditions (business connection, substantiation, returning excess); reimbursement ABOVE the
IRS rate has the excess taxed as wages; a non-accountable plan makes the WHOLE reimbursement
taxable. Do not contradict the existing "Can employees deduct mileage in 2026?" FAQ (unreimbursed
employee mileage is still generally non-deductible) — this new FAQ is about the reimbursement
side, a distinct question.

Use ONLY the facts in the attached closed fact list. Use ONLY the URL in the allowed-urls list
if you cite a source (it is already cited elsewhere on this page — you do not need to
re-introduce it as a "first mention", just link naturally if useful).

Match the page's existing FAQ voice and length (see the page's current FAQs in the attached
page text — direct, specific, 2-4 sentences, no filler).

Output format: a single FAQ item as:
**Q: <question>**
<answer prose, no heading>
