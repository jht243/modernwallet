# Section task — merchant-cash-advance-vs-revenue-based-financing (indexing-pass Phase 4, Mode A)

**Route:** /compare/merchant-cash-advance-vs-revenue-based-financing/
**Page type:** comparison
**Diagnosis:** Google GSC coverage state "Crawled – currently not indexed" — the page was
crawled and Google declined to index it. The page already has a real intro, comparison table,
verdict, 4 sections, and 5 FAQs, so the gap is not raw length; it is information gain relative
to the many similar "financing-product X vs Y" comparison pages on this site. It is missing a
concrete worked numeric example — every existing section stays at the level of naming the rate
ranges, never showing what the two ranges actually mean in dollars on the same principal.

**Task:** Add ONE new FAQ entry (question + answer, NO `##` heading — this is a single FAQ
item, not a section) that answers: "How much would $50,000 actually cost under an MCA vs
RBF, at each end of the typical rate range?" Walk through the low-end and high-end worked
numbers from the attached closed fact list, and state the non-obvious implication: the two
products land close together at the cheap end of their ranges, but diverge sharply at the
expensive end. Do not imply RBF is always pricier — the existing "cheaper" FAQ on this page
already says the ranges overlap; this new FAQ must not contradict it, only add the concrete
math the existing FAQs describe only in words.

Use ONLY the facts in the attached closed fact list. This addition cites no external URL — do
not introduce one.

Match the page's existing FAQ voice and length (see the page's current FAQs in the attached
page text — direct, specific, 3-5 sentences, concrete numbers, no filler, no rhetorical-question
opener).

Output format: a single FAQ item as:
**Q: <question>**
<answer prose, no heading>

# CORRECTIONS FROM THE PHASE 4 AUDIT

**Defect:** the previous draft fabricated numbers nowhere in the closed fact list — a 1.15
factor rate, a 1.35x and 1.45 factor rate, $57,500/$67,500/$72,500/$22,500/$17,500 totals, and
a "5 to 9 months" / "12 to 24 months" repayment-timeline claim. None of these appear in the
closed fact list attached to this prompt.

**Replacing rule:** use ONLY the exact worked numbers in the closed fact list — the low-end
example ($50,000 MCA at 1.10 factor rate = $55,000 total / $5,000 fee; $50,000 RBF at 1.3x cap
= $65,000 total / $15,000 fee) and the high-end example ($50,000 MCA at 1.50 factor rate =
$75,000 total / $25,000 fee; $50,000 RBF at 3x cap = $150,000 total / $100,000 fee). Do not
invent any other factor rate, multiple, dollar figure, or repayment timeline. Do not add a
repayment-timeline claim (months to repay) — it is not in the fact list.
