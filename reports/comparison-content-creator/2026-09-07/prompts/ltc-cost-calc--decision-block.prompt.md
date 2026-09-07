# SECTION TASK — long-term-care-cost-calculator--decision-block

target page: /elder-care/long-term-care-cost-calculator/
target file: src/data/spokes-elder-care.ts (entry slug "long-term-care-cost-calculator")
target field: `howItWorks` (a single plain-text field; the page renders it by splitting on blank
lines into `<p>` tags — there is NO real H2/H3 markup and NO HTML table support on this field,
only plain paragraphs with `[text](/url/)` markdown links). This addition covers TWO related
enrichment work-items at once (assisted-living-vs-nursing-home, and in-home-care-vs-assisted-living),
combined into one three-way decision block, since the page's own content structure makes a single
shared sub-section the cleanest fit.

TASK — OMIT the `## ` markdown heading this command normally emits (say so because this field has
no heading markup). Instead write ONE new paragraph-led sub-section to append to the end of
`howItWorks`: open with a single short, declarative topic-sentence paragraph that names all three
options (matching this site's own established convention on a sibling spoke page: a plain
declarative line such as "First-Party vs. Third-Party Special Needs Trust" functions as the
sub-section's heading, rendered as an ordinary paragraph, not a special heading in a markdown table).
Follow it with 2-4 more paragraphs that:
1. State each of the three cost figures side by side in prose (since there is no table field to
   put them in) — nursing home, assisted living, home health aide — with their annual AND
   unit-cost (day/month/hour) figures.
2. Give the real fit criteria for each: what level of need points to which setting (medical/skilled
   need vs. custodial supervision vs. a caregiver already in the home), not just the price.
3. Close with a one-to-two sentence verdict: state plainly which setting to default to at which
   need level and budget, and what would change that answer.

Do not repeat the existing FAQ content verbatim; add new value (the side-by-side framing and the
verdict are what's missing, not the individual figures, which are already stated elsewhere on the
page).

## THE CLOSED FACT LIST — every number this addition may state

(All already published on this exact page — see the attached page text. Reuse these numbers
exactly; do not restate a different number.)

- Nursing home (private room), 2026 US median: $132,000/year, which works out to about $361/day.
- Assisted living, 2026 US median: $68,000/year, about $5,668/month.
- Home health aide (44 hours/week), 2026 US median: $76,000/year, about $33/hour.
- These are Genworth 2024 Cost of Care Survey national medians, projected forward to 2026 at
  4.5% annual inflation (LTC's historical inflation rate).
- State cost varies enormously: Alaska runs about 2.19x the national median; Mississippi and
  Louisiana run about 0.71x.
- Medicare does not cover assisted living or a long-term home health aide at all, and covers a
  nursing home Skilled Nursing Facility stay only up to 100 days, only after a qualifying 3-night
  hospital admission (days 1-20 fully covered, days 21-100 carry a copay, day 101 onward $0
  Medicare coverage).
- Medicaid can pay for assisted living or home care in states with Home and Community-Based
  Services (HCBS) waivers; eligibility and waitlists vary by state. Medicaid pays for nursing home
  care after spend-down.
- General, well-known fit criteria (not specific to a source, general elder-care planning
  knowledge): a nursing home fits ongoing medical/skilled nursing need or supervision a family
  cannot provide at home; assisted living fits help with daily activities (bathing, dressing,
  medication management) for someone who does not need round-the-clock skilled nursing; home
  health aide / in-home care fits someone who wants to stay in their own home and has a safe home
  environment and, often, a family caregiver already coordinating care.

Anything not on this list, you do not know. Never invent a new dollar figure, a new state factor,
or a specific insurance benefit amount not already given above.

## THE CLOSED URL LIST

No new external links required for this addition — do not add a new external URL. If a link is
genuinely useful, use ONLY:
- https://www.genworth.com (Genworth Cost of Care Survey, already cited on this page)
- https://www.medicaid.gov (already cited on this page)

## Internal links available (optional — use at most 1, only if it fits naturally)

- [Medicare Advantage vs. Medigap](/compare/medicare-advantage-vs-medigap/) — already linked once in this page's introText; do not re-link it here unless the sentence is genuinely new context.

## Register / voice

register: operator (same as the rest of this page — "we" framing already used elsewhere on this site's elder-care spokes)
page type: explainer / spoke (enrichment addition to an existing spoke page)
