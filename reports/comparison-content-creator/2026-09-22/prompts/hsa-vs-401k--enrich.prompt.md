# ENRICHMENT — hsa-vs-401k

Target page: src/data/guides.ts, slug "tax-free-retirement-account"
route: /guides/tax-free-retirement-account/
Task: add ONE new section to the existing `sections` array — a focused head-to-head
"HSA vs 401(k)" sub-section with a comparison table and a short verdict, covering the
real question readers of this page have: once you've captured the employer match, should
extra savings go to the HSA or to the 401(k) next? The page already ranks the HSA #1 and
explains the funding order in prose ("Our Funding Order for a Tax Free Retirement Account"),
but has no direct side-by-side table comparing HSA vs a standard/traditional 401(k) beyond
the match. Add that missing head-to-head treatment as its own section, positioned to read
naturally right after "The HSA Is the Only Triple Tax Free Account" section.

register: operator
page type: explainer / spoke (this is an ADDITION to an existing explainer page, not a new page)

## THE CLOSED FACT LIST — every number/claim this addition may state

- A traditional 401(k) contribution is deducted from taxable income now; growth is tax-deferred;
  the entire withdrawal in retirement (contributions and growth) is taxed as ordinary income.
  This is already explained elsewhere on the page for the Roth 401(k) contrast.
- An HSA (health savings account) is triple tax-advantaged: the contribution is deductible now,
  growth is untaxed, and a withdrawal for a qualified medical expense is untaxed — already
  stated on this page in the "HSA Is the Only Triple Tax Free Account" section.
- For 2026, the 401(k) employee deferral limit is $24,500 (already stated on this page).
- For 2026, HSA contribution limits are $4,400 for self-only coverage and $8,750 for family
  coverage (already stated on this page), and require a qualifying high-deductible health plan.
- Traditional 401(k) withdrawals are subject to required minimum distributions (RMDs) once the
  account owner reaches the IRS's RMD age — do not state a specific age, the page does not give
  one; say only "once you reach the IRS's required withdrawal age."
- An HSA has no contribution match from most employers (unlike a 401(k), where an employer match
  is common) — do NOT state a specific match percentage beyond the 50% example already used
  elsewhere on the page for the funding-order section; if you need an example, reuse that one
  rather than inventing a new percentage.
- Do NOT invent a new dollar limit, match percentage, or RMD age beyond what is listed above or
  already stated elsewhere on the page.

## THE CLOSED URL LIST — no new external links needed for this addition (internal links only)

## Internal links to use (real routes only)

- [401(k) calculator](/retirement/401k-calculator/) if useful (only if it exists in this site's routes — otherwise omit)
- [HSA vs FSA comparison](/compare/hsa-vs-fsa/) (already used earlier on the page; fine to reuse)

## The page's CURRENT text (for voice-matching and to avoid repeating what's already said)

See attached --page file: the full "tax-free-retirement-account" guide entry.

## Output

ONE new section: a `## ` heading "HSA vs 401(k): Where Extra Money Should Go After the Match"
(Title Case, no colon-drama), followed by 2-3 short paragraphs that:
1. State plainly that the employer match still comes first no matter which of these two you
   favor after that (do not repeat the whole funding-order explanation, just the one-line
   pointer).
2. Add a comparison table (markdown GFM pipe table) with at least 4 rows: tax treatment on the
   way in and out, contribution limit, employer match availability, and required minimum
   distributions.
3. Close with a one- or two-sentence verdict: after the match, the HSA generally comes next for
   anyone eligible (deduction going in AND no tax on qualified withdrawals, versus the 401(k)'s
   deduction now but taxed later), but someone who has already maxed the smaller HSA limit or
   is not on a high-deductible health plan should keep filling the 401(k).
Do not restate the existing "Our Funding Order" section's exact wording. Do not add a new FAQ entry.
